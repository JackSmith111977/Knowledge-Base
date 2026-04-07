# 第 7 章：JWT 常见误区与面试问题

> **本章目标**：澄清 JWT 开发中的 5 大常见误区，掌握 15 道高频面试题，避免生产环境踩坑

---

## 7.1 误区 1：JWT = 加密？（实际上是签名，解释区别）

### 7.1.1 核心概念辨析

**误区描述**：许多开发者误以为 JWT 是加密的，认为攻击者无法读取 Token 内容。实际上，**标准 JWT 只进行签名（Signing），不进行加密（Encryption）**。

### 7.1.2 签名 vs 加密的本质区别

| 特性 | 签名（Signing） | 加密（Encryption） |
|------|----------------|-------------------|
| **目的** | 验证数据完整性和来源 | 保护数据机密性 |
| **可逆性** | 不可逆（无法从签名还原原文） | 可逆（可用密钥解密） |
| **数据可见性** | Payload 明文可见（Base64 编码） | 密文不可读 |
| **密钥使用** | HMAC 用共享密钥；RSA 用私钥签名 | 对称加密用共享密钥；非对称用公钥加密 |
| **JWT 默认行为** | ✅ JWS（JSON Web Signature） | ❌ 需显式使用 JWE（JSON Web Encryption） |

### 7.1.3 JWT 签名原理详解

**签名生成过程**：

```
Signature = HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  secret_key
)
```

**关键点**：
1. **Base64URL 编码 ≠ 加密**：编码只是为了 URL 安全传输，任何人均可解码
2. **签名只防篡改，不防窥探**：攻击者可以读取 Payload，但无法伪造有效签名
3. **验证流程**：服务端用相同密钥重新计算签名，比对是否一致

### 7.1.4 实际演示：解码 JWT

```javascript
// 任意 JWT 示例
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

// 任何人都可以解码（无需密钥）
const parts = token.split('.');
const header = JSON.parse(Buffer.from(parts[0], 'base64').toString());
const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());

console.log(header);
// { alg: 'HS256', typ: 'JWT' }

console.log(payload);
// { sub: '1234567890', name: 'John Doe', admin: true, iat: 1516239022 }
```

**在线解码工具**：https://jwt.io（官方调试器）

### 7.1.5 什么时候需要加密（JWE）？

**需要 JWE 的场景**：
- 传输敏感数据（如身份证号、银行卡号）
- 符合 GDPR/HIPAA 等合规要求
- 跨不可信网络传输用户隐私

**JWE 结构（5 部分）**：
```
EncryptionKey.EncryptedKey.IV.Ciphertext.AuthenticationTag
```

**Node.js 示例（使用 `jose` 库）**：
```javascript
import { encrypt, decrypt } from 'jose';

const secret = new TextEncoder().encode('your-encryption-key');
const payload = { ssn: '123-45-6789', role: 'admin' };

// 加密
const jwe = await encrypt(payload, secret);

// 解密
const decrypted = await decrypt(jwe, secret);
```

### 7.1.6 安全最佳实践

```markdown
✅ 推荐做法：
- Payload 仅存储非敏感标识（如 user_id, role）
- 始终使用 HTTPS 传输 JWT
- 设置合理的过期时间（exp）
- 敏感数据存数据库，JWT 只存引用 ID

❌ 错误做法：
- 在 Payload 存放密码、手机号、银行卡号
- 认为"编码"就是"加密"而放松警惕
- 将 JWT 存储在 localStorage（易受 XSS 攻击）
```

### 7.1.7 源码级别：签名验证漏洞示例

**常见错误代码**：
```javascript
// ❌ 错误：只解码，不验证签名
const jwt = require('jsonwebtoken');

function authenticate(req, res, next) {
  const token = req.headers.authorization;
  // decode() 只进行 Base64 解码，不验证签名！
  const decoded = jwt.decode(token); 
  req.user = decoded;
  next();
}
```

**正确做法**：
```javascript
// ✅ 正确：使用 verify() 验证签名
function authenticate(req, res, next) {
  const token = req.headers.authorization;
  try {
    // verify() 会验证签名、过期时间、签发者等
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256'], // 明确指定算法
      issuer: 'your-issuer'   // 验证签发者
    });
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
}
```

---

## 7.2 误区 2：JWT 不能登出？（刷新令牌 + 黑名单方案）

### 7.2.1 问题根源：无状态的双刃剑

**JWT 的"无状态"特性**：
- ✅ 优点：服务器无需存储会话，水平扩展简单
- ❌ 缺点：Token 在有效期内始终有效，无法主动撤销

**用户合理期待**：点击"退出登录"后，账号应立即锁死，哪怕 Token 还有 59 分钟才过期。

### 7.2.2 解决方案一：Access Token + Refresh Token 双令牌

**架构设计**：

```
┌─────────────────────────────────────────────────────────┐
│                    双令牌机制                            │
├─────────────────────────────────────────────────────────┤
│  Access Token（访问令牌）                                │
│  - 有效期：15-30 分钟                                    │
│  - 用途：访问 API 资源                                   │
│  - 存储：内存（不持久化）                                │
├─────────────────────────────────────────────────────────┤
│  Refresh Token（刷新令牌）                               │
│  - 有效期：7-30 天                                       │
│  - 用途：换取新的 Access Token                           │
│  - 存储：HttpOnly Cookie / 加密数据库                    │
│  - 可被撤销：支持登出时失效                              │
└─────────────────────────────────────────────────────────┘
```

**工作流程**：

```mermaid
sequenceDiagram
    participant Client
    participant AuthServer
    participant ResourceServer
    participant Redis

    Client->>AuthServer: 1. 登录（用户名/密码）
    AuthServer->>AuthServer: 验证凭证
    AuthServer->>Client: 2. 返回 Access+Refresh Token
    Client->>ResourceServer: 3. 请求资源（带 Access Token）
    ResourceServer->>ResourceServer: 验证 Access Token
    ResourceServer-->>Client: 4. 返回数据

    Note over Client,AuthServer: Access Token 过期后
    Client->>AuthServer: 5. 刷新请求（带 Refresh Token）
    AuthServer->>Redis: 6. 检查 Refresh Token 是否在黑名单
    Redis-->>AuthServer: 不在黑名单
    AuthServer->>Client: 7. 颁发新 Access Token

    Note over Client,AuthServer: 用户点击登出
    Client->>AuthServer: 8. 登出请求
    AuthServer->>Redis: 9. 将 Refresh Token 加入黑名单
    Redis-->>AuthServer: 成功
    AuthServer-->>Client: 登出成功
```

**Node.js 实现示例**：

```javascript
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const redis = require('redis').createClient();

class AuthService {
  constructor() {
    this.ACCESS_TOKEN_EXPIRY = '15m';
    this.REFRESH_TOKEN_EXPIRY = '7d';
    this.JWT_SECRET = process.env.JWT_SECRET;
  }

  // 生成双令牌
  async generateTokens(userId) {
    const accessToken = jwt.sign(
      { userId, type: 'access' },
      this.JWT_SECRET,
      { expiresIn: this.ACCESS_TOKEN_EXPIRY }
    );

    const refreshTokenId = crypto.randomBytes(32).toString('hex');
    const refreshToken = jwt.sign(
      { userId, type: 'refresh', jti: refreshTokenId },
      this.JWT_SECRET,
      { expiresIn: this.REFRESH_TOKEN_EXPIRY }
    );

    // 将 Refresh Token 存入 Redis（用于黑名单检查）
    await redis.setEx(
      `refresh:${refreshTokenId}`,
      7 * 24 * 60 * 60, // 7 天
      userId
    );

    return { accessToken, refreshToken };
  }

  // 刷新 Access Token
  async refreshAccessToken(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, this.JWT_SECRET);
      
      if (decoded.type !== 'refresh') {
        throw new Error('Invalid token type');
      }

      // 检查是否在黑名单
      const isBlacklisted = await redis.exists(`blacklist:${decoded.jti}`);
      if (isBlacklisted) {
        throw new Error('Token has been revoked');
      }

      // 生成新 Access Token
      const newAccessToken = jwt.sign(
        { userId: decoded.userId, type: 'access' },
        this.JWT_SECRET,
        { expiresIn: this.ACCESS_TOKEN_EXPIRY }
      );

      return newAccessToken;
    } catch (err) {
      throw new Error('Invalid refresh token');
    }
  }

  // 登出（将 Refresh Token 加入黑名单）
  async logout(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, this.JWT_SECRET);
      const ttl = await redis.ttl(`refresh:${decoded.jti}`);
      
      // 将 Token 加入黑名单，剩余有效期 = Token 剩余有效期
      if (ttl > 0) {
        await redis.setEx(`blacklist:${decoded.jti}`, ttl, 'revoked');
      }
      
      // 删除 Refresh Token 记录
      await redis.del(`refresh:${decoded.jti}`);
      
      return { success: true };
    } catch (err) {
      throw new Error('Invalid refresh token');
    }
  }
}
```

### 7.2.3 解决方案二：JWT 黑名单（Redis 实现）

**适用场景**：
- 需要立即撤销特定用户的 Token
- 密码修改后使旧 Token 失效
- 安全事件应急处理

**Redis 数据结构设计**：

```
# 黑名单存储格式
Key: blacklist:{jti}
Value: "revoked"
TTL: Token 剩余有效期（秒）

# 示例
blacklist:d5f8a9b2c3e4f5a6b7c8d9e0f1a2b3c4 -> "revoked" (TTL: 892s)
```

**中间件实现**：

```javascript
// JWT 验证中间件（带黑名单检查）
async function jwtAuthMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 检查黑名单
    const isBlacklisted = await redis.exists(`blacklist:${decoded.jti}`);
    if (isBlacklisted) {
      return res.status(401).json({ error: 'Token has been revoked' });
    }

    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    return res.status(401).json({ error: 'Invalid token' });
  }
}
```

### 7.2.4 登出流程完整实现

**前端实现（React 示例）**：

```javascript
// src/hooks/useAuth.js
import { useCallback } from 'react';

function useAuth() {
  const logout = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      
      // 调用后端登出 API
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${refreshToken}`
        }
      });

      // 清除本地存储
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      
      // 重定向到登录页
      window.location.href = '/login';
    } catch (err) {
      console.error('Logout error:', err);
      // 即使后端失败，也清除本地数据
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  }, []);

  return { logout };
}
```

**后端 API 实现**：

```javascript
// routes/auth.js
const express = require('express');
const router = express.Router();
const AuthService = require('../services/auth');

const authService = new AuthService();

// 登出接口
router.post('/logout', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(400).json({ error: 'Missing token' });
    }

    await authService.logout(token);
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
```

### 7.2.5 性能考量与优化

**Redis 黑名单的性能影响**：

| 指标 | 无黑名单 | 有黑名单（本地 Redis） | 有黑名单（跨可用区） |
|------|---------|----------------------|---------------------|
| 延迟 | ~0ms | +1-2ms | +10-15ms |
| 可靠性 | 高 | 中（依赖 Redis） | 中（网络依赖） |
| 扩展性 | 高 | 中 | 低 |

**优化策略**：

1. **布隆过滤器（Bloom Filter）**：减少 Redis 查询次数
   ```javascript
   const BloomFilter = require('bloomfilter');
   const filter = new BloomFilter(
     1000000, // 位数组大小
     0.01     // 误判率
   );

   // 添加 Token 到过滤器
   filter.add(tokenJti);

   // 检查（可能有误判，但不会漏判）
   if (filter.test(tokenJti)) {
     // 可能在黑名单中，进一步检查 Redis
   }
   ```

2. **短有效期 Access Token**：减少黑名单窗口
   - Access Token：5-15 分钟
   - 黑名单只需覆盖这个时间段

3. **分级撤销策略**：
   - 普通登出：仅撤销 Refresh Token
   - 安全事件：撤销用户所有 Token（通过版本号机制）

---

## 7.3 误区 3：JWT 一定比 Session 好？（场景分析，各自优劣）

### 7.3.1 技术对比总览

| 维度 | Session + Cookie | JWT |
|------|-----------------|-----|
| **存储位置** | 服务端（内存/Redis） | 客户端（Cookie/LocalStorage） |
| **状态** | 有状态 | 无状态 |
| **扩展性** | 需 Session 共享（Redis） | 天然支持分布式 |
| **跨域支持** | 需额外配置（CORS + Cookie） | 原生支持 |
| **撤销能力** | 强（服务端删除即可） | 弱（需黑名单机制） |
| **性能** | 需查存储 | 仅需验签 |
| **安全性** | CSRF 风险 | XSS 风险 |
| **数据量** | 无限制 | 建议 < 4KB |
| **移动端友好** | 一般 | 优秀 |

### 7.3.2 Session 认证详解

**工作原理**：

```
1. 用户登录 → 服务端验证凭证
2. 创建 Session（存储用户信息） → 生成 Session ID
3. 返回 Session ID（Set-Cookie 头）
4. 客户端后续请求自动携带 Cookie
5. 服务端通过 Session ID 查 Session 数据
```

**Session 数据结构示例**：
```javascript
// Redis 存储
{
  "sess:abc123xyz": {
    "userId": 12345,
    "username": "john",
    "role": "admin",
    "loginTime": "2024-01-15T10:30:00Z",
    "lastActivity": "2024-01-15T11:45:00Z",
    "ip": "192.168.1.100"
  }
}
```

**Session 优势场景**：
- ✅ 需要即时撤销权限（如员工离职）
- ✅ 存储大量用户数据（购物车、偏好设置）
- ✅ 传统单体应用，无需跨域
- ✅ 对安全性要求极高（金融、医疗）

**Session 劣势场景**：
- ❌ 微服务架构（需 Session 共享）
- ❌ 移动端 API（Cookie 支持不佳）
- ❌ 高并发场景（Redis 压力大）
- ❌ 边缘计算/Serverless（无共享存储）

### 7.3.3 JWT 认证详解

**工作原理**：

```
1. 用户登录 → 服务端验证凭证
2. 生成 JWT（包含用户信息 + 签名）
3. 返回 JWT 给客户端
4. 客户端后续请求携带 JWT（Authorization 头）
5. 服务端验签 JWT，无需查存储
```

**JWT 优势场景**：
- ✅ 微服务架构（服务独立验签）
- ✅ 跨域 API（前端/后端分离）
- ✅ 移动端/物联网设备
- ✅ Serverless/边缘计算
- ✅ 第三方授权（OAuth 2.0）

**JWT 劣势场景**：
- ❌ 需要即时撤销（需额外黑名单）
- ❌ 存储大量数据（Token 膨胀）
- ❌ 传统 Web 应用（Session 更简单）
- ❌ Token 有效期很长（安全风险）

### 7.3.4 混合方案：最佳实践

**现代应用推荐架构**：

```
┌─────────────────────────────────────────────────────────┐
│                  分层认证策略                            │
├─────────────────────────────────────────────────────────┤
│  前端 Web（浏览器）                                      │
│  - Session + HttpOnly Cookie（防 XSS）                  │
│  - CSRF Token 保护                                       │
├─────────────────────────────────────────────────────────┤
│  移动端/第三方 API                                       │
│  - JWT + Refresh Token                                   │
│  - 短期 Access Token（15 分钟）                          │
├─────────────────────────────────────────────────────────┤
│  微服务间通信                                            │
│  - mTLS + JWT 传递                                       │
│  - 服务网格（Istio）统一认证                             │
└─────────────────────────────────────────────────────────┘
```

**实现示例（Next.js + Session/JWT 混合）**：

```javascript
// pages/api/auth/login.js
import { withIronSessionApiRoute } from 'iron-session/next';

export default withIronSessionApiRoute(async function login(req, res) {
  const { username, password, isMobile } = req.body;

  // 验证用户凭证
  const user = await validateUser(username, password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  if (isMobile) {
    // 移动端：返回 JWT
    const accessToken = generateJWT(user);
    const refreshToken = generateRefreshToken(user);
    return res.json({ accessToken, refreshToken });
  } else {
    // Web 端：使用 Session
    req.session.user = {
      id: user.id,
      username: user.username,
      role: user.role
    };
    await req.session.save();
    return res.json({ success: true });
  }
}, {
  cookieName: 'session',
  password: process.env.SESSION_SECRET,
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  }
});
```

### 7.3.5 选型决策树

```
                    ┌─────────────────┐
                    │  是否需要跨域？  │
                    └────────┬────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
             是                            否
              │                             │
              ▼                             ▼
    ┌─────────────────┐           ┌─────────────────┐
    │  是否需要即时撤销？│           │  是否是微服务？  │
    └────────┬────────┘           └────────┬────────┘
             │                             │
    ┌────────┴────────┐           ┌────────┴────────┐
    │                 │           │                 │
   是                否           是                否
    │                 │           │                 │
    ▼                 ▼           ▼                 ▼
┌─────────┐    ┌──────────┐  ┌─────────┐    ┌──────────┐
│ Session │    │   JWT    │  │   JWT   │    │ Session  │
│ +黑名单 │    │          │  │         │    │          │
└─────────┘    └──────────┘  └─────────┘    └──────────┘
```

---

## 7.4 误区 4：JWT 可以永久有效？（安全风险）

### 7.4.1 永久有效 Token 的风险

**风险清单**：

| 风险类型 | 描述 | 影响程度 |
|---------|------|---------|
| **Token 泄露** | XSS/中间人攻击窃取 Token | 🔴 极高 |
| **权限变更滞后** | 用户角色变更后仍可越权访问 | 🟠 高 |
| **设备丢失** | 手机/电脑丢失后 Token 仍可用 | 🟠 高 |
| **会话劫持** | 攻击者冒充合法用户 | 🔴 极高 |
| **合规风险** | 不符合安全审计要求 | 🟡 中 |

### 7.4.2 推荐有效期设置

**分层有效期策略**：

```javascript
const TOKEN_EXPIRY_CONFIG = {
  // Access Token：短期，用于 API 访问
  ACCESS_TOKEN: {
    WEB: '15m',      // 浏览器端
    MOBILE: '30m',   // 移动端（减少刷新频率）
    SERVER_TO_SERVER: '5m'  // 服务间通信
  },

  // Refresh Token：长期，用于续期
  REFRESH_TOKEN: {
    REMEMBER_ME: '30d',    // 勾选"记住我"
    NORMAL: '7d',          // 普通登录
    HIGH_SECURITY: '1d'    // 高安全场景（金融、医疗）
  },

  // 绝对有效期（无论是否刷新）
  ABSOLUTE_EXPIRY: {
    MAX_REFRESH_COUNT: 100,        // 最大刷新次数
    MAX_LIFETIME: '90d'           // 最长生命周期
  }
};
```

### 7.4.3 动态有效期实现

**基于活跃度的滑动窗口**：

```javascript
class DynamicTokenService {
  constructor() {
    this.ACTIVE_WINDOW = 30 * 60 * 1000; // 30 分钟活跃窗口
    this.MAX_LIFETIME = 24 * 60 * 60 * 1000; // 24 小时绝对过期
  }

  async generateTokenWithSlidingWindow(userId, lastActivity) {
    const now = Date.now();
    const timeSinceLastActivity = now - lastActivity;

    // 如果超过活跃窗口，需要重新认证
    if (timeSinceLastActivity > this.MAX_LIFETIME) {
      throw new Error('Session expired, please login again');
    }

    // 计算新的过期时间
    const newExpiry = now + this.ACTIVE_WINDOW;

    const token = jwt.sign(
      {
        userId,
        exp: Math.floor(newExpiry / 1000),
        lastActivity: now
      },
      process.env.JWT_SECRET
    );

    return token;
  }

  // 中间件：每次请求更新活跃时间
  async refreshActivity(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return next();

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // 检查是否接近绝对过期
      const remainingLifetime = decoded.exp * 1000 - Date.now();
      if (remainingLifetime < this.MAX_LIFETIME / 2) {
        // 颁发新 Token
        const newToken = await this.generateTokenWithSlidingWindow(
          decoded.userId,
          Date.now()
        );
        res.setHeader('X-New-Token', newToken);
      }

      next();
    } catch (err) {
      next(); // Token 无效时跳过
    }
  }
}
```

### 7.4.4 刷新令牌轮换（Refresh Token Rotation）

**安全增强机制**：每次使用 Refresh Token 时，同时颁发新的 Refresh Token，旧 Token 立即失效。

**实现流程**：

```javascript
class RefreshTokenRotationService {
  constructor() {
    this.redis = require('redis').createClient();
  }

  async rotateRefreshToken(oldRefreshToken) {
    try {
      // 1. 验证旧 Token
      const decoded = jwt.verify(oldRefreshToken, process.env.JWT_SECRET);
      
      // 2. 检查 reuse 检测（防止重放攻击）
      const reusedToken = await this.redis.get(`reuse:${decoded.jti}`);
      if (reusedToken) {
        // 检测到 Token 重用攻击！撤销用户所有 Token
        await this.revokeAllUserTokens(decoded.userId);
        throw new Error('Token reuse detected, all sessions revoked');
      }

      // 3. 检查是否在黑名单
      const isBlacklisted = await this.redis.exists(`blacklist:${decoded.jti}`);
      if (isBlacklisted) {
        throw new Error('Token has been revoked');
      }

      // 4. 生成新 Refresh Token
      const newJti = crypto.randomBytes(32).toString('hex');
      const newRefreshToken = jwt.sign(
        {
          userId: decoded.userId,
          type: 'refresh',
          jti: newJti,
          family: decoded.family || crypto.randomBytes(16).toString('hex')
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      // 5. 标记旧 Token 为"已使用"（用于 reuse 检测）
      await this.redis.setEx(
        `reuse:${decoded.jti}`,
        7 * 24 * 60 * 60,
        newJti
      );

      // 6. 存储新 Token 元数据
      await this.redis.setEx(
        `refresh:${newJti}`,
        7 * 24 * 60 * 60,
        JSON.stringify({
          userId: decoded.userId,
          createdAt: Date.now(),
          family: decoded.family
        })
      );

      return {
        refreshToken: newRefreshToken,
        family: decoded.family
      };
    } catch (err) {
      throw err;
    }
  }

  async revokeAllUserTokens(userId) {
    // 撤销用户所有 Token（安全事件响应）
    const pattern = `refresh:*:${userId}`;
    const keys = await this.redis.keys(pattern);
    if (keys.length > 0) {
      await this.redis.del(...keys);
    }
  }
}
```

---

## 7.5 误区 5：JWT 适合存储敏感数据？（载荷可解码）

### 7.5.1 Payload 数据结构风险

**任何人均可解码**：
```javascript
// 即使没有密钥，任何人都可以读取 Payload
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInNzbiI6IjEyMy00NS02Nzg5IiwicGFzc3dvcmQiOiJzZWNyZXQxMjMifQ.xxx";

const payload = JSON.parse(
  Buffer.from(token.split('.')[1], 'base64')
);

console.log(payload);
// { userId: 1, ssn: "123-45-6789", password: "secret123" } ❌
```

### 7.5.2 敏感数据分类与处理

| 数据类型 | 示例 | JWT 存储建议 | 推荐方案 |
|---------|------|------------|---------|
| **高敏感** | 密码、SSN、银行卡号 | ❌ 绝对禁止 | 数据库加密存储 |
| **中敏感** | 邮箱、手机号 | ⚠️ 不推荐 | 如必须，使用 JWE 加密 |
| **低敏感** | 用户名、角色 | ✅ 可以 | 设置短有效期 |
| **公开** | 用户 ID、租户 ID | ✅ 推荐 | 用于业务逻辑 |

### 7.5.3 安全存储模式

**模式一：引用 ID 模式（推荐）**

```javascript
// ❌ 错误：直接存储敏感数据
const badToken = jwt.sign(
  {
    userId: 1,
    email: 'user@example.com',
    phone: '13800138000',
    creditCard: '4111-1111-1111-1111'
  },
  secret
);

// ✅ 正确：仅存储引用 ID
const goodToken = jwt.sign(
  {
    userId: 1,
    jti: crypto.randomBytes(16).toString('hex')
  },
  secret
);

// 敏感数据存数据库
await db.userToken.create({
  jti: goodToken.jti,
  email: 'user@example.com',
  phone: '13800138000',
  expiresAt: new Date(Date.now() + 15 * 60 * 1000)
});
```

**模式二：JWE 加密模式**

```javascript
const { encrypt, decrypt } = require('jose');

// 加密敏感数据
async function encryptPayload(data) {
  const secret = process.env.ENCRYPTION_KEY;
  return await encrypt(data, Buffer.from(secret));
}

// JWT Payload 使用加密数据
const encryptedData = await encryptPayload({
  email: 'user@example.com',
  role: 'admin'
});

const token = jwt.sign(
  {
    userId: 1,
    encrypted: encryptedData
  },
  process.env.JWT_SECRET
);
```

### 7.5.4 数据最小化原则

**JWT Payload 最佳实践**：

```javascript
// ✅ 推荐的 Payload 结构
{
  "sub": "user_12345",        // 用户 ID（主题）
  "iss": "auth.example.com",  // 签发者
  "aud": "api.example.com",   // 受众
  "exp": 1760000000,          // 过期时间
  "iat": 1759999000,          // 签发时间
  "jti": "unique-token-id",   // Token 唯一标识
  "role": "admin",            // 角色（非敏感）
  "tenant": "org_abc"         // 租户 ID
}

// ❌ 避免的 Payload 结构
{
  "password": "xxx",          // 禁止
  "credit_card": "4111...",   // 禁止
  "ssn": "123-45-6789",       // 禁止
  "full_address": "...",      // 避免
  "biometric_data": "..."     // 禁止
}
```

---

## 7.6 面试高频问题与解答（15 题）

### 基础概念（1-5）

#### Q1：JWT 的三部分是什么？各自作用？

**答案**：
1. **Header（头部）**：声明 Token 类型和签名算法
   ```json
   { "alg": "HS256", "typ": "JWT" }
   ```
2. **Payload（载荷）**：存储声明（Claims），包括标准声明和自定义声明
   ```json
   { "sub": "123", "exp": 1234567890, "role": "admin" }
   ```
3. **Signature（签名）**：验证数据完整性和来源
   ```
   Signature = HMACSHA256(base64Url(header) + "." + base64Url(payload), secret)
   ```

#### Q2：JWT 和 Session 的核心区别？

**答案**：
| 维度 | Session | JWT |
|------|---------|-----|
| 存储 | 服务端 | 客户端 |
| 状态 | 有状态 | 无状态 |
| 扩展 | 需共享存储 | 天然分布式 |
| 撤销 | 容易 | 需黑名单 |

**关键点**：JWT 将状态从服务端转移到客户端，换取扩展性，牺牲部分撤销能力。

#### Q3：JWT 签名算法 HS256 和 RS256 的区别？

**答案**：
- **HS256（对称加密）**：
  - 签发和验证使用同一密钥
  - 简单高效，适合单体应用
  - 密钥泄露风险高
- **RS256（非对称加密）**：
  - 私钥签名，公钥验证
  - 适合微服务、多服务验证场景
  - 密钥管理更安全

#### Q4：JWT Payload 能放密码吗？为什么？

**答案**：**绝对不能**。Payload 只进行 Base64 编码，任何人均可解码读取。密码应使用 bcrypt/argon2 哈希后存储于数据库，绝不放入 Token。

#### Q5：JWT 过期时间如何设置？

**答案**：
- **Access Token**：15-30 分钟（平衡安全与体验）
- **Refresh Token**：7-30 天（支持长期登录）
- **高安全场景**：更短（5 分钟 Access + 1 天 Refresh）
- **原则**：最小权限时间，满足业务即可

### 安全实践（6-10）

#### Q6：如何实现 JWT 登出？

**答案**：
1. 双令牌机制：Access Token（短期）+ Refresh Token（可撤销）
2. 登出时将 Refresh Token 加入 Redis 黑名单
3. 验证时检查黑名单
4. 可选：刷新令牌轮换增强安全

#### Q7：JWT 存在哪些安全攻击？如何防御？

**答案**：

| 攻击类型 | 描述 | 防御措施 |
|---------|------|---------|
| **None 算法攻击** | 将 alg 改为 none 绕过验证 | 服务端强制指定算法 |
| **密钥泄露** | 弱密钥被爆破 | 使用强密钥（32+ 字节） |
| **XSS 窃取** | 恶意脚本读取 Token | 存储于 HttpOnly Cookie |
| **CSRF** | 跨站伪造请求 | SameSite Cookie + CSRF Token |
| **重放攻击** | 重复使用旧 Token | jti + 一次性检查 |

#### Q8：JWT 存储在哪里最安全？

**答案**：
- **最佳**：HttpOnly + Secure + SameSite Cookie（防 XSS、CSRF）
- **次选**：内存存储（SPA 应用，刷新需重新认证）
- **避免**：LocalStorage（XSS 可读取）

#### Q9：如何防止 Token 被篡改？

**答案**：
1. 服务端必须验证签名（使用 `verify()` 而非`decode()`）
2. 强制指定签名算法（不接受客户端指定）
3. 验证标准声明（exp, iss, aud）
4. 使用 HTTPS 防止中间人攻击

#### Q10：JWT 泄露了怎么办？

**答案**：
1. **立即响应**：
   - 将泄露 Token 的 jti 加入黑名单
   - 撤销用户所有 Refresh Token
   - 强制用户重新登录
2. **长期措施**：
   - 缩短 Token 有效期
   - 实施刷新令牌轮换
   - 增加异常检测（异地登录告警）

### 实战场景（11-15）

#### Q11：微服务架构下 JWT 如何传递？

**答案**：
1. 网关统一认证，验证 JWT 签名
2. 透传 JWT 到下游服务（或通过 mTLS 传递用户上下文）
3. 下游服务验证 JWT（如使用 RS256，可用公钥独立验证）
4. 可选：网关提取用户信息，通过 Header 传递（`X-User-Id`）

#### Q12：如何设计支持"记住我"功能的 JWT 系统？

**答案**：
```
1. 普通登录：Access Token（15 分钟）+ Refresh Token（7 天）
2. 勾选"记住我"：Refresh Token 延长至 30 天
3. Refresh Token 存储于加密数据库，支持主动撤销
4. 每次刷新时检查：
   - 用户密码是否修改
   - 账号是否被禁用
   - Refresh Token 是否被撤销
```

#### Q13：JWT 如何实现权限变更即时生效？

**答案**：
1. **短期方案**：Access Token 设置很短有效期（如 5 分钟）
2. **中期方案**：权限变更时，将用户所有 Token 加入黑名单
3. **长期方案**：使用版本号机制
   ```javascript
   // Payload 包含权限版本号
   { userId: 1, permissionVersion: 3 }

   // 验证时检查数据库版本
   const dbVersion = await getUserPermissionVersion(userId);
   if (decoded.permissionVersion !== dbVersion) {
     throw new Error('Permission changed');
   }
   ```

#### Q14：如何处理 JWT 的跨域问题？

**答案**：
1. **CORS 配置**：
   ```javascript
   app.use(cors({
     origin: 'https://frontend.com',
     credentials: true
   }));
   ```
2. **Cookie 跨域**：使用 `SameSite=None; Secure`
3. **推荐**：JWT 放 Authorization Header，避免 Cookie 跨域复杂性

#### Q15：设计一个支持 100 万并发用户的 JWT 认证系统

**答案**：
```
架构设计：
1. 接入层：Nginx 负载均衡 + TLS 终止
2. 认证服务：无状态 JWT 签发（水平扩展）
3. Redis 集群：黑名单存储（分片 + 主从）
4. 密钥管理：KMS 托管密钥，定期轮换

性能优化：
- Access Token：5 分钟有效期，减少 Redis 查询
- 布隆过滤器：前置黑名单检查
- 本地缓存：公钥缓存（RS256 场景）
- 限流：防止暴力破解

监控告警：
- Token 验证失败率 > 5% 告警
- Redis 延迟 > 10ms 告警
- 异常 IP 频次访问检测
```

---

## 7.7 本章检查清单

### 概念理解检查

- [ ] 能清晰解释 JWT 签名与加密的区别
- [ ] 理解为什么 Payload 不能存放敏感数据
- [ ] 掌握 JWT 与 Session 的优劣对比
- [ ] 理解双令牌机制的工作原理

### 安全实践检查

- [ ] Access Token 有效期 ≤ 30 分钟
- [ ] 使用 `verify()` 而非`decode()` 验证 Token
- [ ] JWT 存储于 HttpOnly Cookie 或内存
- [ ] 实施 Refresh Token 黑名单或轮换机制
- [ ] 强制使用 HTTPS 传输

### 面试准备检查

- [ ] 能回答全部 15 道面试题
- [ ] 能手写 JWT 生成和验证代码
- [ ] 能设计完整的双令牌认证系统
- [ ] 理解 JWT 在微服务中的传递方式

---

## 7.8 引用来源

1. RFC 7519 - JSON Web Token (JWT) 官方标准
2. jwt.io - JWT 官方文档与调试器
3. Auth0 Blog - "JWT Best Practices"
4. Curity.io - "JWT Security Best Practices"
5. OWASP - "JSON Web Token Cheat Sheet"
6. CSDN - "JWT 安全那些坑：从密钥管理到 Token 失效"
7. 知乎 - "Node.js 使用 express-jwt 解析 JWT"
8. 阿里云 - "基于 JWT 的 token 认证"

---

**下一章**：[第 8 章：实战案例与检查清单](./chapter-8.md)
