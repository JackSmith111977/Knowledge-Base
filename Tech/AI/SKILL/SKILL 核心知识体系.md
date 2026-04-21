# SKILL 核心知识体系

> AI Agent 能力扩展完全指南（v2.0 · 2026 年 4 月更新）
>
> **文档特色：**
> - 每个核心概念包含「概念定义 + 工作原理 + 代码示例 + 常见误区」
> - 覆盖 Skill 架构设计、底层原理、生命周期、MCP 对比、编写规范、工作流模式、安全治理
> - 结合 Claude Code、Google Antigravity、OpenClaw、Cursor 等多平台实战案例
> - 新增 9 章扩展内容：底层原理、生命周期流程、MCP 深度对比、三层协议架构、Agentic 工作流

---

## 目录

1. [Agent Skill 概述](#1-agent-skill-概述)
2. [核心概念辨析](#2-核心概念辨析)
3. [Skill vs MCP 深度对比](#3-skill-vs-mcp-深度对比)
4. [底层原理解析](#4-底层原理解析)
5. [生命周期与工作流程](#5-生命周期与工作流程)
6. [三层协议架构](#6-三层协议架构)
7. [Skill 编写规范](#7-skill-编写规范)
8. [Agentic 工作流模式](#8-agentic-工作流模式)
9. [安全与治理](#9-安全与治理)
10. [跨平台最佳实践](#10-跨平台最佳实践)

---

## 1. Agent Skill 概述

### 1.1 什么是 SKILL

**SKILL（技能）** 是 AI Agent 与外部世界交互的**能力模块**，是将专业知识、工作流程和最佳实践转化为可复用能力的标准化格式。

**核心价值：**

> Teach AI your way of working（教会 AI 按你的方式工作）

**通俗理解：**

```
想象你请了一位私人助理（Agent）：
- 这位助理很聪明，能听懂你的话、分析问题、制定计划
- 但你不会指望他凭空帮你订机票——他需要调用订票系统
- 你也不会指望他直接帮你写代码——他需要打开 IDE

这位助理是 Agent，而订票系统、IDE 这些工具的使用说明，就是 Skill。

Skill 的本质：岗位培训大礼包
- PDF + 流程图 + SOP + 话术模板 + 常用脚本
- 告诉他："当老板让你做这类事情时，就按这个文件夹里的方法来做"
```

### 1.2 为什么需要 SKILL

**LLM（大语言模型）的能力边界：**

```
┌─────────────────────────────────────────────────────────────┐
│                    LLM 核心限制                              │
├─────────────────────────────────────────────────────────────┤
│  1. 信息滞后：知识截止于训练数据，无法获取实时信息           │
│  2. 缺乏执行能力：只能输出文字，无法操作外部系统             │
│  3. 静态知识：内部知识难以动态更新，需要重新训练             │
│  4. 缺乏真正逻辑推理：基于统计规律，非真正逻辑推理           │
└─────────────────────────────────────────────────────────────┘
```

**Skill 解决的问题：**

| 问题 | 传统方式 | Skill 方式 |
|------|----------|------------|
| **知识传递** | 每次重复描述需求 | 一次定义，永久应用 |
| **输出一致性** | 依赖 AI 临场发挥 | 标准化流程，专家级输出 |
| **复杂任务** | 多轮对话逐步指导 | 堆叠 Skills 自动处理 |
| **组织知识沉淀** | 文档散落各处 | 打包为可执行 Skill |

### 1.3 Skill 与其他方案对比

| 方案 | 定义 | 优势 | 局限 |
|------|------|------|------|
| **Prompt** | 一次性指令 | 简单直接 | 每次都要重新教，无法复用 |
| **Fine-tuning** | 模型微调 | 深度集成 | 需要 ML 专家、成本高、绑定单一模型 |
| **RAG** | 检索增强生成 | 适合事实查询 | 对流程知识效果差 |
| **MCP/Tools** | 外部工具/API 接口 | 能调用真实系统 | 只定义"能做什么"，不定义"怎么用" |
| **Skill** | 标准操作流程（SOP） | 包含完整工作流程和最佳实践 | 需要预先定义场景 |

### 1.4 概念定义

#### 1.4.1 Anthropic 官方定义

Anthropic 将 Agent Skills 定义为：

> **Skills are modular capabilities that allow developers to extend Claude Code through structured folders.**
> 每个 Skill 包含一个核心的 `SKILL.md` 文件及相关辅助资源（脚本、参考资料、模板），Agent 根据用户请求自动判断何时调用相应的 Skill。

官方类比：Skill 就像是**给新员工的入职指南**——不是让模型即兴发挥，而是让它按定义好的标准流程工作。

#### 1.4.2 开放标准定义

2025 年 12 月 18 日，Anthropic 将 Agent Skills 发布为**开放标准**（Open Standard），规范托管于 [agentskills.io](https://agentskills.io)，代码托管于 GitHub [agentskills/agentskills](https://github.com/agentskills/agentskills) 仓库。这意味着 Skill 不再限于 Claude 生态，而是成为跨平台通用的能力描述规范。

#### 1.4.3 核心结构

每个 Skill 是一个遵循规范的目录：

```
skill-name/
├── SKILL.md       # 必需：YAML frontmatter + Markdown 指令
├── scripts/       # 可选：可执行代码（Python、Bash 等）
├── references/    # 可选：供 Agent 参考的详细文档
└── assets/        # 可选：模板、图片、数据文件
```

SKILL.md 的核心格式：

```yaml
---
name: code-review
description: 对代码进行深度审查，发现潜在问题和改进建议
---
```

### 1.5 生态发展时间线

```mermaid
timeline
    title Agent Skill 生态发展时间线
    2024-11 : Anthropic 发布 MCP 协议<br>为 Skill 生态奠定连接标准
    2025-04 : Google 发布 A2A 协议<br>定义 Agent 间通信标准
    2025-10-16 : Anthropic 发布 Claude Agent Skills<br>最初仅限 Claude Code Pro 用户
    2025-10-17 : Anthropic 开源示例 Skills<br>GitHub 仓库上线
    2025-12-18 : Anthropic 将 Skills 发布为开放标准<br>agentskills.io 上线，SDK 发布
    2025-12 : Microsoft 在 VS Code / GitHub 集成 Skills
    2025-12 : OpenAI 在 ChatGPT / Codex CLI 采用 Skills 架构
    2026-01 : Cursor、Goose、Amp、Trae 跟进
    2026-01 : Google Antigravity 支持 Skills
    2026-01 : 公开可用 Skills 突破 85,000+
    2026-01 : Anthropic 发布 33 页<br>《Claude 技能构建完整指南》
    2026-02 : 支持平台达 27 家
    2026-02 : OpenClaw / ClawHub 生态爆发<br>13,700+ 社区技能
    2026-02 : skills.sh 上线<br>开放 Skills 发现与安装平台
    2026-04 : ClawHub 中国镜像站上线<br>火山引擎支持
```

### 1.6 生态规模与现状

| 指标 | 数值 | 来源 |
|------|------|------|
| 公开可用 Skills | 85,000+ | agentskills.io 生态 |
| 支持平台数 | 27 家 | skills.sh CLI |
| ClawHub 社区技能 | 13,700+ | ClawHub 平台 |
| MCP SDK 月下载量 | 9,700 万+ | PulseMCP |
| 企业 Agent 采纳率 | 23% 已规模化部署 | 2026 行业报告 |
| 正向 ROI 比例 | 88% | Google Cloud 调研 |

### 1.7 主要平台支持对比

| 平台 | 开发方 | Skill 支持状态 | 分发方式 | 特点 |
|------|--------|---------------|---------|------|
| **Claude Code** | Anthropic | 原生支持（首创者） | 本地目录 + Workspace | 渐进式披露三层加载，最成熟 |
| **VS Code** | Microsoft | 原生集成 | 扩展市场 + 本地目录 | 月活 5000 万开发者，影响面最广 |
| **Google Antigravity** | Google | 支持 | Agent Manager | 原生 Gemini，基于 VS Code 架构 |
| **OpenClaw** | 开源社区 | 原生支持（核心特性） | ClawHub 一键安装 | 自托管 Agent 网关，热重载 |
| **Cursor** | Cursor Inc. | Nightly 版支持 | 本地目录 | AI IDE 市场领导者 |
| **OpenAI Codex CLI** | OpenAI | 支持（未官宣） | 本地目录 | 架构与 Skills 几乎一致 |
| **Trae** | 字节跳动 | 支持 | 本地目录 | 国内 AI IDE |

### 1.8 核心价值

1. **专业知识可沉淀**：将领域 Know-how 固化为可复用、可版本化的文件
2. **Token 效率极高**：渐进式披露机制，启动时仅加载每个 Skill ~100 tokens 的元数据
3. **跨平台可移植**：纯文件结构，可在任何支持开放标准的平台上使用
4. **自文档化**：SKILL.md 人类可直接阅读和审查
5. **可扩展**：从纯文本指令到包含脚本、资产、模板的复杂结构
6. **降低构建门槛**：非技术人员也能编写 Skill

---

## 2. 核心概念辨析

### 2.1 Agent Card（Agent 数字名片）

**Agent Card** 是 Google 主导的 **A2A（Agent-to-Agent）协议** 中定义的标准 JSON 文档，相当于每个 AI Agent 的"数字名片"。它托管在 `/.well-known/agent-card.json` 路径下，允许其他 Agent 通过标准化方式发现并理解该 Agent 的能力。

一个典型的 A2A Agent Card：

```json
{
  "name": "coffee_agent",
  "description": "希希咖啡店智能服务",
  "url": "https://agent.example.com/agent",
  "version": "0.0.1",
  "capabilities": {
    "streaming": true,
    "pushNotifications": true
  },
  "skills": [
    {
      "id": "coffee_agent-get_products",
      "name": "获取商品列表",
      "description": "获取当前可点的咖啡饮品列表",
      "examples": ["有什么咖啡推荐"]
    }
  ]
}
```

**Agent Card 与 SKILL.md Frontmatter 对比：**

| 维度 | A2A Agent Card | Skill Frontmatter (SKILL.md) |
|------|---------------|------------------------------|
| **粒度** | Agent 级别（整个 Agent 的名片） | Skill 级别（单个能力单元的名片） |
| **格式** | JSON | YAML |
| **用途** | Agent 间互相发现与通信 | Agent 在本地发现和选择 Skill |
| **协议归属** | A2A 协议 (Google 主导) | Agent Skills 规范 (Anthropic 主导) |

### 2.2 Skill vs Tool vs Function vs Prompt vs MCP

#### 精确定义

| 概念 | 定义 | 本质 | 载体 |
|------|------|------|------|
| **Skill（技能）** | 模块化、可复用的能力包 | "怎么做某类任务"的 SOP | 文件夹 + SKILL.md |
| **Tool（工具）** | Agent 可执行的外部操作接口 | "能做什么"的执行单元 | 函数、API、CLI 命令 |
| **Function（函数调用）** | OpenAI 提出的结构化调用模式 | 早期的工具调用标准 | JSON Schema + 模型调用 |
| **Prompt（提示词）** | 自然语言指令 | 一次性的口头指令 | 文本字符串 |
| **MCP** | 模型上下文协议 | 统一外部工具连接标准 | JSON-RPC 协议 |

#### 餐厅厨房通俗类比

| 概念 | 餐厅厨房对应 | 说明 |
|------|------------|------|
| LLM | 厨师的大脑 | 有烹饪知识但需要菜谱和工具 |
| Prompt | 顾客的口头点单 | "给我做一份牛排"——说完就忘了 |
| Tool | 炉灶、刀具、烤箱 | 厨师能用的物理工具 |
| Function | 标准化菜谱格式 | "菜谱格式：菜名 + 食材 + 步骤" |
| MCP | 厨房的燃气管道、水电接口 | 让工具能接入厨房的标准化接口 |
| Skill | 完整的菜谱手册 | 包含：菜名、食材清单、步骤、注意事项、图片 |
| Agent Card | 餐厅的菜单/招牌 | 告诉外界"我们餐厅能做什么菜" |

### 2.3 层次关系图

```mermaid
graph TD
    LLM[LLM 大语言模型] -->|提供推理与语言理解| MCP[MCP 模型上下文协议]
    MCP -->|提供统一工具连接| Skill[Agent Skill 技能模块]
    Skill -->|封装专业知识与流程| Agent[AI Agent 智能体]
    Agent -->|通过 Agent Card 互相发现| A2A[A2A Agent 间协作协议]

    style LLM fill:#e3f2fd
    style MCP fill:#fff3e0
    style Skill fill:#e8f5e9
    style Agent fill:#f3e5f5
    style A2A fill:#fce4ec
```

### 2.4 Agent 的四种形态与 Skill 映射

| 形态 | 说明 | 代表技术 | Skill 的作用 |
|------|------|----------|-------------|
| **Reflection（反思模式）** | 通过模型自身反思来改进任务执行 | ReAct、Self-Refine | Skill 包含验证检查清单，引导 Agent 自我审查 |
| **Tool use（工具调用）** | 调用外部工具或库来解决任务 | Function Calling、MCP | Skill 教 Agent 如何正确使用工具和组合工具 |
| **Planning（规划模式）** | 提前计划和组织步骤来提升效率 | 思维链（CoT）、思维树（ToT） | Skill 提供任务拆解模板和执行计划 |
| **Multi-agent（多智能体协作）** | 多个智能体协作完成任务 | A2A 协议 | Skill 在 Agent Card 中声明，实现跨 Agent 能力发现 |

### 2.5 常见误区

| 误区 | 正确理解 |
|------|---------|
| "Skill 就是高级提示词" | Skill 是结构化 SOP，包含元数据、触发条件、分步指令、可执行脚本和参考资料 |
| "Skill 只能在 Claude 使用" | 2025年12月已成为开放标准，27个平台支持 |
| "Skill 可以替代 MCP" | 两者互补：MCP 提供"能力插座"，Skill 提供"操作手册" |
| "自动生成 Skill 就够用" | Anthropic 观察 100+ 用户后结论："大多数自动生成更像玩具而非工具" |
| "Skill 越多越好" | 每个 Skill 即使只加载元数据也有 token 开销，应通过白名单精确控制 |

---

## 3. Skill vs MCP 深度对比

### 3.1 一句话区分

> **MCP 解决"连接"问题**：让 AI 能访问外部世界（数据库、API、文件系统）
>
> **Skill 解决"方法论"问题**：教 AI 怎么做某类任务（分析、审查、报告、部署）

**Anthropic 官方说法**：
> "MCP connects Claude to external services and data sources. Skills provide procedural knowledge — instructions for how to complete specific tasks or workflows."

**通俗类比**：
- **MCP** 是 AI 的"手"（能触碰外部世界）
- **Skill** 是 AI 的"技能书"（知道怎么做某件事）

### 3.2 六维度深度对比

| 维度 | MCP | Skill |
|------|-----|-------|
| **本质定位** | 能力插座（Socket） | 操作手册（Manual） |
| **知识类型** | 工具能力描述（"我能做什么"） | 程序性知识（"我该怎么做好"） |
| **架构模式** | Client-Server 持久连接 | 渐进式披露按需加载 |
| **协议层** | JSON-RPC 2.0 通信协议 | Markdown 指令（无网络协议） |
| **生命周期** | Server 持久运行 | 触发时加载，执行完释放 |
| **安全模型** | 工具签名攻击、名称投毒 | 供应链投毒、恶意指令注入 |

### 3.3 MCP 与 Skill 的协作流程

```mermaid
graph TD
    A[用户需求: "分析销售数据并写报告"] --> B{Agent 判断需要什么}

    B -->|连接数据库| C[MCP: Sales Database Server]
    B -->|知道如何分析| D[Skill: Sales Analysis]
    B -->|知道报告格式| E[Skill: Report Writing]

    C --> F[获取原始数据]
    D --> G[应用统计方法分析]
    E --> H[按规范生成报告]

    F --> I[Agent 整合]
    G --> I
    H --> I
    I --> J[输出最终报告]

    style C fill:#fff3e0
    style D fill:#e8f5e9
    style E fill:#e8f5e9
```

**关键洞察**：没有 MCP，Agent 无法连接数据库拿到数据；没有 Skill，Agent 拿到了数据也不知道怎么分析和呈现。

### 3.4 五种协作模式

| 模式 | 说明 | 示例 |
|------|------|------|
| **MCP 供能 + Skill 导航** | MCP 提供工具能力，Skill 指导使用方式 | 数据库 MCP + 数据分析 Skill |
| **Skill 调度 MCP** | Skill 内部明确指定调用哪些 MCP Server | 安全扫描 Skill 调用 Semgrep MCP + GitHub MCP |
| **Skill 链 + 单一 MCP** | 多个 Skill 串联，共享同一个 MCP 数据源 | 代码分析 → 文档生成 → PR 描述，都连 GitHub MCP |
| **多 MCP + 单一 Skill** | 一个 Skill 整合多个 MCP Server 的数据 | 项目报告 Skill 连 GitHub + Linear + Sentry |
| **Skill 间 MCP 传递** | 上游 Skill 的输出作为下游 Skill 的输入 | 数据采集 Skill → 数据分析 Skill |

### 3.5 全面对比总结（14 维度）

| 维度 | MCP | Skill |
|------|-----|-------|
| 发起方 | Anthropic（2024.11） | Anthropic（2025.10） |
| 治理 | Linux Foundation | agentskills.io 开放标准 |
| 核心组件 | Tools / Resources / Prompts | SKILL.md / scripts / references |
| 通信方式 | JSON-RPC 2.0（stdio / HTTP） | 文件系统读取 |
| 跨模型 | 支持所有 MCP Host | 支持所有 Skill 兼容平台 |
| 运行态 | 持久服务进程 | 按需加载释放 |
| Token 消耗 | 工具描述 ~500 tokens/Server | 元数据 ~100 tokens/Skill |
| 更新方式 | 重启 Server | 热更新文件 |
| 分发方式 | MCP 服务器目录 / 远程 URL | 本地目录 / Git / ClawHub |
| 调试方式 | 日志 + MCP Inspector | 直接阅读 SKILL.md |
| 安全边界 | Server 隔离 | 脚本沙箱 |
| 适用场景 | 需要实时数据交互 | 需要流程知识 |
| 开发门槛 | 需编程实现 Server | 会写 Markdown 即可 |
| 与 LLM 关系 | 外部连接层 | 内部知识注入层 |

---

## 4. 底层原理解析

### 4.1 渐进式披露的 Token 节省机制

**渐进式披露**（Progressive Disclosure）是 Agent Skill 架构的核心设计哲学。它将每个 Skill 的信息按"相关性密度"分层，Agent 只在需要时才加载更深层的内容。

#### 三层架构与 Token 消耗

| 层级 | 加载时机 | 加载内容 | Token 开销（单 Skill） |
|------|----------|----------|------------------------|
| **L1：元数据** | Agent 启动时始终加载 | `name` + `description` | ~30-100 tokens |
| **L2：指令体** | 用户请求与 description 语义匹配后 | `SKILL.md` 正文 | ~500-5,000 tokens |
| **L3：资源** | 执行过程中按需引用 | `scripts/`、`references/` | 仅脚本输出结果 |

#### 语义匹配机制

渐进式披露之所以能在仅加载 ~100 Token 元数据的情况下实现精准触发，核心在于 **语义匹配（Semantic Matching）** 而非关键词匹配：

```
传统关键词匹配（不用于 Skill 触发）：
用户输入："帮我审查这段代码"
description: "code review"
→ 关键词不重叠 → 匹配失败

语义匹配（Skill 实际使用的方式）：
用户输入："帮我审查这段代码"
description: "对代码进行结构化审查，检查安全漏洞、性能问题和代码规范"
→ 语义理解关联 → 匹配成功 → 加载 SKILL.md 正文
```

**实测数据对比**：

| 方案 | 20 个 Skills 总开销 | 100 个 Skills 总开销 | 节省比例 |
|------|---------------------|----------------------|----------|
| 全量加载所有 Prompt | 100,000+ tokens | 500,000+ tokens | — |
| 仅加载元数据（渐进式） | 2,000-10,000 tokens | 10,000-50,000 tokens | **~90%** |

### 4.2 SKILL.md 的解析原理

#### 解析流程

```mermaid
graph LR
    A[用户输入] --> B[Agent 读取所有 Skill 元数据]
    B --> C[LLM 语义匹配判断]
    C -->|匹配| D[加载 SKILL.md 正文]
    C -->|不匹配| E[保持元数据状态]
    D --> F[解析 YAML Frontmatter]
    F --> G[解析 Markdown 指令]
    G --> H[注入系统提示词]
    H --> I[执行工作流]
    I -->|需要| J[加载 references/scripts]
```

1. **YAML Frontmatter 解析**：提取 `name`、`description`、`aliases`、`triggers` 等字段
2. **Markdown 指令注入**：将 `SKILL.md` 正文作为系统提示词的一部分注入 Agent 上下文
3. **引用即触发**：当 Agent 执行过程中引用 `references/` 或执行 `scripts/` 时，按需加载对应资源

### 4.3 上下文注入流程

上下文注入采用**动态管理**策略：

1. **常驻层**：所有 Skill 的元数据始终在上下文中
2. **激活层**：触发后加载 SKILL.md 正文，执行完成后释放
3. **资源层**：按需加载 references/scripts，使用后释放

**三种管理策略**：
- **滑动窗口**：最近激活的 N 个 Skill 保留在上下文
- **LRU 淘汰**：最久未使用的 Skill 正文优先释放
- **显式释放**：执行完成后主动从上下文中移除

### 4.4 脚本执行的沙箱隔离模型

`scripts/` 目录中的脚本执行采用**双纵深防御**：

| 层级 | 机制 | 说明 |
|------|------|------|
| **文件系统权限** | 只读工作目录 | 脚本只能读取 Skill 目录下的文件 |
| **OS 级沙箱** | macOS sandbox-exec / Linux seccomp | 限制网络访问、文件写入、系统调用 |
| **Agent 层控制** | 工具调用白名单 | 只能使用 Skill 定义中允许的工 |

### 4.5 三平台加载引擎差异

| 平台 | 加载方式 | 触发机制 | 分发方式 |
|------|----------|----------|----------|
| **Claude Code** | 本地文件系统扫描 | 基于 description 的语义触发 + Hooks | `~/.claude/skills/` 或 `.claude/skills/` |
| **OpenClaw** | ClawHub 远程下载 + 本地缓存 | `clawhub install` 后热重载 | ClawHub 平台 |
| **Google Antigravity** | IDE 内置加载器 | `.agent/skills/` 路径自动发现 | Agent Manager |

### 4.6 常见误区

| 误区 | 事实 |
|------|------|
| "Skill 会被全部预加载" | 只有元数据常驻，正文和资源按需加载 |
| "scripts/ 内容会占 Token" | 脚本是执行的，不是读入上下文的，只有输出结果占 Token |
| "所有平台触发机制一样" | 不同平台实现差异大：Claude Code 用语义匹配，Antigravity 用路径发现 |

---

## 5. 生命周期与工作流程

### 5.1 完整生命周期（9 个阶段）

```mermaid
stateDiagram-v2
    [*] --> 创建
    创建 --> 注册: SKILL.md 编写完成
    注册 --> 发现: 放置到正确路径
    发现 --> 触发: Agent 扫描到可用 Skill
    触发 --> 加载: 语义匹配成功
    加载 --> 执行: 加载 SKILL.md 正文
    执行 --> 上下文释放: 工作流完成
    上下文释放 --> 发现: 回归元数据状态
    发现 --> 版本更新: 作者发布新版本
    版本更新 --> 发现: 重新注册
    发现 --> 废弃: 作者标记废弃
    废弃 --> [*]
```

### 5.2 各阶段详解

#### 阶段 1：创建

**任务**：创建 Skill 目录和 SKILL.md 文件

```bash
mkdir -p my-skill/{scripts,references,assets}
touch my-skill/SKILL.md
```

**Token 开销**：0（纯本地操作）

#### 阶段 2：注册

**任务**：将 Skill 放置到正确路径

| 级别 | 路径 | 适用范围 |
|------|------|----------|
| 全局 | `~/.claude/skills/my-skill/` | 所有项目可用 |
| 项目 | `.claude/skills/my-skill/` | 仅当前项目可用 |

#### 阶段 3：发现

**任务**：Agent 启动时扫描可用 Skills

- 扫描注册目录
- 解析每个 SKILL.md 的 YAML Frontmatter
- 将 `name` + `description` 加入上下文

**Token 开销**：每个 Skill ~30-100 tokens（仅元数据）

#### 阶段 4：触发

**触发方式**：

| 方式 | 示例 | 说明 |
|------|------|------|
| 显式命令 | `/code-review src/` | 用户直接使用 Skill 名称 |
| 隐式语义 | "帮我看看这段代码" | Agent 语义理解匹配 description |
| 别名触发 | `/review src/` | 通过 aliases 字段匹配 |

#### 阶段 5：加载

加载 SKILL.md 正文到 Agent 上下文。

**Token 开销**：~500-5,000 tokens（取决于 SKILL.md 长度）

#### 阶段 6：执行

按照 SKILL.md 中定义的工作流程执行任务。

#### 阶段 7：上下文释放

执行完成后，将 SKILL.md 正文从上下文中移除，保留元数据。

**Token 释放**：回收 ~500-5,000 tokens

#### 阶段 8：版本更新

Skill 作者修改 SKILL.md 或资源文件。Agent 下次触发时自动使用新版本。

#### 阶段 9：废弃

Skill 不再维护，从注册目录中移除。

### 5.3 错误处理路径

| 错误类型 | 场景 | 处理策略 |
|----------|------|----------|
| **触发失败** | 没有 Skill 匹配用户请求 | Agent 使用通用能力响应 |
| **加载失败** | SKILL.md 格式错误或不存在 | 跳过该 Skill，记录警告 |
| **执行错误** | 脚本执行失败或引用文件缺失 | 回退到基础工作流，报告错误 |
| **权限不足** | 脚本请求未授权工具 | 拒绝执行，提示用户确认 |

### 5.4 资源消耗对比

| 方案 | 20 个 Skills | 单次执行总开销 | 节省比例 |
|------|-------------|---------------|----------|
| 传统 Prompt | 100,000+ tokens | 5,000 tokens | — |
| Agent Skill | 2,000-10,000 tokens (元数据) + 5,000 tokens (单次加载) | 5,000-15,000 tokens | **~70-85%** |

---

## 6. 三层协议架构

### 6.1 MCP（Model Context Protocol）

**定义**：由 Anthropic 牵头、Linux Foundation 托管的开源协议，标准化 AI 模型与外部数据源/工具的交互方式。

**核心组件**：
- **Tools**：模型可主动调用的操作（如写文件、查数据库）
- **Resources**：模型可读取的数据（如文件内容、API 响应）
- **Prompts**：可复用的模板（如代码审查模板）

**架构**：Client-Server 模式，基于 JSON-RPC 2.0 通信，传输层支持 stdio（本地）和 Streamable HTTP（远程）。

### 6.2 ACP（Agent Client Protocol）

**定义**：由 JetBrains 和 Zed 发布的 JSON-RPC 协议，定义编辑器与 AI Agent 之间的标准化通信。

**四种标准消息类型**：
- **Diff**：代码差异建议
- **Stream Chunk**：流式输出片段
- **Tool Request**：工具调用请求
- **Diagnostic**：诊断信息（错误、警告）

**类比**：ACP 之于 Agent 就像 LSP（Language Server Protocol）之于 IDE。

### 6.3 A2A（Agent-to-Agent Protocol）

**定义**：由 Google 发布、Linux Foundation 治理的跨平台 Agent 协作协议。

**核心概念**：
- **Agent Card**：Agent 的数字名片（`/.well-known/agent-card.json`）
- **Task**：Agent 间传递的任务请求
- **Artifact**：任务执行结果
- **Skill**：Agent Card 中声明的能力列表

### 6.4 Skill 在三层协议中的角色

| 协议层 | Skill 的角色 | 交互方式 |
|--------|-------------|----------|
| **MCP 层** | 消费者 | Skill 利用 MCP Server 提供的工具能力 |
| **ACP 层** | 影响者 | Skill 影响 Agent 的执行策略和输出格式 |
| **A2A 层** | 被声明者 | Skill 作为 Agent Card 的 `skills[]` 字段，实现跨平台发现 |

### 6.5 三层协议 + Skill 协作架构

```mermaid
graph TB
    User[用户] --> Agent[AI Agent]
    
    Agent -->|语义匹配| Skill[Agent Skill]
    Skill -->|调用| MCP_Tools[MCP Tools]
    Skill -->|读取| MCP_Resources[MCP Resources]
    
    Agent -->|进程管理| ACP[ACP Protocol]
    ACP -->|通信| IDE[IDE / 编辑器]
    
    Agent -->|声明能力| AgentCard[Agent Card]
    AgentCard -->|包含| SkillList[Skill 列表]
    AgentCard -->|被发现| OtherAgent[其他 Agent]
    OtherAgent -->|A2A 协作| Agent
    
    MCP_Tools --> DB[(数据库)]
    MCP_Tools --> API[外部 API]
    MCP_Tools --> FS[文件系统]
    
    style Skill fill:#e8f5e9
    style MCP_Tools fill:#fff3e0
    style ACP fill:#e3f2fd
    style AgentCard fill:#fce4ec
```

### 6.6 外部编排模式 vs Workspace Agent 模式

| 维度 | 外部编排模式 | Workspace Agent 模式 |
|------|-------------|---------------------|
| **架构** | Orchestrator + 多 ACP 子进程 | 单个宏观协调 Agent + 多个子 Agent |
| **任务拆解** | 外部引擎完成 | Agent 内部 Agentic Loop 处理 |
| **状态管理** | EventBus 同步 | 统一管理 |
| **优势** | 进程隔离、可审计 | 状态统一、通信开销小 |
| **适用** | 复杂企业流程 | 快速原型开发 |

### 6.7 三种协议核心差异（12 维度）

| 维度 | MCP | ACP | A2A |
|------|-----|-----|-----|
| 发起方 | Anthropic | JetBrains + Zed | Google |
| 治理 | Linux Foundation | 开源社区 | Linux Foundation |
| 核心目标 | 工具连接标准化 | 编辑器-Agent 通信 | 跨 Agent 协作 |
| 通信协议 | JSON-RPC 2.0 | JSON-RPC 2.0 | HTTP + JSON-RPC |
| 角色 | Host / Client / Server | Editor / Agent | Client / Server |
| 关键组件 | Tools / Resources / Prompts | Diff / Chunk / Request / Diagnostic | Agent Card / Task / Artifact |
| Skill 关系 | Skill 通过 MCP 获取工具 | Skill 影响 Agent 输出策略 | Skill 在 Agent Card 中声明 |
| 信任模型 | Server 需验证 | 进程级信任 | 零信任，需认证 |

---

## 7. Skill 编写规范

### 7.1 SKILL.md 文件格式

**基本结构**：

```markdown
---
name: skill-name
description: 简短描述技能用途
aliases: [别名1, 别名2]
triggers: [触发词1, 触发词2]
---

# Skill 名称

## 用途

说明这个技能的适用场景，什么时候应该使用。

## 工作流程

### 步骤 1：步骤名称

具体操作说明。

### 步骤 2：步骤名称

...

## 输出格式

定义输出应该遵循的格式规范。

## 注意事项

- 需要特别注意的边界情况
- 常见错误及避免方法
```

### 7.2 YAML Frontmatter 详解

**必需字段**：

```yaml
---
name: skill-name              # 1-64 字符，小写字母 + 数字 + 连字符
description: 清晰描述技能用途和触发场景  # 1-1024 字符，决定触发准确性
---
```

**可选字段**：

```yaml
---
name: research 文档调研与整理
description: 深度调研任意主题并生成结构化知识文档
aliases: [调研，整理文档，研究]
triggers: [调研，研究，整理一份，帮我调研]
author: your-name
version: "1.0.0"
compatibility: Requires git, docker  # 环境要求
---
```

**description 字段的重要性**：

```
❌ 不好的描述：
description: 处理代码相关任务

✅ 好的描述：
description: 结构化代码审查指南，包含安全检查清单、性能分析、测试覆盖率验证
```

**关键点**：Claude 通过语义理解 description 来判断是否触发 Skill，不是关键词匹配。

### 7.3 跨平台格式差异

| 平台 | name 字段 | 路径约定 | 特殊要求 |
|------|-----------|----------|----------|
| **Claude Code** | 英文 + 中文可选 | `~/.claude/skills/` 或 `.claude/skills/` | SKILL.md 大小写敏感 |
| **Google Antigravity** | 英文 | `<workspace-root>/.agent/skills/` 或 `~/.gemini/antigravity/skills/` | name 字段与 Claude 有差异 |
| **OpenClaw** | 英文 | ClawHub 注册 + 本地目录 | 需通过 `clawhub install` 安装 |
| **Cursor** | 英文 | `~/.cursor/skills/` | 与 Claude Code 兼容 |

### 7.4 编写最佳实践

#### ✅ 推荐做法

```markdown
## 1. 明确触发条件

当用户请求以下类型的任务时，自动激活此 Skill：
- 代码审查
- API 文档生成
- 数据库迁移

## 2. 提供具体检查清单

### 代码审查清单

- [ ] 是否存在 SQL 注入风险
- [ ] 是否有适当的错误处理
- [ ] 是否遵循命名规范

## 3. 定义输出格式

输出应包含：
1. 问题汇总（按严重程度排序）
2. 具体问题（文件：行号）
3. 修复建议（附代码示例）

## 4. 不要陈述显而易见的事

❌ 冗余指令：
- "阅读用户指定的文件"
- "理解代码结构"

✅ 有价值的指令：
- "优先检查是否存在 SQL 注入风险，重点关注字符串拼接的查询语句"

## 5. 提供踩坑清单

### 陷阱 1：直接字符串拼接 SQL

❌ 错误：
const query = "SELECT * FROM users WHERE id = " + userId;

✅ 正确：
const query = "SELECT * FROM users WHERE id = ?";
db.execute(query, [userId]);
```

#### ❌ 避免做法

- 描述过于笼统："审查代码质量"
- 没有具体步骤："根据需要进行检查"
- 缺少输出格式："给出审查结果"
- Token 浪费：包含大量与当前任务无关的内容

### 7.5 完整 Skill 示例

#### 示例 1：代码审查 Skill

```markdown
---
name: code-review 代码审查
description: 结构化代码审查指南，包含安全检查清单、性能分析和测试覆盖率验证
aliases: [review, code-review-assistant]
---

# 代码审查

## 用途

当用户请求代码审查、检查代码质量时，自动使用此 Skill。

## 工作流程

### 步骤 1：安全检查

- [ ] SQL 注入风险（重点关注字符串拼接查询）
- [ ] XSS 漏洞（检查用户输入是否转义）
- [ ] 敏感信息泄露（密码、Token 是否硬编码）

### 步骤 2：性能检查

- [ ] N+1 查询问题
- [ ] 大列表是否有分页
- [ ] 内存泄漏风险

### 步骤 3：输出报告

```markdown
## 审查结果

### 高危问题（2 个）
1. SQL 注入风险 (user_service.py:45)
   - 修复：使用参数化查询
```
```

#### 示例 2：PR 描述生成器

```markdown
---
name: pr-description PR 描述生成
description: 自动生成 Pull Request 描述和发布说明
triggers: [生成 PR 描述，release notes, 发布说明]
---

## 输出模板

## 变更概述
一句话描述此 PR 的核心变更

## 变更详情
- [变更 1]
- [变更 2]

## 测试验证
- [ ] 单元测试通过
- [ ] 集成测试通过
- [ ] 手动验证通过
```

### 7.6 命名建议

```yaml
# 推荐：英文 + 中文（保留英文方便搜索）
name: remotion-best-practices 视频剪辑工具
name: web-design-guidelines Web 设计指南

# 不推荐：纯中文（搜索不便）
name: 视频剪辑工具

# 不推荐：纯英文（记忆困难）
name: remotion-best-practices
```

---

## 8. Agentic 工作流模式

### 8.1 Google Agentic Design Patterns 核心模式

基于 Google《Agentic Design Patterns》（Antonio Gulli, 424 页），以下是与 Skill 最相关的 6 种核心模式：

#### 模式 1：提示链（Prompt Chaining）

将复杂任务拆分为串行子步骤，每个步骤的 Skill 输出作为下一步的输入。

```mermaid
graph LR
    A[用户输入] --> B[Skill 1: 资料搜集]
    B --> C[Skill 2: 数据清洗]
    C --> D[Skill 3: 分析报告]
    D --> E[Skill 4: 格式排版]
    E --> F[最终输出]
```

**适用场景**：多步骤、有明确先后顺序的任务（如写报告→搜资料→整理框架→成文）

#### 模式 2：路由（Routing）

Skill 根据输入动态选择处理路径。

```mermaid
graph TD
    A[用户输入] --> B{Skill Router}
    B -->|代码类| C[Code Review Skill]
    B -->|文档类| D[Doc Generator Skill]
    B -->|部署类| E[Deploy Skill]
```

**适用场景**：输入类型多样，需要分类处理的场景

#### 模式 3：并行化（Parallelization）

多个 Skill 并发执行，最后整合结果。

```mermaid
graph TD
    A[用户输入] --> B[Skill A: 前端检查]
    A --> C[Skill B: 后端检查]
    A --> D[Skill C: 安全检查]
    B --> E[整合 Skill]
    C --> E
    D --> E
```

**适用场景**：多个独立子任务可同时进行（如全栈代码审查）

#### 模式 4：反射（Reflection）

Skill 执行完成后自我评估和修正。

```mermaid
graph TD
    A[执行 Skill] --> B{自我评估}
    B -->|通过| C[输出结果]
    B -->|不通过| D[修正并重试]
    D --> A
```

**适用场景**：对输出质量要求高的场景（如发布前的最终验证）

#### 模式 5：规划（Planning）

Skill 自主拆解任务步骤并制定执行计划。

**适用场景**：模糊目标需要自主规划的场景（如"优化这个项目"）

#### 模式 6：多 Agent 协作（Multi-Agent）

多个 Agent 各自加载不同 Skill，协同完成复杂任务。

```
项目经理 Agent (管理 Skill) → 设计师 Agent (UI Skill) → 程序员 Agent (编码 Skill)
```

**适用场景**：需要多种专业角色协作的复杂项目

### 8.2 Skill 堆叠（Stacking）实战

**链式执行示例**：code-analyzer → doc-generator → code-reviewer

```
用户："分析这个项目，生成技术文档，然后审查代码质量"

触发的 Skills：
1. code-analyzer → 分析代码结构和依赖
2. doc-generator → 生成文档结构
3. code-reviewer → 审查代码质量

执行流程：
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  code-      │ →  │  doc-       │ →  │  code-      │
│  analyzer   │    │  generator  │    │  reviewer   │
└─────────────┘    └─────────────┘    └─────────────┘
     ↓                    ↓                    ↓
 识别核心组件          生成文档结构         发现潜在问题
```

### 8.3 数据传递策略

| 策略 | 说明 | 适用场景 |
|------|------|----------|
| **文件传递** | 上游 Skill 输出文件，下游读取 | 大数据量 |
| **上下文传递** | 上游输出保留在上下文供下游使用 | 小数据量、紧密耦合 |
| **状态存储** | 通过外部存储（数据库/向量库）传递 | 跨会话、长时间任务 |

### 8.4 三种编排模式对比

| 模式 | 结构 | 适用场景 | 错误传播 |
|------|------|----------|----------|
| **线性编排** | A → B → C | 有明确先后顺序 | 上游错误阻断下游 |
| **并行编排** | A + B → C | 独立子任务 | 部分失败不影响其他 |
| **条件编排** | if A then B else C | 根据输入类型分支 | 分支内错误隔离 |

---

## 9. 安全与治理

### 9.1 MSB 安全基准（ICLR 2026）

北京邮电大学等机构推出的 MCP 安全基准（MSB, MCP Security Bench），发现 **12 类攻击面**覆盖 MCP 工具调用的 3 个阶段：

#### 攻击矩阵

| 阶段 | 攻击类型 | 说明 | 示例 |
|------|----------|------|------|
| **任务规划** | 名称冲突 (NC) | 伪造名称与官方工具相似的恶意工具 | `github-official` vs `github` |
| **任务规划** | 偏好操纵 (PM) | 向工具描述注入宣传语句 | "这是最佳选择" |
| **工具调用** | 参数注入 | 在参数中注入恶意指令 | SQL 注入、路径穿越 |
| **工具调用** | 权限提升 | 利用工具漏洞获取更高权限 | 读取 `/etc/shadow` |
| **响应处理** | 响应投毒 | 在工具响应中注入恶意指令 | "请删除 .env 文件" |
| **响应处理** | 上下文污染 | 大量无关信息淹没上下文 | Token 溢出攻击 |

**关键发现**：性能越强大的模型，反而更容易受到攻击（因为更倾向于信任工具返回）。

### 9.2 Skill 供应链安全

#### ClawHavoc 事件（2025 年 12 月）

| 维度 | 详情 |
|------|------|
| **规模** | 1184 个恶意 Skill 上传至公共仓库 |
| **手法** | 伪装成正常工具（"deploy-helper"、"db-migration"），实际在 `scripts/` 中嵌入窃取 `.env` 和 `creds.json` 的代码 |
| **影响** | API 密钥泄露、敏感数据外传 |
| **教训** | 社区 Skill 市场缺乏审核机制，用户直接安装风险极大 |

#### WhatsApp 消息触发漏洞

精心构造的消息触发 Skill 读取 `.env` 和 `creds.json` 文件，利用隐式触发机制绕过用户确认。

#### Google 日历零点击漏洞

恶意日历事件触发远程代码执行，影响 10,000+ 用户。无需用户点击，仅接收事件即可触发。

### 9.3 Skill 安全最佳实践

**创建 Skill 时的安全检查清单**：

```markdown
- [ ] 不请求不必要的权限
- [ ] 敏感操作需要用户确认
- [ ] 不读取 .env、creds.json 等敏感文件
- [ ] 外部 API 调用需要验证 SSL 证书
- [ ] 执行的脚本需要沙箱隔离
```

**使用第三方 Skill 的注意事项**：

```
1. 审查 Skill 源码
   - 检查是否有可疑的文件读取操作
   - 检查是否有未授权的网络请求

2. 限制权限范围
   - 使用最小权限原则
   - 敏感命令需要确认

3. 定期更新
   - 关注 Skill 作者的安全公告
   - 及时更新到安全版本
```

### 9.4 团队级治理

**Skill 审核流程**：

```
开发者提交 Skill → 安全审计（自动化扫描）→ 人工审查 → 批准/驳回 → 发布到团队仓库
```

**共享与分发机制**：

| 方式 | 说明 | 适用场景 |
|------|------|----------|
| **Git 子模块** | `git submodule add https://github.com/team/skills .claude/skills` | 团队统一管理 |
| **OpenSkills** | `npx -g openskills install team/research-skill` | 公共生态分发 |
| **私有注册表** | 内部 Skill 仓库 + CI/CD 自动部署 | 企业级安全管控 |

### 9.5 Anthropic 内部 9 条经验总结

1. **从"小而专"开始**：避免创建"万能 Skill"，每个 Skill 专注解决 2-3 个具体用例
2. **强调可测试性**：把 Skill 当代码一样管理，编写测试用例
3. **验证类 Skill 价值最高**：即使让一个工程师花一周时间打磨验证 Skill 也是值得的
4. **让 Claude 录制输出**：验证类 Skill 可以让 Claude 录制操作视频，方便审查
5. **强制断言验证**：在流程的每一步强制插入断言，验证状态是否正确
6. **包含踩坑清单**：对于内部库，提供"最容易犯的错误"清单
7. **不要假设唯一性**：Skill 要能和其他 Skill 并存运行
8. **描述决定触发**：description 字段要清晰、具体，有上下文表达力
9. **迭代是关键**：没有完美的第一版，根据实际使用反馈持续改进

---

## 10. 跨平台最佳实践

### 10.1 Claude Code Skill 最佳实践

#### 10.1.1 Skill 的本质理解

**核心定义**：

Skill 不是"Markdown 文件"，而是一个**文件夹结构**，可以包含：
- `SKILL.md`（必需）：核心指令文件
- `scripts/`（可选）：可执行脚本（Python、Bash 等）
- `references/`（可选）：按需加载的参考文档
- `assets/`（可选）：模板、字体、图标等资源

**关键思维转变**：

```
❌ 错误理解：Skill = 写一个 SKILL.md 文件
✅ 正确理解：Skill = 设计一个文件夹结构，Claude 可以探索和操纵其中的文件
```

#### 10.1.2 9 种 Skill 类型分类

根据 Anthropic 内部使用的数百个 Skills 归纳：

| 类型 | 用途 | 典型示例 | 优先级 |
|------|------|----------|--------|
| **1. 库和 API 参考** | 教 Claude 正确使用内部库/CLI/SDK | `billing-lib`、`internal-platform-cli` | ⭐⭐⭐⭐⭐ |
| **2. 产品验证** | 描述如何测试代码是否正常工作 | `signup-flow-driver`、`checkout-verifier` | ⭐⭐⭐⭐⭐ |
| **3. 数据获取与分析** | 连接数据系统和监控系统 | `funnel-query`、`cohort-compare` | ⭐⭐⭐⭐ |
| **4. 代码生成** | 根据规格说明生成代码 | `frontend-from-design`、`api-from-spec` | ⭐⭐⭐⭐ |
| **5. 文档生成** | 生成标准化文档 | `pr-description`、`api-doc-generator` | ⭐⭐⭐⭐ |
| **6. 代码审查** | 结构化代码审查流程 | `code-review-assistant` | ⭐⭐⭐⭐ |
| **7. 部署流程** | 自动化部署和发布 | `deploy-to-prod`、`staging-verify` | ⭐⭐⭐ |
| **8. 团队规范** | 统一团队编码风格 | `team-style-guide`、`commit-message` | ⭐⭐⭐ |
| **9. 调研整理** | 深度调研并生成知识文档 | `research` | ⭐⭐⭐⭐ |

#### 10.1.3 测试与调试 Skill

**验证 Skill 是否生效**：

```bash
# 在 Claude Code 中询问
"What Skills are available?"

# 使用匹配的触发词测试
# 如果 Skill 的 description 包含"调研"，尝试：
"帮我调研一下 React 19 的新特性"
```

**常见问题排查**：

| 问题 | 可能原因 | 解决方案 |
|------|----------|----------|
| **Skill 没有触发** | description 不够清晰 | 重写 description，使其更具体 |
| **Skill 没有加载** | 目录名或 SKILL.md 命名错误 | 确认大小写正确（SKILL.md） |
| **Skill 有错误** | 指令逻辑冲突 | 简化指令，分步骤测试 |
| **多个 Skill 冲突** | 触发条件重叠 | 为每个 Skill 定义更具体的场景 |

#### 10.1.4 迭代开发流程

```
1. 创建最小可用版本（MVP）
   - 只包含核心指令
   - 不包含复杂逻辑

2. 测试触发
   - 使用自然语言触发
   - 使用显式命令触发（/skill-name）

3. 观察行为
   - Claude 是否正确理解意图？
   - 输出是否符合预期格式？

4. 逐步增强
   - 添加更多检查清单
   - 添加资源文件
   - 添加可执行脚本
```

### 10.2 Google Antigravity Skill 实践

**路径约定**：
- 项目级：`<workspace-root>/.agent/skills/<skill-folder>/`
- 全局级：`~/.gemini/antigravity/skills/<skill-folder>/`

**独有特性**：自动调用 nano banana 模型生成高质量配图（Codex 和 Claude Code 不具备）。

### 10.3 OpenClaw Skill 实践

**安装方式**：
```bash
clawhub install skill-name    # 从 ClawHub 安装
```

**Skill 目录**：
```
~/.openclaw/skills/skill-name/
├── SKILL.md
├── scripts/
└── references/
```

### 10.4 从 0 到 1 创建 Skill 检查清单

```markdown
## 规划阶段
- [ ] 明确 2-3 个具体用例
- [ ] 定义触发条件
- [ ] 设计工作流程
- [ ] 确定输出格式

## 创建阶段
- [ ] 创建 Skill 目录
- [ ] 编写 SKILL.md（包含 YAML frontmatter）
- [ ] 添加必要的资源文件
- [ ] （可选）添加可执行脚本

## 测试阶段
- [ ] 验证 Skill 被正确识别
- [ ] 测试自然语言触发
- [ ] 测试显式命令触发
- [ ] 验证输出格式

## 迭代阶段
- [ ] 收集使用反馈
- [ ] 修复触发问题
- [ ] 增强检查清单
- [ ] 优化 Token 消耗
```

---

## 附录：Skill 模板

### A. 基础模板

```markdown
---
name: skill-name 中文名称
description: 简短描述
aliases: [alias1, alias2]
triggers: [触发词1, 触发词2]
---

# Skill 名称

## 用途

说明适用场景。

## 工作流程

### 步骤 1：步骤名称

具体操作说明。

### 步骤 2：步骤名称

...

## 输出格式

定义输出格式规范。

## 注意事项

- 边界情况
- 常见错误
- 安全要求

## 示例

使用示例。
```

### B. 资源目录模板

```
skill-name/
├── SKILL.md              # 主文件
├── examples/             # 示例
│   └── example1.md
├── references/           # 参考资料
│   └── guide.md
└── scripts/              # 可执行脚本
    └── helper.sh
```

---

*文档创建日期：2026-03-25*
*最后更新：2026-04-20 (v2.0 · 9 章扩展版)*
*版本：2.0.0*
*更新说明：新增 Agent Skill 生态全景、Skill vs MCP 深度对比、底层原理、生命周期流程、三层协议架构、Agentic 工作流模式、安全治理、跨平台最佳实践*
*来源：Anthropic 官方文档、agentskills.io、Google Agentic Design Patterns、MSB 安全基准 (ICLR 2026)、A2A 协议文档、MCP 官方规范*
