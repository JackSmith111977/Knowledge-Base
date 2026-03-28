# Knowledge Base - 文档优先 AI 开发系统

> 基于 Claude Code 的文档优先开发系统知识库

[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by/4.0/)
[![GitHub stars](https://img.shields.io/github/stars/JackSmith111977/Knowledge-Base.svg?style=flat&logo=github)](https://github.com/JackSmith111977/Knowledge-Base/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/JackSmith111977/Knowledge-Base.svg?style=flat&logo=github)](https://github.com/JackSmith111977/Knowledge-Base/network)
[![GitHub issues](https://img.shields.io/github/issues/JackSmith111977/Knowledge-Base.svg?logo=github)](https://github.com/JackSmith111977/Knowledge-Base/issues)
[![Last Commit](https://img.shields.io/github/last-commit/JackSmith111977/Knowledge-Base.svg?logo=github)](https://github.com/JackSmith111977/Knowledge-Base/commits/main)
[![Top Language](https://img.shields.io/github/languages/top/JackSmith111977/Knowledge-Base?color=orange)](https://github.com/JackSmith111977/Knowledge-Base)

## 项目简介

本项目是一个 **文档优先 AI 开发系统** 的知识库，面向有一定开发经验、希望提高开发效率的开发者。

**核心价值：**
1. 学习如何建立文档优先的开发流程
2. 理解 Skill 系统的运作机制
3. 掌握使用 Claude Code 高效构建知识库的方法

## 快速导航

### 核心文档

| 文档 | 说明 |
|------|------|
| [PRD.md](docs/PRD.md) | 产品需求文档 - 目标用户、核心价值、功能范围 |
| [TECH_STACK.md](docs/TECH_STACK.md) | 技术栈覆盖范围 - 已覆盖/计划覆盖的技术栈 |
| [STYLE_GUIDE.md](docs/STYLE_GUIDE.md) | 文档撰写规范 - 章节结构、代码示例、内容深度标准 |
| [ROADMAP.md](docs/ROADMAP.md) | 知识库建设路线图 - 已完成/进行中/计划中的任务 |

### 技术栈知识库

#### 基础知识

| 技术栈 | 文档 |
|--------|------|
| HTML | [Tech/Fundamentals/HTML/HTML 核心知识体系.md](Tech/Fundamentals/HTML/HTML 核心知识体系.md) |
| CSS | [Tech/Fundamentals/CSS/CSS 核心知识体系.md](Tech/Fundamentals/CSS/CSS 核心知识体系.md) |
| JavaScript | [Tech/Fundamentals/JS/JavaScript 核心知识体系.md](Tech/Fundamentals/JS/JavaScript 核心知识体系.md) |
| Algorithms | [Tech/Fundamentals/Algorithms/滑动窗口核心知识体系.md](Tech/Fundamentals/Algorithms/滑动窗口核心知识体系.md) |

#### 框架

| 技术栈 | 文档 |
|--------|------|
| React | [Tech/Frameworks/React/React 核心知识体系.md](Tech/Frameworks/React/React 核心知识体系.md) |
| Next.js | [Tech/Frameworks/Next.js/Next.js 核心知识体系.md](Tech/Frameworks/Next.js/Next.js 核心知识体系.md) |
| Taro | [Tech/Frameworks/Taro/Taro 跨端框架核心知识体系.md](Tech/Frameworks/Taro/Taro 跨端框架核心知识体系.md) |

#### 构建工具

| 技术栈 | 文档 |
|--------|------|
| Vite | [Tech/BuildTools/Vite/Vite 核心知识体系.md](Tech/BuildTools/Vite/Vite 核心知识体系.md) |
| webpack | [Tech/BuildTools/webpack/webpack 核心知识体系.md](Tech/BuildTools/webpack/webpack 核心知识体系.md) |

#### AI / 智能体

| 技术栈 | 文档 |
|--------|------|
| ClaudeCode | [Tech/AI/ClaudeCode/ClaudeCode 完全指南.md](Tech/AI/ClaudeCode/ClaudeCode 完全指南.md) |
| Prompt Engineering | [Tech/AI/Prompt Engineering/提示词工程核心知识体系.md](Tech/AI/Prompt%20Engineering/提示词工程核心知识体系.md) |
| SKILL | [Tech/AI/SKILL/SKILL 核心知识体系.md](Tech/AI/SKILL/SKILL 核心知识体系.md) |

#### 业务专题

| 技术栈 | 文档 |
|--------|------|
| DevOps | [Tech/Business/DevOps/DevOps 核心知识体系.md](Tech/Business/DevOps/DevOps 核心知识体系.md) |
| LazyLoading | [Tech/Business/LazyLoading/懒加载核心知识体系.md](Tech/Business/LazyLoading/懒加载核心知识体系.md) |
| VirtualList | [Tech/Business/VirtualList/虚拟列表核心知识体系.md](Tech/Business/VirtualList/虚拟列表核心知识体系.md) |

### 开发规范

- [CLAUDE.md](.claude/CLAUDE.md) - 会话规则与开发规范
- [progress.txt](progress.txt) - 任务进度追踪

## 使用方法

### 1. 学习文档优先开发流程

1. 阅读 `.claude/CLAUDE.md` 了解会话规则
2. 阅读 `docs/STYLE_GUIDE.md` 了解文档撰写规范
3. 阅读 `docs/PRD.md` 了解项目目标和范围

### 2. 使用 Skill 系统

本项目包含以下 Skill：

| Skill | 用途 |
|-------|------|
| `/research` | 深度调研任意主题并生成结构化知识文档 |
| `/skill-creator` | 通过问答引导创建新 Skill |
| `/study` | 基于费曼学习法的互动教学 |
| `/skill-adapter` | Skill 迁移适配向导 |
| `/project-start` | 文档优先开发系统初始化 |
| `/project-migration` | 传统项目迁移至文档优先系统 |
| `/requirement-change` | 项目需求变更处理 |
| `/auto-skill` | 检测重复命令模式并建议创建 Skill |
| `/kb-trigger` | 检测技术栈缺失并自动调研 |

### 3. 贡献知识库

1. 查看 `docs/ROADMAP.md` 了解待完成的任务
2. 更新 `progress.txt` 标记任务状态
3. 遵循 `docs/STYLE_GUIDE.md` 撰写文档
4. 遵循 `CLAUDE.md` 第 9 节检查清单验证文档质量

## 文档规范

- **内容深度**：每个核心概念必须包含定义、工作原理、源码解析、代码示例、常见误区、最佳实践
- **章节编号**：使用连续编号（1, 2, 3...），子章节使用小数点（2.1, 2.2...）
- **代码示例**：必须配有文字说明，不只给代码
- **禁止事项**：不使用"魔法"等模糊词汇，必须解释清楚背后的实现

## 项目结构

```
.
├── .claude/                 # Claude Code 配置
│   ├── CLAUDE.md           # 会话规则与开发规范
│   ├── agents/             # 子代理配置
│   └── skills/             # Skill 定义
├── docs/                   # 核心文档
│   ├── PRD.md             # 产品需求文档
│   ├── TECH_STACK.md      # 技术栈覆盖范围
│   ├── STYLE_GUIDE.md     # 文档撰写规范
│   └── ROADMAP.md         # 知识库建设路线图
├── Tech/                   # 技术知识库
│   ├── Fundamentals/      # 基础技术
│   │   ├── HTML/
│   │   ├── CSS/
│   │   ├── JS/
│   │   └── Algorithms/
│   ├── Frameworks/        # 框架
│   │   ├── React/
│   │   ├── Next.js/
│   │   └── Taro/
│   ├── BuildTools/        # 构建工具
│   │   ├── Vite/
│   │   └── webpack/
│   ├── AI/                # AI/智能体
│   │   ├── ClaudeCode/
│   │   ├── Prompt Engineering/
│   │   └── SKILL/
│   └── Business/          # 业务专题
│       ├── DevOps/
│       ├── LazyLoading/
│       └── VirtualList/
├── Career/                # 职业发展
├── Guide/                 # 指南文档
├── progress.txt           # 任务进度追踪
└── README.md              # 项目说明（本文档）
```

---

## 🔗 快速链接

| 👥 贡献指南 | 📖 学习路径 | 💬 讨论区 |
|------------|------------|----------|
| [如何参与贡献](#3-贡献知识库) | [文档优先开发流程](#1-学习文档优先开发流程) | [GitHub Issues](https://github.com/JackSmith111977/Knowledge-Base/issues) |

---

## 开源协议

本项目采用 **知识共享署名 4.0 国际许可协议 (CC BY 4.0)** 许可。

[![CC BY 4.0](https://i.creativecommons.org/l/by/4.0/88x31.png)](https://creativecommons.org/licenses/by/4.0/)

**你可以：**
- ✅ 分享 — 在任何媒介以任何形式复制、发行本作品
- ✅ 演绎 — 修改、转换或以本作品为基础进行创作
- ✅ 商业使用 — 用于商业目的

**条件：**
- ⚠️ **署名** — 你必须给出适当的署名，注明是否进行了修改，并链接到本许可协议。

详见 [LICENSE](LICENSE) 文件。

---

*最后更新：2026-03-27*
