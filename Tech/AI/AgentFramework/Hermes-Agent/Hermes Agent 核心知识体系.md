# Hermes Agent 核心知识体系

> 自我改进型 AI Agent 框架的完整技术指南

**版本：** 1.0.0  
**创建日期：** 2026-04-04  
**存储位置：** `Tech/AI/AgentFramework/Hermes-Agent/`

---

## 目录

1. [第 1 章：Hermes Agent 概述](#第 1 章 hermes-agent-概述)
2. [第 2 章：架构与核心组件](#第 2 章 架构与核心组件)
3. [第 3 章：安装与部署](#第 3 章 安装与部署)
4. [第 4 章：核心功能详解](#第 4 章 核心功能详解)
5. [第 5 章：技能系统](#第 5 章 技能系统)
6. [第 6 章：记忆与学习系统](#第 6 章 记忆与学习系统)
7. [第 7 章：安全与隔离](#第 7 章 安全与隔离)
8. [第 8 章：实战应用与最佳实践](#第 8 章 实战应用与最佳实践)

---

## 第 1 章 Hermes Agent 概述

### 1.1 什么是 Hermes Agent

**Hermes Agent** 是由 **Nous Research** 开发的开源（MIT 许可）自我改进型 AI Agent 框架。其核心理念是构建一个"与你一起成长"的代理系统——不仅执行任务，还能从经验中学习、创建技能、持久化记忆，并随使用时间增长而变得更加智能。

**官方 Slogan：** *"The agent that grows with you"*（与你一起成长的 Agent）

#### 核心差异化

Hermes Agent 是目前**唯一内置学习闭环**的开源 Agent 框架：

```
用户交互 → 工具调用 → 任务完成
            ↓
    自主技能创建 → 技能自我改进
            ↓
    持久化记忆 (MEMORY.md, USER.md)
            ↓
    FTS5 会话搜索 + LLM 摘要
            ↓
    Honcho 辩证式用户建模
            ↓
下次对话：注入记忆 + 用户模型 → 更好的响应
```

#### 关键项目指标（截至 2026-03-30）

| 指标 | 数值 |
|------|------|
| GitHub Stars | 19.4K+ |
| Forks | 2.3K+ |
| 贡献者 | 207 人 |
| 主要语言 | Python 92.4% |
| 最新版本 | v0.6.0 (2026-03-30) |
| License | MIT |

---

### 1.2 Nous Research 组织背景

#### 组织概况

**Nous Research** 是美国领先的开源 AI 研究实验室，起源于 2023 年 Discord 社区中 AI 爱好者的草根协作。

| 维度 | 详情 |
|------|------|
| **联合创始人** | Teknium（灵魂人物，Hermes 模型创造者）、Karan |
| **团队规模** | 18 名核心成员 + 大量社区贡献者 |
| **融资情况** | 5000 万美元 A 轮，Paradigm 和 North Island Ventures 领投 |
| **使命** | "通过创建和传播开源语言模型，推进人权和自由" |

#### 产品生态

| 产品 | 定位 |
|------|------|
| **Hermes 模型系列** | 旗舰开源 LLM（已到 Hermes 4） |
| **Hermes Agent** | 自主 AI Agent 框架 |
| **Nous Portal** | API 服务门户（400+ 模型） |
| **Psyche** | 去中心化分布式训练网络 |
| **NousCoder** | 代码生成模型 |

#### Hermes 模型核心进展

| 时间 | 版本 | 关键特性 |
|------|------|----------|
| 2023 初 | Hermes (原版) | 首个版本，指令遵循 |
| 2023 中 | Hermes 2 | 改进训练数据，OpenHermes 2.5 数据集 |
| 2024.03 | Hermes 2 Pro | 里程碑：原生 Function Calling + JSON Mode，90% 调用准确率 |
| 2024.08 | Hermes 3 | 旗舰版，高级 Agentic 能力，8B/70B/405B 三规格 |
| 2025.06 | Hermes 4 | 统一推理 - 对话模型，40 万 + 训练样本，<think> 混合推理 |

Hermes 模型以"无审查/最少过滤"著称，在 HuggingFace 上发布 126 个模型、39 个数据集。

---

### 1.3 核心设计理念：Self-Improving Agent

#### 1.3.1 问题背景（根因分析）

过去一年，很多开源 Agent 项目面临以下工程落地难题：

| 问题 | 描述 |
|------|------|
| **入口断层** | 只能在本地命令行运行，换个入口就断层 |
| **缺少沉淀** | 有工具调用，但没有长期记忆和技能沉淀 |
| **安全边界薄弱** | 可以执行命令，但安全边界薄，运维不敢放到线上 |
| **无法长期稳定** | 能演示一次任务，不代表能长期稳定跑网关、定时任务和多会话 |

#### 1.3.2 Hermes 的设计哲学

Hermes Agent 切入的不是"聊天体验"层面，而是 **Agent Runtime** 层面。其核心设计包括：

1. **会从任务经验里生成和改进技能**
2. **会跨会话搜索历史，做持久记忆**
3. **从 Telegram、Discord、Slack、WhatsApp、Signal、Email 和 CLI 共用同一套 agent 核心**
4. **会在容器、SSH、Modal、Daytona 这类后端里跑，而不是被单台开发机绑死**

#### 1.3.3 三层记忆架构

| 层级 | 名称 | 说明 |
|------|------|------|
| L1 | 技能层 | 程序化技能文件，存储在 `skills/` 目录 |
| L2 | 持久记忆层 | MEMORY.md、USER.md，使用 Honcho 辩证式用户建模 |
| L3 | 会话存储层 | SQLite FTS5 全文搜索，存储历史对话 |

#### 1.3.4 自进化技能系统

Hermes 摒弃传统 RAG 模式，采用**基于文件的技能机制**：

```
任务执行失败/发现过时步骤
            ↓
Agent 调用修补程序
            ↓
更新磁盘上的技能文件
            ↓
技能在下次任务中复用
```

这种**闭环学习机制**使 Hermes 在复杂任务后能自我优化。

---

### 1.4 与竞品对比

#### 1.4.1 Hermes Agent vs OpenClaw

| 维度 | Hermes Agent | OpenClaw |
|------|--------------|----------|
| **核心语言** | Python (同步循环) | Node.js (事件驱动异步回调) |
| **架构哲学** | 同步阻塞循环，完全控制流 | 异步回调模式 |
| **稳定性** | 复杂多步任务更稳定 | 简单任务反应快，复杂任务易状态混乱 |
| **记忆系统** | 三层记忆 + FTS5 搜索 + LLM 摘要 | 有限的会话记忆 |
| **技能进化** | 自主创建 + 自我改进 | 静态技能 |
| **终端界面** | 全功能 TUI，多行编辑，自动补全 | 基础 CLI |
| **透明度** | 每步终端操作实时更新 | 长任务无反馈 |
| **平台集成** | 6 种消息平台 + CLI | 主要 CLI |

#### 1.4.2 Hermes Agent vs Claude Code

| 维度 | Hermes Agent | Claude Code |
|------|--------------|-------------|
| **定位** | 持久运行的自学习 Agent | 交互式编码助手 |
| **学习机制** | 内置技能自进化闭环 | 无持久技能学习 |
| **记忆** | 跨会话持久化记忆 | 会话级上下文 |
| **消息平台** | Telegram/Discord/Slack 等 | 仅终端 CLI |
| **定时任务** | 内置 Cron 调度器 | 无 |
| **执行后端** | 6 种后端 (本地/Docker/SSH/Modal 等) | 本地终端 |
| **开源许可** | MIT | 闭源 (Anthropic 官方) |

#### 1.4.3 选择建议

| 用户类型 | 推荐 | 理由 |
|----------|------|------|
| 技术爱好者/隐私敏感 | OpenClaw | 完全本地部署，数据隐私拉满 |
| 需要定时自动化 | Hermes Agent | 内置 Cron，定时任务方便 |
| 想要开箱即用 | Hermes Agent | 完整终端界面，多行编辑 |
| Claude 生态用户 | Claude Code | 与 Claude 模型深度集成 |
| 多平台协作 | Hermes Agent | 12 种消息平台支持 |

---

### 1.5 核心能力总览

#### 1.5.1 支持的模型提供商（18+）

- Nous Portal
- OpenRouter
- z.ai/GLM
- Kimi/Moonshot
- MiniMax
- OpenAI
- 自定义端点

#### 1.5.2 支持的消息平台（12 种）

- Telegram
- Discord
- Slack
- WhatsApp
- Signal
- Email
- CLI（终端）

#### 1.5.3 执行后端（6 种）

- Local（本地）
- Docker（容器隔离）
- SSH（远程服务器）
- Daytona（云开发环境）
- Singularity（科研容器）
- Modal（无服务器）

#### 1.5.4 内置工具（40+）

- 网页搜索（web_search）
- 网页内容提取（web_fetch）
- 文件操作（file_read, file_write）
- 终端命令执行（terminal）
- 图像处理（image_generate）
- MCP 服务器集成
- GitHub 工作流
- 智能家庭设备（OpenHue）

---

*本章来源：知乎深度解读、GitHub 官方仓库、百度百科、火山引擎开发者社区*

---

## 第 2 章 架构与核心组件

### 2.1 整体架构

Hermes Agent 采用模块化设计，将 CLI、消息平台、技能、记忆、MCP、Cron、容器隔离和训练数据链路整合成一套完整的系统。

#### 2.1.1 核心架构层次

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

#### 2.1.2 设计哲学对比

| 维度 | Hermes Agent | 传统 Agent（如 OpenClaw） |
|------|--------------|--------------------------|
| **核心语言** | Python | Node.js |
| **执行模式** | 同步循环（Synchronous Loop） | 事件驱动异步回调 |
| **控制流** | 单一阻塞循环，完全掌控 | 分散回调，易"回调地狱" |
| **稳定性** | 复杂多步任务确定性高 | 简单任务快，复杂任务易混乱 |

---

### 2.2 消息网关系统（Gateway）

#### 2.2.1 核心架构与组件

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

#### 2.2.2 请求路由机制

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

#### 2.2.3 支持的消息平台

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

### 2.3 技能系统（Skills）

#### 2.3.1 技能架构

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

#### 2.3.2 技能类型

| 类型 | 说明 | 示例 |
|------|------|------|
| **内置技能** | 框架预置，40+ 种工具 | web_search, file_read, terminal |
| **用户技能** | 用户自定义创建 | 项目特定工作流 |
| **自进化技能** | Agent 从经验中生成 | 自动修复的工作流 |
| **平台技能** | 特定平台集成 | GitHub, OpenHue, Docker |

#### 2.3.3 技能管理命令

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

### 2.4 记忆系统（Memories）

#### 2.4.1 三层记忆架构

| 层级 | 名称 | 技术 | 说明 |
|------|------|------|------|
| **L1** | 技能层 (Skill Memory) | 文件存储 | 程序化技能，存储在 `skills/` 目录 |
| **L2** | 持久记忆层 (Persistent Memory) | Markdown + Honcho | MEMORY.md、USER.md，用户画像 |
| **L3** | 会话存储层 (Session Memory) | SQLite FTS5 | 历史对话全文搜索 |

#### 2.4.2 记忆工作流程

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

#### 2.4.3 FTS5 全文搜索

Hermes 使用 **SQLite FTS5**（Full-Text Search 5）实现跨会话的历史搜索：

- **优势**：毫秒级检索大量历史对话
- **触发**：每次对话前自动搜索相关记忆
- **注入**：相关记忆片段注入当前对话上下文

---

### 2.5 配置系统（Config）

#### 2.5.1 用户目录结构

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

#### 2.5.2 config.yaml 核心配置

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

#### 2.5.3 环境配置（.env）

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

### 2.6 代码目录结构

#### 2.6.1 源码组织

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

#### 2.6.2 工具集（Toolset）系统

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

---

## 第 3 章 安装与部署

### 3.1 系统要求与环境准备

#### 3.1.1 操作系统支持

| 系统 | 支持状态 | 说明 |
|------|----------|------|
| **Linux** | ✅ 原生支持 | 推荐 Ubuntu 20.04+ |
| **macOS** | ✅ 原生支持 | macOS 11+ |
| **WSL2** | ✅ 官方推荐 | Windows 用户的唯一支持方案 |
| **Windows (原生)** | ❌ 不支持 | 硬约束，必须使用 WSL2 |

#### 3.1.2 硬件要求

| 组件 | 最低要求 | 推荐配置 |
|------|----------|----------|
| **CPU** | 2 核心 | 4 核心+ |
| **内存** | 4GB | 8GB+（12GB 最佳） |
| **存储** | 5GB 可用空间 | 20GB+ SSD |
| **网络** | 稳定互联网连接 | 低延迟连接（用于 API 调用） |

#### 3.1.3 软件依赖

| 依赖 | 版本要求 | 说明 |
|------|----------|------|
| **Python** | ≥ 3.11 | 框架主要语言 |
| **Node.js** | ≥ 18.0.0 | 部分工具和 CLI 界面 |
| **Git** | 最新版 | 代码管理和更新 |

#### 3.1.4 VPS 部署推荐

**Contabo Cloud VPS 20**（性价比高）：
- 价格：$6/月
- 配置：12GB RAM, 200GB SSD
- 系统：Ubuntu 20.04 LTS

**其他推荐提供商：**
- DigitalOcean Droplet ($12/月)
- Linode ($10/月)
- AWS Lightsail ($5/月 起)

---

### 3.2 一键安装流程

#### 3.2.1 快速安装（推荐）

```bash
# 步骤 1：执行安装脚本
curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash

# 步骤 2：重新加载 shell 配置
source ~/.bashrc

# 步骤 3：验证安装
hermes --version
```

安装脚本会自动完成：
- 克隆 GitHub 仓库
- 创建 Python 虚拟环境
- 安装所有 Python 依赖
- 安装 Node.js 依赖
- 初始化用户目录 `~/.hermes/`

#### 3.2.2 手动安装（高级用户）

```bash
# 步骤 1：克隆仓库
git clone https://github.com/NousResearch/hermes-agent.git
cd hermes-agent

# 步骤 2：创建 Python 虚拟环境
python -m venv .venv
source .venv/bin/activate  # Linux/macOS
# 或 .venv\Scripts\activate  # Windows/WSL

# 步骤 3：安装依赖
pip install -r requirements.txt

# 步骤 4：安装 Node.js 依赖
npm install

# 步骤 5：初始化配置
hermes setup
```

#### 3.2.3 Docker 安装

```bash
# 拉取官方镜像
docker pull nousresearch/hermes-agent:latest

# 运行容器
docker run -d \
  --name hermes \
  -v ~/.hermes:/root/.hermes \
  -e OPENROUTER_API_KEY=$OPENROUTER_API_KEY \
  nousresearch/hermes-agent:latest
```

---

### 3.3 配置详解

#### 3.3.1 初始化向导

```bash
# 运行完整初始化向导
hermes setup
```

向导会引导你完成：
1. 选择模型提供商
2. 输入 API 密钥
3. 配置终端后端
4. 启用/禁用工具
5. 设置消息平台（可选）

#### 3.3.2 模型配置

```bash
# 选择和配置模型
hermes model
```

**支持的模型提供商：**

| 提供商 | 配置命令 | 说明 |
|--------|----------|------|
| **Nous Portal** | `hermes model --provider nous` | 官方 API，400+ 模型 |
| **OpenRouter** | `hermes model --provider openrouter` | 统一接口，多模型 |
| **z.ai/GLM** | `hermes model --provider zai` | 智谱 AI |
| **Kimi/Moonshot** | `hermes model --provider kimai` | 月之暗面 |
| **MiniMax** | `hermes model --provider minimax` |  MiniMax AI |
| **OpenAI** | `hermes model --provider openai` | GPT 系列 |
| **自定义端点** | `hermes model --provider custom` | OpenAI 兼容 API |

#### 3.3.3 工具配置

```bash
# 配置启用的工具
hermes tools
```

**内置工具分类：**

| 分类 | 工具 | 说明 |
|------|------|------|
| **Web** | web_search, web_fetch | 搜索和抓取网页 |
| **文件** | file_read, file_write, file_list | 文件系统操作 |
| **终端** | terminal, process | 命令执行和进程管理 |
| **图像** | image_generate, image_edit | 图像生成和编辑 |
| **代码** | code_run, code_review | 代码执行和审查 |
| **MCP** | mcp_connect | 连接 MCP 服务器 |

#### 3.3.4 环境配置（.env 文件）

编辑 `~/.hermes/.env`：

```bash
# 模型 API 密钥
OPENROUTER_API_KEY=sk-or-xxxxxxxxxxxx
NOUS_PORTAL_API_KEY=np_xxxxxxxxxxxx
OPENAI_API_KEY=sk-xxxxxxxxxxxx

# 消息平台配置（可选）
TELEGRAM_BOT_TOKEN=xxxxxxxxx:xxxxxxxxxxxxxxxxxxx
DISCORD_BOT_TOKEN=xxxxxxxxxxxxxxxxxxxx
SLACK_BOT_TOKEN=xoxb-xxxxxxxxxxxx

# 其他配置
HERMES_LOG_LEVEL=info
HERMES_DEBUG=false
```

---

### 3.4 部署方案

#### 3.4.1 本地部署（开发环境）

**适用场景：**
- 个人开发和测试
- 快速原型验证
- 学习探索

**配置要点：**
```yaml
terminal:
  backend: local
  sandbox: false  # 开发环境可关闭沙盒
```

**优点：**
- 零成本
- 快速迭代
- 完整调试能力

**缺点：**
- 依赖本地硬件
- 无法 24/7 运行
- 安全性较低

---

#### 3.4.2 VPS 部署（生产环境）

**适用场景：**
- 24/7 持久运行
- 团队协作
- 生产工作负载

**部署步骤：**

```bash
# 1. SSH 连接到 VPS
ssh user@your-vps-ip

# 2. 执行安装
curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash

# 3. 配置环境变量
echo "OPENROUTER_API_KEY=sk-xxx" >> ~/.bashrc
source ~/.bashrc

# 4. 启动网关（后台运行）
hermes gateway start

# 5. 设置开机自启（systemd）
sudo nano /etc/systemd/system/hermes.service
```

**systemd 服务配置示例：**

```ini
[Unit]
Description=Hermes Agent Gateway
After=network.target

[Service]
Type=simple
User=hermes
WorkingDirectory=/home/hermes/hermes-agent
ExecStart=/home/hermes/hermes-agent/.venv/bin/python -m hermes.gateway
Restart=always
Environment=PATH=/home/hermes/hermes-agent/.venv/bin:/usr/bin:/bin

[Install]
WantedBy=multi-user.target
```

**启动服务：**
```bash
sudo systemctl daemon-reload
sudo systemctl enable hermes
sudo systemctl start hermes
sudo systemctl status hermes
```

---

#### 3.4.3 Docker 部署（容器隔离）

**适用场景：**
- 需要安全隔离
- 多环境一致性
- 易于扩展

**docker-compose.yml 配置：**

```yaml
version: '3.8'

services:
  hermes:
    image: nousresearch/hermes-agent:latest
    container_name: hermes-agent
    restart: unless-stopped
    volumes:
      - ./config:/app/config
      - ./data:/root/.hermes
      - /var/run/docker.sock:/var/run/docker.sock
    environment:
      - OPENROUTER_API_KEY=${OPENROUTER_API_KEY}
      - HERMES_LOG_LEVEL=info
    ports:
      - "3000:3000"
```

**启动命令：**
```bash
docker-compose up -d
```

---

#### 3.4.4 云原生部署（Modal/Daytona）

**适用场景：**
- 需要弹性伸缩
- 无服务器架构
- 按需付费

**Modal 部署示例：**

```python
# modal_app.py
import modal
from hermes.agent import Agent

app = modal.App("hermes-agent")

image = modal.Image.debian_slim().pip_install("hermes-agent")

@app.function(image=image)
def run_agent(task: str):
    agent = Agent()
    return agent.execute(task)
```

**部署命令：**
```bash
modal deploy modal_app.py
```

---

#### 3.4.5 SSH 远程部署

**适用场景：**
- 利用现有服务器资源
- 连接内部网络
- 分布式执行

**配置步骤：**

```bash
# 1. 配置 SSH 密钥
ssh-keygen -t ed25519
ssh-copy-id user@remote-server

# 2. 在 Hermes 中配置 SSH 后端
hermes config set terminal.backend ssh
hermes config set terminal.ssh_host user@remote-server
hermes config set terminal.ssh_key ~/.ssh/id_ed25519

# 3. 测试连接
hermes terminal test
```

---

### 3.5 故障排查

#### 3.5.1 诊断命令

```bash
# 诊断环境问题
hermes doctor

# 查看日志
hermes logs
hermes logs --follow

# 查看错误日志
tail -f ~/.hermes/logs/errors.log
```

#### 3.5.2 常见问题

| 问题 | 可能原因 | 解决方案 |
|------|----------|----------|
| **命令未找到** | PATH 未更新 | `source ~/.bashrc` |
| **API 密钥错误** | .env 配置错误 | 检查 `~/.hermes/.env` |
| **Python 版本过低** | 系统 Python < 3.11 | 安装 Python 3.11+ |
| **WSL 网络问题** | WSL2 网络配置 | `wsl --shutdown` 重启 |
| **权限错误** | 文件权限问题 | `chmod -R 755 ~/.hermes` |

#### 3.5.3 更新到最新版本

```bash
# 官方更新命令
hermes update

# 或手动更新
cd ~/hermes-agent
git pull
pip install -r requirements.txt --upgrade
```

---

*本章来源：GitHub 官方仓库、知乎安装指南、CSDN 部署教程、火山引擎开发者社区*

---

## 第 4 章 核心功能详解

### 4.1 CLI 终端界面

#### 4.1.1 终端界面架构

Hermes Agent 提供全功能的终端用户界面（TUI），采用 Python 编写，支持同步阻塞循环架构。

**核心特性：**
- 多行编辑支持
- 斜杠命令自动补全
- 中断重定向
- 实时任务执行反馈
- 会话历史浏览

#### 4.1.2 启动与基本命令

```bash
# 启动交互式 CLI
hermes

# 查看版本
hermes --version

# 查看帮助
hermes --help
```

#### 4.1.3 常用斜杠命令

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

### 4.2 多平台消息集成

#### 4.2.1 网关架构

Hermes Gateway 是消息平台集成的核心组件，负责：
- 接收来自各平台的消息
- 转换为统一的内部消息格式
- 路由到 Agent 核心处理
- 将响应返回到原平台

#### 4.2.2 支持的平台

| 平台 | 配置命令 | 特点 |
|------|----------|------|
| **Telegram** | `hermes gateway telegram` | 轻量、API 友好、支持 Bot |
| **Discord** | `hermes gateway discord` | 频道管理、机器人生态 |
| **Slack** | `hermes gateway slack` | 企业级、App 市场 |
| **WhatsApp** | `hermes gateway whatsapp` | 全球用户、Business API |
| **Signal** | `hermes gateway signal` | 端到端加密、隐私优先 |
| **Email** | `hermes gateway email` | IMAP/SMTP 集成 |

#### 4.2.3 Telegram 网关配置示例

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

---

### 4.3 工具调用系统（Tools）

#### 4.3.1 工具架构

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

#### 4.3.2 工具调用流程

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

#### 4.3.3 核心工具详解

##### web_search（网页搜索）

```json
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
```

##### terminal（终端命令执行）

```json
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
```

#### 4.3.4 自定义工具开发

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

### 4.4 定时任务（Cron）

#### 4.4.1 Cron 架构

Hermes 内置强大的定时任务调度功能，由以下核心模块组成：

| 模块 | 路径 | 功能 |
|------|------|------|
| **调度器** | `cron/scheduler.py` | 核心调度逻辑 |
| **任务定义** | `cron/jobs.py` | 任务配置与执行 |
| **文件锁** | `cron/lock.py` | 防止并发冲突 |

#### 4.4.2 支持的调度方式

| 方式 | 格式 | 示例 |
|------|------|------|
| **Cron 表达式** | `分 时 日 月 星期` | `0 9 * * 1-5`（工作日上午 9 点） |
| **时间间隔** | `every N unit` | `every 30 minutes` |
| **一次性执行** | ISO 8601 | `2026-04-04T10:00:00` |

#### 4.4.3 配置定时任务

**步骤 1：创建任务配置文件**

在 `~/.hermes/cron/` 目录下创建 YAML 文件：

```yaml
# daily-report.yaml
name: daily-report
description: 每日开发报告
schedule: "0 9 * * *"
command: |
  hermes chat -q "生成昨日开发报告"
output: ~/reports/daily-{{date}}.md
enabled: true
```

**步骤 2：注册任务**

```bash
hermes cron add ~/.hermes/cron/daily-report.yaml
hermes cron list
hermes cron start
hermes cron status
```

#### 4.4.4 应用场景

| 场景 | 配置示例 |
|------|----------|
| **每日报告** | `0 9 * * *` 发送日报到 Telegram |
| **健康检查** | `*/30 * * * *` 每 30 分钟检查 API 状态 |
| **数据备份** | `0 2 * * *` 每天凌晨 2 点备份数据 |
| **周报生成** | `0 10 * * 1` 每周一上午 10 点生成周报 |
| **资源监控** | `*/5 * * * *` 每 5 分钟检查资源使用 |

---

### 4.5 执行后端（Backends）

#### 4.5.1 支持的执行后端

Hermes 支持 6 种终端后端：

| 后端 | 说明 | 适用场景 |
|------|------|----------|
| **Local** | 本地终端执行 | 开发、测试 |
| **Docker** | 容器隔离执行 | 生产、安全敏感 |
| **SSH** | 远程服务器执行 | 分布式任务 |
| **Modal** | 无服务器执行 | 弹性伸缩 |
| **Daytona** | 云开发环境 | 团队协作 |
| **Singularity** | 科研容器 | HPC、科研机构 |

#### 4.5.2 后端配置

```bash
hermes config set terminal.backend <backend-name>
```

#### 4.5.3 后端对比

| 维度 | Local | Docker | SSH | Modal |
|------|-------|--------|-----|-------|
| **隔离性** | 无 | 高 | 中 | 高 |
| **安全性** | 低 | 高 | 中 | 高 |
| **成本** | 零 | 低 | 中 | 按需 |
| **延迟** | 最低 | 低 | 中 | 中 |
| **扩展性** | 无 | 中 | 中 | 高 |

---

*本章来源：GitHub 官方仓库、CSDN 技术博客、知乎深度解读、火山引擎开发者社区*

---

## 第 5 章 技能系统

### 5.1 技能架构与生命周期

#### 5.1.1 什么是技能（Skills）

在 Hermes Agent 中，**技能**是可以复用的任务执行流程和能力模块。技能系统采用基于文件的机制，而非传统的 RAG（检索增强生成）模式。

**核心理念：**
- 技能以文件形式存储在磁盘上（`.md` 或 `.py`）
- Agent 可以自主创建、修改和优化技能
- 技能在任务执行失败或发现过时步骤时自动更新
- 形成的技能可在不同会话中复用

#### 5.1.2 技能存储位置

```
~/.hermes/skills/
├── builtin/              # 内置技能
├── platform/             # 平台集成技能
└── user/                 # 用户自定义技能
```

#### 5.1.3 技能生命周期

```
创建 → 注册 → 执行 → 评估 → 更新/优化 → 归档/删除
```

---

### 5.2 内置技能概览

#### 5.2.1 核心内置技能

| 技能名称 | 功能 | 调用示例 |
|----------|------|----------|
| **web_search** | 网页搜索 | "搜索最新的 Python 3.13 特性" |
| **web_fetch** | 网页内容抓取 | "获取这个 URL 的内容" |
| **file_read** | 读取文件 | "读取 config.yaml 的内容" |
| **file_write** | 写入文件 | "创建一个新的 README.md" |
| **terminal** | 终端命令执行 | "运行 npm install" |
| **code_review** | 代码审查 | "审查这个函数的代码质量" |

#### 5.2.2 平台集成技能

**GitHub 技能：**
```bash
hermes skills install github
hermes chat -q "查看这个 PR 的状态"
```

**OpenHue 技能（Philips Hue 智能灯）：**
```bash
hermes skills install smart-home/openhue
hermes chat -q "打开客厅主灯，亮度 70%"
```

---

### 5.3 自定义技能开发

#### 5.3.1 Markdown 技能格式

```markdown
---
name: my-custom-skill
description: 我的自定义技能
version: 1.0.0
---

# 技能说明

## 参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| param1 | string | 是 | 参数 1 说明 |

## 执行步骤

1. 第一步：[操作说明]
2. 第二步：[操作说明]
```

#### 5.3.2 Python 技能格式

```python
from skills.base import BaseSkill

class TextTransformSkill(BaseSkill):
    name = "text_transform"
    description = "转换文本大小写"
    
    def execute(self, args, context):
        text = args.get("text", "")
        transform_type = args.get("transform_type", "uppercase")
        return text.upper() if transform_type == "uppercase" else text.lower()
```

---

### 5.4 技能自进化机制

Hermes 的核心差异化功能是**技能自进化**：

```
任务执行失败或发现过时步骤
            ↓
Agent 检测到问题（通过结果验证或用户反馈）
            ↓
触发技能更新流程（每 15 次工具调用后）
            ↓
调用 skill_manager 修补程序
            ↓
分析执行轨迹，识别问题
            ↓
生成修复方案
            ↓
更新磁盘上的技能文件
            ↓
下次任务使用新版本技能
```

**触发条件：**
- 累计 15 次工具调用后自动触发
- 用户明确要求改进
- 任务执行失败

---

*本章来源：GitHub 官方仓库、CSDN 技能开发指南、知乎深度解读*

---

## 第 6 章 记忆与学习系统

### 6.1 持久化记忆机制

#### 6.1.1 为什么需要持久化记忆

传统 Agent 面临的"失忆"问题：

| 问题 | 表现 | 影响 |
|------|------|------|
| **会话隔离** | 每次对话都是全新的开始 | 用户需要重复解释 |
| **上下文有限** | 超过 token 限制就丢失 | 长任务无法持续 |
| **缺少用户建模** | 不了解用户偏好 | 响应不够个性化 |
| **无法积累经验** | 同样的错误反复犯 | 无法持续改进 |

Hermes 通过**三层记忆架构**解决这些问题。

#### 6.1.2 三层记忆架构

| 层级 | 名称 | 存储 | 特点 |
|------|------|------|------|
| **L1** | 技能层 | `skills/` | 可执行、可复用、可进化 |
| **L2** | 持久记忆层 | `memories/` | MEMORY.md, USER.md |
| **L3** | 会话存储层 | SQLite FTS5 | 历史对话全文搜索 |

---

### 6.2 用户画像构建

#### 6.2.1 Honcho 辩证式用户建模

Hermes 使用 **Honcho** 系统进行用户建模：
- 动态用户建模系统
- 基于辩证法原理构建用户画像
- 从对话中提取偏好、习惯、项目信息

#### 6.2.2 USER.md 格式

```markdown
# 用户画像

## 基本信息
- **姓名**: [用户名称]
- **角色**: [职业/角色]
- **时区**: [时区信息]

## 技术栈偏好
- **主要语言**: Python, TypeScript
- **框架偏好**: React, FastAPI

## 项目上下文
### 项目 A
- 描述：[项目描述]
- 技术栈：[技术列表]
```

---

### 6.3 FTS5 会话搜索

#### 6.3.1 SQLite FTS5 简介

**FTS5** (Full-Text Search 5) 是 SQLite 的全文搜索扩展模块：

| 特性 | 说明 |
|------|------|
| **倒排索引** | 快速关键词匹配 |
| **分词支持** | 中英文分词 |
| **相关性排序** | BM25 算法 |
| **前缀搜索** | `word*` 匹配 |
| **短语搜索** | `"exact phrase"` |

#### 6.3.2 搜索语法

| 语法 | 示例 | 说明 |
|------|------|------|
| **关键词** | `docker` | 匹配包含 docker 的记录 |
| **短语** | `"API key"` | 精确匹配短语 |
| **前缀** | `config*` | 匹配 config, configs, configuration |
| **逻辑与** | `docker AND build` | 同时包含两个词 |
| **逻辑或** | `docker OR k8s` | 包含任一即可 |
| **逻辑非** | `docker NOT compose` | 排除包含 compose 的记录 |

---

### 6.4 学习循环与自进化

#### 6.4.1 学习循环触发机制

| 触发条件 | 说明 |
|----------|------|
| **15 次工具调用** | 累计调用后自动触发 |
| **任务失败** | 检测到执行失败 |
| **用户反馈** | 用户明确要求改进 |
| **定时触发** | 每日/每周定期回顾 |

#### 6.4.2 学习循环流程

```
执行轨迹收集 → 成功/失败分析 → 技能更新 → 记忆强化
```

**详细步骤：**

1. **执行轨迹收集**：记录每次工具调用的输入输出
2. **成功/失败分析**：JEPA 分析执行轨迹，识别模式
3. **技能更新**：修改相关技能文件
4. **记忆强化**：将重要经验写入 MEMORY.md

---

*本章来源：知乎深度解读、CSDN 技术分析、GitHub 官方仓库*

---

## 第 7 章 安全与隔离

### 7.1 安全沙盒设计

#### 7.1.1 为什么需要安全隔离

AI Agent 执行潜在风险操作：

| 风险类型 | 具体表现 | 可能后果 |
|----------|----------|----------|
| **命令执行** | 执行恶意 shell 命令 | 系统被控制、数据泄露 |
| **文件访问** | 读取敏感文件 | 密钥、密码泄露 |
| **网络请求** | 未授权的外部调用 | 数据外传、DDoS 参与 |
| **权限提升** | 获取更高系统权限 | 完全系统控制 |
| **自我修改** | Agent 修改自身代码 | 行为不可预测、恶性循环 |

#### 7.1.2 Hermes 的安全理念

**核心原则：**
1. **最小权限**：只授予完成任务所需的最小权限
2. **隔离执行**：所有命令在隔离环境中运行
3. **审计日志**：所有操作可追溯、可审计
4. **用户审批**：关键操作需要用户确认

#### 7.1.3 沙盒架构

```
用户层 → 审批层 → 沙盒层 → 执行层
              ↓
    Local / Docker / SSH / Modal / Singularity
```

---

### 7.2 容器隔离（Docker 后端）

#### 7.2.1 Docker 安全特性

| 特性 | 说明 | 配置 |
|------|------|------|
| **文件系统隔离** | 容器无法访问主机文件系统 | 通过挂载卷控制 |
| **网络隔离** | 默认禁用网络访问 | `--network=none` |
| **资源限制** | CPU/内存限制 | `--cpus`, `--memory` |
| **权限限制** | 禁止特权升级 | `--security-opt no-new-privileges` |

#### 7.2.2 Docker 后端配置

```yaml
terminal:
  backend: docker
  docker:
    image: python:3.11-slim
    network: none
    volumes:
      - ~/.hermes:/root/.hermes:ro
    resources:
      cpu: 2.0
      memory: 4g
```

#### 7.2.3 容器安全扫描

Hermes 在技能安装时自动进行安全扫描：

**扫描内容：**
- 数据泄露风险
- 提示注入攻击
- 破坏性命令

**信任级别分类：**
- **builtin**：内置技能，安全性最高
- **trusted**：可信源技能
- **community**：社区贡献，需审查

---

### 7.3 SSH 后端（最高安全性）

#### 7.3.1 为什么 SSH 最安全

1. **物理隔离**：Agent 运行在远程服务器上
2. **无法自修改**：Agent 无法修改本地代码
3. **网络边界**：与内网完全隔离
4. **审计便利**：所有操作记录在远程服务器

#### 7.3.2 SSH 后端配置

```yaml
terminal:
  backend: ssh
  ssh:
    host: user@remote-server.com
    port: 22
    key: ~/.ssh/id_ed25519
```

---

### 7.4 审计日志

#### 7.4.1 日志位置

```
~/.hermes/logs/
├── errors.log
├── gateway.log
├── agent.log
└── audit.log
```

#### 7.4.2 查看审计日志

```bash
hermes logs
hermes logs --follow
hermes logs --level error
```

---

### 7.5 安全最佳实践

```
✓ 使用 Docker 或 SSH 后端进行隔离
✓ 只安装可信源的技能
✓ 定期更新 Hermes 到最新版本
✓ 限制网络访问权限
✓ 启用审计日志
✓ 妥善管理 API 密钥
```

---

*本章来源：GitHub 官方仓库、CSDN 安全指南、知乎深度解读*

---

## 第 8 章 实战应用与最佳实践

### 8.1 开发环境配置

#### 8.1.1 推荐开发环境

| 组件 | 推荐配置 | 说明 |
|------|----------|------|
| **操作系统** | macOS / Linux / WSL2 | 避免原生 Windows |
| **Python** | 3.11+ | 使用 pyenv 管理版本 |
| **Node.js** | 18.0+ | 使用 nvm 管理版本 |
| **终端** | zsh + tmux | 支持多路复用 |
| **编辑器** | VS Code | 集成 Hermes CLI |
| **Docker** | 20.10+ | 容器隔离执行 |

---

### 8.2 典型应用场景

#### 8.2.1 开发者自动化

**Git 工作流：**
```bash
hermes chat -q "创建一个新分支 feature/user-auth 并设置上游"
hermes chat -q "提交所有更改，消息：'feat: 添加用户认证功能'"
```

**代码审查：**
```bash
hermes chat -q "审查这个文件的代码质量和潜在问题"
hermes chat -q "运行单元测试并生成覆盖率报告"
```

#### 8.2.2 数据分析

```bash
hermes chat -q "抓取这个网站的所有产品数据，保存到 data/products.csv"
hermes chat -q "分析销售数据，生成月度报告并发送到 Slack"
```

#### 8.2.3 DevOps 自动化

```bash
hermes chat -q "为这个项目创建 GitHub Actions CI 配置"
hermes chat -q "部署到生产环境并验证服务健康状态"
```

---

### 8.3 故障排查

#### 8.3.1 诊断命令

```bash
hermes doctor
```

#### 8.3.2 常见问题

| 问题 | 解决方案 |
|------|----------|
| **命令未找到** | `source ~/.bashrc` |
| **API 密钥错误** | 检查 `~/.hermes/.env` |
| **Python 版本过低** | `pyenv install 3.11 && pyenv global 3.11` |
| **WSL 网络问题** | `wsl --shutdown` 重启 WSL |

---

### 8.4 最佳实践总结

#### 8.4.1 安全最佳实践
```
✓ 使用 Docker 或 SSH 后端进行隔离
✓ 只安装可信源的技能
✓ 定期更新 Hermes 到最新版本
✓ 限制网络访问权限
✓ 启用审计日志
✓ 妥善管理 API 密钥
```

#### 8.4.2 开发最佳实践
```
✓ 项目配置版本控制（不含密钥）
✓ 技能文件添加文档和测试
✓ 使用斜杠命令提高效率
✓ 定期清理临时文件和旧日志
✓ 备份重要技能和配置
```

#### 8.4.3 运维最佳实践
```
✓ 设置 systemd 服务实现 24/7 运行
✓ 配置日志轮转避免磁盘占满
✓ 设置监控告警
✓ 定期备份 ~/.hermes/ 目录
✓ 测试灾难恢复流程
```

---

### 8.5 学习曲线建议

**新手入门路径：**

1. **第 1 周**：安装配置，熟悉 CLI 基本命令
2. **第 2 周**：使用内置工具（文件操作、终端命令）
3. **第 3 周**：安装和使用平台技能（GitHub、Docker）
4. **第 4 周**：创建自定义技能
5. **第 5 周+**：配置定时任务和消息网关

---

### 8.6 社区资源

| 资源 | 链接 |
|------|------|
| **GitHub 仓库** | https://github.com/NousResearch/hermes-agent |
| **官方文档** | https://hermes-agent.nousresearch.com |
| **Discord 社区** | https://discord.gg/nous-research |
| **技能仓库** | https://github.com/NousResearch/hermes-skills |

---

*本章来源：GitHub 官方仓库、CSDN 实战指南、知乎社区经验、火山引擎开发者社区*

---

## 文档完成总结

### 文档结构总览

本《Hermes Agent 核心知识体系》文档共 8 章，涵盖：

1. **概述**：Hermes Agent 简介、Nous Research 背景、核心设计理念、竞品对比
2. **架构与核心组件**：整体架构、网关系统、技能系统、记忆系统、配置系统
3. **安装与部署**：系统要求、安装流程、配置详解、多种部署方案
4. **核心功能详解**：CLI 终端、多平台集成、工具调用、定时任务、执行后端
5. **技能系统**：技能架构、内置技能、自定义开发、管理分发
6. **记忆与学习系统**：三层记忆架构、用户画像、FTS5 搜索、智能遗忘、学习循环
7. **安全与隔离**：安全沙盒、容器隔离、SSH 后端、权限控制、审计日志
8. **实战应用与最佳实践**：开发配置、应用场景、故障排查、性能优化

### 文档信息

| 项目 | 详情 |
|------|------|
| **主题** | Hermes Agent |
| **存储位置** | `Tech/AI/AgentFramework/Hermes-Agent/` |
| **章节数** | 8 章 |
| **创建日期** | 2026-04-04 |
| **版本** | 1.0.0 |

### 信息来源

- GitHub 官方仓库（https://github.com/NousResearch/hermes-agent）
- 知乎深度解读文章
- CSDN 技术博客
- 火山引擎开发者社区
- 百度百科

---

*文档结束*
