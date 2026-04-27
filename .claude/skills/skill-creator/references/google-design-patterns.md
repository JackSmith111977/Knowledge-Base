# 谷歌 5 种 Skill 设计模式

> 基于 Google 官方研究的 Agent Skill 设计模式完全指南

**来源：** Google 官方研究（Shubham Saboo, Lavini Nigam）
**适用：** Claude Code Skill、Gemini CLI Skill、Cursor AI Agent

---

## 模式总览

| 模式 | 核心定义 | 解决痛点 | 典型场景 |
|------|----------|----------|----------|
| **Tool Wrapper** | 按需注入知识 | 避免全量加载规范到 System Prompt | 框架规范、团队约定 |
| **Generator** | 模板驱动生成 | 输出结构不一致 | API 文档、标准化报告 |
| **Reviewer** | 审查分离 | 审查标准难以维护 | 代码审查、安全审计 |
| **Inversion** | Agent 采访用户 | 需求模糊导致返工 | 需求收集、项目规划 |
| **Pipeline** | 强制执行流程 | 跳步导致质量不稳定 | 文档生成、发布流程 |

---

## 模式 1：Tool Wrapper（工具封装）

### 核心思想

> "把某个领域的经验，装进一个随时可调用的专家模块。这个专家平时不一直坐在上下文里，只有当任务真的涉及某个库、某个框架、某套规则时，才把相关知识加载进来。"

### 解决的问题

- 传统做法：将所有规范一次性塞入 System Prompt
- 问题：浪费 Context 窗口，模型容易被无关信息干扰

### 工作机制

```
SKILL.md 作为总闸门 → 判断任务领域 → 按需加载 references/ → Token 节省 60-80%
```

### SKILL.md 示例

```yaml
---
name: fastapi-expert
description: FastAPI 开发最佳实践与规范。在构建、审查或调试 FastAPI 应用时使用。
metadata:
  pattern: tool-wrapper
  domain: fastapi
---

# FastAPI 专家（Tool Wrapper 模式）

## 核心指令

加载 `references/conventions.md` 获取完整的 FastAPI 最佳实践。

## 当编写代码时

1. 加载约定参考
2. 严格遵循所有约定
3. 所有端点使用 async/await
4. 请求/响应模型使用 Pydantic v2
```

### 目录结构

```
fastapi-expert/
├── SKILL.md                  # 主文件：触发条件和指令
└── references/
    └── conventions.md        # 详细规范文档
```

### 效果数据

- Token 使用减少：**60-80%**
- 上下文相关性提升：**+45%**

---

## 模式 2：Generator（生成器）

### 核心思想

> "把 Agent 变成'流程执行器'，而不是'自由发挥的写手'。不再要求它每次都重新思考文档结构，而是要求它先读模板、再补变量、最后按风格指南填完整份文档。"

### 解决的问题

- 结构飘忽不定：同类任务在不同时间生成的结果结构差异大
- 风格不统一：语气、术语、格式不一致
- 内容遗漏：每次生成可能遗漏不同部分

### 工作机制

```
模板 (Template) → 定义结构骨架
风格指南 (Style Guide) → 定义表达方式
Skill.md → 协调：补问缺失变量 → 填充模板 → 按风格格式化
```

### SKILL.md 示例

```yaml
---
name: tech-report-generator
description: 从可复用模板生成标准化技术报告。
metadata:
  pattern: generator
  output: markdown
---

# 技术报告生成器（Generator 模式）

## 工作流程

### 步骤 1：加载风格指南
加载 `references/style-guide.md` 获取语气和格式规则。

### 步骤 2：加载模板
加载 `assets/report-template.md` 获取所需的输出结构。

### 步骤 3：询问缺失信息
使用 `AskUserQuestion` 向用户询问填充模板所需的缺失信息：

```json
{
  "questions": [{
    "header": "模板变量",
    "multiSelect": false,
    "options": [
      {"label": "项目名称", "description": "填写项目名称"},
      {"label": "作者信息", "description": "填写作者和日期"},
      {"label": "技术栈详情", "description": "填写具体技术版本"}
    ],
    "question": "模板中缺少哪些信息？请选择需要补充的项目："
  }]
}
```

### 步骤 4：填充模板
按照风格指南规则填充模板。
```

### 目录结构

```
tech-report-generator/
├── SKILL.md
├── assets/
│   └── report-template.md    # 输出模板
└── references/
    └── style-guide.md        # 风格指南
```

### 效果数据

- 文档结构一致性：**+95%**
- 后期处理成本：**-70%**

---

## 模式 3：Reviewer（审查器）

### 核心思想

> "将审查标准模块化。当审查规则改变时，只需替换不同的 Checklist，无需重写 Skill。"

### 解决的问题

- 审查标准与流程混淆：检查什么与怎么检查混杂
- 输出不统一：每次审查结果格式不一致
- 优先级模糊：所有问题同等对待

### 工作机制

```
Checklist（检查什么）→ 存放在 references/
Skill.md（怎么检查）→ 审查流程
输出归一化 → Error/Warning/Info 三级
```

### SKILL.md 示例

```yaml
---
name: code-reviewer
description: 结构化代码审查指南，按严重程度输出问题清单。
metadata:
  pattern: reviewer
  output: error-warning-info
---

# 代码审查师（Reviewer 模式）

## 核心指令

**审查分离原则：**
- 检查内容：加载 references/ 中的 Checklist
- 检查流程：按照本文件定义的流程执行

## 工作流程

### 步骤 1：确定审查类型
- 代码风格 → 加载 `python-style-checklist.md`
- 安全审查 → 加载 `owasp-security-checklist.md`
- 性能审查 → 加载 `performance-checklist.md`

### 步骤 2：执行审查
对每个 Checklist 项目检查并评级。

### 步骤 3：生成报告
按 Error/Warning/Info 分级输出。
```

### 目录结构

```
code-reviewer/
├── SKILL.md
└── references/
    ├── python-style-checklist.md
    ├── owasp-security-checklist.md
    └── performance-checklist.md
```

### 效果数据

- 审查标准更新效率：**+85%**
- 审查结果一致性：**+90%**
- 严重问题检出率：**+45%**

---

## 模式 4：Inversion（反转/采访者）

### 核心思想

> "让 Agent 从'执行者'变成'产品经理'"

### 解决的问题

- 信息缺失：用户未说明技术栈、团队规模
- 边界模糊：功能范围不清晰
- 约束遗漏：性能要求、安全标准未说明
- 返工率高达 75%

### 工作机制

```
阶段 1：问题发现 → 确认核心问题
阶段 2：技术约束 → 收集边界条件
阶段 3：综合输出 → 信息齐全后生成

硬性门控：在所有阶段完成前，禁止开始执行
```

### SKILL.md 示例

```yaml
---
name: project-planner
description: 通过结构化需求访谈来规划软件项目。在开始设计前，必须先完成所有采访阶段。
metadata:
  pattern: inversion
  interaction: multi-turn
  stages: "3"
---

# 项目规划师（Inversion 模式）

## 硬性门控（Gating Instructions）

**在所有阶段完成之前，禁止开始构建或设计。**

**DON'T:**
- 不要猜测缺失的信息
- 不要在信息不全时提供解决方案
- 不要跳过任何问题

## 阶段 1：问题发现
使用 `AskUserQuestion` 询问核心问题和目标：

```json
{
  "questions": [{
    "header": "问题定义",
    "multiSelect": false,
    "options": [
      {"label": "新功能开发", "description": "从零开始构建新功能"},
      {"label": "现有功能优化", "description": "改进或重构已有功能"},
      {"label": "Bug 修复", "description": "解决已知问题"}
    ],
    "question": "本次项目的核心目标是什么？"
  }]
}
```

## 阶段 2：技术约束
使用 `AskUserQuestion` 收集技术栈、部署环境、团队规模等：

```json
{
  "questions": [{
    "header": "技术栈",
    "multiSelect": true,
    "options": [
      {"label": "React", "description": "前端框架"},
      {"label": "Node.js", "description": "后端运行时"},
      {"label": "PostgreSQL", "description": "数据库"}
    ],
    "question": "项目使用哪些技术？"
  }]
}
```

**DON'T:**
- 不要用自由文本提问（如"请告诉我技术栈"）
- 必须使用 AskUserQuestion 提供选项

## 阶段 3：综合输出
加载模板，生成完整方案。
```

### 效果数据

- 返工率降低：**75% → 25%**
- 用户满意度提升：**+42%**

---

## 模式 5：Pipeline（流水线/管道）

### 核心思想

> "把 Agent 升级为'工作流引擎'，强制顺序执行，硬性门控防止跳步"

### 解决的问题

- 步骤跳过：Agent 为了快速输出，省略中间步骤
- 顺序混乱：先写文档再分析代码
- 检查缺失：没有中间验证环节
- 进度不透明：用户不知道当前执行到哪一步

### 工作机制

```
初始化 → progress.yaml 创建 → step-01 → [检查点] → step-02 → [检查点] → ... → 完成 → 清理 temp/

检查点类型：
- user-confirm：用户确认后继续
- self-check：Agent 自检后继续
- auto-verify：脚本验证后继续

硬性门控：
- 启动每步前验证 stepsCompleted 包含所有前序步骤
- 缺失则 HALT，禁止跳步
```

### 进度追踪架构

**采用 BMAD step-file architecture：**

```yaml
# progress.yaml（存放在 temp/）
stepsCompleted:
  - step-01-init
  - step-02-discovery
currentStep: step-03-generate
nextStep: step-04-validate
checkpoint: user-confirm
status: in-progress
createdAt: 2026-04-27T10:00:00
updatedAt: 2026-04-27T10:30:00
```

**Step 文件结构（存放在 temp/steps/）：**

```yaml
---
stepId: step-03-generate
stepName: 生成草稿
checkpoint: user-confirm
requires:
  - step-01-init
  - step-02-discovery
produces:
  - draft: string
nextStep: step-04-validate
---

# 步骤内容...

## 前置检查
验证 progress.yaml 中 stepsCompleted 包含所有 requires

## 执行内容
[具体指令...]

## 完成后操作
更新 progress.yaml，追加当前步骤到 stepsCompleted
```

**详细规范：** 详见 `pipeline-progress-format.md`

### SKILL.md 示例

```yaml
---
name: doc-pipeline
description: 通过多步骤流水线从 Python 源代码生成 API 文档。强制执行顺序，设置检查点，进度可追踪。
metadata:
  pattern: pipeline
  steps: "4"
  interaction: sequential
  progressTracking: true
---

# 文档生成流水线（Pipeline 模式）

## 硬性门控（Gating Instructions）

**按顺序执行每一步。如果某一步失败，不得继续。**

**DON'T:**
- 🛑 不要跳过任何步骤
- 🛑 不要合并多个步骤
- 🛑 不要在未通过检查点时继续
- 🛑 不要加载多个 step 文件同时执行
- 🛑 不要在未验证前序步骤完成时开始新步骤

## 进度追踪

**初始化：**
创建 `temp/progress.yaml`，记录执行状态

**每步完成：**
追加步骤 ID 到 `stepsCompleted` 数组

**任务完成：**
清除 `temp/` 目录（step 文件 + progress.yaml）

**进度格式：** 详见 `references/pipeline-progress-format.md`

## 步骤流程

### 步骤 1：初始化
[检查点：self-check]
- 创建 progress.yaml
- 加载配置

### 步骤 2：解析与清单生成
[检查点：user-confirm]
- 依赖：步骤 1 完成
- 加载：`temp/steps/step-02-parse.md`

### 步骤 3：生成文档字符串
[检查点：self-check]
- 依赖：步骤 2 完成

### 步骤 4：质量检查
[检查点：user-confirm]
- 依赖：步骤 3 完成
- 完成后清理 temp/
```

### 效果数据

- 文档完整性提升：**+55%**
- 步骤遗漏率降低：**90% → 5%**

---

## 模式组合策略

### 推荐组合及效果

| 组合 | 效果 | 适用场景 |
|------|------|----------|
| **Pipeline + Reviewer** | 质量提升 +29% | 代码审查、文档生成 |
| **Generator + Inversion** | 质量提升 +36% | 需求驱动的内容生成 |
| **Tool Wrapper + Pipeline** | 效率提升 +25% | 多技术栈复杂任务 |
| **Inversion + Pipeline + Reviewer** | 质量提升 +45% | 高要求项目交付 |

### 组合设计原则

1. **顺序原则**：Inversion 在前收集需求，Pipeline 居中执行，Reviewer 在后把关
2. **按需加载**：每个阶段按需加载对应的 Tool Wrapper
3. **模板驱动**：Generator 提供输出模板

### 组合 Skill 示例

```yaml
---
name: full-stack-delivery
description: 全栈项目交付，组合 Inversion + Pipeline + Reviewer 模式
metadata:
  patterns: [inversion, pipeline, reviewer]
  stages: "3"
  steps: "5"
---

## 阶段 1：需求访谈（Inversion）
- 完成所有采访问题
- 收集技术栈和约束条件

## 阶段 2：执行流水线（Pipeline）
- 步骤 1-5 按顺序执行
- 每步设置检查点

## 阶段 3：质量审查（Reviewer）
- 加载审查清单
- 按严重程度评分
```

---

## 组合通过率数据

| 模式组合 | 单次通过率 | 用户满意度 | 返工率 |
|----------|------------|------------|--------|
| 单一模式 | 65% | 72% | 35% |
| 双模式组合 | 78% | 84% | 18% |
| 三模式组合 | 89% | 92% | 7% |

---

## 选择指南

### 如何选择合适的模式

```
问自己以下问题：

1. 是否需要按需加载知识？
   → 是：Tool Wrapper

2. 是否需要确保输出结构一致？
   → 是：Generator

3. 是否需要审查/检查功能？
   → 是：Reviewer

4. 用户输入是否通常模糊/不完整？
   → 是：Inversion

5. 是否需要强制执行多步骤流程？
   → 是：Pipeline
```

### 组合选择

```
如果需要：
- 需求收集 + 内容生成 → Inversion + Generator
- 流程执行 + 质量把关 → Pipeline + Reviewer
- 多技术栈 + 流程化 → Tool Wrapper + Pipeline
- 高质量交付 → Inversion + Pipeline + Reviewer
```

---

*文档版本：1.0.0 | 基于 Google 官方研究*
