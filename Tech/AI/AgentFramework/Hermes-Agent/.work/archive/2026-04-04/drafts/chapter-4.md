# 第 4 章：核心功能详解

## 4.1 CLI 终端界面

### 4.1.1 终端界面架构

Hermes Agent 提供全功能的终端用户界面（TUI），采用 Python 编写，支持同步阻塞循环架构。

**核心特性：**
- 多行编辑支持
- 斜杠命令自动补全
- 中断重定向
- 实时任务执行反馈
- 会话历史浏览

### 4.1.2 启动与基本命令

```bash
# 启动交互式 CLI
hermes

# 查看版本
hermes --version

# 查看帮助
hermes --help
```

**CLI 界面结构：**

```
┌─────────────────────────────────────────────────────────────┐
│  Hermes Agent v0.6.0                      [Model: GPT-4]    │
├─────────────────────────────────────────────────────────────┤
│  > 帮我检查这个项目的 TODO 文件                              │
│                                                             │
│  ✓ 找到 3 个 TODO 项：                                       │
│    1. [ ] 添加单元测试 (priority: high)                     │
│    2. [ ] 更新文档 (priority: medium)                       │
│    3. [ ] 优化性能 (priority: low)                          │
│                                                             │
│  需要我帮你处理哪一个？                                      │
├─────────────────────────────────────────────────────────────┤
│  [/help 命令列表]  [Ctrl+C 中断]  [Ctrl+D 退出]              │
└─────────────────────────────────────────────────────────────┘
```

### 4.1.3 常用斜杠命令

| 命令 | 功能 | 示例 |
|------|------|------|
| `/help` | 显示帮助信息 | `/help` |
| `/model` | 切换模型 | `/model openai/gpt-4` |
| `/tools` | 管理工具 | `/tools enable web_search` |
| `/skills` | 管理技能 | `/skills list` |
| `/memory` | 查看记忆 | `/memory search 项目配置` |
| `/history` | 查看历史 | `/history --limit 10` |
| `/export` | 导出会话 | `/export session.md` |
| `/clear` | 清空上下文 | `/clear` |

---

## 4.2 多平台消息集成

### 4.2.1 网关架构

Hermes Gateway 是消息平台集成的核心组件，负责：
- 接收来自各平台的消息
- 转换为统一的内部消息格式
- 路由到 Agent 核心处理
- 将响应返回到原平台

### 4.2.2 支持的平台

| 平台 | 配置命令 | 特点 |
|------|----------|------|
| **Telegram** | `hermes gateway telegram` | 轻量、API 友好、支持 Bot |
| **Discord** | `hermes gateway discord` | 频道管理、机器人生态 |
| **Slack** | `hermes gateway slack` | 企业级、App 市场 |
| **WhatsApp** | `hermes gateway whatsapp` | 全球用户、Business API |
| **Signal** | `hermes gateway signal` | 端到端加密、隐私优先 |
| **Email** | `hermes gateway email` | IMAP/SMTP 集成 |

### 4.2.3 Telegram 网关配置示例

```bash
# 1. 创建 Telegram Bot（在 @BotFather 中）
# 获取 Bot Token

# 2. 配置 Hermes
hermes config set gateway.telegram.token YOUR_BOT_TOKEN
hermes config set gateway.telegram.enabled true

# 3. 启动网关
hermes gateway start telegram

# 4. 验证状态
hermes gateway status
```

### 4.2.4 跨平台工作流

```
用户发送消息 (Telegram/Discord/Slack)
            ↓
    Gateway 接收并转换格式
            ↓
    Session 管理器创建/更新会话
            ↓
    Agent 核心处理请求
            ↓
    调用工具/技能执行任务
            ↓
    响应返回到原平台
```

---

## 4.3 工具调用系统（Tools）

### 4.3.1 工具架构

Hermes 内置 40+ 种工具，分为多个类别：

```
tools/
├── web_tools.py          # Web 搜索、抓取
├── file_tools.py         # 文件读写、列表
├── terminal_tool.py      # 终端命令执行
├── browser_tool.py       # 浏览器自动化
├── image_tools.py        # 图像生成、编辑
├── code_tools.py         # 代码执行、审查
├── mcp_tools.py          # MCP 服务器集成
├── delegate_tool.py      # 任务委派
└── batch_runner.py       # 批量任务执行
```

### 4.3.2 工具调用流程

```
用户请求
    ↓
Agent 解析意图
    ↓
选择合适的工具
    ↓
构建工具参数（JSON Schema）
    ↓
执行工具调用
    ↓
接收工具返回结果
    ↓
生成响应给用户
```

### 4.3.3 核心工具详解

#### web_search（网页搜索）

```python
# 工具定义
{
    "name": "web_search",
    "description": "Search the web for information",
    "parameters": {
        "type": "object",
        "properties": {
            "query": {"type": "string", "description": "Search query"},
            "num_results": {"type": "integer", "description": "Number of results", "default": 5}
        },
        "required": ["query"]
    }
}

# 使用示例
hermes chat -q "搜索最新的 Python 3.13 特性"
```

#### file_read / file_write（文件操作）

```python
# 读取文件
{
    "name": "file_read",
    "description": "Read content from a file",
    "parameters": {
        "type": "object",
        "properties": {
            "path": {"type": "string", "description": "File path to read"}
        },
        "required": ["path"]
    }
}

# 写入文件
{
    "name": "file_write",
    "description": "Write content to a file",
    "parameters": {
        "type": "object",
        "properties": {
            "path": {"type": "string", "description": "File path to write"},
            "content": {"type": "string", "description": "Content to write"}
        },
        "required": ["path", "content"]
    }
}
```

#### terminal（终端命令执行）

```python
# 工具定义
{
    "name": "terminal",
    "description": "Execute a terminal command",
    "parameters": {
        "type": "object",
        "properties": {
            "command": {"type": "string", "description": "Command to execute"},
            "timeout": {"type": "integer", "description": "Timeout in seconds", "default": 30}
        },
        "required": ["command"]
    }
}

# 使用示例
hermes chat -q "运行 npm install 并告诉我结果"
```

### 4.3.4 自定义工具开发

创建自定义工具文件 `tools/my_custom_tool.py`：

```python
from tools.registry import registry

@registry.register
def text_transform(args):
    """转换文本大小写的工具"""
    text = args.get("text", "")
    transform_type = args.get("transform_type", "uppercase")
    
    if transform_type == "uppercase":
        return text.upper()
    elif transform_type == "lowercase":
        return text.lower()
    return text

# 工具 Schema
TEXT_TRANSFORM_SCHEMA = {
    "name": "text_transform",
    "description": "转换文本大小写",
    "parameters": {
        "type": "object",
        "properties": {
            "text": {"type": "string", "description": "要转换的文本"},
            "transform_type": {
                "type": "string",
                "enum": ["uppercase", "lowercase"],
                "description": "转换类型"
            }
        },
        "required": ["text", "transform_type"]
    }
}
```

---

## 4.4 定时任务（Cron）

### 4.4.1 Cron 架构

Hermes 内置强大的定时任务调度功能，由以下核心模块组成：

| 模块 | 路径 | 功能 |
|------|------|------|
| **调度器** | `cron/scheduler.py` | 核心调度逻辑 |
| **任务定义** | `cron/jobs.py` | 任务配置与执行 |
| **文件锁** | `cron/lock.py` | 防止并发冲突 |

### 4.4.2 支持的调度方式

| 方式 | 格式 | 示例 |
|------|------|------|
| **Cron 表达式** | `分 时 日 月 星期` | `0 9 * * 1-5`（工作日上午 9 点） |
| **时间间隔** | `every N unit` | `every 30 minutes` |
| **一次性执行** | ISO 8601 | `2026-04-04T10:00:00` |

### 4.4.3 配置定时任务

**步骤 1：创建任务配置文件**

在 `~/.hermes/cron/` 目录下创建 YAML 文件：

```yaml
# daily-report.yaml
name: daily-report
description: 每日开发报告
schedule: "0 9 * * *"  # 每天早上 9 点
command: |
  hermes chat -q "生成昨日开发报告，包括：
    1. 完成的 Git 提交
    2. 解决的问题
    3. 今日计划"
output: ~/reports/daily-{{date}}.md
enabled: true
```

**步骤 2：注册任务**

```bash
# 添加任务
hermes cron add ~/.hermes/cron/daily-report.yaml

# 查看任务列表
hermes cron list

# 启动调度器
hermes cron start

# 查看调度器状态
hermes cron status
```

### 4.4.4 应用场景

| 场景 | 配置示例 |
|------|----------|
| **每日报告** | `0 9 * * *` 发送日报到 Telegram |
| **健康检查** | `*/30 * * * *` 每 30 分钟检查 API 状态 |
| **数据备份** | `0 2 * * *` 每天凌晨 2 点备份数据 |
| **周报生成** | `0 10 * * 1` 每周一上午 10 点生成周报 |
| **资源监控** | `*/5 * * * *` 每 5 分钟检查资源使用 |

---

## 4.5 执行后端（Backends）

### 4.5.1 支持的执行后端

Hermes 支持 6 种终端后端，提供灵活的部署和执行选项：

| 后端 | 说明 | 适用场景 |
|------|------|----------|
| **Local** | 本地终端执行 | 开发、测试 |
| **Docker** | 容器隔离执行 | 生产、安全敏感 |
| **SSH** | 远程服务器执行 | 分布式任务 |
| **Modal** | 无服务器执行 | 弹性伸缩 |
| **Daytona** | 云开发环境 | 团队协作 |
| **Singularity** | 科研容器 | HPC、科研机构 |

### 4.5.2 后端配置

```bash
# 设置后端
hermes config set terminal.backend <backend-name>

# Local 后端（默认）
hermes config set terminal.backend local

# Docker 后端
hermes config set terminal.backend docker
hermes config set terminal.docker.image python:3.11-slim

# SSH 后端
hermes config set terminal.backend ssh
hermes config set terminal.ssh.host user@example.com
hermes config set terminal.ssh.key ~/.ssh/id_ed25519

# Modal 后端
hermes config set terminal.backend modal
hermes config set terminal.modal.token <modal-token>
```

### 4.5.3 Docker 后端配置详解

```yaml
# Docker 后端配置选项
terminal:
  backend: docker
  docker:
    image: python:3.11-slim
    network: host  # 网络模式
    volumes:  # 挂载卷
      - ~/.hermes:/root/.hermes
      - ./projects:/projects
    resources:  # 资源限制
      cpu: 2.0  # CPU 核心数
      memory: 4g  # 内存限制
```

### 4.5.4 后端对比

| 维度 | Local | Docker | SSH | Modal |
|------|-------|--------|-----|-------|
| **隔离性** | 无 | 高 | 中 | 高 |
| **安全性** | 低 | 高 | 中 | 高 |
| **成本** | 零 | 低 | 中 | 按需 |
| **延迟** | 最低 | 低 | 中 | 中 |
| **扩展性** | 无 | 中 | 中 | 高 |

---

*本章来源：GitHub 官方仓库、CSDN 技术博客、知乎深度解读、火山引擎开发者社区*
