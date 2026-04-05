# 第 1 章：Hermes Agent 概述

## 1.1 什么是 Hermes Agent

**Hermes Agent** 是由 **Nous Research** 开发的开源（MIT 许可）自我改进型 AI Agent 框架。其核心理念是构建一个"与你一起成长"的代理系统——不仅执行任务，还能从经验中学习、创建技能、持久化记忆，并随使用时间增长而变得更加智能。

**官方 Slogan：** *"The agent that grows with you"*（与你一起成长的 Agent）

### 核心差异化

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

### 关键项目指标（截至 2026-03-30）

| 指标 | 数值 |
|------|------|
| GitHub Stars | 19.4K+ |
| Forks | 2.3K+ |
| 贡献者 | 207 人 |
| 主要语言 | Python 92.4% |
| 最新版本 | v0.6.0 (2026-03-30) |
| License | MIT |

---

## 1.2 Nous Research 组织背景

### 组织概况

**Nous Research** 是美国领先的开源 AI 研究实验室，起源于 2023 年 Discord 社区中 AI 爱好者的草根协作。

| 维度 | 详情 |
|------|------|
| **联合创始人** | Teknium（灵魂人物，Hermes 模型创造者）、Karan |
| **团队规模** | 18 名核心成员 + 大量社区贡献者 |
| **融资情况** | 5000 万美元 A 轮，Paradigm 和 North Island Ventures 领投 |
| **使命** | "通过创建和传播开源语言模型，推进人权和自由" |

### 产品生态

| 产品 | 定位 |
|------|------|
| **Hermes 模型系列** | 旗舰开源 LLM（已到 Hermes 4） |
| **Hermes Agent** | 自主 AI Agent 框架 |
| **Nous Portal** | API 服务门户（400+ 模型） |
| **Psyche** | 去中心化分布式训练网络 |
| **NousCoder** | 代码生成模型 |

### Hermes 模型核心进展

| 时间 | 版本 | 关键特性 |
|------|------|----------|
| 2023 初 | Hermes (原版) | 首个版本，指令遵循 |
| 2023 中 | Hermes 2 | 改进训练数据，OpenHermes 2.5 数据集 |
| 2024.03 | Hermes 2 Pro | 里程碑：原生 Function Calling + JSON Mode，90% 调用准确率 |
| 2024.08 | Hermes 3 | 旗舰版，高级 Agentic 能力，8B/70B/405B 三规格 |
| 2025.06 | Hermes 4 | 统一推理 - 对话模型，40 万 + 训练样本，<think> 混合推理 |

Hermes 模型以"无审查/最少过滤"著称，在 HuggingFace 上发布 126 个模型、39 个数据集。

---

## 1.3 核心设计理念：Self-Improving Agent

### 1.3.1 问题背景（根因分析）

过去一年，很多开源 Agent 项目面临以下工程落地难题：

| 问题 | 描述 |
|------|------|
| **入口断层** | 只能在本地命令行运行，换个入口就断层 |
| **缺少沉淀** | 有工具调用，但没有长期记忆和技能沉淀 |
| **安全边界薄弱** | 可以执行命令，但安全边界薄，运维不敢放到线上 |
| **无法长期稳定** | 能演示一次任务，不代表能长期稳定跑网关、定时任务和多会话 |

### 1.3.2 Hermes 的设计哲学

Hermes Agent 切入的不是"聊天体验"层面，而是 **Agent Runtime** 层面。其核心设计包括：

1. **会从任务经验里生成和改进技能**
2. **会跨会话搜索历史，做持久记忆**
3. **从 Telegram、Discord、Slack、WhatsApp、Signal、Email 和 CLI 共用同一套 agent 核心**
4. **会在容器、SSH、Modal、Daytona 这类后端里跑，而不是被单台开发机绑死**

### 1.3.3 三层记忆架构

| 层级 | 名称 | 说明 |
|------|------|------|
| L1 | 技能层 | 程序化技能文件，存储在 `skills/` 目录 |
| L2 | 持久记忆层 | MEMORY.md、USER.md，使用 Honcho 辩证式用户建模 |
| L3 | 会话存储层 | SQLite FTS5 全文搜索，存储历史对话 |

### 1.3.4 自进化技能系统

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

## 1.4 与竞品对比

### 1.4.1 Hermes Agent vs OpenClaw

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

### 1.4.2 Hermes Agent vs Claude Code

| 维度 | Hermes Agent | Claude Code |
|------|--------------|-------------|
| **定位** | 持久运行的自学习 Agent | 交互式编码助手 |
| **学习机制** | 内置技能自进化闭环 | 无持久技能学习 |
| **记忆** | 跨会话持久化记忆 | 会话级上下文 |
| **消息平台** | Telegram/Discord/Slack 等 | 仅终端 CLI |
| **定时任务** | 内置 Cron 调度器 | 无 |
| **执行后端** | 6 种后端 (本地/Docker/SSH/Modal 等) | 本地终端 |
| **开源许可** | MIT | 闭源 (Anthropic 官方) |

### 1.4.3 选择建议

| 用户类型 | 推荐 | 理由 |
|----------|------|------|
| 技术爱好者/隐私敏感 | OpenClaw | 完全本地部署，数据隐私拉满 |
| 需要定时自动化 | Hermes Agent | 内置 Cron，定时任务方便 |
| 想要开箱即用 | Hermes Agent | 完整终端界面，多行编辑 |
| Claude 生态用户 | Claude Code | 与 Claude 模型深度集成 |
| 多平台协作 | Hermes Agent | 12 种消息平台支持 |

---

## 1.5 核心能力总览

### 1.5.1 支持的模型提供商（18+）

- Nous Portal
- OpenRouter
- z.ai/GLM
- Kimi/Moonshot
- MiniMax
- OpenAI
- 自定义端点

### 1.5.2 支持的消息平台（12 种）

- Telegram
- Discord
- Slack
- WhatsApp
- Signal
- Email
- CLI（终端）

### 1.5.3 执行后端（6 种）

- Local（本地）
- Docker（容器隔离）
- SSH（远程服务器）
- Daytona（云开发环境）
- Singularity（科研容器）
- Modal（无服务器）

### 1.5.4 内置工具（40+）

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
