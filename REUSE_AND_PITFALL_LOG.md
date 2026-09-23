# 复用与踩坑日志（P083-llm-wiki-upstream）

记录 LLM Wiki 客户端源码诊断与修改中的可复用结论。规则见 `AGENTS.md`，具备跨项目价值的结论同步到工作区根同名日志并注明 P083。

## 2026-09-23 · T1 完结：LLM Wiki v0.6.11 双链剥离机制定位与修复（移动守卫）

- 场景：MSRE 知识库 7 个引擎目录 `git mv` 迁入 `wiki/01-文献/` 后，LLM Wiki.app 把 1467 页正文 `[[双链]]` 剥成裸文本、`related:` 截断，图谱边从约 1.4 万塌到 23。
- 结论/做法（v0.6.11 源码全部核实到行，报告见 `docs/diagnosis-wikilink-strip.md`）：
  1) **机制**：`project-file-sync.ts` watcher 把 wiki 页面移动报为 deleted（移动检测 `migrateUnchangedSourceMoves` 被 `isRawSourcePathForCascade` 守卫限定只对 raw sources 生效）→ `cleanupDeletedWikiPages` 以被移动页面的 stem 为 deletedKeys 重写全库：`stripDeletedWikilinks` 剥 `[[x]]`→`x`、`related:` 过滤；index/log/overview 被 `isWikiPageForCascade` 豁免所以只有指向它们的链幸存；
  2) **修复**（分支 `fix/wiki-move-cascade-guard`，`1daf641`）：级联前列举 wiki 树，被删路径页面名仍存在 → 判定移动跳过；列举失败整体跳过（非破坏性默认）；测试 19/19，全仓 1881 通过（6 失败为基线环境性失败）；
  3) **过渡期纪律**：大迁移期间关闭 app；`grep -rc "\[\[" wiki/overview.md` 骤降即事故信号；`git restore .` 无损回滚。
- 踩坑点：把「移动」当「删除」做级联清理是这类自维护知识库软件的典型陷阱——任何按路径监听删除的清理器都必须先排除「同名页面仍存在」的移动场景。
- 适用场景：LLM Wiki 后续修改、类似文件监听型知识库客户端的诊断。

## 2026-09-23 · 建立本项目的两个已知问题（源自 MSRE 知识库事故，待在本源码验证）

- 场景：MSRE 知识库（`/Users/joe/msre wiki`）大规模目录迁移后，安装版 LLM Wiki.app（0.6.11）重启时批量剥离全库 `[[双链]]`（1467 页正文双链剥成裸文本、frontmatter `related:` 截断），图谱边数由上千塌缩为 23；用户另要求侧栏按六大分类（文件夹）分组，而旧版 0.6.0 源码显示知识树按 frontmatter type 分组。
- 结论/做法（初步，待 0.6.11 源码验证）：
  1) 图谱边完全来自正文 `[[wikilink]]`（`wiki-graph.ts` 的 `extractWikilinks` + 按文件名 stem 解析），与文件路径无关——边塌缩说明正文被改写而非渲染问题；
  2) 客户端某启动/同步例程在链接目标不可解析时会回写页面剔除失效引用，这是本次事故的嫌疑机制；
  3) 侧栏知识树分组在 `src/components/layout/knowledge-tree.tsx`（TYPE_CONFIG，按 type 分组），文件夹分组需新增分组维度。
- 踩坑点：安装版版本（0.6.11）高于本地旧源码（0.6.0），诊断必须基于本目录 v0.6.11 源码，旧结论仅作线索。
- 适用场景：LLM Wiki 客户端所有行为诊断与修改。
