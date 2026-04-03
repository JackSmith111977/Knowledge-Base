# 第 2 章：MCP 核心架构

## 2.1 C/S 架构与三层设计

### 概念定义

MCP 采用经典的**客户端 - 服务器（Client-Server）架构**，并在此基础上引入了**Host（主机）** 概念，形成独特的**三层架构设计**：Host → Client → Server。这种设计让同一个 Host 只需实现一次 Client 逻辑，就能接驳任意数量的 Server，极大削减了传统"M×N"集成开销。

### 为什么需要三层架构？

在传统 C/S 架构中，客户端直接连接服务器。但 MCP 面临一个特殊挑战：**一个 AI 应用需要同时连接多个工具服务器**（文件系统、数据库、GitHub、Slack 等）。如果采用传统两层架构，会出现以下问题：

1. **连接管理复杂**：Host 应用需要直接管理多个服务器的连接、认证、会话状态
2. **安全边界模糊**：无法有效隔离不同服务器之间的权限和数据
3. **上下文聚合困难**：多个服务器的响应需要统一协调后注入给 LLM

MCP 的三层架构通过引入 Client 层解决了这些问题。

### 三层架构详解

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

### 工作原理

**消息流转过程**：

1. **请求方向**（用户 → Server）：
   - 用户在 Host 中发起请求（如"帮我查下天气"）
   - Host 将请求路由给对应的 Client 实例
   - Client 通过协议将请求转发给 Server
   - Server 执行实际操作并返回结果

2. **响应方向**（Server → 用户）：
   - Server 返回执行结果
   - Client 将结果转发给 Host
   - Host 聚合多个 Client 的上下文
   - LLM 基于完整上下文生成响应，展示给用户

**安全边界**：Host 在进程级别隔离各 Client，即使一个 Server 被攻破，也无法越过 Client 边界直接窃取另一个 Server 的机密令牌或数据。

### 代码示例：Host 创建和管理多个 Client

```typescript
// Host 应用程序内部伪代码
class MCPHost {
  private clients: Map<string, MCPClient> = new Map();

  // 创建新的 Client 实例连接 Server
  async connectServer(serverId: string, serverConfig: ServerConfig) {
    const client = new MCPClient({
      transport: serverConfig.transport, // 'stdio' | 'http'
      endpoint: serverConfig.endpoint
    });

    // 初始化连接（触发握手和能力协商）
    await client.initialize({
      protocolVersion: "2025-06-18",
      capabilities: { roots: true, sampling: true }
    });

    this.clients.set(serverId, client);
  }

  // 聚合多个 Client 的上下文
  async aggregateContext(): Promise<Context> {
    const contexts = await Promise.all(
      Array.from(this.clients.values()).map(c => c.getContext())
    );
    return { items: contexts.flat() };
  }

  // 调用特定 Server 的工具
  async callTool(serverId: string, toolName: string, args: any) {
    const client = this.clients.get(serverId);
    if (!client) throw new Error(`Server ${serverId} not connected`);
    return await client.callTool(toolName, args);
  }
}
```

**常见误区**：
- ❌ 误区：Client 和 Server 是多对多关系
  - ✅ 正解：每个 Client 只与一个 Server 维持 1:1 长连接，保证会话状态和权限上下文不混淆
- ❌ 误区：Host 可以直接与 Server 通信
  - ✅ 正解：Host 必须通过 Client 与 Server 通信，Client 是唯一的通信桥梁

**来源**：
- https://blog.csdn.net/IOIO_/article/details/158773480
- https://blog.csdn.net/i042416/article/details/148638515
- https://blog.csdn.net/qq_33778762/article/details/147990225
- https://download.csdn.net/blog/column/12571194/147313094

---

## 2.2 三大核心角色详解（Host, Client, Server）

### Host（主机）

**概念定义**：
Host 代表任何提供 AI 交互环境、访问外部工具和数据源的应用程序。Host 是负责运行 MCP Client 的 AI 应用，是用户直接接触的"调度与沙箱"。

**主要功能**：

| 功能 | 说明 |
|------|------|
| **用户界面/API** | 提供 AI 交互的界面，接收用户指令 |
| **Client 管理** | 创建、销毁 Client 进程或线程 |
| **上下文聚合** | 聚合来自多个 Server 的上下文片段，注入给 LLM |
| **用户授权** | 处理用户授权，决定哪些 Server 可以被加载，哪些 Tool 可以被调用 |
| **安全策略** | 执行安全政策和同意要求，提示用户确认高风险操作 |
| **会话状态** | 维护会话状态和上下文 |

**常见 Host 示例**：
- Claude 桌面版
- Cursor IDE
- Cline
- Goose
- 其他集成 MCP 的 AI 应用程序

**安全边界实现**：
- 进程级隔离：把未知 Server 运行在 Docker 容器或 Windows AppContainer 中
- 最小权限原则：启用最小权限文件系统映射
- 用户确认：在 UI 层面提示用户确认潜在高风险操作（如文件写入、网络请求）

### Client（客户端）

**概念定义**：
Client 在 Host 内运行，实现与 MCP Servers 的通信。Client 常以库或微服务形式内嵌到 Host 中，是"翻译官"与"防火墙"。

**核心职责**：

| 职责 | 说明 |
|------|------|
| **连接建立** | 按协议完成握手、能力发现、会话保持与心跳 |
| **消息转发** | 转发 Tool 调用、Resource 读取、Prompt 拉取等请求 |
| **事件流转** | 将 Server push 的进度事件流转给 Host（SSE、streamable-http 或 stdio） |
| **安全隔离** | 为每个服务器建立一个有状态的会话，保证 1:1 安全隔离 |
| **协议协商** | 处理协议协商和能力交换，路由协议消息双向传输 |
| **边界维护** | 维护服务器之间的安全边界 |

**设计要点**：
- **单连接原则**：每个 Client 只服务于一个 Server，保证会话状态和权限上下文不混淆
- **状态管理**：维护与 Server 的有状态连接，包括会话 ID、能力协商结果等

### Server（服务器）

**概念定义**：
Server 是实际提供能力的"工人"，独立于 Host 运行，专注于实现特定且明确的能力。Server 通过 MCP 协议提供资源、工具和提示词。

**核心职责**：

| 职责 | 说明 |
|------|------|
| **能力暴露** | 通过 MCP 原语（Tools、Resources、Prompts）暴露能力 |
| **独立运作** | 独立于 Host 运行，承担明确责任 |
| **安全限制** | 必须遵守安全限制，只接收必要的上下文信息 |
| **请求响应** | 接收 Client 的请求，执行操作并返回结果 |

**Server 运行模式**：
- **本地进程**：作为子进程运行，通过 stdio 与 Client 通信
- **远程服务**：作为独立 HTTP 服务运行，通过 Streamable HTTP 与 Client 通信

**代码示例：MCP Server 实现**

```python
from fastmcp import FastMCP

# 创建 MCP 服务器
mcp = FastMCP("WeatherServer")

# 暴露 Tools（可执行操作）
@mcp.tool()
def get_weather(location: str) -> dict:
    """获取指定地区的天气信息"""
    # 实际调用天气 API
    return {
        "location": location,
        "temperature": 20,
        "conditions": "晴朗",
        "humidity": 65
    }

# 暴露 Resources（只读数据）
@mcp.resource(uri="file:///config/weather-config.json")
def get_config() -> str:
    """读取配置文件"""
    with open("config/weather-config.json", "r") as f:
        return f.read()

# 暴露 Prompts（提示词模板）
@mcp.prompt()
def weather_report_template(city: str) -> str:
    """天气报告模板"""
    return f"请为{city}生成一份详细的天气报告，包括温度、湿度、风速等信息。"

if __name__ == "__main__":
    mcp.run(transport='stdio')
```

**常见误区**：
- ❌ 误区：Server 可以读取完整的 LLM 对话历史
  - ✅ 正解：Server 只接收必要的上下文信息，不读取完整对话历史，保护用户隐私
- ❌ 误区：一个 Client 可以连接多个 Server
  - ✅ 正解：每个 Client 只与一个 Server 维持 1:1 连接

**来源**：
- https://blog.csdn.net/IOIO_/article/details/158773480
- https://blog.csdn.net/i042416/article/details/148638515
- https://blog.csdn.net/qq_33778762/article/details/147990225
- https://blog.csdn.net/asd343442/article/details/153575808

---

## 2.3 三大核心能力（Resources, Tools, Prompts）

### 概念定义

MCP 服务器通过三种核心原语（Primitives）暴露能力：

| 能力 | 定位 | 控制方 | 读写性 |
|------|------|--------|--------|
| **Resources** | "原材料" | Client 控制 | 只读 |
| **Tools** | "执行者" | Model 控制 | 可写 |
| **Prompts** | "剧本模板" | Client 控制 | 只读 |

---

### Resources（资源）

**概念定义**：
Resources 是 MCP 里用来暴露数据的核心机制，相当于给 LLM 提供"原材料"。可以把它想象成一个只读的数据库接口或者文件系统，里面装的是静态或者半动态的信息。

**工作原理**：
- 服务器（MCP Server）把数据暴露出来
- 客户端（LLM 应用）可以读取它们，然后塞进模型的上下文里去推理或者生成内容
- 客户端决定何时使用、如何使用这些资源

**核心特点**：

| 特点 | 说明 |
|------|------|
| **只读性** | Resources 是只读的，不能修改 |
| **应用控制** | 客户端决定何时使用、如何使用 |
| **实时性** | 支持订阅更新，资源变化时服务器通知客户端 |
| **结构化** | 数据以结构化方式暴露，便于 LLM 理解 |

**代码示例**：

```python
from fastmcp import FastMCP

mcp = FastMCP("ResourceServer")

# 静态文件资源
@mcp.resource(
    uri="file:///project/README.md",
    title="项目说明文档",
    description="项目的 README 文档，包含项目概述和使用说明"
)
def get_readme() -> str:
    with open("project/README.md", "r", encoding="utf-8") as f:
        return f.read()

# 动态渲染资源（带参数）
@mcp.resource(
    uri="template://user-profile/{user_id}",
    title="用户档案",
    description="根据用户 ID 动态获取用户档案信息"
)
def get_user_profile(user_id: str) -> str:
    # 从数据库获取用户信息
    user = db.query("SELECT * FROM users WHERE id = ?", user_id)
    return f"用户：{user.name}\n邮箱：{user.email}\n角色：{user.role}"

# 列表资源（动态内容）
@mcp.resource(
    uri="list://recent-errors",
    title="最近错误日志",
    description="最近 10 条错误日志"
)
def get_recent_errors() -> str:
    errors = db.query("SELECT * FROM errors ORDER BY timestamp DESC LIMIT 10")
    return "\n".join([f"[{e.timestamp}] {e.message}" for e in errors])
```

**Resources vs RAG 的区别**：
- **RAG**：检索式的，每次根据查询动态检索相关片段
- **Resources**：主动注入的，LLM 可以按需读取完整内容
- 两者可以配合使用：Resources 提供结构化的项目文档，RAG 提供历史需求的语义检索

**直白例子**：Resources 就像你家冰箱，里面有牛奶、鸡蛋（资源），你（LLM）想做蛋糕就自己去拿，但冰箱不会帮你打鸡蛋。

---

### Tools（工具）

**概念定义**：
Tools 是 MCP 里的"执行者"，让 LLM 不只是"嘴炮"，还能"干活"。服务器提供一些函数或者 API，LLM 可以直接调用去完成具体任务。

**工作原理**：
- 服务器定义好工具（如"计算两点距离"或"发个邮件"）
- 客户端发现这些工具后，LLM 就能根据需要调用
- 调用完成后结果返回给 LLM，继续推理或者输出

**核心特点**：

| 特点 | 说明 |
|------|------|
| **模型控制** | 设计上是让 LLM 自动调用的（可加人工审核） |
| **动态操作** | 可以改变状态，如发送请求、写文件、控制硬件 |
| **灵活性** | 从简单计算到复杂 API 调用都能做 |
| **有状态** | 可以维护调用间的状态 |

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

# 复杂工具：发送邮件
@mcp.tool()
async def send_email(to: str, subject: str, body: str) -> dict:
    """发送邮件"""
    import smtplib
    from email.mime.text import MIMEText
    
    msg = MIMEText(body)
    msg['Subject'] = subject
    msg['From'] = 'sender@example.com'
    msg['To'] = to
    
    try:
        server = smtplib.SMTP('smtp.example.com')
        server.send_message(msg)
        server.quit()
        return {"status": "success", "message": "邮件发送成功"}
    except Exception as e:
        return {"status": "error", "message": str(e)}

# 带注解的工具（声明风险）
@mcp.tool()
@mcp.annotate(type="destructive", requires_confirmation=True)
def delete_file(path: str) -> dict:
    """删除指定文件（危险操作，需要用户确认）"""
    import os
    try:
        os.remove(path)
        return {"status": "success", "message": f"文件 {path} 已删除"}
    except Exception as e:
        return {"status": "error", "message": str(e)}
```

**直白例子**：Tools 就像你家的电钻，想在墙上打洞就直接用，不用自己拿拳头砸墙。

**安全风险**：如果不设限制，LLM 调用 Tools 可能会搞乱系统，如删文件、发垃圾邮件。因此需要：
- 工具注解（Annotations）声明风险等级
- 高风险操作需要用户确认
- 基于能力的细粒度权限控制

---

### Prompts（提示词模板）

**概念定义**：
Prompts 是 MCP 的"模板大师"，提供预定义的交互模式或者推理指引。可以说它是 LLM 的"剧本"，告诉它怎么开口、怎么思考。

**工作原理**：
- 服务器定义好一堆 Prompt 模板（如"写个产品描述"或"调试错误"）
- 客户端可以直接选一个，填入参数，然后丢给 LLM 执行
- 标准化输出，避免每次从头编写提示词

**核心特点**：

| 特点 | 说明 |
|------|------|
| **预设模板** | 提供标准化的交互模式 |
| **参数化** | 支持填入动态参数 |
| **可复用** | 一次定义，多次使用 |
| **规范化** | 确保输出格式一致 |

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

# 复杂提示词模板（多步骤推理）
@mcp.prompt()
def code_review_template(code: str, language: str = "Python") -> str:
    """代码审查提示词模板"""
    return f"""请对以下{language}代码进行审查：

```{language}
{code}
```

审查要点：
1. **代码正确性**：是否存在逻辑错误或潜在 bug？
2. **性能**：是否有性能优化空间？
3. **安全性**：是否存在安全漏洞？
4. **可读性**：代码是否清晰易懂？
5. **最佳实践**：是否符合语言的最佳实践？

请逐项分析并提供具体改进建议。"""

# 带条件分支的提示词
@mcp.prompt()
def sql_query_helper(table_name: str, operation: str) -> str:
    """SQL 查询辅助提示词"""
    if operation == "select":
        return f"请生成查询 {table_name} 表的 SQL 语句，包含所有字段，并按创建时间降序排序。"
    elif operation == "insert":
        return f"请生成向 {table_name} 表插入数据的 SQL 语句，包含必填字段。"
    elif operation == "update":
        return f"请生成更新 {table_name} 表数据的 SQL 语句，需要 WHERE 条件。"
    else:
        return f"请生成操作 {table_name} 表的 SQL 语句，操作类型：{operation}。"
```

**常见误区**：
- ❌ 误区：Prompts 只是简单的文本模板
  - ✅ 正解：Prompts 可以包含复杂的推理指引和多步骤交互逻辑

**来源**：
- https://blog.csdn.net/twc829/article/details/159324286
- https://blog.csdn.net/HoldBelief/article/details/158962109
- https://mp.weixin.qq.com/s?__biz=MzI2MzEwNTY3OQ==&mid=2648990323&idx=1&sn=91a158372b234da838b2844436ca2965
- https://blog.csdn.net/m0_63309778/article/details/149197705

---

## 2.4 传输层协议（stdio, HTTP/SSE, Streamable HTTP）

### 概念定义

MCP 协议定义了两类三种传输方式，用于在 Client 和 Server 之间传递 JSON-RPC 消息：

| 传输方式 | 类型 | 适用场景 | 状态 |
|----------|------|----------|------|
| **stdio** | 本地进程间通信 | 本地开发、调试、命令行工具 | 推荐（本地） |
| **HTTP + SSE** | 远程网络通信 | 云端部署、微服务 | 即将废弃 |
| **Streamable HTTP** | 远程网络通信 | 所有新的远程 MCP 服务器 | 推荐（远程） |

---

### stdio（标准输入/输出）

**概念定义**：
stdio 传输是 MCP 中最简单直接的通信方式，用于本地进程间的通信。客户端将 MCP 服务器作为子进程启动，通过标准输入输出管道传递消息。

**工作原理**：

```
┌─────────────┐                    ┌─────────────┐
│   Client    │                    │   Server    │
│             │   stdin ──────────▶│             │
│             │◀────────── stdout   │             │
│             │   (stderr for logs) │             │
└─────────────┘                    └─────────────┘
```

**核心特点**：

| 特点 | 说明 |
|------|------|
| **进程模型** | 客户端将 MCP 服务器作为子进程启动 |
| **消息传递** | 服务器从 stdin 读取 JSON-RPC 消息，响应写入 stdout |
| **消息格式** | 每条消息以换行符分隔，消息内部不能包含换行符 |
| **日志处理** | 服务器可以向 stderr 写入日志，客户端可选择捕获、转发或忽略 |
| **性能最优** | 延迟最低，无需网络配置 |
| **生命周期** | 服务器生命周期与客户端绑定 |

**代码示例**：

```python
# Server 端代码
import sys
import json

def send_response(response: dict):
    """发送响应消息（写入 stdout）"""
    sys.stdout.write(json.dumps(response) + "\n")
    sys.stdout.flush()

def read_request():
    """读取请求消息（从 stdin）"""
    line = sys.stdin.readline()
    return json.loads(line)

# 主循环
while True:
    request = read_request()
    # 处理请求
    result = process_request(request)
    send_response({"jsonrpc": "2.0", "id": request["id"], "result": result})
```

```json
// Client 端配置（Claude Desktop）
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/files"]
    }
  }
}
```

**适用场景**：
- 本地开发与调试
- IDE 插件与本地 MCP 服务器交互
- 命令行工具
- 批处理任务

**优势与局限**：

| 优势 | 局限 |
|------|------|
| 无需网络，部署简单且安全性高 | 同步阻塞模型，无法高效处理并发请求 |
| 适合资源受限环境，开销低 | 不支持跨主机通信 |
| 性能最优，延迟最低 | 服务器生命周期与客户端绑定 |

---

### HTTP + SSE（服务器发送事件）

**概念定义**：
HTTP + SSE 是一种基于 HTTP 协议的远程通信机制，使用两个独立的端点实现双向通信：客户端通过 HTTP POST 发送请求，服务器通过 SSE 推送响应。

**工作原理**：

```
┌─────────────┐                         ┌─────────────┐
│   Client    │                         │   Server    │
│             │──POST /messages ───────▶│             │
│             │                         │             │
│◀════════════════════ SSE ═════════════│             │
│  /sse 事件流响应                         │             │
└─────────────┘                         └─────────────┘
```

**核心特点**：

| 特点 | 说明 |
|------|------|
| **双端点** | 需要两个独立连接：POST 端点 + SSE 端点 |
| **单向推送** | SSE 主要支持从服务器到客户端的单向数据流 |
| **兼容性好** | 基于标准 HTTP 协议，易于穿越防火墙和代理 |
| **即将废弃** | 从 2025-03-26 协议版本开始，已被 Streamable HTTP 替代 |

**工作流程**：
1. 客户端连接到服务器的 `/sse` 端点
2. 服务器响应一个 `endpoint event`，告知客户端使用哪个 URI 发送消息（如 `/messages`）
3. 客户端通过 HTTP POST 向 `/messages` 发送请求
4. 服务器通过 SSE 流推送响应

**适用场景**：
- 云端部署（历史项目）
- Web UI、微服务或分布式应用
- 需要服务器主动推送事件的场景

**常见误区**：
- ❌ 误区：HTTP+SSE 仍是推荐的远程传输方式
  - ✅ 正解：从 2025-03-26 版本开始，SSE 已被标记为"即将废弃"，推荐使用 Streamable HTTP

---

### Streamable HTTP（推荐）

**概念定义**：
Streamable HTTP 是 MCP 当前推荐的标准传输方式，用于远程通信。它使用单一的 HTTP 端点统一处理请求和响应，支持标准 HTTP 响应或 SSE 流式响应。

**工作原理**：

```
┌─────────────┐                         ┌─────────────┐
│   Client    │                         │   Server    │
│             │──POST /mcp ───────────▶│             │
│             │                         │             │
│             │◀──── application/json ──│             │
│             │    或                    │             │
│             │◀════ text/event-stream ══│             │
└─────────────┘                         └─────────────┘
```

**核心特点**：

| 特点 | 说明 |
|------|------|
| **单端点** | 使用单一 HTTP 端点统一处理所有请求和响应 |
| **灵活响应** | 服务器可选择返回标准 JSON 或 SSE 流式响应 |
| **会话管理** | 支持 `Mcp-Session-Id` header，实现断线重连与状态恢复 |
| **双向通信** | 客户端可发起 GET 请求建立 SSE 流，供服务器主动推送 |

**请求头要求**：
```
POST /mcp HTTP/1.1
Host: example.com
Accept: application/json, text/event-stream
Content-Type: application/json
```

**服务器响应选项**：
1. **标准 JSON 响应**（一次性返回）：
   ```
   Content-Type: application/json
   {"jsonrpc": "2.0", "id": 1, "result": {...}}
   ```

2. **SSE 流式响应**（逐渐发送）：
   ```
   Content-Type: text/event-stream
   data: {"jsonrpc": "2.0", "method": "progress", "params": {"progress": 50}}
   data: {"jsonrpc": "2.0", "id": 1, "result": {...}}
   ```

**会话管理**：
```http
# 初始化响应中服务器返回会话 ID
HTTP/1.1 200 OK
Mcp-Session-Id: abc123

# 客户端后续请求必须包含该 header
POST /mcp HTTP/1.1
Mcp-Session-Id: abc123
```

**代码示例**：

```python
# 使用 FastMCP 启动 Streamable HTTP 服务器
from fastmcp import FastMCP

mcp = FastMCP("MyServer")

@mcp.tool()
def get_weather(location: str) -> dict:
    return {"location": location, "temperature": 20}

if __name__ == "__main__":
    # 使用 HTTP 传输（默认 Streamable HTTP）
    mcp.run(transport='http', host='0.0.0.0', port=8000)
```

**适用场景**：
- 所有新的需要远程访问的 MCP 服务器开发
- 高并发、低延迟的分布式系统
- 需要双向实时交互的 Web 应用

**三种传输方式对比**：

| 对比维度 | stdio | HTTP+SSE | Streamable HTTP |
|----------|-------|----------|-----------------|
| **部署位置** | 本地 | 远程 | 远程 |
| **端点数量** | N/A | 2 个 | 1 个 |
| **通信方向** | 双向 | 双向（复杂） | 双向（简单） |
| **会话管理** | 进程绑定 | 无 | 支持 |
| **断线重连** | 不支持 | 不支持 | 支持 |
| **协议状态** | 推荐 | 即将废弃 | 推荐 |

**常见误区**：
- ❌ 误区：Streamable HTTP 和 HTTP+SSE 没有区别
  - ✅ 正解：Streamable HTTP 使用单端点，简化架构，支持会话管理和断线重连

**来源**：
- https://blog.csdn.net/weixin_48321392/article/details/158502657
- https://chengaoyi.blog.csdn.net/article/details/158502657
- https://blog.csdn.net/2402_87515571/article/details/157587787
- https://blog.csdn.net/gitblog_00433/article/details/150699953
- https://blog.csdn.net/WANGJUNAIJIAO/article/details/150290383
- https://blog.csdn.net/ChinaLiaoTian/article/details/151312675
- https://blog.csdn.net/weixin_65514978/article/details/152800110

---

## 本章总结

### 核心要点回顾

1. **三层架构**：Host（指挥官）→ Client（翻译官/防火墙）→ Server（工人）
2. **Client 原则**：每个 Client 只与一个 Server 维持 1:1 连接
3. **三大能力**：Resources（只读数据）、Tools（可执行操作）、Prompts（提示词模板）
4. **传输方式**：本地用 stdio（推荐），远程用 Streamable HTTP（推荐）

### 第 3 章预告

第 3 章将深入解析 MCP 协议规范，包括：
- JSON-RPC 2.0 消息格式详解
- 生命周期管理（初始化、运行、关闭）
- 能力协商与版本控制
- 2025 年新特性（Elicitation、OAuth 2.1、结构化输出）

**来源**：
- 本章所有来源已在上文各节标注
