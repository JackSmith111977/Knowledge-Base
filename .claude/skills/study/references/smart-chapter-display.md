# 智能章节展示机制

**版本：** 1.0.0  
**最后更新：** 2026-04-05

---

## 目标

根据章节内容长度动态调整展示范围，确保每次学习的内容量适中（适配 Claude Code 命令行窗口），同时保证展示的内容都是文档中真实存在的原文。

---

## 核心原则

| 原则 | 说明 |
|------|------|
| **不准简略展示** | 必须展示文档中实际存在的内容，不允许 AI 自行概括或摘要 |
| **智能长度控制** | 根据内容长度自动选择展示整章/小节/小节部分 |
| **来源可追溯** | 展示的每段内容都必须标注来源位置（章>节） |
| **后续提问也要展示** | 探索性思考、后续提问环节同样应用此机制 |

---

## 内容长度评估算法

### 阈值定义（适配命令行窗口）

**设计依据：** Claude Code 命令行窗口一屏约显示 80-120 行

| 内容量级 | 行数范围 | 展示策略 | 说明 |
|----------|----------|----------|------|
| **合适** | < 150 行 | 展示整章 | 一屏半以内，可完整展示 |
| **有点多** | 150-400 行 | 只展示一个小节 | 选择一个小节展示 |
| **太多** | > 400 行 | 只展示一个小节的一部分 | 展示小节的前 60-70% |

### 评估流程

```javascript
function determineDisplayStrategy(chapterContent) {
  const totalLines = chapterContent.split('\n').length;
  const sections = extractSections(chapterContent);
  
  // 策略 1：整章合适
  if (totalLines < 150) {
    return {
      strategy: 'full-chapter',
      display: chapterContent,
      note: `本章共 ${totalLines} 行，完整展示`
    };
  }
  
  // 策略 2：内容有点多，选择一个小节
  if (totalLines < 400) {
    const targetSection = sections[0]; // 默认第一个小节
    const sectionLines = targetSection.content.split('\n').length;
    
    return {
      strategy: 'single-section',
      display: targetSection.content,
      note: `本章共 ${totalLines} 行，当前展示：${targetSection.name}（${sectionLines} 行）`
    };
  }
  
  // 策略 3：太多，展示小节的一部分
  const targetSection = sections[0];
  const sectionLines = targetSection.content.split('\n').length;
  const cutoffLine = Math.floor(sectionLines * 0.65); // 前 65%
  const partialContent = truncateAtLogicalPoint(targetSection.content, cutoffLine);
  
  return {
    strategy: 'partial-section',
    display: partialContent,
    note: `本章共 ${totalLines} 行，当前展示：${targetSection.name} 的前 65%（${partialContent.split('\n').length} 行）`
  };
}
```

### 小节选择策略

当需要只展示一个小节时，按以下优先级选择：

| 优先级 | 策略 | 说明 |
|--------|------|------|
| 1 | **first** | 选择第一个小节（默认） |
| 2 | **user-select** | 让用户选择想看的小节 |

### 截断点选择逻辑

当需要展示小节的一部分时，必须在**逻辑断点**处截断：

```javascript
function truncateAtLogicalPoint(content, targetLine) {
  const lines = content.split('\n');
  
  // 向后查找最近的逻辑断点（最多 50 行）
  for (let i = targetLine; i < Math.min(targetLine + 50, lines.length); i++) {
    if (isLogicalBreakPoint(lines, i)) {
      return lines.slice(0, i).join('\n');
    }
  }
  
  // 没找到就硬截断
  return lines.slice(0, targetLine).join('\n');
}

function isLogicalBreakPoint(lines, index) {
  const line = lines[index];
  const prevLine = lines[index - 1];
  
  // 代码块结束
  if (line.trim() === '```' && prevLine.trim() !== '') return true;
  // 空行（段落分隔）
  if (line.trim() === '' && prevLine.trim() !== '') return true;
  // 新标题开始
  if (line.startsWith('###') || line.startsWith('####')) return true;
  
  return false;
}
```

---

## 展示格式

### 策略 1：整章展示（<150 行）

```markdown
## 📖 章节内容：[章节名称]

[展示完整章节内容]

---

### 🎯 知识点清单

[从完整内容中提取的知识点清单]

---

阅读完成后回复「完成」。
```

### 策略 2：单小节展示（150-400 行）

```markdown
## 📖 章节内容：[章节名称]

> **注意：** 本章内容较多（共 X 行），当前展示第一小节：**[小节名称]**

### 当前学习：[小节名称]

[展示选定小节的完整内容]

---

### 🎯 本小节知识点清单

[仅从当前小节提取的知识点]

---

### 📋 本章剩余内容

| 小节 | 行数 | 状态 |
|------|------|------|
| [当前小节] | X 行 | ✅ 学习中 |
| [下一小节] | X 行 | ⏳ 待学习 |

完成当前小节后：
- 回复「继续」→ 学习下一小节
- 回复「提问」→ 开始测验
```

### 策略 3：小节部分展示（>400 行）

```markdown
## 📖 章节内容：[章节名称]

> **注意：** 本章内容较多（共 X 行），当前展示第一小节的前 65%：**[小节名称]**

### 当前学习：[小节名称]（第一部分）

[展示小节的前 65% 内容]

---

> ⚠️ **本小节剩余内容：**
> - 完整小节共 X 行，当前展示 Y 行
> - 剩余部分将在继续学习后展示

---

### 🎯 当前内容知识点清单

[仅从已展示内容提取的知识点]

---

### 📋 本小节进度

| 部分 | 行数 | 状态 |
|------|------|------|
| 第一部分 | Y 行 | ✅ 学习中 |
| 剩余部分 | Z 行 | ⏳ 待学习 |

完成当前部分后：
- 回复「继续」→ 学习本小节剩余部分
- 回复「提问」→ 开始测验
```

---

## 后续提问/探索性思考展示

**核心要求：** 后续提问环节也必须展示章节内容，不准简略展示。

### 探索模式：提问前回顾

```markdown
## ❓ 基于当前内容的思考

### 📖 内容回顾：[章节名称] > [小节名称]

[重新展示当前学习的小节内容 - 与阶段 1 展示的完全相同]

---

请直接提出你的问题，或回复：
- 「深入」→ Agent 提出探索性问题
- 「解释」→ 对某个点详细解释
```

### 标准/快速模式：测验前回顾

```markdown
## 📖 测验前回顾

[重新展示当前学习的小节内容]

---

## 逐题测验

**📊 知识点覆盖进度：** [已覆盖 X/总 Y 个知识点]

**问题 1/N**  
**考察知识点：** [知识点名称]

[问题内容]
```

### 探索性思考展示

```markdown
## 💡 探索性思考

### 📖 回顾内容

[再次展示相关章节内容]

---

### 🤔 思考问题

1. **连接已有知识：** 这个概念与你之前学的 [相关概念] 有什么联系？
2. **反向思考：** 如果没有 [某个特性]，会出现什么问题？
3. **边界条件：** 在什么情况下这个方案会失效？

请选择一个问题深入思考，或者直接提问。
```

---

## 内部状态追踪

```javascript
state = {
  // 当前展示策略
  displayStrategy: 'full-chapter', // 'full-chapter' | 'single-section' | 'partial-section'
  
  // 章节信息
  currentChapter: {
    name: "章节名称",
    totalLines: 280,
    totalSections: 3
  },
  
  // 当前学习位置
  currentSection: {
    name: "小节名称",
    index: 0,
    totalLines: 95,
    displayedLines: 95,
    isPartial: false
  },
  
  // 剩余内容
  remainingSections: [
    { name: "下一小节", index: 1, lines: 120 },
    { name: "最后小节", index: 2, lines: 65 }
  ],
  
  // 知识点清单（仅基于已展示内容）
  currentChapterKnowledgePoints: [
    { id: 1, name: "知识点 1", section: "小节名", covered: false }
  ]
}
```

---

## 章节/小节切换逻辑

### 完成当前小节后的切换

```markdown
## ✅ 小节学习完成

### 当前进度
- 已学：[章节名] > [小节名]
- 剩余：[下一小节名]、[后续小节...]

### 接下来做什么？
- 回复「**继续**」→ 学习下一小节
- 回复「**提问**」→ 开始测验
- 回复「**跳过**」→ 进入下一章节
- 回复「**结束**」→ 生成学习报告
```

### 完成整章后的切换

```markdown
## ✅ 章节学习完成

### 当前进度
- 已学章节：[本章名称]
- 剩余章节：[下一章名称]、[后续章节...]

### 接下来做什么？
- 回复「**继续**」→ 学习下一章
- 回复「**跳过 [章节名]**」→ 跳过指定章节
- 回复「**结束**」→ 生成总学习报告
```

---

## 与原实现的差异

| 原实现 | 新实现 |
|--------|--------|
| Step 1 总是展示整章 | 根据内容长度动态选择展示范围 |
| 知识点清单基于整章 | 知识点清单仅基于已展示内容 |
| 后续提问不展示原文 | 提问/测验前必须重新展示原文 |
| 无小节切换机制 | 支持小节级别的切换和追踪 |

---

*资源版本：1.0.0 | 创建日期：2026-04-05*
