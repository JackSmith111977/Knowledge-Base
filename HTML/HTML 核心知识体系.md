# HTML 核心知识体系

> 全面的 HTML 核心概念、标签体系与最佳实践指南

---

## 目录

1. [HTML 概述](#1-html-概述)
2. [文档结构](#2-文档结构)
3. [语义化标签](#3-语义化标签)
4. [文本内容标签](#4-文本内容标签)
5. [表单与输入](#5-表单与输入)
6. [多媒体元素](#6-多媒体元素)
7. [图形绘制](#7-图形绘制)
8. [Web Components](#8-web-components)
9. [元数据与 SEO](#9-元数据与-seo)
10. [无障碍访问](#10-无障碍访问)

---

## 1. HTML 概述

### 1.1 什么是 HTML

HTML（HyperText Markup Language）是用于创建网页的标准标记语言。

**HTML5 的核心优势：**
- 语义化：让代码更易于理解和维护
- 多媒体支持：无需插件即可嵌入视频和音频
- 跨平台支持：适配 PC、移动端、平板
- 强大的 API 支持：本地存储、地理定位、拖拽等

### 1.2 HTML5 相对 HTML4 的变化

| 变化类型 | 说明 |
|----------|------|
| **新增语义化标签** | `<header>`、`<nav>`、`<main>`、`<article>`、`<section>`、`<footer>` 等 |
| **原生多媒体支持** | `<audio>`、`<video>` 标签，原生播放音频/视频 |
| **增强型表单** | 新增邮箱、手机号、日期等原生表单类型和验证 |
| **图形绘制能力** | `<canvas>` 画布标签，原生实现 2D 图形绘制 |
| **新增原生 API** | LocalStorage、SessionStorage、地理定位、拖拽、历史记录等 |
| **废除无用标签** | 移除 `<font>`、`<center>`、`<frame>` 等纯样式/低性能标签 |

---

## 2. 文档结构

### 2.1 HTML5 基本结构（必背）

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="页面描述">
    <meta name="keywords" content="关键词 1，关键词 2">
    <title>页面标题</title>
    <link rel="stylesheet" href="styles.css">
    <link rel="icon" href="/favicon.ico">
</head>
<body>
    <!-- 页面内容 -->
</body>
</html>
```

### 2.2 DOCTYPE 声明

```html
<!DOCTYPE html>
```

HTML5 的 DOCTYPE 声明简洁，告诉浏览器使用标准模式渲染。

### 2.3 `<html>` 根元素

```html
<html lang="zh-CN">
```

`lang` 属性指定页面语言，有助于搜索引擎和屏幕阅读器。

### 2.4 `<head>` 头部

包含元数据、标题、样式表链接等，不会显示在页面中。

### 2.5 `<body>` 主体

包含所有可见的页面内容。

---

## 3. 语义化标签

### 3.1 核心语义化标签

| 标签 | 说明 | 使用场景 |
|------|------|----------|
| `<header>` | 页面或区块的头部 | Logo、导航、标题 |
| `<footer>` | 页面或区块的底部 | 版权信息、联系方式 |
| `<nav>` | 导航链接容器 | 主导航、侧边导航 |
| `<main>` | 页面核心内容 | 每个页面仅一个 |
| `<article>` | 独立完整的内容单元 | 博客文章、新闻、评论 |
| `<section>` | 主题性内容区块 | 章节、tab 面板 |
| `<aside>` | 辅助信息 | 侧边栏、推荐阅读 |
| `<figure>` | 独立内容（图片、图表） | 配图、代码示例 |
| `<figcaption>` | 图表标题 | 图片说明文字 |

### 3.2 语义化博客页面示例

```html
<body>
    <header>
        <h1>前端技术博客</h1>
        <nav>
            <ul>
                <li><a href="/">首页</a></li>
                <li><a href="/about">关于</a></li>
            </ul>
        </nav>
    </header>

    <main>
        <article>
            <h2>HTML5 语义化标签详解</h2>
            <section>
                <h3>为什么需要语义化？</h3>
                <p>语义化标签能提升代码可读性、优化 SEO 并增强可访问性。</p>
            </section>
        </article>

        <aside>
            <h2>相关推荐</h2>
            <ul>
                <li><a href="#">CSS3 布局指南</a></li>
            </ul>
        </aside>
    </main>

    <footer>
        <p>&copy; 2026 前端技术博客</p>
    </footer>
</body>
```

### 3.3 语义化的核心价值

- **SEO 友好**：搜索引擎更易理解页面结构
- **可访问性**：辅助技术（如屏幕阅读器）能正确解析内容
- **代码可读性**：开发者无需阅读 class 名即可理解结构

---

## 4. 文本内容标签

### 4.1 标题标签

```html
<h1>主标题（每页一个）</h1>
<h2>二级标题</h2>
<h3>三级标题</h3>
<h4>四级标题</h4>
<h5>五级标题</h5>
<h6>六级标题</h6>
```

### 4.2 段落与换行

```html
<p>这是一个段落。</p>
<br>  <!-- 换行（自闭合标签） -->
<hr>  <!-- 水平分割线 -->
```

### 4.3 文本格式化

| 标签 | 说明 | 示例 |
|------|------|------|
| `<strong>` | 重要文本（加粗） | `<strong>重要</strong>` |
| `<em>` | 强调文本（斜体） | `<em>强调</em>` |
| `<mark>` | 高亮文本 | `<mark>高亮</mark>` |
| `<del>` | 删除线 | `<del>删除</del>` |
| `<ins>` | 下划线（插入） | `<ins>插入</ins>` |
| `<sub>` | 下标 | `H<sub>2</sub>O` |
| `<sup>` | 上标 | `x<sup>2</sup>` |
| `<code>` | 行内代码 | `<code>console.log()</code>` |
| `<pre>` | 预格式化文本 | 保留空格和换行 |
| `<blockquote>` | 块引用 | 长段引用 |
| `<q>` | 行内引用 | 短引用 |

### 4.4 列表

```html
<!-- 无序列表 -->
<ul>
    <li>项目 1</li>
    <li>项目 2</li>
</ul>

<!-- 有序列表 -->
<ol>
    <li>第一步</li>
    <li>第二步</li>
</ol>

<!-- 定义列表 -->
<dl>
    <dt>HTML</dt>
    <dd>超文本标记语言</dd>
</dl>
```

### 4.5 超链接

```html
<a href="https://example.com">普通链接</a>
<a href="https://example.com" target="_blank" rel="noopener">新窗口打开</a>
<a href="tel:+1234567890">拨打电话</a>
<a href="mailto:test@example.com">发送邮件</a>
<a href="#section1">页面内锚点</a>
```

### 4.6 图片

```html
<img src="image.jpg" alt="图片描述" width="300" height="200" loading="lazy">
```

| 属性 | 说明 |
|------|------|
| `src` | 图片路径（必填） |
| `alt` | 替代文本（无障碍必需） |
| `width/height` | 宽高（防止布局偏移） |
| `loading="lazy"` | 懒加载 |

### 4.7 表格

```html
<table>
    <caption>表格标题</caption>
    <thead>
        <tr>
            <th>表头 1</th>
            <th>表头 2</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>数据 1</td>
            <td>数据 2</td>
        </tr>
    </tbody>
    <tfoot>
        <tr>
            <td>汇总 1</td>
            <td>汇总 2</td>
        </tr>
    </tfoot>
</table>
```

---

## 5. 表单与输入

### 5.1 表单基础

```html
<form action="/submit" method="POST" enctype="multipart/form-data">
    <!-- 表单元素 -->
    <button type="submit">提交</button>
</form>
```

| 属性 | 说明 |
|------|------|
| `action` | 提交地址 |
| `method` | 提交方法（GET/POST） |
| `enctype` | 编码类型（上传文件用 `multipart/form-data`） |

### 5.2 input 类型

```html
<!-- 基础类型 -->
<input type="text" placeholder="文本输入">
<input type="password" placeholder="密码">
<input type="hidden" value="隐藏值">

<!-- HTML5 新增类型 -->
<input type="email" placeholder="邮箱">
<input type="tel" placeholder="手机号">
<input type="url" placeholder="网址">
<input type="number" min="0" max="100">
<input type="date">
<input type="datetime-local">
<input type="month">
<input type="week">
<input type="time">
<input type="color">
<input type="range" min="0" max="100">
<input type="search">

<!-- 选择类型 -->
<input type="checkbox" checked> 复选框
<input type="radio" name="group" checked> 单选框
<input type="file" accept="image/*">

<!-- 按钮 -->
<input type="button" value="按钮">
<input type="submit" value="提交">
<input type="reset" value="重置">
```

### 5.3 表单验证属性

```html
<input required>                    <!-- 必填 -->
<input pattern="[0-9]{11}">         <!-- 正则验证 -->
<input minlength="3">               <!-- 最小长度 -->
<input maxlength="20">              <!-- 最大长度 -->
<input min="1" max="100">           <!-- 数值范围 -->
<input step="0.01">                 <!-- 步进值 -->

<!-- 关闭原生验证 -->
<form novalidate>
```

**表单验证 API：**

```javascript
const input = document.querySelector('input');

// 检查有效性
input.validity.valid;      // 是否通过所有验证
input.validity.required;   // 是否必填但未填
input.validity.patternMismatch;  // 是否不匹配 pattern
input.validity.tooShort;   // 是否太短
input.validity.rangeOverflow;  // 是否超出最大值

// 自定义错误消息
input.setCustomValidity('邮箱格式不正确');

// 获取错误消息
console.log(input.validationMessage);

// 手动触发表单验证
const form = document.querySelector('form');
if (!form.checkValidity()) {
  form.reportValidity();  // 显示验证错误
}
```

---

### 5.4 其他表单元素

```html
<!-- 文本域 -->
<textarea rows="4" cols="50" placeholder="多行文本"></textarea>

<!-- 下拉选择 -->
<select>
    <option value="">请选择</option>
    <option value="1">选项 1</option>
    <option value="2">选项 2</option>
</select>

<!-- 分组 -->
<fieldset>
    <legend>分组标题</legend>
    <!-- 表单元素 -->
</fieldset>

<!-- 数据列表（自动补全） -->
<input list="browsers">
<datalist id="browsers">
    <option value="Chrome">
    <option value="Firefox">
    <option value="Safari">
</datalist>

<!-- 进度条 -->
<progress value="70" max="100"></progress>

<!-- 度量器 -->
<meter value="0.6"></meter>
```

---

### 5.5 表单无障碍访问

**为什么需要无障碍表单？**

约 15% 的人口有某种形式的残障，无障碍表单确保所有人都能使用你的网站，包括：
- 视障用户（使用屏幕阅读器）
- 运动障碍用户（使用键盘导航）
- 认知障碍用户

**无障碍表单最佳实践：**

```html
<!-- ✅ 正确：使用 label 关联 -->
<label for="email">邮箱地址：</label>
<input type="email" id="email" name="email" required>

<!-- ❌ 错误：缺少 label 关联 -->
<input type="email" placeholder="邮箱地址">

<!-- ✅ 正确：使用 fieldset 和 legend 分组 -->
<fieldset>
    <legend>选择您的订阅偏好</legend>
    <label>
        <input type="checkbox" name="newsletter"> 新闻通讯
    </label>
    <label>
        <input type="checkbox" name="updates"> 产品更新
    </label>
</fieldset>

<!-- ✅ 正确：提供错误提示 -->
<input type="email" id="email" required aria-describedby="email-error">
<span id="email-error" class="error" role="alert">请输入有效的邮箱地址</span>

<!-- ✅ 正确：使用 aria-label 提供额外描述 -->
<button aria-label="关闭对话框">×</button>
```

**无障碍属性对照表：**

| 属性 | 说明 | 使用场景 |
|------|------|----------|
| `aria-label` | 提供元素的文本标签 | 图标按钮、无可见文本的元素 |
| `aria-labelledby` | 引用作为标签的元素 ID | 复杂表单控件 |
| `aria-describedby` | 引用描述元素的 ID | 错误消息、帮助文本 |
| `aria-required` | 标记为必填 | 表单验证 |
| `aria-invalid` | 标记为无效 | 验证失败时 |
| `role="alert"` | 声明重要且紧急的消息 | 错误提示、成功消息 |

### 5.5 表单验证 API

```javascript
const form = document.querySelector('form');
const input = form.querySelector('input');

// 检查有效性
input.checkValidity();    // true/false
input.validity.valid;     // 是否有效
input.validationMessage;  // 验证错误信息

// 自定义验证
input.setCustomValidity('自定义错误信息');

// 手动触发表单验证
form.reportValidity();
```

---

## 6. 多媒体元素

### 6.1 音频

```html
<audio controls autoplay loop muted preload="metadata">
    <source src="audio.mp3" type="audio/mpeg">
    <source src="audio.ogg" type="audio/ogg">
    <track src="subtitles.vtt" kind="subtitles" srclang="zh" label="中文">
    您的浏览器不支持音频播放。
</audio>
```

| 属性 | 说明 |
|------|------|
| `controls` | 显示控制条 |
| `autoplay` | 自动播放 |
| `loop` | 循环播放 |
| `muted` | 静音 |
| `preload` | 预加载（auto/metadata/none） |

### 6.2 视频

```html
<video controls width="640" height="360" poster="thumbnail.jpg">
    <source src="video.mp4" type="video/mp4">
    <source src="video.webm" type="video/webm">
    <track src="subtitles.vtt" kind="subtitles" srclang="zh" label="中文">
    您的浏览器不支持视频播放。
</video>
```

### 6.3 字幕轨道

```html
<track src="subtitles.vtt" kind="subtitles" srclang="zh" label="中文">
<track src="chapters.vtt" kind="chapters" srclang="zh">
<track src="descriptions.vtt" kind="descriptions" srclang="zh">
```

| kind 值 | 说明 |
|--------|------|
| `subtitles` | 字幕 |
| `captions` | 隐藏式字幕（包含音效） |
| `descriptions` | 音频描述 |
| `chapters` | 章节 |
| `metadata` | 元数据 |

### 6.4 媒体 API

```javascript
const video = document.querySelector('video');

// 播放控制
video.play();
video.pause();
video.currentTime = 30;  // 跳转到 30 秒

// 属性读取
video.duration;      // 总时长
video.currentTime;   // 当前时间
video.paused;        // 是否暂停
video.volume;        // 音量 (0-1)
video.muted;         // 是否静音

// 事件监听
video.addEventListener('play', () => {});
video.addEventListener('pause', () => {});
video.addEventListener('ended', () => {});
video.addEventListener('timeupdate', () => {});
video.addEventListener('waiting', () => {});
video.addEventListener('canplay', () => {});
```

---

## 7. 图形绘制

### 7.1 Canvas vs SVG

| 特性 | Canvas | SVG |
|------|--------|-----|
| **图形模型** | 位图（像素） | 矢量（XML） |
| **渲染模式** | 即时模式（绘制后无法修改） | 保留模式（可修改） |
| **API 类型** | 过程性（JavaScript） | 声明性（标记语言） |
| **适合场景** | 游戏、高频刷新、图像处理 | 图表、图标、可交互图形 |
| **分辨率依赖** | 依赖（放大失真） | 独立（无限缩放） |
| **事件支持** | 不支持（需手动实现） | 支持（DOM 事件） |

---

### 7.2 Canvas 渲染原理

**Canvas 渲染上下文（Rendering Context）：**

```
Canvas 本身只是一个绘图容器，需要通过 getContext() 获取绘图上下文：

const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');  // 2D 上下文

// WebGL 上下文（3D 图形）
const gl = canvas.getContext('webgl');
```

**Canvas 渲染流程：**

```
1. 清除画布
   ctx.clearRect(0, 0, canvas.width, canvas.height)
       ↓
2. 开始路径
   ctx.beginPath()
       ↓
3. 定义形状
   ctx.moveTo(), ctx.lineTo(), ctx.arc() 等
       ↓
4. 描边或填充
   ctx.stroke() / ctx.fill()
       ↓
5. 重复步骤 1-4 绘制下一帧
```

**像素操作原理：**

```javascript
// 获取ImageData 对象（包含像素数据）
const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

// imageData.data 是 Uint8ClampedArray
// 每 4 个值表示一个像素：[R, G, B, A]
const data = imageData.data;

// 遍历所有像素
for (let i = 0; i < data.length; i += 4) {
  data[i]     = 255;  // Red
  data[i + 1] = 0;    // Green
  data[i + 2] = 0;    // Blue
  data[i + 3] = 255;  // Alpha
}

// 将修改后的像素数据放回 Canvas
ctx.putImageData(imageData, 0, 0);
```

**性能优化：**

```javascript
// ❌ 错误：每帧都创建新路径
function animate() {
  ctx.beginPath();
  ctx.arc(x, y, 10, 0, Math.PI * 2);
  ctx.fill();
  requestAnimationFrame(animate);
}

// ✅ 正确：使用 Path2D 缓存路径
const path = new Path2D();
path.arc(50, 50, 10, 0, Math.PI * 2);

function animate() {
  ctx.fill(path);  // 复用路径
  requestAnimationFrame(animate);
}
```

---

### 7.3 Canvas 基础

```html
<canvas id="myCanvas" width="800" height="600"></canvas>

<script>
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

// 绘制矩形
ctx.fillStyle = '#3B82F6';
ctx.fillRect(50, 50, 200, 100);

// 绘制圆形
ctx.beginPath();
ctx.arc(400, 300, 100, 0, Math.PI * 2);
ctx.fillStyle = '#EF4444';
ctx.fill();

// 绘制路径
ctx.beginPath();
ctx.moveTo(50, 400);
ctx.lineTo(200, 500);
ctx.lineTo(350, 400);
ctx.closePath();
ctx.stroke();

// 绘制文本
ctx.font = '24px Arial';
ctx.fillText('Hello Canvas', 50, 100);

// 绘制图像
const img = new Image();
img.src = 'image.jpg';
img.onload = () => {
    ctx.drawImage(img, 0, 0);
};
</script>
```

---

### 7.4 SVG 基础

```html
<svg width="400" height="200" viewBox="0 0 400 200">
    <!-- 矩形 -->
    <rect x="50" y="50" width="200" height="100" fill="#3B82F6" rx="10" />

    <!-- 圆形 -->
    <circle cx="300" cy="100" r="50" fill="#EF4444" />

    <!-- 椭圆 -->
    <ellipse cx="150" cy="150" rx="80" ry="40" fill="#22C55E" />

    <!-- 路径 -->
    <path d="M50,150 Q100,100 150,150 T250,150" stroke="#000" fill="none" stroke-width="2" />

    <!-- 文本 -->
    <text x="50" y="30" font-size="20" fill="#333">SVG 示例</text>

    <!-- 可交互元素 -->
    <rect x="300" y="150" width="80" height="40" fill="#F59E0B">
        <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
    </rect>
</svg>
```

**SVG 的优势：**

```html
<!-- SVG 可以直接嵌入 CSS -->
<style>
    .icon {
        fill: #3B82F6;
        transition: fill 0.3s;
    }
    .icon:hover {
        fill: #2563EB;
    }
</style>

<svg class="icon">
    <circle cx="50" cy="50" r="40" />
</svg>

<!-- SVG 可以直接绑定事件 -->
<svg onclick="handleClick()">
    <rect width="100" height="100" />
</svg>
```

---

### 7.5 Canvas vs SVG 选型指南

```
选择决策树：

需要绘制什么？
    │
    ├── 动态/高频刷新（游戏、视频处理）
    │   └── → Canvas
    │
    ├── 静态图形（图表、图标）
    │   └── → SVG
    │
    ├── 需要交互和事件
    │   └── → SVG
    │
    ├── 需要像素级操作
    │   └── → Canvas
    │
    └── 需要响应式缩放
        └── → SVG
```

---

## 8. Web Components

### 8.1 什么是 Web Components

Web Components 是一套浏览器原生支持的组件化技术，包含：

1. **Custom Elements** - 自定义元素
2. **Shadow DOM** - 样式隔离
3. **HTML Templates** - 模板

### 8.2 自定义元素

```javascript
// 定义自定义元素
class MyButton extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        shadow.innerHTML = `
            <style>
                button {
                    background: #3B82F6;
                    color: white;
                    padding: 10px 20px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                }
                button:hover {
                    background: #2563EB;
                }
            </style>
            <button><slot></slot></button>
        `;
    }

    connectedCallback() {
        this.shadowRoot.querySelector('button')
            .addEventListener('click', () => {
                this.dispatchEvent(new CustomEvent('click'));
            });
    }
}

// 注册自定义元素
customElements.define('my-button', MyButton);
```

### 8.3 使用自定义元素

```html
<my-button id="btn">点击我</my-button>

<script>
document.getElementById('btn')
    .addEventListener('click', () => {
        console.log('按钮被点击了');
    });
</script>
```

### 8.4 HTML 模板

```html
<template id="card-template">
    <div class="card">
        <img src="" alt="">
        <h3></h3>
        <p></p>
    </div>
</template>

<script>
const template = document.getElementById('card-template');
const clone = template.content.cloneNode(true);
clone.querySelector('h3').textContent = '卡片标题';
document.body.appendChild(clone);
</script>
```

### 8.5 Web Components 优势

- **封装性**：样式与逻辑隔离，避免全局污染
- **跨框架兼容**：可在任何框架中使用
- **标准化**：W3C 标准，无需第三方库
- **性能优势**：避免不必要的重绘和重排

---

## 9. 元数据与 SEO

### 9.1 基础元数据

```html
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="页面描述（150-160 字符）">
    <meta name="keywords" content="关键词 1，关键词 2，关键词 3">
    <meta name="author" content="作者名">
    <meta name="robots" content="index, follow">
</head>
```

| 元数据 | 说明 | 重要性 |
|--------|------|--------|
| `charset` | 字符编码（必须第一个声明） | ⭐⭐⭐ 必需 |
| `viewport` | 响应式视口设置 | ⭐⭐⭐ 移动端必需 |
| `description` | 页面描述（显示在搜索结果中） | ⭐⭐⭐ 影响点击率 |
| `keywords` | 关键词（现代搜索引擎已忽略） | ⭐ 可选 |
| `robots` | 爬虫索引指令 | ⭐⭐ SEO 必需 |
| `author` | 作者信息 | ⭐ 可选 |

**robots 指令详解：**

```html
<meta name="robots" content="index, follow">           <!-- 允许索引，跟踪链接 -->
<meta name="robots" content="noindex, follow">        <!-- 禁止索引，但跟踪链接 -->
<meta name="robots" content="index, nofollow">        <!-- 允许索引，但不跟踪链接 -->
<meta name="robots" content="noindex, nofollow">      <!-- 完全禁止 -->
<meta name="robots" content="noarchive">              <!-- 禁止显示缓存版本 -->
<meta name="robots" content="max-snippet:160">        <!-- 限制摘要长度 -->
```

---

### 9.2 Open Graph 协议（社交媒体优化）

**什么是 Open Graph？**

Open Graph 是由 Facebook 在 2010 年推出的协议，用于将网页转换为社交媒体中的「富卡片」内容。通过在 HTML 中添加特定的 `<meta>`标签，可以控制链接在社交媒体（微信、微博、Facebook、Twitter、LinkedIn 等）中显示的标题、描述、图片等信息。

**为什么需要 Open Graph？**

```
没有 Open Graph:                    有 Open Graph:
┌─────────────────────┐            ┌─────────────────────┐
│ example.com         │            │ [  精美预览图片  ]  │
│                     │            │                     │
│ (仅显示 URL 和        │            │  文章标题           │
│  随机抓取的内容)     │            │  文章描述摘要...    │
│                     │            │  example.com        │
└─────────────────────┘            └─────────────────────┘
```

**核心 Open Graph 标签：**

```html
<head>
    <!-- 基础 Open Graph -->
    <meta property="og:title" content="页面标题（建议 60 字符以内）">
    <meta property="og:description" content="页面描述（建议 150-160 字符）">
    <meta property="og:image" content="https://example.com/thumbnail.jpg">
    <meta property="og:url" content="https://example.com/page-path">

    <!-- 可选但推荐 -->
    <meta property="og:type" content="website">         <!-- 或 article、product 等 -->
    <meta property="og:site_name" content="网站名称">
    <meta property="og:locale" content="zh_CN">

    <!-- 图片优化（推荐） -->
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="图片描述">
</head>
```

**og:type 常用值：**

| 值 | 说明 | 使用场景 |
|----|------|----------|
| `website` | 网站 | 通用网站、首页 |
| `article` | 文章 | 博客文章、新闻 |
| `product` | 产品 | 电商产品页 |
| `profile` | 个人资料 | 用户主页 |
| `video` | 视频 | 视频内容 |

**Twitter Cards 专用标签：**

```html
<head>
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">  <!-- 大卡片 -->
    <meta name="twitter:site" content="@twitterhandle">       <!-- 网站 Twitter 账号 -->
    <meta name="twitter:creator" content="@creatorhandle">    <!-- 内容作者账号 -->
    <meta name="twitter:title" content="页面标题">
    <meta name="twitter:description" content="页面描述">
    <meta name="twitter:image" content="缩略图 URL">
    <meta name="twitter:image:alt" content="图片描述">        <!-- 无障碍访问 -->
</head>
```

**Twitter Card 类型对比：**

| 类型 | 属性值 | 显示效果 |
|------|--------|----------|
| Summary | `summary` | 小缩略图 + 标题 + 描述 |
| Summary Large Image | `summary_large_image` | 大横幅图片 + 标题 + 描述 |

---

### 9.3 结构化数据（Schema.org）

**什么是结构化数据？**

结构化数据（Structured Data）是一种标准化的格式，用于向搜索引擎提供关于页面内容的额外上下文信息。通过使用 Schema.org 词汇表，可以让搜索引擎更准确地理解页面内容，从而在搜索结果中显示「富摘要」（Rich Snippets）。

**为什么需要结构化数据？**

```
普通搜索结果：
┌────────────────────────────────────────┐
│ 文章标题                               │
│ example.com/article                    │
│ 文章描述摘要...                        │
└────────────────────────────────────────┘

带结构化数据的富摘要：
┌────────────────────────────────────────┐
│ 文章标题                    ⭐⭐⭐⭐⭐ 4.8 │
│ example.com/article         作者：张三 │
│ 文章描述摘要...        📅 2026-03-24   │
│                            ⏱️ 8 分钟阅读  │
└────────────────────────────────────────┘
```

**JSON-LD 格式（Google 推荐）：**

JSON-LD（JavaScript Object Notation for Linked Data）是 Google 推荐的结构化数据格式，通过 `<script>` 标签嵌入 HTML 中。

**文章类型（Article）示例：**

```html
<head>
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "HTML5 语义化标签详解",
        "description": "深入讲解 HTML5 语义化标签的使用",
        "image": [
            "https://example.com/thumbnail.jpg"
        ],
        "author": {
            "@type": "Person",
            "name": "张三",
            "url": "https://example.com/author/zhangsan"
        },
        "publisher": {
            "@type": "Organization",
            "name": "前端技术博客",
            "logo": {
                "@type": "ImageObject",
                "url": "https://example.com/logo.png"
            }
        },
        "datePublished": "2026-03-24",
        "dateModified": "2026-03-24T10:30:00+08:00"
    }
    </script>
</head>
```

**产品类型（Product）示例：**

```html
<script type="application/ld+json">
{
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "无线蓝牙耳机",
    "image": [
        "https://example.com/product.jpg"
    ],
    "description": "高品质无线蓝牙耳机，降噪功能",
    "sku": "WH-1000XM5",
    "brand": {
        "@type": "Brand",
        "name": "Sony"
    },
    "review": {
        "@type": "Review",
        "reviewRating": {
            "@type": "Rating",
            "ratingValue": "4.5",
            "bestRating": "5"
        },
        "author": {
            "@type": "Person",
            "name": "李四"
        }
    },
    "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "128"
    },
    "offers": {
        "@type": "Offer",
        "url": "https://example.com/product",
        "priceCurrency": "CNY",
        "price": "1299.00",
        "priceValidUntil": "2026-12-31",
        "itemCondition": "https://schema.org/NewCondition",
        "availability": "https://schema.org/InStock",
        "seller": {
            "@type": "Organization",
            "name": "官方旗舰店"
        }
    }
}
</script>
```

**面包屑导航（BreadcrumbList）示例：**

```html
<script type="application/ld+json">
{
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
        {
            "@type": "ListItem",
            "position": 1,
            "name": "首页",
            "item": "https://example.com/"
        },
        {
            "@type": "ListItem",
            "position": 2,
            "name": "技术文章",
            "item": "https://example.com/tech/"
        },
        {
            "@type": "ListItem",
            "position": 3,
            "name": "HTML5 语义化标签详解",
            "item": "https://example.com/tech/html5-semantic-tags"
        }
    ]
}
</script>
```

**结构化数据验证工具：**

- [Google Rich Results Test](https://search.google.com/test/rich-results) - 验证富摘要资格
- [Schema Markup Validator](https://validator.schema.org/) - 通用 Schema.org 验证

---

### 9.4 favicon 与品牌标识

```html
<head>
    <!-- 标准 favicon（多尺寸支持） -->
    <link rel="icon" href="/favicon.ico" sizes="any">
    <link rel="icon" href="/icon.svg" type="image/svg+xml">

    <!-- Apple Touch Icon（iOS 设备） -->
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon-180x180.png">

    <!-- PWA Manifest -->
    <link rel="manifest" href="/manifest.json">

    <!-- 主题色（浏览器 UI 颜色） -->
    <meta name="theme-color" content="#3B82F6">
</head>
```

**推荐尺寸清单：**

| 用途 | 尺寸 | 格式 |
|------|------|------|
| 浏览器标签页 | 16x16, 32x32 | ICO, PNG |
| Android Chrome | 192x192, 512x512 | PNG |
| iOS Safari | 180x180 | PNG |
| SVG favicon | 任意（矢量） | SVG |

---

### 9.5 规范链接（Canonical URL）

**什么是规范链接？**

规范链接（Canonical URL）用于告诉搜索引擎：当同一内容存在多个 URL 时，哪个是「官方」版本。这对于防止重复内容导致的 SEO 问题至关重要。

**使用场景：**

```
场景：同一篇文章可通过多个 URL 访问
- https://example.com/article/123
- https://example.com/article/123?utm_source=wechat
- https://example.com/article/123?ref=twitter
- https://m.example.com/article/123（移动版）

解决：在所有版本中添加
<link rel="canonical" href="https://example.com/article/123">
```

**正确使用方式：**

```html
<!-- ✅ 正确：指向自己（当前页面的规范版本） -->
<head>
    <link rel="canonical" href="https://example.com/article/123">
</head>

<!-- ❌ 错误：指向其他页面（除非是跨站转载） -->
<head>
    <link rel="canonical" href="https://other-site.com/article/123">
</head>
```

---

### 9.6 SEO 最佳实践检查清单

```
□ 基础元数据
  □ charset 声明在<head>最前面
  □ viewport 设置正确
  □ description 在 150-160 字符之间
  □ title 在 50-60 字符之间

□ Open Graph
  □ og:title 设置
  □ og:description 设置
  □ og:image 设置（推荐 1200x630）
  □ og:url 设置
  □ og:type 设置
  □ Twitter Card 标签（如需要）

□ 结构化数据
  □ JSON-LD 格式正确
  □ @context 和@type 设置
  □ 通过 Google Rich Results 验证

□ 其他
  □ favicon 配置完整
  □ canonical URL 设置
  □ 图片有 alt 属性
  □ 使用语义化标签
```

---

## 10. 无障碍访问

### 10.1 ARIA 属性

```html
<!-- 角色定义 -->
<div role="button" aria-pressed="false">切换按钮</div>
<div role="navigation">导航</div>
<div role="main">主要内容</div>
<div role="alert">重要提示</div>

<!-- 状态定义 -->
<button aria-expanded="false" aria-controls="menu">菜单</button>
<ul id="menu" hidden>...</ul>

<!-- 标签定义 -->
<input type="text" aria-label="搜索">
<input type="text" aria-labelledby="search-label">
<span id="search-label">搜索</span>

<!-- 描述定义 -->
<button aria-describedby="btn-desc">删除</button>
<p id="btn-desc">此操作不可撤销</p>
```

### 10.2 常用 ARIA 角色

| 角色 | 说明 |
|------|------|
| `role="button"` | 按钮 |
| `role="link"` | 链接 |
| `role="navigation"` | 导航区域 |
| `role="main"` | 主要内容区域 |
| `role="complementary"` | 辅助内容（侧边栏） |
| `role="contentinfo"` | 页面信息（页脚） |
| `role="alert"` | 重要提示信息 |
| `role="dialog"` | 对话框 |
| `role="tab/tabpanel"` | 选项卡 |
| `role="menu/menuitem"` | 菜单 |

### 10.3 无障碍最佳实践

```html
<!-- 图片必须有 alt -->
<img src="logo.png" alt="公司 Logo">

<!-- 表单必须有 label -->
<label for="email">邮箱</label>
<input type="email" id="email" name="email">

<!-- 视频必须有字幕 -->
<video>
    <track src="subtitles.vtt" kind="subtitles" srclang="zh">
</video>

<!-- 跳过导航链接 -->
<a href="#main" class="skip-link">跳到主要内容</a>

<!-- 颜色对比度足够 -->
<!-- 使用工具检查：https://web.dev/color-contrast/ -->
```

---

## 附录：标签速查表

### 块级元素

```
<div> <p> <h1>-<h6> <ul> <ol> <li> <dl> <dt> <dd>
<section> <article> <aside> <nav> <header> <footer> <main>
<form> <table> <blockquote> <pre> <hr> <address> <figure>
```

### 行内元素

```
<span> <a> <strong> <em> <code> <img> <input> <label>
<br> <sub> <sup> <mark> <del> <ins> <small> <q>
```

### 自闭合标签

```
<br> <hr> <img> <input> <meta> <link> <base> <area> <col> <source> <track>
```

---

*文档创建日期：2026-03-24*
