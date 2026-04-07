# 知识库文档索引 (KB-INDEX)

> 本文档提供知识库目录结构与主题分类映射，用于快速推荐文档存储位置

**最后更新：** 2026-04-07 (v1.17.0)

---

## 目录结构树

```
Knowledge Base/
├── .claude/                    # Claude Code 配置与 Skills
├── .github/                    # GitHub 配置
├── Career/                     # 职业发展相关
├── Guide/                      # 指南类文档
├── Tech/                       # 技术文档
│   ├── AI/                     # AI 相关
│   │   ├── AgentFramework/     # AI Agent 框架
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
| Agent Framework | Tech/AI/AgentFramework/ | Hermes Agent 核心知识体系.md |
| Agent Skill | Tech/AI/AgentSkill/ | Google 5 种设计模式核心知识体系.md |
| BMAD-METHOD | Tech/AI/BMAD/ | BMAD-METHOD 核心知识体系.md |
| Claude Code | Tech/AI/ClaudeCode/ | Claude Code Skills 完全指南.md、Claude Code SubAgent 模式.md、Claude Code 完全指南.md、Claude Code 减少询问配置指南.md、Claude Code Hooks 自动化核心知识体系.md、Claude Code Playwright E2E 测试核心知识体系.md、路由系统可行性研究报告.md |
| Context Engineering | Tech/AI/ContextEngineering/ | 上下文工程核心知识体系.md |
| Document First | Tech/AI/DocumentFirst/ | 文档优先开发范式核心知识体系.md、Spec-First 核心知识体系.md |
| Prompt Engineering | Tech/AI/Prompt Engineering/ | 提示词工程核心知识体系.md |
| SKILL | Tech/AI/SKILL/ | SKILL 核心知识体系.md、Google 5 种设计模式核心知识体系.md |
| Vite | Tech/BuildTools/Vite/ | Vite 核心知识体系.md |
| webpack | Tech/BuildTools/webpack/ | webpack 核心知识体系.md |
| DevOps | Tech/Business/DevOps/ | DevOps 核心知识体系.md |
| Agile | Tech/Business/Agile/ | Epic 用户史诗核心知识体系.md |
| Lazy Loading | Tech/Business/LazyLoading/ | 懒加载核心知识体系.md |
| Virtual List | Tech/Business/VirtualList/ | 虚拟列表核心知识体系.md |
| Next.js | Tech/Frameworks/Next.js/ | Next.js 核心知识体系.md、Next.js 全栈应用测试全流程.md、Next.js E2E 测试核心知识体系.md |
| React | Tech/Frameworks/React/ | React 核心知识体系.md |
| Zustand | Tech/Frameworks/React/Zustand/ | Zustand 核心知识体系.md |
| Supabase | Tech/Frameworks/Supabase/ | Supabase 核心知识体系.md |
| Tailwind CSS | Tech/Frameworks/TailwindCSS/ | Tailwind CSS 核心知识体系.md |
| Taro | Tech/Frameworks/Taro/ | Taro 跨端框架核心知识体系.md |
| Vercel | Tech/Frameworks/Vercel/ | Vercel 核心知识体系.md |
| shadcn/ui | Tech/Frameworks/UI/shadcn/ | shadcn/ui 核心知识体系.md |
| Algorithms | Tech/Fundamentals/Algorithms/ | 滑动窗口核心知识体系.md |
| CSS | Tech/Fundamentals/CSS/ | CSS 核心知识体系.md |
| HTML | Tech/Fundamentals/HTML/ | HTML 核心知识体系.md |
| JavaScript | Tech/Fundamentals/JS/ | JavaScript 核心知识体系.md |
| Network | Tech/Fundamentals/Network/ | 计算机网络核心知识体系.md、RESTful API 设计规范.md、GraphQL 核心知识体系.md、浏览器核心知识体系.md |
| MCP | Tech/Fundamentals/MCP/ | MCP 核心知识体系.md |
| Node.js | Tech/Fundamentals/Node.js/ | Node.js 核心知识体系.md |
| TypeScript | Tech/Fundamentals/TS/ | TypeScript 核心知识体系.md |
| Testing | Tech/Fundamentals/Testing/ | Vitest 核心知识体系.md、Playwright 测试核心知识体系.md |
| Security | Tech/Fundamentals/Security/ | Web 安全核心知识体系.md、OAuth 2.1 核心知识体系.md、JWT 核心知识体系.md |
| 职业发展 | Career/ | 软件工程师简历与开源工具指南.md、前端工程师 AI 转型核心知识体系.md |
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
| Hermes Agent 核心知识体系.md | Hermes Agent 框架 | 2026-04-04 |

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
| progress.txt | 进度追踪 | 2026-04-05 |

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

*KB-INDEX 版本：1.15.0 | 最后扫描：2026-04-07 | 整理完成*

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
