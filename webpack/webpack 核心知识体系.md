# webpack 核心知识体系

> **一句话描述：** webpack 是一个用于现代 JavaScript 应用程序的静态模块打包工具
>
> **特色：** 概念定义 + 工作原理 + 源码解析 + 代码示例 + 常见误区 + 最佳实践

---

## 目录

1. [概述](#1-概述)
2. [核心概念](#2-核心概念)
3. [快速入门](#3-快速入门)
4. [基础用法](#4-基础用法)
5. [高级特性](#5-高级特性)
6. [工作原理与源码解析](#6-工作原理与源码解析)
7. [性能优化](#7-性能优化)
8. [生态与插件](#8-生态与插件)
9. [实战案例](#9-实战案例)
10. [常见问题](#10-常见问题)
11. [学习资源](#11-学习资源)

---

## 1. 概述

### 1.1 webpack 是什么

**定义：** webpack 是一个用于现代 JavaScript 应用程序的**静态模块打包工具**（module bundler）。

**核心功能：**
- 将各种资源（JavaScript、CSS、图片、字体等）视为模块
- 通过依赖关系将它们打包成适合生产环境使用的静态资源
- 递归构建依赖关系图（dependency graph）

**为什么需要 webpack：**
1. **模块化支持**：原生支持 ES Modules、CommonJS、AMD 等多种模块系统
2. **资源管理**：统一处理所有类型的资源文件
3. **代码分割**：实现按需加载，优化首屏加载时间
4. **生态扩展**：通过 loader 和 plugin 高度可扩展

### 1.2 webpack 发展历史

| 版本 | 发布时间 | 主要特性 |
|------|----------|----------|
| webpack 1 | 2014 | 初始版本，引入 loader 概念 |
| webpack 2 | 2017 | 原生 ES 模块支持，Tree Shaking |
| webpack 3 | 2017 | Scope Hoisting，更快的构建速度 |
| webpack 4 | 2018 | 零配置启动，mode 概念，性能大幅提升 |
| webpack 5 | 2020 | 持久化缓存，Module Federation，更好的 Tree Shaking |

### 1.3 webpack vs 其他构建工具

| 工具 | 定位 | 优势 | 适用场景 |
|------|------|------|----------|
| **webpack** | 模块打包器 | 生态丰富、高度可配置 | 大型复杂项目 |
| **Vite** | 开发服务器 + 打包器 | 开发启动快、HMR 迅速 | 现代前端项目 |
| **Rollup** | 库打包器 | 输出简洁、Tree Shaking 强 | 库/组件打包 |
| **Parcel** | 零配置打包器 | 开箱即用、配置简单 | 小型项目、原型 |

---

## 2. 核心概念

### 2.1 Entry（入口）

**是什么：** Entry 指示 webpack 应该使用哪个模块作为构建其内部依赖图的开始。

**为什么需要：** 就像应用程序的"启动文件"。webpack 需要从一个起点开始，才能顺藤摸瓜遍历出整个项目的依赖关系图。

**常用写法：**

```javascript
// 单入口 (SPA)
module.exports = {
  entry: './src/index.js'
}

// 多入口 (MPA)
module.exports = {
  entry: {
    home: './src/home/index.js',
    about: './src/about/index.js'
  }
}

// 动态入口
module.exports = async () => ({
  entry: process.env.MOBILE ? './src/mobile.js' : './src/desktop.js'
})
```

**常见误区：**
- ❌ 认为只能有一个入口 → ✅ 可以有多个入口
- ❌ 入口必须是 JS 文件 → ✅ 可以是任何类型文件

### 2.2 Output（出口）

**是什么：** Output 告诉 webpack 在哪里输出它所创建的 bundle，以及如何命名这些文件。

**为什么需要：** webpack 处理完所有资源后，需要知道将打包后的"产品"放在哪个"仓库"里，以及给这些产品起什么名字。

**核心配置：**

```javascript
const path = require('path')

module.exports = {
  output: {
    path: path.resolve(__dirname, 'dist'),           // 输出目录（必填）
    filename: '[name].[contenthash:8].js',           // 入口 chunk 命名
    chunkFilename: 'chunks/[name].[contenthash:8].js', // 非入口 chunk 命名
    publicPath: 'https://cdn.example.com/assets/',   // CDN 路径
    assetModuleFilename: 'assets/[name].[hash:8][ext]' // 资源模块路径
  }
}
```

**Hash 类型详解：**

| Hash 类型 | 说明 | 适用场景 |
|-----------|------|----------|
| `[hash]` | 项目级别的 hash，任何改动都会变化 | 不推荐用于文件名 |
| `[chunkhash]` | chunk 级别的 hash | 适合入口文件 |
| `[contenthash]` | 内容级别的 hash，只有内容变化才变 | ✅ 最适合生产环境 |

### 2.3 Loader（加载器）

**是什么：** Loader 是模块代码转换器，让 webpack 能够处理除了 JS、JSON 之外的其他类型文件。

**为什么需要：** webpack 原生只能理解 JavaScript 和 JSON，Loader 充当"翻译官"角色，将其他文件转换为有效模块。

**工作原理：**

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,           // 1. 识别：哪些文件需要转换
        use: ['style-loader', 'css-loader']  // 2. 转换：如何转换
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource'    // webpack 5 内置资源模块
      }
    ]
  }
}
```

**Loader 执行顺序（重要）：**

```javascript
// 配置
use: ['loader1', 'loader2', 'loader3']

// 执行顺序：从右到左，从下到上
// loader3 → loader2 → loader1

// 原因：每个 loader 的输出是下一个 loader 的输入
// 文件 → loader3 → loader2 → loader1 → 最终结果
```

### 2.4 Plugin（插件）

**是什么：** Plugin 是扩展插件，在 webpack 运行的生命周期中会广播出许多事件，Plugin 可以监听这些事件，在合适的时机通过 webpack 提供的 API 改变输出结果。

**为什么需要：** 如果说 Loader 是"翻译官"，那么 Plugin 就是"优化大师"，负责范围更广的任务，如打包优化、资源管理、环境变量注入等。

**常用 Plugin：**

```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { DefinePlugin } = require('webpack')

module.exports = {
  plugins: [
    // 自动生成 HTML 文件
    new HtmlWebpackPlugin({
      template: './src/index.html',
      minify: true
    }),
    // 定义环境变量
    new DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    // 提取 CSS 到单独文件
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css'
    })
  ]
}
```

**Plugin 与 Loader 的区别：**

| 特性 | Loader | Plugin |
|------|--------|--------|
| **职责** | 文件转换 | 范围更广的任务 |
| **执行时机** | 模块加载时 | 整个构建生命周期 |
| **数量** | 可以多个串联 | 可以注册多个 |

### 2.5 Module（模块）

**定义：** 在 webpack 里一切皆模块，一个模块对应着一个文件。

**模块类型：**
- JavaScript 模块（.js, .jsx, .ts, .tsx）
- CSS 模块（.css, .scss, .less）
- 图片模块（.png, .jpg, .svg）
- 字体模块（.woff, .ttf）
- 其他任何文件

**模块解析优先级：**
1. 绝对路径
2. 路径别名（resolve.alias）
3. 相对路径
4. 模块名（node_modules）

### 2.6 Chunk（代码块）

**定义：** Chunk 是代码块，一个 Chunk 由多个模块组合而成，用于代码合并与分割。

**Chunk 类型：**
- **Entry Chunk**：包含入口文件和它依赖的所有模块
- **Async Chunk**：动态导入生成的异步 chunk
- **Initial Chunk**：初始加载的 chunk
- **Normal Chunk**：普通代码块

**Module、Chunk、Bundle 的关系：**

```
Module（模块）
    ↓ 按依赖组合
Chunk（代码块）
    ↓ 优化后输出
Bundle（产物）

示例：
- src/index.js（Module）+ src/utils.js（Module）→ main（Chunk）→ main.js（Bundle）
- src/lazy.js（Module）→ lazy（Chunk）→ lazy.js（Bundle）
```

### 2.7 Dependency Graph（依赖图）

**是什么：** webpack 从 Entry 开始，递归找出所有依赖的模块，构建的依赖关系图。

**工作原理：**
1. 从入口文件开始
2. 解析 import/require 语句
3. 递归查找依赖
4. 构建完整的依赖图

---

## 3. 快速入门

### 3.1 安装与初始化

```bash
# 1. 初始化项目
npm init -y

# 2. 安装 webpack 核心
npm install --save-dev webpack webpack-cli

# 3. 验证安装
npx webpack --version
```

### 3.2 零配置使用

webpack 4+ 支持零配置启动：

```bash
# 默认配置
# 入口：./src/index.js
# 出口：./dist/main.js
# 模式：production

npx webpack
```

### 3.3 基础配置文件

创建 `webpack.config.js`：

```javascript
const path = require('path')

module.exports = {
  mode: 'development',  // 或 'production'
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
}
```

### 3.4 第一个打包项目

**项目结构：**
```
my-project/
├── src/
│   ├── index.js
│   └── utils.js
├── dist/
└── webpack.config.js
```

**src/utils.js：**
```javascript
export function add(a, b) {
  return a + b
}
```

**src/index.js：**
```javascript
import { add } from './utils.js'

console.log(add(1, 2)) // 3
```

**打包命令：**
```bash
npx webpack
# 输出：dist/main.js
```

---

## 4. 基础用法

### 4.1 打包 JavaScript

```javascript
module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
}
```

### 4.2 打包 CSS

```javascript
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,  // 提取 CSS 到单独文件
          'css-loader'                   // 处理 @import 和 url()
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css'
    })
  ]
}
```

### 4.3 打包图片/字体

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'images/[name].[hash:8][ext]'
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name].[hash:8][ext]'
        }
      }
    ]
  }
}
```

### 4.4 打包 HTML

```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      title: 'My App',
      template: './src/index.html',  // 模板文件
      filename: 'index.html',        // 输出文件名
      minify: {                      // 压缩 HTML
        collapseWhitespace: true,
        removeComments: true
      }
    })
  ]
}
```

### 4.5 打包其他资源

```javascript
module.exports = {
  module: {
    rules: [
      // JSON 文件（webpack 原生支持）
      {
        test: /\.json$/,
        type: 'asset/resource'
      },
      // XML 文件
      {
        test: /\.xml$/,
        use: ['xml-loader']
      },
      // Markdown 文件
      {
        test: /\.md$/,
        use: ['html-loader', 'markdown-loader']
      }
    ]
  }
}
```

---

## 5. 高级特性

### 5.1 代码分割（Code Splitting）

**是什么：** 将单一大型 bundle 拆分为多个较小 chunk，实现按需加载。

**为什么需要：** 避免一次性加载全部代码，减少首屏加载体积。

**三种分割方式：**

**方式 1：Entry Points 手动分割**
```javascript
module.exports = {
  entry: {
    main: './src/main.js',
    vendor: './src/vendor.js'
  },
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist')
  }
}
```

**方式 2：SplitChunksPlugin 自动分割（推荐）**
```javascript
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',           // 对同步/异步都分割
      minSize: 30000,          // 模块最小体积 30KB
      maxAsyncRequests: 6,     // 异步加载最大并行请求数
      maxInitialRequests: 4,   // 入口点最大并行请求数
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 20,
          enforce: true
        },
        common: {
          name: 'common',
          minChunks: 2,        // 被 2 处引用即归为公共模块
          priority: 10,
          reuseExistingChunk: true
        }
      }
    }
  }
}
```

**方式 3：动态导入自动分割**
```javascript
// 动态 import() 会自动生成独立 chunk
const module = await import('./module.js')

// 指定 chunk 名称
const module = await import(
  /* webpackChunkName: "my-chunk" */ './module.js'
)
```

**性能对比：**

| 分割方式 | 首屏体积 | 加载时间 | 缓存利用率 |
|----------|----------|----------|------------|
| 无分割 | 1.8MB | 4200ms | 低 |
| 基础 Vendor 分割 | 1.2MB | 2900ms | 中 |
| 智能动态分割 | 680KB | 1800ms | 高 |

### 5.2 懒加载（Lazy Loading）

**是什么：** 仅在需要时动态加载特定模块，而非初始加载时一次性获取全部资源。

**实现方式：**

```javascript
// 标准动态导入
const module = await import('./module.js')

// React 懒加载组件
const LazyComponent = React.lazy(() => import('./Component'))

// 路由级懒加载
const routes = [
  {
    path: '/home',
    component: () => import('./pages/Home.vue')
  },
  {
    path: '/about',
    component: () => import('./pages/About.vue')
  }
]
```

### 5.3 Tree Shaking

**是什么：** 通过静态分析 ES 模块结构，移除未使用导出（dead code）的优化机制。

**为什么需要：** 消除无用代码，减小打包体积。

**工作原理：**
1. 依赖图谱构建：通过 acorn 解析器生成 AST
2. 副作用标记：根据 package.json 的 sideEffects 字段识别
3. 死代码消除：结合 Terser 移除未使用的导出

**启用 Tree Shaking：**

```javascript
module.exports = {
  mode: 'production',  // 生产模式自动启用
  optimization: {
    usedExports: true,  // 标记未使用的导出
    minimize: true      // 使用 Terser 移除
  }
}
```

**sideEffects 配置：**

```json
// package.json
{
  "name": "my-library",
  "sideEffects": false  // 标记为无副作用，可安全删除未引用代码
}

// 如果有副作用文件
{
  "sideEffects": [
    "*.css",
    "core-js/*"
  ]
}
```

**常见陷阱：**
- ❌ 使用 CommonJS 无法 Tree Shaking → ✅ 使用 ES6 import/export
- ❌ 动态导入无法分析 → ✅ 尽量静态导入
- ❌ 副作用模块被误删 → ✅ 正确配置 sideEffects

### 5.4 热模块替换（HMR）

**是什么：** 一个模块发生改变时只重新加载该模块，而不重新加载所有。

**开启 HMR：**

```javascript
// webpack.config.js
module.exports = {
  devServer: {
    hot: true,
    open: true
  }
}
```

**在代码中启用：**

```javascript
// 入口文件中
if (module.hot) {
  module.hot.accept('./print.js', () => {
    // print.js 变化时执行回调
    print()
  })
}
```

### 5.5 Externals（外部化）

**是什么：** 将某些依赖排除在打包之外，从外部源获取。

**为什么需要：** 减少打包体积，使用 CDN 加载大型库。

```javascript
module.exports = {
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM',
    'jquery': 'jQuery'
  }
}

// HTML 中引入
<script src="https://cdn.example.com/react.js"></script>
```

### 5.6 多入口配置

```javascript
module.exports = {
  entry: {
    index: './src/pages/index/main.js',
    about: './src/pages/about/main.js',
    contact: './src/pages/contact/main.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      chunks: ['index'],
      filename: 'index.html'
    }),
    new HtmlWebpackPlugin({
      chunks: ['about'],
      filename: 'about.html'
    })
  ]
}
```

### 5.7 DLL 打包

**是什么：** 将不经常变动的第三方库单独打包。

```javascript
// webpack.dll.js
module.exports = {
  entry: {
    vendor: ['react', 'react-dom']
  },
  output: {
    filename: '[name].dll.js',
    path: path.resolve(__dirname, 'dll')
  },
  plugins: [
    new DllPlugin({
      name: '[name]',
      path: path.resolve(__dirname, 'dll/[name]-manifest.json')
    })
  ]
}
```

### 5.8 持久化缓存

**webpack 5 内置缓存：**

```javascript
module.exports = {
  cache: {
    type: 'filesystem',  // 使用文件系统缓存
    buildDependencies: {
      config: [__filename]  // 配置文件变化时重新缓存
    }
  }
}
```

---

## 6. 工作原理与源码解析（新增）

### 6.1 Compiler（编译器）

**定义：** Compiler 是 webpack 的核心编译引擎，负责整个构建流程的调度和管理。

**为什么需要：** 就像乐队的指挥，Compiler 不直接处理每个模块，而是协调各个插件和 Loader，在正确的时机执行正确的任务。

**核心源码结构：**

```javascript
// lib/Compiler.js (简化版)
const { Tapable } = require("tapable");

class Compiler extends Tapable {
  constructor(context) {
    super();
    this.context = context;           // 上下文（项目根目录）
    this.hooks = {                    // 生命周期钩子
      environment: new SyncHook([]),
      run: new AsyncSeriesHook(["compiler"]),
      compile: new SyncHook(["params"]),
      compilation: new SyncHook(["compilation", "params"]),
      make: new AsyncParallelHook(["compilation"]),
      emit: new AsyncSeriesHook(["compilation"]),
      done: new AsyncSeriesHook(["stats"]),
      failed: new SyncHook(["error"])
    };
    this.options = {};                // 配置对象
    this.running = false;             // 构建状态
    this.compilation = null;          // 当前 Compilation 实例
  }
}
```

**关键属性：**
- `context`：项目根目录，所有相对路径的基准
- `options`：合并后的配置（webpack.config.js + 默认配置）
- `hooks`：生命周期钩子集合，插件通过监听这些钩子介入构建流程
- `compilation`：当前活动的 Compilation 实例，代表一次完整的编译过程

**生命周期钩子触发顺序：**

```
environment → afterEnvironment → initialize
→ run → compile → compilation → make
→ emit → afterEmit → done (失败 → failed)
```

**Compiler.run() 源码解析：**

```javascript
run(callback) {
  if (this.running) {
    return callback(new ConcurrentCompilationError());
  }
  this.running = true;

  // 1. 触发 run 钩子（插件可在此阶段拦截）
  this.hooks.run.callAsync(this, (err) => {
    if (err) return callback(err);

    // 2. 执行核心编译逻辑
    this.compile((err, compilation) => {
      if (err) return callback(err);

      // 3. 触发 emit 钩子（插件可修改最终资源）
      this.hooks.emit.callAsync(compilation, (err) => {
        if (err) return callback(err);

        // 4. 输出文件到磁盘
        this.outputFileSystem.writeFile(...);

        // 5. 触发 done 钩子，传递统计信息
        const stats = new Stats(compilation);
        this.hooks.done.callAsync(stats, () => {
          this.running = false;
          callback(null, stats);
        });
      });
    });
  });
}
```

### 6.2 Compilation（编译过程）

**定义：** Compilation 实例代表一次完整的模块编译过程，包含模块解析、优化、分块、资源生成等所有步骤。

**Compiler vs Compilation：**
| 特性 | Compiler | Compilation |
|------|----------|-------------|
| **生命周期** | 整个构建流程（从启动到完成） | 单次编译过程 |
| **实例数量** | 一个项目只有一个 | 每次文件变化都会创建新实例 |
| **职责** | 调度、钩子触发 | 模块解析、优化、资源生成 |
| **继承** | 继承 Tapable | 继承 Tapable |

**核心源码结构：**

```javascript
// lib/Compilation.js (简化版)
class Compilation extends Tapable {
  constructor(compiler) {
    super();
    this.compiler = compiler;
    this.modules = [];         // 所有被处理的模块
    this.chunks = [];          // 代码块
    this.assets = {};          // 最终输出的资源
    this.entries = [];         // 入口模块
    this.errors = [];          // 编译错误
    this.warnings = [];        // 编译警告
  }

  // 添加入口文件，开始递归分析依赖
  addEntry(context, entry, name, callback) {
    // 从入口文件开始，递归构建依赖图
  }

  // 冻结依赖图，执行优化
  seal() {
    // 1. 标记未使用的导出（Tree Shaking）
    // 2. 代码分割（SplitChunks）
    // 3. 模块合并（ConcatenateModules）
    // 4. 资源生成
  }

  // 输出资源
  emitAsset(name, source) {
    this.assets[name] = source;
    // 触发 hook，允许插件修改
  }
}
```

**Compilation 工作流程：**

```
1. addEntry() - 添加入口，开始递归分析
2. buildModule() - 构建模块，调用 Loader 转换
3. processDependencies() - 处理依赖，递归分析
4. seal() - 冻结，执行优化（Tree Shaking、SplitChunks）
5. createChunkAssets() - 生成 chunk 资源
6. emitAssets() - 输出资源
```

### 6.3 Tapable（事件流机制）

**定义：** Tapable 是 webpack 实现的事件流机制核心，提供钩子（Hook）的注册（tap）和触发（call）能力。

**为什么需要：** webpack 的插件系统依赖于 Tapable，它让插件可以在构建流程的任意阶段介入，修改构建结果或执行自定义操作。

**Tapable 钩子类型：**

```javascript
const {
  // 同步钩子
  SyncHook,                 // 依次执行，不关心返回值
  SyncBailHook,             // 一旦有返回值则停止
  SyncWaterfallHook,        // 瀑布流，上一个返回值作为下一个参数
  SyncLoopHook,             // 循环执行，直到返回 undefined

  // 异步钩子（并行）
  AsyncParallelHook,        // 并行执行，等待所有完成
  AsyncParallelBailHook,    // 并行执行，有返回值则停止

  // 异步钩子（串行）
  AsyncSeriesHook,          // 串行执行，不关心返回值
  AsyncSeriesBailHook,      // 串行执行，有返回值则停止
  AsyncSeriesWaterfallHook  // 串行瀑布流
} = require("tapable");
```

**钩子使用示例：**

```javascript
// 1. 创建钩子
const hook = new SyncHook(["arg1", "arg2"]);

// 2. 注册插件（监听钩子）
hook.tap("PluginA", (arg1, arg2) => {
  console.log("PluginA 执行", arg1, arg2);
});

hook.tap("PluginB", (arg1, arg2) => {
  console.log("PluginB 执行", arg1, arg2);
});

// 3. 触发钩子
hook.call("value1", "value2");
// 输出：PluginA 执行 value1 value2
//      PluginB 执行 value1 value2
```

**webpack 中的 Tapable 应用：**

```javascript
// Compiler 继承 Tapable
class Compiler extends Tapable {
  constructor() {
    super();
    // 定义钩子
    this.hooks = {
      run: new AsyncSeriesHook(["compiler"]),
      compile: new SyncHook(["params"]),
      // ...
    };
  }
}

// Plugin 通过 tap 方法注册
class MyPlugin {
  apply(compiler) {
    // 监听 run 钩子
    compiler.hooks.run.tap("MyPlugin", (compiler) => {
      console.log("构建开始");
    });

    // 监听 emit 钩子（可修改输出资源）
    compiler.hooks.emit.tapAsync("MyPlugin", (compilation, callback) => {
      // 添加新文件
      compilation.assets["file.txt"] = {
        source: () => "文件内容",
        size: () => 4
      };
      callback();
    });
  }
}
```

### 6.4 构建流程完整解析

**完整构建流程图：**

```
┌─────────────────────────────────────────────────────────────┐
│                     Compiler.run()                          │
│  1. 触发 run 钩子                                              │
│  2. 调用 compile()                                          │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                   compile()                                 │
│  1. 创建 Compilation 实例                                      │
│  2. 触发 compile 钩子                                          │
│  3. 触发 compilation 钩子（插件可获取 Compilation）            │
│  4. 调用 make()                                             │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                   make()                                    │
│  1. 触发 make 钩子                                             │
│  2. 从 Entry 开始递归分析依赖                                  │
│  3. 调用 buildModule() 构建每个模块                           │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              buildModule() - 模块构建                        │
│  1. 根据文件类型调用对应 Loader                             │
│  2. Loader 转换模块源码                                      │
│  3. 解析 AST，查找 import/require 依赖                        │
│  4. 递归处理依赖模块                                        │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              seal() - 优化阶段                               │
│  1. 标记未使用导出（Tree Shaking）                           │
│  2. 代码分割（SplitChunks）                                  │
│  3. 模块合并（ConcatenateModules）                          │
│  4. 生成 Chunks 和资源                                        │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              emit 阶段 - 输出资源                             │
│  1. 触发 emit 钩子（插件可修改资源）                           │
│  2. 写入文件系统                                             │
│  3. 触发 afterEmit 钩子                                       │
│  4. 触发 done 钩子，构建完成                                 │
└─────────────────────────────────────────────────────────────┘
```

**Loader 执行流程源码解析：**

```javascript
// 假设配置：use: ['style-loader', 'css-loader']
// 文件：style.css

// webpack 内部执行顺序：从右到左，从下到上
// 1. css-loader 处理：将 CSS 转换为 JS 模块
const cssContent = await cssLoader(source);
// 输出：module.exports = "body { color: red; }"

// 2. style-loader 处理：将 CSS 注入 DOM
const finalContent = await styleLoader(cssContent);
// 输出：在浏览器中创建 <style> 标签
```

**自定义 Loader 示例：**

```javascript
// my-loader.js
module.exports = function(source) {
  // source 是文件的原始内容（字符串）

  // 简单替换示例
  return source.replace(/old/g, 'new');
};

// 异步 Loader
module.exports = async function(source) {
  const callback = this.callback;

  try {
    // 异步处理
    const result = await someAsyncOperation(source);
    callback(null, result);
  } catch (err) {
    callback(err);
  }
};

// 使用
module.exports = {
  module: {
    rules: [{
      test: /\.js$/,
      use: [path.resolve('./my-loader.js')]
    }]
  }
};
```

**自定义 Plugin 示例：**

```javascript
class MyPlugin {
  apply(compiler) {
    // 监听 compilation 钩子
    compiler.hooks.compilation.tap("MyPlugin", (compilation) => {
      // 在 compilation 阶段执行
      console.log("Compilation 开始");
    });

    // 监听 emit 钩子（可修改输出）
    compiler.hooks.emit.tapAsync("MyPlugin", (compilation, callback) => {
      // 添加新文件到输出
      compilation.assets["info.txt"] = {
        source: () => "构建时间：" + new Date().toISOString(),
        size: () => 30
      };
      callback();
    });

    // 监听 done 钩子（构建完成）
    compiler.hooks.done.tap("MyPlugin", (stats) => {
      console.log("构建完成，耗时:", stats.endTime - stats.startTime);
    });
  }
}
```

---

### 6.5 webpack 5 新特性详解

#### 6.5.1 持久化缓存（Persistent Caching）

**原理：** webpack 5 引入持久化缓存，将构建中间结果存储到磁盘，下次构建时直接使用缓存，显著提升二次构建速度。

**配置方式：**

```javascript
module.exports = {
  cache: {
    type: 'filesystem',  // 使用文件系统缓存
    cacheDirectory: path.resolve(__dirname, '.webpack-cache'),
    buildDependencies: {
      config: [__filename]  // 配置文件变化时清空缓存
    }
  }
};
```

**cache 配置项详解：**

| 配置项 | 说明 | 默认值 |
|--------|------|--------|
| `type` | 缓存类型：'memory' \| 'filesystem' | 开发模式'memory'，生产模式禁用 |
| `cacheDirectory` | 缓存文件路径 | `node_modules/.cache/webpack` |
| `buildDependencies` | 缓存依赖文件，变化时清空缓存 | - |
| `managedPaths` | 受控目录（如 node_modules），跳过哈希对比 | `['./node_modules']` |
| `profile` | 输出缓存处理详细日志 | false |
| `maxAge` | 缓存失效时间（毫秒） | 5184000000 (60 天) |

#### 6.5.2 模块联邦（Module Federation）

**定义：** Module Federation 允许多个独立的 webpack 构建共享模块，实现微前端架构。

**配置示例：**

```javascript
const { ModuleFederationPlugin } = require('webpack').container;

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'host',  // 应用名称
      remotes: {
        remoteApp: 'remoteApp@http://localhost:3001/remoteEntry.js'
      },
      shared: {
        react: { singleton: true },  // 共享依赖
        'react-dom': { singleton: true }
      },
      exposes: {
        './Button': './src/Button.js'  // 暴露给其他应用的模块
      }
    })
  ]
};
```

**应用场景：**
1. **微前端架构**：多个独立应用共享组件和依赖
2. **组件库分发**：将组件库发布为远程模块
3. **按需加载**：动态加载远程模块，减少初始体积

---

## 7. 性能优化

### 7.1 构建速度优化

**缩小文件搜索范围：**

```javascript
module.exports = {
  resolve: {
    modules: [path.resolve(__dirname, 'node_modules')],
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'src'),  // 只处理 src 目录
        use: ['babel-loader']
      }
    ]
  }
}
```

**多线程构建：**

```javascript
const threadLoader = require('thread-loader')

module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          'thread-loader',  // 多线程处理
          'babel-loader'
        ]
      }
    ]
  }
}
```

**持久化缓存：**

```javascript
module.exports = {
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename]
    }
  }
}
```

### 7.2 输出文件优化

**使用 Bundle Analyzer 分析：**

```javascript
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'server',
      openAnalyzer: true,
      generateStatsFile: true,
      statsFilename: 'stats.json'
    })
  ]
}
```

**优化措施：**
1. 使用 ESBuild/SWC 替代 Babel
2. 优化 Terser 参数
3. Tree Shaking + sideEffects
4. 压缩图片
5. 替换大型依赖（moment → dayjs）

### 7.3 缓存策略

**长期缓存配置：**

```javascript
module.exports = {
  output: {
    filename: '[name].[contenthash].js',
    chunkFilename: '[name].[contenthash].chunk.js',
    assetModuleFilename: '[name].[contenthash][ext]'
  },
  cache: {
    type: 'filesystem'
  }
}
```

### 7.4 生产环境配置

```javascript
module.exports = {
  mode: 'production',
  optimization: {
    minimize: true,
    usedExports: true,
    concatenateModules: true,  // 模块合并
    splitChunks: {
      chunks: 'all'
    }
  }
}
```

---

## 8. 生态与插件

### 8.1 常用 Loader

| Loader | 用途 | 配置示例 |
|--------|------|----------|
| babel-loader | ES6+ 转译 | `{ loader: 'babel-loader' }` |
| css-loader | 处理 CSS | `{ loader: 'css-loader' }` |
| style-loader | 注入 CSS 到 DOM | `{ loader: 'style-loader' }` |
| sass-loader | 编译 Sass | `{ loader: 'sass-loader' }` |
| postcss-loader | PostCSS 处理 | `{ loader: 'postcss-loader' }` |
| file-loader | 处理文件 | `{ loader: 'file-loader' }` |
| url-loader | 文件转 base64 | `{ loader: 'url-loader' }` |
| ts-loader | TypeScript 编译 | `{ loader: 'ts-loader' }` |
| vue-loader | Vue 单文件组件 | `{ loader: 'vue-loader' }` |

### 8.2 常用 Plugin

| Plugin | 用途 |
|--------|------|
| HtmlWebpackPlugin | 自动生成 HTML |
| MiniCssExtractPlugin | 提取 CSS 到单独文件 |
| DefinePlugin | 定义环境变量 |
| CopyWebpackPlugin | 复制文件到输出目录 |
| TerserPlugin | 压缩 JavaScript |
| CssMinimizerPlugin | 压缩 CSS |
| DllPlugin | DLL 打包 |
| DllReferencePlugin | 引用 DLL |

### 8.3 自定义 Loader

```javascript
// my-loader.js
module.exports = function(source) {
  // source 是文件的原始内容
  return source.replace(/old/g, 'new')
}

// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [path.resolve('./my-loader.js')]
      }
    ]
  }
}
```

### 8.4 自定义 Plugin

```javascript
class MyPlugin {
  apply(compiler) {
    compiler.hooks.emit.tap('MyPlugin', (compilation) => {
      // 在 emit 阶段执行
      compilation.assets['file.txt'] = {
        source: () => '文件内容',
        size: () => 4
      }
    })
  }
}
```

---

## 9. 实战案例

### 9.1 单页应用（SPA）配置

```javascript
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ],
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  }
}
```

### 9.2 多页应用（MPA）配置

```javascript
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: {
    index: './src/pages/index/main.js',
    about: './src/pages/about/main.js'
  },
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new HtmlWebpackPlugin({
      chunks: ['index'],
      filename: 'index.html',
      template: './src/pages/index/index.html'
    }),
    new HtmlWebpackPlugin({
      chunks: ['about'],
      filename: 'about.html',
      template: './src/pages/about/index.html'
    })
  ]
}
```

### 9.3 库/组件库打包

```javascript
module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'mylib.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'MyLib',
    libraryTarget: 'umd',  // 支持所有模块系统
    globalObject: 'this'
  },
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM'
  }
}
```

### 9.4 SSR 项目配置

```javascript
// webpack.server.js - 服务端配置
module.exports = {
  target: 'node',
  entry: './src/server/entry.js',
  output: {
    filename: 'server.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'commonjs2'
  }
}

// webpack.client.js - 客户端配置
module.exports = {
  target: 'web',
  entry: './src/client/entry.js',
  output: {
    filename: 'client.js',
    path: path.resolve(__dirname, 'dist')
  }
}
```

---

## 10. 常见问题

### 10.1 Module not found

**错误信息：**
```
Module not found: Error: Can't resolve 'module-name'
```

**排查步骤：**
1. 检查文件路径是否正确
2. 检查依赖是否安装（`npm install`）
3. 检查 resolve.extensions 配置
4. 检查 resolve.alias 配置

**解决方案：**
```javascript
module.exports = {
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
}
```

### 10.2 打包体积过大

**排查工具：**
```javascript
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin()
  ]
}
```

**优化措施：**
1. 代码分割（splitChunks）
2. Tree Shaking
3. 懒加载
4. 替换大型依赖
5. 压缩资源

### 10.3 构建速度慢

**优化方案：**
1. 开启持久化缓存
2. 使用 thread-loader
3. 缩小 loader 处理范围（include/exclude）
4. 优化 resolve 配置
5. 使用更快的转译器（esbuild/swc）

### 10.4 缓存失效频繁

**问题原因：**
- 使用 [hash] 而非 [contenthash]
- 没有配置长期缓存

**解决方案：**
```javascript
module.exports = {
  output: {
    filename: '[name].[contenthash].js',
    chunkFilename: '[name].[contenthash].chunk.js'
  }
}
```

---

## 11. 学习资源

### 11.1 官方文档

- [webpack 官方文档](https://webpack.js.org/)
- [webpack 中文文档](https://webpack.docschina.org/)
- [webpack GitHub](https://github.com/webpack/webpack)

### 11.2 社区资源

- [webpack 官方示例仓库](https://github.com/webpack/webpack-examples)
- [awesome-webpack](https://github.com/webpack-contrib/awesome-webpack)

### 11.3 版本迁移

**webpack 4 → 5 主要变更：**
1. Node.js 最低版本要求 10.13+
2. 不再自动注入 Node.js polyfills
3. 新的模块联合（Module Federation）
4. 更好的 Tree Shaking
5. 持久化缓存

---

*文档版本：1.0.0 | 创建日期：2026-03-26*
