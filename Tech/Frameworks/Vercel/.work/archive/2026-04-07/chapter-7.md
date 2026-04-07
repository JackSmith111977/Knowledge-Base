# 第 7 章：高级特性与集成

## 7.1 自定义域名与 SSL

### 域名配置流程

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

### SSL 证书自动管理

**自动特性：**
- 自动签发 Let's Encrypt SSL 证书
- 自动续期（到期前 30 天）
- 强制 HTTPS 重定向

**配置选项：**
```
Settings → Domains → HTTPS
├── Always Forward to HTTPS (推荐)
├── HSTS (HTTP Strict Transport Security)
└── Minimum TLS Version
```

### 域名批量管理

```javascript
// 通过 Vercel API 批量添加域名
const domains = ['example.com', 'www.example.com', 'app.example.com'];

for (const domain of domains) {
  await fetch(`https://api.vercel.com/v9/projects/${projectId}/domains`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ name: domain }),
  });
}
```

---

## 7.2 团队协作与权限管理

### 团队角色

| 角色 | 权限 |
|------|------|
| **Owner** | 完整权限，包括账单、团队管理 |
| **Member** | 项目创建、部署、配置 |
| **Contributor** | 仅部署权限，不能修改配置 |
| **Viewer** | 只读权限，查看部署和分析 |

### 权限配置

**项目级权限：**
```
Settings → Team → Access Control
├── Project Access
│   ├── Full Access (完整权限)
│   ├── Deploy Only (仅部署)
│   └── No Access (无权限)
└── Environment Variables
    ├── Can View (可查看)
    └── Cannot View (不可查看)
```

### 部署保护

**保护类型：**
| 类型 | 说明 |
|------|------|
| **Required Reviews** | 部署前需要指定人员审批 |
| **Branch Protection** | 仅允许特定分支部署到生产 |
| **Approval Bypasses** | 指定人员可绕过审批 |

**配置示例：**
```json
// vercel.json
{
  "deploymentProtection": {
    "production": {
      "requiredReviews": 1,
      "allowedBranches": ["main", "release/*"],
      "bypasses": ["admin-user-id"]
    }
  }
}
```

---

## 7.3 第三方服务集成

### 数据库集成

**Vercel 原生存储：**
| 服务 | 类型 | 提供商 | 适用场景 |
|------|------|--------|---------|
| Vercel KV | Redis | Upstash | 缓存、会话存储 |
| Vercel Postgres | PostgreSQL | Neon | 关系型数据 |
| Vercel Blob | 对象存储 | Cloudflare R2 | 文件存储 |
| Edge Config | 键值存储 | Vercel | 边缘配置 |

**集成示例：**
```javascript
// Vercel KV
import { kv } from '@vercel/kv';

// 写入
await kv.set('key', 'value', { ex: 3600 });

// 读取
const value = await kv.get('key');

// Vercel Postgres
import { sql } from '@vercel/postgres';

const result = await sql`SELECT * FROM users`;
```

### 监控服务集成

**1. Vercel Analytics**
```javascript
// app/layout.js
import { Analytics } from '@vercel/analytics/react';

export default function Layout() {
  return (
    <html>
      <body>
        <Analytics />
      </body>
    </html>
  );
}
```

**2. 第三方监控**
```javascript
// Sentry 集成
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.VERCEL_ENV,
});

// Datadog 集成
import { datadogRum } from '@datadog/browser-rum';

datadogRum.init({
  applicationId: process.env.NEXT_PUBLIC_DD_APP_ID,
  clientToken: process.env.NEXT_PUBLIC_DD_CLIENT_TOKEN,
  site: 'datadoghq.com',
});
```

### CI/CD 集成

**GitHub Actions + Vercel：**
```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

---

## 7.4 监控与日志系统

### Vercel 内置监控

**Analytics 面板：**
| 指标 | 说明 |
|------|------|
| **Visits** | 访问量统计 |
| **Performance** | Web Vitals 指标 |
| **Functions** | Serverless 函数执行 |
| **Cache** | CDN 缓存命中率 |

### 日志查看

**CLI 方式：**
```bash
# 查看实时日志
vercel logs

# 查看特定部署日志
vercel logs [deployment-url]

# 查看错误日志
vercel logs --level error
```

**Dashboard 方式：**
```
Project → Analytics → Logs
├── 时间范围筛选
├── 日志级别筛选（Error/Warning/Info）
└── 路径筛选
```

### 第三方日志服务

**Logtail 集成：**
```javascript
// lib/logger.js
import { createLogger } from '@logtail/node';

const logger = createLogger(process.env.LOGTAIL_SOURCE_TOKEN);

export function log(message, context = {}) {
  logger.info(message, {
    ...context,
    environment: process.env.VERCEL_ENV,
    deployment: process.env.VERCEL_URL,
  });
}
```

---

## 7.5 企业级功能

### 单点登录（SSO）

**支持的身份提供商：**
- Okta
- Auth0
- Microsoft Entra ID
- Google Workspace

**配置流程：**
1. Settings → Team → Authentication
2. 选择身份提供商
3. 配置 SAML/OAuth 设置
4. 测试连接

### 审计日志

**审计事件类型：**
| 事件 | 说明 |
|------|------|
| deployment.created | 部署创建 |
| domain.added | 域名添加 |
| secret.created | 密钥创建 |
| team.member.invited | 成员邀请 |

**查询审计日志：**
```bash
curl https://api.vercel.com/v1/audit-logs \
  -H "Authorization: Bearer $TOKEN" \
  -d "teamId=$TEAM_ID" \
  -d "limit=100"
```

### 自定义速率限制

```javascript
// middleware.ts
import { Ratelimit } from '@upstash/ratelimit';
import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(10, '1 m'), // 10 次/分钟
  analytics: true,
});

export async function middleware(request) {
  const ip = request.ip ?? '127.0.0.1';
  const { success } = await ratelimit.limit(ip);
  
  if (!success) {
    return new NextResponse('Too many requests', { status: 429 });
  }
  
  return NextResponse.next();
}
```

### 优先级支持

| 计划 | 支持级别 | 响应时间 |
|------|---------|---------|
| Hobby | 社区支持 | - |
| Pro | 标准支持 | 24 小时 |
| Enterprise | 优先支持 | 4 小时 |
| Enterprise+ | 专属支持 | 1 小时 |

---

*第 7 章完成 | 草稿保存至 `.work/vercel/drafts/chapter-7.md`*
