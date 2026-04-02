# Node.js 核心知识体系

## 第 1 章 Node.js 基础认知

### 1.1 Node.js 是什么：JavaScript 运行时与环境

#### 概念定义

**Node.js** 是一个免费、开源、跨平台的 JavaScript 运行时环境，它让开发人员能够创建服务器、Web 应用、命令行工具和脚本。Node.js 的核心定位是**让 JavaScript 能够运行在浏览器之外**，将 JavaScript 从前端脚本语言扩展为全栈开发语言。

**关键理解**：Node.js 不是编程语言（JavaScript 才是），也不是框架，而是一个**运行时环境（Runtime Environment）**。它提供了 JavaScript 运行所需的全部能力，包括：
- V8 引擎：执行 JavaScript 代码
- libuv 库：提供异步 I/O 能力
- 核心模块：fs、http、path 等内置功能
- npm：包管理器生态

#### 工作原理

Node.js 的运行机制可以概括为：**单线程事件循环 + 非阻塞 I/O + 底层多线程支撑**。

```
┌─────────────────────────────────────────────────────────────┐
│                    JavaScript 代码                           │
│                    (单线程执行)                              │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    V8 引擎                                   │
│              (解析、编译、执行 JavaScript)                    │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   libuv 库                                   │
│         ┌──────────────┐    ┌─────────────────────┐         │
│         │  事件循环     │    │    线程池          │         │
│         │  (Event Loop) │    │  (Thread Pool)     │         │
│         │              │    │  ┌──┬──┬──┬──┐     │         │
│         │  Timers      │    │  │T1│T2│T3│T4│ ... │         │
│         │  Poll        │    │  └──┴──┴──┴──┘     │         │
│         │  Check       │    │                     │         │
│         │  ...         │    │  处理：文件 I/O     │         │
│         └──────────────┘    │        DNS 查询      │         │
│                             │        加密解密      │         │
│                             └─────────────────────┘         │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    操作系统 API                               │
│              (文件系统、网络、进程等)                          │
└─────────────────────────────────────────────────────────────┘
```

#### 代码示例

最基础的 Node.js HTTP 服务器示例：

```javascript
// server.mjs - 使用 ES Module 语法
import { createServer } from 'node:http';

const server = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World!\n');
});

// 在本地 3000 端口启动服务
server.listen(3000, '127.0.0.1', () => {
  console.log('Server running at http://127.0.0.1:3000/');
});
```

运行方式：
```bash
node server.mjs
```

#### 常见误区

| 误区 | 正确理解 |
|------|----------|
| "Node.js 是编程语言" | Node.js 是运行时，JavaScript 才是语言 |
| "Node.js 完全是单线程" | JavaScript 执行是单线程，但底层 libuv 使用线程池处理 I/O |
| "Node.js 适合所有场景" | CPU 密集型任务不适合 Node.js，适合 I/O 密集型场景 |
| "异步一定比同步快" | 异步的优势是并发处理能力，单次操作未必更快 |

#### 最佳实践

1. **使用 ES Module 语法**：Node.js 已全面支持 ESM，优先使用 `import/export`
2. **使用 `node:` 前缀**：引用内置模块时添加 `node:` 前缀，明确区分内置模块与第三方模块
3. **避免阻塞操作**：不要在主线程执行同步 I/O 或 CPU 密集型计算

---

### 1.2 Node.js 的发展历史与定位演变

#### 发展历史时间线

```
2009 年 ──→ Ryan Dahl 在柏林 JavaScript 大会上首次展示 Node.js
   │
   ├─ 灵感来源：浏览器开发者工具中"查看源代码"按钮的启发
   ├─ 核心洞察：事件循环 + 非阻塞 I/O 模型
   └─ 初始目标：解决 Apache 等传统服务器的 C10K 问题
   │
2010 年 ──→ npm 0.1.0 发布，生态开始萌芽
   │
2012 年 ──→ Node.js 0.8.0 发布，npm 注册量突破 50 万
   │
2015 年 ──→ Node.js 4.0 发布，合并 io.js 分支，ES6 支持
   │
2017 年 ──→ Node.js 8.0 发布，async/await 正式支持
   │
2019 年 ──→ Node.js 12.0 发布，性能大幅提升
   │
2023 年 ──→ Node.js 20.x LTS 发布，权限模型实验性功能
   │
2026 年 ──→ 原生 TypeScript 支持、HTTP/3 默认启用、AI 能力内置
```

#### 定位演变

**第一代（2009-2015）：实验性运行时**
- 定位：JavaScript 运行在服务器上的尝试
- 特点：单线程事件驱动、非阻塞 I/O
- 场景：实时应用、聊天服务器

**第二代（2015-2020）：全栈开发平台**
- 定位：前后端统一的开发语言
- 特点：npm 生态爆发、Express/Koa 等框架成熟
- 场景：Web 后端、构建工具、桌面应用（Electron）

**第三代（2020-2024）：企业级运行时**
- 定位：生产环境首选运行时之一
- 特点：LTS 长期支持、安全性增强、性能优化
- 场景：微服务、API 网关、Serverless

**第四代（2025-）：智能开发平台**
- 定位：全栈开发平台 + AI 集成
- 特点：原生 TypeScript、HTTP/3、权限模型、内置 AI 能力
- 场景：AI 应用、高性能网络、安全敏感场景

#### 来源
- [Node.js 官方文档 - 关于页面](https://nodejs.org/zh-cn/)
- [Node.js 发展历程 - CSDN](https://blog.csdn.net/m0_73467482/article/details/157034968)

---

### 1.3 2026 年新一代 Node.js 核心特性

#### 1.3.1 原生 TypeScript 支持（类型剥离）

**概念定义**

Node.js 2026 版本引入了**类型剥离（Type Stripping）**功能，通过 `--experimental-strip-types` 标志可以直接运行 TypeScript 文件，无需任何编译配置。

**工作原理**

类型剥离的工作流程：
1. 解析 TypeScript 文件
2. 移除类型注解、接口和仅用于类型的构造
3. 执行生成的 JavaScript

```
TypeScript 源代码
      │
      ▼
┌─────────────────┐
│   解析器        │  移除：
│   (Parser)      │  - 类型注解 (x: number)
│                 │  - 接口 (interface)
│                 │  - 泛型 (<T>)
│                 │  - 类型导入 (import type)
└─────────────────┘
      │
      ▼
JavaScript 代码（无类型检查，直接执行）
```

**性能优势**：类型剥离比完整 TypeScript 编译快 10-20 倍，因为没有类型检查、没有转换，只是单纯移除类型语法。

**代码示例**

```typescript
// index.ts - 直接运行，无需编译
interface User {
  name: string;
  age: number;
}

const getUser = (): User => {
  return {
    name: 'Node.js 2026',
    age: 17 // 2009 年诞生，2026 年迎来 17 周年
  };
};

console.log(getUser());
```

运行命令：
```bash
# 开发模式（带热重载）
node --experimental-strip-types --watch server.ts

# 生产模式（先类型检查，再运行）
tsc --noEmit  # 仅类型检查
node --experimental-strip-types server.ts
```

**常见误区**
- ❌ "类型剥离会进行类型检查" — 不会，类型剥离只移除类型，不检查类型
- ❌ "不再需要 TypeScript 编译器" — 开发时可以用类型剥离，但生产环境仍建议 `tsc --noEmit` 做类型验证

**最佳实践**
1. 开发时使用类型剥离快速迭代
2. 生产构建前单独运行类型检查
3. 避免使用需要完整 TypeScript 编译的特性（如枚举）

**来源**
- [2026 年 Node.js 新特性 - GitHub](https://github.com/mqyqingfeng/Blog/issues/408)
- [2026 新一代 Node.js 新特性 - CSDN](https://blog.csdn.net/qq_52342911/article/details/158345756)

---

#### 1.3.2 HTTP/3 默认启用

**概念定义**

HTTP/3 是第三代 HTTP 协议，基于 QUIC 传输协议，使用 UDP 而非 TCP 作为传输层协议。Node.js 2026 版本中 HTTP/3 支持已稳定并**默认启用**。

**工作原理**

HTTP/3 vs HTTP/2 vs HTTP/1.1：

```
HTTP/1.1: 多个 TCP 连接，队头阻塞严重
┌────────┐ ┌────────┐ ┌────────┐
│  Request 1 │  Request 2 │  Request 3 │
└────────┘ └────────┘ └────────┘
     │           │           │
     ▼           ▼           ▼
  TCP 连接 1   TCP 连接 2   TCP 连接 3

HTTP/2: 单个 TCP 连接，多路复用，但 TCP 队头阻塞仍存在
┌────────────────────────────────┐
│       单个 TCP 连接             │
│  ┌───┬─────┬───┬───────┬───┐  │
│  │R1 │ R2  │R3 │  R4   │R5 │  │
│  └───┴─────┴───┴───────┴───┘  │
└────────────────────────────────┘

HTTP/3: QUIC over UDP，彻底解决队头阻塞
┌────────────────────────────────┐
│         QUIC 连接               │
│  (基于 UDP，独立流，无阻塞)      │
│  ┌───┐ ┌─────┐ ┌───┐ ┌───┐    │
│  │R1 │ │ R2  │ │R3 │ │R4 │    │
│  └───┘ └─────┘ └───┘ └───┘    │
└────────────────────────────────┘
```

**代码示例**

```javascript
import { request } from 'node:http';

const req = request('https://api.example.com/data', (res) => {
  console.log('Protocol:', res.httpVersion); // 3.0
  res.on('data', (chunk) => console.log(chunk.toString()));
});
req.end();
```

**性能优势**
- 更低的连接建立延迟（0-RTT 握手）
- 彻底解决队头阻塞问题
- 更好的网络切换体验（移动端）

**来源**
- [2026 年 Node.js 新特性 - GitHub](https://github.com/mqyqingfeng/Blog/issues/408)

---

#### 1.3.3 权限模型（Permission Model）

**概念定义**

Node.js 20.x 正式推出的权限模型，通过 `--experimental-permission` 标志可以在程序运行时限制对特定资源的访问，实现**最小权限原则**。

**工作原理**

权限模型通过白名单机制控制资源访问：

```
启动时指定允许的权限
        │
        ▼
┌─────────────────────────────────┐
│     权限检查层                    │
│  ┌─────────────────────────┐   │
│  │ 文件系统访问检查          │   │
│  │ 网络访问检查              │   │
│  │ 子进程访问检查            │   │
│  │ Worker 线程检查          │   │
│  └─────────────────────────┘   │
└─────────────────────────────────┘
        │
   允许？─┼─拒绝
        │
        ▼
   操作系统 API
```

**代码示例**

```bash
# 限制所有权限，仅允许读取 /tmp 目录
node --experimental-permission --allow-fs-read=/tmp/ index.js

# 允许所有读取和写入权限
node --experimental-permission \
  --allow-fs-read=* \
  --allow-fs-write=* \
  index.js

# 允许网络访问特定域名
node --experimental-permission --allow-net=example.com,api.github.com index.js
```

**常见误区**
- ❌ "权限模型是生产环境的安全银弹" — 权限模型是防御层之一，不能替代代码审计
- ❌ "Unix 域套接字也受权限控制" — 早期版本中 UDS 是权限模型的盲区（2026 年已修复）

**最佳实践**
1. 生产环境始终启用权限模型
2. 遵循最小权限原则，只授予必要的权限
3. 使用路径白名单而非通配符 `*`

**来源**
- [Node.js 20 特性 - 腾讯云](https://cloud.tencent.com/developer/article/2343576)
- [Node.js 安全补丁 - 网易](https://www.163.com/dy/article/KOUP7M8Q05561FZJ.html)

---

### 1.4 Node.js 的应用场景与适用边界

#### 适用场景

| 场景 | 适合原因 | 典型应用 |
|------|----------|----------|
| **I/O 密集型服务** | 非阻塞 I/O 模型，高并发处理能力强 | API 网关、代理服务器 |
| **实时应用** | 事件驱动 + WebSocket 支持 | 聊天室、协作工具、实时推送 |
| **前端工程化** | JavaScript 统一技术栈 | 构建工具（Webpack、Vite）、脚手架 |
| **Serverless** | 冷启动快，资源占用低 | 云函数、边缘计算 |
| **桌面应用** | Electron 生态成熟 | VS Code、Slack、Discord |
| **AI 应用集成** | 2026 年内置 AI 能力 | AI 智能体、RAG 系统 |

#### 不适用场景

| 场景 | 不适合原因 | 替代方案 |
|------|------------|----------|
| **CPU 密集型计算** | 单线程模型，阻塞事件循环 | Go、Rust、Python（多进程） |
| **高并发计算** | V8 内存限制，GC 停顿 | Java、C++ |
| **强类型安全要求** | JavaScript 类型系统限制 | TypeScript + 编译检查、Go、Rust |

#### 2026 年运行时对比

| 特性 | Node.js | Bun | Deno 2.0 |
|------|---------|-----|----------|
| **兼容性** | 行业标准，npm 生态完整 | 高度兼容 Node.js | 兼容层支持 npm |
| **工具链** | 需配合 ESLint、Prettier 等 | 内置打包、测试、运行 | 内置工具链 |
| **性能** | 长期运行稳定性优 | 冷启动、安装速度极快 | 安全性优先 |
| **安全性** | 权限模型（实验中） | 基础权限控制 | 默认沙箱，强制权限 |
| **TypeScript** | 原生支持（类型剥离） | 原生支持 | 原生支持 |

**来源**
- [Node.js、Bun 与 Deno 选择指南 - SegmentFault](https://segmentfault.com/a/1190000047629590)

---

## 第 2 章 底层架构与运行机制

### 2.1 Node.js 整体架构：V8 + libuv + Core Modules

#### 架构概览

Node.js 的整体架构可以分为四层：

```
┌─────────────────────────────────────────────────────────────┐
│                    应用层 (Application)                      │
│              用户编写的 JavaScript/TypeScript 代码            │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                 核心模块层 (Core Modules)                    │
│   ┌─────┐ ┌─────┐ ┌──────┐ ┌─────┐ ┌──────┐ ┌─────────┐   │
│   │ fs  │ │ http│ │ path │ │ os  │ │ crypto│ │ worker  │   │
│   └─────┘ └─────┘ └──────┘ └─────┘ └──────┘ └─────────┘   │
│              用 JavaScript 和 C++ 编写的内置模块              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    绑定层 (Bindings)                         │
│              JavaScript 与 C++ 之间的桥梁                     │
│         ┌──────────────────┐  ┌──────────────────┐         │
│         │   Node Bindings  │  │  Native Addons  │         │
│         └──────────────────┘  └──────────────────┘         │
└─────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              │                               │
              ▼                               ▼
┌─────────────────────────┐     ┌─────────────────────────┐
│      V8 引擎             │     │       libuv 库          │
│  ┌───────────────────┐  │     │  ┌───────────────────┐  │
│  │  Ignition        │  │     │  │   Event Loop      │  │
│  │  (字节码解释器)   │  │     │  │   (事件循环)      │  │
│  ├───────────────────┤  │     │  ├───────────────────┤  │
│  │  TurboFan        │  │     │  │   Thread Pool     │  │
│  │  (优化编译器)     │  │     │  │   (线程池)        │  │
│  ├───────────────────┤  │     │  ├───────────────────┤  │
│  │  Sparkplug       │  │     │  │   Async I/O       │  │
│  │  (基线编译器)     │  │     │  │   (异步 I/O)      │  │
│  └───────────────────┘  │     │  └───────────────────┘  │
│      JavaScript 执行    │     │      系统 I/O 操作        │
└─────────────────────────┘     └─────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    操作系统层 (OS)                           │
│         文件系统 │ 网络 │ 进程 │ 信号 │ 定时器              │
└─────────────────────────────────────────────────────────────┘
```

#### 核心组件职责

| 组件 | 职责 | 实现语言 |
|------|------|----------|
| **V8** | 执行 JavaScript 代码，JIT 编译优化 | C++ |
| **libuv** | 提供事件循环和异步 I/O 能力 | C |
| **Core Modules** | 封装底层能力，提供 JavaScript API | JavaScript + C++ |
| **Bindings** | JavaScript 与 C++ 之间的调用桥接 | C++ |

#### 源码解析

Node.js 启动流程的核心代码（简化版）：

```cpp
// src/node_main.cc
int main(int argc, char* argv[]) {
  // 1. 初始化 V8 引擎
  v8::V8::InitializeICUDefaultLocation(argv[0]);
  v8::V8::InitializeExternalStartupData(argv[0]);
  v8::Platform* platform = node::CreateDefaultPlatform();
  v8::V8::InitializePlatform(platform);
  v8::V8::Initialize();

  // 2. 创建 V8 Isolate（隔离区）
  v8::Isolate* isolate = v8::Isolate::CreateNew();
  
  // 3. 初始化 Node.js 环境
  node::Environment* env = node::CreateEnvironment(isolate);
  
  // 4. 加载并执行 JavaScript 入口文件
  node::LoadEnvironment(env, "require('module').loadMainModule()");
  
  // 5. 启动事件循环
  int exit_code = node::SpinEventLoop(env);
  
  // 6. 清理资源
  node::FreeEnvironment(env);
  v8::V8::Dispose();
  v8::V8::ShutdownPlatform();
  
  return exit_code;
}
```

**来源**
- [Node.js 官方架构文档](https://nodejs.org/zh-cn/)
- [libuv 源码分析 - CSDN](https://blog.csdn.net/AnitaSun/article/details/124082843)

---

### 2.2 V8 引擎工作原理：JIT 编译、优化编译器 TurboFan

#### 概念定义

**V8 引擎** 是由 Google 开发的开源 JavaScript 引擎，用 C++ 编写。它的核心职责是**将 JavaScript 代码转换为 CPU 能够直接执行的机器码**。

**关键特性**：
- JIT（Just-In-Time）即时编译
- 垃圾回收（GC）
- 隐藏类（Hidden Classes）
- 内联缓存（Inline Caching）

#### V8 执行流程

```
JavaScript 源代码
      │
      ▼
┌─────────────────┐
│   解析器        │  将源代码解析为抽象语法树 (AST)
│   (Parser)      │
└─────────────────┘
      │ AST
      ▼
┌─────────────────┐
│   Ignition      │  将 AST 转换为字节码 (Bytecode)
│   (解释器)      │  逐行解释执行，收集类型反馈
└─────────────────┘
      │ 字节码 + 类型反馈
      ▼
┌─────────────────┐
│   TurboFan      │  将热点代码编译为高效机器码
│   (优化编译器)  │  基于类型反馈进行推测优化
└─────────────────┘
      │ 机器码
      ▼
┌─────────────────┐
│   CPU 执行       │
└─────────────────┘
```

#### JIT 编译三阶段

**第一阶段：解析与 AST 生成**

```javascript
// 源代码
function add(a, b) {
  return a + b;
}
```

解析后的 AST 结构：
```
Program
  └── FunctionDeclaration (add)
        ├── params: [Identifier(a), Identifier(b)]
        └── body: BlockStatement
              └── ReturnStatement
                    └── BinaryExpression(+)
                          ├── left: Identifier(a)
                          └── right: Identifier(b)
```

**第二阶段：Ignition 字节码生成与解释执行**

Ignition 生成的字节码（简化表示）：
```
Function add:
  0: LoadContext[a]        ; 加载参数 a
  2: LoadContext[b]        ; 加载参数 b
  4: Add                   ; 执行加法
  5: Return                ; 返回结果
```

Ignition 在执行过程中会收集**类型反馈（Type Feedback）**：
- 记录函数参数、返回值的实际类型
- 记录属性访问的类型信息
- 记录操作符两侧的操作数类型

**第三阶段：TurboFan 优化编译**

当某段代码被频繁执行（成为"热点代码"），TurboFan 会介入：

```
字节码 + 类型反馈
      │
      ▼
┌─────────────────┐
│ 类型反馈分析     │  分析运行时收集的类型信息
└─────────────────┘
      │
      ▼
┌─────────────────┐
│ Sea of Nodes    │  将代码表示为节点图 (而非指令序列)
│   中间表示      │
└─────────────────┘
      │
      ▼
┌─────────────────┐
│ 优化 Passes     │  多轮优化:
│                 │  - 常量传播与折叠
│                 │  - 死代码消除
│                 │  - 循环不变量外提
│                 │  - 内联优化
└─────────────────┘
      │
      ▼
┌─────────────────┐
│ 代码生成         │  生成优化的机器码
└─────────────────┘
```

#### TurboFan 的 Sea of Nodes 架构

TurboFan 采用创新的**Sea of Nodes**中间表示，将代码表示为节点图：

```
        ┌─────────┐
        │  参数 a  │
        └────┬────┘
             │
        ┌────▼────┐
        │  参数 b  │
        └────┬────┘
             │
      ┌──────┴──────┐
      │             │
┌─────▼─────┐ ┌────▼─────┐
│  类型检查  │ │ 类型检查  │
│   (int)   │ │  (int)   │
└─────┬─────┘ └────┬─────┘
      │            │
      └─────┬──────┘
            │
      ┌─────▼─────┐
      │   Add     │  ← 优化后的加法节点
      └─────┬─────┘
            │
      ┌─────▼─────┐
      │   Return  │
      └───────────┘
```

**优势**：
- 轻松识别和消除冗余计算
- 进行更有效的循环优化
- 实现复杂的代码重组

#### 去优化（Deoptimization）机制

当 TurboFan 的优化假设不再成立时，V8 会执行去优化：

```javascript
// 第一次调用：参数都是 number
add(1, 2);  // TurboFan 优化为整数加法

// 后续调用：参数类型变化
add(1, "2");  // 类型假设失败，触发去优化
              // 回退到 Ignition 解释执行
```

去优化流程：
```
优化后的机器码执行
        │
        │ 运行时类型检查失败
        ▼
┌─────────────────┐
│   去优化陷阱     │  捕获类型不匹配
└─────────────────┘
        │
        ▼
┌─────────────────┐
│  恢复解释执行    │  回到 Ignition 字节码
└─────────────────┘
        │
        ▼
┌─────────────────┐
│  丢弃优化代码    │  等待下次优化机会
└─────────────────┘
```

#### 代码示例

```javascript
// 性能优化示例：保持类型稳定

// ✅ 推荐：参数类型稳定
function calculateTotal(prices) {
  let total = 0;
  for (let i = 0; i < prices.length; i++) {
    total += prices[i]; // 始终接收 number[] 类型
  }
  return total;
}

// ❌ 不推荐：类型频繁变化导致去优化
function processValue(value) {
  return value * 2; // 如果 value 有时是 string，会触发去优化
}
```

#### 常见误区

| 误区 | 正确理解 |
|------|----------|
| "V8 直接执行 JavaScript" | V8 先将 JS 编译为机器码，不是解释执行 |
| "优化越多越好" | 过度优化可能导致频繁去优化，反而更慢 |
| "TurboFan 会做类型检查" | TurboFan 基于类型反馈做推测，不运行时检查 |

#### 最佳实践

1. **保持函数参数类型稳定**：避免同一函数接收不同类型的参数
2. **避免隐藏类频繁变化**：对象创建时定义所有属性
3. **使用数组而非类数组对象**：数组有专门的优化路径
4. **避免过大的函数**：大函数难以优化，拆分为小函数

**来源**
- [V8 引擎工作原理 - CSDN](https://blog.csdn.net/gitblog_00996/article/details/153676555)
- [TurboFan 编译器详解 - CSDN](https://blog.csdn.net/gitblog_00267/article/details/152187581)
- [V8 字节码与 JIT 编译 - 知乎](http://zhuanlan.zhihu.com/p/1999436785332278438)

---

### 2.3 libuv 库架构设计：线程池、异步 I/O 模型

#### 概念定义

**libuv** 是一个开源的异步 I/O 库，最初为 Node.js 开发，现已被多个项目采用。libuv 的核心设计目标是**提供跨平台的异步 I/O 能力**。

**关键特点**：
- 跨平台：支持 Linux、macOS、Windows
- 事件驱动：基于事件循环的异步模型
- 线程池：处理阻塞 I/O 操作
- 高性能：利用 epoll、kqueue、IOCP 等系统特性

#### libuv 整体架构

```
┌─────────────────────────────────────────────────────────────┐
│                    libuv 架构                                │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                 事件循环 (Event Loop)                │   │
│  │                                                      │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐          │   │
│  │  │ Timers   │  │   Poll   │  │  Check   │          │   │
│  │  │  阶段    │  │   阶段   │  │  阶段    │          │   │
│  │  └──────────┘  └──────────┘  └──────────┘          │   │
│  │                                                      │   │
│  └─────────────────────────────────────────────────────┘   │
│                           │                                 │
│         ┌─────────────────┼─────────────────┐              │
│         │                 │                 │              │
│         ▼                 ▼                 ▼              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │  异步 I/O    │  │   线程池    │  │   信号处理   │        │
│  │  (epoll/   │  │  (Thread    │  │   (Signal   │        │
│  │   kqueue/  │  │   Pool)     │  │   Handling) │        │
│  │   IOCP)    │  │             │  │             │        │
│  └─────────────┘  │  ┌──┬──┬──┬──┐│  └─────────────┘        │
│                   │  │T1│T2│T3│T4││                          │
│                   │  └──┴──┴──┴──┘│                          │
│                   │    默认 4 线程   │                          │
│                   └─────────────────┘                          │
└─────────────────────────────────────────────────────────────┘
```

#### 事件循环（Event Loop）执行流程

libuv 事件循环的核心函数 `uv_run` 执行以下阶段：

```c
int uv_run(uv_loop_t *loop, uv_run_mode mode) {
  while (loop->stop_flag == 0) {
    uv__update_time(loop);      // 1. 更新时间
    uv__run_timers(loop);       // 2. 执行到期的定时器
    uv__run_pending(loop);      // 3. 执行延迟的 I/O 回调
    uv__run_idle(loop);         // 4. 执行 idle 回调
    uv__run_prepare(loop);      // 5. 执行 prepare 回调
    uv__io_poll(loop, timeout); // 6. 轮询 I/O 事件（核心）
    uv__run_check(loop);        // 7. 执行 check 回调
    uv__run_closing_handles(loop); // 8. 处理关闭的句柄
  }
}
```

**各阶段说明**：

| 阶段 | 职责 | 典型应用 |
|------|------|----------|
| **Timers** | 执行到期的 setTimeout/setInterval 回调 | 定时任务 |
| **Pending** | 执行延迟的 I/O 回调 | 延迟处理的网络事件 |
| **Idle** | 空闲时执行 | 后台任务 |
| **Prepare** | 轮询前准备 | 内部使用 |
| **Poll** | 轮询 I/O 事件，阻塞等待新事件 | 网络请求、文件读取完成 |
| **Check** | 轮询后执行 | setImmediate 回调 |
| **Close** | 处理关闭的句柄 | 资源清理 |

#### 线程池（Thread Pool）架构

**为什么需要线程池**：

libuv 的事件循环是单线程的，但某些操作（如文件 I/O、DNS 查询）无法用异步方式实现，需要阻塞执行。线程池的作用就是**在后台线程中执行这些阻塞操作，避免阻塞事件循环**。

**线程池初始化**：

```c
// 线程池大小可通过环境变量控制
// 默认值：4 个线程
process.env.UV_THREADPOOL_SIZE = 8;  // 设置为 8 个线程
```

**线程池工作流程**：

```
主线程（事件循环）
      │
      │ 1. 提交任务
      ▼
┌─────────────────┐
│   任务队列      │  uv_queue_work()
│   (Work Queue)  │
└─────────────────┘
      │
      │ 2. 空闲线程获取任务
      ▼
┌─────┬─────┬─────┬─────┐
│ T1  │ T2  │ T3  │ T4  │  ← 工作线程
└─────┴─────┴─────┴─────┘
      │
      │ 3. 执行阻塞 I/O
      ▼
┌─────────────────┐
│  文件系统        │
│  DNS 查询        │
│  加密解密        │
│  用户自定义任务  │
└─────────────────┘
      │
      │ 4. 任务完成，回调加入事件循环
      ▼
主线程接收回调，继续执行
```

**工作线程入口函数**（简化版）：

```c
static void worker(void *arg) {
  uv_work_t *work = (uv_work_t *)arg;
  
  // 1. 执行用户的工作回调
  work->work_cb(work);
  
  // 2. 通知主线程任务完成
  uv_mutex_lock(&loop->wq_mutex);
  // 将完成的任务加入完成队列
  uv_cond_signal(&loop->work_cond);
  uv_mutex_unlock(&loop->wq_mutex);
}
```

#### 跨平台异步 I/O 封装

libuv 在不同操作系统上使用不同的 I/O 多路复用机制：

| 操作系统 | I/O 多路复用机制 |
|----------|-----------------|
| Linux | epoll |
| macOS/FreeBSD | kqueue |
| Windows | IOCP (完成端口) |

**epoll 封装示例**（Linux）：

```c
// libuv 内部使用 epoll 监听文件描述符
int uv__io_poll(uv_loop_t *loop, int timeout) {
  struct epoll_event events[MAX_EVENTS];
  int nfds = epoll_wait(loop->backend_fd, events, MAX_EVENTS, timeout);
  
  // 处理触发的事件
  for (int i = 0; i < nfds; i++) {
    uv__io_t *w = (uv__io_t*)events[i].data.ptr;
    w->cb(loop, w, events[i].events);
  }
}
```

#### 代码示例

```javascript
const fs = require('fs');
const { Worker, isMainThread } = require('worker_threads');

// 异步文件读取（使用 libuv 线程池）
fs.readFile('/path/to/file', 'utf8', (err, data) => {
  if (err) throw err;
  console.log(data);
});

// 自定义线程池任务
const crypto = require('crypto');

// 加密操作会在线程池中执行
crypto.pbkdf2('password', 'salt', 100000, 64, 'sha512', (err, key) => {
  if (err) throw err;
  console.log('Derived key:', key.toString('hex'));
});
```

#### 常见误区

| 误区 | 正确理解 |
|------|----------|
| "Node.js 完全是单线程" | JavaScript 执行是单线程，但 libuv 使用线程池处理 I/O |
| "线程池越大越好" | 线程池过大会增加上下文切换开销，默认 4 通常是合理的 |
| "所有 I/O 都是异步的" | 文件 I/O 实际在线程池中同步执行，只是对主线程异步 |

#### 最佳实践

1. **合理设置线程池大小**：CPU 密集型 I/O 操作多时，可适当增加 `UV_THREADPOOL_SIZE`
2. **避免阻塞事件循环**：不要在主线程执行同步 I/O 或 CPU 密集型计算
3. **使用 Worker Threads 处理 CPU 密集型任务**：对于真正的并行计算，使用 Worker Threads 而非线程池

**来源**
- [libuv 源码分析 - CSDN](https://blog.csdn.net/AnitaSun/article/details/124082843)
- [libuv 基本介绍 - 百度开发者中心](https://developer.baidu.com/article/details/3294892)
- [Node.js Libuv 线程池 - CSDN](https://blog.csdn.net/qq_36287830/article/details/153885623)

---

### 2.4 内存管理：堆/栈、垃圾回收机制（Scavenge + Mark-Sweep）

#### 内存布局

Node.js 的内存（常驻内存 Resident Set）分为**堆（Heap）**和**栈（Stack）**两部分：

```
┌─────────────────────────────────────────────────────────────┐
│                    Node.js 内存布局                          │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                      堆 (Heap)                       │   │
│  │                  (V8 引擎管理)                       │   │
│  │                                                      │   │
│  │  ┌─────────────────────────────────────────────┐    │   │
│  │  │              新生代 (New Space)              │    │   │
│  │  │          (From Space | To Space)            │    │   │
│  │  │          Scavenge 算法 (Minor GC)           │    │   │
│  │  └─────────────────────────────────────────────┘    │   │
│  │                                                      │   │
│  │  ┌─────────────────────────────────────────────┐    │   │
│  │  │              老生代 (Old Space)              │    │   │
│  │  │   ┌──────────┐ ┌──────────┐ ┌────────────┐ │    │   │
│  │  │   │ 指针空间 │ │ 数据空间 │ │  代码空间  │ │    │   │
│  │  │   │(Pointer) │ │  (Data)  │ │   (Code)   │ │    │   │
│  │  │   └──────────┘ └──────────┘ └────────────┘ │    │   │
│  │  │   ┌─────────────────────────────────────┐  │    │   │
│  │  │   │           大对象空间               │  │    │   │
│  │  │   │        (Large Object Space)        │  │    │   │
│  │  │   └────────────────────────────────────┘  │    │   │
│  │  │         Mark-Sweep & Mark-Compact         │    │   │
│  │  │              (Major GC)                   │    │   │
│  │  └─────────────────────────────────────────────┘    │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                   栈 (Stack)                         │   │
│  │              (操作系统管理)                          │   │
│  │   - 原始数据类型 (number, boolean, null, undefined) │   │
│  │   - 函数调用栈帧                                     │   │
│  │   - 函数执行上下文                                   │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

#### 堆内存详解

**新生代（New Space / Young Generation）**：
- 用途：临时存储新创建的对象
- 大小：较小（默认约 16MB）
- 算法：Scavenge 算法（复制算法）
- 特点：对象存活时间短，GC 频繁但快速

**老生代（Old Space / Old Generation）**：
- 用途：存储存活时间较长的对象
- 大小：较大（默认约 1.4GB，64 位系统）
- 算法：Mark-Sweep + Mark-Compact
- 特点：对象存活时间长，GC 较慢

**内部空间划分**：

| 空间 | 用途 |
|------|------|
| **指针空间** | 存储包含指向其他对象指针的对象 |
| **数据空间** | 存储仅含数据不含指针的对象（如字符串） |
| **代码空间** | 存放代码段，是唯一的可执行内存 |
| **大对象空间** | 存放超过其他空间限制的大对象，不会被移动 |

#### 栈内存详解

**栈（Stack）** 用于存储：
- 原始数据类型（number、boolean、null、undefined、symbol）
- 函数调用时的栈帧
- 函数执行上下文

栈的空间由操作系统管理，开发者无需过于关心。栈溢出（Stack Overflow）通常由无限递归导致。

#### 垃圾回收机制

V8 的垃圾回收采用**分代回收 + 增量标记**策略。

**1. Scavenge 算法（新生代 GC / Minor GC）**

Scavenge 使用**复制算法**，将新生代空间对半划分为两个区域：
- **From Space**：对象区域
- **To Space**：空闲区域

**工作流程**：

```
初始状态:
From Space: [对象 A][对象 B][      ][对象 C][      ]
To Space:   [                          空闲        ]

GC 触发:
1. 标记存活对象 (A 和 C 被引用，B 未被引用)
2. 将存活对象复制到 To Space
3. 清除 From Space

GC 后:
From Space: [                          空闲        ]
To Space:   [对象 A][对象 C][      ][      ][      ]

空间角色互换:
To Space 变成新的 From Space
From Space 变成新的 To Space
```

**Scavenge 算法优缺点**：
- ✅ 优点：效率高，不产生内存碎片
- ❌ 缺点：需要双倍空间，存活对象多时效率低

**2. Mark-Sweep 算法（老生代 GC / Major GC）**

**工作流程**：

```
第一阶段：标记（Mark）
┌─────────────────────────────────────────┐
│   [对象 A] ──→ [对象 B]    [对象 C]     │
│      ↑           │            │         │
│      │           ↓            ↓         │
│   [ROOT]      [对象 D]      [对象 E]    │
│                                           │
│  从 ROOT 开始遍历，标记所有可达对象        │
│  A、B、D 被标记为存活，C、E 未被标记       │
└─────────────────────────────────────────┘

第二阶段：清除（Sweep）
┌─────────────────────────────────────────┐
│   [对象 A] ──→ [对象 B]    [  空闲  ]   │
│      ↑           │                      │
│      │           ↓                      │
│   [ROOT]      [对象 D]    [  空闲  ]   │
│                                           │
│  清除未被标记的对象 (C 和 E)               │
└─────────────────────────────────────────┘

第三阶段：整理（Compact，可选）
┌─────────────────────────────────────────┐
│   [对象 A][对象 B][对象 D][  空闲  ]   │
│                                           │
│  将存活对象紧凑排列，消除内存碎片          │
└─────────────────────────────────────────┘
```

**Mark-Sweep 算法优缺点**：
- ✅ 优点：不需要双倍空间
- ❌ 缺点：会产生内存碎片，需要 Mark-Compact 整理

#### 内存查看与调优

**查看内存使用情况**：

```javascript
const usage = process.memoryUsage();
console.log({
  rss: usage.rss / 1024 / 1024 + ' MB',      // 进程占用的总内存
  heapTotal: usage.heapTotal / 1024 / 1024 + ' MB',  // 堆总大小
  heapUsed: usage.heapUsed / 1024 / 1024 + ' MB',    // 堆已使用大小
  external: usage.external / 1024 / 1024 + ' MB'     // V8 内部 C++ 对象内存
});
```

**调整内存限制**：

```bash
# 调整老生代内存限制（默认约 1.4GB）
node --max-old-space-size=2048 index.js

# 调整新生代内存限制
node --max-semi-space-size=1024 index.js

# 查看 V8 所有内存相关参数
node --v8-options | grep max
```

#### 常见误区

| 误区 | 正确理解 |
|------|----------|
| "GC 会自动处理所有内存问题" | GC 无法处理逻辑错误导致的内存泄漏（如全局变量积累） |
| "堆内存越大越好" | 堆内存过大会导致 GC 时间变长，影响性能 |
| "手动触发 GC 能提升性能" | 频繁手动 GC 会干扰 V8 的自动调优，通常不建议 |

#### 最佳实践

1. **避免全局变量积累**：全局变量不会被 GC 回收
2. **及时清理定时器**：setInterval 等定时器会保持引用
3. **注意闭包引用**：闭包会保持对外部变量的引用
4. **使用 WeakMap/WeakSet**：弱引用不会阻止 GC 回收

**来源**
- [V8 内存管理及垃圾回收机制 - 腾讯云](https://cloud.tencent.com/developer/article/1663176)
- [Node.js 内存管理 - 知乎](https://zhuanlan.zhihu.com/p/2018258123039744694)
- [V8 引擎内存管理 - CSDN](https://blog.csdn.net/qq_36287830/article/details/153665421)

---

### 2.5 进程与线程：单线程模型背后的多线程支撑

#### 概念定义

**进程（Process）**：操作系统资源分配的基本单位，拥有独立的内存空间。

**线程（Thread）**：CPU 调度的基本单位，共享进程的内存空间。

**Node.js 的"单线程"**：指的是**JavaScript 执行线程是单线程**，但底层 libuv 使用线程池提供多线程支撑。

#### Node.js 线程模型

```
┌─────────────────────────────────────────────────────────────┐
│                    Node.js 进程                             │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              JavaScript 主线程                       │   │
│  │              (事件循环 + 用户代码)                   │   │
│  │                                                      │   │
│  │  ┌─────────────────────────────────────────────┐    │   │
│  │  │              V8 引擎                         │    │   │
│  │  │   - 执行 JavaScript 代码                      │    │   │
│  │  │   - JIT 编译优化                             │    │   │
│  │  │   - 垃圾回收                                │    │   │
│  │  └─────────────────────────────────────────────┘    │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                 libuv 线程池                        │   │
│  │                                                      │   │
│  │   ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐                  │   │
│  │   │ T1  │ │ T2  │ │ T3  │ │ T4  │  默认 4 个线程    │   │
│  │   └─────┘ └─────┘ └─────┘ └─────┘                  │   │
│  │                                                      │   │
│  │   处理：文件 I/O、DNS 查询、加密解密等阻塞操作          │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Worker Threads (可选)                   │   │
│  │                                                      │   │
│  │   ┌─────────┐ ┌─────────┐ ┌─────────┐              │   │
│  │   │ Worker1 │ │ Worker2 │ │ Worker3 │  用户创建    │   │
│  │   └─────────┘ └─────────┘ └─────────┘              │   │
│  │                                                      │   │
│  │   处理：CPU 密集型计算、并行任务                      │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

#### 为什么 JavaScript 是单线程？

**历史原因**：JavaScript 设计之初就是为了操作 DOM，如果允许多线程同时操作 DOM，会产生复杂的同步问题。

**举例**：
```javascript
// 假设 JavaScript 允许多线程
// 线程 A
document.getElementById('app').innerHTML = '<p>Content A</p>';

// 线程 B（同时执行）
document.getElementById('app').innerHTML = '<p>Content B</p>';

// 线程 A
document.getElementById('app').classList.add('active');
// 此时元素内容可能是 B，但类名是 A 加的，状态不一致！
```

**解决方案**：采用单线程 + 事件循环模型，避免并发操作 DOM 的问题。

#### 单线程的优势

| 优势 | 说明 |
|------|------|
| **无锁编程** | 不需要处理线程同步、死锁问题 |
| **简化编程模型** | 代码执行顺序可预测 |
| **避免竞态条件** | 不会出现数据竞争 |

#### 单线程的劣势

| 劣势 | 影响 | 解决方案 |
|------|------|----------|
| **无法利用多核 CPU** | 多核 CPU 只有一个核心被利用 | Worker Threads |
| **CPU 密集型任务阻塞** | 长时间计算阻塞事件循环 | 异步拆分、Worker Threads |
| **错误导致整个进程崩溃** | 未捕获异常会终止整个进程 | 进程管理器（PM2） |

#### 多线程支撑：libuv 线程池

虽然 JavaScript 是单线程执行，但 libuv 线程池在后台提供多线程支撑：

```javascript
const fs = require('fs');

// 这个异步操作实际在线程池中执行
fs.readFile('large-file.txt', 'utf8', (err, data) => {
  // 文件读取完成后，回调在主线程执行
  console.log(data);
});

// 主线程不会被阻塞，可以继续处理其他请求
```

**线程池执行流程**：
```
主线程提交 readFile 任务
        │
        ▼
┌─────────────────┐
│   任务队列      │
└─────────────────┘
        │
        │ 空闲线程获取任务
        ▼
┌─────────────────┐
│  工作线程 T1    │  ← 在线程池中执行阻塞的文件读取
│  (阻塞 I/O)     │
└─────────────────┘
        │
        │ 读取完成
        ▼
主线程接收回调，继续执行
```

#### Worker Threads：真正的多线程

Node.js 12+ 提供了 Worker Threads 模块，允许创建真正的多线程：

```javascript
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

if (isMainThread) {
  // 主线程代码
  const worker = new Worker(__filename, {
    workerData: { start: 0, end: 1000000000 }
  });
  
  worker.on('message', (result) => {
    console.log('计算结果:', result);
  });
  
  worker.postMessage('start');
} else {
  // Worker 线程代码
  parentPort.on('message', () => {
    // 执行 CPU 密集型计算
    let sum = 0;
    for (let i = workerData.start; i < workerData.end; i++) {
      sum += i;
    }
    parentPort.postMessage(sum);
  });
}
```

#### 事件循环（Event Loop）深度解析

**Node.js 事件循环的 6 个阶段**：

```
   ┌───────────────────────────┐
┌─>│           timers          │  setTimeout/setInterval 回调
│  └─────────────┬─────────────┘
│                │
│  ┌─────────────▼─────────────┐
│  │     pending callbacks     │  延迟的 I/O 回调
│  └─────────────┬─────────────┘
│                │
│  ┌─────────────▼─────────────┐
│  │       idle, prepare       │  内部使用
│  └─────────────┬─────────────┘
│                │
│  ┌─────────────▼─────────────┐
│  │           poll            │  执行 I/O 回调，阻塞等待新事件
│  └─────────────┬─────────────┘
│                │
│  ┌─────────────▼─────────────┐
│  │           check           │  setImmediate 回调
│  └─────────────┬─────────────┘
│                │
│  ┌─────────────▼─────────────┐
└──│      close callbacks      │  关闭回调（如 socket.on('close')）
   └───────────────────────────┘
```

#### 宏任务与微任务

**宏任务（MacroTask）**：
- setTimeout / setInterval
- setImmediate（Node.js 特有）
- I/O 操作
- UI 渲染

**微任务（MicroTask）**：
- Promise.then / Promise.catch
- process.nextTick（Node.js 特有，优先级最高）
- queueMicrotask

**执行顺序**：
```
同步代码 → 微任务队列 → 一个宏任务 → 微任务队列 → 下一个宏任务 → ...
```

**示例**：
```javascript
console.log('1. 同步代码');

setTimeout(() => {
  console.log('2. setTimeout (宏任务)');
}, 0);

Promise.resolve().then(() => {
  console.log('3. Promise.then (微任务)');
});

process.nextTick(() => {
  console.log('4. process.nextTick (微任务，优先级最高)');
});

console.log('5. 同步代码结束');

// 输出顺序:
// 1. 同步代码
// 5. 同步代码结束
// 4. process.nextTick (微任务，优先级最高)
// 3. Promise.then (微任务)
// 2. setTimeout (宏任务)
```

#### 常见误区

| 误区 | 正确理解 |
|------|----------|
| "Node.js 完全是单线程" | JavaScript 执行是单线程，底层有多线程支撑 |
| "异步操作都在不同线程执行" | 异步 I/O 可能在线程池，也可能由操作系统异步完成 |
| "Worker Threads 可以共享内存" | Worker 有独立的 V8 实例，通过消息传递通信 |

#### 最佳实践

1. **I/O 密集型用事件循环**：网络请求、文件读写等场景使用异步 I/O
2. **CPU 密集型用 Worker Threads**：加密解密、大数据计算等场景使用 Worker
3. **避免阻塞事件循环**：不要在主线程执行同步 I/O 或长时间计算
4. **使用 process.nextTick 进行紧急回调**：优先级高于 Promise

**来源**
- [JavaScript 事件循环 - 腾讯云](https://cloud.tencent.com/developer/article/2600753)
- [事件循环、宏/微任务 - 腾讯云](https://cloud.tencent.com/developer/article/2430800)

---

## 参考来源

1. [Node.js 官方文档](https://nodejs.org/zh-cn/)
2. [Node.js 下载安装教程 - CSDN](https://blog.csdn.net/m0_73467482/article/details/157034968)
3. [Node.js、Bun 与 Deno 选择指南 - SegmentFault](https://segmentfault.com/a/1190000047629590)
4. [2026 新一代 Node.js 新特性 - CSDN](https://blog.csdn.net/qq_52342911/article/details/158345756)
5. [2026 年 Node.js 新特性 - GitHub](https://github.com/mqyqingfeng/Blog/issues/408)
6. [V8 引擎 TurboFan 编译原理 - CSDN](https://blog.csdn.net/gitblog_00996/article/details/153676555)
7. [V8 字节码与 JIT 编译 - CSDN](https://blog.csdn.net/weixin_38764750/article/details/157067324)
8. [TurboFan 编译器详解 - CSDN](https://blog.csdn.net/gitblog_00267/article/details/152187581)
9. [V8 引擎工作原理 - 知乎](http://zhuanlan.zhihu.com/p/1999436785332278438)
10. [libuv 线程池与异步 I/O - CSDN](https://blog.csdn.net/qq_36287830/article/details/153885623)
11. [libuv 源码分析 - CSDN](https://blog.csdn.net/AnitaSun/article/details/124082843)
12. [libuv 基本介绍 - 百度开发者中心](https://developer.baidu.com/article/details/3294892)
13. [Node.js 内存管理 - 腾讯云](https://cloud.tencent.com/developer/article/1683960)
14. [V8 内存管理及垃圾回收 - 腾讯云](https://cloud.tencent.com/developer/article/1663176)
15. [V8 内存管理 - 知乎](https://zhuanlan.zhihu.com/p/2018258123039744694)
16. [JavaScript 事件循环 - 腾讯云](https://cloud.tencent.com/developer/article/2600753)
17. [事件循环、宏/微任务 - 腾讯云](https://cloud.tencent.com/developer/article/2430800)
