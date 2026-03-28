# CSS 核心知识体系

> 全面的 CSS 核心概念、布局系统与最佳实践指南

---

## 目录

1. [CSS 概述](#1-css-概述)
2. [选择器](#2-选择器)
3. [层叠与优先级](#3-层叠与优先级)
4. [盒模型](#4-盒模型)
5. [传统布局](#5-传统布局)
6. [Flex 弹性布局](#6-flex-弹性布局)
7. [Grid 网格布局](#7-grid-网格布局)
8. [定位与层叠上下文](#8-定位与层叠上下文)
9. [过渡与动画](#9-过渡与动画)
10. [响应式设计](#10-响应式设计)
11. [CSS 变量与现代特性](#11-css-变量与现代特性)

---

## 1. CSS 概述

### 1.1 什么是 CSS

CSS（Cascading Style Sheets，层叠样式表）用于描述 HTML/XML 文档的呈现样式，实现了结构与样式的分离。

**核心价值：**
- 控制字体、颜色、间距、边框、背景
- 布局网页元素位置（横排、竖排、居中、响应式）
- 添加过渡动画、响应式适配、主题切换

### 1.2 CSS 版本演进

| 版本 | 发布时间 | 特点 |
|------|----------|------|
| CSS1 | 1996 年 12 月 | 基础样式功能 |
| CSS2 | 1998 年 5 月 | 支持定位与媒体查询 |
| CSS2.1 | 2004 年 6 月 | 修正版，广泛兼容 |
| CSS3 | 持续更新 | 模块化设计，功能增强 |

### 1.3 引入方式

```html
<!-- 1. 外部样式表（推荐） -->
<link rel="stylesheet" href="styles.css">

<!-- 2. 内部样式表 -->
<style>
    p { color: blue; }
</style>

<!-- 3. 行内样式（不推荐） -->
<div style="color: red;">内容</div>
```

**最佳实践：** 优先使用外部样式表，利于复用和维护。

---

## 2. 选择器

### 2.1 基础选择器

| 选择器 | 语法 | 示例 |
|--------|------|------|
| 元素选择器 | `tag` | `p { }` |
| 类选择器 | `.class` | `.btn { }` |
| ID 选择器 | `#id` | `#header { }` |
| 通配符 | `*` | `* { margin: 0; }` |

### 2.2 组合选择器

```css
/* 后代选择器 */
.container p { }

/* 子元素选择器 */
.container > p { }

/* 相邻兄弟选择器 */
h1 + p { }

/* 通用兄弟选择器 */
h1 ~ p { }

/* 群组选择器 */
h1, h2, h3 { }
```

### 2.3 属性选择器

```css
/* 存在属性 */
[disabled] { }

/* 精确匹配 */
[type="text"] { }

/* 包含值 */
[class~="btn"] { }

/* 以值开头 */
[href^="https"] { }

/* 以值结尾 */
[href$=".pdf"] { }

/* 包含子串 */
[data*="user"] { }
```

### 2.4 伪类选择器

```css
/* 链接状态 */
a:link { }        /* 未访问 */
a:visited { }     /* 已访问 */
a:hover { }       /* 悬停 */
a:active { }      /* 激活 */
a:focus { }       /* 聚焦 */

/* 结构伪类 */
:first-child { }
:last-child { }
:nth-child(n) { }
:nth-last-child(n) { }
:first-of-type { }
:last-of-type { }
:only-child { }
:empty { }

/* 表单伪类 */
:enabled { }
:disabled { }
:checked { }
:focus-visible { }

/* 否定伪类 */
:not(.btn) { }
```

### 2.5 伪元素选择器

```css
::before { }       /* 内容前插入 */
::after { }        /* 内容后插入 */
::first-letter { } /* 首字母 */
::first-line { }   /* 首行 */
::selection { }    /* 选中文本 */
::placeholder { }  /* 占位符 */
```

### 2.6 选择器优先级（权重计算）

| 选择器类型 | 权重值 | 示例 |
|------------|--------|------|
| 内联样式 | 1000 | `style=""` |
| ID 选择器 | 100 | `#id` |
| 类/伪类/属性选择器 | 10 | `.class`, `:hover`, `[type="text"]` |
| 元素/伪元素选择器 | 1 | `div`, `::before` |
| 通配符/继承 | 0 | `*`, `inherit` |

**优先级规则：**
```
!important > 内联样式 > ID > 类/伪类/属性 > 元素/伪元素 > 继承 > 浏览器默认

/* 权重计算示例 */
#nav .item a:hover {
    /* 100 + 10 + 1 + 10 = 121 */
}
```

---

### 2.7 选择器匹配算法与性能

**浏览器匹配规则：**

浏览器解析 CSS 选择器时采用**从右到左**的匹配策略。这意味着选择器最右边的部分（目标元素）最先被匹配，然后向左回溯验证祖先元素。

```
/* 选择器匹配过程示例 */
.container ul.nav li.active a:hover { }

匹配步骤（从右到左）：
1. 找到所有 :hover 状态的 <a> 元素 ← 最右边
2. 筛选出父元素是 li.active 的 <a>
3. 筛选出祖先包含 ul.nav 的元素
4. 筛选出祖先包含 .container 的元素 ← 最左边

❌ 低效：浏览器需要先找到所有 hover 的 a，再逐级过滤
```

**选择器性能分级：**

| 性能等级 | 选择器类型 | 示例 |
|----------|------------|------|
| ⭐⭐⭐⭐⭐ 最快 | ID 选择器 | `#header` |
| ⭐⭐⭐⭐ 快 | 类选择器 | `.btn-primary` |
| ⭐⭐⭐ 中等 | 标签选择器 | `div`, `p` |
| ⭐⭐ 较慢 | 后代选择器 | `.container .item` |
| ⭐ 慢 | 通配符/属性选择器 | `*`, `[data-id="123"]` |

**性能优化最佳实践：**

```css
/* ✅ 高效：使用类选择器，避免过深的嵌套 */
.card-header { }
.card-body { }
.card-footer { }

/* ❌ 低效：过深的嵌套，增加匹配成本 */
.page .main .content .article .section .paragraph { }

/* ✅ 高效：使用直接的类名 */
.nav-link { }

/* ❌ 低效：冗余的标签限定 */
ul.nav li.nav-item a.nav-link { }
/* 可简化为：*/
.nav-link { }

/* ✅ 高效：使用 Flexbox/Grid 减少选择器依赖 */
.flex-container > .item { }

/* ❌ 低效：通用兄弟选择器性能较低 */
h1 ~ p { }
```

**关键选择器（Key Selector）原则：**

选择器最右边的部分称为「关键选择器」，它决定了匹配的初始范围。

```css
/* 关键选择器是 span，匹配范围极大 */
.content ul li a span { }

/* 关键选择器是 .highlight，匹配范围精确 */
.highlight { }

/* 建议：让关键选择器尽可能精确 */
/* 使用类名作为关键选择器是最佳实践 */
```

---

## 3. 层叠与优先级

### 3.1 层叠性（Cascading）

允许多个样式规则应用到同一个元素上，通过优先级和特定性规则确定最终样式。

**层叠顺序：**
```
浏览器默认样式 < 用户自定义样式 < 作者样式 < 内联样式 < !important
```

### 3.2 继承性（Inheritance）

子元素会继承父元素的某些 CSS 属性。

**可继承属性：**
- 文本相关：`color`、`font-*`、`text-*`、`line-height`
- 其他：`visibility`、`cursor`、`list-style`

**不可继承属性：**
- 盒模型：`margin`、`padding`、`border`、`width`、`height`
- 布局：`display`、`position`、`float`、`z-index`
- 背景：`background`

**控制继承的关键字：**
```css
.inherit { color: inherit; }    /* 强制继承 */
.initial { color: initial; }    /* 恢复默认值 */
.unset { color: unset; }        /* 可继承则继承，否则默认 */
```

### 3.3 !important 规则

```css
p {
    color: red !important;  /* 最高优先级，慎用 */
}
```

**最佳实践：** 避免滥用 `!important`，会导致样式难以维护。

---

## 4. 盒模型

### 4.1 盒模型组成

每个 HTML 元素都是一个矩形盒子，由内到外包含：

```
┌─────────────────────────────────┐
│           Margin                 │
│  ┌───────────────────────────┐  │
│  │          Border           │  │
│  │  ┌─────────────────────┐  │  │
│  │  │       Padding       │  │  │
│  │  │  ┌───────────────┐  │  │  │
│  │  │  │    Content    │  │  │  │
│  │  │  └───────────────┘  │  │  │
│  │  └─────────────────────┘  │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘
```

### 4.2 两种盒模型

```css
/* 标准盒模型（默认） */
box-sizing: content-box;
/* 元素总宽高 = width/height + padding + border */

/* IE 盒模型（推荐） */
box-sizing: border-box;
/* 元素总宽高 = width/height（包含 padding 和 border） */
```

**最佳实践：** 全局设置统一盒模型
```css
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}
```

### 4.3 外边距合并

当两个垂直外边距相遇时，会合并为一个外边距。

```css
/* 合并规则：取较大值 */
.box1 { margin-bottom: 20px; }
.box2 { margin-top: 30px; }
/* 实际间距 = 30px（不是 50px） */

/* 解决方案 */
/* 1. 使用 padding 代替 margin */
/* 2. 创建 BFC（块级格式化上下文） */
.container { overflow: hidden; }
/* 3. 使用 flex/grid 布局 */
```

### 4.4 常用属性

```css
/* Margin - 外边距 */
margin: 10px;              /* 四个方向 */
margin: 10px 20px;         /* 上下 左右 */
margin: 10px 20px 30px;    /* 上 左右 下 */
margin: 10px 20px 30px 40px; /* 上 右 下 左（顺时针） */

/* Padding - 内边距 */
padding: 10px;

/* Border - 边框 */
border: 1px solid #ccc;
border-width: 1px;
border-style: solid;
border-color: #ccc;
border-radius: 4px;

/* 渐变边框 */
.element {
    border: 2px solid transparent;
    background-clip: padding-box;
    background-image: linear-gradient(to right, red, blue);
}
```

---

## 5. 传统布局

### 5.1 元素显示模式

```css
/* 块级元素（独占一行） */
display: block;
/* div, p, h1-h6, ul, li, section, header, footer */

/* 行内元素（同行排列） */
display: inline;
/* span, a, strong, em, img, input */

/* 行内块元素 */
display: inline-block;

/* 隐藏元素 */
display: none;      /* 脱离文档流 */
visibility: hidden; /* 保留位置 */
```

### 5.2 浮动布局

```css
/* 浮动 */
.float {
    float: left;   /* 左浮动 */
    float: right;  /* 右浮动 */
    float: none;   /* 不浮动 */
}

/* 清除浮动 */
.clear {
    clear: both;   /* 清除左右浮动 */
    clear: left;
    clear: right;
}

/* 伪元素清除浮动（推荐） */
.clearfix::after {
    content: '';
    display: block;
    clear: both;
}
```

**浮动特性：**
- 脱离普通文档流
- 浮动元素一行显示
- 具有行内块元素特性

### 5.3 定位布局

```css
/* 静态定位（默认） */
position: static;

/* 相对定位（不脱离文档流） */
position: relative;
top: 10px;
left: 20px;

/* 绝对定位（脱离文档流，相对于最近的定位祖先） */
position: absolute;
top: 0;
left: 0;

/* 固定定位（脱离文档流，相对于视口） */
position: fixed;
top: 0;
right: 0;

/* 粘性定位（滚动到阈值时固定） */
position: sticky;
top: 0;
```

**定位偏移属性：**
- `top`、`bottom`、`left`、`right`：控制元素位置
- `z-index`：控制堆叠顺序（仅定位元素生效）

---

## 6. Flex 弹性布局

### 6.1 Flex 布局基础

Flexbox 是一维布局模型，适合单行或单列布局。

```css
.container {
    display: flex;        /* 或 inline-flex */
}
```

---

### 6.2 Flex 布局算法详解

**核心概念：**

Flex 布局的核心是「弹性」—— 项目可以自动放大填充空间或缩小以避免溢出。浏览器按照以下步骤计算 Flex 布局：

```
Flex 布局计算流程：

1. 确定主轴方向（flex-direction）
   ↓
2. 计算项目的基准尺寸（flex-basis）
   ↓
3. 计算可用空间 = 容器尺寸 - 所有项目基准尺寸之和
   ↓
4. 分配剩余空间（或处理空间不足）
   ├─ 有剩余空间 → 按 flex-grow 比例分配
   └─ 空间不足 → 按 flex-shrink 比例收缩
   ↓
5. 根据 align-items 和 justify-content 对齐
```

**flex-grow 算法（空间分配）：**

```css
.container {
    width: 1000px;
    display: flex;
}

.item1 { flex: 1; }  /* flex-grow: 1 */
.item2 { flex: 2; }  /* flex-grow: 2 */
.item3 { flex: 1; }  /* flex-grow: 1 */
```

```
计算过程：
1. 假设所有项目 flex-basis 为 0（flex: 1 等价于 flex: 1 1 0%）
2. 可用空间 = 1000px - 0 = 1000px
3. 总增长因子 = 1 + 2 + 1 = 4
4. 每份空间 = 1000px / 4 = 250px
5. 最终尺寸：
   - .item1 = 1 × 250px = 250px
   - .item2 = 2 × 250px = 500px
   - .item3 = 1 × 250px = 250px
```

**flex-shrink 算法（空间不足时收缩）：**

```css
.container {
    width: 1000px;
    display: flex;
}

.item1 { flex: 0 1 300px; }  /* flex-shrink: 1, basis: 300px */
.item2 { flex: 0 1 500px; }  /* flex-shrink: 1, basis: 500px */
.item3 { flex: 0 1 400px; }  /* flex-shrink: 1, basis: 400px */
/* 总基准宽度 = 300 + 500 + 400 = 1200px > 1000px */
```

```
计算过程：
1. 空间不足 = 1200px - 1000px = 200px（需要收缩）
2. 总收缩因子 = 1 + 1 + 1 = 3
3. 每份收缩量 = 200px / 3 ≈ 66.67px
4. 最终尺寸：
   - .item1 = 300px - 66.67px ≈ 233.33px
   - .item2 = 500px - 66.67px ≈ 433.33px
   - .item3 = 400px - 66.67px ≈ 333.33px
```

**带权重的收缩计算：**

```css
.item1 { flex: 0 1 300px; }  /* flex-shrink: 1 */
.item2 { flex: 0 2 500px; }  /* flex-shrink: 2（收缩权重更高） */
.item3 { flex: 0 1 400px; }  /* flex-shrink: 1 */
```

```
计算过程：
1. 空间不足 = 1200px - 1000px = 200px
2. 总收缩因子 = 1 + 2 + 1 = 4
3. item2 收缩更多（因为 shrink 权重为 2）
   - 每份 = 200px / 4 = 50px
   - .item1 收缩 = 1 × 50px = 50px
   - .item2 收缩 = 2 × 50px = 100px
   - .item3 收缩 = 1 × 50px = 50px
4. 最终尺寸：
   - .item1 = 300px - 50px = 250px
   - .item2 = 500px - 100px = 400px
   - .item3 = 400px - 50px = 350px
```

**flex-basis 的重要性：**

`flex-basis` 决定了项目的「起始尺寸」，在分配空间前先应用此值。

```css
/* flex-basis: auto（默认） */
.item { flex: 1; }
/* 行为：根据内容决定基准尺寸，然后按比例分配剩余空间 */

/* flex-basis: 0 */
.item { flex: 1 1 0; }
/* 行为：忽略内容，完全按 flex-grow 比例分配空间 */

/* 实际开发建议 */
.item {
    flex: 0 0 auto;  /* 不伸缩，按内容尺寸 */
}
.item {
    flex: 1 1 0;     /* 完全按比例分配 */
}
```

### 6.3 容器属性（已更新编号）

```css
.container {
    /* 主轴方向 */
    flex-direction: row;           /* 水平（默认） */
    flex-direction: row-reverse;   /* 水平反向 */
    flex-direction: column;        /* 垂直 */
    flex-direction: column-reverse;/* 垂直反向 */

    /* 是否换行 */
    flex-wrap: nowrap;             /* 不换行 */
    flex-wrap: wrap;               /* 换行 */
    flex-wrap: wrap-reverse;       /* 换行反向 */

    /* 简写 */
    flex-flow: row wrap;

    /* 主轴对齐方式 */
    justify-content: flex-start;   /* 起点对齐 */
    justify-content: flex-end;     /* 终点对齐 */
    justify-content: center;       /* 居中 */
    justify-content: space-between;/* 两端对齐 */
    justify-content: space-around; /* 环绕分布 */
    justify-content: space-evenly; /* 均匀分布 */

    /* 交叉轴对齐方式 */
    align-items: stretch;          /* 拉伸（默认） */
    align-items: flex-start;       /* 起点 */
    align-items: flex-end;         /* 终点 */
    align-items: center;           /* 居中 */
    align-items: baseline;         /* 基线对齐 */

    /* 多行对齐 */
    align-content: flex-start;
    align-content: center;
    align-content: space-between;

    /* 间距 */
    gap: 10px;
}
```

### 6.4 项目属性

```css
.item {
    /* 排序 */
    order: 0;

    /* 放大比例 */
    flex-grow: 0;

    /* 缩小比例 */
    flex-shrink: 1;

    /* 初始尺寸 */
    flex-basis: auto;

    /* 简写 */
    flex: 0 1 auto;
    flex: 1;  /* 等价于 flex: 1 1 0% */

    /* 单独对齐 */
    align-self: auto;
    align-self: flex-start;
    align-self: center;
}
```

### 6.5 经典布局示例

```css
/* 1. 垂直水平居中 */
.center-box {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}

/* 2. 两端对齐导航 */
.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
}

/* 3. 等高卡片布局 */
.card-container {
    display: flex;
    gap: 20px;
}
.card {
    flex: 1;
    display: flex;
    flex-direction: column;
}
.card-content {
    flex: 1;  /* 内容区自动填充 */
}
.card-footer {
    margin-top: auto;  /* 底部对齐 */
}

/* 4. 圣杯布局 */
.holy-grail {
    display: flex;
    min-height: 100vh;
    flex-direction: column;
}
.holy-grail-body {
    display: flex;
    flex: 1;
}
.holy-grail-main {
    flex: 1;
}
.holy-grail-aside {
    flex: 0 0 200px;
}
```

---

## 7. Grid 网格布局

### 7.1 Grid 布局基础

Grid 是二维布局系统，可同时处理行和列。

```css
.container {
    display: grid;        /* 或 inline-grid */
}
```

---

### 7.2 Grid 轨道计算算法详解

**核心概念：**

Grid 布局的轨道计算分为两个阶段：
1. **轨道尺寸确定**：计算每行每列的最终尺寸
2. **项目放置**：根据 grid-column/grid-row 将项目放入网格

**fr 单位的计算原理：**

`fr` 是 Grid 特有的弹性单位，表示「可用空间的比例」。

```css
.container {
    width: 1000px;
    display: grid;
    grid-template-columns: 1fr 2fr 1fr;
}
```

```
计算过程：
1. 总份数 = 1 + 2 + 1 = 4
2. 每份宽度 = 1000px / 4 = 250px
3. 最终尺寸：
   - 第 1 列 = 1 × 250px = 250px
   - 第 2 列 = 2 × 250px = 500px
   - 第 3 列 = 1 × 250px = 250px
```

**混合单位的计算（先固定后弹性）：**

当 `fr` 与固定单位（px、em 等）混合使用时，浏览器先分配固定尺寸，剩余空间再分配给 `fr`。

```css
.container {
    width: 1000px;
    display: grid;
    grid-template-columns: 200px 1fr 1fr;
}
```

```
计算过程：
1. 先分配固定列：200px
2. 剩余空间 = 1000px - 200px = 800px
3. 剩余空间按 fr 分配：800px / 2 = 400px
4. 最终尺寸：
   - 第 1 列 = 200px（固定）
   - 第 2 列 = 400px
   - 第 3 列 = 400px
```

**minmax() 函数的计算：**

`minmax(min, max)` 允许轨道在最小值和最大值之间弹性伸缩。

```css
.container {
    width: 1000px;
    display: grid;
    grid-template-columns: minmax(100px, 300px) minmax(100px, 300px) minmax(100px, 300px);
}
```

```
计算过程：
1. 理想均分 = 1000px / 3 ≈ 333.33px
2. 但每列最大为 300px，所以：
   - 第 1 列 = 300px（达到上限）
   - 第 2 列 = 300px（达到上限）
   - 第 3 列 = 300px（达到上限）
3. 总使用 = 900px，剩余 100px 无法分配（因为都达到上限）
```

**auto-fit vs auto-fill：**

```css
/* auto-fill：尽可能填充轨道，即使没有内容 */
.container {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
}

/* auto-fit：只创建有内容的轨道，空白轨道折叠 */
.container {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}
```

```
场景：容器宽度 1000px，只有 3 个项目

auto-fill 的行为：
- 计算：1000px / 200px = 5 列
- 创建 5 列轨道，2 列为空

auto-fit 的行为：
- 计算：1000px / 200px = 5 列
- 但只有 3 个项目，所以只保留 3 列
- 3 列均分空间：每列 333.33px
```

### 7.3 容器属性（已更新编号）

```css
.container {
    /* 定义列 */
    grid-template-columns: 200px 200px 200px;
    grid-template-columns: repeat(3, 1fr);  /* 3 等分 */
    grid-template-columns: 1fr 2fr 1fr;     /* 比例分配 */
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); /* 响应式 */

    /* 定义行 */
    grid-template-rows: 100px auto 100px;

    /* 定义区域 */
    grid-template-areas:
        "header header header"
        "sidebar main aside"
        "footer footer footer";

    /* 间距 */
    gap: 20px;
    row-gap: 10px;
    column-gap: 20px;

    /* 单元格对齐 */
    justify-items: center;  /* 水平 */
    align-items: center;    /* 垂直 */

    /* 网格整体对齐 */
    justify-content: center;
    align-content: center;
}
```

### 7.4 项目属性

```css
.item {
    /* 跨越列 */
    grid-column: 1 / 3;
    grid-column: span 2;

    /* 跨越行 */
    grid-row: 1 / 2;

    /* 放置区域 */
    grid-area: header;

    /* 单元格内对齐 */
    justify-self: center;
    align-self: center;
}
```

### 7.5 响应式网格

```css
/* 自适应卡片网格 */
.card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
}

/* 移动端适配 */
@media (max-width: 768px) {
    .card-grid {
        grid-template-columns: 1fr;
    }
}
```

---

## 8. 定位与层叠上下文

### 8.1 层叠上下文（Stacking Context）详解

**什么是层叠上下文？**

层叠上下文是 CSS 中一个三维的概念，决定了元素在垂直于屏幕方向（Z 轴）上的堆叠顺序。每个层叠上下文都是一个独立的「世界」，内部的 z-index 值只在该上下文内有效。

**为什么需要层叠上下文？**

```
场景：两个独立组件都需要控制内部元素的层级

┌─────────────────┐
│  Modal A        │  z-index: 100
│  ┌─────────┐    │
│  │ Dropdown│    │  z-index: 50
│  └─────────┘    │
└─────────────────┘

┌─────────────────┐
│  Modal B        │  z-index: 200
│  ┌─────────┐    │
│  │ Tooltip │    │  z-index: 999（但在 Modal B 内部，无法超过 Modal A）
│  └─────────┘    │
└─────────────────┘

如果没有层叠上下文，z-index: 999 的 Tooltip 会错误地覆盖 Modal A
```

---

**创建层叠上下文的完整条件：**

| 条件 | 说明 | 示例 |
|------|------|------|
| 根元素 | `<html>` 始终创建层叠上下文 | - |
| position + z-index | `position: relative/absolute/fixed` 且 `z-index` 不为 `auto` | `.element { position: relative; z-index: 1; }` |
| Flex 容器 | `display: flex` 的容器 | `.flex { display: flex; }` |
| Grid 容器 | `display: grid` 的容器 | `.grid { display: grid; }` |
| opacity < 1 | 透明度小于 1 | `.fade { opacity: 0.9; }` |
| transform | 任何非 none 的变换 | `.rotate { transform: rotate(10deg); }` |
| filter | 任何非 none 的滤镜 | `.blur { filter: blur(5px); }` |
| will-change | 准备改变的属性 | `.prepare { will-change: transform; }` |
| isolation | 隔离混合 | `.isolate { isolation: isolate; }` |

---

**层叠顺序的完整规则（从底层到顶层）：**

```
在同一层叠上下文内，元素的绘制顺序如下：

1. 背景和边框（z-index: auto 或 0）
   ↓
2. 负 z-index（z-index < 0）
   ↓
3. 普通流中的非定位元素
   ↓
4. 浮动元素
   ↓
5. 普通流中的定位元素（position: relative 等）
   ↓
6. z-index: auto 的定位元素
   ↓
7. 正 z-index（z-index > 0）
```

**层叠上下文的嵌套规则：**

```
关键规则：子层叠上下文永远无法超过父层叠上下文的层级

父容器 A (z-index: 10)
├── 子元素 A1 (z-index: 999)  ← 无法超过父容器
└── 子元素 A2 (z-index: 1)

父容器 B (z-index: 20)
├── 子元素 B1 (z-index: 1)   ← 即使 z-index 很小，也会覆盖 A 的所有子元素
└── 子元素 B2 (z-index: 100)

结论：B1 会覆盖 A1，因为 B 容器的层级高于 A 容器
```

---

### 8.2 z-index 深度解析

**z-index 的工作原理：**

```css
.element {
    position: relative;  /* 或 absolute/fixed */
    z-index: 10;
}
```

**重要前提：**
- `z-index` 仅在定位元素（position 不为 static）上生效
- `z-index` 的值只在同一个层叠上下文内比较
- `z-index: auto` 不会创建新的层叠上下文

**常见误区：**

```css
/* ❌ 错误：z-index 不生效，因为 position 是 static（默认） */
.element {
    z-index: 10;
}

/* ✅ 正确：添加定位 */
.element {
    position: relative;
    z-index: 10;
}
```

```css
/* ❌ 错误：子元素的 z-index 无法超过父元素 */
.parent {
    position: relative;
    z-index: 10;
}
.child {
    position: relative;
    z-index: 999; /* 无法超过其他 z-index: 11 的元素 */
}

/* ✅ 正确：使用 transform 或 opacity 打破层叠上下文（谨慎使用） */
.parent {
    transform: translateZ(0); /* 创建新层叠上下文 */
}
.child {
    position: relative;
    z-index: 999; /* 现在在独立的上下文中 */
}
```

---

### 8.3 层叠上下文调试技巧

**使用 DevTools 查看层叠顺序：**

Chrome DevTools → Elements → Computed → 搜索 "z-index"

**可视化层叠上下文：**

```css
/* 使用 outline 临时标记层叠上下文 */
* {
    outline: 1px solid rgba(255, 0, 0, 0.3);
}
```

---

## 9. 过渡与动画

### 9.1 浏览器渲染流程详解

**理解渲染流程是性能优化的关键：**

```
浏览器渲染流程：

1. DOM (Document Object Model)
   └── 解析 HTML → DOM 树
        ↓
2. CSSOM (CSS Object Model)
   └── 解析 CSS → CSSOM 树
        ↓
3. Render Tree（渲染树）
   └── DOM + CSSOM → Render Tree
        ↓
4. Layout（布局/重排）
   └── 计算每个元素的精确位置和尺寸
        ↓
5. Paint（绘制/重绘）
   └── 填充像素（颜色、边框、阴影等）
        ↓
6. Composite（合成）
   └── 将多个层合并为最终图像显示
```

**三种渲染操作的性能对比：**

| 操作 | 英文 | 触发条件 | 性能消耗 |
|------|------|----------|----------|
| 重排 | Reflow / Layout | 改变尺寸、位置、显示/隐藏 | ⭐⭐⭐⭐⭐ 最昂贵 |
| 重绘 | Repaint | 改变颜色、背景、可见性 | ⭐⭐⭐ 中等 |
| 合成 | Composite | 改变 transform、opacity | ⭐ 最便宜 |

---

### 9.2 GPU 加速原理

**为什么 transform 和 opacity 动画性能好？**

```
传统动画（如 top、left、width）：
┌─────────────────────────────────────┐
│  改变 top/left                      │
│     ↓                               │
│  触发重排（Layout）                 │
│     ↓                               │
│  触发重绘（Paint）                  │
│     ↓                               │
│  触发合成（Composite）              │
│     ↓                               │
│  CPU 密集计算，每帧 ~16ms           │
└─────────────────────────────────────┘

GPU 加速动画（transform/opacity）：
┌─────────────────────────────────────┐
│  改变 transform/opacity             │
│     ↓                               │
│  仅触发合成（Composite）            │
│     ↓                               │
│  GPU 处理，每帧 < 1ms               │
└─────────────────────────────────────┘
```

**Composite 层的工作原理：**

```
浏览器将页面分割成多个「层」（Layer）：

┌─────────────────────────────────────┐
│  Layer 1: 背景                       │
│  Layer 2: 文本内容                   │
│  Layer 3: 动画元素 ← GPU 处理        │
│  Layer 4: 固定导航栏                 │
└─────────────────────────────────────┘

GPU（图形处理器）负责：
- 将多个层合成为最终图像
- 处理变换（平移、旋转、缩放）
- 处理透明度

优势：
- GPU 专为并行计算设计
- 不依赖 CPU 进行像素计算
- 60fps 流畅动画的关键
```

---

### 9.3 触发 GPU 加速的属性

**推荐用于动画的属性（仅触发 Composite）：**

```css
/* ✅ 推荐：仅触发合成 */
.element {
    transform: translateX(100px);  /* 平移 */
    transform: rotate(45deg);       /* 旋转 */
    transform: scale(1.5);          /* 缩放 */
    opacity: 0.5;                   /* 透明度 */
}
```

**避免用于动画的属性（触发重排/重绘）：**

```css
/* ❌ 避免：触发重排 */
.element {
    top: 100px;          /* 位置 */
    left: 50px;
    width: 200px;        /* 尺寸 */
    height: 100px;
    margin: 10px;
    padding: 20px;
    border-width: 2px;
    display: none;       /* 显示/隐藏 */
}

/* ❌ 避免：触发重绘 */
.element {
    background-color: red;
    color: blue;
    box-shadow: 0 0 10px black;
    visibility: hidden;
}
```

---

### 9.4 强制创建 Composite 层

**使用 will-change 提示浏览器：**

```css
.element {
    will-change: transform, opacity;
}
```

**will-change 的作用：**
- 提前告知浏览器哪些属性会变化
- 浏览器会预先为该元素创建独立的 Composite 层
- 避免动画开始时的层创建开销

**注意事项：**
```css
/* ❌ 错误：不要对所有元素使用 will-change */
* {
    will-change: transform;  /* 浪费内存！ */
}

/* ✅ 正确：仅在动画前添加，动画后移除 */
.element:hover {
    will-change: transform;
}

/* 或者用 JS 动态管理 */
element.addEventListener('mouseenter', () => {
    element.style.willChange = 'transform';
});
element.addEventListener('mouseleave', () => {
    element.style.willChange = 'auto';  /* 释放资源 */
});
```

**其他创建 Composite 层的方法：**

```css
/* 使用 3D 变换强制启用 GPU 加速 */
.element {
    transform: translateZ(0);     /* 最常用 */
    transform: translate3d(0, 0, 0);
    backface-visibility: hidden;
    perspective: 1000px;
}
```

---

### 9.5 Transition 过渡

```css
.button {
    background-color: #3B82F6;
    transition: all 0.3s ease;
    /* transition-property: all; */
    /* transition-duration: 0.3s; */
    /* transition-timing-function: ease; */
    /* transition-delay: 0s; */
}

.button:hover {
    background-color: #2563EB;
}
```

**缓动函数详解：**

| 缓动函数 | 特点 | 使用场景 |
|----------|------|----------|
| `linear` | 匀速 | 机械运动、加载旋转 |
| `ease` | 慢 - 快 - 慢（默认） | 通用过渡 |
| `ease-in` | 慢 - 匀速 | 物体加速效果 |
| `ease-out` | 匀速 - 慢 | 物体减速效果 |
| `ease-in-out` | 慢 - 匀速 - 慢 | 对称过渡 |
| `cubic-bezier(n,n,n,n)` | 自定义 | 精确控制曲线 |

**贝塞尔曲线可视化：**

```
cubic-bezier(x1, y1, x2, y2)

控制点范围：0 ≤ x1, x2, y1, y2 ≤ 1

常用预设值：
- ease: cubic-bezier(0.25, 0.1, 0.25, 1)
- ease-in: cubic-bezier(0.42, 0, 1, 1)
- ease-out: cubic-bezier(0, 0, 0.58, 1)
- ease-in-out: cubic-bezier(0.42, 0, 0.58, 1)

工具：https://cubic-bezier.com/
```

---

### 9.6 Animation 动画

```css
/* 定义关键帧 */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* 应用动画 */
.element {
    animation: fadeIn 0.5s ease forwards;
    /* animation-name: fadeIn; */
    /* animation-duration: 0.5s; */
    /* animation-timing-function: ease; */
    /* animation-delay: 0s; */
    /* animation-iteration-count: 1; */
    /* animation-direction: normal; */
    /* animation-fill-mode: forwards; */
    /* animation-play-state: running; */
}
```

**animation-fill-mode 详解：**

| 值 | 说明 | 动画前 | 动画后 |
|----|------|--------|--------|
| `none` | 不应用样式 | 原始状态 | 回到原始状态 |
| `forwards` | 保持结束状态 | 原始状态 | 保持最终帧 |
| `backwards` | 应用起始状态 | 保持初始帧 | 回到原始状态 |
| `both` | 双向应用 | 保持初始帧 | 保持最终帧 |

---

### 9.7 渐变

```css
/* 线性渐变 */
background-image: linear-gradient(to right, #3B82F6, #22C55E);

/* 径向渐变 */
background-image: radial-gradient(circle, #3B82F6, #22C55E);

/* 渐变文本 */
.gradient-text {
    background-image: linear-gradient(45deg, #3B82F6, #22C55E);
    background-clip: text;
    color: transparent;
}
```

---

## 10. 响应式设计

### 10.1 媒体查询

```css
/* 移动优先 */
.container {
    padding: 10px;
}

/* 平板 */
@media (min-width: 768px) {
    .container {
        padding: 20px;
    }
}

/* 桌面 */
@media (min-width: 1024px) {
    .container {
        padding: 40px;
    }
}

/* 暗色模式 */
@media (prefers-color-scheme: dark) {
    body {
        background-color: #111;
        color: #fff;
    }
}
```

### 10.2 视口设置

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

### 10.3 响应式单位

| 单位 | 说明 | 示例 |
|------|------|------|
| `px` | 绝对单位 | `font-size: 16px` |
| `em` | 相对于父元素 | `font-size: 1.5em` |
| `rem` | 相对于根元素 | `font-size: 1rem` |
| `vw` | 视口宽度 1% | `width: 50vw` |
| `vh` | 视口高度 1% | `height: 100vh` |
| `%` | 相对于父元素 | `width: 50%` |

### 10.4 响应式排版

```css
/* 使用 clamp() 实现流体排版 */
h1 {
    font-size: clamp(2rem, 5vw, 3.5rem);
}

/* 使用 calc() 计算 */
.container {
    width: calc(100% - 40px);
}
```

---

## 11. CSS 变量与现代特性

### 11.1 CSS 变量（自定义属性）

```css
:root {
    --primary: #3B82F6;
    --secondary: #64748B;
    --accent: #F59E0B;
    --spacing: 1rem;
}

.card {
    color: var(--primary);
    padding: var(--spacing);
    /* 带回退值 */
    color: var(--primary-color, #3B82F6);
}

/* JavaScript 操作 */
element.style.setProperty('--primary', '#new-color');
```

### 11.2 滤镜效果

```css
/* 灰度 */
filter: grayscale(100%);

/* 模糊 */
filter: blur(5px);

/* 亮度 */
filter: brightness(150%);

/* 对比度 */
filter: contrast(200%);

/* 多个滤镜组合 */
filter: grayscale(100%) blur(5px);
```

### 11.3 对象适配

```css
/* 图片适配 */
img {
    width: 100px;
    height: 100px;
    object-fit: cover;    /* 裁剪填充 */
    object-fit: contain;  /* 完整显示 */
    object-fit: fill;     /* 拉伸填充 */
}

/* 内容对齐 */
img {
    object-position: center;
    object-position: top left;
}
```

---

## 附录：常见问题解决方案

### 垂直居中

```css
/* Flexbox 方案（推荐） */
.center {
    display: flex;
    justify-content: center;
    align-items: center;
}

/* Grid 方案 */
.center {
    display: grid;
    place-items: center;
}

/* 绝对定位方案 */
.center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
```

### 清除浮动

```css
/* 伪元素方案（推荐） */
.clearfix::after {
    content: '';
    display: block;
    clear: both;
}

/* BFC 方案 */
.parent {
    overflow: hidden;
}
```

### 1px 边框问题

```css
/* 使用 transform */
.thin-border {
    position: relative;
}
.thin-border::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 200%;
    height: 200%;
    border: 1px solid #ccc;
    transform: scale(0.5);
    transform-origin: 0 0;
    pointer-events: none;
}
```

---

*文档创建日期：2026-03-24*
