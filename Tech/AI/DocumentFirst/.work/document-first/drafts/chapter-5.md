# 第 5 章：技术栈与工具

---

## 5.1 AI 工具支持度

### 5.1.1 主流 AI 编程工具对比

| 工具 | 类型 | 适用场景 | 文档优先支持度 |
|------|------|----------|----------------|
| **Claude Code** | CLI AI 编程 | 通用开发，文档优先实践 | ⭐⭐⭐⭐⭐ |
| **Cursor** | IDE AI 编程 | 通用开发，快速原型 | ⭐⭐⭐⭐ |
| **Windsurf** | IDE AI 编程 | 全栈开发 | ⭐⭐⭐⭐ |
| **Visual Studio 2026 + Copilot** | IDE AI 编程 | .NET 开发，企业级应用 | ⭐⭐⭐⭐ |
| **CodeBuddy** | AI 编程 | 企业级 Java | ⭐⭐⭐ |
| **OpenSpec** | 规范驱动开发 CLI | Spec 驱动工作流 | ⭐⭐⭐⭐⭐ |

### 5.1.2 Claude Code 在文档优先中的优势

**核心优势：**

| 优势 | 说明 | 文档优先价值 |
|------|------|--------------|
| **CLI 原生** | 终端驱动，无缝嵌入 DevOps 工具链 | 便于脚本化和 CI/CD 集成 |
| **MCP 支持** | 标准化协议访问本地数据库、私有 API | 读取 Spec 文档、写入代码 |
| **Context 管理** | 支持 200K+ 上下文窗口 | 可加载完整项目文档 |
| **Skill 系统** | 支持自定义 Skill 扩展 | project-start、project-migration |
| **权限配置** | 可配置 permissions 减少询问 | 提升自动化程度 |

### 5.1.3 工具选择建议

**按项目类型推荐：**

| 项目类型 | 推荐工具 | 理由 |
|----------|----------|------|
| **新项目从 0 到 1** | Claude Code + project-start | 文档优先系统完整支持 |
| **老项目 AI 化** | Claude Code + project-migration | 逆向文档生成能力 |
| **快速原型** | Cursor | 开箱即用，学习成本低 |
| **企业级 Java** | CodeBuddy | Java 生态深度优化 |
| **.NET 生态** | VS 2026 + Copilot | 微软生态整合好 |

---

## 5.2 MCP 服务配置

### 5.2.1 MCP 协议概述

**MCP（Model Context Protocol）** 是由 Anthropic 公司推动的标准化协议，为 AI 代理提供一套标准的"感官接口"。

**核心能力：**
- 访问本地文件系统
- 访问私有数据库
- 调用第三方 SaaS 服务
- 执行 Shell 命令

### 5.2.2 文档优先中的 MCP 配置

**推荐 MCP 服务：**

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-server-filesystem"],
      "args_override": ["--allowed-locations", "/path/to/project"]
    },
    "git": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-server-git"],
      "args_override": ["--repository", "/path/to/project"]
    }
  }
}
```

**权限配置建议：**

| 服务 | 权限 | 说明 |
|------|------|------|
| **filesystem** | 只读：`docs/`、`src/` | AI 读取文档和代码 |
| **filesystem** | 写入：`docs/specs/`、`src/` | AI 生成文档和代码 |
| **git** | 只读 | AI 读取 Git 历史 |
| **shell** | 受限：允许 `npm test` | AI 执行测试 |

---

## 5.3 Skill 系统设计

### 5.3.1 project-start Skill

**用途：** 新项目初始化，通过无限询问模式建立 `.claude/` 和 `docs/` 目录。

**核心能力：**

| 能力 | 描述 | 状态 |
|------|------|------|
| 新项目初始化 | 通过无限询问模式建立 .claude/ 和 docs/ 目录 | ✅ 支持 |
| 文档优先系统搭建 | 创建 PRD、APP_FLOW、TECH_STACK 等文档 | ✅ 支持 |
| Agent 对话规约 | 定义人类与 AI 的协作方式 | ✅ 支持 |
| 联动检测 | 检测 skill-adapter 等已有 Skill | ✅ 支持 |

**使用方式：**

```
/project-start

→ 选择"新项目"
→ 执行初始化流程
→ 生成 CLAUDE.md + docs/ 目录
```

### 5.3.2 project-migration Skill

**用途：** 为已有代码库的老项目建立文档优先 AI 开发系统。

**核心能力：**

| 能力 | 描述 | 状态 |
|------|------|------|
| 现状分析 | 扫描项目结构、识别技术栈、分析现有文档 | ✅ 支持 |
| 无限询问 | 动态询问项目配置、团队配置、文档偏好 | ✅ 支持 |
| 文档生成 | 生成完整的 `.claude/` 和 `docs/` 文档体系 | ✅ 支持 |
| 多应用支持 | 识别 Monorepo、工作区配置 | ✅ 支持 |

**三阶段流程：**

```
阶段 1：现状分析 → current-status.md
阶段 2：无限询问 → 确认配置
阶段 3：文档生成 → CLAUDE.md + docs/
```

### 5.3.3 research Skill

**用途：** 深度调研任意主题并生成结构化知识文档。

**核心能力：**

| 能力 | 描述 | 状态 |
|------|------|------|
| 知识库重复检测 | 扫描知识库检测相似文档 | ✅ 支持 |
| 位置推荐 | 基于 KB-INDEX 推荐存储位置 | ✅ 支持 |
| 分章节调研 | Pipeline 模式分章节执行 | ✅ 支持 |
| SubAgent 并行 | 大型主题多 Agent 并行调研 | ✅ 支持 |

**使用方式：**

```
/research 调研文档优先系统

→ 阶段 1：需求澄清与重复检测
→ 阶段 2：预调研与位置推荐（用户确认）
→ 阶段 3：分章节调研
→ 阶段 4：整合输出与索引更新
```

---

## 5.4 辅助工具链

### 5.4.1 文档质量工具

| 工具 | 用途 | 集成方式 |
|------|------|----------|
| **markdownlint** | Markdown 格式检查 | CLI / IDE 插件 |
| **prettier** | 代码和文档格式化 | npm 脚本 |
| **alex** | 检测不当用语 | CLI / CI |
| **write-good** | 检查写作质量 | CLI |

### 5.4.2 测试验证工具

| 工具 | 用途 | 集成方式 |
|------|------|----------|
| **Jest** | 单元测试框架 | npm test |
| **Playwright** | E2E 测试框架 | npm run test:e2e |
| **Coverage** | 代码覆盖率 | npm run coverage |

### 5.4.3 变更管理工具

| 工具 | 用途 | 集成方式 |
|------|------|----------|
| **Changesets** | 版本管理 + 变更日志 | npm 包 |
| **Conventional Commits** | 提交信息规范 | Git Hooks |
| **Semantic Release** | 自动版本发布 | CI/CD |

---

*第 5 章完成 | 下一步：第 6 章 迁移策略*
