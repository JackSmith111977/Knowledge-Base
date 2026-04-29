# AI Agent 技术栈全景核心知识体系

> 全面覆盖 AI Agent / AI Infra 开发所需技术栈，含框架对比、基础设施层、协议标准、安全治理、云原生部署、开发者技能图谱。2026.04 调研。

---

## 目录

1. [技术栈知识图谱](#1-技术栈知识图谱)
2. [Agent 框架横评](#2-agent-框架横评)
3. [架构设计模式](#3-架构设计模式)
4. [数据与记忆层](#4-数据与记忆层)
5. [模型部署与服务化](#5-模型部署与服务化)
6. [可观测性与评估](#6-可观测性与评估)
7. [协议层：MCP 与 A2A](#7-协议层mcp-与-a2a)
8. [安全与治理](#8-安全与治理)
9. [云原生与部署](#9-云原生与部署)
10. [开发者技能图谱](#10-开发者技能图谱)
11. [生产级选型速查表](#11-生产级选型速查表)

---

## 1. 技术栈知识图谱

```
AI Agent 开发技术栈
├── 1. 编程语言层
│   ├── Python（必修：asyncio、类型注解、Pydantic）
│   ├── TypeScript/JavaScript（前端 Agent、Vercel AI SDK）
│   └── Go/Java/C++（后端/企业级/嵌入式）
│
├── 2. LLM 核心
│   ├── Transformer 原理 / Token 机制 / 上下文窗口
│   ├── Prompt Engineering 2.0（CoT、ReAct、结构化提示词）
│   ├── Function Calling / Tool Use（JSON Schema、工具循环）
│   ├── 结构化输出（JSON Mode、JsonOutputParser）
│   └── 多模型路由（LiteLLM、Portkey、降级策略）
│
├── 3. Agent 框架
│   ├── LangChain 1.0 + LangGraph（图编排、状态管理、生产级）
│   ├── CrewAI（角色协作、快速原型）
│   ├── AutoGen / MAF（对话式多 Agent、人机协作）
│   ├── OpenAI Agents SDK（轻量交接链、护栏）
│   ├── Claude Agent SDK（OS 访问、MCP 深度集成）
│   ├── Google ADK（多语言、A2A、GCP 生态）
│   ├── LlamaIndex（RAG/检索最强）
│   ├── Dify（低代码/可视化/一体化）
│   ├── Smolagents（极简、本地模型）
│   └── Pydantic AI（类型安全、结构化输出）
│
├── 4. 数据与记忆层
│   ├── 向量数据库
│   │   ├── 原型：Chroma
│   │   ├── 生产（中规模）：Qdrant、Weaviate、PGVector
│   │   ├── 生产（大规模）：Milvus/Zilliz、Pinecone
│   │   └── 索引算法：HNSW / IVF / DiskANN
│   ├── 混合检索（BM25 + 向量 + Rerank）
│   ├── GraphRAG / 知识图谱
│   └── 记忆系统（短期窗口 / 长期向量 / 实体记忆）
│
├── 5. 模型部署与服务化
│   ├── 本地开发：Ollama
│   ├── 生产高并发：vLLM（行业标准）、SGLang（多轮对话）
│   ├── 企业级：TGI、TensorRT-LLM
│   └── 分布式编排：Ray Serve、BentoML
│
├── 6. 可观测性与评估
│   ├── Tracing：LangSmith、Langfuse、Arize Phoenix
│   ├── 评估：Ragas（RAG）、DeepEval（全场景）、ChainForge（Prompt）
│   ├── 成本监控：Helicone
│   └── 红队测试 / LLM-as-judge
│
├── 7. 协议层
│   ├── MCP（Model Context Protocol）— Agent ↔ 工具
│   │   ├── SDK：Python / TypeScript
│   │   ├── 传输：STDIO / SSE / Streamable HTTP
│   │   └── 生态：1600+ Servers、OAuth 2.0、Tasks 异步
│   └── A2A（Agent-to-Agent Protocol）— Agent ↔ Agent
│
├── 8. 安全与治理
│   ├── Prompt 注入防护（年增长 540%）
│   ├── 最小权限 / 沙箱 / 容器隔离
│   ├── PII 脱敏（Presidio、NeMo Guardrails）
│   └── MCP 安全基准（Tool Signature Attack、Name Collision）
│
├── 9. 云原生部署
│   ├── Docker 单节点 → K8s 集群 → 多集群
│   ├── GPU 调度：Device Plugin / DRA / 拓扑感知 / 时间切片
│   ├── Serverless：ServerlessLLM、KServe
│   └── CI/CD for AI：Prompt 版本控制 / 概率评估 / 回归测试
│
└── 10. 架构设计模式
    ├── Direct Model Call（单步任务）
    ├── Single Agent with Tools（企业默认起点）
    └── Multi-Agent Orchestration
        ├── Sequential（顺序管道）
        ├── Concurrent（并行聚合）
        ├── Handoff（交接路由）
        ├── Group Chat（群聊共识）
        └── Magentic-One（动态编排）
```

---

## 2. Agent 框架横评

### 2.1 LangChain + LangGraph

| 维度 | 内容 |
|------|------|
| **定位** | 全功能 LLM 应用编排 + 有状态图工作流 |
| **核心能力** | LangChain 1.0（2025.10 发布）以 Agent 循环为核心重写；LangGraph 提供图架构编排（支持循环、条件分支）、自动检查点、时间旅行调试、崩溃恢复 |
| **技术栈** | Python / TypeScript |
| **生态** | 90M 月下载量，35% 财富 500 强使用；LangSmith 可观测平台；400+ 企业生产使用（Uber/LinkedIn/Klarna/J.P.Morgan 等）；Agent Builder 无代码工具 |
| **适用场景** | 复杂多步骤工作流、文档审核管道、需要精细状态控制和崩溃恢复的生产环境 |
| **不足** | 学习曲线陡，简单场景过重 |
| **关键数据** | $1.25 亿 B 轮融资，估值 $12.5 亿 |

### 2.2 CrewAI

| 维度 | 内容 |
|------|------|
| **定位** | 基于角色的多 Agent 团队协作 |
| **核心能力** | 自然语言定义角色/背景故事/目标；动态任务分配；提供 Crews（自主协作）和 Flows（精确编排）两种模式；原生支持 MCP + A2A |
| **技术栈** | Python |
| **生态** | GitHub 45.9k Stars，社区活跃；插件系统可扩展 |
| **适用场景** | 快速原型开发、内容生成管道、营销自动化、研究团队模拟 |
| **不足** | 角色扮演增加额外 Token 开销；大规模团队有性能瓶颈；文档分散 |

### 2.3 AutoGen / Microsoft Agent Framework (MAF)

| 维度 | 内容 |
|------|------|
| **定位** | 对话式多 Agent 系统 + 人机协作 |
| **核心能力** | GroupChat 群聊辩论达成共识；异步消息传递；人类在环路（HITL）；AutoGen Studio 无代码原型；v0.4 架构三层：autogen-core（事件驱动原语）/ autogen-agentchat（高层 API）/ autogen-ext（可扩展插件层） |
| **技术栈** | Python / .NET |
| **生态** | 深度集成 Azure；2025 年末合并 Semantic Kernel 统一为 MAF |
| **适用场景** | 需要人类干预的研究应用、企业对话系统、编码协作（程序员+评审者+执行者） |
| **不足** | 以对话为核心，非对话场景适配性弱 |

### 2.4 OpenAI Agents SDK

| 维度 | 内容 |
|------|------|
| **定位** | 轻量级 Agent 编排 + 交接链 |
| **核心能力** | 干净的 Agent 交接模型（Agent A → Agent B）；内置三层护栏（输入/输出/运行时验证）；原生语音支持；自动会话管理和对话历史 |
| **技术栈** | Python（与 OpenAI 模型 API 深度集成） |
| **生态** | OpenAI 模型生态；内置追踪、防护栏和监控 |
| **适用场景** | 客户服务路由/分诊系统、快速原型验证、OpenAI 原生应用 |
| **不足** | 无状态持久化；仅支持线性交接；多 Agent 能力有限 |

### 2.5 Claude Agent SDK

| 维度 | 内容 |
|------|------|
| **定位** | 深度 OS 访问与编码 Agent |
| **核心能力** | 最深 MCP 集成（200+ 服务器）；原生文件系统和 Shell 访问；自动上下文压缩（防止长上下文失败）；精细权限控制；支持子 Agent 和任务钩子；可运行后台任务 |
| **技术栈** | Python / TypeScript（锁定 Claude 模型） |
| **生态** | Claude Code 生产级基础设施继承；200+ MCP 服务器 |
| **适用场景** | 编码 Agent、研究 Agent、需要 OS 级操作的长时运行单体 Agent |
| **不足** | 锁定 Claude 模型；不支持 A2A 协议 |

### 2.6 Google ADK (Agent Development Kit)

| 维度 | 内容 |
|------|------|
| **定位** | 企业级多语言 + 跨供应商 Agent 发现 |
| **核心能力** | 原生 Python/TS/Java/Go 支持；A2A Agent Cards 自动发现；多模态通信（文本/图像/音频/视频）；任务状态追踪；容器化部署；内置评估系统 |
| **技术栈** | Python / TypeScript / Java / Go |
| **生态** | Google Cloud 深度集成；Gemini 优化 |
| **适用场景** | Java/Go 企业团队、Google Cloud 生态、跨供应商 Agent 协作 |
| **不足** | 重度依赖 GCP；MCP 非原生 |

### 2.7 LlamaIndex

| 维度 | 内容 |
|------|------|
| **定位** | 文档检索与 RAG 系统（与 LangChain 互补） |
| **核心能力** | 数据索引/清洗/结构化检索/记忆管理；专注私有数据接入 LLM |
| **技术栈** | Python / TypeScript |
| **生态** | 广泛的向量数据库集成；RAG 领域最强 |
| **适用场景** | 知识库问答、文档理解、数据密集 RAG 场景 |
| **不足** | 编排能力不如 LangChain |

### 2.8 Dify

| 维度 | 内容 |
|------|------|
| **定位** | 生产级 Agentic 工作流开发平台（低代码/可视化） |
| **核心能力** | 可视化 Workflow 编排（节点式拖拽，支持条件分支/循环/并行）；内置 RAG 引擎（混合检索+语义重排）；插件生态；API 发布；全链路监控 |
| **技术栈** | 全栈 Web 平台 |
| **生态** | 开源 Apache-2.0；官方及第三方插件丰富 |
| **适用场景** | 企业内部知识库、客服自动化、中小团队快速交付 AI 产品 |
| **不足** | 深度定制受框架边界限制 |

### 2.9 其他框架速览

| 框架 | 定位 | 核心特点 | 适用 |
|------|------|---------|------|
| **Smolagents** | 极简代码生成优先 | Agent 直接写 Python 代码调用工具（减少约 30% LLM 调用）；核心仅 1000 行 | 研究人员、本地开源模型部署 |
| **Pydantic AI** | 类型安全与结构化输出 | IDE 编写时即捕获错误；流式结构化验证 | 数据提取管道、表单处理 |

---

## 3. 架构设计模式

微软 Azure 架构中心 2026.02 更新，从低到高三个复杂度层级：

### 3.1 三层复杂度

| 层级 | 模式 | 说明 | 适用场景 |
|------|------|------|---------|
| **L1** | Direct Model Call | 单次 LLM 调用，无 Agent 逻辑 | 分类、摘要、翻译等单步任务 |
| **L2** | Single Agent with Tools | 单个 Agent 循环调用工具/API | 单域内动态查询（查订单、查数据库）。**企业场景默认推荐起点** |
| **L3** | Multi-Agent Orchestration | 多 Agent 协作 | 跨域问题、需要安全边界隔离的场景 |

### 3.2 多 Agent 编排模式

| 模式 | 说明 | 适用场景 |
|------|------|---------|
| **Sequential（顺序）** | Agent 按预定义线性顺序管道传递 | 文档审核管道、draft-review-polish 流程 |
| **Concurrent（并发）** | 多 Agent 并行处理同一任务，结果聚合 | 头脑风暴、投票决策、时间敏感场景 |
| **Handoff（交接）** | Agent 之间按需转移控制权 | 客服分诊路由、专家分工 |
| **Group Chat（群聊）** | 所有 Agent 在共享上下文中自由对话 | 需要共识的研究任务、编码评审 |
| **Magentic-One** | 编排者 Agent 动态分配任务给工作者 | 复杂多步骤开放式任务 |

---

## 4. 数据与记忆层

### 4.1 向量数据库对比

| 维度 | **Qdrant** | **Milvus** | **Pinecone** | **Chroma** | **Weaviate** | **PGVector** |
|------|------------|------------|--------------|------------|--------------|-------------|
| 语言 | Rust | Go+C++ | 专有后端 | Python | Go | C (PostgreSQL) |
| 部署 | 自托管/云服务 | 分布式 | SaaS全托管 | 本地嵌入式 | 自托管/云托管 | PostgreSQL扩展 |
| 容量 | 千万级 | 十亿级+ | 十亿级 | 百万级 | 千亿级 | 百万~千万级 |
| P99延迟 | <100ms | <50ms | <100ms | <200ms | <150ms | 10-50ms(百万级) |
| 混合检索 | 支持 | 支持 | 支持 | 不支持 | 内置BM25+向量 | 支持 |
| 分布式 | 支持 | CNCF毕业 | 自动分片 | 不支持 | 支持 | 依赖PG集群 |
| 最大优势 | 过滤性能最强 | 超大规模扩展 | 零运维 | 极简上手 | 混合搜索+知识图谱 | 复用现有PG |
| 最大劣势 | 十亿级经验不足 | 运维复杂(依赖Etcd/MinIO/Pulsar) | 无法自托管 | 不适合生产 | 分布式配置复杂 | 向量性能有限 |

### 4.2 选型建议

| 场景 | 推荐 | 理由 |
|------|------|------|
| 个人开发/原型 | Chroma | 零配置，几行代码即可使用 |
| 生产环境（中小规模） | Qdrant | Rust性能优秀，过滤能力强，部署简单 |
| 企业级海量数据（>1亿） | Milvus/Zilliz | CNCF毕业，水平无限扩展 |
| 快速上线团队 | Pinecone | Serverless全托管，零运维 |
| 已有PostgreSQL | PGVector | 无需引入新组件，适合已有PG架构 |
| 需要混合搜索 | Weaviate | 内置BM25+向量融合，支持Rerank |

### 4.3 关键索引算法

| 算法 | 全称 | 特点 | 适用 |
|------|------|------|------|
| **HNSW** | Hierarchical Navigable Small World | 高精度高吞吐，内存占用大 | Qdrant/Weaviate 默认 |
| **IVF** | Inverted File Index | 内存占用小适合超大数据 | Faiss/Milvus 支持 |
| **DiskANN** | — | 图索引存SSD，可处理内存放不下的数据集 | 大规模低内存场景 |

### 4.4 记忆系统

| 类型 | 机制 | 适用 |
|------|------|------|
| **短期记忆** | Window Buffer（滑动窗口保留最近 N 轮对话） | 上下文保持、连续对话 |
| **长期记忆** | Vector Store（向量化存储历史对话/知识） | 跨会话回忆、知识累积 |
| **实体记忆** | 提取关键实体（人名、概念、偏好）单独存储 | 用户画像、个性化 Agent |

---

## 5. 模型部署与服务化

### 5.1 核心框架对比

| 框架 | 定位 | 核心优势 | 适用场景 | 局限 |
|------|------|---------|---------|------|
| **vLLM** | 高吞吐生产推理 | PagedAttention显存利用率95%，连续批处理吞吐提升24x | 生产环境高并发场景 | 部署较复杂，需GPU环境 |
| **Ollama** | 本地轻量部署 | 一键安装，跨平台(CPU/GPU/M系列)，显存不足自动卸载CPU | 个人开发、快速原型、隐私场景 | 吞吐较低（30-80 token/s） |
| **TGI** | 企业级推理 | HuggingFace生态，内置安全验证/负载均衡/模型热更新 | 金融/医疗等高稳定性要求场景 | 需K8s集成，运维门槛高 |
| **BentoML** | ML模型服务化 | 统一Python框架，支持任意ML模型，BentoCloud托管 | 多模型混合部署，MLOps团队 | 推理性能不及专用框架 |
| **Ray Serve** | 分布式编排 | 天然分布式，适合复杂pipeline和多模型组合 | 大规模多模型服务编排 | 学习曲线陡峭 |
| **SGLang** | 结构化输出专家 | Radix Tree缓存，多轮对话吞吐是vLLM的5倍 | 多轮对话、Agent系统 | 较新，生态不如vLLM |
| **TensorRT-LLM** | NVIDIA极致优化 | 内核级优化，FP8/INT4量化，极致低延迟 | 高频交易、AI电话客服 | 仅NVIDIA，核心闭源 |
| **Xinference** | 企业多模型管理 | PD分离(prefill/decoding分离)，分布式管理 | 企业级多模型统一管理平台 | 相对小众 |

### 5.2 选型建议

| 场景 | 推荐 |
|------|------|
| 生产高并发 | vLLM（行业标准） |
| 本地开发/个人 | Ollama（5分钟上手） |
| HuggingFace生态 | TGI |
| 极致延迟 | TensorRT-LLM |
| 多Agent/多轮对话 | SGLang |
| 复杂多模型Pipeline | Ray Serve |

---

## 6. 可观测性与评估

### 6.1 可观测性工具对比

| 工具 | 类型 | 核心功能 | 集成方式 | 价格 |
|------|------|---------|---------|------|
| **LangSmith** | LangChain官方 | 调试、追踪、评估、提示词管理 | LangChain原生集成 | 免费层+付费 |
| **Langfuse** | 开源 | 追踪、评估、提示词管理、数据集 | OpenTelemetry, LangChain, OpenAI SDK | 开源免费/云付费 |
| **Arize Phoenix** | 开源 | 嵌入可视化、模型性能分析、trace分析 | OpenTelemetry原生 | 开源免费 |
| **Weights & Biases** | 商业平台 | 实验追踪、模型训练监控、LLM评估 | Python SDK | 免费层+企业 |
| **Helicone** | 开源 | 代理监控、成本追踪、缓存、速率限制 | OpenAI SDK代理层 | 开源免费 |
| **Opik (Comet)** | 开源 | 追踪、评估、prompt管理、playground | 多框架集成 | 开源免费 |

### 6.2 关键能力矩阵

| 能力 | 说明 |
|------|------|
| **Tracing（追踪）** | 追踪请求从输入到输出的完整链路，包括向量数据库查询、工具调用等 |
| **Evaluation（评估）** | 自动化质量评估，LLM-as-judge |
| **Prompt Management** | 版本管理、A/B测试 |
| **Cost Tracking** | Token用量和费用监控 |
| **OpenTelemetry集成** | Langfuse/Phoenix支持OTel标准，可与Datadog/Grafana等集成 |

### 6.3 评估框架对比

| 框架 | 专注领域 | 核心指标 | 特点 |
|------|---------|---------|------|
| **Ragas** | RAG系统评估 | 忠实度、答案相关性、上下文相关性/召回率 | RAG评估标准，利用LLM-as-judge |
| **DeepEval** | 全场景LLM评估 | 幻觉、毒性、偏差、答案相关性、上下文精度 | 类似pytest语法，支持Agent评估 |
| **LangSmith Evaluations** | LangChain生态 | 自定义评估器、比较评估 | 与LangChain深度集成 |
| **ChainForge** | Prompt测试 | 可视化Prompt对战 | UI交互强，适合Prompt工程 |
| **RAGChecker** | RAG细粒度诊断 | 检索精度、生成质量 | 诊断粒度最细 |

### 6.4 Agent 评估特殊需求

- **工具调用正确性**：Agent 是否选择了正确的工具
- **多步推理完整性**：任务链是否完整执行
- **幻觉检测**：生成的答案是否与检索上下文一致
- **红队测试（Red Teaming）**：自动化对抗测试，发现安全漏洞
- **测试驱动提示词工程（TDPE）**：在 CI/CD 中插入 LLM 评估步骤

### 6.5 选型建议

| 场景 | 推荐 |
|------|------|
| LangChain用户 | LangSmith（原生集成） |
| 需要开源方案 | Langfuse（功能最全）或 Arize Phoenix（嵌入分析最强） |
| 实验/训练追踪 | Weights & Biases |
| 成本监控/代理 | Helicone |
| RAG项目 | Ragas（标准）+ RAGChecker（细粒度诊断） |
| Agent系统 | DeepEval（支持Agent评估）+ 自定义红队测试 |
| 团队标准化 | 基于OpenTelemetry的方案（Langfuse/Phoenix） |

---

## 7. 协议层：MCP 与 A2A

### 7.1 三大标准协议

2025 年由 OpenAI/Anthropic/Block 联合在 Linux 基金会成立 AAIF 推动：

| 协议 | 主导方 | 定位 | 状态 |
|------|--------|------|------|
| **MCP** | Anthropic | Agent ↔ 工具/数据连接 | 10,000+ 服务器采用，已捐赠 Linux 基金会 |
| **A2A** | Google | Agent ↔ Agent 通信标准 | 已捐赠 Linux 基金会 |
| **AGENTS.md** | OpenAI | AI 编码 Agent 项目指导标准化 | 60,000+ 开源项目采用 |

### 7.2 MCP 深度解析

**协议架构**：经典 Client-Server 模型

```
MCP Host (AI应用) ←→ MCP Client (连接器) ←→ MCP Server (工具/数据提供者)
```

**三大能力暴露**：
- **Resources**：数据源暴露（文件、数据库、API 响应）
- **Prompts**：模板化提示词
- **Tools**：可调用函数（JSON Schema 定义）

**传输方式**：
- **STDIO**：本地进程间通信
- **SSE**：Server-Sent Events，远程单向
- **Streamable HTTP**：2025年3月升级，单端点双向通信，替代SSE

**2025年关键更新**：
- OAuth 2.0 升级：强制 PKCE，资源指示器（RFC 8707）
- 批处理：所有实现必须支持 JSON-RPC 批处理
- Tool Annotations：工具安全属性和 UI 展示属性
- Elicitation URL 模式：敏感数据通过浏览器 URL 输入，不经过 MCP 客户端
- **Tasks 异步任务**（2025年11月）：`tasks/create` → `tasks/get` → `tasks/result`，支持长时间操作

**开发生态**：
- SDK：Python (`mcp`), TypeScript (`@modelcontextprotocol/sdk`)
- 1600+ MCP Servers（2025年数据），企业采用率增长 340%
- 关键 Server：GitHub、Filesystem、Puppeteer/Playwright 等

### 7.3 MCP 安全基准

| 攻击类型 | 说明 |
|----------|------|
| **Tool Signature Attack** | 伪造工具的名称/描述诱导 Agent 选择 |
| **Name Collision** | 恶意工具伪装成官方工具 |
| **Preference Manipulation** | 在工具描述中注入宣传语句影响 Agent 判断 |

### 7.4 A2A 协议

- Google 主导的 Agent 间通信标准
- Agent Cards 自动发现机制
- 多模态通信支持（文本/图像/音频/视频）
- 任务状态追踪
- 与 MCP 协同工作：MCP 负责工具调用，A2A 负责 Agent 间协作

---

## 8. 安全与治理

### 8.1 四大威胁

| 威胁 | 说明 | 增长率 |
|------|------|--------|
| **Prompt 注入** | 通过外部输入篡改 Agent 指令 | 年增长 540% |
| **工具滥用** | 诱导 Agent 调用非预期工具 | 40% 组织已遭攻击 |
| **权限越界** | Agent 继承过多环境变量/API 密钥 | — |
| **幻觉危害** | Agent 基于错误信息执行危险操作 | — |

### 8.2 四层防御架构

| 层级 | 防御手段 | 语义相关? |
|------|---------|----------|
| **输入过滤** | 安全围栏、恶意模式检测 | 是 |
| **行为约束** | 白名单工具调用、参数校验 | 部分 |
| **权限控制/沙箱** | 最小权限、容器隔离、只读文件系统 | 否（最强） |
| **审计/监控** | 全量 trace 记录、异常行为检测 | 否 |

### 8.3 关键安全原则

- **纵深防御**：不依赖单层，入口/上下文/判断/出口每层设卡
- **最小权限（Least Privilege）**：Agent 只拥有完成任务所需的最小权限
- **Blast Radius Control**：即使被攻破，影响范围也要可控
- **Assume Compromise**：默认第三方 skill 可能出问题，系统设计要能兜住
- **语义无关防御**：不依赖模型怎么"理解"，而是靠架构强制约束

### 8.4 实用安全工具

| 工具 | 用途 |
|------|------|
| **Microsoft Presidio** | PII 敏感数据检测、编辑、掩码和匿名化 |
| **NeMo Guardrails** | 对话安全护栏 |
| **LLM Guard** | 输入输出安全扫描 |

---

## 9. 云原生与部署

### 9.1 Kubernetes GPU 调度

**核心组件栈**：

| 组件 | 作用 |
|------|------|
| **NVIDIA Device Plugin** | 向 K8s 注册 GPU 资源 |
| **GPU Operator** | 全生命周期管理 |
| **DCGM Exporter** | 监控指标采集 |
| **Volcano** | 批处理/Gang Scheduling 调度器 |

**2025-2026 关键演进**：

| 特性 | 说明 |
|------|------|
| **DRA（Dynamic Resource Allocation）** | GPU 按需切片，不再整卡分配 |
| **Topology Aware Scheduling** | 感知 NVLink/PCIe 物理拓扑，调度邻近 GPU |
| **GPU 共享时间切片** | 单卡拆分为多个 vGPU（如 1 卡 4 份） |
| **Checkpoint & 恢复** | 训练中断后从中断点恢复 |

### 9.2 Serverless LLM

| 方案 | 特点 |
|------|------|
| **ServerlessLLM** | 模型共享、推理迁移、比 Ray Serve 更低启动延迟 |
| **KubeRay** | K8s 上部署 Ray 集群 |
| **KServe** | K8s 原生模型服务，Serverless 推理 |

### 9.3 部署架构建议

| 规模 | 推荐架构 |
|------|---------|
| 小规模/个人 | 单 GPU + Ollama/vLLM Docker |
| 中小团队 | K8s 集群 + vLLM + GPU Device Plugin + 水平自动扩缩容 |
| 企业级 | K8s 多集群 + DRA 拓扑感知调度 + Ray Serve 编排 + ServerlessLLM 弹性 |
| 边缘场景 | K3s/MicroK8s 轻量发行版 + 量化模型 |

### 9.4 CI/CD for AI

- **Prompt 版本控制**：将 Prompt 视为代码，纳入 Git 管理
- **自适应测试选择**：AI 根据代码变更预测高风险测试用例
- **预测性部署风险评估**：基于历史数据识别潜在问题并提供回滚建议
- **概率性评估**：使用 LangSmith/Phoenix 对 Agent 输出进行批量评估

### 9.5 关键趋势

- 到 2026 年底，全球 2/3 AI 算力将流向推理
- Kubernetes 已拿下 80% 企业流量调度权
- CNCF 正推动 AI 工作负载标准化
- 平台工程（Platform Engineering）成为 AI 部署新范式

---

## 10. 开发者技能图谱

### 10.1 技能分层

| 层级 | 技能 | 说明 |
|------|------|------|
| **Tier 1 必修** | Python 进阶、LLM API 调用、Prompt Engineering、Function Calling、至少一个 Agent 框架 | 无此无法开工 |
| **Tier 2 进阶** | RAG 全流程、MCP Server 开发、向量数据库、多 Agent 协作、记忆系统 | 生产项目必备 |
| **Tier 3 工程化** | Docker/K8s、可观测性、安全防护、CI/CD for AI、成本优化 | 上线运维必需 |
| **Tier 4 前沿** | A2A 协议、GraphRAG、混合模型架构、Agent 评估体系、GPU 调度 | 架构师/技术负责人 |

### 10.2 Tier 1 核心必修详解

**1. 编程语言**
- **Python（断层第一）**：异步编程(asyncio)、类型注解、包管理
- **TypeScript/JavaScript**：Vercel AI SDK、前端 AI Agent、类型系统定义 Tool Schema
- **Go/Java**：高并发微服务后端 / 企业级 Spring AI

**2. LLM 原理与 API 调用**
- Transformer 架构基础、Token 机制、上下文窗口限制
- 主流模型 API（Qwen、DeepSeek、GPT-4、Claude）调用与计费
- 限流、重试、超时处理、多模型路由
- 结构化输出（JSON Mode、JsonOutputParser）

**3. Prompt Engineering 2.0**
- Chain-of-Thought (CoT)、ReAct（推理+行动范式）
- 结构化提示词、Few-Shot/Zero-Shot
- 系统级消息设计、多轮对话逻辑

**4. Function Calling / Tool Use**
- JSON Schema 定义工具、参数校验、动态 API 适配
- 工具调用循环（判断意图 → 选择工具 → 执行 → 返回结果）
- 安全边界（权限验证、沙箱执行、防注入）

**5. Agent 框架**
- LangChain / LangGraph：状态化多 Agent 系统、图状态管理
- AutoGen：异步消息架构、多 Agent 协作
- CrewAI：角色化团队协作
- 掌握其中至少一个，能独立搭建 Agent 系统

### 10.3 Tier 2 进阶核心详解

**6. RAG（检索增强生成）**
- 向量数据库（Pinecone、Milvus、ChromaDB）
- 混合检索（关键词+向量）、重排序（Rerank）、GraphRAG
- 文档解析、数据清洗、向量知识库构建
- 记忆管理：短期（Window Buffer）vs 长期（Vector Store）vs 实体记忆

**7. MCP（Model Context Protocol）**
- 2026 年连接 AI 与数据的通用标准
- Docker 部署 MCP Server、配置权限/鉴权/日志
- Resources（数据源）、Tools（工具）、Skills（技能）三要素

**8. 多 Agent 协作**
- A2A（Agent-to-Agent）通信协议
- 任务调度、角色分工、冲突解决
- 共享上下文、消息队列、状态同步

### 10.4 不同角色技能侧重

| 维度 | 算法工程师 | 工程师（应用开发） | 产品经理 |
|------|-----------|-----------------|---------|
| **核心定位** | 改模型的 | 用模型的 | 定义产品的 |
| **编程语言** | Python（深度学习栈）、C++ | Python/Go/Java/TS（后端栈） | 基础编程理解即可 |
| **LLM 深度** | 训练/微调/对齐（LoRA、QLoRA）、模型压缩 | API 调用、多模型路由、Prompt 工程 | 理解原理和能力边界 |
| **Agent 技能** | 决策算法、强化学习、推理优化 | LangGraph/AutoGen、MCP、Skills、工作流编排 | Agent 交互设计、场景定义 |
| **数学要求** | 高（线性代数、概率论、微积分） | 中（理解算法概念） | 低 |
| **工程能力** | 中（模型部署、服务封装） | 高（API设计、数据库、微服务、CI/CD） | 低 |
| **产品能力** | 低 | 中 | 高（用户研究、商业闭环） |
| **典型工具** | PyTorch、TensorFlow、Hugging Face | LangChain、Docker、Redis、MySQL | Jira、SQL、数据分析工具 |
| **关键指标** | 准确率、BLEU/ROUGE | 成功率、延迟、成本 | 用户满意度、转化率 |

### 10.5 市场数据

| 指标 | 数据 |
|------|------|
| 岗位供需比 | ~100:1（MCP/Skills 经验者极度稀缺） |
| 薪资水平 | 70% 岗位月薪 20k-50k，比传统开发高 50% |
| 生产失败率 | 95% Agent 项目在生产环境失败（工程化不足） |
| 竞争程度 | 比传统开发竞争少 70% |

### 10.6 学习路径（6-12个月）

| 阶段 | 周期 | 内容 |
|------|------|------|
| **地基** | 2-4周 | Python进阶、LLM原理、Hello Agent、Prompt Engineering 2.0 |
| **工具与记忆** | 3-6周 | Function Calling、向量数据库、RAG全流程、记忆系统 |
| **Agent架构** | 4-6周 | LangGraph/AutoGen/CrewAI深入、ReAct模式、多工具编排 |
| **生产化部署** | 持续 | MCP部署、Agent Skills、可观测性、成本优化、安全加固 |
| **前沿拓展** | — | 多Agent协作、GraphRAG、混合模型架构、Agent评估体系 |

---

## 11. 生产级选型速查表

### 11.1 按阶段选型

| 阶段 | 框架 | 向量库 | 模型服务 | 可观测 | 网关 | 评估 |
|------|------|--------|---------|--------|------|------|
| **原型** | CrewAI / Smolagents | Chroma | Ollama | — | — | DeepEval |
| **早期产品** | LangGraph / LangChain | Qdrant | vLLM | Langfuse | LiteLLM | Ragas |
| **生产扩展** | LangGraph + CrewAI | Milvus | vLLM/SGLang | LangSmith/Phoenix | Portkey | DeepEval + 红队 |
| **企业级** | Google ADK / MAF | Milvus/Zilliz | TensorRT-LLM | Arize Phoenix | Kong Gateway | 全量评估体系 |

### 11.2 按场景选型

| 场景 | 推荐框架 | 理由 |
|------|---------|------|
| 生产级复杂多 Agent | LangGraph | 状态持久化、崩溃恢复、可调试性强 |
| 快速原型/角色协作 | CrewAI | 极简 API，几行代码创建多 Agent 系统 |
| RAG/知识库增强 | LlamaIndex | 数据索引和检索领域最强 |
| 客服路由/分诊 | OpenAI Agents SDK | 干净的交接模型 + 内置护栏 |
| 编码/OS 级 Agent | Claude Agent SDK | 最深 OS 访问，200+ MCP 服务器 |
| 企业 Java/Go 团队 | Google ADK | 多语言原生支持 + A2A 发现 |
| 低代码/可视化 | Dify | 从构思到部署一体化，内置 RAG |
| 人机协作/研究 | AutoGen/MAF | GroupChat 辩论 + HITL 支持 |
| 极简/本地模型 | Smolagents | 核心 1000 行，减少 30% LLM 调用 |
| 类型安全/结构化 | Pydantic AI | IDE 级错误捕获，流式验证 |
