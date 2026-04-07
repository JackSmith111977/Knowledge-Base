# 第 8 章：实战案例与常见误区

## 8.1 Next.js 全栈应用部署

### 项目结构

```
my-nextjs-app/
├── app/
│   ├── api/
│   │   └── todos/
│   │       └── route.js      # API 端点
│   ├── dashboard/
│   │   └── page.js           # 仪表板页面
│   ├── layout.js             # 根布局
│   └── page.js               # 首页
├── lib/
│   ├── db.js                 # 数据库连接
│   └── auth.js               # 认证逻辑
├── .env.local                # 环境变量
├── next.config.js
└── package.json
```

### 部署步骤

**步骤 1：准备工作**
```bash
# 安装依赖
npm install

# 本地测试
npm run dev

# 构建测试
npm run build
```

**步骤 2：连接 Vercel**
```bash
# 安装 Vercel CLI
npm install -g vercel

# 登录
vercel login

# 链接项目
vercel link
```

**步骤 3：配置环境变量**
```bash
# 拉取远程环境变量（如有）
vercel env pull

# 或手动添加
vercel env add DATABASE_URL
vercel env add AUTH_SECRET
```

**步骤 4：部署**
```bash
# 预览部署
vercel

# 生产部署
vercel --prod
```

### API 路由配置

```javascript
// app/api/todos/route.js
import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { auth } from '@/lib/auth';

// GET /api/todos
export async function GET() {
  const user = await auth.getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const { rows } = await sql`
    SELECT * FROM todos WHERE user_id = ${user.id} ORDER BY created_at DESC
  `;
  
  return NextResponse.json(rows);
}

// POST /api/todos
export async function POST(request) {
  const user = await auth.getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const body = await request.json();
  const { title } = body;
  
  const { rows } = await sql`
    INSERT INTO todos (title, user_id) VALUES (${title}, ${user.id})
    RETURNING *
  `;
  
  return NextResponse.json(rows[0], { status: 201 });
}
```

### 性能优化

**1. 启用 ISR**
```javascript
// app/blog/[slug]/page.js
export const revalidate = 3600; // 每小时重新生成

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map(post => ({ slug: post.slug }));
}
```

**2. 图片优化**
```javascript
import Image from 'next/image';

<Image
  src="/hero.jpg"
  alt="Hero"
  width={1200}
  height={630}
  priority
  quality={80}
  sizes="(max-width: 768px) 100vw, 1200px"
/>
```

**3. 字体优化**
```javascript
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});
```

---

## 8.2 多框架部署实战

### Vue 3 + Vite 部署

**vite.config.js**
```javascript
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  build: {
    outDir: 'dist',
    assetsDir: 'static',
  },
});
```

**vercel.json（可选）**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

### SvelteKit 部署

**svelte.config.js**
```javascript
import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

export default {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      runtime: 'nodejs18.x',
      regions: ['iad1'],
    }),
  },
};
```

### Nuxt 部署

**nuxt.config.ts**
```typescript
export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  nitro: {
    preset: 'vercel',
  },
});
```

---

## 8.3 性能调优实战

### Core Web Vitals 优化

**问题：LCP 过高（>4s）**

**排查步骤：**
1. Vercel Analytics → Performance 查看 LCP 元素
2. 检查是否是图片/文本块
3. 查看资源加载时间

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

### 缓存优化

**问题：API 响应慢**

**解决方案：**
```javascript
// app/api/data/route.js
import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

export async function GET() {
  const cacheKey = 'api:expensive-data';
  
  // 检查缓存
  const cached = await kv.get(cacheKey);
  if (cached) {
    return NextResponse.json(JSON.parse(cached), {
      headers: {
        'x-cache': 'HIT',
        'cache-control': 'public, max-age=60',
      },
    });
  }
  
  // 执行昂贵操作
  const data = await expensiveOperation();
  
  // 写入缓存
  await kv.set(cacheKey, JSON.stringify(data), { ex: 3600 });
  
  return NextResponse.json(data, {
    headers: {
      'x-cache': 'MISS',
      'cache-control': 'public, max-age=60',
    },
  });
}
```

---

## 8.4 常见问题排查

### 问题 1：构建失败

**错误信息：**
```
Error: Command "npm run build" exited with 1
```

**排查步骤：**
```bash
# 1. 本地复现构建
npm run build

# 2. 查看详细错误
npm run build 2>&1 | tee build.log

# 3. 检查 Node.js 版本
node --version  # Vercel 默认使用 18.x 或 20.x
```

**常见原因：**
| 原因 | 解决方案 |
|------|---------|
| 类型错误 | 修复 TypeScript 错误 |
| 内存不足 | 增加 `NODE_OPTIONS: --max-old-space-size=4096` |
| 依赖冲突 | 删除 node_modules 重新安装 |

### 问题 2：环境变量未生效

**排查：**
```javascript
// 调试环境变量
export default function Debug() {
  console.log('API_URL:', process.env.NEXT_PUBLIC_API_URL);
  console.log('VERCEL_ENV:', process.env.VERCEL_ENV);
  
  return <div>Check console</div>;
}
```

**常见原因：**
| 原因 | 解决方案 |
|------|---------|
| 忘记添加 `NEXT_PUBLIC_` 前缀 | 客户端变量需要此前缀 |
| 环境设置错误 | 检查变量是否设置到正确的环境（Production/Preview） |
| 部署后未重建 | 重新部署以应用新变量 |

### 问题 3：Serverless 函数超时

**错误信息：**
```
Function invocation timed out after 10s
```

**解决方案：**
```javascript
// 1. 优化数据库查询
// ❌ 慢查询
const users = await db.query('SELECT * FROM users');

// ✅ 添加索引和限制
const users = await db.query('SELECT id, name FROM users LIMIT 100');

// 2. 使用流式响应
import { streamText } from 'ai';

// 3. 移动到 Edge Function（如果适用）
export const runtime = 'edge';

// 4. 升级到 Pro 计划（60s 超时）
```

### 问题 4：404 错误

**路由问题排查：**
```
✅ 正确：
app/blog/[slug]/page.js  → /blog/my-post
pages/api/hello.js       → /api/hello

❌ 错误：
app/blog/[slug].js       → 404（缺少 page.js）
pages/api/hello.ts       → 可能 404（检查配置）
```

---

## 8.5 面试高频问题

### Q1: Vercel 的核心优势是什么？

**回答要点：**
1. **零配置部署**：自动识别框架，无需手动配置
2. **全球 CDN**：70+ PoPs，自动分发
3. **Preview Deployments**：每个 PR 独立预览
4. **边缘计算**：Edge Functions 超低延迟
5. **Next.js 原生支持**：官方团队维护

### Q2: Edge Functions 和 Serverless Functions 的区别？

**回答要点：**
| 维度 | Edge Functions | Serverless Functions |
|------|---------------|---------------------|
| 运行位置 | 全球边缘节点 | 指定云区域 |
| 启动延迟 | <1ms | 100ms-2s |
| 运行时 | Edge Runtime（V8） | Node.js |
| 适用场景 | 路由、鉴权、A/B 测试 | 数据库、复杂计算 |

### Q3: 如何优化冷启动？

**回答要点：**
1. 减少依赖包大小
2. 使用轻量级替代库
3. 模块级缓存连接
4. 定期预热（Cron Jobs）
5. 考虑迁移到 Edge Functions

### Q4: ISR 的工作原理？

**回答要点：**
1. 首次请求生成静态页面
2. 后续请求返回缓存版本
3. revalidate 时间过后，后台重新生成
4. 下次请求返回新版本
5. 支持 on-demand 失效（revalidateTag）

### Q5: 如何保证 API 安全？

**回答要点：**
1. 环境变量管理敏感信息
2. Serverless Functions 中处理 API 调用
3. 实施身份验证（JWT/Session）
4. 速率限制防止滥用
5. 输入验证和 sanitization

---

*第 8 章完成 | 草稿保存至 `.work/vercel/drafts/chapter-8.md`*

---

## 所有章节草稿完成

| 章节 | 状态 | 文件 |
|------|------|------|
| 第 1 章 | ✅ 完成 | `chapter-1.md` |
| 第 2 章 | ✅ 完成 | `chapter-2.md` |
| 第 3 章 | ✅ 完成 | `chapter-3.md` |
| 第 4 章 | ✅ 完成 | `chapter-4.md` |
| 第 5 章 | ✅ 完成 | `chapter-5.md` |
| 第 6 章 | ✅ 完成 | `chapter-6.md` |
| 第 7 章 | ✅ 完成 | `chapter-7.md` |
| 第 8 章 | ✅ 完成 | `chapter-8.md` |

**下一步：** 整合所有章节为最终文档，更新 KB-INDEX，清理临时文件
