# HANDOFF — P083-llm-wiki-upstream

> 本项目状态与下一步的事实源。每次会话先读；更新规则见 `AGENTS.md`。

## 当前状态（2026-09-23）

- 已完成：T1 完成——双链剥离机制源码级定位（`docs/diagnosis-wikilink-strip.md`），修复已合并 fork `main`（`1daf641` 移动守卫，测试 19/19 + 全仓 1881 通过）；已 fork 到 `yichensunjoe/llm_wiki` 并重构远端（origin=fork / upstream=原始仓库）；版本提升 v0.6.12 并推送 `main` + 标签。CI 验证（dispatch run 35826311680）暴露并修复了两个问题：① 空 `APPLE_CERTIFICATE` secrets 被 tauri CLI 当成已配置证书 → macOS 打包在 `security import` 失败，修复为仅当 secret 存在才注入 `APPLE_*` env（`def0ed0`）；② fork 新建后 tag push 不触发 Actions → 重启 Actions 开关（disable→enable）后恢复。v0.6.12 标签重推已触发正式 Release 构建（run 35832165080，四平台）。
- 进行中：等 run 35832165080 完成，验证 GitHub Release「LLM Wiki v0.6.12」四平台产物齐全（macOS 为未签名 .dmg，因 fork 无 Apple 签名 secrets）。
- 下一步：用户下载 fork Release 的 macOS 版替换 `/Applications/LLM Wiki.app`（替换前退出应用；wiki 数据在项目目录 `.llm-wiki/`，替换无损）；以后修改直接推 fork `main`，发版打 `v*` 标签自动构建 Release；T2 侧栏文件夹分组（六大类）评估待启动。
- 关键决策或阻塞：用户决策——不再依赖上游合并，长期在自有 fork 开发并 release 自有版本；用户自有旧分叉 P026（0.6.0）保留不动。macOS 产物未签名，首次打开需右键「打开」或在系统设置放行。

## 近期轮次（最新在上，保留全部）

- 2026-09-23：完成了上游克隆与治理初始化；下一步安装依赖并静态定位 wikilink 剥离例程。
