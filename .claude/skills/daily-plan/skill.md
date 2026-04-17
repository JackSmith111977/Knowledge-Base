---
name: daily-plan
description: 每日复习与任务计划管理。读取知识库进度和 algorithm-trainer 算法训练进度，询问用户今日重点后生成结构化的 Daily/YYYY-MM-DD.md 计划，自动结转未完成任务，更新任务索引。
aliases: [daily-task]
triggers: [每日计划, 每日任务, 今天复习, 今天任务, 制定计划]
author: Kei
version: 1.1.0
metadata:
  patterns: [inversion, generator]
  interaction: multi-turn
  stages: "3"
---

# 每日计划管理器

## 核心指令

组合 Inversion + Generator 模式：
1. **Inversion**：先扫描进度，再询问用户今日重点
2. **Generator**：根据收集到的信息生成标准化每日计划

**在所有采访阶段完成前，禁止生成计划。**

---

## 工作流程

### 阶段 1：扫描上下文（自动执行）

读取以下文件，汇总当前状态：

1. **根目录进度**：`progress.txt`（知识库总进度）
2. **算法训练进度**：
   - `Tech/Fundamentals/Algorithms/progress.txt`（算法文档调研进度）
   - `.claude/skills/algorithm-trainer/assets/progress.json`（algorithm-trainer 每日训练进度）
3. **任务索引**：`Daily/PROGRESS.md`（如存在，提取最近 3 天的未完成任务）
4. **知识库索引**：`KB-INDEX.md`（获取已完成的文档清单）

**算法任务数据源（必须读取，禁止编造）：**
- 从 `progress.json` 提取：`topicProgress.current` / `subtopic`、`reviewQueue`（due <= 今天的题目）、`problemMap`（当前子专题未做题）、`acmProgress.currentStage`、`frontendProgress.currentStage`、`errorBook`（错题）、`dailyLog`（最近训练记录）
- 算法题目必须来自 `progress.json` 中的真实数据，**不得自行编造题号或题目名称**
- 如需了解题目详情，读取 `Tech/Fundamentals/Algorithms/灵神 LeetCode 题单学习指南.md` 对应专题章节

**输出扫描摘要**：展示已完成的文档、算法训练进度（专题/子专题/复习队列/错题）、最近的未完成任务。

### 阶段 2：用户采访（Inversion 门控）

询问用户以下问题：

1. **今日重点**：今天想重点复习/完成什么？（可多选或自由描述）
2. **时间分配**：今天可用学习时间大概多久？
3. **结转确认**：对阶段 1 提取的未完成任务，保留/删除/延后？
4. **特殊事项**：是否有面试/会议等特殊时间节点需要安排？

### 阶段 3：生成计划（Generator）

加载模板 → 填充变量 → 写入文件 → 更新索引。

详见 `references/plan-template.md` 获取输出结构，`references/carryover-rules.md` 获取任务结转规则。

**步骤：**
1. 根据用户回答 + 扫描结果，按模板生成 `Daily/YYYY-MM-DD.md`
2. 更新 `Daily/PROGRESS.md`：追加今日索引条目
3. 将 `Daily/PROGRESS.md` 注册到 `KB-INDEX.md`（如尚未注册）
4. 展示生成的计划，等待用户确认

---

## 算法任务生成规则

当计划中包含算法训练内容时，必须遵循以下规则：

### 1. 数据源优先级

| 优先级 | 数据源 | 用途 |
|--------|--------|------|
| P0 | `progress.json` 的 `reviewQueue` | 到期复习题（due <= 今天） |
| P1 | `progress.json` 的 `errorBook` | 错题复习 |
| P2 | `progress.json` 的 `problemMap[currentTopic][currentSubtopic]` | 当前子专题未做题 |
| P3 | `progress.json` 的 `acmProgress` | ACM 模式题进度 |
| P4 | `progress.json` 的 `frontendProgress` | 前端手撕题进度 |

### 2. 题目展示格式

在生成的计划中，算法任务必须展示为：

```markdown
### 算法训练（algorithm-trainer）

**当前专题：** {currentTopic} / {subtopic}
**ACM 阶段：** {acmStage}
**前端阶段：** Stage {frontendStage}
**复习队列（到期）：** {reviewQueue 中 due <= 今天的题目}
**建议新题：** {problemMap 中当前子专题的前 2 道未做题}
```

### 3. 禁止行为

- **禁止编造题号**：所有题号必须来自 `progress.json` 或题单文档
- **禁止编造题目名称**：名称必须来自题单文档或 progress.json
- **禁止忽略复习队列**：如果 reviewQueue 中有到期题目，必须在计划中体现
- **禁止跨专题出题**：新题必须来自当前 subtopic，不得跳到其他专题

---

## DON'T

- 不要在信息不全时猜测用户意图
- 不要跳过阶段 2 的采访直接生成
- 不要将已完成的任务列入结转
- 不要覆盖已存在的当日计划文件（提示用户确认是否覆盖）
- 不要在 `PROGRESS.md` 中写入完整计划内容，只保留索引摘要
- **不要在算法任务中编造任何题目（题号/名称/专题）**

---

## 输出位置

- `Daily/YYYY-MM-DD.md`：当日详细计划
- `Daily/PROGRESS.md`：任务管理索引（追加条目）
- `KB-INDEX.md`：注册 PROGRESS.md（首次运行时）
