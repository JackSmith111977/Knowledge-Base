---
name: project-migration
description: 为已有代码库的传统项目建立文档优先 AI 开发系统，通过三阶段流程（现状分析→无限询问→文档生成）实现平滑迁移
aliases: [legacy-migration, doc-migration, migration-assist]
triggers: [老项目接入 AI, 为这个项目加文档，迁移到文档优先，分析现有代码，制定迁移计划，项目现状分析]
author: Kei
version: 1.0.0
metadata:
  category: 部署流程
  type: 交互式迁移向导
---

# project-migration - 传统项目文档优先迁移

## 用途

当用户需要为**已有代码库的老项目**建立文档优先 AI 开发系统时，通过**三阶段流程**实现平滑迁移：
1. **现状分析**：扫描项目结构、识别技术栈、分析现有文档
2. **无限询问**：动态询问项目配置、团队配置、文档偏好
3. **文档生成**：生成完整的 `.claude/` 和 `docs/` 文档体系

**适用场景：** 已有代码库但缺少文档的老项目、Monorepo/多应用工作区分析
**不适用场景：** 从零开始的新项目（使用 `/project-start`）

**核心原则：**
1. **先诊断后开方**：先分析现状，再生成文档
2. **不假设任何前提**：所有配置通过动态询问确认
3. **完整文档体系**：生成 CLAUDE.md + 完整 docs/ 结构
4. **支持多应用**：可识别 Monorepo、Trae、VSCode 工作区
5. **动态询问**：不固定问题数量，直到所有前提明确

---

## 工作流程

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   阶段 1: 现状分析  │────▶│  阶段 2: 无限询问  │────▶│  阶段 3: 文档生成  │
│   Status Check  │     │  Confirmation   │     │   Generation    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                       │                       │
        ▼                       ▼                       ▼
   扫描项目结构            动态确认配置             生成完整文档体系
   识别技术栈              补充业务逻辑             CLAUDE.md + docs/
   生成现状报告            确定迁移优先级
```

### 阶段 1：现状分析

- 扫描目录结构、识别技术栈、统计代码规模
- 检查现有文档、分析依赖关系、检测工作区配置
- 输出：`docs/migration/current-status.md`

### 阶段 2：无限询问

- 核心问题（必问）：项目核心目标、团队配置、文档详细程度
- 条件问题（按需）：多应用配置、技术债务处理、现有文档保留
- 结束条件：用户说"够了"/"继续"或已收集足够信息

### 阶段 3：文档生成

- 分批生成：.claude/目录 → docs/main/核心文档 → docs/migration/迁移文档
- 每批次完成后用户确认
- 输出：完成报告 + 文档体系结构

详见：`references/workflow-details.md`

---

## 输出文档

### 文档详细程度

| 版本 | 生成文件 | 适用场景 |
|------|----------|----------|
| **精简版** | CLAUDE.md, TECH_STACK.md, migration-plan.md | 个人项目、快速原型 |
| **标准版** | 精简版 + PRD.md, APP_FLOW.md, current-status.md | 小团队、中等复杂度 |
| **完整版** | 标准版 + FRONTEND_GUIDELINES.md, BACKEND_STRUCTURE.md, IMPLEMENTATION_PLAN.md | 企业项目、长期维护 |

### 多应用文档策略

| 策略 | 说明 | 适用场景 |
|------|------|----------|
| **统一模式** | 所有应用共享一套文档 | 应用间高度耦合 |
| **分离模式** | 每个应用独立文档 | 应用相对独立 |
| **混合模式** | 核心共享 + 应用独立 | 大部分共享 + 部分独立 |

详见：`references/output-spec.md`、`references/multi-app-guide.md`

---

## 支持的工作区类型

| 工作区类型 | 识别标志 |
|------------|----------|
| **Trae 工作区** | `.trae/` 目录 |
| **VSCode 工作区** | `.code-workspace` 文件 |
| **Monorepo** | `apps/`、`packages/` 目录 |
| **单应用** | 标准项目结构 |

---

## 检查清单

### 阶段 1 检查（核心项）

- [ ] 扫描了所有应用（Monorepo/工作区场景）
- [ ] 正确识别技术栈
- [ ] 评估了现有文档
- [ ] 推荐了迁移策略

### 阶段 2 检查（核心项）

- [ ] 询问了核心问题
- [ ] 根据需要追问了条件问题
- [ ] 用户确认了配置

### 阶段 3 检查（核心项）

- [ ] 按批次生成文档
- [ ] 每批次完成后确认
- [ ] 生成了完成报告

详细检查清单：`checklists/assessment-checklist.md`、`checklists/migration-checklist.md`

---

## 踩坑清单

| 陷阱 | 错误做法 | 正确做法 |
|------|----------|----------|
| **假设技术栈** | "这是 React 项目" | 扫描 package.json 确认 |
| **跳过现状分析** | 直接开始询问 | 必须先了解项目现状 |
| **遗漏多应用** | 只分析根目录 | 扫描工作区配置和 apps/ |
| **固定问题数量** | "8 个问题问完" | 动态追问直到前提明确 |
| **文档过度生成** | 都生成完整版 | 根据用户选择生成 |

---

## 示例

**用户：** `/project-migration` 或 "老项目接入 AI"

**响应流程：**
```
🚀 项目迁移向导
→ 阶段 0：工作区检测
→ 阶段 1：现状分析 → current-status.md
→ 阶段 2：无限询问（动态追问）
→ 阶段 3：文档生成 → 完成报告
```

更多示例：`examples/usage-examples.md`

---

## 注意事项

### 安全与合规
- 不读取 `.env`、`*.key` 等敏感文件
- 不扫描 `node_modules/`、`dist/` 等生成目录
- 尊重 `.gitignore` 配置

### 性能考虑
- 大项目（>1000 文件）分批次扫描
- 每阶段完成后立即保存
- Monorepo 场景可选择性扫描部分应用

### 限制说明
- 无法读取二进制文件内容
- 无法执行需要 API Key 的查询
- 工作区检测依赖于配置文件的存在

---

## 资源索引

| 资源 | 文件 | 用途 |
|------|------|------|
| 工作流程细节 | `references/workflow-details.md` | 各阶段详细步骤 |
| 输出格式规范 | `references/output-spec.md` | 文档格式规范 |
| 多应用指南 | `references/multi-app-guide.md` | 多应用处理 |
| 现状报告模板 | `templates/assessment-template.md` | 现状报告格式 |
| 迁移计划模板 | `templates/migration-plan-template.md` | 迁移计划格式 |
| 评估检查清单 | `checklists/assessment-checklist.md` | 阶段 1 检查 |
| 迁移检查清单 | `checklists/migration-checklist.md` | 阶段 3 检查 |
| 使用示例 | `examples/usage-examples.md` | 使用示例 |

---

*Skill 版本：1.0.0 | 作者：Kei | 创建日期：2026-03-26*
