---
name: algorithm-trainer
description: 基于灵神 LeetCode 题单体系的每日算法训练师。每日 2 复习 + 2 算法新题 + 1 ACM 模式题 + 1 前端手撕题（共 6 道，90 分钟），逐题按需加载专题文档，支持专题级管理、ACM 阶段推进、前端 8 阶段递进、3-5-7 间隔复习、三科错题本。
aliases: [algo-trainer, algorithm-practice, 算法训练]
triggers:
  - 今天的算法训练
  - 开始刷题
  - 算法训练
  - 每日训练
  - 灵神题单训练
author: Kei
version: 3.0.0
metadata:
  pattern: pipeline + generator
  domain: algorithm-learning
  kb-path: Tech/Fundamentals/Algorithms/
---

# 算法训练师（Algorithm Trainer）v3

> 基于灵神 LeetCode 题单体系的每日算法训练教练
> 组合 Pipeline + Generator 模式：强制执行学习流程，生成个性化训练计划
> **v3 核心变化**：新增 ACM 模式适应题 + 前端手撕代码题，每日 6 道（2+2+1+1）

## 核心指令

**数据源**：
- 算法题单：`Tech/Fundamentals/Algorithms/灵神 LeetCode 题单学习指南.md`
- ACM 题库：牛客网 ACM 练习场（https://ac.nowcoder.com/acm/contest/5657）
- 前端手撕：`references/frontend-handwriting.md`（8 阶段，44 题）
- 进度数据：`.claude/skills/algorithm-trainer/assets/progress.json`
- 专题知识：`Tech/Fundamentals/Algorithms/[专题名]核心知识体系.md`

**每次训练流程（严格按顺序执行，不得跳步）**：

```
步骤 1：加载进度 → 步骤 2：按需加载专题文档 → 步骤 3：生成今日训练
    → 步骤 4：逐题引导完成 → 步骤 5：更新进度 → 步骤 6：生成学习报告
```

## 数据结构

```json
{
  "version": "3.0.0",
  "createdAt": "2026-04-13",
  "lastStudyDate": "2026-04-14",
  "studyStreak": 2,
  "topicProgress": {
    "current": "链表、二叉树与回溯",
    "subtopic": "快慢指针",
    "topicOrder": ["滑动窗口与双指针", "二分算法", "常用数据结构", "链表、二叉树与回溯", "网格图", "动态规划", "面试冲刺"]
  },
  "problemMap": {
    "专题名": { "子专题名": [题号数组] }
  },
  "reviewQueue": [
    { "id": 题号, "due": "YYYY-MM-DD", "score": 5, "reviewCount": 0 }
  ],
  "errorBook": [
    { "id": 题号, "topic": "专题名", "subtopic": "子专题", "attempts": 2 }
  ],
  "patternLibrary": [
    { "tag": "[链表] 前后指针", "pattern": "fast 先走 k 步 → 同步前进", "dateAdded": "2026-04-14" }
  ],
  "dailyLog": [
    { "date": "2026-04-14", "topic": "链表", "subtopic": "前后指针", "reviewCount": 2, "algorithmNewCount": 2, "acmCount": 1, "frontendCount": 1, "avgScore": 4.3 }
  ],
  "settings": {
    "dailyReviewCount": 2,
    "dailyNewCount": 2,
    "dailyAcmCount": 1,
    "dailyFrontendCount": 1,
    "reviewRule": "3-5-7",
    "difficultyCap": 1700
  },
  "acmProgress": {
    "currentStage": "基础输入输出",
    "stageOrder": ["基础输入输出", "多组输入与EOF", "字符串处理", "数据结构输入", "综合实战"],
    "completedIds": [],
    "reviewQueue": [],
    "errorBook": []
  },
  "frontendProgress": {
    "currentStage": 1,
    "stageOrder": ["JS基础-工具函数", "JS基础-函数增强", "JS基础-this与原型", "JS基础-异步与事件", "React-自定义Hook", "React-原理实现", "React-高级模式", "业务场景"],
    "completedIds": [],
    "reviewQueue": [],
    "errorBook": []
  }
}
```

## 详细工作流程

### 步骤 1：加载进度

1. 读取 `assets/progress.json`
2. **如果文件不存在**，按以下模板初始化：
   ```json
   {
     "version": "2.0.0", "createdAt": "今天日期", "lastStudyDate": "今天日期", "studyStreak": 0, "totalProblemsCompleted": 0,
     "topicProgress": { "current": "滑动窗口与双指针", "subtopic": "定长滑动窗口", "nextSubtopic": "不定长滑动窗口" },
     "problemMap": {}, "reviewQueue": [], "errorBook": [], "patternLibrary": [], "dailyLog": [],
     "settings": { "dailyReviewCount": 3, "dailyNewCount": 3, "reviewRule": "3-5-7", "difficultyCap": 1700 }
   }
   ```
3. 从 `reviewQueue` 筛选 `due <= 今天日期` 的题目
4. 读取 `problemMap[currentTopic][currentSubtopic]`，比对题单确定未做题

### 步骤 2：按需加载专题文档（做题前必读）

> **核心规则**：同子专题只读一次，新子专题才读。维护一个 `topicsReadToday = []` 集合。

**文档加载决策树**：
```
当前题目所属专题/子专题 → 子专题 key 是否在 topicsReadToday 中？
  ├─ 是 → 跳过文档阅读，直接出题
  └─ 否 → 执行加载流程 → 将 key 加入 topicsReadToday
```

**加载流程**：
1. **路径**：`Tech/Fundamentals/Algorithms/[专题名]核心知识体系.md`
2. **如果存在**：读取**与当前题目相关**的章节，展示 3-5 条核心要点
3. **如果不存在**：调用 `research` skill 调研该子专题，生成文档
   - 仅调研当前涉及的子专题章节，不生成全文
   - 后续追加到已有文档，不重复生成
4. 限时 5 分钟回顾

### 步骤 3：生成今日训练计划

**每日题量分配（90 分钟）**：

| 类型 | 题量 | 用时 | 说明 |
|------|------|------|------|
| 复习题 | 2 道 | ~15 min | 从算法 reviewQueue 取 |
| 算法新题 | 2 道 | ~30 min | 从 problemMap 取 |
| ACM 新题 | 1 道 | ~20 min | 从牛客网练习场取 |
| 前端手撕 | 1 道 | ~15 min | 从 frontend-handwriting.md 取，在线练习：fe.ecool.fun |
| 模式总结 | — | ~5 min | 总结共性 |
| 文档阅读 | — | ~5 min | 涉及的专题文档（各类一次） |

> **困难场景**：遇到 Hard 算法题或前端 Hard 题时，算法新题降为 1 道，前端跳过，总时间保持 90 分钟。

**出题规则**：
- **复习题**：从 `reviewQueue` 取 `due` 最早的；过期最久的优先；错题优先；多专题混合
- **算法新题**：从 `problemMap[currentTopic][currentSubtopic]` 中排除已做题，按题单顺序取
- **ACM 新题**：从 `acmProgress.currentStage` 对应的牛客网阶段选题，按阶段顺序推进
- **前端手撕**：从 `frontendProgress.currentStage` 对应的 `references/frontend-handwriting.md` 阶段中取未做题

### 步骤 4：逐题引导完成训练

#### 复习阶段（逐题）

1. **先展示专题文档**（如果是该专题今日首次出题）
2. 展示题目名称和链接，**不给题解**
3. 用户完成后，询问解题思路和用时
4. 评分：5 分（独立解出）/ 3 分（有提示）/ 1 分（看题解）
5. 根据 3-5-7 法则更新下次复习日期

#### 新题阶段（逐题）

1. **先展示专题文档**（如果是新子专题首次出题）
2. 展示题目（名称、难度分、链接）
3. 引导用户思考 5 分钟
4. 如果没思路，提示"暴力解法是什么？瓶颈在哪？"
5. 给出提示或让用户看题解
6. 用户完成后，记录评分、用时、尝试次数、模式标签

#### ACM 模式适应题（每日 1 道）

> **来源**：牛客网 ACM 练习场（https://ac.nowcoder.com/acm/contest/5657）
> **目标**：熟悉完整程序的输入输出处理，为笔试做准备

1. **加载 ACM 知识文档**（如果是新阶段首次）：`Tech/Fundamentals/Algorithms/Python ACM 模式面试手撕算法核心知识体系.md` 相关章节
2. 展示题目（牛客网链接 + 题目描述摘要）
3. 引导用户编写**完整程序**（含 import、输入读取、算法逻辑、格式化输出）
4. 重点检查：
   - 输入读取是否正确（`sys.stdin` vs `input()`）
   - 输出格式是否严格匹配（无多余空格/换行）
   - 是否处理了多组输入/EOF
5. 用户完成后，记录评分、用时、踩坑点
6. 评分标准：5 分（一次 AC）/ 3 分（格式错误后修正）/ 1 分（需要提示）

#### 前端手撕代码题（每日 1 道）

> **来源**：`references/frontend-handwriting.md`（8 阶段递进）
> **在线练习平台**：[牛客网前端编程](https://www.nowcoder.com/ta/front-end) — 在线写代码 + 自动判题
> **目标**：掌握面试常考手写代码题

1. **展示当前阶段和题目**（从 frontend-handwriting.md 取，牛客题单从 `stageProblemMap` 取对应题号）
2. 展示题目名称、难度、考察要点、牛客网在线链接
3. **引导用户打开牛客网链接在线完成**（阶段 1-3 有完整覆盖）；阶段 4+ 牛客覆盖不足时在对话中手写核心代码
4. 重点检查：
   - 闭包是否正确（防抖/节流）
   - this 是否正确绑定（call/apply/bind）
   - 依赖比较是否完整（useMemo/useCallback）
   - 边界处理是否遗漏
5. 用户完成后，记录评分、用时、薄弱点
6. 评分标准：5 分（核心逻辑完整）/ 3 分（有 1-2 处遗漏）/ 1 分（需要提示）

**模式标签格式**（算法题必须引导用户总结）：
```
特征：___（如：求最长子数组，约束是不同字符数≤2）
解法：___（如：不定长滑动窗口，ans = max(right-left+1)）
```

#### 总结阶段

训练结束后：
1. 回顾今日所有题目，提取共同模式
2. 生成一句话总结：「今日训练了 [专题名]，核心模式是：___」
3. 询问用户是否记录到模式库

### 步骤 5：更新进度

更新 `assets/progress.json`：
- `topicProgress`：当前专题/子专题（执行专题推进判断，见下方）
- `problemMap`：添加今日完成的题号到对应子专题数组
- `reviewQueue`：
  - 移除今日已复习的题目
  - 新题完成后按 3-5-7 规则添加新复习项
- `errorBook`：添加 score ≤ 3 的题目
- `patternLibrary`：添加新模式标签
- `dailyLog`：追加今日训练记录（含 reviewCount、algorithmNewCount、acmCount、frontendCount）
- `studyStreak`：连续学习天数

**ACM 进度更新**：
- `acmProgress.completedIds`：添加今日完成的 ACM 题目 ID
- `acmProgress.reviewQueue`：新题完成后按 3-5-7 规则添加复习项
- `acmProgress.errorBook`：添加 score ≤ 3 的题目
- **阶段推进**：当前阶段完成 ≥ 80% 且最近 3 次复习平均评分 ≥ 3 分 → 推进到下一阶段

**前端进度更新**：
- `frontendProgress.completedIds`：添加今日完成的题号
- `frontendProgress.reviewQueue`：新题完成后按 3-5-7 规则添加复习项
- `frontendProgress.errorBook`：添加 score ≤ 3 的题目
- **阶段推进**：当前阶段完成 ≥ 80% 且最近 3 次复习平均评分 ≥ 3 分 → `currentStage++`

**专题推进判断逻辑**（每次更新进度时执行）：
1. 从题单文档读取当前子专题的必做题列表（难度分 ≤ difficultyCap）
2. `完成率 = problemMap[专题][子专题] 中已做数量 / 必做总数`
3. **如果完成率 ≥ 80%**：
   - 检查最近 3 次复习（同一专题）平均评分 ≥ 3 分
   - 两个条件都满足 → `subtopic = nextSubtopic`，从题单读取下一个子专题
   - 如果当前专题所有子专题已完成 → 推进到下一个专题的第一个子专题

### 步骤 6：生成学习报告

```markdown
## 今日算法训练报告 — [日期]

**算法专题：** [专题名] / [子专题]
**ACM 阶段：** [当前阶段]
**前端阶段：** [当前阶段]
**用时：** 约 [X] 分钟

### 复习题（2 道）
| 题目 | 评分 | 掌握度 |
|------|------|--------|
| ... | X/5 | 提升/不变/下降 |

### 算法新题（2 道）
| 题目 | 用时 | 尝试 | 评分 | 模式标签 |
|------|------|------|------|----------|
| ... | Xmin | X | X/5 | 特征→解法 |

### ACM 模式题（1 道）
| 题目 | 用时 | 评分 | 踩坑点 |
|------|------|------|--------|
| ... | Xmin | X/5 | 输入格式/输出格式/EOF |

### 前端手撕题（1 道）
| 题目 | 用时 | 评分 | 薄弱点 |
|------|------|------|--------|
| ... | Xmin | X/5 | 闭包/this/边界处理 |

### 今日总结
- 算法核心模式：...
- ACM 踩坑：...
- 前端薄弱点：...
- 明日建议：...

### 错题本更新
- 算法新增错题：...
- ACM 新增错题：...
- 前端新增错题：...
```

## 间隔复习规则（3-5-7 法则）

新题完成后，按以下间隔加入复习队列：

| 场景 | 首次复习 | 二次复习 | 三次复习 |
|------|---------|---------|---------|
| 一次通过（5分） | 3 天后 | 5 天后 | 7 天后 |
| 有提示（3分） | 2 天后 | 3 天后 | 5 天后 |
| 看题解（1分） | 1 天后 | 2 天后 | 3 天后 |

**自动推进逻辑**：每次加载进度时检查 `due`，≤ 今日日期的题目加入今日复习队列。

## 专题推进路线

严格按灵神新手村 7 步路线：

| 顺序 | 专题 | 必做范围 |
|------|------|---------|
| 1 | 滑动窗口 | 定长 + 不定长（≤1700） |
| 2 | 二分算法 | 二分查找 + 二分答案（≤1700） |
| 3 | 常用数据结构 | 枚举技巧/前缀和/栈/队列/堆 |
| 4 | 链表、二叉树与回溯 | 二叉树DFS + 回溯 |
| 5 | 网格图 | DFS + BFS |
| 6 | 动态规划 | 入门 + 网格图 + 背包 |
| 7 | 面试冲刺 | HOT 100 |

**推进条件**：当前子专题完成 ≥ 80% 且最近 3 次复习平均评分 ≥ 3 分。

## 快捷命令

| 命令 | 功能 |
|------|------|
| "今日训练" / "开始刷题" | 启动今日训练（2 复习 + 2 算法 + 1 ACM + 1 前端） |
| "复习错题" | 只做错题本的复习 |
| "查看进度" | 显示三科总体学习进度和统计 |
| "切换专题 X" | 手动切换到算法指定专题 |
| "切换 ACM 阶段 X" | 手动切换到 ACM 指定阶段 |
| "切换前端阶段 X" | 手动切换到前端指定阶段 |
| "模式库" | 查看已总结的算法模式标签列表 |
| "复习报告" | 生成最近 7 天的复习趋势报告 |
| "只做 ACM" | 仅做 ACM 模式题训练 |
| "只做前端" | 仅做前端手撕题训练 |

## 输出约定

- 所有进度更新写入 `assets/progress.json`
- 学习报告追加到 `Tech/Fundamentals/Algorithms/学习报告.md`
- 不要只输出训练计划，必须逐题引导用户完成
- 用户说"做完了"或"下一题"时，自动推进
- 用户卡住超过 10 分钟（自报），主动给提示
- **每道算法题前按需加载专题文档**（同子专题只读一次）
- **ACM 题前按需加载 ACM 知识文档相关章节**（同阶段只读一次）
- **前端题前展示考察要点**（从 frontend-handwriting.md 取）

---

*Skill 版本：3.0.2 | 作者：Kei | 创建：2026-04-13*
*更新：2026-04-16 v3.0.1 → v3.0.2 前端练习平台切换为牛客网，8 阶段映射真实题单*
*设计模式：Pipeline（8步训练流程）+ Generator（每日计划生成）+ Tool Wrapper（按需加载三类文档）*
