# Taro 跨端框架核心知识体系

> **一句话描述：** Taro 是京东出品的开放式跨端跨框架解决方案，支持使用 React/Vue/Nerv 等框架开发微信小程序、H5、React Native、鸿蒙等 10+ 平台应用
> **特色：** 编译时 + 运行时双重架构、多框架支持、渐进式迁移、AI 增强编译

**版本：** 1.0.0
**创建时间：** 2026-03-28
**最后更新：** 2026-03-28
**调研状态：** 进行中

---

## 目录

1. [概述](#1-概述)
2. [核心概念](#2-核心概念)
3. [快速入门](#3-快速入门)
4. [基础用法](#4-基础用法)
5. [高级特性](#5-高级特性)
6. [跨端部署](#6-跨端部署)
7. [微信云开发集成](#7-微信云开发集成)
8. [性能优化与最佳实践](#8-性能优化与最佳实践)

---

## 1. 概述

### 1.1 什么是 Taro

**定义：** Taro（Multi-terminal Unified solution）是由京东凹凸实验室（Aotu）于 2018 年开源的跨端开发框架，其核心理念是**"一次编写，多端运行"**——使用同一套代码、同一套技术栈，构建可在多个平台运行的应用。

**支持的平台：**
- 小程序：微信小程序、京东小程序、支付宝小程序、百度小程序、字节跳动小程序、QQ 小程序、飞书小程序、快手小程序
- Web：H5 移动端/PC 端
- 移动应用：React Native、HarmonyOS（鸿蒙）
- 其他：快应用、ASC F 元服务

**核心特点：**

| 特点 | 说明 |
|------|------|
| **多框架支持** | 支持 React、Vue 2/3、Nerv 等多种框架，团队可根据技术栈自由选择 |
| **多端适配** | 一套代码编译到 10+ 平台，保持各端体验一致性 |
| **渐进式迁移** | 支持现有小程序项目逐步迁移到 Taro，降低迁移成本 |
| **开放式生态** | 插件系统支持自定义平台适配，社区共建扩展 |
| **AI 增强** | 2025 年新增 AI 代码助手，支持自动代码优化与组件推荐 |

### 1.2 技术演进历程

Taro 的发展史是前端跨端解决方案从探索到成熟的缩影，共经历了 6 个主要阶段：

#### Taro 1.x：静态编译时代（2018-2019）

**核心特征：** 基于 AST 静态编译的跨端转换

**架构原理：**
```
源代码 (JSX) → Babel 解析为 AST → 静态模板转换 → 各端原生代码 (WXML/HTML)
```

**版本里程碑：**
- 1.0：支持微信小程序、H5
- 1.1：扩展至百度、支付宝小程序
- 1.2：支持字节跳动小程序，引入 CSS Modules
- 1.3：支持快应用、QQ 小程序，全面拥抱 Hooks 与 JSX 语法

**技术局限：**
- 强依赖编译时，运行时灵活性差
- 组件库与框架深度耦合（Taro UI 仅支持 React）
- 语法限制多，不支持动态特性
- 调试体验差

**类比：** 像用翻译软件写小说——意思对但文采全失

#### Taro 2.x：构建工具升级（2020）

**核心特征：** 构建系统从自研转向 Webpack

**架构升级：**
- 放弃自研构建工具，全面采用 Webpack 4
- 引入 Tree Shaking 等现代前端工程化能力
- 开始尝试解耦组件库与框架

**技术债务：**
- 编译速度慢
- 调试体验差
- 官方逐步停止维护

#### Taro 3.x：重运行时架构革命（2020-2021）

**核心特征：** 从编译时转向重运行时，架构演进的"升维打击"

**架构重构：**
```
源代码 → 运行时虚拟 DOM → 平台适配层 → 各端原生渲染
```

**核心突破：**
- 引入虚拟 DOM 与运行时适配层
- 不再依赖静态模板转换
- 通过运行时桥接技术实现多端渲染
- 内置支持 React、Vue 2/3、Nerv，实现真正的"框架无关"

**性能优化：**
- H5 端采用 Web Components 构建
- 大幅提升 H5 性能与跨端一致性
- 京东内部数据：组件复用率提升 70%，开发效率提升 40%

#### Taro 4.x：开放式生态与性能极致（2022-2024）

**核心特征：** 开放式插件系统与编译性能突破

**关键技术升级：**

| 升级项 | 效果 |
|--------|------|
| 集成 Rust 编写的 SWC 编译器 | 编译速度提升 40%，包体积减少 30% |
| 开放式插件系统 | 支持开发者自定义端平台适配 |
| 鸿蒙支持 | 正式支持 HarmonyOS，通过 C-API 实现高性能渲染 |

#### Taro 5.x & 6.x：智能化与云原生（2025-至今）

**核心特征：** AI 辅助开发与云原生集成

**新增特性：**
- AI 代码助手：支持自动代码优化与组件推荐
- AI 增强编译链：通过机器学习预测平台差异点，编译速度提升 35%
- 云原生集成：与微信云开发等 Serverless 平台深度整合

### 1.3 主流跨端框架对比

#### 核心框架对比

| 框架 | 核心技术 | 优势 | 劣势 | 适用场景 |
|------|----------|------|------|----------|
| **Taro** | 编译时 + 运行时混合架构 | React 生态友好、多端适配能力强、可扩展性强 | 多端适配需手动处理、社区规模较小 | 已有 React 技术栈、需扩展至小程序或鸿蒙 |
| **uni-app** | Vue + 自研引擎 | 跨平台能力强、开发效率高、中文文档完善 | 性能瓶颈、平台限制 | 快速覆盖小程序+App+H5、电商/教育类应用 |
| **Flutter** | Dart + Skia 渲染引擎 | 高性能、UI 高度自定义、热重载 | 学习成本高、包体积大 (10-20MB) | 高性能、复杂交互应用 (直播/游戏化) |
| **React Native** | JavaScript + 原生桥接 | 热重载、生态庞大、代码复用率高 | 性能瓶颈、原生模块开发复杂 | 快速迭代产品、已有 React 团队 |

#### 框架选型决策树

```
1. 团队技术栈是什么？
   ├─ React → Taro / React Native
   ├─ Vue → uni-app / Taro(Vue 版)
   └─ 无偏好 → 继续评估

2. 目标平台有哪些？
   ├─ 小程序为主 → Taro / uni-app
   ├─ App 为主 → Flutter / React Native
   └─ 全平台 → uni-app / Flutter

3. 性能要求如何？
   ├─ 高性能/复杂动画 → Flutter
   ├─ 中等性能 → Taro / React Native
   └─ 一般业务 → uni-app / Taro

4. 开发周期要求？
   ├─ 快速上线 → uni-app
   └─ 可接受较长周期 → Flutter / 原生
```

### 1.4 Taro 的核心优势

#### 1.4.1 对开发者友好

- **熟悉的技术栈**：使用 React/Vue 等熟悉框架，学习成本低
- **完整的 ESLint 支持**：自定义 ESLint 规则，代码质量有保障
- **TypeScript 支持**：类型安全和运行时检测
- **自动补全**：ES6+ 语法支持，IDE 友好

#### 1.4.2 多端统一能力

- **API 统一**：封装不同平台的原生 API 差异
- **组件统一**：一套组件多端运行
- **样式统一**：支持 CSS 预处理器、CSS Modules

#### 1.4.3 企业级应用支持

- **状态管理**：集成 Redux、Mobx、Vuex 等
- **路由系统**：声明式路由配置
- **按需加载**：代码拆分、懒加载
- **调试工具**：Taro Debugger、Chrome DevTools

### 1.5 典型应用场景

| 场景类型 | 说明 | 案例 |
|----------|------|------|
| **多端电商** | 一套代码同时运行于小程序、H5、App | 京东京喜、沃尔玛小程序 |
| **内容资讯** | 需要动态化更新的内容类应用 | 新闻媒体、博客平台 |
| **工具应用** | 功能明确、交互相对简单 | 计算器、日历、待办 |
| **企业应用** | 内部系统、OA、CRM | 企业微信应用、钉钉小程序 |
| **教育应用** | 在线课程、题库、考试系统 | 各类教育培训小程序 |

### 1.6 为什么不选择其他方案？

#### vs 原生开发

| 维度 | 原生开发 | Taro |
|------|----------|------|
| 开发成本 | 多套代码，成本高 | 一套代码，成本低 |
| 维护成本 | 多团队维护 | 单团队维护 |
| 迭代速度 | 各端独立发版 | 统一发版 |
| 性能 | 最优 | 接近原生 (90%+) |
| 学习曲线 | 多语言 | 单一技术栈 |

#### vs 小程序原生开发

小程序原生开发的痛点：
- 代码组织复杂：一个页面需要 4 个文件（wxml/js/wxss/json）
- 规范不统一：组件、方法命名混乱
- 孱弱的字符串模板：不支持 ESLint
- 依赖管理混乱：缺少 npm 包依赖管理
- 落后的开发方式：无 webpack 打包、CSS 预处理等

Taro 的解决方案：
- 单文件组件（.tsx/.vue）
- 完整的 ESLint 支持
- npm 依赖管理
- 现代前端工程化（webpack、Babel、CSS 预处理器）

---

*第 1 章完成 | 下一章：[核心概念](#2-核心概念)*

---

## 2. 核心概念

### 2.1 整体架构设计

**定义：** Taro 采用**三层架构**设计，从下到上依次为：基础层、核心层、应用层。这种分层设计的核心思想是**"统一输入，差异化输出"**——编译时根据目标平台生成差异化代码，运行时通过适配层抹平各端执行环境差异。

#### 2.1.1 三层架构详解

```
┌─────────────────────────────────────────────────────────┐
│                    应用层 (Application)                   │
│  开发者编写的业务代码，支持 React/Vue 语法                    │
│  与纯前端开发体验一致                                      │
├─────────────────────────────────────────────────────────┤
│                    核心层 (Core)                          │
│  ┌─────────────┐              ┌─────────────┐            │
│  │   编译时     │              │    运行时    │            │
│  │  通用代码→各端 │              │  跨平台 API  │            │
│  │  可识别代码   │              │  和渲染能力  │            │
│  └─────────────┘              └─────────────┘            │
├─────────────────────────────────────────────────────────┤
│                    基础层 (Foundation)                     │
│  对各端原生能力的封装，屏蔽不同平台的 API 差异                   │
│  向上提供统一的调用接口                                    │
└─────────────────────────────────────────────────────────┘
```

**各层职责：**

| 层级 | 职责 | 核心模块 |
|------|------|----------|
| **应用层** | 开发者业务代码 | React/Vue 组件、页面、状态管理 |
| **核心层** | 编译时 + 运行时 | @tarojs/cli、@tarojs/runtime、@tarojs/components |
| **基础层** | 原生能力封装 | 平台适配器、API 统一封装 |

#### 2.1.2 编译时与运行时协作流程

Taro 的跨端能力依赖于**编译时转换**和**运行时适配**两大核心机制：

```
源代码 (JS/JSX/TS/Vue)
        │
        ▼
   ┌─────────┐
   │  编译时  │ Babel/AST 操作
   └─────────┘
        │
        ▼
平台特定代码 (WXML/WXSS/JS 或 HTML/CSS/JS)
        │
        ▼
   ┌─────────┐
   │  运行时  │ 虚拟 DOM/API/事件
   └─────────┘
        │
        ▼
  小程序/H5/RN 渲染
```

**简单来说：**
- **编译时**负责"翻译"代码——将源代码静态转换成目标平台能识别的代码结构
- **运行时**负责"执行"翻译后的代码——在目标环境抹平差异，提供一致的执行环境

### 2.2 编译原理深度解析

#### 2.2.1 编译时核心流程

编译时是 Taro 工作的第一个阶段，在执行 `taro build` 命令时发生，主要任务是将 React/Vue 等框架代码静态转换成目标平台所能识别的代码结构。

**完整编译流程：**

```
1. 代码解析 (Parsing)
   ↓
2. AST 转换 (Transformation)
   ↓
3. 代码生成 (Generation)
   ↓
4. 文件拆分 (Splitting)
```

#### 2.2.2 代码解析与 AST 转换

**步骤 1：JSX 解析为 AST**

Taro 使用 `@babel/parser` 将 JSX 代码解析为抽象语法树 (AST)：

```jsx
// 源代码
function App() {
  return (
    <View className="container">
      <Text>Hello Taro</Text>
    </View>
  );
}
```

经过 `@babel/parser` 解析后生成的 AST（简化版）：

```json
{
  "type": "JSXElement",
  "openingElement": {
    "name": { "name": "View" },
    "attributes": [{
      "name": "className",
      "value": "container"
    }]
  },
  "children": [{
    "type": "JSXElement",
    "openingElement": {
      "name": { "name": "Text" }
    },
    "children": [{
      "type": "JSXText",
      "value": "Hello Taro"
    }]
  }]
}
```

**步骤 2：AST 遍历与转换**

通过 `@babel/traverse` 遍历 AST，将其转化为目标平台代码：

```javascript
// 组件名映射配置
const componentMap = {
  'View': { 'weapp': 'view', 'h5': 'div', 'rn': 'View' },
  'Text': { 'weapp': 'text', 'h5': 'span', 'rn': 'Text' }
};

// AST 转换逻辑（简化）
function transformJSXElement(path, platform) {
  const componentName = path.node.name.name;
  const targetComponent = componentMap[componentName]?.[platform];
  if (targetComponent) {
    path.node.name.name = targetComponent;
  }
}
```

**步骤 3：目标代码生成**

转换完成后，生成各平台特定代码：

```jsx
// 微信小程序目标代码 (WXML)
<view class="container">
  <text>Hello Taro</text>
</view>

// H5 目标代码 (HTML)
<div class="container">
  <span>Hello Taro</span>
</div>

// React Native 目标代码 (JSX)
<View style={styles.container}>
  <Text>Hello Taro</Text>
</View>
```

#### 2.2.3 Babel 插件系统

Taro 的编译依赖一套完整的 Babel 插件系统：

```javascript
// babel-preset-taro 配置示例
module.exports = {
  presets: [
    ['@babel/preset-env', { modules: false }],
    '@babel/preset-typescript',
    '@babel/preset-react'
  ],
  plugins: [
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-transform-class-properties', { loose: true }],
    '@babel/plugin-transform-runtime',
    'babel-plugin-transform-taro-components',  // Taro 自定义组件转换
    'babel-plugin-transform-imports-api'       // API 导入转换
  ]
};
```

**核心插件说明：**

| 插件 | 作用 |
|------|------|
| `babel-plugin-transform-taro-components` | 将 Taro 组件转换为目标平台组件 |
| `babel-plugin-transform-imports-api` | 将 Taro API 导入转换为平台特定导入 |
| `@babel/preset-typescript` | TypeScript 语法支持 |
| `@babel/preset-react` | JSX 语法支持 |

#### 2.2.4 文件拆分与样式处理

**文件拆分规则：**

对于单文件组件，Taro 会根据目标平台要求拆分为多个文件：

```
src/pages/index/index.tsx
        ↓
dist/weapp/pages/index/index.js    // 逻辑
dist/weapp/pages/index/index.wxml  // 结构
dist/weapp/pages/index/index.wxss  // 样式
dist/weapp/pages/index/index.json  // 配置
```

**样式单位转换：**

```javascript
// PostCSS 插件处理
// 源代码
.container {
  width: 375px;
  height: 100px;
}

// 小程序目标代码 (px → rpx)
.container {
  width: 750rpx;
  height: 200rpx;
}

// H5 目标代码 (px → rem)
.container {
  width: 23.4375rem;
  height: 6.25rem;
}
```

### 2.3 运行时架构与虚拟 DOM

#### 2.3.1 运行时核心任务

运行时的核心任务是**抹平不同平台的差异**，为业务代码提供一致的执行环境：

1. **虚拟 DOM 维护**：维护一套与平台无关的虚拟 DOM 树
2. **差异计算**：计算虚拟 DOM 变化并生成更新指令
3. **平台适配**：通过适配器将更新指令转换为目标平台操作
4. **API 统一**：封装平台 API 差异，提供统一调用接口

#### 2.3.2 虚拟 DOM 层实现

Taro 实现跨平台渲染的关键是抽象了一套**与平台无关的虚拟 DOM (VNode)**，再通过各端的渲染器将 VNode 转换为对应平台的原生节点。

**VNode 核心结构：**

```typescript
// packages/taro-runtime/src/dom/element.ts
class VNode {
  public tag: string        // 节点标签：view/div(统一抽象)
  public props: Record<string, any>  // 节点属性
  public children: VNode[]  // 子节点
  public key: string | null // 节点唯一标识
  public platformTag: string | null  // 平台专属标签 (编译时填充)

  constructor(tag: string, props: any, children: VNode[], key?: string) {
    this.tag = tag
    this.props = props
    this.children = children
    this.key = key
  }
}
```

**各端渲染器适配：**

```typescript
const renderers = {
  // 小程序渲染器：将 VNode 转换为小程序模板和 setData 数据
  miniProgram: (vnode: VNode) => {
    // 转换标签：Taro 统一的 view → 小程序原生 view
    vnode.platformTag = mapTagToMiniProgram(vnode.tag)
    // 生成小程序模板字符串 (编译时输出到 wxml)
    const template = generateMiniProgramTemplate(vnode)
    // 生成 setData 需要的数据 (运行时更新)
    const data = generateMiniProgramData(vnode)
    return { template, data }
  },

  // H5 渲染器：转换为 DOM 节点
  h5: (vnode: VNode) => {
    vnode.platformTag = mapTagToH5(vnode.tag)  // view → div
    const el = document.createElement(vnode.platformTag)
    // 设置属性、挂载子节点...
    return el
  },

  // React Native 渲染器
  rn: (vnode: VNode) => {
    // 转换为 RN 组件
    return convertToRNComponent(vnode)
  }
}
```

#### 2.3.3 DOM/BOM API 抽象

Taro 在运行时实现了完整的 DOM/BOM API 抽象，使得 React/Vue 能够在小程序等无 DOM 环境中运行：

**DOM 抽象层实现：**

```typescript
// packages/taro-runtime/src/dom/element.ts
export class TaroElement extends TaroNode {
  public tagName: string
  public props: Record<string, any> = {}
  public style: Style
  public dataset: Record<string, any> = {}

  constructor(tagName: string, ownerDocument: TaroDocument) {
    super(ownerDocument)
    this.tagName = tagName.toUpperCase()
    this.style = new Style(this)
  }

  // 事件处理机制
  public addEventListener(type: string, listener: EventListener) {
    // 实现事件监听
  }

  public setAttribute(name: string, value: any) {
    this.props[name] = value
    this.triggerUpdate()
  }
}
```

**BOM (Browser Object Model) 抽象：**

```typescript
// packages/taro-runtime/src/bom/window.ts
export const taroWindowProvider = {
  // 实现 window 对象的方法
  location: taroLocationProvider,
  history: taroHistoryProvider,
  navigator: nav,
  document: taroDocumentProvider,

  // 定时器相关
  setTimeout: (handler: TimerHandler, timeout?: number) => {
    return nativeSetTimeout(handler, timeout)
  },

  // 其他 BOM API
  addEventListener: (type: string, listener: EventListener) => {
    // 全局事件监听
  }
}
```

### 2.4 Hooks 实现机制

#### 2.4.1 Hooks 链表结构

Taro 中的 Hooks 实现与 React 类似，基于**链表结构**存储每个 Hook 的状态：

```typescript
// Hook 对象结构（简化版）
interface Hook {
  memoizedState: any    // 存储当前 Hook 的状态 (如 state、effect)
  baseState: any        // 基础状态 (用于更新合并)
  baseQueue: any        // 基础更新队列
  queue: any            // 当前 Hook 的更新队列
  next: Hook | null     // 指向下一个 Hook 节点 (形成链表)
}
```

**Hooks 链表工作原理：**

```
fiber.memoizedState (链表头)
       │
       ▼
┌──────────────┐
| Hook 1       |  ← useState(0)
| memoizedState│
| next ────────┼──┐
└──────────────┘  │
                  ▼
           ┌──────────────┐
           | Hook 2       |  ← useEffect(...)
           | memoizedState│
           | next ────────┼──┐
           └──────────────┘  │
                             ▼
                      ┌──────────────┐
                      | Hook 3       |  ← useRef(null)
                      | memoizedState│
                      | next: null   │
                      └──────────────┘
```

**关键规则：**
- 每个函数组件实例对应一个 `fiber.memoizedState`，它是 Hook 链表头节点
- 组件首次渲染时，每个 Hook 被依次创建并串联成链表（Mount 阶段）
- 后续更新时，按顺序复用这些 Hook 节点（Update 阶段）
- **调用顺序必须一致**，否则会导致状态错乱

#### 2.4.2 useState 实现原理

**定义：** `useState` 是函数组件状态管理的基石，允许在无状态的函数组件中添加状态。

**源码实现（简化版）：**

```typescript
// useState 基于 useReducer 实现
export const useState = <T>(initialState: T | (() => T)) => {
  return useReducer<T, SetStateAction<T>>(null, initialState)
}

// useReducer 核心逻辑
function useReducer(reducer: any, initialState: any) {
  // 1. 获取或创建当前 Hook 节点
  const hook = currentHook = workInProgressHook

  // 2. Mount 阶段：初始化状态
  if (currentFiber.isMount) {
    hook.memoizedState = hook.baseState = initialState
    hook.queue = []
  }
  // 3. Update 阶段：复用状态并处理更新队列
  else {
    const queue = hook.queue
    hook.baseState = queue.reduce(
      (state: any, action: any) => reducer ? reducer(state, action) : action,
      hook.baseState
    )
    hook.memoizedState = hook.baseState
    hook.queue = []
  }

  // 4. 返回 [state, setState] 对
  return [hook.memoizedState, dispatchAction.bind(null, hook.queue)]
}
```

**使用示例：**

```tsx
import { useState } from '@tarojs/taro'

function Counter() {
  const [count, setCount] = useState(0)

  return (
    <View>
      <Text>你点击了 {count} 次</Text>
      <Button onClick={() => setCount(count + 1)}>
        点击 +1
      </Button>
    </View>
  )
}
```

**注意事项：**
1. `setCount` 是异步的，多次调用会合并更新
2. 如需基于前一个状态计算，应使用函数形式：`setCount(prev => prev + 1)`
3. 初始值可以是函数，实现惰性初始化：`useState(() => expensiveCalculation())`

#### 2.4.3 useEffect 实现原理

**定义：** `useEffect` 允许函数组件执行副作用操作（如数据获取、订阅、DOM 操作），相当于类组件中 `componentDidMount`、`componentDidUpdate` 和 `componentWillUnmount` 的组合。

**源码实现（简化版）：**

```typescript
export const useEffect = (
  cb: EffectCallback,
  deps?: DependencyList
) => {
  return effectImpl(cb, deps!, 'effect')
}

function effectImpl(cb: any, deps: any, type: string) {
  const hook = currentHook = workInProgressHook

  // 检查依赖是否变化
  const hasDepsChange = depsChanged(hook.deps, deps)

  if (currentFiber.isMount || hasDepsChange) {
    // 存储依赖和回调
    hook.deps = deps
    hook.memoizedState = cb

    // 将 effect 加入队列等待执行
    scheduleEffect({
      type,
      create: cb,
      deps
    })
  }
}
```

**依赖数组规则：**

```typescript
// 空数组 []：仅在组件挂载和卸载时执行
useEffect(() => {
  console.log('Mount')
  return () => console.log('Unmount')
}, [])

// 包含变量 [count]：当 count 变化时执行
useEffect(() => {
  console.log('count changed:', count)
}, [count])

// 不提供依赖数组：每次渲染后都执行
useEffect(() => {
  console.log('Every render')
})
```

**常见误区：**

❌ **错误做法：**
```tsx
// 缺少依赖导致闭包陷阱
useEffect(() => {
  const timer = setInterval(() => {
    console.log(count)  // 始终是初始值 0
  }, 1000)
  return () => clearInterval(timer)
}, [])
```

✅ **正确做法：**
```tsx
// 方案 1：添加依赖
useEffect(() => {
  const timer = setInterval(() => {
    console.log(count)
  }, 1000)
  return () => clearInterval(timer)
}, [count])

// 方案 2：使用函数式更新
useEffect(() => {
  const timer = setInterval(() => {
    setCount(prev => console.log(prev))
  }, 1000)
  return () => clearInterval(timer)
}, [])

// 方案 3：使用 ref 保存最新值
const countRef = useRef(count)
countRef.current = count

useEffect(() => {
  const timer = setInterval(() => {
    console.log(countRef.current)
  }, 1000)
  return () => clearInterval(timer)
}, [])
```

### 2.5 多端适配机制

#### 2.5.1 平台差异抹平策略

**策略 1：组件映射**

```typescript
// 组件映射配置
const componentConfig = {
  'view': {
    'weapp': { name: 'view', props: {} },
    'h5': { name: 'div', props: {} },
    'rn': { name: 'View', props: {} },
    'harmony': { name: 'Column', props: {} }
  },
  'text': {
    'weapp': { name: 'text', props: {} },
    'h5': { name: 'span', props: {} },
    'rn': { name: 'Text', props: {} }
  }
}
```

**策略 2：API 统一封装**

```typescript
// Taro API 统一封装
import Taro from '@tarojs/taro'

// 统一调用，内部根据平台自动适配
Taro.request({
  url: '/api/data',
  method: 'GET'
})

// 内部实现（简化）
function request(options) {
  // #ifdef MP-WEIXIN
  return wx.request(options)
  // #endif

  // #ifdef H5
  return fetch(options.url, { method: options.method })
  // #endif

  // #ifdef RN
  return rnFetch(options)
  // #endif
}
```

**策略 3：样式单位转换**

| 平台 | 单位 | 转换规则 |
|------|------|----------|
| 小程序 | rpx | 1px = 2rpx (750rpx = 100% 屏幕宽度) |
| H5 | rem/vw | 基于根字体或视口宽度 |
| React Native | dp | 逻辑像素单位 |

### 2.6 常见误区与注意事项

#### 2.6.1 编译时误区

**误区 1：认为编译时可以处理所有动态逻辑**

❌ 错误理解：
```tsx
// 编译时无法处理完全动态的组件名
const ComponentName = someCondition ? View : Text
<ComponentName />  // 可能无法正确转换
```

✅ 正确做法：
```tsx
// 使用条件渲染
{someCondition ? <View /> : <Text />}
```

#### 2.6.2 运行时误区

**误区 2：直接操作 DOM**

❌ 错误做法（在小程序环境）：
```tsx
document.querySelector('.my-class')  // 小程序无 DOM
```

✅ 正确做法：
```tsx
// 使用 Taro 提供的 API
Taro.createSelectorQuery().select('.my-class')
```

#### 2.6.3 Hooks 误区

**误区 3：条件调用 Hooks**

❌ 错误做法：
```tsx
if (condition) {
  const [count, setCount] = useState(0)  // 违反 Hooks 规则
}
```

✅ 正确做法：
```tsx
const [count, setCount] = useState(0)  // 始终在顶层调用
if (condition) {
  // 在 Hook 内部处理条件逻辑
}
```

---

*第 2 章完成 | 下一章：[快速入门](#3-快速入门)*

---

## 3. 快速入门

### 3.1 环境要求与安装

#### 3.1.1 环境要求

在开始使用 Taro 之前，确保你的开发环境满足以下要求：

| 依赖 | 版本要求 | 说明 |
|------|----------|------|
| **Node.js** | >= 16.20.0 | 推荐使用 LTS 版本，可用 nvm 管理 |
| **npm** | >= 8 | 随 Node.js 一起安装 |
| **pnpm** (可选) | >= 7 | 推荐使用，更快的依赖安装速度 |
| **Git** | 最新版 | 用于版本控制 |

**检查当前环境：**

```bash
# 检查 Node.js 版本
node -v

# 检查 npm 版本
npm -v

# 查看 Taro 版本信息（如已安装）
taro --version
```

#### 3.1.2 安装 Taro CLI

使用 npm 或 yarn 全局安装 Taro CLI：

```bash
# 使用 npm 安装
npm install -g @tarojs/cli

# 或使用 yarn
yarn global add @tarojs/cli

# 或使用 cnpm（国内推荐）
cnpm install -g @tarojs/cli

# 安装完成后验证
taro --version
```

**安装问题排查：**

如果安装过程出现 sass 相关的安装错误，请先安装 mirror-config-china 后重试：

```bash
npm install -g mirror-config-china
npm install -g @tarojs/cli
```

### 3.2 创建新项目

#### 3.2.1 使用 CLI 初始化项目

使用 Taro CLI 创建新项目：

```bash
# 方式 1：全局安装 CLI 后
taro init my-taro-app

# 方式 2：使用 npx（无需全局安装）
npx @tarojs/cli init my-taro-app
```

#### 3.2.2 交互式配置

执行初始化命令后，Taro 会启动交互式配置流程：

```
? 请输入项目介绍！
? 请使用箭头键选择你要使用的框架
  ❯ React
    Vue3
    Nerv
? 请选择你需要使用的 CSS 预处理器
  ❯ Sass
    Less
    Stylus
    None
? 请选择项目模板
  ❯ 默认模板
    空白模板
    TypeScript 模板
    React Native 模板
```

**配置选项说明：**

| 选项 | 推荐选择 | 说明 |
|------|----------|------|
| **项目介绍** | 任意填写 | 项目描述信息 |
| **框架** | React / Vue3 | 根据团队技术栈选择 |
| **CSS 预处理器** | Sass | 推荐使用，生态最成熟 |
| **模板** | 默认模板 | 初学者建议选择默认模板 |
| **语言** | TypeScript | 推荐使用，类型安全 |

### 3.3 项目目录结构

#### 3.3.1 标准目录结构

创建完成的项目结构如下（以 React + TypeScript 模板为例）：

```
my-taro-app/
├── src/                      # 源代码目录
│   ├── pages/                # 页面组件目录
│   │   └── index/            # 首页
│   │       ├── index.tsx     # 页面组件
│   │       └── index.scss    # 页面样式
│   ├── components/           # 公共组件目录
│   │   └── MyComponent/      # 自定义组件
│   │       ├── index.tsx
│   │       └── index.scss
│   ├── assets/               # 静态资源（图片、字体等）
│   ├── utils/                # 工具函数
│   │   ├── request.ts        # 请求封装
│   │   └── index.ts
│   ├── store/                # 状态管理（Redux/Vuex）
│   ├── services/             # API 服务层
│   ├── styles/               # 全局样式
│   │   └── variables.scss    # 样式变量
│   ├── app.tsx               # 应用入口组件
│   ├── app.config.ts         # 全局配置文件
│   └── app.scss              # 全局样式
├── config/                   # 编译配置目录
│   ├── dev.ts                # 开发环境配置
│   ├── prod.ts               # 生产环境配置
│   └── index.ts              # 编译主配置
├── dist/                     # 构建输出目录（编译后生成）
├── package.json              # 项目依赖配置
├── project.config.json       # 小程序项目配置
├── project.tt.json           # 字节跳动小程序配置
├── tsconfig.json             # TypeScript 配置
└── babel.config.js           # Babel 配置
```

#### 3.3.2 核心文件说明

**app.config.ts - 全局配置文件**

```typescript
// app.config.ts
export default defineAppConfig({
  // 页面路由配置（必须）
  pages: [
    'pages/index/index',      // 首页（也是启动页）
    'pages/user/profile',     // 用户页
    'pages/posts/list',       // 文章列表
    'pages/posts/detail'      // 文章详情
  ],

  // 窗口表现配置
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '我的 Taro 应用',
    navigationBarTextStyle: 'black'
  },

  // 底部 Tab 配置
  tabBar: {
    color: '#666',
    selectedColor: '#007AFF',
    backgroundColor: '#fff',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '首页',
        iconPath: './assets/tabbar/home.png',
        selectedIconPath: './assets/tabbar/home-active.png'
      },
      {
        pagePath: 'pages/user/profile',
        text: '我的',
        iconPath: './assets/tabbar/user.png',
        selectedIconPath: './assets/tabbar/user-active.png'
      }
    ]
  }
})
```

**pages 数组说明：**
- 每一项代表一个页面路径
- **数组第一项默认为应用的首页（启动页）**
- 路径不需要写文件后缀，Taro 会自动解析
- 页面顺序会影响小程序等平台的页面注入顺序

**app.tsx - 应用入口**

```tsx
// app.tsx
import { useEffect } from 'react'
import { useLaunch } from '@tarojs/taro'
import './app.scss'

function App({ children }) {
  useLaunch(() => {
    console.log('App launched')
    // 应用启动时的全局逻辑
    // 如：检查登录状态、初始化数据等
  })

  // onShow 周期：应用显示时触发
  useEffect(() => {
    return () => {
      // 清理逻辑
    }
  }, [])

  return children
}

export default App
```

**config/index.ts - 编译配置**

```typescript
// config/index.ts
import { defineConfig } from '@tarojs/cli'
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin'

export default defineConfig(async ({
  command,
  mode
}) => {
  return {
    // 源目录
    sourceRoot: 'src',
    // 输出目录
    outputRoot: `dist/${process.env.TARO_ENV}`,

    // 编译器配置
    compiler: {
      type: 'webpack5',
      prebundle: {
        enable: false
      }
    },

    // 公共配置
    alias: {
      '@': './src',
      '@components': './src/components'
    },

    // 小程序配置
    mini: {
      webpackChain: (chain) => {
        chain.resolve.plugin('tsconfig-paths').use(TsconfigPathsPlugin)
      },
      // 小程序特有的编译选项
      postcss: {
        pxtransform: {
          enable: true,
          config: {
            // 单位转换配置
            designWidth: 750,
            deviceRatio: {
              640: 2.34 / 2,
              750: 1,
              828: 1.81 / 2
            }
          }
        }
      }
    },

    // H5 配置
    h5: {
      publicPath: '/',
      staticDirectory: 'static',
      esnextModules: ['tslib']
    }
  }
})
```

### 3.4 运行与调试

#### 3.4.1 开发模式命令

```bash
# 进入项目目录
cd my-taro-app

# 安装依赖（如初始化时未自动安装）
npm install
# 或
pnpm install

# 开发模式 - H5
npm run dev:h5

# 开发模式 - 微信小程序
npm run dev:weapp

# 开发模式 - 支付宝小程序
npm run dev:alipay

# 开发模式 - 字节跳动小程序
npm run dev:swan

# 开发模式 - React Native
npm run dev:rn
```

#### 3.4.2 生产构建命令

```bash
# 生产构建 - H5
npm run build:h5

# 生产构建 - 微信小程序
npm run build:weapp

# 生产构建 - 所有平台
npm run build
```

#### 3.4.3 微信小程序运行流程

1. 运行微信小程序开发模式：
   ```bash
   npm run dev:weapp
   ```

2. 编译完成后会生成 `dist/` 目录

3. 打开**微信开发者工具**

4. 导入 `dist/weapp` 目录

5. 在微信开发者工具中预览和调试

#### 3.4.4 H5 运行流程

1. 运行 H5 开发模式：
   ```bash
   npm run dev:h5
   ```

2. 启动成功后会显示访问地址：
   ```
   ➜  Local:   http://localhost:10086/
   ➜  Network: http://192.168.x.x:10086/
   ```

3. 在浏览器中打开 `http://localhost:10086/` 即可查看

### 3.5 第一个 Taro 组件

#### 3.5.1 基础组件示例

```tsx
// src/pages/index/index.tsx
import { View, Text, Button, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

export default function Index() {
  // 点击事件处理
  const handleClick = () => {
    Taro.showToast({
      title: '点击成功',
      icon: 'success'
    })
  }

  return (
    <View className="index-page">
      <View className="header">
        <Image
          className="logo"
          src="https://taro-docs.jd.com/img/logo.png"
          mode="aspectFit"
        />
        <Text className="title">欢迎使用 Taro</Text>
      </View>

      <View className="content">
        <Text className="description">
          多端统一开发解决方案
        </Text>
      </View>

      <Button
        className="action-button"
        type="primary"
        onClick={handleClick}
      >
        点击我
      </Button>
    </View>
  )
}
```

#### 3.5.2 对应样式

```scss
// src/pages/index/index.scss
.index-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  min-height: 100vh;

  .header {
    text-align: center;
    margin-bottom: 40px;

    .logo {
      width: 200px;
      height: 200px;
      margin-bottom: 20px;
    }

    .title {
      font-size: 32px;
      font-weight: bold;
      color: #333;
    }
  }

  .content {
    margin-bottom: 40px;

    .description {
      font-size: 28px;
      color: #666;
    }
  }

  .action-button {
    width: 300px;
  }
}
```

### 3.6 新手常见误区

#### 3.6.1 使用 HTML 标签

❌ **错误做法：**
```tsx
<div className="container">
  <span>文本内容</span>
  <img src="..." />
</div>
```

✅ **正确做法：**
```tsx
<View className="container">
  <Text>文本内容</Text>
  <Image src="..." />
</View>
```

#### 3.6.2 直接使用 window/document

❌ **错误做法：**
```tsx
// 在小程序环境会报错
window.location.href = '...'
document.querySelector('.my-class')
```

✅ **正确做法：**
```tsx
// 使用 Taro 提供的 API
Taro.navigateTo({ url: '...' })
Taro.createSelectorQuery().select('.my-class')
```

#### 3.6.3 样式单位使用

❌ **错误做法：**
```scss
.container {
  width: 375rpx;  // rpx 是小程序单位，Taro 中应使用 px
}
```

✅ **正确做法：**
```scss
.container {
  width: 375px;  // Taro 编译时会自动转换
}
```

### 3.7 开发工具推荐

| 工具 | 用途 | 链接 |
|------|------|------|
| **微信开发者工具** | 微信小程序开发调试 | https://developers.weixin.qq.com/ |
| **Taro Debugger** | Taro 专用调试工具 | 应用市场搜索 |
| **Chrome DevTools** | H5 端调试 | 浏览器内置 |
| **VS Code** | 代码编辑器 | https://code.visualstudio.com/ |
| **Taro 助手插件** | VS Code 代码高亮/ snippets | VS Code 扩展市场 |

---

*第 3 章完成 | 下一章：[基础用法](#4-基础用法)*

---

## 4. 基础用法

### 4.1 组件开发

#### 4.1.1 基础组件使用

Taro 提供了一套完整的内置组件，这些组件在各端会自动转换为对应的原生组件：

```tsx
import {
  View,          // 视图容器，对应 div
  Text,          // 文本，对应 span/p
  Image,         // 图片，对应 img
  Button,        // 按钮
  Input,         // 输入框
  ScrollView,    // 滚动视图
  Swiper,        // 轮播图
  Form,          // 表单
  Label,         // 表单标签
  Checkbox,      // 复选框
  Radio,         // 单选框
  Picker         // 选择器
} from '@tarojs/components'
```

**核心组件说明：**

| 组件 | 说明 | 多端表现 |
|------|------|----------|
| `<View>` | 视图容器 | 小程序 `<view>` / H5 `<div>` |
| `<Text>` | 文本 | 小程序 `<text>` / H5 `<span>` |
| `<Image>` | 图片 | 小程序 `<image>` / H5 `<img>` |
| `<Button>` | 按钮 | 各端原生按钮样式 |
| `<Input>` | 输入框 | 各端原生输入框 |
| `<ScrollView>` | 滚动视图 | 可滚动区域容器 |

#### 4.1.2 自定义组件开发

**函数组件（React）：**

```tsx
// src/components/Card/index.tsx
import { View, Text } from '@tarojs/components'
import './index.scss'

interface CardProps {
  title: string
  description?: string
  onClick?: () => void
}

export default function Card({ title, description, onClick }: CardProps) {
  return (
    <View className="card" onClick={onClick}>
      <Text className="card-title">{title}</Text>
      {description && (
        <Text className="card-desc">{description}</Text>
      )}
    </View>
  )
}
```

**使用示例：**

```tsx
// src/pages/index/index.tsx
import Card from '@/components/Card'

export default function Index() {
  const handleCardClick = () => {
    Taro.showToast({
      title: '卡片被点击',
      icon: 'success'
    })
  }

  return (
    <View className="container">
      <Card
        title="卡片标题"
        description="卡片描述内容"
        onClick={handleCardClick}
      />
    </View>
  )
}
```

#### 4.1.3 组件通信

**Props 传递：**

```tsx
// 父组件
<Card title="标题" count={10} isActive={true} />

// 子组件接收
interface CardProps {
  title: string      // 字符串
  count: number      // 数字
  isActive: boolean  // 布尔值
}
```

**事件传递：**

```tsx
// 子组件触发事件
interface CardProps {
  onConfirm?: (data: any) => void
}

export default function Card({ onConfirm }: CardProps) {
  const handleClick = () => {
    onConfirm?.({ id: 1, name: 'test' })
  }

  return <Button onClick={handleClick}>确认</Button>
}
```

### 4.2 路由与导航

#### 4.2.1 路由配置

路由在 `app.config.ts` 中配置：

```typescript
export default defineAppConfig({
  pages: [
    'pages/index/index',        // 首页
    'pages/detail/index',       // 详情页
    'pages/user/profile',       // 用户页 (tabBar 页)
    'pages/user/settings'       // 设置页 (tabBar 页)
  ],
  tabBar: {
    list: [
      {
        pagePath: 'pages/user/profile',
        text: '首页'
      },
      {
        pagePath: 'pages/user/settings',
        text: '设置'
      }
    ]
  }
})
```

#### 4.2.2 页面跳转方式

Taro 提供多种页面跳转 API：

```typescript
import Taro from '@tarojs/taro'

// 1. navigateTo: 保留当前页，跳转到新页面（可返回）
Taro.navigateTo({
  url: '/pages/detail/index?id=123&type=news'
})

// 2. redirectTo: 关闭当前页，跳转到新页面（不可返回）
Taro.redirectTo({
  url: '/pages/detail/index?id=123'
})

// 3. switchTab: 跳转到 tabBar 页面，关闭其他非 tabBar 页面
Taro.switchTab({
  url: '/pages/user/profile'
})

// 4. reLaunch: 关闭所有页面，跳转到新页面
Taro.reLaunch({
  url: '/pages/index/index'
})

// 5. navigateBack: 返回上一级页面
Taro.navigateBack({
  delta: 1  // 返回的页数，默认为 1
})
```

#### 4.2.3 参数传递与接收

**传递参数：**

```typescript
// 方式 1：URL 参数（适合简单参数）
Taro.navigateTo({
  url: `/pages/detail/index?id=${id}&type=${type}`
})

// 方式 2：对象参数（Taro 会自动序列化）
Taro.navigateTo({
  url: '/pages/detail/index',
  success: () => {},
  // 参数会通过 URL 编码传递
})
```

**接收参数：**

```tsx
// 方式 1：使用 getCurrentInstance（推荐）
import { getCurrentInstance } from '@tarojs/taro'
import { useEffect } from 'react'

export default function Detail() {
  useEffect(() => {
    const instance = getCurrentInstance()
    const { id, type } = instance.router.params
    console.log('接收到的参数:', id, type)
  }, [])

  return <View>详情页</View>
}

// 方式 2：使用 useRouter Hook（React）
import { useRouter } from '@tarojs/taro'

export default function Detail() {
  const { params } = useRouter()

  return (
    <View>
      <Text>ID: {params.id}</Text>
      <Text>类型：{params.type}</Text>
    </View>
  )
}
```

#### 4.2.4 tabBar 页面参数传递

tabBar 页面不能使用 navigateTo，参数传递需要使用全局数据：

```typescript
// src/utils/global.ts
const globalData: Record<string, any> = {}

export function setGlobalData(key: string, value: any) {
  globalData[key] = value
}

export function getGlobalData(key: string) {
  return globalData[key]
}

// 设置数据
setGlobalData('userId', 123)

// 获取数据
const userId = getGlobalData('userId')
```

### 4.3 状态管理

#### 4.3.1 useState（简单状态）

适用于组件内部简单状态管理：

```tsx
import { useState } from 'react'
import { View, Button, Text } from '@tarojs/components'

export default function Counter() {
  const [count, setCount] = useState(0)
  const [userInfo, setUserInfo] = useState({
    name: '',
    age: 0
  })

  const handleIncrement = () => {
    setCount(prev => prev + 1)
  }

  const handleUpdateUser = () => {
    setUserInfo(prev => ({
      ...prev,
      name: '张三'
    }))
  }

  return (
    <View>
      <Text>计数：{count}</Text>
      <Button onClick={handleIncrement}>+1</Button>
      <Text>用户：{userInfo.name}</Text>
    </View>
  )
}
```

**注意事项：**
- `setState` 是异步的，多次调用会合并更新
- 基于前一个状态计算时，使用函数形式：`setCount(prev => prev + 1)`
- 对象/数组更新时需要返回新引用

#### 4.3.2 useReducer（复杂状态）

适用于具有多个子状态或复杂更新逻辑的场景：

```tsx
import { useReducer } from 'react'

// 定义初始状态
const initialState = {
  count: 0,
  loading: false,
  error: null
}

// 定义 reducer
function reducer(state, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, count: state.count + 1 }
    case 'DECREMENT':
      return { ...state, count: state.count - 1 }
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    default:
      return state
  }
}

// 使用 useReducer
export default function ComplexCounter() {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <View>
      <Text>计数：{state.count}</Text>
      {state.loading && <Text>加载中...</Text>}
      {state.error && <Text>错误：{state.error}</Text>}
      <Button onClick={() => dispatch({ type: 'INCREMENT' })}>
        +1
      </Button>
      <Button onClick={() => dispatch({ type: 'DECREMENT' })}>
        -1
      </Button>
    </View>
  )
}
```

#### 4.3.3 Redux（全局状态）

适用于大型应用的全局状态管理：

**安装依赖：**
```bash
npm install @reduxjs/toolkit react-redux
```

**创建 Store：**

```typescript
// src/store/index.ts
import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit'

// 用户状态 Slice
const userSlice = createSlice({
  name: 'user',
  initialState: {
    id: null,
    name: '',
    avatar: ''
  },
  reducers: {
    setUserInfo(state, action: PayloadAction<any>) {
      state.id = action.payload.id
      state.name = action.payload.name
      state.avatar = action.payload.avatar
    },
    clearUserInfo(state) {
      state.id = null
      state.name = ''
      state.avatar = ''
    }
  }
})

// 计数器 Slice
const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: state => { state.value += 1 },
    decrement: state => { state.value -= 1 }
  }
})

// 导出 actions
export const { setUserInfo, clearUserInfo } = userSlice.actions
export const { increment, decrement } = counterSlice.actions

// 创建 store
export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    counter: counterSlice.reducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
```

**配置 Provider：**

```tsx
// src/app.tsx
import { Provider } from 'react-redux'
import { store } from './store'
import './app.scss'

function App({ children }) {
  return (
    <Provider store={store}>
      {children}
    </Provider>
  )
}

export default App
```

**在组件中使用：**

```tsx
// src/pages/index/index.tsx
import { useSelector, useDispatch } from 'react-redux'
import { increment, decrement, setUserInfo } from '@/store'
import { View, Text, Button } from '@tarojs/components'

export default function Index() {
  const dispatch = useDispatch()
  const count = useSelector((state: RootState) => state.counter.value)
  const userName = useSelector((state: RootState) => state.user.name)

  const handleLogin = () => {
    dispatch(setUserInfo({
      id: 1,
      name: '张三',
      avatar: 'https://example.com/avatar.png'
    }))
  }

  return (
    <View>
      <Text>计数：{count}</Text>
      <Button onClick={() => dispatch(increment())}>增加</Button>
      <Button onClick={() => dispatch(decrement())}>减少</Button>
      <Text>用户：{userName || '未登录'}</Text>
      <Button onClick={handleLogin}>登录</Button>
    </View>
  )
}
```

#### 4.3.4 状态管理方案选型

| 方案 | 适用场景 | 优点 | 缺点 |
|------|----------|------|------|
| **useState** | 组件内部简单状态 | 简单易用、无需额外依赖 | 无法跨组件共享 |
| **useReducer** | 复杂状态逻辑 | 状态更新可预测、逻辑集中 | 样板代码较多 |
| **Redux** | 大型应用全局状态 | 可预测、可调试、生态丰富 | 学习曲线陡峭 |
| **MobX** | 响应式状态管理 | 简洁、自动追踪依赖 | 隐式更新可能难以调试 |

### 4.4 样式方案

#### 4.4.1 单位转换机制

Taro 默认会对样式单位进行自动转换：

| 源单位 | 小程序 | H5 |
|--------|--------|-----|
| `px` | `rpx` | `rem` |
| `750px` | `750rpx` (100% 屏宽) | `50rem` |

**设计稿尺寸配置：**

```typescript
// config/index.ts
export default defineConfig({
  // ...
  designWidth: 750,  // 设计稿宽度
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2
  }
})
```

**跳过单位转换：**
```scss
.container {
  width: 100px;    // 会被转换
  width: 100Px;    // 不会被转换（大写 P）
  width: 100PX;    // 不会被转换（大写 PX）
}
```

#### 4.4.2 CSS 预处理器

**Sass 使用示例：**

```scss
// src/pages/index/index.scss
$primary-color: #007AFF;
$spacing-unit: 20px;

.container {
  padding: $spacing-unit;

  .title {
    color: $primary-color;
    font-size: 32px;
  }

  .button {
    margin-top: $spacing-unit;
    background-color: $primary-color;
  }
}
```

**配置 Sass：**
```bash
# 安装 Sass 依赖
npm install -D sass
```

#### 4.4.3 CSS Modules

CSS Modules 可以实现样式作用域隔离，避免样式污染：

```scss
/* src/components/Card/Card.module.scss */
.card {
  padding: 20px;
  background: #fff;

  .title {
    font-size: 18px;
    color: #333;
  }
}
```

```tsx
// src/components/Card/index.tsx
import styles from './Card.module.scss'

export default function Card({ title }) {
  return (
    <View className={styles.card}>
      <Text className={styles.title}>{title}</Text>
    </View>
  )
}
```

**配置 CSS Modules：**

```typescript
// config/index.ts
export default defineConfig({
  // 小程序配置
  mini: {
    postcss: {
      cssModules: {
        enable: true,  // 启用 CSS Modules
        config: {
          namingPattern: 'module',  // 转换模式
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    }
  },
  // H5 配置
  h5: {
    postcss: {
      cssModules: {
        enable: true,
        config: {
          namingPattern: 'module',
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    }
  }
})
```

#### 4.4.4 全局样式

**定义全局样式变量：**

```scss
// src/app.scss
$primary-color: #007AFF;
$secondary-color: #666;
$bg-color: #f5f5f5;

page {
  background-color: $bg-color;
  font-size: 28px;
}

// 全局工具类
.text-primary {
  color: $primary-color;
}

.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

**使用全局样式：**

```tsx
// 在组件中使用全局类
<View className="text-primary flex-center">
  <Text>主要文本</Text>
</View>
```

#### 4.4.5 样式隔离与穿透

**小程序样式隔离：**

小程序中，组件样式默认是隔离的。如需使用全局样式：

```tsx
// 在组件中允许全局样式
export default class MyComponent extends Component {
  static options = {
    addGlobalClass: true
  }
}
```

**样式穿透（慎用）：**

```scss
// 使用 :global 包裹
.container {
  :global(.external-class) {
    color: red;
  }
}
```

### 4.5 常见样式问题

#### 4.5.1 不要使用标签选择器

❌ **错误做法：**
```scss
View {
  margin: 10px;
}

Image {
  width: 100px;
}
```

✅ **正确做法：**
```scss
.container {
  margin: 10px;
}

.logo {
  width: 100px;
}
```

**原因：** 不同端编译后的标签名称不同，H5 端会多包裹一层 `taro-[tag]-core`。

#### 4.5.2 box-sizing 问题

在不同平台 `box-sizing` 默认值可能不同，建议全局设置：

```scss
// src/app.scss
* {
  box-sizing: border-box;
}
```

#### 4.5.3 H5 底部空白问题

**问题：** 使用 `position: absolute` 且子元素高度超出父元素时，H5 底部可能出现空白。

**解决方案：**
```scss
.container {
  overflow: hidden;  // 或 overflow-y: auto
}
```

---

*第 4 章完成 | 下一章：[高级特性](#5-高级特性)*

---

## 5. 高级特性

### 5.1 条件编译

#### 5.1.1 使用 process.env.TARO_ENV

Taro 在编译时提供内置环境变量 `process.env.TARO_ENV`，用于判断当前编译平台类型：

```typescript
// 可用的平台值
// weapp - 微信小程序
// swan - 百度小程序
// alipay - 支付宝小程序
// tt - 字节跳动小程序
// qq - QQ 小程序
// jd - 京东小程序
// h5 - H5
// rn - React Native
// ascf - 元服务
```

**条件编译示例：**

```tsx
import { View, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'

export default function PlatformAware() {
  // 根据平台返回不同 UI 结构
  const renderPlatformContent = () => {
    if (process.env.TARO_ENV === 'weapp') {
      // 微信小程序专属逻辑
      return (
        <Button openType="getUserInfo" onGetUserInfo={handleGetUserInfo}>
          获取用户信息
        </Button>
      )
    } else if (process.env.TARO_ENV === 'h5') {
      // H5 专属逻辑
      return (
        <Button onClick={handleWebLogin}>
          网页登录
        </Button>
      )
    } else if (process.env.TARO_ENV === 'rn') {
      // React Native 专属逻辑
      return <Text>React Native 环境</Text>
    }
    return null
  }

  return <View>{renderPlatformContent()}</View>
}
```

#### 5.1.2 文件级别的条件编译

Taro 支持通过文件后缀名来区分不同平台的代码：

```
src/components/
├── Button.tsx          # 通用组件
├── Button.weapp.tsx    # 微信小程序专属
├── Button.h5.tsx       # H5 专属
├── Button.rn.tsx       # React Native 专属
└── Button.alipay.tsx   # 支付宝小程序专属
```

编译时，Taro 会根据目标平台自动选择对应的文件：

```typescript
// 导入时无需写平台后缀
import Button from '@/components/Button'

// 编译时自动选择：
// - 微信小程序环境 → Button.weapp.tsx
// - H5 环境 → Button.h5.tsx
```

#### 5.1.3 样式文件条件编译

同样，样式文件也支持平台区分：

```
src/pages/index/
├── index.scss          # 通用样式
├── index.weapp.scss    # 微信小程序专属样式
├── index.h5.scss       # H5 专属样式
└── index.rn.scss       # React Native 专属样式
```

### 5.2 多端适配实践

#### 5.2.1 API 差异处理

不同平台提供的 API 能力不同，需要进行适配处理：

```typescript
// src/utils/platform.ts
import Taro from '@tarojs/taro'

/**
 * 统一的存储 API
 */
export const storage = {
  set: async (key: string, value: any) => {
    if (process.env.TARO_ENV === 'h5') {
      // H5 使用 localStorage
      localStorage.setItem(key, JSON.stringify(value))
    } else {
      // 小程序使用 Taro.setStorage
      await Taro.setStorage({ key, data: value })
    }
  },

  get: async (key: string) => {
    if (process.env.TARO_ENV === 'h5') {
      return JSON.parse(localStorage.getItem(key) || 'null')
    } else {
      const res = await Taro.getStorage({ key })
      return res.data
    }
  }
}

/**
 * 统一的分享 API
 */
export const share = async (options: {
  title: string
  path: string
  imageUrl?: string
}) => {
  if (process.env.TARO_ENV === 'weapp') {
    // 微信小程序分享
    Taro.showShareMenu({
      withShareTicket: true,
      showShareItems: ['wechatFriends', 'wechatMoment']
    })
  } else if (process.env.TARO_ENV === 'h5') {
    // H5 分享（可能需要调用第三方 SDK）
    // 例如：JSSDK 分享
  } else if (process.env.TARO_ENV === 'alipay') {
    // 支付宝小程序分享
    Taro.showShareMenu({})
  }
}
```

#### 5.2.2 组件差异处理

**小程序原生能力使用：**

```tsx
// 微信小程序专属组件
{process.env.TARO_ENV === 'weapp' && (
  <View>
    {/* 小程序原生分享按钮 */}
    <Button openType="share">分享给好友</Button>
    {/* 获取用户手机号 */}
    <Button openType="getPhoneNumber" onGetPhoneNumber={handlePhone}>
      获取手机号
    </Button>
  </View>
)}

// H5 专属组件
{process.env.TARO_ENV === 'h5' && (
  <View>
    {/* H5 使用网页分享 */}
    <Button onClick={handleWebShare}>分享到社交媒体</Button>
  </View>
)}
```

#### 5.2.3 样式适配方案

**使用 CSS 变量实现主题适配：**

```scss
// src/styles/variables.scss
// 定义平台专属变量
$platform-padding: 20px;

// H5 专属
/* #ifdef H5 */
$platform-padding: 24px;
/* #endif */

// 小程序专属
/* #ifdef MP */
$platform-padding: 16px;
/* #endif */
```

**使用 postcss-pxtransform 配置：**

```typescript
// config/index.ts
export default defineConfig({
  // ...
  h5: {
    pxtransform: {
      enable: true,
      config: {
        platform: 'h5',
        designWidth: 750,
        rootValue: 16,
        onePxTransform: true,
        unitPrecision: 5,
        propList: ['*'],
        selectorBlackList: [],
        replace: true,
        mediaQuery: false,
        minPixelValue: 0
      }
    }
  },
  mini: {
    pxtransform: {
      enable: true,
      config: {
        platform: 'mini',
        designWidth: 750,
        deviceRatio: {
          640: 2.34 / 2,
          750: 1,
          828: 1.81 / 2
        }
      }
    }
  }
})
```

### 5.3 自定义编译配置

#### 5.3.1 Webpack 链式配置

```typescript
// config/index.ts
import path from 'path'

export default defineConfig({
  // ...
  h5: {
    webpackChain(chain) {
      // 添加别名
      chain.resolve.alias
        .set('@components', path.resolve(__dirname, '../src/components'))
        .set('@utils', path.resolve(__dirname, '../src/utils'))
        .set('@services', path.resolve(__dirname, '../src/services'))

      // 添加插件
      chain.plugin('definePlugin').use(require('webpack').DefinePlugin, [{
        'process.env.API_URL': JSON.stringify('https://api.example.com')
      }])

      // 修改 loader
      chain.module
        .rule('sass')
        .use('sassLoader')
        .loader('sass-loader')
        .tap(options => ({
          ...options,
          additionalData: `@import "@/styles/variables.scss";`
        }))
    }
  }
})
```

#### 5.3.2 小程序编译配置

```typescript
// config/index.ts
export default defineConfig({
  // ...
  mini: {
    // 编译输出目录
    outputRoot: `dist/${process.env.TARO_ENV}`,

    // 代码压缩配置
    minimize: true,

    // 启用代码分割
    enableExtract: true,

    // PostCSS 配置
    postcss: {
      // CSS Modules
      cssModules: {
        enable: true,
        config: {
          namingPattern: 'module',
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      },
      // 单位转换
      pxtransform: {
        enable: true,
        config: {}
      },
      // URL 处理
      url: {
        enable: true,
        config: {
          limit: 10240 // 10kb 以下的文件转为 base64
        }
      },
      // autoprefixer
      autoprefixer: {
        enable: true,
        config: {
          overrideBrowserslist: ['last 2 versions', '> 1%']
        }
      }
    },

    // 小程序专属 Webpack 配置
    webpackChain(chain) {
      // 添加小程序专属插件
      chain.plugin('taroPlugin').use(require('@tarojs/plugin-platform-weapp'))
    }
  }
})
```

#### 5.3.3 添加自定义 Babel 插件

```javascript
// babel.config.js
module.exports = {
  presets: [
    ['@babel/preset-env', { modules: false }],
    '@babel/preset-typescript',
    '@babel/preset-react'
  ],
  plugins: [
    // 装饰器支持
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    // class properties 支持
    ['@babel/plugin-transform-class-properties', { loose: true }],
    // 按需引入组件库
    ['import', {
      libraryName: 'taro-ui',
      libraryDirectory: 'dist/components',
      style: true,
      libraryName2: '@tarojs/components'
    }]
  ]
}
```

### 5.4 多端调试技巧

#### 5.4.1 环境变量注入

```typescript
// config/index.ts
export default defineConfig(async ({ command, mode }) => {
  const isProd = mode === 'production'

  return {
    h5: {
      env: {
        NODE_ENV: isProd ? '"production"' : '"development"',
        API_URL: isProd
          ? '"https://api.prod.com"'
          : '"https://api.dev.com"'
      }
    }
  }
})
```

#### 5.4.2 条件日志输出

```typescript
// src/utils/logger.ts
const isDev = process.env.NODE_ENV === 'development'

export const logger = {
  log: (...args: any[]) => {
    if (isDev) {
      console.log('[LOG]', ...args)
    }
  },
  error: (...args: any[]) => {
    console.error('[ERROR]', ...args)
  },
  warn: (...args: any[]) => {
    if (isDev) {
      console.warn('[WARN]', ...args)
    }
  }
}
```

### 5.5 常见平台差异与处理

#### 5.5.1 小程序 vs H5 核心差异

| 差异点 | 小程序 | H5 | 处理方案 |
|--------|--------|-----|----------|
| **运行环境** | 双线程架构 | 浏览器 | 避免直接操作 DOM |
| **API 调用** | wx.xxx / Taro.xxx | 浏览器 API | 封装统一 API |
| **样式单位** | rpx | rem/px | 使用 Taro 自动转换 |
| **存储** | Taro.setStorage | localStorage | 封装统一 storage |
| **路由** | Taro.navigateTo | history | 使用 Taro 路由 API |
| **分享** | 原生分享 | 需 SDK 支持 | 条件渲染 |

#### 5.5.2 路由传参限制

**小程序参数长度限制：**

小程序路由参数有长度限制（约 2KB），大数据量传递需要使用其他方式：

```typescript
// 方案 1：使用全局存储
import { setGlobalData, getGlobalData } from '@/utils/global'

// A 页面
setGlobalData('formData', largeData)
Taro.navigateTo({ url: '/pages/detail/index' })

// B 页面
const formData = getGlobalData('formData')

// 方案 2：使用 storage
await Taro.setStorage({ key: 'tempData', data: largeData })
Taro.navigateTo({ url: '/pages/detail/index' })

// B 页面获取后删除
const res = await Taro.getStorage({ key: 'tempData' })
await Taro.removeStorage({ key: 'tempData' })
```

#### 5.5.3 图片处理差异

```typescript
// src/utils/image.ts
import Taro from '@tarojs/taro'

/**
 * 统一的图片选择 API
 */
export const chooseImage = async (options: {
  count?: number
  sourceType?: ('album' | 'camera')[]
}): Promise<string[]> => {
  if (process.env.TARO_ENV === 'h5') {
    // H5 使用 input file
    return new Promise((resolve) => {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/*'
      input.multiple = options.count ? options.count > 1 : true
      input.onchange = (e) => {
        const files = (e.target as HTMLInputElement).files
        const urls = Array.from(files).map(file => URL.createObjectURL(file))
        resolve(urls)
      }
      input.click()
    })
  } else {
    // 小程序使用 Taro.chooseImage
    const res = await Taro.chooseImage({
      count: options.count || 1,
      sourceType: options.sourceType || ['album', 'camera']
    })
    return res.tempFilePaths
  }
}
```

---

*第 5 章完成 | 下一章：[跨端部署](#6-跨端部署)*

---

## 6. 跨端部署

### 6.1 微信小程序部署

#### 6.1.1 部署前置准备

**1. 注册小程序账号**
- 登录微信公众平台：https://mp.weixin.qq.com/
- 选择「小程序」类型注册
- 完成主体认证（企业需营业执照）
- 获取 AppID：开发 → 开发管理 → 开发设置

**2. 配置生产环境变量**

在项目根目录创建 `.env.production`：

```bash
# .env.production
TARO_APP_ID="wx28xxxxxxxxxxxxx"
TARO_APP_API="https://api.example.com"
```

**3. 配置 project.config.json**

```json
{
  "miniprogramRoot": "./dist/weapp/",
  "projectname": "your-project-name",
  "appid": "wx28xxxxxxxxxxxxx",
  "setting": {
    "es6": true,
    "enhance": true,
    "compileHotReLoad": true
  }
}
```

#### 6.1.2 构建与上传流程

**1. 安装依赖并构建**

```bash
# 安装依赖
npm install

# 生产环境构建 - 微信小程序
npm run build:weapp
```

构建完成后，产物在 `dist/weapp/` 目录。

**2. 使用微信开发者工具上传**

```
步骤：
1. 打开微信开发者工具
2. 导入项目 → 选择 dist/weapp 目录
3. 登录开发者账号（扫码）
4. 点击右上角「上传」按钮
5. 填写版本号和版本说明
6. 等待上传完成
```

**上传流程图：**

```
开发者 → 微信开发者工具 → 微信服务器
  │
  ├─ 1. 点击「上传」
  ├─ 2. 读取 dist/ 编译产物
  ├─ 3. 打包成上传包
  ├─ 4. HTTPS 上传
  ├─ 5. 校验 AppID、签名
  ├─ 6. 保存为开发版本
  └─ 7. 返回成功
```

#### 6.1.3 提交审核与发布

**1. 版本管理**

登录微信公众平台后台：
- 版本管理 → 开发版本
- 选择刚上传的版本
- 填写版本说明

**2. 提交审核**

需要提供的材料：
- 功能截图
- 测试账号（如需要）
- 隐私协议（涉及用户隐私时）
- 相关资质证明（特殊行业）

**3. 审核通过后发布**

- 审核时间：通常 1-24 小时
- 审核通过后点击「发布」
- 发布后用户可在微信搜索到小程序

### 6.2 H5 部署

#### 6.2.1 生产构建

```bash
# 生产环境构建 - H5
npm run build:h5
```

构建产物在 `dist/h5/` 目录。

#### 6.2.2 服务器部署

**1. 静态资源部署**

将 `dist/h5/` 目录部署到任意 Web 服务器：

```bash
# Nginx 配置示例
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist/h5;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # 开启 Gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;
}
```

**2. CDN 部署**

配置 CDN 加速静态资源：

```typescript
// config/index.ts
export default defineConfig({
  h5: {
    publicPath: 'https://cdn.example.com/',
    staticDirectory: 'static'
  }
})
```

### 6.3 React Native 部署

#### 6.3.1 构建 RN 项目

```bash
# 开发模式 - React Native
npm run dev:rn

# 生产构建 - React Native
npm run build:rn
```

#### 6.3.2 iOS 部署

**1. 使用 Xcode 构建**

```bash
# 进入 RN 项目目录
cd dist/rn

# 打开 Xcode
open ios/YourApp.xcworkspace

# Xcode 中：
# 1. 选择 Team（需要 Apple Developer 账号）
# 2. Product → Archive
# 3. 上传到 App Store Connect
```

**2. App Store 提交**

- 填写应用信息
- 上传截图
- 提交审核

#### 6.3.3 Android 部署

**1. 构建 APK**

```bash
cd android
./gradlew assembleRelease
```

生成的 APK 在 `android/app/build/outputs/apk/release/` 目录。

**2. 应用市场发布**

- 小米应用商店
- 华为应用市场
- OPPO 软件商店
- vivo 应用商店
- 应用宝（腾讯）

### 6.4 多端同时部署策略

#### 6.4.1 CI/CD自动化部署

使用 GitHub Actions 实现自动化部署：

```yaml
# .github/workflows/deploy.yml
name: Deploy Taro App

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install

      - name: Build WeApp
        run: npm run build:weapp

      - name: Build H5
        run: npm run build:h5

      - name: Deploy H5 to server
        uses: easingthemes/ssh-deploy@v2
        with:
          SSH_PRIVATE_KEY: ${{ secrets.SSH_KEY }}
          SOURCE: "dist/h5/"
          REMOTE_HOST: "your-server.com"
          REMOTE_USER: "www"
          TARGET: "/var/www/html"
```

#### 6.4.2 版本管理策略

| 平台 | 版本控制 | 更新方式 |
|------|----------|----------|
| 微信小程序 | 后台版本管理 | 提交审核 |
| H5 | Git Tag | 直接部署 |
| React Native | Git Tag + 应用市场 | 提交审核 |

---

## 7. 微信云开发集成

### 7.1 云开发概述

**微信云开发**是腾讯云提供的 Serverless 服务，与小程序生态深度集成，提供以下核心能力：

| 服务 | 说明 | 适用场景 |
|------|------|----------|
| **云数据库** | 文档型 NoSQL 数据库 | 用户数据、订单、内容存储 |
| **云函数** | 云端代码执行环境 | 复杂业务逻辑、第三方 API 调用 |
| **云存储** | 云端文件存储 + CDN | 图片、视频、文件上传下载 |
| **云调用** | 微信开放接口调用 | 模板消息、订阅消息 |

### 7.2 环境配置

#### 7.2.1 开通云开发

1. 打开微信开发者工具
2. 点击「云开发」按钮
3. 创建云开发环境（免费版/基础版/专业版）
4. 获取环境 ID

#### 7.2.2 Taro 项目配置

**1. 配置 project.config.json**

```json
{
  "miniprogramRoot": "./dist/weapp/",
  "cloudfunctionRoot": "./cloudfunctions/",
  "appid": "wx28xxxxxxxxxxxxx"
}
```

**2. 创建云函数目录**

在项目根目录创建 `cloudfunctions/` 目录：

```
your-project/
├── cloudfunctions/      # 云函数目录
│   ├── login/          # 登录云函数
│   └── getUserInfo/    # 用户信息云函数
├── src/                # 前端源码
└── dist/               # 编译产物
```

**3. 初始化云开发**

```typescript
// src/app.tsx
import Taro from '@tarojs/taro'

function App({ children }) {
  // 仅在微信小程序环境初始化云开发
  if (process.env.TARO_ENV === 'weapp') {
    Taro.cloud.init({
      env: 'your-cloud-env-id',  // 替换为你的云环境 ID
      traceUser: true  // 是否在用户访问时记录用户信息
    })
  }

  return children
}

export default App
```

### 7.3 云函数开发

#### 7.3.1 创建云函数

**1. 初始化云函数项目**

```bash
# 在云函数目录下初始化
cd cloudfunctions/login
npm init -y
npm install --save wx-server-sdk@latest
```

**2. 编写云函数代码**

```javascript
// cloudfunctions/login/index.js
// 云函数入口文件
const cloud = require('wx-server-sdk')

// 初始化云函数 SDK
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  // 获取微信上下文
  const wxContext = cloud.getWXContext()

  return {
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
    env: wxContext.ENV
  }
}
```

**3. 部署云函数**

在微信开发者工具中：
- 右键点击云函数目录
- 选择「上传并部署：云端安装依赖」

**常见问题：**

如果报错 `can't find wx-server-sdk`，在云函数目录下执行：

```bash
npm install --save wx-server-sdk@latest
```

#### 7.3.2 调用云函数

```typescript
// src/pages/index/index.tsx
import Taro from '@tarojs/taro'
import { useState, useEffect } from 'react'

export default function Index() {
  const [userInfo, setUserInfo] = useState<any>(null)

  // 调用云函数
  const callLoginFunction = async () => {
    try {
      const res = await Taro.cloud.callFunction({
        name: 'login',  // 云函数名称
        data: {}        // 传给云函数的参数
      })

      console.log('云函数返回:', res.result)
      setUserInfo(res.result)
    } catch (err) {
      console.error('调用云函数失败:', err)
    }
  }

  useEffect(() => {
    callLoginFunction()
  }, [])

  return (
    <View>
      {userInfo ? (
        <Text>OpenID: {userInfo.openid}</Text>
      ) : (
        <Text>加载中...</Text>
      )}
    </View>
  )
}
```

#### 7.3.3 云函数高级用法

**带参数调用：**

```javascript
// cloudfunctions/add/index.js
exports.main = async (event, context) => {
  const { a, b } = event
  return {
    sum: a + b
  }
}

// 前端调用
const res = await Taro.cloud.callFunction({
  name: 'add',
  data: {
    a: 10,
    b: 20
  }
})
console.log('结果:', res.result.sum)  // 30
```

**云函数批量调用：**

```typescript
// 使用 Promise.all 批量调用
const [loginRes, dataRes] = await Promise.all([
  Taro.cloud.callFunction({ name: 'login' }),
  Taro.cloud.callFunction({ name: 'getData' })
])
```

### 7.4 云数据库

#### 7.4.1 基础操作

**初始化数据库引用：**

```typescript
const db = Taro.cloud.database()
```

**增删改查操作：**

```typescript
// 1. 插入数据（新增）
await db.collection('todos').add({
  data: {
    title: '学习云开发',
    done: false,
    createTime: db.serverDate()
  }
})

// 2. 查询数据（读取）
const result = await db.collection('todos')
  .where({ done: false })
  .orderBy('createTime', 'desc')
  .get()

console.log('查询结果:', result.data)

// 3. 更新数据（修改）
await db.collection('todos').doc('document-id').update({
  data: {
    done: true
  }
})

// 4. 删除数据
await db.collection('todos').doc('document-id').remove()
```

#### 7.4.2 高级查询技巧

**比较运算符：**

```typescript
// $gt 大于、$lt 小于、$gte 大于等于、$lte 小于等于
const result = await db.collection('users')
  .where({
    age: { $gt: 20 }  // 年龄大于 20
  })
  .get()
```

**逻辑运算符：**

```typescript
// $and 与、$or 或
const result = await db.collection('users')
  .where({
    $and: [
      { age: { $gt: 20 } },
      { age: { $lt: 30 } }
    ]
  })
  .get()
```

**正则表达式：**

```typescript
// 模糊查询
const result = await db.collection('users')
  .where({
    name: db.RegExp({
      regexp: '^张',  // 姓张的用户
      options: 'i'
    })
  })
  .get()
```

**分页查询：**

```typescript
// 分页：每页 10 条，获取第 2 页
const pageSize = 10
const currentPage = 2

const result = await db.collection('todos')
  .skip((currentPage - 1) * pageSize)
  .limit(pageSize)
  .get()
```

#### 7.4.3 事务处理

```typescript
// 跨文档原子操作
await db.runTransaction(async transaction => {
  const todosCollection = transaction.collection('todos')

  // 查询未完成任务
  const todos = await todosCollection.where({ done: false }).get()

  // 批量更新
  for (const todo of todos.data) {
    await transaction.collection('todos')
      .doc(todo._id)
      .update({ data: { done: true } })
  }

  return { success: true, count: todos.data.length }
})
```

### 7.5 云存储

#### 7.5.1 文件上传

```typescript
// 选择并上传图片
const chooseAndUploadImage = async () => {
  // 1. 选择图片
  const chooseResult = await Taro.chooseImage({
    count: 1,
    sourceType: ['album', 'camera']
  })

  // 2. 上传到云存储
  const filePath = chooseResult.tempFilePaths[0]
  const cloudPath = `images/${Date.now()}-${Math.random()}.png`

  const uploadResult = await Taro.cloud.uploadFile({
    cloudPath: cloudPath,
    filePath: filePath
  })

  console.log('上传成功:', uploadResult.fileID)
  return uploadResult.fileID
}
```

#### 7.5.2 文件下载

```typescript
// 下载云存储文件
const downloadFile = async (fileID: string) => {
  const result = await Taro.cloud.downloadFile({
    fileID: fileID
  })

  // result.tempFilePath 是本地临时文件路径
  // result.errorMessage 是错误信息

  return result.tempFilePath
}
```

#### 7.5.3 获取 CDN 链接

```typescript
// 获取临时 CDN 链接（有效期默认 30 分钟）
const getTempFileURL = async (fileID: string) => {
  const result = await Taro.cloud.getTempFileURL({
    fileList: [fileID]
  })

  const tempURL = result.fileList[0].tempFileURL
  return tempURL
}
```

#### 7.5.4 删除文件

```typescript
// 删除云存储文件
await Taro.cloud.deleteFile({
  fileList: ['cloud://xxx.png', 'cloud://yyy.png']
})
```

### 7.6 实战案例：待办事项应用

#### 7.6.1 数据结构设计

```typescript
// 云数据库集合：todos
{
  _id: "自动生成",
  _openid: "用户 openid（自动填充）",
  title: "待办标题",
  description: "详细描述",
  done: false,
  priority: 1,  // 优先级：1-普通 2-重要 3-紧急
  createTime: "serverDate()",
  updateTime: "serverDate()"
}
```

#### 7.6.2 完整代码实现

```typescript
// src/pages/todo/index.tsx
import Taro from '@tarojs/taro'
import { View, Text, Button, Input } from '@tarojs/components'
import { useState, useEffect } from 'react'
import './index.scss'

interface Todo {
  _id: string
  title: string
  done: boolean
  priority: number
  createTime: any
}

export default function TodoPage() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTitle, setNewTitle] = useState('')
  const db = Taro.cloud.database()

  // 加载待办列表
  const loadTodos = async () => {
    const result = await db.collection('todos')
      .orderBy('createTime', 'desc')
      .get()
    setTodos(result.data)
  }

  // 添加待办
  const addTodo = async () => {
    if (!newTitle.trim()) return

    await db.collection('todos').add({
      data: {
        title: newTitle,
        done: false,
        priority: 1,
        createTime: db.serverDate()
      }
    })

    setNewTitle('')
    loadTodos()
  }

  // 切换完成状态
  const toggleTodo = async (id: string, done: boolean) => {
    await db.collection('todos').doc(id).update({
      data: { done: !done }
    })
    loadTodos()
  }

  // 删除待办
  const deleteTodo = async (id: string) => {
    await db.collection('todos').doc(id).remove()
    loadTodos()
  }

  useEffect(() => {
    loadTodos()
  }, [])

  return (
    <View className="todo-page">
      <View className="add-section">
        <Input
          className="todo-input"
          value={newTitle}
          onChange={(e) => setNewTitle(e.detail.value)}
          placeholder="输入待办事项"
        />
        <Button className="add-btn" onClick={addTodo}>添加</Button>
      </View>

      <View className="todo-list">
        {todos.map(todo => (
          <View
            key={todo._id}
            className={`todo-item ${todo.done ? 'done' : ''}`}
          >
            <View className="todo-content" onClick={() => toggleTodo(todo._id, todo.done)}>
              <Text>{todo.title}</Text>
            </View>
            <Button
              className="delete-btn"
              size="mini"
              onClick={() => deleteTodo(todo._id)}
            >
              删除
            </Button>
          </View>
        ))}
      </View>
    </View>
  )
}
```

### 7.7 云开发最佳实践

#### 7.7.1 数据库权限设置

在云开发控制台设置数据权限：

| 权限 | 说明 |
|------|------|
| **仅创建者可读写** | 用户只能操作自己创建的数据 |
| **所有用户可读** | 公开数据，如新闻列表 |
| **仅创建者可写，所有用户可读** | 博客文章场景 |
| **自定义规则** | 使用 JSON 规则定义 |

#### 7.7.2 性能优化建议

1. **创建索引**：对高频查询字段创建索引
2. **避免深度分页**：使用 `skip` 分页时限制最大页数
3. **批量操作**：使用 `add` 批量插入
4. **云函数缓存**：使用 Redis 缓存热点数据

#### 7.7.3 安全建议

1. **云函数校验**：在云函数中校验用户身份和参数
2. **数据脱敏**：敏感数据不在前端展示
3. **访问频率限制**：防止恶意调用
4. **日志记录**：开启云函数日志记录

---

*第 6 章 & 第 7 章完成 | 下一章：[性能优化与最佳实践](#8-性能优化与最佳实践)*

---

## 8. 性能优化与最佳实践

### 8.1 性能指标体系

#### 8.1.1 启动性能指标

| 指标 | 说明 | 优秀值 | 及格值 |
|------|------|--------|--------|
| **冷启动时间** | 首次打开小程序到可交互 | < 2s | < 5s |
| **热启动时间** | 已安装后重新打开 | < 1s | < 2s |
| **首屏渲染时间 (FCP)** | 用户看到第一帧内容 | < 1s | < 2s |
| **可交互时间 (TTI)** | 页面完全可交互 | < 2s | < 4s |

#### 8.1.2 运行时性能指标

| 指标 | 说明 | 目标值 |
|------|------|--------|
| **帧率 (FPS)** | 动画流畅度 | ≥ 60fps |
| **内存占用** | 运行时内存 | < 200MB |
| **CPU 使用率** | 复杂计算时 | < 50% |
| **setData 调用频率** | 小程序特有 | < 10 次/秒 |

#### 8.1.3 包体积指标

| 指标 | 限制 | 建议值 |
|------|------|--------|
| **主包大小** | 2MB 限制 | < 1.5MB |
| **分包大小** | 单分包 2MB | < 1.5MB |
| **总包体积** | 20MB 限制 | < 15MB |

### 8.2 编译时优化

#### 8.2.1 代码分包加载

**分包配置：**

```typescript
// app.config.ts
export default defineAppConfig({
  pages: [
    'pages/index/index',        // 首页（主包）
    'pages/cart/index'          // 购物车（主包）
  ],
  subPackages: [
    {
      root: 'pages/detail',     // 商品详情分包
      pages: ['index', 'review'],
      independent: false        // 非独立分包
    },
    {
      root: 'pages/user',       // 用户中心分包
      pages: ['index', 'settings'],
      independent: true         // 独立分包，可独立于主包运行
    }
  ],
  preloadRule: {
    'pages/index/index': {
      network: 'all',           // wifi 和 4G 下都预下载
      packages: ['pages/detail'] // 预下载详情分包
    }
  }
})
```

**分包策略：**

| 分包类型 | 适用场景 | 优点 |
|----------|----------|------|
| **主包** | 核心页面、公共组件 | 快速启动 |
| **普通分包** | 业务模块 | 按需加载 |
| **独立分包** | 登录、活动页 | 完全独立运行 |
| **分包预下载** | 高频访问页面 | 无感加载 |

#### 8.2.2 Tree Shaking 与按需引入

**配置 Tree Shaking：**

```json
// package.json
{
  "sideEffects": [
    "*.css",
    "*.scss",
    "*.less",
    "*.vue"
  ]
}
```

**按需引入 UI 组件：**

```javascript
// babel.config.js
module.exports = {
  plugins: [
    [
      'import',
      {
        libraryName: 'taro-ui',
        customName: name => `taro-ui/lib/components/${name.slice(3)}`,
        customStyleName: name => `taro-ui/dist/style/components/${name.slice(3)}.scss`
      },
      'taro-ui'
    ]
  ]
}
```

**使用效果：**

```tsx
// ❌ 全量引入（不推荐）
import { AtButton, AtInput, AtModal } from 'taro-ui'

// ✅ 按需引入（推荐）
import AtButton from 'taro-ui/lib/components/button'
import 'taro-ui/dist/style/components/button.scss'

import AtInput from 'taro-ui/lib/components/input'
import 'taro-ui/dist/style/components/input.scss'
```

#### 8.2.3 图片资源优化

**图片压缩：**

```bash
# 使用 imagemin 压缩图片
npm install -D imagemin imagemin-pngquant imagemin-mozjpeg

# 或使用在线工具
# TinyPNG: https://tinypng.com/
```

**图片懒加载：**

```tsx
// 使用 Taro 内置的 lazyLoad
<Image
  src={imageUrl}
  lazyLoad={true}
  mode="aspectFill"
/>

// 或使用 IntersectionObserver 实现自定义懒加载
import { useEffect, useRef, useState } from 'react'

export default function LazyImage({ src }) {
  const [loaded, setLoaded] = useState(false)
  const imgRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setLoaded(true)
        observer.disconnect()
      }
    })

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <Image
      ref={imgRef}
      src={loaded ? src : ''}
      mode="aspectFill"
    />
  )
}
```

**使用 WebP 格式：**

```typescript
// 检测 WebP 支持
const supportsWebP = () => {
  try {
    const canvas = document.createElement('canvas')
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
  } catch (e) {
    return false
  }
}

// 根据支持情况返回图片格式
const getImageUrl = (url: string) => {
  return supportsWebP() ? url.replace(/\.jpg$/, '.webp') : url
}
```

### 8.3 运行时优化

#### 8.3.1 setData 优化（小程序）

**避免频繁调用：**

```tsx
// ❌ 错误做法：循环中频繁调用 setState
items.forEach(item => {
  this.setState({ list: [...this.state.list, item] })
})

// ✅ 正确做法：批量更新
const newList = [...this.state.list, ...items]
this.setState({ list: newList })
```

**使用路径更新：**

```tsx
// ❌ 全量更新大对象
this.setState({
  userInfo: {
    ...this.state.userInfo,
    name: '新名字'
  }
})

// ✅ 路径更新（小程序特有优化）
this.setState({
  'userInfo.name': '新名字'
})
```

**使用 Taro.nextTick：**

```tsx
import Taro from '@tarojs/taro'

// 在下一个事件周期执行，避免多次渲染
Taro.nextTick(() => {
  this.setState({ data: newData })
})
```

#### 8.3.2 虚拟列表（长列表优化）

```tsx
// 使用 VirtualList 组件
import VirtualList from '@tarojs/components/virtual-list'

export default function LongList() {
  const [list, setList] = useState([])

  const renderItem = ({ index, data }) => (
    <View className="list-item">
      <Text>{data[index].title}</Text>
    </View>
  )

  return (
    <VirtualList
      height={600}           // 列表容器高度
      itemData={list}        // 列表数据
      itemSize={80}          // 每项高度（固定高度场景）
      itemCount={list.length} // 总项数
      renderItem={renderItem}
    />
  )
}
```

#### 8.3.3 防抖与节流

```typescript
// 防抖（debounce）：适用于搜索框
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: any = null
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// 节流（throttle）：适用于滚动事件
function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let lastTime = 0
  return (...args: Parameters<T>) => {
    const now = Date.now()
    if (now - lastTime >= wait) {
      lastTime = now
      func(...args)
    }
  }
}

// 使用示例
const handleSearch = debounce((value: string) => {
  // 搜索逻辑
}, 300)

const handleScroll = throttle(() => {
  // 滚动逻辑
}, 100)
```

### 8.4 网络请求优化

#### 8.4.1 请求封装与拦截

```typescript
// src/utils/request.ts
import Taro from '@tarojs/taro'

interface RequestOptions {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  data?: any
  needLogin?: boolean
}

// 请求缓存
const requestCache = new Map<string, any>()

export const request = async <T>(options: RequestOptions): Promise<T> => {
  const { url, method = 'GET', data, needLogin = false } = options

  // 检查登录状态
  if (needLogin) {
    const token = Taro.getStorageSync('token')
    if (!token) {
      Taro.navigateTo({ url: '/pages/login/index' })
      return Promise.reject(new Error('未登录'))
    }
  }

  // GET 请求缓存（1 分钟内）
  const cacheKey = `${method}:${url}:${JSON.stringify(data)}`
  if (method === 'GET') {
    const cached = requestCache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < 60000) {
      return cached.data
    }
  }

  try {
    const res = await Taro.request({
      url,
      method,
      data,
      header: {
        'Content-Type': 'application/json',
        'Authorization': Taro.getStorageSync('token')
      }
    })

    if (res.statusCode === 200) {
      const result = res.data

      // 缓存 GET 请求结果
      if (method === 'GET') {
        requestCache.set(cacheKey, {
          data: result,
          timestamp: Date.now()
        })
      }

      return result
    }

    throw new Error(`请求失败：${res.statusCode}`)
  } catch (error) {
    console.error('请求错误:', error)
    Taro.showToast({
      title: '网络开小差了',
      icon: 'none'
    })
    throw error
  }
}
```

#### 8.4.2 接口合并与批量请求

```typescript
// 方案 1：使用 Promise.all 并行请求
const [userInfo, orders, notifications] = await Promise.all([
  request({ url: '/api/user/info' }),
  request({ url: '/api/orders' }),
  request({ url: '/api/notifications' })
])

// 方案 2：后端提供聚合接口
const homeData = await request({
  url: '/api/home/data',
  data: {
    modules: ['banner', 'products', 'news']
  }
})
```

#### 8.4.3 图片 CDN 优化

```typescript
// 图片 CDN 配置
const CDN_BASE = 'https://cdn.example.com'

// 根据设备 DPR 返回不同分辨率图片
const getOptimizedImageUrl = (url: string, width: number = 300) => {
  const dpr = Taro.getSystemInfoSync().pixelRatio
  const optimizedWidth = Math.round(width * dpr)
  return `${CDN_BASE}/${url}?x-oss-process=image/resize,w_${optimizedWidth}`
}
```

### 8.5 常见问题排查

#### 8.5.1 内存泄漏

**常见原因：**
1. 未清理的定时器（setInterval）
2. 未取消的事件监听
3. 未清理的 IntersectionObserver

**解决方案：**

```tsx
import { useEffect, useRef } from 'react'

export default function MyComponent() {
  const timerRef = useRef<any>(null)
  const observerRef = useRef<any>(null)

  useEffect(() => {
    // 创建定时器
    timerRef.current = setInterval(() => {
      console.log('定时任务')
    }, 1000)

    // 创建观察者
    observerRef.current = new IntersectionObserver((entries) => {
      console.log('元素可见')
    })

    // 清理函数
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [])

  return <View>组件内容</View>
}
```

#### 8.5.2 白屏问题

**可能原因：**
1. 首屏数据加载慢
2. 包体积过大下载慢
3. JS 执行阻塞渲染

**解决方案：**

```typescript
// 1. 启用预渲染（Taro Prerender）
// config/index.ts
export default defineConfig({
  prerender: {
    match: 'pages/index/index'  // 预渲染首页
  }
})

// 2. 骨架屏
export default function Index() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)

  useEffect(() => {
    loadData().then(res => {
      setData(res)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return <Skeleton />  // 显示骨架屏
  }

  return <View>{data && <Content data={data} />}</View>
}
```

#### 8.5.3 样式兼容性问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| H5 底部空白 | 高度塌陷 + absolute | 父元素设置 `overflow: hidden` |
| 小程序样式不生效 | 使用了标签选择器 | 改用 className |
| 单位显示异常 | px/rpx 混用 | 统一使用 px，让 Taro 转换 |
| 安全区域问题 | iPhone 刘海屏 | 使用 `padding-bottom: constant(safe-area-inset-bottom)` |

### 8.6 开发最佳实践

#### 8.6.1 代码组织

```
src/
├── apis/               # API 接口层
│   ├── user.ts        # 用户相关 API
│   ├── order.ts       # 订单相关 API
│   └── index.ts       # API 统一导出
├── components/         # 公共组件
│   ├── Loading/       # 加载组件
│   ├── Empty/         # 空状态组件
│   └── Modal/         # 弹窗组件
├── hooks/             # 自定义 Hooks
│   ├── useRequest.ts  # 请求 Hook
│   ├── useAuth.ts     # 认证 Hook
│   └── index.ts
├── pages/             # 页面组件
│   ├── index/         # 首页
│   ├── detail/        # 详情页
│   └── user/          # 用户中心
├── store/             # 状态管理
│   ├── user.ts        # 用户状态
│   └── index.ts
├── styles/            # 全局样式
│   ├── variables.scss # 样式变量
│   └── mixins.scss    # SCSS Mixins
├── utils/             # 工具函数
│   ├── request.ts     # 请求封装
│   ├── storage.ts     # 存储封装
│   └── index.ts
└── constants/         # 常量定义
    ├── api.ts         # API 常量
    └── index.ts
```

#### 8.6.2 代码审查清单

**性能检查：**
- [ ] 图片是否懒加载
- [ ] 列表是否使用虚拟列表
- [ ] 是否存在频繁 setState
- [ ] 是否合理分包

**代码质量：**
- [ ] TypeScript 类型定义完整
- [ ] 无 console.log（生产环境）
- [ ] 错误处理完善
- [ ] 组件复用合理

**安全检查：**
- [ ] 敏感数据脱敏
- [ ] API 鉴权完善
- [ ] 输入校验完整
- [ ] XSS 防护

#### 8.6.3 调试技巧

**微信开发者工具：**
- 使用「真机调试」模式
- 开启「性能面板」查看 FPS
- 使用「网络面板」分析请求
- 使用「存储面板」查看本地数据

**Taro Debugger：**
- 查看组件树
- 查看状态变化
- 性能分析

**H5 调试：**
- Chrome DevTools
- Lighthouse 性能评分
- Network 面板节流模拟

---

## 附录：学习资源

### 官方资源
- **Taro 官方文档**：https://taro-docs.jd.com/
- **GitHub 仓库**：https://github.com/NervJS/taro
- **Taro UI 文档**：https://taro-ui.jd.com/
- **微信云开发文档**：https://developers.weixin.qq.com/miniprogram/dev/wxcloud/

### 社区资源
- **掘金 Taro 专栏**：https://juejin.cn/tag/Taro
- **CSDN Taro 专区**：https://blog.csdn.net/tag/Taro
- **腾讯云开发者社区**：https://cloud.tencent.com/developer/column

### 推荐工具
- **微信开发者工具**：小程序开发调试
- **Taro Debugger**：Taro 专用调试工具
- **TinyPNG**：图片压缩工具
- **Lighthouse**：H5 性能分析

---

*文档版本：1.0.0*
*创建时间：2026-03-28*
*最后更新：2026-03-28*
*调研状态：✅ 已完成*

---

**🎉 恭喜！《Taro 跨端框架核心知识体系》文档已完成！**

本文档共 8 章，涵盖：
1. 概述 - 技术演进、框架对比
2. 核心概念 - 架构设计、编译原理、虚拟 DOM、Hooks 机制
3. 快速入门 - 环境搭建、项目创建
4. 基础用法 - 组件开发、路由导航、状态管理、样式方案
5. 高级特性 - 条件编译、多端适配
6. 跨端部署 - 小程序、H5、React Native 部署
7. 微信云开发集成 - 云函数、云数据库、云存储实战
8. 性能优化与最佳实践 - 性能指标、优化技巧、常见问题

文档位置：`Knowledge Base/Taro/Taro 跨端框架核心知识体系.md`
