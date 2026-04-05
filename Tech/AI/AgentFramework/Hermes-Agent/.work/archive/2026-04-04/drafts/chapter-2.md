# 第 2 章：架构与核心组件

## 2.1 整体架构

Hermes Agent 采用模块化设计，将 CLI、消息平台、技能、记忆、MCP、Cron、容器隔离和训练数据链路整合成一套完整的系统。

### 2.1.1 核心架构层次

```
┌─────────────────────────────────────────────────────────────┐
│                    消息平台层 (Platforms)                     │
│   Telegram │ Discord │ Slack │ WhatsApp │ Signal │ CLI      │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    网关层 (Gateway)                           │
│   请求路由 │ 会话管理 │ 负载均衡 │ 平台适配器                 │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                   Agent 核心层 (Core)                         │
│   同步循环 (Synchronous Agent Loop) │ 工具调用 │ 技能管理     │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    记忆与学习层                               │
│   FTS5 搜索 │ LLM 摘要 │ Honcho 用户建模 │ 技能自进化          │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    执行后端层 (Backends)                      │
│   Local │ Docker │ SSH │ Modal │ Daytona │ Singularity     │
└─────────────────────────────────────────────────────────────┘
```

### 2.1.2 设计哲学对比

| 维度 | Hermes Agent | 传统 Agent（如 OpenClaw） |
|------|--------------|--------------------------|
| **核心语言** | Python | Node.js |
| **执行模式** | 同步循环（Synchronous Loop） | 事件驱动异步回调 |
| **控制流** | 单一阻塞循环，完全掌控 | 分散回调，易"回调地狱" |
| **稳定性** | 复杂多步任务确定性高 | 简单任务快，复杂任务易混乱 |

---

## 2.2 消息网关系统（Gateway）

### 2.2.1 核心架构与组件

Hermes Agent 的网关系统采用模块化设计，主要通过 `gateway/` 目录下的核心文件实现请求处理流程。

**核心组件：**

| 组件 | 路径 | 功能 |
|------|------|------|
| **启动入口** | `gateway/run.py` | 协调各组件完成请求的接收、验证与转发 |
| **平台适配器** | `gateway/platforms/` | 多平台支持（discord.py、slack.py 等） |
| **频道目录** | `gateway/directory.py` | 根据请求来源智能匹配处理逻辑 |
| **会话管理** | `gateway/session.py` | 完整的会话生命周期管理 |
| **消息投递** | `gateway/delivery.py` | 基于规则的路由引擎 |
| **优先级调度** | `gateway/pairing.py` | 动态优先级路由 |
| **路由缓存** | `gateway/sticker_cache.py` | 路由结果缓存，降低 30% 决策时间 |

### 2.2.2 请求路由机制

**基于规则的路由匹配（gateway/delivery.py）：**

```python
def deliver_message(session, message):
    """根据消息特征路由到合适的处理程序"""
    route = route_resolver.resolve(
        channel_id=session.channel_id,
        message_type=message.type,
        content_features=extract_features(message.content)
    )
    return route.handler(session, message)
```

**动态优先级路由（gateway/pairing.py）：**
- 系统通知、紧急指令优先处理
- 避免资源竞争导致的响应延迟

### 2.2.3 支持的消息平台

| 平台 | 特点 | 适用场景 |
|------|------|----------|
| **Telegram** | 轻量、API 友好 | 个人助手、通知推送 |
| **Discord** | 频道丰富、机器人生态成熟 | 团队协作、社区运营 |
| **Slack** | 企业级集成 | 企业工作流、DevOps |
| **WhatsApp** | 全球用户基数大 | 客户服务、个人通信 |
| **Signal** | 端到端加密 | 隐私敏感场景 |
| **Email** | 异步通信 | 报告发送、长文本 |
| **CLI** | 本地终端交互 | 开发者工具、调试 |

---

## 2.3 技能系统（Skills）

### 2.3.1 技能架构

Hermes 摒弃传统 RAG 模式，采用**基于文件的技能机制**。

**技能存储位置：** `~/.hermes/skills/`

**技能生命周期：**

```
任务执行失败/发现过时步骤
            ↓
Agent 检测到问题
            ↓
调用 skill_manager 修补程序
            ↓
更新磁盘上的技能文件（.md 或 .py）
            ↓
技能在下次任务中自动复用
```

### 2.3.2 技能类型

| 类型 | 说明 | 示例 |
|------|------|------|
| **内置技能** | 框架预置，40+ 种工具 | web_search, file_read, terminal |
| **用户技能** | 用户自定义创建 | 项目特定工作流 |
| **自进化技能** | Agent 从经验中生成 | 自动修复的工作流 |
| **平台技能** | 特定平台集成 | GitHub, OpenHue, Docker |

### 2.3.3 技能管理命令

```bash
# 安装技能
hermes skills install <skill-name>

# 列出已安装技能
hermes skills list

# 更新技能
hermes skills update <skill-name>

# 删除技能
hermes skills remove <skill-name>
```

---

## 2.4 记忆系统（Memories）

### 2.4.1 三层记忆架构

| 层级 | 名称 | 技术 | 说明 |
|------|------|------|------|
| **L1** | 技能层 (Skill Memory) | 文件存储 | 程序化技能，存储在 `skills/` 目录 |
| **L2** | 持久记忆层 (Persistent Memory) | Markdown + Honcho | MEMORY.md、USER.md，用户画像 |
| **L3** | 会话存储层 (Session Memory) | SQLite FTS5 | 历史对话全文搜索 |

### 2.4.2 记忆工作流程

```
用户交互 → 工具调用 → 任务完成
            ↓
    会话记录存入 SQLite
            ↓
    定期 LLM 摘要生成
            ↓
    关键信息提取 → MEMORY.md / USER.md
            ↓
    Honcho 辩证式用户建模
            ↓
下次对话：注入记忆 + 用户模型 → 更精准的响应
```

### 2.4.3 FTS5 全文搜索

Hermes 使用 **SQLite FTS5**（Full-Text Search 5）实现跨会话的历史搜索：

- **优势**：毫秒级检索大量历史对话
- **触发**：每次对话前自动搜索相关记忆
- **注入**：相关记忆片段注入当前对话上下文

---

## 2.5 配置系统（Config）

### 2.5.1 用户目录结构

Hermes 的主目录位于 `~/.hermes/`，结构如下：

```
~/.hermes/
├── config.yaml         # 设置（模型、终端、TTS、压缩等）
├── .env                # API 密钥和密钥
├── auth.json           # OAuth 提供商凭证（Nous Portal 等）
├── SOUL.md             # 可选：全局人设（Agent 体现这种个性）
├── memories/           # 持久记忆（MEMORY.md、USER.md）
├── skills/             # Agent 创建的技能（通过 skill_manage 工具管理）
├── cron/               # 定时任务
├── sessions/           # 网关会话
└── logs/               # 日志（errors.log、gateway.log — 密钥自动屏蔽）
```

### 2.5.2 config.yaml 核心配置

```yaml
# 模型配置
model:
  provider: openrouter  # 或 nous_portal, openai, zai, kimai, minimax
  model: meta-llama/llama-3-70b-instruct
  api_key: ${OPENROUTER_KEY}

# 终端配置
terminal:
  backend: local        # 或 docker, ssh, modal, daytona, singularity
  sandbox: true         # 启用安全沙盒

# TTS 配置
tts:
  enabled: false
  provider: elevenlabs

# 记忆压缩配置
memory:
  auto_summarize: true
  fts5_enabled: true
```

### 2.5.3 环境配置（.env）

```bash
# 模型提供商 API 密钥
OPENROUTER_API_KEY=sk-...
NOUS_PORTAL_API_KEY=np_...
OPENAI_API_KEY=sk-...

# 消息平台配置
TELEGRAM_BOT_TOKEN=...
DISCORD_BOT_TOKEN=...
```

---

## 2.6 代码目录结构

### 2.6.1 源码组织

| 目录 | 说明 |
|------|------|
| `agent/` | Agent 核心逻辑，同步循环实现 |
| `gateway/` | 消息网关，平台适配器 |
| `hermes_cli/` | CLI 终端界面 |
| `skills/` | 内置技能定义 |
| `tools/` | 工具实现（40+ 种） |
| `docs/` | 文档 |
| `assets/` | 静态资源 |
| `scripts/` | 安装脚本、工具脚本 |

### 2.6.2 工具集（Toolset）系统

工具集采用字典结构描述：

```python
TOOLSETS = {
    "web": {
        "description": "Web research and content extraction tools",
        "tools": ["web_search", "web_extract"],
        "includes": []
    },
    "terminal": {
        "description": "Terminal/command execution and process management tools",
        "tools": ["terminal", "process"],
        "includes": []
    }
}
```

---

*本章来源：GitHub 官方仓库、知乎深度解读、CSDN 技术博客、火山引擎开发者社区*
