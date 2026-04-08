# Supabase 核心知识体系

> **版本：** 1.0.0  
> **创建日期：** 2026-04-02  
> **最后更新：** 2026-04-02  
> **存储位置：** Tech/Frameworks/Supabase/

---

## 目录

1. [Supabase 概述与核心理念](#第 1 章-supabase-概述与核心理念)
2. [系统架构深度解析](#第 2 章 - 系统架构深度解析)
3. [PostgreSQL 数据库核心与底层原理](#第 3 章-postgresql-数据库核心与底层原理)
4. [认证与授权系统 (Auth) 生命周期解析](#第 4 章 - 认证与授权系统-auth-生命周期解析)
5. [实时数据订阅 (Realtime) 活动流程解析](#第 5 章 - 实时数据订阅-realtime-活动流程解析)
6. [文件存储 (Storage) 架构与原理](#第 6 章 - 文件存储-storage-架构与原理)
7. [边缘函数 (Edge Functions) 与开发工具](#第 7 章 - 边缘函数-edge-functions-与开发工具)
8. [最佳实践与典型应用场景](#第 8 章 - 最佳实践与典型应用场景)

---

第 1 章 Supabase 概述与核心理念
=====================================

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

## 本章小结

本章介绍了 Supabase 的基本概念和整体架构：

1. **Supabase 定义**：开源 BaaS 平台，Firebase 的开源替代方案
2. **核心功能**：Database、Auth、Realtime、Storage、Edge Functions、API Gateway
3. **技术架构**：五层模型（客户端层、API 网关层、核心服务层、数据层）
4. **与 Firebase 对比**：关系型 vs NoSQL、开源 vs 闭源、无锁定 vs 供应商锁定


第 2 章 系统架构深度解析
=============================

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


第 3 章 PostgreSQL 数据库核心与底层原理
===========================================

## 3.1 数据库基础

### 核心概念定义

Supabase 的底层是标准的 **PostgreSQL 15+** 关系型数据库。与很多 NoSQL 型 BaaS 不同，Supabase 选择 PostgreSQL 作为核心，原因在于：

**为什么选择 PostgreSQL？**
1. **关系型模型**：适合有明确数据结构、需要复杂查询的业务
2. **完整 SQL 支持**：支持复杂查询、事务、索引、视图、函数
3. **成熟生态**：35 年打磨验证的可靠性和功能稳健性
4. **扩展能力**：支持 50+ 扩展（pgvector、PostGIS 等）

### 核心操作能力

| 操作类型 | 说明 | 示例 |
|----------|------|------|
| **表管理** | 可视化创建、修改表结构 | 表编辑器、SQL 编辑器 |
| **数据库分支** | 创建数据库副本进行测试 | 类似 Git 分支 |
| **自动备份** | 数据自动备份，可随时恢复 | 时间点恢复 |
| **SQL 执行** | 在线编写和执行 SQL | 内置 SQL 编辑器 |

---

## 3.2 PostgREST 自动 API 生成原理

### 核心机制

**PostgREST** 是一个独立服务，它将 PostgreSQL 数据库自动映射为 RESTful API，无需手动编写 CRUD 接口。

### 工作原理

```mermaid
flowchart LR
    Client[客户端请求] --> PostgREST[PostgREST 服务]
    PostgREST --> Parse[解析 HTTP 请求]
    Parse --> Schema[查询数据库 Schema]
    Schema --> Generate[生成 SQL 查询]
    Generate --> Execute[执行 SQL]
    Execute --> Transform[结果转换为 JSON]
    Transform --> Response[HTTP 响应]
```

### HTTP 请求到 SQL 的映射

| HTTP 请求 | 等效 SQL | 说明 |
|-----------|---------|------|
| `GET /todos?select=*,users(*)` | `SELECT *, users.* FROM todos JOIN users ON ...` | 支持关联查询 |
| `POST /todos` | `INSERT INTO todos (...) VALUES (...)` | 创建记录 |
| `PATCH /todos?id=eq.1` | `UPDATE todos SET ... WHERE id = 1` | 更新记录 |
| `DELETE /todos?id=eq.1` | `DELETE FROM todos WHERE id = 1` | 删除记录 |

### SDK 调用示例

```javascript
// 初始化客户端
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(
  'https://your-project.supabase.co',
  'your-anon-key'
)

// 查询数据（自动转换为 SQL）
const { data } = await supabase
  .from('todos')
  .select('*, users(name)')  // 关联查询
  .eq('user_id', 1)
  .order('created_at', { ascending: false })

// 插入数据
const { data } = await supabase
  .from('todos')
  .insert({ task: 'Learn Supabase', user_id: 1 })
```

### 底层实现细节

**PostgREST 的核心优势：**
1. **零代码 API**：基于数据库 Schema 自动生成，无需编写接口
2. **RLS 集成**：自动遵守 PostgreSQL 的行级安全策略
3. **类型安全**：支持从数据库 Schema 生成 TypeScript 类型

---

## 3.3 行级安全 (RLS) 深度解析

### 概念定义

**Row-Level Security (RLS)** 是 PostgreSQL 的一项安全特性，允许基于用户身份控制哪些行可以被访问。Supabase 将 RLS 转化为可视化配置，实现**零代码权限控制**。

### 工作原理

```mermaid
flowchart TD
    Query[用户查询] --> RLSEngine[RLS 引擎]
    RLSEngine --> CheckPolicy{检查策略}
    CheckPolicy -->|无策略 | Deny[默认拒绝]
    CheckPolicy -->|有策略 | Evaluate[评估 USING 表达式]
    Evaluate -->|true| Allow[允许访问]
    Evaluate -->|false| Filter[过滤该行]
    
    subgraph RLS 策略
        Policy[CREATE POLICY ...]
        Using[USING 表达式]
        Check[WITH CHECK 表达式]
    end
```

### RLS 策略配置示例

```sql
-- 1. 创建待办事项表
CREATE TABLE todos (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  task TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 启用 RLS
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- 3. 创建策略：用户只能访问自己的数据
CREATE POLICY "User access own todos" ON todos
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

### 策略类型详解

| 策略类型 | 适用操作 | 表达式 |
|----------|---------|--------|
| **SELECT** | 查询数据 | `USING (auth.uid() = user_id)` |
| **INSERT** | 插入数据 | `WITH CHECK (auth.uid() = user_id)` |
| **UPDATE** | 更新数据 | `USING (...)` + `WITH CHECK (...)` |
| **DELETE** | 删除数据 | `USING (auth.uid() = user_id)` |

### 实际应用场景

| 场景 | RLS 策略示例 |
|------|-------------|
| **社交媒体** | 用户仅可见自己的动态 |
| **SaaS 平台** | 按客户隔离数据（多租户） |
| **医疗系统** | 严格遵循 HIPAA 合规要求 |
| **协作工具** | 项目成员访问项目数据 |

### 注意事项

```sql
-- ⚠️ 重要：USING 和 WITH CHECK 的区别

-- USING：决定哪些行"可见"（用于 SELECT/DELETE）
USING (auth.uid() = user_id)

-- WITH CHECK：决定哪些行"允许插入/更新"（用于 INSERT/UPDATE）
WITH CHECK (auth.uid() = user_id)

-- 如果未提供 WITH CHECK，USING 表达式也会用于 INSERT/UPDATE
```

---

## 3.4 数据库迁移与版本管理

### 迁移系统核心

Supabase CLI 提供完整的数据库迁移管理方案：

```bash
# 创建新的迁移文件（时间戳命名）
supabase migration new add_user_profiles

# 查看迁移状态
supabase migration status

# 应用所有待处理的迁移
supabase migration up

# 回滚到指定版本
supabase migration down --version 20230101000000
```

### 迁移文件结构

```
supabase/migrations/
├── 20250101000000_create_users.sql
├── 20250102000000_create_todos.sql
└── 20250103000000_add_rls_policies.sql
```

### 迁移文件内容

```sql
-- 20250101000000_create_users.sql

-- UP 迁移（应用）
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- DOWN 迁移（回滚）
DROP TABLE IF EXISTS users;
```

### 版本控制原理

| 机制 | 说明 |
|------|------|
| **时间戳命名** | 确保执行顺序正确 |
| **UP/DOWN 配对** | 支持正向应用和反向回滚 |
| **迁移状态追踪** | 记录已执行的迁移版本 |
| **影子数据库** | 本地测试用隔离数据库 |

---

## 3.5 内核扩展机制

### PostgreSQL 扩展系统

Supabase 预装了 50+ PostgreSQL 扩展，核心扩展包括：

| 扩展名称 | 用途 | 应用场景 |
|----------|------|----------|
| **pgvector** | 向量相似度搜索 | AI 嵌入、推荐系统 |
| **PostGIS** | 地理空间数据 | 地图、位置服务 |
| **pgcrypto** | 加密函数 | 数据加密、哈希 |
| **pg_net** | HTTP 请求 | Webhook、外部 API |
| **pgaudit** | 审计日志 | 合规、安全审计 |

### pgvector 向量搜索示例

```sql
-- 1. 启用扩展
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. 创建向量列
CREATE TABLE documents (
  id UUID PRIMARY KEY,
  content TEXT,
  embedding vector(1536)  -- OpenAI embedding 维度
);

-- 3. 创建向量索引（加速相似度搜索）
CREATE INDEX ON documents USING ivfflat (embedding vector_cosine_ops);

-- 4. 执行相似度查询
SELECT content, 1 - (embedding <=> '[0.1, 0.2, ...]'::vector) AS similarity
FROM documents
ORDER BY similarity DESC
LIMIT 5;
```

### 扩展管理命令

```bash
# 查看已安装的扩展
supabase extensions list

# 启用扩展（SQL）
CREATE EXTENSION IF NOT EXISTS vector;

# 查看扩展信息
SELECT * FROM pg_extension WHERE extname = 'vector';
```

---

## 3.6 查询性能优化

### 索引优化策略

```sql
-- 1. B-Tree 索引（默认，适用于等值和范围查询）
CREATE INDEX idx_todos_user_id ON todos(user_id);

-- 2. GIN 索引（全文搜索、JSONB、数组）
CREATE INDEX idx_todos_task_gin ON todos USING GIN (to_tsvector('english', task));

-- 3. GiST 索引（地理空间、向量相似度）
CREATE INDEX idx_location_gist ON locations USING GiST (coordinates);

-- 4. 复合索引（多列查询）
CREATE INDEX idx_todos_user_status ON todos(user_id, status);
```

### 查询性能分析

```sql
-- 使用 EXPLAIN ANALYZE 分析查询计划
EXPLAIN ANALYZE
SELECT * FROM todos
WHERE user_id = '123'
  AND status = 'pending'
ORDER BY created_at DESC;

-- 输出包含：
-- - 扫描方式（Seq Scan / Index Scan）
-- - 实际执行时间
-- - 行数估算
```

### 连接池管理

高并发场景下，使用 **pgBouncer** 管理数据库连接：

| 配置项 | 推荐值 | 说明 |
|--------|--------|------|
| `max_connections` | 500 | 最大连接数 |
| `pool_mode` | transaction | 事务模式连接池 |
| `reserve_pool_size` | 10 | 预留连接数 |

---

## 3.7 数据库分支与测试

### 数据库分支机制

Supabase 支持创建数据库副本（分支）用于测试，类似 Git 分支：

```mermaid
graph LR
    Main[主数据库<br/>Production] --> Branch1[分支 1<br/>Feature A]
    Main --> Branch2[分支 2<br/>Feature B]
    Main --> Branch3[分支 3<br/>Hotfix]
    
    style Main fill:#4CAF50
    style Branch1 fill:#2196F3
    style Branch2 fill:#2196F3
    style Branch3 fill:#FF9800
```

### 分支操作流程

```bash
# 创建分支
supabase branches create feature-user-profiles

# 列出分支
supabase branches list

# 切换到分支
supabase branches switch feature-user-profiles

# 删除分支
supabase branches delete feature-user-profiles
```

### 分支应用场景

| 场景 | 说明 |
|------|------|
| **功能开发** | 为每个新功能创建独立分支 |
| **Bug 修复** | 在生产数据库上测试修复方案 |
| **数据迁移测试** | 在分支上验证迁移脚本 |
| **A/B 测试** | 对比不同 Schema 设计 |

---

## 本章小结

本章深入解析了 Supabase 的 PostgreSQL 数据库核心：

1. **PostgreSQL 基础**：关系型模型、完整 SQL 支持、成熟生态
2. **PostgREST 原理**：HTTP→SQL 自动映射、零代码 API、RLS 集成
3. **RLS 行级安全**：基于用户的精细权限控制、USING/WITH CHECK 表达式
4. **迁移与版本管理**：时间戳命名、UP/DOWN 配对、影子数据库
5. **内核扩展**：pgvector（AI）、PostGIS（地理）、pgcrypto（加密）
6. **性能优化**：B-Tree/GIN/GiST索引、EXPLAIN ANALYZE、pgBouncer 连接池
7. **数据库分支**：类似 Git 的分支机制，支持功能开发和测试


第 4 章 认证与授权系统 (Auth) 生命周期解析
================================================

## 4.1 Auth 系统架构概览

### 核心组件

Supabase Auth 基于 **GoTrue** 构建，这是一个用 Go 语言编写的轻量级身份验证 API，最初由 Netlify 开发，后被 Supabase 深度定制。

```mermaid
graph TB
    subgraph Client["客户端层"]
        SDK[Supabase Auth SDK]
        OAuth[第三方 OAuth 提供商]
    end
    
    subgraph GoTrue["GoTrue 服务"]
        JWT[JWT 签发模块]
        Session[会话管理]
        MFA[MFA 多因素认证]
    end
    
    subgraph Storage["存储层"]
        AuthTable[(auth.users 表)]
        Sessions[(sessions 表)]
        RefreshTokens[(refresh_tokens 表)]
    end
    
    SDK --> JWT
    SDK --> Session
    OAuth --> GoTrue
    JWT --> AuthTable
    Session --> Sessions
    Session --> RefreshTokens
```

### 技术栈

| 组件 | 技术 | 职责 |
|------|------|------|
| **GoTrue** | Go 语言 | 用户管理、JWT 签发、OAuth 集成 |
| **JWT** | JSON Web Token | 无状态令牌、包含用户 Claims |
| **PostgreSQL** | 关系型数据库 | 存储用户数据、会话、刷新令牌 |
| **RLS** | 行级安全策略 | 基于 JWT Claims 的数据访问控制 |

---

## 4.2 认证方式全览

### 支持的认证方式

| 认证方式 | 说明 | 适用场景 |
|----------|------|----------|
| **邮箱密码** | 传统邮箱 + 密码登录 | 标准 Web 应用 |
| **Magic Link** | 无密码登录，邮件发送魔法链接 | 简洁用户体验 |
| **手机号 OTP** | 短信验证码登录 | 移动应用 |
| **OAuth 第三方** | Google、GitHub、Apple 等 | 社交登录 |
| **匿名登录** | 临时匿名账户 | 访客模式 |
| **SAML/SSO** | 企业单点登录 | 企业用户 |

### 邮箱密码认证流程

```mermaid
sequenceDiagram
    participant User as 用户
    participant Client as 客户端 SDK
    participant Auth as GoTrue 服务
    participant DB as PostgreSQL
    participant Email as 邮件服务
    
    User->>Client: 输入邮箱/密码
    Client->>Auth: POST /signup {email, password}
    Auth->>DB: 创建用户（未确认）
    Auth->>Email: 发送确认邮件
    Email-->>User: 收到确认链接
    User->>Client: 点击确认链接
    Client->>Auth: GET /verify?token=xxx
    Auth->>DB: 验证 Token，更新用户状态
    Auth-->>Client: 返回 JWT + Session
    
    Note over User,Email: 后续登录
    
    User->>Client: 输入邮箱/密码
    Client->>Auth: POST /login {email, password}
    Auth->>DB: 验证密码哈希
    Auth-->>Client: 返回 JWT + Session
```

### 代码示例

```javascript
// 1. 邮箱密码注册
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'strong-password-123',
  options: {
    data: { full_name: 'John Doe' },  // 元数据
    emailRedirectTo: 'https://example.com/welcome'
  }
})

// 2. 邮箱密码登录
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'strong-password-123'
})

// 3. Magic Link 登录（无密码）
const { data, error } = await supabase.auth.signInWithOtp({
  email: 'user@example.com'
})

// 4. OAuth 第三方登录（以 GitHub 为例）
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'github',
  options: {
    redirectTo: 'https://example.com/auth/callback'
  }
})

// 5. 登出
const { error } = await supabase.auth.signOut()
```

---

## 4.3 JWT 与 Session 管理

### JWT 结构解析

Supabase Auth 使用 JWT（JSON Web Token）作为访问令牌，结构如下：

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJvbGUiOiJhdXRoZW50aWNhdGVkIiwiYXpwIjoiYWNjZXNzX3Rva2VuIiwiZXhwIjoxNjc3NzY3NzY3LCJ1aWQiOiIxMjM0NTY3ODkwIiwiZW1haWwiOiJ1c2VyQGV4YW1wbGUuY29tIiwicGhvbmUiOiIiLCJhcHBfbWV0YWRhdGEiOnt9LCJ1c2VyX21ldGFkYXRhIjp7fSwicm9sZSI6ImF1dGhlbnRpY2F0ZWQifQ.signature
```

### JWT Payload Claims

| Claim | 说明 | 示例值 |
|-------|------|--------|
| `iss` | 签发者 | `"supabase"` |
| `sub` | 主题（用户 ID） | `"12345678-1234-1234-1234-123456789012"` |
| `aud` | 受众 | `"authenticated"` |
| `exp` | 过期时间 | `1677767767` |
| `role` | 用户角色 | `"authenticated"` |
| `email` | 用户邮箱 | `"user@example.com"` |
| `phone` | 用户手机号 | `"+1234567890"` |
| `app_metadata` | 应用元数据 | `{}` |
| `user_metadata` | 用户元数据 | `{"full_name": "John Doe"}` |

### Token 生命周期

```mermaid
flowchart TD
    Issue[签发 Access Token<br/>有效期 1 小时] --> Valid[有效状态]
    Valid --> Expired{是否过期？}
    Expired -->|是 | Refresh[使用 Refresh Token<br/>换取新 Access Token]
    Refresh --> NewToken[新 Access Token]
    NewToken --> Valid
    Expired -->|否 | UseToken[继续使用]
    
    Refresh --> Revoke{Refresh Token<br/>是否有效？}
    Revoke -->|无效 | Logout[会话终止，需重新登录]
    Revoke -->|有效 | NewToken
```

### 令牌刷新机制

```javascript
// SDK 自动处理令牌刷新
const supabase = createClient(url, anonKey, {
  auth: {
    autoRefreshToken: true,  // 默认启用，过期前自动刷新
    persistSession: true,    // 持久化到 localStorage
    detectSessionInUrl: true // 自动检测 OAuth 回调 URL 中的 session
  }
})

// 监听认证状态变化
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth state changed:', event)
  // event 类型:
  // - SIGNED_IN: 用户登录
  // - SIGNED_OUT: 用户登出
  // - TOKEN_REFRESHED: Token 刷新
  // - USER_UPDATED: 用户信息更新
  // - PASSWORD_RECOVERY: 密码恢复
})
```

### Session 存储策略

| 存储方式 | 优点 | 缺点 | 适用场景 |
|----------|------|------|----------|
| **localStorage** | 简单、持久化 | XSS 风险 | 普通 Web 应用 |
| **sessionStorage** | 会话级、安全 | 关闭标签丢失 | 临时会话 |
| **自定义存储** | 完全控制 | 需自行实现 | 高安全需求 |
| **内存存储** | 最安全 | 刷新丢失 | 敏感操作 |

---

### 双 Token 机制详解

#### 为什么需要双 Token？

**问题场景：**
```
如果只有 Access Token：
- Access Token 有效期短（1 小时）→ 用户每小时都要重新登录 ❌
- Access Token 有效期长（1 年）→ 被盗后一年内都能用 ❌

两难困境：安全性 vs 用户体验
```

**双 Token 机制的解决方案：**

| Token 类型 | 有效期 | 用途 |
|------------|--------|------|
| **Access Token** | 短（1 小时） | 访问 API 资源 |
| **Refresh Token** | 长（7-30 天） | 仅用于换取新的 Access Token |

#### 双 Token 架构

```
┌─────────────────────────────────────────────────────────┐
│                    用户登录成功                          │
└─────────────────────────────────────────────────────────┘
                            ↓
        ┌───────────────────┴───────────────────┐
        ↓                                       ↓
┌───────────────────┐                 ┌───────────────────┐
│   Access Token    │                 │   Refresh Token   │
│   - 有效期 1 小时   │                 │   - 有效期 7 天     │
│   - 访问 API 资源  │                 │   - 仅用于刷新    │
│   - 每次请求携带  │                 │   - 安全存储      │
└───────────────────┘                 └───────────────────┘
        ↓                                       ↓
   客户端使用                            客户端存储
   (请求 Header)                        (Http-only Cookie)
```

#### 完整工作流程

**阶段 1：用户登录**
```
用户输入邮箱/密码
    ↓
POST /auth/v1/token { email, password }
    ↓
GoTrue 验证成功
    ↓
返回双 Token：
- access_token: "eyJhbG..." (1 小时)
- refresh_token: "v1_abc..." (7 天)
    ↓
SDK 持久化到 localStorage
```

**阶段 2：正常访问 API**
```
客户端请求 API
    ↓
Header: Authorization: Bearer <access_token>
    ↓
Kong 网关验证 JWT 签名
    ↓
返回数据
```

**阶段 3：Access Token 过期，自动刷新**
```
Access Token 过期（1 小时后）
    ↓
客户端请求 API → 返回 401 Unauthorized
    ↓
SDK 自动检测到 401
    ↓
使用 refresh_token 请求刷新
    ↓
POST /auth/v1/token { grant_type: refresh_token, refresh_token }
    ↓
GoTrue 验证 refresh_token
    ↓
签发新双 Token：
- new_access_token: "eyJhbG..."
- new_refresh_token: "v2_def..." ⚠️ (轮换：旧 refresh_token 失效)
    ↓
SDK 更新 localStorage
```

**阶段 4：Refresh Token 也过期（7 天后）**
```
refresh_token 过期
    ↓
刷新失败 → 返回 401
    ↓
SDK 触发 SIGNED_OUT 事件
    ↓
用户需要重新登录
```

#### 双 Token 对比

| 特性 | Access Token | Refresh Token |
|------|-------------|---------------|
| **类型** | JWT（有状态签名） | opaque 字符串（数据库存储） |
| **有效期** | 短（1 小时） | 长（7-30 天） |
| **用途** | 访问 API 资源 | 仅用于换取新 Access Token |
| **存储位置** | localStorage / memory | Http-only Cookie（推荐） |
| **每次请求携带** | ✅ 是（Authorization Header） | ❌ 否（仅刷新时使用） |
| **可撤销性** | ❌ 难（JWT 无状态） | ✅ 能（删除数据库记录） |
| **轮换机制** | ❌ 否 | ✅ 是（每次刷新后失效） |

#### Refresh Token 轮换机制（重要！）

**为什么需要轮换？**

```
┌─────────────────────────────────────────────────────────────────┐
│ 攻击场景：Refresh Token 被盗                                     │
└─────────────────────────────────────────────────────────────────┘

没有轮换的情况：
1. 攻击者窃取 refresh_token: "v1_abc..."
2. 合法用户继续使用（不知情）
3. 攻击者也用同一个 refresh_token 刷新
4. 结果：攻击者和合法用户都能持续获取新 Access Token ❌
   → 攻击者可以永久访问账户！

有轮换的情况：
1. 攻击者窃取 refresh_token: "v1_abc..."
2. 合法用户先刷新 → 服务器签发：
   - new_access_token: "eyJhbG..."
   - new_refresh_token: "v2_def..." ⚠️ v1 失效
3. 攻击者用 v1 刷新 → 服务器检测到已失效！
   → 拒绝请求 ⚠️
   → 可选：使所有会话失效（安全警报）
4. 结果：攻击者无法继续访问 ✅
```

**轮换机制核心逻辑：**
```javascript
// 服务端伪代码（GoTrue 内部逻辑）

async function refreshToken(refreshToken) {
  // 1. 查询数据库验证 Refresh Token
  const tokenRecord = await db.refreshTokens.findOne({ 
    where: { token: refreshToken } 
  })
  
  if (!tokenRecord) {
    // ⚠️ Refresh Token 不存在（可能是被盗用！）
    await db.sessions.invalidateAll(tokenRecord.userId)
    throw new Error('Refresh token has been revoked')
  }
  
  // 2. 验证是否已使用（检测重放攻击）
  if (tokenRecord.used) {
    // ⚠️ 检测到重放攻击！
    await db.sessions.invalidateAll(tokenRecord.userId)
    throw new Error('Refresh token reuse detected')
  }
  
  // 3. 标记旧 Token 为已使用
  tokenRecord.used = true
  await tokenRecord.save()
  
  // 4. 签发新双 Token
  const newAccessToken = jwt.sign({ ... })
  const newRefreshToken = generateSecureToken()
  
  // 5. 存储新 Refresh Token
  await db.refreshTokens.create({
    userId: tokenRecord.userId,
    token: newRefreshToken,
    used: false,
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000  // 7 天
  })
  
  return {
    access_token: newAccessToken,
    refresh_token: newRefreshToken
  }
}
```

#### 双 Token 安全最佳实践

| 实践 | 说明 |
|------|------|
| **Access Token 存内存** | 避免 XSS 窃取（不用 localStorage） |
| **Refresh Token 存 Http-only Cookie** | JavaScript 无法访问，防 XSS |
| **Refresh Token 轮换** | 每次刷新后使旧 Token 失效 |
| **Refresh Token 可撤销** | 数据库存储，登出时删除 |
| **检测重放攻击** | 发现 Token 复用时使所有会话失效 |
| **短 Access Token 有效期** | 减少被盗后的暴露窗口 |

---

## 4.4 RLS 行级安全策略集成

### Auth 与 RLS 的协同工作

```mermaid
flowchart TD
    Request[客户端请求] --> Kong[Kong API 网关]
    Kong --> Extract[提取 JWT Token]
    Extract --> Verify[验证 JWT 签名]
    Verify --> SetClaims[设置 auth Claims]
    SetClaims --> Execute[执行 SQL 查询]
    Execute --> RLSCheck[RLS 策略检查]
    RLSCheck --> Result{检查通过？}
    Result -->|是 | Return[返回数据]
    Result -->|否 | Deny[拒绝访问]
    
    subgraph PostgreSQL
        Execute
        RLSCheck
    end
```

### auth.uid() 函数

Supabase 提供 `auth.uid()` 函数，从 JWT 中提取用户 ID：

```sql
-- 在 RLS 策略中使用
CREATE POLICY "用户只能访问自己的数据" ON todos
  FOR SELECT
  USING (auth.uid() = user_id);

-- auth.uid() 返回当前认证用户的 UUID
-- 如果未认证，返回 NULL
```

### 完整的 RLS 策略示例

```sql
-- 1. 创建 profiles 表
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users,
  username TEXT UNIQUE,
  avatar_url TEXT,
  updated_at TIMESTAMPTZ
);

-- 2. 启用 RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 3. 创建策略组合

-- 3.1 任何人都可以查看公开资料
CREATE POLICY "公开资料可读" ON profiles
  FOR SELECT
  USING (true);

-- 3.2 只有本人可以更新自己的资料
CREATE POLICY "本人可更新" ON profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- 3.3 插入时必须匹配当前用户
CREATE POLICY "本人可插入" ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);
```

---

## 4.5 认证生命周期完整流程

### 生命周期阶段

```mermaid
flowchart TD
    Start[用户开始] --> Register[注册阶段]
    Register --> Confirm[确认阶段]
    Confirm --> Active[活跃会话阶段]
    Active --> Refresh[Token 刷新循环]
    Refresh --> Logout{用户操作}
    Logout -->|登出 | LogoutPhase[登出阶段]
    Logout -->|Token 过期未刷新 | Expire[会话过期]
    LogoutPhase --> End[结束]
    Expire --> End
```

### 阶段 1：注册（Registration）

```javascript
// 用户提交注册表单
const { data, error } = await supabase.auth.signUp({
  email: 'newuser@example.com',
  password: 'secure-password'
})

// 后台发生的过程：
// 1. GoTrue 接收注册请求
// 2. 验证密码强度（长度 >= 6）
// 3. 对密码进行 bcrypt 哈希
// 4. 在 auth.users 表创建记录（confirmed = false）
// 5. 生成确认 Token
// 6. 发送确认邮件
// 7. 等待用户点击确认链接
```

### 阶段 2：确认（Confirmation）

```javascript
// 用户点击邮件中的确认链接
// 示例：https://example.com/auth/callback?access_token=xxx

// SDK 自动检测 URL 中的 session
const { data: { session }, error } = await supabase.auth.getSession()

// 后台发生的过程：
// 1. 解析 access_token
// 2. 验证 Token 签名和有效期
// 3. 更新用户状态（confirmed = true）
// 4. 创建初始 Session
// 5. 返回 JWT + Refresh Token
```

### 阶段 3：活跃会话（Active Session）

```javascript
// 获取当前会话
const { data: { session } } = await supabase.auth.getSession()

// 获取当前用户
const { data: { user } } = await supabase.auth.getUser()

// 后台发生的过程：
// 1. 从 localStorage 读取 Refresh Token
// 2. 验证 Token 是否有效
// 3. 返回对应的用户信息
// 4. 如果 Token 即将过期，自动刷新
```

### 阶段 4：Token 刷新循环（Token Refresh Loop）

```javascript
// SDK 自动处理，无需手动干预
// 刷新触发时机：
// - Access Token 过期前 5 分钟
// - 检测到会话即将过期

// 后台发生的过程：
// 1. 使用 Refresh Token 请求 /token?grant_type=refresh_token
// 2. GoTrue 验证 Refresh Token
// 3. 签发新的 Access Token + Refresh Token（轮换）
// 4. 使旧 Refresh Token 失效（防重放攻击）
// 5. 更新 sessions 表
// 6. SDK 将新 Token 持久化到 localStorage
```

### 阶段 5：登出（Logout）

```javascript
// 用户点击登出按钮
const { error } = await supabase.auth.signOut()

// 后台发生的过程：
// 1. 调用 /logout 端点
// 2. GoTrue 使 Refresh Token 失效
// 3. 删除 sessions 表中的记录
// 4. SDK 清除 localStorage 中的 Token
// 5. 触发 SIGNED_OUT 事件
```

### 阶段 6：密码恢复（Password Recovery）

```javascript
// 1. 请求密码恢复邮件
await supabase.auth.resetPasswordForEmail('user@example.com', {
  redirectTo: 'https://example.com/reset-password'
})

// 2. 用户点击邮件链接，进入重置页面
// 3. 提交新密码
await supabase.auth.updateUser({ password: 'new-secure-password' })

// 后台发生的过程：
// 1. 生成 Recovery Token
// 2. 发送恢复邮件
// 3. 验证 Token 有效性
// 4. 更新密码哈希
// 5. 可选：使所有现有会话失效
```

---

## 4.6 多因素认证 (MFA)

### MFA 工作原理

```mermaid
sequenceDiagram
    participant User as 用户
    participant App as 认证器 App
    participant Client as 客户端
    participant Auth as GoTrue 服务
    
    User->>Client: 登录（邮箱 + 密码）
    Client->>Auth: POST /login
    Auth-->>Client: 需要 MFA 验证
    Client->>User: 提示输入 TOTP 码
    User->>Client: 从 App 获取 6 位码
    Client->>Auth: POST /verify {totp: "123456"}
    Auth->>Auth: 验证 TOTP
    Auth-->>Client: 返回 JWT + Session
```

### 启用 MFA

```javascript
// 1. 注册 MFA 因子（通常在使用者 App 中）
const { data, error } = await supabase.auth.mfa.enroll({
  factorType: 'totp',
  friendlyName: '我的手机'
})

// data 包含：
// - id: 因子 ID
// - totp: { qr_code_image, secret }
// 用户扫描二维码后，使用 App 生成的 6 位码验证

// 2. 验证并激活 MFA
await supabase.auth.mfa.verify({
  factorId: data.id,
  code: '123456'  // 从认证器 App 获取
})

// 3. 登录时，如果启用了 MFA，会收到需要 MFA 的响应
const { data, error } = await supabase.auth.signInWithPassword({
  email, password
})

if (data?.nextStep === 'mfa/verify') {
  // 需要用户提供 MFA 码
  const mfaCode = prompt('请输入认证器 App 中的 6 位码')
  await supabase.auth.mfa.verify({ factorId, code: mfaCode })
}
```

---

## 4.7 安全最佳实践

### 密码策略

```javascript
// 配置密码强度要求
// 在 Supabase Dashboard 或 config.toml 中设置：

[auth.password]
min_length = 8          // 最小长度
max_length = 128        // 最大长度
require_uppercase = true  // 需要大写字母
require_lowercase = true  // 需要小写字母
require_digits = true     // 需要数字
require_special = true    // 需要特殊字符
```

### 速率限制

| 操作 | 限制 | 目的 |
|------|------|------|
| **登录** | 5 次/分钟 | 防止暴力破解 |
| **注册** | 3 次/分钟 | 防止垃圾注册 |
| **OTP 发送** | 3 次/分钟 | 防止短信轰炸 |
| **密码重置** | 3 次/分钟 | 防止邮件轰炸 |

### 会话安全配置

```javascript
const supabase = createClient(url, anonKey, {
  auth: {
    // 会话超时（秒），默认 86400（24 小时）
    autoRefreshToken: true,
    
    // 使用安全存储（HTTP-only Cookie）而非 localStorage
    // 需要自定义实现
    storage: {
      getItem: (key) => {
        // 从 HTTP-only Cookie 读取
      },
      setItem: (key, value) => {
        // 写入 HTTP-only Cookie
      },
      removeItem: (key) => {
        // 删除 Cookie
      }
    }
  }
})
```

### 防攻击措施

| 攻击类型 | 防御措施 |
|----------|----------|
| **暴力破解** | 登录速率限制、账户锁定 |
| **XSS 窃取 Token** | 使用 HTTP-only Cookie、CSP 头 |
| **CSRF** | SameSite Cookie、CSRF Token |
| **重放攻击** | Refresh Token 轮换、使旧 Token 失效 |
| **钓鱼** | 确认邮件、MFA 多因素认证 |

---

## 本章小结

本章深入解析了 Supabase Auth 认证与授权系统：

1. **架构概览**：GoTrue 服务、JWT、PostgreSQL 三层架构
2. **认证方式**：邮箱密码、Magic Link、OTP、OAuth、匿名登录、SAML/SSO
3. **JWT 管理**：Payload Claims、Token 生命周期、自动刷新机制
4. **RLS 集成**：auth.uid() 函数、策略组合、数据访问控制
5. **生命周期**：注册→确认→活跃会话→刷新循环→登出→密码恢复
6. **MFA 多因素**：TOTP 验证码、启用流程、登录验证
7. **安全实践**：密码策略、速率限制、会话安全、防攻击措施


第 5 章 实时数据订阅 (Realtime) 活动流程解析
==================================================

## 5.1 Realtime 架构概览

### 核心组件

Supabase Realtime 是一个基于 **Elixir** 构建的实时服务器，利用 PostgreSQL 的逻辑复制功能实现变更数据捕获（CDC），通过 WebSocket 将数据变更实时推送到客户端。

```mermaid
graph TB
    subgraph Client["客户端层"]
        SDK[Realtime SDK<br/>WebSocket 连接]
    end
    
    subgraph Realtime["Realtime 服务"]
        WS[WebSocket 服务器]
        SubManager[订阅管理器]
        MsgDispatcher[消息分发器]
    end
    
    subgraph Postgres["PostgreSQL"]
        WAL[预写日志 WAL]
        ReplSlot[逻辑复制槽]
        Notify[pg_notify]
    end
    
    SDK -- WebSocket --> WS
    WS -- 管理订阅 --> SubManager
    SubManager -- 监听 --> ReplSlot
    ReplSlot -- 读取 WAL --> WAL
    Postgres -- 变更事件 --> MsgDispatcher
    MsgDispatcher -- 推送 --> WS
```

### 技术栈

| 组件 | 技术 | 职责 |
|------|------|------|
| **Realtime Server** | Elixir | WebSocket 连接管理、消息路由 |
| **PostgreSQL CDC** | 逻辑复制 | 捕获 INSERT/UPDATE/DELETE |
| **WebSocket** | 实时协议 | 双向通信、低延迟推送 |
| **Replication Slot** | 数据库特性 | 持续跟踪 WAL 变更 |

---

## 5.2 三种实时功能模式

### 模式对比

| 模式 | 说明 | 适用场景 | 延迟 |
|------|------|----------|------|
| **Postgres Changes** | 监听数据库变更（CDC） | 实时数据同步、协作编辑 | ~100ms |
| **Broadcast** | 向所有客户端广播消息 | 聊天室、通知推送 | <50ms |
| **Presence** | 在线状态同步 | 用户列表、协作指示器 | ~200ms |

### 使用示例

```javascript
// 初始化 Realtime 客户端
const realtime = supabase.channel('room-1')

// 1. Postgres Changes - 监听数据库变更
realtime.on(
  'postgres_changes',
  {
    event: '*',  // INSERT, UPDATE, DELETE, *
    schema: 'public',
    table: 'messages',
    filter: `user_id=eq.${userId}`  // 可选过滤
  },
  (payload) => {
    console.log('数据库变更:', payload)
    // payload 包含：
    // - eventType: 'INSERT' | 'UPDATE' | 'DELETE'
    // - schema: 表所属 schema
    // - table: 表名
    // - record: 新数据（INSERT/UPDATE）
    // - old_record: 旧数据（DELETE/UPDATE）
  }
)

// 2. Broadcast - 广播消息
realtime.on('broadcast', { event: 'reaction' }, (payload) => {
  console.log('收到广播:', payload)
})

// 发送广播
await realtime.send({
  type: 'broadcast',
  event: 'reaction',
  payload: { emoji: '👍' }
})

// 3. Presence - 在线状态
realtime.on('presence', { event: 'sync' }, () => {
  const state = realtime.presenceState()
  console.log('在线用户:', state)
  // state 结构：
  // {
  //   'user-1': [{ online_at: "...", meta: {...} }],
  //   'user-2': [{ online_at: "...", meta: {...} }]
  // }
})

// 加入频道（开始监听）
await realtime.subscribe()
```

---

## 5.3 变更数据捕获 (CDC) 原理

### 什么是 CDC？

**变更数据捕获 (Change Data Capture, CDC)** 是一种数据库技术，通过监听数据库的预写日志（WAL）来捕获数据变更，实现实时数据同步。

### CDC 核心优势

| 优势 | 说明 |
|------|------|
| **实时性** | 毫秒级数据同步延迟 |
| **可靠性** | 基于 PostgreSQL 内置复制机制 |
| **性能友好** | 不影响数据库主线程性能 |
| **一致性** | 遵循事务隔离级别 |

### WAL 预写日志机制

```mermaid
flowchart TD
    Tx[事务开始] --> Write[写入 WAL 日志]
    Write --> Checkpoint[检查点]
    Checkpoint --> DataFile[写入数据文件]
    
    subgraph Realtime 监听
        ReplSlot[逻辑复制槽] --> ReadWAL[读取 WAL]
        ReadWAL --> Decode[解码消息]
        Decode --> Broadcast[广播给订阅者]
    end
    
    Write -.-> ReplSlot
```

### PostgreSQL WAL 结构

WAL（Write-Ahead Logging）是 PostgreSQL 的事务日志，记录所有数据变更：

```
WAL 记录结构：
┌─────────────────────────────────────┐
│ LSN (Log Sequence Number)           │  ← 日志位置标识
├─────────────────────────────────────┤
│ Transaction ID                      │  ← 事务 ID
├─────────────────────────────────────┤
│ Operation Type (INSERT/UPDATE/...)  │  ← 操作类型
├─────────────────────────────────────┤
│ Table OID                           │  ← 表标识
├─────────────────────────────────────┤
│ Before Image (旧数据)                │  ← UPDATE/DELETE 前
├─────────────────────────────────────┤
│ After Image (新数据)                 │  ← INSERT/UPDATE 后
└─────────────────────────────────────┘
```

---

## 5.4 Realtime CDC 架构解析

### 核心模块

```
supabase/realtime/
├── lib/realtime/
│   ├── adapters/
│   │   └── postgres/
│   │       ├── decoder.ex      # WAL 消息解码器
│   │       └── protocol.ex     # 复制协议解析
│   └── extensions/
│       └── postgres_cdc_rls/
│           ├── cdc_rls.ex          # CDC + RLS 核心实现
│           ├── replication_poller.ex  # WAL 轮询器
│           ├── subscription_manager.ex # 订阅管理
│           └── message_dispatcher.ex  # 消息分发
```

### 模块职责详解

| 模块 | 职责 | 关键函数 |
|------|------|----------|
| **decoder.ex** | 解析 PostgreSQL 复制消息 | `parse/1`, `decode_wal/1` |
| **protocol.ex** | 处理复制协议 | `is_write/1`, `is_keep_alive/1` |
| **cdc_rls.ex** | CDC + RLS 集成 | 确保用户只接收授权数据 |
| **replication_poller.ex** | 从复制槽拉取 WAL | `start_link/1`, `poll/1` |
| **subscription_manager.ex** | 管理客户端订阅关系 | `subscribe/3`, `unsubscribe/2` |
| **message_dispatcher.ex** | 分发变更事件到 WebSocket | `dispatch/2` |

### 数据流路径详解

```mermaid
sequenceDiagram
    participant DB as PostgreSQL
    participant ReplSlot as 复制槽
    participant Poller as replication_poller
    participant Decoder as decoder.ex
    participant Dispatcher as message_dispatcher
    participant WebSocket as WebSocket 连接
    participant Client as 客户端 SDK
    
    DB->>ReplSlot: 数据变更写入 WAL
    Poller->>ReplSlot: 轮询读取 WAL
    ReplSlot-->>Poller: 返回 WAL 记录
    Poller->>Decoder: 二进制 WAL 数据
    Decoder->>Decoder: 解析为结构化数据
    Decoder-->>Dispatcher: {event, schema, table, record}
    Dispatcher->>Dispatcher: 匹配订阅过滤
    Dispatcher->>WebSocket: JSON 消息推送
    WebSocket->>Client: 实时收到变更
    
    Note over Poller,Client: 整个过程 < 100ms
```

---

## 5.5 完整活动流程：从监听到同步

### 流程概览

```mermaid
flowchart TD
    Start[客户端发起订阅] --> Connect[建立 WebSocket 连接]
    Connect --> Subscribe[发送订阅消息]
    Subscribe --> Validate[验证 JWT 权限]
    Validate --> Register[注册订阅到管理器]
    Register --> Poll[轮询 WAL 日志]
    Poll --> Change{检测到变更？}
    Change -->|是 | Decode[解码 WAL 消息]
    Decode --> Filter[应用 RLS 和过滤条件]
    Filter --> Authorized{通过授权？}
    Authorized -->|是 | Push[推送给客户端]
    Authorized -->|否 | Discard[丢弃事件]
    Change -->|否 | Poll
    Push --> Client[客户端收到变更]
    
    style Start fill:#4CAF50
    style Client fill:#2196F3
```

### 阶段 1：建立连接

```javascript
// 客户端建立 WebSocket 连接
const channel = supabase.channel('chat-room', {
  config: {
    presence: { key: 'user-123' }  // Presence 标识
  }
})

// 底层发生的过程：
// 1. SDK 创建 WebSocket 连接 wss://<project>.supabase.co/realtime/v1
// 2. 发送 JOIN 消息，包含 Channel Topic 和配置
// 3. 服务端创建 Channel 进程（Elixir GenServer）
// 4. 返回 channel: "phx_reply" 确认
```

### 阶段 2：订阅数据库变更

```javascript
channel.on(
  'postgres_changes',
  {
    event: 'INSERT',
    schema: 'public',
    table: 'messages',
    filter: 'room_id=eq.1'
  },
  (payload) => {
    console.log('新消息:', payload)
  }
)

// 底层发生的过程：
// 1. SDK 发送 SUBSCRIPTION 消息到服务端
// 2. subscription_manager.ex 注册订阅关系
// 3. 检查 PostgreSQL 复制槽是否存在，不存在则创建
// 4. replication_poller.ex 开始轮询 WAL
```

### 阶段 3：WAL 变更捕获

```sql
-- PostgreSQL 内部过程：

-- 1. 客户端执行 INSERT
INSERT INTO messages (room_id, content) 
VALUES (1, 'Hello!');

-- 2. PostgreSQL 写入 WAL 日志
-- LSN: 0/12345678
-- Operation: INSERT
-- Table OID: 16384 (messages 表)
-- Record: {id: 1, room_id: 1, content: 'Hello!'}

-- 3. Realtime 通过复制槽读取
-- SELECT * FROM pg_logical_slot_get_changes(
--   'realtime_rls_slot',  -- 复制槽名称
--   NULL, NULL,           -- LSN 范围
--   'include-pk' '1',
--   'include-transaction' '0'
-- )
```

### 阶段 4：消息解码与过滤

```elixir
# lib/realtime/adapters/postgres/decoder.ex

# 解码器将二进制 WAL 消息转换为结构化数据
def parse_message(binary_data) do
  # 解析消息头
  <<lsn::64, transaction_id::32, ...>> = binary_data
  
  # 解析操作类型
  operation = case <<type::8>> do
    ?I -> :INSERT
    ?U -> :UPDATE
    ?D -> :DELETE
    ?R -> :RELATION  # 表结构变更
  end
  
  # 解析数据负载
  record = decode_tuple(body)
  
  %Write{
    lsn: lsn,
    operation: operation,
    table: table_name,
    record: record
  }
end
```

### 阶段 5：RLS 授权检查

```elixir
# lib/extensions/postgres_cdc_rls/cdc_rls.ex

# 检查用户是否有权接收此变更事件
def check_rls(user_id, schema, table, record) do
  # 执行 PostgreSQL RLS 策略检查
  query = """
    SELECT CASE 
      WHEN EXISTS (
        SELECT 1 FROM #{schema}.#{table}
        WHERE id = $1 AND user_id = $2
      ) THEN true
      ELSE false
    END
  """
  
  Repo.query!(query, [record.id, user_id])
end
```

### 阶段 6：WebSocket 推送

```elixir
# lib/realtime_web/channels/realtime_channel.ex

# 通过 WebSocket 推送变更事件
def push_change(client_pid, event) do
  payload = %{
    event_type: event.operation,
    schema: event.schema,
    table: event.table,
    record: event.record,
    old_record: event.old_record  # UPDATE/DELETE
  }
  
  Phoenix.Channel.push(client_pid, "postgres_changes", payload)
end
```

### 阶段 7：客户端接收

```javascript
// 客户端收到推送（通常在 100ms 内）
channel.on('postgres_changes', { event: 'INSERT', ... }, (payload) => {
  console.log('收到实时消息:', payload)
  // {
  //   eventType: 'INSERT',
  //   schema: 'public',
  //   table: 'messages',
  //   record: { id: 1, room_id: 1, content: 'Hello!' }
  // }
  
  // 更新 UI
  setMessages(prev => [...prev, payload.record])
})
```

---

## 5.6 订阅管理与性能优化

### 订阅过滤策略

```javascript
// 精确过滤（推荐）
channel.on('postgres_changes', {
  event: 'INSERT',
  schema: 'public',
  table: 'messages',
  filter: 'room_id=eq.1'  // 只接收 room_id=1 的消息
})

// 宽泛过滤（不推荐，会产生大量无用数据）
channel.on('postgres_changes', {
  event: '*',
  schema: 'public',
  table: '*'  // 监听所有表
})
```

### 批量变更处理

```javascript
// Realtime 支持批量推送变更（减少网络请求）
const channel = supabase.channel('bulk-channel', {
  config: {
    broadcast: {
      self: false,  // 不接收自己发送的消息
      acknowledge: true  // 需要服务端确认
    }
  }
})

// 服务端会合并短时间内（默认 100ms）的多个变更
// 一次性推送给客户端
```

### 断线重连机制

```javascript
// SDK 自动处理断线重连
supabase.realtime.setAuth(token)  // 重连前更新 Token

// 监听连接状态
supabase.realtime.onOpen(() => {
  console.log('WebSocket 已连接')
})

supabase.realtime.onClose(() => {
  console.log('WebSocket 已断开')
})

supabase.realtime.onError((error) => {
  console.error('WebSocket 错误:', error)
  // SDK 会自动尝试重连（指数退避）
})
```

### 性能最佳实践

| 优化项 | 建议 | 原因 |
|--------|------|------|
| **精确过滤** | 使用 `filter` 缩小范围 | 减少无用数据传输 |
| **频道隔离** | 不同功能使用不同频道 | 避免相互干扰 |
| **Presence 节流** | 限制更新频率（~1 秒） | 减少网络开销 |
| **批量订阅** | 合并相似订阅 | 减少复制槽数量 |
| **心跳检测** | 启用 WebSocket Ping | 及时发现断线 |

---

## 5.7 典型应用场景

### 场景 1：实时聊天应用

```javascript
// 1. 订阅聊天室消息
const channel = supabase.channel(`chat:${roomId}`)

channel
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'messages',
    filter: `room_id=eq.${roomId}`
  }, (payload) => {
    // 新消息到达，更新 UI
    addMessage(payload.record)
  })
  .on('presence', { event: 'sync' }, () => {
    // 更新在线用户列表
    const users = channel.presenceState()
    updateOnlineUsers(users)
  })
  .subscribe()

// 2. 发送消息
await supabase.from('messages').insert({
  room_id: roomId,
  content: 'Hello!'
})

// 3. 追踪在线状态
channel.track({ user_id: userId, name: '张三' })
```

### 场景 2：协作编辑（类似 Google Docs）

```javascript
// 1. 订阅文档变更
const docChannel = supabase.channel(`doc:${docId}`)

docChannel
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'documents',
    filter: `id=eq.${docId}`
  }, (payload) => {
    // 应用变更（使用 OT 或 CRDT 算法）
    applyChange(payload.new_record.content)
  })
  .on('presence', { event: 'sync' }, () => {
    // 显示协作者光标位置
    const collaborators = docChannel.presenceState()
    renderCollaboratorCursors(collaborators)
  })
  .subscribe()

// 2. 追踪用户编辑状态
docChannel.track({
  user_id: userId,
  cursor_position: 123,
  selection: { start: 100, end: 150 }
})
```

### 场景 3：实时仪表盘

```javascript
// 1. 订阅订单数据
const dashboardChannel = supabase.channel('dashboard')

dashboardChannel
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'orders'
  }, (payload) => {
    // 实时更新销售统计
    updateMetrics(payload.record)
  })
  .subscribe()

// 2. 使用物化视图预计算
// SQL: 创建实时统计视图
CREATE MATERIALIZED VIEW order_stats AS
SELECT 
  COUNT(*) as total_orders,
  SUM(amount) as total_revenue,
  AVG(amount) as avg_order_value
FROM orders;

-- 实时刷新
REFRESH MATERIALIZED VIEW CONCURRENTLY order_stats;
```

---

## 本章小结

本章深入解析了 Supabase Realtime 实时数据订阅系统：

1. **架构概览**：Elixir 服务器、PostgreSQL CDC、WebSocket 三层架构
2. **三种模式**：Postgres Changes（数据库变更）、Broadcast（广播）、Presence（在线状态）
3. **CDC 原理**：WAL 预写日志、逻辑复制槽、变更捕获机制
4. **核心模块**：decoder（解码）、replication_poller（轮询）、subscription_manager（订阅）、dispatcher（分发）
5. **完整活动流程**：连接→订阅→WAL 捕获→解码→RLS 授权→推送→客户端接收
6. **性能优化**：精确过滤、频道隔离、批量订阅、断线重连
7. **应用场景**：实时聊天、协作编辑、实时仪表盘


第 6 章 文件存储 (Storage) 架构与原理
=========================================

## 6.1 Storage 架构概览

### 核心设计理念

Supabase Storage 是一款开源的 **S3 兼容对象存储服务**，其独特之处在于将**元数据存储在 PostgreSQL** 数据库中，为开发者提供了既熟悉又强大的存储解决方案。

### 分层架构设计

```mermaid
graph TB
    subgraph Frontend["前端交互层"]
        Dashboard[Dashboard 仪表盘]
        ClientLib[客户端 SDK]
    end
    
    subgraph Middleware["中间件处理层"]
        Kong[Kong API 网关<br/>路由/认证/限流]
        StorageAPI[Storage API Server<br/>核心业务逻辑]
        Postgres[(PostgreSQL<br/>元数据存储)]
    end
    
    subgraph Backend["后端存储层"]
        S3[S3 兼容存储<br/>AWS S3/MinIO]
        Backblaze[Backblaze B2<br/>低成本存储]
    end
    
    Dashboard --> Kong
    ClientLib --> Kong
    Kong --> StorageAPI
    StorageAPI --> Postgres
    StorageAPI --> S3
    StorageAPI --> Backblaze
```

### 各层职责详解

| 层级 | 组件 | 职责 | 技术栈 |
|------|------|------|--------|
| **前端层** | Dashboard | 可视化管理界面 | React |
| | Client Libraries | 多语言 SDK（JS/Python 等） | TypeScript |
| **中间件层** | Kong API Gateway | 请求路由、认证鉴权、流量控制 | Nginx/Lua |
| | Storage API Server | 核心业务逻辑、元数据管理 | Node.js |
| | PostgreSQL | 存储文件元数据、权限策略 | PostgreSQL 15+ |
| **后端层** | S3 兼容存储 | 实际文件存储 | AWS S3/MinIO |
| | Backblaze B2 | 低成本冷存储选项 | Backblaze API |

---

## 6.2 核心架构特性

### 元数据管理优势

与传统对象存储不同，Supabase Storage 将元数据存储在 PostgreSQL 中：

| 特性 | 说明 |
|------|------|
| **SQL 查询能力** | 使用 SQL 查询文件元数据（名称、类型、大小等） |
| **RLS 权限集成** | 通过 PostgreSQL RLS 实现细粒度访问控制 |
| **事务一致性** | 文件操作与元数据更新在同一事务中 |
| **关联查询** | 文件数据与业务数据关联查询 |

### 元数据表结构

```sql
-- 存储桶表
CREATE TABLE storage.buckets (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  owner UUID REFERENCES auth.users,
  public BOOLEAN DEFAULT false,
  file_size_limit BIGINT,
  allowed_mime_types TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 对象（文件）表
CREATE TABLE storage.objects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bucket_id TEXT REFERENCES storage.buckets,
  name TEXT NOT NULL,
  owner UUID REFERENCES auth.users,
  metadata JSONB,
  path_tokens TEXT[],  -- 路径分段，支持嵌套查询
  version TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建索引加速查询
CREATE INDEX idx_objects_bucket_name ON storage.objects(bucket_id, name);
CREATE INDEX idx_objects_path_tokens ON storage.objects USING GIN(path_tokens);
```

---

### 对象存储元数据详解

#### 什么是对象存储元数据？

**对象存储元数据（Object Metadata）** 是描述文件属性和特征的结构化数据，它与实际文件内容分离存储，用于快速查询和管理。

#### 元数据的存储位置

Supabase Storage 采用**元数据与文件分离**的架构：

```
┌─────────────────────────────────────────────────────────────┐
│                      用户上传文件                            │
└─────────────────────────────────────────────────────────────┘
                            ↓
        ┌───────────────────┴───────────────────┐
        ↓                                       ↓
┌───────────────────┐                 ┌───────────────────┐
│   PostgreSQL      │                 │   S3 兼容存储      │
│   (元数据)        │                 │   (实际文件)       │
│                   │                 │                   │
│ - 文件名          │                 │ - 二进制数据       │
│ - 文件大小        │                 │ - 分块存储         │
│ - MIME 类型       │                 │ - 冗余备份         │
│ - 所有者          │                 │                   │
│ - 自定义 metadata │                 │                   │
└───────────────────┘                 └───────────────────┘
```

#### 元数据结构详解

**`storage.objects` 表字段说明：**

| 字段 | 类型 | 说明 | 示例 |
|------|------|------|------|
| `id` | UUID | 文件唯一标识 | `550e8400-e29b-41d4-a716-446655440000` |
| `bucket_id` | TEXT | 所属存储桶 ID | `user-uploads` |
| `name` | TEXT | 文件名（含路径） | `avatars/user-123.jpg` |
| `owner` | UUID | 所有者用户 ID | `auth.users.id` |
| `metadata` | JSONB | 自定义元数据 | 见下方详解 |
| `path_tokens` | TEXT[] | 路径分段数组 | `['avatars', 'user-123.jpg']` |
| `version` | TEXT | 版本号（用于并发控制） | `v1`, `v2` |
| `created_at` | TIMESTAMPTZ | 创建时间 | `2026-04-06 10:00:00+00` |
| `updated_at` | TIMESTAMPTZ | 最后更新时间 | `2026-04-06 12:00:00+00` |

#### metadata JSONB 字段详解

**`metadata` 字段存储文件的详细属性：**

```json
{
  "mimetype": "image/jpeg",
  "size": 1048576,
  "etag": "d41d8cd98f00b204e9800998ecf8427e",
  "cacheControl": "max-age=3600",
  "contentDisposition": "inline",
  "contentLanguage": "zh-CN",
  "contentEncoding": "gzip",
  "uploadedBy": "user-123",
  "uploadedAt": "2026-04-06T10:00:00Z",
  "lastAccessedAt": "2026-04-06T12:00:00Z",
  "custom": {
    "projectId": "proj-456",
    "tags": ["avatar", "profile"],
    "isPublic": false
  }
}
```

**系统自动填充的元数据：**

| 元数据键 | 说明 | 来源 |
|----------|------|------|
| `mimetype` | 文件 MIME 类型 | 自动检测 |
| `size` | 文件大小（字节） | 自动计算 |
| `etag` | 文件内容的 MD5 哈希 | S3 返回 |
| `cacheControl` | CDN 缓存控制 | 上传时指定 |
| `contentDisposition` | 内容处置方式 | `inline` 或 `attachment` |

**用户自定义元数据：**

```javascript
// 上传时添加自定义元数据
const { data, error } = await supabase.storage
  .from('user-uploads')
  .upload('documents/report.pdf', file, {
    metadata: {
      projectId: 'proj-456',
      department: 'engineering',
      classification: 'internal',
      tags: ['quarterly', 'report', '2026']
    }
  })
```

#### 元数据的实际应用场景

**场景 1：按文件类型查询**
```sql
-- 查询某个用户的所有图片文件
SELECT name, metadata->>'size' as size
FROM storage.objects
WHERE bucket_id = 'user-uploads'
  AND owner = auth.uid()
  AND metadata->>'mimetype' LIKE 'image/%';
```

**场景 2：按标签搜索**
```sql
-- 查询包含特定标签的文件
SELECT name
FROM storage.objects
WHERE bucket_id = 'documents'
  AND metadata->'custom'->'tags' ? 'quarterly';
```

**场景 3：统计存储使用量**
```sql
-- 统计每个用户的存储使用量
SELECT 
  owner,
  COUNT(*) as file_count,
  SUM((metadata->>'size')::BIGINT) as total_bytes
FROM storage.objects
WHERE bucket_id = 'user-uploads'
GROUP BY owner
ORDER BY total_bytes DESC;
```

**场景 4：清理过期文件**
```sql
-- 删除超过 1 年未访问的文件
DELETE FROM storage.objects
WHERE bucket_id = 'temp-uploads'
  AND (metadata->>'lastAccessedAt')::TIMESTAMPTZ < NOW() - INTERVAL '1 year';
```

#### 元数据 vs S3 对象元数据

| 特性 | Supabase PostgreSQL 元数据 | AWS S3 对象元数据 |
|------|---------------------------|------------------|
| **查询能力** | ✅ 完整 SQL 查询 | ❌ 仅支持前缀搜索 |
| **索引支持** | ✅ 可创建任意索引 | ❌ 无索引 |
| **事务支持** | ✅ ACID 事务 | ❌ 无事务 |
| **关联查询** | ✅ 可 JOIN 业务表 | ❌ 无法关联 |
| **RLS 集成** | ✅ 行级安全策略 | ❌ 需 IAM 策略 |
| **自定义字段** | ✅ JSONB 灵活扩展 | ⚠️ 仅支持字符串键值对 |

**示例对比：**
```sql
-- Supabase: 一条 SQL 完成复杂查询
SELECT o.name, u.username
FROM storage.objects o
JOIN profiles u ON o.owner = u.id
WHERE o.bucket_id = 'public-assets'
  AND (o.metadata->>'size')::BIGINT > 1048576
  AND o.metadata->'custom'->'tags' ? 'featured';

-- S3: 需要额外的 DynamoDB/数据库配合
-- 1. 从 DynamoDB 查询符合条件的 key 列表
-- 2. 再用 key 列表去 S3 获取文件
```

---

## 6.3 存储桶 (Bucket) 管理

### 核心概念

**存储桶** 是文件组织的基本单元，类似于文件夹但具有独立的权限配置。

### 创建与管理

```javascript
// 1. 创建存储桶
const { data, error } = await supabase.storage.createBucket(
  'user-uploads',  // 桶 ID
  {
    public: false,           // 私有桶
    fileSizeLimit: 52428800, // 50MB 限制
    allowedMimeTypes: ['image/jpeg', 'image/png'] // 允许的文件类型
  }
)

// 2. 获取存储桶列表
const { data } = await supabase.storage.listBuckets()

// 3. 获取存储桶详情
const { data } = await supabase.storage.getBucket('user-uploads')

// 4. 更新存储桶配置
await supabase.storage.updateBucket('user-uploads', {
  public: true,
  fileSizeLimit: 104857600  // 100MB
})

// 5. 删除存储桶
await supabase.storage.deleteBucket('user-uploads')
```

### 桶权限策略

```sql
-- 启用 RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 策略 1：桶所有者可上传文件
CREATE POLICY "所有者上传" ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'user-uploads' AND auth.uid() = owner);

-- 策略 2：任何人可读取公共桶文件
CREATE POLICY "公共读取" ON storage.objects
  FOR SELECT
  USING (bucket_id IN (SELECT id FROM storage.buckets WHERE public = true));

-- 策略 3：桶所有者可删除自己的文件
CREATE POLICY "所有者删除" ON storage.objects
  FOR DELETE
  USING (bucket_id = 'user-uploads' AND auth.uid() = owner);
```

---

## 6.4 文件上传与下载

### 上传方式

| 方式 | 说明 | 适用场景 |
|------|------|----------|
| **简单上传** | 一次性上传小文件 | < 5MB 的文件 |
| **分片上传** | 大文件分块上传 | > 50MB 的文件 |
| **签名 URL** | 客户端直传 S3 | 移动应用、前端直传 |

### 简单上传

```javascript
// 从 File 对象上传（Web）
const fileInput = document.querySelector('input[type="file"]')
const file = fileInput.files[0]

const { data, error } = await supabase.storage
  .from('user-uploads')
  .upload('profile-picture.jpg', file, {
    cacheControl: '3600',
    upsert: false  // 是否覆盖已存在的文件
  })

// 从 Buffer 上传（Node.js）
const fs = require('fs')
const fileData = fs.readFileSync('./local-file.jpg')

const { data, error } = await supabase.storage
  .from('user-uploads')
  .upload('documents/report.pdf', fileData, {
    contentType: 'application/pdf'
  })
```

### 分片上传（大文件）

```javascript
// 分片上传适用于 > 50MB 的大文件
const { data, error } = await supabase.storage
  .from('user-uploads')
  .createSignedUploadUrl('large-video.mp4')

// 返回上传 URL 和路径
// { signedUrl: 'https://...', path: 'large-video.mp4' }

// 使用分块上传
const CHUNK_SIZE = 5 * 1024 * 1024  // 5MB per chunk
const chunks = []

for (let i = 0; i < file.size; i += CHUNK_SIZE) {
  const chunk = file.slice(i, i + CHUNK_SIZE)
  chunks.push(chunk)
}

// 并行上传所有分片
await Promise.all(chunks.map((chunk, index) => 
  uploadChunk(data.signedUrl, chunk, index)
))

// 完成上传（合并分片）
await supabase.storage.from('user-uploads').moveToDestination(data.path)
```

### 下载文件

```javascript
// 1. 下载为 Blob
const { data, error } = await supabase.storage
  .from('user-uploads')
  .download('profile-picture.jpg')

// data 是 Blob 对象，可用于显示图片
const imageUrl = URL.createObjectURL(data)

// 2. 获取临时访问 URL（有效期可配置）
const { data } = await supabase.storage
  .from('user-uploads')
  .createSignedUrl('profile-picture.jpg', 60)  // 60 秒有效

// data.signedUrl = 'https://.../profile-picture.jpg?token=xxx'

// 3. 批量生成签名 URL
const { data } = await supabase.storage
  .from('user-uploads')
  .createSignedUrls(['file1.jpg', 'file2.jpg', 'file3.jpg'], 3600)
```

---

## 6.5 图片转换

### 支持的转换操作

| 操作 | 参数 | 说明 |
|------|------|------|
| **缩放** | `width`, `height` | 调整图片尺寸 |
| **裁剪** | `gravity`, `resize` | 智能裁剪 |
| **格式转换** | `format` | webp/jpeg/png |
| **质量调整** | `quality` | 1-100 |

### 转换示例

```javascript
// 1. 获取转换后的图片 URL
const { data } = supabase.storage
  .from('user-uploads')
  .getPublicUrl('profile-picture.jpg', {
    transform: {
      width: 200,
      height: 200,
      fit: 'cover',      // cover/contain/fill
      gravity: 'center', // center/smart/face
      format: 'webp',    // webp/jpeg/png
      quality: 80
    }
  })

// data.publicUrl = 'https://.../profile-picture.jpg?width=200&height=200&...'

// 2. 下载转换后的图片
const { data } = await supabase.storage
  .from('user-uploads')
  .download('profile-picture.jpg', {
    transform: {
      width: 100,
      height: 100
    }
  })
```

### 应用场景

| 场景 | 转换配置 |
|------|----------|
| **头像缩略图** | `width: 100, height: 100, fit: 'cover', gravity: 'face'` |
| **商品列表图** | `width: 300, height: 300, fit: 'cover'` |
| **响应式图片** | 生成多个尺寸版本 (`srcset`) |
| **Web 优化** | `format: 'webp', quality: 80` |

---

## 6.6 访问控制与权限

### 权限层级

```mermaid
flowchart TD
    Public["公共权限 (Public Bucket)"] --> Anyone[任何人可访问]
    Private["私有权限 (Private Bucket)"] --> RLS[RLS 策略控制]
    
    RLS --> OwnerPolicy[所有者策略]
    RLS --> RolePolicy[角色策略]
    RLS --> CustomPolicy[自定义策略]
    
    OwnerPolicy --> Auth[认证用户]
    RolePolicy --> Admin[管理员角色]
    CustomPolicy --> Condition[条件判断]
```

### RLS 策略配置

```sql
-- 场景 1：用户只能访问自己的文件
CREATE POLICY "用户访问自己的文件" ON storage.objects
  FOR ALL
  USING (owner = auth.uid())
  WITH CHECK (owner = auth.uid());

-- 场景 2：公共读取，私有写入
CREATE POLICY "公共读取" ON storage.objects
  FOR SELECT
  USING (true);  -- 任何人都可以读取

CREATE POLICY "认证用户写入" ON storage.objects
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- 场景 3：基于角色的访问
CREATE POLICY "管理员访问所有" ON storage.objects
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- 场景 4：限制文件类型
CREATE POLICY "只允许图片" ON storage.objects
  FOR INSERT
  WITH CHECK (
    metadata->>'mimetype' IN ('image/jpeg', 'image/png', 'image/gif')
  );
```

### 签名 URL 安全

```javascript
// 签名 URL 适用于临时授权访问
// 例如：付费内容预览、私有文件临时分享

// 生成 1 小时后过期的访问 URL
const { data } = await supabase.storage
  .from('premium-content')
  .createSignedUrl('exclusive-video.mp4', 3600)

// 安全最佳实践：
// 1. 设置合理的过期时间（不要太长）
// 2. 对于敏感操作，使用一次性 URL
// 3. 结合业务逻辑验证用户权限
```

---

## 6.7 CDN 分发原理

### CDN 集成架构

```mermaid
graph LR
    User[用户请求] --> CDN[CDN 边缘节点]
    CDN --> Cache{缓存命中？}
    Cache -->|是 | Return[直接返回]
    Cache -->|否 | Origin[源站 Storage]
    Origin --> Store[CDN 缓存]
    Store --> Return
    
    subgraph Supabase
        Origin
        StorageAPI[Storage API]
        S3[S3 后端存储]
    end
```

### CDN 工作流程

1. **首次请求**：CDN 边缘节点回源到 Supabase Storage，获取文件
2. **缓存存储**：CDN 将文件缓存到边缘节点
3. **后续请求**：直接从 CDN 边缘节点返回，无需回源
4. **缓存失效**：达到 TTL 或手动刷新后，重新回源

### 配置 CDN

```javascript
// 公共桶默认启用 CDN 加速
// 访问 URL 自动使用 CDN 域名

const { data } = supabase.storage
  .from('public-assets')
  .getPublicUrl('logo.png')

// data.publicUrl = 'https://<cdn-domain>.supabase.co/storage/v1/object/public/assets/logo.png'

// CDN 缓存控制
await supabase.storage
  .from('public-assets')
  .upload('cached-file.jpg', file, {
    cacheControl: '31536000'  // 1 年缓存
  })
```

### 缓存策略建议

| 文件类型 | Cache-Control | 说明 |
|----------|---------------|------|
| **静态资源** | `max-age=31536000` | JS/CSS/图片，长期缓存 |
| **用户头像** | `max-age=3600` | 1 小时缓存 |
| **动态内容** | `no-cache` | 每次验证 freshness |
| **私有文件** | `private` | 仅浏览器缓存 |

---

## 6.8 性能优化最佳实践

### 上传优化

| 优化项 | 方法 | 效果 |
|--------|------|------|
| **分片上传** | 大文件切分为 5MB 块 | 支持断点续传 |
| **并行上传** | 同时上传多个分片 | 减少上传时间 |
| **客户端直传** | 使用签名 URL 直传 S3 | 减少服务器负载 |
| **压缩预处理** | 前端压缩图片/视频 | 减少传输大小 |

### 下载优化

| 优化项 | 方法 | 效果 |
|--------|------|------|
| **CDN 加速** | 使用 CDN 边缘节点 | 减少延迟 |
| **图片转换** | 按需调整尺寸/格式 | 减少下载量 |
| **懒加载** | 滚动到视口再加载 | 减少初始请求 |
| **预缓存** | 预判用户需求预加载 | 提升体验 |

### 查询优化

```sql
-- 为常用查询创建索引
CREATE INDEX idx_objects_owner_bucket ON storage.objects(owner, bucket_id);
CREATE INDEX idx_objects_created_at ON storage.objects(created_at DESC);
CREATE INDEX idx_objects_metadata ON storage.objects USING GIN(metadata);

-- 使用路径令牌高效查询嵌套文件
SELECT * FROM storage.objects
WHERE bucket_id = 'user-uploads'
  AND path_tokens[1] = 'avatars'  -- 第一层路径
  AND owner = auth.uid();
```

---

## 本章小结

本章深入解析了 Supabase Storage 文件存储系统：

1. **架构设计**：前端层、中间件层（Kong+API+Postgres）、后端层（S3 兼容存储）
2. **元数据管理**：PostgreSQL 存储元数据，支持 SQL 查询、RLS 权限、事务一致性
3. **存储桶管理**：创建、配置、权限策略、文件类型限制
4. **文件操作**：简单上传、分片上传、签名 URL、下载
5. **图片转换**：缩放、裁剪、格式转换、质量调整
6. **访问控制**：RLS 策略、签名 URL、基于角色的权限
7. **CDN 分发**：边缘节点缓存、缓存策略、性能优化


第 7 章 边缘函数 (Edge Functions) 与开发工具
==================================================

## 7.1 Edge Functions 架构概览

### 核心概念

**Supabase Edge Functions** 是基于 **Deno 运行时** 的无服务器函数服务，允许开发者在全球边缘节点运行 TypeScript 代码，实现毫秒级冷启动和低延迟响应。

### 技术栈

| 组件 | 技术 | 职责 |
|------|------|------|
| **Deno Runtime** | Rust + V8 | 安全、现代的 JavaScript/TypeScript 运行时 |
| **Edge Runtime** | Supabase 自研 | 函数调度、隔离执行 |
| **全球边缘节点** | CDN 网络 | 就近执行、低延迟 |

### 与传统云函数的对比

| 特性 | AWS Lambda | Cloud Functions | Supabase Edge Functions |
|------|------------|-----------------|------------------------|
| **运行时** | Node.js/Python 等 | Node.js/Go/Python | Deno (TypeScript) |
| **冷启动** | 100ms-2s | 100ms-1s | <50ms |
| **部署位置** | 区域中心 | 区域中心 | 全球边缘节点 |
| **执行时长** | 最长 15 分钟 | 最长 9 分钟 | 最长 60 秒 |
| **内存限制** | 128MB-10GB | 128MB-32GB | 128MB |
| **数据库集成** | 需配置连接 | 需配置连接 | 直接访问 Supabase DB |

---

## 7.2 工作原理

### 执行流程

```mermaid
flowchart TD
    Request[客户端请求] --> Edge[边缘节点]
    Edge --> Runtime[Deno 运行时]
    Runtime --> Isolate[函数隔离执行]
    Isolate --> DB{需要数据库？}
    DB -->|是 | Connect[连接 PostgreSQL]
    DB -->|否 | Execute[直接执行]
    Connect --> Execute
    Execute --> Response[返回响应]
    
    subgraph "Deno 安全沙箱"
        Runtime
        Isolate
    end
```

### Deno 安全模型

Deno 默认采用安全沙箱模式：

| 权限 | 说明 | 获取方式 |
|------|------|----------|
| **网络访问** | 默认禁止外部网络请求 | `--allow-net` |
| **文件系统** | 默认只读访问 | `--allow-read` |
| **环境变量** | 默认不可访问 | `--allow-env` |
| **数据库连接** | 通过 Supabase SDK | 内置支持 |

### 函数执行环境

```typescript
// Edge Function 运行环境
// - Deno 1.x+ 运行时
// - 支持 TypeScript 原生执行（无需编译）
// - 内置 Supabase JS SDK
// - 支持 ES Modules 导入

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js'

serve(async (req: Request) => {
  // 函数逻辑
  return new Response('Hello from Edge!')
})
```

---

## 7.3 开发环境搭建

### 本地开发三步骤

```bash
# 1. 启动本地 Supabase 开发环境
supabase start

# 输出：
# - Database: http://localhost:54322
# - Studio: http://localhost:54323
# - Functions: http://localhost:54321

# 2. 创建新的 Edge Function
supabase functions new hello-world

# 创建目录结构：
# supabase/functions/hello-world/
# └── index.ts

# 3. 本地运行函数服务
supabase functions serve hello-world --env-file .env.local

# 访问：http://localhost:54321/functions/v1/hello-world
```

### 函数模板结构

```typescript
// supabase/functions/hello-world/index.ts

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req: Request) => {
  try {
    // 1. 解析请求体
    const { name } = await req.json()
    
    // 2. 创建 Supabase 客户端
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )
    
    // 3. 执行数据库查询
    const { data, error } = await supabaseClient
      .from('users')
      .select('*')
      .eq('name', name)
      .single()
    
    if (error) throw error
    
    // 4. 返回响应
    return new Response(
      JSON.stringify({ data }),
      { 
        headers: { 'Content-Type': 'application/json' },
        status: 200 
      }
    )
    
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
```

---

## 7.4 部署方式

### 方式 1：CLI 部署（推荐）

```bash
# 1. 登录 Supabase
supabase login

# 2. 链接项目
supabase link --project-ref xxxxxxxxxxxx

# 3. 部署单个函数
supabase functions deploy hello-world

# 4. 部署所有函数
supabase functions deploy

# 5. 查看函数列表
supabase functions list

# 6. 查看函数日志
supabase functions logs hello-world --follow
```

### 方式 2：Dashboard 可视化部署

1. 进入 Supabase Dashboard → Edge Functions
2. 点击 "Create new function"
3. 在在线编辑器中编写代码
4. 点击 "Save and Deploy"

**适用场景：** 快速迭代、团队协作、非技术人员参与

### 方式 3：CI/CD 自动化部署

```yaml
# .github/workflows/deploy-functions.yml

name: Deploy Edge Functions

on:
  push:
    branches: [main]
    paths:
      - 'supabase/functions/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Supabase CLI
        uses: supabase/setup-cli@v1
        
      - name: Login
        run: supabase login ${{ secrets.SUPABASE_ACCESS_TOKEN }}
        
      - name: Link Project
        run: supabase link --project-ref ${{ secrets.PROJECT_REF }}
        
      - name: Deploy Functions
        run: supabase functions deploy
```

---

## 7.5 典型应用场景

### 场景 1：Webhook 处理

```typescript
// supabase/functions/stripe-webhook/index.ts

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@12.0.0?target=deno'

serve(async (req: Request) => {
  // 1. 验证 Stripe 签名
  const signature = req.headers.get('Stripe-Signature')!
  const body = await req.text()
  
  const stripe = new Stripe(Deno.env.get('STRIPE_SECRET')!, {
    apiVersion: '2023-10-16',
  })
  
  const event = stripe.webhooks.constructEvent(
    body,
    signature,
    Deno.env.get('STRIPE_WEBHOOK_SECRET')!
  )
  
  // 2. 处理不同类型的事件
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object
      // 更新数据库订单状态
      await supabaseClient
        .from('orders')
        .update({ status: 'paid' })
        .eq('stripe_payment_intent_id', paymentIntent.id)
      break
      
    case 'customer.subscription.deleted':
      // 处理订阅取消
      break
  }
  
  return new Response(JSON.stringify({ received: true }), { status: 200 })
})
```

### 场景 2：AI 向量搜索

```typescript
// supabase/functions/search-embeddings/index.ts

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req: Request) => {
  // 1. 获取搜索查询
  const { query } = await req.json()
  
  // 2. 调用 OpenAI 生成嵌入向量
  const openAIResponse = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'text-embedding-ada-002',
      input: query
    })
  })
  
  const { data: { embedding } } = await openAIResponse.json()
  
  // 3. 调用 PostgreSQL 向量搜索函数
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )
  
  const { data: documents } = await supabaseClient.rpc('match_documents', {
    query_embedding: embedding,
    match_threshold: 0.78,
    match_count: 5
  })
  
  return new Response(JSON.stringify({ documents }), { status: 200 })
})
```

### 场景 3：数据预处理与验证

```typescript
// supabase/functions/validate-user-input/index.ts

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

serve(async (req: Request) => {
  const { email, username, password } = await req.json()
  
  // 1. 验证邮箱格式
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return new Response(
      JSON.stringify({ error: 'Invalid email format' }),
      { status: 400 }
    )
  }
  
  // 2. 验证用户名（3-20 字符，仅允许字母数字下划线）
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/
  if (!usernameRegex.test(username)) {
    return new Response(
      JSON.stringify({ error: 'Username must be 3-20 characters' }),
      { status: 400 }
    )
  }
  
  // 3. 验证密码强度
  if (password.length < 8) {
    return new Response(
      JSON.stringify({ error: 'Password must be at least 8 characters' }),
      { status: 400 }
    )
  }
  
  // 4. 检查用户名是否已存在
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )
  
  const { data: existingUser } = await supabaseClient
    .from('users')
    .select('id')
    .eq('username', username)
    .single()
  
  if (existingUser) {
    return new Response(
      JSON.stringify({ error: 'Username already taken' }),
      { status: 400 }
    )
  }
  
  // 5. 验证通过
  return new Response(
    JSON.stringify({ valid: true }),
    { status: 200 }
  )
})
```

### 场景 4：第三方 API 集成

```typescript
// supabase/functions/send-email/index.ts

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

serve(async (req: Request) => {
  const { to, subject, body } = await req.json()
  
  // 使用 SendGrid 发送邮件
  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('SENDGRID_API_KEY')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: to }] }],
      from: { email: 'noreply@example.com' },
      subject: subject,
      content: [{ type: 'text/plain', value: body }]
    })
  })
  
  if (response.ok) {
    return new Response(JSON.stringify({ success: true }), { status: 200 })
  } else {
    const error = await response.json()
    return new Response(JSON.stringify({ error }), { status: 500 })
  }
})
```

---

## 7.6 环境变量与密钥管理

### 本地开发环境

```bash
# .env.local 文件
SUPABASE_URL=http://localhost:54321
SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
STRIPE_SECRET_KEY=sk_test_...
OPENAI_API_KEY=sk-...
SENDGRID_API_KEY=SG....
```

### 生产环境配置

```bash
# 1. 设置函数环境变量（CLI）
supabase secrets set STRIPE_SECRET_KEY=sk_live_...
supabase secrets set OPENAI_API_KEY=sk-...

# 2. 查看已设置的环境变量
supabase secrets list

# 3. 删除环境变量
supabase secrets unset STRIPE_SECRET_KEY
```

### 安全最佳实践

| 实践 | 说明 |
|------|------|
| **不要硬编码密钥** | 始终使用 `Deno.env.get()` |
| **区分环境** | 开发用测试密钥，生产用正式密钥 |
| **最小权限原则** | 使用 `SUPABASE_ANON_KEY` 而非 `SERVICE_ROLE_KEY` |
| **定期轮换** | 定期更换 API 密钥 |

---

## 7.7 Supabase CLI 工具

### 核心命令

```bash
# 项目管理
supabase init              # 初始化项目
supabase login             # 登录账户
supabase link              # 链接远程项目
supabase unlink            # 取消链接

# 本地开发
supabase start             # 启动本地服务
supabase stop              # 停止本地服务
supabase status            # 查看运行状态

# 数据库
supabase db pull           # 拉取远程数据库结构
supabase db push           # 推送本地结构到远程
supabase db dump           # 导出数据库备份
supabase migration new     # 创建新迁移
supabase migration up      # 应用迁移
supabase migration down    # 回滚迁移

# Edge Functions
supabase functions new     # 创建新函数
supabase functions serve   # 本地运行
supabase functions deploy  # 部署到云端
supabase functions list    # 列出函数
supabase functions logs    # 查看日志

# 存储
supabase storage ls        # 列出存储桶
supabase storage cp        # 复制文件
```

### 数据库迁移工作流

```bash
# 1. 创建新的迁移文件
supabase migration new add_user_profiles

# 生成文件：supabase/migrations/YYYYMMDDHHMMSS_add_user_profiles.sql

# 2. 编辑迁移文件
# ALTER TABLE users ADD COLUMN avatar_url TEXT;

# 3. 本地测试
supabase db push

# 4. 提交代码到 Git
git add supabase/migrations/
git commit -m "feat: add avatar_url column"

# 5. 部署到生产环境
supabase db push --db-url postgresql://...
```

---

## 7.8 性能优化

### 冷启动优化

| 优化项 | 方法 | 效果 |
|--------|------|------|
| **减少依赖** | 只导入必要的模块 | 减少加载时间 |
| **使用 ES Modules** | 避免 CommonJS 转换 | 原生执行更快 |
| **缓存客户端** | 复用 Supabase 客户端 | 避免重复创建 |
| **精简代码** | 删除无用逻辑 | 减少执行时间 |

### 代码示例：优化前后对比

```typescript
// ❌ 优化前：每次都创建新客户端
serve(async (req: Request) => {
  const supabase = createClient(url, key)
  const { data } = await supabase.from('users').select()
  return new Response(JSON.stringify(data))
})

// ✅ 优化后：缓存客户端实例
let cachedClient: ReturnType<typeof createClient> | null = null

function getClient() {
  if (!cachedClient) {
    cachedClient = createClient(url, key)
  }
  return cachedClient
}

serve(async (req: Request) => {
  const { data } = await getClient().from('users').select()
  return new Response(JSON.stringify(data))
})
```

### 并发处理

```typescript
// 并行执行独立操作
serve(async (req: Request) => {
  const [users, posts, comments] = await Promise.all([
    supabase.from('users').select(),
    supabase.from('posts').select(),
    supabase.from('comments').select()
  ])
  
  return new Response(JSON.stringify({ users, posts, comments }))
})
```

---

## 本章小结

本章深入解析了 Supabase Edge Functions 与开发工具：

1. **架构概览**：Deno 运行时、全球边缘节点、安全沙箱
2. **工作原理**：函数隔离执行、权限模型、执行流程
3. **开发环境**：本地启动、函数创建、调试运行
4. **部署方式**：CLI 部署、Dashboard 可视化、CI/CD 自动化
5. **应用场景**：Webhook 处理、AI 向量搜索、数据验证、第三方 API 集成
6. **密钥管理**：环境变量设置、安全最佳实践
7. **CLI 工具**：项目管理、数据库迁移、函数部署
8. **性能优化**：冷启动优化、代码缓存、并发处理


第 8 章 最佳实践与典型应用场景
=====================================

## 8.1 典型应用场景

### 场景 1：全栈博客平台

**技术架构：**
- **前端**：Next.js 14 (App Router)
- **后端**：Supabase (Database + Auth + Storage)
- **实时功能**：评论实时通知
- **图片存储**：文章封面图、用户头像

**数据库 Schema：**

```sql
-- 用户资料表
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 文章表
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES profiles(id),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT,
  cover_image TEXT,
  status TEXT DEFAULT 'draft',  -- draft/published
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 评论表
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  author_id UUID REFERENCES profiles(id),
  content TEXT NOT NULL,
  parent_id UUID REFERENCES comments(id),  -- 嵌套评论
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 启用 RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- 策略：任何人都可以查看已发布的文章
CREATE POLICY "公开文章可读" ON posts
  FOR SELECT
  USING (status = 'published');

-- 策略：作者可以管理自己的文章
CREATE POLICY "作者管理文章" ON posts
  FOR ALL
  USING (author_id = auth.uid());

-- 策略：任何人都可以查看评论
CREATE POLICY "评论可读" ON comments
  FOR SELECT
  USING (true);

-- 策略：认证用户可以发表评论
CREATE POLICY "认证用户评论" ON comments
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');
```

**前端集成示例：**

```typescript
// app/blog/[slug]/page.tsx

import { createClient } from '@/lib/supabase'
import { notFound } from 'next/navigation'

export default async function BlogPost({ 
  params 
}: { 
  params: { slug: string } 
}) {
  const supabase = createClient()
  
  // 获取文章内容
  const { data: post } = await supabase
    .from('posts')
    .select('*, profiles(username, avatar_url)')
    .eq('slug', params.slug)
    .eq('status', 'published')
    .single()
  
  if (!post) notFound()
  
  // 获取评论
  const { data: comments } = await supabase
    .from('comments')
    .select('*, profiles(username, avatar_url)')
    .eq('post_id', post.id)
    .order('created_at', { ascending: false })
  
  return (
    <article>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
      
      {/* 评论区 - 客户端组件实现实时更新 */}
      <Comments postId={post.id} initialComments={comments} />
    </article>
  )
}
```

**实时评论通知：**

```typescript
// components/Comments.tsx

'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useSupabase } from '@/lib/supabase-provider'

export function Comments({ postId, initialComments }: Props) {
  const supabase = useSupabase()
  const [comments, setComments] = useState(initialComments)
  
  useEffect(() => {
    // 订阅新评论
    const channel = supabase
      .channel(`comments:${postId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'comments',
          filter: `post_id=eq.${postId}`
        },
        (payload) => {
          // 收到新评论，更新 UI
          setComments(prev => [payload.new as Comment, ...prev])
        }
      )
      .subscribe()
    
    return () => {
      supabase.removeChannel(channel)
    }
  }, [postId, supabase])
  
  return (
    <section>
      {comments.map(comment => (
        <Comment key={comment.id} comment={comment} />
      ))}
    </section>
  )
}
```

---

### 场景 2：实时协作看板（Trello 类）

**核心功能：**
- 实时任务卡片拖拽同步
- 多用户在线状态显示
- 操作历史追踪

**数据库设计：**

```sql
-- 看板表
CREATE TABLE boards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  owner_id UUID REFERENCES auth.users,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 列表表
CREATE TABLE lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id UUID REFERENCES boards(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  position INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 卡片表
CREATE TABLE cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  list_id UUID REFERENCES lists(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  position INT NOT NULL,
  assigned_to UUID REFERENCES profiles(id),
  due_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 活动日志表
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id UUID REFERENCES boards(id),
  user_id UUID REFERENCES auth.users,
  action TEXT NOT NULL,  -- created, moved, updated, deleted
  target_type TEXT,      -- card, list
  target_id UUID,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**实时同步实现：**

```typescript
// hooks/useBoardSync.ts

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'

export function useBoardSync(boardId: string) {
  const supabase = createClient()
  const [lists, setLists] = useState<List[]>([])
  
  useEffect(() => {
    // 初始加载
    loadBoardData()
    
    // 订阅列表变更
    const listsChannel = supabase
      .channel(`board:${boardId}:lists`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'lists',
          filter: `board_id=eq.${boardId}`
        },
        (payload) => {
          handleListsChange(payload)
        }
      )
      .subscribe()
    
    // 订阅卡片变更
    const cardsChannel = supabase
      .channel(`board:${boardId}:cards`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'cards',
          filter: `board_id=eq.${boardId}`
        },
        (payload) => {
          handleCardsChange(payload)
        }
      )
      .subscribe()
    
    return () => {
      supabase.removeChannel(listsChannel)
      supabase.removeChannel(cardsChannel)
    }
  }, [boardId])
  
  // 拖拽更新卡片位置
  const moveCard = async (cardId: string, newListId: string, newPosition: number) => {
    const { error } = await supabase
      .from('cards')
      .update({ 
        list_id: newListId, 
        position: newPosition 
      })
      .eq('id', cardId)
    
    if (error) throw error
    
    // 记录活动日志
    await supabase.from('activities').insert({
      board_id: boardId,
      user_id: supabase.auth.user()?.id,
      action: 'moved',
      target_type: 'card',
      target_id: cardId,
      metadata: { new_list_id: newListId, new_position: newPosition }
    })
  }
  
  return { lists, moveCard }
}
```

**Presence 在线状态：**

```typescript
// components/BoardPresence.tsx

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'

export function BoardPresence({ boardId, userId }: Props) {
  const supabase = createClient()
  const [onlineUsers, setOnlineUsers] = useState<User[]>([])
  
  useEffect(() => {
    const channel = supabase.channel(`board:${boardId}:presence`)
    
    channel.on('presence', { event: 'sync' }, () => {
      const state = channel.presenceState()
      const users = Object.values(state).flat()
      setOnlineUsers(users)
    })
    
    channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        // 追踪当前用户在线状态
        await channel.track({
          user_id: userId,
          online_at: new Date().toISOString()
        })
      }
    })
    
    // 定期更新在线状态
    const interval = setInterval(() => {
      channel.track({
        user_id: userId,
        online_at: new Date().toISOString()
      })
    }, 30000)  // 30 秒更新一次
    
    return () => {
      clearInterval(interval)
      supabase.removeChannel(channel)
    }
  }, [boardId, userId])
  
  return (
    <div className="online-users">
      {onlineUsers.map(user => (
        <Avatar key={user.user_id} userId={user.user_id} />
      ))}
    </div>
  )
}
```

---

### 场景 3：电商实时库存管理

**需求特点：**
- 库存变更实时同步
- 超卖预防（事务处理）
- 多仓库库存管理

**数据库设计：**

```sql
-- 商品表
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  sku TEXT UNIQUE NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 库存表
CREATE TABLE inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id),
  warehouse_id UUID REFERENCES warehouses(id),
  quantity INT NOT NULL DEFAULT 0,
  reserved INT NOT NULL DEFAULT 0,  -- 已锁定待支付库存
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 订单表
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users,
  status TEXT NOT NULL DEFAULT 'pending',  -- pending/paid/shipped
  total_amount DECIMAL(10, 2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 订单项表
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id),
  product_id UUID REFERENCES products(id),
  quantity INT NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL
);

-- 库存变更日志
CREATE TABLE inventory_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id),
  warehouse_id UUID REFERENCES warehouses(id),
  change_type TEXT NOT NULL,  -- purchase/sale/return/adjustment
  quantity_change INT NOT NULL,
  reference_type TEXT,  -- order_id, purchase_order_id
  reference_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**库存扣减函数（防止超卖）：**

```sql
-- 创建库存扣减函数（事务安全）
CREATE OR REPLACE FUNCTION reserve_inventory(
  p_product_id UUID,
  p_warehouse_id UUID,
  p_quantity INT
) RETURNS BOOLEAN AS $$
DECLARE
  v_available INT;
BEGIN
  -- 获取可用库存
  SELECT quantity - reserved INTO v_available
  FROM inventory
  WHERE product_id = p_product_id 
    AND warehouse_id = p_warehouse_id
  FOR UPDATE;  -- 行级锁，防止并发
  
  -- 检查库存是否充足
  IF v_available >= p_quantity THEN
    -- 锁定库存
    UPDATE inventory
    SET reserved = reserved + p_quantity
    WHERE product_id = p_product_id 
      AND warehouse_id = p_warehouse_id;
    
    RETURN TRUE;
  ELSE
    RETURN FALSE;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- 确认订单（实际扣减库存）
CREATE OR REPLACE FUNCTION confirm_order(
  p_order_id UUID
) RETURNS VOID AS $$
BEGIN
  -- 将预定库存转为实际扣减
  UPDATE inventory i
  SET quantity = quantity - oi.quantity,
      reserved = reserved - oi.quantity
  FROM order_items oi
  WHERE oi.order_id = p_order_id
    AND i.product_id = oi.product_id;
  
  -- 更新订单状态
  UPDATE orders
  SET status = 'paid'
  WHERE id = p_order_id;
END;
$$ LANGUAGE plpgsql;
```

**实时库存同步：**

```typescript
// hooks/useInventory.ts

export function useInventory(productId: string) {
  const supabase = useSupabase()
  const [inventory, setInventory] = useState<Inventory | null>(null)
  
  useEffect(() => {
    // 初始加载库存
    loadInventory()
    
    // 订阅库存变更
    const channel = supabase
      .channel(`inventory:${productId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'inventory',
          filter: `product_id=eq.${productId}`
        },
        (payload) => {
          // 实时更新库存显示
          setInventory(payload.new as Inventory)
        }
      )
      .subscribe()
    
    return () => supabase.removeChannel(channel)
  }, [productId])
  
  // 下单锁定库存
  const reserveStock = async (quantity: number) => {
    const { data, error } = await supabase.rpc('reserve_inventory', {
      p_product_id: productId,
      p_warehouse_id: defaultWarehouseId,
      p_quantity: quantity
    })
    
    if (!data) {
      throw new Error('库存不足')
    }
    
    return data
  }
  
  return { inventory, reserveStock }
}
```

---

## 8.2 性能优化实践

### 数据库查询优化

```sql
-- 1. 为常用查询创建索引
CREATE INDEX idx_posts_author_status ON posts(author_id, status);
CREATE INDEX idx_posts_published_at ON posts(published_at DESC);
CREATE INDEX idx_comments_post_id ON comments(post_id, created_at DESC);

-- 2. 使用覆盖索引减少回表
CREATE INDEX idx_posts_cover ON posts(id, title, cover_image) 
  WHERE status = 'published';

-- 3. 物化视图预计算复杂查询
CREATE MATERIALIZED VIEW post_stats AS
SELECT 
  p.id,
  COUNT(c.id) as comment_count,
  COUNT(DISTINCT c.author_id) as unique_commenters
FROM posts p
LEFT JOIN comments c ON c.post_id = p.id
GROUP BY p.id;

-- 定期刷新
REFRESH MATERIALIZED VIEW CONCURRENTLY post_stats;
```

### 前端性能优化

```typescript
// 1. 使用 React Query 缓存
import { useQuery } from '@tanstack/react-query'

function usePosts() {
  return useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const { data } = await supabase
        .from('posts')
        .select()
        .eq('status', 'published')
      return data
    },
    staleTime: 5 * 60 * 1000  // 5 分钟缓存
  })
}

// 2. 分页加载（游标分页）
async function loadComments(postId: string, cursor?: string) {
  let query = supabase
    .from('comments')
    .select()
    .eq('post_id', postId)
    .order('created_at', { ascending: false })
    .limit(20)
  
  if (cursor) {
    query = query.lt('id', cursor)  // 游标分页
  }
  
  const { data } = await query
  return data
}

// 3. 图片懒加载
<Image 
  src={post.cover_image} 
  alt={post.title}
  loading="lazy"
  width={800}
  height={400}
/>
```

### 批量操作优化

```typescript
// ❌ 避免 N+1 查询
for (const post of posts) {
  const { data } = await supabase
    .from('comments')
    .select()
    .eq('post_id', post.id)  // 每个帖子一次查询
}

// ✅ 使用 IN 查询批量获取
const { data: comments } = await supabase
  .from('comments')
  .select()
  .in('post_id', posts.map(p => p.id))  // 一次查询

// 按 post_id 分组
const commentsByPost = comments.reduce((acc, comment) => {
  acc[comment.post_id] = [...(acc[comment.post_id] || []), comment]
  return acc
}, {})
```

---

## 8.3 安全最佳实践

### RLS 策略检查清单

```sql
-- 1. 确保所有敏感表都启用了 RLS
SELECT tablename 
FROM pg_tables 
WHERE schemaname = 'public'
  AND tablename NOT IN (
    SELECT tablename FROM pg_policies
  );

-- 2. 测试 RLS 策略
-- 使用不同角色执行查询验证
SET ROLE authenticated;
SELECT * FROM posts;  -- 应该只看到已发布的文章

-- 3. 避免策略冲突
-- 检查是否存在互相矛盾的策略
SELECT * FROM pg_policies 
WHERE tablename = 'posts';
```

### 敏感数据保护

```sql
-- 1. 不要在 RLS 策略中暴露敏感字段
CREATE TABLE user_secrets (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  api_key TEXT,  -- 敏感
  created_at TIMESTAMPTZ
);

-- 策略：只有本人可以查看
CREATE POLICY "本人查看密钥" ON user_secrets
  FOR SELECT
  USING (auth.uid() = user_id);

-- 2. 使用视图隐藏敏感列
CREATE VIEW public_profiles AS
SELECT 
  id,
  username,
  avatar_url,
  created_at
FROM profiles;  -- 不包含 email、phone 等敏感字段

-- 3. 审计日志
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY,
  table_name TEXT,
  action TEXT,  -- INSERT/UPDATE/DELETE
  old_data JSONB,
  new_data JSONB,
  user_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### API 密钥管理

```typescript
// ❌ 不要在前端暴露 Service Role Key
const supabase = createClient(url, 'SERVICE_ROLE_KEY')  // 危险！

// ✅ 只使用 Anon Key
const supabase = createClient(url, 'ANON_KEY')  // 安全

// ✅ 敏感操作通过 Edge Function
// 客户端调用
const { data } = await supabase.functions.invoke('admin-action', {
  body: { action: 'delete-user', userId }
})

// Edge Function 内部使用 Service Role Key
const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!  // 服务端安全
)
```

---

## 8.4 常见问题与解决方案

### 问题 1：Realtime 连接频繁断开

**症状：** WebSocket 连接不稳定，实时同步中断

**解决方案：**
```typescript
// 1. 启用自动重连
const channel = supabase.channel('my-channel', {
  config: {
    presence: { key: 'user-1' }
  }
})

// 2. 监听连接状态
channel.on('system', { event: '*' }, (payload) => {
  console.log('System event:', payload)
})

supabase.realtime.onOpen(() => console.log('Connected'))
supabase.realtime.onClose(() => console.log('Disconnected'))
supabase.realtime.onError((error) => {
  console.error('Connection error:', error)
  // SDK 会自动尝试重连（指数退避）
})

// 3. 定期发送心跳
setInterval(() => {
  channel.track({ online_at: new Date().toISOString() })
}, 30000)
```

### 问题 2：RLS 策略导致查询失败

**症状：** 查询返回空数据或权限错误

**调试步骤：**
```sql
-- 1. 检查 RLS 是否启用
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- 2. 查看现有策略
SELECT * FROM pg_policies 
WHERE tablename = 'your_table';

-- 3. 测试当前用户的权限
SELECT auth.uid();  // 查看当前用户 ID
SELECT current_setting('request.jwt.claims', true)::jsonb->>'sub';

-- 4. 临时禁用 RLS 测试（仅开发环境）
ALTER TABLE your_table DISABLE ROW LEVEL SECURITY;
```

### 问题 3：大文件上传失败

**症状：** 超过 50MB 的文件上传超时或失败

**解决方案：**
```typescript
// 使用分片上传
async function uploadLargeFile(file: File, path: string) {
  const CHUNK_SIZE = 5 * 1024 * 1024  // 5MB
  const chunks = []
  
  // 分片
  for (let i = 0; i < file.size; i += CHUNK_SIZE) {
    chunks.push(file.slice(i, i + CHUNK_SIZE))
  }
  
  // 创建上传会话
  const { data: uploadSession } = await supabase.storage
    .from('bucket')
    .createSignedUploadUrl(path)
  
  // 并行上传分片
  await Promise.all(
    chunks.map((chunk, index) => 
      uploadChunk(uploadSession.signedUrl, chunk, index)
    )
  )
  
  // 完成上传
  await supabase.storage.from('bucket').moveToDestination(path)
}
```

---

## 本章小结

本章介绍了 Supabase 的实际应用场景和最佳实践：

1. **典型应用场景**：
   - 全栈博客平台（Next.js + Supabase）
   - 实时协作看板（Trello 类）
   - 电商实时库存管理

2. **性能优化**：
   - 数据库索引、物化视图
   - 前端缓存、分页加载
   - 批量操作避免 N+1

3. **安全实践**：
   - RLS 策略检查
   - 敏感数据保护
   - API 密钥管理

4. **常见问题**：
   - Realtime 连接断开处理
   - RLS 策略调试
   - 大文件上传方案

---

# 附录：快速参考

## A.1 核心 API 参考

### 初始化客户端

```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://your-project.supabase.co',
  'your-anon-key'
)
```

### 数据库操作

```typescript
// 查询
const { data } = await supabase.from('table').select().eq('column', value)

// 插入
const { data } = await supabase.from('table').insert({ column: value })

// 更新
const { data } = await supabase.from('table').update({ column: value }).eq('id', id)

// 删除
const { data } = await supabase.from('table').delete().eq('id', id)
```

### 认证操作

```typescript
// 注册
await supabase.auth.signUp({ email, password })

// 登录
await supabase.auth.signInWithPassword({ email, password })

// 登出
await supabase.auth.signOut()

// 获取当前用户
const { data: { user } } = await supabase.auth.getUser()
```

### 实时订阅

```typescript
const channel = supabase.channel('room')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'table' }, callback)
  .subscribe()
```

### 文件存储

```typescript
// 上传
await supabase.storage.from('bucket').upload('path', file)

// 下载
await supabase.storage.from('bucket').download('path')

// 签名 URL
await supabase.storage.from('bucket').createSignedUrl('path', expiresIn)
```

## A.2 常用 CLI 命令

```bash
# 本地开发
supabase start
supabase stop

# 数据库
supabase db push
supabase migration new <name>

# 函数
supabase functions new <name>
supabase functions deploy <name>

# 项目
supabase login
supabase link --project-ref <ref>
```

---

*文档版本：1.0.0 | 创建日期：2026-04-02 | 最后更新：2026-04-02*
