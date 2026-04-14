# 探索模式流程模板（问答驱动 + 联网搜索）

**适用场景：** 深度研究、文档共建、知识验证
**预计耗时：** 灵活
**设计模式：** Pipeline + Inversion + Tool Wrapper

---

## 前置依赖：web-access 配置

**使用探索模式前，请确保：**

1. **web-access skill 已配置** - 用于联网搜索官方来源
2. **Chrome 远程调试已启用** - 在 Chrome 地址栏打开 `chrome://inspect/#remote-debugging`，勾选 "Allow remote debugging for this browser instance"
3. **依赖检查通过** - 运行 `node "$CLAUDE_SKILL_DIR/scripts/check-deps.mjs"` 检查

如未配置，系统将引导你完成设置。

**搜索优先级：**
| 优先级 | 来源 | 适用场景 |
|--------|------|---------|
| **official** | react.dev, MDN, 官方文档 | API 查询、官方特性 |
| **github** | github.com | Issues、源码、变更日志 |
| **blog** | 官方博客、知名开发者 | 最佳实践、教程 |
| **community** | Stack Overflow、Reddit | 社区经验、常见问题 |

---

## 流程概览

```
阶段 0：模式选择与章节加载
       ↓
阶段 1：展示章节内容（智能长度控制 + 知识点清单）
       ↓
阶段 2：用户提问 → 置信度评估 → 解答（±搜索）→ 信息来源标注
       ↓
阶段 3：文档补充决策（询问用户 → 确认 → 写入）
       ↓
阶段 4：继续提问或结束
```

**智能展示策略：** 详见 `references/smart-chapter-display.md`

---

## 阶段 0：模式选择与章节加载

### 步骤 0.1：探索模式启动

```markdown
## 🔍 探索模式启动

欢迎进入探索模式！这是一种全新的学习方式：

**探索模式特点：**
- 🎯 **你主导提问节奏** — 基于章节内容自由提问
- 🔍 **自动联网验证** — Agent 不确定时自动搜索官方来源
- 📝 **文档共建** — 有价值的内容可补充到文档（需你确认）

---

### 请选择学习方式：

**方式 A：指定章节**
回复「章节 [章节名]」开始学习特定章节
例如：「章节 React Hooks」

**方式 B：浏览大纲**
回复「大纲」查看完整章节结构

**方式 C：推荐主题**
回复「推荐」让 Agent 推荐可学习的主题

---

💡 **提示：**
- 随时回复「切换到标准模式」或「切换到快速模式」
- 回复「结束」生成学习报告
```

### 步骤 0.2：内部状态初始化

**AI 必须维护的内部状态：**

```javascript
state = {
  mode: "exploration",
  currentChapter: null,           // 当前章节名称
  currentChapterContent: null,    // 当前章节完整内容
  currentChapterKnowledgePoints: [], // 知识点清单
  questions: [],                  // 已提问题列表
  newKnowledge: [],               // 待补充的知识
  searchHistory: [],              // 搜索历史记录
  confirmedAdditions: [],         // 用户确认补充的内容
  modeSwitchContext: {            // 模式切换时保留的上下文
    learnedChapters: [],
    skippedChapters: [],
    chapterScores: {}
  }
}
```

### 步骤 0.3：章节加载

**加载逻辑：**

```javascript
async function loadChapter(chapterName) {
  // 1. 从知识库加载章节内容（完整）
  const fullContent = await loadFromKnowledgeBase(chapterName);
  
  // 2. 评估内容行数，选择展示策略
  const totalLines = fullContent.split('\n').length;
  let displayedContent;
  let displayStrategy;
  
  if (totalLines < 150) {
    displayedContent = fullContent;
    displayStrategy = 'full-chapter';
  } else if (totalLines < 400) {
    displayedContent = extractFirstSection(fullContent);
    displayStrategy = 'single-section';
  } else {
    displayedContent = truncateSection(extractFirstSection(fullContent), 0.65);
    displayStrategy = 'partial-section';
  }
  
  // 3. ⚠️ 关键修复：仅基于已展示内容提取知识点清单
  const knowledgePoints = extractKnowledgePoints(displayedContent);
  
  // 4. 提取事实来源（如有）
  const sources = extractSources(displayedContent);
  
  // 5. 更新状态
  state.currentChapter = chapterName;
  state.currentChapterContent = displayedContent;  // 存储已展示部分，非完整章节
  state.currentChapterKnowledgePoints = knowledgePoints;
  state.displayStrategy = displayStrategy;
  
  return { displayedContent, knowledgePoints, sources, displayStrategy, totalLines };
}
```

---

## 阶段 1：展示章节内容（展示策略已在 loadChapter 中执行）

**展示策略：** 详见 `references/smart-chapter-display.md`

**核心逻辑（已在 loadChapter 中完成）：**
```javascript
// loadChapter 内部已执行：
// 1. 评估总行数 → 选择展示策略
// 2. 截取对应内容 → displayedContent
// 3. 仅基于 displayedContent 提取知识点清单
// 4. state.displayStrategy 已设置
```

### 步骤 1.1：章节内容展示格式

```markdown
## 📖 章节内容：[章节名称]

**展示策略：** [整章展示 / 单小节展示 / 部分展示]

---

### 当前学习内容

[根据智能展示策略展示内容 - 必须是文档原文]

> **注意：** [根据策略显示相应提示]
> - 整章展示："本章共 X 行，完整展示"
> - 单小节展示："本章共 X 行，当前展示第一小节：[小节名]（Y 行）"
> - 部分展示："本章共 X 行，当前展示 [小节名] 的前 65%（Y 行）"

---

### 🎯 知识点清单

**⚠️ 注意：** 知识点清单仅基于**当前已展示**的内容！

| 编号 | 知识点 | 所属小节 | 事实来源 |
|------|--------|----------|----------|
| 1 | [知识点 1] | [小节名] | [官方文档链接] |

---

### 📋 本章/本小节剩余内容

[根据展示策略显示剩余内容预览]

| 部分 | 行数 | 状态 |
|------|------|------|
| [当前部分] | X 行 | ✅ 学习中 |
| [剩余部分] | X 行 | ⏳ 待学习 |

---

### ❓ 开始提问

请根据上述内容提出你的问题：

**提问示例：**
- 概念不理解 → 「什么是 XXX？」
- 需要深入 → 「XXX 的原理是什么？」
- 验证信息 → 「XXX 和 YYY 有什么区别？」
- 扩展知识 → 「XXX 在实际中如何应用？」
- 查官方确认 → 「请查官方文档确认 XXX」

💡 **提示：** Agent 不确定时会自动搜索官方来源
```

**AI 内部状态追踪：**

```javascript
state = {
  mode: "exploration",
  displayStrategy: 'single-section', // 'full-chapter' | 'single-section' | 'partial-section'
  currentChapter: {
    name: "章节名称",
    totalLines: 280,
    totalSections: 3
  },
  currentSection: {
    name: "小节名称",
    index: 0,
    displayedLines: 95,
    isPartial: false
  },
  currentChapterContent: null,    // 当前学习的完整内容（可能是节选）
  currentChapterKnowledgePoints: [], // 知识点清单（仅基于已展示内容）
  brainstormQuestions: [],        // Agent 生成的头脑风暴问题（2-3 个）
  questions: [],
  newKnowledge: [],
  searchHistory: [],
  confirmedAdditions: [],
  modeSwitchContext: {
    learnedChapters: [],
    skippedChapters: [],
    chapterScores: {}
  }
}
```

---

## 阶段 1.5：头脑风暴提问（新增）

**核心要求：** Agent 必须对展示内容进行分析，生成 2-3 个头脑风暴式提问。

### 步骤 1.5.1：展示头脑风暴问题

```markdown
## 🧠 Agent 分析：头脑风暴提问

基于刚才展示的内容，我为你准备了几个深度思考问题：

---

### 问题 1：[角度类型]
[具体问题描述]

### 问题 2：[角度类型]
[具体问题描述]

### 问题 3（如适用）：[角度类型]
[具体问题描述]

---

### 💡 启发式思考引导

除了上述问题，你也可以从以下角度思考：
1. **连接已有知识：** 这个概念与你之前学的 [相关概念] 有什么联系？
2. **反向思考：** 如果没有 [某个特性]，会出现什么问题？
3. **边界条件：** 在什么情况下这个方案会失效？
4. **实际应用：** 你现在的项目中哪里可以用到这个？

---

### ❓ 接下来你可以：
- 回复「**提问 1**」「**提问 2**」→ 针对某个问题深入讨论
- 回复「**都有疑问**」→ 逐一探讨上述问题
- 回复「**我的问题是...**」→ 提出你自己的问题
- 回复「**跳过思考**」→ 直接开始自由提问
```

### 步骤 1.5.2：头脑风暴问题生成角度

**Agent 生成问题时应优先选择以下角度：**

| 角度类型 | 适用场景 | 示例模板 |
|----------|----------|----------|
| **对比型** | 有相似概念时 | 「XXX 和 YYY 的核心区别是什么？为什么需要两种方案？」 |
| **演进型** | 有历史背景时 | 「在 XXX 出现之前，开发者是怎么解决这个问题的？」 |
| **权衡型** | 有取舍决策时 | 「这个方案的优势是 X，那它付出了什么代价？」 |
| **边界型** | 有条件限制时 | 「在什么情况下这个方案会失效？」 |
| **深层型** | 有原理机制时 | 「为什么官方要这样设计？背后的核心思想是什么？」 |
| **应用型** | 有实践场景时 | 「你现在的项目中哪里可以用到这个？」 |

**生成规则：**
- ✅ 必须基于**当前展示的内容**，不能超纲
- ✅ 优先选择**对比型**、**权衡型**、**深层型**
- ✅ 问题要能引发思考，不是简单的是非题
- ✅ 每个问题必须标注思考角度（如「对比型」、「权衡型」）
- ✅ 数量为 2-3 个，不要过多

**⚠️ 强制验证（新增）：**
- ✅ 生成的每个问题**必须能映射到 `currentChapterKnowledgePoints` 中至少一个知识点**
- ✅ 问题中涉及的**所有概念/术语**必须在已展示内容中出现过
- ✅ 如当前展示内容不足以生成 2 个有深度的头脑风暴问题，**减少到 1 个或跳过该环节**
- ✅ 验证不通过时，**必须重新生成**，不能强行输出

### 步骤 1.5.3：Agent 内部分析流程

```javascript
function generateBrainstormQuestions(content, knowledgePoints) {
  const questions = [];
  
  // 分析 1：是否有对比概念？
  if (hasContrastConcept(content)) {
    questions.push({
      type: '对比型',
      question: buildContrastQuestion(content)
    });
  }
  
  // 分析 2：是否有设计权衡？
  if (hasTradeoff(content)) {
    questions.push({
      type: '权衡型',
      question: buildTradeoffQuestion(content)
    });
  }
  
  // 分析 3：是否有深层原理？
  if (hasDeepPrinciple(content)) {
    questions.push({
      type: '深层型',
      question: buildPrincipleQuestion(content)
    });
  }
  
  // 分析 4：是否有边界条件？
  if (hasBoundary(content)) {
    questions.push({
      type: '边界型',
      question: buildBoundaryQuestion(content)
    });
  }
  
  // 返回前 2-3 个最有价值的问题
  return questions.slice(0, 3);
}

// ⚠️ 强制验证：每个问题必须映射到已展示的知识点（新增）
function validateBrainstormQuestions(questions, knowledgePoints) {
  const validQuestions = [];
  
  for (const q of questions) {
    // 提取问题中的关键概念
    const conceptsInQuestion = extractConcepts(q.question);
    
    // 验证：每个概念是否在已展示的知识点清单中
    const allConceptsCovered = conceptsInQuestion.every(concept =>
      knowledgePoints.some(kp =>
        kp.name.includes(concept) || concept.includes(kp.name)
      )
    );
    
    if (allConceptsCovered) {
      validQuestions.push(q);
    } else {
      // 知识点不匹配，丢弃该问题
      console.log(`[验证失败] 问题 "${q.question}" 涉及未展示的知识点，已跳过`);
    }
  }
  
  // 如果验证后不足 2 个有效问题
  if (validQuestions.length < 2 && validQuestions.length < questions.length) {
    // 内容不足以生成足够问题，跳过该环节
    return validQuestions.length > 0 ? validQuestions : null;
  }
  
  return validQuestions.slice(0, 3);
}

// 完整调用链（AI 必须按此顺序执行）
function executeBrainstormPhase(content, knowledgePoints) {
  const rawQuestions = generateBrainstormQuestions(content, knowledgePoints);
  const validQuestions = validateBrainstormQuestions(rawQuestions, knowledgePoints);
  
  if (!validQuestions || validQuestions.length === 0) {
    // 跳过头脑风暴环节，直接进入提问环节
    return null;
  }
  
  return validQuestions;
}
```

### 步骤 1.5.4：展示范围验证检查清单（新增）

**生成头脑风暴问题后，AI 必须执行以下内部检查：**

| 检查项 | 验证方法 | 不通过时动作 |
|--------|---------|-------------|
| **概念覆盖** | 问题中的每个概念是否在 `currentChapterKnowledgePoints` 中 | 丢弃该问题，重新生成 |
| **术语来源** | 问题中的专业术语是否在已展示内容中出现过 | 丢弃该问题，重新生成 |
| **示例关联** | 问题引用的代码/示例是否在已展示范围内 | 替换为已展示范围内的示例 |
| **章节引用** | 问题是否引用了未展示的小节/章节 | 丢弃该问题，重新生成 |
| **数量适配** | 当前展示内容是否足以支撑 2-3 个问题 | 减少到 1 个或跳过该环节 |

---

## 阶段 2：用户提问与解答

### 步骤 2.1：提问前回顾与头脑风暴问题回顾

**核心要求：** 用户每次提问前，必须重新展示相关原文，不准简略展示。

**如用户选择深入某个头脑风暴问题，直接进入解答流程。**

```markdown
## ❓ 基于当前内容的思考

在提问之前，让我们先回顾一下刚学的内容：

---

### 📖 内容回顾：[章节名称] > [小节名称]

[重新展示当前学习的小节内容 - 与阶段 1 展示的完全相同]

---

### 🧠 头脑风暴问题回顾

还记得刚才提出的思考问题吗？

**问题 1：[角度类型]**
[具体问题]

**问题 2：[角度类型]**
[具体问题]

---

### 💭 你想从哪个问题开始？
- 回复「**问题 1**」「**问题 2**」→ 深入探讨某个问题
- 回复「**都有疑问**」→ 逐一探讨上述问题
- 或者直接提出你自己的问题：
  - 概念不理解 → 「什么是 XXX？」
  - 需要深入 → 「XXX 的原理是什么？」
  - 对比差异 → 「XXX 和 YYY 有什么区别？」
  - 查官方确认 → 「请查官方文档确认 XXX」
```

### 步骤 2.2：问题接收与分类

```markdown
## ❓ 问题：[用户问题]

[进入解答流程]
```

**问题分类逻辑：**

| 问题类型 | 判断关键词 | 处理方式 |
|---------|-----------|---------|
| **概念定义** | 「什么是」「定义」「含义」 | 直接回答 |
| **原理深入** | 「原理」「为什么」「如何工作」 | 直接回答 + 示例 |
| **对比差异** | 「区别」「对比」「vs」 | 对比分析 |
| **事实验证** | 「确认」「验证」「是否正确」 | 检查置信度 → 可能搜索 |
| **扩展应用** | 「如何应用」「实际使用」「场景」 | 回答 + 可能需要搜索 |
| **最新版本** | 「新版本」「最新」「vX」 | 触发搜索（文档可能过时） |

### 步骤 2.2：置信度评估指南

**置信度评估标准：**

| 置信度 | 判断标准 | 行动 |
|--------|---------|------|
| **高 (≥0.8)** | 文档有明确答案，无需验证 | 直接回答，标注来源为文档 |
| **中 (0.5-0.7)** | 文档有部分信息，需要补充 | 回答 + 标注不确定，询问是否搜索 |
| **低 (<0.5)** | 文档无信息或可能过时 | 触发搜索 |

**置信度评估因子：**

```javascript
function assessConfidence(question, documentContent) {
  let confidence = 0.5;  // 基础置信度
  
  // 因子 1：文档中是否有明确答案
  if (documentContent.includes(question)) {
    confidence += 0.3;
  }
  
  // 因子 2：是否涉及版本信息（容易过时）
  if (question.includes('版本') || question.includes('v')) {
    confidence -= 0.3;
  }
  
  // 因子 3：用户是否要求验证
  if (question.includes('确认') || question.includes('验证')) {
    confidence -= 0.2;  // 降低，需要外部验证
  }
  
  // 因子 4：是否是 API/特性（可能变更）
  if (question.includes('API') || question.includes('参数')) {
    confidence -= 0.1;
  }
  
  return Math.max(0, Math.min(1, confidence));
}
```

### 步骤 2.3：搜索触发决策

**搜索触发条件：**

```javascript
function shouldTriggerSearch(question, confidence) {
  // 条件 1：置信度低于阈值
  if (confidence < 0.5) {
    return true;
  }
  
  // 条件 2：用户明确要求搜索
  if (question.includes('查官方') || question.includes('搜索')) {
    return true;
  }
  
  // 条件 3：涉及最新版本
  if (question.includes('最新') || question.includes('新版本') || question.includes('v')) {
    return true;
  }
  
  // 条件 4：文档明确标注可能过时
  if (documentContent?.lastUpdated && isOutdated(documentContent.lastUpdated)) {
    return true;
  }
  
  return false;
}
```

### 步骤 2.4：web-access 调用方式

**调用 web-access 技能：**

```javascript
async function invokeWebSearch(question, priority = "official") {
  // 构建搜索查询
  const searchQuery = buildSearchQuery(question, priority);
  
  // 调用 web-access 技能
  const result = await invokeSkill("web-access", {
    action: "search",
    query: searchQuery,
    sourceType: priority
  });
  
  // 提取结果和来源
  return {
    answer: result.summary,
    sources: result.urls,
    searchTime: new Date().toISOString()
  };
}

function buildSearchQuery(question, priority) {
  const baseQuery = question;
  
  switch (priority) {
    case "official":
      return `${baseQuery} site:react.dev OR site:developer.mozilla.org`;
    case "github":
      return `${baseQuery} site:github.com`;
    case "blog":
      return `${baseQuery} 官方博客 OR tech blog`;
    default:
      return baseQuery;
  }
}
```

**搜索优先级：**

| 优先级 | 来源 | 适用场景 |
|-------|------|---------|
| **official** | react.dev, MDN | API 查询、官方特性 |
| **github** | github.com | Issues、源码、变更日志 |
| **blog** | 官方博客、知名开发者 | 最佳实践、教程 |
| **community** | Stack Overflow、Reddit | 社区经验、常见问题 |

### 步骤 2.5：解答格式

**标准解答格式：**

```markdown
### 📝 解答

[详细解答内容]

**核心要点：**
- [要点 1]
- [要点 2]

**代码示例（如适用）：**
```javascript
// 示例代码
```

---

#### 🔍 信息来源

| 来源类型 | 链接 | 可信度 |
|---------|------|--------|
| 📘 官方文档 | [链接] | ✅ 已验证 |
| 📚 当前文档 | [章节链接] | ✅ 文档内容 |
| 💬 GitHub | [链接] | ✅ 官方仓库 |

---

#### 💡 是否补充到文档？

此回答包含有价值的内容，建议补充到文档：

**建议补充位置：** `[文件路径]` > `[章节名]` > `[小节名]`
**补充内容类型：** [新概念 / 原理解释 / 代码示例 / 注意事项]
**补充内容摘要：** [1-2 句说明]

请回复：
- 「**补充**」→ 将此内容写入文档
- 「**跳过**」→ 不补充，继续提问
- 「**查看**」→ 先查看要补充的内容详情
- 「**修改**」→ 修改补充内容后再写入
```

---

## 阶段 3：文档补充决策

### 步骤 3.1：询问用户确认

```markdown
### 📋 文档补充确认

**发现新知识：**

---

## [补充的知识标题]

[详细内容，包括：]
- 概念定义/原理解释
- 代码示例（如适用）
- 注意事项（如适用）

---

**建议补充位置：**
- 📁 文件：`[文件路径]`
- 📑 章节：`[章节名]` > `[小节名]`
- 🏷️ 补充类型：[新概念/原理解释/代码示例/注意事项]

**来源标注：**
- 📌 来源：[官方文档链接]
- 📅 补充日期：2026-04-02
- ✅ 验证状态：已验证

---

请确认：
- 回复「**补充**」→ 写入文档
- 回复「**修改**」→ 修改后再补充
- 回复「**跳过**」→ 不补充
```

### 步骤 3.2：写入文档逻辑

```javascript
async function writeToDocument(content, location) {
  // 1. 读取目标文档
  const doc = await readDocument(location.file);
  
  // 2. 找到目标章节
  const section = findSection(doc, location.section);
  
  if (!section) {
    // 章节不存在，创建新章节
    doc.sections.push({
      name: location.section,
      content: buildSupplementContent(content)
    });
  } else {
    // 章节存在，追加内容
    section.content += `\n\n---\n\n${buildSupplementContent(content)}`;
  }
  
  // 3. 更新文档元数据
  doc.lastUpdated = new Date().toISOString();
  doc.updateHistory = doc.updateHistory || [];
  doc.updateHistory.push({
    date: new Date().toISOString(),
    type: 'exploration_supplement',
    section: location.section,
    source: content.source
  });
  
  // 4. 写入文件
  await writeDocument(location.file, doc);
  
  return { 
    success: true, 
    path: location.file,
    section: location.section
  };
}

function buildSupplementContent(content) {
  return `## ${content.title}

${content.body}

> 📌 **来源**：${content.source}
> 📅 **补充日期**：${content.date}
> ✅ **验证状态**：已验证
`;
}
```

### 步骤 3.3：补充内容格式规范

```markdown
## [补充的知识标题]

[详细内容]

> 📌 **来源**：[官方文档链接]
> 📅 **补充日期**：2026-04-02
> ✅ **验证状态**：已验证
> 🏷️ **补充类型**：[新概念/原理解释/代码示例/注意事项]
```

---

## 阶段 4：继续提问或结束

### 步骤 4.1：后续操作选择

```markdown
### 接下来做什么？

- 回复「**继续**」→ 提出下一个问题
- 回复「**下一章**」→ 切换到下一章节
- 回复「**大纲**」→ 查看章节大纲
- 回复「**结束**」→ 生成学习报告
- 回复「**复习**」→ 回顾已提问题和解答
- 回复「**切换到标准模式**」→ 进入标准模式
- 回复「**切换到快速模式**」→ 进入快速模式
```

### 步骤 4.2：模式切换上下文保留

```javascript
function switchMode(newMode) {
  // 保留的上下文
  const preservedContext = {
    currentChapter: state.currentChapter,
    currentChapterKnowledgePoints: state.currentChapterKnowledgePoints,
    questions: state.questions,  // 已提问题
    learnedChapters: state.learnedChapters,
    chapterScores: state.chapterScores
  };
  
  // 重置模式特定状态
  if (newMode === "standard" || newMode === "quick") {
    state.searchHistory = [];  // 清除搜索历史
  }
  
  // 更新模式
  state.mode = newMode;
  state.modeSwitchContext = preservedContext;
  
  return preservedContext;
}
```

### 步骤 4.3：学习报告生成（探索模式）

```markdown
# 探索模式学习报告

**日期：** 2026-04-02
**章节：** [章节名称]
**模式：** 探索模式

## 问题汇总

| 编号 | 问题 | 解答摘要 | 是否搜索 | 来源 |
|------|------|---------|---------|------|
| 1 | [问题 1] | [摘要] | ✅ | [链接] |
| 2 | [问题 2] | [摘要] | ❌ | 文档内容 |

## 补充到文档的内容

| 编号 | 补充位置 | 内容摘要 | 状态 |
|------|---------|---------|------|
| 1 | [章节]>[小节] | [摘要] | ✅ 已写入 |
| 2 | [章节]>[小节] | [摘要] | ⏳ 待确认 |

## 学习时长

- 开始时间：HH:MM
- 结束时间：HH:MM
- 总提问数：X
- 触发搜索：X 次
- 补充文档：X 条

---

💡 **下一步建议：**
- 回复「继续」学习下一章
- 回复「切换到标准模式」进行深度测验
- 回复「结束」完成本次学习
```

---

## 附录 A：Sidecar 持久化

### A.1 文件路径

```
_bmad/memory/study-sidecar/exploration/
├── session-[date].md      # 会话记录
├── search-history.md      # 搜索历史
└── additions.md           # 文档补充记录
```

### A.2 session-[date].md 格式

```markdown
# 探索模式会话记录

**日期：** 2026-04-02
**章节：** [章节名称]
**模式：** 探索

## 问题列表
| 编号 | 问题 | 是否搜索 | 来源 |
|------|------|---------|------|
| 1 | [问题 1] | ✅ | [链接] |
| 2 | [问题 2] | ❌ | 文档内容 |

## 补充到文档的内容
| 编号 | 补充位置 | 状态 |
|------|---------|------|
| 1 | [章节]>[小节] | ✅ 已写入 |
| 2 | [章节]>[小节] | ⏳ 待确认 |
```

### A.3 search-history.md 格式

```markdown
# 探索模式搜索历史

| 日期 | 问题 | 搜索查询 | 来源 | 结果摘要 |
|------|------|---------|------|---------|
| 2026-04-02 | React 19 新特性 | React 19 features site:react.dev | react.dev | [摘要] |
```

### A.4 additions.md 格式

```markdown
# 探索模式文档补充记录

| 日期 | 补充位置 | 内容标题 | 状态 | 来源 |
|------|---------|---------|------|------|
| 2026-04-02 | React Hooks > useState | useState 源码解析 | ✅ 已写入 | [链接] |
```

---

## 附录：探索模式专项检查清单

| 检查项 | 标准 | 验证方式 |
|--------|------|---------|
| **置信度评估** | 每题必须评估置信度 | 检查内部状态记录 |
| **搜索触发** | 低置信度时必须触发搜索 | 检查 searchHistory |
| **来源标注** | 所有解答必须标注来源 | 检查解答格式 |
| **补充确认** | 写入文档前必须用户确认 | 检查 confirmedAdditions |
| **会话记录** | 必须写入 sidecar | 检查 session 文件 |
| **头脑风暴范围** | 每个问题必须映射到已展示的知识点 | 检查 brainstormQuestions vs currentChapterKnowledgePoints |
| **超纲拦截** | 问题涉及的术语/概念必须在已展示内容中 | 逐概念与知识点清单交叉验证 |

---

## 踩坑清单

| 陷阱 | 错误做法 | 正确做法 |
|------|---------|---------|
| **过度搜索** | 每题都搜索 | 置信度评估，高置信度不搜索 |
| **文档污染** | 不确认就写入 | 必须用户确认后才写入 |
| **来源不明** | 不标注来源 | 所有解答必须标注来源 |
| **上下文丢失** | 模式切换不清空 | 切换时保留必要上下文 |
| **置信度虚高** | 盲目相信文档 | 版本信息、API 变更要谨慎 |

---

*资源版本：3.0.0 | 最后更新：2026-04-14*
*更新：v2.0.0 → v3.0.0 修复知识点提取时机，将 extractKnowledgePoints 从 loadChapter 的完整内容提取移至智能展示策略执行后，仅基于已展示内容（displayedContent）提取知识点清单，从根本上杜绝超纲出题*
