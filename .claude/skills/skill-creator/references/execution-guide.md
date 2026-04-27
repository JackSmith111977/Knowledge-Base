# Skill Creator — 详细执行指南

> 本文档包含 SKILL.md 中各阶段的详细执行步骤、表格和示例
> 主文件仅保留摘要，详细内容在此处
>
> **返回主文件：** [SKILL.md](../SKILL.md)

---

## 阶段 2 详情：设计模式推荐

### 2.1 5 种设计模式完整定义

| 模式 | 核心定义 | 适用场景 |
|------|----------|----------|
| **Tool Wrapper（工具封装）** | 按需注入知识，避免全量加载 | 框架规范、团队约定、库使用指南 |
| **Generator（生成器）** | 模板驱动生成，确保输出一致 | API 文档、标准化报告、Commit Message |
| **Reviewer（审查器）** | 审查分离，模块化检查标准 | 代码审查、安全审计、质量检查 |
| **Inversion（反转/采访者）** | Agent 采访用户，先提问再行动 | 需求收集、复杂任务启动、项目规划 |
| **Pipeline（流水线/管道）** | 强制执行多步骤流程，带检查点 | 文档生成、发布流程、多步验证 |

**完整说明：** 详见 `google-design-patterns.md`

### 2.2 模式组合推荐

| 组合 | 效果 | 适用场景 |
|------|------|----------|
| **Pipeline + Reviewer** | 质量提升 +29% | 代码审查、文档生成 |
| **Generator + Inversion** | 质量提升 +36% | 需求驱动的内容生成 |
| **Tool Wrapper + Pipeline** | 效率提升 +25% | 多技术栈复杂任务 |
| **Inversion + Pipeline + Reviewer** | 质量提升 +45% | 高要求项目交付 |

### 2.3 元数据设置示例

```yaml
# 单一模式
metadata:
  pattern: inversion
  interaction: multi-turn
  stages: "3"
```

```yaml
# 组合模式
metadata:
  patterns: [inversion, pipeline, reviewer]
  stages: "3"
  steps: "5"
```

### 2.4 推荐流程

1. **分析需求** — 根据阶段 1 的回答，识别适用模式
2. **推荐模式** — 推荐 1-2 种最匹配的模式（可组合）
3. **解释原因** — 说明为什么推荐这些模式
4. **用户确认** — 等待用户选择或调整

---

## 阶段 3 详情：用例定义

### 3.1 用例格式

```markdown
**用例名称：** [简短描述]
- **触发条件：** 用户说什么/做什么
- **执行步骤：** 1 → 2 → 3
- **预期结果：** 输出格式和内容
```

### 3.2 触发方式配置

- **显式命令**：`/skill-name`（英文连字符，如 `/code-review`）
- **隐式触发词**：3-5 个中文触发词，包含同义词、常见说法

### 3.3 标准文件结构

```
skill-name/
├── SKILL.md              # 必需
├── templates/            # 可选
├── references/           # 可选，设计模式相关资源
│   ├── conventions.md    # Tool Wrapper: 规范文档
│   ├── checklists/       # Reviewer: 审查清单
│   └── style-guide.md    # Generator: 风格指南
├── assets/               # 可选，模板资源
│   └── template.md       # Generator: 输出模板
├── scripts/              # 可选
└── checklists/           # 可选
```

### 3.4 设计模式资源确认

| 模式 | 需要创建的资源 | 存放位置 |
|------|---------------|----------|
| **Tool Wrapper** | `references/conventions.md` | 规范文档 |
| **Generator** | `assets/template.md` + `references/style-guide.md` | 模板 + 风格指南 |
| **Reviewer** | `references/checklist-*.md` | 审查清单 |
| **Inversion** | 阶段问题列表 + 门控指令 | SKILL.md 内定义 |
| **Pipeline** | `temp/steps/` + `temp/progress.yaml` + 硬性门控指令 | Step 文件 + 进度追踪 |

### 3.5 Pipeline 进度追踪资源

**适用 Skill 类型：** 产品验证、部署流程、代码生成

**必须创建的资源：**

```
[skill-name]/
├── temp/                       # 临时目录（任务完成清除）
│   ├── steps/                  # Step 文件目录
│   │   ├── step-01-init.md
│   │   ├── step-02-xxx.md
│   │   └── ...
│   └── progress.yaml           # 进度追踪文件
├── references/
│   └ pipeline-progress-format.md  # 进度格式规范（引用）
│   └ [其他资源]
```

**progress.yaml 格式：**

```yaml
stepsCompleted: []
currentStep: step-01-init
nextStep: step-02-xxx
checkpoint: self-check
status: in-progress
createdAt: [timestamp]
updatedAt: [timestamp]
```

**详细规范：** 详见 `pipeline-progress-format.md`

---

## 阶段 4 详情：引用调研

### 4.1 调研范围

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

### 4.2 调研方式

1. **扫描现有 Skill** — 使用 Glob 扫描 `.claude/skills/` 目录
2. **读取项目文档** — 读取 `.claude/` 配置文件、CLAUDE.md、团队规范
3. **搜索代码库** — 使用 Grep 搜索相关代码模式、函数名、配置项
4. **询问用户** — 对于不确定的信息，通过提问确认

### 4.3 调研深度控制

- **简单 Skill**（单一功能、无依赖）→ 快速扫描，1-2 个参考
- **中等 Skill**（多步骤、有依赖）→ 适度调研，3-5 个参考
- **复杂 Skill**（组合模式、跨领域）→ 深度调研，5+ 个参考 + 用户确认

### 4.4 调研结果格式

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

### 4.5 用户确认问题

- 是否有遗漏的重要上下文？
- 是否有需要特别关注的约束？
- 是否有可参考的现有文档/Skill？

---

## 阶段 5 详情：生成草稿

### 5.1 加载模板

从 `templates/` 目录加载对应类型模板（见主文件 9 种类型表）。

### 5.2 流程抽象化分析

**判断是否需要抽象化：**
- 主文件工作流程 > 200 行
- 包含复杂的多步骤流程
- 设计模式为 Pipeline/Reviewer（多步骤/多检查项）

**抽象化步骤：**

1. **识别详细流程内容** — 多步骤操作、复杂条件判断、详细检查清单、示例代码、表格
2. **创建 `references/procedure.md`** — 详细步骤（前置条件 → 步骤 → 异常处理 → 常见问题）
3. **重写主文件工作流程** — 保留摘要级描述，引用 `references/`
4. **建立引用关系** — 主文件用 `详见 references/[filename].md`，引用文件顶部加反向链接

### 5.3 输出草稿预览格式

```markdown
## Skill 草稿预览（变更摘要）

### 变更项
- **Frontmatter:** 新增/修改的字段
- **核心原则:** 新增的原则
- **设计模式:** 添加的模式指令
- **工作流程:** 修改的步骤
- **流程抽象化:** 详细流程已移至 references/

### 文件结构
```
skill-name/
├── SKILL.md
├── references/
│   └── procedure.md
```

### 完整内容
详见输出位置或说"显示完整草稿"。
```

---

## 阶段 7 详情：Review 检查

### 设计模式专项检查

| 模式 | 检查项 |
|------|--------|
| **Tool Wrapper** | `references/conventions.md` 存在、按需加载指令正确 |
| **Generator** | `assets/template.md` + `references/style-guide.md` 存在 |
| **Reviewer** | `references/checklist-*.md` 存在、审查分离架构正确 |
| **Inversion** | 阶段问题列表完整、门控指令（DO NOT）存在 |
| **Pipeline** | `temp/steps/` 目录存在、`progress.yaml` 格式正确、硬性门控指令（🛑）完整、步骤依赖关系清晰 |

### Pipeline 进度追踪专项检查

**适用 Skill 类型：** 产品验证、部署流程、代码生成

**检查清单：**

- [ ] `temp/` 目录存在（任务完成清除）
- [ ] `temp/steps/` 包含所有步骤文件
- [ ] `temp/progress.yaml` 格式符合规范
- [ ] SKILL.md 包含硬性门控指令（🛑 DON'T）
- [ ] 每个 step 文件包含：
  - [ ] `stepId`、`stepName`、`checkpoint`、`requires`、`produces`
  - [ ] 前置检查逻辑
  - [ ] 完成后操作（更新 progress.yaml）
- [ ] 引用 `references/pipeline-progress-format.md`

**完整检查清单：** 详见 `checklists/creation-checklist.md`

---

## 阶段 8 详情：测试建议

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

## 阶段 9 详情：自动化评估与迭代

### 9.1 Eval 定义

基于阶段 3 确认的 2-3 个用例，创建 `evals/evals.json`：

```json
{
  "skill_name": "[skill-name]",
  "evals": [
    {
      "id": "eval-001",
      "prompt": "[触发词] [测试内容]",
      "expected_output": "[预期输出]",
      "expectations": [
        "具体可验证的期望 1",
        "具体可验证的期望 2"
      ]
    }
  ]
}
```

**期望编写原则：**
- **要可验证** — "输出包含 X 章节"，不是"输出质量好"
- **要可区分** — 好的期望在 Skill 真正成功时通过，失败时不通过
- **要覆盖** — 正常路径 + 边界情况 + 错误输入
- **先写 prompt，后写期望** — 不要一开始就写断言

### 9.2 执行测试步骤

1. 使用测试 prompt 触发 Skill
2. 记录执行转录（工具调用、步骤、输出）
3. 保存输出文件到 `evals/runs/<timestamp>/outputs/`
4. 记录指标到 `outputs/metrics.json`，时间到 `../timing.json`
5. 在 `outputs/user_notes.md` 记录不确定项

### 9.3 Grader 评分流程

加载 `references/grader-agent.md`，执行：

1. **读取转录** — 完整读取执行记录
2. **检查输出** — 逐一检查输出文件
3. **评估期望** — 每条期望判定 PASS/FAIL + 引用证据
4. **提取隐含声明** — 从输出中提取未在期望中但实际存在的问题
5. **审查评估本身** — 是否存在过于宽松的断言或遗漏
6. **输出 grading.json** — 详见 `references/eval-schemas.md`

**评分标准：**

| 判定 | 条件 |
|------|------|
| **PASS** | 转录/输出清楚证明 + 可引用具体证据 + 反映实质而非表面 |
| **FAIL** | 无证据 / 证据矛盾 / 无法验证 / 证据表面 / 偶然匹配 |

### 9.4 改进指南

**改进指南表：**

| 问题类型 | 改进方式 |
|----------|----------|
| 指令不清 | 重写具体指令，加入 DO NOT |
| 步骤缺失 | 补充缺失步骤到 Pipeline |
| 输出不符 | 加强 Generator 模板或 Style Guide |
| 触发不准 | 优化 description 或 triggers |
| 评估过松 | 加强期望断言，检查内容而非表面 |

**改进原则：**
1. **Generalize from feedback** — 从反馈中抽象通用规则
2. **Keep the prompt lean** — 优先删除冗余，不堆积指令
3. **Explain the why** — 保留"为什么"的解释，帮助 Agent 理解
4. **Look for repeated work** — 多个用例遇到同样问题 → 抽象为通用规则

### 9.5 版本追踪

```json
{
  "skill_name": "research",
  "current_best": "v3",
  "iterations": [
    {
      "version": "v3",
      "parent": "v2",
      "expectation_pass_rate": 0.92,
      "changes": "补充调研结果验证，优化输出模板"
    }
  ]
}
```

### 9.6 盲对比

1. 对有/无 Skill 分别运行相同测试
2. 由 Grader 对两者分别评分
3. 对比通过率、耗时、Token 消耗
4. 输出 `benchmark.json` 报告改进幅度

### 9.7 描述优化

1. 创建 20 条评估查询（10 条应触发 + 10 条不应触发）
2. 逐一测试是否准确触发
3. 根据结果调整 `description`（使其更"pushy"）和 `triggers`

### 9.8 执行模式选择

| 模式 | 适用场景 | 执行方式 |
|------|----------|----------|
| **最小可行** | 简单 Skill、快速验证 | 手动执行 3 个 prompt，手动评分 |
| **标准** | 中等 Skill、正式发布 | 完整 evals.json + Grader 评分 + 版本追踪 |
| **严谨** | 复杂 Skill、团队共享 | 盲对比 + Benchmark + 描述优化 |

---

## 修改已有 Skill 流程

**步骤 M1：读取** — `.claude/skills/[skill-name]/SKILL.md`

**步骤 M2：确认修改内容** — 新增功能、修改流程、调整触发方式等

**步骤 M3：设计模式优化建议**

如果 Skill 未使用设计模式，根据功能推荐：
- 需求收集类 → **Inversion**
- 文档生成类 → **Generator + Inversion**
- 审查类 → **Reviewer**
- 流程类 → **Pipeline**
- 规范类 → **Tool Wrapper**

**步骤 M4：生成修改预览**

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
- SKILL.md > 500 行
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

**O1：读取** — 分析 SKILL.md 内容

**O2：分析问题**
- 主文档是否过长（> 500 行）
- 是否包含重复内容
- 是否有可移至 references/ 的内容
- 是否符合标准目录结构

**O3：生成方案** — 识别需要移至 references/ 的内容

**O4：执行** — 创建引用文件，重写主文件

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

*本文档包含 SKILL.md 的详细执行步骤，主文件 < 500 行。*
