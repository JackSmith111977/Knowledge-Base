---
template-type: deployment
name: 部署流程模板（Pipeline 模式）
description: 用于创建部署/发布流程 Skill 模板，采用 Pipeline 进度追踪
designPatterns: [pipeline, reviewer]
progressTracking: true
---

# [产品/服务] 部署流程

## 用途

当用户需要部署 [产品/服务] 时，自动使用此 Skill。

**适用场景：**
- 生产环境部署
- Staging 环境部署
- 回滚操作

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
currentStep: step-01-precheck
nextStep: step-02-deploy
checkpoint: self-check
status: in-progress
createdAt: [timestamp]
updatedAt: [timestamp]

metadata:
  environment: production
  version: v1.2.0
  rollbackPlan: rollback-v1.1.0.sh
```

**进度格式规范：** 详见 `references/pipeline-progress-format.md`

---

## 部署环境

### 环境列表

| 环境 | 用途 | 访问方式 |
|------|------|----------|
| Staging | 测试验证 | [URL] |
| Production | 生产环境 | [URL] |

---

## Pipeline 步骤流程

### 步骤 1：部署前检查
**检查点：self-check**
**依赖：无**

**检查清单：**
- [ ] 所有测试通过
- [ ] Code Review 完成
- [ ] 变更文档完整
- [ ] 回滚方案准备

```bash
# 执行检查脚本
./pre-deploy-check.sh
```

**完成后操作：**
- 追加 `step-01-precheck` 到 `stepsCompleted`
- 加载 `temp/steps/step-02-backup.md`

---

### 步骤 2：备份当前状态
**检查点：auto-verify**
**依赖：step-01-precheck**

```bash
# 备份脚本
./backup-current.sh
```

**验证：**
- [ ] 备份文件已创建
- [ ] 备份完整性验证通过

**完成后操作：**
- 追加 `step-02-backup` 到 `stepsCompleted`
- 自动验证通过后加载 `step-03-deploy.md`

---

### 步骤 3：执行部署
**检查点：user-confirm**
**依赖：step-02-backup**

```bash
# 部署命令
[部署命令]
```

**预期输出：**
```
[预期输出]
```

**完成后操作：**
- 追加 `step-03-deploy` 到 `stepsCompleted`
- 等待用户确认后加载 `step-04-verify.md`

---

### 步骤 4：验证部署
**检查点：auto-verify**
**依赖：step-03-deploy**

```bash
# 验证命令
./verify-deployment.sh
```

**验证清单：**
- [ ] 服务正常启动
- [ ] 健康检查通过
- [ ] 核心功能正常

**完成后操作：**
- 追加 `step-04-verify` 到 `stepsCompleted`
- 自动验证通过后加载 `step-05-monitor.md`

---

### 步骤 5：监控观察
**检查点：self-check**
**依赖：step-04-verify**

观察以下指标 [X] 分钟：

| 指标 | 正常范围 |
|------|----------|
| 错误率 | < 0.1% |
| 响应时间 | < 200ms |
| CPU 使用率 | < 70% |

**完成后操作：**
- 追加 `step-05-monitor` 到 `stepsCompleted`
- 加载 `step-06-complete.md`

---

### 步骤 6：部署完成
**检查点：user-confirm**
**依赖：step-05-monitor**

**完成操作：**
- 更新 `status: completed`
- 清除 `temp/` 目录
- 发送部署完成通知

**通知模板：**
```
【部署完成】
结束时间：[时间]
部署结果：成功
验证状态：通过
```

---

## 回滚流程

### 回滚条件

出现以下情况时执行回滚：

- 错误率 > [阈值]
- 核心功能不可用
- 数据异常

### 回滚步骤

```bash
# 回滚命令
./rollback.sh
```

**回滚后操作：**
- 设置 `status: halted`
- 记录回滚原因到 `progress.yaml.metadata.rollbackReason`

---

## 目录结构

```
[skill-name]/
├── SKILL.md                    # 主文件（含硬性门控）
├── temp/                       # 临时目录（任务完成清除）
│   ├── steps/                  # Step 文件
│   │   ├── step-01-precheck.md
│   │   ├── step-02-backup.md
│   │   ├── step-03-deploy.md
│   │   ├── step-04-verify.md
│   │   ├── step-05-monitor.md
│   │   └── step-06-complete.md
│   └── progress.yaml           # 进度追踪
├── references/                 # 持久化资源
│   ├── pipeline-progress-format.md
│   └ checklist-deployment.md
├── scripts/                    # 部署脚本
│   ├── pre-deploy-check.sh
│   ├── backup-current.sh
│   ├── verify-deployment.sh
│   └ rollback.sh
└── outputs/                    # 输出目录
    └ deployment-log.md
```

---

## 部署检查清单

```markdown
## 部署检查清单

### 部署前
- [ ] 代码审查完成
- [ ] 测试全部通过
- [ ] 变更文档完整

### 部署中
- [ ] 按步骤执行
- [ ] 记录关键输出

### 部署后
- [ ] 验证核心功能
- [ ] 监控指标正常
- [ ] 通知相关人员
```

---

*模板版本：2.0.0 | 采用 Pipeline 进度追踪架构*