# HANDOFF — P083-llm-wiki-upstream

> 本项目状态与下一步的事实源。每次会话先读；更新规则见 `AGENTS.md`。

## 当前状态（2026-09-23）

- 已完成（T2 六大类分组）：知识树侧栏改为按顶层分类目录分组——新增纯模块 `src/lib/knowledge-category-group.ts`（路径→分类、排序、分组，11 单测），`knowledge-tree.tsx` 渲染改为「分类 → 类型 → 页面」三层（根目录页面归「总览」组始终最前，默认展开总览+01-文献），i18n `sidebar.categoryLabels.root` 四语种补齐；tsc 0 错误、vitest 1889 全过；版本 0.6.13 四文件提升 + CHANGELOG 补 0.6.12/0.6.13 条目（版本一致性测试要求 CHANGELOG[0]==package.json 版本）；提交 `498d6f4` 推送，tag v0.6.13 自动触发 Release 构建（run 35840950025，tag 触发已恢复）。
- 已完成：T1 完成——双链剥离机制源码级定位（`docs/diagnosis-wikilink-strip.md`），修复已合并 fork `main`（`1daf641` 移动守卫，测试 19/19 + 全仓 1881 通过）；已 fork 到 `yichensunjoe/llm_wiki` 并重构远端（origin=fork / upstream=原始仓库）；版本提升 v0.6.12 并推送 `main` + 标签。CI 验证（dispatch run 35826311680）暴露并修复了两个问题：① 空 `APPLE_CERTIFICATE` secrets 被 tauri CLI 当成已配置证书 → macOS 打包在 `security import` 失败，修复为仅当 secret 存在才注入 `APPLE_*` env（`def0ed0`）；② fork 新建后 tag push 不触发 Actions → 重启 Actions 开关（disable→enable）后恢复。v0.6.12 标签重推已触发正式 Release 构建（run 35832165080，四平台）。
- 已完成（收尾）：run 35832165080 全 5 job 成功，GitHub Release「LLM Wiki v0.6.12」产物齐全（12 资产：macOS dmg+app.tar.gz、Windows msi/setup.exe/portable.zip、Linux x64/arm64 各 deb/rpm/AppImage、浏览器扩展 zip）。注意：Release 对象 `.assets` 数组有读副本滞后，盘点产物用 `/releases/{id}/assets` 子接口。
- 下一步：等 run 35840950025 完成发布 v0.6.13 后，用户下载 macOS dmg 替换 `/Applications/LLM Wiki.app`（0.6.12 安装流程复用；替换前退出应用，`.llm-wiki/` 数据无损）；以后修改直接推 fork `main`，发版打 `v*` 标签自动构建 Release。
- 关键决策或阻塞：用户决策——不再依赖上游合并，长期在自有 fork 开发并 release 自有版本；用户自有旧分叉 P026（0.6.0）保留不动。macOS 产物未签名，首次打开需右键「打开」或在系统设置放行。

## 近期轮次（最新在上，保留全部）

- 2026-09-23：完成了上游克隆与治理初始化；下一步安装依赖并静态定位 wikilink 剥离例程。
