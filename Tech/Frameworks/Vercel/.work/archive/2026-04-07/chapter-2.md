# 第 2 章：Vercel 部署系统

## 2.1 零配置部署原理

### 什么是零配置？

Vercel 的零配置部署指的是：**无需手动配置构建命令、输出目录、服务器规则**，平台自动识别框架类型并完成优化配置。

### 自动识别的框架

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

### 工作原理

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

### 底层技术

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

## 2.2 Git 集成与自动 CI/CD

### 支持的 Git 平台

- **GitHub**：最深度集成，支持所有功能
- **GitLab**：完整支持
- **Bitbucket**：完整支持

### 自动 CI/CD 流程

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

### 部署配置

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

### Deploy Hooks（高级用法）

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

## 2.3 Preview Deployments 机制

### 什么是 Preview Deployments？

每次推送分支或创建 Pull Request 时，Vercel 自动生成一个**独立的预览环境**，提供唯一的预览 URL。

### 核心特性

| 特性 | 说明 |
|------|------|
| **独立环境** | 每个 PR 有自己独立的部署，互不干扰 |
| **自动更新** | PR 更新后，预览环境自动重新部署 |
| **即时访问** | 部署完成后立即可访问，无需等待合并 |
| **评论集成** | 自动在 PR 中添加部署状态评论 |
| **5 秒部署** | 利用缓存和增量构建，快速完成部署 |

### 工作流程

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

### 预览部署 URL 格式

```
https://[项目名]-[git 分支名]-[vercel 团队名].vercel.app
```

**示例：**
```
https://myapp-feature-branch-acme.vercel.app
```

### 实际案例

**电商项目 A/B 测试：**
```
main 分支 → https://shop.vercel.app (生产环境)
├── PR #101 (新首页设计) → https://shop-pr101-acme.vercel.app
├── PR #102 (结账流程优化) → https://shop-pr102-acme.vercel.app
└── PR #103 (移动端适配) → https://shop-pr103-acme.vercel.app
```

---

## 2.4 生产环境部署

### 部署流程

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

### 部署保护

Vercel 提供多种生产环境保护机制：

| 保护类型 | 说明 |
|----------|------|
| **Required Reviews** | 部署前需要指定人员审批 |
| **Bypasses** | 指定人员可绕过审批（紧急修复） |
| **Branch Protection** | 仅允许特定分支部署到生产 |

**配置位置：** Vercel 仪表板 → Settings → Deployment Protection

### 回滚机制

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

### 部署状态监控

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

## 2.5 环境变量与配置管理

### 环境变量类型

Vercel 支持三种类型的环境变量：

| 类型 | 前缀 | 访问位置 | 示例 |
|------|------|----------|------|
| **普通环境变量** | 无 | 仅服务端 | `DATABASE_URL` |
| **客户端环境变量** | `NEXT_PUBLIC_` | 客户端 + 服务端 | `NEXT_PUBLIC_API_URL` |
| **系统环境变量** | 内置 | 自动注入 | `VERCEL_ENV` |

### 设置环境变量

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

### 系统环境变量

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

### 环境变量最佳实践

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

## 2.6 vercel.json 配置（可选）

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

### 常用配置项

| 配置项 | 说明 | 默认值 |
|--------|------|--------|
| `buildCommand` | 构建命令 | 自动检测 |
| `outputDirectory` | 输出目录 | 自动检测 |
| `devCommand` | 本地开发命令 | 自动检测 |
| `installCommand` | 依赖安装命令 | `npm install` |
| `framework` | 强制指定框架 | 自动检测 |
| `regions` | Serverless 函数部署区域 | `iad1` |

---

*第 2 章完成 | 草稿保存至 `.work/vercel/drafts/chapter-2.md`*
