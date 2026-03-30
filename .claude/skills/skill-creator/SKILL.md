---
name: skill-creator
description: 通过问答引导创建 Skill，包含 9 种类型模板、检查清单、支持读取修改已有 Skill
aliases: [create-skill, skill-generator, 创建 Skill, skill 创建器]
author: Kei
triggers: [帮我创建一个 Skill, 想要做一个，我想创建，帮我写一个 skill, 生成一个 skill, 优化 skill]
version: 3.0.0
metadata:
  category: 工具类
  type: 元技能
---

# Skill Creator - Skill 创建器

## 用途

当用户想要创建新的 Skill 或修改已有 Skill 时，自动使用此 Skill。

**适用场景：** 创建 Skill、修改已有 Skill、学习 Skill 编写、优化 Skill 结构

**不适用场景：** 简单 Skill 使用问题、Skill 加载/触发故障排查

---

## 核心原则

1. **引导而非假设**：通过问答收集需求，不做假设
2. **推荐而非强加**：根据用户需求推荐最合适的 Skill 类型
3. **模板而非空壳**：提供 9 种类型的完整模板供选择
4. **检查而非直出**：生成后必须执行 Review 检查
5. **配置而非硬编码**：默认路径可配置

---

## 工作流程概览

```
需求澄清 → 用例定义 → 生成草稿 → 写入文件 → Review 检查 → 测试建议
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

## 阶段 2：用例定义

**2.1 收集具体用例** — 描述 2-3 个具体用例

**用例格式：**
- **触发条件**：用户说什么/做什么时触发
- **执行步骤**：Skill 需要执行的操作
- **预期结果**：输出什么/完成什么

**2.2 确认触发方式**
- 显式命令：`/skill-name`（英文连字符）
- 隐式触发词：3-5 个中文触发词

**2.3 确认文件结构**
```
skill-name/
├── SKILL.md              # 必需
├── templates/            # 可选
├── references/           # 可选
├── scripts/              # 可选
└── checklists/           # 可选
```

---

## 阶段 3：生成草稿

**3.1 加载对应类型模板** — 从 `templates/` 目录加载

**3.2 填充用户定制内容** — 填入用例、触发方式等

**3.3 输出草稿预览（Diff 格式）**

```markdown
## Skill 草稿预览（变更摘要）

### 变更项
- **Frontmatter:** 新增 `version: 2.0.0`, `compatibility` 字段
- **核心原则:** 新增原则 6 "效率优先"
- **工作流程:** 阶段 X 新增步骤 Y...

### 完整内容
详见输出位置或说"显示完整草稿"。
```

**等待用户确认后进入阶段 4。**

---

## 阶段 4：写入文件

**4.1 确认输出位置** — 默认 `.claude/skills/[skill-name]/`

**4.2 创建目录结构** — 手动或脚本创建

**4.3 写入文件** — 使用 Write 工具写入 SKILL.md 及其他文件

---

## 阶段 5：Review 检查

加载 `checklists/creation-checklist.md` 并逐项检查：

| 检查类型 | 必须项 |
|----------|--------|
| 格式检查 | YAML Frontmatter、Markdown 正确 |
| 内容检查 | description 清晰、工作流程可执行、无废话 |
| 触发检查 | 显式命令 + 隐式触发词（3-5 个） |

**详见：** `checklists/creation-checklist.md`

---

## 阶段 6：测试建议

生成测试用例供用户验证：

```markdown
## 测试建议

### 测试 1：显式触发
/[skill-name] 测试内容

### 测试 2：隐式触发
[触发词 1] 测试内容

### 测试 3：边界情况
[边界场景描述]
```

---

## 9 种 Skill 类型

| 类型 | 适用场景 | 模板文件 |
|------|----------|----------|
| 库和 API 参考 | 内部库、CLI、SDK 使用指南 | `templates/library-reference.md` |
| 产品验证 | 测试流程、断言验证 | `templates/product-verification.md` |
| 数据获取与分析 | 数据查询、报表生成 | `templates/data-analysis.md` |
| 代码生成 | 规格转代码、设计稿转前端 | `templates/code-generation.md` |
| 文档生成 | PR 描述、API 文档、发布说明 | `templates/doc-generation.md` |
| 代码审查 | 安全检查、性能分析、代码质量 | `templates/code-review.md` |
| 部署流程 | 部署、发布、回滚 | `templates/deployment.md` |
| 团队规范 | 编码风格、提交规范 | `templates/team-norms.md` |
| 调研整理 | 技术调研、知识整理 | `templates/research.md` |

---

## 修改已有 Skill 流程

**步骤 M1：读取** — `.claude/skills/[skill-name]/SKILL.md`

**步骤 M2：确认修改内容** — 新增功能、修改流程、调整触发方式等

**步骤 M3：生成修改预览（Diff 格式）**

```markdown
## Skill 修改预览（变更摘要）

### 变更项
- **Frontmatter:** `version` X.0.0 → Y.0.0
- **工作流程:** 修改阶段 X 的步骤 Y...
```

**步骤 M4：写入** — 更新后的文件

---

## 优化 Skill 结构流程

**步骤 O1：读取** → **O2：分析问题** → **O3：生成方案** → **O4：执行**

**分析维度：**
- 主文档是否过长（> 500 行）
- 是否包含重复内容
- 是否有可移至 references/的内容
- 是否符合标准目录结构

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
- [ ] 确认了文件结构需求

### 生成后检查
- [ ] YAML Frontmatter 格式正确
- [ ] description 清晰具体（100 词内）
- [ ] 包含可执行的工作流程
- [ ] 没有陈述显而易见的内容

### 写入前检查
- [ ] 用户已确认草稿
- [ ] Review 检查通过
- [ ] 输出路径已确认

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

---

*Skill 版本：3.0.0 | 作者：Kei | 创建日期：2026-03-25*
*更新：2026-03-30 精简主文档至~300 行，示例移至 examples/，检查清单独立*
