# MCP 核心知识体系

> **Model Context Protocol (模型上下文协议) 深度解析**
> 
> 版本：1.0.0 | 最后更新：2026-04-03

---

## 目录

1. [MCP 概述与背景](#第 1 章 mcp 概述与背景)
2. [MCP 核心架构](#第 2 章 mcp 核心架构)
3. [MCP 协议规范](#第 3 章 mcp 协议规范)
4. [MCP 安全机制](#第 4 章 mcp 安全机制)
5. [MCP Server 开发实战（Python）](#第 5 章 mcp-server 开发实战 python)
6. [MCP Server 开发实战（TypeScript）](#第 6 章 mcp-server 开发实战 typescript)
7. [MCP Client 集成](#第 7 章 mcp-client 集成)
8. [MCP 最佳实践与常见问题](#第 8 章 mcp 最佳实践与常见问题)

---

## 第 1 章 MCP 概述与背景

### 1.1 什么是 MCP（定义与核心目标）

#### 概念定义

**MCP（Model Context Protocol，模型上下文协议）** 是由 Anthropic 公司于 2024 年 11 月推出的开放标准协议，旨在为大型语言模型（LLM）与外部数据源、工具及服务提供统一的通信框架。MCP 被广泛称为"AI 领域的 USB-C 接口"，因为它标准化了 AI 应用、LLM 和外部系统之间的连接方式，实现"即插即用"的互操作性。

从技术定位来看，MCP 的核心定义可概括为两个关键角色：

- **"通用语言"**：让 AI 模型（如 Claude、DeepSeek 等）与外部工具（数据库、API、文件系统等）采用统一格式进行交互
- **"万能插座"**：为不同 AI 模型与工具提供标准化连接方式，无需针对每个工具单独定制开发

#### 核心目标

MCP 的设计围绕以下四个核心目标展开：

| 目标 | 说明 | 实现方式 |
|------|------|----------|
| **标准化** | 统一接口设计，消除碎片化集成 | 基于 JSON-RPC 2.0 定义统一通信协议 |
| **安全性** | 确保数据访问与操作的安全 | 加密通信、权限控制、OAuth 2.1 认证 |
| **可扩展性** | 支持灵活的功能扩展 | 模块化设计，支持动态能力发现 |
| **互操作性** | 跨平台、跨模型兼容 | 一次开发，多处复用 |

**工作原理**：MCP 采用客户端 - 服务器（C/S）架构，通过标准化的接口定义，使 AI 模型能够以一致的方式调用外部工具、访问数据资源或执行特定任务。服务器暴露三大核心能力（Resources、Tools、Prompts），客户端通过协议协商发现并使用这些能力，无需针对不同工具进行碎片化定制。

#### 与 Function Calling 的本质区别

在 MCP 出现之前，主流的方案是 Function Calling 技术。两者的关键差异如下：

| 对比维度 | Function Calling | MCP |
|----------|------------------|-----|
| **集成方式** | 每个工具需单独编写 JSON Schema 和适配代码 | 统一协议，标准化接入 |
| **代码复杂度** | 6 个函数的 Agent 代码量可达 3000 行以上 | 几行代码即可完成集成 |
| **跨平台性** | 插件绑定特定模型（GPT-4 插件无法被 Claude 使用） | 跨模型兼容，一次开发处处运行 |
| **维护成本** | 工具变更需同步更新所有调用方 | 服务器独立更新，客户端无感知 |

**常见误区**：
- ❌ 误区 1：MCP 是一个具体的工具或框架
  - ✅ 正解：MCP 是协议/标准，类似于 HTTP、SMTP，不是可执行的文件或库
- ❌ 误区 2：MCP 只适用于 Anthropic 的 Claude 模型
  - ✅ 正解：MCP 是开放标准，已被 ChatGPT、Copilot、Gemini、VS Code 等多个平台采用
- ❌ 误区 3：MCP 可以解决所有 AI 集成问题
  - ✅ 正解：MCP 适用于需要标准化的场景，简单一次性任务直接用 API 更高效

---

### 1.2 MCP 诞生的背景与解决的痛点

#### 行业背景

**碎片化的插件时代**：

1. **各自为战的解决方案**：
   - LangChain 使用自定义 Tool Schema
   - Ollama 依赖函数描述字符串
   - OpenAI 推出 GPT Actions
   - 各厂商投资专有框架，建立围墙花园

2. **开发效率困境**：
   - 根据 2025 年 Platform Engineering Survey，78% 的企业在过去 18 个月内引入了至少 3 种不同 AI Agent，但仅 23% 实现了工具间有效协作
   - 开发者需掌握 6-8 种交互模式，认知负荷极高
   - 开发团队将超过 60% 的时间用于构建"胶水代码"，而非解决核心业务问题

#### MCP 解决的四大痛点

| 痛点 | 问题描述 | MCP 解决方案 |
|------|----------|--------------|
| **碎片化集成** | 每个工具需单独开发适配代码，"一把锁配一把钥匙" | 统一协议，一次开发多处复用 |
| **上下文管理混乱** | 边缘设备难以解析非结构化指令，状态管理混乱 | 结构化上下文传递机制 |
| **跨平台兼容性差** | 插件绑定特定模型，无法跨平台共享 | 开放标准，跨模型兼容 |
| **安全与权限管理缺失** | 手动管理权限易出错，导致数据泄露风险 | 基于能力的细粒度权限控制 |

**工作原理**：MCP 通过"暴露上下文，而非仅暴露端点"的设计理念，让工具具备自我解释能力。MCP 服务器在启动时向 AI 客户端发送结构化文档，描述可用工具的功能、参数、安全限制及使用示例，AI 据此自主决策是否调用、如何调用。

---

### 1.3 MCP 发展历程（2024-2025 关键事件）

| 时间 | 事件 | 意义 |
|------|------|------|
| **2024 年 8 月** | MCP 概念在 Anthropic 伦敦办公室诞生，最初名为"CSP (Context Server Protocol)" | 想法萌芽阶段 |
| **2024 年 11 月 25 日** | Anthropic 正式发布 MCP 1.0 协议，开源代码仓库 | 协议首次公开 |
| **2024 年 11 月** | 代码仓库仅有 47 个官方集成 | 早期生态规模 |
| **2024 年 12 月** | Anthropic 将 MCP 捐赠给 Linux 基金会旗下 Agentic AI 基金会 (AAIF) | 从"企业标准"升级为"行业共识" |
| **2025 年初** | Cursor、Cline、Goose 等主流 IDE 宣布支持 MCP | 生态引爆点 |
| **2025 年 3 月** | MCP 协议 2025-03-26 版本发布，Streamable HTTP 替代 HTTP+SSE | 传输层重大升级 |
| **2025 年 5 月** | Microsoft 宣布 Windows 将原生支持 MCP Host 接口 | 操作系统级支持 |
| **2025 年 6 月 18 日** | MCP 协议更新，新增 Elicitation、OAuth 2.1、结构化输出 | 人机协同与安全增强 |
| **2025 年底** | 全球超过 10,000 个公开 MCP 服务器，SDK 月下载量达 9700 万次 | 工业级基础设施规模 |

---

### 1.4 MCP 生态与行业支持

#### Linux 基金会托管与治理

**Agentic AI Foundation (AAIF)**

2024 年 12 月，Anthropic 将 MCP 正式捐赠给 Linux 基金会旗下新成立的 Agentic AI 基金会（AAIF），该基金会由以下组织共同创立和支持：

- **创始成员**：Anthropic、Block、OpenAI
- **支持成员**：Google、Microsoft、Amazon Web Services (AWS)、Cloudflare、Bloomberg 等

#### 行业采用情况

**主流平台支持**：
- **AI 模型平台**：Claude、ChatGPT、Copilot、Gemini、豆包等
- **开发工具**：Cursor IDE、VS Code、Windsurf、Cline
- **云服务平台**：AWS、Google Cloud、Azure、Cloudflare
- **操作系统**：Windows（2025 年 5 月宣布原生支持 MCP Host 接口）

**生态规模数据**：
- 全球超过 **10,000 个** 公开 MCP 服务器
- SDK 月下载量高达 **9700 万次**

---

## 第 2 章 MCP 核心架构

### 2.1 C/S 架构与三层设计

#### 概念定义

MCP 采用经典的**客户端 - 服务器（Client-Server）架构**，并在此基础上引入**Host（主机）** 概念，形成独特的**三层架构设计**：Host → Client → Server。这种设计让同一个 Host 只需实现一次 Client 逻辑，就能接驳任意数量的 Server，极大削减了传统"M×N"集成开销。

#### 三层架构详解

```
┌─────────────────────────────────────────────────────────────────┐
│                         Host 层                                  │
│  （Claude Desktop、Cursor IDE、Cline 等 AI 应用）                    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │   Client 1  │  │   Client 2  │  │   Client 3  │  ...        │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘             │
└─────────┼────────────────┼────────────────┼────────────────────┘
          │ 1:1 连接        │ 1:1 连接        │ 1:1 连接
          ▼                ▼                ▼
    ┌──────────┐     ┌──────────┐     ┌──────────┐
    │ Server 1 │     │ Server 2 │     │ Server 3 │
    │ (文件)   │     │ (数据库)  │     │ (GitHub) │
    └──────────┘     └──────────┘     └──────────┘
```

| 层级 | 角色定位 | 核心职责 | 运行位置 |
|------|----------|----------|----------|
| **Host** | "指挥官" | 创建/管理 Client 实例、聚合上下文、处理用户授权 | 用户设备（桌面应用、IDE） |
| **Client** | "翻译官"+"防火墙" | 协议协商、消息路由、会话管理、安全隔离 | Host 内部（库或微服务） |
| **Server** | "工人" | 提供 Tools、Resources、Prompts 能力 | 本地进程或远程服务 |

**常见误区**：
- ❌ 误区：Client 和 Server 是多对多关系
  - ✅ 正解：每个 Client 只与一个 Server 维持 1:1 长连接，保证会话状态和权限上下文不混淆

---

### 2.2 三大核心角色详解（Host, Client, Server）

#### Host（主机）

**主要功能**：

| 功能 | 说明 |
|------|------|
| **用户界面/API** | 提供 AI 交互的界面，接收用户指令 |
| **Client 管理** | 创建、销毁 Client 进程或线程 |
| **上下文聚合** | 聚合来自多个 Server 的上下文片段，注入给 LLM |
| **用户授权** | 处理用户授权，决定哪些 Server 可以被加载 |
| **安全策略** | 执行安全政策，提示用户确认高风险操作 |

**常见 Host 示例**：Claude 桌面版、Cursor IDE、Cline、Goose

#### Client（客户端）

**核心职责**：

| 职责 | 说明 |
|------|------|
| **连接建立** | 按协议完成握手、能力发现、会话保持与心跳 |
| **消息转发** | 转发 Tool 调用、Resource 读取、Prompt 拉取等请求 |
| **安全隔离** | 为每个服务器建立一个有状态的会话，保证 1:1 安全隔离 |

**设计要点**：
- **单连接原则**：每个 Client 只服务于一个 Server，保证会话状态和权限上下文不混淆

#### Server（服务器）

**核心职责**：

| 职责 | 说明 |
|------|------|
| **能力暴露** | 通过 MCP 原语（Tools、Resources、Prompts）暴露能力 |
| **独立运作** | 独立于 Host 运行，承担明确责任 |
| **请求响应** | 接收 Client 的请求，执行操作并返回结果 |

**Server 运行模式**：
- **本地进程**：作为子进程运行，通过 stdio 与 Client 通信
- **远程服务**：作为独立 HTTP 服务运行，通过 Streamable HTTP 与 Client 通信

---

### 2.3 三大核心能力（Resources, Tools, Prompts）

| 能力 | 定位 | 控制方 | 读写性 |
|------|------|--------|--------|
| **Resources** | "原材料" | Client 控制 | 只读 |
| **Tools** | "执行者" | Model 控制 | 可写 |
| **Prompts** | "剧本模板" | Client 控制 | 只读 |

#### Resources（资源）

**概念定义**：Resources 是 MCP 里用来暴露数据的核心机制，相当于给 LLM 提供"原材料"。可以把它想象成一个只读的数据库接口或者文件系统。

**核心特点**：
- **只读性**：Resources 是只读的，不能修改
- **应用控制**：客户端决定何时使用、如何使用
- **实时性**：支持订阅更新，资源变化时服务器通知客户端

**代码示例**：
```python
from fastmcp import FastMCP

mcp = FastMCP("ResourceServer")

# 静态文件资源
@mcp.resource(uri="file:///project/README.md", title="项目说明文档")
def get_readme() -> str:
    with open("project/README.md", "r", encoding="utf-8") as f:
        return f.read()

# 动态渲染资源（带参数）
@mcp.resource(uri="template://user-profile/{user_id}", title="用户档案")
def get_user_profile(user_id: str) -> str:
    return f"用户档案信息：{user_id}"
```

#### Tools（工具）

**概念定义**：Tools 是 MCP 里的"执行者"，让 LLM 不只是"嘴炮"，还能"干活"。服务器提供一些函数或者 API，LLM 可以直接调用去完成具体任务。

**核心特点**：
- **模型控制**：设计上是让 LLM 自动调用的（可加人工审核）
- **动态操作**：可以改变状态，如发送请求、写文件、控制硬件
- **有状态**：可以维护调用间的状态

**代码示例**：
```python
from fastmcp import FastMCP

mcp = FastMCP("ToolServer")

# 简单工具：数学计算
@mcp.tool()
def calculate_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """计算两点之间的地理距离（单位：公里）"""
    from math import radians, sin, cos, sqrt, atan2
    R = 6371  # 地球半径
    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)
    a = sin(dlat/2)**2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon/2)**2
    c = 2 * atan2(sqrt(a), sqrt(1-a))
    return R * c

# 带注解的工具（声明风险）
@mcp.tool()
@mcp.annotate(type="destructive", requires_confirmation=True)
def delete_file(path: str) -> dict:
    """删除指定文件（危险操作，需要用户确认）"""
    import os
    os.remove(path)
    return {"status": "success"}
```

#### Prompts（提示词模板）

**概念定义**：Prompts 是 MCP 的"模板大师"，提供预定义的交互模式或者推理指引。可以说它是 LLM 的"剧本"，告诉它怎么开口、怎么思考。

**代码示例**：
```python
from fastmcp import FastMCP

mcp = FastMCP("PromptServer")

# 简单提示词模板
@mcp.prompt()
def debug_error(error_code: str, error_message: str) -> str:
    """调试错误代码的提示词模板"""
    return f"""请分析以下错误：

错误代码：{error_code}
错误信息：{error_message}

请提供：
1. 错误原因分析
2. 可能的解决方案
3. 预防措施"""
```

---

### 2.4 传输层协议（stdio, HTTP/SSE, Streamable HTTP）

| 传输方式 | 类型 | 适用场景 | 状态 |
|----------|------|----------|------|
| **stdio** | 本地进程间通信 | 本地开发、调试、命令行工具 | 推荐（本地） |
| **HTTP + SSE** | 远程网络通信 | 云端部署、微服务 | 即将废弃 |
| **Streamable HTTP** | 远程网络通信 | 所有新的远程 MCP 服务器 | 推荐（远程） |

#### stdio（标准输入/输出）

**工作原理**：
- 客户端将 MCP 服务器作为子进程启动
- 服务器从 stdin 读取 JSON-RPC 消息，响应写入 stdout
- 每条消息以换行符分隔

**适用场景**：本地开发与调试、IDE 插件、命令行工具

#### Streamable HTTP（推荐）

**核心特点**：
- **单端点**：使用单一 HTTP 端点统一处理所有请求和响应
- **灵活响应**：服务器可选择返回标准 JSON 或 SSE 流式响应
- **会话管理**：支持 `Mcp-Session-Id` header，实现断线重连与状态恢复

**代码示例**：
```python
from fastmcp import FastMCP

mcp = FastMCP("MyServer")

if __name__ == "__main__":
    # 使用 HTTP 传输（默认 Streamable HTTP）
    mcp.run(transport='http', host='0.0.0.0', port=8000)
```

---

## 第 3 章 MCP 协议规范

### 3.1 消息格式与 JSON-RPC 基础

#### 概念定义

MCP 协议使用 **JSON-RPC 2.0** 作为客户端和服务器之间所有通信的消息格式。JSON-RPC 是一种基于 JSON 编码的轻量级远程过程调用（RPC）协议。

#### JSON-RPC 2.0 基础

**消息结构**：

```json
// 请求消息（Client → Server）
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "get_weather",
    "arguments": {
      "location": "上海"
    }
  }
}

// 成功响应（Server → Client）
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "location": "上海",
    "temperature": 20,
    "conditions": "晴朗"
  }
}

// 错误响应（Server → Client）
{
  "jsonrpc": "2.0",
  "id": 1,
  "error": {
    "code": -32602,
    "message": "Invalid location parameter",
    "data": "Additional error details"
  }
}
```

**预定义错误代码**：

| 错误代码 | 含义 |
|----------|------|
| -32700 | Parse error（解析错误） |
| -32600 | Invalid Request（无效请求） |
| -32601 | Method not found（方法不存在） |
| -32602 | Invalid params（无效参数） |
| -32603 | Internal error（内部错误） |

---

### 3.2 生命周期管理（初始化、运行、关闭）

#### 阶段一：初始化（Initializing）

```
┌──────────┐                          ┌──────────┐
│  Client  │                          │  Server  │
│          │                          │          │
│          │── initialize ──────────▶│          │
│          │   (协议版本、能力集)       │          │
│          │                          │          │
│          │◀──── initialize ─────────│          │
│          │   (服务器响应、能力集)     │          │
│          │                          │          │
│          │── initialized ─────────▶│          │
│          │   (通知：初始化完成)       │          │
│          │                          │          │
│          │      [会话正式建立]       │          │
└──────────┘                          └──────────┘
```

**initialize 请求示例**：
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "initialize",
  "params": {
    "protocolVersion": "2025-06-18",
    "capabilities": {
      "roots": {"listChanged": true},
      "sampling": {}
    },
    "clientInfo": {
      "name": "Claude Desktop",
      "version": "1.0.0"
    }
  }
}
```

#### 阶段二：运行（Operational）

初始化完成后，会话进入运行阶段。客户端可以：
- 调用 `tools/list` 确认可用工具
- 调用 `tools/call` 获取数据或执行操作
- 调用 `resources/list` 获取资源列表
- 调用 `resources/read` 读取资源内容

#### 阶段三：关闭（Closed）

当任务完成或超时时，会话终止，释放资源。

---

### 3.3 能力协商与版本控制

#### 能力协商机制

MCP 使用**基于能力（capability-based）的协商机制**。在初始化阶段，客户端和服务器会明确声明它们支持的功能，而这些能力决定了在会话期间可以使用哪些协议特性和原语。

**工作原理**：
1. **客户端声明**：在 `initialize` 请求中，客户端发送自己支持的能力集
2. **服务器响应**：服务器在 `initialize` 响应中返回自己支持的能力
3. **能力交集**：双方取能力交集，只有双方都支持的能力才能在会话中使用

**能力结构示意图**：
```json
{
  "clientCapabilities": {
    "roots": {"listChanged": true},
    "sampling": {}
  },
  "serverCapabilities": {
    "tools": {"listChanged": true},
    "resources": {"subscribe": true, "listChanged": true},
    "prompts": {}
  }
}
```

#### 版本控制策略

MCP 使用日期格式的版本号，如 `2025-06-18`，表示该版本的发布日期。

| 版本 | 发布日期 | 关键变更 |
|------|----------|----------|
| `2024-11-05` | 2024-11-05 | 初始版本，支持 stdio 和 HTTP+SSE 传输 |
| `2025-03-26` | 2025-03-26 | 引入 Streamable HTTP，移除 JSON-RPC 批处理 |
| `2025-06-18` | 2025-06-18 | 新增 Elicitation、OAuth 2.1、结构化输出 |

---

### 3.4 2025 年新特性（Elicitation、OAuth 2.1、结构化输出）

#### Elicitation（人机协同）

**概念定义**：Elicitation 是 MCP 2025 年新增的核心功能，通过 `elicitationRequest` 显式支持多轮次、人机交互。MCP 现在支持对话序列，而不是单一的一次性呼叫，允许工具和客户端协作以澄清和收集缺失或模棱两可的信息。

**工作流程**：
1. 客户端发送工具请求
2. 工具返回 `elicitationRequest`，询问缺失信息
3. 客户端提示用户并收集额外输入
4. 客户端发送 `continueElicitation` 请求，包含用户提供的信息
5. 工具继续处理并返回最终结果

#### OAuth 2.1 安全认证

**核心改进**：
- 废弃隐式授权流，从根源上减少 Token 泄露隐患
- 强制使用 PKCE，避免授权码在传输过程中被窃取
- 强化 Refresh Token 的绑定与验证
- 严格要求 HTTPS，减少明文传输风险
- 强制客户端实现 RFC 8707 的 Resource Indicators

#### 结构化输出（Structured Output）

**概念定义**：结构化输出允许工具声明 `outputSchema` 和 `structuredContent` 字段，实现类型安全的输出验证。

**代码示例**：
```json
{
  "name": "get_device_status",
  "outputSchema": {
    "type": "object",
    "properties": {
      "deviceId": {"type": "string"},
      "status": {"type": "string", "enum": ["up", "down", "maintenance"]},
      "uptimeSeconds": {"type": "integer"}
    },
    "required": ["deviceId", "status"]
  }
}
```

---

## 第 4 章 MCP 安全机制

### 4.1 零信任架构设计

#### 概念定义

**零信任（Zero Trust）**是一种安全模型，其核心原则是"永不信任，始终验证"（Never Trust, Always Verify）。在 MCP 架构中，零信任意味着不假设任何请求是可信的——无论它来自网络内部还是外部——所有请求都必须经过严格的身份认证、权限验证和持续监控。

#### 核心原则

**1. 最小权限原则（Principle of Least Privilege）**

每个组件、服务或用户只被授予完成其任务所需的最小权限。

**2. 动态策略评估**

每次请求都需要基于多维度上下文进行实时评估，包括：
- 用户身份和角色
- 设备合规状态
- 请求时间和位置
- 资源敏感度级别

**3. 端到端加密通信**

所有 MCP 通信必须使用 TLS 加密，防止中间人攻击和数据窃听。

---

### 4.2 权限控制与 Capability 声明

#### 概念定义

**Capability（能力）声明**是 MCP 安全模型的核心机制，用于明确定义 MCP Server 可以向 Client 暴露哪些功能和资源。每个 Capability 都必须显式声明，未经声明的能力对外部不可见。

#### Capability 注册机制

```python
from fastmcp import FastMCP

mcp = FastMCP("secure-server")

# 1. Tool 声明 - 需要参数验证和权限检查
@mcp.tool()
def read_file(path: str) -> str:
    """
    读取指定路径的文件内容
    
    权限要求：
    - 只能读取 /data/public 目录下的文件
    - 需要用户具有 reader 角色
    """
    if not path.startswith("/data/public/"):
        raise PermissionError("只能访问 /data/public 目录")
    
    with open(path, 'r') as f:
        return f.read()

# 2. Resource 声明 - 只读数据暴露
@mcp.resource("config://{app_name}/settings")
def get_app_settings(app_name: str) -> str:
    """获取应用程序配置（只读）"""
    ALLOWED_APPS = ["app-a", "app-b", "app-c"]
    if app_name not in ALLOWED_APPS:
        raise PermissionError(f"不允许访问应用：{app_name}")
    return f"Settings for {app_name}"
```

---

### 4.3 OAuth 2.0 资源服务器

#### OAuth 2.0 授权码模式流程

```
┌─────────┐     ┌─────────────┐     ┌───────────────┐     ┌──────────────┐
│  用户   │     │  MCP Client │     │ 授权服务器    │     │ MCP Server   │
│         │     │  (客户端)    │     │ (Auth Server) │     │ (资源服务器) │
└────┬────┘     └──────┬──────┘     └───────┬───────┘     └──────┬───────┘
     │                 │                     │                    │
     │  1. 需要授权     │                     │                    │
     │────────────────>│                     │                    │
     │                 │  2. 重定向到授权服务器 │                    │
     │                 │────────────────────>│                    │
     │                 │                     │  3. 用户登录并同意  │
     │                 │<────────────────────│                    │
     │                 │  4. 返回授权码       │                    │
     │                 │────────────────────>│                    │
     │                 │  5. 用授权码换 Token  │                    │
     │                 │<────────────────────│                    │
     │                 │  6. 携带令牌请求资源  │                    │
     │                 │─────────────────────────────────────────>│
     │                 │                     │  7. 验证令牌       │
     │                 │<─────────────────────────────────────────│
     │                 │  8. 返回受保护资源    │                    │
```

---

### 4.4 安全最佳实践与常见漏洞

#### 安全检查清单

部署 MCP Server 前，请完成以下检查：

- [ ] **身份验证**
  - [ ] 所有端点都需要身份验证
  - [ ] 使用 OAuth 2.0 或等效的安全协议
  - [ ] 令牌有合理的过期时间
  - [ ] 实现了令牌撤销机制

- [ ] **授权控制**
  - [ ] 实现了最小权限原则
  - [ ] 所有 Tool 都有权限检查
  - [ ] Resource 访问有白名单限制
  - [ ] 参数输入经过验证和清理

- [ ] **通信安全**
  - [ ] 所有通信使用 TLS 1.3 加密
  - [ ] 禁用了不安全的加密算法
  - [ ] 证书正确配置且未过期

- [ ] **审计与监控**
  - [ ] 记录了所有安全相关事件
  - [ ] 实现了异常检测和告警

---

## 第 5 章 MCP Server 开发实战（Python）

### 5.1 环境搭建

#### 开发环境要求

- Python 3.10 或更高版本（推荐 3.11+）
- pip 或 uv 包管理器
- 代码编辑器（VS Code、Cursor 等支持 MCP 的 IDE）

#### 安装步骤

```bash
# 1. 安装 uv 包管理器（推荐，比 pip 快 10-100 倍）
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"

# 2. 创建项目目录
mkdir mcp-weather-server
cd mcp-weather-server

# 3. 初始化项目并创建虚拟环境
uv init
uv venv
.\.venv\Scripts\Activate.ps1  # Windows PowerShell

# 4. 安装 MCP SDK
uv add "mcp[cli]"
uv add fastmcp

# 5. 验证安装
uv run mcp --version
```

---

### 5.2 Server 开发四步法

MCP Server 开发遵循"四步法"模式：

1. **定义工具（Tools）**：创建可供 LLM 调用的函数
2. **实现逻辑（Implementation）**：编写业务逻辑代码
3. **配置传输（Transport）**：选择通信方式（stdio 或 HTTP）
4. **发布部署（Deployment）**：配置并启动服务器

#### 快速示例

```python
from fastmcp import FastMCP

# 1. 创建服务器
mcp = FastMCP("weather-server")

# 2. 定义工具
@mcp.tool()
async def get_weather(city: str) -> dict:
    """获取指定城市的天气信息"""
    # 模拟数据（实际项目中使用真实 API）
    weather_data = {
        "beijing": {"temp": 25, "condition": "晴朗"},
        "shanghai": {"temp": 28, "condition": "多云"},
    }
    city_lower = city.lower()
    if city_lower in weather_data:
        data = weather_data[city_lower]
        return {
            "city": city,
            "temperature": data["temp"],
            "condition": data["condition"]
        }
    else:
        return {"error": f"未找到城市 '{city}' 的数据"}

# 3. 配置传输
if __name__ == "__main__":
    # 本地开发：使用 stdio
    mcp.run(transport="stdio")
    
    # 生产环境：使用 HTTP
    # mcp.run(transport="http", host="0.0.0.0", port=8000)
```

---

### 5.3 调试技巧与部署方案

#### 使用 MCP Inspector 调试

```bash
# 安装 MCP Inspector
npm install -g @modelcontextprotocol/inspector

# 启动 Inspector
npx @modelcontextprotocol/inspector python src/server.py
```

#### 部署方案

**Docker 部署**：
```dockerfile
FROM python:3.11-slim
WORKDIR /app
RUN pip install uv
COPY pyproject.toml uv.lock ./
COPY src/ ./src/
RUN uv sync --frozen --no-dev
EXPOSE 8000
CMD ["uv", "run", "fastmcp", "run", "src/server.py", \
     "--transport", "streamable-http", \
     "--host", "0.0.0.0", "--port", "8000"]
```

---

## 第 6 章 MCP Server 开发实战（TypeScript）

### 6.1 环境搭建

#### 开发环境要求

- Node.js 18+ LTS
- npm 或 pnpm 包管理器
- TypeScript 5.0+

#### 安装步骤

```bash
# 1. 创建项目目录
mkdir mcp-typescript-server
cd mcp-typescript-server

# 2. 初始化项目
npm init -y
npm install @modelcontextprotocol/sdk zod

# 3. 创建 TypeScript 配置
cat > tsconfig.json << EOF
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "esModuleInterop": true,
    "strict": true,
    "outDir": "./dist",
    "rootDir": "./src"
  }
}
EOF
```

---

### 6.2 TypeScript SDK API

#### 基本用法

```typescript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

const server = new McpServer({
  name: "my-server",
  version: "1.0.0"
});

// 注册工具
server.registerTool(
  "add",
  {
    title: "加法计算器",
    description: "计算两个数字的和",
    inputSchema: {
      a: z.number().describe("第一个数字"),
      b: z.number().describe("第二个数字")
    }
  },
  async ({ a, b }) => ({
    content: [{
      type: "text",
      text: String(a + b)
    }]
  })
);

// 注册资源
server.registerResource(
  "config",
  "config://app/settings",
  {
    title: "应用配置",
    description: "应用程序的配置信息"
  },
  async (uri) => ({
    contents: [{
      uri: uri.href,
      text: JSON.stringify({ theme: "dark", language: "zh-CN" })
    }]
  })
);
```

---

## 第 7 章 MCP Client 集成

### 7.1 Claude Desktop 配置方法

#### 配置文件路径

| 操作系统 | 配置文件路径 |
|----------|--------------|
| **Windows** | `%APPDATA%\Claude\claude_desktop_config.json` |
| **macOS** | `~/Library/Application Support/Claude/claude_desktop_config.json` |

#### 配置示例

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "C:/Users/kei/Documents"
      ]
    },
    "weather": {
      "command": "uv",
      "args": ["run", "fastmcp", "run", "C:/path/to/weather-server.py"]
    }
  }
}
```

---

### 7.2 VS Code + Cline 插件配置

#### 配置步骤

1. 安装 VS Code 和 Cline 插件
2. 在工作区设置 `.vscode/settings.json` 中配置 MCP

```json
{
  "mcp.servers": {
    "python-tools": {
      "command": "uvx",
      "args": ["mcp-tools", "--port", "3001"]
    },
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "${workspaceFolder}"
      ]
    }
  }
}
```

---

## 第 8 章 MCP 最佳实践与常见问题

### 8.1 设计模式与架构建议

#### 架构设计模式

**模式一：完全本地的 MCP Client**
- 适用场景：数据敏感性高、需要离线工作
- 技术栈：LlamaIndex + Ollama + LightningAI

**模式二：MCP 驱动的 Agentic RAG**
- 适用场景：需要结合私有知识库和网络信息
- 技术栈：Bright Data + Qdrant + Cursor

**模式三：星型架构（推荐用于企业）**
```
                ┌─────────────────┐
                │   MCP Gateway   │
                └────────┬────────┘
                         │
         ┌───────────────┼───────────────┐
         ▼               ▼               ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│  内部服务层      │ │  外部服务层      │ │  本地资源层      │
│  - CRM          │ │  - GitHub API   │ │  - 文件系统     │
│  - ERP          │ │  - Slack API    │ │  - 数据库       │
└─────────────────┘ └─────────────────┘ └─────────────────┘
```

#### 设计原则

1. **最小权限原则**：每个 MCP Server 只应暴露必要的功能
2. **职责分离**：将不同功能拆分为独立的 Server
3. **防御性编程**：对所有输入参数进行验证

---

### 8.2 性能优化技巧

#### 内存优化

- 使用 InMemoryEventStore 高效数据结构
- 实现事件清理机制，定期清理过期事件
- 限制并发会话数

#### 连接优化

```python
# 连接池模式
class ConnectionPool:
    def __init__(self, max_connections=10):
        self.max_connections = max_connections
        self.pool = asyncio.Queue(maxsize=max_connections)
    
    @asynccontextmanager
    async def get_connection(self):
        conn = await self.pool.get()
        try:
            yield conn
        finally:
            await self.pool.put(conn)
```

#### 响应优化

- 流式响应：对于大数据量操作使用流式返回
- 响应缓存：使用 lru_cache 缓存频繁查询结果

---

### 8.3 常见问题排查清单

#### 连接问题

| 症状 | 排查方向 | 解决方案 |
|------|----------|----------|
| 无法连接服务器 | 网络、端口、防火墙 | 检查服务器进程、验证端口连通性 |
| 协议版本不匹配 | MCP SDK 版本 | 升级到最新版本 |

#### 配置问题

| 症状 | 排查方向 | 解决方案 |
|------|----------|----------|
| 配置不生效 | JSON 格式错误 | 使用 jq 或 jsonlint 验证 |
| spawn ENOENT | 路径配置错误 | Windows 使用双反斜杠或正斜杠 |

#### 权限问题

| 症状 | 排查方向 | 解决方案 |
|------|----------|----------|
| 访问被拒绝 | 文件权限、API Key | 检查路径白名单、验证环境变量 |

---

### 8.4 MCP 未来发展方向

#### 路线图优先方向

1. **传输层演进与可扩展性**：解决 Session 粘滞与负载均衡问题
2. **安全与授权增强**：细粒度权限控制、动态授权撤销
3. **降低使用门槛**：配置管理工具、可视化配置界面
4. **社区与标准化**：Working Group 驱动、SEP 流程

#### 生态趋势

- **AI Agent 集成**：MCP 正成为 AI Agent 的"神经网络"
- **平台工程整合**：作为"驱动程序"让 AI 参与业务流程
- **企业级应用**：Block、Apollo 等企业已集成 MCP

---

## 附录

### A. 参考资源

- MCP 官方规范：https://github.com/modelcontextprotocol/specification
- TypeScript SDK：https://github.com/modelcontextprotocol/typescript-sdk
- Python SDK：https://github.com/modelcontextprotocol/python-sdk
- MCP 服务器目录：https://mcp.so

### B. 术语表

| 术语 | 说明 |
|------|------|
| Host | AI 应用程序（如 Claude Desktop、Cursor） |
| Client | Host 内部的组件，负责与 Server 通信 |
| Server | 提供 Tools、Resources、Prompts 能力的服务 |
| Tool | LLM 可调用的函数接口 |
| Resource | 只读数据访问，通过 URI 标识 |
| Prompt | 预定义的交互模板 |

---

*文档版本：1.0.0 | 最后更新：2026-04-03*

*本文档基于 25+ 个来源交叉验证编写，涵盖官方文档、技术博客、GitHub 仓库等*
