# RESTful API 设计规范

> Web API 设计最佳实践指南

**最后更新：** 2026-04-05 | **版本：** 1.0.0

---

## 目录

1. [RESTful API 基础认知](#第 1 章-restful-api-基础认知)
2. [资源设计与 URI 规范](#第 2 章-资源设计与-uri-规范)
3. [HTTP 方法规范](#第 3 章-http-方法规范)
4. [状态码与响应规范](#第 4 章-状态码与响应规范)
5. [查询参数与分页](#第 5 章-查询参数与分页)
6. [版本控制](#第 6 章-版本控制)
7. [认证与授权](#第 7 章-认证与授权)
8. [安全与最佳实践](#第 8 章-安全与最佳实践)

---

## 第 1 章 RESTful API 基础认知

### 1.1 什么是 REST

REST（Representational State Transfer，表述性状态转移）是一套由 Roy Fielding 博士在 2000 年提出的**软件架构风格**，用于设计网络应用程序的接口。

**核心定义：**
- REST 不是协议，不是标准，而是一种**架构风格**
- 基于 HTTP 协议，定义了一组约束条件和设计原则
- 将一切抽象为资源（Resource），通过统一接口操作资源

### 1.2 REST 的六大约束

一个真正的 RESTful 系统必须满足以下六个约束：

```mermaid
flowchart TD
    A[REST 约束] --> B[客户端 - 服务器]
    A --> C[无状态]
    A --> D[可缓存]
    A --> E[统一接口]
    A --> F[分层系统]
    A --> G[按需代码可选]
    
    B --> B1[关注点分离]
    C --> C1[每次请求独立]
    D --> D1[响应标识可缓存性]
    E --> E1[资源标识+HTTP 方法]
    F --> F1[可插入代理/网关]
    G --> G1[传输可执行代码]
```

| 约束 | 说明 | 实际意义 |
|------|------|----------|
| **客户端 - 服务器** | 分离关注点 | 客户端负责 UI，服务器负责数据处理 |
| **无状态** | 每次请求独立 | 服务器不保存客户端状态，便于水平扩展 |
| **可缓存** | 响应可缓存 | 提高性能和可扩展性 |
| **统一接口** | 接口一致 | 资源标识、操作方法、消息格式统一 |
| **分层系统** | 多层架构 | 可插入代理、网关，客户端无感知 |
| **按需代码** | 可选 | 服务器可传输可执行代码（如 JS） |

### 1.3 RESTful API 核心特征

```
RESTful API = 资源 + HTTP 方法 + 表述
```

| 要素 | 说明 | 示例 |
|------|------|------|
| **资源** | 操作的对象 | `/users`, `/orders`, `/products` |
| **HTTP 方法** | 操作类型 | `GET`, `POST`, `PUT`, `DELETE` |
| **表述** | 数据格式 | `JSON`, `XML` |

### 1.4 为什么需要 RESTful API

**传统 API 的问题：**

```
❌ 混乱的命名
/getUserInfo?id=123
/update_order_status
/deleteProductByID

❌ 不一致的格式
/api/v1/getData
/doSomething
/process
```

**RESTful API 的优势：**

| 优势 | 说明 |
|------|------|
| **统一规范** | 所有团队成员使用相同的命名和结构 |
| **易于理解** | 资源导向，直观清晰 |
| **易于扩展** | 无状态设计，便于水平扩展 |
| **语言无关** | 任何语言都可以调用 |
| **工具支持** | Swagger/OpenAPI 等工具生态完善 |

---

## 第 2 章 资源设计与 URI 规范

### 2.1 URI 设计原则

#### 2.1.1 使用名词，避免动词

```
❌ 错误示例（包含动词）
GET /api/getUsers
POST /api/createUser
DELETE /api/deleteUser/123

✅ 正确示例（只使用名词）
GET    /api/users      # 获取用户列表
POST   /api/users      # 创建用户
DELETE /api/users/123  # 删除用户
```

**原因：** HTTP 方法已经表达了动作，URL 只需指明资源。

#### 2.1.2 使用复数名词

```
✅ 推荐（复数形式）
GET /api/users
GET /api/orders
GET /api/products

⚠️ 不推荐（单数形式）
GET /api/user
GET /api/order
GET /api/product
```

**原因：** 复数更能体现"集合"的概念，避免歧义。

#### 2.1.3 层级结构不宜过深

```
✅ 推荐（2-3 层）
GET /api/users/123/orders        # 用户的订单
GET /api/posts/456/comments      # 文章的评论

❌ 不推荐（超过 3 层）
GET /api/users/123/orders/456/items/789/details  # 过深
```

**建议：** 层级不超过 3 层，过深时可考虑扁平化设计。

### 2.2 URI 命名规范

#### 2.2.1 字母大小写

```
✅ 推荐（全小写）
/api/users
/api/user-profiles

❌ 不推荐（混合大小写）
/api/Users
/api/UserProfiles
```

#### 2.2.2 分隔符选择

```
✅ 推荐（连字符）
/api/user-profiles
/api/order-items

⚠️ 不推荐（下划线）
/api/user_profiles

❌ 错误（无分隔符或驼峰）
/api/userprofiles
/api/userProfiles
```

#### 2.2.3 避免文件扩展名

```
✅ 推荐（无扩展名）
/api/users
/api/users/123

❌ 不推荐（带扩展名）
/api/users.json
/api/users/123.xml
```

**原因：** 通过 `Accept` 头协商格式，而非 URL。

### 2.3 嵌套资源设计

```
# 一级资源
GET /api/users              # 获取所有用户
GET /api/users/123          # 获取 ID 为 123 的用户

# 二级嵌套资源
GET /api/users/123/orders   # 获取用户的订单
POST /api/users/123/orders  # 为用户创建订单

# 三级嵌套资源
GET /api/users/123/orders/456/items  # 获取订单中的商品
```

**扁平化替代方案：**

```
# 使用查询参数替代深层嵌套
GET /api/orders?user_id=123
GET /api/items?order_id=456
```

---

## 第 3 章 HTTP 方法规范

### 3.1 核心 HTTP 方法

| 方法 | 用途 | 幂等性 | 安全性 | 示例 |
|------|------|--------|--------|------|
| `GET` | 获取资源 | ✅ 是 | ✅ 是 | `GET /api/users` |
| `POST` | 创建资源 | ❌ 否 | ❌ 否 | `POST /api/users` |
| `PUT` | 全量更新 | ✅ 是 | ❌ 否 | `PUT /api/users/123` |
| `PATCH` | 部分更新 | ❌ 否 | ❌ 否 | `PATCH /api/users/123` |
| `DELETE` | 删除资源 | ✅ 是 | ❌ 否 | `DELETE /api/users/123` |

### 3.2 方法详解

#### 3.2.1 GET - 获取资源

```http
GET /api/users/123
Accept: application/json

# 响应
HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": 123,
  "name": "张三",
  "email": "zhangsan@example.com"
}
```

**注意：**
- GET 请求应该是**安全的**（不修改服务器状态）
- GET 请求应该是**幂等的**（多次执行效果相同）
- 不要在 GET 请求体中发送数据（某些服务器不支持）

#### 3.2.2 POST - 创建资源

```http
POST /api/users
Content-Type: application/json

{
  "name": "李四",
  "email": "lisi@example.com"
}

# 响应
HTTP/1.1 201 Created
Location: /api/users/456

{
  "id": 456,
  "name": "李四",
  "email": "lisi@example.com"
}
```

**注意：**
- POST 用于**创建新资源**
- 响应应返回 `201 Created`
- `Location` 头指向新资源的 URI

#### 3.2.3 PUT - 全量更新

```http
PUT /api/users/123
Content-Type: application/json

{
  "id": 123,
  "name": "王五",
  "email": "wangwu@example.com"
}

# 响应
HTTP/1.1 200 OK

{
  "id": 123,
  "name": "王五",
  "email": "wangwu@example.com"
}
```

**注意：**
- PUT 用于**全量更新**（必须提供完整资源）
- PUT 是**幂等的**（多次执行效果相同）
- 如果资源不存在，可创建（取决于设计）

#### 3.2.4 PATCH - 部分更新

```http
PATCH /api/users/123
Content-Type: application/json

{
  "name": "赵六"
}

# 响应
HTTP/1.1 200 OK

{
  "id": 123,
  "name": "赵六",
  "email": "zhangsan@example.com"  # 未修改
}
```

**注意：**
- PATCH 用于**部分更新**（只提供要修改的字段）
- PATCH **不是幂等的**（多次执行可能产生不同效果）

#### 3.2.5 DELETE - 删除资源

```http
DELETE /api/users/123

# 响应
HTTP/1.1 204 No Content
```

**注意：**
- DELETE 用于**删除资源**
- DELETE 是**幂等的**（多次删除效果相同）
- 成功删除通常返回 `204 No Content`

### 3.3 幂等性说明

```mermaid
flowchart TD
    A[请求] --> B{幂等？}
    B -->|是 | C[多次执行效果相同]
    B -->|否 | D[多次执行效果不同]
    
    C --> E[GET, PUT, DELETE]
    D --> F[POST, PATCH]
```

**幂等方法：**
- `GET` - 多次读取效果相同
- `PUT` - 多次全量更新效果相同
- `DELETE` - 多次删除效果相同（第一次删除后，后续无效果）

**非幂等方法：**
- `POST` - 多次创建产生多个资源
- `PATCH` - 多次部分更新可能累积效果

---

## 第 4 章 状态码与响应规范

### 4.1 HTTP 状态码分类

```
2xx 成功
├── 200 OK          - 通用成功
├── 201 Created     - 创建成功
├── 204 No Content  - 无返回内容

3xx 重定向
├── 301 永久重定向
└── 302 临时重定向

4xx 客户端错误
├── 400 Bad Request       - 请求错误
├── 401 Unauthorized      - 未认证
├── 403 Forbidden         - 无权限
├── 404 Not Found         - 资源不存在
└── 409 Conflict          - 冲突

5xx 服务端错误
├── 500 内部错误
├── 502 网关错误
└── 503 服务不可用
```

### 4.2 常用状态码详解

#### 4.2.1 2xx 成功

| 状态码 | 场景 | 示例 |
|--------|------|------|
| `200 OK` | GET/PUT/PATCH 成功 | 获取资源、更新资源 |
| `201 Created` | POST 创建成功 | 创建新用户 |
| `204 No Content` | DELETE 成功 | 删除资源（无返回） |

#### 4.2.2 4xx 客户端错误

| 状态码 | 场景 | 说明 |
|--------|------|------|
| `400 Bad Request` | 参数错误 | 请求体格式错误、必填字段缺失 |
| `401 Unauthorized` | 未认证 | 缺少 Token、Token 过期 |
| `403 Forbidden` | 无权限 | 用户无权执行该操作 |
| `404 Not Found` | 资源不存在 | 请求的资源不存在 |
| `409 Conflict` | 冲突 | 资源已存在、版本冲突 |
| `422 Unprocessable Entity` | 语义错误 | 参数值不合法 |
| `429 Too Many Requests` | 请求过多 | 触发限流 |

#### 4.2.3 5xx 服务端错误

| 状态码 | 场景 | 说明 |
|--------|------|------|
| `500 Internal Server Error` | 服务器错误 | 未处理的异常 |
| `502 Bad Gateway` | 网关错误 | 上游服务不可用 |
| `503 Service Unavailable` | 服务不可用 | 过载、维护中 |

### 4.3 响应体格式

#### 4.3.1 成功响应

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 123,
    "name": "张三",
    "email": "zhangsan@example.com"
  },
  "pagination": {
    "total": 100,
    "page": 1,
    "pageSize": 10,
    "totalPages": 10
  }
}
```

#### 4.3.2 错误响应

```json
{
  "code": 400,
  "message": "请求参数错误",
  "error": {
    "code": "VALIDATION_ERROR",
    "details": "邮箱格式不正确",
    "field": "email",
    "requestId": "req_abc123"
  },
  "timestamp": "2026-04-05T10:30:00Z"
}
```

#### 4.3.3 错误响应字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| `code` | number | HTTP 状态码 |
| `message` | string | 人类可读的错误消息 |
| `error.code` | string | 机器可读的错误代码 |
| `error.details` | string | 详细错误说明 |
| `error.field` | string | 出错字段（如适用） |
| `error.requestId` | string | 请求 ID，用于追踪 |
| `timestamp` | string | 错误发生时间 |

### 4.4 响应头规范

```http
# 内容类型
Content-Type: application/json

# 缓存控制
Cache-Control: no-cache

# 资源版本
ETag: "abc123"

# 限流信息
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1680676800
```

---

## 第 5 章 查询参数与分页

### 5.1 过滤参数

```
# 精确过滤
GET /api/users?age=30
GET /api/products?category=electronics

# 范围过滤
GET /api/products?price_min=100&price_max=500
GET /api/orders?created_at_gte=2026-01-01

# 模糊搜索
GET /api/users?q=张三
GET /api/products?name_like=phone

# 多值过滤
GET /api/users?status=active,pending
GET /api/products?id[]=1&id[]=2&id[]=3
```

### 5.2 排序参数

```
# 单字段排序
GET /api/users?sort=created_at
GET /api/users?sort=-created_at  # 降序

# 多字段排序
GET /api/users?sort=last_name,first_name

# 常见约定
sort=name       # 升序
sort=-name      # 降序
sort=created_at # 按创建时间
```

### 5.3 分页参数

#### 5.3.1 页码式分页（Offset-based）

```
GET /api/users?page=1&pageSize=10
GET /api/users?page=2&pageSize=20

# 响应
{
  "data": [...],
  "pagination": {
    "page": 2,
    "pageSize": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

#### 5.3.2 游标式分页（Cursor-based）

```
GET /api/users?limit=10&cursor=eyJpZCI6MTAwfQ==

# 响应
{
  "data": [...],
  "pagination": {
    "limit": 10,
    "nextCursor": "eyJpZCI6MTEwfQ==",
    "hasMore": true
  }
}
```

**两种分页对比：**

| 分页方式 | 优点 | 缺点 | 适用场景 |
|----------|------|------|----------|
| 页码式 | 直观，可跳转 | 大数据量性能差 | 数据量小、需要跳转 |
| 游标式 | 性能好，数据一致 | 不可跳转 | 大数据量、实时数据 |

### 5.4 字段筛选

```
# 只返回指定字段
GET /api/users?fields=id,name,email
GET /api/products?fields[]=id&fields[]=name

# 嵌套字段
GET /api/users?fields=id,profile.name,profile.avatar
```

### 5.5 参数命名规范

| 功能 | 推荐参数 | 说明 |
|------|----------|------|
| 过滤 | `field=value` | 直接使用字段名 |
| 范围 | `field_min`, `field_max` | 最小/最大值 |
| 搜索 | `q` 或 `search` | 关键词搜索 |
| 排序 | `sort` | `-` 表示降序 |
| 分页 | `page`, `pageSize` 或 `limit`, `offset` | 页码/偏移量 |
| 字段 | `fields` | 返回字段列表 |

---

## 第 6 章 版本控制

### 6.1 为什么需要版本控制

- **向后兼容** - 不破坏现有客户端
- **渐进升级** - 允许客户端逐步迁移
- **功能迭代** - 支持 API 持续演进

### 6.2 版本控制策略

#### 6.2.1 URL 路径版本化（推荐）

```
✅ 推荐
GET /api/v1/users
GET /api/v2/users

# 优点
# - 直观清晰
# - 易于调试
# - 浏览器可直接访问
```

#### 6.2.2 请求头版本化

```http
GET /api/users
Accept: application/vnd.example.v1+json
Accept: application/vnd.example.v2+json

# 优点
# - URL 更简洁
# - 符合 REST 理念

# 缺点
# - 调试不便
# - 需要工具设置请求头
```

#### 6.2.3 查询参数版本化

```
GET /api/users?version=1
GET /api/users?v=2

# 优点
# - 简单易实现

# 缺点
# - 参数可能被忽略
# - 不够正式
```

### 6.3 版本管理最佳实践

#### 6.3.1 版本号语义化

```
v1 → v2  # 重大变更（破坏性）
v1.0 → v1.1  # 向后兼容的更新
```

#### 6.3.2 废弃策略

```
# 1. 标记废弃（保留一段时间）
# v1 API 响应头中提示
X-API-Deprecation: true
Deprecation: Sun, 31 Dec 2026 23:59:59 GMT

# 2. 文档说明
# 在文档中标注 v1 已废弃，建议升级到 v2

# 3. 设定终止日期
# 提前 3-6 个月通知，然后关闭旧版本
```

#### 6.3.3 版本差异示例

```javascript
// v1 - 返回扁平结构
GET /api/v1/users/123
{
  "id": 123,
  "name": "张三",
  "email": "zhangsan@example.com"
}

// v2 - 嵌套结构
GET /api/v2/users/123
{
  "data": {
    "id": 123,
    "attributes": {
      "name": "张三",
      "email": "zhangsan@example.com"
    }
  }
}
```

---

## 第 7 章 认证与授权

### 7.1 认证方式对比

| 认证方式 | 适用场景 | 安全性 |
|----------|----------|--------|
| Basic Auth | 简单场景、内部系统 | ⭐⭐ |
| JWT | 现代 Web 应用、移动端 | ⭐⭐⭐⭐ |
| OAuth 2.0 | 第三方授权、SSO | ⭐⭐⭐⭐⭐ |
| API Key | 服务间调用 | ⭐⭐⭐ |

### 7.2 JWT 认证

#### 7.2.1 JWT 结构

```
JWT = Header.Payload.Signature

Header:  {"alg": "HS256", "typ": "JWT"}
Payload: {"sub": "123", "name": "张三", "exp": 1516239022}
Signature: HMACSHA256(base64UrlEncode(header) + "." + base64UrlEncode(payload), secret)
```

#### 7.2.2 认证流程

```mermaid
sequenceDiagram
    participant Client as 客户端
    participant Server as 服务器
    
    Client->>Server: POST /auth/login (用户名/密码)
    Server->>Server: 验证凭证
    Server-->>Client: 返回 JWT
    Client->>Server: GET /api/users (Authorization: Bearer <JWT>)
    Server->>Server: 验证 JWT
    Server-->>Client: 返回资源
```

#### 7.2.3 请求示例

```http
# 登录获取 Token
POST /api/auth/login
Content-Type: application/json

{
  "username": "zhangsan",
  "password": "password123"
}

# 响应
HTTP/1.1 200 OK
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600
}

# 使用 Token 访问受保护资源
GET /api/users/123
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 7.3 OAuth 2.0 认证

#### 7.3.1 授权码模式（最安全）

```mermaid
sequenceDiagram
    participant User as 用户
    participant Client as 客户端
    participant AuthServer as 授权服务器
    participant ResourceServer as 资源服务器
    
    User->>Client: 访问应用
    Client->>AuthServer: 重定向到授权页
    AuthServer->>User: 认证并授权
    AuthServer->>Client: 返回授权码
    Client->>AuthServer: 用授权码换 Token
    AuthServer->>Client: 返回 Access Token
    Client->>ResourceServer: 使用 Token 访问 API
    ResourceServer-->>Client: 返回资源
```

#### 7.3.2 四种授权模式

| 模式 | 适用场景 | 安全性 |
|------|----------|--------|
| 授权码模式 | Web 应用 | 最高 |
| 隐式模式 | 纯前端应用（已不推荐） | 低 |
| 密码模式 | 高度信任的应用 | 中 |
| 客户端凭证 | 机器对机器通信 | 高 |

### 7.4 权限控制

#### 7.4.1 RBAC（基于角色的访问控制）

```javascript
// 角色定义
const roles = {
  admin: ['read', 'write', 'delete'],
  editor: ['read', 'write'],
  viewer: ['read']
}

// 权限检查
function checkPermission(user, action, resource) {
  const allowed = roles[user.role]
  return allowed.includes(action)
}
```

#### 7.4.2 权限验证响应

```http
# 401 未认证
HTTP/1.1 401 Unauthorized
WWW-Authenticate: Bearer

{
  "code": 401,
  "message": "未提供认证凭证"
}

# 403 无权限
HTTP/1.1 403 Forbidden

{
  "code": 403,
  "message": "您没有执行该操作的权限"
}
```

---

## 第 8 章 安全与最佳实践

### 8.1 安全威胁分析

根据 OWASP API 安全报告，最常见的 API 攻击：

| 威胁 | 说明 | 防护措施 |
|------|------|----------|
| **失效的对象级授权** | 越权访问他人数据 | 验证用户对资源的所有权 |
| **认证失效** | 弱密码、Token 泄露 | 强密码策略、JWT 签名验证 |
| **数据暴露** | 返回过多敏感数据 | 字段筛选、数据脱敏 |
| **速率限制缺失** | DDoS 攻击 | 实现限流机制 |
| **注入攻击** | SQL/NoSQL 注入 | 参数化查询、输入验证 |

### 8.2 安全最佳实践

#### 8.2.1 强制 HTTPS

```nginx
# Nginx 配置
server {
    listen 80;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    ssl_protocols TLSv1.3;
    ssl_ciphers TLS_AES_256_GCM_SHA384;
}
```

#### 8.2.2 输入验证

```javascript
// 验证请求体
app.post('/api/users', (req, res) => {
  const { name, email } = req.body
  
  // 必填字段
  if (!name || !email) {
    return res.status(400).json({ error: '必填字段缺失' })
  }
  
  // 格式验证
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: '邮箱格式不正确' })
  }
  
  // 长度限制
  if (name.length > 50) {
    return res.status(400).json({ error: '姓名不能超过 50 个字符' })
  }
  
  // 处理业务逻辑...
})
```

#### 8.2.3 速率限制

```javascript
// Express 限流示例
import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 分钟
  max: 100,  // 最多 100 个请求
  message: {
    code: 429,
    message: '请求过多，请稍后重试'
  }
})

app.use('/api/', limiter)
```

#### 8.2.4 敏感数据保护

```javascript
// 响应中移除敏感字段
function sanitizeUser(user) {
  const { password, salt, ...safeUser } = user
  return safeUser
}

// 字段脱敏
function maskPhone(phone) {
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}
```

### 8.3 文档化

#### 8.3.1 OpenAPI/Swagger

```yaml
# OpenAPI 3.0 示例
openapi: 3.0.0
info:
  title: 用户 API
  version: 1.0.0
paths:
  /users:
    get:
      summary: 获取用户列表
      parameters:
        - name: page
          in: query
          schema:
            type: integer
            default: 1
      responses:
        '200':
          description: 成功
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/User'
```

#### 8.3.2 API 文档要素

每个 API 端点应包含：
- 端点 URL 和 HTTP 方法
- 请求参数说明（必填/可选）
- 请求体格式
- 响应格式
- 状态码说明
- 认证要求
- 示例请求和响应

### 8.4 错误处理最佳实践

```javascript
// 统一错误处理中间件
app.use((err, req, res, next) => {
  const error = {
    code: err.code || 500,
    message: err.message || '服务器内部错误',
    requestId: req.id,
    timestamp: new Date().toISOString()
  }
  
  // 开发环境包含堆栈
  if (process.env.NODE_ENV === 'development') {
    error.stack = err.stack
  }
  
  res.status(error.code).json(error)
})
```

### 8.5 完整 API 示例

```http
# 创建用户
POST /api/v1/users
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "张三",
  "email": "zhangsan@example.com",
  "password": "securePassword123"
}

# 响应：201 Created
HTTP/1.1 201 Created
Location: /api/v1/users/123
Content-Type: application/json

{
  "code": 201,
  "message": "创建成功",
  "data": {
    "id": 123,
    "name": "张三",
    "email": "zhangsan@example.com"
  }
}

# 获取用户（带过滤和分页）
GET /api/v1/users?status=active&page=1&pageSize=10&sort=-created_at
Authorization: Bearer <token>

# 响应：200 OK
HTTP/1.1 200 OK
Content-Type: application/json

{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": 123,
      "name": "张三",
      "email": "zhangsan@example.com",
      "status": "active"
    }
  ],
  "pagination": {
    "total": 50,
    "page": 1,
    "pageSize": 10,
    "totalPages": 5
  }
}
```

---

## 附录 A：快速参考卡

### HTTP 方法速查

| 方法 | 用途 | 幂等 | URL 示例 |
|------|------|------|----------|
| GET | 读取 | ✅ | `/api/users` |
| POST | 创建 | ❌ | `/api/users` |
| PUT | 全量更新 | ✅ | `/api/users/123` |
| PATCH | 部分更新 | ❌ | `/api/users/123` |
| DELETE | 删除 | ✅ | `/api/users/123` |

### 状态码速查

| 状态码 | 含义 | 使用场景 |
|--------|------|----------|
| 200 | OK | GET/PUT/PATCH 成功 |
| 201 | Created | POST 创建成功 |
| 204 | No Content | DELETE 成功 |
| 400 | Bad Request | 参数错误 |
| 401 | Unauthorized | 未认证 |
| 403 | Forbidden | 无权限 |
| 404 | Not Found | 资源不存在 |
| 500 | Server Error | 服务器错误 |

### URI 设计检查清单

- [ ] 使用名词，不包含动词
- [ ] 使用复数形式
- [ ] 全小写字母
- [ ] 使用连字符分隔单词
- [ ] 不包含文件扩展名
- [ ] 层级不超过 3 层
- [ ] 使用 HTTPS

---

## 参考资料

- [REST 架构风格原文](https://www.ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm)
- [OpenAPI 规范](https://swagger.io/specification/)
- [OWASP API Security Top 10](https://owasp.org/www-project-api-security/)

---

*文档版本：1.0.0 | 最后更新：2026-04-05*
