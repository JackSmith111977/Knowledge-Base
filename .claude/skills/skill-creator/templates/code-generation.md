---
template-type: code-generation
name: 代码生成模板（Generator + Pipeline 模式）
description: 用于创建根据规格说明生成代码的 Skill 模板，采用 Pipeline 进度追踪
designPatterns: [generator, pipeline]
progressTracking: true
---

# [代码类型] 生成器

## 用途

当用户需要根据 [输入类型] 生成 [代码类型] 时，自动使用此 Skill。

**适用场景：**
- 从设计稿生成前端代码
- 从 API spec 生成接口代码
- 从数据库 Schema 生成模型代码

---

## 硬性门控（Gating Instructions）

**按顺序执行每一步。如果某一步失败，不得继续。**

**DON'T:**
- 🛑 不要跳过任何步骤
- 🛑 不要合并多个步骤
- 🛑 不要在未通过检查点时继续
- 🛑 不要加载多个 step 文件同时执行
- 🛑 不要在未验证前序步骤完成时开始新步骤

---

## 进度追踪架构

**采用 Pipeline 进度追踪：**

```yaml
# temp/progress.yaml
stepsCompleted: []
currentStep: step-01-parse
nextStep: step-02-plan
checkpoint: self-check
status: in-progress
createdAt: [timestamp]
updatedAt: [timestamp]

metadata:
  inputType: api-spec
  outputType: typescript-interfaces
  inputFile: specs/api.yaml
  outputFile: src/types/api.ts
```

**进度格式规范：** 详见 `references/pipeline-progress-format.md`

---

## 输入要求

### 输入格式

```[格式]
# 输入示例
```

### 必填字段

| 字段 | 类型 | 说明 |
|------|------|------|
| ... | ... | ... |

---

## Pipeline 步骤流程

### 步骤 1：解析输入规格
**检查点：self-check**
**依赖：无**

- 加载输入文件
- 解析规格结构
- 验证必填字段完整性

**完成后操作：**
- 追加 `step-01-parse` 到 `stepsCompleted`
- 加载 `temp/steps/step-02-plan.md`

---

### 步骤 2：规划生成策略
**检查点：user-confirm**
**依赖：step-01-parse**

- 分析生成规则（加载 `references/generation-rules.md`）
- 确定输出结构
- 规划变量映射

**完成后操作：**
- 追加 `step-02-plan` 到 `stepsCompleted`
- 等待用户确认后加载 `step-03-generate.md`

---

### 步骤 3：加载模板并生成
**检查点：self-check**
**依赖：step-02-plan**

- 加载代码模板（`assets/template.md`）
- 填充变量
- 应用代码规范（`references/code-conventions.md`）

**代码模板：**
```[语言]
// {{变量}} 表示需要填充的部分
```

**完成后操作：**
- 追加 `step-03-generate` 到 `stepsCompleted`
- 加载 `step-04-validate.md`

---

### 步骤 4：质量检查
**检查点：auto-verify**
**依赖：step-03-generate**

**检查清单：**
- [ ] 语法正确
- [ ] 符合命名规范
- [ ] 包含必要的注释
- [ ] 通过 lint 检查

```bash
# 运行 lint 检查
[lint-command] [outputFile]
```

**完成后操作：**
- 追加 `step-04-validate` 到 `stepsCompleted`
- 自动验证通过后加载 `step-05-output.md`

---

### 步骤 5：输出并清理
**检查点：user-confirm**
**依赖：step-04-validate**

- 写入输出文件
- 清除 `temp/` 目录
- 报告生成结果

**完成后操作：**
- 追加 `step-05-output` 到 `stepsCompleted`
- 设置 `status: completed`

---

## 目录结构

```
[skill-name]/
├── SKILL.md                    # 主文件（含硬性门控）
├── temp/                       # 临时目录（任务完成清除）
│   ├── steps/                  # Step 文件
│   │   ├── step-01-parse.md
│   │   ├── step-02-plan.md
│   │   ├── step-03-generate.md
│   │   ├── step-04-validate.md
│   │   └── step-05-output.md
│   └── progress.yaml           # 进度追踪
├── references/                 # 持久化资源
│   ├── pipeline-progress-format.md
│   ├── generation-rules.md     # Generator: 生成规则
│   └ code-conventions.md       # Generator: 代码规范
├── assets/                     # Generator 资源
│   └ template.md               # Generator: 输出模板
└── outputs/                    # 输出目录
    └ [outputFile]
```

---

## 生成示例

### 示例 1

**输入：**
```[格式]
# 输入内容
```

**输出：**
```[语言]
// 生成的代码
```

---

## 代码规范

### 命名规范

- [命名规则 1]
- [命名规则 2]

### 格式规范

- [格式规则 1]
- [格式规则 2]

---

*模板版本：2.0.0 | 采用 Pipeline 进度追踪架构*