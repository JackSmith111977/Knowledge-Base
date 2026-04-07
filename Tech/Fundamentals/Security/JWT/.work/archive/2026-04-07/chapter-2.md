# 第 2 章：JWT 结构解析

## 2.1 JWT 标准格式概览

### 2.1.1 三段式结构

JWT 采用统一的三段式结构，各部分通过英文句点（`.`）分隔：

```
Header.Payload.Signature
```

**完整示例**：

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

```mermaid
graph LR
    subgraph JWT[JWT Token]
        H[Header<br/>eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9]
        P[Payload<br/>eyJzdWIiOiIxMjM0NTY3ODkwIiwi...]
        S[Signature<br/>SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c]
    end
    
    H -->|Base64URL 编码 | H1[{"alg":"HS256","typ":"JWT"}]
    P -->|Base64URL 编码 | P1[{"sub":"1234567890","name":"John Doe",...}]
    S -->|HMACSHA256 签名 | S1[HMACSHA256(encodedHeader + "." + encodedPayload, secret)]
    
    style JWT fill:#4A90D9,color:#fff
    style H fill:#5CB85C,color:#fff
    style P fill:#5CB85C,color:#fff
    style S fill:#D9534F,color:#fff
```

### 2.1.2 编码与传输

| 部分 | 编码方式 | 是否可逆 | 是否加密 |
|------|----------|----------|----------|
| **Header** | Base64URL | ✅ 可解码 | ❌ 明文 |
| **Payload** | Base64URL | ✅ 可解码 | ❌ 明文 |
| **Signature** | Base64URL | ❌ 不可逆 | ✅ 签名保护 |

**重要安全提示**：

> JWT 的 Header 和 Payload 仅经过 Base64URL 编码，**任何人都可以解码查看内容**。因此，**绝对禁止**在 Payload 中存储密码、信用卡号等敏感信息。如需加密，应使用 JWE（JSON Web Encryption，RFC 7516）。

---

## 2.2 Header（头部）：元数据说明

### 2.2.1 Header 结构

Header 是一个 JSON 对象，描述 JWT 的基本元数据。标准 Header 包含以下字段：

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

### 2.2.2 核心字段详解

#### 1. `alg`（Algorithm，算法）

**定义**：指定用于签名 JWT 的加密算法。

**可选值**（根据 RFC 7518 - JSON Web Algorithms）：

| 算法家族 | 算法名称 | 类型 | 密钥长度 | 安全等级 |
|----------|----------|------|----------|----------|
| **HMAC** | HS256 | 对称 | 256-bit | ✅ 推荐 |
| **HMAC** | HS384 | 对称 | 384-bit | ✅ 推荐 |
| **HMAC** | HS512 | 对称 | 512-bit | ✅ 推荐 |
| **RSA** | RS256 | 非对称 | 2048-bit+ | ✅✅ 企业级推荐 |
| **RSA** | RS384 | 非对称 | 2048-bit+ | ✅✅ 企业级推荐 |
| **RSA** | RS512 | 非对称 | 2048-bit+ | ✅✅ 企业级推荐 |
| **ECDSA** | ES256 | 非对称 | 256-bit | ✅✅ 高安全场景 |
| **ECDSA** | ES384 | 非对称 | 384-bit | ✅✅ 高安全场景 |
| **ECDSA** | ES512 | 非对称 | 521-bit | ✅✅ 高安全场景 |
| ~~none~~ | none | 无签名 | - | ❌ **禁止使用** |

**对称 vs 非对称算法对比**：

```mermaid
graph TB
    subgraph 对称加密 [HS256/HS384/HS512]
        A1[签发方] -->|使用密钥 K 签名 | A2[JWT Token]
        A3[验证方] -->|使用同一密钥 K 验证 | A2
        A1 -.共享密钥.-> A3
    end
    
    subgraph 非对称加密 [RS256/ES256 等]
        B1[签发方] -->|使用私钥 Private 签名 | B2[JWT Token]
        B3[验证方] -->|使用公钥 Public 验证 | B2
        B1 -.公钥可公开.-> B3
    end
    
    style 对称加密 fill:#F0AD4E,color:#fff
    style 非对称加密 fill:#5CB85C,color:#fff
```

| 对比维度 | HS256（对称） | RS256（非对称） |
|----------|---------------|-----------------|
| **密钥管理** | 双方共享同一密钥 | 私钥签名，公钥验证 |
| **安全性** | 密钥泄露风险高 | 私钥可严格保密 |
| **适用场景** | 内部系统、单服务 | 微服务、多客户端 |
| **性能** | 较快 | 稍慢（但可接受） |
| **推荐度** | 开发/测试环境 | ✅ 生产环境推荐 |

#### 2. `typ`（Type，类型）

**定义**：指定令牌的媒体类型（Media Type）。

**常见值**：

| 值 | 含义 | 使用场景 |
|----|------|----------|
| `JWT` | 标准 JWT 令牌 | 默认值，最常用 |
| `JWS` | JSON Web Signature | 明确标识为签名令牌 |
| `N/A` | 省略 | 部分实现允许省略 |

**完整 Header 示例**：

```json
{
  "alg": "RS256",
  "typ": "JWT"
}
```

### 2.2.3 可选扩展字段

根据 RFC 7515，Header 还支持以下可选字段：

| 字段 | 名称 | 描述 |
|------|------|------|
| `kid` | Key ID | 密钥标识符，用于多密钥场景快速定位 |
| `cty` | Content Type | 内容类型，嵌套 JWT 时使用 |
| `crit` | Critical | 关键扩展列表，指示必须处理的扩展 |
| `jku` | JWK Set URL | JWK 集合的 URL |
| `jwk` | JSON Web Key | 内联 JWK 密钥 |
| `x5u` | X.509 URL | X.509 证书链 URL |
| `x5c` | X.509 Certificate | 内联 X.509 证书链 |
| `x5t` | X.509 Thumbprint | X.509 证书 SHA-1 指纹 |

**`kid` 字段使用示例**：

```json
{
  "alg": "RS256",
  "typ": "JWT",
  "kid": "key-2024-01"
}
```

**应用场景**：当授权服务器轮转密钥时，资源服务器可通过 `kid` 快速选择正确的公钥进行验证。

### 2.2.4 Header 编码过程

```mermaid
flowchart TD
    A[JSON 对象<br>{"alg":"HS256","typ":"JWT"}] --> B[UTF-8 字节数组]
    B --> C[标准 Base64 编码]
    C --> D[Base64URL 转换]
    D -->|替换 + 为 - | E[替换 / 为 _]
    E -->|去除 = 填充 | F[最终 Header 字符串]
    
    style A fill:#4A90D9,color:#fff
    style F fill:#5CB85C,color:#fff
```

**编码示例**：

```javascript
// 原始 JSON
const header = { "alg": "HS256", "typ": "JWT" };

// JSON 序列化
const jsonString = '{"alg":"HS256","typ":"JWT"}';

// Base64URL 编码
const base64Url = base64UrlEncode(jsonString);
// 结果："eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
```

---

## 2.3 Payload（负载）：数据载体

### 2.3.1 Payload 结构

Payload 是一个 JSON 对象，包含需要传输的**声明（Claims）**。声明是关于实体（通常是用户）和其他数据的陈述。

**示例**：

```json
{
  "sub": "1234567890",
  "name": "John Doe",
  "iat": 1516239022,
  "exp": 1516242622
}
```

### 2.3.2 三种声明类型

根据 RFC 7519，Payload 中的声明分为三类：

```mermaid
mindmap
  root((JWT Claims))
    Registered<br/>注册声明
      iss 签发者
      sub 主题
      aud 受众
      exp 过期时间
      nbf 生效时间
      iat 签发时间
      jti JWT ID
    Public<br/>公共声明
      自定义字段
      需使用 IANA 注册
      或添加唯一前缀
    Private<br/>私有声明
      双方约定字段
      内部业务数据
      如 user_id, role
```

#### 1. 注册声明（Registered Claims）

**定义**：RFC 7519 预定义的标准声明集，提供基本的身份和有效性信息。这些声明是**可选的**，但推荐使用以增强互操作性。

| 字段 | 全称 | 类型 | 描述 | 示例 |
|------|------|------|------|------|
| `iss` | Issuer | String | 签发者标识 | `"iss": "https://auth.example.com"` |
| `sub` | Subject | String | 主题（通常是用户 ID） | `"sub": "1234567890"` |
| `aud` | Audience | String/String[] | 受众（目标服务） | `"aud": "https://api.example.com"` |
| `exp` | Expiration Time | NumericDate | 过期时间（Unix 时间戳） | `"exp": 1516242622` |
| `nbf` | Not Before | NumericDate | 生效时间（在此之前不可用） | `"nbf": 1516239022` |
| `iat` | Issued At | NumericDate | 签发时间 | `"iat": 1516239022` |
| `jti` | JWT ID | String | JWT 唯一标识符（防重放） | `"jti": "uuid-12345-67890"` |

**时间戳格式说明**：

`exp`、`nbf`、`iat` 等时间字段必须使用 **NumericDate** 格式，即自 Unix 纪元（1970-01-01T00:00:00Z）以来的秒数：

```javascript
// 当前时间戳（秒）
const now = Math.floor(Date.now() / 1000);

// 1 小时后过期
const exp = now + 3600;

// 生成 Payload
const payload = {
  sub: "user-123",
  iat: now,
  exp: exp
};
```

**`aud` 字段验证示例**：

当 JWT 用于多服务架构时，`aud` 字段确保令牌只能被特定服务使用：

```javascript
// Token 中的 aud
{
  "aud": ["https://api.example.com", "https://service.example.com"]
}

// 验证逻辑
const targetAudience = "https://api.example.com";
if (!payload.aud.includes(targetAudience)) {
  throw new Error("Invalid audience");
}
```

#### 2. 公共声明（Public Claims）

**定义**：由开发者自定义的声明，但为了避免命名冲突，应遵循以下规则之一：

1. **使用 IANA 注册的名称**：在 [IANA JWT Claims Registry](https://www.iana.org/assignments/jwt/jwt.xhtml) 中注册的名称
2. **使用防碰撞命名**：包含唯一标识符（如反向域名、UUID 前缀）

**示例**：

```json
{
  "sub": "1234567890",
  "email": "john.doe@example.com",
  "com.example.department": "Engineering",
  "org openid.name": "John Doe"
}
```

**推荐实践**：

- 优先使用已有标准（如 OIDC 定义的 `name`、`email`、`picture` 等）
- 自定义字段添加组织前缀，如 `com.companyname.field`

#### 3. 私有声明（Private Claims）

**定义**：在通信双方之间约定的自定义字段，用于交换业务特定信息。这些声明不使用标准化名称，也不在公共注册表中注册。

**示例**：

```json
{
  "sub": "user-123",
  "user_id": 12345,
  "username": "johndoe",
  "role": "admin",
  "permissions": ["read", "write", "delete"],
  "tenant_id": "tenant-abc"
}
```

**注意事项**：

- ⚠️ **不要存储敏感信息**：Payload 是明文，任何拿到 Token 的人都可以解码
- ⚠️ **控制 Payload 大小**：过大的 Payload 会增加带宽消耗（每次请求都携带）
- ✅ **推荐存储**：用户 ID、角色、权限范围、租户 ID 等非敏感业务标识

### 2.3.3 Payload 设计最佳实践

#### ✅ 推荐做法

```json
{
  "sub": "user-12345",
  "iss": "https://auth.myapp.com",
  "aud": "https://api.myapp.com",
  "iat": 1712500000,
  "exp": 1712503600,
  "scope": "read write",
  "role": "user",
  "tenant_id": "tenant-abc"
}
```

#### ❌ 不推荐做法

```json
{
  "password": "mysecretpassword",
  "credit_card": "4111-1111-1111-1111",
  "ssn": "123-45-6789",
  "secret_key": "sk_live_xxxxx"
}
```

---

## 2.4 Signature（签名）：防篡改机制

### 2.4.1 签名公式

JWT 签名的核心思想是：**使用密钥对 Header 和 Payload 的组合进行加密运算，生成唯一标识**。

**通用签名公式**：

```
Signature = Algorithm(
  Base64UrlEncode(Header) + "." + Base64UrlEncode(Payload),
  SecretKey
)
```

### 2.4.2 对称加密签名（HS256）

**HS256** 使用 HMAC-SHA256 算法，对称加密（签发和验证使用同一密钥）。

```mermaid
flowchart LR
    H[Header<br/>Base64URL 编码] --> C[拼接]
    P[Payload<br/>Base64URL 编码] --> C
    C -->|Header.Payload | S[HMAC-SHA256<br/>签名计算]
    K[密钥 Secret<br/>256-bit+] --> S
    S --> B[Base64URL 编码]
    B --> Result[Signature]
    
    style K fill:#D9534F,color:#fff
    style Result fill:#5CB85C,color:#fff
```

**代码示例**：

```javascript
// 签名生成
const header = { "alg": "HS256", "typ": "JWT" };
const payload = { "sub": "1234567890", "name": "John Doe" };

const encodedHeader = base64UrlEncode(JSON.stringify(header));
const encodedPayload = base64UrlEncode(JSON.stringify(payload));

const signingInput = encodedHeader + "." + encodedPayload;
const signature = HMACSHA256(signingInput, "your-secret-key");
const encodedSignature = base64UrlEncode(signature);

const jwt = encodedHeader + "." + encodedPayload + "." + encodedSignature;
```

**验证流程**：

```javascript
// 验证签名
function verifySignature(jwt, secret) {
  const [encodedHeader, encodedPayload, signature] = jwt.split(".");
  const signingInput = encodedHeader + "." + encodedPayload;
  
  // 重新计算签名
  const expectedSignature = HMACSHA256(signingInput, secret);
  const encodedExpected = base64UrlEncode(expectedSignature);
  
  // 比较签名
  return encodedExpected === signature;
}
```

### 2.4.3 非对称加密签名（RS256）

**RS256** 使用 RSA-SHA256 算法，非对称加密（私钥签名，公钥验证）。

```mermaid
flowchart TB
    subgraph 签发方 [授权服务器]
      H1[Header + Payload] --> S1[RSA-SHA256 签名]
      K1[私钥 Private Key] --> S1
      S1 --> JWT1[JWT Token]
    end
    
    subgraph 验证方 [资源服务器]
      JWT2[JWT Token] --> V[验证签名]
      K2[公钥 Public Key] --> V
      V --> Result{验证结果}
    end
    
    JWT1 --> JWT2
    
    style 签发方 fill:#4A90D9,color:#fff
    style 验证方 fill:#5CB85C,color:#fff
    style K1 fill:#D9534F,color:#fff
    style K2 fill:#F0AD4E,color:#fff
```

**代码示例（Node.js）**：

```javascript
const jwt = require('jsonwebtoken');
const fs = require('fs');

// 签发（使用私钥）
const privateKey = fs.readFileSync('private.key', 'utf8');
const token = jwt.sign(
  { sub: "user-123", name: "John Doe" },
  privateKey,
  { algorithm: 'RS256', expiresIn: '1h' }
);

// 验证（使用公钥）
const publicKey = fs.readFileSync('public.key', 'utf8');
const decoded = jwt.verify(token, publicKey);
```

### 2.4.4 签名验证流程

完整的 JWT 验证流程包括以下步骤：

```mermaid
flowchart TD
    Start[收到 JWT Token] --> Split[按 . 分割为三部分]
    Split --> CheckLen{是否 3 部分？}
    CheckLen -->|否 | Fail1[❌ 验证失败]
    CheckLen -->|是 | DecodeH[解码 Header]
    
    DecodeH --> CheckAlg{算法是否合法？}
    CheckAlg -->|none/未知 | Fail2[❌ 验证失败]
    CheckAlg -->|合法 | DecodeP[解码 Payload]
    
    DecodeP --> CheckExp{检查 exp 字段}
    CheckExp -->|已过期 | Fail3[❌ Token 过期]
    CheckExp -->|未过期 | CheckNbf{检查 nbf 字段}
    
    CheckNbf -->|未生效 | Fail4[❌ Token 未生效]
    CheckNbf -->|已生效 | Recompute[重新计算签名]
    
    Recompute --> Compare{签名是否匹配？}
    Compare -->|不匹配 | Fail5[❌ 签名无效]
    Compare -->|匹配 | CheckAud{检查 aud 字段}
    
    CheckAud -->|不匹配 | Fail6[❌ 受众不符]
    CheckAud -->|匹配 | CheckIss{检查 iss 字段}
    
    CheckIss -->|不匹配 | Fail7[❌ 签发者不符]
    CheckIss -->|匹配 | Success[✅ 验证通过]
    
    style Success fill:#5CB85C,color:#fff
    style Fail1 fill:#D9534F,color:#fff
    style Fail2 fill:#D9534F,color:#fff
    style Fail3 fill:#D9534F,color:#fff
    style Fail4 fill:#D9534F,color:#fff
    style Fail5 fill:#D9534F,color:#fff
    style Fail6 fill:#D9534F,color:#fff
    style Fail7 fill:#D9534F,color:#fff
```

### 2.4.5 常见签名攻击与防护

#### 1. none 算法攻击

**攻击原理**：将 Header 中的 `alg` 改为 `none`，并移除签名部分，构造无签名的伪造 Token。

```javascript
// 原始 Token
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.signature

// 攻击者篡改
eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJzdWIiOiIxMjM0NTY3ODkwIn0.
```

**防护措施**：

```javascript
// 明确指定允许的算法
jwt.verify(token, secret, { algorithms: ['HS256', 'RS256'] });

// 拒绝 none 算法
if (header.alg === 'none') {
  throw new Error('None algorithm is not allowed');
}
```

#### 2. 密钥混淆攻击

**攻击原理**：当服务端同时支持 HS256 和 RS256 时，攻击者使用 HS256 算法和**公钥**作为密钥进行签名。由于部分实现会用公钥同时验证两种算法，导致绕过验证。

**防护措施**：

- 严格区分对称和非对称算法的验证逻辑
- 根据 `kid` 字段预先确定算法类型
- 禁止使用公钥作为 HS256 密钥

#### 3. 签名重放攻击

**攻击原理**：攻击者截获有效 Token 后重复使用。

**防护措施**：

- 设置较短的 `exp` 过期时间（如 15 分钟）
- 使用 `jti` 字段 + 服务端黑名单机制
- 配合 Refresh Token 实现令牌轮转

---

## 2.5 Base64URL 编码原理

### 2.5.1 为什么需要 Base64URL？

JWT 需要在 URL、HTTP 头、Cookie 等场景中传输，标准 Base64 编码存在以下问题：

| 字符 | Base64 | URL 安全问题 |
|------|--------|--------------|
| `+` | 合法字符 | 在 URL 中会被解释为空格 |
| `/` | 合法字符 | 在 URL 中是路径分隔符 |
| `=` | 填充字符 | 在 URL 参数中可能有特殊含义 |

**解决方案**：Base64URL 是 Base64 的 URL 安全变体，替换了特殊字符并去除填充。

### 2.5.2 Base64 编码回顾

**Base64 编码原理**：

1. 将输入数据按 3 字节（24 位）分组
2. 每组分为 4 个 6 位单元
3. 每个 6 位单元映射到 Base64 字符集（64 个字符）
4. 不足 3 字节时用 `=` 填充

**Base64 字符集**（64 个字符）：

```
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/
```

### 2.5.3 Base64URL 转换规则

Base64URL 在 Base64 基础上进行三步转换：

```mermaid
flowchart LR
    A[标准 Base64 字符串] --> B[步骤 1<br/>替换 + 为 -]
    B --> C[步骤 2<br/>替换 / 为 _]
    C --> D[步骤 3<br/>去除 = 填充]
    D --> E[Base64URL 字符串]
    
    style A fill:#4A90D9,color:#fff
    style E fill:#5CB85C,color:#fff
```

**转换对照表**：

| 操作 | Base64 | Base64URL |
|------|--------|-----------|
| 字符替换 1 | `+` | `-` |
| 字符替换 2 | `/` | `_` |
| 填充字符 | `=` 保留 | `=` 去除 |

**Base64URL 字符集**：

```
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_
```

### 2.5.4 编码示例对比

**原始 JSON**：

```json
{"alg":"HS256","typ":"JWT"}
```

**UTF-8 字节数组**（十六进制）：

```
7b 22 61 6c 67 22 3a 22 48 53 32 35 36 22 2c 22 74 79 70 22 3a 22 4a 57 54 22 7d
```

**标准 Base64 编码**：

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
```

**Base64URL 编码**（本例相同，因为不包含 `+`、`/`、`=`）：

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
```

**包含特殊字符的示例**：

```javascript
// 假设 Base64 结果包含特殊字符
const base64 = "SGVsbG8gV29ybGQ+Pz4/Pw==";  // 包含 + 和 =

// 转换为 Base64URL
const base64url = base64
  .replace(/\+/g, '-')    // + → -
  .replace(/\//g, '_')    // / → _
  .replace(/=+$/, '');    // 去除末尾的 =

// 结果："SGVsbG8gV29ybGQ-Pz8_Pw"
```

### 2.5.5 代码实现

#### JavaScript 实现

```javascript
// 字符串 → Base64URL
function base64UrlEncode(str) {
  return btoa(str)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

// Base64URL → 字符串
function base64UrlDecode(str) {
  // 恢复填充
  let padding = '='.repeat((4 - str.length % 4) % 4);
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  return atob(str + padding);
}

// 使用示例
const header = '{"alg":"HS256","typ":"JWT"}';
const encoded = base64UrlEncode(header);
console.log(encoded);  // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9

const decoded = base64UrlDecode(encoded);
console.log(decoded);  // {"alg":"HS256","typ":"JWT"}
```

#### Node.js Buffer 实现

```javascript
// 更安全的实现（支持 Unicode）
function base64UrlEncode(str) {
  return Buffer.from(str, 'utf8')
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function base64UrlDecode(str) {
  let padding = '='.repeat((4 - str.length % 4) % 4);
  return Buffer
    .from(str.replace(/-/g, '+').replace(/_/g, '/') + padding, 'base64')
    .toString('utf8');
}
```

### 2.5.6 Base64URL 特性总结

| 特性 | 描述 |
|------|------|
| **URL 安全** | 不包含 URL 特殊字符（`+`、`/`、`=`） |
| **可逆编码** | 不是加密，可轻松解码还原 |
| **无填充** | 去除了 `=` 填充字符，长度可能不是 4 的倍数 |
| **字符集** | A-Z、a-z、0-9、`-`、`_`（共 64 个字符） |
| **长度增长** | 编码后长度约为原数据的 133%（4/3 倍） |

---

## 2.6 JWT 结构完整性视图

```mermaid
graph TB
    subgraph JWT[JWT 完整结构]
        direction TB
        
        subgraph Header_Sec[Header 部分]
            H1[{"alg":"HS256","typ":"JWT"}]
            H2[Base64URL 编码]
            H3[eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9]
        end
        
        subgraph Payload_Sec[Payload 部分]
            P1[{"sub":"123","name":"John","exp":1234567890}]
            P2[Base64URL 编码]
            P3[eyJzdWIiOiIxMjMiLCJuYW1lIjoiSm9obiIsImV4cCI6MTIzNDU2Nzg5MH0]
        end
        
        subgraph Signature_Sec[Signature 部分]
            S1[HMACSHA256(H3 + "." + P3, secret)]
            S2[Base64URL 编码]
            S3[SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c]
        end
    end
    
    H3 -->|拼接 | Join1[H3.P3]
    P3 --> Join1
    Join1 --> S1
    
    H2 --> H3
    P2 --> P3
    S2 --> S3
    
    style JWT fill:#4A90D9,color:#fff
    style Header_Sec fill:#5CB85C,color:#fff
    style Payload_Sec fill:#5CB85C,color:#fff
    style Signature_Sec fill:#D9534F,color:#fff
```

**最终 JWT 格式**：

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjMiLCJuYW1lIjoiSm9obiIsImV4cCI6MTIzNDU2Nzg5MH0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
     ↓                                            ↓                                              ↓
  Header (元数据)                            Payload (声明)                                  Signature (签名)
  alg, typ                                  sub, name, exp                               防篡改验证
```

---

## 2.7 本章小结

### 核心要点回顾

1. **三段式结构**：JWT = Header.Payload.Signature，各部分通过 Base64URL 编码
2. **Header 字段**：`alg` 指定签名算法，`typ` 指定令牌类型，`kid` 用于多密钥场景
3. **Payload 声明**：分为注册声明（iss/sub/aud/exp 等）、公共声明（需防碰撞命名）、私有声明（双方约定）
4. **签名机制**：HS256 使用对称密钥，RS256 使用非对称密钥对，签名公式为 `Algorithm(encodedHeader + "." + encodedPayload, key)`
5. **Base64URL 编码**：替换 `+`→`-`、`/`→`_`，去除 `=` 填充，确保 URL 安全传输

### 安全注意事项

| ⚠️ 禁止事项 | ✅ 推荐做法 |
|------------|------------|
| 在 Payload 存储密码、信用卡号等敏感信息 | 仅存储非敏感标识（用户 ID、角色等） |
| 使用 `none` 算法或弱算法 | 使用 HS256 或 RS256，明确指定允许算法白名单 |
| 不验证 `exp`、`aud`、`iss` 字段 | 完整验证所有标准声明 |
| 硬编码密钥在源码中 | 使用环境变量或密钥管理服务 |
| 设置过长的过期时间 | Access Token 设置 15-60 分钟，配合 Refresh Token |

### 关键引用来源

1. **RFC 7519** - JSON Web Token (JWT)：https://www.rfc-editor.org/rfc/rfc7519
2. **RFC 7515** - JSON Web Signature (JWS)：https://www.rfc-editor.org/rfc/rfc7515
3. **RFC 7518** - JSON Web Algorithms (JWA)：https://www.rfc-editor.org/rfc/rfc7518
4. **RFC 8725** - JSON Web Token (JWT) 安全最佳实践：https://www.rfc-editor.org/rfc/rfc8725
5. **jwt.io** - JWT 调试工具与文档：https://jwt.io

### 下一章预告

第 3 章将深入探讨 JWT 的实战应用，包括：
- JWT 生成与验证的完整代码实现
- Refresh Token 机制与会话管理
- JWT 在微服务架构中的最佳实践
- 常见安全漏洞与防护措施

---

*文档版本：1.0*  
*最后更新：2026-04-07*  
*字数统计：约 6,800 字*
