# 知识库文档索引 (KB-INDEX)

> 本文档提供知识库目录结构与主题分类映射，用于快速推荐文档存储位置

**最后更新：** 2026-03-31 (v1.2.0)

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
│   │   ├── AgentSkill/         # Agent Skill 设计模式
│   │   ├── ClaudeCode/         # Claude Code 相关
│   │   ├── ContextEngineering/ # 上下文工程
│   │   ├── Prompt Engineering/ # 提示词工程
│   │   └── SKILL/              # SKILL 规范
│   ├── BuildTools/             # 构建工具
│   │   ├── Vite/
│   │   └── webpack/
│   ├── Business/               # 业务/性能优化
│   │   ├── DevOps/
│   │   ├── LazyLoading/
│   │   └── VirtualList/
│   ├── Frameworks/             # 框架
│   │   ├── Next.js/
│   │   ├── React/
│   │   └── Taro/
│   └── Fundamentals/           # 基础知识
│       ├── Algorithms/
│       ├── CSS/
│       ├── HTML/
│       └── JS/
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
| Agent Skill | Tech/AI/AgentSkill/ | （空） |
| Claude Code | Tech/AI/ClaudeCode/ | Claude Code Skills 完全指南.md、Claude Code SubAgent 模式.md、Claude Code 完全指南.md、Claude Code 减少询问配置指南.md、Claude Code Hooks 自动化核心知识体系.md、路由系统可行性研究报告.md |
| Context Engineering | Tech/AI/ContextEngineering/ | 上下文工程核心知识体系.md |
| Prompt Engineering | Tech/AI/Prompt Engineering/ | 提示词工程核心知识体系.md |
| SKILL | Tech/AI/SKILL/ | SKILL 核心知识体系.md、Google 5 种设计模式核心知识体系.md |
| Vite | Tech/BuildTools/Vite/ | Vite 核心知识体系.md |
| webpack | Tech/BuildTools/webpack/ | webpack 核心知识体系.md |
| DevOps | Tech/Business/DevOps/ | DevOps 核心知识体系.md |
| Lazy Loading | Tech/Business/LazyLoading/ | 懒加载核心知识体系.md |
| Virtual List | Tech/Business/VirtualList/ | 虚拟列表核心知识体系.md |
| Next.js | Tech/Frameworks/Next.js/ | Next.js 核心知识体系.md、Next.js 全栈应用测试全流程.md |
| React | Tech/Frameworks/React/ | React 核心知识体系.md |
| Zustand | Tech/Frameworks/React/Zustand/ | Zustand 核心知识体系.md |
| Taro | Tech/Frameworks/Taro/ | Taro 跨端框架核心知识体系.md |
| Algorithms | Tech/Fundamentals/Algorithms/ | 滑动窗口核心知识体系.md |
| CSS | Tech/Fundamentals/CSS/ | CSS 核心知识体系.md |
| HTML | Tech/Fundamentals/HTML/ | HTML 核心知识体系.md |
| JavaScript | Tech/Fundamentals/JS/ | JavaScript 核心知识体系.md |
| 职业发展 | Career/ | 软件工程师简历与开源工具指南.md |
| 指南 | Guide/ | GitHub 仓库建设与推广完全指南.md、Mermaid 图表改造指南.md、传统项目接入文档优先 AI 开发系统指南.md |
| 项目文档 | docs/ | PRD.md、ROADMAP.md、STYLE_GUIDE.md、TECH_STACK.md |

---

## 文档清单

### Career/

| 文件名 | 主题 | 创建日期 |
|--------|------|----------|
| 软件工程师简历与开源工具指南.md | 职业发展 | 2026-03-28 |

### Guide/

| 文件名 | 主题 | 创建日期 |
|--------|------|----------|
| GitHub 仓库建设与推广完全指南.md | GitHub 运营 | 2026-03-27 |
| Mermaid 图表改造指南.md | 图表绘制 | 2026-03-26 |
| 传统项目接入文档优先 AI 开发系统指南.md | AI 开发系统 | 2026-03-26 |

### Tech/AI/AgentSkill/

| 文件名 | 主题 | 创建日期 |
|--------|------|----------|
| Google 5 种设计模式核心知识体系.md | Agent Skill 设计模式 | 2026-03-31 |

### Tech/AI/ClaudeCode/

| 文件名 | 主题 | 创建日期 |
|--------|------|----------|
| Claude Code Skills 完全指南.md | Claude Code Skills | 2026-03-28 |
| Claude Code SubAgent 模式.md | SubAgent 模式 | 2026-03-30 |
| Claude Code 完全指南.md | 使用指南 | 2026-03-24 |
| Claude Code 减少询问配置指南.md | 权限配置 | 2026-03-31 |
| Claude Code 路由系统可行性研究报告.md | 路由系统 | 2026-03-30 |
| Claude Code Hooks 自动化核心知识体系.md | Hooks 自动化 | 2026-03-31 |

### Tech/AI/ContextEngineering/

| 文件名 | 主题 | 创建日期 |
|--------|------|----------|
| 上下文工程核心知识体系.md | Context Engineering | 2026-03-30 |

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

### Tech/Frameworks/Taro/

| 文件名 | 主题 | 创建日期 |
|--------|------|----------|
| Taro 跨端框架核心知识体系.md | Taro | 2026-03-28 |
| outline.md | 大纲 | 2026-03-28 |

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

*KB-INDEX 版本：1.2.0 | 最后扫描：2026-03-31 | 整理完成*
