---
name: skill-creator
description: 通过问答引导创建 Skill，包含 9 种类型模板、检查清单、支持读取修改已有 Skill、Pipeline 进度追踪
aliases: [create-skill, skill-generator, 创建 Skill, skill 创建器]
author: Kei
triggers: [帮我创建一个 Skill, 想要做一个，我想创建，帮我写一个 skill, 生成一个 skill, 优化 skill]
version: 10.0.0
metadata:
  category: 工具类
  type: 元技能
  patterns: [generator, inversion]
  interaction: multi-turn
  stages: "9"
  gating: required
  pipelineTracking: true
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
需求澄清 → 设计模式推荐 → 用例定义 → 引用调研 → 生成草稿 → 写入文件 → Review 检查 → 测试建议 → 自动化评估与迭代
```

**详细流程：** 详见 `references/execution-guide.md`

---

## 阶段 1：需求澄清

通过 5 个问题收集需求：用途、触发方式、使用者、外部工具、输出格式。根据回答推荐 9 种类型之一。

**详见：** `references/execution-guide.md`（阶段 1） / `references/skill-types.md`

---

## 阶段 2：设计模式推荐

基于谷歌 5 种 Skill 设计模式，推荐 1-2 种最匹配的模式（可组合），解释原因并等待用户确认。

**详见：** `references/execution-guide.md`（阶段 2） / `references/google-design-patterns.md`

---

## 阶段 3：用例定义

收集 2-3 个具体用例（触发条件 → 执行步骤 → 预期结果），确认触发方式（显式 + 隐式）和文件结构需求。

**详见：** `references/execution-guide.md`（阶段 3）

---

## 阶段 4：引用调研

在生成草稿前调研项目上下文：扫描现有 Skill、读取项目文档、搜索代码库、询问用户。按 Skill 复杂度控制调研深度。

**详见：** `references/execution-guide.md`（阶段 4）

---

## 阶段 5：生成草稿

从 `templates/` 加载对应类型模板 → 流程抽象化分析（> 200 行详细流程移至 `references/`） → 填充用户定制内容 → 输出 Diff 格式预览 → 等待用户确认。

**详见：** `references/execution-guide.md`（阶段 5）

---

## 阶段 6：写入文件

确认输出位置（默认 `.claude/skills/[skill-name]/`） → 创建目录结构 → 使用 Write 工具写入。

---

## 阶段 7：Review 检查

加载 `checklists/creation-checklist.md` 逐项检查：格式、内容、触发、设计模式专项。

**详见：** `references/execution-guide.md`（阶段 7） / `checklists/creation-checklist.md`

---

## 阶段 8：测试建议

生成 4 组测试：显式触发、隐式触发、边界情况、设计模式验证（Inversion/Pipeline/Reviewer/Generator/Tool Wrapper）。

**详见：** `references/execution-guide.md`（阶段 8）

---

## 阶段 9：自动化评估与迭代

> **来源：** 官方 skill-creator 核心循环 — "写 → 测 → 评 → 改"迭代机制

### 9.1 定义测试用例

创建 `evals/evals.json`（模板见 `templates/evals-template.json`），每条用例包含 prompt、expected_output、expectations。

**期望编写原则：** 可验证（非"质量好"）、可区分（错误输出不应通过）、覆盖全面（正常+边界+错误）、先写 prompt 后写期望。

### 9.2 执行 → 评分 → 改进 → 迭代

```
执行测试 → Grader 评分 → 分析失败 → 改进 Skill → 更新版本历史 → 重测
```

- **执行**：记录转录、输出文件、metrics.json、timing.json、user_notes.md
- **评分**：加载 `references/grader-agent.md`，逐条 PASS/FAIL + 证据
- **改进**：从反馈中泛化，保持精简，解释 why，跨用例找共性
- **追踪**：更新 `evals/history.json`

**详见：** `references/eval-schemas.md` / `references/grader-agent.md` / `references/eval-iteration-loop.md`

---

## 9 种 Skill 类型与设计模式推荐

| 类型 | 适用场景 | 推荐设计模式 | Pipeline 进度追踪 | 模板文件 |
|------|----------|--------------|------------------|----------|
| 库和 API 参考 | 内部库、CLI、SDK 使用指南 | **Tool Wrapper** | 不需要 | `templates/library-reference.md` |
| 产品验证 | 测试流程、断言验证 | **Pipeline + Reviewer** | **需要** | `templates/product-verification.md` |
| 数据获取与分析 | 数据查询、报表生成 | **Tool Wrapper + Generator** | 不需要 | `templates/data-analysis.md` |
| 代码生成 | 规格转代码、设计稿转前端 | **Generator + Pipeline** | **需要** | `templates/code-generation.md` |
| 文档生成 | PR 描述、API 文档、发布说明 | **Generator + Inversion** | 不需要 | `templates/doc-generation.md` |
| 代码审查 | 安全检查、性能分析、代码质量 | **Reviewer + Tool Wrapper** | 不需要 | `templates/code-review.md` |
| 部署流程 | 部署、发布、回滚 | **Pipeline + Reviewer** | **需要** | `templates/deployment.md` |
| 团队规范 | 编码风格、提交规范 | **Tool Wrapper** | 不需要 | `templates/team-norms.md` |
| 调研整理 | 技术调研、知识整理 | **Inversion + Generator** | 不需要 | `templates/research.md` |

**Pipeline 进度追踪详解：** 详见 `references/pipeline-progress-format.md`

---

## 修改已有 Skill 流程

M1 读取 → M2 确认修改内容 → M3 设计模式优化建议（未使用则推荐） → M4 生成 Diff 预览 → M5 写入。

**详见：** `references/execution-guide.md`（修改流程）

---

## 优化 Skill 结构流程

**触发条件：** SKILL.md > 500 行 或 工作流程 > 200 行

**原则：** 主文件保留核心原则 + 工作流概览 + 关键决策点 + 引用链接；详细步骤、检查清单、规范、示例移至 `references/`。

**详见：** `references/execution-guide.md`（优化流程）

---

## 输出格式规范

**阶段输出：** 每个阶段结束标注当前阶段、下一步、等待确认。

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
```

**详见：** `references/execution-guide.md`（输出格式规范）

---

## 检查清单

### 创建前检查
- [ ] 明确了 2-3 个具体用例
- [ ] 确认了触发方式（显式 + 隐式）
- [ ] 选择了 Skill 类型（9 选 1）
- [ ] **选择了设计模式（5 选 1 或组合）**
- [ ] 确认了文件结构需求
- [ ] **确认了设计模式所需的资源文件**

### 生成后检查
- [ ] YAML Frontmatter 格式正确
- [ ] description 清晰具体（100 词内）
- [ ] 包含可执行的工作流程（抽象化）
- [ ] 没有陈述显而易见的内容
- [ ] **`metadata.pattern` 字段正确设置**
- [ ] **设计模式指令完整（门控、检查点、审查分离等）**
- [ ] **流程抽象化正确（主文件 < 500 行，详细在 references/）**
- [ ] **引用链接正确指向 references/ 文件**

### 写入前检查
- [ ] 用户已确认草稿
- [ ] Review 检查通过
- [ ] 输出路径已确认
- [ ] **设计模式资源文件已创建（如适用）**
- [ ] **详细流程文件已创建（如适用）**

**完整检查清单：** 详见 `checklists/creation-checklist.md`

---

## 注意事项

### 安全与合规
- 不创建需要敏感权限的 Skill（如读取 .env）
- 执行脚本前需用户确认
- 外部 API 调用需验证 SSL

### 性能考虑
- Skill 文件不宜过大（SKILL.md < 500 行）
- 复杂逻辑放入 references/ 按需加载
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
| Eval 模板 | `templates/evals-template.json` | 测试用例定义 |
| **详细执行指南** | `references/execution-guide.md` | 所有阶段详细步骤 |
| 工作流程详情 | `references/workflow.md` | 详细流程说明 |
| 技能类型说明 | `references/skill-types.md` | 9 种类型详解 |
| 检查清单 | `checklists/creation-checklist.md` | Review 检查 |
| 使用示例 | `examples/usage-examples.md` | 典型场景 |
| **谷歌设计模式** | `references/google-design-patterns.md` | 5 种设计模式详解与组合策略 |
| **Pipeline 进度追踪** | `references/pipeline-progress-format.md` | Pipeline 模式进度追踪格式规范 |
| **Eval Schema** | `references/eval-schemas.md` | 评估数据格式（evals/grading/metrics/history） |
| **Grader Agent** | `references/grader-agent.md` | 评分器指令 |
| **Eval 迭代循环** | `references/eval-iteration-loop.md` | 写→测→评→改迭代流程 |

---

*Skill 版本：10.0.0 | 作者：Kei | 创建日期：2026-03-25*
*更新：2026-04-27 v9 → v10 增加 Pipeline 进度追踪架构，采用 BMAD step-file architecture*
