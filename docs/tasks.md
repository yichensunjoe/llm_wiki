# 任务清单（P083-llm-wiki-upstream）

## 当前焦点

- [x] **T1 定位双链剥离例程**（2026-09-23 完成）：机制已定位（watcher 把 wiki 页面移动当删除 → `cleanupDeletedWikiPages` 级联剥离），修复已实现（移动守卫，分支 `fix/wiki-move-cascade-guard`，`1daf641`），测试 19/19 + 全仓 1881 通过；报告见 `docs/diagnosis-wikilink-strip.md`。
- [ ] **T1 后续**：构建安装版做真实行为验证；用户确认后考虑上游 PR。
- [ ] **T2 侧栏文件夹分组评估**：确认 `knowledge-tree.tsx` 0.6.11 现状，给出「按顶层文件夹分组」改造方案（分组维度、UI、与 type 分组切换）。

##  backlog

- [ ] 安装依赖并跑通 `npm run test` 基线（Node + Rust 就绪后）。
- [ ] 如需向用户交付修复：独立分支 + 本地构建验证 + 用户确认后再考虑上游 PR。

## 已完成

- [x] 2026-09-23 上游克隆（v0.6.11）+ reasonix 治理文件 + 首次提交（`cccacd9`）。
