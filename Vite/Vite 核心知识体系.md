# Vite 核心知识体系

> **一句话描述：** Vite 是一种新型前端构建工具，利用原生 ESM 提供极速的开发体验
>
> **特色：** 概念定义 + 工作原理 + Vite vs Webpack 对比 + 代码示例 + 常见误区 + 最佳实践

---

## 目录

1. [概述](#1-概述)
2. [核心概念](#2-核心概念)
3. [快速入门](#3-快速入门)
4. [基础用法](#4-基础用法)
5. [高级特性](#5-高级特性)
6. [工作原理](#6-工作原理)
7. [性能优化](#7-性能优化)
8. [生态与插件](#8-生态与插件)
9. [实战案例](#9-实战案例)
10. [常见问题](#10-常见问题)
11. [学习资源](#11-学习资源)

---

## 1. 概述

### 1.1 Vite 是什么

**定义：** Vite（法语意为"快速的"，发音 /vit/）是一种新型前端构建工具，能够显著提升前端开发体验。

**核心组成：**
1. **开发服务器**：基于原生 ESM（ES Modules），提供极速的冷启动和热更新
2. **生产构建**：使用 Rollup 进行打包，生成高度优化的静态资源

**为什么需要 Vite：**

随着项目规模增长，传统构建工具（如 Webpack）的痛点日益明显：

| 问题 | Webpack 表现 | Vite 解决方案 |
|------|-------------|--------------|
| **冷启动慢** | 需要构建完整依赖图，分钟级启动 | 无需打包，秒级启动 |
| **HMR 慢** | 项目越大更新越慢 | 精准模块更新，与项目规模无关 |
| **配置复杂** | webpack.config.js 复杂难懂 | 开箱即用，配置简单 |

**Vite 的设计哲学：**

```
Webpack 模式：源代码 → 完整打包 → Bundle → 开发服务器 → 浏览器
                   (启动慢，项目越大越慢)

Vite 模式：
  开发环境：源代码 → ESM 按需加载 → 浏览器 (即时启动)
  生产环境：源代码 → Rollup 打包 → 优化的 Bundle
```

### 1.2 Vite 发展历史

| 版本 | 发布时间 | 主要特性 |
|------|----------|----------|
| Vite 1 | 2020-04 | 初始版本，基于 Vue 单文件组件 |
| Vite 2 | 2021-02 | 框架无关，支持 React/Preact/Svelte，Rollup 构建 |
| Vite 3 | 2022-07 | 性能提升，更好的 SSR 支持 |
| Vite 4 | 2023-01 | 基于 Rollup 3，更小的包体积 |
| Vite 5 | 2024-01 | Node.js 18+，更好的 TypeScript 支持 |

### 1.3 Vite vs Webpack

**核心架构差异：**

| 特性 | Webpack | Vite |
|------|---------|------|
| **构建模式** | 打包优先（Bundling） | 按需编译（On-demand） |
| **开发启动** | 需要预先打包，分钟级 | 无需打包，秒级 |
| **HMR** | 重新构建变更模块 | 精准模块替换 |
| **生产构建** | Webpack | Rollup |
| **TypeScript** | 需要配置 ts-loader | 开箱即用 |

**启动速度对比（中型项目）：**

```
Webpack 5:  冷启动 8.2 秒    二次启动 15 秒
Vite:       冷启动 0.8 秒    二次启动 1.2 秒

Vite 冷启动快约 10 倍
```

---

## 2. 核心概念

### 2.1 原生 ESM（ES Modules）

**定义：** Vite 利用浏览器原生支持的 ES Modules，在开发环境下直接提供源码，无需打包。

**为什么需要：**

传统打包工具需要预先构建完整依赖图，而 Vite 通过浏览器原生 ESM 支持，实现了按需加载：

```javascript
// main.js - 浏览器直接解析
import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')
```

**工作流程：**

```
1. 浏览器请求 index.html
2. 解析 <script type="module" src="/src/main.js">
3. 浏览器请求 main.js
4. main.js 中有 import，浏览器继续请求依赖
5. Vite 服务器拦截请求，按需编译并返回
```

### 2.2 热模块替换（HMR）

**定义：** HMR（Hot Module Replacement）允许在不完全刷新页面的情况下替换、添加或删除模块。

**为什么需要：**

HMR 是提升开发体验的关键特性。Vite 的 HMR 基于 WebSocket 实现，更新速度与项目规模无关。

**工作原理：**

```
1. Vite 启动时创建模块依赖图（ModuleGraph）
2. 监听文件系统变化（chokidar）
3. 文件修改时，计算受影响的模块
4. 通过 WebSocket 推送更新到客户端
5. 客户端执行 @vite/client 脚本，应用更新
```

**HMR 实现源码简析：**

```javascript
// Vite 内部 HMR 核心逻辑
// 1. 创建 WebSocket 服务器
function createWebSocketServer(server, config) {
  const wss = new WebSocket.Server({ server })

  wss.on('connection', (socket) => {
    socket.send(JSON.stringify({ type: 'connected' }))
  })

  return {
    send(payload) {
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(payload))
        }
      })
    }
  }
}

// 2. 监听文件变化
chokidar.watch(projectRoot).on('change', (file) => {
  // 计算需要更新的模块
  const updates = calculateHMRUpdates(file)
  // 通过 WebSocket 推送
  hmr.send({ type: 'update', updates })
})
```

### 2.3 依赖预构建（Dependency Pre-Bundling）

**定义：** Vite 使用 esbuild 将 node_modules 中的 CommonJS/UMD 依赖转换为 ESM 格式。

**为什么需要：**

1. **格式转换**：许多依赖使用 CommonJS 格式，浏览器无法直接解析
2. **性能优化**：将零散的依赖打包成单个文件，减少 HTTP 请求
3. **缓存策略**：预构建结果缓存在 `node_modules/.vite` 目录

**配置示例：**

```javascript
// vite.config.js
export default defineConfig({
  optimizeDeps: {
    // 强制预构建某些依赖
    include: ['lodash-es', 'axios'],
    // 排除某些依赖
    exclude: ['vue-demi']
  }
})
```

### 2.4 生产构建

**定义：** Vite 在生产环境下使用 Rollup 进行打包，生成优化的静态资源。

**核心特性：**
- **代码分割**：自动将依赖与业务代码分离
- **Tree Shaking**：移除未使用的代码
- **资源优化**：CSS 压缩、图片优化、哈希命名

**配置示例：**

```javascript
// vite.config.js
export default defineConfig({
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // 代码分割
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router'],
          utils: ['lodash-es', 'dayjs']
        }
      }
    },
    // 代码压缩
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
})
```

---

## 3. 快速入门

### 3.1 环境要求

- Node.js 版本 >= 18.0.0
- 包管理器：npm、yarn、pnpm 任选

### 3.2 创建项目

**使用脚手架工具：**

```bash
# npm
npm create vite@latest my-app

# yarn
yarn create vite my-app

# pnpm
pnpm create vite my-app
```

**指定框架模板：**

```bash
# Vue 项目
npm create vite@latest my-vue-app -- --template vue

# React 项目
npm create vite@latest my-react-app -- --template react

# TypeScript 支持
npm create vite@latest my-ts-app -- --template vue-ts
```

### 3.3 安装依赖

```bash
cd my-app
npm install
npm run dev
```

### 3.4 项目结构

```
my-app/
├── index.html          # HTML 入口文件（位于根目录）
├── package.json        # 项目配置
├── vite.config.js      # Vite 配置
├── src/
│   ├── main.js         # JS 入口
│   ├── App.vue         # 根组件
│   ├── components/     # 组件目录
│   └── assets/         # 静态资源
└── public/             # 静态资源（直接复制到输出目录）
```

**为什么 index.html 在根目录？**

Vite 将 index.html 视为源码和模块图的一部分，而不是静态资源：

```html
<!-- index.html -->
<div id="app"></div>
<script type="module" src="/src/main.js"></script>
```

### 3.5 开发服务器配置

```javascript
// vite.config.js
export default defineConfig({
  server: {
    port: 3000,           // 开发服务器端口
    open: true,           // 自动打开浏览器
    hmr: true,            // 开启热更新
    proxy: {              // 代理配置
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
})
```

---

## 4. 基础用法

### 4.1 静态资源处理

**导入方式：**

```javascript
// 相对路径导入
import logo from './assets/logo.png'

// 使用方式
<img src={logo} />
```

**内联小文件：**

小于 4KB 的资源默认内联为 base64 data URL：

```javascript
// vite.config.js
export default defineConfig({
  build: {
    assetsInlineLimit: 4096  // 4KB
  }
})
```

**强制导入为 URL：**

```javascript
// 使用 ?url 后缀显式导入为 URL
import logoUrl from './assets/logo.png?url'

// 使用 ?inline 后缀强制内联
import svgContent from './icon.svg?inline'
```

### 4.2 CSS 处理

**导入 CSS：**

```javascript
// 直接导入 CSS
import './style.css'

// CSS 模块（Scoped CSS）
import styles from './Button.module.css'
<button className={styles.primary}>Click</button>
```

**CSS 预处理器：**

```bash
# 安装预处理器
npm install -D sass
```

```javascript
// 导入 Sass 文件
import './style.scss'
```

**PostCSS 配置：**

```javascript
// vite.config.js
export default defineConfig({
  css: {
    postcss: './postcss.config.js'
  }
})
```

### 4.3 JSON 处理

**导入 JSON：**

```javascript
// 直接导入
import data from './data.json'

// 命名导入
import { name } from './data.json'
```

### 4.4 TypeScript 支持

**开箱即用：**

Vite 原生支持 TypeScript，无需额外配置：

```typescript
// main.ts
import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')
```

**类型提示：**

```typescript
/// <reference types="vite/client" />
```

### 4.5 环境变量

**环境变量文件：**

```bash
# .env.development
VITE_API_URL=http://localhost:3000
VITE_APP_TITLE=开发环境

# .env.production
VITE_API_URL=https://api.example.com
VITE_APP_TITLE=生产环境
```

**使用环境变量：**

```javascript
// 只有 VITE_ 前缀的变量会暴露给客户端
const apiUrl = import.meta.env.VITE_API_URL
const isDev = import.meta.env.DEV
const isProd = import.meta.env.PROD
```

---

## 5. 高级特性

### 5.1 SSR（服务端渲染）

**什么是 SSR：**

SSR（Server-Side Rendering）指在 Node.js 中运行相同的前端代码，预渲染成 HTML，然后在客户端进行水合（Hydration）。

**典型 SSR 项目结构：**

```
├── index.html
├── server.js             # 主应用服务器
├── src/
│   ├── main.js           # 通用应用代码
│   ├── entry-client.js   # 客户端入口
│   └── entry-server.js   # 服务端入口
```

**index.html 模板：**

```html
<div id="app"><!--ssr-outlet--></div>
<script type="module" src="/src/entry-client.js"></script>
```

**条件逻辑：**

```javascript
if (import.meta.env.SSR) {
  // 仅在服务端执行的逻辑
}
```

### 5.2 Web Workers

**创建 Worker：**

```typescript
// src/workers/data-processor.worker.ts
self.onmessage = (e) => {
  const result = heavyComputation(e.data)
  self.postMessage(result)
}

function heavyComputation(data: any): any {
  // 执行复杂计算
  return processedData
}
```

**在组件中使用：**

```typescript
import { onMounted, onUnmounted } from 'vue'

let worker: Worker

onMounted(() => {
  worker = new Worker(
    new URL('../workers/data-processor.worker.ts', import.meta.url),
    { type: 'module' }
  )

  worker.onmessage = (e) => {
    console.log('Worker result:', e.data)
  }
})

onUnmounted(() => {
  worker.terminate()
})
```

### 5.3 JSX 支持

**安装插件：**

```bash
# React
npm install -D @vitejs/plugin-react

# Vue
npm install -D @vitejs/plugin-vue-jsx
```

**配置：**

```javascript
// vite.config.js
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()]
})
```

### 5.4 依赖优化

**optimizeDeps 配置：**

```javascript
// vite.config.js
export default defineConfig({
  optimizeDeps: {
    // 强制预构建
    include: ['lodash-es', 'axios'],
    // 排除预构建
    exclude: ['vue-demi'],
    // esbuild 配置
    esbuildOptions: {
      target: 'es2020'
    }
  }
})
```

### 5.5 多页面应用（MPA）

**配置多入口：**

```javascript
// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        nested: path.resolve(__dirname, 'nested/index.html')
      }
    }
  }
})
```

---

## 6. 工作原理

### 6.1 ESM 服务器

**Vite 开发服务器架构：**

```
┌─────────────────────────────────────────────────────────┐
│                    Vite Dev Server                      │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐ │
│  │  静态文件服务 │  │  ESM 转换器    │  │  HMR 引擎     │ │
│  └─────────────┘  └──────────────┘  └───────────────┘ │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐ │
│  │  插件系统    │  │  依赖预构建   │  │  WebSocket   │ │
│  └─────────────┘  └──────────────┘  └───────────────┘ │
└─────────────────────────────────────────────────────────┘
```

**请求处理流程：**

```
1. 浏览器请求 /src/App.vue
2. Vite 拦截请求
3. 检查缓存 → 有缓存则直接返回
4. 调用插件转换（vue-loader）
5. 返回 ESM 格式代码
6. 浏览器解析 import，继续请求依赖
```

### 6.2 HMR 实现原理

**核心组件：**

1. **ModuleGraph（模块依赖图）**：记录模块间的依赖关系
2. **FileWatcher（文件监听）**：使用 chokidar 监听文件变化
3. **WebSocket Server**：推送更新到客户端
4. **HMR Runtime**：客户端应用更新

**HMR 更新流程：**

```
文件修改
   ↓
chokidar 检测到变化
   ↓
计算受影响的模块（HMR 边界）
   ↓
通过 WebSocket 推送更新
   ↓
客户端接收更新
   ↓
@vite/client 执行模块替换
   ↓
UI 更新（不刷新页面）
```

**源码简析：**

```javascript
// Vite 内部 HMR 核心逻辑
class HMRChannel {
  async sendUpdates({ updates }) {
    // 通过 WebSocket 推送
    this.transport.send({
      type: 'update',
      updates
    })
  }

  async handleUpdate(update) {
    // 客户端应用更新
    const { module, acceptedPath } = update

    if (module.hot) {
      module.hot.accept(acceptedPath, () => {
        // 执行回调
      })
    }
  }
}
```

### 6.3 依赖预构建原理

**为什么需要预构建：**

1. **CommonJS 转 ESM**：许多 npm 包使用 CommonJS，浏览器无法直接使用
2. **性能优化**：将零散的依赖打包成单个文件
3. **缓存策略**：避免重复构建

**预构建流程：**

```
1. 扫描 index.html 中的导入
2. 识别 node_modules 中的依赖
3. 使用 esbuild 进行预构建
   - CommonJS → ESM 转换
   - 打包为单个文件
4. 缓存到 node_modules/.vite
5. 后续构建检查缓存有效性
```

**esbuild 为什么快：**

```
esbuild 使用 Go 语言编写
  - 并行处理能力强
  - 内存管理优秀
  - 比基于 JavaScript 的打包器快 10-100 倍
```

### 6.4 生产构建流程

**Rollup 构建流程：**

```
1. 解析入口文件
2. 构建依赖图
3. Tree Shaking（移除未使用代码）
4. 代码分割（Code Splitting）
5. 资源优化（压缩、哈希）
6. 输出到 dist 目录
```

**构建配置详解：**

```javascript
// vite.config.js
export default defineConfig({
  build: {
    // 输出目录
    outDir: 'dist',
    // 静态资源目录
    assetsDir: 'assets',
    // 静态资源内联阈值
    assetsInlineLimit: 4096,
    // 代码分割配置
    rollupOptions: {
      output: {
        // 手动分包
        manualChunks: {
          vendor: ['vue', 'vue-router'],
          utils: ['lodash-es', 'dayjs']
        },
        // 文件命名
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]'
      }
    },
    // 压缩配置
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    // Source Map
    sourcemap: false
  }
})
```

---

## 7. 性能优化

### 7.1 开发环境优化

**配置 HMR 优化：**

```javascript
// vite.config.js
export default defineConfig({
  server: {
    hmr: {
      enabled: true,
      overlay: false  // 关闭错误浮层
    },
    watch: {
      usePolling: true,  // Windows 系统推荐
      interval: 100
    }
  }
})
```

**依赖预构建优化：**

```javascript
// vite.config.js
export default defineConfig({
  optimizeDeps: {
    // 强制预构建大型依赖
    include: ['echarts', 'lodash-es'],
    // 排除不需要预构建的
    exclude: ['vue-demi']
  }
})
```

### 7.2 生产构建优化

**代码分割：**

```javascript
// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // 第三方库分离
          vendor: ['vue', 'vue-router', 'axios'],
          // UI 库分离
          ui: ['element-plus', 'antd'],
          // 工具库分离
          utils: ['lodash-es', 'dayjs']
        }
      }
    }
  }
})
```

**体积优化：**

```javascript
// vite.config.js
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true
    })
  ],
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
})
```

**替换大型依赖：**

```javascript
// ❌ 不好：moment 体积大（~70KB）
import moment from 'moment'

// ✅ 更好：date-fns 按需导入（~2KB）
import { format } from 'date-fns'

// ✅ 更好：dayjs（~7KB）
import dayjs from 'dayjs'
```

### 7.3 CDN 优化

**使用外部依赖：**

```javascript
// vite.config.js
import { viteExternalsPlugin } from 'vite-plugin-externals'

export default defineConfig({
  plugins: [
    viteExternalsPlugin({
      'vue': 'Vue',
      'vue-router': 'VueRouter',
      'react': 'React',
      'react-dom': 'ReactDOM'
    })
  ]
})
```

**HTML 中引入 CDN：**

```html
<script src="https://cdn.jsdelivr.net/npm/vue@3/dist/vue.global.prod.js"></script>
<script src="https://cdn.jsdelivr.net/npm/vue-router@4/dist/vue-router.global.prod.js"></script>
```

### 7.4 缓存策略

**文件名哈希：**

```javascript
// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name].[contenthash:8].js',
        chunkFileNames: 'assets/[name].[contenthash:8].js',
        assetFileNames: 'assets/[name].[contenthash:8].[ext]'
      }
    }
  }
})
```

**浏览器缓存：**

```
// HTTP 响应头配置
Cache-Control: public, max-age=31536000, immutable

// 对于 index.html
Cache-Control: no-cache
```

---

## 8. 生态与插件

### 8.1 官方插件

| 插件 | 用途 | 安装 |
|------|------|------|
| @vitejs/plugin-vue | Vue 3 支持 | `npm install -D @vitejs/plugin-vue` |
| @vitejs/plugin-react | React 支持 | `npm install -D @vitejs/plugin-react` |
| @vitejs/plugin-legacy | 传统浏览器支持 | `npm install -D @vitejs/plugin-legacy` |

### 8.2 社区插件

| 插件 | 用途 |
|------|------|
| vite-plugin-pwa | PWA 支持 |
| vite-plugin-compression | Gzip/Brotli 压缩 |
| vite-plugin-html | HTML 模板处理 |
| vite-plugin-svg-icons | SVG 雪碧图 |

### 8.3 自定义插件

**Rollup 插件兼容：**

```javascript
// vite.config.js
export default defineConfig({
  plugins: [
    {
      name: 'my-plugin',
      transform(code, id) {
        if (id.endsWith('.vue')) {
          // 转换 Vue 文件
          return {
            code: transformedCode,
            map: null
          }
        }
      },
      // Vite 特有钩子
      configureServer(server) {
        // 配置开发服务器
      },
      // Vite 特有钩子
      transformIndexHtml(html) {
        // 转换 HTML
        return html.replace('<title>', '<title>My App - ')
      }
    }
  ]
})
```

---

## 9. 实战案例

### 9.1 Vue 3 项目配置

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components')
    }
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router'],
          ui: ['element-plus']
        }
      }
    }
  }
})
```

### 9.2 React 项目配置

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  server: {
    port: 3000,
    hmr: true
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['antd']
        }
      }
    }
  }
})
```

### 9.3 SSR 项目配置

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  ssr: {
    // 外部化 SSR 构建中的依赖
    noExternal: ['vue', '@vue/*']
  },
  build: {
    // SSR 构建配置
    ssr: 'src/entry-server.js'
  }
})
```

### 9.4 库打包配置

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: 'src/index.js',
      name: 'MyLib',
      fileName: (format) => `my-lib.${format}.js`
    },
    rollupOptions: {
      // 外部化不需要打包的依赖
      external: ['vue'],
      output: {
        // 提供全局变量
        globals: {
          vue: 'Vue'
        }
      }
    }
  }
})
```

---

## 10. 常见问题

### 10.1 路径别名问题

**问题：** 配置了路径别名但导入失败

**解决方案：**

```javascript
// vite.config.js
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
})

// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

### 10.2 HMR 失效

**问题：** 代码修改后热更新不生效

**解决方案：**

```javascript
// vite.config.js
export default defineConfig({
  server: {
    hmr: {
      enabled: true,
      overlay: false
    },
    watch: {
      usePolling: true,  // Windows 系统
      interval: 100
    }
  }
})

// 入口文件添加 HMR 接受
if (import.meta.hot) {
  import.meta.hot.accept()
}
```

### 10.3 依赖预构建失败

**问题：** Failed to resolve import "xxx"

**解决方案：**

```javascript
// vite.config.js
export default defineConfig({
  optimizeDeps: {
    // 强制预构建
    include: ['xxx', 'yyy'],
    // 排除预构建
    exclude: ['zzz']
  }
})
```

**清除缓存重启：**

```bash
rm -rf node_modules/.vite
npm run dev -- --force
```

### 10.4 CommonJS 模块问题

**问题：** require is not defined

**解决方案：**

```javascript
// vite.config.js
import commonjs from '@rollup/plugin-commonjs'

export default defineConfig({
  plugins: [commonjs()],
  optimizeDeps: {
    include: ['commonjs-module']
  }
})
```

### 10.5 生产构建空白页

**问题：** 开发正常，生产环境空白

**排查步骤：**

1. 检查 base 配置是否正确
2. 检查控制台是否有资源加载失败
3. 检查路由模式（history 模式需服务器配置）

**解决方案：**

```javascript
// vite.config.js
export default defineConfig({
  base: './',  // 相对路径
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name].[hash].js'
      }
    }
  }
})
```

---

## 11. 学习资源

### 11.1 官方文档

- [Vite 官方文档中文网](https://cn.vitejs.dev/)
- [Vite 官方文档英文版](https://vitejs.dev/)
- [Vite GitHub 仓库](https://github.com/vitejs/vite)

### 11.2 社区资源

- [Awesome Vite](https://github.com/vitejs/awesome-vite) - 社区维护的资源列表
- [Vite 插件目录](https://vitejs.dev/plugins/) - 官方插件目录
- [Vite  Playground](https://vite.new/) - 在线试用

### 11.3 迁移指南

**Webpack 迁移 Vite：**

1. 安装 Vite：`npm install -D vite`
2. 创建 vite.config.js
3. 替换 package.json 脚本
4. 将 index.html 移至根目录
5. 更新静态资源路径
6. 替换 Webpack 特有配置

**package.json 脚本：**

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

---

*文档版本：1.0.0 | 创建日期：2026-03-26*
