# JWT 核心知识体系

## 第 5 章：JWT 安全最佳实践

> **导读**：JWT 作为现代认证体系的核心组件，其安全性直接关系到整个系统的安危。本章从密钥管理、过期时间策略、敏感数据存储、传输层安全到常见攻击防御，全面解析 JWT 安全最佳实践。通过本章学习，您将掌握构建安全可靠的 JWT 认证体系所需的全部知识。

---

### 5.1 密钥管理：JWT 安全的基石

密钥管理是 JWT 安全体系中最关键的环节。一个薄弱的密钥管理策略可能导致整个认证系统崩溃。本节将深入探讨密钥存储方案、轮换策略以及泄露应急响应机制。

#### 5.1.1 密钥存储方案

**核心原则：密钥绝不应硬编码在代码中**

将 JWT 签名密钥硬编码在源代码中是最常见的安全错误之一。一旦代码库泄露（如 GitHub 仓库公开、员工离职带走代码），攻击者即可获取密钥并伪造任意 Token。

**推荐存储方案对比：**

| 方案 | 安全性 | 适用场景 | 实施复杂度 |
|------|--------|----------|------------|
| 环境变量 | 中 | 开发/测试环境 | 低 |
| 密钥管理服务 (KMS) | 高 | 生产环境 | 中 |
| 硬件安全模块 (HSM) | 极高 | 金融/政府系统 | 高 |
| 配置文件 (加密) | 中低 | 小型项目 | 低 |

**环境变量存储示例：**

```bash
# .env 文件（确保不提交到版本控制）
JWT_SECRET_KEY="your-super-secret-key-min-32-chars"
JWT_PRIVATE_KEY_PATH="/secure/path/private.pem"
JWT_PUBLIC_KEY_PATH="/secure/path/public.pem"
```

```javascript
// Node.js 读取环境变量
const jwt = require('jsonwebtoken');

const token = jwt.sign(
  { userId: 123 },
  process.env.JWT_SECRET_KEY, // 从环境变量读取
  { algorithm: 'HS256', expiresIn: '1h' }
);
```

**专业密钥管理服务（推荐）：**

对于生产环境，强烈推荐使用专业密钥管理服务：

- **AWS KMS**：提供集中化密钥管理，支持自动轮换
- **Azure Key Vault**：安全的密钥存储与访问控制
- **HashiCorp Vault**：开源密钥管理工具，支持动态密钥
- **阿里云 KMS**：国内合规的密钥管理方案

```java
// Java 使用 AWS KMS 获取密钥示例
import software.amazon.awssdk.services.kms.KmsClient;
import software.amazon.awssdk.services.kms.model.DecryptRequest;

public class KmsKeyProvider {
    private final KmsClient kmsClient;
    
    public String getJwtSecret(String encryptedKeyId) {
        DecryptRequest request = DecryptRequest.builder()
            .ciphertextBlob(SdkBytes.fromBase64String(encryptedKeyId))
            .build();
        
        return kmsClient.decrypt(request)
            .plaintext()
            .asUtf8String();
    }
}
```

#### 5.1.2 密钥轮换策略

**为什么需要密钥轮换？**

密钥轮换是防止长期密钥暴露导致安全风险的关键措施。即使密钥当前未泄露，定期轮换也能：
- 限制密钥泄露后的影响范围
- 符合安全合规要求（如 PCI-DSS、SOC2）
- 降低暴力破解成功率

**轮换频率建议：**

| 算法类型 | 推荐轮换周期 | 密钥长度要求 |
|----------|--------------|--------------|
| HMAC (HS256) | 30-90 天 | 至少 256 位 (32 字节) |
| RSA (RS256) | 6-12 个月 | 至少 2048 位 |
| ECDSA (ES256) | 6-12 个月 | P-256 曲线 |

**平滑密钥轮换方案（零停机时间）：**

实现密钥轮换的核心挑战是：如何在更换密钥后，仍能让旧 Token 继续有效直到自然过期？

**方案一：KID (Key ID) + 多密钥仓库**

JWT Header 支持 `kid` 字段标识签名密钥版本：

```json
{
  "alg": "RS256",
  "typ": "JWT",
  "kid": "key-2025-q1-rotation"
}
```

验证方根据 `kid` 从密钥仓库查找对应公钥：

```java
// Java JJWT 库实现多密钥验证
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.*;

public class JwtVerifier {
    private final Map<String, Key> keyStore = new ConcurrentHashMap<>();
    
    public void addKey(String kid, Key key) {
        keyStore.put(kid, key);
    }
    
    public Claims verify(String token) {
        // 先解析 Header 获取 kid
        JwtParserBuilder parserBuilder = Jwts.parserBuilder();
        
        parserBuilder.setSigningKeyResolver(new SigningKeyResolverAdapter() {
            @Override
            public Key resolveSigningKey(JwtHeader header, Claims claims) {
                String kid = header.getKeyId();
                return keyStore.get(kid);
            }
        });
        
        return parserBuilder.build()
            .parseClaimsJws(token)
            .getBody();
    }
}
```

**方案二：双密钥并行验证**

在轮换期间同时支持新旧密钥：

```javascript
// Node.js 双密钥验证
const jwt = require('jsonwebtoken');

class JwtService {
  constructor(oldSecret, newSecret) {
    this.oldSecret = oldSecret;
    this.newSecret = newSecret;
  }
  
  verify(token) {
    // 优先用新密钥验证
    try {
      return jwt.verify(token, this.newSecret);
    } catch (err) {
      // 新密钥失败则尝试旧密钥
      try {
        return jwt.verify(token, this.oldSecret);
      } catch (err2) {
        throw new Error('Token verification failed');
      }
    }
  }
  
  sign(payload) {
    // 新 Token 一律使用新密钥
    return jwt.sign(payload, this.newSecret);
  }
}
```

**密钥轮换完整流程：**

```
时间线：
├── T0: 生成新密钥对 (key_B)，旧密钥为 (key_A)
├── T1: 部署新密钥到验证服务，支持 key_A 和 key_B 验证
├── T2: 开始使用 key_B 签发新 Token
├── T3: 等待所有 key_A 签发的 Token 自然过期
└── T4: 从密钥仓库中移除 key_A
```

#### 5.1.3 密钥泄露应急响应

**泄露检测信号：**
- Token 异常验证失败率激增
- 发现未知 `kid` 的 Token
- 监控到异常 Token 签发行为
- 代码库/配置文件意外公开

**应急响应流程：**

```
1. 确认泄露 → 2. 启动紧急轮换 → 3. 通知相关方 → 4. 审计追踪
```

**紧急轮换脚本示例：**

```bash
#!/bin/bash
# emergency-key-rotation.sh

# 1. 生成新密钥
NEW_SECRET=$(openssl rand -base64 64)

# 2. 更新密钥管理服务
aws kms update-key --key-id $KEY_ID --new-secret $NEW_SECRET

# 3. 通知所有服务重新加载密钥
kubectl rollout restart deployment/auth-service

# 4. 记录审计日志
echo "Emergency key rotation at $(date) by $(whoami)" >> /var/log/security/rotation.log

# 5. 强制所有用户重新登录（可选）
redis-cli FLUSHDB  # 清除 Token 黑名单缓存
```

---

### 5.2 过期时间策略：时间窗口的艺术

JWT 的过期时间设置是安全性与用户体验之间的平衡艺术。过短导致频繁刷新，过长增加泄露风险。

#### 5.2.1 核心时间声明

JWT 标准定义了四个关键时间声明：

| 声明 | 全称 | 作用 | 是否必需 |
|------|------|------|----------|
| `exp` | Expiration Time | Token 过期时间 | 推荐 |
| `nbf` | Not Before | Token 生效时间 | 可选 |
| `iat` | Issued At | Token 签发时间 | 可选 |
| `jti` | JWT ID | Token 唯一标识 | 可选 |

**时间戳格式：**

所有时间声明均使用 **Unix 时间戳**（秒级精度，从 1970-01-01 00:00:00 UTC 开始）：

```javascript
// 正确的时间戳示例
const payload = {
  sub: "user-123",
  iat: Math.floor(Date.now() / 1000),           // 当前时间戳
  exp: Math.floor(Date.now() / 1000) + 3600,    // 1 小时后过期
  nbf: Math.floor(Date.now() / 1000)            // 立即生效
};
```

#### 5.2.2 过期时间 (`exp`) 最佳实践

**推荐设置策略：**

| 场景 | Access Token 有效期 | Refresh Token 有效期 | 说明 |
|------|---------------------|----------------------|------|
| 高安全系统 | 5-15 分钟 | 1-7 天 | 金融、医疗系统 |
| 一般 Web 应用 | 15-60 分钟 | 7-30 天 | 电商、社交平台 |
| 内部系统 | 1-4 小时 | 30-90 天 | 企业后台、管理面板 |
| 移动应用 | 30-60 分钟 | 60-90 天 | 考虑网络不稳定性 |

**双 Token 模式（推荐架构）：**

```
┌─────────────────────────────────────────────────────────┐
│  Access Token (短期)          Refresh Token (长期)      │
│  - 有效期：15 分钟            - 有效期：7 天             │
│  - 用于 API 请求认证           - 仅用于刷新 Access Token  │
│  - 泄露影响有限               - 存储在 HttpOnly Cookie   │
└─────────────────────────────────────────────────────────┘
```

**Node.js 双 Token 实现：**

```javascript
const jwt = require('jsonwebtoken');

class TokenService {
  generateTokenPair(userId) {
    const accessToken = jwt.sign(
      { 
        sub: userId, 
        type: 'access' 
      },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: '15m' }  // 15 分钟
    );
    
    const refreshToken = jwt.sign(
      { 
        sub: userId, 
        type: 'refresh',
        jti: crypto.randomBytes(16).toString('hex')  // 唯一 ID 用于追踪
      },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }  // 7 天
    );
    
    // 将 refreshToken 存入数据库/Redis 用于撤销
    this.storeRefreshToken(userId, refreshToken);
    
    return { accessToken, refreshToken };
  }
  
  async refreshAccessToken(refreshToken) {
    try {
      // 验证 Refresh Token
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      
      // 检查是否在黑名单中
      if (await this.isRevoked(refreshToken)) {
        throw new Error('Token has been revoked');
      }
      
      // 生成新的 Access Token
      return this.generateAccessToken(decoded.sub);
    } catch (err) {
      throw new Error('Invalid refresh token');
    }
  }
}
```

#### 5.2.3 其他时间声明使用指南

**`nbf` (Not Before) 生效时间：**

用于延迟 Token 生效，适用于预售/定时授权场景：

```javascript
//  Token 在 1 小时后才生效，用于定时任务授权
const scheduledToken = jwt.sign({
  sub: 'scheduled-task',
  action: 'backup',
  nbf: Math.floor(Date.now() / 1000) + 3600,  // 1 小时后生效
  exp: Math.floor(Date.now() / 1000) + 7200   // 2 小时后过期
}, secret);
```

**`iat` (Issued At) 签发时间：**

用于审计追踪和 Token 年龄验证：

```javascript
// 验证 Token 是否过旧（即使未过期）
const decoded = jwt.verify(token, secret);
const tokenAge = Date.now() / 1000 - decoded.iat;

if (tokenAge > 3600) {  // 超过 1 小时，强制刷新
  throw new Error('Token too old, please refresh');
}
```

**`jti` (JWT ID) 唯一标识：**

用于防止重放攻击和实现 Token 黑名单：

```javascript
// 生成带 JTI 的 Token
const jti = crypto.randomBytes(16).toString('hex');
const token = jwt.sign({
  sub: userId,
  jti: jti
}, secret);

// 将 JTI 存入 Redis 实现撤销
redis.setex(`jwt:blacklist:${jti}`, 3600, 'revoked');

// 验证时检查黑名单
const decoded = jwt.verify(token, secret);
const isRevoked = await redis.exists(`jwt:blacklist:${decoded.jti}`);
if (isRevoked) {
  throw new Error('Token has been revoked');
}
```

---

### 5.3 敏感数据存储禁忌

**核心原则：JWT Payload 是编码而非加密，任何人均可解码查看**

#### 5.3.1 绝对禁止存储的数据

| 数据类型 | 风险等级 | 原因 |
|----------|----------|------|
| 明文密码 | 🔴 极高 | 泄露即导致账户被盗 |
| 信用卡号 | 🔴 极高 | PCI-DSS 合规要求 |
| 身份证号/护照号 | 🔴 极高 | 隐私法规禁止 |
| 生物识别数据 | 🔴 极高 | 不可更改的生物特征 |
| 完整银行卡信息 | 🔴 极高 | 金融监管要求 |
| 密钥/凭证 | 🔴 极高 | 二次泄露风险 |

#### 5.3.2 谨慎存储的数据

| 数据类型 | 风险等级 | 建议 |
|----------|----------|------|
| 用户邮箱 | 🟡 中 | 可存储但考虑隐私法规 |
| 手机号 | 🟡 中 | 建议脱敏或哈希处理 |
| 用户角色 | 🟡 中 | 注意权限泄露风险 |
| 会话信息 | 🟡 中 | 避免过多细节 |

#### 5.3.3 推荐存储的数据

| 数据类型 | 风险等级 | 说明 |
|----------|----------|------|
| 用户 ID (非标识符) | 🟢 低 | 如内部 UUID |
| Token 类型 | 🟢 低 | access/refresh |
| 权限范围 (Scope) | 🟢 低 | 如 `read:users` |
| 过期时间 | 🟢 低 | 标准声明 |

**正确示例：**

```javascript
// ✅ 推荐：最小化敏感信息
const payload = {
  sub: "usr_7d8f9a2b3c4e5f",  // 内部用户 ID
  scope: ["read:profile", "write:posts"],
  type: "access",
  iat: 1699000000,
  exp: 1699003600
};

// ❌ 禁止：包含敏感信息
const payload = {
  sub: "john.doe@example.com",  // 邮箱
  password: "hashed_password",   // 密码哈希
  creditCard: "4111-1111-1111-1111",  // 卡号
  ssn: "123-45-6789"  // 社保号
};
```

**数据最小化原则：**

```
只存储验证所需的最少信息，其他数据通过用户 ID 从数据库查询
```

---

### 5.4 传输层安全：HTTPS 强制要求

**核心原则：JWT 必须通过 HTTPS 传输，否则等同于明文传输**

#### 5.4.1 为什么必须使用 HTTPS

即使 JWT 有签名保护，HTTP 明文传输仍会导致：

1. **Token 窃取**：中间人可直接读取 Authorization Header
2. **重放攻击**：截获 Token 后原样转发
3. **用户关联**：通过 `sub` 字段追踪用户行为

**HTTPS 提供的保护：**

```
┌─────────────────────────────────────────────────────────┐
│  HTTP                     HTTPS                          │
│  ├─ 明文传输              ├─ TLS 加密传输                │
│  ├─ 易被窃听              ├─ 端到端加密                  │
│  └─ 无法验证服务器身份    └─ 证书验证服务器真实性        │
└─────────────────────────────────────────────────────────┘
```

#### 5.4.2 强制 HTTPS 实施策略

**服务端重定向：**

```javascript
// Node.js Express 强制 HTTPS
app.use((req, res, next) => {
  if (req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(`https://${req.hostname}${req.url}`);
  }
  next();
});
```

**Spring Boot 配置：**

```java
@Configuration
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .requiresChannel(channel -> 
                channel.anyRequest().requiresSecure())
            .csrf(csrf -> csrf.disable());
        return http.build();
    }
}
```

**HSTS (HTTP Strict Transport Security)：**

强制浏览器只通过 HTTPS 访问：

```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

| 参数 | 说明 |
|------|------|
| `max-age` | 浏览器记住 HSTS 策略的时间（秒） |
| `includeSubDomains` | 应用于所有子域名 |
| `preload` | 可加入浏览器 HSTS 预加载列表 |

---

### 5.5 常见攻击与防御

#### 5.5.1 篡改攻击

**攻击原理：**

攻击者修改 JWT Payload 中的权限信息（如将 `role: "user"` 改为 `role: "admin"`），如果服务端未正确验证签名，则攻击成功。

**防御措施：**

1. **始终验证签名**：不要信任未验证的 Token
2. **使用强密钥**：至少 256 位 (32 字节)
3. **签名验证代码示例：**

```javascript
// ✅ 正确：始终验证签名
jwt.verify(token, secret, (err, decoded) => {
  if (err) {
    // 签名验证失败，拒绝请求
    return res.status(401).send('Invalid token');
  }
  // 验证通过，使用 decoded
  req.user = decoded;
  next();
});

// ❌ 错误：跳过签名验证
const decoded = jwt.decode(token);  // 只解码，不验证！
req.user = decoded;
```

#### 5.5.2 重放攻击 (Replay Attack)

**攻击原理：**

攻击者截获合法 Token 后，在有效期内重复使用该 Token 发起请求。

**防御策略对比：**

| 方案 | 实施复杂度 | 安全性 | 适用场景 |
|------|------------|--------|----------|
| 短有效期 | 低 | 中 | 所有系统 |
| Refresh Token + 黑名单 | 中 | 高 | 高安全系统 |
| Nonce + 签名 | 高 | 极高 | 支付/金融系统 |

**方案一：短有效期（推荐基础方案）**

```javascript
// Access Token 设置为 15 分钟
const accessToken = jwt.sign(payload, secret, { expiresIn: '15m' });
```

**方案二：Refresh Token 黑名单**

```javascript
// 每次使用 Refresh Token 后将其加入黑名单
async function revokeRefreshToken(token) {
  const decoded = jwt.verify(token, refreshSecret);
  const ttl = decoded.exp - Math.floor(Date.now() / 1000);
  await redis.setex(`revoked:${decoded.jti}`, ttl, 'revoked');
}

// 验证时检查黑名单
async function isTokenRevoked(jti) {
  return await redis.exists(`revoked:${jti}`);
}
```

**方案三：Nonce + 签名验证（高安全场景）**

```javascript
// 客户端生成 Nonce 并加入签名
const nonce = crypto.randomBytes(16).toString('hex');
const timestamp = Date.now();
const signature = crypto
  .createHmac('sha256', clientSecret)
  .update(`${nonce}:${timestamp}`)
  .digest('hex');

// 服务端验证
function verifyRequest(nonce, timestamp, signature) {
  // 1. 检查时间窗口（5 分钟内）
  if (Date.now() - timestamp > 300000) {
    throw new Error('Request too old');
  }
  
  // 2. 检查 Nonce 是否已使用
  if (await redis.exists(`nonce:${nonce}`)) {
    throw new Error('Nonce already used');
  }
  
  // 3. 验证签名
  const expectedSignature = crypto
    .createHmac('sha256', clientSecret)
    .update(`${nonce}:${timestamp}`)
    .digest('hex');
  
  if (signature !== expectedSignature) {
    throw new Error('Invalid signature');
  }
  
  // 4. 记录 Nonce 防止重用
  await redis.setex(`nonce:${nonce}`, 300, 'used');
}
```

#### 5.5.3 Token 泄露

**泄露途径：**

| 途径 | 风险 | 防护措施 |
|------|------|----------|
| XSS 攻击 | 高 | 输入验证、CSP、HttpOnly Cookie |
| 中间人攻击 | 高 | 强制 HTTPS |
| 日志泄露 | 中 | 脱敏 Token 日志 |
| 浏览器扩展 | 中 | 限制扩展权限 |

**XSS 防御最佳实践：**

```javascript
// 1. 内容安全策略 (CSP)
// 响应头添加：
Content-Security-Policy: default-src 'self'; script-src 'nonce-random123'

// 2. 输出编码
function encodeHTML(str) {
  return str.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
}

// 3. 使用现代框架（自动转义）
// React/Vue 默认对插值内容进行 HTML 转义
```

#### 5.5.4 算法混淆攻击 (alg: none)

**攻击原理：**

攻击者将 Header 中的 `alg` 字段改为 `none`，并删除签名部分。如果服务端代码允许 `none` 算法或验证逻辑存在缺陷，攻击者可伪造任意 Token。

**示例攻击 Token：**

```
原始 Token:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ

攻击者修改为：
eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJzdWIiOiIxMjM0NTY3ODkwIiwiYWRtaW4iOnR1bH0.
(Header 中 alg 改为 none，删除签名部分)
```

**防御措施：**

1. **明确指定算法，拒绝 `none`**：

```javascript
// ✅ 正确：明确指定算法
jwt.verify(token, secret, { algorithms: ['HS256'] }, (err, decoded) => {
  // 如果 Token 使用其他算法（包括 none），验证直接失败
});

// ❌ 错误：不指定算法
jwt.verify(token, secret, (err, decoded) => {
  // 可能被攻击者利用
});
```

2. **Java JJWT 安全配置：**

```java
// 明确指定签名算法
Algorithm algorithm = Algorithm.HMAC256(secret);
JWTVerifier verifier = JWT.require(algorithm)
    .withIssuer("your-issuer")
    .build();

DecodedJWT jwt = verifier.verify(token);
```

3. **RSA 算法场景（推荐）：**

使用非对称加密，验证方只需公钥，即使公钥泄露也无法伪造 Token：

```javascript
// 服务端使用私钥签名
const accessToken = jwt.sign(payload, privateKey, { 
  algorithm: 'RS256' 
});

// 验证方使用公钥验证（可公开分发）
const decoded = jwt.verify(token, publicKey, { 
  algorithms: ['RS256'] 
});
```

---

### 5.6 安全检查清单

在部署 JWT 认证系统前，请确保完成以下检查：

#### 5.6.1 密钥管理检查

- [ ] 密钥存储在环境变量或 KMS 中，未硬编码
- [ ] 密钥长度符合要求（HMAC 至少 256 位，RSA 至少 2048 位）
- [ ] 已制定密钥轮换计划（周期 ≤ 90 天）
- [ ] 支持多密钥并行验证（轮换期间）
- [ ] 已制定密钥泄露应急响应流程

#### 5.6.2 过期时间检查

- [ ] Access Token 有效期 ≤ 60 分钟
- [ ] 实现 Refresh Token 机制
- [ ] Refresh Token 可撤销（黑名单机制）
- [ ] 正确设置 `exp`、`iat` 声明
- [ ] 高安全场景使用 `nbf` 延迟生效

#### 5.6.3 数据存储检查

- [ ] Payload 中无密码、卡号等敏感信息
- [ ] 遵循数据最小化原则
- [ ] 用户 ID 使用内部标识符而非邮箱/手机号

#### 5.6.4 传输安全检查

- [ ] 强制使用 HTTPS（禁用 HTTP）
- [ ] 配置 HSTS 响应头
- [ ] Token 不通过 URL 参数传递

#### 5.6.5 攻击防御检查

- [ ] 始终验证签名（不使用 `jwt.decode` 代替 `jwt.verify`）
- [ ] 明确指定允许的算法列表
- [ ] 拒绝 `alg: none` 的 Token
- [ ] 实现防重放攻击机制
- [ ] 输入验证 + CSP 防御 XSS

---

### 5.7 本章总结

本章系统讲解了 JWT 安全的五大核心领域：

1. **密钥管理**：使用 KMS 存储、定期轮换、应急响应
2. **过期时间策略**：双 Token 模式、时间声明正确使用
3. **敏感数据存储**：数据最小化、禁止存储敏感信息
4. **传输层安全**：强制 HTTPS、HSTS 配置
5. **攻击防御**：篡改、重放、泄露、算法混淆攻击的识别与防御

**关键 takeaway：**
- JWT 签名≠加密，Payload 可被任何人解码
- 短有效期 + Refresh Token 是平衡安全与体验的最佳实践
- 始终明确指定算法，拒绝 `none` 算法
- 密钥轮换不是可选项，而是必选项

---

**引用来源：**

1. OWASP JWT Security Cheat Sheet (2024): https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html
2. RFC 7519 - JSON Web Token (JWT): https://tools.ietf.org/html/rfc7519
3. Auth0 JWT Handbook: https://auth0.com/resources/ebooks/jwt-handbook
4. NIST SP 800-132 - Password-Based Cryptography: https://csrc.nist.gov/publications/detail/sp/800-132/final
5. CSDN: Java-JWT 密钥安全存储与轮换的 7 个最佳实践
6. CSDN: JWT 防重放攻击：5 分钟掌握核心防御策略

---

*本章字数：约 5200 字*
