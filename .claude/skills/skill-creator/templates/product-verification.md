---
template-type: product-verification
name: 产品验证模板（Pipeline 模式）
description: 用于创建测试/验证流程 Skill 模板，采用 Pipeline 进度追踪
designPatterns: [pipeline, reviewer]
progressTracking: true
---

# [产品名称] 验证流程

## 用途

当用户需要验证 [产品功能] 是否正常工作时，自动使用此 Skill。

**适用场景：**
- 新功能上线前的验证
- 回归测试
- 发布前检查

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
currentStep: step-01-init
nextStep: step-02-prepare
checkpoint: self-check
status: in-progress
createdAt: [timestamp]
updatedAt: [timestamp]
```

**进度格式规范：** 详见 `references/pipeline-progress-format.md`

---

## 验证目标

| 功能 | 验证内容 | 预期结果 |
|------|----------|----------|
| ... | ... | ... |

---

## 验证环境

### 环境要求

- [环境 1，如：测试环境]
- [环境 2，如：Staging 环境]

### 前置条件

- [条件 1，如：测试账号]
- [条件 2，如：测试数据]

---

## Pipeline 步骤流程

### 步骤 1：初始化
**检查点：self-check**
**依赖：无**

- 创建 `temp/progress.yaml`
- 加载验证配置
- 验证环境连通性

**完成后操作：**
- 追加 `step-01-init` 到 `stepsCompleted`
- 加载 `temp/steps/step-02-prepare.md`

---

### 步骤 2：准备验证数据
**检查点：user-confirm**
**依赖：step-01-init**

- 准备测试数据
- 配置测试账号
- 设置测试环境

**完成后操作：**
- 追加 `step-02-prepare` 到 `stepsCompleted`
- 等待用户确认后加载 `step-03-execute.md`

---

### 步骤 3：执行自动化测试
**检查点：auto-verify**
**依赖：step-02-prepare**

```bash
# 执行测试脚本
./run-tests.sh [参数]
```

**断言：**
- [ ] 所有自动化测试通过
- [ ] 无回归错误

**完成后操作：**
- 追加 `step-03-execute` 到 `stepsCompleted`
- 自动验证通过后加载 `step-04-manual.md`

---

### 步骤 4：手动验证
**检查点：user-confirm**
**依赖：step-03-execute**

**手动验证清单：**
- [ ] 功能 1 正常
- [ ] 功能 2 正常
- [ ] 边界情况已验证
- [ ] 错误处理已验证

**完成后操作：**
- 追加 `step-04-manual` 到 `stepsCompleted`
- 等待用户确认后加载 `step-05-report.md`

---

### 步骤 5：生成验证报告
**检查点：self-check**
**依赖：step-04-manual**

**报告格式：**
```markdown
## 验证报告

**验证日期：** [日期]
**验证环境：** [环境]
**验证结果：** PASS / FAIL

### 自动化测试结果
- 测试总数：X
- 通过：Y
- 失败：Z

### 手动验证结果
- [验证项列表]

### 问题清单（如有）
- [问题描述]
```

**完成后操作：**
- 追加 `step-05-report` 到 `stepsCompleted`
- 设置 `status: completed`
- 清除 `temp/` 目录

---

## 目录结构

```
[skill-name]/
├── SKILL.md                    # 主文件（含硬性门控）
├── temp/                       # 临时目录（任务完成清除）
│   ├── steps/                  # Step 文件
│   │   ├── step-01-init.md
│   │   ├── step-02-prepare.md
│   │   ├── step-03-execute.md
│   │   ├── step-04-manual.md
│   │   └── step-05-report.md
│   └── progress.yaml           # 进度追踪
├── references/                 # 持久化资源
│   ├── pipeline-progress-format.md
│   └── checklist-verification.md
├── scripts/                    # 测试脚本
│   └ run-tests.sh
└── outputs/                    # 输出目录
    └ verification-report.md
```

---

## 通过标准

所有以下条件必须满足：

- [ ] 所有自动化测试通过
- [ ] 所有手动验证通过
- [ ] 无高危问题
- [ ] 性能指标达标

---

## 问题报告格式

如发现问题，按以下格式报告：

```markdown
## 问题报告

**问题描述：** ...
**复现步骤：** ...
**预期结果：** ...
**实际结果：** ...
**截图/日志：** ...
```

---

*模板版本：2.0.0 | 采用 Pipeline 进度追踪架构*