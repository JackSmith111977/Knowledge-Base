---
name: skill-creator
description: 通过问答引导创建 Skill，包含 9 种类型模板、检查清单、支持读取修改已有 Skill
aliases: [create-skill, skill-generator, 创建 Skill, skill 创建器]
author: Kei
triggers: [帮我创建一个 Skill, 想要做一个，我想创建，帮我写一个 skill, 生成一个 skill, 优化 skill]
version: 7.0.0
metadata:
  category: 工具类
  type: 元技能
  patterns: [generator, inversion]
  interaction: multi-turn
  stages: "8"
  gating: required
---

# Skill Creator - Skill 创建器

## 用途

当用户想要创建新的 Skill 或修改已有 Skill 时，自动使用此 Skill。

**适用场景：** 创建 Skill、修改已有 Skill、学习 Skill 编写、优化 Skill 结构

**不适用场景：** 简单 Skill 使用问题、Skill 加载/触发故障排查

---

## 核心原则

1. **引导而非假设**：通过问答收集需求，不做假设
2. **推荐而非强加**：根据用户需求推荐最合适的 Skill 类型和设计模式
3. **模板而非空壳**：提供 9 种类型的完整模板供选择
4. **检查而非直出**：生成后必须执行 Review 检查
5. **配置而非硬编码**：默认路径可配置
6. **模式驱动设计**：在设计/修改 Skill 前，优先推荐并确认使用的设计模式

---

## 工作流程概览

```
需求澄清 → 设计模式推荐 → 用例定义 → 引用调研 → 生成草稿 → 写入文件 → Review 检查 → 测试建议
```

**详细流程：** 详见 `references/workflow.md`

---

## 阶段 1：需求澄清

通过 5 个问题收集需求：

1. **主要用途** — 代码审查、文档生成、数据查询等
2. **触发方式** — 显式命令、自然语言、两者都需要
3. **使用者** — 仅自己使用、团队共享
4. **外部工具** — 是否需要执行脚本或调用外部工具
5. **输出格式** — Markdown 报告、代码文件、JSON 数据等

**推荐类型：** 根据回答推荐 9 种类型之一（详见 `references/skill-types.md`）

---

## 阶段 2：设计模式推荐

**基于谷歌 5 种 Skill 设计模式**（详见 `references/google-design-patterns.md`）

### 2.1 介绍 5 种设计模式

根据用户需求，介绍适用的设计模式：

| 模式 | 核心定义 | 适用场景 |
|------|----------|----------|
| **Tool Wrapper（工具封装）** | 按需注入知识，避免全量加载 | 框架规范、团队约定、库使用指南 |
| **Generator（生成器）** | 模板驱动生成，确保输出一致 | API 文档、标准化报告、Commit Message |
| **Reviewer（审查器）** | 审查分离，模块化检查标准 | 代码审查、安全审计、质量检查 |
| **Inversion（反转/采访者）** | Agent 采访用户，先提问再行动 | 需求收集、复杂任务启动、项目规划 |
| **Pipeline（流水线/管道）** | 强制执行多步骤流程，带检查点 | 文档生成、发布流程、多步验证 |

### 2.2 推荐与选择

**步骤：**
1. **分析需求** — 根据阶段 1 的回答，识别适用模式
2. **推荐模式** — 推荐 1-2 种最匹配的模式（可组合）
3. **解释原因** — 说明为什么推荐这些模式
4. **用户确认** — 等待用户选择或调整

**模式组合推荐：**

| 组合 | 效果 | 适用场景 |
|------|------|----------|
| **Pipeline + Reviewer** | 质量提升 +29% | 代码审查、文档生成 |
| **Generator + Inversion** | 质量提升 +36% | 需求驱动的内容生成 |
| **Tool Wrapper + Pipeline** | 效率提升 +25% | 多技术栈复杂任务 |
| **Inversion + Pipeline + Reviewer** | 质量提升 +45% | 高要求项目交付 |

### 2.3 确认元数据

根据选择的模式，设置 `metadata.pattern` 字段：

```yaml
---
metadata:
  pattern: inversion        # 单一模式
  interaction: multi-turn
  stages: "3"
---
```

或组合模式：

```yaml
---
metadata:
  patterns: [inversion, pipeline, reviewer]  # 组合模式
  stages: "3"
  steps: "5"
---
```

**等待用户确认后进入阶段 3。**

---

## 阶段 3：用例定义

**3.1 收集具体用例** — 描述 2-3 个具体用例

**用例格式：**
- **触发条件**：用户说什么/做什么时触发
- **执行步骤**：Skill 需要执行的操作
- **预期结果**：输出什么/完成什么

**3.2 确认触发方式**
- 显式命令：`/skill-name`（英文连字符）
- 隐式触发词：3-5 个中文触发词

**3.3 确认文件结构**
```
skill-name/
├── SKILL.md              # 必需
├── templates/            # 可选
├── references/           # 可选，设计模式相关资源存放处
│   ├── conventions.md    # Tool Wrapper: 规范文档
│   ├── checklists/       # Reviewer: 审查清单
│   └── style-guide.md    # Generator: 风格指南
├── assets/               # 可选，模板资源
│   └── template.md       # Generator: 输出模板
├── scripts/              # 可选
└── checklists/           # 可选
```

**3.4 设计模式资源确认**

根据阶段 2 选择的模式，确认需要的资源文件：

| 模式 | 需要创建的资源 | 存放位置 |
|------|---------------|----------|
| **Tool Wrapper** | `references/conventions.md` | 规范文档 |
| **Generator** | `assets/template.md` + `references/style-guide.md` | 模板 + 风格指南 |
| **Reviewer** | `references/checklist-*.md` | 审查清单 |
| **Inversion** | 阶段问题列表 + 门控指令 | SKILL.md 内定义 |
| **Pipeline** | 步骤定义 + 检查点指令 | SKILL.md 内定义 |

**等待用户确认后进入阶段 4。**

---

## 阶段 4：引用调研

**目标：** 在生成草稿之前，搜集创建或修改 Skill 所需的上下文信息，确保生成的 Skill 内容准确、符合项目规范。

### 4.1 确定调研范围

根据阶段 3 确认的 Skill 类型和设计模式，确定需要搜集的上下文：

| Skill 类型 | 需要调研的内容 | 调研方式 |
|-----------|---------------|---------|
| **库和 API 参考** | 现有类似 Skill、项目技术栈、官方文档 | 扫描 `.claude/skills/`、读取项目文档 |
| **产品验证** | 产品功能、验证流程、断言标准 | 询问用户、读取产品文档 |
| **数据获取与分析** | 数据源、API 接口、分析模型 | 扫描 scripts/、读取数据文档 |
| **代码生成** | 代码模板、命名规范、输出风格 | 扫描现有代码、读取风格指南 |
| **文档生成** | 文档模板、格式要求、输出标准 | 扫描现有文档、读取 style-guide |
| **代码审查** | 审查标准、检查清单、历史问题 | 扫描 checklists/、读取项目规范 |
| **部署流程** | 部署步骤、环境配置、回滚方案 | 扫描 scripts/deploy、读取运维文档 |
| **团队规范** | 现有规范、团队约定、工具配置 | 扫描 `.claude/`、读取 CONTRIBUTING |
| **调研整理** | 调研主题、已有知识、信息来源 | 询问用户、扫描 references/ |

### 4.2 执行调研

**调研方式：**

1. **扫描现有 Skill** — 使用 Glob 扫描 `.claude/skills/` 目录，查找类似 Skill 作为参考
2. **读取项目文档** — 读取相关 `.claude/` 配置文件、CLAUDE.md、团队规范等
3. **搜索代码库** — 使用 Grep 搜索相关代码模式、函数名、配置项
4. **询问用户** — 对于不确定的信息，通过提问向用户确认

**调研深度控制：**

- **简单 Skill**（单一功能、无依赖）→ 快速扫描，1-2 个参考
- **中等 Skill**（多步骤、有依赖）→ 适度调研，3-5 个参考
- **复杂 Skill**（组合模式、跨领域）→ 深度调研，5+ 个参考 + 用户确认

### 4.3 整理调研结果

将调研结果整理为以下格式：

```markdown
## 调研结果摘要

### 参考 Skill
- `[skill-name-1]`: [可复用的设计点]
- `[skill-name-2]`: [可借鉴的模式]

### 项目规范
- 命名规范：[如使用英文连字符]
- 文件结构：[如必须包含 references/]
- 元数据要求：[如必须设置 metadata.pattern]

### 技术约束
- 可用工具：[如 MCP、Bash、WebSearch]
- 限制条件：[如不可访问 .env、不可调用外部 API]

### 用户偏好（如有历史数据）
- [从过往 Skill 创建中学习的偏好]
```

### 4.4 用户确认

**展示调研结果**，等待用户确认：

- 是否有遗漏的重要上下文？
- 是否有需要特别关注的约束？
- 是否有可参考的现有文档/Skill？

**等待用户确认后进入阶段 5。**

---

## 阶段 5：生成草稿

### 5.1 加载对应类型模板 — 从 `templates/` 目录加载

### 5.2 流程抽象化分析（新增）

**目标：** 将详细流程从主文件剥离，保持 SKILL.md 简洁，详细流程存入 `references/`

**判断是否需要抽象化：**
- 主文件工作流程 > 200 行 → 需要抽象化
- 包含复杂的多步骤流程 → 需要抽象化
- 设计模式为 Pipeline/Reviewer（多步骤/多检查项）→ 需要抽象化

**抽象化步骤：**

1. **识别详细流程内容**
   - 多步骤操作说明
   - 复杂条件判断逻辑
   - 详细的检查清单
   - 示例代码块
   - 表格形式的对比/参考信息

2. **创建 `references/procedure.md`（或更具体的文件名）**
   ```markdown
   # [Skill 名称] - 详细流程
   
   ## 前置条件
   ## 步骤 1：[步骤名称]
   ### 输入
   ### 操作
   ### 输出
   ## 步骤 2：[步骤名称]
   ...
   ## 异常处理
   ## 常见问题
   ```

3. **重写主文件工作流程**
   ```markdown
   ## 工作流程（概览）
   
   ```
   需求澄清 → 设计模式推荐 → 用例定义 → 引用调研 → 生成草稿 → 写入文件 → Review 检查 → 测试建议
   ```
   
   **详细流程：** 详见 `references/procedure.md`
   
   ### 阶段 1：需求澄清
   通过 5 个问题收集需求...（保留核心描述，1-2 句）
   
   ### 阶段 2：设计模式推荐
   基于谷歌 5 种 Skill 设计模式...（保留核心描述，1-2 句）
   
   ...（其他阶段同理，保留摘要级描述）
   ```

4. **建立引用关系**
   - 主文件使用 `详见 references/[filename].md` 指向详细文档
   - 详细文档顶部添加 `返回主文件：[SKILL.md](../SKILL.md)` 反向链接

### 5.3 填充用户定制内容

填入用例、触发方式等，并根据阶段 2 选择的模式添加相应指令

### 5.4 输出草稿预览（Diff 格式）

```markdown
## Skill 草稿预览（变更摘要）

### 变更项
- **Frontmatter:** 新增 `version: 2.0.0`, `metadata.pattern` 字段
- **核心原则:** 新增原则 6 "模式驱动设计"
- **设计模式:** 添加阶段 2 选择的模式指令（如 Inversion 门控、Pipeline 步骤等）
- **工作流程:** 阶段 X 新增步骤 Y...
- **流程抽象化:** 详细流程已移至 `references/procedure.md`

### 文件结构
```
skill-name/
├── SKILL.md                 # 主文件（抽象化流程）
├── references/
│   └── procedure.md         # 详细流程（新增）
```

### 完整内容
详见输出位置或说"显示完整草稿"。
```

**等待用户确认后进入阶段 6。**

---

## 阶段 6：写入文件

**6.1 确认输出位置** — 默认 `.claude/skills/[skill-name]/`

**6.2 创建目录结构** — 手动或脚本创建

**6.3 写入文件** — 使用 Write 工具写入 SKILL.md 及其他文件

---

## 阶段 7：Review 检查

加载 `checklists/creation-checklist.md` 并逐项检查：

| 检查类型 | 必须项 |
|----------|--------|
| 格式检查 | YAML Frontmatter、Markdown 正确 |
| 内容检查 | description 清晰、工作流程可执行、无废话 |
| 触发检查 | 显式命令 + 隐式触发词（3-5 个） |
| **设计模式检查** | `metadata.pattern` 正确、模式指令完整、资源文件齐备 |

**设计模式专项检查：**

| 模式 | 检查项 |
|------|--------|
| **Tool Wrapper** | `references/conventions.md` 存在、按需加载指令正确 |
| **Generator** | `assets/template.md` + `references/style-guide.md` 存在 |
| **Reviewer** | `references/checklist-*.md` 存在、审查分离架构正确 |
| **Inversion** | 阶段问题列表完整、门控指令（DO NOT）存在 |
| **Pipeline** | 步骤定义清晰、检查点指令完整、禁止跳步指令存在 |

**详见：** `checklists/creation-checklist.md`

---

## 阶段 8：测试建议

生成测试用例供用户验证：

```markdown
## 测试建议

### 测试 1：显式触发
/[skill-name] 测试内容

### 测试 2：隐式触发
[触发词 1] 测试内容

### 测试 3：边界情况
[边界场景描述]

### 测试 4：设计模式验证（如适用）
- **Inversion**: 测试 Agent 是否在信息不全时提问
- **Pipeline**: 测试是否按顺序执行、不跳步
- **Reviewer**: 测试是否按严重程度分级输出
- **Generator**: 测试输出是否符合模板结构
- **Tool Wrapper**: 测试是否按需加载资源
```

---

## 9 种 Skill 类型与设计模式推荐

| 类型 | 适用场景 | 推荐设计模式 | 模板文件 |
|------|----------|--------------|----------|
| 库和 API 参考 | 内部库、CLI、SDK 使用指南 | **Tool Wrapper** | `templates/library-reference.md` |
| 产品验证 | 测试流程、断言验证 | **Pipeline + Reviewer** | `templates/product-verification.md` |
| 数据获取与分析 | 数据查询、报表生成 | **Tool Wrapper + Generator** | `templates/data-analysis.md` |
| 代码生成 | 规格转代码、设计稿转前端 | **Generator + Pipeline** | `templates/code-generation.md` |
| 文档生成 | PR 描述、API 文档、发布说明 | **Generator + Inversion** | `templates/doc-generation.md` |
| 代码审查 | 安全检查、性能分析、代码质量 | **Reviewer + Tool Wrapper** | `templates/code-review.md` |
| 部署流程 | 部署、发布、回滚 | **Pipeline + Reviewer** | `templates/deployment.md` |
| 团队规范 | 编码风格、提交规范 | **Tool Wrapper** | `templates/team-norms.md` |
| 调研整理 | 技术调研、知识整理 | **Inversion + Generator** | `templates/research.md` |

---

## 修改已有 Skill 流程

**步骤 M1：读取** — `.claude/skills/[skill-name]/SKILL.md`

**步骤 M2：确认修改内容** — 新增功能、修改流程、调整触发方式等

**步骤 M3：设计模式优化建议（新增）**

如果 Skill 未使用设计模式，根据功能推荐：
- 需求收集类 → 推荐 **Inversion**
- 文档生成类 → 推荐 **Generator + Inversion**
- 审查类 → 推荐 **Reviewer**
- 流程类 → 推荐 **Pipeline**
- 规范类 → 推荐 **Tool Wrapper**

**步骤 M4：生成修改预览（Diff 格式）**

```markdown
## Skill 修改预览（变更摘要）

### 变更项
- **Frontmatter:** `version` X.0.0 → Y.0.0
- **设计模式:** 新增 `metadata.pattern` 字段
- **工作流程:** 修改阶段 X 的步骤 Y...
```

**步骤 M5：写入** — 更新后的文件

---

## 优化 Skill 结构流程

### 流程抽象化策略

**适用场景：**
- SKILL.md 文件 > 500 行
- 工作流程部分 > 200 行
- 包含大量详细步骤、检查清单、示例代码

**抽象化原则：**
1. **主文件保留什么**
   - 核心原则（1-2 句/条）
   - 工作流程概览（流程图 + 阶段摘要）
   - 关键决策点
   - 引用链接指向 `references/`

2. **移至 `references/` 的内容**
   - 详细步骤说明（`references/procedure.md`）
   - 检查清单详情（`references/checklist-*.md`）
   - 规范/约定详情（`references/conventions.md`）
   - 示例代码集合（`references/examples.md`）
   - 设计模式详解（`references/patterns.md`）

**标准文件结构：**
```
skill-name/
├── SKILL.md                 # 主文件：抽象化流程 + 引用
├── references/
│   ├── procedure.md         # 详细操作流程
│   ├── checklist-main.md    # 主检查清单
│   ├── conventions.md       # 规范详情
│   └── examples.md          # 示例集合
├── templates/               # 模板文件
└── assets/                  # 资源文件
```

### 执行步骤

**步骤 O1：读取** — 分析 SKILL.md 内容

**步骤 O2：分析问题**
- 主文档是否过长（> 500 行）
- 是否包含重复内容
- 是否有可移至 references/的内容
- 是否符合标准目录结构

**步骤 O3：生成方案** — 识别需要移至 references/的内容

**步骤 O4：执行** — 创建引用文件，重写主文件

---

## 输出格式规范

**阶段输出：** 每个阶段结束标注当前阶段、下一步、等待确认

**Skill 草稿格式：**
```yaml
---
name: [skill-name]
description: [清晰具体，100 词内]
aliases: [alias1, alias2]
triggers: [触发词 1, 触发词 2, 触发词 3]
author: [用户名]
version: 1.0.0
---

# [Skill 名称]
## 用途
## 工作流程
## 输出格式
## 注意事项
```

---

## 检查清单

### 创建前检查
- [ ] 明确了 2-3 个具体用例
- [ ] 确认了触发方式（显式 + 隐式）
- [ ] 选择了 Skill 类型（9 选 1）
- [ ] **选择了设计模式（5 选 1 或组合）**
- [ ] 确认了文件结构需求
- [ ] **确认了设计模式所需的资源文件（template/checklist/conventions 等）**

### 生成后检查
- [ ] YAML Frontmatter 格式正确
- [ ] description 清晰具体（100 词内）
- [ ] 包含可执行的工作流程（抽象化）
- [ ] 没有陈述显而易见的内容
- [ ] **`metadata.pattern` 字段正确设置**
- [ ] **设计模式相关指令完整（门控、检查点、审查分离等）**
- [ ] **流程抽象化正确（主文件 < 500 行，详细流程在 references/）**
- [ ] **引用链接正确指向 references/ 文件**

### 写入前检查
- [ ] 用户已确认草稿
- [ ] Review 检查通过
- [ ] 输出路径已确认
- [ ] **设计模式资源文件已创建（如适用）**
- [ ] **详细流程文件已创建（如适用）**

---

## 注意事项

### 安全与合规
- 不创建需要敏感权限的 Skill（如读取 .env）
- 执行脚本前需用户确认
- 外部 API 调用需验证 SSL

### 性能考虑
- Skill 文件不宜过大（SKILL.md < 500 行）
- 复杂逻辑放入 references/按需加载
- 避免包含大量静态文本

### 限制说明
- 无法创建需要 API Key 的 Skill（除非用户提供）
- 无法访问需要登录的 Web 资源
- 视频内容只能获取简介

---

## 资源索引

| 资源 | 文件 | 用途 |
|------|------|------|
| 9 种类型模板 | `templates/` | Skill 模板 |
| 工作流程详情 | `references/workflow.md` | 详细流程说明 |
| 技能类型说明 | `references/skill-types.md` | 9 种类型详解 |
| 检查清单 | `checklists/creation-checklist.md` | Review 检查 |
| 使用示例 | `examples/usage-examples.md` | 典型场景 |
| **谷歌设计模式** | `references/google-design-patterns.md` | 5 种设计模式详解与组合策略 |

---

*Skill 版本：7.0.0 | 作者：Kei | 创建日期：2026-03-25*
*更新：2026-04-01 新增阶段 4 引用调研、阶段 5.2 流程抽象化，主文件保留抽象流程 + 引用*
