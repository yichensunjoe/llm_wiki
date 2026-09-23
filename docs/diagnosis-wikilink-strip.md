# 诊断报告：安装版 v0.6.11 批量剥离 wiki `[[双链]]` 机制（T1）

> 日期：2026-09-23 ｜ 分支：`fix/wiki-move-cascade-guard`（修复已提交 `1daf641`）｜ 状态：**机制已完全定位并修复，修复经 19/19 目标测试 + 1881 全仓测试验证**

## 一、事故现象

MSRE 知识库（`/Users/joe/msre wiki`）将 7 个引擎目录 `git mv` 迁入 `wiki/01-文献/` 后，LLM Wiki.app 运行时：

- 1467 个页面正文 `[[wikilink]]` 被剥成裸文本（`[[msr-navigation-hub]]` → `msr-navigation-hub`）；
- frontmatter `related:` 数组被截断为仅剩根页面可解析项（如 `["index"]`）；
- 知识关系图边数从约 1.4 万条塌缩至 23 条（边完全来自正文 `[[...]]`，`wiki-graph.ts`）。

## 二、根因链（源码级，全部核实到行）

1. **文件监视**：`src/lib/project-file-sync.ts` 的 watcher 以 250ms 去抖批量处理文件变更（`processFileChangeBatch`，L170-186）。
2. **移动检测只对 raw sources**：`migrateUnchangedSourceMoves`（L188-231）用内容哈希匹配「删除+创建」对，但 L196 的 `isRawSourcePathForCascade(task.path)` 守卫把 wiki 页面排除在外——**wiki 页面的移动不会被识别为移动**。
3. **移动被当成删除**：`git mv` 后旧路径消失，~1445 个 wiki .md 的 deleted 任务进入 `cleanupDeletedFiles`（L283），其中 `isWikiPageForCascade`（L324）只豁免 index/log/overview 与 media。
4. **级联清理**：`cleanupDeletedWikiPages`（`src/lib/source-lifecycle.ts` L557-610）把这些「被删页面」的 stem 作为 deletedKeys，然后**重写全库所有页面**：
   - `stripDeletedWikilinks`（`wiki-cleanup.ts` L123）：`[[deleted]]` → `deleted`、`[[deleted|display]]` → `display`——与观察到的正文变换逐字吻合；
   - `related:` 过滤（source-lifecycle L599-606）：指向「被删页面」的条目全部删除——related 截断的机制。
5. **为何只有根页面幸存**：`isWikiPageForCascade` 豁免了 index/log/overview，它们不进入 deletedKeys，指向它们的链接与 related 条目得以保留。

## 三、最小复现路径

1. 用 LLM Wiki.app 打开一个 wiki 项目，等索引完成；
2. 在文件系统中 `git mv wiki/concepts/a.md wiki/01-文献/concepts/a.md`（或任何跨目录移动 wiki 页面）；
3. watcher 产生 deleted(wiki/concepts/a.md) + created(新路径) 任务；
4. 移动检测跳过（非 raw source）→ cleanupDeletedWikiPages 以 a 为 deletedKey 重写全部页面：`[[a]]` → `a`、related 中的 `a` 被移除。

批量迁移时步骤 3 的 deletedKeys 有上千个，即发生全库级剥离。

## 四、修复（已实现，分支 `fix/wiki-move-cascade-guard`）

**守卫原则**：wikilink 按页面名解析——只要同名页面还存在，指向它的引用就仍然有效，级联剥离就是数据破坏。

`cleanupDeletedFiles` 调用级联前新增 `collectSurvivingWikiPageKeys`：

- 列举当前 wiki 树全部 .md 的页面名（`normalizeWikiRefKey` 规范化形式）；
- 被删路径的页面名仍存在 → 判定为**移动**，跳过该路径的级联（打日志 `treating N ... as moves`）；
- 真删除（页面名不再存在）→ 级联照常；
- **列举失败 → 整体跳过级联**（剥离失效引用是可恢复的化妆品操作，剥掉活引用不可逆；非破坏性默认）。

测试（`project-file-sync.test.ts` +2 例，共 19/19 通过）：

- 同名页面在新路径存在 → 移动守卫生效，零写文件，`[[mind]]` 保留；
- 同名页面不存在 → 级联执行，`[[ghost]]`→`ghost`、`related` 过滤为 `["kept"]`。

全仓验证：1881 通过 / 6 失败，6 个失败在未改动基线上同样失败（real-llm 网络测试 + mcp-server 独立依赖），与本修复无关。

## 五、遗留与建议

1. **部署**：修复需构建安装版才能保护用户日常使用的 app；过渡期操作纪律——**大规模移动 wiki 目录期间关闭 LLM Wiki.app**，移动后先重开应用完成重索引再编辑页面。git 是兜底：`grep -rc "\[\[" wiki/overview.md` 骤降即事故信号，`git restore .` 可无损回滚。
2. **上游贡献**：该修复对上游有通用价值（任何用户做目录重组都会触发），可考虑整理 PR（需用户确认）。
3. **相关缺陷（未修）**：`migrateUnchangedSourceMoves` 的哈希移动检测只覆盖 raw sources；为 wiki 页面补哈希移动检测可作为后续增强（本守卫已覆盖其数据安全目标，检测只是减少日志噪音）。
4. **侧栏按文件夹分组（T2）**：知识树分组在 `src/components/layout/knowledge-tree.tsx`（TYPE_CONFIG，按 frontmatter type），与本次修复无关，待单独评估。
