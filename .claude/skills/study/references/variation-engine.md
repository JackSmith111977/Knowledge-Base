# 变式出题引擎（Variation Engine）

**版本：** 1.0.0
**最后更新：** 2026-04-16

**设计模式：** Generator + Pipeline

---

## 核心思想

把"题目"拆解为两个独立维度：

```
题目 = 知识点（What：考察什么） × 提问角度（How：怎么问）
```

同一个知识点可以有多种问法，复习时从"已考过的角度"和"未考过的角度"中按策略抽取，实现**旧题变式 + 新角度探索**。

---

## 1. 知识点 × 提问角度矩阵

### 1.1 6 种提问角度

| 角度 ID | 角度名称 | 考察目标 | 难度等级 | 适用阶段 | 示例模板 |
|---------|----------|----------|----------|----------|----------|
| `memory` | 记忆型 | 概念定义与基本特征 | ★☆☆ | 首次学习 | "什么是 [概念]？它的核心特征是什么？" |
| `application` | 应用型 | 实际使用与代码编写 | ★★☆ | 基础掌握后 | "如何用 [概念] 实现 [场景]？写出代码。" |
| `analysis` | 分析型 | 原理机制与底层设计 | ★★★ | 应用熟练后 | "[概念] 的内部是如何工作的？请解释其机制。" |
| `contrast` | 对比型 | 与相似概念的差异 | ★★★ | 学过相似概念后 | "[概念 A] 和 [概念 B] 的核心区别是什么？为什么需要两种方案？" |
| `scenario` | 场景型 | 结合真实场景的问题解决 | ★★★★ | 有项目经验后 | "在 [真实场景] 中，如果使用 [概念] 会遇到什么问题？如何解决？" |
| `trap` | 陷阱型 | 识别错误与反例分析 | ★★★★ | 全面掌握阶段 | "下面这段代码有什么问题？[给出含典型误区的代码] 请指出并修正。" |

### 1.2 角度与知识点的适配规则

不是所有角度都适合所有知识点。出题前需执行适配检查：

```javascript
function getAvailableAngles(knowledgePoint, chapterContext) {
  const angles = ['memory']; // 记忆型永远可用
  
  // 应用型：知识点涉及具体用法/API
  if (knowledgePoint.hasUsage || knowledgePoint.isAPI) {
    angles.push('application');
  }
  
  // 分析型：知识点有内部机制/原理
  if (knowledgePoint.hasMechanism || knowledgePoint.hasPrinciple) {
    angles.push('analysis');
  }
  
  // 对比型：章节中存在相似概念
  if (chapterContext.hasSimilarConcepts(knowledgePoint.name)) {
    angles.push('contrast');
  }
  
  // 场景型：知识点有实际应用价值
  if (knowledgePoint.hasRealWorldUsage) {
    angles.push('scenario');
  }
  
  // 陷阱型：该知识点存在常见误区
  if (knowledgePoint.commonMistakes.length > 0) {
    angles.push('trap');
  }
  
  return angles;
}
```

---

## 2. 出题策略

### 2.1 首次学习出题策略

| 题号 | 角度 | 目标 |
|------|------|------|
| 1 | `memory` | 检查概念记忆 |
| 2 | `memory` 或 `application` | 检查核心定义或基本使用 |
| 3 | `application` | 检查实际运用 |
| 4 | `analysis` 或 `contrast` | 检查深度理解 |
| 5 | `scenario` 或 `trap` | 检查综合掌握 |

### 2.2 复习出题策略（核心）

复习时采用 **40% 错题变式 + 30% 旧题复现 + 30% 新角度探索**：

```javascript
function generateReviewQuestions(knowledgePointMastery, errorBook, allAngles) {
  const questions = [];
  
  // === 40% 错题变式：从薄弱角度中选题 ===
  const weakAngles = knowledgePointMastery.weakAngles;
  if (weakAngles.length > 0) {
    const angle = pickRandom(weakAngles);
    questions.push({
      knowledgePoint: knowledgePointMastery.name,
      angle: angle,
      priority: 'high',
      reason: '错题变式 — 该角度上次得分较低'
    });
  }
  
  // === 30% 旧题复现：重现已考过但得分不高的题 ===
  const lowScoreAngles = Object.entries(knowledgePointMastery.scores)
    .filter(([_, score]) => score <= 3)
    .map(([angle, _]) => angle);
  if (lowScoreAngles.length > 0) {
    const angle = pickRandom(lowScoreAngles);
    questions.push({
      knowledgePoint: knowledgePointMastery.name,
      angle: angle,
      priority: 'medium',
      reason: '旧题复现 — 巩固薄弱点'
    });
  }
  
  // === 30% 新角度探索：从未考过的角度 ===
  const unaskedAngles = allAngles.filter(a => 
    !knowledgePointMastery.askedAngles.includes(a)
  );
  if (unaskedAngles.length > 0) {
    const angle = pickRandom(unaskedAngles);
    questions.push({
      knowledgePoint: knowledgePointMastery.name,
      angle: angle,
      priority: 'normal',
      reason: '新角度探索 — 拓展掌握深度'
    });
  }
  
  return questions;
}
```

### 2.3 出题比例控制

| 复习场景 | 错题变式 | 旧题复现 | 新角度探索 |
|----------|----------|----------|------------|
| **错题复习** | 50% | 30% | 20% |
| **正常复习** | 30% | 30% | 40% |
| **考前冲刺** | 40% | 40% | 20% |

---

## 3. 间隔重复算法（Spaced Repetition）

### 3.1 掌握等级体系

基于**综合掌握度**（各角度平均得分）和**连续答对次数**判定：

| 等级 ID | 等级名称 | 判定条件 | 复习间隔 |
|---------|----------|----------|----------|
| `new` | 新学 | 首次学习 | 1 天后 |
| `weak` | 薄弱 | 综合得分 ≤ 3 或连续答错 | 1 天后 |
| `fair` | 一般 | 综合得分 3-4 | 3 天后 |
| `familiar` | 熟悉 | 综合得分 ≥ 4 且连续 2 次答对 | 7 天后 |
| `mastered` | 掌握 | 所有已考角度得分 ≥ 4 | 14 天后 |
| `expert` | 精通 | 所有可用角度都考过且得分 ≥ 4 | 30 天后 |

### 3.2 复习间隔计算

```javascript
function calculateNextReview(masteryLevel, currentScore, consecutiveCorrect) {
  const intervals = {
    'new':      1,   // 1 天
    'weak':     1,   // 1 天
    'fair':     3,   // 3 天
    'familiar': 7,   // 7 天
    'mastered': 14,  // 14 天
    'expert':   30   // 30 天
  };
  
  let level = masteryLevel;
  
  // 根据本次得分动态调整
  if (currentScore >= 4 && consecutiveCorrect >= 2) {
    // 升级：跳到下一个等级
    level = promoteLevel(masteryLevel);
  } else if (currentScore <= 2) {
    // 降级：打回薄弱
    level = 'weak';
  } else if (currentScore <= 3) {
    // 保持或降一级
    level = demoteLevel(masteryLevel);
  }
  
  return {
    nextReview: addDays(today(), intervals[level]),
    newLevel: level,
    interval: intervals[level]
  };
}

function promoteLevel(current) {
  const progression = ['new', 'weak', 'fair', 'familiar', 'mastered', 'expert'];
  const idx = progression.indexOf(current);
  return progression[Math.min(idx + 1, progression.length - 1)];
}

function demoteLevel(current) {
  const progression = ['new', 'weak', 'fair', 'familiar', 'mastered', 'expert'];
  const idx = progression.indexOf(current);
  return progression[Math.max(idx - 1, 0)];
}
```

### 3.3 复习队列生成

每次启动复习模式时，生成**今日复习队列**：

```javascript
function buildTodayReviewQueue(knowledgePointMasteryMap) {
  const today = new Date();
  const due = [];
  const notDue = [];
  
  for (const [id, mastery] of Object.entries(knowledgePointMasteryMap)) {
    const nextReview = new Date(mastery.nextReview);
    if (nextReview <= today) {
      due.push({
        id,
        name: mastery.name,
        masteryLevel: mastery.masteryLevel,
        weakAngles: mastery.weakAngles,
        priority: mastery.masteryLevel === 'weak' ? 'high' : 'normal'
      });
    } else {
      notDue.push({
        id,
        name: mastery.name,
        nextReview: mastery.nextReview,
        daysUntilReview: daysBetween(nextReview, today)
      });
    }
  }
  
  // 按优先级排序：错题 > 薄弱 > 一般
  due.sort((a, b) => {
    const priorityOrder = { 'high': 0, 'normal': 1 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
  
  return { due, notDue };
}
```

---

## 4. 难度自适应机制

### 4.1 难度等级

| 难度 | 名称 | 触发条件 | 特征 |
|------|------|----------|------|
| ★☆☆ | 基础 | 默认起始难度 | 直接问答，提供选项提示 |
| ★★☆ | 进阶 | 连续 2 题得分 ≥ 4 | 减少提示，要求代码/详细解释 |
| ★★★ | 挑战 | 连续 3 题得分 ≥ 4 | 无提示，结合多知识点综合题 |
| ★★★★ | 专家 | 连续 5 题得分 ≥ 4 | 开放性问题，需要深度分析 |

### 4.2 难度升降规则

```javascript
function adjustDifficulty(currentDifficulty, recentScores) {
  // 最近 3 题的平均分
  const avgScore = average(recentScores.slice(-3));
  
  // 连续答对次数
  const streak = countConsecutiveHighScores(recentScores, 4);
  
  if (streak >= 2 && currentDifficulty < 4) {
    // 连续答对 → 升一级
    return currentDifficulty + 1;
  } else if (avgScore <= 2 && currentDifficulty > 1) {
    // 平均得分低 → 降一级
    return currentDifficulty - 1;
  } else if (avgScore <= 1) {
    // 得分极低 → 降到基础并提供详细讲解
    return 1;
  }
  
  return currentDifficulty;
}
```

### 4.3 不同难度的出题特征

```javascript
const difficultyProfiles = {
  1: { // 基础
    provideHints: true,
    hintCount: 2,
    requireCode: false,
    multiConcept: false,
    questionStyle: 'direct' // 直接问答
  },
  2: { // 进阶
    provideHints: true,
    hintCount: 1,
    requireCode: true,
    multiConcept: false,
    questionStyle: 'application' // 应用题
  },
  3: { // 挑战
    provideHints: false,
    hintCount: 0,
    requireCode: true,
    multiConcept: true, // 结合 2-3 个知识点
    questionStyle: 'analysis' // 分析题
  },
  4: { // 专家
    provideHints: false,
    hintCount: 0,
    requireCode: true,
    multiConcept: true, // 结合 3+ 个知识点
    questionStyle: 'open' // 开放式问题
  }
};
```

### 4.4 出题时应用难度特征

```javascript
function buildQuestion(knowledgePoint, angle, difficulty) {
  const profile = difficultyProfiles[difficulty];
  
  let question = '';
  
  // 根据角度生成基础问题
  switch (angle) {
    case 'memory':
      question = `请解释「${knowledgePoint.name}」的核心概念。`;
      break;
    case 'application':
      question = `请写一段代码，展示如何使用「${knowledgePoint.name}」实现 [具体场景]。`;
      break;
    case 'analysis':
      question = `「${knowledgePoint.name}」的内部机制是什么？请从原理层面解释。`;
      break;
    case 'contrast':
      question = `「${knowledgePoint.name}」与「${knowledgePoint.contrastWith}」的核心区别是什么？为什么官方要设计两种方案？`;
      break;
    case 'scenario':
      question = `在 [真实场景] 中，使用「${knowledgePoint.name}」可能会遇到什么问题？如何优化？`;
      break;
    case 'trap':
      question = `下面这段代码有什么潜在问题？请指出并修正：\n\n${knowledgePoint.badExample}`;
      break;
  }
  
  // 结合多知识点（高难度时）
  if (profile.multiConcept && knowledgePoint.relatedConcepts.length > 0) {
    const related = pickRandom(knowledgePoint.relatedConcepts, 2);
    question += `\n\n请结合「${related.join('」和「')}」一起分析。`;
  }
  
  // 添加提示（低难度时）
  if (profile.provideHints && profile.hintCount > 0) {
    question += `\n\n💡 提示：${knowledgePoint.hints.slice(0, profile.hintCount).join('；')}`;
  }
  
  return {
    question,
    requiresCode: profile.requireCode,
    style: profile.questionStyle,
    difficulty
  };
}
```

---

## 5. 知识掌握度数据结构

### 5.1 完整结构

```javascript
state = {
  // ... 原有字段保持不变
  
  // === 新增：变式引擎核心数据 ===
  knowledgePointMastery: {
    // Key: 知识点唯一 ID（如 "react-hooks-useState-001"）
    "react-hooks-useState-001": {
      name: "useState 基本用法",
      chapter: "React Hooks",
      section: "useState",
      
      // 掌握度评估
      masteryLevel: "fair",           // new/weak/fair/familiar/mastered/expert
      overallScore: 3.5,              // 综合得分（各角度平均）
      
      // 角度维度追踪
      angles: {
        'memory':    { asked: true,  score: 5, lastAsked: "2026-04-14", timesAsked: 2 },
        'application': { asked: true,  score: 3, lastAsked: "2026-04-14", timesAsked: 1 },
        'analysis':  { asked: false, score: 0, lastAsked: null, timesAsked: 0 },
        'contrast':  { asked: false, score: 0, lastAsked: null, timesAsked: 0 },
        'scenario':  { asked: false, score: 0, lastAsked: null, timesAsked: 0 },
        'trap':      { asked: false, score: 0, lastAsked: null, timesAsked: 0 }
      },
      
      // 间隔重复
      lastReviewed: "2026-04-14",
      nextReview: "2026-04-17",       // 下次复习日期
      reviewCount: 2,                  // 复习次数
      consecutiveCorrect: 0,           // 连续答对次数（得分≥4）
      
      // 难度自适应
      currentDifficulty: 2,            // 当前难度等级
      recentScores: [5, 3, 4],         // 最近 5 次得分
      
      // 可用角度（根据知识点特性动态计算）
      availableAngles: ['memory', 'application', 'analysis', 'contrast']
    }
  },
  
  // 当前会话难度（全局）
  sessionDifficulty: 1,
  
  // 连续答对/答错计数（用于难度调整）
  streakCounter: { type: 'correct', count: 0 }
}
```

### 5.2 答题后更新流程

```javascript
function updateAfterAnswer(question, score) {
  const kp = state.knowledgePointMastery[question.knowledgePointId];
  const angle = question.angle;
  
  // 1. 更新角度得分
  kp.angles[angle].score = score;
  kp.angles[angle].asked = true;
  kp.angles[angle].lastAsked = today();
  kp.angles[angle].timesAsked++;
  
  // 2. 更新全局记录
  kp.recentScores.push(score);
  if (kp.recentScores.length > 5) kp.recentScores.shift();
  
  // 3. 更新连续答对/答错计数
  if (score >= 4) {
    kp.consecutiveCorrect++;
    state.streakCounter = { type: 'correct', count: state.streakCounter.count + 1 };
  } else {
    kp.consecutiveCorrect = 0;
    state.streakCounter = { type: 'wrong', count: state.streakCounter.count + 1 };
  }
  
  // 4. 计算综合得分
  const askedAngles = Object.entries(kp.angles).filter(([_, v]) => v.asked);
  kp.overallScore = average(askedAngles.map(([_, v]) => v.score));
  
  // 5. 更新掌握等级和下次复习时间
  const review = calculateNextReview(
    kp.masteryLevel, 
    score, 
    kp.consecutiveCorrect
  );
  kp.masteryLevel = review.newLevel;
  kp.nextReview = review.nextReview;
  kp.reviewCount++;
  kp.lastReviewed = today();
  
  // 6. 调整全局难度
  state.sessionDifficulty = adjustDifficulty(
    state.sessionDifficulty, 
    kp.recentScores
  );
  
  // 7. 更新薄弱角度列表
  kp.weakAngles = Object.entries(kp.angles)
    .filter(([_, v]) => v.asked && v.score <= 3)
    .map(([angle, _]) => angle);
}
```

---

## 6. 出题格式（集成变式引擎）

### 6.1 标准出题格式

```markdown
## 逐题测验

**📊 知识点覆盖进度：** [已覆盖 X/总 Y 个知识点]
**🎯 当前难度：** [★☆☆ 基础 / ★★☆ 进阶 / ★★★ 挑战 / ★★★★ 专家]

**问题 1/5** [题型：记忆型]  
**考察知识点：** [知识点名称]  
**出题策略：** [错题变式 / 旧题复现 / 新角度探索]

[问题内容]

请回答：
```

### 6.2 AI 评分反馈格式（增强版）

```markdown
### 评分：[X]/5 [等级]

**✅ 正确部分：**
- [具体正确点]

**⚠️ 需要补充/纠正：**
- [遗漏或错误点]

**📈 掌握度更新：**
- 「[知识点名称]」该角度得分更新为 [X]/5
- 当前掌握等级：[薄弱 → 一般]（升级/降级/保持）
- 下次复习间隔：[X] 天后

**📌 下一步：**
[追问/进入下一题/详细讲解]
```

---

## 7. 复习模式集成

### 7.1 复习启动流程

```markdown
## 📚 智能复习模式

**今日复习队列：**
| 知识点 | 掌握等级 | 薄弱角度 | 距上次复习 |
|--------|----------|----------|------------|
| [知识点 1] | 薄弱 | 分析型、场景型 | 3 天 |
| [知识点 2] | 一般 | 对比型 | 5 天 |

**复习策略：**
- 优先攻克薄弱角度
- 每个知识点 2-3 题
- 难度自动适应你的表现

准备好后回复「开始」。
```

### 7.2 复习完成报告

```markdown
## ✅ 本次复习完成

### 📊 复习结果

| 指标 | 数值 |
|------|------|
| 复习知识点数 | [N] 个 |
| 总出题数 | [N] 题 |
| 平均得分 | [X.X]/5 |
| 升级知识点 | [N] 个 |
| 降级知识点 | [N] 个 |

### 📈 掌握度变化

| 知识点 | 原等级 → 新等级 | 薄弱角度变化 |
|--------|-----------------|--------------|
| [知识点 1] | 薄弱 → 一般 | 分析型 ✅ |
| [知识点 2] | 一般 → 熟悉 | — |

### 📅 下次复习计划

| 日期 | 预计复习内容 |
|------|-------------|
| [日期 1] | [知识点列表] |
| [日期 2] | [知识点列表] |
```

---

## 8. 踩坑清单

| 陷阱 | 错误做法 | 正确做法 |
|------|---------|---------|
| **角度不适配** | 对所有知识点强制使用 6 种角度 | 根据知识点特性动态计算可用角度 |
| **难度跳跃过大** | 答对一题直接跳到最高难度 | 逐级升降，每次只升/降一级 |
| **间隔不合理** | 固定间隔不考虑掌握度 | 根据掌握等级动态调整间隔 |
| **只问不更新** | 出题后不更新掌握度 | 每题必答后更新 mastery 数据 |
| **旧数据膨胀** | 历史数据无限累积 | recentScores 只保留最近 5 次 |
| **复习无重点** | 随机抽题不区分优先级 | 薄弱角度优先，错题变式优先 |

---

*资源版本：1.0.0 | 创建日期：2026-04-16*
