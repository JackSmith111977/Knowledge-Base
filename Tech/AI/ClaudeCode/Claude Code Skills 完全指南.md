# Claude Code Skills 全局安装与配置完全指南

> Claude Code Skills 是一套可定制化的"技能包"系统，允许用户将专业知识、任务流程或可执行脚本打包成独立模块，供 Claude 根据上下文自动调用，实现从通用助手到领域专家的无缝切换。

**特色：** 全局安装详解 + SKILL.md 格式规范 + 9 种类型 + 精选推荐 + 安全指南

---

## 目录

1. [概述](#1-概述)
2. [核心概念](#2-核心概念)
3. [快速入门](#3-快速入门)
4. [全局安装详解](#4-全局安装详解)
5. [SKILL.md 格式规范](#5-skillmd-格式规范)
6. [9 种 Skill 类型](#6-9-种-skill-类型)
7. [实战案例](#7-实战案例)
8. [常见问题](#8-常见问题)
9. [学习资源](#9-学习资源)

---

## 1. 概述

### 1.1 什么是 Claude Code Skills

**Claude Code Skills** 是 Anthropic 推出的一套基于提示词的模块化能力扩展系统。

**本质定义：**
Skill 不是一段代码或插件，而是一套**"触发器 + 知识库 + 脚本"**的打包组合。你可以把它想象成给 Claude 做的一份**"岗位培训手册"**。

**通俗理解：**
- 平时 Claude 是个通才
- 当你触发关键词时，它变身成某个领域的专家
- 按照你预设的流程干活，输出标准化结果

---

### 1.2 为什么需要 Skills

**没有 Skills 时：**
```
用户：帮我写个代码审查
Claude：好的，我会检查代码的可读性、性能和安全性...
       （每次都要重新解释，输出质量不稳定）
```

**有 Skills 后：**
```
用户：帮我写个代码审查
Claude：[自动激活 code-review Skill]
       代码审查报告
       发现的问题：
       1. 参数之间缺少空格
       2. 运算符周围缺少空格
       3. 缺少类型提示
       评分：代码质量 6/10，可读性 7/10
```

---

### 1.3 Skills 的核心价值

| 价值 | 说明 |
|------|------|
| **经验固化** | 把团队 SOP、最佳实践固化下来，避免每次从零开始 |
| **流程标准化** | 确保输出稳定，不依赖个人水平 |
| **执行确定性** | 减少模型幻觉，输出可预测 |
| **权限可控** | 支持企业级治理，风险操作有护栏 |
| **可复用性** | 一次创建，多次调用，终身受益 |
| **自动化触发** | 基于关键词匹配，AI 自主判断是否启用 |

---

### 1.4 Skills vs 传统提示词

| 对比项 | 传统提示词 | Skills |
|--------|-----------|--------|
| **形式** | 单次对话中的指令 | 独立的文件夹 + 文件结构 |
| **复用性** | 每次重新输入 | 安装一次，永久可用 |
| **触发方式** | 手动输入完整指令 | 自然语言自动匹配 |
| **扩展能力** | 纯文本 | 支持脚本、文档、模板 |
| **上下文效率** | 全文加载 | 渐进式披露，按需加载 |

---

## 2. 核心概念

### 2.1 Skills 工作原理

**三层加载架构（渐进式披露）：**

```
┌─────────────────────────────────────────────────────────┐
│  第一层：元数据层（启动时加载）                           │
│  - 每个 Skill 的 name 和 description                       │
│  - 约 100 Tokens/Skill                                   │
│  - 形成"技能目录"用于快速匹配                            │
└────────────────────────┬────────────────────────────────┘
                         │ 用户请求匹配
                         ↓
┌─────────────────────────────────────────────────────────┐
│  第二层：核心指令层（激活时加载）                         │
│  - SKILL.md 主体内容                                     │
│  - 详细工作流程和规则                                    │
│  - 仅当任务相关时才加载                                  │
└────────────────────────┬────────────────────────────────┘
                         │ 按需读取
                         ↓
┌─────────────────────────────────────────────────────────┐
│  第三层：扩展资源层（执行时加载）                         │
│  - scripts/ 目录下的脚本                                 │
│  - references/ 目录下的详细参考文档                       │
│  - 不需要的资源完全不占用上下文                          │
└─────────────────────────────────────────────────────────┘
```

**优势：**
- 平时仅占用少量 Token 维护技能索引
- 可以安装大量 Skills 而不影响核心对话流畅性
- 按需加载，避免上下文爆炸

---

### 2.2 自动触发机制

**关键点：** Skills 不需要手动调用，AI 会根据自然语言自动判断。

**触发流程：**

```
用户输入："帮我写个提交信息"
    ↓
Claude 扫描所有 Skills 的 description
    ↓
发现 "Git 提交信息生成" Skill 匹配需求
    ↓
自动激活该 Skill
    ↓
按照 Skill 中的规范生成提交信息
```

**description 字段决定触发：**
```yaml
# ❌ 不好的 description（太模糊）
description: 用于数据分析

# ✅ 好的 description（清晰具体）
description: 用于每日业务指标自动统计、图表生成、异常波动检测；
           在用户要求"看数据""生成日报""分析波动"时触发；
           不用于复杂算法建模与实时交易场景
```

---

### 2.3 目录结构

**一个完整的 Skill 是一个文件夹：**

```
skill-name/
├── SKILL.md           # 主入口、触发规则、执行流程
├── references/        # 知识文档、规则、案例、口径说明
├── assets/            # 模板、输出格式、样例
├── scripts/           # 可执行脚本、确定性任务
└── hooks/             # 权限校验、日志埋点、风险拦截
```

| 目录/文件 | 说明 | 必填 |
|-----------|------|------|
| `SKILL.md` | 技能核心描述文件 | ✅ 必填 |
| `references/` | 存放参考文档、API 文档、术语表 | 可选 |
| `assets/` | 模板文件、输出格式样例 | 可选 |
| `scripts/` | 可执行脚本（Python/Bash） | 可选 |
| `hooks/` | 权限校验、日志埋点 | 可选 |

---

### 2.4 优先级规则

当同名 Skill 存在于多个位置时，优先级为：

```
Enterprise（企业级） > Personal（个人全局） > Project（项目级） > Plugin（插件）
```

| 级别 | 路径 | 说明 |
|------|------|------|
| **全局级** | `~/.claude/skills/` | 所有项目都能用 |
| **项目级** | `项目文件夹/.claude/skills/` | 仅当前项目可用 |
| **同名覆盖** | 项目级会覆盖全局级 | 允许针对特定项目定制 |

---

### 2.5 安全注意事项

**重要：** Skills 可以包含可执行脚本，安装前务必审查！

**安全检查清单：**
- [ ] 审查 `scripts/` 目录下的所有脚本
- [ ] 确认 `hooks/` 没有恶意代码
- [ ] 检查是否有网络请求或文件访问
- [ ] 确认数据来源和访问权限
- [ ] 优先选择官方或可信来源的 Skills

**官方安全建议：**
> "Before installing or using any Agent Skill, review potential security risks."

---

## 3. 快速入门

### 3.1 环境准备

**前置条件：**

| 软件 | 版本要求 | 验证命令 |
|------|----------|----------|
| Node.js | v18+ LTS | `node --version` |
| npm | v9+ | `npm --version` |
| Claude Code | 最新版 | `claude --version` |

**安装 Claude Code：**

```bash
# Windows (PowerShell 管理员)
irm https://claude.ai/install.ps1 | iex

# macOS/Linux
curl -fsSL https://claude.ai/install.sh | bash

# 验证安装
claude --version
```

---

### 3.2 3 步创建第一个 Skill

**步骤 1：创建 Skill 目录**

```bash
# 全局 Skills 目录
mkdir -p ~/.claude/skills/git-commit

# 或用 PowerShell（Windows）
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.claude\skills\git-commit"
```

**步骤 2：创建 SKILL.md 文件**

```bash
# 创建文件
nano ~/.claude/skills/git-commit/SKILL.md
```

**步骤 3：编写 Skill 内容**

```markdown
---
name: git-commit
description: 帮助生成规范的 Git 提交信息；在用户要求"写提交信息""生成 commit""commit message"时触发；不用于其他 Git 操作
---

# Git 提交信息生成 Skill

## 任务
根据用户的代码变更，生成符合 Conventional Commits 规范的提交信息。

## 工作流程

1. 运行 `git status` 查看变更文件
2. 运行 `git diff --staged` 查看暂存区变更
3. 分析变更类型，确定提交类型：
   - `feat`: 新功能
   - `fix`: 修复 bug
   - `docs`: 文档更新
   - `style`: 代码格式调整
   - `refactor`: 代码重构
   - `test`: 测试相关
   - `chore`: 构建/工具/配置

4. 生成提交信息，格式：`<type>(<scope>): <subject>`

## 输出规范

- 标题行不超过 50 字符
- 正文每行不超过 72 字符
- 使用祈使语气（"add" 而非 "added"）
- 不添加末尾句号

## 示例

✅ feat(auth): add JWT token refresh mechanism
✅ fix(api): resolve 500 error when user not found
❌ Fix bug
❌ Updated the code
```

---

### 3.3 测试你的 Skill

**在 Claude Code 中测试：**

```bash
# 进入项目目录
cd /path/to/your/project

# 启动 Claude Code
claude

# 输入自然语言指令
帮我写个提交信息
```

如果 Skill 配置正确，Claude 会自动：
1. 识别你的请求匹配 `git-commit` Skill
2. 加载 SKILL.md 中的指令
3. 执行 `git status` 和 `git diff` 命令
4. 生成规范的提交信息

---

### 3.4 安装官方 Skills

**通过插件市场安装（推荐）：**

```bash
# 添加官方 Skills 市场
/plugin marketplace add anthropics/skills

# 安装文档处理技能包
/plugin install document-skills@anthropic-agent-skills

# 安装示例技能包
/plugin install example-skills@anthropic-agent-skills
```

**官方 Skills 仓库：**

| Skill | 功能 | 路径 |
|-------|------|------|
| `anthropics/pdf` | PDF 处理（提取文字、合并、OCR） | `~/.claude/skills/pdf/` |
| `anthropics/docx` | Word 文档处理（创建、编辑、格式化） | `~/.claude/skills/docx/` |
| `anthropics/xlsx` | Excel 表格处理（数据清洗、公式、图表） | `~/.claude/skills/xlsx/` |
| `anthropics/data-analysis` | 数据分析全链路 | `~/.claude/skills/data-analysis/` |

---

## 4. 全局安装详解

### 4.1 安装路径

| 系统 | 全局 Skills 路径 |
|------|-----------------|
| **Windows** | `C:\Users\<用户名>\.claude\skills\` |
| **macOS/Linux** | `~/.claude/skills/` |

**查看当前路径：**

```bash
# 查看环境变量
echo $HOME  # macOS/Linux
echo %USERPROFILE%  # Windows
```

---

### 4.2 安装方法

**方法一：手动创建（推荐）**

```bash
# 1. 创建目录
mkdir -p ~/.claude/skills/<skill-name>

# 2. 创建 SKILL.md
nano ~/.claude/skills/<skill-name>/SKILL.md

# 3. 编辑内容，保存即可
```

**方法二：从 GitHub 下载**

```bash
# 克隆官方 skills 仓库
git clone https://github.com/anthropics/skills.git /tmp/skills

# 复制单个 skill 到全局目录
cp -r /tmp/skills/pdf ~/.claude/skills/

# 或复制多个
cp -r /tmp/skills/{pdf,docx,xlsx} ~/.claude/skills/
```

**方法三：使用安装脚本**

```bash
# awesome-agent-skills 一键安装脚本
# Windows (PowerShell)
irm https://raw.githubusercontent.com/JackyST0/awesome-agent-skills/main/install.ps1 | iex

# macOS/Linux
curl -sL https://raw.githubusercontent.com/JackyST0/awesome-agent-skills/main/install.sh | bash
```

---

### 4.3 验证安装

**方法 1：查看目录**

```bash
# 列出所有已安装的 Skills
ls -la ~/.claude/skills/
```

**方法 2：在 Claude Code 中测试**

```bash
claude

# 输入对应 Skill 的触发词
# 例如安装了 pdf Skill，输入：
帮我提取这份 PDF 的内容
```

**方法 3：查看系统信息**

```bash
# 在 Claude Code 中运行
/system info
```

---

### 4.4 项目管理级 Skills

**创建项目级 Skill：**

```bash
# 在项目根目录创建 .claude 目录
mkdir -p /path/to/project/.claude/skills/<skill-name>

# 创建 SKILL.md
nano /path/to/project/.claude/skills/<skill-name>/SKILL.md
```

**适用场景：**
- 团队内部的代码规范
- 项目特定的构建流程
- 业务相关的专用工具

**示例：项目特定的代码审查 Skill**

```markdown
---
name: project-review
description: 为本项目进行代码审查；检查业务规范、命名约定、数据库使用规范
---

# 项目代码审查 Skill

## 本项目特殊规范

### 命名约定
- 所有 API 函数必须以 `api` 前缀开头
- React 组件必须使用 PascalCase
- CSS 类名必须使用 kebab-case

### 数据库使用
- 所有查询必须使用参数化查询，禁止字符串拼接
- 事务必须在 finally 中关闭

### 业务规则
- 用户金额相关操作必须记录审计日志
- 订单状态流转必须符合状态机定义
```

---

### 4.5 项目级 vs 全局 Skill 最佳实践

**优先级规则：**

```
项目级 Skills > 全局 Skills
```

当同名 Skill 存在于两个位置时，**项目级优先**。

---

#### 两者同时存在时的行为

| 场景 | 行为 |
|------|------|
| **同名 Skill** | 项目级会**覆盖**全局，优先使用项目级版本 |
| **不同名 Skill** | 两者都可以使用，互不冲突 |
| **触发匹配** | Claude 会扫描所有可用的 Skills（项目级 + 全局），根据 description 匹配 |

---

#### 实战案例：知识库项目

**项目背景：** 一个文档优先的知识库项目，Skills 本身是项目的核心交付物。

**目录结构：**

```
项目级 Skills (Knowledge Base/.claude/skills/):
├── study/              # 费曼学习法 - 项目核心功能
├── research/           # 文档调研 - 项目核心功能
├── skill-creator/      # Skill 创建工具 - 项目核心功能
├── skill-adapter/      # Skill 适配工具 - 项目核心功能
├── project-start/      # 项目启动 - 项目核心功能
├── project-migration/  # 项目迁移 - 项目核心功能
├── requirement-change/ # 需求变更 - 项目核心功能
├── auto-skill/         # 自动检测 Skill - 项目核心功能
├── kb-trigger/         # 知识库触发器 - 项目核心功能
└── ...

全局 Skills (~/.claude/skills/):
├── study/              # 备份/全局可用（与项目级同步）
├── research/           # 备份/全局可用（与项目级同步）
└── ...
```

**选择保留两者的原因：**

| 原因 | 说明 |
|------|------|
| **项目是 Skills 的载体** | Skills 本身就是知识库项目的核心内容和交付物 |
| **团队共享** | 项目级 Skills 随代码库共享给团队成员 |
| **全局可用** | 复制一份到全局，在其他项目也能使用 |
| **开发便利** | 在项目内开发调试，同时全局可测试 |

**推荐实践：**

1. **通用 Skills 放全局**：与项目无关的个人通用 Skills
2. **项目特定放项目级**：项目特定的代码规范、构建流程、业务工具
3. **核心交付物放项目级**：作为项目核心功能的 Skills
4. **避免同名混淆**：如不需要覆盖，使用不同名称

---

#### 决策树

```
是否需要随项目共享？
├── 是 → 放项目级
│   ├── 是项目核心功能吗？
│   │   ├── 是 → 仅项目级（如知识库项目的 study/research）
│   │   └── 否 → 项目级 + 全局备份
│   └── 否 → 仅全局
└── 否 → 仅全局
```

---

### 4.6 MCP 与 Skills 的区别

| 对比项 | Skills | MCP (Model Context Protocol) |
|--------|--------|-----------------------------|
| **本质** | 提示词 + 脚本打包 | 标准化的工具/资源协议 |
| **配置位置** | `~/.claude/skills/` | `~/.claude.json` 或 `.mcp.json` |
| **触发方式** | 自然语言自动匹配 | 需要显式调用工具 |
| **扩展能力** | 提示词 + 脚本 | 标准化的 tools 和 resources |
| **适用场景** | 任务流程标准化 | 连接外部数据源和工具 |

**MCP 配置示例：**

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "D:/WorkPlace/VibeCoding/Knowledge Base"]
    }
  }
}
```

**MCP 与 Skills 协同使用：**

| 场景 | 推荐方式 |
|------|----------|
| 读取项目文件 | MCP (文件系统) |
| 标准化任务流程 | Skills |
| 连接外部 API | MCP |
| 代码审查/文档生成 | Skills |

---

## 5. SKILL.md 格式规范

### 5.1 文件结构

**SKILL.md 由两部分组成：**

```markdown
---
name: <技能名>
description: <技能描述>
allowed-tools: <可选：允许的工具列表>
---

# 技能详细指令

## 工作流程
...

## 输出规范
...
```

---

### 5.2 YAML 元数据

**必填字段：**

| 字段 | 说明 | 示例 |
|------|------|------|
| `name` | 技能名称（冒号后必须有空格） | `name: git-commit` |
| `description` | 技能描述，决定触发条件 | `description: 帮助生成规范的 Git 提交信息` |

**可选字段：**

| 字段 | 说明 | 示例 |
|------|------|------|
| `allowed-tools` | 限制可用工具 | `allowed-tools: Read,Write,Bash` |
| `version` | 技能版本 | `version: 1.0.0` |
| `author` | 作者 | `author: YourName` |

**完整示例：**

```yaml
---
name: code-review
description: 对代码进行质量审查；在用户要求"审查代码""code review""看看代码问题"时触发；不用于生成代码或重构
allowed-tools: Read,Write,Bash
version: 1.0.0
author: YourName
---
```

---

### 5.3 description 编写技巧

**description 是最重要的字段，决定触发准确性。**

**❌ 不好的示例：**

```yaml
# 太模糊，无法触发
description: 用于数据分析

# 太短，缺少场景
description: 代码审查
```

**✅ 好的示例：**

```yaml
# 清晰具体，包含触发词和场景
description: 对代码进行质量审查；
           在用户要求"审查代码""code review""看看代码问题""检查代码质量"时触发；
           不用于生成代码或重构
```

**description 公式：**
```
description = [核心功能] + [触发词列表] + [排除场景]
```

---

### 5.4 主体内容结构

**推荐结构：**

```markdown
# [技能名称]

## 任务
用 1-2 句话说明技能解决的核心问题。

## 工作流程
按步骤说明执行流程。

## 输出规范
定义输出格式、质量要求。

## 示例
提供 2-3 个输入输出示例。

## 边界与禁用场景
说明不适用的情况。
```

---

### 5.5 完整示例

**示例：API 文档生成器**

```markdown
---
name: api-docs
description: 根据代码生成 API 文档；在用户要求"生成 API 文档""写接口文档""提取 API"时触发；不用于生成业务代码
---

# API 文档生成 Skill

## 任务
分析代码中的路由定义，生成符合 OpenAPI 规范的 API 文档。

## 工作流程

1. 扫描项目中的路由文件：
   - Express: `routes/**/*.js`
   - NestJS: `**/*.controller.ts`
   - FastAPI: `**/routers/*.py`

2. 提取每个接口的：
   - HTTP 方法（GET/POST/PUT/DELETE）
   - 路径（Path）
   - 请求参数（Query/Path/Body）
   - 响应结构

3. 生成 Markdown 格式的 API 文档

## 输出规范

### 文档结构

```markdown
# API 文档

## [模块名称]

### [接口名称]

- **URL**: `[方法] 路径`
- **描述**: [功能描述]
- **请求参数**:
  | 参数 | 类型 | 必填 | 说明 |
  |------|------|------|------|
- **响应示例**:
  ```json
  {}
  ```
```

## 示例

**输入：** "生成用户模块的 API 文档"

**输出：**
```markdown
# 用户模块 API

## 获取用户信息

- **URL**: `GET /api/users/:id`
- **描述**: 根据 ID 获取用户详细信息
- **请求参数**:
  | 参数 | 类型 | 必填 | 说明 |
  |------|------|------|------|
  | id | number | 是 | 用户 ID |
- **响应示例**:
  ```json
  {
    "id": 1,
    "name": "张三",
    "email": "zhangsan@example.com"
  }
  ```
```

## 边界与禁用场景

### 不适用场景
- 生成业务逻辑代码
- 修改现有接口定义
- 非 API 相关的文档生成

### 注意事项
- 仅扫描支持的文件类型
- 动态路由需要手动补充说明
```

---

## 6. 9 种 Skill 类型

根据 Anthropic 官方分类，Skills 分为 9 大类型：

### 6.1 库和 API 参考（Library & API Reference）

**用途：** 解释如何正确使用某个库、CLI 或 SDK。

**包含内容：**
- 常用代码片段
- 踩坑记录（Gotchas）
- 边缘情况和注意事项

**示例：**
- `billing-lib` — 内部计费库的使用指南
- `internal-platform-cli` — 内部 CLI 的每个子命令说明
- `frontend-design` — 设计系统风格指南

---

### 6.2 产品验证（Product Verification）

**用途：** 描述如何测试或验证代码是否正常工作。

**特点：**
- 常与 Playwright、Tmux 等外部工具配合
- 价值非常高，值得花一周时间做好

**示例：**
- `signup-flow-driver` — 验证注册流程
- `checkout-verifier` — 用 Stripe 测试卡验证结账流程
- `tmux-cli-driver` — 测试需要 TTY 的交互式 CLI

---

### 6.3 数据获取与分析（Data Fetching & Analysis）

**用途：** 连接你的数据和监控系统。

**包含内容：**
- 获取数据的库和凭证
- 仪表板 ID
- 常见的数据查询工作流

**示例：**
- `funnel-query` — "从注册到激活到付费"需要 join 哪些事件表
- `cohort-compare` — 比较两个群组的留存或转化

---

### 6.4 业务流程与团队自动化

**用途：** 将重复工作流自动化为一条命令。

**特点：**
- 通常较简单
- 可能依赖其他技能或 MCP
- 保存之前结果到日志文件，帮助保持一致性

**示例：**
- `standup-post` — 聚合 ticket、GitHub 活动和 Slack 历史，生成站会更新

---

### 6.5 代码脚手架与模板

**用途：** 为特定功能生成框架样板。

**适用场景：**
- 当脚手架有自然语言需求
- 无法纯靠代码覆盖时特别有用

---

### 6.6 代码质量与审查

**用途：** 强制执行代码质量标准。

**特点：**
- 可以包含确定性脚本提高鲁棒性
- 可能作为 hook 或 GitHub Action 自动运行

**示例：**
- `adversarial-review` — 生成"全新视角"的子 Agent 来批评代码

---

### 6.7 CI/CD 与部署

**用途：** 帮你获取、推送、部署代码。

**示例：**
- `babysit-pr` — 监控 PR、重试不稳定的 CI、解决合并冲突、启用自动合并

---

### 6.8 Runbook（运维手册）

**用途：** 接收一个症状（Slack 线程、告警、错误签名），执行多工具调查，产出结构化报告。

**示例：**
- `incident-investigator` — 接收告警，自动查询日志、指标、变更记录，生成调查报告

---

### 6.9 基础设施运维

**用途：** 执行日常维护和操作流程。

**特点：**
- 有些涉及破坏性操作，需要护栏
- 必须有审批和确认机制

---

## 7. 实战案例

### 7.1 必装 Skills 推荐

以下是精选的 10 个必装 Skills：

| # | Skill | 用途 | 来源 |
|---|-------|------|------|
| 1 | `pdf` | PDF 处理（提取文字、合并、OCR） | 官方 |
| 2 | `docx` | Word 文档处理 | 官方 |
| 3 | `xlsx` | Excel 表格处理 | 官方 |
| 4 | `data-analysis` | 数据分析全链路 | 官方 |
| 5 | `code-review` | 代码质量审查 | 社区 |
| 6 | `git-commit` | 生成 Git 提交信息 | 社区 |
| 7 | `unit-test-gen` | 生成单元测试 | 社区 |
| 8 | `api-docs` | 生成 API 文档 | 社区 |
| 9 | `standup-post` | 站会报告生成 | 社区 |
| 10 | `incident-investigator` | 事故调查 | 社区 |

---

### 7.2 企业级 Skill 示例

**场景：** 某电商公司的订单查询 Skill

```markdown
---
name: order-query
description: 查询订单状态和物流信息；在用户要求"查订单""订单状态""物流信息"时触发；不用于修改订单或退款
allowed-tools: Bash
---

# 订单查询 Skill

## 任务
连接公司内部订单系统，查询订单状态和物流信息。

## 工作流程

1. 从用户输入中提取订单号
   - 格式：`ORD-YYYYMMDD-XXXXXX`

2. 调用内部 API 查询订单
   ```bash
   curl -X GET "https://api.internal/orders/{order_id}" \
     -H "Authorization: Bearer $ORDER_API_KEY"
   ```

3. 解析返回数据，提取：
   - 订单状态（待支付/已支付/发货中/已完成）
   - 物流公司
   - 物流单号
   - 预计送达时间

4. 格式化输出

## 输出格式

```
订单号：ORD-20260328-123456
状态：已发货
物流公司：顺丰速运
物流单号：SF1234567890
预计送达：2026-03-30
当前节点：[上海] 已发出
```

## 凭证配置

API Key 存储在环境变量 `$ORDER_API_KEY` 中。

## 边界与禁用场景

### 不适用场景
- 修改订单信息
- 申请退款
- 取消订单
- 非订单号格式的查询
```

---

### 7.3 数据分析 Skill 示例

```markdown
---
name: daily-metrics
description: 每日业务指标自动统计、图表生成、异常波动检测；在用户要求"看数据""生成日报""分析波动"时触发
---

# 每日业务指标统计 Skill

## 任务
自动查询数据库，生成每日业务指标报表。

## 工作流程

1. 连接数据库
   ```bash
   psql -h $DB_HOST -U $DB_USER -d $DB_NAME
   ```

2. 执行查询
   ```sql
   -- 核心指标
   SELECT
     COUNT(*) as dau,
     COUNT(DISTINCT user_id) as paying_users,
     SUM(amount) as gmv
   FROM orders
   WHERE date = CURRENT_DATE - INTERVAL '1 day';
   ```

3. 生成图表（如需要）
   ```python
   import matplotlib.pyplot as plt
   # ...生成趋势图
   ```

4. 检测异常波动（±20% 告警）

## 输出格式

```
📊 每日业务日报 (2026-03-27)

核心指标：
- DAU: 10,234 (环比 +5.2%)
- 付费用户：1,567 (环比 -2.1%) ⚠️
- GMV: ¥234,567 (环比 +12.3%)

异常波动：
⚠️ 付费用户下降 2.1%，建议检查支付流程
```
```

---

## 8. 常见问题

### 8.1 Skill 不触发

**问题：** 安装了 Skill，但 Claude 不自动调用。

**可能原因：**
1. `description` 写得太模糊
2. 触发词没有匹配
3. SKILL.md 格式错误

**解决方案：**
```yaml
# 检查 description 是否包含常见触发词
description: [核心功能] + [触发词列表] + [排除场景]
```

---

### 8.2 多个 Skills 冲突

**问题：** 安装多个 Skills，触发时互相干扰。

**解决方案：**
1. 在每个 Skill 的 `description` 中明确排除场景
2. 使用更具体的触发词
3. 合并功能相近的 Skills

---

### 8.3 脚本执行失败

**问题：** Skill 中的脚本无法执行。

**可能原因：**
1. 缺少执行权限
2. 环境变量未配置
3. 依赖未安装

**解决方案：**
```bash
# 添加执行权限
chmod +x ~/.claude/skills/<skill-name>/scripts/*.sh

# 检查环境变量
echo $YOUR_ENV_VAR
```

---

### 8.4 性能优化

**问题：** 安装太多 Skills，Claude 响应变慢。

**解决方案：**
1. 只保留常用的 Skills
2. 精简 `description` 字段，减少 Token 占用
3. 使用项目级 Skills，而非全部全局安装

---

### 8.5 安全审查

**问题：** 如何确保第三方 Skills 安全？

**安全检查清单：**
- [ ] 审查所有脚本文件
- [ ] 检查是否有网络请求
- [ ] 确认文件访问范围
- [ ] 优先选择官方或可信来源
- [ ] 在沙箱环境先测试

---

## 9. 学习资源

### 9.1 官方文档

| 资源 | URL |
|------|-----|
| Claude Code Skills 官方文档 | https://code.claude.com/docs/en/skills |
| Anthropic Skills 仓库 | https://github.com/anthropics/skills |
| 官方入门课程 | https://anthropic.skilljar.com/introduction-to-agent-skills |

---

### 9.2 社区资源

| 资源 | 说明 |
|------|------|
| **VoltAgent/awesome-claude-skills** | 1000+ 社区 Skills 合集 |
| **JackyST0/awesome-agent-skills** | 一键安装脚本 + 精选推荐 |
| **Vercel Skills** | Vercel 团队官方 Skills |
| **Stripe Skills** | Stripe 支付集成 Skills |

---

### 9.3 推荐书籍/文章

| 资源 | 说明 |
|------|------|
| 《Anthropic 官方分享：Claude Code Skills 的 9 种类型与最佳实践》 | 官方分类详解 |
| 《OpenClaw Skills 工程化完全指南》 | 企业级实践 |
| 《Claude Skills 从原理到实战的完全指南》 | 渐进式披露机制详解 |

---

### 9.4 学习路径建议

| 阶段 | 内容 | 预计时间 |
|------|------|----------|
| **入门** | 安装第一个官方 Skill（如 pdf） | 30 分钟 |
| **基础** | 理解目录结构，修改现有 Skill | 1-2 小时 |
| **进阶** | 创建自定义 Skill，包含脚本 | 4-6 小时 |
| **实战** | 为企业构建专用 Skills | 持续 |

---

## 附录：引用列表

| 来源 | URL | 查阅时间 |
|------|-----|----------|
| Claude Code 官方文档 | https://code.claude.com/docs/en/skills | 2026-03-28 |
| Anthropic Skills GitHub | https://github.com/anthropics/skills | 2026-03-28 |
| VoltAgent awesome-claude-skills | https://github.com/VoltAgent/awesome-claude-skills | 2026-03-28 |
| 知乎：9 种类型与最佳实践 | https://zhuanlan.zhihu.com/p/2017634989538292879 | 2026-03-28 |
| CSDN：Skills 核心原理 | https://blog.csdn.net/qq_25893567/article/details/157325390 | 2026-03-28 |
| 阿里云：从零开始构建第一个 Skill | https://developer.aliyun.com/article/1719598 | 2026-03-28 |
| 博客园：Claude Code 10 个必装 Skills | https://www.cnblogs.com/qiniushanghai/p/19728076 | 2026-03-28 |

---

*文档版本：1.0.0 | 创建时间：2026-03-28*
*调研范围：官方文档 2 个 + 技术博客 8 个 + 社区仓库 2 个*
