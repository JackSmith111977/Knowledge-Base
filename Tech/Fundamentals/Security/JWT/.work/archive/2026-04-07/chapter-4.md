# 第 4 章：JWT 签名算法

## 4.1 签名算法概述

### 4.1.1 签名算法的核心作用

JWT 签名是令牌安全性的基石，承担以下关键职责：

**1. 完整性保护（Integrity）**
- 确保 JWT 在传输过程中未被篡改
- 任何对 Header 或 Payload 的修改都会导致签名验证失败

**2. 身份认证（Authentication）**
- 验证 Token 确实由可信的签发方生成
- 防止伪造 Token 攻击

**3. 不可否认性（Non-repudiation）**
- 签发方无法否认其签发的 Token（非对称签名场景）

```mermaid
graph TB
    A[JWT 签名] --> B[完整性保护]
    A --> C[身份认证]
    A --> D[不可否认性]
    
    B --> B1[防止数据篡改]
    C --> C1[验证签发者身份]
    D --> D1[私钥签名无法抵赖]
    
    style A fill:#4A90D9,color:#fff
    style B fill:#5CB85C,color:#fff
    style C fill:#5CB85C,color:#fff
    style D fill:#5CB85C,color:#fff
```

### 4.1.2 JWT 签名算法分类

根据 RFC 7518（JSON Web Algorithms），JWT 支持以下算法家族：

| 算法家族 | 算法名称 | 类型 | RFC 章节 |
|----------|----------|------|----------|
| **HMAC** | HS256, HS384, HS512 | 对称加密 | Section 3 |
| **RSA** | RS256, RS384, RS512 | 非对称加密 | Section 3 |
| **RSA-PSS** | PS256, PS384, PS512 | 非对称加密 | Section 3 |
| **ECDSA** | ES256, ES384, ES512 | 非对称加密 | Section 3 |
| **EdDSA** | Ed25519, Ed448 | 非对称加密 | RFC 8037 |
| **None** | none | 无签名 | - |

### 4.1.3 算法命名规则

JWT 算法命名遵循统一规则：

```
算法前缀 + 哈希长度
├── H：HMAC
├── R：RSA PKCS#1 v1.5
├── P：RSA-PSS
├── E：ECDSA
├── Ed：EdDSA
└── 数字：SHA 哈希位数（256/384/512）
```

**示例**：
- `HS256` = HMAC + SHA-256
- `RS256` = RSA PKCS#1 v1.5 + SHA-256
- `ES256` = ECDSA + P-256 曲线 + SHA-256
- `Ed25519` = EdDSA + Curve25519

---

## 4.2 HMAC SHA256（HS256）：对称签名

### 4.2.1 算法原理

**HMAC（Hash-based Message Authentication Code）** 是一种基于哈希函数和共享密钥的消息认证码算法。

**HMAC 计算公式**：

```
HMAC(K, M) = H((K' ⊕ opad) || H((K' ⊕ ipad) || M))

其中：
- K：原始密钥
- K'：处理后的密钥（长度 = block size）
- M：消息（JWT 的 Header.Payload）
- H：哈希函数（SHA-256）
- opad：0x5c 重复 64 次
- ipad：0x36 重复 64 次
- ⊕：异或运算
- ||：拼接
```

```mermaid
flowchart LR
    K[密钥 K] --> KP[密钥处理]
    KP --> K1[K' 补零/哈希至 64 字节]
    
    M[消息 M<br/>Header.Payload] --> H1[第一轮哈希]
    K1 --> XOR1[⊕ ipad]
    XOR1 --> H1
    
    H1 --> H2[第二轮哈希]
    K1 --> XOR2[⊕ opad]
    XOR2 --> H2
    
    H2 --> Result[HMAC 签名]
    
    style K fill:#D9534F,color:#fff
    style Result fill:#5CB85C,color:#fff
```

### 4.2.2 HS256 签名流程

**签名生成**：

```javascript
// 1. 构建 signing input
const header = { alg: 'HS256', typ: 'JWT' };
const payload = { sub: '1234567890', name: 'John Doe' };

const encodedHeader = base64UrlEncode(JSON.stringify(header));
const encodedPayload = base64UrlEncode(JSON.stringify(payload));

const signingInput = `${encodedHeader}.${encodedPayload}`;

// 2. 使用 HMAC-SHA256 计算签名
const crypto = require('crypto');
const secret = 'your-256-bit-secret';

const signature = crypto
  .createHmac('sha256', secret)
  .update(signingInput)
  .digest('base64url');

// 3. 拼接 JWT
const jwt = `${encodedHeader}.${encodedPayload}.${signature}`;
```

**签名验证**：

```javascript
function verifyHS256(token, secret) {
  const [encodedHeader, encodedPayload, signature] = token.split('.');
  const signingInput = `${encodedHeader}.${encodedPayload}`;
  
  // 重新计算签名
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(signingInput)
    .digest('base64url');
  
  // 常量时间比较（防止时序攻击）
  return crypto.timingSafeEqual(
    Buffer.from(signature, 'base64url'),
    Buffer.from(expectedSignature, 'base64url')
  );
}
```

### 4.2.3 Java 实现

```java
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

public class HS256Signer {
    
    private static final String ALGORITHM = "HmacSHA256";
    private final SecretKeySpec secretKey;
    
    public HS256Signer(String secret) {
        this.secretKey = new SecretKeySpec(
            secret.getBytes(StandardCharsets.UTF_8),
            ALGORITHM
        );
    }
    
    // 生成签名
    public String sign(String header, String payload) throws Exception {
        String signingInput = base64UrlEncode(header) + "." + base64UrlEncode(payload);
        
        Mac mac = Mac.getInstance(ALGORITHM);
        mac.init(secretKey);
        byte[] signatureBytes = mac.doFinal(signingInput.getBytes(StandardCharsets.UTF_8));
        
        return base64UrlEncode(signatureBytes);
    }
    
    // 验证签名
    public boolean verify(String token, String expectedSignature) throws Exception {
        String[] parts = token.split("\\.");
        String signingInput = parts[0] + "." + parts[1];
        
        Mac mac = Mac.getInstance(ALGORITHM);
        mac.init(secretKey);
        byte[] expectedSignatureBytes = mac.doFinal(signingInput.getBytes(StandardCharsets.UTF_8));
        
        return java.util.Arrays.equals(
            Base64.getUrlDecoder().decode(expectedSignature),
            expectedSignatureBytes
        );
    }
    
    private String base64UrlEncode(byte[] data) {
        return Base64.getUrlEncoder().withoutPadding().encodeToString(data);
    }
}
```

### 4.2.4 HS256 优缺点分析

| 优点 | 缺点 |
|------|------|
| ✅ 计算速度快 | ❌ 密钥需共享（泄露风险高） |
| ✅ 实现简单 | ❌ 不适合分布式/多服务场景 |
| ✅ 密钥长度短（256-bit） | ❌ 无法实现不可否认性 |
| ✅ 兼容性好（所有库支持） | ❌ 密钥轮换复杂 |

### 4.2.5 适用场景

**✅ 推荐场景**：
- 单服务器架构
- 内部系统通信（封闭环境）
- 性能敏感场景
- 密钥管理可控的环境

**❌ 不推荐场景**：
- 微服务架构（多服务需共享密钥）
- 第三方集成（无法安全分发密钥）
- 需要不可否认性的场景
- 高安全需求系统

---

## 4.3 RSA（RS256/RS384/RS512）：非对称签名

### 4.3.1 算法原理

**RSA（Rivest-Shamir-Adleman）** 是一种非对称加密算法，使用公钥/私钥对进行签名和验证。

**RS256 签名流程**：

```mermaid
flowchart TB
    subgraph 签名方 [授权服务器]
        M[消息<br/>Header.Payload] --> H[SHA-256 哈希]
        H --> PKCS[PKCS#1 v1.5 填充]
        PKCS --> Encrypt[RSA 私钥加密]
        PrivKey[私钥 Private Key] --> Encrypt
        Encrypt --> Sig[签名 Signature]
    end
    
    subgraph 验证方 [资源服务器]
        Sig --> Decrypt[RSA 公钥解密]
        PubKey[公钥 Public Key] --> Decrypt
        Decrypt --> VerifyPKCS[验证 PKCS#1 填充]
        VerifyPKCS --> CompareHash[比较哈希值]
        M2[消息<br/>Header.Payload] --> H2[SHA-256 哈希]
        H2 --> CompareHash
        CompareHash --> Result{匹配？}
    end
    
    style 签名方 fill:#4A90D9,color:#fff
    style 验证方 fill:#5CB85C,color:#fff
    style PrivKey fill:#D9534F,color:#fff
    style PubKey fill:#F0AD4E,color:#fff
    style Result fill:#5CB85C,color:#fff
```

**数学原理**：

```
签名：S = (H(M)^d) mod n
验证：H(M) == (S^e) mod n

其中：
- M：消息（Header.Payload）
- H：哈希函数（SHA-256）
- d：私钥指数
- e：公钥指数
- n：RSA 模数（大素数乘积）
```

### 4.3.2 RSA 密钥生成

**OpenSSL 生成密钥对**：

```bash
# 1. 生成 RSA 私钥（2048 位）
openssl genrsa -out private.pem 2048

# 2. 提取公钥
openssl rsa -in private.pem -pubout -out public.pem

# 3. 查看私钥内容（PEM 格式）
cat private.pem
# -----BEGIN RSA PRIVATE KEY-----
# MIIEowIBAAKCAQEA...
# -----END RSA PRIVATE KEY-----

# 4. 查看公钥内容
cat public.pem
# -----BEGIN PUBLIC KEY-----
# MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8A...
# -----END PUBLIC KEY-----
```

**密钥长度建议**：

| 密钥长度 | 安全等级 | 性能 | 推荐度 |
|----------|----------|------|--------|
| 1024-bit | ⚠️ 已不安全 | 快 | ❌ 禁止使用 |
| 2048-bit | ✅ 安全 | 中等 | ✅ 推荐 |
| 3072-bit | ✅✅ 高安全 | 较慢 | ✅ 推荐（高安全场景） |
| 4096-bit | ✅✅ 极高安全 | 慢 | ⚠️ 仅特殊场景 |

### 4.3.3 Node.js 实现

```javascript
const jwt = require('jsonwebtoken');
const fs = require('fs');
const crypto = require('crypto');

// 1. 生成 RSA 密钥对（可选，生产环境应预先生成）
const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem',
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem',
  },
});

// 保存密钥对
fs.writeFileSync('private.pem', privateKey);
fs.writeFileSync('public.pem', publicKey);

// 2. 签发 JWT（使用私钥）
const payload = {
  sub: 'user-123',
  name: 'John Doe',
  role: 'admin',
};

const token = jwt.sign(payload, privateKey, {
  algorithm: 'RS256',
  expiresIn: '1h',
  issuer: 'https://auth.example.com',
  audience: 'https://api.example.com',
  keyid: 'key-2024-01',  // 密钥 ID（用于多密钥场景）
});

console.log('生成的 JWT:', token);

// 3. 验证 JWT（使用公钥）
try {
  const decoded = jwt.verify(token, publicKey, {
    algorithms: ['RS256'],
    issuer: 'https://auth.example.com',
    audience: 'https://api.example.com',
  });
  console.log('验证通过:', decoded);
} catch (error) {
  console.error('验证失败:', error.message);
}
```

### 4.3.4 Java 实现

```java
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import java.security.*;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;
import java.util.Date;

public class RS256JwtExample {
    
    private final PrivateKey privateKey;
    private final PublicKey publicKey;
    
    public RS256JwtExample() throws Exception {
        // 1. 生成密钥对（生产环境应从文件/密钥管理服务加载）
        KeyPairGenerator keyGen = KeyPairGenerator.getInstance("RSA");
        keyGen.initialize(2048);
        KeyPair keyPair = keyGen.generateKeyPair();
        
        this.privateKey = keyPair.getPrivate();
        this.publicKey = keyPair.getPublic();
    }
    
    // 从 PEM 文件加载私钥
    public static PrivateKey loadPrivateKey(String filename) throws Exception {
        String pem = new String(Files.readAllBytes(Paths.get(filename)));
        String privateKeyPEM = pem
            .replace("-----BEGIN PRIVATE KEY-----", "")
            .replace("-----END PRIVATE KEY-----", "")
            .replaceAll("\\s", "");
        
        byte[] encoded = Base64.getDecoder().decode(privateKeyPEM);
        KeyFactory factory = KeyFactory.getInstance("RSA");
        return factory.generatePrivate(new PKCS8EncodedKeySpec(encoded));
    }
    
    // 从 PEM 文件加载公钥
    public static PublicKey loadPublicKey(String filename) throws Exception {
        String pem = new String(Files.readAllBytes(Paths.get(filename)));
        String publicKeyPEM = pem
            .replace("-----BEGIN PUBLIC KEY-----", "")
            .replace("-----END PUBLIC KEY-----", "")
            .replaceAll("\\s", "");
        
        byte[] encoded = Base64.getDecoder().decode(publicKeyPEM);
        KeyFactory factory = KeyFactory.getInstance("RSA");
        return factory.generatePublic(new X509EncodedKeySpec(encoded));
    }
    
    // 签发 JWT
    public String generateToken(String userId, String username) {
        long now = System.currentTimeMillis();
        
        return Jwts.builder()
            .setHeaderParam("alg", "RS256")
            .setHeaderParam("typ", "JWT")
            .setHeaderParam("kid", "key-2024-01")
            .setSubject(userId)
            .claim("username", username)
            .setIssuer("https://auth.example.com")
            .setAudience("https://api.example.com")
            .setIssuedAt(new Date(now))
            .setExpiration(new Date(now + 3600000))  // 1 小时
            .signWith(privateKey, SignatureAlgorithm.RS256)
            .compact();
    }
    
    // 验证 JWT
    public Claims verifyToken(String token) {
        return Jwts.parserBuilder()
            .setSigningKey(publicKey)
            .requireIssuer("https://auth.example.com")
            .requireAudience("https://api.example.com")
            .build()
            .parseClaimsJws(token)
            .getBody();
    }
}
```

### 4.3.5 RS256 vs RS384 vs RS512

| 算法 | 哈希函数 | 输出长度 | 安全性 | 性能 |
|------|----------|----------|--------|------|
| **RS256** | SHA-256 | 256-bit | ✅ 高 | ⚡ 较快 |
| **RS384** | SHA-384 | 384-bit | ✅✅ 更高 | 中等 |
| **RS512** | SHA-512 | 512-bit | ✅✅✅ 最高 | 🐌 较慢 |

**选择建议**：
- **RS256**：适用于绝大多数场景（推荐默认选择）
- **RS384/RS512**：仅在高安全需求场景使用（如金融、军事）
- 注意：SHA-384/512 在 64 位系统上性能更好

### 4.3.6 RSA 算法优缺点

| 优点 | 缺点 |
|------|------|
| ✅ 公私钥分离，密钥管理安全 | ❌ 签名速度较慢（相比 ECDSA/EdDSA） |
| ✅ 公钥可公开分发 | ❌ 签名长度较长（256 字节 @ 2048-bit） |
| ✅ 成熟可靠，广泛支持 | ❌ 密钥长度要求大（2048-bit+） |
| ✅ 支持不可否认性 | ❌ 量子计算威胁（Shor 算法） |

---

## 4.4 ECDSA（ES256/ES384/ES512）：椭圆曲线签名

### 4.4.1 算法原理

**ECDSA（Elliptic Curve Digital Signature Algorithm）** 是基于椭圆曲线密码学（ECC）的数字签名算法。

**核心优势**：
- 在相同安全强度下，密钥长度远短于 RSA
- 签名速度更快，计算资源消耗更少
- 适合资源受限环境（移动设备、IoT）

**安全强度对比**：

| ECC 密钥长度 | RSA 等效长度 | 安全强度（bit） |
|--------------|--------------|-----------------|
| 256-bit | 3072-bit | 128 |
| 384-bit | 7680-bit | 192 |
| 521-bit | 15360-bit | 256 |

```mermaid
graph LR
    subgraph ECC 优势
        A[相同安全强度] --> B[ECC 密钥更短]
        A --> C[签名速度更快]
        A --> D[资源消耗更少]
    end
    
    B --> B1[256-bit ECC ≈ 3072-bit RSA]
    C --> C1[签名快 2-3 倍]
    D --> D1[适合移动/IoT]
    
    style ECC 优势 fill:#5CB85C,color:#fff
```

### 4.4.2 椭圆曲线参数

ES256/ES384/ES512 使用不同的椭圆曲线：

| 算法 | 曲线名称 | 曲线参数 | 安全强度 |
|------|----------|----------|----------|
| **ES256** | P-256 | prime256v1 / secp256r1 | 128-bit |
| **ES384** | P-384 | secp384r1 | 192-bit |
| **ES512** | P-521 | secp521r1 | 256-bit |

**曲线选择建议**：
- **ES256（P-256）**：推荐默认选择，平衡性能与安全
- **ES384**：高安全需求场景
- **ES512**：极高安全需求（但性能开销大）

### 4.4.3 密钥生成

**OpenSSL 生成 ECDSA 密钥对**：

```bash
# 1. 生成 EC 私钥（P-256 曲线）
openssl ecparam -genkey -name prime256v1 -noout -out ec-private.pem

# 2. 提取公钥
openssl ec -in ec-private.pem -pubout -out ec-public.pem

# 3. 转换为 PKCS8 格式（Java 需要）
openssl pkcs8 -topk8 -in ec-private.pem -out pkcs8-ec-private.pem -nocrypt

# 4. 查看私钥内容
cat ec-private.pem
# -----BEGIN EC PRIVATE KEY-----
# MHcCAQEEIIBmHx7vJvCjCqj...
# -----END EC PRIVATE KEY-----

# 5. 查看公钥内容
cat ec-public.pem
# -----BEGIN PUBLIC KEY-----
# MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE...
# -----END PUBLIC KEY-----
```

### 4.4.4 ECDSA 签名流程

```mermaid
flowchart TB
    M[消息 M<br/>Header.Payload] --> H[SHA-256 哈希<br/>e = H(M)]
    H --> G[生成随机数 k<br/>⚠️ 必须密码学安全]
    G --> P1[计算曲线点 (x1, y1) = k * G]
    P1 --> R[r = x1 mod n]
    H --> S1[s = k⁻¹ * (e + r * d) mod n]
    d[私钥 d] --> S1
    S1 --> Signature[签名 (r, s)]
    
    style G fill:#F0AD4E,color:#fff
    style Signature fill:#5CB85C,color:#fff
```

**签名结构**：
```
ECDSA 签名 = (r, s)
- r：曲线点的 x 坐标
- s：签名值

ES256 签名长度：64 字节（r 32 字节 + s 32 字节）
```

### 4.4.5 Node.js 实现

```javascript
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// 1. 生成 ECDSA 密钥对（P-256 曲线）
const { privateKey, publicKey } = crypto.generateKeyPairSync('ec', {
  namedCurve: 'prime256v1',  // P-256 曲线
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem',
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem',
  },
});

// 2. 签发 JWT（ES256）
const payload = {
  sub: 'user-123',
  name: 'John Doe',
};

const token = jwt.sign(payload, privateKey, {
  algorithm: 'ES256',
  expiresIn: '1h',
  issuer: 'https://auth.example.com',
});

console.log('ES256 JWT:', token);

// 3. 验证 JWT
try {
  const decoded = jwt.verify(token, publicKey, {
    algorithms: ['ES256'],
    issuer: 'https://auth.example.com',
  });
  console.log('验证通过:', decoded);
} catch (error) {
  console.error('验证失败:', error.message);
}
```

### 4.4.6 Java 实现

```java
import io.jsonwebtoken.*;
import java.security.*;
import java.security.spec.ECGenParameterSpec;
import java.util.Date;

public class ES256JwtExample {
    
    private final PrivateKey privateKey;
    private final PublicKey publicKey;
    
    public ES256JwtExample() throws Exception {
        // 1. 生成 ECDSA 密钥对（P-256 曲线）
        KeyPairGenerator keyGen = KeyPairGenerator.getInstance("EC");
        keyGen.initialize(new ECGenParameterSpec("secp256r1"));  // P-256
        KeyPair keyPair = keyGen.generateKeyPair();
        
        this.privateKey = keyPair.getPrivate();
        this.publicKey = keyPair.getPublic();
    }
    
    // 签发 JWT
    public String generateToken(String userId) {
        long now = System.currentTimeMillis();
        
        return Jwts.builder()
            .setHeaderParam("alg", "ES256")
            .setHeaderParam("typ", "JWT")
            .setSubject(userId)
            .setIssuer("https://auth.example.com")
            .setIssuedAt(new Date(now))
            .setExpiration(new Date(now + 3600000))
            .signWith(privateKey, SignatureAlgorithm.ES256)
            .compact();
    }
    
    // 验证 JWT
    public Claims verifyToken(String token) {
        return Jwts.parserBuilder()
            .setSigningKey(publicKey)
            .requireIssuer("https://auth.example.com")
            .build()
            .parseClaimsJws(token)
            .getBody();
    }
}
```

### 4.4.7 ECDSA 优缺点

| 优点 | 缺点 |
|------|------|
| ✅ 相同安全性下密钥更短 | ❌ 实现复杂，需高质量随机数生成器 |
| ✅ 签名速度比 RSA 快 2-3 倍 | ❌ 时序攻击风险（非常量时间实现） |
| ✅ 签名长度短（64 字节 vs 256 字节） | ❌ 部分旧系统不支持 |
| ✅ 资源消耗低，适合移动端 | ❌ 曲线参数选择需谨慎 |

---

## 4.5 EdDSA（Ed25519）：现代高效签名

### 4.5.1 算法原理

**EdDSA（Edwards-curve Digital Signature Algorithm）** 是新一代数字签名算法，基于扭曲 Edwards 曲线。

**Ed25519 特性**：
- **曲线**：Curve25519（Edwards 25519）
- **哈希函数**：SHA-512
- **公钥长度**：32 字节
- **私钥长度**：32 字节（seed）
- **签名长度**：64 字节
- **安全强度**：~128-bit（等效 RSA 3072-bit）

```mermaid
graph TB
    subgraph Ed25519 优势
        A[高速] --> A1[签名/验证最快]
        B[高安全] --> B1[抗侧信道攻击]
        C[简洁] --> C1[无配置参数]
        D[短小] --> D1[密钥 32 字节<br/>签名 64 字节]
    end
    
    style Ed25519 优势 fill:#5CB85C,color:#fff
```

### 4.5.2 EdDSA vs ECDSA 对比

| 特性 | Ed25519 | ECDSA P-256 |
|------|---------|-------------|
| **曲线类型** | Edwards 25519 | Weierstrass P-256 |
| **签名速度** | ⚡⚡⚡ 极快 | ⚡⚡ 快 |
| **验证速度** | ⚡⚡⚡ 极快 | ⚡⚡ 快 |
| **随机数需求** | ❌ 确定性（无需随机数） | ✅ 必须密码学安全随机数 |
| **侧信道防护** | ✅ 内置常量时间实现 | ⚠️ 依赖实现 |
| **签名唯一性** | ✅ 相同消息签名相同 | ❌ 每次签名不同 |
| **参数配置** | ❌ 无（固定曲线） | ✅ 需选择曲线 |
| **安全性** | ✅✅ 高（抗多种攻击） | ✅ 高 |

### 4.5.3 密钥生成

**OpenSSL 生成 Ed25519 密钥对**：

```bash
# 1. 生成 Ed25519 私钥
openssl genpkey -algorithm Ed25519 -out ed25519-private.pem

# 2. 提取公钥
openssl pkey -in ed25519-private.pem -pubout -out ed25519-public.pem

# 3. 查看密钥内容
cat ed25519-private.pem
# -----BEGIN PRIVATE KEY-----
# MC4CAQAwBQYDK2VwBCIEI...
# -----END PRIVATE KEY-----

cat ed25519-public.pem
# -----BEGIN PUBLIC KEY-----
# MCowBQYDK2VwAyEAG...
# -----END PUBLIC KEY-----
```

**Node.js 生成密钥对**：

```javascript
const crypto = require('crypto');

const { privateKey, publicKey } = crypto.generateKeyPairSync('ed25519', {
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem',
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem',
  },
});

console.log('私钥:', privateKey);
console.log('公钥:', publicKey);
```

### 4.5.4 Node.js 实现

```javascript
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// 1. 生成 Ed25519 密钥对
const { privateKey, publicKey } = crypto.generateKeyPairSync('ed25519');

// 2. 签发 JWT（EdDSA）
const payload = {
  sub: 'user-123',
  name: 'John Doe',
};

const token = jwt.sign(payload, privateKey, {
  algorithm: 'EdDSA',  // 或 'Ed25519'
  expiresIn: '1h',
  issuer: 'https://auth.example.com',
});

console.log('EdDSA JWT:', token);
// Header 中 alg 字段为 "EdDSA"

// 3. 验证 JWT
try {
  const decoded = jwt.verify(token, publicKey, {
    algorithms: ['EdDSA'],
    issuer: 'https://auth.example.com',
  });
  console.log('验证通过:', decoded);
} catch (error) {
  console.error('验证失败:', error.message);
}
```

### 4.5.5 Java 实现（JDK 15+）

```java
import io.jsonwebtoken.*;
import java.security.*;
import java.util.Date;

public class EdDSAJwtExample {
    
    private final PrivateKey privateKey;
    private final PublicKey publicKey;
    
    public EdDSAJwtExample() throws Exception {
        // 生成 Ed25519 密钥对（JDK 15+ 支持）
        KeyPairGenerator keyGen = KeyPairGenerator.getInstance("Ed25519");
        KeyPair keyPair = keyGen.generateKeyPair();
        
        this.privateKey = keyPair.getPrivate();
        this.publicKey = keyPair.getPublic();
    }
    
    // 签发 JWT
    public String generateToken(String userId) {
        long now = System.currentTimeMillis();
        
        return Jwts.builder()
            .setHeaderParam("alg", "EdDSA")
            .setHeaderParam("typ", "JWT")
            .setSubject(userId)
            .setIssuer("https://auth.example.com")
            .setIssuedAt(new Date(now))
            .setExpiration(new Date(now + 3600000))
            .signWith(privateKey, Jwts.SIG.EdDSA)
            .compact();
    }
    
    // 验证 JWT
    public Claims verifyToken(String token) {
        return Jwts.parserBuilder()
            .verifyWith(publicKey)
            .requireIssuer("https://auth.example.com")
            .build()
            .parse(token)
            .getPayload();
    }
}
```

**依赖配置（Maven）**：

```xml
<dependencies>
    <!-- jjwt 0.12+ 支持 EdDSA -->
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-api</artifactId>
        <version>0.12.0</version>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-impl</artifactId>
        <version>0.12.0</version>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-orgjson</artifactId>
        <version>0.12.0</version>
    </dependency>
</dependencies>
```

### 4.5.6 EdDSA 优缺点

| 优点 | 缺点 |
|------|------|
| ✅ 签名/验证速度最快 | ❌ JDK 15+ 才原生支持（旧版本需 Bouncy Castle） |
| ✅ 确定性签名（无需随机数） | ❌ 部分库支持不完善 |
| ✅ 抗侧信道攻击（常量时间实现） | ❌ 仅一种变体（Ed25519），无选择余地 |
| ✅ 密钥/签名长度短 | |
| ✅ 无配置参数（降低误用风险） | |
| ✅ 内置防护多种密码分析攻击 | |

---

## 4.6 算法选择最佳实践

### 4.6.1 算法对比总表

| 算法 | 类型 | 密钥长度 | 签名长度 | 签名速度 | 验证速度 | 安全等级 | 兼容性 |
|------|------|----------|----------|----------|----------|----------|--------|
| **HS256** | 对称 | 256-bit | 32 字节 | ⚡⚡⚡ 极快 | ⚡⚡⚡ 极快 | ✅ 高 | ✅✅✅ 完美 |
| **RS256** | 非对称 | 2048-bit | 256 字节 | ⚡ 较慢 | ⚡ 较慢 | ✅✅ 高 | ✅✅✅ 完美 |
| **ES256** | 非对称 | 256-bit | 64 字节 | ⚡⚡⚡ 快 | ⚡⚡⚡ 快 | ✅✅ 高 | ✅✅ 良好 |
| **EdDSA** | 非对称 | 256-bit | 64 字节 | ⚡⚡⚡⚡ 最快 | ⚡⚡⚡⚡ 最快 | ✅✅✅ 极高 | ✅ 一般 |

**性能基准测试**（相对值，越低越好）：

| 算法 | 签名耗时 | 验证耗时 | Token 总长度 |
|------|----------|----------|-------------|
| HS256 | 1.0x | 1.0x | 最短 |
| RS256 (2048) | 8.5x | 8.2x | 较长 |
| ES256 | 1.2x | 1.3x | 中等 |
| EdDSA | 0.8x | 0.9x | 中等 |

### 4.6.2 场景化选择指南

```mermaid
flowchart TD
    Start[选择 JWT 签名算法] --> Q1{单服务还是多服务？}
    
    Q1 -->|单服务/内部系统 | Q2{性能敏感？}
    Q1 -->|多服务/分布式 | Q3{公钥可公开？}
    
    Q2 -->|是 | HS256[HS256<br/>对称加密]
    Q2 -->|否 | HS256
    
    Q3 -->|是 | Q4{性能要求？}
    Q3 -->|否 | HS256
    
    Q4 -->|最高性能 | EdDSA[EdDSA Ed25519<br/>推荐]
    Q4 -->|平衡 | ES256[ES256<br/>椭圆曲线]
    Q4 -->|兼容性优先 | RS256[RS256 RSA<br/>传统选择]
    
    style HS256 fill:#F0AD4E,color:#fff
    style EdDSA fill:#5CB85C,color:#fff
    style ES256 fill:#5CB85C,color:#fff
    style RS256 fill:#4A90D9,color:#fff
```

### 4.6.3 推荐决策矩阵

| 场景特征 | 首选算法 | 备选算法 | 理由 |
|----------|----------|----------|------|
| **单服务器应用** | HS256 | - | 性能最优，实现简单 |
| **微服务架构** | ES256 | RS256 | 公钥可分发，性能优秀 |
| **第三方集成** | RS256 | ES256 | 兼容性最好，广泛支持 |
| **移动/IoT 设备** | EdDSA | ES256 | 计算资源受限，需要高效 |
| **高安全需求（金融）** | EdDSA | ES384 | 抗攻击性强，安全等级高 |
| **政府/军工** | RS256 (3072-bit) | ES384 | 符合传统合规要求 |
| **区块链/Web3** | EdDSA | ES256K | 行业标准，生态支持 |

### 4.6.4 算法迁移策略

从旧算法迁移到新算法的步骤：

```mermaid
sequenceDiagram
    participant Old as 旧系统 (RS256)
    participant New as 新系统 (EdDSA)
    participant Client as 客户端
    
    Note over Old,New: 阶段 1：并行支持
    Old->>Client: 签发 RS256 Token
    New->>Client: 验证 RS256 Token
    
    Note over Old,New: 阶段 2：逐步切换
    New->>Client: 签发 EdDSA Token<br/>(带 kid 标识)
    Client->>New: 请求 (带 EdDSA Token)
    
    Note over Old,New: 阶段 3：淘汰旧算法
    New->>New: 停止支持 RS256
    New->>Client: 仅支持 EdDSA
```

**迁移注意事项**：

1. **使用 `kid` 字段**：标识不同算法的密钥
   ```json
   {
     "alg": "EdDSA",
     "typ": "JWT",
     "kid": "ed25519-key-2024-01"
   }
   ```

2. **JWKS 端点**：发布支持的密钥集合
   ```json
   {
     "keys": [
       {
         "kty": "OKP",
         "crv": "Ed25519",
         "kid": "ed25519-key-2024-01",
         "x": "..."
       },
       {
         "kty": "RSA",
         "kid": "rsa-key-legacy",
         "n": "...",
         "e": "AQAB"
       }
     ]
   }
   ```

3. **验证器配置**：支持多算法白名单
   ```javascript
   jwt.verify(token, getKey, {
     algorithms: ['EdDSA', 'RS256'],  // 过渡期支持两种
   });
   ```

### 4.6.5 安全配置清单

在部署 JWT 签名前，请确认以下配置：

**✅ 必须配置**：
- [ ] 明确指定允许的算法白名单（禁用 `none`）
- [ ] 使用强密钥/私钥（HS256: 256-bit+, RSA: 2048-bit+）
- [ ] 设置合理的过期时间（`exp` 声明）
- [ ] 验证 `iss`（签发者）和 `aud`（受众）

**✅ 推荐配置**：
- [ ] 使用 `kid` 字段支持密钥轮换
- [ ] 配置时钟偏移容错（`clockSkew`）
- [ ] 实施密钥轮换策略（至少每年一次）
- [ ] 监控签名失败（检测攻击尝试）

**❌ 禁止配置**：
- [ ] 允许 `none` 算法
- [ ] 使用弱密钥（RSA < 2048-bit）
- [ ] 硬编码密钥在源代码中
- [ ] 不验证 `exp` 字段

---

## 4.7 本章小结

### 核心要点回顾

1. **HS256**：对称签名，性能最优，适合单服务/内部系统
2. **RS256**：非对称签名，成熟可靠，兼容性好，适合第三方集成
3. **ES256**：椭圆曲线签名，性能与安全性平衡，推荐微服务架构
4. **EdDSA**：现代高效签名，速度最快，安全性最高，推荐新项目首选

### 算法选择决策树

```
1. 是否单服务？
   ├── 是 → HS256
   └── 否 → 继续 2

2. 是否需要公钥公开？
   ├── 否 → HS256
   └── 是 → 继续 3

3. 性能是否关键？
   ├── 是 → EdDSA
   └── 否 → 继续 4

4. 兼容性是否优先？
   ├── 是 → RS256
   └── 否 → ES256
```

### 关键引用来源

1. **RFC 7518** - JSON Web Algorithms (JWA)：https://www.rfc-editor.org/rfc/rfc7518
2. **RFC 8037** - EdDSA for JOSE：https://www.rfc-editor.org/rfc/rfc8037
3. **NIST SP 800-57** - 密钥管理指南：https://csrc.nist.gov/publications/detail/sp/800-57/part-1/rev-5/final
4. **jwt.io** - JWT 调试与文档：https://jwt.io
5. **Auth0 Algorithm Guide**：https://auth0.com/docs/secure/tokens/json-web-tokens/signing-algorithms

### 下一章预告

第 5 章将探讨 JWT 安全最佳实践，包括：
- 常见 JWT 攻击向量与防护措施
- 密钥管理最佳实践
- 生产环境部署检查清单
- 安全审计与监控

---

*文档版本：1.0*  
*最后更新：2026-04-07*  
*字数统计：约 7,200 字*
