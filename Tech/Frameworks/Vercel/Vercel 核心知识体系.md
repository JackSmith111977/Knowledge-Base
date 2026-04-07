# Vercel 核心知识体系

> 现代 Web 应用部署与托管平台完全指南

**创建日期：** 2026-04-07  
**版本：** 1.0.0  
**最后更新：** 2026-04-07

---

## 目录

- [第 1 章：Vercel 基础认知](#第 1 章-vercel-基础认知)
- [第 2 章：Vercel 部署系统](#第 2 章-vercel-部署系统)
- [第 3 章：Serverless Functions](#第 3 章-serverless-functions)
- [第 4 章：Edge Functions 与边缘计算](#第 4 章-edge-functions-与边缘计算)
- [第 5 章：全球 CDN 与性能优化](#第 5 章-全球-cdn-与性能优化)
- [第 6 章：Vercel AI 生态系统](#第 6 章-vercel-ai-生态系统)
- [第 7 章：高级特性与集成](#第 7 章-高级特性与集成)
- [第 8 章：实战案例与常见误区](#第 8 章-实战案例与常见误区)

---

## 第 1 章：Vercel 基础认知

### 1.1 什么是 Vercel？

Vercel 是一个专为现代 Web 应用设计的云端部署与托管平台，由 Next.js 团队开发并维护。其核心使命是让开发者更专注于代码本身，而不是繁琐的服务器配置，实现从开发到上线的全流程自动化。

**核心定位：**
- **前端应用托管**：支持静态网站、单页应用（SPA）、全栈 Web 应用
- **Serverless 架构**：无需管理服务器，按需自动扩展
- **全球 CDN 加速**：静态资源自动部署到全球边缘节点
- **自动 CI/CD**：连接 GitHub/GitLab/Bitbucket 后，每次 `git push` 自动触发构建和部署

**设计哲学：**
```
Develop. Preview. Ship. —— 开发、预览、发布，一体化完成
```

---

### 1.2 Vercel 的发展历史与核心定位

#### 发展历程

| 时间 | 事件 |
|------|------|
| 2015 年 | Guillermo Rauch 创立 ZEIT 公司（Vercel 前身） |
| 2020 年 | 完成 2100 万美元 A 轮融资，正式更名为 Vercel |
| 2023 年 4 月 | 以 170 亿元人民币估值位列《2023 胡润全球独角兽榜》第 404 位 |
| 2023 年 9 月 | 发布 AI 生成式 UI 系统 v0 测试版（基于 React 和 Tailwind CSS） |
| 2025 年 5 月 | v0 正式版推出，超过 10 万用户申请测试 |
| 2025 年 6 月 | 估值增至 240 亿元，《2025 全球独角兽榜》第 302 位 |
| 2025 年 8 月 | 完成新一轮融资，估值约 648 亿元人民币（90 亿美元） |
| 2025 年 10 月 | Meta 采用 Vercel 替代内部系统，实现与 GitHub 整合的分钟级部署 |
| 2025 年 11 月 | 应用 Anthropic Claude Opus 4.5 模型生成完整购物网站前端 |
| 2026 年 1 月 | 发布 Agent Skills 开源项目，为 AI 编程智能体提供标准化技能包管理器 |

#### 核心产品矩阵

```mermaid
flowchart TD
    A[Vercel 平台] --> B[部署托管]
    A --> C[Serverless 计算]
    A --> D[边缘计算]
    A --> E[AI 生态]
    
    B --> B1[静态站点托管]
    B --> B2[全栈应用部署]
    B --> B3[Preview Deployments]
    
    C --> C1[Serverless Functions]
    C --> C2[API Routes]
    C --> C3[数据库服务]
    
    D --> D1[Edge Functions]
    D --> D2[Edge Middleware]
    D --> D3[全球 CDN]
    
    E --> E1[v0 生成式 UI]
    E --> E2[AI SDK]
    E --> E3[Agent Skills]
```

---

### 1.3 Vercel 的三大核心产品

#### 1. 部署托管（Deployment & Hosting）

**核心特性：**
- **零配置部署**：自动识别主流框架（Next.js/React/Vue/Svelte/Angular/Nuxt/Gatsby 等）
- **全球 CDN 加速**：覆盖 70+ 边缘节点，静态资源自动压缩优化
- **自动 CI/CD**：代码提交后 5 秒内完成部署
- **Preview Deployments**：每个 PR 生成独立预览链接
- **免费 SSL 证书**：自动签发 HTTPS 证书
- **自定义域名**：支持绑定自己的域名，免费配置 DNS

#### 2. Serverless 计算（Serverless Compute）

**Serverless Functions（区域函数）：**
- 运行在特定云区域，提供完整 Node.js 环境
- 按需自动扩展，无需管理服务器
- 适合数据库操作、复杂业务逻辑、支付处理等场景
- 响应速度稳定在 200ms 以内

**Edge Functions（边缘函数）：**
- 运行在全球 300+ 边缘节点上
- 基于 V8 引擎的轻量级 Edge Runtime
- 全球延迟控制在 50ms 内
- 适合路由转发、身份验证、个性化内容、A/B 测试

#### 3. AI 生态系统（AI Ecosystem）

**v0 生成式 UI 系统：**
- 基于 AI 模型生成 React 代码
- 使用 shadcn/ui 和 Tailwind CSS
- 训练过程不使用 Vercel 客户数据或代码
- 支持与 GitHub 整合的分钟级部署

**Vercel AI SDK：**
- 为 AI 应用开发提供标准化工具链
- 支持流式响应处理
- 内置身份验证与安全机制

**Agent Skills（2026 年 1 月发布）：**
- 为 AI 编程智能体提供标准化技能包管理器
- 将专业知识封装为可复用的技能模块

---

### 1.4 Vercel vs 传统部署方案

| 特性 | Vercel | 传统部署（Nginx + CDN） |
|------|--------|------------------------|
| 配置复杂度 | 零配置，自动识别框架 | 需手动配置 SSL、缓存策略、反向代理 |
| 部署速度 | `git push` 后 5 秒内完成 | 需手动构建、上传、重启服务 |
| 扩展能力 | 自动按需扩展 | 需预先规划服务器容量 |
| 预览部署 | 每个 PR 自动生成预览链接 | 需手动搭建预览环境 |
| 全球 CDN | 内置，自动分发 | 需单独配置 CDN 服务 |
| 成本模型 | 按使用量计费，免费额度充足 | 固定服务器成本 + CDN 费用 |
| 维护成本 | 几乎为零 | 需持续运维和监控 |

---

### 1.5 Vercel 的典型应用场景

#### 场景 1：Next.js 全栈应用
- **最适合**：Vercel 由 Next.js 团队开发，对 Next.js 提供原生支持
- **特性利用**：App Router、Server Components、ISR、Edge Functions

#### 场景 2：静态站点/文档网站
- **适合框架**：React、Vue、Svelte、Gatsby、Docusaurus、Nuxt
- **特性利用**：静态资源 CDN、自动优化、零配置部署

#### 场景 3：AI 应用
- **特性利用**：Vercel AI SDK、流式响应、Serverless Functions
- **典型用例**：聊天机器人、AI 生成内容、智能助手

#### 场景 4：电商/营销页面
- **特性利用**：Preview Deployments、A/B 测试、全球 CDN
- **优势**：快速迭代、全球访问速度、高并发处理

#### 场景 5：企业级应用
- **特性利用**：团队协作、权限管理、监控日志、自定义域名
- **优势**：安全合规、可扩展性、专业支持

---

### 1.6 核心客户与生态影响

#### 知名客户
- **OpenAI**：官方使用 Vercel 部署
- **Netflix**：部分前端应用
- **Stripe**：支付相关页面
- **Meta**：2025 年 10 月采用 Vercel 替代内部系统

#### 开源项目
- **Next.js**：React 全栈框架（GitHub 60k+ stars）
- **SWR**：React Hooks 数据请求库
- **Vercel AI SDK**：AI 应用开发工具链
- **Agent Skills**：AI 智能体技能包管理器

#### 市场估值
- 2025 年 8 月：90 亿美元
- 累计融资：超过 5.6 亿美元
- 云托管业务毛利率：76%

---

## 第 2 章：Vercel 部署系统

### 2.1 零配置部署原理

#### 什么是零配置？

Vercel 的零配置部署指的是：**无需手动配置构建命令、输出目录、服务器规则**，平台自动识别框架类型并完成优化配置。

#### 自动识别的框架

| 框架 | 自动检测 | 构建命令 | 输出目录 |
|------|----------|----------|----------|
| Next.js | ✅ | `npm run build` | `.next` |
| React (Create React App) | ✅ | `npm run build` | `build` |
| Vue.js | ✅ | `npm run build` | `dist` |
| SvelteKit | ✅ | `npm run build` | `.svelte-kit` |
| Nuxt.js | ✅ | `npm run build` | `.output` |
| Gatsby | ✅ | `npm run build` | `public` |
| Angular | ✅ | `ng build` | `dist/` |
| Astro | ✅ | `npm run build` | `dist` |

#### 工作原理

```mermaid
flowchart TD
    A[代码推送至 Git 仓库] --> B[Vercel 检测到变更]
    B --> C[自动识别框架类型]
    C --> D{框架已知？}
    D -->|是 | E[加载预设配置]
    D -->|否 | F[尝试自动检测]
    E --> G[执行构建命令]
    F --> G
    G --> H[优化输出文件]
    H --> I[部署至全球 CDN]
    I --> J[生成部署 URL]
```

#### 底层技术

**1. 框架检测机制**
```json
// Vercel 检测逻辑（简化版）
{
  "next.js": "package.json 中 next 依赖 + next.config.js 存在",
  "nuxt.js": "package.json 中 nuxt 或 @nuxt/* 依赖",
  "gatsby": "package.json 中 gatsby 依赖 + gatsby-config.js",
  "vue": "package.json 中 vue 依赖 + vue.config.js",
  "svelte": "package.json 中 @sveltejs/kit 依赖"
}
```

**2. 构建优化**
- **缓存策略**：node_modules 和构建产物智能缓存
- **增量构建**：仅重新构建变更部分
- **并行处理**：多任务并行执行

---

### 2.2 Git 集成与自动 CI/CD

#### 支持的 Git 平台

- **GitHub**：最深度集成，支持所有功能
- **GitLab**：完整支持
- **Bitbucket**：完整支持

#### 自动 CI/CD 流程

```mermaid
sequenceDiagram
    participant Dev as 开发者
    participant Git as Git 平台
    participant Vercel as Vercel
    participant CDN as 全球 CDN
    
    Dev->>Git: git push origin main
    Git->>Vercel: Webhook 通知
    Vercel->>Vercel: 拉取最新代码
    Vercel->>Vercel: 安装依赖
    Vercel->>Vercel: 执行构建
    Vercel->>CDN: 分发静态资源
    Vercel->>Git: 更新部署状态
    Vercel->>Dev: 发送部署完成通知
```

#### 部署配置

**方式 1：通过 Vercel 仪表板**
1. 登录 Vercel 仪表板
2. 点击 "Add New" → "Project"
3. 选择 Git 平台并授权
4. 选择要部署的仓库
5. 配置环境变量（可选）
6. 点击 "Deploy"

**方式 2：通过 Vercel CLI**
```bash
# 1. 安装 Vercel CLI
npm install -g vercel

# 2. 登录账号
vercel login

# 3. 进入项目目录
cd your-project

# 4. 部署项目（预览）
vercel

# 5. 生产环境部署
vercel --prod
```

#### Deploy Hooks（高级用法）

Deploy Hooks 允许你通过 HTTP 请求触发部署，适用于：
- CMS 内容更新后自动触发部署
- 自定义 CI/CD 流程
- 第三方服务集成

**创建 Deploy Hook：**
```bash
# Vercel 仪表板 → Settings → Git → Deploy Hooks → Create Hook
# 获取类似以下的 URL：
https://api-vercel.com/v1/integrations/deploy/prj_xxx/hooks/abc123
```

**触发部署：**
```bash
curl -X POST https://api-vercel.com/v1/integrations/deploy/prj_xxx/hooks/abc123
```

---

### 2.3 Preview Deployments 机制

#### 什么是 Preview Deployments？

每次推送分支或创建 Pull Request 时，Vercel 自动生成一个**独立的预览环境**，提供唯一的预览 URL。

#### 核心特性

| 特性 | 说明 |
|------|------|
| **独立环境** | 每个 PR 有自己独立的部署，互不干扰 |
| **自动更新** | PR 更新后，预览环境自动重新部署 |
| **即时访问** | 部署完成后立即可访问，无需等待合并 |
| **评论集成** | 自动在 PR 中添加部署状态评论 |
| **5 秒部署** | 利用缓存和增量构建，快速完成部署 |

#### 工作流程

```mermaid
flowchart LR
    A[开发者创建 PR] --> B[Vercel 检测到 PR]
    B --> C[创建预览部署]
    C --> D[生成预览 URL]
    D --> E[更新 PR 状态]
    E --> F[团队 review]
    F --> G{审核通过？}
    G -->|是 | H[合并到 main]
    G -->|否 | I[修改代码]
    I --> B
```

#### 预览部署 URL 格式

```
https://[项目名]-[git 分支名]-[vercel 团队名].vercel.app
```

**示例：**
```
https://myapp-feature-branch-acme.vercel.app
```

#### 实际案例

**电商项目 A/B 测试：**
```
main 分支 → https://shop.vercel.app (生产环境)
├── PR #101 (新首页设计) → https://shop-pr101-acme.vercel.app
├── PR #102 (结账流程优化) → https://shop-pr102-acme.vercel.app
└── PR #103 (移动端适配) → https://shop-pr103-acme.vercel.app
```

---

### 2.4 生产环境部署

#### 部署流程

**从 Git 分支部署：**
```bash
# 推送至生产分支（通常是 main/master）
git push origin main

# Vercel 自动检测并部署到生产环境
# 生产 URL: https://your-project.vercel.app
```

**手动提升为生产：**
```bash
# 将预览部署提升为生产
vercel --prod
```

#### 部署保护

Vercel 提供多种生产环境保护机制：

| 保护类型 | 说明 |
|----------|------|
| **Required Reviews** | 部署前需要指定人员审批 |
| **Bypasses** | 指定人员可绕过审批（紧急修复） |
| **Branch Protection** | 仅允许特定分支部署到生产 |

**配置位置：** Vercel 仪表板 → Settings → Deployment Protection

#### 回滚机制

**方式 1：通过仪表板**
1. 进入项目 Deployments 页面
2. 找到之前的稳定版本
3. 点击 "⋯" → "Promote to Production"

**方式 2：通过 CLI**
```bash
# 列出历史部署
vercel ls

# 回滚到指定部署
vercel rollback [deployment-id]
```

#### 部署状态监控

```mermaid
stateDiagram-v2
    [*] --> Queued: 代码推送
    Queued --> Building: 开始构建
    Building --> Ready: 构建成功
    Building --> Error: 构建失败
    Ready --> [*]: 部署完成
    Error --> Building: 重新部署
```

---

### 2.5 环境变量与配置管理

#### 环境变量类型

Vercel 支持三种类型的环境变量：

| 类型 | 前缀 | 访问位置 | 示例 |
|------|------|----------|------|
| **普通环境变量** | 无 | 仅服务端 | `DATABASE_URL` |
| **客户端环境变量** | `NEXT_PUBLIC_` | 客户端 + 服务端 | `NEXT_PUBLIC_API_URL` |
| **系统环境变量** | 内置 | 自动注入 | `VERCEL_ENV` |

#### 设置环境变量

**方式 1：通过仪表板**
1. 项目 Settings → Environment Variables
2. 点击 "Add New"
3. 填写名称、值、环境（Production/Preview/Development）

**方式 2：通过 `.env` 文件（本地）**
```env
# .env.local
DATABASE_URL="postgresql://user:pass@localhost:5432/db"
NEXT_PUBLIC_API_URL="https://api.example.com"
```

**方式 3：通过 Vercel CLI**
```bash
# 拉取远程环境变量到本地
vercel env pull

# 列出所有环境变量
vercel env ls
```

#### 系统环境变量

Vercel 自动注入的系统变量：

| 变量名 | 说明 | 示例值 |
|--------|------|--------|
| `VERCEL` | 是否在 Vercel 环境中 | `"1"` |
| `VERCEL_ENV` | 当前环境 | `"production"` / `"preview"` / `"development"` |
| `VERCEL_URL` | 部署 URL | `your-project.vercel.app` |
| `VERCEL_GIT_COMMIT_SHA` | Git 提交 SHA | `"abc123"` |
| `VERCEL_GIT_COMMIT_REF` | Git 分支名 | `"main"` |

**使用示例：**
```javascript
// pages/api/config.js
export default function handler(req, res) {
  res.json({
    isProduction: process.env.VERCEL_ENV === 'production',
    deploymentUrl: process.env.VERCEL_URL,
    commitSha: process.env.VERCEL_GIT_COMMIT_SHA,
  });
}
```

#### 环境变量最佳实践

```markdown
✅ 推荐做法：
- 敏感信息使用环境变量，不要硬编码
- 区分不同环境的环境变量
- 使用 `NEXT_PUBLIC_` 前缀明确标识客户端变量
- `.env` 文件添加到 `.gitignore`

❌ 避免做法：
- 在代码中硬编码 API 密钥
- 将 `.env` 文件提交到 Git
- 在生产环境使用默认值
- 客户端访问敏感环境变量
```

---

### 2.6 vercel.json 配置（可选）

对于需要自定义配置的场景，可在项目根目录创建 `vercel.json`：

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/$1" }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=60, stale-while-revalidate"
        }
      ]
    }
  ]
}
```

#### 常用配置项

| 配置项 | 说明 | 默认值 |
|--------|------|--------|
| `buildCommand` | 构建命令 | 自动检测 |
| `outputDirectory` | 输出目录 | 自动检测 |
| `devCommand` | 本地开发命令 | 自动检测 |
| `installCommand` | 依赖安装命令 | `npm install` |
| `framework` | 强制指定框架 | 自动检测 |
| `regions` | Serverless 函数部署区域 | `iad1` |

---

## 第 3 章：Serverless Functions

### 3.1 Serverless Functions 工作原理

#### 什么是 Serverless Functions？

Vercel Serverless Functions（无服务器函数）是一种**按需执行**的云函数，无需管理服务器基础设施，代码仅在请求触发时运行并自动扩展。

#### 核心特性

| 特性 | 说明 |
|------|------|
| **零运维** | 无需配置、监控或维护服务器 |
| **按需执行** | 仅在请求触发时运行，无请求时不消耗资源 |
| **自动扩展** | 从零到数百万并发，自动处理流量峰值 |
| **按量计费** | 仅按实际执行时间和次数计费 |
| **多语言支持** | Node.js、Python、Go、Ruby 等 |

#### 架构原理

```mermaid
flowchart TD
    A[HTTP 请求] --> B[Vercel Edge Network]
    B --> C{函数是否冷启动？}
    C -->|是 | D[初始化运行时]
    C -->|否 | E[复用温暖实例]
    D --> F[执行函数代码]
    E --> F
    F --> G[返回响应]
    G --> H[实例保持温暖一段时间]
    H --> I{有新请求？}
    I -->|是 | E
    I -->|否 | J[实例销毁]
```

#### 执行流程详解

**1. 冷启动（Cold Start）**
- 函数首次被调用或长时间未调用后的启动
- 包括：运行时初始化、代码加载、依赖安装
- 典型时间：100ms - 2s（取决于运行时和代码大小）

**2. 热启动（Warm Start）**
- 复用已初始化的函数实例
- 典型时间：10ms - 50ms

**3. 执行限制**
| 参数 | 限制 |
|------|------|
| 最大执行时间（Hobby） | 10 秒 |
| 最大执行时间（Pro） | 60 秒 |
| 最大执行时间（Enterprise） | 900 秒（15 分钟） |
| 最大内存 | 1024 MB |
| 最大包大小 | 50 MB |

---

### 3.2 函数编写与部署

#### 函数文件结构

在 Vercel 项目中，Serverless Functions 放置在 `api/` 目录下：

```
my-project/
├── api/
│   ├── hello.js              # /api/hello 端点
│   ├── users/
│   │   ├── index.js          # /api/users 端点
│   │   └── [id].js           # /api/users/:id 端点（动态路由）
│   └── webhook/
│       └── stripe.js         # /api/webhook/stripe 端点
├── public/
└── package.json
```

#### 基本函数示例

**Node.js 函数（hello.js）：**
```javascript
// api/hello.js
export default function handler(req, res) {
  const { name = 'World' } = req.query;
  
  res.status(200).json({
    message: `Hello, ${name}!`,
    timestamp: new Date().toISOString(),
  });
}
```

**异步函数：**
```javascript
// api/data.js
export default async function handler(req, res) {
  // 等待异步操作
  const data = await fetchDataFromDatabase();
  
  res.status(200).json({ data });
}
```

**动态路由（[id].js）：**
```javascript
// api/users/[id].js
export default function handler(req, res) {
  const { id } = req.query;
  
  // 根据 ID 获取用户
  const user = getUserById(id);
  
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
}
```

#### HTTP 方法处理

```javascript
// api/users.js
export default function handler(req, res) {
  switch (req.method) {
    case 'GET':
      // 获取用户列表
      return getUsers(res);
    
    case 'POST':
      // 创建新用户
      return createUser(req, res);
    
    case 'PUT':
      // 更新用户
      return updateUser(req, res);
    
    case 'DELETE':
      // 删除用户
      return deleteUser(req, res);
    
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
```

#### 访问请求数据

```javascript
// api/echo.js
export default function handler(req, res) {
  // 1. 查询参数 (?name=John)
  const { name } = req.query;
  
  // 2. 路由参数 (api/users/[id].js)
  const { id } = req.query; // 或 req.params
  
  // 3. 请求体 (POST/PUT)
  const body = req.body;
  
  // 4. 请求头
  const authHeader = req.headers.authorization;
  
  // 5. Cookies
  const cookie = req.cookies?.sessionId;
  
  res.json({ name, id, body, authHeader, cookie });
}
```

---

### 3.3 运行时与区域选择

#### 支持的运行时

**Node.js Serverless Functions：**
| Node.js 版本 | 状态 |
|-------------|------|
| 18.x | ✅ 支持 |
| 20.x | ✅ 推荐 |
| 22.x | ✅ 支持 |

**Python（需配置）：**
```json
// vercel.json
{
  "functions": {
    "api/*.py": {
      "runtime": "python3.9"
    }
  }
}
```

**Go（需配置）：**
```json
// vercel.json
{
  "functions": {
    "api/*.go": {
      "runtime": "go1.x"
    }
  }
}
```

#### 区域配置

Serverless Functions 部署在指定的云区域，影响：
- **延迟**：离用户越近越快
- **数据驻留**：满足合规要求
- **成本**：不同区域价格可能不同

**配置方式 1：vercel.json**
```json
{
  "regions": ["iad1"] 
}
```

**可用区域：**
| 区域代码 | 位置 | 适用地区 |
|---------|------|---------|
| `iad1` | 美国东部（弗吉尼亚） | 北美、欧洲 |
| `sfo1` | 美国西部（旧金山） | 北美西海岸、亚洲 |
| `pdx1` | 美国西部（波特兰） | 北美西海岸 |
| `cle1` | 美国中部（克利夫兰） | 北美中部 |
| `hnd1` | 日本（东京） | 东亚、东南亚 |
| `syd1` | 澳大利亚（悉尼） | 大洋洲 |

**配置方式 2：单个函数配置**
```javascript
// api/database.js
export const config = {
  regions: ['hnd1'], // 仅在日本区域运行
};

export default function handler(req, res) {
  // ...
}
```

---

### 3.4 API Routes 集成（Next.js）

#### Next.js Pages Router

```javascript
// pages/api/hello.js
export default function handler(req, res) {
  res.status(200).json({ message: 'Hello from Next.js!' });
}
```

#### Next.js App Router（Route Handlers）

```javascript
// app/api/hello/route.js
import { NextResponse } from 'next/server';

export async function GET(request) {
  return NextResponse.json({ message: 'Hello from App Router!' });
}

export async function POST(request) {
  const body = await request.json();
  return NextResponse.json({ received: body });
}
```

#### 数据库连接示例

```javascript
// lib/db.js
import { Pool } from '@vercel/postgres';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function query(text, params) {
  const client = await pool.connect();
  try {
    return await client.query(text, params);
  } finally {
    client.release();
  }
}

// pages/api/users.js
import { query } from '../../lib/db';

export default async function handler(req, res) {
  const result = await query('SELECT * FROM users');
  res.json(result.rows);
}
```

---

### 3.5 性能优化与成本考量

#### 冷启动优化

**问题：** 冷启动导致首次请求延迟高

**优化策略：**

**1. 代码分割**
```javascript
// ❌ 不好：加载所有依赖
import { heavy, unused, alsoUnused } from 'large-library';

// ✅ 好：按需加载
import { onlyWhatINeed } from 'lightweight-alternative';
```

**2. 连接复用**
```javascript
// ❌ 不好：每次请求创建新连接
export default async function handler(req, res) {
  const client = await createDatabaseConnection();
  const data = await client.query('SELECT * FROM users');
  await client.close();
  res.json(data);
}

// ✅ 好：模块级缓存连接
let cachedClient = null;

async function getClient() {
  if (!cachedClient) {
    cachedClient = await createDatabaseConnection();
  }
  return cachedClient;
}

export default async function handler(req, res) {
  const client = await getClient();
  const data = await client.query('SELECT * FROM users');
  res.json(data);
}
```

**3. 预热策略**
```javascript
// 使用 Vercel Cron Jobs 定期调用
// api/warmup.js
export default function handler(req, res) {
  res.json({ status: 'warm' });
}

// vercel.json
{
  "crons": [{
    "path": "/api/warmup",
    "schedule": "*/5 * * * *" // 每 5 分钟调用一次
  }]
}
```

#### 成本优化

**计费维度：**
| 维度 | 说明 |
|------|------|
| 执行次数 | 函数被调用的次数 |
| 执行时间 | 函数运行时长（GB-秒） |
| 数据传输 | 出站流量 |

**优化建议：**

1. **减少不必要的调用**
   - 使用 CDN 缓存静态响应
   - 客户端缓存不常变更的数据

2. **优化执行时间**
   - 数据库查询优化
   - 异步操作并行化

3. **选择合适的计划**
   | 计划 | 每月免费额度 | 超出价格 |
   |------|-------------|---------|
   | Hobby | 100 GB-秒 | $0.000016667/GB-秒 |
   | Pro | 500 GB-秒 | $0.000013333/GB-秒 |
   | Enterprise | 自定义 | 协商定价 |

#### 监控与调试

**1. 实时日志**
```bash
# 通过 CLI 查看实时日志
vercel logs [deployment-url]

# 查看特定函数日志
vercel logs [deployment-url] /api/hello
```

**2. 错误追踪**
- Vercel 仪表板 → Analytics → Functions
- 查看错误率、执行时间、调用次数

**3. 本地调试**
```bash
# 使用 Vercel CLI 本地运行
vercel dev

# 访问 http://localhost:3000/api/hello
```

---

## 第 4 章：Edge Functions 与边缘计算

### 4.1 Edge Functions 架构解析

#### 什么是 Edge Functions？

Vercel Edge Functions 是一种在**全球边缘节点**上运行的轻量级函数，能够在最接近用户的区域执行代码，将延迟降至最低。

#### 核心特性

| 特性 | 说明 |
|------|------|
| **全球分布** | 运行在 Vercel 300+ 边缘节点（70+ PoPs） |
| **超低延迟** | 全球延迟控制在 50ms 内 |
| **快速启动** | 冷启动时间 <1ms |
| **轻量运行时** | 基于 V8 引擎的 Edge Runtime |
| **标准 API** | 使用 Web Standards API（Request/Response） |

#### Edge vs Serverless 对比

```mermaid
flowchart TB
    subgraph Edge Functions
        A1[全球 300+ 节点]
        A2[冷启动 <1ms]
        A3[轻量逻辑]
        A4[Web API 标准]
        A5[适合：路由/认证/A/B 测试]
    end
    
    subgraph Serverless Functions
        B1[区域级部署]
        B2[冷启动 100ms-2s]
        B3[完整 Node.js 环境]
        B4[任意 NPM 包]
        B5[适合：DB 操作/复杂计算]
    end
```

**详细对比：**

| 维度 | Edge Functions | Serverless Functions |
|------|---------------|---------------------|
| **运行位置** | 全球边缘节点 | 指定云区域（如 iad1） |
| **启动延迟** | <1ms | 100ms - 2s |
| **运行时** | Edge Runtime（V8） | Node.js（完整环境） |
| **API 支持** | Web Standards API | 完整 Node.js API |
| **NPM 包** | 有限（需兼容 Edge） | 无限制 |
| **执行时间** | 最大 50ms CPU 时间 | 10s - 900s |
| **典型延迟** | 全球 <50ms | 依赖区域位置 |
| **成本** | $0.00001/执行单元 | $0.000016667/GB-秒 |

---

### 4.2 Edge Runtime 技术原理

#### 什么是 Edge Runtime？

Edge Runtime 是 Vercel 自研的轻量级 JavaScript 运行时，基于 Chrome 浏览器使用的 **V8 引擎**构建，但移除了浏览器相关的 API，保留了 Web Standards API。

#### 运行时架构

```mermaid
flowchart TB
    subgraph Edge Runtime
        A[V8 引擎]
        B[Web Standards API]
        C[Fetch API]
        D[Streams API]
        E[Web Crypto API]
        F[WebAssembly 支持]
    end
    
    subgraph 不支持的 API
        G[Node.js fs 模块]
        H[Node.js net 模块]
        I[child_process]
        J[动态 require]
    end
```

#### 支持的 API

**✅ 支持的 Web Standards：**
```javascript
// Request/Response API
const request = new Request(url);
const response = new Response('Hello');

// Fetch API
const res = await fetch(url);

// Headers API
const headers = new Headers();
headers.append('Content-Type', 'application/json');

// Streams API
const stream = new ReadableStream();

// Web Crypto API
const digest = await crypto.subtle.digest('SHA-256', data);

// URL/URLPattern API
const url = new URL('/path', 'https://example.com');

// WebAssembly
const wasm = await WebAssembly.instantiateStreaming(...);
```

**❌ 不支持的 Node.js API：**
```javascript
// 文件系统
require('fs')          // ❌
require('path')        // ❌
require('os')          // ❌

// 网络
require('net')         // ❌
require('http')        // ❌

// 子进程
require('child_process') // ❌

// 其他
process.cwd()          // ❌
__dirname              // ❌
```

#### 性能优化机制

**1. 预热实例池**
- Edge 节点维护预热的运行时实例池
- 请求到达时立即分配实例
- 无冷启动延迟

**2. 代码分发**
- 函数代码预先分发到所有边缘节点
- 无需在请求时下载代码
- 保证全球一致的启动速度

**3. 执行单元计费**
- 按 CPU 时间计费（50ms 为单位）
- 比 Serverless 便宜约 15 倍（相同工作量）

---

### 4.3 Edge Functions 实战场景

#### 场景 1：A/B 测试路由

```javascript
// middleware.ts (Next.js)
import { NextResponse } from 'next/server';

export function middleware(request) {
  const url = request.nextUrl.clone();
  
  // 根据 Cookie 分流用户
  const abTest = request.cookies.get('ab-test')?.value;
  
  if (!abTest) {
    // 随机分配 A 组或 B 组
    const group = Math.random() < 0.5 ? 'a' : 'b';
    const response = NextResponse.next();
    response.cookies.set('ab-test', group, { maxAge: 60 * 60 * 24 * 30 });
    return response;
  }
  
  // 根据分组重定向
  if (abTest === 'b') {
    url.pathname = '/new-design';
    return NextResponse.rewrite(url);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/',
};
```

#### 场景 2：地理定位个性化

```javascript
// app/api/location/route.js
import { NextResponse } from 'next/server';

export function GET(request) {
  // 从请求头获取地理位置
  const country = request.headers.get('x-vercel-ip-country') || 'Unknown';
  const city = request.headers.get('x-vercel-ip-city') || 'Unknown';
  const timezone = request.headers.get('x-vercel-ip-timezone') || 'UTC';
  
  return NextResponse.json({
    country,
    city,
    timezone,
    message: `Hello from ${city}, ${country}!`,
  });
}
```

#### 场景 3：请求鉴权

```javascript
// middleware.ts
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request) {
  const token = request.cookies.get('auth-token')?.value;
  
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  try {
    // 验证 JWT 令牌
    await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/protected/:path*'],
};
```

#### 场景 4：响应缓存

```javascript
// app/api/data/route.js
import { NextResponse } from 'next/server';

export async function GET(request) {
  const cacheKey = 'api-data-cache';
  
  // 检查缓存（使用 KV 存储）
  const cached = await getFromCache(cacheKey);
  if (cached) {
    return new NextResponse(cached, {
      headers: {
        'x-cache': 'HIT',
        'cache-control': 'public, max-age=60',
      },
    });
  }
  
  // 获取新数据
  const data = await fetchExpensiveData();
  
  // 写入缓存
  await setToCache(cacheKey, data, 60);
  
  return new NextResponse(JSON.stringify(data), {
    headers: {
      'x-cache': 'MISS',
      'cache-control': 'public, max-age=60',
      'content-type': 'application/json',
    },
  });
}
```

#### 场景 5：请求重写/代理

```javascript
// middleware.ts
import { NextResponse } from 'next/server';

export function middleware(request) {
  const url = request.nextUrl.clone();
  
  // 将旧路径重写为新路径
  if (url.pathname.startsWith('/docs/v1')) {
    url.pathname = url.pathname.replace('/v1', '/v2');
    return NextResponse.rewrite(url);
  }
  
  // 代理外部 API
  if (url.pathname.startsWith('/api/proxy/')) {
    const targetUrl = url.pathname.replace('/api/proxy/', 'https://external-api.com/');
    url.href = targetUrl;
    return NextResponse.rewrite(url);
  }
  
  return NextResponse.next();
}
```

---

### 4.4 Edge vs Serverless 选择指南

#### 选择 Edge Functions 的场景

| 场景 | 理由 |
|------|------|
| **低延迟要求** | 全球 <50ms 延迟 |
| **简单逻辑** | 路由、重定向、头部修改 |
| **高并发读取** | 缓存命中、A/B 测试 |
| **边缘缓存** | 根据用户特征返回不同内容 |
| **成本敏感** | 按执行单元计费，成本更低 |

#### 选择 Serverless Functions 的场景

| 场景 | 理由 |
|------|------|
| **数据库操作** | 需要完整 Node.js 驱动 |
| **复杂计算** | 执行时间 >50ms |
| **第三方 API** | 需要特定 NPM 包支持 |
| **文件处理** | 需要文件系统访问 |
| **后台任务** | 长时间运行的任务 |

---

### 4.5 边缘中间件 (Edge Middleware)

#### 什么是 Edge Middleware？

Edge Middleware 是在**缓存之后、请求之前**运行的 Edge Function，用于在请求到达页面或 API 之前执行逻辑。

#### 执行时机

```mermaid
sequenceDiagram
    participant User as 用户
    participant Edge as Vercel Edge
    participant Cache as CDN 缓存
    participant MW as Edge Middleware
    participant Origin as 源服务器/API
    
    User->>Edge: 发起请求
    Edge->>Cache: 检查缓存
    Cache-->>Edge: 缓存未命中
    Edge->>MW: 执行 Middleware
    MW-->>Edge: 返回响应/重写
    Edge->>Origin: 转发到源服务器
    Origin-->>Edge: 返回内容
    Edge-->>User: 返回响应
```

#### Middleware vs Edge Functions 区别

| 维度 | Edge Middleware | Edge Functions |
|------|---------------|---------------|
| **执行时机** | 缓存之后，源请求之前 | 直接在边缘执行 |
| **主要用途** | 修改请求/响应 | 返回完整响应 |
| **访问缓存** | 可以访问缓存内容 | 无法访问缓存 |
| **文件位置** | `middleware.ts`（根目录） | `app/**/route.ts` 或 `api/*.ts` |

#### 典型应用场景

**1. 国际化路由**
```javascript
// middleware.ts
import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // 检查是否有地区前缀
  const pathnameHasLocale = pathname.startsWith('/en') || pathname.startsWith('/zh');
  
  if (!pathnameHasLocale) {
    // 获取用户地区
    const locale = request.headers.get('x-vercel-ip-country') === 'CN' ? 'zh' : 'en';
    
    // 重定向到带地区前缀的 URL
    request.nextUrl.pathname = `/${locale}${pathname}`;
    return NextResponse.redirect(request.nextUrl);
  }
  
  return NextResponse.next();
}
```

**2. 机器人检测**
```javascript
// middleware.ts
import { NextResponse } from 'next/server';

export function middleware(request) {
  const userAgent = request.headers.get('user-agent') || '';
  
  // 检测已知的爬虫/机器人
  const botPatterns = [
    /bot/i, /crawler/i, /spider/i, /scraper/i
  ];
  
  if (botPatterns.some(pattern => pattern.test(userAgent))) {
    // 允许善意爬虫（Google、Bing 等）
    const allowedBots = ['Googlebot', 'Bingbot', 'Bytespider'];
    if (!allowedBots.some(bot => userAgent.includes(bot))) {
      // 阻止恶意爬虫
      return new NextResponse('Blocked', { status: 403 });
    }
  }
  
  return NextResponse.next();
}
```

#### 性能最佳实践

1. **减少 Middleware 执行时间**
   - 避免复杂计算
   - 使用简单的条件判断

2. **精确配置 matcher**
   ```javascript
   export const config = {
     // 仅在特定路径运行
     matcher: ['/dashboard/:path*', '/api/:path*'],
     
     // 排除静态资源
     // matcher: '/((?!_next/static|_next/image|favicon.ico).*)',
   };
   ```

3. **利用响应头部**
   ```javascript
   const response = NextResponse.next();
   response.headers.set('x-custom-header', 'value');
   return response;
   ```

---

## 第 5 章：全球 CDN 与性能优化

### 5.1 Vercel CDN 网络架构

#### 全球网络覆盖

Vercel CDN 是一个全球分布式内容分发网络，通过 70+ PoPs（Points of Presence）和 125+ 边缘节点，将内容缓存到离用户最近的位置。

#### 核心特性

| 特性 | 说明 |
|------|------|
| **智能路由** | 自动选择最优路径和节点 |
| **HTTP/2 + HTTP/3** | 支持最新协议，提升传输效率 |
| **自动压缩** | Gzip/Brotli 自动压缩 |
| **图片优化** | 自动格式转换（WebP/AVIF） |
| **DDoS 防护** | L3/L4/L7 全方位防护 |

---

### 5.2 缓存控制策略

#### 三层缓存控制头

Vercel 使用三层缓存控制头：

| 缓存头 | 级别 | 优先级 |
|--------|------|--------|
| `Cache-Control` | 基础 HTTP 缓存 | 最低 |
| `CDN-Cache-Control` | CDN 级别缓存 | 中等 |
| `Vercel-CDN-Cache-Control` | Vercel 特定缓存 | 最高 |

#### 缓存头详解

**1. Cache-Control（基础）**
```http
Cache-Control: public, max-age=31536000, immutable
```

| 指令 | 说明 |
|------|------|
| `public` | 可被任何缓存存储 |
| `private` | 仅浏览器可缓存 |
| `max-age=3600` | 缓存 1 小时 |
| `s-maxage=3600` | CDN 缓存 1 小时 |
| `immutable` | 内容永不变更（哈希文件名） |
| `no-store` | 不缓存 |
| `no-cache` | 每次都验证 |

#### 基于标签的缓存失效（Tag-based Invalidation）

**设置缓存标签：**
```javascript
// api/data.js
export default async function handler(req, res) {
  const data = await fetchData();
  
  res.setHeader('Vercel-CDN-Cache-Control', 'max-age=3600');
  res.setHeader('Vercel-Cache-Tag', 'posts,homepage');
  
  res.json(data);
}
```

**清除缓存：**
```bash
# Vercel Dashboard API
curl -X POST https://api.vercel.com/v2/projects/[id]/cache-tags \
  -H "Authorization: Bearer [token]" \
  -d '{"tags": ["posts", "homepage"]}'
```

**Next.js 中使用：**
```javascript
// app/posts/page.js
import { revalidateTag } from 'next/cache';

export default async function Page() {
  const posts = await fetch('https://...', {
    next: { tags: ['posts'] },
  });
  
  return <div>{/* ... */}</div>;
}

// 清除缓存
revalidateTag('posts');
```

---

### 5.3 静态资源优化

#### 图片优化
```javascript
import Image from 'next/image';

<Image
  src="/photo.jpg"
  alt="Description"
  width={800}
  height={600}
  priority  // 关键图片优先加载
  quality={75}  // 压缩质量
  sizes="(max-width: 768px) 100vw, 50vw"  // 响应式尺寸
/>
```

**优化效果：**
- 自动转换为 WebP/AVIF 格式
- 按需加载不同尺寸
- 懒加载非关键图片
- 减少 80%+ 图片体积

#### 字体优化
```javascript
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',  // 避免 FOIT
  preload: true,    // 预加载
});
```

---

### 5.4 增量静态再生（ISR）

#### ISR 工作原理

```mermaid
sequenceDiagram
    participant User as 用户
    participant CDN as Vercel CDN
    participant Server as Serverless
    
    User->>CDN: 请求页面
    CDN-->>User: 返回缓存版本（Stale）
    CDN->>Server: 后台再生成
    
    User->>CDN: 再次请求
    CDN-->>User: 返回新版本（Fresh）
```

#### Next.js ISR 配置

```javascript
// pages/posts/[id].js
export async function getStaticProps({ params }) {
  const post = await fetchPost(params.id);
  
  return {
    props: { post },
    // 每 60 秒重新生成
    revalidate: 60,
  };
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking', // 或 true/blocking
  };
}
```

#### on-demand ISR

```javascript
// app/api/revalidate/route.js
import { revalidatePath, revalidateTag } from 'next/cache';

export async function POST(request) {
  const { path, tag } = await request.json();
  
  if (path) {
    revalidatePath(path);
  }
  
  if (tag) {
    revalidateTag(tag);
  }
  
  return Response.json({ revalidated: true });
}
```

---

## 第 6 章：Vercel AI 生态系统

### 6.1 Vercel AI SDK 概述

#### 什么是 Vercel AI SDK？

Vercel AI SDK 是一个用于构建 AI 驱动应用的完整工具链，提供流式响应处理、多模型支持、React Hooks 等功能，让开发者轻松集成 AI 能力到 Web 应用中。

#### 核心特性

| 特性 | 说明 |
|------|------|
| **流式响应** | 原生支持 SSE（Server-Sent Events）流式传输 |
| **多模型支持** | OpenAI、Anthropic、Google、本地模型等 |
| **React Hooks** | `useChat`、`useCompletion`、`useEmbedding` |
| **服务端集成** | Next.js App Router、Server Actions 支持 |
| **类型安全** | 完整的 TypeScript 类型定义 |

#### 基础用法

```javascript
// app/api/chat/route.js
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

export async function POST(req) {
  const { messages } = await req.json();
  
  const result = streamText({
    model: openai('gpt-4o'),
    messages,
  });
  
  return result.toDataStreamResponse();
}

// components/chat.js
'use client';

import { useChat } from 'ai/react';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  
  return (
    <div>
      {messages.map(m => (
        <div key={m.id}>{m.role}: {m.content}</div>
      ))}
      <form onSubmit={handleSubmit}>
        <input value={input} onChange={handleInputChange} />
        <button type="submit">发送</button>
      </form>
    </div>
  );
}
```

---

### 6.2 v0 生成式 UI 系统

#### 什么是 v0？

v0 是 Vercel 推出的 AI 生成式 UI 系统，可根据自然语言描述生成 React 组件代码，基于 shadcn/ui 和 Tailwind CSS 构建。

#### 核心特性

| 特性 | 说明 |
|------|------|
| **文本转 UI** | 输入自然语言描述，生成完整组件代码 |
| **基于 shadcn/ui** | 使用高质量的 Radix UI 组件 |
| **Tailwind CSS** | 实用优先的样式系统 |
| **可复制粘贴** | 生成的代码可直接使用 |
| **GitHub 集成** | 一键部署到 Vercel |
| **数据隐私** | 不使用客户数据训练 |

---

### 6.3 Agent Skills 项目

#### 什么是 Agent Skills？

Agent Skills 是 Vercel 于 2026 年 1 月发布的开源项目，旨在为 AI 编程智能体提供标准化的技能包管理器。

#### Skill 包结构

```
skill-name/
├── SKILL.md              # 技能描述与执行流程
├── package.json          # 依赖配置
├── scripts/
│   └── run.js           # 执行脚本
├── templates/
│   └── template.md      # 模板文件
└── examples/
    └── example.md       # 使用示例
```

#### 核心价值

| 价值 | 说明 |
|------|------|
| **知识封装** | 将专家经验转化为可执行技能 |
| **标准化** | 统一技能包格式，便于复用 |
| **渐进式披露** | 按需加载，降低 Token 消耗 |
| **跨 Agent 兼容** | 任何 Agent 都可调用 |

---

### 6.4 AI 应用部署最佳实践

#### 流式响应优化

**1. 使用 Edge Functions**
```javascript
// app/api/chat/route.js
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

// 强制使用 Edge Runtime
export const runtime = 'edge';

export async function POST(req) {
  const { messages } = await req.json();
  
  const result = streamText({
    model: openai('gpt-4o'),
    messages,
  });
  
  return result.toDataStreamResponse();
}
```

#### 环境变量安全

```javascript
// ✅ 正确：服务端读取
const apiKey = process.env.OPENAI_API_KEY;

// ❌ 错误：客户端暴露
const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY; // 会泄露到客户端
```

---

## 第 7 章：高级特性与集成

### 7.1 自定义域名与 SSL

#### 域名配置流程

**1. 在 Vercel 添加域名**
1. Vercel Dashboard → 项目 Settings → Domains
2. 点击 "Add" 输入域名
3. 选择域名类型（根域名/子域名）

**2. 配置 DNS 记录**

| 域名类型 | 记录类型 | 名称 | 值 |
|---------|---------|------|-----|
| 根域名 | A | `@` | `76.76.21.21` |
| 子域名 | CNAME | `www` | `cname.vercel-dns.com` |

**3. 验证 DNS 传播**
```bash
# 检查 DNS 是否生效
dig your-domain.com
nslookup your-domain.com
```

#### SSL 证书自动管理

**自动特性：**
- 自动签发 Let's Encrypt SSL 证书
- 自动续期（到期前 30 天）
- 强制 HTTPS 重定向

---

### 7.2 团队协作与权限管理

#### 团队角色

| 角色 | 权限 |
|------|------|
| **Owner** | 完整权限，包括账单、团队管理 |
| **Member** | 项目创建、部署、配置 |
| **Contributor** | 仅部署权限，不能修改配置 |
| **Viewer** | 只读权限，查看部署和分析 |

#### 部署保护

| 类型 | 说明 |
|------|------|
| **Required Reviews** | 部署前需要指定人员审批 |
| **Branch Protection** | 仅允许特定分支部署到生产 |
| **Approval Bypasses** | 指定人员可绕过审批 |

---

### 7.3 第三方服务集成

#### Vercel 原生存储

| 服务 | 类型 | 提供商 | 适用场景 |
|------|------|--------|---------|
| Vercel KV | Redis | Upstash | 缓存、会话存储 |
| Vercel Postgres | PostgreSQL | Neon | 关系型数据 |
| Vercel Blob | 对象存储 | Cloudflare R2 | 文件存储 |
| Edge Config | 键值存储 | Vercel | 边缘配置 |

#### 集成示例

```javascript
// Vercel KV
import { kv } from '@vercel/kv';
await kv.set('key', 'value', { ex: 3600 });
const value = await kv.get('key');

// Vercel Postgres
import { sql } from '@vercel/postgres';
const result = await sql`SELECT * FROM users`;
```

---

## 第 8 章：实战案例与常见误区

### 8.1 Next.js 全栈应用部署

#### 部署步骤

```bash
# 1. 准备工作
npm install
npm run dev      # 本地测试
npm run build    # 构建测试

# 2. 连接 Vercel
npm install -g vercel
vercel login
vercel link

# 3. 配置环境变量
vercel env pull
vercel env add DATABASE_URL

# 4. 部署
vercel          # 预览部署
vercel --prod   # 生产部署
```

---

### 8.2 多框架部署配置

#### Vue 3 + Vite
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

#### SvelteKit
```javascript
// svelte.config.js
import adapter from '@sveltejs/adapter-vercel';

export default {
  kit: {
    adapter: adapter({
      runtime: 'nodejs18.x',
      regions: ['iad1'],
    }),
  },
};
```

#### Nuxt
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  nitro: {
    preset: 'vercel',
  },
});
```

---

### 8.3 性能调优实战

#### Core Web Vitals 优化

**问题：LCP 过高（>4s）**

**解决方案：**
```javascript
// ✅ 关键图片优先加载
<Image
  src="/hero.jpg"
  alt="Hero"
  priority  // 添加此属性
  sizes="100vw"
/>

// ✅ 预加载关键资源
<link rel="preload" href="/fonts/inter.woff2" as="font" crossorigin />

// ✅ 使用 Edge Functions 减少 TTFB
export const runtime = 'edge';
```

**问题：CLS 过高（布局偏移）**

**解决方案：**
```javascript
// ✅ 为图片视频指定尺寸
<Image width={800} height={600} alt="..." />
<video width="640" height="480" />

// ✅ 预留广告位
<div style={{ minHeight: '250px' }} />

// ✅ 字体加载优化
const inter = Inter({ 
  display: 'swap',
  fallback: ['system-ui', 'Arial'],
});
```

---

### 8.4 常见问题排查

| 问题 | 可能原因 | 解决方案 |
|------|---------|---------|
| 构建失败 | 类型错误/内存不足/依赖冲突 | 本地复现构建，查看详细错误 |
| 环境变量未生效 | 忘记 `NEXT_PUBLIC_` 前缀 | 检查变量环境和前缀 |
| Serverless 超时 | 执行时间 >10s | 优化查询/使用 Edge/升级计划 |
| 404 错误 | 路由文件命名错误 | 确保使用 `page.js` 或 `route.js` |

---

### 8.5 面试高频问题

#### Q1: Vercel 的核心优势是什么？

**回答要点：**
1. **零配置部署**：自动识别框架，无需手动配置
2. **全球 CDN**：70+ PoPs，自动分发
3. **Preview Deployments**：每个 PR 独立预览
4. **边缘计算**：Edge Functions 超低延迟
5. **Next.js 原生支持**：官方团队维护

#### Q2: Edge Functions 和 Serverless Functions 的区别？

| 维度 | Edge Functions | Serverless Functions |
|------|---------------|---------------------|
| 运行位置 | 全球边缘节点 | 指定云区域 |
| 启动延迟 | <1ms | 100ms-2s |
| 运行时 | Edge Runtime（V8） | Node.js |
| 适用场景 | 路由、鉴权、A/B 测试 | 数据库、复杂计算 |

#### Q3: ISR 的工作原理？

**回答要点：**
1. 首次请求生成静态页面
2. 后续请求返回缓存版本
3. revalidate 时间过后，后台重新生成
4. 下次请求返回新版本
5. 支持 on-demand 失效（revalidateTag）

#### Q4: 如何保证 API 安全？

**回答要点：**
1. 环境变量管理敏感信息
2. Serverless Functions 中处理 API 调用
3. 实施身份验证（JWT/Session）
4. 速率限制防止滥用
5. 输入验证和 sanitization

---

## 附录：参考资料

### 官方资源
- [Vercel 官方文档](https://vercel.com/docs)
- [Next.js 官方文档](https://nextjs.org/docs)
- [Vercel AI SDK 文档](https://sdk.vercel.ai/docs)

### 社区资源
- [Vercel GitHub](https://github.com/vercel)
- [Next.js GitHub](https://github.com/vercel/next.js)
- [Vercel 社区论坛](https://github.com/vercel/vercel/discussions)

---

*文档版本：1.0.0 | 创建日期：2026-04-07 | 最后更新：2026-04-07*
