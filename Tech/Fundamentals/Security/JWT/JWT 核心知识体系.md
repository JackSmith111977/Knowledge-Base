# JWT 核心知识体系

> **完整指南：从基础概念到生产实践**
>
> 本文档是 JWT（JSON Web Token）技术的全面指南，涵盖 8 个核心章节，约 50,000+ 字。适合初中级开发者系统学习 JWT 认证技术，也适合高级开发者作为参考手册。

---

## 目录

1. [基础认知：什么是 JWT](#1-基础认知什么是-jwt)
2. [JWT 结构解析](#2-jwt-结构解析)
3. [JWT 工作流程](#3-jwt-工作流程)
4. [JWT 签名算法](#4-jwt-签名算法)
5. [JWT 安全最佳实践](#5-jwt-安全最佳实践)
6. [JWT 实战应用](#6-jwt-实战应用)
7. [常见误区与面试问题](#7-常见误区与面试问题)
8. [实战案例与检查清单](#8-实战案例与检查清单)

---

**存储位置：** `Tech/Fundamentals/Security/JWT/JWT 核心知识体系.md`

**前置知识：**
- HTTP 协议基础
- 对称/非对称加密概念
- Web 认证基础

**后续学习：**
- OAuth 2.1 核心知识体系
- Web 安全核心知识体系
- 微服务架构设计

---

*最后更新：2026-04-07 | 版本：1.0.0*

---

## 1. 基础认知：什么是 JWT

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

---

## 2. JWT 结构解析

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

---

## 3. JWT 工作流程

## 3.1 签发流程：从用户登录到 Token 生成

### 3.1.1 完整签发流程图

JWT 的签发（Issuing）是指授权服务器在验证用户身份后，生成并返回 JWT Token 的完整过程。以下是标准的签发流程：

```mermaid
sequenceDiagram
    participant C as 客户端 (前端/App)
    participant AS as 授权服务器<br/>(Authorization Server)
    participant DB as 数据库/用户存储
    
    C->>C: 1. 用户输入用户名密码
    C->>AS: 2. POST /login<br/>{username, password}<br/>(HTTPS 加密传输)
    AS->>DB: 3. 验证用户凭证
    DB-->>AS: 4. 返回用户信息
    AS->>AS: 5. 构建 JWT Payload<br/>(sub, iss, exp, role 等)
    AS->>AS: 6. 构建 JWT Header<br/>(alg: RS256, typ: JWT)
    AS->>AS: 7. 生成签名<br/>Signature = Sign(Header.Payload, PrivateKey)
    AS->>AS: 8. 拼接 JWT<br/>Header.Payload.Signature
    AS-->>C: 9. 返回 JWT Token<br/>{access_token, token_type, expires_in}
    C->>C: 10. 安全存储 Token<br/>(LocalStorage/Secure Cookie)
    
    style AS fill:#5CB85C,color:#fff
    style C fill:#4A90D9,color:#fff
    style DB fill:#F0AD4E,color:#fff
```

### 3.1.2 签发流程详细步骤解析

#### 步骤 1-2：客户端发起登录请求

**前端实现示例（React）**：

```javascript
async function login(username, password) {
  try {
    const response = await fetch('https://auth.example.com/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    
    if (!response.ok) {
      throw new Error(`登录失败：${response.status}`);
    }
    
    const data = await response.json();
    // data.access_token 即为 JWT Token
    return data;
  } catch (error) {
    console.error('登录异常:', error);
    throw error;
  }
}
```

**关键安全要求**：

| 要求 | 说明 | 实现方式 |
|------|------|----------|
| **HTTPS 传输** | 防止密码被中间人窃取 | 强制使用 TLS 1.2+ |
| **密码加密** | 避免明文密码在网络传输 | 可配合前端哈希（如 SHA-256） |
| **防重放攻击** | 防止请求被截获后重复提交 | 添加时间戳 + nonce |

#### 步骤 3-4：服务器验证用户凭证

**后端实现示例（Node.js + Express）**：

```javascript
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    // 1. 查询用户
    const user = await db.users.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ error: '用户名或密码错误' });
    }
    
    // 2. 验证密码（使用 bcrypt 比较哈希值）
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      return res.status(401).json({ error: '用户名或密码错误' });
    }
    
    // 3. 凭证验证通过，准备生成 JWT
    // ...（下一步）
  } catch (error) {
    console.error('登录失败:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});
```

**安全最佳实践**：

1. **错误信息模糊化**：不要明确提示"用户名不存在"或"密码错误"，统一返回"用户名或密码错误"
2. **登录失败限制**：实施账户锁定策略（如 5 次失败后锁定 15 分钟）
3. **密码存储**：使用 bcrypt、Argon2 等慢哈希算法，禁止明文存储

#### 步骤 5-6：构建 JWT Header 和 Payload

**Payload 设计原则**：

```javascript
const payload = {
  // 注册声明（推荐使用）
  sub: String(user.id),           // 主题（用户 ID）
  iss: 'https://auth.example.com', // 签发者
  aud: 'https://api.example.com',  // 受众（目标服务）
  iat: Math.floor(Date.now() / 1000), // 签发时间（秒级时间戳）
  exp: Math.floor(Date.now() / 1000) + 3600, // 过期时间（1 小时后）
  
  // 自定义声明（业务数据）
  role: user.role,                 // 用户角色
  permissions: user.permissions,   // 权限列表
  tenant_id: user.tenantId,        // 租户 ID（多租户场景）
  
  // 安全相关
  jti: crypto.randomUUID(),        // JWT 唯一 ID（用于防重放/黑名单）
};
```

**Header 配置**：

```javascript
const header = {
  alg: 'RS256',  // 使用 RSA-SHA256 非对称签名
  typ: 'JWT',    // 令牌类型
  kid: 'key-2024-01'  // 密钥 ID（多密钥轮换场景）
};
```

#### 步骤 7-8：生成签名并拼接 JWT

**Node.js 实现（使用 jsonwebtoken 库）**：

```javascript
const jwt = require('jsonwebtoken');
const fs = require('fs');

// 读取私钥（实际生产中应从环境变量或密钥管理服务获取）
const privateKey = fs.readFileSync('private.key', 'utf8');

const token = jwt.sign(
  payload,           // Payload 数据
  privateKey,        // 私钥
  {
    algorithm: 'RS256',  // 签名算法
    expiresIn: '1h',     // 过期时间（可选，会覆盖 payload.exp）
    issuer: 'https://auth.example.com',  // 签发者
    audience: 'https://api.example.com', // 受众
    jwtid: crypto.randomUUID()  // JWT ID
  }
);

console.log('生成的 JWT Token:', token);
```

**Java 实现（使用 jjwt 库）**：

```java
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.util.Date;
import java.util.UUID;

public class JwtTokenProvider {
    
    private final KeyPair keyPair;
    
    public JwtTokenProvider() throws Exception {
        // 生成 RSA 密钥对（实际生产中应预先生成并安全存储）
        KeyPairGenerator keyGen = KeyPairGenerator.getInstance("RSA");
        keyGen.initialize(2048);
        this.keyPair = keyGen.generateKeyPair();
    }
    
    public String generateToken(String userId, String username, String role) {
        long now = System.currentTimeMillis();
        long expiryDate = now + 3600000; // 1 小时后过期
        
        return Jwts.builder()
            .setHeaderParam("kid", "key-2024-01")  // 密钥 ID
            .setSubject(userId)                     // sub
            .claim("username", username)            // 自定义声明
            .claim("role", role)
            .setIssuer("https://auth.example.com")  // iss
            .setAudience("https://api.example.com") // aud
            .setIssuedAt(new Date(now))             // iat
            .setExpiration(new Date(expiryDate))    // exp
            .setId(UUID.randomUUID().toString())    // jti
            .signWith(keyPair.getPrivate(), SignatureAlgorithm.RS256)
            .compact();
    }
}
```

#### 步骤 9-10：返回并存储 Token

**标准响应格式**：

```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_token": "dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4...",
  "scope": "read write"
}
```

**客户端安全存储**：

```javascript
// ✅ 推荐：存储在 HttpOnly Cookie（防 XSS）
document.cookie = `access_token=${accessToken}; HttpOnly; Secure; SameSite=Strict; path=/`;

// ⚠️ 可选：LocalStorage（方便但需注意 XSS 风险）
localStorage.setItem('access_token', accessToken);

// ❌ 不推荐：明文存储在普通 Cookie
// document.cookie = `access_token=${accessToken}`;
```

---

## 3.2 验证流程：服务器如何校验 JWT

### 3.2.1 验证流程总览

```mermaid
flowchart TD
    Start[收到带 JWT 的请求] --> Extract[从 Authorization 头提取 Token]
    Extract --> CheckFmt{格式检查<br/>Bearer + Token}
    CheckFmt -->|格式错误 | Err401[返回 401 Unauthorized]
    CheckFmt -->|格式正确 | Split[按 . 分割为三部分]
    
    Split --> CheckLen{长度检查<br/>是否 3 部分}
    CheckLen -->|否 | Err401_1[返回 401]
    CheckLen -->|是 | DecodeH[解码 Header]
    
    DecodeH --> CheckAlg{算法检查<br/>alg 是否合法}
    CheckAlg -->|none/未知 | Err401_2[返回 401]
    CheckAlg -->|合法 | GetKey[根据 kid 获取密钥]
    
    GetKey --> VerifySig[验证签名]
    VerifySig --> CheckSig{签名匹配？}
    CheckSig -->|否 | Err401_3[返回 401]
    CheckSig -->|是 | DecodeP[解码 Payload]
    
    DecodeP --> CheckExp{检查 exp<br/>是否过期}
    CheckExp -->|已过期 | Err401_4[返回 401<br/>Token 过期]
    CheckExp -->|未过期 | CheckNbf{检查 nbf<br/>是否生效}
    
    CheckNbf -->|未生效 | Err401_5[返回 401<br/>Token 未生效]
    CheckNbf -->|已生效 | CheckAud{检查 aud<br/>受众匹配？}
    
    CheckAud -->|不匹配 | Err401_6[返回 401]
    CheckAud -->|匹配 | CheckIss{检查 iss<br/>签发者匹配？}
    
    CheckIss -->|不匹配 | Err401_7[返回 401]
    CheckIss -->|匹配 | CheckBlacklist{检查黑名单<br/>可选}
    
    CheckBlacklist -->|在黑名单 | Err401_8[返回 401<br/>Token 已撤销]
    CheckBlacklist -->|不在黑名单 | Success[✅ 验证通过<br/>提取用户信息]
    
    style Success fill:#5CB85C,color:#fff
    style Err401 fill:#D9534F,color:#fff
    style Err401_1 fill:#D9534F,color:#fff
    style Err401_2 fill:#D9534F,color:#fff
    style Err401_3 fill:#D9534F,color:#fff
    style Err401_4 fill:#D9534F,color:#fff
    style Err401_5 fill:#D9534F,color:#fff
    style Err401_6 fill:#D9534F,color:#fff
    style Err401_7 fill:#D9534F,color:#fff
    style Err401_8 fill:#D9534F,color:#fff
```

### 3.2.2 签名验证原理

#### HS256 签名验证

**验证公式**：

```
expectedSignature = HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  secret
)

isValid = (expectedSignature === signature)
```

**Node.js 实现**：

```javascript
const crypto = require('crypto');

function verifyHS256(jwtToken, secret) {
  const [encodedHeader, encodedPayload, signature] = jwtToken.split('.');
  
  // 重新计算签名
  const signingInput = `${encodedHeader}.${encodedPayload}`;
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(signingInput)
    .digest('base64url');
  
  // 比较签名（使用常量时间比较防止时序攻击）
  return crypto.timingSafeEqual(
    Buffer.from(signature, 'base64url'),
    Buffer.from(expectedSignature, 'base64url')
  );
}
```

#### RS256 签名验证

**验证公式**：

```
isValid = RSASSA_PKCS1_v1_5_Verify(
  publicKey,
  SHA256(base64UrlEncode(header) + "." + base64UrlEncode(payload)),
  base64UrlDecode(signature)
)
```

**Node.js 实现**：

```javascript
const jwt = require('jsonwebtoken');
const fs = require('fs');

const publicKey = fs.readFileSync('public.key', 'utf8');

function verifyRS256(jwtToken) {
  try {
    const decoded = jwt.verify(jwtToken, publicKey, {
      algorithms: ['RS256'],           // 明确指定允许算法
      issuer: 'https://auth.example.com', // 验证签发者
      audience: 'https://api.example.com', // 验证受众
    });
    return { valid: true, payload: decoded };
  } catch (error) {
    return { valid: false, error: error.message };
  }
}
```

### 3.2.3 过期检查（exp 验证）

**时间戳验证原理**：

```javascript
function checkExpiration(payload, clockSkew = 0) {
  const now = Math.floor(Date.now() / 1000); // 当前时间（秒）
  const exp = payload.exp;
  
  // 考虑时钟偏移（clock skew）
  if (now > exp + clockSkew) {
    return { valid: false, reason: 'Token has expired' };
  }
  
  return { valid: true };
}
```

**时钟偏移（Clock Skew）问题**：

| 问题 | 描述 | 解决方案 |
|------|------|----------|
| **服务器时间不同步** | 分布式系统中各节点时间可能不一致 | 使用 NTP 同步所有服务器时间 |
| **客户端时间偏差** | 客户端设备时间可能不准确 | 不依赖客户端时间，以服务器时间为准 |
| **验证容错** | 严格验证可能因微小时间差导致合法 Token 被拒 | 设置合理的 clockSkew（如 60 秒） |

**Node.js 配置 clockSkew**：

```javascript
jwt.verify(token, publicKey, {
  clockSkew: '60s',  // 允许 60 秒时钟偏移
});
```

### 3.2.4 完整验证代码示例

#### Node.js 中间件实现

```javascript
const jwt = require('jsonwebtoken');
const fs = require('fs');

const publicKey = fs.readFileSync('public.key', 'utf8');

// JWT 验证中间件
function authMiddleware(req, res, next) {
  // 1. 从 Authorization 头提取 Token
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: '缺少 Authorization 头或格式错误' });
  }
  
  const token = authHeader.split(' ')[1];
  
  // 2. 验证 JWT
  jwt.verify(token, publicKey, {
    algorithms: ['RS256'],
    issuer: 'https://auth.example.com',
    audience: 'https://api.example.com',
    clockSkew: '60s',
  }, (err, decoded) => {
    if (err) {
      // 详细错误处理
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          error: 'Token 已过期',
          expiredAt: err.expiredAt 
        });
      }
      if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: 'Token 无效' });
      }
      return res.status(401).json({ error: 'Token 验证失败' });
    }
    
    // 3. 验证通过，将用户信息附加到请求对象
    req.user = decoded;
    next();
  });
}

// 使用示例
app.get('/api/protected', authMiddleware, (req, res) => {
  res.json({ 
    message: '访问成功',
    user: req.user 
  });
});
```

#### Java Spring Security 实现

```java
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class JwtConfig {
    
    @Bean
    public JwtDecoder jwtDecoder() throws Exception {
        // 读取公钥
        String publicKey = new String(Files.readAllBytes(Paths.get("public.key")));
        return NimbusJwtDecoder.withPublicKey(
            KeyFactory.getInstance("RSA")
                .generatePublic(new X509EncodedKeySpec(
                    Base64.getDecoder().decode(publicKey)
                ))
        ).build();
    }
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/public/**").permitAll()
                .requestMatchers("/api/protected/**").authenticated()
            )
            .oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults()));
        
        return http.build();
    }
}
```

---

## 3.3 刷新机制：Access Token + Refresh Token 双令牌模式

### 3.3.1 为什么需要双令牌？

**单令牌模式的问题**：

```mermaid
graph LR
    subgraph 问题场景
        A[Access Token 过期时间短] --> B[用户频繁重新登录]
        C[Access Token 过期时间长] --> D[Token 泄露后风险窗口大]
    end
    
    style 问题场景 fill:#D9534F,color:#fff
```

| 方案 | Access Token 有效期 | 用户体验 | 安全性 |
|------|-------------------|----------|--------|
| **短有效期** | 15-30 分钟 | ❌ 频繁重新登录 | ✅ 泄露风险窗口小 |
| **长有效期** | 7-30 天 | ✅ 无需频繁登录 | ❌ 泄露后长期有效 |

**双令牌模式的解决方案**：

```
Access Token（访问令牌）
├── 有效期短：15-60 分钟
├── 用于访问受保护资源
└── 泄露后影响有限

Refresh Token（刷新令牌）
├── 有效期长：7-30 天
├── 仅用于获取新的 Access Token
└── 严格保管（HttpOnly Cookie）
```

### 3.3.2 双令牌工作流程

```mermaid
sequenceDiagram
    participant C as 客户端
    participant AS as 授权服务器
    participant RS as 资源服务器
    participant DB as 数据库/Redis
    
    Note over C,RS: 初始登录
    C->>AS: 1. 登录请求
    AS-->>C: 2. 返回 Access Token + Refresh Token
    C->>C: 3. 存储 Access Token (内存)<br/>Refresh Token (HttpOnly Cookie)
    
    Note over C,RS: 正常访问
    C->>RS: 4. 请求 API (带 Access Token)
    RS-->>C: 5. 返回响应
    
    Note over C,RS: Access Token 过期
    C->>RS: 6. 请求 API (Access Token 已过期)
    RS-->>C: 7. 返回 401 Token Expired
    
    Note over C,AS: 刷新流程
    C->>AS: 8. POST /refresh (带 Refresh Token)
    AS->>DB: 9. 验证 Refresh Token
    DB-->>AS: 10. 验证通过
    AS->>AS: 11. 生成新的 Access Token<br/>(可选：轮换 Refresh Token)
    AS-->>C: 12. 返回新的 Access Token<br/>(+ 新的 Refresh Token)
    
    Note over C,RS: 继续访问
    C->>RS: 13. 请求 API (带新 Access Token)
    RS-->>C: 14. 返回响应
    
    style AS fill:#5CB85C,color:#fff
    style C fill:#4A90D9,color:#fff
```

### 3.3.3 刷新令牌实现

#### Node.js 实现

```javascript
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// 生成 Access Token（短有效期）
function generateAccessToken(userId, role) {
  return jwt.sign(
    { 
      sub: userId, 
      role,
      type: 'access'  // 标识令牌类型
    },
    process.env.ACCESS_TOKEN_SECRET,
    { 
      algorithm: 'HS256',
      expiresIn: '15m'  // 15 分钟
    }
  );
}

// 生成 Refresh Token（长有效期）
function generateRefreshToken(userId) {
  return jwt.sign(
    { 
      sub: userId,
      type: 'refresh',
      jti: crypto.randomUUID()  // 唯一 ID（用于撤销）
    },
    process.env.REFRESH_TOKEN_SECRET,
    { 
      algorithm: 'HS256',
      expiresIn: '7d'  // 7 天
    }
  );
}

// 刷新令牌接口
app.post('/refresh', async (req, res) => {
  const refreshToken = req.cookies.refreshToken;  // 从 HttpOnly Cookie 读取
  
  if (!refreshToken) {
    return res.status(401).json({ error: '缺少 Refresh Token' });
  }
  
  try {
    // 1. 验证 Refresh Token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, {
      algorithms: ['HS256'],
    });
    
    // 2. 检查令牌类型
    if (decoded.type !== 'refresh') {
      return res.status(401).json({ error: '无效的令牌类型' });
    }
    
    // 3. 检查是否在黑名单（撤销列表）
    const isRevoked = await redis.get(`refresh_blacklist:${decoded.jti}`);
    if (isRevoked) {
      return res.status(401).json({ error: 'Refresh Token 已撤销' });
    }
    
    // 4. 生成新的 Access Token
    const newAccessToken = generateAccessToken(decoded.sub, decoded.role);
    
    // 5. （可选）轮换 Refresh Token
    // 6. 将旧的 Refresh Token 加入黑名单
    await redis.set(
      `refresh_blacklist:${decoded.jti}`,
      'revoked',
      'EX',
      7 * 24 * 60 * 60  // 7 天
    );
    
    // 7. 生成新的 Refresh Token
    const newRefreshToken = generateRefreshToken(decoded.sub);
    
    // 8. 设置新的 HttpOnly Cookie
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000  // 7 天
    });
    
    // 9. 返回新的 Access Token
    res.json({
      access_token: newAccessToken,
      token_type: 'Bearer',
      expires_in: 900  // 15 分钟
    });
    
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Refresh Token 已过期' });
    }
    return res.status(401).json({ error: 'Refresh Token 无效' });
  }
});
```

#### 前端自动刷新实现

```javascript
class AuthClient {
  constructor() {
    this.accessToken = null;
    this.isRefreshing = false;
    this.refreshPromise = null;
  }
  
  // 带自动刷新的请求方法
  async fetchWithAuth(url, options = {}) {
    // 1. 确保有 Access Token
    if (!this.accessToken) {
      throw new Error('未登录');
    }
    
    // 2. 发起请求
    let response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${this.accessToken}`,
      },
    });
    
    // 3. 如果返回 401（Token 过期），尝试刷新
    if (response.status === 401) {
      try {
        await this.refreshAccessToken();
        
        // 4. 用新 Token 重试请求
        response = await fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            'Authorization': `Bearer ${this.accessToken}`,
          },
        });
      } catch (error) {
        // 刷新失败，重定向到登录页
        window.location.href = '/login';
        throw error;
      }
    }
    
    return response;
  }
  
  // 刷新 Access Token
  async refreshAccessToken() {
    // 防止并发刷新
    if (this.isRefreshing) {
      return this.refreshPromise;
    }
    
    this.isRefreshing = true;
    this.refreshPromise = (async () => {
      try {
        const response = await fetch('/refresh', {
          method: 'POST',
          credentials: 'include',  // 携带 HttpOnly Cookie
        });
        
        if (!response.ok) {
          throw new Error('刷新失败');
        }
        
        const data = await response.json();
        this.accessToken = data.access_token;
        
        // 触发令牌更新事件（通知其他标签页）
        window.dispatchEvent(new CustomEvent('tokenRefreshed', {
          detail: { accessToken: this.accessToken }
        }));
        
        return this.accessToken;
      } finally {
        this.isRefreshing = false;
        this.refreshPromise = null;
      }
    })();
    
    return this.refreshPromise;
  }
}

// 使用示例
const authClient = new AuthClient();

// 登录成功后存储 Token
authClient.accessToken = loginResponse.access_token;

// 发起请求（自动处理刷新）
const data = await authClient.fetchWithAuth('/api/user/profile');
```

---

## 3.4 撤销难题与解决方案

### 3.4.1 JWT 的撤销困境

**无状态 vs 可撤销的矛盾**：

```mermaid
graph TB
    subgraph 无状态优势
        A[JWT 优势] --> B[服务器无需存储会话]
        A --> C[验证仅需密钥]
        A --> D[天然支持分布式]
    end
    
    subgraph 撤销需求
        E[用户登出] --> F[需要使 Token 立即失效]
        G[密码修改] --> F
        H[权限变更] --> F
        I[设备丢失] --> F
    end
    
    subgraph 矛盾点
        F --> J[无状态 = 无法主动撤销]
        G --> J
        H --> J
        I --> J
    end
    
    style 无状态优势 fill:#5CB85C,color:#fff
    style 撤销需求 fill:#D9534F,color:#fff
    style 矛盾点 fill:#F0AD4E,color:#fff
```

**问题本质**：
JWT 的设计哲学是**无状态验证**，验证方只需持有公钥即可验证签名，无需与签发方通信或查询数据库。这一优势恰恰导致撤销困难——一旦 Token 签发，在过期前始终有效。

### 3.4.2 解决方案 1：Token 黑名单（Blacklist）

**实现原理**：

```mermaid
flowchart TD
    Start[用户登出/权限变更] --> AddBL[将 Token JTI 加入黑名单]
    AddBL --> Store[存储到 Redis/Database]
    Store --> SetExp[设置过期时间 = Token 剩余有效期]
    
    Verify[验证 JWT 时] --> CheckBL[检查 JTI 是否在黑名单]
    CheckBL -->|在黑名单 | Reject[拒绝请求]
    CheckBL -->|不在黑名单 | Continue[继续验证签名]
    
    style AddBL fill:#D9534F,color:#fff
    style CheckBL fill:#5CB85C,color:#fff
    style Reject fill:#D9534F,color:#fff
    style Continue fill:#5CB85C,color:#fff
```

**Redis 实现示例**：

```javascript
const redis = require('redis');
const client = redis.createClient();

// 将 Token 加入黑名单
async function revokeToken(token) {
  try {
    // 1. 解码 Token（无需验证签名）
    const payload = jwt.decode(token);
    if (!payload || !payload.exp) {
      return false;  // 无过期时间的 Token 无法处理
    }
    
    // 2. 计算剩余有效期（秒）
    const now = Math.floor(Date.now() / 1000);
    const ttl = payload.exp - now;
    
    if (ttl <= 0) {
      return false;  // 已过期，无需加入黑名单
    }
    
    // 3. 以 JTI 为键存入 Redis
    const key = `jwt:blacklist:${payload.jti}`;
    await client.setEx(key, ttl, 'revoked');
    
    return true;
  } catch (error) {
    console.error('撤销 Token 失败:', error);
    return false;
  }
}

// 检查 Token 是否在黑名单中
async function isTokenBlacklisted(token) {
  try {
    const payload = jwt.decode(token);
    if (!payload || !payload.jti) {
      return true;  // 无 JTI 的 Token 视为无效
    }
    
    const key = `jwt:blacklist:${payload.jti}`;
    const status = await client.get(key);
    
    return status === 'revoked';
  } catch (error) {
    return true;  // 检查失败时默认拒绝
  }
}

// 验证中间件集成黑名单检查
async function authMiddleware(req, res, next) {
  const token = extractToken(req);
  
  // 1. 检查黑名单
  const blacklisted = await isTokenBlacklisted(token);
  if (blacklisted) {
    return res.status(401).json({ error: 'Token 已撤销' });
  }
  
  // 2. 正常验证签名
  jwt.verify(token, publicKey, { algorithms: ['RS256'] }, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Token 无效' });
    }
    req.user = decoded;
    next();
  });
}

// 登出接口
app.post('/logout', authMiddleware, async (req, res) => {
  const token = extractToken(req);
  await revokeToken(token);
  res.json({ message: '已登出' });
});
```

**黑名单方案优缺点**：

| 优点 | 缺点 |
|------|------|
| ✅ 支持立即撤销 | ❌ 需要存储状态（牺牲无状态优势） |
| ✅ 实现简单 | ❌ 每次验证需查询 Redis/数据库 |
| ✅ 可控制单个 Token | ❌ 分布式场景需共享存储 |

### 3.4.3 解决方案 2：短有效期 + Refresh Token

**核心思想**：
不直接解决 Access Token 的撤销问题，而是通过**缩短有效期**将风险窗口控制在可接受范围内。

```mermaid
timeline
    title 短有效期策略的时间窗口
    section Access Token
        T0 : 签发 Access Token<br/>有效期 15 分钟
        T0+10m : 用户登出<br/>Token 仍有 5 分钟有效
        T0+15m : Token 自然过期
    section Refresh Token
        T0 : 签发 Refresh Token<br/>有效期 7 天
        T0+1d : 用户登出<br/>撤销 Refresh Token
        T0+1d : 无法获取新<br/>Access Token
```

**实现策略**：

```javascript
// 配置建议
const TOKEN_CONFIG = {
  // Access Token：短有效期
  access: {
    expiresIn: '15m',  // 15 分钟
    maxLifetime: '30m' // 绝对最大值（可选）
  },
  
  // Refresh Token：长有效期但可撤销
  refresh: {
    expiresIn: '7d',           // 7 天
    rotateOnRefresh: true,     // 每次刷新时轮换
    revokeOnLogout: true,      // 登出时撤销
    singleUse: true            // 一次性使用（检测重放）
  }
};
```

### 3.4.4 解决方案 3：Refresh Token 轮换（Rotate Refresh Token）

**轮换机制原理**：

```mermaid
sequenceDiagram
    participant C as 客户端
    participant AS as 授权服务器
    participant DB as 数据库
    
    C->>AS: 1. 使用 Refresh Token A 请求刷新
    AS->>DB: 2. 验证 Refresh Token A
    AS->>AS: 3. 生成新的 Access Token
    AS->>AS: 4. 生成新的 Refresh Token B
    AS->>DB: 5. 将 Refresh Token A 加入黑名单
    AS->>DB: 6. 存储 Refresh Token B（关联用户）
    AS-->>C: 7. 返回新的 Access Token + Refresh Token B
    
    Note over C,AS: 下次刷新
    C->>AS: 8. 使用 Refresh Token B 请求刷新
    AS->>DB: 9. 验证 Refresh Token B
    
    Note over AS: 检测到 Refresh Token A<br/>被盗用（已被撤销）
    AS->>DB: 10. 将该用户的所有<br/>Refresh Token 标记为撤销
    AS->>C: 11. 触发安全告警（可选）
```

**轮换实现**：

```javascript
// 刷新令牌时实施轮换
async function refreshTokenWithRotation(oldRefreshToken) {
  try {
    // 1. 验证旧 Refresh Token
    const decoded = jwt.verify(oldRefreshToken, REFRESH_SECRET);
    
    // 2. 检查是否是重复使用（检测盗用）
    const reused = await checkTokenReuse(decoded.jti);
    if (reused) {
      // 发现盗用！撤销该用户的所有 Refresh Token
      await revokeAllUserTokens(decoded.sub);
      throw new Error('检测到 Refresh Token 盗用');
    }
    
    // 3. 将旧 Token 加入黑名单
    await blacklistToken(decoded.jti);
    
    // 4. 生成新的 Refresh Token（新 jti）
    const newRefreshToken = generateRefreshToken(decoded.sub, {
      jti: crypto.randomUUID(),
    });
    
    // 5. 存储新 Token 的 JTI 到数据库（用于轮换追踪）
    await storeUserRefreshToken(decoded.sub, newRefreshToken.jti);
    
    return {
      accessToken: generateAccessToken(decoded.sub),
      refreshToken: newRefreshToken,
    };
    
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Refresh Token 已过期');
    }
    throw error;
  }
}

// 检查 Token 是否被重复使用
async function checkTokenReuse(jti) {
  // 如果 JTI 已经在"已使用"集合中，说明被盗用
  const used = await redis.sismember('used_refresh_jti', jti);
  return used === 1;
}

// 撤销用户所有 Refresh Token
async function revokeAllUserTokens(userId) {
  // 获取该用户的所有 JTI
  const jtis = await redis.smembers(`user:${userId}:refresh_jtis`);
  
  // 批量加入黑名单
  const pipeline = redis.pipeline();
  for (const jti of jtis) {
    pipeline.setEx(`jwt:blacklist:${jti}`, 7 * 24 * 60 * 60, 'revoked');
  }
  await pipeline.exec();
  
  // 清空用户的 JTI 集合
  await redis.del(`user:${userId}:refresh_jtis`);
  
  // 触发安全告警
  await sendSecurityAlert(userId, 'REFRESH_TOKEN_REUSE_DETECTED');
}
```

### 3.4.5 三种方案对比

| 方案 | 实时性 | 性能影响 | 实现复杂度 | 推荐场景 |
|------|--------|----------|------------|----------|
| **黑名单** | ✅ 立即生效 | ⚠️ 每次验证查询存储 | 简单 | 高安全需求 |
| **短有效期** | ⚠️ 最多等待过期 | ✅ 无额外开销 | 简单 | 一般场景 |
| **轮换 Refresh Token** | ✅ 检测盗用 | ⚠️ 需存储轮换状态 | 中等 | 金融/敏感数据 |

### 3.4.6 最佳实践组合

**推荐方案**：短有效期 + Refresh Token 轮换 + 选择性黑名单

```javascript
const BEST_PRACTICE_CONFIG = {
  // 1. Access Token 短有效期
  accessToken: {
    expiresIn: '15m',
    algorithm: 'RS256',
  },
  
  // 2. Refresh Token 轮换 + 一次性使用
  refreshToken: {
    expiresIn: '7d',
    rotateOnRefresh: true,
    singleUse: true,
    secureStorage: 'HttpOnly Cookie',
  },
  
  // 3. 选择性黑名单（仅关键场景）
  blacklist: {
    enabled: true,
    // 仅在以下场景加入黑名单：
    // - 用户主动登出
    // - 密码修改
    // - 检测到异常活动
    triggerOn: ['logout', 'password_change', 'security_alert'],
  },
  
  // 4. 监控与告警
  monitoring: {
    detectReuse: true,
    alertOnReuse: true,
    revokeAllOnReuse: true,
  },
};
```

---

## 3.5 本章小结

### 核心要点回顾

1. **签发流程**：用户登录 → 验证凭证 → 构建 Payload → 生成签名 → 返回 Token
2. **验证流程**：提取 Token → 验证签名 → 检查过期 → 验证声明（iss/aud）→ 可选黑名单检查
3. **刷新机制**：Access Token（短有效期）+ Refresh Token（长有效期）组合使用
4. **撤销方案**：黑名单（实时）、短有效期（被动）、轮换 Refresh Token（检测盗用）

### 安全最佳实践

| 实践 | 说明 |
|------|------|
| ✅ 使用 HTTPS | 所有 Token 传输必须加密 |
| ✅ Access Token 短有效期 | 建议 15-30 分钟 |
| ✅ Refresh Token HttpOnly Cookie | 防止 XSS 窃取 |
| ✅ 验证所有标准声明 | exp、nbf、iss、aud |
| ✅ 实施 Refresh Token 轮换 | 检测并响应盗用 |
| ✅ 关键操作加入黑名单 | 登出、密码修改时撤销 |
| ❌ Payload 存储敏感信息 | 密码、信用卡号等 |
| ❌ 使用 none 算法 | 明确禁止 |

### 关键引用来源

1. **RFC 7519** - JSON Web Token (JWT)：https://www.rfc-editor.org/rfc/rfc7519
2. **RFC 8725** - JWT 安全最佳实践：https://www.rfc-editor.org/rfc/rfc8725
3. **OAuth 2.1 Draft** - Refresh Token 轮换机制：https://oauth.net/2.1/
4. **OWASP JWT Security Cheat Sheet**：https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html
5. **Auth0 JWT Handbook**：https://auth0.com/resources/ebooks/jwt-handbook

---

## 4. JWT 签名算法

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

### 4.2.3 HS256 优缺点分析

| 优点 | 缺点 |
|------|------|
| ✅ 计算速度快 | ❌ 密钥需共享（泄露风险高） |
| ✅ 实现简单 | ❌ 不适合分布式/多服务场景 |
| ✅ 密钥长度短（256-bit） | ❌ 无法实现不可否认性 |
| ✅ 兼容性好（所有库支持） | ❌ 密钥轮换复杂 |

### 4.2.4 适用场景

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

### 4.3.4 RS256 vs RS384 vs RS512

| 算法 | 哈希函数 | 输出长度 | 安全性 | 性能 |
|------|----------|----------|--------|------|
| **RS256** | SHA-256 | 256-bit | ✅ 高 | ⚡ 较快 |
| **RS384** | SHA-384 | 384-bit | ✅✅ 更高 | 中等 |
| **RS512** | SHA-512 | 512-bit | ✅✅✅ 最高 | 🐌 较慢 |

**选择建议**：
- **RS256**：适用于绝大多数场景（推荐默认选择）
- **RS384/RS512**：仅在高安全需求场景使用（如金融、军事）
- 注意：SHA-384/512 在 64 位系统上性能更好

### 4.3.5 RSA 算法优缺点

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

### 4.4.4 Node.js 实现

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

### 4.4.5 ECDSA 优缺点

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

### 4.5.3 Node.js 实现

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

### 4.5.4 EdDSA 优缺点

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

### 4.6.4 安全配置清单

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

---

## 5. JWT 安全最佳实践

## 5.1 密钥管理：JWT 安全的基石

密钥管理是 JWT 安全体系中最关键的环节。一个薄弱的密钥管理策略可能导致整个认证系统崩溃。

**核心原则：密钥绝不应硬编码在代码中**

### 5.1.1 密钥存储方案

| 方案 | 安全性 | 适用场景 | 实施复杂度 |
|------|--------|----------|------------|
| 环境变量 | 中 | 开发/测试环境 | 低 |
| 密钥管理服务 (KMS) | 高 | 生产环境 | 中 |
| 硬件安全模块 (HSM) | 极高 | 金融/政府系统 | 高 |
| 配置文件 (加密) | 中低 | 小型项目 | 低 |

**环境变量存储示例**：

```javascript
// Node.js 读取环境变量
const jwt = require('jsonwebtoken');

const token = jwt.sign(
  { userId: 123 },
  process.env.JWT_SECRET_KEY, // 从环境变量读取
  { algorithm: 'HS256', expiresIn: '1h' }
);
```

**专业密钥管理服务**（推荐）：

- **AWS KMS**：提供集中化密钥管理，支持自动轮换
- **Azure Key Vault**：安全的密钥存储与访问控制
- **HashiCorp Vault**：开源密钥管理工具，支持动态密钥
- **阿里云 KMS**：国内合规的密钥管理方案

### 5.1.2 密钥轮换策略

**轮换频率建议**：

| 算法类型 | 推荐轮换周期 | 密钥长度要求 |
|----------|--------------|--------------|
| HMAC (HS256) | 30-90 天 | 至少 256 位 (32 字节) |
| RSA (RS256) | 6-12 个月 | 至少 2048 位 |
| ECDSA (ES256) | 6-12 个月 | P-256 曲线 |

**平滑密钥轮换方案**（KID + 多密钥仓库）：

JWT Header 支持 `kid` 字段标识签名密钥版本：

```json
{
  "alg": "RS256",
  "typ": "JWT",
  "kid": "key-2025-q1-rotation"
}
```

### 5.1.3 密钥泄露应急响应

**泄露检测信号**：
- Token 异常验证失败率激增
- 发现未知 `kid` 的 Token
- 监控到异常 Token 签发行为
- 代码库/配置文件意外公开

**应急响应流程**：

```
1. 确认泄露 → 2. 启动紧急轮换 → 3. 通知相关方 → 4. 审计追踪
```

---

## 5.2 过期时间策略：时间窗口的艺术

### 5.2.1 核心时间声明

| 声明 | 全称 | 作用 | 是否必需 |
|------|------|------|----------|
| `exp` | Expiration Time | Token 过期时间 | 推荐 |
| `nbf` | Not Before | Token 生效时间 | 可选 |
| `iat` | Issued At | Token 签发时间 | 可选 |
| `jti` | JWT ID | Token 唯一标识 | 可选 |

### 5.2.2 双 Token 模式（推荐架构）

```
┌─────────────────────────────────────────────────────────┐
│  Access Token (短期)          Refresh Token (长期)      │
│  - 有效期：15 分钟            - 有效期：7 天             │
│  - 用于 API 请求认证           - 仅用于刷新 Access Token  │
│  - 泄露影响有限               - 存储在 HttpOnly Cookie   │
└─────────────────────────────────────────────────────────┘
```

**推荐设置策略**：

| 场景 | Access Token 有效期 | Refresh Token 有效期 | 说明 |
|------|---------------------|----------------------|------|
| 高安全系统 | 5-15 分钟 | 1-7 天 | 金融、医疗系统 |
| 一般 Web 应用 | 15-60 分钟 | 7-30 天 | 电商、社交平台 |
| 内部系统 | 1-4 小时 | 30-90 天 | 企业后台、管理面板 |
| 移动应用 | 30-60 分钟 | 60-90 天 | 考虑网络不稳定性 |

### 5.2.3 `jti` 唯一标识用途

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
```

---

## 5.3 敏感数据存储禁忌

**核心原则：JWT Payload 是编码而非加密，任何人均可解码查看**

### 5.3.1 绝对禁止存储的数据

| 数据类型 | 风险等级 | 原因 |
|----------|----------|------|
| 明文密码 | 🔴 极高 | 泄露即导致账户被盗 |
| 信用卡号 | 🔴 极高 | PCI-DSS 合规要求 |
| 身份证号/护照号 | 🔴 极高 | 隐私法规禁止 |
| 生物识别数据 | 🔴 极高 | 不可更改的生物特征 |

### 5.3.2 推荐存储的数据

| 数据类型 | 风险等级 | 说明 |
|----------|----------|------|
| 用户 ID (非标识符) | 🟢 低 | 如内部 UUID |
| Token 类型 | 🟢 低 | access/refresh |
| 权限范围 (Scope) | 🟢 低 | 如 `read:users` |
| 过期时间 | 🟢 低 | 标准声明 |

**正确示例**：

```javascript
// ✅ 推荐：最小化敏感信息
const payload = {
  sub: "usr_7d8f9a2b3c4e5f",  // 内部用户 ID
  scope: ["read:profile", "write:posts"],
  type: "access",
  iat: 1699000000,
  exp: 1699003600
};
```

---

## 5.4 传输层安全：HTTPS 强制要求

**核心原则：JWT 必须通过 HTTPS 传输，否则等同于明文传输**

### 5.4.1 HSTS 配置

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

## 5.5 常见攻击与防御

### 5.5.1 篡改攻击

**防御措施**：

1. **始终验证签名**：不要信任未验证的 Token
2. **使用强密钥**：至少 256 位 (32 字节)

```javascript
// ✅ 正确：始终验证签名
jwt.verify(token, secret, (err, decoded) => {
  if (err) {
    return res.status(401).send('Invalid token');
  }
  req.user = decoded;
  next();
});
```

### 5.5.2 重放攻击 (Replay Attack)

**防御策略**：

| 方案 | 实施复杂度 | 安全性 | 适用场景 |
|------|------------|--------|----------|
| 短有效期 | 低 | 中 | 所有系统 |
| Refresh Token + 黑名单 | 中 | 高 | 高安全系统 |
| Nonce + 签名 | 高 | 极高 | 支付/金融系统 |

### 5.5.3 算法混淆攻击 (alg: none)

**防御措施**：

1. **明确指定算法，拒绝 `none`**：

```javascript
// ✅ 正确：明确指定算法
jwt.verify(token, secret, { algorithms: ['HS256'] }, (err, decoded) => {
  // 如果 Token 使用其他算法（包括 none），验证直接失败
});
```

2. **RSA 算法场景**（推荐）：使用非对称加密，验证方只需公钥

---

## 5.6 安全检查清单

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

---

## 5.7 本章小结

1. **密钥管理**：使用 KMS 存储、定期轮换、应急响应
2. **过期时间策略**：双 Token 模式、时间声明正确使用
3. **敏感数据存储**：数据最小化、禁止存储敏感信息
4. **传输层安全**：强制 HTTPS、HSTS 配置
5. **攻击防御**：篡改、重放、泄露、算法混淆攻击的识别与防御

### 关键引用来源

1. **OWASP JWT Security Cheat Sheet**: https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html
2. **RFC 7519** - JSON Web Token (JWT): https://tools.ietf.org/html/rfc7519
3. **Auth0 JWT Handbook**: https://auth0.com/resources/ebooks/jwt-handbook
4. **NIST SP 800-132** - Password-Based Cryptography: https://csrc.nist.gov/publications/detail/sp/800-132/final

---

## 6. JWT 实战应用

## 6.1 前端存储方案：安全性对比与选择

### 6.1.1 三种存储方案核心对比

| 特性 | LocalStorage | Cookie (HttpOnly) | Memory (JavaScript 变量) |
|------|--------------|-------------------|--------------------------|
| **XSS 防护** | ❌ 无防护 | ✅ 有效防护 | ✅ 进程隔离 |
| **CSRF 防护** | ✅ 无 CSRF 风险 | ⚠️ 需 SameSite 配置 | ✅ 无 CSRF 风险 |
| **存储容量** | ~5-10 MB | ~4 KB | 受内存限制 |
| **持久化** | ✅ 永久存储 | ✅ 可设置过期时间 | ❌ 刷新即失 |
| **自动发送** | ❌ 需手动添加 | ✅ 自动携带 | ❌ 需手动添加 |
| **安全等级** | 🟡 中 | 🟢 高 | 🟢 高 |

### 6.1.2 推荐方案：混合存储模式

**最佳实践架构**：

```
┌─────────────────────────────────────────────────────────┐
│  Access Token              Refresh Token                │
│  - 存储位置：Memory        - 存储位置：HttpOnly Cookie  │
│  - 有效期：15 分钟          - 有效期：7 天               │
│  - 用途：API 请求认证       - 用途：刷新 Access Token    │
└─────────────────────────────────────────────────────────┘
```

### 6.1.3 存储方案选择决策树

```
是否需要最高安全性？
├─ 是 → HttpOnly Cookie + Memory 混合模式
└─ 否 → 继续判断
    │
    是否有严格 XSS 防护？
    ├─ 是 → LocalStorage（开发/内部系统）
    └─ 否 → HttpOnly Cookie（生产环境）
```

---

## 6.2 后端实现：多语言代码示例

### 6.2.1 Node.js (jsonwebtoken 库)

**安装**：`npm install jsonwebtoken`

**完整实现**：

```javascript
const jwt = require('jsonwebtoken');

class JwtService {
  constructor() {
    this.accessSecret = process.env.JWT_ACCESS_SECRET;
    this.refreshSecret = process.env.JWT_REFRESH_SECRET;
  }
  
  // 生成 Token 对
  generateTokenPair(user) {
    const accessToken = jwt.sign(
      { sub: user.id, email: user.email, role: user.role, type: 'access' },
      this.accessSecret,
      { algorithm: 'HS256', expiresIn: '15m' }
    );
    
    const refreshToken = jwt.sign(
      { sub: user.id, type: 'refresh', jti: crypto.randomBytes(16).toString('hex') },
      this.refreshSecret,
      { algorithm: 'HS256', expiresIn: '7d' }
    );
    
    return { accessToken, refreshToken };
  }
  
  // 验证 Access Token
  verifyAccessToken(token) {
    return jwt.verify(token, this.accessSecret, { algorithms: ['HS256'] });
  }
}
```

### 6.2.2 Java (jjwt 库)

**Maven 依赖**：

```xml
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.12.3</version>
</dependency>
```

**完整实现**：

```java
@Service
public class JwtService {
    
    @Value("${jwt.secret}")
    private String secret;
    
    private SecretKey accessKey;
    
    @PostConstruct
    public void init() {
        this.accessKey = Keys.hmacShaKeyFor(
            (secret + "-access").getBytes(StandardCharsets.UTF_8)
        );
    }
    
    // 生成 Access Token
    public String generateAccessToken(Map<String, Object> claims, String subject) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + accessExpiry);
        
        return Jwts.builder()
            .setClaims(claims)
            .setSubject(subject)
            .setIssuedAt(now)
            .setExpiration(expiry)
            .signWith(accessKey, SignatureAlgorithm.HS256)
            .compact();
    }
    
    // 验证 Token
    public Claims verifyAccessToken(String token) {
        return Jwts.parserBuilder()
            .setSigningKey(accessKey)
            .build()
            .parseClaimsJws(token)
            .getBody();
    }
}
```

### 6.2.3 Python (PyJWT 库)

**安装**：`pip install PyJWT`

**完整实现**：

```python
import jwt
import datetime

class JwtService:
    def generate_tokens(self, user_id, email, role='user'):
        now = datetime.datetime.utcnow()
        
        # Access Token
        access_payload = {
            'sub': user_id,
            'email': email,
            'role': role,
            'type': 'access',
            'iat': now,
            'exp': now + datetime.timedelta(seconds=900),  # 15 分钟
        }
        
        access_token = jwt.encode(
            access_payload,
            self.access_secret,
            algorithm='HS256'
        )
        
        # Refresh Token
        refresh_payload = {
            'sub': user_id,
            'type': 'refresh',
            'jti': str(uuid.uuid4()),
            'iat': now,
            'exp': now + datetime.timedelta(seconds=604800),  # 7 天
        }
        
        refresh_token = jwt.encode(
            refresh_payload,
            self.refresh_secret,
            algorithm='HS256'
        )
        
        return {
            'accessToken': access_token,
            'refreshToken': refresh_token
        }
```

---

## 6.3 无状态会话 vs 有状态会话

### 6.3.1 两种会话模式对比

| 特性 | 无状态会话 (JWT) | 有状态会话 (Session) |
|------|------------------|----------------------|
| **服务端存储** | 无需存储 | 需要存储（Redis/DB） |
| **水平扩展** | 天然支持 | 需要共享 Session |
| **撤销机制** | 困难（需黑名单） | 简单（删除 Session） |
| **Token 大小** | 较大（包含数据） | 较小（仅 Session ID） |
| **适用场景** | 微服务、API、移动端 | 单体应用、高安全系统 |

### 6.3.2 场景选择决策树

```
是否需要即时撤销能力？
├─ 是 → 有状态会话（或 JWT + 黑名单）
└─ 否 → 继续判断
    │
    是否是微服务架构？
    ├─ 是 → 无状态会话（JWT）
    └─ 否 → 继续判断
        │
        是否需要水平扩展？
        ├─ 是 → 无状态会话（JWT）
        └─ 否 → 有状态会话（Session）
```

---

## 6.4 跨域认证与 CORS 配置

### 6.4.1 关键响应头

| 响应头 | 说明 | 示例 |
|--------|------|------|
| `Access-Control-Allow-Origin` | 允许的源 | `https://frontend.com` |
| `Access-Control-Allow-Methods` | 允许的方法 | `GET, POST, PUT` |
| `Access-Control-Allow-Headers` | 允许的请求头 | `Authorization, Content-Type` |
| `Access-Control-Allow-Credentials` | 是否允许携带凭证 | `true` |

### 6.4.2 Node.js Express 配置

```javascript
const cors = require('cors');

app.use(cors({
  origin: 'https://frontend.com',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400
}));
```

---

## 6.5 JWT 在微服务架构中的应用

### 6.5.1 API 网关统一认证架构

```
客户端请求 (携带 JWT Token)
         ↓
┌─────────────────────────────────┐
│         API 网关层               │
│  ├─ 验证 JWT 签名                │
│  ├─ 检查过期时间                 │
│  ├─ 提取用户信息                 │
│  └─ 将用户信息注入请求头         │
└─────────────────────────────────┘
         ↓
┌─────────────────────────────────┐
│         后端微服务               │
│  ├─ 信任网关传递的用户信息       │
│  └─ 基于用户信息执行权限检查     │
└─────────────────────────────────┘
```

### 6.5.2 服务间调用 Token 传递

```javascript
// Order 服务调用 User 服务
async function createOrder(orderData, userToken) {
  const user = await verifyToken(userToken);
  
  const userResponse = await fetch('http://user-service/users/' + user.sub, {
    headers: {
      'Authorization': `Bearer ${userToken}`,
      'X-Service-Token': generateServiceToken('order-service')
    }
  });
  
  return order;
}
```

---

## 6.6 本章小结

1. **前端存储方案**：LocalStorage、Cookie、Memory 三种方案的安全性对比与混合模式推荐
2. **后端实现**：Node.js、Java、Python 三种主流语言的完整代码示例
3. **会话模式选择**：无状态 vs 有状态的决策树与混合模式
4. **跨域认证**：CORS 配置详解与常见问题排查
5. **微服务应用**：API 网关统一认证架构与服务间 Token 传递

### 关键引用来源

1. **MDN Web Docs - CORS**: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
2. **Spring Cloud Gateway Reference**: https://docs.spring.io/spring-cloud-gateway/reference/
3. **OWASP JWT Storage Recommendations**: https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html

---

## 7. 常见误区与面试问题

> **本章目标**：澄清 JWT 开发中的 5 大常见误区，掌握 15 道高频面试题，避免生产环境踩坑

---

## 7.1 误区 1：JWT = 加密？可以存储敏感数据？

### 7.1.1 误区澄清

**错误认知**：
> "JWT 是加密的，所以可以在 Payload 中存储密码、信用卡号等敏感信息。"

**正确理解**：
> **JWT 默认是签名（防篡改），而非加密。Payload 是明文，任何人都可以解码查看。**

### 7.1.2 JWT vs JWE：签名与加密的区别

```mermaid
graph TB
    subgraph JWT_JWS[JWT/JWS - 签名令牌]
        A1[Header.Payload.Signature] --> A2[任何人可解码 Header 和 Payload]
        A2 --> A3[签名确保未被篡改]
        A3 --> A4[❌ 不保密内容]
    end
    
    subgraph JWT_JWE[JWE - 加密令牌]
        B1[加密的 JWT] --> B2[需要密钥才能解密]
        B2 --> B3[✅ 保密内容]
    end
    
    style JWT_JWS fill:#F0AD4E,color:#fff
    style JWT_JWE fill:#5CB85C,color:#fff
```

**对比表**：

| 特性 | JWT/JWS（默认） | JWE（加密 JWT） |
|------|----------------|----------------|
| **内容可见性** | 明文（Base64URL 可解码） | 密文（需密钥解密） |
| **完整性** | ✅ 有签名保护 | ✅ 有加密保护 |
| **机密性** | ❌ 无 | ✅ 有 |
| **使用场景** | 身份认证、授权 | 敏感数据传输 |
| **性能开销** | 低 | 中（加密/解密开销） |
| **普及度** | ✅✅✅ 广泛使用 | ⚠️ 较少使用 |

### 7.1.3 实际解码演示

**示例 Token**：
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwicGFzc3dvcmQiOiJzZWNyZXQxMjMifQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

**任何人都可以在线解码**（使用 jwt.io 或 Base64URL 解码工具）：

```json
// Header
{
  "alg": "HS256",
  "typ": "JWT"
}

// Payload
{
  "sub": "1234567890",
  "name": "John Doe",
  "password": "secret123"  // ❌ 明文暴露！
}
```

### 7.1.4 正确做法

**❌ 错误示例**：
```javascript
// 绝对禁止：在 Payload 存储敏感信息
const token = jwt.sign({
  userId: user.id,
  password: user.password,      // ❌ 明文密码
  creditCard: '4111-1111-1111-1111', // ❌ 信用卡号
  ssn: '123-45-6789'            // ❌ 身份证号
}, secret);
```

**✅ 正确示例**：
```javascript
// 推荐：仅存储非敏感标识
const token = jwt.sign({
  userId: user.id,        // 内部用户 ID（非邮箱/手机号）
  role: user.role,        // 用户角色
  scope: ['read', 'write'] // 权限范围
}, secret);
```

**如需加密敏感数据**：
1. 使用 **JWE（RFC 7516）** 格式
2. 或者在应用层加密后再放入 Payload

---

## 7.2 误区 2：JWT 不能登出？一旦签发就无法撤销？

### 7.2.1 误区澄清

**错误认知**：
> "JWT 是无状态的，所以一旦签发就无法撤销，用户不能登出。"

**正确理解**：
> **JWT 可以通过黑名单、短有效期 + Refresh Token 轮换等方案实现撤销。**

### 7.2.2 撤销方案对比

| 方案 | 原理 | 实时性 | 性能影响 | 推荐场景 |
|------|------|--------|----------|----------|
| **Token 黑名单** | 将 JTI 存入 Redis | ✅ 立即生效 | ⚠️ 每次验证查 Redis | 高安全需求 |
| **短有效期** | Access Token 15 分钟 | ⚠️ 最多等 15 分钟 | ✅ 无影响 | 一般场景 |
| **Refresh Token 轮换** | 每次刷新时更换新 Token | ✅ 检测盗用 | ⚠️ 需存储状态 | 金融/敏感系统 |

### 7.2.3 完整登出实现

```javascript
// 1. 用户点击登出
app.post('/logout', authMiddleware, async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  
  // 2. 提取 JTI 并加入黑名单
  const payload = jwt.decode(token);
  const ttl = payload.exp - Math.floor(Date.now() / 1000);
  
  await redis.setEx(`blacklist:${payload.jti}`, ttl, 'revoked');
  
  // 3. 清除 Refresh Token
  res.clearCookie('refreshToken');
  
  res.json({ message: '登出成功' });
});

// 4. 验证中间件检查黑名单
async function authMiddleware(req, res, next) {
  const token = extractToken(req);
  const payload = jwt.decode(token);
  
  // 检查黑名单
  const isBlacklisted = await redis.get(`blacklist:${payload.jti}`);
  if (isBlacklisted) {
    return res.status(401).json({ error: 'Token 已撤销' });
  }
  
  // 正常验证签名
  jwt.verify(token, secret, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Token 无效' });
    req.user = decoded;
    next();
  });
}
```

---

## 7.3 误区 3：JWT 一定比 Session 好？

### 7.3.1 误区澄清

**错误认知**：
> "JWT 是新技术，在所有场景下都比 Session 更好。"

**正确理解**：
> **JWT 和 Session 各有优劣，应根据具体场景选择。**

### 7.3.2 场景选择决策树

```mermaid
flowchart TD
    Start[选择认证方案] --> Q1{是否需要即时撤销？}
    
    Q1 -->|是 | Q2{是否是微服务？}
    Q1 -->|否 | Q3{是否需要跨域？}
    
    Q2 -->|是 | JWT[JWT + 黑名单]
    Q2 -->|否 | Session[Session-Cookie]
    
    Q3 -->|是 | JWT2[JWT]
    Q3 -->|否 | Q4{是否移动端？}
    
    Q4 -->|是 | JWT3[JWT]
    Q4 -->|否 | Session2[Session-Cookie<br/>简单可靠]
    
    style JWT fill:#5CB85C,color:#fff
    style JWT2 fill:#5CB85C,color:#fff
    style JWT3 fill:#5CB85C,color:#fff
    style Session fill:#4A90D9,color:#fff
    style Session2 fill:#4A90D9,color:#fff
```

### 7.3.3 Session 更优的场景

| 场景 | 原因 |
|------|------|
| **单体应用** | 无需跨服务共享 Session |
| **高安全系统** | 需要即时撤销会话（如银行系统） |
| **内部管理后台** | 用户量少，Session 存储压力小 |
| **传统企业系统** | 技术栈老旧，迁移成本高 |

### 7.3.4 JWT 更优的场景

| 场景 | 原因 |
|------|------|
| **微服务架构** | 天然支持跨服务认证 |
| **单点登录（SSO）** | 跨域认证支持优秀 |
| **移动端 App** | Token 管理比 Cookie 更方便 |
| **第三方开放平台** | OAuth 2.0 + JWT 组合标准 |

---

## 7.4 误区 4：JWT 可以永久有效？

### 7.4.1 误区澄清

**错误认知**：
> "设置永不过期的 JWT Token，用户只需登录一次。"

**正确理解**：
> **JWT 不应设置永不过期时间。正确做法是使用双 Token 模式（Access Token 短有效期 + Refresh Token 长有效期）。**

### 7.4.2 永久有效 Token 的风险

| 风险 | 描述 | 后果 |
|------|------|------|
| **Token 泄露** | XSS/中间人攻击窃取 Token | 攻击者永久拥有访问权限 |
| **权限变更** | 用户角色/权限修改 | 旧 Token 仍保留原权限 |
| **密码泄露** | 用户密码被盗 | 攻击者可长期使用账户 |
| **设备丢失** | 手机/电脑丢失 | 拾取者可永久访问账户 |

### 7.4.3 推荐过期策略

```javascript
// ✅ 推荐：双 Token 模式
const TOKEN_CONFIG = {
  access: {
    expiresIn: '15m',    // 15 分钟
    maxRenewals: 10,     // 最多刷新 10 次（可选）
  },
  refresh: {
    expiresIn: '7d',     // 7 天
    rotateOnRefresh: true, // 每次刷新轮换
    absoluteExpiry: '30d'  // 绝对过期时间（从签发起 30 天）
  }
};
```

---

## 7.5 误区 5：JWT 适合所有认证场景？

### 7.5.1 误区澄清

**错误认知**：
> "JWT 是万能解决方案，应在所有场景使用。"

**正确理解**：
> **JWT 有适用边界，某些场景下传统方案更优。**

### 7.5.2 不推荐使用 JWT 的场景

| 场景 | 原因 | 推荐方案 |
|------|------|----------|
| **高实时撤销需求** | 黑名单增加存储开销 | Session-Cookie |
| **超大规模用户** | Token 体积大，带宽消耗高 | opaque token + 查库 |
| **极度敏感业务** | 需要强控制力 | 有状态会话 |
| **简单单体应用** | 增加复杂度，无明显收益 | Session-Cookie |

### 7.5.3 混合模式（推荐）

```mermaid
graph TB
    subgraph 前端 [前端认证]
        A[登录请求] --> B[返回 JWT Access Token]
        B --> C[存储在 Memory]
        C --> D[API 请求携带 Token]
    end
    
    subgraph 后端 [后端会话]
        D --> E[API 网关验证 JWT]
        E --> F[提取用户 ID]
        F --> G[创建后端 Session]
        G --> H[Session 存储用户状态]
    end
    
    style 前端 fill:#4A90D9,color:#fff
    style 后端 fill:#5CB85C,color:#fff
```

---

## 7.6 面试高频问题 15 连问

### 7.6.1 基础概念篇

**Q1：请解释 JWT 是什么，它由哪几部分组成？**

**参考答案**：
> JWT（JSON Web Token）是 RFC 7519 标准定义的紧凑、自包含的令牌格式，用于在各方之间安全传输 JSON 声明。
> 
> JWT 由三部分组成：
> 1. **Header**：元数据（算法 alg、类型 typ）
> 2. **Payload**：声明（用户信息、过期时间等）
> 3. **Signature**：签名（防篡改）
> 
> 格式：`Header.Payload.Signature`

---

**Q2：JWT 和 Session-Cookie 的主要区别是什么？**

**参考答案**：
> | 维度 | Session-Cookie | JWT |
> |------|---------------|-----|
> | 存储位置 | 服务器内存/Redis | 客户端 |
> | 状态管理 | 有状态 | 无状态 |
> | 扩展性 | 需要 Session 共享 | 天然支持分布式 |
> | 跨域支持 | 困难 | 优秀 |
> | 撤销机制 | 简单（删除 Session） | 困难（需黑名单） |

---

**Q3：JWT 签名的作用是什么？**

**参考答案**：
> JWT 签名承担三个核心职责：
> 1. **完整性保护**：确保 Token 未被篡改
> 2. **身份认证**：验证 Token 确实由可信签发方生成
> 3. **不可否认性**：签发方无法否认其签发的 Token（非对称签名场景）

---

**Q4：HS256 和 RS256 有什么区别？**

**参考答案**：
> | 对比 | HS256 | RS256 |
> |------|-------|-------|
> | 类型 | 对称加密 | 非对称加密 |
> | 密钥 | 双方共享同一密钥 | 私钥签名，公钥验证 |
> | 安全性 | 密钥泄露风险高 | 私钥可严格保密 |
> | 适用场景 | 单服务/内部系统 | 微服务/多客户端 |
> | 性能 | 较快 | 稍慢 |

---

### 7.6.2 安全实践篇

**Q5：JWT Payload 中可以存储密码吗？为什么？**

**参考答案**：
> **绝对不可以。**
> 
> 原因：
> 1. JWT 默认是签名而非加密，Payload 是明文（Base64URL 可解码）
> 2. 任何拿到 Token 的人都可以解码查看内容
> 3. 密码泄露会导致账户被盗用
> 
> 正确做法：仅存储非敏感标识（用户 ID、角色、权限范围等）

---

**Q6：如何撤销一个已签发的 JWT Token？**

**参考答案**：
> JWT 撤销有三种主流方案：
> 
> 1. **Token 黑名单**：将 Token 的 JTI 存入 Redis，验证时检查是否在黑名单
>    - 优点：立即生效
>    - 缺点：需查询存储，牺牲无状态优势
> 
> 2. **短有效期**：设置较短的 exp（如 15 分钟），等待自然过期
>    - 优点：无额外开销
>    - 缺点：最多等待 15 分钟
> 
> 3. **Refresh Token 轮换**：每次刷新时生成新 Token，旧 Token 加入黑名单
>    - 优点：检测盗用
>    - 缺点：实现复杂

---

**Q7：JWT 的 none 算法攻击是什么？如何防御？**

**参考答案**：
> **攻击原理**：攻击者将 Header 中的 `alg` 改为 `none`，并移除签名部分，构造无签名的伪造 Token。部分库默认接受 none 算法，导致绕过验证。
> 
> **防御措施**：
> 1. 明确指定允许的算法白名单
> 2. 拒绝 `alg: none` 的 Token
> 3. 使用强类型验证库（如 jsonwebtoken）
> 
> ```javascript
> // 正确：明确指定算法
> jwt.verify(token, secret, { algorithms: ['HS256', 'RS256'] });
> ```

---

**Q8：Access Token 和 Refresh Token 为什么需要分开？**

**参考答案**：
> 双 Token 模式解决**安全性 vs 用户体验**的矛盾：
> 
> - **Access Token**：短有效期（15 分钟），用于 API 请求
>   - 泄露后影响有限（最多 15 分钟）
> 
> - **Refresh Token**：长有效期（7 天），仅用于刷新 Access Token
>   - 严格保管（HttpOnly Cookie）
>   - 支持轮换和撤销
> 
> 单令牌模式无法兼顾：短有效期→频繁登录；长有效期→泄露风险大。

---

**Q9：如何防止 JWT 重放攻击？**

**参考答案**：
> 防止重放攻击的三种方案：
> 
> 1. **短有效期**：设置较短的 exp（如 15 分钟）
> 2. **jti + 黑名单**：使用 jti 唯一标识，服务端记录已使用的 jti
> 3. **Nonce + 时间戳**：每次请求携带随机数 + 时间戳，服务端验证唯一性
> 
> 推荐组合：短有效期 + Refresh Token 轮换（检测盗用）

---

### 7.6.3 实战应用篇

**Q10：JWT 在前端应该如何存储？LocalStorage 安全吗？**

**参考答案**：
> | 存储方案 | XSS 风险 | CSRF 风险 | 推荐度 |
> |----------|----------|-----------|--------|
> | LocalStorage | ❌ 高（可被 JS 读取） | ✅ 无 | 🟡 中 |
> | HttpOnly Cookie | ✅ 低（JS 无法访问） | ⚠️ 需 SameSite | 🟢 高 |
> | Memory（变量） | ✅ 低（刷新即失） | ✅ 无 | 🟢 高 |
> 
> **推荐方案**：混合模式
> - Access Token 存 Memory
> - Refresh Token 存 HttpOnly Cookie

---

**Q11：如果 JWT 密钥泄露了，应该如何应急响应？**

**参考答案**：
> 应急响应流程：
> 
> 1. **确认泄露范围**：审计代码库、日志、访问记录
> 2. **立即轮换密钥**：生成新密钥，更新 KMS/环境变量
> 3. **撤销旧密钥签发的所有 Token**：将旧密钥 KID 关联的 Token 全部加入黑名单
> 4. **通知相关方**：告知用户重新登录，通知合作服务方
> 5. **事后审计**：分析泄露原因，加强密钥管理

---

**Q12：如何设计 JWT 的密钥轮换方案？**

**参考答案**：
> 平滑密钥轮换方案（KID + 多密钥仓库）：
> 
> 1. **Header 添加 kid 字段**：
>    ```json
>    { "alg": "RS256", "typ": "JWT", "kid": "key-2024-q1" }
>    ```
> 
> 2. **维护密钥仓库**：同时保留新旧两个密钥的公钥
> 
> 3. **验证时根据 kid 选择密钥**：
>    ```javascript
>    const publicKey = keyStore[header.kid];
>    jwt.verify(token, publicKey);
>    ```
> 
> 4. **定期轮换**：每 3-6 个月生成新密钥，旧密钥逐步淘汰

---

**Q13：微服务架构下，JWT 如何在服务间传递？**

**参考答案**：
> 微服务 Token 传递三种模式：
> 
> 1. **透传模式**：网关验证 JWT 后，将原始 Token 透传给后端服务
>    - 优点：后端可直接获取用户信息
>    - 缺点：需验证签名
> 
> 2. **提取模式**：网关验证后提取用户 ID，以内部 Header 传递给后端
>    - 优点：后端无需处理 JWT
>    - 缺点：丢失部分用户信息
> 
> 3. **转换模式**：网关将外部 JWT 转换为内部服务 Token
>    - 优点：内外隔离
>    - 缺点：增加转换开销
> 
> 推荐：API 网关统一认证 + 提取模式（后端服务信任网关）

---

### 7.6.4 高级进阶篇

**Q14：JWT 的 payload 过大会有什么问题？如何优化？**

**参考答案**：
> **问题**：
> 1. **带宽消耗**：每次请求都携带大 Payload
> 2. **URL 长度限制**：某些场景下 URL 有长度限制（如 2048 字符）
> 3. **数据库存储**：日志/审计记录占用更多空间
> 
> **优化方案**：
> 1. **最小化声明**：仅存储必要信息（用户 ID、角色）
> 2. **使用缩写**：`uid` 代替 `user_id`，`r` 代替 `role`
> 3. **引用模式**：存储资源 ID 而非完整数据
> 4. **压缩算法**：部分库支持压缩 Payload（需权衡性能）

---

**Q15：什么是 JWK？为什么需要 JWK？**

**参考答案**：
> **JWK（JSON Web Key，RFC 7517）** 是一种以 JSON 格式表示加密密钥的标准。
> 
> **为什么需要 JWK**：
> 1. **标准化密钥格式**：统一密钥的表示和交换方式
> 2. **支持密钥元数据**：包含 `kid`（密钥 ID）、`use`（用途）等信息
> 3. **密钥发现协议**：通过 `.well-known/jwks.json` 端点公开发布公钥
> 4. **多密钥管理**：JWKS（JWK Set）可同时表示多个密钥
> 
> **JWK 示例**：
> ```json
> {
>   "kty": "RSA",
>   "kid": "key-2024-q1",
>   "use": "sig",
>   "alg": "RS256",
>   "n": "0vx7agoebGcQSuuPiLJXZptN...",
>   "e": "AQAB"
> }
> ```

---

## 7.7 本章小结

### 5 大误区澄清

| 误区 | 正确理解 |
|------|----------|
| JWT = 加密？ | JWT 是签名（防篡改），Payload 是明文 |
| JWT 不能登出？ | 可通过黑名单、短有效期 + Refresh Token 实现撤销 |
| JWT 一定比 Session 好？ | 各有优劣，根据场景选择 |
| JWT 可以永久有效？ | 不应设置永不过期，使用双 Token 模式 |
| JWT 适合所有场景？ | 有适用边界，某些场景传统方案更优 |

### 15 道面试题核心考点

| 考点分类 | 问题数量 | 核心知识点 |
|----------|----------|------------|
| 基础概念 | 4 题 | JWT 结构、Session 对比、签名算法 |
| 安全实践 | 5 题 | 敏感数据存储、撤销机制、none 攻击、双 Token、重放攻击 |
| 实战应用 | 4 题 | 前端存储、应急响应、密钥轮换、微服务传递 |
| 高级进阶 | 2 题 | Payload 优化、JWK 标准 |

### 关键引用来源

1. **RFC 7519** - JSON Web Token (JWT)：https://www.rfc-editor.org/rfc/rfc7519
2. **RFC 7516** - JSON Web Encryption (JWE)：https://www.rfc-editor.org/rfc/rfc7516
3. **RFC 7517** - JSON Web Key (JWK)：https://www.rfc-editor.org/rfc/rfc7517
4. **OWASP JWT Security Cheat Sheet**：https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html
5. **Auth0 JWT Handbook**：https://auth0.com/resources/ebooks/jwt-handbook

---

## 8. 实战案例与检查清单

> **本章目标**：掌握 JWT 在生产环境的完整实现，包括用户认证系统、API 网关中间件、刷新令牌轮换、微服务 Token 传递，以及部署前的安全检查清单

---

## 8.1 用户认证系统完整实现

### 8.1.1 系统架构概览

```mermaid
sequenceDiagram
    participant U as 用户 (前端)
    participant GW as API 网关
    participant AS as 认证服务
    participant RS as 资源服务
    participant DB as 数据库/Redis
    
    U->>GW: 1. 登录请求
    GW->>AS: 2. 转发登录请求
    AS->>DB: 3. 验证用户凭证
    AS->>AS: 4. 生成 JWT (Access + Refresh)
    AS-->>U: 5. 返回 Token 对
    
    Note over U,RS: 访问受保护资源
    U->>GW: 6. API 请求 (带 Access Token)
    GW->>GW: 7. 验证 JWT 签名
    GW->>RS: 8. 转发请求 (带用户上下文)
    RS->>DB: 9. 查询业务数据
    RS-->>U: 10. 返回响应
    
    Note over U,AS: Access Token 过期
    U->>GW: 11. API 请求 (Token 过期)
    GW-->>U: 12. 返回 401
    U->>AS: 13. 刷新请求 (带 Refresh Token)
    AS->>AS: 14. 轮换 Refresh Token
    AS-->>U: 15. 返回新 Token 对
```

### 8.1.2 后端实现（Node.js + Express）

**项目结构**：
```
auth-service/
├── src/
│   ├── controllers/
│   │   └── auth.controller.js    # 认证控制器
│   ├── middleware/
│   │   └── jwt.middleware.js     # JWT 验证中间件
│   ├── services/
│   │   └── jwt.service.js        # JWT 服务
│   ├── config/
│   │   └── jwt.config.js         # JWT 配置
│   └── utils/
│       └── redis.js              # Redis 连接
├── .env                          # 环境变量
└── package.json
```

**1. JWT 配置（config/jwt.config.js）**：
```javascript
module.exports = {
  // Access Token 配置
  access: {
    secret: process.env.JWT_ACCESS_SECRET,
    algorithm: 'HS256',
    expiresIn: '15m',
    issuer: 'https://auth.myapp.com',
    audience: 'https://api.myapp.com',
  },
  
  // Refresh Token 配置
  refresh: {
    secret: process.env.JWT_REFRESH_SECRET,
    algorithm: 'HS256',
    expiresIn: '7d',
    issuer: 'https://auth.myapp.com',
  },
  
  // 安全配置
  security: {
    clockSkew: '60s',  // 时钟偏移容错
    blacklistPrefix: 'jwt:blacklist:',
  },
};
```

**2. JWT 服务（services/jwt.service.js）**：
```javascript
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const redis = require('../utils/redis');
const config = require('../config/jwt.config');

class JwtService {
  /**
   * 生成 Token 对
   */
  generateTokenPair(user) {
    const now = Math.floor(Date.now() / 1000);
    const jti = crypto.randomUUID();
    
    // Access Token
    const accessToken = jwt.sign(
      {
        sub: String(user.id),
        email: user.email,
        role: user.role,
        type: 'access',
        iat: now,
        jti: jti,
      },
      config.access.secret,
      {
        algorithm: config.access.algorithm,
        expiresIn: config.access.expiresIn,
        issuer: config.access.issuer,
        audience: config.access.audience,
      }
    );
    
    // Refresh Token（不同的 jti）
    const refreshJti = crypto.randomUUID();
    const refreshToken = jwt.sign(
      {
        sub: String(user.id),
        type: 'refresh',
        jti: refreshJti,
        iat: now,
      },
      config.refresh.secret,
      {
        algorithm: config.refresh.algorithm,
        expiresIn: config.refresh.expiresIn,
        issuer: config.refresh.issuer,
      }
    );
    
    // 存储 Refresh Token 的 jti 到 Redis（用于轮换追踪）
    redis.setEx(
      `user:${user.id}:refresh_jti`,
      7 * 24 * 60 * 60,
      refreshJti
    );
    
    return {
      accessToken,
      refreshToken,
      expiresIn: 900, // 15 分钟（秒）
      tokenType: 'Bearer',
    };
  }
  
  /**
   * 验证 Access Token
   */
  verifyAccessToken(token) {
    return jwt.verify(token, config.access.secret, {
      algorithms: [config.access.algorithm],
      issuer: config.access.issuer,
      audience: config.access.audience,
      clockSkew: config.security.clockSkew,
    });
  }
  
  /**
   * 验证 Refresh Token
   */
  async verifyRefreshToken(token) {
    try {
      const decoded = jwt.verify(token, config.refresh.secret, {
        algorithms: [config.refresh.algorithm],
        issuer: config.refresh.issuer,
        clockSkew: config.security.clockSkew,
      });
      
      // 检查令牌类型
      if (decoded.type !== 'refresh') {
        throw new Error('Invalid token type');
      }
      
      // 检查是否在黑名单
      const isBlacklisted = await redis.get(
        `${config.security.blacklistPrefix}${decoded.jti}`
      );
      if (isBlacklisted) {
        throw new Error('Token has been revoked');
      }
      
      return decoded;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new Error('Refresh token has expired');
      }
      throw error;
    }
  }
  
  /**
   * 轮换 Refresh Token
   */
  async rotateRefreshToken(oldToken) {
    const decoded = await this.verifyRefreshToken(oldToken);
    
    // 检查是否重复使用（检测盗用）
    const reused = await redis.get(`refresh:reused:${decoded.jti}`);
    if (reused) {
      // 发现盗用！撤销该用户的所有 Refresh Token
      await this.revokeAllUserTokens(decoded.sub);
      throw new Error('Refresh token reuse detected - possible theft');
    }
    
    // 标记旧 Token 为"已使用"
    await redis.setEx(
      `refresh:reused:${decoded.jti}`,
      7 * 24 * 60 * 60,
      'true'
    );
    
    // 将旧 Token 加入黑名单
    const ttl = decoded.exp - Math.floor(Date.now() / 1000);
    if (ttl > 0) {
      await redis.setEx(
        `${config.security.blacklistPrefix}${decoded.jti}`,
        ttl,
        'revoked'
      );
    }
    
    // 生成新的 Token 对
    return this.generateTokenPair({ id: decoded.sub });
  }
  
  /**
   * 撤销用户所有 Token
   */
  async revokeAllUserTokens(userId) {
    const refreshJti = await redis.get(`user:${userId}:refresh_jti`);
    if (refreshJti) {
      await redis.setEx(
        `${config.security.blacklistPrefix}${refreshJti}`,
        7 * 24 * 60 * 60,
        'revoked'
      );
    }
    
    // 触发安全告警
    await this.sendSecurityAlert(userId, 'REFRESH_TOKEN_REUSE_DETECTED');
  }
  
  /**
   * 发送安全告警
   */
  async sendSecurityAlert(userId, eventType) {
    // 实现告警逻辑（邮件、短信、Slack 等）
    console.warn(`[SECURITY ALERT] User ${userId}: ${eventType}`);
  }
  
  /**
   * 登出（撤销 Token）
   */
  async revokeToken(token) {
    try {
      const payload = jwt.decode(token);
      if (!payload || !payload.exp) return false;
      
      const ttl = payload.exp - Math.floor(Date.now() / 1000);
      if (ttl <= 0) return false;
      
      await redis.setEx(
        `${config.security.blacklistPrefix}${payload.jti}`,
        ttl,
        'revoked'
      );
      
      return true;
    } catch (error) {
      return false;
    }
  }
}

module.exports = new JwtService();
```

**3. JWT 中间件（middleware/jwt.middleware.js）**：
```javascript
const jwtService = require('../services/jwt.service');
const redis = require('../utils/redis');
const config = require('../config/jwt.config');

/**
 * JWT 验证中间件
 */
async function authMiddleware(req, res, next) {
  try {
    // 1. 从 Authorization 头提取 Token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Missing or invalid Authorization header',
        code: 'MISSING_AUTH_HEADER',
      });
    }
    
    const token = authHeader.split(' ')[1];
    
    // 2. 检查黑名单（快速失败）
    const payload = jwtService.decode(token);
    if (payload && payload.jti) {
      const isBlacklisted = await redis.get(
        `${config.security.blacklistPrefix}${payload.jti}`
      );
      if (isBlacklisted) {
        return res.status(401).json({
          error: 'Token has been revoked',
          code: 'TOKEN_REVOKED',
        });
      }
    }
    
    // 3. 验证签名和声明
    const decoded = jwtService.verifyAccessToken(token);
    
    // 4. 将用户信息附加到请求对象
    req.user = {
      id: decoded.sub,
      email: decoded.email,
      role: decoded.role,
      jti: decoded.jti,
    };
    
    next();
  } catch (error) {
    // 详细错误处理
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Access token has expired',
        code: 'TOKEN_EXPIRED',
        expiredAt: error.expiredAt,
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Invalid token',
        code: 'INVALID_TOKEN',
      });
    }
    
    return res.status(401).json({
      error: 'Authentication failed',
      code: 'AUTH_FAILED',
    });
  }
}

/**
 * 可选权限检查中间件
 */
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Insufficient permissions',
        required: allowedRoles,
        current: req.user.role,
      });
    }
    
    next();
  };
}

module.exports = { authMiddleware, requireRole };
```

**4. 认证控制器（controllers/auth.controller.js）**：
```javascript
const bcrypt = require('bcrypt');
const jwtService = require('../services/jwt.service');
const db = require('../utils/db');

/**
 * 用户登录
 */
async function login(req, res) {
  try {
    const { email, password } = req.body;
    
    // 1. 验证输入
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    
    // 2. 查询用户
    const user = await db.users.findOne({ where: { email } });
    if (!user) {
      // 模糊错误信息（防止用户名枚举）
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // 3. 验证密码
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // 4. 检查账户状态
    if (user.status !== 'active') {
      return res.status(403).json({ error: 'Account is disabled' });
    }
    
    // 5. 生成 Token 对
    const tokens = jwtService.generateTokenPair(user);
    
    // 6. 设置 Refresh Token 到 HttpOnly Cookie
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 天
    });
    
    // 7. 返回 Access Token
    res.json({
      accessToken: tokens.accessToken,
      expiresIn: tokens.expiresIn,
      tokenType: tokens.tokenType,
    });
    
    // 8. 记录登录日志
    await db.auditLogs.create({
      userId: user.id,
      event: 'LOGIN_SUCCESS',
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * 刷新 Token
 */
async function refreshToken(req, res) {
  try {
    const refreshToken = req.cookies.refreshToken;
    
    if (!refreshToken) {
      return res.status(401).json({ error: 'Missing refresh token' });
    }
    
    // 轮换 Refresh Token 并生成新的 Token 对
    const tokens = await jwtService.rotateRefreshToken(refreshToken);
    
    // 设置新的 Refresh Token
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    
    res.json({
      accessToken: tokens.accessToken,
      expiresIn: tokens.expiresIn,
      tokenType: tokens.tokenType,
    });
    
  } catch (error) {
    console.error('Token refresh error:', error);
    
    // 检测盗用时的特殊处理
    if (error.message.includes('reuse detected')) {
      return res.status(403).json({
        error: 'Security alert: Possible token theft detected',
        code: 'TOKEN_REUSE_DETECTED',
      });
    }
    
    res.status(401).json({ error: 'Invalid refresh token' });
  }
}

/**
 * 用户登出
 */
async function logout(req, res) {
  try {
    const accessToken = req.headers.authorization?.split(' ')[1];
    
    if (accessToken) {
      await jwtService.revokeToken(accessToken);
    }
    
    // 清除 Refresh Token
    res.clearCookie('refreshToken');
    
    res.json({ message: 'Logged out successfully' });
    
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { login, refreshToken, logout };
```

**5. 路由定义（routes/auth.routes.js）**：
```javascript
const express = require('express');
const { login, refreshToken, logout } = require('../controllers/auth.controller');
const { authMiddleware } = require('../middleware/jwt.middleware');

const router = express.Router();

router.post('/login', login);
router.post('/refresh', refreshToken);
router.post('/logout', authMiddleware, logout);

module.exports = router;
```

---

## 8.2 API 网关 JWT 校验中间件

### 8.2.1 网关架构设计

在微服务架构中，API 网关承担**统一认证入口**的职责：

```mermaid
graph TB
    Client[客户端请求<br/>带 JWT Token] --> Gateway[API 网关]
    
    subgraph Gateway_Process[网关处理流程]
        Gateway --> CheckAuth{检查认证}
        CheckAuth -->|公开路由 | Direct[直接转发]
        CheckAuth -->|受保护路由 | VerifyJWT[验证 JWT]
        
        VerifyJWT --> CheckSignature{签名验证}
        CheckSignature -->|失败 | Err401[返回 401]
        CheckSignature -->|成功 | CheckExp{检查过期}
        
        CheckExp -->|过期 | Err401_2[返回 401]
        CheckExp -->|未过期 | Extract[提取用户信息]
        
        Extract --> Inject[注入请求头]
        Inject --> Forward[转发后端服务]
    end
    
    Gateway_Process --> Service1[用户服务]
    Gateway_Process --> Service2[订单服务]
    Gateway_Process --> Service3[支付服务]
    
    style Gateway fill:#4A90D9,color:#fff
    style VerifyJWT fill:#5CB85C,color:#fff
    style Forward fill:#5CB85C,color:#fff
    style Err401 fill:#D9534F,color:#fff
    style Err401_2 fill:#D9534F,color:#fff
```

### 8.2.2 Kong 网关 JWT 插件配置

**Kong 是流行的开源 API 网关**，内置 JWT 验证插件：

**1. 安装 Kong（Docker 快速启动）**：
```bash
docker run -d --name kong \
  -e "KONG_DATABASE=off" \
  -e "KONG_DECLARATIVE_CONFIG=/kong.yaml" \
  -e "KONG_PLUGINS=bundled" \
  -p 8000:8000 \
  -p 8443:8443 \
  kong:latest
```

**2. 网关配置（kong.yaml）**：
```yaml
_format_version: "2.1"

services:
  - name: user-service
    url: http://user-service:3000
    routes:
      - name: user-route
        paths: ["/api/users"]
        plugins:
          - name: jwt
            config:
              key_claim_name: kid        # JWT 中存储密钥 ID 的字段
              secret_is_base64: false    # 密钥是否为 Base64 编码
              claims_to_verify: [exp]    # 需要验证的声明
              run: prefight              # 在代理前执行验证
    plugins:
      - name: jwt
        enabled: true

  - name: order-service
    url: http://order-service:3001
    routes:
      - name: order-route
        paths: ["/api/orders"]
        plugins:
          - name: jwt
```

**3. 创建 JWT 凭证（消费者密钥）**：
```bash
# 创建消费者
curl -X POST http://localhost:8001/consumers \
  --data "username=john-doe"

# 为消费者创建 JWT 凭证
curl -X POST http://localhost:8001/consumers/john-doe/jwt \
  --data "key=key-2024-q1" \
  --data "secret=your-secret-key"
```

### 8.2.3 自定义网关中间件（Node.js）

**如果使用 Express 作为 API 网关**：

```javascript
// middleware/gateway-auth.middleware.js
const jwt = require('jsonwebtoken');
const redis = require('redis');

const redisClient = redis.createClient();

// 公钥仓库（支持多密钥轮换）
const publicKeyStore = {
  'key-2024-q1': process.env.JWT_PUBLIC_KEY_Q1,
  'key-2024-q2': process.env.JWT_PUBLIC_KEY_Q2,
};

/**
 * API 网关 JWT 验证中间件
 */
async function gatewayAuthMiddleware(req, res, next) {
  // 1. 检查是否是公开路由
  const publicRoutes = ['/health', '/api/public/', '/api/auth/login'];
  if (publicRoutes.some(route => req.path.startsWith(route))) {
    return next();
  }
  
  try {
    // 2. 提取 JWT Token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Missing or invalid Authorization header',
      });
    }
    
    const token = authHeader.split(' ')[1];
    
    // 3. 解码 Header 获取 kid
    const decodedHeader = jwt.decode(token, { complete: true });
    if (!decodedHeader || !decodedHeader.header) {
      return res.status(401).json({ error: 'Invalid token format' });
    }
    
    const kid = decodedHeader.header.kid;
    const publicKey = publicKeyStore[kid];
    
    if (!publicKey) {
      return res.status(401).json({
        error: 'Unknown key ID',
        code: 'UNKNOWN_KID',
      });
    }
    
    // 4. 验证签名
    const payload = jwt.verify(token, publicKey, {
      algorithms: ['RS256'],
      issuer: 'https://auth.myapp.com',
      audience: 'https://api.myapp.com',
      clockSkew: 60,
    });
    
    // 5. 检查黑名单（可选）
    const isBlacklisted = await redisClient.get(
      `jwt:blacklist:${payload.jti}`
    );
    if (isBlacklisted) {
      return res.status(401).json({ error: 'Token revoked' });
    }
    
    // 6. 注入用户信息到请求头（传递给后端服务）
    req.headers['x-user-id'] = payload.sub;
    req.headers['x-user-email'] = payload.email;
    req.headers['x-user-role'] = payload.role;
    req.headers['x-jwt-payload'] = JSON.stringify(payload);
    
    // 7. （可选）存储用户信息到 request 对象
    req.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      permissions: payload.permissions || [],
    };
    
    next();
    
  } catch (error) {
    console.error('Gateway auth error:', error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token expired',
        expiredAt: error.expiredAt,
      });
    }
    
    return res.status(401).json({
      error: 'Authentication failed',
      message: error.message,
    });
  }
}

module.exports = gatewayAuthMiddleware;
```

### 8.2.4 网关转发配置（Express + HTTP 代理）

```javascript
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const gatewayAuthMiddleware = require('./middleware/gateway-auth.middleware');

const app = express();

// 应用 JWT 验证中间件
app.use(gatewayAuthMiddleware);

// 用户服务代理
app.use('/api/users', createProxyMiddleware({
  target: 'http://user-service:3000',
  changeOrigin: true,
  onProxyReq: (proxyReq, req, res) => {
    // 传递用户信息到后端服务
    proxyReq.setHeader('x-user-id', req.headers['x-user-id']);
    proxyReq.setHeader('x-user-email', req.headers['x-user-email']);
  },
}));

// 订单服务代理
app.use('/api/orders', createProxyMiddleware({
  target: 'http://order-service:3001',
  changeOrigin: true,
}));

// 支付服务代理
app.use('/api/payments', createProxyMiddleware({
  target: 'http://payment-service:3002',
  changeOrigin: true,
}));

app.listen(8000, () => {
  console.log('API Gateway running on port 8000');
});
```

---

## 8.3 微服务间 Token 传递方案

### 8.3.1 三种传递模式对比

| 模式 | 原理 | 优点 | 缺点 | 适用场景 |
|------|------|------|------|----------|
| **透传模式** | 网关验证后将原始 Token 传递给后端 | 后端可直接获取完整用户信息 | 后端需信任网关 | 推荐默认方案 |
| **提取模式** | 网关提取用户 ID 后以内部 Header 传递 | 后端无需处理 JWT，简化逻辑 | 丢失部分用户信息 | 内部服务信任链完善 |
| **转换模式** | 网关将外部 JWT 转换为内部服务 Token | 内外隔离，安全性高 | 增加转换开销 | 高安全需求场景 |

### 8.3.2 透传模式实现（推荐）

**网关层（提取用户信息并注入 Header）**：
```javascript
// 网关验证 JWT 后，注入用户信息到请求头
req.headers['x-user-id'] = payload.sub;
req.headers['x-user-email'] = payload.email;
req.headers['x-user-role'] = payload.role;

// 同时透传原始 Token（可选，用于服务间调用下游）
req.headers['x-forwarded-authorization'] = authHeader;
```

**后端服务（Order 服务）实现**：
```javascript
// middleware/user-context.middleware.js
function userContextMiddleware(req, res, next) {
  // 从网关注入的 Header 提取用户信息
  const userId = req.headers['x-user-id'];
  const userEmail = req.headers['x-user-email'];
  const userRole = req.headers['x-user-role'];
  
  if (!userId) {
    // 如果是内部服务调用，允许无用户上下文
    return next();
  }
  
  req.user = {
    id: userId,
    email: userEmail,
    role: userRole,
  };
  
  next();
}

// 调用 User 服务时传递 Token
async function getUserProfile(userId, forwardedToken) {
  const response = await fetch(`http://user-service/users/${userId}`, {
    headers: {
      // 透传原始 Token（用于 User 服务验证）
      'Authorization': forwardedToken,
      // 或传递网关注入的用户信息
      'x-user-id': req.headers['x-user-id'],
    },
  });
  
  return response.json();
}
```

### 8.3.3 服务间调用的服务令牌（Service Token）

**场景**：定时任务、后台服务等无用户上下文的场景

```javascript
// 生成服务间调用的专用 Token
function generateServiceToken(serviceName) {
  return jwt.sign(
    {
      sub: `service:${serviceName}`,
      type: 'service',
      scope: ['internal:call'],
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 300, // 5 分钟
    },
    process.env.SERVICE_TOKEN_SECRET,
    { algorithm: 'HS256' }
  );
}

// 服务间调用示例
async function callPaymentService(orderData) {
  const serviceToken = generateServiceToken('order-service');
  
  const response = await fetch('http://payment-service/payments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${serviceToken}`,
      'x-service-name': 'order-service',
    },
    body: JSON.stringify(orderData),
  });
  
  return response.json();
}
```

---

## 8.4 部署前安全检查清单

### 8.4.1 密钥管理检查

- [ ] **密钥未硬编码**：确认密钥存储在环境变量或 KMS 中
- [ ] **密钥强度足够**：
  - [ ] HMAC：至少 256 位（32 字节）
  - [ ] RSA：至少 2048 位
  - [ ] ECDSA：P-256 曲线或更高
- [ ] **密钥轮换计划**：
  - [ ] 已制定轮换周期（HMAC: 30-90 天，RSA/ECDSA: 6-12 个月）
  - [ ] 支持多密钥并行验证（KID + 公钥仓库）
- [ ] **密钥访问控制**：
  - [ ] 仅授权人员/服务可访问密钥
  - [ ] 密钥访问日志已启用

### 8.4.2 Token 配置检查

- [ ] **Access Token 有效期**：
  - [ ] 设置为 15-60 分钟（推荐 15 分钟）
  - [ ] `exp` 声明正确设置
- [ ] **Refresh Token 机制**：
  - [ ] 实现双 Token 模式
  - [ ] Refresh Token 存储在 HttpOnly Cookie
  - [ ] 实现 Refresh Token 轮换
- [ ] **标准声明验证**：
  - [ ] `exp`（过期时间）验证启用
  - [ ] `iss`（签发者）验证启用
  - [ ] `aud`（受众）验证启用
  - [ ] `nbf`（生效时间）验证启用（如使用）
- [ ] **算法配置**：
  - [ ] 明确指定允许的算法白名单
  - [ ] 禁止 `none` 算法
  - [ ] 禁用弱算法（如 HS128）

### 8.4.3 传输安全检查

- [ ] **HTTPS 强制**：
  - [ ] 所有 API 端点强制使用 HTTPS
  - [ ] HTTP 自动重定向到 HTTPS
- [ ] **HSTS 配置**：
  - [ ] `Strict-Transport-Security` 响应头设置
  - [ ] `max-age` 至少 31536000 秒（1 年）
  - [ ] `includeSubDomains` 启用
- [ ] **Cookie 安全属性**：
  - [ ] `Secure` 标志启用（仅 HTTPS 传输）
  - [ ] `HttpOnly` 标志启用（禁止 JS 访问）
  - [ ] `SameSite=Strict` 或 `SameSite=Lax`
- [ ] **CORS 配置**：
  - [ ] `Access-Control-Allow-Origin` 明确指定允许的来源
  - [ ] 不使用通配符 `*`
  - [ ] `Access-Control-Allow-Credentials` 正确配置

### 8.4.4 攻击防御检查

- [ ] **签名验证**：
  - [ ] 所有受保护路由都应用 JWT 验证中间件
  - [ ] 使用 `jwt.verify()` 而非 `jwt.decode()`
- [ ] **算法混淆防御**：
  - [ ] 验证时明确指定 `algorithms` 选项
  - [ ] 拒绝 `alg: none` 的 Token
- [ ] **重放攻击防御**：
  - [ ] 实现 `jti` + 黑名单机制（关键业务）
  - [ ] 或实现 Refresh Token 轮换
- [ ] **XSS 防护**：
  - [ ] 前端实施内容安全策略（CSP）
  - [ ] 输入验证和输出转义
- [ ] **CSRF 防护**：
  - [ ] Cookie 配置 `SameSite` 属性
  - [ ] 关键操作添加 CSRF Token

### 8.4.5 监控与日志检查

- [ ] **认证日志**：
  - [ ] 登录成功/失败日志
  - [ ] Token 刷新日志
  - [ ] 登出日志
- [ ] **安全告警**：
  - [ ] Token 验证失败告警（阈值触发）
  - [ ] Refresh Token 重用检测告警
  - [ ] 异常登录行为检测（异地、多 IP）
- [ ] **审计追踪**：
  - [ ] 关键操作记录用户 ID、时间戳、IP
  - [ ] 日志保留策略（至少 90 天）
- [ ] **监控指标**：
  - [ ] JWT 验证成功率
  - [ ] Token 刷新率
  - [ ] 认证失败次数（按 IP、用户）

### 8.4.6 应急响应检查

- [ ] **密钥泄露预案**：
  - [ ] 密钥轮换流程文档化
  - [ ] 紧急轮换脚本准备
  - [ ] 通知机制（邮件、短信、Slack）
- [ ] **Token 撤销机制**：
  - [ ] 黑名单功能已实现并测试
  - [ ] 支持批量撤销（用户维度）
- [ ] **事故响应流程**：
  - [ ] 事故分级标准定义
  - [ ] 响应责任人明确
  - [ ] 事后复盘流程

---

## 8.5 性能优化建议

### 8.5.1 签名性能对比

| 算法 | 签名耗时（相对值） | 验证耗时（相对值） | Token 长度 |
|------|-------------------|-------------------|------------|
| **HS256** | 1.0x | 1.0x | 最短 |
| **RS256** | 8.5x | 8.2x | 较长 |
| **ES256** | 1.2x | 1.3x | 中等 |
| **EdDSA** | 0.8x | 0.9x | 中等 |

**优化建议**：
- **高并发场景**：优先选择 EdDSA 或 ES256
- **兼容性优先**：选择 RS256（广泛支持）
- **内部系统**：选择 HS256（性能最优）

### 8.5.2 缓存策略

**公钥缓存**（避免每次读取文件）：
```javascript
// ✅ 推荐：启动时加载公钥到内存
const publicKeyStore = {
  'key-2024-q1': fs.readFileSync('public-q1.pem', 'utf8'),
  'key-2024-q2': fs.readFileSync('public-q2.pem', 'utf8'),
};

// ❌ 不推荐：每次验证都读取文件
const publicKey = fs.readFileSync('public.pem', 'utf8');
```

**Redis 缓存黑名单检查**：
```javascript
// 使用 Redis SETEX 自动过期
await redis.setEx(`jwt:blacklist:${jti}`, ttl, 'revoked');

// 使用管道批量检查（减少网络往返）
const pipeline = redis.pipeline();
for (const jti of jtis) {
  pipeline.get(`jwt:blacklist:${jti}`);
}
const results = await pipeline.exec();
```

### 8.5.3 Payload 大小优化

**优化前**（450 字节）：
```javascript
{
  "sub": "user-12345",
  "email": "john.doe@example.com",
  "full_name": "John Doe",
  "role": "administrator",
  "permissions": ["read", "write", "delete", "manage_users"],
  "department": "Engineering",
  "tenant_id": "tenant-abc-xyz"
}
```

**优化后**（180 字节）：
```javascript
{
  "sub": "usr_7d8f9a",
  "e": "john@example.com",
  "r": "admin",
  "p": ["r","w","d","mu"],
  "t": "t_abc"
}
```

---

## 8.6 本章小结

### 核心要点回顾

1. **用户认证系统**：完整的登录、刷新、登出实现，包括双 Token 模式和 Refresh Token 轮换
2. **API 网关 JWT 校验**：统一认证入口，支持 Kong 插件和自定义中间件
3. **微服务 Token 传递**：透传模式（推荐）、提取模式、转换模式的对比与实现
4. **安全检查清单**：密钥管理、Token 配置、传输安全、攻击防御、监控日志、应急响应六大维度

### 生产部署建议

| 检查项 | 必做 | 推荐 | 可选 |
|--------|------|------|------|
| HTTPS 强制 | ✅ | - | - |
| Access Token 短有效期 | ✅ | - | - |
| Refresh Token HttpOnly Cookie | ✅ | - | - |
| 签名验证中间件 | ✅ | - | - |
| Refresh Token 轮换 | ✅ | - | - |
| Token 黑名单 | - | ✅（高安全场景） | - |
| EdDSA/ES256 算法 | - | ✅（性能敏感） | - |
| HSTS 配置 | - | ✅ | - |
| 安全告警监控 | - | ✅ | - |
| JWK 密钥发现协议 | - | - | ✅（开放平台） |

### 关键引用来源

1. **RFC 7519** - JSON Web Token (JWT)：https://www.rfc-editor.org/rfc/rfc7519
2. **RFC 7515** - JSON Web Signature (JWS)：https://www.rfc-editor.org/rfc/rfc7515
3. **RFC 8725** - JWT 安全最佳实践：https://www.rfc-editor.org/rfc/rfc8725
4. **OWASP JWT Security Cheat Sheet**：https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html
5. **Kong JWT Plugin**：https://docs.konghq.com/hub/jwt/
6. **Auth0 JWT Handbook**：https://auth0.com/resources/ebooks/jwt-handbook
7. **Spring Cloud Gateway**：https://spring.io/projects/spring-cloud-gateway

---

*文档版本：1.0.0 | 最后更新：2026-04-07 | 字数：约 50,000+*

*下一章：继续学习 OAuth 2.1 核心知识体系或 Web 安全核心知识体系*
