# HANDOFF — P083-llm-wiki-upstream

> 本项目状态与下一步的事实源。每次会话先读；更新规则见 `AGENTS.md`。

## 当前状态（2026-09-23）

- 已完成：T1 完成——双链剥离机制源码级定位（`docs/diagnosis-wikilink-strip.md`），修复已合并 fork `main`（`1daf641` 移动守卫，测试 19/19 + 全仓 1881 通过）；已 fork 到 `yichensunjoe/llm_wiki` 并重构远端（origin=fork / upstream=原始仓库）；版本提升 v0.6.12 并推送 `main` + 标签；手动触发 build.yml 构建验证（run 35826311680）。
- 进行中：等 CI 构建完成后重推标签触发正式 GitHub Release；文档已同步远端与版本线约定。
- 下一步：确认 macOS 构建产物后重推 `v0.6.12` 标签触发 Release；T2 侧栏文件夹分组评估待启动。
- 关键决策或阻塞：用户决策——不再依赖上游合并，长期在自有 fork 开发并 release 自有版本；用户自有旧分叉 P026（0.6.0）保留不动。fork 新建后 tag push 未自动触发 Actions（dispatch 可用），Release 需重推标签。

## 近期轮次（最新在上，保留全部）

- 2026-09-23：完成了上游克隆与治理初始化；下一步安装依赖并静态定位 wikilink 剥离例程。
