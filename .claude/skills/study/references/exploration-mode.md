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
阶段 1：展示完整章节内容（大纲 + 详情 + 知识点清单）
       ↓
阶段 2：用户提问 → 置信度评估 → 解答（±搜索）→ 信息来源标注
       ↓
阶段 3：文档补充决策（询问用户 → 确认 → 写入）
       ↓
阶段 4：继续提问或结束
```

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
  // 1. 从知识库加载章节内容
  const content = await loadFromKnowledgeBase(chapterName);
  
  // 2. 提取知识点清单
  const knowledgePoints = extractKnowledgePoints(content);
  
  // 3. 提取事实来源（如有）
  const sources = extractSources(content);
  
  // 4. 更新状态
  state.currentChapter = chapterName;
  state.currentChapterContent = content;
  state.currentChapterKnowledgePoints = knowledgePoints;
  
  return { content, knowledgePoints, sources };
}
```

---

## 阶段 1：展示完整章节内容

### 步骤 1.1：章节内容展示格式

```markdown
## 📖 章节内容：[章节名称]

### 章节大纲

[展示章节的完整大纲结构，包括所有小节]

---

### 完整内容

[读取并展示完整内容，必须包括：]
- ✅ 所有概念定义
- ✅ 所有工作原理说明
- ✅ 所有代码示例
- ✅ 所有注意事项/最佳实践
- ✅ 所有常见误区

---

### 🎯 知识点清单

| 编号 | 知识点 | 所属小节 | 事实来源 |
|------|--------|----------|----------|
| 1 | [知识点 1] | [小节名] | [官方文档链接] |
| 2 | [知识点 2] | [小节名] | [官方文档链接] |

> ⚠️ **注意：** 本章共有 **X** 个知识点，后续问题将基于这些知识点展开

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

### 步骤 1.2：知识点提取逻辑

```javascript
function extractKnowledgePoints(content) {
  return content.sections.map((section, index) => ({
    id: index + 1,
    name: section.title || section.heading,
    section: section.name,
    source: section.references?.[0] || null,  // 记录事实来源
    covered: false,
    confidence: 1.0  // 文档内知识点，初始置信度高
  }));
}
```

---

## 阶段 2：用户提问与解答

### 步骤 2.1：问题接收与分类

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

*资源版本：1.0.0 | 最后更新：2026-04-02*
