# 第 6 章：记忆与学习系统

## 6.1 持久化记忆机制

### 6.1.1 为什么需要持久化记忆

传统 Agent 面临的"失忆"问题：

| 问题 | 表现 | 影响 |
|------|------|------|
| **会话隔离** | 每次对话都是全新的开始 | 用户需要重复解释 |
| **上下文有限** | 超过 token 限制就丢失 | 长任务无法持续 |
| **缺少用户建模** | 不了解用户偏好 | 响应不够个性化 |
| **无法积累经验** | 同样的错误反复犯 | 无法持续改进 |

Hermes 通过**三层记忆架构**解决这些问题。

### 6.1.2 三层记忆架构总览

```
┌─────────────────────────────────────────────────────────────┐
│                    Hermes 三层记忆架构                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  L1: 技能层 (Skill Memory)                                  │
│      - 存储：~/.hermes/skills/                              │
│      - 形式：程序化技能文件 (.md, .py)                      │
│      - 特点：可执行、可复用、可进化                         │
│                                                             │
│  L2: 持久记忆层 (Persistent Memory)                         │
│      - 存储：~/.hermes/memories/                            │
│      - 形式：MEMORY.md, USER.md                             │
│      - 特点：人工可读、版本管理、跨会话共享                 │
│                                                             │
│  L3: 会话存储层 (Session Memory)                            │
│      - 存储：SQLite (FTS5 全文索引)                         │
│      - 形式：历史对话记录                                   │
│      - 特点：毫秒检索、自动摘要、智能遗忘                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 6.1.3 记忆存储位置

```
~/.hermes/memories/
├── MEMORY.md           # 持久化事实记忆
├── USER.md             # 用户画像和偏好
├── sessions/           # 会话记录（SQLite）
│   ├── hermes.db
│   └── hermes.db-shm
│   └── hermes.db-wal
└── archives/           # 归档记忆（定期清理）
```

### 6.1.4 记忆写入流程

```
用户对话 → 工具调用 → 任务完成
            ↓
    会话记录存入 SQLite
            ↓
    后台任务：LLM 摘要生成
            ↓
    提取关键信息：
    - 用户偏好（→ USER.md）
    - 项目信息（→ MEMORY.md）
    - 技能经验（→ skills/）
            ↓
    下次对话前：注入相关记忆
```

---

## 6.2 用户画像构建

### 6.2.1 Honcho 辩证式用户建模

Hermes 使用 **Honcho** 系统进行用户建模：

**Honcho 是什么：**
- 动态用户建模系统
- 基于辩证法原理构建用户画像
- 从对话中提取偏好、习惯、项目信息

**工作流程：**

```
对话记录
    ↓
Honcho 提取候选事实
    ↓
辩证验证（与已有记忆对比）
    ↓
冲突解决（新 vs 旧）
    ↓
更新 USER.md
    ↓
下次对话：注入相关用户信息
```

### 6.2.2 USER.md 格式

```markdown
# 用户画像

## 基本信息

- **姓名**: [用户名称]
- **角色**: [职业/角色]
- **时区**: [时区信息]

## 技术栈偏好

- **主要语言**: Python, TypeScript
- **框架偏好**: React, FastAPI
- **编辑器**: VS Code
- **终端**: zsh + tmux

## 项目上下文

### 项目 A
- 描述：[项目描述]
- 技术栈：[技术列表]
- 当前状态：[进行中/已完成]

### 项目 B
...

## 沟通偏好

- 响应风格：简洁直接
- 详细程度：中等
- 代码注释：详细

## 其他偏好

- 工作时间：9:00-18:00
- 通知偏好：Telegram
```

### 6.2.3 记忆注入机制

每次对话前，Hermes 会：

1. **分析当前请求**：提取关键词和上下文
2. **搜索相关记忆**：使用 FTS5 全文搜索
3. **选择 Top-K 记忆**：根据相关性排序
4. **注入到上下文**：作为系统提示的一部分

```python
# 简化的记忆注入逻辑
def inject_memory(user_query, session_context):
    # 1. 提取关键词
    keywords = extract_keywords(user_query)
    
    # 2. FTS5 搜索相关记忆
    related_memories = fts5_search(keywords, limit=5)
    
    # 3. 加载用户画像
    user_profile = load_user_profile()
    
    # 4. 构建注入内容
    memory_context = build_context(related_memories, user_profile)
    
    # 5. 添加到系统提示
    system_prompt = f"{memory_context}\n\n{original_prompt}"
    
    return system_prompt
```

---

## 6.3 FTS5 会话搜索

### 6.3.1 SQLite FTS5 简介

**FTS5** (Full-Text Search 5) 是 SQLite 的全文搜索扩展模块：

| 特性 | 说明 |
|------|------|
| **倒排索引** | 快速关键词匹配 |
| **分词支持** | 中英文分词 |
| **相关性排序** | BM25 算法 |
| **前缀搜索** | `word*` 匹配 |
| **短语搜索** | `"exact phrase"` |

### 6.3.2 Hermes 中的 FTS5 应用

**数据库结构：**

```sql
-- 会话记录表
CREATE TABLE sessions (
    id INTEGER PRIMARY KEY,
    timestamp DATETIME,
    user_message TEXT,
    agent_response TEXT,
    tools_used TEXT,
    outcome TEXT
);

-- FTS5 虚拟表
CREATE VIRTUAL TABLE sessions_fts USING fts5(
    user_message,
    agent_response,
    content='sessions',
    content_rowid='id'
);

-- 触发器：自动同步
CREATE TRIGGER sessions_ai_insert AFTER INSERT ON sessions BEGIN
    INSERT INTO sessions_fts(rowid, user_message, agent_response)
    VALUES (new.id, new.user_message, new.agent_response);
END;
```

### 6.3.3 搜索示例

```bash
# Hermes CLI 搜索命令
hermes memory search "Python 项目配置"
hermes memory search "docker 部署" --limit 10
hermes memory search "API 密钥" --before 2026-03-01
```

**搜索语法：**

| 语法 | 示例 | 说明 |
|------|------|------|
| **关键词** | `docker` | 匹配包含 docker 的记录 |
| **短语** | `"API key"` | 精确匹配短语 |
| **前缀** | `config*` | 匹配 config, configs, configuration |
| **逻辑与** | `docker AND build` | 同时包含两个词 |
| **逻辑或** | `docker OR k8s` | 包含任一即可 |
| **逻辑非** | `docker NOT compose` | 排除包含 compose 的记录 |

### 6.3.4 性能优化

| 优化 | 效果 |
|------|------|
| **定期 VACUUM** | 减少数据库文件大小 |
| **增量索引** | 只索引新增记录 |
| **分表归档** | 旧记录移动到归档表 |
| **缓存热点** | 缓存高频搜索结果 |

---

## 6.4 智能遗忘机制

### 6.4.1 为什么需要遗忘

无限积累记忆会导致：

1. **存储膨胀**：数据库越来越大
2. **检索变慢**：搜索时间增加
3. **噪声干扰**：无关信息影响响应质量
4. **上下文污染**：token 浪费在过时信息上

### 6.4.2 遗忘策略

| 策略 | 实现方式 |
|------|----------|
| **时间衰减** | 旧记录优先级降低 |
| **使用频率** | 不常访问的记录归档 |
| **重要性评分** | LLM 评估记忆价值 |
| **用户确认** | 删除前询问用户 |

### 6.4.3 记忆压缩

对于重要但不常访问的记忆，Hermes 使用 LLM 进行摘要压缩：

```
原始对话（1000 tokens）
    ↓
LLM 提取要点
    ↓
压缩摘要（100 tokens）
    ↓
存储到 MEMORY.md
    ↓
原始对话可删除
```

---

## 6.5 学习循环与自进化

### 6.5.1 学习循环触发机制

Hermes 的学习循环在以下条件触发：

| 触发条件 | 说明 |
|----------|------|
| **15 次工具调用** | 累计调用后自动触发 |
| **任务失败** | 检测到执行失败 |
| **用户反馈** | 用户明确要求改进 |
| **定时触发** | 每日/每周定期回顾 |

### 6.5.2 学习循环流程

```
┌─────────────────────────────────────────────────────────────┐
│                   Hermes 学习循环                            │
│                                                             │
│   执行轨迹收集 → 成功/失败分析 → 技能更新 → 记忆强化        │
│         ↓              ↓              ↓           ↓         │
│   记录所有工具      JEPA 分析      修改技能      更新        │
│   调用和结果        提取模式        文件          MEMORY.md   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**详细步骤：**

1. **执行轨迹收集**
   - 记录每次工具调用的输入输出
   - 存储任务执行结果
   - 捕获错误和异常

2. **成功/失败分析**
   - JEPA (Generic Evolution of Prompt Architectures) 分析执行轨迹
   - 识别成功模式和失败原因
   - 提取可复用的经验

3. **技能更新**
   - 修改相关技能文件
   - 添加新的处理分支
   - 优化参数配置

4. **记忆强化**
   - 将重要经验写入 MEMORY.md
   - 更新用户画像（USER.md）
   - 强化成功的执行模式

### 6.5.3 四层记忆体系

Hermes 实际上使用**四层记忆**，而非简单的三层：

| 层级 | 名称 | 存储 | 特点 |
|------|------|------|------|
| **L0** | 程序化记忆 | 技能文件 | 可执行代码/流程 |
| **L1** | Markdown 持久层 | MEMORY.md, USER.md | 人工可读，版本管理 |
| **L2** | SQLite 结构化层 | sessions.db | 可检索的结构化数据 |
| **L3** | 用户建模 | Honcho 系统 | 偏好和上下文 |

### 6.5.4 学习循环示例

**场景：用户反复询问如何部署 Docker**

```
第 1 次：Agent 手动指导部署步骤
        ↓
第 2 次：Agent 识别重复模式，创建技能草稿
        ↓
第 3 次：Agent 使用技能，发现遗漏步骤
        ↓
第 15 次：学习循环触发，技能文件自动更新
        ↓
后续：直接使用优化后的技能，一步到位
```

**技能演化：**

```markdown
<!-- v1.0 (初始版本) -->
## Docker 部署步骤
1. 安装 Docker
2. 创建 Dockerfile
3. 构建镜像
4. 运行容器

<!-- v1.2 (学习后) -->
## Docker 部署步骤

### 前置条件
- Docker 20.10+
- Docker Compose 1.29+
- 用户加入 docker 组

### 快速部署
1. 复制 docker-compose.yml
2. 修改环境变量
3. 运行 docker-compose up -d

### 常见问题
- 权限问题：sudo usermod -aG docker $USER
- 端口冲突：修改 docker-compose.yml 中的端口映射
```

---

*本章来源：知乎深度解读、CSDN 技术分析、GitHub 官方仓库、什么值得买评测*
