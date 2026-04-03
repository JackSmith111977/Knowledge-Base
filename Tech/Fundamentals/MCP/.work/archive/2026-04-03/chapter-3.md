# 第 3 章：MCP 协议规范

## 3.1 消息格式与 JSON-RPC 基础

### 概念定义

MCP 协议使用 **JSON-RPC 2.0** 作为客户端和服务器之间所有通信的消息格式。JSON-RPC 是一种基于 JSON 编码的轻量级远程过程调用（RPC）协议，具有易于阅读和调试、支持在任何编程环境中实现、规格清晰应用广泛等特点。

### JSON-RPC 2.0 基础

**消息结构**：

JSON-RPC 2.0 定义了三种消息类型：**请求（Request）**、**响应（Response）** 和**通知（Notification）**。

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

// 通知消息（单向，无需响应）
{
  "jsonrpc": "2.0",
  "method": "notifications/progress",
  "params": {
    "progressToken": "abc123",
    "progress": 50
  }
}
```

### 消息字段详解

**请求消息（Request）**：

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `jsonrpc` | String | 是 | 必须为 "2.0" |
| `id` | Number/String | 是 | 唯一标识符，用于匹配请求和响应 |
| `method` | String | 是 | 要调用的方法名（如 "tools/call"） |
| `params` | Object | 否 | 方法所需的参数 |

**响应消息（Response）**：

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `jsonrpc` | String | 是 | 必须为 "2.0" |
| `id` | Number/String | 是 | 与对应 Request 相同的 id |
| `result` | Object | 条件必填 | 成功结果（与 error 互斥） |
| `error` | Object | 条件必填 | 错误信息（与 result 互斥） |

**错误对象结构**：

| 字段 | 类型 | 说明 |
|------|------|------|
| `code` | Number | 错误代码（-32768 到 -32000 为预定义错误） |
| `message` | String | 错误描述 |
| `data` | Any | 可选的额外错误信息 |

**预定义错误代码**：

| 错误代码 | 含义 |
|----------|------|
| -32700 | Parse error（解析错误） |
| -32600 | Invalid Request（无效请求） |
| -32601 | Method not found（方法不存在） |
| -32602 | Invalid params（无效参数） |
| -32603 | Internal error（内部错误） |

### MCP 特定方法

MCP 协议在 JSON-RPC 2.0 基础上定义了一系列特定方法：

| 方法 | 方向 | 说明 |
|------|------|------|
| `initialize` | Client → Server | 初始化握手，协商协议版本和能力 |
| `notifications/initialized` | Client → Server | 通知服务器初始化完成 |
| `tools/list` | Client → Server | 获取可用工具列表 |
| `tools/call` | Client → Server | 调用指定工具 |
| `resources/list` | Client → Server | 获取可用资源列表 |
| `resources/read` | Client → Server | 读取指定资源 |
| `prompts/list` | Client → Server | 获取提示词模板列表 |
| `prompts/get` | Client → Server | 获取指定提示词模板 |

### 代码示例：完整的工具调用流程

```json
// 1. 客户端列出可用工具
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/list"
}

// 2. 服务器响应工具列表
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "tools": [
      {
        "name": "get_weather",
        "description": "获取指定地区的天气信息",
        "inputSchema": {
          "type": "object",
          "properties": {
            "location": {
              "type": "string",
              "description": "地区名称"
            }
          },
          "required": ["location"]
        }
      },
      {
        "name": "send_email",
        "description": "发送邮件",
        "inputSchema": {
          "type": "object",
          "properties": {
            "to": {"type": "string"},
            "subject": {"type": "string"},
            "body": {"type": "string"}
          },
          "required": ["to", "subject", "body"]
        }
      }
    ]
  }
}

// 3. 客户端调用工具
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/call",
  "params": {
    "name": "get_weather",
    "arguments": {
      "location": "上海"
    }
  }
}

// 4. 服务器返回工具执行结果
{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "上海当前天气：晴朗，温度 20°C，湿度 65%"
      }
    ]
  }
}
```

### 通知消息（Notification）

通知是单向消息，不需要响应，通常用于进度更新、事件推送等场景：

```json
// 进度通知
{
  "jsonrpc": "2.0",
  "method": "notifications/progress",
  "params": {
    "progressToken": "abc123",
    "progress": 50,
    "message": "正在处理数据..."
  }
}

// 资源更新通知
{
  "jsonrpc": "2.0",
  "method": "notifications/resources/updated",
  "params": {
    "uris": ["file:///config/app.json"]
  }
}
```

**常见误区**：
- ❌ 误区：通知消息需要服务器响应
  - ✅ 正解：通知是单向消息，服务器不返回响应
- ❌ 误区：JSON-RPC 批处理仍被支持
  - ✅ 正解：2025-03-26 版本移除了 JSON-RPC 批处理支持

**来源**：
- https://blog.csdn.net/sgr011215/article/details/159083770
- https://blog.csdn.net/lgp10122/article/details/158210050
- https://blog.csdn.net/Y525698136/article/details/149093315
- https://www.cnblogs.com/mcpmarket/p/18963503
- https://blog.csdn.net/m0_56255097/article/details/147246802

---

## 3.2 生命周期管理（初始化、运行、关闭）

### 概念定义

MCP 会话的生命周期管理涵盖了会话从创建到终止的全过程，确保交互的连贯性和资源的合理利用。生命周期分为三个阶段：**初始化阶段（Initializing）**、**运行阶段（Operational）** 和**关闭阶段（Closed）**。

### 阶段一：初始化（Initializing）

初始化是客户端与服务器建立通信的第一步，确保双方能够以一致的方式进行交互。初始化过程包括**握手**、**版本协商**和**能力声明**三个关键步骤。

**工作流程**：

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
// Client → Server: initialize 请求
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "initialize",
  "params": {
    "protocolVersion": "2025-06-18",
    "capabilities": {
      "roots": {
        "listChanged": true
      },
      "sampling": {}
    },
    "clientInfo": {
      "name": "Claude Desktop",
      "version": "1.0.0"
    }
  }
}

// Server → Client: initialize 响应
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "protocolVersion": "2025-06-18",
    "capabilities": {
      "tools": {
        "listChanged": true
      },
      "resources": {
        "subscribe": true,
        "listChanged": true
      },
      "prompts": {}
    },
    "serverInfo": {
      "name": "WeatherServer",
      "version": "1.0.0"
    }
  }
}

// Client → Server: initialized 通知（无需响应）
{
  "jsonrpc": "2.0",
  "method": "notifications/initialized"
}
```

**初始化参数说明**：

| 参数 | 说明 |
|------|------|
| `protocolVersion` | 客户端支持的协议版本 |
| `capabilities` | 客户端支持的能力集（如 roots、sampling） |
| `clientInfo` | 客户端信息（名称、版本） |

### 阶段二：运行（Operational）

初始化完成后，会话进入运行阶段。这是最繁忙的阶段，客户端可以：

- 调用 `tools/list` 确认可用工具
- 调用 `tools/call` 获取数据或执行操作
- 调用 `resources/list` 获取资源列表
- 调用 `resources/read` 读取资源内容
- 调用 `prompts/list` 和 `prompts/get` 获取提示词模板
- 接收服务器的通知消息（进度更新、资源变更等）

**运行阶段特点**：
- **异步通信**：请求和响应是异步的，客户端可以同时发起多个请求
- **状态保持**：服务器可以记住客户端的请求历史和相关上下文
- **订阅机制**：客户端可以订阅资源变更，服务器主动推送通知

**代码示例：运行阶段典型交互**

```json
// 客户端列出所有可用工具
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/list"
}

// 客户端调用工具
{
  "jsonrpc": "2.0",
  "id": 3,
  "method": "tools/call",
  "params": {
    "name": "get_weather",
    "arguments": {
      "location": "北京"
    }
  }
}

// 服务器返回工具执行结果
{
  "jsonrpc": "2.0",
  "id": 3,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "北京当前天气：多云，温度 15°C"
      }
    ]
  }
}

// 服务器主动推送进度通知
{
  "jsonrpc": "2.0",
  "method": "notifications/progress",
  "params": {
    "progressToken": "task-001",
    "progress": 75,
    "message": "正在加载数据..."
  }
}
```

### 阶段三：关闭（Closed）

当任务完成或超时时，会话终止，释放资源。

**关闭方式**：

| 关闭方式 | 说明 |
|----------|------|
| **正常关闭** | 客户端发送关闭请求，服务器确认后关闭连接 |
| **超时关闭** | 会话超过指定时间无活动，自动关闭 |
| **异常关闭** | 发生错误时强制关闭连接 |

**stdio 传输的优雅关闭序列**：

```python
# 客户端终止连接时的优雅关闭
async def close_session(self):
    # 1. 发送关闭通知
    await self.send_notification("notifications/closing")
    
    # 2. 等待服务器确认
    await asyncio.sleep(0.1)
    
    # 3. 关闭输出流
    await self.stdout.close()
    
    # 4. 终止服务器进程
    self.process.terminate()
    
    # 5. 等待进程退出
    await self.process.wait()
```

### 会话管理（Streamable HTTP）

在 Streamable HTTP 传输中，服务器可选择在初始化响应中返回 `Mcp-Session-Id` header，用于会话管理：

```http
# 初始化响应
HTTP/1.1 200 OK
Mcp-Session-Id: session-abc123

# 客户端后续请求必须包含该 header
POST /mcp HTTP/1.1
Mcp-Session-Id: session-abc123
```

**断线重连**：
- 服务器可分配 SSE 事件 `id` 字段
- 客户端重连时使用 `Last-Event-ID` 请求续流
- 服务器根据 `Mcp-Session-Id` 恢复会话状态

**常见误区**：
- ❌ 误区：初始化后可以直接调用工具
  - ✅ 正解：必须先发送 `notifications/initialized` 通知，握手才算完成
- ❌ 误区：会话关闭后还可以重用
  - ✅ 正解：关闭后会话 ID 失效，需要重新初始化

**来源**：
- https://blog.csdn.net/asd343442/article/details/153929475
- https://blog.csdn.net/lgp10122/article/details/158210050
- https://blog.csdn.net/gitblog_00433/article/details/150699953

---

## 3.3 能力协商与版本控制

### 概念定义

MCP 使用**基于能力（capability-based）的协商机制**。在初始化阶段，客户端和服务器会明确声明它们支持的功能，而这些能力决定了在会话期间可以使用哪些协议特性和原语。

### 能力协商机制

**工作原理**：

1. **客户端声明**：在 `initialize` 请求中，客户端发送自己支持的能力集
2. **服务器响应**：服务器在 `initialize` 响应中返回自己支持的能力
3. **能力交集**：双方取能力交集，只有双方都支持的能力才能在会话中使用

**能力结构示意图**：

```json
{
  // 客户端能力
  "clientCapabilities": {
    "roots": {
      "listChanged": true  // 支持根目录列表变更通知
    },
    "sampling": {}  // 支持采样请求
  },
  
  // 服务器能力
  "serverCapabilities": {
    "tools": {
      "listChanged": true  // 支持工具列表变更通知
    },
    "resources": {
      "subscribe": true,   // 支持资源订阅
      "listChanged": true  // 支持资源列表变更通知
    },
    "prompts": {}  // 支持提示词模板
  }
}
```

### 能力类型详解

**客户端能力（Client Capabilities）**：

| 能力 | 说明 |
|------|------|
| `roots` | 支持根目录（工作区）相关功能 |
| `sampling` | 支持 LLM 采样请求（让服务器请求模型生成内容） |

**服务器能力（Server Capabilities）**：

| 能力 | 说明 |
|------|------|
| `tools` | 提供工具调用功能 |
| `resources` | 提供资源访问功能 |
| `prompts` | 提供提示词模板功能 |

**能力子特性**：

| 能力 | 子特性 | 说明 |
|------|--------|------|
| `resources` | `subscribe` | 支持客户端订阅资源变更 |
| `resources` | `listChanged` | 支持资源列表变更通知 |
| `tools` | `listChanged` | 支持工具列表变更通知 |
| `roots` | `listChanged` | 支持根目录列表变更通知 |

### 版本控制策略

**协议版本格式**：

MCP 使用日期格式的版本号，如 `2025-06-18`，表示该版本的发布日期。

**版本演进历史**：

| 版本 | 发布日期 | 关键变更 |
|------|----------|----------|
| `2024-11-05` | 2024-11-05 | 初始版本，支持 stdio 和 HTTP+SSE 传输 |
| `2025-03-26` | 2025-03-26 | 引入 Streamable HTTP，移除 JSON-RPC 批处理 |
| `2025-06-18` | 2025-06-18 | 新增 Elicitation、OAuth 2.1、结构化输出 |

**向后兼容性**：

MCP 遵循向后兼容原则：
- 新版本客户端可以连接旧版本服务器（使用双方都支持的能力）
- 新版本服务器可以服务旧版本客户端
- 不破坏现有功能的 API 契约

**版本协商示例**：

```json
// 客户端请求（支持最新版本）
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "initialize",
  "params": {
    "protocolVersion": "2025-06-18",
    "capabilities": {
      "roots": {"listChanged": true},
      "sampling": {}
    }
  }
}

// 服务器响应（可能使用较旧版本）
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "protocolVersion": "2025-03-26",  // 服务器只支持到 3 月版本
    "capabilities": {
      "tools": {},
      "resources": {"subscribe": true}
    }
  }
}

// 双方使用 2025-03-26 版本的能力子集进行通信
```

### 代码示例：能力协商完整流程

```python
# 客户端初始化请求
async def initialize(self):
    request = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "initialize",
        "params": {
            "protocolVersion": "2025-06-18",
            "capabilities": {
                "roots": {
                    "listChanged": True
                },
                "sampling": {}
            },
            "clientInfo": {
                "name": "MyClient",
                "version": "1.0.0"
            }
        }
    }
    
    response = await self.send_request(request)
    
    # 检查协议版本兼容性
    server_version = response["result"]["protocolVersion"]
    if not self.is_compatible(server_version):
        raise Exception(f"Incompatible protocol version: {server_version}")
    
    # 存储服务器能力
    self.server_capabilities = response["result"]["capabilities"]
    
    # 发送初始化完成通知
    await self.send_notification("notifications/initialized")
    
    return response["result"]

# 检查能力是否支持
def supports_tool_list_changed(self):
    """检查服务器是否支持工具列表变更通知"""
    return bool(
        self.server_capabilities.get("tools", {}).get("listChanged", False)
    )

def supports_resource_subscribe(self):
    """检查服务器是否支持资源订阅"""
    return bool(
        self.server_capabilities.get("resources", {}).get("subscribe", False)
    )
```

**常见误区**：
- ❌ 误区：能力协商是一次性的，初始化后不能改变
  - ✅ 正解：服务器可以通过 `notifications/tools/listChanged` 等通知客户端能力已变更
- ❌ 误区：客户端可以强制服务器使用新版本
  - ✅ 正解：双方使用协商后的版本（通常是服务器支持的最高版本）

**来源**：
- https://blog.csdn.net/asd343442/article/details/153929475
- https://www.51cto.com/aigc/4614.html
- https://blog.csdn.net/m0_56255097/article/details/147246802

---

## 3.4 2025 年新特性（Elicitation、OAuth 2.1、结构化输出）

### 概念定义

2025 年 6 月 18 日发布的 MCP 协议版本引入了多项重要新特性，包括**Elicitation（人机协同）**、**OAuth 2.1 安全认证**、**结构化输出**等，这些特性使 MCP 从简单的工具调用协议升级为企业级智能协作平台。

---

### Elicitation（人机协同）

**概念定义**：

Elicitation 是 MCP 2025 年新增的核心功能，通过 `elicitationRequest` 显式支持多轮次、人机交互。MCP 现在支持对话序列，而不是单一的一次性呼叫，允许工具和客户端协作以澄清和收集缺失或模棱两可的信息。

**工作原理**：

```
┌──────────┐                          ┌──────────┐         ┌──────────┐
│  Client  │                          │  Server  │         │   User   │
│          │                          │          │         │          │
│          │── tools/call ──────────▶│          │         │          │
│          │                          │          │         │          │
│          │◀── elicitationRequest ──│          │         │          │
│          │    (询问缺失信息)          │          │         │          │
│          │                          │          │         │          │
│          │────────── 提示用户 ─────────────────────────▶│          │
│          │                          │          │         │          │
│          │◀────────── 用户输入 ──────────────────────────│          │
│          │                          │          │         │          │
│          │── continueElicitation ─▶│          │         │          │
│          │    (提供用户输入)         │          │         │          │
│          │                          │          │         │          │
│          │◀────── 最终结果 ─────────│          │         │          │
└──────────┘                          └──────────┘         └──────────┘
```

**Elicitation 工作流程**：

1. 客户端发送工具请求
2. 工具（通过 LLM）返回 `elicitationRequest`，询问缺失或不明确的输入
3. 客户端提示用户并收集额外输入
4. 客户端发送 `continueElicitation` 请求，包含用户提供的信息
5. 工具继续处理并返回最终结果

**代码示例**：

```json
// 1. 客户端调用工具
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "create_order",
    "arguments": {
      "product": "iPhone"
    }
  }
}

// 2. 服务器返回 Elicitation 请求（缺少必要信息）
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "elicitationRequest": {
      "type": "form",
      "title": "确认订单信息",
      "message": "请提供以下缺失信息：",
      "requestedSchema": {
        "type": "object",
        "properties": {
          "quantity": {
            "type": "integer",
            "description": "购买数量"
          },
          "color": {
            "type": "string",
            "enum": ["黑色", "白色", "蓝色"],
            "description": "颜色选择"
          },
          "shippingAddress": {
            "type": "string",
            "description": "收货地址"
          }
        },
        "required": ["quantity", "color", "shippingAddress"]
      }
    }
  }
}

// 3. 客户端收集用户输入后继续
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/call",
  "params": {
    "name": "create_order",
    "arguments": {
      "product": "iPhone"
    },
    "context": {
      "elicitationData": {
        "quantity": 1,
        "color": "黑色",
        "shippingAddress": "上海市浦东新区 XX 路 XX 号"
      }
    }
  }
}

// 4. 服务器返回最终结果
{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "订单已创建：iPhone x 1 (黑色)，收货地址：上海市浦东新区 XX 路 XX 号"
      }
    ],
    "orderId": "ORD-2025-001"
  }
}
```

**适用场景**：
- 交互式表单填写
- 阐明用户意图
- 收集增量数据
- 确认不明确或部分输入

---

### OAuth 2.1 安全认证

**概念定义**：

MCP 2025 年版本将 OAuth 从简单的标志升级为完整的 OAuth 2.1 架构定义。OAuth 2.1 废弃了高风险的隐式授权流（Implicit Flow），强制使用 PKCE（Proof Key for Code Exchange）和 HTTPS，显著提升安全性。

**为什么需要 OAuth 2.1？**

OAuth 2.0 存在多个安全漏洞：
- **隐式授权流风险**：Access Token 直接以 URL Fragment 返回，容易泄露
- **令牌滥用风险**：恶意服务器可能获取用于其他资源的访问令牌

OAuth 2.1 的改进：
- 废弃隐式授权流，从根源上减少 Token 泄露隐患
- 强制使用 PKCE，避免授权码在传输过程中被窃取
- 强化 Refresh Token 的绑定与验证
- 严格要求 HTTPS，减少明文传输风险
- 强制客户端实现 RFC 8707 的 Resource Indicators

**OAuth 2.1 授权流程**：

```
┌──────────┐      ┌──────────┐      ┌──────────────┐      ┌──────────┐
│  Client  │      │   User   │      │ Auth Server  │      │  Server  │
│          │      │          │      │              │      │(Resource)│
│          │      │          │      │              │      │          │
│─── 需要授权 ──▶ │          │      │              │      │          │
│          │      │          │      │              │      │          │
│          │────── 登录授权 ──────▶│              │      │          │
│          │      │          │      │              │      │          │
│          │      │          │◀───── 授权码 + PKCE ──│      │          │
│          │      │          │      │              │      │          │
│          │◀───── 重定向 URI ──────│              │      │          │
│          │      │          │      │              │      │          │
│─── 用授权码 + code_verifier 换 Token ──────────▶│      │          │
│          │      │          │      │              │      │          │
│          │◀───────────────────── Access Token ──│      │          │
│          │      │          │      │              │      │          │
│─── 带 Token 访问资源 ──────────────────────────────────▶│          │
│          │      │          │      │              │      │          │
│          │◀─────────────────────────── 资源数据 ──────────│          │
└──────────┘      └──────────┘      └──────────────┘      └──────────┘
```

**OAuth 2.1 配置示例**：

```json
// 工具声明 OAuth 能力
{
  "name": "github_api",
  "description": "访问 GitHub API",
  "oauth": {
    "authorizationUrl": "https://github.com/login/oauth/authorize",
    "tokenUrl": "https://github.com/login/oauth/access_token",
    "clientId": "your-client-id",
    "scopes": ["repo", "user"],
    "isResourceServer": true
  }
}
```

**安全最佳实践**：

| 实践 | 说明 |
|------|------|
| **强制 PKCE** | 所有授权必须使用 PKCE 验证码 |
| **HTTPS 强制** | 所有 OAuth 通信必须使用 HTTPS |
| **Resource Indicators** | 客户端必须实现 RFC 8707，防止令牌滥用 |
| **短期 Token** | Access Token 有效期限制在 1 小时内 |
| **Token 绑定** | Refresh Token 与客户端绑定，防止盗用 |

---

### 结构化输出（Structured Output）

**概念定义**：

结构化输出是 MCP 2025 年引入的新功能，允许工具声明 `outputSchema` 和 `structuredContent` 字段，实现类型安全的输出验证。在不破坏现有 `content` 结构的前提下，为简单 JSON 输出场景提供轻量、可验证的格式化通道。

**工作原理**：

工具可以声明输出的 JSON Schema，客户端可以可靠地验证和解析精确类型化的输出。

**代码示例**：

```json
// 工具声明输出架构
{
  "name": "get_device_status",
  "description": "获取网络设备状态",
  "inputSchema": {
    "type": "object",
    "properties": {
      "deviceId": {"type": "string"}
    },
    "required": ["deviceId"]
  },
  "outputSchema": {
    "type": "object",
    "properties": {
      "deviceId": {
        "type": "string",
        "description": "设备唯一标识符"
      },
      "status": {
        "type": "string",
        "enum": ["up", "down", "maintenance"],
        "description": "设备状态"
      },
      "uptimeSeconds": {
        "type": "integer",
        "description": "运行时间（秒）"
      },
      "lastError": {
        "type": "string",
        "description": "最近一次错误信息"
      }
    },
    "required": ["deviceId", "status", "uptimeSeconds"]
  }
}

// 工具调用响应
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "设备状态正常，已运行 86400 秒"
      }
    ],
    "structuredContent": {
      "deviceId": "router-001",
      "status": "up",
      "uptimeSeconds": 86400,
      "lastError": null
    }
  }
}
```

**结构化输出的优势**：

| 优势 | 说明 |
|------|------|
| **类型安全** | 客户端可以验证输出是否符合预期架构 |
| **可靠性** | 减少解析错误，特别是在与不受信任服务器交互时 |
| **开发效率** | IDE 可以提供自动补全和类型检查 |
| **向后兼容** | 保留 `content` 字段，不影响旧客户端 |

---

### 其他 2025 年新特性

**Tool Annotations（工具注解）**：

工具可以声明注解来描述操作类型和风险等级：

```json
{
  "name": "delete_file",
  "description": "删除文件",
  "annotations": {
    "type": "destructive",
    "requiresConfirmation": true,
    "readOnly": false
  }
}
```

**进度消息增强**：

新增 `message` 字段，支持动态状态描述：

```json
{
  "jsonrpc": "2.0",
  "method": "notifications/progress",
  "params": {
    "progressToken": "task-001",
    "progress": 75,
    "message": "正在从数据库加载数据..."
  }
}
```

**多模态支持**：

新增音频数据流支持，完善语音交互能力。

**参数补全（Completions）**：

支持参数自动补全建议，提升开发者效率。

**常见误区**：
- ❌ 误区：Elicitation 只适用于复杂场景
  - ✅ 正解：简单场景也可以用 Elicitation 提升用户体验，如确认关键操作
- ❌ 误区：OAuth 2.1 只是可选增强
  - ✅ 正解：对于需要访问用户数据的场景，OAuth 2.1 是推荐的安全标准

**来源**：
- https://blog.csdn.net/ChaITSimpleLove/article/details/148877283
- https://cloud.tencent.com/developer/article/2532751
- https://blog.csdn.net/alisystemsoftware/article/details/147770577
- https://zhuanlan.zhihu.com/p/1903468403668291694
- https://zhuanlan.zhihu.com/p/1891148889077290663

---

## 本章总结

### 核心要点回顾

1. **消息格式**：基于 JSON-RPC 2.0，包含请求、响应、通知三种类型
2. **生命周期**：初始化（握手）→ 运行（操作）→ 关闭（释放资源）
3. **能力协商**：基于能力的协商机制，双方取能力交集
4. **版本控制**：日期格式版本号（如 2025-06-18），向后兼容
5. **2025 新特性**：
   - Elicitation：支持多轮人机交互
   - OAuth 2.1：强制 PKCE 和 HTTPS，提升安全性
   - 结构化输出：outputSchema 实现类型安全

### 参考资料

本章所有来源已在上文各节标注。

**来源**：
- 本章所有来源已在上文各节标注
