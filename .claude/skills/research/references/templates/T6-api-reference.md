# T6 API 参考

> **模板用途**：API 文档、SDK 参考、端点列表 —— 精确、表格化、完整的参考文档

---

## 1. 概述

| 字段 | 值 |
|------|------|
| API 名称 | |
| 用途 | 一句话描述 API 解决什么问题 |
| Base URL | `https://api.example.com` |
| 当前版本 | `v1` |
| 文档版本 | `2026-04-27` |

**关键考虑**：明确 API 边界，注明不在此 API 范围内的功能。

---

## 2. 认证

**认证方式**：Bearer Token / API Key / OAuth2

```
Authorization: Bearer <your_token>
```

| 参数 | 格式 | 获取方式 | 过期时间 |
|------|------|----------|----------|
| Token | JWT 字符串 | POST /auth/login | 24 小时 |
| API Key | `sk-xxxxxxxx` | 开发者控制台 | 永久 |

**关键考虑**：说明 token 刷新机制、权限范围（scope）、安全注意事项。

---

## 3. 端点列表

| 方法 | 路径 | 描述 | 认证 |
|------|------|------|------|
| GET | `/v1/resources` | 获取资源列表 | 是 |
| POST | `/v1/resources` | 创建资源 | 是 |
| GET | `/v1/resources/{id}` | 获取单个资源 | 是 |
| PUT | `/v1/resources/{id}` | 更新资源 | 是 |
| DELETE | `/v1/resources/{id}` | 删除资源 | 是 |

---

## 4. 端点详情

### 4.1 获取资源列表

```
GET /v1/resources
```

**请求头**

| 名称 | 值 | 必填 | 说明 |
|------|------|------|------|
| Authorization | Bearer `<token>` | 是 | 认证令牌 |
| Content-Type | application/json | 否 | 请求格式 |

**查询参数**

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| page | integer | 否 | 1 | 页码 |
| per_page | integer | 否 | 20 | 每页数量（最大 100） |
| sort | string | 否 | created_at | 排序字段 |

**响应 200**

```json
{
  "data": [{ "id": "1", "name": "示例", "created_at": "2026-04-27T00:00:00Z" }],
  "meta": { "page": 1, "per_page": 20, "total": 100 }
}
```

**错误响应**

| 状态码 | 错误码 | 含义 | 解决方案 |
|--------|--------|------|----------|
| 401 | UNAUTHORIZED | 未认证或 token 过期 | 重新获取 token |
| 403 | FORBIDDEN | 权限不足 | 检查用户角色 |
| 429 | RATE_LIMITED | 请求过于频繁 | 等待后重试 |

---

## 5. 错误码

| HTTP 状态 | 错误码 | 含义 | 解决方案 |
|-----------|--------|------|----------|
| 400 | BAD_REQUEST | 请求参数错误 | 检查参数格式 |
| 401 | UNAUTHORIZED | 认证失败 | 检查 token |
| 403 | FORBIDDEN | 权限不足 | 升级权限 |
| 404 | NOT_FOUND | 资源不存在 | 检查 ID |
| 429 | RATE_LIMITED | 限流 | 指数退避重试 |
| 500 | INTERNAL_ERROR | 服务器错误 | 稍后重试 |

---

## 6. 速率限制

| 级别 | 请求数 | 时间窗口 | 适用对象 |
|------|--------|----------|----------|
| 免费 | 60 | 每分钟 | 免费用户 |
| 付费 | 1000 | 每分钟 | 付费用户 |

**响应头**

| 头部 | 说明 |
|------|------|
| `X-RateLimit-Limit` | 最大请求数 |
| `X-RateLimit-Remaining` | 剩余请求数 |
| `X-RateLimit-Reset` | 重置时间（Unix 时间戳） |

**重试策略**：指数退避，初始 1 秒，最大 60 秒。

---

## 7. 示例代码

### cURL

```bash
curl -X GET "https://api.example.com/v1/resources?page=1" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Python

```python
import requests

resp = requests.get("https://api.example.com/v1/resources",
    params={"page": 1},
    headers={"Authorization": "Bearer YOUR_TOKEN"})
print(resp.json())
```

### JavaScript

```javascript
const res = await fetch("https://api.example.com/v1/resources?page=1", {
  headers: { Authorization: "Bearer YOUR_TOKEN" }
});
const data = await res.json();
```

---

## 8. 附录

### 8.1 完整引用列表

| 名称 | 链接 | 说明 |
|------|------|------|
| OpenAPI Spec | `/openapi.yaml` | 完整 API 定义 |
| SDK (Python) | `pip install xxx` | 官方 SDK |
| SDK (JS) | `npm install xxx` | 官方 SDK |
| 变更日志 | `/changelog` | API 版本历史 |
