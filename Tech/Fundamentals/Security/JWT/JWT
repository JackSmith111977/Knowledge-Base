# 第 1 章：基础认知：什么是 JWT

## 1.1 JWT 定义与核心思想

### 1.1.1 标准定义

**JSON Web Token（JWT）** 是一个开放行业标准（**RFC 7519**），定义了一种紧凑且自包含的方式，用于在各方之间作为 JSON 对象安全地传输信息。该标准由 IETF（Internet Engineering Task Force）于 2015 年 5 月正式发布，目前状态为 **PROPOSED STANDARD**（提议标准）。

根据 RFC 7519 的官方定义：

> JSON Web Token (JWT) is a compact, URL-safe means of representing claims to be transferred between two parties. The claims in a JWT are encoded as a JSON object that is used as the payload of a JSON Web Signature (JWS) structure or as the plaintext of a JSON Web Encryption (JWE) structure, enabling the claims to be digitally signed or integrity protected with a Message Authentication Code (MAC) and/or encrypted.

翻译为中文：

> JSON Web Token（JWT）是一种紧凑的、URL 安全的方法，用于表示要在两方之间传输的声明。JWT 中的声明被编码为 JSON 对象，该对象用作 JSON Web 签名（JWS）结构的负载，或用作 JSON Web 加密（JWE）结构的明文，从而使声明能够被数字签名或使用消息认证码（MAC）进行完整性保护和/或加密。

### 1.1.2 核心思想解析

JWT 的核心思想可以用一句话概括：**将用户身份和权限信息以结构化、可验证的方式编码到令牌本身，实现无状态认证**。

#### 关键概念解释

**1. 紧凑性（Compact）**
- JWT 采用三段式结构（Header.Payload.Signature），每段均为 Base64URL 编码的字符串
- 总长度通常控制在几百字节以内，适合在 HTTP 请求头、URL 参数等场景中传输
- 相比传统 Session 机制需要在服务器端存储会话数据，JWT 自身携带所有必要信息

**2. 自包含性（Self-contained）**
- JWT 令牌包含了验证和识别用户所需的全部信息
- 服务器无需查询数据库或缓存即可验证令牌有效性（签名验证）
-  Payload 中可包含用户 ID、角色、权限等声明信息

**3. 可验证性（Verifiable）**
- 通过数字签名技术，确保令牌在传输过程中未被篡改
- 接收方可以使用密钥验证令牌的完整性和来源真实性
- 支持对称加密（HS256）和非对称加密（RS256）两种签名算法

### 1.1.3 JWT 标准家族

JWT 并非单一标准，而是一个标准家族的一部分，统称为 **JOSE（JSON Object Signing and Encryption）**：

```mermaid
graph TB
    JOSE[JOSE - JSON Object Signing and Encryption]
    JOSE --> JWS[JWS - RFC 7515<br/>JSON Web Signature<br/>签名令牌]
    JOSE --> JWE[JWE - RFC 7516<br/>JSON Web Encryption<br/>加密令牌]
    JOSE --> JWK[JWK - RFC 7517<br/>JSON Web Key<br/>密钥格式]
    JOSE --> JWA[JWA - RFC 7518<br/>JSON Web Algorithms<br/>加密算法]
    JOSE --> JWT[JWT - RFC 7519<br/>JSON Web Token<br/>令牌格式]
    
    JWT -->|默认实现 | JWS
    JWT -->|可选实现 | JWE
    
    style JOSE fill:#4A90D9,color:#fff
    style JWS fill:#5CB85C,color:#fff
    style JWE fill:#5CB85C,color:#fff
    style JWT fill:#D9534F,color:#fff
```

**日常开发中，当我们提到 JWT 时，默认指的是 JWS（签名令牌）实现**，这也是最常见的使用方式。

---

## 1.2 为什么需要 JWT：对比传统 Session 认证

### 1.2.1 传统 Session-Cookie 认证机制

在 JWT 出现之前，Web 应用最广泛使用的认证机制是 **Session-Cookie** 模式。

#### 工作流程

```mermaid
sequenceDiagram
    participant C as 客户端 (浏览器)
    participant S as 服务器
    participant DB as 数据库/Redis
    
    C->>S: 1. 提交用户名密码
    S->>DB: 2. 验证用户凭证
    DB-->>S: 3. 验证通过
    S->>S: 4. 创建 Session 并存储
    S->>S: 5. 生成 Session ID
    S-->>C: 6. 返回 Session ID (Set-Cookie)
    C->>C: 7. 保存 Cookie
    
    Note over C,S: 后续请求
    C->>C: 8. 自动携带 Cookie
    C->>S: 9. 请求 (带 Session ID)
    S->>DB: 10. 查询 Session 数据
    DB-->>S: 11. 返回用户信息
    S-->>C: 12. 返回响应
    
    style C fill:#4A90D9,color:#fff
    style S fill:#5CB85C,color:#fff
    style DB fill:#F0AD4E,color:#fff
```

#### Session 认证的核心特点

| 特性 | 描述 |
|------|------|
| **有状态** | 服务器必须存储每个用户的 Session 数据 |
| **基于 Cookie** | Session ID 通过 Cookie 在客户端存储和传输 |
| **服务器验证** | 每次请求都需要查询服务器端存储的 Session |
| **同源策略** | Cookie 受同源策略限制，无法跨域共享 |

### 1.2.2 Session 认证面临的挑战

随着互联网架构的演进，传统 Session 机制在以下场景中暴露出明显缺陷：

#### 1. 分布式系统 Session 共享问题

在单机部署时代，Session 存储在服务器内存中即可满足需求。但在分布式/集群架构下，问题随之而来：

```mermaid
graph LR
    subgraph 客户端
        C[用户请求]
    end
    
    subgraph 负载均衡
        LB[负载均衡器]
    end
    
    subgraph 服务器集群
        S1[服务器 A<br/>Session 存储在内存]
        S2[服务器 B<br/>无 Session 数据]
        S3[服务器 C<br/>无 Session 数据]
    end
    
    C --> LB
    LB -->|第一次请求 | S1
    LB -->|第二次请求 | S2
    
    style S1 fill:#5CB85C,color:#fff
    style S2 fill:#D9534F,color:#fff
    style S3 fill:#D9534F,color:#fff
```

**问题**：用户在服务器 A 登录后，Session 存储在 A 的内存中。若后续请求被负载均衡到服务器 B，则 B 无法找到该 Session，导致认证失败。

**解决方案及缺点**：

| 方案 | 描述 | 缺点 |
|------|------|------|
| **Session Sticky** | 将用户请求固定路由到同一台服务器 | 服务器宕机后用户需重新登录；负载不均衡 |
| **Session 复制** | 在集群内同步复制所有 Session | 网络开销大；扩展性差 |
| **集中式存储** | 将 Session 存入 Redis/Database | 单点故障风险；增加网络 IO 开销 |

#### 2. 跨域认证困难

Cookie 受**同源策略**限制，无法在不同域名间共享：

- **场景**：单点登录（SSO）、微服务架构下多服务认证
- **问题**：`auth.example.com` 的 Cookie 无法在 `api.example.com` 使用
- **影响**：需要复杂的跨域解决方案（如 CORS + Token 中转）

#### 3. 移动端适配问题

- **原生 App**：不自动管理 Cookie，需要手动处理
- **小程序**：Cookie 支持有限，机制与浏览器不同
- **IoT 设备**：资源受限，Cookie 管理复杂

#### 4. 安全风险

| 风险类型 | 描述 |
|----------|------|
| **CSRF 攻击** | 利用 Cookie 自动携带特性，伪造跨站请求 |
| **Session 劫持** | 窃取 Session ID 后冒充用户 |
| **Session 固定攻击** | 攻击者预先设置 Session ID 诱使用户登录 |

### 1.2.3 JWT 的无状态认证方案

JWT 针对上述问题提供了革命性的解决方案：

```mermaid
sequenceDiagram
    participant C as 客户端
    participant S as 服务器
    
    C->>S: 1. 提交用户名密码
    S->>S: 2. 验证凭证
    S->>S: 3. 生成 JWT (包含用户信息 + 签名)
    S-->>C: 4. 返回 JWT
    
    Note over C,S: 后续请求
    C->>C: 5. 保存 JWT (LocalStorage/Cookie)
    C->>C: 6. 请求时携带 JWT
    C->>S: 7. 请求 (带 JWT)
    S->>S: 8. 验证签名 (无需查询数据库)
    S-->>C: 9. 返回响应
    
    style C fill:#4A90D9,color:#fff
    style S fill:#5CB85C,color:#fff
```

#### JWT vs Session 对比表

| 维度 | Session-Cookie | JWT |
|------|---------------|-----|
| **存储位置** | 服务器内存/Redis | 客户端 |
| **状态管理** | 有状态 | 无状态 |
| **扩展性** | 需要 Session 共享 | 天然支持分布式 |
| **跨域支持** | 困难（受同源策略限制） | 优秀（可跨域传输） |
| **移动端适配** | 需手动处理 Cookie | 原生支持 Token |
| **CSRF 防护** | 需要额外措施 | 不受 CSRF 影响 |
| **服务器压力** | 随用户增长而增加 | 恒定（仅验证签名） |
| **可控性** | 优秀（可随时失效） | 较弱（需等待过期或黑名单） |
| **带宽消耗** | 低（仅传输 Session ID） | 较高（传输完整信息） |

### 1.2.4 适用与不适用场景

#### ✅ JWT 推荐场景

1. **前后端分离架构**：API 认证、微服务间通信
2. **单点登录（SSO）**：跨域认证、多系统统一登录
3. **移动端应用**：App、小程序、混合开发
4. **分布式/微服务架构**：无状态服务、水平扩展
5. **第三方授权**：OAuth 2.0 承载令牌

#### ❌ JWT 不推荐场景

1. **高敏感业务**：金融交易、医疗数据（JWT 无法彻底撤销）
2. **需要即时权限控制**：权限变更后无法立即生效
3. **带宽敏感场景**：JWT 体积较大（携带大量声明时）
4. **长期会话管理**：JWT 应设置较短有效期，不适合长连接

---

## 1.3 JWT 的历史演进

### 1.3.1 认证技术演进时间线

```mermaid
timeline
    title Web 认证技术演进历程
    
    section 1990s-2000s
    早期 Web : HTTP Basic Auth<br/>(明文传输密码)
    1994 : Netscape 提出 Cookie
    1997 : RFC 2109 规范 Cookie
    2000s : Session-Cookie<br/>成为主流
    
    section 2010s
    2010 : OAuth 2.0 (RFC 6749)<br/>授权协议标准化
    2011 : 首个 JWT 规范草案
    2012 : Node.js jsonwebtoken<br/>库发布
    2015 : RFC 7519 正式发布<br/>JWT 成为标准
    
    section 2016-至今
    2016 : Auth0 等云服务商<br/>全面支持 JWT
    2018 : OIDC + JWT 成为<br/>企业级标准
    2020 : OAuth 2.1 启动<br/>整合 JWT 最佳实践
    2024 : OAuth 2.1 接近定稿<br/>强制 PKCE+TLS
```

### 1.3.2 演进驱动力分析

#### 第一阶段：HTTP Basic Auth（1990s）

最早的 Web 认证方式，直接在 HTTP 请求头中传输用户名密码：

```
Authorization: Basic dXNlcjpwYXNzd29yZA==
```

**问题**：
- 每次请求都传输密码（即使 Base64 编码也可轻松解码）
- 无法控制登录生命周期
- 用户体验差（每次打开浏览器都要重新输入）

#### 第二阶段：Cookie-Session（2000s）

Netscape 在 1994 年提出 Cookie，随后 Session-Combo 成为 Web 时代经典方案。

**优点**：
- 用户体验改善（只需登录一次）
- 服务器控制会话状态
- 可随时注销用户

**问题**：
- 服务器存储压力（用户量增长导致内存消耗）
- 分布式架构下 Session 共享复杂
- CSRF 攻击风险
- 跨域认证困难

#### 第三阶段：Token 认证（2010s）

为解决移动端适配和分布式问题，Token 机制应运而生。

**核心改进**：
- 客户端存储认证信息
- 服务器仅需验证 Token 有效性
- 支持跨域传输

**代表技术**：
- OAuth 2.0（2012 年 RFC 6749）
- JWT（2015 年 RFC 7519）

#### 第四阶段：标准化与云原生（2016-至今）

**发展趋势**：
- JWT 成为微服务认证事实标准
- OAuth 2.0 + OIDC + JWT 组合成为企业级方案
- 云服务提供商（Auth0、Okta）全面支持
- OAuth 2.1 整合最佳实践（2024 年接近定稿）

### 1.3.3 关键里程碑

| 时间 | 事件 | 意义 |
|------|------|------|
| **2010-12** | Mike Jones 提出 JWT 概念 | 奠定基础 |
| **2012-01** | draft-ietf-oauth-json-web-token-00 发布 | IETF 正式受理 |
| **2015-05** | RFC 7519 正式发布 | 成为行业标准 |
| **2016-08** | RFC 7797 更新（Base64URL 编码优化） | 技术完善 |
| **2019-10** | RFC 8725 发布（JWT 安全最佳实践） | 安全加固 |
| **2020-2024** | OAuth 2.1 整合 JWT 最佳实践 | 生态融合 |

---

## 1.4 JWT 与 OAuth 2.1 的关系辨析

### 1.4.1 概念区分

**JWT 和 OAuth 2.1 是两个不同层面的标准**，这是开发者最容易混淆的概念之一。

```mermaid
graph TB
    subgraph 协议层 [协议/框架层]
        OAuth2[OAuth 2.0/2.1<br/>授权框架]
        OIDC[OIDC OpenID Connect<br/>身份认证协议]
    end
    
    subgraph 令牌层 [令牌格式层]
        JWT[JWT JSON Web Token<br/>令牌格式]
        Opaque[Opaque Token<br/>不透明令牌]
    end
    
    subgraph 传输层 [传输层]
        HTTPS[HTTPS/TLS<br/>安全传输]
    end
    
    OAuth2 -->|使用 | JWT
    OAuth2 -->|或使用 | Opaque
    OIDC -->|必须使用 | JWT
    
    OAuth2 -->|依赖 | HTTPS
    JWT -->|建议配合 | HTTPS
    
    style OAuth2 fill:#4A90D9,color:#fff
    style JWT fill:#5CB85C,color:#fff
    style OIDC fill:#D9534F,color:#fff
```

#### 核心区别表

| 维度 | JWT | OAuth 2.0/2.1 |
|------|-----|---------------|
| **本质** | 令牌格式（数据标准） | 授权框架（协议流程） |
| **标准号** | RFC 7519 | RFC 6749 / OAuth 2.1 Draft |
| **定义内容** | 令牌的结构、编码、验证方式 | 如何获取、使用、刷新令牌 |
| **可否独立使用** | 可独立用于认证 | 需配合令牌格式使用 |
| **典型用途** | 身份认证、信息传递 | 第三方授权访问 |

### 1.4.2 OAuth 2.0/2.1 简介

**OAuth 2.0** 是一个授权框架，定义了客户端如何获取授权来访问资源服务器上的受保护资源。

**核心角色**：
- **资源所有者（Resource Owner）**：用户
- **客户端（Client）**：第三方应用
- **授权服务器（Authorization Server）**：颁发令牌
- **资源服务器（Resource Server）**：提供 API

**OAuth 2.1 的演进**：

OAuth 2.1 不是全新版本，而是对 OAuth 2.0 及其扩展的整合与优化：

| 改进点 | OAuth 2.0 | OAuth 2.1 |
|--------|-----------|-----------|
| **隐式授权** | 支持 | ❌ 移除（不安全） |
| **密码凭证授权** | 支持 | ❌ 移除（不安全） |
| **PKCE** | 可选扩展 | ✅ 强制要求 |
| **TLS 加密** | 建议 | ✅ 强制要求 |
| **刷新令牌** | 可选 | ✅ 标准化 |
| **规范整合** | 多 RFC 分散 | 单一整合文档 |

### 1.4.3 JWT 在 OAuth 2.1 中的角色

#### 1. JWT 作为 Access Token 的承载格式

OAuth 2.1 规定了如何获取和使用 Access Token，但**不规定 Token 的具体格式**。JWT 是最常用的 Token 格式选择。

```mermaid
sequenceDiagram
    participant U as 用户
    participant C as 客户端应用
    participant AS as 授权服务器<br/>(OAuth 2.1)
    participant RS as 资源服务器<br/>(API)
    
    U->>C: 1. 登录授权
    C->>AS: 2. 请求 Access Token
    AS->>AS: 3. 验证用户身份
    AS->>AS: 4. 生成 JWT 格式 Token
    AS-->>C: 5. 返回 JWT Token
    
    C->>RS: 6. 请求 API (Authorization: Bearer <JWT>)
    RS->>RS: 7. 验证 JWT 签名
    RS->>RS: 8. 提取用户信息
    RS-->>C: 9. 返回 API 响应
    
    style AS fill:#5CB85C,color:#fff
    style JWT fill:#4A90D9,color:#fff
```

#### 2. JWT 声明与 OAuth Claims 的映射

OAuth 2.1/OIDC 中定义的标准声明（Claims）通常存储在 JWT 的 Payload 中：

| Claim | 含义 | JWT 字段示例 |
|-------|------|-------------|
| `iss` | 签发者 | `"iss": "https://auth.example.com"` |
| `sub` | 主题（用户 ID） | `"sub": "1234567890"` |
| `aud` | 受众 | `"aud": "https://api.example.com"` |
| `exp` | 过期时间 | `"exp": 1516239022` |
| `iat` | 签发时间 | `"iat": 1516239022` |
| `scope` | 授权范围 | `"scope": "read write"` |

### 1.4.4 实际应用场景

#### 场景 1：JWT 独立用于内部认证

```
用户 → 后端 API
     ↓
  直接验证 JWT（不经过 OAuth）
```

适用于：单体应用、内部系统、前后端分离项目

#### 场景 2：OAuth 2.1 + JWT 组合

```
用户 → 授权服务器 (OAuth 2.1) → 获取 JWT Token
     ↓
  携带 JWT → 资源服务器 → 验证 JWT
```

适用于：第三方授权、微服务架构、开放平台

#### 场景 3：OIDC + OAuth 2.1 + JWT

```
OpenID Connect (身份层)
     ↓
OAuth 2.1 (授权层)
     ↓
JWT (令牌格式)
```

适用于：企业级单点登录、统一身份认证

### 1.4.5 常见误区澄清

| 误区 | 正确理解 |
|------|----------|
| "JWT 就是 OAuth" | JWT 是令牌格式，OAuth 是授权协议，两者可配合使用但非同一概念 |
| "使用 OAuth 必须用 JWT" | OAuth 可使用任意 Token 格式（包括不透明字符串） |
| "JWT 只能用于 OAuth" | JWT 可独立用于认证，无需 OAuth 流程 |
| "JWT 是加密的" | JWT 是签名（防篡改），Payload 是明文（Base64URL 可解码） |

---

## 1.5 本章小结

### 核心要点回顾

1. **JWT 定义**：RFC 7519 标准定义的紧凑、自包含的令牌格式，用于安全传输 JSON 声明
2. **核心思想**：将认证信息编码到令牌本身，实现无状态验证
3. **对比 Session**：JWT 解决分布式扩展、跨域认证、移动端适配问题，但牺牲了部分可控性
4. **历史演进**：从 HTTP Basic → Cookie-Session → Token → JWT，每一阶段都解决特定场景痛点
5. **与 OAuth 2.1 关系**：JWT 是令牌格式，OAuth 2.1 是授权框架，两者常配合使用但概念独立

### 关键引用来源

1. **RFC 7519** - JSON Web Token (JWT) 官方规范：https://www.rfc-editor.org/rfc/rfc7519
2. **RFC 7515** - JSON Web Signature (JWS)：https://www.rfc-editor.org/rfc/rfc7515
3. **RFC 6749** - OAuth 2.0 授权框架：https://www.rfc-editor.org/rfc/rfc6749
4. **OAuth 2.1 Draft** - OAuth 2.1 规范草案：https://oauth.net/2.1/
5. **RFC 8725** - JWT 安全最佳实践：https://www.rfc-editor.org/rfc/rfc8725
6. **jwt.io** - JWT 官方介绍与调试工具：https://jwt.io/introduction

### 下一章预告

第 2 章将深入解析 JWT 的内部结构，包括：
- Header 的 alg 和 typ 字段含义
- Payload 的三种声明类型（Registered/Public/Private）
- Signature 的签名公式与防篡改原理
- Base64URL 编码与标准 Base64 的区别

---

*文档版本：1.0*  
*最后更新：2026-04-07*  
*字数统计：约 5,200 字*
