# 知识库文档索引 (KB-INDEX)

> 本文档提供知识库目录结构与主题分类映射，用于快速推荐文档存储位置

**最后更新：** 2026-04-22 (v1.37.0)

---

## 目录结构树

```
Knowledge Base/
├── .claude/                    # Claude Code 配置与 Skills
├── .github/                    # GitHub 配置
├── Career/                     # 职业发展相关
├── Daily/                      # 每日任务计划
├── Guide/                      # 指南类文档
├── News/                       # 每日新闻聚合
│   ├── AI 前沿/                # AI 前沿新闻
│   ├── 前端开发/               # 前端开发新闻
│   └── 金融/                   # 金融新闻
├── Tech/                       # 技术文档
│   ├── AI/                     # AI 相关
│   │   ├── AgentFramework/     # AI Agent 框架
│   │   ├── AgentHarness/       # AI Agent Harness 工程
│   │   ├── AgentInfra/         # AI Agent 技术栈全景
│   │   ├── AgentSkill/         # Agent Skill 设计模式
│   │   ├── BMAD/               # BMAD 方法
│   │   ├── ClaudeCode/         # Claude Code 相关
│   │   ├── ContextEngineering/ # 上下文工程
│   │   ├── DocumentFirst/      # 文档优先开发范式
│   │   ├── Prompt Engineering/ # 提示词工程
│   │   └── SKILL/              # SKILL 规范
│   ├── BuildTools/             # 构建工具
│   │   ├── Vite/
│   │   └── webpack/
│   ├── Business/               # 业务/性能优化
│   │   ├── Agile/              # 敏捷开发
│   │   ├── DevOps/
│   │   ├── LazyLoading/
│   │   └── VirtualList/
│   ├── Frameworks/             # 框架
│   │   ├── Next.js/
│   │   ├── React/
│   │   ├── Supabase/
│   │   ├── TailwindCSS/
│   │   ├── Taro/
│   │   ├── Three.js/
│   │   ├── Vercel/
│   │   └── UI/                 # UI 组件库
│   │       └── shadcn/         # shadcn/ui
│   └── Fundamentals/           # 基础知识
│       ├── Algorithms/
│       ├── CSS/
│       ├── HTML/
│       ├── JS/
│       ├── MCP/
│       ├── Network/
│       ├── Node.js/
│       ├── Security/
│       ├── Testing/
│       └── TS/
├── docs/                       # 项目通用文档
├── CONTRIBUTING.md
├── KB-INDEX.md
├── LICENSE
├── progress.txt
└── README.md
```

---

## 主题分类映射表

| 主题/技术 | 推荐目录 | 现有文档 |
|-----------|----------|----------|
| 新闻聚合 | News/ | news-digest-2026-04-13.md（AI 前沿 + 前端开发）、news-digest-2026-04-21.md（金融） |
| Agent Framework | Tech/AI/AgentFramework/ | LangChain LangGraph 核心知识体系.md, Hermes Agent 核心知识体系.md |
| Agent Harness | Tech/AI/AgentHarness/ | Harness Engineering 核心知识体系.md |
| Agent Infra | Tech/AI/AgentInfra/ | AI Agent 技术栈全景核心知识体系.md |
| Agent Skill | Tech/AI/AgentSkill/ | Google 5 种设计模式核心知识体系.md |
| BMAD-METHOD | Tech/AI/BMAD/ | BMAD-METHOD 核心知识体系.md |
| Claude Code | Tech/AI/ClaudeCode/ | Claude Code Skills 完全指南.md、Claude Code SubAgent 模式.md、Claude Code 完全指南.md、Claude Code 减少询问配置指南.md、Claude Code Hooks 自动化核心知识体系.md、Claude Code Playwright E2E 测试核心知识体系.md、路由系统可行性研究报告.md |
| Context Engineering | Tech/AI/ContextEngineering/ | 上下文工程核心知识体系.md |
| Document First | Tech/AI/DocumentFirst/ | 文档优先开发范式核心知识体系.md、Spec-First 核心知识体系.md |
| Prompt Engineering | Tech/AI/Prompt Engineering/ | 提示词工程核心知识体系.md |
| SKILL | Tech/AI/SKILL/ | SKILL 核心知识体系.md（v2.0, 10 章, Agent Skill 生态全景 + MCP 对比 + 安全治理） |
| Vite | Tech/BuildTools/Vite/ | Vite 核心知识体系.md |
| webpack | Tech/BuildTools/webpack/ | webpack 核心知识体系.md |
| DevOps | Tech/Business/DevOps/ | DevOps 核心知识体系.md |
| Agile | Tech/Business/Agile/ | Epic 用户史诗核心知识体系.md |
| Lazy Loading | Tech/Business/LazyLoading/ | 懒加载核心知识体系.md |
| Virtual List | Tech/Business/VirtualList/ | 虚拟列表核心知识体系.md |
| Next.js | Tech/Frameworks/Next.js/ | Next.js 核心知识体系.md、Next.js 全栈应用测试全流程.md、Next.js E2E 测试核心知识体系.md |
| React | Tech/Frameworks/React/ | React 核心知识体系.md |
| Zustand | Tech/Frameworks/React/Zustand/ | Zustand 核心知识体系.md |
| SWR | Tech/Frameworks/React/SWR/ | SWR 核心知识体系.md |
| TanStack Query | Tech/Frameworks/React/TanStack Query/ | TanStack Query 核心知识体系.md |
| Supabase | Tech/Frameworks/Supabase/ | Supabase 核心知识体系.md |
| Tailwind CSS | Tech/Frameworks/TailwindCSS/ | Tailwind CSS 核心知识体系.md |
| Taro | Tech/Frameworks/Taro/ | Taro 跨端框架核心知识体系.md |
| Three.js | Tech/Frameworks/Three.js/ | Three.js 核心知识体系.md |
| Vercel | Tech/Frameworks/Vercel/ | Vercel 核心知识体系.md |
| shadcn/ui | Tech/Frameworks/UI/shadcn/ | shadcn/ui 核心知识体系.md |
| Algorithms | Tech/Fundamentals/Algorithms/ | 滑动窗口核心知识体系.md、灵神 LeetCode 题单学习指南.md、链表核心知识体系.md、学习报告.md、Python ACM 模式面试手撕算法核心知识体系.md |
| CSS | Tech/Fundamentals/CSS/ | CSS 核心知识体系.md |
| HTML | Tech/Fundamentals/HTML/ | HTML 核心知识体系.md |
| JavaScript | Tech/Fundamentals/JS/ | JavaScript 核心知识体系.md |
| Network | Tech/Fundamentals/Network/ | 计算机网络核心知识体系.md、RESTful API 设计规范.md、GraphQL 核心知识体系.md、浏览器核心知识体系.md、Cookie 核心知识体系.md |
| MCP | Tech/Fundamentals/MCP/ | MCP 核心知识体系.md |
| Node.js | Tech/Fundamentals/Node.js/ | Node.js 核心知识体系.md |
| TypeScript | Tech/Fundamentals/TS/ | TypeScript 核心知识体系.md |
| Testing | Tech/Fundamentals/Testing/ | Vitest 核心知识体系.md、Playwright 测试核心知识体系.md、测试覆盖率 核心知识体系.md |
| Security | Tech/Fundamentals/Security/ | Web 安全核心知识体系.md、OAuth 2.1 核心知识体系.md、JWT 核心知识体系.md |
| 职业发展 | Career/ | 软件工程师简历与开源工具指南.md、前端工程师 AI 转型核心知识体系.md |
| 每日任务 | Daily/ | PROGRESS.md（任务管理索引） |
| 指南 | Guide/ | GitHub 仓库建设与推广完全指南.md、Mermaid 图表改造指南.md、传统项目接入文档优先 AI 开发系统指南.md |
| 项目文档 | docs/ | PRD.md、ROADMAP.md、STYLE_GUIDE.md、TECH_STACK.md |

---

## 文档清单

### Career/

| 文件名 | 主题 | 创建日期 |
|--------|------|----------|
| 软件工程师简历与开源工具指南.md | 职业发展 | 2026-03-28 |
| 前端工程师 AI 转型核心知识体系.md | AI 转型 | 2026-03-31 |

### Tech/AI/Career/

| 文件名 | 主题 | 创建日期 |
|--------|------|----------|
| 前端工程师 AI 转型核心知识体系.md | AI 转型 | 2026-03-31 |

### Guide/

| 文件名 | 主题 | 创建日期 |
|--------|------|----------|
| GitHub 仓库建设与推广完全指南.md | GitHub 运营 | 2026-03-27 |
| Mermaid 图表改造指南.md | 图表绘制 | 2026-03-26 |
| 传统项目接入文档优先 AI 开发系统指南.md | AI 开发系统 | 2026-03-26 |

### Tech/AI/AgentFramework/

| 文件名 | 主题 | 创建日期 |
|--------|------|----------|
| LangChain LangGraph 核心知识体系.md | LangChain + LangGraph 框架 | 2026-04-21 |
| Hermes Agent 核心知识体系.md | Hermes Agent 框架 | 2026-04-04 |

### Tech/AI/AgentHarness/

| 文件名 | 主题 | 创建日期 |
|--------|------|----------|
| Harness Engineering 核心知识体系.md | AI Agent Harness 工程 | 2026-04-20 |

### Tech/AI/AgentInfra/

| 文件名 | 主题 | 创建日期 |
|--------|------|----------|
| AI Agent 技术栈全景核心知识体系.md | AI Agent 技术栈全景 | 2026-04-21 |

### Tech/AI/AgentSkill/

| 文件名 | 主题 | 创建日期 |
|--------|------|----------|
| Google 5 种设计模式核心知识体系.md | Agent Skill 设计模式 | 2026-03-31 |

### Tech/AI/BMAD/

| 文件名 | 主题 | 创建日期 |
|--------|------|----------|
| BMAD-METHOD 核心知识体系.md | BMAD-METHOD 框架 | 2026-04-01 |
| progress.txt | 进度追踪 | 2026-04-01 |

### Tech/AI/ClaudeCode/

| 文件名 | 主题 | 创建日期 |
|--------|------|----------|
| Claude Code Skills 完全指南.md | Claude Code Skills | 2026-03-28 |
| Claude Code SubAgent 模式.md | SubAgent 模式 | 2026-03-30 |
| Claude Code 完全指南.md | 使用指南 | 2026-03-24 |
| Claude Code 减少询问配置指南.md | 权限配置 | 2026-03-31 |
| Claude Code Hooks 自动化核心知识体系.md | Hooks 自动化 | 2026-03-31 |
| Claude Code Playwright E2E 测试核心知识体系.md | Playwright E2E 测试 | 2026-04-01 |
| Claude Code 路由系统可行性研究报告.md | 路由系统 | 2026-03-30 |

### Tech/AI/ContextEngineering/

| 文件名 | 主题 | 创建日期 |
|--------|------|----------|
| 上下文工程核心知识体系.md | Context Engineering | 2026-03-30 |

### Tech/AI/DocumentFirst/

| 文件名 | 主题 | 创建日期 |
|--------|------|----------|
| 文档优先开发范式核心知识体系.md | Document-First Development | 2026-04-01 |
| SpecFirst/Spec-First 核心知识体系.md | Spec-Driven Development | 2026-04-06 |

### Tech/AI/Prompt Engineering/

| 文件名 | 主题 | 创建日期 |
|--------|------|----------|
| 提示词工程核心知识体系.md | Prompt Engineering | 2026-03-26 |

### Tech/AI/SKILL/

| 文件名 | 主题 | 创建日期 |
|--------|------|----------|
| SKILL 核心知识体系.md | Agent Skills | 2026-03-25 |
| Google 5 种设计模式核心知识体系.md | Google Agent Skill 设计模式 | 2026-03-31 |

### Tech/BuildTools/Vite/

| 文件名 | 主题 | 创建日期 |
|--------|------|----------|
| Vite 核心知识体系.md | Vite | 2026-03-26 |

### Tech/BuildTools/webpack/

| 文件名 | 主题 | 创建日期 |
|--------|------|----------|
| webpack 核心知识体系.md | webpack | 2026-03-26 |

### Tech/Business/DevOps/

| 文件名 | 主题 | 创建日期 |
|--------|------|----------|
| DevOps 核心知识体系.md | DevOps | 2026-03-28 |

### Tech/Business/Agile/

| 文件名 | 主题 | 创建日期 |
|--------|------|----------|
| Epic 用户史诗核心知识体系.md | 敏捷需求管理 | 2026-04-06 |

### Tech/Business/LazyLoading/

| 文件名 | 主题 | 创建日期 |
|--------|------|----------|
| 懒加载核心知识体系.md | 性能优化 | 2026-03-28 |
| 学习报告.md | 学习报告 | 2026-03-28 |

### Tech/Business/VirtualList/

| 文件名 | 主题 | 创建日期 |
|--------|------|----------|
| 虚拟列表核心知识体系.md | 性能优化 | 2026-03-28 |

### Tech/Frameworks/Next.js/

| 文件名 | 主题 | 创建日期 |
|--------|------|----------|
| Next.js 核心知识体系.md | Next.js 基础 | 2026-03-26 |
| Next.js 全栈应用测试全流程.md | 测试 | 2026-03-30 |
| 学习报告.md | 学习报告 | 2026-03-27 |

### Tech/Frameworks/React/

| 文件名 | 主题 | 创建日期 |
|--------|------|----------|
| React 核心知识体系.md | React | 2026-03-26 |
| 学习报告 - 2026-03-26.md | 学习报告 | 2026-03-26 |
| 面试报告.md | 面试资料 | 2026-03-25 |

### Tech/Frameworks/React/Zustand/

| 文件名 | 主题 | 创建日期 |
|--------|------|----------|
| Zustand 核心知识体系.md | Zustand | 2026-03-28 |
| outline.md | 大纲 | 2026-03-28 |

### Tech/Frameworks/React/SWR/

| 文件名 | 主题 | 创建日期 |
|--------|------|----------|
| SWR 核心知识体系.md | SWR | 2026-04-07 |
| progress.txt | 进度追踪 | 2026-04-07 |

### Tech/Frameworks/React/TanStack Query/

| 文件名 | 主题 | 创建日期 |
|--------|------|----------|
| TanStack Query 核心知识体系.md | TanStack Query v5 | 2026-04-14 |
| progress.txt | 进度追踪 | 2026-04-14 |

### Tech/Frameworks/TailwindCSS/

| 文件名 | 主题 | 创建日期 |
|--------|------|----------|
| Tailwind CSS 核心知识体系.md | Tailwind CSS | 2026-04-05 |
| progress.txt | 进度追踪 | 2026-04-05 |

### Tech/Frameworks/Supabase/

| 文件名 | 主题 | 创建日期 |
|--------|------|----------|
| Supabase 核心知识体系.md | Supabase BaaS 平台 | 2026-04-02 |
| progress.txt | 进度追踪 | 2026-04-02 |

### Tech/Frameworks/Taro/

| 文件名 | 主题 | 创建日期 |
|--------|------|----------|
| Taro 跨端框架核心知识体系.md | Taro | 2026-03-28 |
| outline.md | 大纲 | 2026-03-28 |

### Tech/Frameworks/Three.js/

| 文件名 | 主题 | 创建日期 |
|--------|------|----------|
| Three.js 核心知识体系.md | Three.js 3D 图形库 | 2026-04-08 |
| progress.txt | 进度追踪 | 2026-04-08 |

### Tech/Frameworks/UI/shadcn/

| 文件名 | 主题 | 创建日期 |
|--------|------|----------|
| shadcn/ui 核心知识体系.md | shadcn/ui 组件库 | 2026-04-07 |
| progress.txt | 进度追踪 | 2026-04-07 |

### Tech/Frameworks/Vercel/

| 文件名 | 主题 | 创建日期 |
|--------|------|----------|
| Vercel 核心知识体系.md | Vercel 部署平台 | 2026-04-07 |
| progress.txt | 进度追踪 | 2026-04-07 |

### Tech/Fundamentals/Algorithms/

| 文件名 | 主题 | 创建日期 |
|--------|------|----------|
| 滑动窗口核心知识体系.md | 算法 | 2026-03-28 |
| 灵神 LeetCode 题单学习指南.md | 算法题单 | 2026-04-13 |
| 链表核心知识体系.md | 算法/链表 | 2026-04-13 |
| 学习报告.md | 学习报告 | 2026-04-13 |

### Tech/Fundamentals/CSS/

| 文件名 | 主题 | 创建日期 |
|--------|------|----------|
| CSS 核心知识体系.md | CSS | 2026-03-28 |
| 面试报告.md | 面试资料 | 2026-03-28 |

### Tech/Fundamentals/HTML/

| 文件名 | 主题 | 创建日期 |
|--------|------|----------|
| HTML 核心知识体系.md | HTML | 2026-03-28 |
| 面试报告.md | 面试资料 | 2026-03-28 |

### Tech/Fundamentals/JS/

| 文件名 | 主题 | 创建日期 |
|--------|------|----------|
| JavaScript 核心知识体系.md | JavaScript | 2026-03-28 |
| 面试报告.md | 面试资料 | 2026-03-28 |

### Tech/Fundamentals/Testing/

| 文件名 | 主题 | 创建日期 |
|--------|------|----------|
| Vitest 核心知识体系.md | Vitest 测试框架 | 2026-04-05 |
| Playwright 测试核心知识体系.md | Playwright E2E 测试 | 2026-04-05 |
| 测试覆盖率 核心知识体系.md | 测试覆盖率 / Code Coverage | 2026-04-10 |

### Tech/Fundamentals/Security/

| 文件名 | 主题 | 创建日期 |
|--------|------|----------|
| Web 安全核心知识体系.md | Web 安全 | 2026-04-05 |
| OAuth 2.1 核心知识体系.md | OAuth 2.1 授权协议 | 2026-04-06 |
| JWT 核心知识体系.md | JWT 认证令牌 | 2026-04-07 |

### Tech/Fundamentals/Network/

| 文件名 | 主题 | 创建日期 |
|--------|------|----------|
| 计算机网络核心知识体系.md | 计算机网络 | 2026-04-01 |
| RESTful API 设计规范.md | RESTful API | 2026-04-05 |
| GraphQL 核心知识体系.md | GraphQL | 2026-04-05 |
| 浏览器核心知识体系.md | 浏览器原理 | 2026-04-05 |
| Cookie/ | Cookie 子目录 | 2026-04-09 |

### Tech/Fundamentals/MCP/

### Tech/Fundamentals/Network/Cookie/

| 文件名 | 主题 | 创建日期 |
|--------|------|----------|
| Cookie 核心知识体系.md | HTTP Cookie | 2026-04-09 |
| progress.txt | 进度追踪 | 2026-04-09 |

### Tech/Fundamentals/MCP/

| 文件名 | 主题 | 创建日期 |
|--------|------|----------|
| MCP 核心知识体系.md | MCP (Model Context Protocol) | 2026-04-03 |

### Tech/Fundamentals/TS/

| 文件名 | 主题 | 创建日期 |
|--------|------|----------|
| TypeScript 核心知识体系.md | TypeScript | 2026-04-02 |

### docs/

| 文件名 | 主题 | 创建日期 |
|--------|------|----------|
| PRD.md | 产品需求文档 | 2026-03-27 |
| ROADMAP.md | 路线图 | 2026-03-27 |
| STYLE_GUIDE.md | 风格指南 | 2026-03-27 |
| TECH_STACK.md | 技术栈 | 2026-03-27 |

### News/

| 文件名 | 主题 | 创建日期 |
|--------|------|----------|
| AI 前沿/news-digest-2026-04-11.md | AI 新闻 | 2026-04-11 |
| AI 前沿/news-digest-2026-04-13.md | AI 新闻 | 2026-04-13 |
| AI 前沿/news-digest-2026-04-14.md | AI 新闻 | 2026-04-14 |
| AI 前沿/news-digest-2026-04-18.md | AI 新闻 | 2026-04-18 |
| AI 前沿/news-digest-2026-04-20.md | AI 新闻 | 2026-04-20 |
| AI 前沿/news-digest-2026-04-22.md | AI 新闻 | 2026-04-22 |
| 前端开发/news-digest-2026-04-13.md | 前端新闻 | 2026-04-13 |
| 前端开发/news-digest-2026-04-20.md | 前端新闻 | 2026-04-20 |
| 金融/news-digest-2026-04-21.md | 金融新闻 | 2026-04-21 |

---

## 存储位置推荐规则

1. **AI 相关** → `Tech/AI/` 或其子目录
2. **框架/库** → `Tech/Frameworks/`
3. **构建工具** → `Tech/BuildTools/`
4. **编程语言基础** → `Tech/Fundamentals/`
5. **业务/性能优化** → `Tech/Business/`
6. **职业发展** → `Career/`
7. **操作指南** → `Guide/`
8. **项目特定文档** → `docs/` 或项目根目录

---

## 整理记录

### 2026-04-01 整理（BMAD-METHOD）

**执行的操作：**
1. ✅ 创建 `Tech/AI/BMAD/` 目录
2. ✅ 注册《BMAD-METHOD 核心知识体系.md》文档
3. ✅ 注册 `progress.txt` 进度追踪文件
4. ✅ 更新 KB-INDEX 版本至 1.5.0

**整理后效果：**
- BMAD-METHOD 框架文档归集到 `Tech/AI/BMAD/` 目录
- 与 Claude Code、AgentSkill 等并列 AI 技术子目录
- 支持后续 BMAD 相关知识库扩展

### 2026-04-01 整理

**执行的操作：**
1. ✅ 添加 `Tech/AI/DocumentFirst/` 目录到索引
2. ✅ 注册《文档优先开发范式核心知识体系.md》文档
3. ✅ 更新 KB-INDEX 版本至 1.4.0

**整理后效果：**
- 文档优先开发范式文档归集到 `Tech/AI/DocumentFirst/` 目录
- 与 Context Engineering、Prompt Engineering 等并列 AI 开发范式子目录
- 支持后续文档优先相关知识库扩展

### 2026-04-01 整理（上午）

**执行的操作：**
1. ✅ 添加 `Tech/Fundamentals/Network/` 目录到索引
2. ✅ 注册《计算机网络核心知识体系.md》文档
3. ✅ 更新 KB-INDEX 版本至 1.3.0

**整理后效果：**
- 计算机网络文档归集到 `Tech/Fundamentals/Network/` 目录
- 支持后续网络相关知识库扩展

### 2026-03-31 整理

**执行的操作：**
1. ✅ 移动 `AI/ContextEngineering/` → `Tech/AI/ContextEngineering/`
2. ✅ 移动 `AI/Agent Skill/` → `Tech/AI/AgentSkill/`
3. ✅ 移动 `Tech/AI/Claude Code 减少询问配置指南.md` → `Tech/AI/ClaudeCode/`
4. ✅ 删除重复的根目录 `NextJS/`（仅含 progress 文件）
5. ✅ 更新 KB-INDEX 索引

**整理后效果：**
- AI 相关文档统一到 `Tech/AI/` 目录
- Claude Code 文档归集到 `Tech/AI/ClaudeCode/` 子目录
- 消除了重复的目录结构

---

*KB-INDEX 版本：1.20.0 | 最后扫描：2026-04-08 | 整理完成*

---

## 整理记录

### 2026-04-05 整理（浏览器核心知识体系）

**执行的操作：**
1. ✅ 创建《浏览器核心知识体系.md》文档（约 1100+ 行）
2. ✅ 注册文档到 KB-INDEX
3. ✅ 更新 KB-INDEX 版本至 1.11.0

**整理后效果：**
- 浏览器底层原理文档收录到 `Tech/Fundamentals/Network/` 目录
- 8 章涵盖：基础认知、渲染流水线、V8 引擎原理、事件循环、网络栈与缓存、浏览器存储、安全模型、性能优化实战
- 包含 Mermaid 架构图、代码示例、最佳实践

### 2026-04-05 整理（P0 调研完成）

**执行的操作：**
1. ✅ 创建 `Tech/Frameworks/TailwindCSS/` 目录
2. ✅ 创建 `Tech/Fundamentals/Testing/` 目录
3. ✅ 创建 `Tech/Fundamentals/Security/` 目录
4. ✅ 注册 6 篇 P0 优先级文档：
   - 《Vitest 核心知识体系.md》（约 800+ 行）
   - 《Playwright 测试核心知识体系.md》（约 900+ 行）
   - 《Tailwind CSS 核心知识体系.md》（约 900+ 行）
   - 《RESTful API 设计规范.md》（约 1000+ 行）
   - 《GraphQL 核心知识体系.md》（约 950+ 行）
   - 《Web 安全核心知识体系.md》（约 900+ 行）
5. ✅ 更新 KB-INDEX 版本至 1.10.0

**整理后效果：**
- P0 优先级 6 个主题全部完成调研和文档创建
- 新增 3 个分类目录：TailwindCSS、Testing、Security
- 知识库新增约 5500+ 行高质量技术文档
- 文档涵盖：测试框架、E2E 测试、CSS 框架、API 设计、GraphQL、Web 安全

### 2026-04-06 整理 (OAuth 2.1)

**执行的操作:**
1. ✅ 创建 `Tech/Fundamentals/Security/OAuth/` 目录
2. ✅ 创建《OAuth 2.1 核心知识体系.md》文档 (8 章，约 26000+ 行)
3. ✅ 注册文档到 KB-INDEX
4. ✅ 更新 KB-INDEX 版本至 1.12.0

**整理后效果:**
- OAuth 2.1 授权协议文档收录到 `Tech/Fundamentals/Security/` 目录
- 8 章涵盖：基础认知、核心角色与信任模型、授权模式详解、令牌机制与安全、OAuth 2.1 安全最佳实践、OAuth 与 OIDC、实战应用、常见误区与面试问题
- 包含 Mermaid 流程图、代码示例、RFC 规范引用

### 2026-04-06 整理 (Epic 用户史诗)

**执行的操作:**
1. ✅ 创建 `Tech/Business/Agile/` 目录
2. ✅ 创建《Epic 用户史诗核心知识体系.md》文档 (8 章，约 38000 行)
3. ✅ 注册文档到 KB-INDEX
4. ✅ 更新 KB-INDEX 版本至 1.13.0

**整理后效果:**
- 敏捷需求管理文档收录到 `Tech/Business/Agile/` 目录
- 8 章涵盖：基础认知、Epic 战略定义、Feature 产品分解、User Story 交付细化、Epic 拆分方法论、用户故事地图、Sprint 管理、实战案例与误区
- 包含 Mermaid 流程图、大量实战案例、检查清单和模板

### 2026-04-06 整理 (Spec-First)

**执行的操作:**
1. ✅ 创建 `Tech/AI/DocumentFirst/SpecFirst/` 目录
2. ✅ 创建《Spec-First 核心知识体系.md》文档 (8 章，约 40,000+ 行)
3. ✅ 注册文档到 KB-INDEX
4. ✅ 更新 KB-INDEX 版本至 1.14.0

**整理后效果:**
- Spec-Driven Development 方法论文档收录到 `Tech/AI/DocumentFirst/SpecFirst/` 目录
- 8 章涵盖：概述、核心概念、理论基础、SDD 全流程、载体与工具、AI 时代实践、实战案例、未来演进
- 包含 Mermaid 流程图、大量实战案例、检查清单和模板

### 2026-04-07 整理 (JWT)

**执行的操作:**
1. ✅ 创建 `Tech/Fundamentals/Security/JWT/` 目录
2. ✅ 创建《JWT 核心知识体系.md》文档 (8 章，约 50,000+ 行)
3. ✅ 注册文档到 KB-INDEX
4. ✅ 更新 KB-INDEX 版本至 1.15.0

**整理后效果:**
- JWT 认证令牌技术文档收录到 `Tech/Fundamentals/Security/` 目录
- 8 章涵盖：基础认知、结构解析、工作流程、签名算法、安全最佳实践、实战应用、常见误区与面试问题、实战案例与检查清单
- 包含 Mermaid 流程图、多语言代码示例、RFC 规范引用、15 道面试高频题

### 2026-04-07 整理 (shadcn/ui)

**执行的操作:**
1. ✅ 创建 `Tech/Frameworks/UI/shadcn/` 目录
2. ✅ 创建《shadcn/ui 核心知识体系.md》文档 (8 章，约 21,500+ 字)
3. ✅ 注册文档到 KB-INDEX
4. ✅ 更新 KB-INDEX 版本至 1.16.0

**整理后效果:**
- shadcn/ui 组件库文档收录到 `Tech/Frameworks/UI/` 目录
- 8 章涵盖：基础认知、架构设计、核心组件、主题定制、可访问性、工程化、实战应用、常见误区与面试问题
- 包含 Mermaid 流程图、代码示例、50+ 组件列表、面试高频题

### 2026-04-07 整理 (Vercel)

**执行的操作:**
1. ✅ 创建 `Tech/Frameworks/Vercel/` 目录
2. ✅ 创建《Vercel 核心知识体系.md》文档 (8 章，约 25,000+ 字)
3. ✅ 注册文档到 KB-INDEX
4. ✅ 更新 KB-INDEX 版本至 1.17.0

**整理后效果:**
- Vercel 部署平台文档收录到 `Tech/Frameworks/Vercel/` 目录
- 8 章涵盖：基础认知、部署系统、Serverless Functions、Edge Functions、全球 CDN 与性能优化、AI 生态系统、高级特性与集成、实战案例与常见误区
- 包含 Mermaid 流程图 15+ 个、代码示例 40+ 个、面试高频题

### 2026-04-07 整理 (SWR)

**执行的操作:**
1. ✅ 创建 `Tech/Frameworks/React/SWR/` 目录
2. ✅ 创建《SWR 核心知识体系.md》文档 (8 章，约 25,000+ 字)
3. ✅ 注册文档到 KB-INDEX
4. ✅ 更新 KB-INDEX 版本至 1.18.0

**整理后效果:**
- SWR 数据请求库文档收录到 `Tech/Frameworks/React/SWR/` 目录
- 8 章涵盖：基础认知、核心工作原理、快速开始、核心 API 详解、高级特性、性能优化、实战应用场景、常见误区与面试问题
- 包含 Mermaid 流程图、代码示例、15 道面试高频题

### 2026-04-08 整理（文档内容优化）

**执行的操作：**
1. ✅ 优化《JavaScript 核心知识体系.md》- 完善作用域、事件循环等核心概念
2. ✅ 优化《TypeScript 核心知识体系.md》- 调整章节结构，简化高级类型编程内容
3. ✅ 优化《浏览器核心知识体系.md》- 新增光栅化（Rasterization）详解
4. ✅ 优化《Supabase 核心知识体系.md》- 新增双 Token 机制详解
5. ✅ 更新 KB-INDEX 版本至 1.19.0

**整理后效果：**
- JavaScript：作用域类型、作用域链、执行上下文等核心概念更清晰
- TypeScript：章节结构更合理，适合循序渐进学习
- 浏览器：新增光栅化过程详解，完善渲染流水线理解
- Supabase：双 Token 机制、刷新流程、安全最佳实践更完整

### 2026-04-04 整理（Hermes Agent）

**执行的操作：**
1. ✅ 创建 `Tech/AI/AgentFramework/` 目录
2. ✅ 注册《Hermes Agent 核心知识体系.md》文档（8 章）
3. ✅ 更新 KB-INDEX 版本至 1.9.0

**整理后效果：**
- Hermes Agent 文档归集到 `Tech/AI/AgentFramework/` 目录
- 与 ClaudeCode、AgentSkill 等并列 AI 技术子目录
- 支持后续 Agent 框架相关知识库扩展（如 OpenClaw 等）

---

## 整理记录

### 2026-04-14 整理（Python ACM 模式）

**执行的操作：**
1. ✅ 创建《Python ACM 模式面试手撕算法核心知识体系.md》文档（8 章，约 2150+ 行）
2. ✅ 注册文档到 KB-INDEX
3. ✅ 更新 KB-INDEX 版本至 v1.30.0

**整理后效果：**
- Python ACM 模式技术文档收录到 `Tech/Fundamentals/Algorithms/` 目录
- 8 章涵盖：基础认知、输入体系（input vs sys.stdin）、输入场景模板、输出格式规范、数据结构读取、高频踩坑、面试实战模板、常见误区与面试问题
- 包含 Mermaid 流程图 10+ 个、代码示例 50+ 个、15 个来源交叉验证
- 与灵神 LeetCode 题单学习指南并列 Algorithms 分类

---

### 2026-04-21 整理（AI Agent 技术栈全景调研）

**执行的操作：**
1. ✅ 创建 `Tech/AI/AgentInfra/` 目录
2. ✅ 创建《AI Agent 技术栈全景核心知识体系.md》文档（11 章）
3. ✅ 注册文档到 KB-INDEX
4. ✅ 更新 KB-INDEX 版本至 v1.35.0

**整理后效果：**
- AI Agent 技术栈全景文档收录到 `Tech/AI/AgentInfra/` 目录
- 11 章：技术栈知识图谱、10 大框架横评、架构设计模式、向量数据库对比、模型部署框架、可观测性工具、MCP/A2A 协议、安全防御架构、K8s GPU 调度、开发者技能图谱、生产选型速查表
- 与 AgentFramework/AgentHarness/AgentSkill 并列，形成完整 AI Agent 知识体系

---

### 2026-04-20 整理（SKILL v2.0 扩展调研）

**执行的操作：**
1. ✅ 扩展《SKILL 核心知识体系.md》至 v2.0（10 章，约 35,000+ 字）
2. ✅ 新增 6 个专章：Skill vs MCP 深度对比、底层原理解析、生命周期与工作流程、三层协议架构、Agentic 工作流模式、安全与治理
3. ✅ 创建 progress.txt 进度追踪文件
4. ✅ 更新 KB-INDEX 版本至 v1.32.0

**整理后效果：**
- Agent Skill 生态全景：2025-2026 时间线、85,000+ Skills、27 平台支持
- Skill vs MCP 深度对比：六维度对比 + 14 维度总结表 + 5 种协作模式
- 底层原理：渐进式披露 Token 经济学、语义匹配机制、沙箱隔离模型
- 生命周期：9 阶段状态流转 + 错误处理路径
- 三层协议：MCP + ACP + A2A + Skill 在各层中的角色
- Agentic 工作流：Google 21 种设计模式中的 6 种核心模式 + Skill 堆叠实战
- 安全治理：MSB 安全基准（ICLR 2026）、ClawHavoc 事件、12 类攻击面
- 跨平台最佳实践：Claude Code + Antigravity + OpenClaw + Cursor

---

## 整理记录

### 2026-04-20 整理 v2（AI 前沿新闻聚合 - v1.4.0 SubAgent 并行模式）

**执行的操作：**
1. ✅ SubAgent 并行采集：6 组并行 SubAgent 覆盖 4 个信源（HackerNews、Ars Technica、量子位、The Verge），其余 6 组因 429 配额超限失败（36kr、机器之心、TechCrunch、Anthropic、MIT Tech Review、CNBC）
2. ✅ web-access CDP 模式：check-deps.mjs 检查通过 → CDP `/new` + `/eval` + `/scroll` 提取
3. ✅ 三级去重：L1 URL 精确去重、L2 标题相似度 >85%、L3 语义重叠（67 条→66 条，1 条重复）
4. ✅ 4 维度智能评分（来源权威性 30% + 时效性 20% + 相关性 25% + 内容深度 25%）
5. ✅ 内容质量门控：17 条摘要过短过滤
6. ✅ 创建《news-digest-2026-04-20.md》报告（49 条新闻，评分门控 > 4.0）
7. ✅ 更新 KB-INDEX 索引
8. ✅ 信源调研：8 个候选信源评估（Wired ✅推荐、CNBC ✅推荐、The Register 条件推荐、ZDNet 区域封锁、Protocol 已关闭、TechRadar 404、VentureBeat 已重定向、ainews.com 条件推荐）

**本期热点：**
- Anthropic Claude Design 发布（HN 1218 分热帖）
- OpenAI Codex 更新：支持 macOS 应用操作，直接对标 Claude Code
- NSA 使用 Anthropic Mythos  despite 五角大楼黑名单
- The Verge 被黑：第三方 AI 工具导致供应链攻击
- Vercel 平台遭黑客攻击
- 全球 RAM 短缺可能持续数年（AI 需求推动）
- OpenAI Sora 负责人 Bill Peebles 和 AI 科学 VP Kevin Weil 离职

---

### 2026-04-20 整理 v1（AI 前沿新闻聚合 - v1.3.0 CDP 模式执行）

**执行的操作：**
1. ✅ web-access CDP 模式：check-deps.mjs 检查通过 → 并行打开 8 个高权重信源（量子位、TechCrunch、HackerNews、The Verge AI、MIT Tech Review AI、Axios）
2. ✅ CDP `/new` + `/eval` + `/scroll` 提取新闻列表 → Jina 辅助正文读取
3. ✅ 三级去重 + 72 小时硬性门控过滤（25 条→15 条→10 条）
4. ✅ 全文获取：8 成功（CDP 正文提取）/ 2 受限
5. ✅ 5 维度智能评分（来源权威性 25% + 时效性 15% + 相关性 20% + 内容深度 20% + 事实标注完整性 20%）
6. ✅ 创建《news-digest-2026-04-20.md》报告（10 条新闻，评分门控 > 4.0）
7. ✅ 更新 KB-INDEX 索引

**本期热点：**
- 苏度科技 Sudo R1：零真机数据训练，zero-shot 抓取 98% 成功率
- Cerebras 提交 IPO：$23B 估值，$10B+ OpenAI 大单
- NSA 使用 Anthropic Mythos，尽管五角大楼列为供应链风险
- OpenAI 存在性焦虑：收购 Hiro + TBPN 解决产品和品牌困境
- Anthropic 与特朗普政府关系缓和
- Kevin Weil / Bill Peebles 离开 OpenAI，Sora 因日亏 $100 万被关闭

---

### 2026-04-18 整理（AI 前沿新闻聚合 - 每日执行）

**执行的操作：**
1. ✅ 执行 news-digest Pipeline，3 组 WebSearch 覆盖 20+ 信源
2. ✅ 三级去重：L1 URL 去重 2 条、L2 标题去重 1 条
3. ✅ 来源可信度验证 + 链接有效性检查
4. ✅ 4 维度智能评分（来源权威性 30% + 时效性 20% + 相关性 25% + 内容深度 25%）
5. ✅ 创建《news-digest-2026-04-18.md》报告（18 条新闻，评分门控 > 4.0）
6. ✅ 更新 KB-INDEX 索引

**本期热点：**
- GPT-6 预计 4 月 14 日发布（代号 Spud，5-6 万亿参数，200 万 Token 上下文）
- Claude 半月内宕机 7 次，API 可用率仅 98.95%，客户流失至 OpenAI
- Anthropic 研究：LLM 蒸馏过程中会潜意识传递隐藏偏好
- 五部门出台 AI 拟人化互动服务管理新规，7 月 15 日起施行
- Anthropic 年化收入突破 300 亿美元，首次超越 OpenAI
- METR 报告：AI 能力翻倍周期压缩至 88.6 天

---

### 2026-04-14 整理（AI 前沿新闻聚合 - 每日执行）

**执行的操作：**
1. ✅ 执行 news-digest Pipeline，5 组并行搜索覆盖 20+ 信源
2. ✅ 三级去重 + 来源可信度验证 + 链接有效性检查
3. ✅ 4 维度智能评分（来源权威性 30% + 时效性 20% + 相关性 25% + 内容深度 25%）
4. ✅ 创建《news-digest-2026-04-14.md》报告（15 条新闻，评分门控 > 4.0）
5. ✅ 更新 KB-INDEX 版本至 v1.29.0

**本期热点：**
- OpenAI 开设伦敦首个永久办公室（500 人规模）
- "Giant Superatoms" 突破量子计算难题
- Anthropic Mythos 模型遭美监管层质询，零日漏洞挖掘能力引发关注
- AI Agent 完成"成人礼"：腾讯发布 Q1 白皮书
- Anthropic 年化收入突破 300 亿美元，首次超越 OpenAI

---

## 整理记录

### 2026-04-13 整理（AI 前沿新闻聚合 - 每日执行）

**执行的操作：**
1. ✅ 执行 news-digest Pipeline，搜索 4 个关键词 + CDP 浏览器直连 3 个信源
2. ✅ 三级去重：L1 精确去重 4 条、L2 标题去重 3 条、L3 语义去重 3 条
3. ✅ 来源可信度验证 + 链接有效性检查
4. ✅ 4 维度智能评分（来源权威性 30% + 时效性 20% + 相关性 25% + 内容深度 25%）
5. ✅ 创建《news-digest-2026-04-13.md》报告（12 条新闻，评分门控 > 4.0）
6. ✅ 更新 KB-INDEX 版本至 v1.27.0

**本期热点：**
- GPT-6 定档 4 月 14 日发布（代号 Spud，性能提升 40%）
- Claude Mythos 门控预览发布，网络安全测试满分引发 Cloudflare 股价暴跌
- 智元机器人 4 月 17 日合作伙伴大会
- Anthropic 封堵 OpenClaw 第三方工具滥用
- Meta 发布首款自研 AI 模型 Muse Spark

---

## 整理记录

### 2026-04-11 整理（AI 前沿新闻聚合）

**执行的操作：**
1. ✅ 执行 news-digest Pipeline，采集 6 个信源（量子位、36kr、TechCrunch、Anthropic Blog、OpenAI Blog、HackerNews）
2. ✅ 创建《news-digest-2026-04-11.md》报告（15 条新闻，4 维度评分）
3. ✅ 更新 KB-INDEX 版本至 v1.25.0

**整理后效果：**
- 每日 AI 前沿新闻聚合报告生成到 `News/AI 前沿/` 目录
- 15 条精选新闻涵盖：行业事件、产品发布、融资动态、技术突破、安全治理
- 评分系统：来源权威性(30%) + 时效性(20%) + 相关性(25%) + 内容深度(25%)

---

## 整理记录

### 2026-04-10 整理（测试覆盖率）

**执行的操作：**
1. ✅ 创建《测试覆盖率 核心知识体系.md》文档（8 章，约 130,000+ 字）
2. ✅ 创建 `progress.txt` 进度追踪文件
3. ✅ 归档 3 个草稿文件到 `.work/archive/2026-04-10/`
4. ✅ 注册文档到 KB-INDEX
5. ✅ 更新 KB-INDEX 版本至 v1.22.0

**整理后效果：**
- 测试覆盖率技术文档收录到 `Tech/Fundamentals/Testing/` 目录
- 8 章涵盖：基础认知、核心指标体系（8 种覆盖率指标）、工作原理与插桩机制（AST/字节码/sys.settrace/V8 原生）、主流工具链（7 种语言）、可视化与报告解读、CI/CD 集成与质量门禁、最佳实践与常见误区、常见误区与面试问题
- 包含 Mermaid 流程图 10+ 个、代码示例 50+ 个、22+ 来源交叉验证、12 道分级面试题目
- 与 Vitest、Playwright 测试文档并列 Testing 分类

---

### 2026-04-09 整理（Cookie）

**执行的操作：**
1. ✅ 创建 `Tech/Fundamentals/Network/Cookie/` 目录
2. ✅ 创建《Cookie 核心知识体系.md》文档（8 章，约 25,000+ 字）
3. ✅ 注册文档到 KB-INDEX
4. ✅ 更新 KB-INDEX 版本至 1.21.0

**整理后效果：**
- Cookie 核心技术文档收录到 `Tech/Fundamentals/Network/` 目录
- 8 章涵盖：基础认知、核心属性与 API、工作流程与作用域、安全机制、第三方 Cookie 与隐私、CHIPS 分区 Cookie、实战应用、常见误区与面试问题
- 包含 Mermaid 流程图 10+ 个、代码示例 30+ 个、18 个来源交叉验证、20 道分级面试题目

---

## 整理记录

### 2026-04-02 整理（TypeScript 整合）

**执行的操作：**
1. ✅ 整合 8 章草稿为《TypeScript 核心知识体系.md》（约 4500+ 行）
2. ✅ 创建 `progress.txt` 进度追踪文件
3. ✅ 归档草稿文件到 `.work/archive/2026-04-02/`
4. ✅ 更新 KB-INDEX 版本至 1.8.0

**整理后效果：**
- TypeScript 核心知识体系文档完成整合
- 8 章涵盖：基础认知、类型系统、高级类型编程、泛型、类型推断、工程化、模块系统、实战最佳实践
- 临时草稿已归档，保留 7 天后删除

### 2026-04-02 整理（TypeScript）

**执行的操作：**
1. ✅ 创建 `Tech/Fundamentals/TS/` 目录
2. ✅ 注册《TypeScript 核心知识体系.md》文档（8 章，约 9500 行）
3. ✅ 更新 KB-INDEX 版本至 1.7.0

**整理后效果：**
- TypeScript 核心知识体系文档归集到 `Tech/Fundamentals/TS/` 目录
- 与 JS/HTML/CSS/Network 并列基础技术子目录
- 8 章涵盖：基础认知、类型系统、高级类型编程、泛型、类型推断、工程化、模块系统、实战最佳实践
