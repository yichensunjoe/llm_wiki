# 架构（P083-llm-wiki-upstream）

## 总体形态

Tauri 桌面应用（Rust 壳 + Webview 前端），单体重型前端：

- `src/`：React + TypeScript + Vite。`lib/` 业务逻辑（图谱 `wiki-graph.ts`、页面解析 `wiki-page-resolver.ts`、ingest、dedup、lint），`components/` UI（`layout/knowledge-tree.tsx` 侧栏知识树、`graph/graph-view.tsx` 图谱视图），`stores/` zustand 状态。
- `src-tauri/`：Rust 命令层（文件系统遍历 `list_directory`、文件读写、受控执行）。
- `mcp-server/`：MCP 协议服务。
- 项目数据：用户知识库目录内 `.llm-wiki/`（快照、lint、review、会话），应用从这里索引与回写。

## 与本项目相关的关键链路（待验证项）

1. **图谱边**：`wiki-graph.ts` 从正文 `[[wikilink]]` 建边，节点 id = 文件名 stem（与路径无关）——安装版边塌缩说明正文被回写；
2. **嫌疑机制**：某启动/同步例程在链接目标不可解析时回写页面剔除失效引用（0.6.11 待定位）；
3. **侧栏分组**：`knowledge-tree.tsx` 按 frontmatter type 分组（TYPE_CONFIG），文件夹分组需新增维度。

## 边界

本项目只读/改上游源码；不承载任何用户知识库数据；MSRE 知识库在 `/Users/joe/msre wiki` 独立维护。
