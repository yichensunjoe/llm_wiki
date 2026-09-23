# AGENTS.md — P083-llm-wiki-upstream

本目录是上游开源项目 **LLM Wiki**（https://github.com/nashsu/llm_wiki ）的本地克隆，v0.6.11（与 `/Applications/LLM Wiki.app` 安装版同版本）。用途：作为客户端行为诊断与后续修改的**源码真本**；不替代用户自己的分叉（P026-dttn-msre-wiki，0.6.0 旧版分叉）。

## 开工前必读

1. 本文件与项目 `HANDOFF.md`、`REUSE_AND_PITFALL_LOG.md`。
2. 工作区根 `/Users/joe/ai/reasonix/AGENTS.md` 的安全、质量与交付要求优先于本文件。

## 项目级约束

1. `main` 分支跟踪上游 `origin/main`；任何本地修改（诊断补丁、功能开发）开独立分支进行，禁止直接改 `main` 后推上游。
2. 本目录源码是**上游原始实现**，修改前先确认安装版行为与源码一致（安装版可能含未发布改动）。
3. 与 MSRE 知识库（`/Users/joe/msre wiki`）联动的问题（双链剥离、侧栏分组、图谱边数）在本项目复现时，结论双写：本项目 `REUSE_AND_PITFALL_LOG.md` 记详细条目，工作区根同名日志同步注明 P083。
4. 构建/运行需 Node + Rust（Tauri）；仅做源码阅读与静态诊断时无需安装依赖。

## 日志与交接

- 重要修复、方案验证或复盘后：先写本项目 `REUSE_AND_PITFALL_LOG.md` 顶部，再同步工作区根日志（注明 P083）。
- 项目 `HANDOFF.md` 保留完整近期轮次（顶部最新，每条 ≤8 行）；工作区根 `HANDOFF.md` 仅留本项目一行动态，覆盖式更新。
