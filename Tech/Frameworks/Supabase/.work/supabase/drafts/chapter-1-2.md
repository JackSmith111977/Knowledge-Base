# 第 1 章：Supabase 概述与核心理念

## 1.1 什么是 Supabase

### 概念定义

**Supabase** 是一个开源的后端即服务（Backend-as-a-Service, BaaS）平台，常被称为"开源版 Firebase"。它旨在为开发者提供快速搭建后端所需的核心工具，无需从零构建数据库、认证、存储等基础设施。

**为什么需要 Supabase？**

传统后端开发面临的核心痛点：
1. **技术栈碎片化**：需要拼凑数据库、认证、存储、实时通信等多个独立服务
2. **基础设施复杂**：需要配置服务器、负载均衡、监控等
3. **开发效率低**：重复编写 CRUD API、认证逻辑等样板代码
4. **供应商锁定**：商业 BaaS 服务（如 Firebase）存在数据锁定风险

Supabase 的设计哲学：**模块化架构 + 100% 开源 + 无供应商锁定**

### 核心功能概览

| 功能模块 | 说明 | 技术实现 |
|----------|------|----------|
| **Database** | 完整的 PostgreSQL 数据库服务 | PostgreSQL 15+ |
| **Auth** | 用户认证与授权系统 | GoTrue + JWT |
| **Realtime** | 实时数据订阅与推送 | Elixir + WebSocket |
| **Storage** | 文件存储与管理 | S3 兼容存储 |
| **Edge Functions** | 无服务器边缘函数 | Deno 运行时 |
| **API Gateway** | 自动生成 RESTful API | PostgREST |

### 发展历程与里程碑

- **2025 年 4 月**：获得 2 亿美元 D 轮融资，投后估值 20 亿美元
- **2025 年 10 月**：筹集 1 亿美元，估值达 50 亿美元，成为独角兽
- **开发者增长**：从 2024 年的 100 万激增至 2025 年的 400 万
- **2025 年 Stack Overflow 调查**：使用率从 3.8% 上升至 5.4%
- **2025 年 12 月**：在向量数据库市场被列为领导者之一

---

## 1.2 技术架构总览

### 五层架构模型

```mermaid
graph TB
    subgraph Client["客户端层"]
        SDK[Supabase SDK<br/>JS/TS/Flutter/Swift/Python]
    end
    
    subgraph Gateway["API 网关层"]
        Kong[Kong API Gateway<br/>路由/认证/限流]
        PostgREST[PostgREST<br/>自动 RESTful API]
    end
    
    subgraph Core["核心服务层"]
        Auth[Auth 服务<br/>GoTrue + JWT]
        Realtime[Realtime 服务<br/>Elixir + WebSocket]
        Storage[Storage 服务<br/>S3 兼容]
        Edge[Edge Functions<br/>Deno 运行时]
    end
    
    subgraph Data["数据层"]
        PG[(PostgreSQL 15+<br/>RLS + 扩展)]
        S3[(对象存储<br/>S3/Backblaze)]
    end
    
    SDK --> Kong
    Kong --> PostgREST
    Kong --> Auth
    Kong --> Realtime
    Kong --> Storage
    Kong --> Edge
    PostgREST --> PG
    Auth --> PG
    Realtime --> PG
    Storage --> PG
    Storage --> S3
    Edge --> PG

```

### 各层职责详解

**1. 客户端层 (Client SDK)**
- 提供多语言 SDK：JavaScript/TypeScript、Flutter、Swift、Python 等
- 封装底层 API 调用，提供统一的开发体验
- 自动处理认证、会话管理、错误重试等

**2. API 网关层 (API Gateway)**
- **Kong**：云原生 API 网关，负责请求路由、身份验证、限流和日志记录
- **PostgREST**：将 PostgreSQL 数据库自动映射为 RESTful API，无需手动编写 CRUD 接口

**3. 核心服务层 (Microservices)**
- **Auth 服务**：处理用户注册、登录、Token 管理
- **Realtime 服务**：基于 WebSocket 实现实时数据推送
- **Storage 服务**：管理文件上传、下载、权限控制
- **Edge Functions**：在全球边缘节点运行 TypeScript 代码

**4. 数据层 (Data Layer)**
- **PostgreSQL 15+**：核心数据库，启用 50+ 扩展（pgvector、PostGIS 等）
- **对象存储**：S3 兼容存储，支持 Backblaze 等后端

---

## 1.3 与 Firebase 对比

| 维度 | Firebase | Supabase |
|------|----------|----------|
| **数据库** | NoSQL (Firestore) | PostgreSQL (关系型) |
| **开源状态** | 闭源 | 100% 开源 (Apache 2.0) |
| **数据锁定** | 有 | 无 (标准 PostgreSQL) |
| **查询能力** | 有限 | 完整 SQL + 复杂查询 |
| **实时功能** | 内置 | 基于 PostgreSQL 复制 |
| **认证方式** | 多种 | 多种 (GoTrue) |
| **自托管** | 不支持 | 完全支持 (Docker Compose) |
| **边缘函数** | Cloud Functions | Edge Functions (Deno) |
| **定价透明度** | 复杂 | 简单透明 |

**核心差异总结：**
- Firebase 适合快速原型、NoSQL 场景
- Supabase 适合需要关系型数据库、SQL 查询能力、避免供应商锁定的场景

---

# 第 2 章：系统架构深度解析

## 2.1 微服务架构设计

### 架构设计原则

Supabase 采用**微服务架构设计模式**，将不同功能拆分为独立的服务：

1. **单一职责**：每个服务专注于特定功能模块
2. **独立部署**：各组件可独立开发、部署和扩展
3. **松耦合**：通过明确定义的 API 进行通信
4. **高内聚**：相关功能聚合在同一服务内

### 核心微服务列表

| 服务名称 | 职责 | 技术栈 | 端口 |
|----------|------|--------|------|
| **Auth (GoTrue)** | 用户认证、JWT 签发、OAuth | Go | 9999 |
| **Realtime** | WebSocket 实时推送、变更捕获 | Elixir | 4000 |
| **Storage API** | 文件元数据管理、上传下载 | Node.js | 5000 |
| **PostgREST** | 数据库→RESTful API 映射 | Haskell | 3000 |
| **Edge Runtime** | 边缘函数执行 | Deno | 8000 |
| **Kong Gateway** | API 网关、路由、认证 | Nginx/Lua | 8000/443 |

### 服务间通信机制

```mermaid
sequenceDiagram
    participant Client as 客户端 SDK
    participant Kong as Kong API 网关
    participant Auth as Auth 服务
    participant DB as PostgreSQL
    participant Realtime as Realtime 服务
    
    Client->>Kong: 请求 (含 JWT)
    Kong->>Auth: 验证 Token
    Auth->>DB: 查询用户信息
    DB-->>Auth: 返回用户数据
    Auth-->>Kong: 验证结果
    Kong->>DB: 转发请求 (通过 RLS)
    DB-->>Kong: 返回数据
    Kong-->>Client: 响应
    
    Note over Realtime,DB: Realtime 监听 WAL 日志
    DB-->>Realtime: 数据变更事件
    Realtime->>Client: WebSocket 推送

```

---

## 2.2 API 网关的核心作用

**Kong API 网关**作为系统的统一入口点，承担以下职责：

### 核心功能

| 功能 | 说明 | 实现方式 |
|------|------|----------|
| **请求路由** | 将请求分发到正确的后端服务 | 基于路径/域名路由 |
| **身份验证** | 验证 JWT Token 有效性 | 与 Auth 服务集成 |
| **限流控制** | 防止恶意请求和过载 | 令牌桶算法 |
| **日志记录** | 审计和监控请求 | 结构化日志 |
| **负载均衡** | 分发请求到多个实例 | 轮询/最少连接 |

### 请求处理流程

```mermaid
flowchart TD
    Request[客户端请求] --> Kong[Kong API 网关]
    Kong --> AuthCheck{验证 JWT}
    AuthCheck -->|无效 | 401[返回 401 Unauthorized]
    AuthCheck -->|有效 | RouteCheck{路由判断}
    
    RouteCheck -->|/auth/* | Auth[Auth 服务]
    RouteCheck -->|/rest/v1/* | PostgREST[PostgREST]
    RouteCheck -->|/realtime/v1/* | Realtime[Realtime 服务]
    RouteCheck -->|/storage/v1/* | Storage[Storage API]
    RouteCheck -->|/functions/v1/* | Edge[Edge Runtime]
    
    Auth --> Response[返回响应]
    PostgREST --> Response
    Realtime --> Response
    Storage --> Response
    Edge --> Response

```

---

## 2.3 分布式部署方案

Supabase 提供**三级部署方案**，适应不同规模需求：

### 部署模式对比

| 部署模式 | 说明 | 适用场景 | 延迟表现 |
|----------|------|----------|----------|
| **云服务版** | Supabase 托管，自动扩展 | 初创项目、快速迭代 | 全球边缘节点，~80ms |
| **自托管版** | Docker Compose 部署 | 数据敏感、定制化需求 | 本地部署，<10ms |
| **混合云架构** | 核心数据私有云 + 认证/实时公有云 | 金融、医疗等合规场景 | 根据配置而定 |

### 自托管架构（Docker Compose）

```yaml
# docker-compose.yml 核心服务配置
services:
  kong:
    image: kong:2.8
    ports:
      - "8000:8000"
    depends_on:
      - postgres
    
  auth:
    image: supabase/gotrue
    ports:
      - "9999:9999"
    environment:
      - DATABASE_URL=postgres://postgres:password@postgres:5432/postgres
      - JWT_SECRET=your-jwt-secret
    
  realtime:
    image: supabase/realtime
    ports:
      - "4000:4000"
    environment:
      - DB_HOST=postgres
      - PORT=4000
    
  postgrest:
    image: postgrest/postgrest
    ports:
      - "3000:3000"
    depends_on:
      - postgres
    
  storage:
    image: supabase/storage-api
    ports:
      - "5000:5000"
    
  postgres:
    image: pgvector/pgvector:pg15
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

```

### 服务发现与通信机制

| 机制 | 说明 |
|------|------|
| **环境变量** | 通过 `.env` 文件配置服务连接信息 |
| **端口映射** | 每个服务通过特定端口对外提供服务 |
| **依赖管理** | `depends_on` 确保服务启动顺序 |
| **健康检查** | 定期检查服务状态，自动重启失败服务 |

---

## 2.4 模块化设计与组件解耦

### 数据库层的模块化

Supabase 使用 **Schema（模式）** 将数据划分为不同的模块：

| Schema | 用途 |
|--------|------|
| `public` | 应用主要数据表 |
| `auth` | 用户认证相关表 |
| `storage` | 文件存储元数据 |
| `realtime` | 实时订阅配置 |
| `vecs` | 向量数据（AI 功能） |

**优势：**
- 不同功能的数据相互隔离
- 便于权限管理和扩展
- 支持独立备份和迁移

### 依赖注入的应用

在 Supabase 的代码实现中，**依赖注入 (Dependency Injection)** 被广泛使用：

- **目的**：减少组件间的耦合
- **示例**：使用 Hilt 进行依赖注入，使服务的创建和管理更灵活
- **好处**：便于测试和维护

---

## 2.5 性能与扩展性

### 查询优化策略

```sql
-- 为全文搜索创建 GIN 索引
CREATE INDEX idx_todos_task ON todos 
  USING GIN (to_tsvector('english', task));

-- 物化视图用于频繁访问的仪表盘数据
CREATE MATERIALIZED VIEW daily_metrics AS
SELECT 
  date_trunc('day', created_at) as day,
  COUNT(*) as total_count,
  AVG(value) as avg_value
FROM events
GROUP BY date_trunc('day', created_at);

-- 刷新物化视图
REFRESH MATERIALIZED VIEW CONCURRENTLY daily_metrics;

```

### 连接管理优化

| 配置项 | 推荐值 | 说明 |
|--------|--------|------|
| `max_connections` | 500 | 最大并发连接数 |
| `statement_timeout` | 3000ms | 防止长查询阻塞 |
| `pgBouncer` | 启用 | 连接池管理高并发 |

### 缓存策略

- **物化视图**：预计算复杂查询结果
- **Redis 缓存**：Session 和 Token 缓存
- **CDN 加速**：静态资源和文件分发

---

## 本章小结

本章深入解析了 Supabase 的系统架构，核心要点：

1. **微服务架构**：Auth、Realtime、Storage 等服务独立部署、松耦合
2. **API 网关**：Kong 作为统一入口，处理路由、认证、限流
3. **三种部署模式**：云服务、自托管、混合云，适应不同场景
4. **模块化设计**：通过 Schema 隔离数据，依赖注入降低耦合
5. **性能优化**：索引、连接池、物化视图、CDN 多层缓存

