# LangChain + LangGraph 核心知识体系

> **版本**：v1.0 | **创建日期**：2026-04-21 | **最后更新**：2026-04-21
> **状态**：已完成 | **来源**：官方文档 docs.langchain.com + langchain-ai.github.io/langgraph

---

# 第 1 章：基础认知 — LangChain 生态全景

> 核心问题：LangChain 到底是什么？它和 LangGraph、Deep Agents、LangSmith 之间是什么关系？为什么企业都在用它？

---

## 1.1 LangChain 不是单一框架，而是四层生态

很多初学者被名字误导，以为 LangChain 就是"一个框架"。事实恰恰相反：**LangChain 是一个由四个独立开源库组成的完整生态系统**，每层解决不同复杂度的问题。

### 概念定义

LangChain 生态由同一团队（LangChain Inc.）开发的四个核心组件构成：

| 层级 | 组件 | 定位 | 类比 |
|------|------|------|------|
| 应用层 | **Deep Agents** | 工业级智能体执行框架，内置 Agent Harness | 成品房屋 |
| 编排层 | **LangGraph** | 低级别图编排引擎，支持有向循环图 | 钢筋混凝土骨架 |
| 框架层 | **LangChain（主包）** | Agent 开发基石，极简 `create_agent` API | 地基 |
| 观测层 | **LangSmith** | 可观测性、调试、评估、监控平台 | 监控摄像头 + 仪表盘 |

**关键认知**：这四层不是竞争关系，而是**层层构建、各司其职**的技术栈关系。

### 常见误区

- **误区 1**："LangChain 就是那个链式调用的库" → 这是 v0.x 时代的印象。v1.0 已经完全不同。
- **误区 2**："LangGraph 替代了 LangChain" → 两者是协作关系，LangChain 的 Agent 构建在 LangGraph 之上。
- **误区 3**："用了 LangChain 就必须用 LangSmith" → LangSmith 是独立可选的，非 LangChain 项目也可以用。

---

## 1.2 四层架构详解

### 1.2.1 LangChain（主包）— 框架层

**定义**：生态的起点和开发基石，提供极简的 Agent 构建接口。

**核心能力**：
- `create_agent()` — 一行创建 Agent（指定模型 + 工具 + 提示词）
- 标准化 Agent 循环：模型调用 → 工具选择 → 工具执行 → 结果返回 → 循环
- 中间件（Middleware）系统：在 Agent 执行的任何步骤注入自定义逻辑
- 模型无关性：OpenAI、Anthropic、Google、Qwen 等统一接口

**适用场景**：快速构建标准 Agent 和自主应用程序。

### 1.2.2 LangGraph — 编排层

**定义**：低级别图编排引擎，用于构建、管理和部署长期运行、有状态的 Agent。

**核心能力**：
- `StateGraph`：基于有向循环图（非 DAG）的状态机
- 持久化执行：失败后从断点恢复，支持数天/周级别任务
- 人机协同（Human-in-the-Loop）：关键决策点的人工拦截
- 跨会话记忆：短期工作记忆 + 长期持久化记忆
- 时间旅行：回退到之前的状态快照

**适用场景**：需要确定性流程 + 智能工作流、深度定制、精确控制响应延迟。

### 1.2.3 Deep Agents — 应用层

**定义**：LangChain 的新成员，构建于 LangChain 与 LangGraph 之上的工业级智能体执行框架。

**核心能力**：
- **Agent Harness 驱动**：对标 Manus 和 Claude Code
- **任务自动规划**：内置 Todo 清单，引导 Agent 拆解大型任务
- **文件系统集成**：内置虚拟文件系统（ls, read_file, write_file），管理"工作记忆"
- **子智能体（Sub-Agents）**：委派隔离上下文的子任务
- **大结果下沉**：Large Tool Result Eviction 机制
- **详细系统提示词**：内置借鉴 Claude Code 的长提示模板

**适用场景**：复杂多步骤任务、Deep Research、对标 Claude Code 的工业级 Agent。

### 1.2.4 LangSmith — 观测层

**定义**：LLM 应用的 DevOps 平台，提供全生命周期的可观测性和评估能力。

**核心能力**：
- 全链路追踪：树状图可视化完整调用链
- 自动化评估：LLM-as-Judge 自动评分，A/B 测试
- 实时监控与告警：延迟、错误率、Token 消耗、工具调用成功率
- 提示词管理：多版本测试、动态少样本示例选择
- 数据集管理：存储和分析模型输入输出

**适用场景**：生产环境的 Agent 监控、调试、性能优化。

---

## 1.3 三层关系图（LangChain / LangGraph / Deep Agents）

```mermaid
graph TB
    subgraph "应用层"
        DA["Deep Agents<br/>工业级 Agent 执行框架<br/>• Agent Harness 驱动<br/>• 任务自动规划<br/>• 文件系统集成<br/>• 子智能体委派"]
    end

    subgraph "编排层"
        LG["LangGraph<br/>低级别图编排引擎<br/>• StateGraph 有向循环图<br/>• 持久化执行 & 断点续跑<br/>• 人机协同<br/>• 时间旅行"]
    end

    subgraph "框架层"
        LC["LangChain 主包<br/>极简 Agent 构建<br/>• create_agent 一行构建<br/>• 标准化 Agent 循环<br/>• 中间件系统<br/>• 模型无关性"]
    end

    subgraph "观测层"
        LS["LangSmith<br/>可观测性平台<br/>• 全链路追踪<br/>• 自动化评估<br/>• 实时监控告警<br/>• 提示词管理"]
    end

    DA -->|构建于| LG
    DA -->|使用| LC
    LG -->|作为运行时| LC
    LC -.->|追踪 & 评估| LS
    LG -.->|可视化调试| LS
    DA -.->|生产监控| LS

    style DA fill:#ff6b6b,stroke:#c0392b,color:#fff
    style LG fill:#4ecdc4,stroke:#16a085,color:#fff
    style LC fill:#45b7d1,stroke:#2980b9,color:#fff
    style LS fill:#f39c12,stroke:#d35400,color:#fff
```

**选型决策树**：

```mermaid
graph LR
    Q1["你的需求是什么？"] --> A1["快速构建标准 Agent"]
    Q1 --> A2["复杂工作流 + 深度定制"]
    Q1 --> A3["工业级复杂任务<br/>多步骤规划 + 文件操作"]
    Q1 --> A4["监控 & 评估生产环境"]

    A1 --> LC2["使用 LangChain<br/>create_agent 一行搞定"]
    A2 --> LG2["使用 LangGraph<br/>StateGraph 精细控制"]
    A3 --> DA2["使用 Deep Agents<br/>开箱即用的 Agent Harness"]
    A4 --> LS2["使用 LangSmith<br/>全链路可观测性"]

    style LC2 fill:#45b7d1,color:#fff
    style LG2 fill:#4ecdc4,color:#fff
    style DA2 fill:#ff6b6b,color:#fff
    style LS2 fill:#f39c12,color:#fff
```

---

## 1.4 行业采用数据

LangChain 生态已成为 AI 应用开发的事实标准：

| 指标 | 数据 |
|------|------|
| **月下载量** | **9000 万次**（所有 langchain-* 包合计） |
| **GitHub Stars** | LangChain 主仓库 **121k+** Stars |
| **财富 500 强采用率** | **35%** 的财富 500 强企业在使用 |
| **开发者生态** | 数百万开发者、数千社区贡献者 |
| **融资估值** | 2025 年完成 1.25 亿美元融资，估值 12.5 亿美元 |

### 典型企业用户

- **Uber** — 用于内部 AI 应用开发平台，标准化 Agent 构建流程
- **LinkedIn** — 结合 LangGraph 构建复杂内容推荐和搜索工作流
- **Klarna** — AI 客服助手，利用 LangChain 工具调用能力对接内部 API
- **J.P. Morgan** — 金融合规和文档分析场景，使用 LangGraph 的持久化执行和 Human-in-the-Loop
- **Vodafone** — 基于 LangGraph 构建智能运维系统，故障平均解决时间从 45 分钟缩短至 15 分钟

---

## 1.5 为什么从 Chain 进化到 Agent：业务需求的变迁

### 演进时间线

```mermaid
timeline
    title LangChain 架构演进历程
    2022 Q4 : Chain 时代
      : 线性链式结构<br/>Prompt → LLM → Output
      : 适合简单问答、翻译、摘要
    2023 : Agent 萌芽
      : 模型开始具备工具调用能力
      : ReAct 模式：思考 → 行动 → 观察
      : 业务需求：多步骤任务执行
    2024 : Graph 编排
      : LangGraph 发布
      : 有向循环图支持复杂工作流
      : 业务需求：多 Agent 协作、持久化
    2025 Q4 : LangChain 1.0
      : create_agent 标准化
      : 中间件系统
      : 业务需求：生产就绪、企业级
    2026 : Deep Agents
      : 工业级 Agent Harness
      : 对标 Manus / Claude Code
      : 业务需求：自主规划 + 文件操作
```

### 核心驱动力

| 阶段 | 业务需求 | 技术限制 | 解决方案 |
|------|----------|----------|----------|
| **Chain** | 单次问答、模板化输出 | 模型无法调用外部工具 | 链式拼接：Prompt Template → LLM → Output Parser |
| **Agent 1.0** | 多步骤任务、工具调用 | 线性结构无法处理分支和循环 | ReAct 循环 + AgentExecutor |
| **Agent 2.0** | 持久化执行、人机协同 | 黑盒执行，无法中断和恢复 | LangGraph 有向循环图 + State |
| **Agent 3.0** | 工业级复杂任务 | 需要大量样板代码和工程化配置 | Deep Agents Agent Harness + 中间件 |

### 本质转变

> **Chain（链）** 解决的是"如何把多个 LLM 调用串起来"的问题。
> **Agent（智能体）** 解决的是"如何让 LLM 自主决策下一步做什么"的问题。
> **Graph（图编排）** 解决的是"如何在 Agent 自主决策的基础上，叠加确定性的流程控制"的问题。

---

## 1.6 生态版本关系

```mermaid
graph LR
    subgraph "已淘汰"
        v0["LangChain v0.x<br/>复杂、臃肿、概念繁杂"]
        v03["LangChain v0.3<br/>已停止维护"]
    end

    subgraph "当前稳定版"
        v1["LangChain v1.0+<br/>精简、稳定、生产就绪"]
        v1g["LangGraph v1.0+<br/>配合 LangChain 增强稳定性"]
        v1d["Deep Agents<br/>工业级 Agent 执行"]
        v1s["LangSmith<br/>可观测性平台"]
    end

    v0 -.->|重写| v1
    v03 -.->|淘汰| v1
    v1 --> v1g
    v1 --> v1d
    v1 --> v1s

    style v0 fill:#95a5a6,color:#fff,stroke-dasharray: 5 5
    style v03 fill:#95a5a6,color:#fff,stroke-dasharray: 5 5
    style v1 fill:#27ae60,color:#fff
    style v1g fill:#27ae60,color:#fff
    style v1d fill:#27ae60,color:#fff
    style v1s fill:#27ae60,color:#fff
```

**重要声明**：LangChain 团队承诺在 v2.0 之前不会引入破坏性变更（Breaking Changes），企业可以放心在生产环境中使用 v1.0。

---

## 1.7 常见误区总结

| 误区 | 正确理解 |
|------|----------|
| "LangChain 就是 Chain" | Chain 是 v0.x 时代的核心概念；v1.0 的核心是 Agent |
| "LangGraph 是用来替代 LangChain 的" | 它们是协作关系，LangChain Agent 的运行时就是 LangGraph |
| "必须学完所有四层才能开始" | 从 `create_agent` 开始，遇到复杂需求再引入 LangGraph |
| "LangChain 只支持 OpenAI" | 原生支持 OpenAI、Anthropic、Google、Qwen、DeepSeek 等 |
| "0.3 版本升级到 1.0" | 1.0 是推倒重写，不是增量升级；0.3 已被淘汰 |
| "GitHub Stars 就是全部" | Stars 代表社区热度，企业采用率（35% 财富 500 强）才是关键指标 |
# 第 2 章：LangChain 1.0 核心升级 — 一行代码构建生产级 Agent

> 核心问题：LangChain 1.0 到底带来了什么改变？`create_agent()` 为什么是 Agent 构建的新标准？

---

## 2.1 从 200 行样板代码到一行 API

### 概念定义

`create_agent()` 是 LangChain 1.0 中引入的**标准化 Agent 构建接口**，替代了旧版的 `langgraph.prebuilt.create_react_agent`。它通过极简的函数签名（模型 + 工具 + 提示词）即可创建完整的、生产就绪的 Agent。

**旧版（v0.x）的问题**：
- 需要导入 `langgraph.prebuilt.create_react_agent`
- 手动配置提示词模板
- 处理工具调用格式
- 至少编写 50~200 行样板代码
- 概念繁杂、学习曲线陡峭

**新版（v1.0）的体验**：

```python
from langchain.agents import create_agent
from langchain_openai import ChatOpenAI

# 一行创建 Agent
agent = create_agent(
    model=ChatOpenAI(model="gpt-4o-mini"),
    tools=[get_weather, search_web],
    system_prompt="你是一个天气查询助手，使用工具获取实时天气。"
)

# 一行调用
result = agent.invoke({
    "messages": [{"role": "user", "content": "深圳今天天气怎么样？"}]
})

print(result["messages"][-1]["content"])
```

### 背后发生了什么

`create_agent()` 的简洁 API 掩盖了强大的内部实现：

```mermaid
sequenceDiagram
    participant User as 用户调用
    participant CA as create_agent()
    participant LG as LangGraph 运行时
    participant Model as LLM 模型
    participant Tools as 工具列表

    User->>CA: create_agent(model, tools, prompt)
    CA->>LG: 编译 StateGraph<br/>构建 Agent 循环
    Note over LG: 底层自动构建<br/>START → Agent → Tool → Agent → END

    User->>LG: invoke({messages: [...]})
    LG->>Model: 调用 LLM + 提示词 + 工具描述
    Model-->>LG: 返回工具调用决策

    alt 模型需要调用工具
        LG->>Tools: 执行选中的工具
        Tools-->>LG: 返回工具结果
        LG->>Model: 将工具结果喂回模型
        Model-->>LG: 返回最终响应或再次调用工具
    else 模型不需要调用工具
        Model-->>LG: 返回最终文本响应
    end

    LG-->>User: 返回完整消息历史
```

---

## 2.2 标准化 Agent 循环：模型 → 工具选择 → 执行 → 返回 → 循环

### 工作原理

`create_agent()` 内部实现了经典的 **ReAct 循环**（Reasoning + Acting），但将其标准化为五个步骤：

```mermaid
stateDiagram-v2
    [*] --> START
    START --> 调用模型: 传入用户输入 + 提示词

    调用模型 --> 模型决策: 模型判断下一步

    模型决策 --> 调用工具: 需要工具
    模型决策 --> 返回响应: 不需要工具

    调用工具 --> 获取结果: 执行工具函数
    获取结果 --> 调用模型: 将结果喂回模型

    调用模型 --> 模型决策: 循环

    返回响应 --> END
    END --> [*]

    note right of 调用模型
        每次循环包含：
        1. 用户输入/历史消息
        2. 可用工具描述
        3. 系统提示词
    end note

    note right of 调用工具
        工具由 Python 函数定义
        通过 @tool 装饰器
        或 Tool 类创建
    end note
```

### 循环步骤详解

| 步骤 | 说明 | 输入 | 输出 |
|------|------|------|------|
| **① 调用模型** | 将用户消息、历史对话、可用工具描述一并传给 LLM | messages + tool descriptions + system_prompt | LLM 响应 |
| **② 工具选择** | 模型根据当前上下文决定：调用哪个工具，或不需要工具 | LLM 响应 | 工具名称 + 参数 |
| **③ 执行工具** | 执行选中的 Python 函数 | 工具函数 + 参数 | 工具返回值 |
| **④ 结果返回** | 将工具执行结果作为新的消息追加到消息历史 | 工具结果 | 更新后的消息列表 |
| **⑤ 循环判断** | 如果模型再次需要工具，回到步骤 ①；否则结束 | 消息历史 | 最终响应 或 继续循环 |

---

## 2.3 代码示例：天气查询 Agent

### 完整可运行代码

```python
# pip install -U langchain langchain-openai

import os
from langchain.agents import create_agent
from langchain_openai import ChatOpenAI
from langchain_core.tools import tool

# ========== 第 1 步：定义工具 ==========

@tool
def get_weather(city: str) -> str:
    """获取指定城市的实时天气信息。

    Args:
        city: 城市名称，如 "深圳"、"北京"
    """
    # 实际项目中应替换为真实 API 调用
    weather_data = {
        "深圳": "晴，28°C，湿度 65%",
        "北京": "多云，22°C，湿度 40%",
        "上海": "小雨，20°C，湿度 85%",
    }
    return weather_data.get(city, f"未找到 {city} 的天气数据")

@tool
def get_air_quality(city: str) -> str:
    """获取指定城市的空气质量指数（AQI）。

    Args:
        city: 城市名称
    """
    aqi_data = {
        "深圳": "AQI 45（优）",
        "北京": "AQI 120（轻度污染）",
        "上海": "AQI 80（良）",
    }
    return aqi_data.get(city, f"未找到 {city} 的空气质量数据")

# ========== 第 2 步：创建 Agent ==========

agent = create_agent(
    # 指定模型（支持所有主流提供商）
    model=ChatOpenAI(model="gpt-4o-mini"),

    # 指定可用工具
    tools=[get_weather, get_air_quality],

    # 系统提示词
    system_prompt=(
        "你是一个专业的天气查询助手。"
        "用户询问天气时，先调用 get_weather 获取天气信息，"
        "然后调用 get_air_quality 获取空气质量。"
        "用友好的中文回答。"
    ),
)

# ========== 第 3 步：调用 Agent ==========

if __name__ == "__main__":
    result = agent.invoke({
        "messages": [
            {"role": "user", "content": "深圳今天的天气和空气质量怎么样？"}
        ]
    })

    # 输出模型的最终响应
    print(result["messages"][-1].content)
```

### 运行日志追踪

```
# 第一轮：模型需要调用两个工具
消息 1 (user): 深圳今天的天气和空气质量怎么样？
消息 2 (assistant): [调用工具 get_weather(city="深圳")]
消息 3 (tool): 晴，28°C，湿度 65%
消息 4 (assistant): [调用工具 get_air_quality(city="深圳")]
消息 5 (tool): AQI 45（优）
消息 6 (assistant): 深圳今天天气晴朗，气温28°C，湿度65%。
                  空气质量AQI 45，属于"优"级别。
                  非常适合户外活动！
```

---

## 2.4 代码示例：研究助手 Agent

```python
import os
from langchain.agents import create_agent
from langchain_openai import ChatOpenAI
from langchain_core.tools import tool
from typing import List

# ========== 工具定义 ==========

@tool
def search_web(query: str) -> str:
    """搜索互联网获取最新信息。

    Args:
        query: 搜索关键词
    """
    # 实际项目中可集成 Tavily、DuckDuckGo 等搜索 API
    return f"搜索 '{query}' 的结果：（此处为模拟数据）..."

@tool
def analyze_data(data_description: str) -> str:
    """分析数据并提取关键趋势和洞察。

    Args:
        data_description: 需要分析的数据描述
    """
    return f"分析结果：基于 '{data_description}' 提取了以下关键趋势..."

@tool
def send_email(recipient: str, subject: str, body: str) -> str:
    """发送邮件给指定收件人。

    Args:
        recipient: 收件人邮箱
        subject: 邮件主题
        body: 邮件正文
    """
    # 实际项目中可集成 SMTP 或邮件 API
    return f"邮件已发送给 {recipient}，主题：{subject}"

# ========== 创建 Agent ==========

research_agent = create_agent(
    model=ChatOpenAI(model="gpt-4o"),
    tools=[search_web, analyze_data, send_email],
    system_prompt=(
        "你是一个专业的研究助手。你的工作流程是："
        "1. 使用 search_web 搜索用户主题的最新信息"
        "2. 使用 analyze_data 分析收集到的数据"
        "3. 如果用户要求，使用 send_email 发送研究报告"
        "确保所有回答都有数据支撑，标注信息来源。"
    ),
)

# ========== 调用 Agent ==========

if __name__ == "__main__":
    result = research_agent.invoke({
        "messages": [
            {"role": "user", "content": "帮我调研 2025 年 AI Agent 框架的市场趋势，并总结关键发现"}
        ]
    })

    print(result["messages"][-1].content)
```

---

## 2.5 多模型支持：统一接口，零代码切换

`create_agent()` 的 model 参数接受任何符合 LangChain ChatModel 接口的模型实例：

```python
from langchain_openai import ChatOpenAI
from langchain_anthropic import ChatAnthropic
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_openai import AzureChatOpenAI

# ===== OpenAI =====
agent_openai = create_agent(
    model=ChatOpenAI(model="gpt-4o"),
    tools=[my_tool],
    system_prompt="你是助手。"
)

# ===== Anthropic =====
agent_anthropic = create_agent(
    model=ChatAnthropic(model="claude-sonnet-4-5-20250514"),
    tools=[my_tool],
    system_prompt="你是助手。"
)

# ===== Google Gemini =====
agent_google = create_agent(
    model=ChatGoogleGenerativeAI(model="gemini-2.5-pro"),
    tools=[my_tool],
    system_prompt="你是助手。"
)

# ===== 阿里通义千问（通过 OpenAI 兼容接口） =====
agent_qwen = create_agent(
    model=ChatOpenAI(
        model="qwen-plus",
        openai_api_base="https://dashscope.aliyuncs.com/compatible-mode/v1",
        openai_api_key=os.environ["DASHSCOPE_API_KEY"],
    ),
    tools=[my_tool],
    system_prompt="你是助手。"
)

# ===== DeepSeek（通过 OpenAI 兼容接口） =====
agent_deepseek = create_agent(
    model=ChatOpenAI(
        model="deepseek-chat",
        openai_api_base="https://api.deepseek.com/v1",
        openai_api_key=os.environ["DEEPSEEK_API_KEY"],
    ),
    tools=[my_tool],
    system_prompt="你是助手。"
)
```

### 模型标识命名规则

| 提供商 | 标识前缀 | 示例 |
|--------|----------|------|
| OpenAI | `openai:` | `openai:gpt-4o` |
| Anthropic | `anthropic:` | `anthropic:claude-sonnet-4-5` |
| Google | `google:` | `google:gemini-2.5-pro` |
| 兼容 OpenAI | 直接使用 ChatOpenAI | 配置 `openai_api_base` |

---

## 2.6 中间件（Middleware）系统

中间件是 LangChain 1.0 最大的架构变化之一。它允许你在 Agent 执行的**任何步骤**注入自定义逻辑，而无需修改 Agent 的核心循环。

```python
from langchain.agents import create_agent
from langchain_openai import ChatOpenAI

def log_middleware(step, state, **kwargs):
    """中间件：记录每个执行步骤的信息"""
    print(f"[Middleware] 步骤: {step}")
    return state

def sanitize_middleware(step, state, **kwargs):
    """中间件：过滤敏感信息"""
    # 在消息发给模型前，脱敏处理
    for msg in state.get("messages", []):
        if "password" in str(msg.content).lower():
            msg.content = "[已脱敏]"
    return state

agent = create_agent(
    model=ChatOpenAI(model="gpt-4o-mini"),
    tools=[my_tool],
    system_prompt="你是助手。",
    middleware=[log_middleware, sanitize_middleware],
)
```

### 中间件应用场景

| 场景 | 中间件作用 |
|------|-----------|
| **长对话压缩** | 当消息历史超过阈值时，自动摘要压缩 |
| **数据脱敏** | 在消息发送给 LLM 前，移除敏感信息 |
| **人在回路** | 在特定工具调用前，暂停等待人工审核 |
| **动态模型切换** | 根据任务复杂度自动选择低成本或高性能模型 |
| **日志追踪** | 记录每个步骤用于 LangSmith 可观测性 |

---

## 2.7 content_blocks：跨模型统一内容处理

### 问题背景

不同 LLM 返回的内容格式差异很大：
- OpenAI 使用 `tool_calls` 数组
- Anthropic 使用 `tool_use` 块
- Google 使用 `function_call`

### 解决方案

LangChain 1.0 引入 `content_blocks` 属性，统一不同提供商的内容访问接口：

```python
result = agent.invoke({"messages": [{"role": "user", "content": "查天气"}]})

# 统一访问方式，不需要关心底层模型
for msg in result["messages"]:
    # 安全地访问文本内容
    text = msg.content

    # 安全地访问工具调用
    tool_calls = msg.tool_calls  # 统一格式，无论底层模型

    # 安全地访问推理过程（思维链）
    reasoning = msg.reasoning_content
```

---

## 2.8 常见误区

| 误区 | 正确理解 |
|------|----------|
| "`create_agent` 不支持复杂场景" | 它通过 Middleware 支持深度定制，复杂场景完全可用 |
| "切换模型需要重写代码" | 只需替换 model 参数，Agent 循环逻辑完全不变 |
| "工具必须是 API 调用" | 工具可以是任何 Python 函数，包括本地计算、数据库查询、文件操作 |
| "`create_agent` 只支持 OpenAI" | 支持所有实现 ChatModel 接口的模型（OpenAI、Anthropic、Google、Qwen 等） |
| "旧版代码可以直接升级到 1.0" | 1.0 是推倒重写，旧版 API（如 AgentExecutor）已被迁移到 `langchain-classic` |
| "Agent 一定会无限循环" | 内置最大循环次数限制，模型不需要调用工具时自动结束 |
# 第 3 章：LangGraph 架构设计 — 有向循环图驱动的状态机

> 核心问题：LangGraph 的 StateGraph 是什么？为什么 Agent 需要循环图而不是 DAG？Graph API 和 Functional API 如何选择？

---

## 3.1 概念定义：LangGraph 是什么

### 一句话概括

> LangGraph 是一个**低级别图编排框架**，将 Agent 工作流建模为**有向循环图**，通过**共享状态**在节点间传递和演化数据。

### 核心类比

如果 LangChain 是"高层组件库"，那 LangGraph 就是"底层操作系统"。

| 维度 | 说明 |
|------|------|
| **灵感来源** | Google Pregel（分布式图计算）、Apache Beam（数据流抽象）、NetworkX（图结构接口） |
| **核心抽象** | 有向循环图（Directed Cyclic Graph），非 DAG |
| **数据流转** | 共享 State 作为"白板"，Node 读取 → 修改 → 写回 |
| **执行模型** | 超步（Super-step）：每步内节点可并行，步间顺序执行 |
| **GitHub Stars** | 21.9k+ |

### 五大生产级能力

1. **持久化执行**：失败后从断点恢复，支持数天/周级别任务
2. **人机协同**：关键决策点人工拦截、检查、修改状态
3. **全方位记忆**：短期工作记忆 + 跨会话长期记忆
4. **LangSmith 调试**：可视化 Agent 行为和运行时指标
5. **生产级部署**：可扩展基础设施，有状态长期运行

---

## 3.2 StateGraph 三要素

### 3.2.1 State（共享状态）— 全厂共享的白板

**定义**：State 是图运行过程中的全局数据结构，所有节点共享读写。通常使用 Python 的 `TypedDict` 或 Pydantic `BaseModel` 定义。

```python
from typing import Annotated
from typing_extensions import TypedDict
from langgraph.graph.message import add_messages
from langchain_core.messages import BaseMessage

# 方式一：TypedDict（轻量级）
class AgentState(TypedDict):
    """Agent 执行期间的共享状态"""
    messages: Annotated[list[BaseMessage], add_messages]  # 消息历史（追加模式）
    search_results: list[str]       # 搜索结果
    analysis_report: str            # 分析报告
    retry_count: int                # 重试计数

# 方式二：MessagesState（推荐，内置）
from langgraph.types import MessagesState
# MessagesState 预定义了 messages 字段使用 add_messages Reducer
```

**工作原理**：
- 每个节点接收当前 State，返回需要更新的字段字典
- LangGraph 自动合并更新，不覆盖其他字段
- 通过 `Annotated[type, reducer]` 指定每个字段的合并策略

### 3.2.2 Node（节点）— 流水线上的工位

**定义**：Node 是编码 Agent 逻辑的 Python 函数。每个节点接收 State，执行业务逻辑，返回部分更新。

```python
def analyze_node(state: AgentState) -> dict:
    """分析节点：处理搜索结果，生成分析报告"""
    results = state["search_results"]
    # 调用 LLM 分析
    report = f"基于 {len(results)} 条搜索结果，关键发现如下：..."
    return {"analysis_report": report}

def tool_node(state: AgentState) -> dict:
    """工具节点：执行模型请求的工具调用"""
    last_message = state["messages"][-1]
    # 调用实际工具
    tool_result = my_tool.invoke(last_message.tool_calls[0])
    return {"messages": [tool_result]}
```

**节点签名规则**：

```python
# 基本签名
def my_node(state: State) -> dict:
    return {"key": "value"}  # 返回需要更新的字段

# 完整签名（包含 config 和 runtime）
def my_node(state: State, config: RunnableConfig, *, runtime: RuntimeContext) -> dict:
    return {"key": "value"}
```

**返回类型**：

| 返回类型 | 说明 |
|----------|------|
| `dict` | 返回状态的部分更新，LangGraph 自动合并 |
| `Command` | 同时更新状态和控制流（高级用法） |

### 3.2.3 Edge（边）— 交通指挥员

**定义**：Edge 决定节点的执行顺序和路由逻辑。

```python
from langgraph.graph import StateGraph, START, END

# ========== 普通边：无条件线性流转 ==========
graph.add_edge("node_a", "node_b")  # A 执行完必定进入 B

# ========== 条件边：基于状态动态路由 ==========
def route_by_intent(state: AgentState) -> str:
    """根据消息内容决定下一步"""
    last_msg = state["messages"][-1].content.lower()
    if "天气" in last_msg:
        return "weather"
    elif "搜索" in last_msg:
        return "search"
    else:
        return "chat"

graph.add_conditional_edges(
    "router_node",          # 从哪个节点出发
    route_by_intent,         # 路由函数（返回字符串）
    {                        # 路由映射
        "weather": "weather_node",
        "search": "search_node",
        "chat": END,
    }
)

# ========== 入口和出口 ==========
graph.set_entry_point("router_node")  # 图的起点
graph.add_edge("weather_node", END)    # 图的终点
graph.add_edge("search_node", END)
```

---

## 3.3 Reducer 机制：追加 vs 覆盖

### 概念定义

Reducer 是 LangGraph 中**最核心但最容易误解**的机制。它定义了当节点返回某个字段的更新时，新值如何与旧值合并。

```mermaid
graph LR
    subgraph "Reducer 工作流程"
        S1["旧 State<br/>messages: [A, B]"]
        N["节点返回<br/>messages: [C]"]
        R["Reducer 处理<br/>add_messages"]
        S2["新 State<br/>messages: [A, B, C]"]
    end

    S1 --> R
    N --> R
    R --> S2
```

### 常见 Reducer 对比

| Reducer | 来源 | 行为 | 适用场景 |
|---------|------|------|----------|
| **默认行为** | 内置 | **覆盖**：新值直接替换旧值 | 单一值字段（如 status、report） |
| **`add_messages`** | `langgraph.graph.message` | **追加**：新消息追加到历史列表末尾 | 消息历史、对话记录 |
| **`operator.add`** | Python 标准库 | **相加**：`old + new` | 数值累加、列表拼接 |
| **自定义 Reducer** | 用户定义 | 任意合并逻辑 | 特殊业务逻辑 |

### 代码示例

```python
from typing import Annotated
from typing_extensions import TypedDict
from operator import add

class TaskState(TypedDict):
    # 覆盖模式：新值直接替换旧值
    current_status: str

    # 追加模式：消息追加到历史
    messages: Annotated[list, add_messages]

    # 累加模式：数值累加
    total_tokens: Annotated[int, add]

    # 拼接模式：列表拼接
    visited_urls: Annotated[list[str], add]

# 演示
state: TaskState = {
    "current_status": "开始",
    "messages": [],
    "total_tokens": 0,
    "visited_urls": [],
}

# 节点 1 返回
update_1 = {
    "current_status": "搜索中",       # 覆盖："开始" → "搜索中"
    "messages": [msg1],               # 追加：[] → [msg1]
    "total_tokens": 100,              # 累加：0 + 100 = 100
    "visited_urls": ["url1"],         # 拼接：[] + ["url1"]
}

# 节点 2 返回
update_2 = {
    "current_status": "分析中",       # 覆盖："搜索中" → "分析中"
    "messages": [msg2],               # 追加：[msg1] → [msg1, msg2]
    "total_tokens": 50,               # 累加：100 + 50 = 150
    "visited_urls": ["url2"],         # 拼接：["url1"] + ["url2"]
}
```

### 常见误区

- **误区**："节点返回的 dict 会覆盖整个 State" → 实际上只会更新返回的字段，其他字段不受影响
- **误区**："add_messages 只是简单 append" → 它还处理 `RemoveMessage`（消息删除）、消息 ID 去重等
- **误区**："operator.add 是安全的累加器" → 多个节点在同一超步返回同一字段时，可能导致重复数据

---

## 3.4 Pregel 执行模型

### 概念定义

LangGraph 的运行时引擎受 **Google Pregel** 图计算模型启发，采用**批量同步并行（Bulk Synchronous Parallel）**模型，将图执行划分为离散的**超步（Super-step）**。

### 工作原理

```mermaid
graph TB
    subgraph "超步 1"
        S1["输入到达 START"]
        N1["Node A 激活"]
    end

    subgraph "超步 2"
        N2["Node B 激活"]
        N3["Node C 激活<br/>（与 B 并行）"]
    end

    subgraph "超步 3"
        N4["Node D 激活"]
    end

    subgraph "超步 N"
        E["所有节点非活跃<br/>图执行终止"]
    end

    S1 --> N1 --> N2
    N1 --> N3
    N2 --> N4
    N3 --> N4
    N4 --> E

    style S1 fill:#45b7d1,color:#fff
    style N1 fill:#4ecdc4,color:#fff
    style N2 fill:#f39c12,color:#fff
    style N3 fill:#f39c12,color:#fff
    style N4 fill:#ff6b6b,color:#fff
    style E fill:#95a5a6,color:#fff
```

### 每个超步的三个阶段

| 阶段 | 说明 |
|------|------|
| **① 规划（Plan）** | 确定本轮要执行的节点。规则：订阅了上一轮更新过的通道的节点 |
| **② 执行（Execution）** | 并行执行所有选中节点。此阶段中，通道的更新对其他节点不可见（隔离性） |
| **③ 更新（Update）** | 用节点写入的值更新通道。更新结果在下一超步才对其他节点可见 |

### 终止条件

图执行在以下条件满足时终止：
1. 所有节点都处于**非活跃状态**
2. 没有消息在通道中传输

---

## 3.5 有向循环图 vs DAG：为什么 Agent 需要循环

### 概念对比

```mermaid
graph LR
    subgraph "DAG（有向无环图）"
        A1["输入"] --> A2["处理 A"] --> A3["处理 B"] --> A4["输出"]
    end

    subgraph "有向循环图（LangGraph）"
        B1["输入"] --> B2["Agent 思考"]
        B2 --"需要工具"--> B3["执行工具"]
        B3 --> B2
        B2 --"不需要工具"--> B4["输出"]
    end

    style A1 fill:#e8e8e8,stroke:#999
    style A2 fill:#e8e8e8,stroke:#999
    style A3 fill:#e8e8e8,stroke:#999
    style A4 fill:#e8e8e8,stroke:#999

    style B1 fill:#ff6b6b,color:#fff
    style B2 fill:#4ecdc4,color:#fff
    style B3 fill:#f39c12,color:#fff
    style B4 fill:#ff6b6b,color:#fff
```

| 维度 | DAG | 有向循环图 |
|------|-----|-----------|
| **执行路径** | 固定、单向、不回头 | 可循环、可分支、可回退 |
| **适用场景** | 数据处理流水线、ETL | Agent 思考-行动-观察循环 |
| **重试能力** | 需外部重试机制 | 图内原生支持循环回退 |
| **动态决策** | 仅条件分支，无法循环 | 条件路由 + 循环，完整动态流 |
| **代表框架** | Apache Airflow、Prefect | LangGraph、Pregel |

### 为什么 Agent 必须用循环图

Agent 的核心模式是 **ReAct 循环**：

```
思考 → 行动（调用工具）→ 观察（工具结果）→ 再思考 → ...
```

这个循环的终止条件是**模型判断不再需要工具**——这个判断是动态的，无法在编译时确定循环次数。DAG 无法表达这种"不确定迭代次数的循环"。

---

## 3.6 两种 API：Graph API vs Functional API

### 3.6.1 Graph API（经典显式）

**特点**：显式定义 `StateGraph`，手动 `add_node`、`add_edge`。

**适用场景**：精细控制路由、需要可视化、复杂多 Agent 编排。

```python
from langgraph.graph import StateGraph, START, END
from langchain_core.messages import HumanMessage
from langgraph.types import MessagesState

# 第 1 步：定义节点函数
def call_model(state: MessagesState) -> dict:
    """调用 LLM 获取响应"""
    messages = state["messages"]
    # response = llm.invoke(messages)
    return {"messages": [{"role": "assistant", "content": "你好！"}]}

def call_tool(state: MessagesState) -> dict:
    """执行工具调用"""
    # 解析最后一条消息中的工具调用
    # result = tool.invoke(...)
    return {"messages": [{"role": "tool", "content": "工具结果"}]}

# 第 2 步：构建图
graph = StateGraph(MessagesState)

# 第 3 步：添加节点
graph.add_node("model", call_model)
graph.add_node("tool", call_tool)

# 第 4 步：添加边
graph.add_edge(START, "model")

def should_use_tools(state: MessagesState) -> str:
    """条件路由函数"""
    last_msg = state["messages"][-1]
    if last_msg.get("tool_calls"):
        return "use_tool"
    return "end"

graph.add_conditional_edges(
    "model",
    should_use_tools,
    {"use_tool": "tool", "end": END},
)

graph.add_edge("tool", "model")  # 工具执行后回到模型

# 第 5 步：编译并运行
app = graph.compile()

result = app.invoke({
    "messages": [HumanMessage(content="查一下深圳的天气")]
})
```

### 3.6.2 Functional API（声明式）

**特点**：使用 Python 装饰器 `@entrypoint`、`@node` 声明式定义，代码更简洁。

**适用场景**：简单工作流、偏好 Pythonic 风格、快速原型。

```python
from langgraph.func import entrypoint
from langgraph.types import Command
from langchain_core.messages import HumanMessage

@entrypoint
def agent_workflow(messages: list) -> dict:
    """声明式定义 Agent 工作流"""
    # 第 1 步：调用模型
    response = call_model(messages)

    # 第 2 步：判断是否需要工具
    if response.get("tool_calls"):
        # 第 3 步：执行工具
        tool_result = call_tool(response)
        # 第 4 步：循环回模型（Command 控制流）
        return Command(goto=agent_workflow, update={"messages": [tool_result]})

    # 第 5 步：返回最终响应
    return {"messages": [response]}

# 调用
result = agent_workflow.invoke([HumanMessage(content="查深圳天气")])
```

### API 对比总结

| 维度 | Graph API | Functional API |
|------|-----------|----------------|
| **风格** | 显式声明，先定义后编译 | Python 函数装饰器，声明式 |
| **学习曲线** | 较陡，但最体现"图"本质 | 较低，Python 开发者熟悉 |
| **控制力** | 最强，细粒度控制每个节点和边 | 中等，隐式处理部分细节 |
| **可视化** | 原生支持图可视化 | 需要额外转换 |
| **适用** | 复杂工作流、多 Agent、生产环境 | 简单流程、快速原型 |

---

## 3.7 完整实战：构建研究助手工作流

```python
"""
研究助手工作流：搜索 → 分析 → 生成报告 → 条件回退
"""
from typing import Annotated
from typing_extensions import TypedDict
from langgraph.graph import StateGraph, START, END
from langchain_core.messages import HumanMessage, AIMessage
from langchain_openai import ChatOpenAI

# ========== 第 1 步：定义状态 ==========

class ResearchState(TypedDict):
    """研究工作流状态"""
    query: str                  # 用户查询
    search_results: list[str]   # 搜索结果
    analysis: str              # 分析结果
    report: str                # 最终报告
    retry_count: int           # 重试次数
    max_retries: int           # 最大重试次数

# ========== 第 2 步：定义节点 ==========

def search_node(state: ResearchState) -> dict:
    """搜索节点：根据查询搜索信息"""
    query = state["query"]
    # 实际项目中调用搜索 API
    results = [f"搜索结果 1 关于 '{query}'", f"搜索结果 2 关于 '{query}'"]
    return {"search_results": results}

def analyze_node(state: ResearchState) -> dict:
    """分析节点：LLM 分析搜索结果"""
    results = state["search_results"]
    # llm = ChatOpenAI(model="gpt-4o-mini")
    # prompt = f"分析以下搜索结果：{results}"
    # analysis = llm.invoke(prompt)
    analysis = f"对 {len(results)} 条结果的综合分析..."
    return {"analysis": analysis}

def report_node(state: ResearchState) -> dict:
    """报告节点：生成最终报告"""
    analysis = state["analysis"]
    report = f"## 研究报告\n\n{analysis}"
    return {"report": report}

def quality_check(state: ResearchState) -> dict:
    """质量检查节点：判断是否需要重新搜索"""
    # 实际项目中用 LLM 判断报告质量
    needs_retry = len(state["search_results"]) < 2
    return {"retry_count": state["retry_count"] + (1 if needs_retry else 0)}

# ========== 第 3 步：构建图 ==========

workflow = StateGraph(ResearchState)

# 添加节点
workflow.add_node("search", search_node)
workflow.add_node("analyze", analyze_node)
workflow.add_node("report", report_node)
workflow.add_node("quality_check", quality_check)

# 设置入口点
workflow.set_entry_point("search")

# 添加边
workflow.add_edge("search", "analyze")
workflow.add_edge("analyze", "report")
workflow.add_edge("report", "quality_check")

# 条件边：质量检查决定下一步
def route_after_check(state: ResearchState) -> str:
    if state["retry_count"] < state.get("max_retries", 3) and \
       len(state["search_results"]) < 2:
        return "retry"
    return "done"

workflow.add_conditional_edges(
    "quality_check",
    route_after_check,
    {
        "retry": "search",  # 循环回去重新搜索
        "done": END,
    }
)

# ========== 第 4 步：编译并运行 ==========

app = workflow.compile()

# 可视化（需要 graphviz）
# app.get_graph().draw_mermaid_png()

result = app.invoke({
    "query": "2025 年 AI Agent 框架趋势",
    "search_results": [],
    "retry_count": 0,
    "max_retries": 3,
})

print(result["report"])
```

---

## 3.8 架构总览

```mermaid
graph TB
    subgraph "LangGraph 架构全景"
        User["用户输入<br/>invoke()"] --> Entry["编译后的图<br/>Pregel 对象"]

        subgraph "State（共享状态）"
            S1["messages: [追加模式]"]
            S2["results: [覆盖模式]"]
            S3["metadata: [自定义 reducer]"]
        end

        subgraph "Nodes（执行单元）"
            N1["模型节点<br/>call_model()"]
            N2["工具节点<br/>call_tool()"]
            N3["路由节点<br/>router()"]
        end

        subgraph "Edges（路由规则）"
            E1["普通边: A → B"]
            E2["条件边: if...else..."]
        end

        Entry --> N1
        N1 --> E2
        E2 --"需要工具"--> N2
        E2 --"不需要"--> Output["返回结果"]
        N2 --> N1

        N1 -.读写.-> S1
        N2 -.读写.-> S2
        N3 -.读写.-> S3

        style User fill:#45b7d1,color:#fff
        style Entry fill:#4ecdc4,color:#fff
        style N1 fill:#ff6b6b,color:#fff
        style N2 fill:#ff6b6b,color:#fff
        style N3 fill:#ff6b6b,color:#fff
        style Output fill:#27ae60,color:#fff
        style S1 fill:#f39c12,color:#fff
        style S2 fill:#f39c12,color:#fff
        style S3 fill:#f39c12,color:#fff
    end
```

---

## 3.9 常见误区

| 误区 | 正确理解 |
|------|----------|
| "State 是可变的，节点直接修改" | State 是**不可变**概念，节点只返回部分更新，LangGraph 通过 Reducer 合并 |
| "节点返回整个 State" | 节点只返回需要**更新的字段**，未返回的字段保持不变 |
| "条件边就是 if-else" | 条件边是**函数 → 返回值 → 路由映射**的三段式，比 if-else 更灵活 |
| "循环会导致死循环" | 图执行有明确的终止条件；可以通过最大步数、状态判断来安全退出 |
| "Graph API 比 Functional API 更强大" | 两者能力等价，只是表达方式不同；Graph API 更适合复杂场景，Functional 更适合简单场景 |
| "Pregel 只支持并行" | 同一超步内的节点可并行，超步之间是顺序执行 |
| "Reducer 只能用内置的" | 完全可以自定义 Reducer 函数，只要符合 `(old, new) → merged` 签名 |
| "DAG 也能实现 Agent 循环" | DAG 无法表达"不确定迭代次数"的循环，只能靠外部重试机制，不是原生支持 |
# 第 4 章：状态与持久化

> **本章定位**：深入 LangGraph 状态管理的核心机制，从 State/Reducer 设计到生产级 Checkpointer 选型，从线程隔离到长期记忆 Store，从时间旅行调试到性能优化。掌握这些能力后，你能够构建可恢复、可追溯、可跨会话记忆的持久化 Agent 系统。

---

## 4.1 State + Reducer 机制深入

### 4.1.1 概念定义

在 LangGraph 中，**State（状态）** 是贯穿整个图执行的"共享黑板"。所有节点读取同一份状态、写入更新片段，LangGraph 框架负责将这些片段合并为新的完整状态。

**Reducer（归约器）** 定义了状态字段的合并规则。没有 Reducer 的字段默认采用"覆盖"策略——新值替换旧值；有 Reducer 的字段则按照自定义函数进行"合并"——例如追加、累加、去重。

这种设计借鉴了 Redux/Elm 的不可变状态哲学：状态不会被原地修改，而是通过纯函数从旧状态派生新状态。

### 4.1.2 工作原理

```
┌─────────────────────────────────────────────────────────┐
│                    StateGraph 执行循环                     │
│                                                         │
│  旧 State ──► Node 返回 Partial Update ──► Reducer 合并   │
│     ▲                                                    │
│     │                                                    │
│     └────────────── 新 State ◄─────────────────────────────┘
```

每个节点返回的是**部分更新**（partial update），LangGraph 对 State 中的每个 key 分别调用对应的 Reducer：

```
final_value[key] = reducer(old_state[key], partial_update[key])
```

### 4.1.3 TypedDict 状态定义

最轻量的方式，适合快速原型：

```python
from typing import TypedDict, Annotated, List
from operator import add
from langchain_core.messages import BaseMessage
from langgraph.types import add_messages


class AgentState(TypedDict):
    """Agent 执行状态"""
    # 消息历史：自动追加，智能去重
    messages: Annotated[List[BaseMessage], add_messages]
    # 数值累加
    total_cost: Annotated[float, add]
    # 列表追加
    search_results: Annotated[List[str], add]
    # 默认覆盖行为
    current_topic: str
    retry_count: int
    final_answer: str
```

### 4.1.4 Pydantic v2 状态定义

适合需要数据校验、序列化和 IDE 补全的生产代码：

```python
from pydantic import BaseModel, Field
from typing import Annotated, List
from langgraph.types import add_messages
from langchain_core.messages import BaseMessage


class AgentState(BaseModel):
    """使用 Pydantic v2 定义的状态"""
    messages: Annotated[List[BaseMessage], add_messages] = Field(default_factory=list)
    user_id: str = Field(default="anonymous")
    conversation_metadata: dict = Field(default_factory=dict)
    step_count: int = Field(default=0)
    is_approved: bool = Field(default=False)

    model_config = {"arbitrary_types_allowed": True}
```

**Pydantic vs TypedDict 对比**：

| 维度 | TypedDict | Pydantic v2 |
|------|-----------|-------------|
| 数据校验 | 无（仅类型提示） | 运行时校验 |
| 默认值 | 不支持 | 支持 |
| 序列化 | 需手动处理 | `model_dump()` / `model_validate()` |
| IDE 补全 | 基础 | 完整 |
| 性能 | 零开销 | 轻微序列化开销 |
| 适用场景 | 原型、简单图 | 生产、复杂状态 |

### 4.1.5 内置 Reducer

| Reducer | 来源 | 行为 | 典型用途 |
|---------|------|------|---------|
| `add` / `operator.add` | `operator` | `old + new` | 数值累加、列表追加 |
| `add_messages` | `langgraph.types` | 智能消息追加，支持去重和替换 | 聊天历史 |
| 无 Reducer | 默认 | `new` 覆盖 `old` | 最新值字段 |
| `operator.mul` | `operator` | `old * new` | 自定义数值运算 |

### 4.1.6 自定义 Reducer

```python
from typing import Annotated, List


def merge_results_dedup(old: List[str], new: List[str]) -> List[str]:
    """去重合并搜索结果"""
    seen = set(old)
    result = list(old)
    for item in new:
        if item not in seen:
            seen.add(item)
            result.append(item)
    return result


def take_latest(old: List[str], new: List[str], max_len: int = 10) -> List[str]:
    """只保留最新的 N 条记录"""
    merged = old + new
    return merged[-max_len:]


def sum_costs(old: float, new: float) -> float:
    """累加成本"""
    return old + new


class ResearchState(TypedDict):
    search_results: Annotated[List[str], merge_results_dedup]
    cost_tracker: Annotated[float, sum_costs]
    recent_actions: Annotated[List[str], take_latest]
```

### 4.1.7 MessagesState 快捷方式

LangGraph 提供了开箱即用的 `MessagesState`：

```python
from langgraph.graph import StateGraph, MessagesState, START


# MessagesState 内置了 messages: Annotated[List[BaseMessage], add_messages]
def call_model(state: MessagesState):
    response = model.invoke(state["messages"])
    return {"messages": [response]}


builder = StateGraph(MessagesState)
builder.add_node("call_model", call_model)
builder.add_edge(START, "call_model")
graph = builder.compile(checkpointer=checkpointer)
```

---

## 4.2 Checkpoint 机制

### 4.2.1 概念定义

**Checkpoint（检查点）** 是图在某个执行时刻的完整状态快照，包含：
- `values`：State 的当前值
- `next`：下一个要执行的节点
- `metadata`：元数据（来源节点、时间戳等）
- `parent_config`：父检查点的配置（用于追溯历史）
- `tasks`：待执行任务

**Checkpointer（检查点保存器）** 是负责存储和加载 Checkpoint 的组件。每个"超级步骤"（super-step，即一个节点执行完毕）后自动保存。

### 4.2.2 三种 Checkpointer 对比

| 维度 | InMemorySaver | SqliteSaver | PostgresSaver |
|------|---------------|-------------|---------------|
| 存储介质 | Python dict（内存） | SQLite 文件 | PostgreSQL 数据库 |
| 重启持久性 | 丢失 | 持久化 | 持久化 |
| 并发支持 | 不支持 | 有限（写锁） | 原生支持 |
| 性能 | 极快（零 I/O） | 中等 | 高（连接池） |
| 适用场景 | 开发/测试/演示 | 本地生产/单体部署 | 分布式生产/集群 |
| 安装依赖 | 内置 | `langgraph-checkpoint-sqlite` | `langgraph-checkpoint-postgres` |
| 异步支持 | 是 | 是 | 是（psycopg 3） |

### 4.2.3 InMemorySaver

```python
from langgraph.checkpoint.memory import InMemorySaver

checkpointer = InMemorySaver()
graph = builder.compile(checkpointer=checkpointer)
```

### 4.2.4 SqliteSaver

```python
from langgraph.checkpoint.sqlite import SqliteSaver
import sqlite3

conn = sqlite3.connect("checkpoints.db", check_same_thread=False)
checkpointer = SqliteSaver(conn)
graph = builder.compile(checkpointer=checkpointer)
```

### 4.2.5 PostgresSaver 生产级配置

```python
from langgraph.checkpoint.postgres import PostgresSaver
from psycopg_pool import ConnectionPool

# 连接池配置 —— 生产环境必需
pool = ConnectionPool(
    conninfo="postgresql://user:password@localhost:5432/langgraph_db",
    min_size=5,       # 最小连接数
    max_size=20,      # 最大连接数
    timeout=30,       # 连接超时（秒）
    check=ConnectionPool.check_connection,  # 连接健康检查
)

checkpointer = PostgresSaver(sync_connection=pool)

# 首次使用时初始化表结构
checkpointer.setup()

graph = builder.compile(checkpointer=checkpointer)
```

**数据库表结构**（自动创建）：
- `checkpoints`：存储检查点数据
- `checkpoint_writes`：存储待确认的写入
- `checkpoint_blobs`：存储大对象数据

### 4.2.6 Mermaid：Checkpoint 生命周期

```mermaid
sequenceDiagram
    participant App as 应用代码
    participant Graph as StateGraph
    participant Node as 节点执行
    participant CP as Checkpointer
    participant DB as 存储后端

    App->>Graph: invoke(inputs, config)
    Graph->>CP: load_latest(thread_id)
    CP->>DB: 查询最近检查点
    DB-->>CP: 返回 State 快照
    CP-->>Graph: 恢复 State

    loop 每个节点
        Graph->>Node: execute(state)
        Node-->>Graph: return partial_update
        Graph->>Graph: Reducer 合并 State
        Graph->>CP: put(new_state, config)
        CP->>DB: 写入检查点
    end

    Graph-->>App: 返回最终 State
```

---

## 4.3 Thread 隔离

### 4.3.1 概念定义

**Thread（线程）** 是由 `thread_id` 唯一标识的逻辑会话单元。每个 Thread 拥有独立的 Checkpoint 序列，互不干扰。

可以把 thread_id 理解为"平行宇宙的坐标"——同一个 Agent 图可以同时服务成千上万个用户，每个人都有自己的独立状态轨迹。

### 4.3.2 使用方式

```python
config = {"configurable": {"thread_id": "user_123_session_1"}}

# 第一次调用
result1 = graph.invoke({"messages": [{"role": "user", "content": "你好"}]}, config)

# 第二次调用（自动从上一个检查点恢复）
result2 = graph.invoke({"messages": [{"role": "user", "content": "还记得我刚才说了什么吗？"}]}, config)
```

### 4.3.3 并发会话隔离

```python
from concurrent.futures import ThreadPoolExecutor


def run_session(user_id: str, message: str):
    config = {"configurable": {"thread_id": user_id}}
    return graph.invoke({"messages": [{"role": "user", "content": message}]}, config)


# 并发执行，各自的状态完全隔离
with ThreadPoolExecutor(max_workers=10) as executor:
    futures = [
        executor.submit(run_session, f"user_{i}", f"hello from user {i}")
        for i in range(10)
    ]
    results = [f.result() for f in futures]
```

### 4.3.4 Thread 命名空间最佳实践

| 策略 | thread_id 格式 | 适用场景 |
|------|----------------|---------|
| 用户级 | `user_{user_id}` | 每个用户一个长期会话 |
| 会话级 | `user_{user_id}_session_{session_id}` | 多会话隔离 |
| 请求级 | `req_{uuid}` | 无状态、每次独立 |
| 工作流级 | `workflow_{workflow_id}_step_{step}` | 多步骤审批流 |

---

## 4.4 Store 长期记忆

### 4.4.1 概念定义

**Store（存储）** 是 LangGraph 提供的跨会话长期记忆机制。与 Checkpointer 的"线程内短期记忆"不同，Store 通过 Namespace 组织数据，支持跨 Thread、跨 Session 共享信息。

| 维度 | Checkpointer（短期记忆） | Store（长期记忆） |
|------|-------------------------|-------------------|
| 作用域 | 单个 thread_id 内 | 跨所有 thread |
| 数据类型 | 完整 State 快照 | 提炼后的关键信息 |
| 读写方式 | 自动（框架管理） | 手动（代码显式调用） |
| 典型内容 | 消息历史、中间结果 | 用户画像、偏好、规则 |

### 4.4.2 基本操作

```python
from langgraph.store.memory import InMemoryStore

store = InMemoryStore()

# Namespace 格式：(user_id, context_type)
namespace = ("user_123", "profile")

# 写入
store.put(
    namespace,
    key="preferences",
    value={
        "language": "zh-CN",
        "tone": "formal",
        "topics_of_interest": ["AI", "programming"]
    }
)

# 读取
item = store.get(namespace, "preferences")
print(item.value)  # {"language": "zh-CN", ...}

# 搜索（支持过滤和向量相似度）
items = store.search(
    namespace,
    filter={"language": "zh-CN"},
    query="编程兴趣"  # 需要配置 embedding
)
```

### 4.4.3 带 Embedding 的向量搜索

```python
from langgraph.store.memory import InMemoryStore
from langchain.embeddings import init_embeddings

store = InMemoryStore(
    index={
        "embed": init_embeddings("openai:text-embedding-3-small"),
        "dims": 1536,
    }
)

# 存入用户画像
store.put(
    ("user_123", "memories"),
    key="fact_1",
    value={"fact": "User lives in Shanghai", "confidence": 0.9}
)

# 向量相似度搜索
items = store.search(
    ("user_123", "memories"),
    query="用户住在哪里",
    limit=5
)
```

### 4.4.4 用户画像组合策略

```python
def build_user_context(user_id: str, state: dict) -> dict:
    """从 Store 加载用户画像，注入到当前上下文"""
    # 加载基础画像
    profile = store.get((user_id, "profile"), "basic")
    # 加载历史偏好
    preferences = store.get((user_id, "preferences"), "llm_settings")
    # 加载近期记忆
    recent_memories = store.search(
        (user_id, "memories"),
        limit=10,
        query=state.get("current_query", "")
    )

    return {
        "profile": profile.value if profile else {},
        "preferences": preferences.value if preferences else {},
        "recent_memories": [item.value for item in recent_memories]
    }
```

---

## 4.5 时间旅行：get_state / get_history / update_state

### 4.5.1 概念定义

**时间旅行（Time Travel）** 是 Checkpointer 机制带来的调试能力——你可以查看任意历史检查点的状态，从任意时间点回放执行，甚至修改历史状态后分叉运行。

### 4.5.2 获取当前状态

```python
config = {"configurable": {"thread_id": "1"}}

# 获取最新状态
snapshot = graph.get_state(config)
print("当前值:", snapshot.values)
print("下一个节点:", snapshot.next)
print("检查点 ID:", snapshot.config["configurable"]["checkpoint_id"])
```

### 4.5.3 获取历史状态

```python
# 获取所有历史检查点（最新在前）
history = list(graph.get_state_history(config))

for snapshot in history:
    print(f"Checkpoint: {snapshot.config['configurable']['checkpoint_id']}")
    print(f"  Next: {snapshot.next}")
    print(f"  Values keys: {snapshot.values.keys()}")
    print("---")
```

### 4.5.4 从历史检查点回放

```python
# 选择某个历史检查点
target_checkpoint = history[2].config

# 从该检查点重新执行
result = graph.invoke(None, config=target_checkpoint)
```

### 4.5.5 修改状态后分叉

```python
# 获取当前状态
snapshot = graph.get_state(config)

# 修改状态（例如人工纠正 AI 的输出）
graph.update_state(
    config,
    {"messages": [{"role": "assistant", "content": "修正后的回答"}]},
    as_node="human_review"  # 指定修改来源节点，影响后续执行路径
)

# 继续执行（从修改后的状态分叉）
result = graph.invoke(None, config)
```

### 4.5.6 Mermaid：时间旅行流程图

```mermaid
graph TD
    A[开始执行] --> B[Node A 执行]
    B --> C[Checkpoint 1 保存]
    C --> D[Node B 执行]
    D --> E[Checkpoint 2 保存]
    E --> F[Node C 执行]
    F --> G[Checkpoint 3 保存]
    G --> H{调试：查看历史}

    H -->|get_state_history| I[列出所有 Checkpoint]
    I --> J[选择 Checkpoint 2]
    J --> K{操作选择}
    K -->|回放| L[从 CP2 重新执行]
    K -->|修改状态| M[update_state 修改]
    M --> N[从修改点分叉执行]
    L --> O[新的执行轨迹]
    N --> O
```

---

## 4.6 记忆组合策略 + 性能优化

### 4.6.1 trim_messages 消息修剪

对话历史无限增长会导致 Token 溢出和响应变慢。LangGraph 提供 `trim_messages` 控制消息长度：

```python
from langchain_core.messages import trim_messages
from langchain_core.messages import HumanMessage, AIMessage

messages = [
    HumanMessage(content="你好"),
    AIMessage(content="你好！有什么可以帮你的？"),
    HumanMessage(content="我想了解 LangGraph"),
    AIMessage(content="LangGraph 是一个..."),
    # ... 更多消息
]

# 策略 1：保留最近 N 条消息
trimmed = trim_messages(
    messages,
    strategy="last",
    max_tokens=2000,
    token_counter=len,  # 或使用具体的 tokenizer
    include_system=True,  # 始终保留 system 消息
    allow_partial=False
)

# 策略 2：在节点中自动修剪
def chatbot(state):
    trimmed = trim_messages(
        state["messages"],
        strategy="last",
        max_tokens=4000,
        include_system=True
    )
    response = model.invoke(trimmed)
    return {"messages": [response]}
```

### 4.6.2 记忆组合策略

```python
"""
典型生产环境的记忆架构：

Checkpointer（短期）+ Store（长期）+ trim_messages（优化）

┌─────────────────────────────────────────────┐
│                  Agent 执行                    │
│                                              │
│  trim_messages ──► 控制消息长度               │
│       │                                      │
│  Checkpointer ──► 当前会话上下文              │
│       │                                      │
│  Store ──► 用户画像 + 跨会话记忆              │
│                                              │
│  最终 Prompt = 系统提示 + 修剪后的历史         │
│              + 用户画像 + 相关记忆             │
└─────────────────────────────────────────────┘
"""
```

### 4.6.3 完整组合示例

```python
from langgraph.checkpoint.postgres import PostgresSaver
from langgraph.store.memory import InMemoryStore
from langgraph.graph import StateGraph, MessagesState, START
from langchain_core.messages import trim_messages


# 1. 初始化持久化层
checkpointer = PostgresSaver(sync_connection=pool)
checkpointer.setup()
store = InMemoryStore()

# 2. 定义节点
def agent_node(state: MessagesState):
    # 从 Store 加载用户画像
    user_id = state.get("user_id", "anonymous")
    profile = store.get((user_id, "profile"), "basic")

    # 修剪消息历史
    trimmed_messages = trim_messages(
        state["messages"],
        strategy="last",
        max_tokens=3000,
        include_system=True
    )

    # 组装 Prompt
    system_msg = {"role": "system", "content": f"用户画像：{profile}"}
    full_messages = [system_msg] + trimmed_messages

    response = model.invoke(full_messages)
    return {"messages": [response]}


# 3. 编译图
builder = StateGraph(MessagesState)
builder.add_node("agent", agent_node)
builder.add_edge(START, "agent")
graph = builder.compile(checkpointer=checkpointer, store=store)
```

---

## 4.7 常见误区

### 误区 1：以为 State 会自动追加消息

**错误**：每次 invoke 传入完整的 messages 列表，覆盖了历史。

```python
# 错误用法
graph.invoke({"messages": [new_message]}, config)  # 覆盖！

# 正确用法：只传入新消息，让 add_messages reducer 自动追加
graph.invoke({"messages": [new_message]}, config)  # 前提：messages 字段使用了 add_messages
```

### 误区 2：InMemorySaver 用于生产

InMemorySaver 在进程重启后丢失所有数据。生产环境必须使用 SqliteSaver 或 PostgresSaver。

### 误区 3：忘记调用 checkpointer.setup()

PostgresSaver 首次使用时必须调用 `setup()` 创建数据库表，否则会报表不存在错误。

### 误区 4：Thread 隔离失效

```python
# 错误：每次使用不同的 thread_id，相当于每次都是新会话
config = {"configurable": {"thread_id": str(uuid4())}}  # 每次都不同！

# 正确：复用同一 thread_id 实现会话连续性
config = {"configurable": {"thread_id": f"user_{user_id}"}}
```

### 误区 5：Store 和 Checkpointer 混淆

Store 不是 Checkpointer 的替代品。Checkpointer 自动保存状态快照，Store 需要手动读写长期记忆。两者互补而非互斥。

### 误区 6：消息历史无限膨胀

不使用 `trim_messages` 或摘要剪枝时，长对话会导致：
- Token 费用爆炸
- 响应延迟增加
- 模型注意力分散

**解决方案**：在调用 LLM 前始终修剪消息，或使用基于摘要的剪枝策略。

### 误区 7：Reducer 签名不正确

自定义 Reducer 必须是纯函数，签名严格为 `(old_value, new_value) -> merged_value`，不能有副作用。
# 第 5 章：人机协同与调试

> **本章定位**：深入 LangGraph 的人机协同（Human-in-the-Loop）机制和调试工具链。掌握 Interrupt 中断、时间旅行调试、LangSmith TRACE 可视化后，你能够构建可控、可审计、可调试的生产级 Agent。

---

## 5.1 Interrupt 机制深入

### 5.1.1 概念定义

**Interrupt（中断）** 是 LangGraph 的人机协同核心机制。它允许在图执行的关键节点暂停流程，等待外部输入（人工审批、用户确认、数据注入）后再决定是否继续。

LangGraph 提供两种中断模式：

| 模式 | 方法 | 暂停时机 | 适用场景 |
|------|------|---------|---------|
| **静态中断** | `interrupt_before=["node_name"]` | 在指定节点**之前**暂停 | 审批流、付费操作前 |
| **静态中断** | `interrupt_after=["node_name"]` | 在指定节点**之后**暂停 | 结果审查、输出审核 |
| **动态中断** | `interrupt("prompt")` | 在节点**内部**任意位置暂停 | 条件触发、灵活决策 |

### 5.1.2 工作原理

```
┌──────────────────────────────────────────────────────┐
│                 Interrupt 执行流程                      │
│                                                      │
│  START ──► Node A ──► [checkpoint] ──► interrupt?    │
│                                              │        │
│                                          YES │        │
│                                              ▼        │
│                                      保存状态并暂停    │
│                                      等待外部输入     │
│                                              │        │
│                                          恢复 │        │
│                                              ▼        │
│                                    Node B ──► END     │
└──────────────────────────────────────────────────────┘
```

中断触发时：
1. Checkpointer 保存当前完整状态
2. 图执行暂停，进入等待状态
3. 外部系统（人类/自动化脚本）检查状态并决定是否继续
4. 调用 `invoke(None, config)` 或 `Command(resume=...)` 恢复执行

### 5.1.3 interrupt_before 示例

```python
from langgraph.graph import StateGraph, START
from langgraph.checkpoint.memory import InMemorySaver


class ApprovalState(TypedDict):
    email_content: str
    recipient: str
    approved: bool


def draft_email(state: ApprovalState):
    """AI 起草邮件"""
    return {
        "email_content": "尊敬的客户，您的订单已确认...",
        "recipient": state.get("recipient", "customer@example.com")
    }


def send_email(state: ApprovalState):
    """发送邮件（敏感操作）"""
    print(f"发送邮件到 {state['recipient']}: {state['email_content']}")
    return {"approved": True}


# 构建图
builder = StateGraph(ApprovalState)
builder.add_node("draft", draft_email)
builder.add_node("send", send_email)
builder.add_edge(START, "draft")
builder.add_edge("draft", "send")

# 编译：在 send 节点之前中断
checkpointer = InMemorySaver()
graph = builder.compile(
    checkpointer=checkpointer,
    interrupt_before=["send"]  # 在发送邮件之前暂停
)
```

### 5.1.4 interrupt_after 示例

```python
# 编译：在 draft 节点之后中断（审查草稿）
graph = builder.compile(
    checkpointer=checkpointer,
    interrupt_after=["draft"]  # 草稿生成后暂停，等待审查
)
```

### 5.1.5 动态中断（Dynamic Interrupt）

LangGraph 最新版引入了 `interrupt()` 函数，可在节点内部任意位置触发：

```python
from langgraph.types import interrupt, Command


def approval_node(state: ApprovalState):
    """动态中断：根据条件决定是否请求审批"""
    # 检查邮件内容是否包含敏感关键词
    sensitive_words = ["退款", "赔偿", "法律"]
    needs_review = any(w in state["email_content"] for w in sensitive_words)

    if needs_review:
        # 暂停并等待人工审批
        approved = interrupt("检测到敏感内容，是否批准发送？")
        if not approved:
            return {"approved": False}

    return {"approved": True}
```

### 5.1.6 中断恢复流程

```python
import uuid

thread_id = str(uuid.uuid4())
config = {"configurable": {"thread_id": thread_id}}

# 第 1 步：启动执行（会在 send 节点前暂停）
result = graph.invoke(
    {"recipient": "customer@example.com"},
    config
)
print("暂停时的状态:", result)

# 第 2 步：检查当前状态
snapshot = graph.get_state(config)
print("待执行节点:", snapshot.next)  # 输出: ('send',)
print("当前状态:", snapshot.values)

# 第 3 步：人工审查并修改状态（可选）
graph.update_state(config, {"email_content": "修改后的内容..."})

# 第 4 步：恢复执行（inputs=None 表示从中断点继续）
result = graph.invoke(None, config)
print("最终结果:", result)
```

### 5.1.7 Mermaid：Interrupt 状态流转

```mermaid
stateDiagram-v2
    [*] --> 执行节点A
    执行节点A --> 保存Checkpoint: 节点执行完毕
    保存Checkpoint --> 触发Interrupt: 配置了中断点

    state 等待人工介入 {
        [*] --> 暂停执行
        暂停执行 --> 人工审查: 调用 get_state()
        人工审查 --> 修改状态: update_state()（可选）
        人工审查 --> 批准恢复: invoke(None, config)
    }

    触发Interrupt --> 暂停执行
    批准恢复 --> 执行节点B: 从中断点继续
    执行节点B --> [*]

    暂停执行 -.超时/取消.-> 取消执行
```

---

## 5.2 Checkpoint + Interrupt 联用

### 5.2.1 工作流程

```
保存 → 暂停 → 人工修改 → 恢复

1. 图执行到中断点
2. Checkpointer 自动保存当前状态快照
3. 图暂停，等待外部输入
4. 人工通过 get_state() 查看当前状态
5. 人工通过 update_state() 修改状态（如纠正 AI 输出）
6. 人工通过 invoke(None, config) 恢复执行
7. Checkpointer 从保存的检查点加载状态继续执行
```

### 5.2.2 完整示例：带审批的邮件发送 Agent

```python
from typing import TypedDict
from langgraph.graph import StateGraph, START
from langgraph.checkpoint.memory import InMemorySaver
from langgraph.types import Command


class EmailState(TypedDict):
    recipient: str
    subject: str
    body: str
    review_notes: str
    approved: bool
    sent: bool


def generate_email(state: EmailState):
    """AI 生成邮件草稿"""
    # 实际项目中这里会调用 LLM
    return {
        "subject": f"关于 {state.get('topic', '重要事项')} 的通知",
        "body": f"尊敬的 {state['recipient']}:\n\n此为自动生成的邮件内容..."
    }


def review_email(state: EmailState):
    """人工审查节点（实际中由 interrupt 实现）"""
    # 这个节点本身不做审查，
    # 审查由 interrupt_before 机制在节点前暂停后人工完成
    pass


def send_email(state: EmailState):
    """发送邮件"""
    print(f"✅ 邮件已发送到 {state['recipient']}")
    print(f"   主题: {state['subject']}")
    print(f"   内容: {state['body'][:50]}...")
    return {"sent": True}


# 构建图
builder = StateGraph(EmailState)
builder.add_node("generate", generate_email)
builder.add_node("send", send_email)
builder.add_edge(START, "generate")
builder.add_edge("generate", "send")

# 编译：在发送前中断
checkpointer = InMemorySaver()
graph = builder.compile(
    checkpointer=checkpointer,
    interrupt_before=["send"]
)

# === 执行流程 ===

config = {"configurable": {"thread_id": "email_approval_001"}}

# 步骤 1：生成邮件草稿（会在发送前暂停）
result = graph.invoke(
    {"recipient": "boss@company.com", "topic": "项目进度汇报"},
    config
)

# 步骤 2：查看草稿
snapshot = graph.get_state(config)
print(f"邮件草稿:\n  主题: {snapshot.values['subject']}\n  内容: {snapshot.values['body']}")

# 步骤 3：人工修改（纠正 AI 生成的内容）
graph.update_state(
    config,
    {"body": "尊敬的领导：\n\n项目 A 已完成 80%，预计下周交付。"},
    as_node="human_review"
)

# 步骤 4：批准并恢复执行
result = graph.invoke(None, config)
print(f"最终状态: {result}")
```

### 5.2.3 使用 Command 恢复并传递数据

```python
from langgraph.types import Command, interrupt


def approval_node(state: EmailState):
    """动态中断 + Command 恢复"""
    # 暂停请求审批
    decision = interrupt({
        "type": "approval",
        "message": "请审核邮件内容",
        "subject": state["subject"],
        "body_preview": state["body"][:100]
    })

    # decision 的值由 Command(resume=...) 传入
    if decision == "approve":
        return {"approved": True}
    elif decision == "reject":
        return {"approved": False, "review_notes": "内容需要修改"}
    elif decision == "modify":
        return {"approved": False, "review_notes": "已修改内容"}


# 恢复时传递人工决策
graph.invoke(
    Command(resume="approve"),  # 告诉 interrupt 返回值是 "approve"
    config
)
```

---

## 5.3 Time Travel 调试

### 5.3.1 概念定义

**Time Travel 调试** 利用 Checkpointer 保存的历史快照，实现任意时间点的状态回放、分支探索和错误复现。

### 5.3.2 查看执行历史

```python
config = {"configurable": {"thread_id": "debug_session_1"}}

# 执行图（可能经过多个节点）
graph.invoke({"messages": [{"role": "user", "content": "复杂的多步任务"}]}, config)

# 获取所有历史检查点
history = list(graph.get_state_history(config))
print(f"共 {len(history)} 个检查点")

for i, snapshot in enumerate(history):
    print(f"\n--- 检查点 {i} ---")
    print(f"  ID: {snapshot.config['configurable']['checkpoint_id']}")
    print(f"  下一个节点: {snapshot.next}")
    print(f"  任务: {snapshot.tasks}")
```

### 5.3.3 从任意检查点回放

```python
# 选择第 2 个检查点（从最新开始数）
target = history[2].config

# 回放执行
print("从检查点回放:")
for step in graph.stream(None, target):
    print(f"  执行步骤: {step}")
```

### 5.3.4 分支探索

```python
# 在某个历史节点修改状态，创建分叉
branch_config = history[1].config

graph.update_state(
    branch_config,
    {"messages": [{"role": "user", "content": "分支实验：如果这样做呢？"}]},
    as_node="human_hypothesis"
)

# 从分叉点执行
branch_result = graph.invoke(None, branch_config)
```

### 5.3.5 Mermaid：调试流程图

```mermaid
graph LR
    A[运行 Agent] --> B[产生多个 Checkpoint]
    B --> C{调试}
    C -->|get_state_history| D[列出所有检查点]
    D --> E[选择目标检查点]
    E --> F{操作}
    F -->|回放| G[重新执行]
    F -->|修改状态| H[分支探索]
    F -->|查看值| I[检查中间结果]
    G --> J[对比预期 vs 实际]
    H --> J
    I --> J
```

---

## 5.4 LangSmith 集成

### 5.4.1 概念定义

**LangSmith** 是 LangChain 团队开发的 LLM 应用开发平台，提供 Trace 可视化、评估测试、Prompt 版本管理和生产监控。对于 LangGraph Agent，LangSmith 自动捕获每个节点的输入/输出、工具调用、LLM 响应，形成完整的执行轨迹可视化。

### 5.4.2 启用 Tracing

```python
import os

# 设置环境变量启用 LangSmith
os.environ["LANGSMITH_TRACING"] = "true"
os.environ["LANGSMITH_API_KEY"] = "ls__your_api_key_here"
os.environ["LANGSMITH_PROJECT"] = "my-agent-project"

# 之后所有 LangGraph 执行都会自动上报 Trace
result = graph.invoke({"messages": [{"role": "user", "content": "测试追踪"}]}, config)
```

### 5.4.3 TRACE 可视化

在 LangSmith Dashboard 中可以看到：

- **Trace Tree**：树状展示每个节点的执行顺序和嵌套关系
- **输入/输出**：每个节点的完整输入和输出数据
- **LLM Calls**：模型调用详情（token 用量、延迟、响应内容）
- **Tool Calls**：工具调用详情（参数、返回值、耗时）
- **Metadata**：自定义标签、错误信息、时间戳

### 5.4.4 Agent 行为调试

```python
from langsmith import traceable, Client


client = Client()

# 为 Agent 执行添加自定义元数据
config = {
    "configurable": {"thread_id": "trace_test_1"},
    "metadata": {
        "user_id": "user_42",
        "test_case": "tool_selection",
    },
    "tags": ["debug", "v2"]
}

result = graph.invoke(
    {"messages": [{"role": "user", "content": "帮我查一下上海明天的天气"}]},
    config
)

# 在 LangSmith 中搜索特定 Trace
traces = client.list_runs(
    project_name="my-agent-project",
    filter="eq(metadata.user_id, 'user_42')"
)
```

### 5.4.5 使用 LangSmith 评估 Agent

```python
from langsmith import Client
from langsmith.evaluation import evaluate


client = Client()

# 定义评估函数
def check_response_quality(run):
    """评估 Agent 回复质量"""
    output = run.outputs.get("messages", [])
    if not output:
        return {"score": 0, "label": "no_response"}

    last_msg = output[-1].get("content", "")
    has_content = len(last_msg) > 10
    return {
        "score": 1 if has_content else 0,
        "label": "pass" if has_content else "fail"
    }


# 运行评估
evaluate(
    "my-agent-project",  # 项目名
    evaluators=[check_response_quality],
    max_concurrency=5
)
```

---

## 5.5 常见误区

### 误区 1：中断后不使用相同的 config 恢复

```python
# 错误：启动和恢复使用了不同的 config
graph.invoke(inputs, {"configurable": {"thread_id": "1"}})
graph.invoke(None, {"configurable": {"thread_id": "2"}})  # 全新会话！

# 正确：复用同一 config
config = {"configurable": {"thread_id": "1"}}
graph.invoke(inputs, config)
graph.invoke(None, config)  # 从同一线程恢复
```

### 误区 2：以为 interrupt_before 会自动等待

`interrupt_before` 编译后，图执行到中断点会自动暂停并返回。但恢复需要**再次调用** `invoke/stream`。它不是回调机制，而是"暂停-恢复"模式。

### 误区 3：在节点内同时使用 interrupt 和 interrupt_before

动态中断 `interrupt()` 和静态中断 `interrupt_before/after` 可以同时使用，但要注意优先级——动态中断在节点内部触发时优先级更高。

### 误区 4：update_state 后不指定 as_node

```python
# 不指定 as_node：LangGraph 无法确定修改来源
graph.update_state(config, {"body": "新内容"})

# 指定 as_node：影响后续执行路径判断
graph.update_state(config, {"body": "新内容"}, as_node="human_review")
```

### 误区 5：LangSmith Tracing 未配置 API Key

设置了 `LANGSMITH_TRACING=true` 但没有配置 `LANGSMITH_API_KEY`，导致 Trace 无法上报。会看到警告日志但不会中断执行。

### 误区 6：生产环境使用 InMemorySaver + Interrupt

进程重启后 InMemorySaver 丢失所有 Checkpoint，中断后无法恢复。生产环境必须使用 PostgresSaver 或 SqliteSaver。

### 误区 7：中断后修改状态但忘记恢复

```python
graph.invoke(inputs, config)          # 触发中断
graph.update_state(config, new_state) # 修改状态
# 忘记调用 graph.invoke(None, config)  # 图永远停留在暂停状态！
```

### 误区 8：Thread 管理混乱

```python
# 错误：每次调试都用新 thread_id，无法回溯历史
config = {"configurable": {"thread_id": str(uuid4())}}

# 正确：调试时使用固定的 thread_id
config = {"configurable": {"thread_id": "debug_case_001"}}
```
# 第 6 章：生产级部署

> **本章定位**：从开发环境走向生产环境的完整部署指南。涵盖 LangGraph Platform 架构、持久化存储选型、应用结构、性能优化、监控告警。目标是让你能够交付可维护、可扩展、可观测的生产级 Agent 系统。

---

## 6.1 LangGraph Platform

### 6.1.1 概念定义

**LangGraph Platform** 是 LangGraph 的生产级运行环境，提供 Agent 工作流的托管服务器、API 网关、持久化存储和横向扩展能力。它有两种部署模式：

| 模式 | 说明 | 适用场景 |
|------|------|---------|
| **独立服务器** | 自托管的 LangGraph Server | 私有部署、数据合规要求 |
| **LangSmith 部署** | 通过 LangSmith Cloud 托管 | 快速上线、免运维 |

### 6.1.2 项目结构

```
my-agent-project/
├── src/
│   └── my_agent/
│       ├── __init__.py
│       ├── graph.py          # Agent 图定义（State + Nodes + Edges）
│       ├── tools.py          # 工具定义
│       ├── nodes.py          # 节点函数
│       └── app.py            # 自定义 HTTP 路由（可选）
├── tests/
│   └── test_graph.py
├── langgraph.json            # LangGraph Platform 配置文件
├── pyproject.toml            # Python 项目依赖
└── .env                      # 环境变量
```

### 6.1.3 langgraph.json 配置

```json
{
  "dependencies": ["."],
  "graphs": {
    "agent": "./src/my_agent/graph.py:graph",
    "email_agent": "./src/my_agent/email_graph.py:graph"
  },
  "env": ".env",
  "http": {
    "app": "./src/my_agent/app.py:app"
  }
}
```

| 字段 | 说明 |
|------|------|
| `dependencies` | 需要安装的 Python 包（支持本地路径或 PyPI 包名） |
| `graphs` | 图定义映射，key 为图名，value 为 `文件路径:变量名` |
| `env` | 环境变量文件路径 |
| `http.app` | 自定义 FastAPI 应用（用于额外的 HTTP 端点） |

### 6.1.4 本地开发

```bash
# 启动开发服务器
langgraph dev

# 服务器启动后可通过以下端点访问：
# POST http://localhost:8123/runs/stream   - 流式执行
# POST http://localhost:8123/threads       - 创建线程
# GET  http://localhost:8123/threads/{id}  - 查询线程状态
```

### 6.1.5 部署到 LangSmith Cloud

```bash
# 通过 CLI 部署
langgraph deploy --app my-agent-project

# 或通过 LangSmith Web UI 上传项目
```

### 6.1.6 Mermaid：Platform 架构

```mermaid
graph TB
    subgraph Client[客户端]
        A[Web 前端]
        B[API 调用者]
        C[CLI]
    end

    subgraph LangGraph Platform
        D[API Gateway]
        E[Graph Router]
        F[执行引擎]
    end

    subgraph Storage[存储层]
        G[(PostgreSQL)]
        H[(Redis)]
        I[S3 / Blob]
    end

    subgraph Observability[可观测性]
        J[LangSmith Tracing]
        K[Metrics Dashboard]
        L[Alert System]
    end

    A --> D
    B --> D
    C --> D
    D --> E
    E --> F
    F --> G
    F --> H
    F --> J
    J --> K
    K --> L
```

---

## 6.2 持久化存储选择

### 6.2.1 对比决策表

| 存储方案 | 适用场景 | 优点 | 缺点 |
|----------|---------|------|------|
| **PostgreSQL**（推荐） | 生产环境 | ACID、连接池、水平扩展、生态成熟 | 需要运维 |
| **Redis** | 高速缓存层 | 极低延迟、原生异步 | 内存受限、持久化开销 |
| **SQLite** | 单体/本地 | 零运维、文件级部署 | 并发写锁、无水平扩展 |
| **内存** | 开发/测试 | 零配置 | 重启丢失、无并发 |

### 6.2.2 PostgreSQL 生产配置（推荐）

```python
from langgraph.checkpoint.postgres import PostgresSaver
from psycopg_pool import ConnectionPool
import os


def create_checkpointer() -> PostgresSaver:
    """创建生产级 PostgreSQL Checkpointer"""
    # 从环境变量读取连接信息
    conninfo = os.environ.get(
        "DATABASE_URL",
        "postgresql://user:password@localhost:5432/langgraph"
    )

    # 连接池配置
    pool = ConnectionPool(
        conninfo=conninfo,
        min_size=5,
        max_size=20,
        timeout=30,
        kwargs={
            "application_name": "langgraph-agent",
            "connect_timeout": 10,
        },
    )

    checkpointer = PostgresSaver(sync_connection=pool)
    checkpointer.setup()
    return checkpointer
```

### 6.2.3 Redis 作为缓存层

```python
# Redis 通常不直接作为 Checkpointer 后端，
# 而是作为 LLM 响应缓存、会话缓存的辅助层

import redis
from langchain_community.cache import RedisCache

redis_client = redis.Redis(
    host=os.environ.get("REDIS_HOST", "localhost"),
    port=int(os.environ.get("REDIS_PORT", 6379)),
    db=0,
    decode_responses=True,
)

# 配置 LangChain 缓存
from langchain.globals import set_llm_cache
set_llm_cache(RedisCache(redis_client))
```

---

## 6.3 应用结构与配置管理

### 6.3.1 分层架构

```
src/
├── graph.py           # 顶层：图组装（State + Nodes + Edges）
├── nodes.py           # 中层：节点业务逻辑
├── tools.py           # 中层：工具定义
├── config.py          # 底层：配置管理
├── models.py          # 底层：数据模型 / State 定义
└── app.py             # HTTP 层：自定义路由
```

### 6.3.2 配置管理

```python
# config.py
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """应用配置"""
    # LLM
    llm_model: str = "anthropic:claude-sonnet-4-5-20250929"
    llm_temperature: float = 0.7
    llm_max_tokens: int = 4096

    # 数据库
    database_url: str = "postgresql://localhost:5432/langgraph"
    db_pool_min: int = 5
    db_pool_max: int = 20

    # Redis（可选）
    redis_url: str = "redis://localhost:6379/0"

    # LangSmith
    langsmith_tracing: bool = False
    langsmith_api_key: str = ""
    langsmith_project: str = "default"

    # 性能
    max_concurrent_threads: int = 100
    message_trim_tokens: int = 3000

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


@lru_cache()
def get_settings() -> Settings:
    return Settings()
```

```python
# graph.py
from .config import get_settings
from .models import AgentState
from .nodes import agent_node, tool_node
from langgraph.graph import StateGraph, START
from langgraph.checkpoint.postgres import PostgresSaver


def build_graph():
    """根据配置构建图"""
    settings = get_settings()

    # 初始化 Checkpointer
    checkpointer = PostgresSaver(
        sync_connection=create_pool(settings.database_url)
    )
    checkpointer.setup()

    # 构建图
    builder = StateGraph(AgentState)
    builder.add_node("agent", agent_node)
    builder.add_node("tools", tool_node)
    builder.add_edge(START, "agent")
    builder.add_conditional_edges("agent", route)
    builder.add_edge("tools", "agent")

    return builder.compile(checkpointer=checkpointer)


graph = build_graph()
```

### 6.3.3 环境变量管理

```bash
# .env（不提交到 Git）
LLM_MODEL=anthropic:claude-sonnet-4-5-20250929
DATABASE_URL=postgresql://user:pass@db-host:5432/langgraph
DB_POOL_MIN=5
DB_POOL_MAX=20
LANGSMITH_TRACING=true
LANGSMITH_API_KEY=ls__xxx
LANGSMITH_PROJECT=prod-agent
MAX_CONCURRENT_THREADS=100
```

---

## 6.4 性能优化

### 6.4.1 流式响应

```python
from langgraph.graph import StateGraph, MessagesState, START


def agent_node(state: MessagesState):
    response = model.stream(state["messages"])
    # 使用 get_stream_writer 推送自定义流式数据
    from langgraph.config import get_stream_writer
    writer = get_stream_writer()

    full_response = ""
    for chunk in response:
        content = chunk.content
        full_response += content
        writer({"token": content, "accumulated": full_response})

    return {"messages": [{"role": "assistant", "content": full_response}]}


# 流式消费
for chunk in graph.stream(
    {"messages": [{"role": "user", "content": "讲个故事"}]},
    stream_mode="custom"  # 接收自定义流式数据
):
    print(chunk, end="", flush=True)
```

**stream_mode 选择**：

| 模式 | 输出内容 | 适用场景 |
|------|---------|---------|
| `values` | 每次更新后的完整 State | 调试、日志 |
| `updates` | 每次节点返回的部分更新 | 进度跟踪 |
| `custom` | 节点内自定义推送 | 逐字输出、进度条 |

### 6.4.2 并行节点

```python
# LangGraph 天然支持并行：当多个节点没有依赖关系时
from langgraph.graph import StateGraph, START


def search_web(state):
    # 耗时操作：网络搜索
    return {"search_results": [...]}


def query_database(state):
    # 耗时操作：数据库查询
    return {"db_results": [...]}


def query_knowledge_base(state):
    # 耗时操作：知识库检索
    return {"kb_results": [...]}


def synthesize(state):
    # 等待所有并行结果后汇总
    all_results = (
        state["search_results"]
        + state["db_results"]
        + state["kb_results"]
    )
    return {"final_answer": model.invoke(f"综合以下信息：{all_results}")}


builder = StateGraph(ResearchState)
builder.add_node("search", search_web)
builder.add_node("db_query", query_database)
builder.add_node("kb_query", query_knowledge_base)
builder.add_node("synthesize", synthesize)

# 从 START 同时触发三个并行节点
builder.add_edge(START, "search")
builder.add_edge(START, "db_query")
builder.add_edge(START, "kb_query")

# 所有并行节点完成后才执行 synthesize
builder.add_edge("search", "synthesize")
builder.add_edge("db_query", "synthesize")
builder.add_edge("kb_query", "synthesize")
```

### 6.4.3 连接池优化

```python
from psycopg_pool import ConnectionPool
import os


class DatabaseManager:
    """单例连接池管理器"""
    _pool = None

    @classmethod
    def get_pool(cls) -> ConnectionPool:
        if cls._pool is None:
            cls._pool = ConnectionPool(
                conninfo=os.environ["DATABASE_URL"],
                min_size=int(os.environ.get("DB_POOL_MIN", 5)),
                max_size=int(os.environ.get("DB_POOL_MAX", 20)),
                timeout=30,
                check=ConnectionPool.check_connection,
            )
        return cls._pool

    @classmethod
    def close_pool(cls):
        if cls._pool:
            cls._pool.close()
            cls._pool = None
```

### 6.4.4 消息修剪 + Token 控制

```python
from langchain_core.messages import trim_messages


def optimized_agent_node(state: MessagesState):
    """优化版 Agent 节点：控制 Token 消耗"""
    settings = get_settings()

    # 修剪消息到目标 Token 数
    trimmed = trim_messages(
        state["messages"],
        strategy="last",
        max_tokens=settings.message_trim_tokens,
        include_system=True,
        allow_partial=True,
    )

    response = model.invoke(trimmed)
    return {"messages": [response]}
```

---

## 6.5 监控告警：LangSmith Observability

### 6.5.1 概念定义

**LangSmith Observability** 是 LangSmith 平台的生产监控模块，提供：

- **Trace 追踪**：每次 Agent 执行的完整调用链
- **指标仪表盘**：延迟、Token 消耗、错误率的实时图表
- **告警规则**：异常检测、阈值告警
- **反馈收集**：用户评分、人工标注

### 6.5.2 配置生产环境 Tracing

```python
import os
from langsmith import Client


# 环境变量
os.environ["LANGSMITH_TRACING"] = "true"
os.environ["LANGSMITH_API_KEY"] = os.environ.get("LANGSMITH_API_KEY")
os.environ["LANGSMITH_PROJECT"] = "prod-agent"
os.environ["LANGSMITH_ENDPOINT"] = "https://api.smith.langchain.com"


def run_with_tracing(inputs: dict, config: dict) -> dict:
    """带追踪的 Agent 执行"""
    # 添加自定义元数据用于过滤和分析
    config = config | {
        "metadata": {
            "environment": "production",
            "version": "1.0.0",
        },
        "tags": ["prod"],
    }
    return graph.invoke(inputs, config)
```

### 6.5.3 关键监控指标

| 指标 | 告警阈值 | 说明 |
|------|---------|------|
| P99 延迟 | > 30s | 用户体验临界点 |
| Token 消耗/请求 | > 50K | 成本失控信号 |
| 错误率 | > 5% | 需要立即排查 |
| 工具调用失败率 | > 10% | 外部服务不稳定 |
| Checkpointer 延迟 | > 500ms | 持久化层瓶颈 |

### 6.5.4 自定义事件追踪

```python
from langsmith import traceable


@traceable(run_type="tool")
def search_knowledge_base(query: str) -> list:
    """带 LangSmith 追踪的知识库搜索"""
    # 自动记录输入输出
    results = vector_store.similarity_search(query, k=5)
    return results


@traceable(run_type="llm")
def call_model(messages: list) -> str:
    """带 LangSmith 追踪的模型调用"""
    response = model.invoke(messages)
    return response.content
```

---

## 6.6 生产级部署配置示例

### 6.6.1 完整部署配置

```python
# deploy.py —— 生产环境入口
import os
from langgraph.checkpoint.postgres import PostgresSaver
from langgraph.store.postgres import PostgresStore
from psycopg_pool import ConnectionPool
from langsmith import Client

from .config import get_settings
from .models import AgentState
from .nodes import agent_node, tool_node
from .graph import build_graph


def init_production_graph():
    """初始化生产级图实例"""
    settings = get_settings()

    # 1. 数据库连接池
    pool = ConnectionPool(
        conninfo=settings.database_url,
        min_size=settings.db_pool_min,
        max_size=settings.db_pool_max,
        timeout=30,
    )

    # 2. Checkpointer（短期记忆）
    checkpointer = PostgresSaver(sync_connection=pool)
    checkpointer.setup()

    # 3. Store（长期记忆）
    store = PostgresStore(
        conn=pool.getconn(),
        index={"embed": get_embeddings_model(), "dims": 1536}
    )

    # 4. 构建图
    graph = build_graph(checkpointer=checkpointer, store=store)

    return graph


def run_health_check():
    """健康检查"""
    config = {"configurable": {"thread_id": "health_check"}}
    try:
        result = graph.invoke(
            {"messages": [{"role": "user", "content": "ping"}]},
            config
        )
        return {"status": "healthy", "response": result}
    except Exception as e:
        return {"status": "unhealthy", "error": str(e)}


graph = init_production_graph()
```

### 6.6.2 langgraph.json 生产配置

```json
{
  "dependencies": [
    ".",
    "langgraph>=1.0",
    "langgraph-checkpoint-postgres>=2.0",
    "langchain-anthropic",
    "psycopg[pool]>=3.2"
  ],
  "graphs": {
    "agent": "./src/agent/graph.py:graph"
  },
  "env": ".env.production",
  "http": {
    "app": "./src/agent/app.py:app"
  }
}
```

### 6.6.3 Docker 部署

```dockerfile
FROM python:3.12-slim

WORKDIR /app

COPY pyproject.toml .
RUN pip install --no-cache-dir .

COPY src/ src/
COPY langgraph.json .

EXPOSE 8123

CMD ["langgraph", "dev", "--port", "8123"]
```

### 6.6.4 Docker Compose

```yaml
version: "3.9"

services:
  agent:
    build: .
    ports:
      - "8123:8123"
    environment:
      - DATABASE_URL=postgresql://langgraph:password@db:5432/langgraph
      - LANGSMITH_TRACING=true
    depends_on:
      db:
        condition: service_healthy

  db:
    image: postgres:16
    environment:
      POSTGRES_USER: langgraph
      POSTGRES_PASSWORD: password
      POSTGRES_DB: langgraph
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U langgraph"]
      interval: 5s
      timeout: 3s
      retries: 5

volumes:
  pgdata:
```

---

## 6.7 常见误区

### 误区 1：直接在代码中硬编码数据库连接

```python
# 错误
conn = "postgresql://admin:password123@localhost:5432/db"

# 正确：使用环境变量 + Pydantic Settings
settings = get_settings()
conn = settings.database_url
```

### 误区 2：每次请求创建新连接

```python
# 错误：每次都创建新连接，性能极差
def handle_request():
    conn = psycopg.connect(DSN)  # 每次都新建连接！
    # ...
    conn.close()

# 正确：使用连接池复用
pool = ConnectionPool(DSN, min_size=5, max_size=20)
def handle_request():
    with pool.connection() as conn:
        # ...
        pass  # 自动归还连接
```

### 误区 3：忘记初始化 Postgres 表

`PostgresSaver` 首次使用必须调用 `setup()`，否则报表不存在错误。`PostgresStore` 同理。

### 误区 4：流式响应模式选择不当

```python
# 错误：使用 values 模式，每次传输完整 State（数据量大）
for chunk in graph.stream(inputs, stream_mode="values"):
    pass  # 传输整个 State，慢且费带宽

# 正确：使用 updates 或 custom
for chunk in graph.stream(inputs, stream_mode="updates"):
    pass  # 只传输增量更新
```

### 误区 5：并行节点误用顺序边

```python
# 错误：三个搜索节点串行执行
builder.add_edge(START, "search")
builder.add_edge("search", "db_query")      # 等待 search 完成
builder.add_edge("db_query", "kb_query")    # 再等待 db_query 完成

# 正确：三个节点并行
builder.add_edge(START, "search")
builder.add_edge(START, "db_query")
builder.add_edge(START, "kb_query")
```

### 误区 6：监控只记录成功请求

生产环境必须同时记录成功和失败请求，否则无法准确计算错误率。

### 误区 7：没有配置连接健康检查

连接池中的连接可能在长时间空闲后失效。使用 `check=ConnectionPool.check_connection` 确保每次取出的连接可用。

### 误区 8：Store 未配置 Embedding 就使用向量搜索

```python
# 错误：未配置 embedding 却调用 search(query=...)
store = InMemoryStore()
store.search(namespace, query="用户偏好")  # 无 embedding 会报错

# 正确：配置 embedding 模型
store = InMemoryStore(
    index={"embed": init_embeddings("openai:text-embedding-3-small"), "dims": 1536}
)
```
# 第 7 章：Middleware 中间件深度解析

> **本章定位**：深入 LangChain 1.0 最核心的自定义机制——Middleware。从 6 个 Hook 的生命周期、洋葱模型执行顺序，到内置中间件逐一拆解，再到自定义中间件的编写、注册与组合。目标是让你掌握对 Agent 执行流程的精确控制能力。

---

## 7.1 Middleware 是什么

### 7.1.1 概念定义

**Middleware（中间件）** 是 LangChain 1.0 引入的全新核心机制，提供了一种在 Agent 执行流程的关键节点插入自定义逻辑的标准方式。

**类比理解**：如果你熟悉 FastAPI/Express 的中间件模式，LangChain Middleware 的理念完全一致——在请求到达处理器之前和响应返回之后进行拦截、修改、记录或拒绝。区别在于拦截的对象不同：

| 框架 | 拦截对象 | 典型用途 |
|------|---------|---------|
| FastAPI | HTTP Request/Response | 认证、日志、CORS |
| Express | HTTP Request/Response | 认证、日志、错误处理 |
| LangChain | Agent 生命周期事件 | 上下文管理、安全防护、成本控制、流程控制 |

**为什么需要 Middleware？** 在 LangChain v1.0 之前，想要控制 Agent 的行为（如限制工具调用次数、压缩对话历史、审核输出内容），只能通过写大量硬编码逻辑或配置一堆散乱的参数来实现。中间件将这些需求标准化为可组合的"插件"，大幅降低了上下文工程的复杂度。

### 7.1.2 核心能力矩阵

中间件覆盖 Agent 执行的全生命周期，按用途可分为四大类：

| 类别 | 内置中间件 | 解决的问题 |
|------|-----------|-----------|
| **上下文与记忆管理** | SummarizationMiddleware、ContextEditingMiddleware | 对话过长导致 Token 溢出、上下文污染 |
| **安全与合规** | PIIMiddleware、HumanInTheLoopMiddleware | 敏感信息泄露、高危操作未审批 |
| **控制与可靠性** | ModelCallLimitMiddleware、ToolCallLimitMiddleware、ModelFallbackMiddleware、ToolRetryMiddleware | 无限循环、成本失控、API 故障 |
| **任务规划** | TodoListMiddleware | 复杂多步任务容易遗漏步骤 |

### 7.1.3 Middleware vs Callbacks

LangChain 中有两套可扩展的机制，容易混淆：

| 维度 | Callbacks（回调） | Middleware（中间件） |
|------|-------------------|---------------------|
| **定位** | 面向观测（Observability） | 面向控制（Control） |
| **能力** | 只读监听，无法修改请求或响应 | 可修改请求、响应、改变流程 |
| **接口** | `BaseCallbackHandler`，事件驱动 | `AgentMiddleware`，包装式/节点式钩子 |
| **典型用途** | 日志记录、指标监控、Token 统计 | 上下文压缩、权限检查、重试、降级 |
| **执行方式** | 异步广播，不影响主流程 | 同步拦截，直接影响 Agent 行为 |

**关键结论**：Callbacks 用于"看"，Middleware 用于"改"。生产环境中两者通常同时使用——Middleware 控制行为，Callbacks 记录结果。

---

## 7.2 6 个 Hook 模型

### 7.2.1 Hook 全景概览

LangChain 1.0 的中间件系统基于**切面编程（AOP）**思想，在 Agent 执行流程中暴露了 6 个 Hook 点，覆盖从启动到结束的完整生命周期：

| Hook | 触发时机 | 类型 | 典型用途 |
|------|---------|------|---------|
| `before_agent` | Agent 启动前 | 节点式（拦截） | 环境变量检查、权限验证、资源初始化 |
| `after_agent` | Agent 结束后 | 节点式（拦截） | 结果保存、计费、清理资源 |
| `before_model` | 调用模型前 | 节点式（拦截） | 修改提示词、Token 检查、注入上下文 |
| `after_model` | 模型响应后 | 节点式（拦截） | 输出审核、记录日志、格式校验 |
| `wrap_model_call` | 包装模型调用 | 包装式（嵌套） | 缓存、重试、降级、流式处理 |
| `wrap_tool_call` | 包装工具调用 | 包装式（嵌套） | 工具限流、审批、重试、模拟 |

### 7.2.2 各 Hook 详解

#### `before_agent` — Agent 启动前

**核心作用**：提供全局初始化机会，在 Agent 开始处理任何请求之前执行。

```python
from langchain.agents.middleware import AgentMiddleware
from langchain.agents.middleware.schema import AgentState

class EnvCheckMiddleware(AgentMiddleware):
    """Agent 启动前检查必要的环境变量是否已配置"""
    
    def before_agent(self, state: AgentState) -> None:
        import os
        required_keys = ["OPENAI_API_KEY", "TAVILY_API_KEY"]
        missing = [k for k in required_keys if not os.environ.get(k)]
        if missing:
            raise EnvironmentError(
                f"缺少必要的环境变量: {', '.join(missing)}"
            )
        print(f"[before_agent] 环境变量检查通过，Agent 启动")
```

**典型用途**：
- 环境变量检查（API Key、数据库连接串）
- 数据库/缓存连接初始化
- 用户权限验证和身份确认
- 输入数据格式校验

#### `before_model` — 调用模型前

**核心作用**：在每次调用 LLM 之前拦截，可以修改传入的消息和上下文。

```python
from langchain.agents.middleware import AgentMiddleware
from langchain.agents.middleware.schema import AgentState
from langchain_core.messages import SystemMessage

class SystemPromptInjector(AgentMiddleware):
    """在每次调用模型前，动态注入系统提示词"""
    
    def before_model(self, state: AgentState) -> None:
        # 检查是否已有系统消息
        has_system = any(
            isinstance(m, SystemMessage) for m in state["messages"]
        )
        if not has_system:
            # 在消息列表最前面插入系统提示
            state["messages"].insert(0, SystemMessage(
                content="你是一个专业的研究助手。请用简洁、准确的语言回答。"
            ))
            print("[before_model] 已注入系统提示词")
```

**典型用途**：
- 动态注入系统提示词
- 过滤/修剪过长的对话历史
- 在消息中添加时间戳、用户 ID 等元数据
- Token 数量预估和超限预警

#### `after_model` — 模型响应后

**核心作用**：在 LLM 返回响应后立即拦截，可以检查和修改模型输出。

```python
from langchain.agents.middleware import AgentMiddleware
from langchain.agents.middleware.schema import AgentState

class OutputSanitizerMiddleware(AgentMiddleware):
    """审核模型输出，过滤不当内容"""
    
    BAD_WORDS = ["secret", "password", "token"]
    
    def after_model(self, state: AgentState) -> None:
        last_msg = state["messages"][-1]
        content = getattr(last_msg, "content", "")
        if isinstance(content, str):
            for word in self.BAD_WORDS:
                if word.lower() in content.lower():
                    print(f"[after_model] 警告：输出包含敏感词 '{word}'")
                    # 可以选择替换、删除或标记
```

**典型用途**：
- 输出内容审核（敏感词过滤、事实校验）
- 响应格式标准化
- 缓存模型响应结果
- 日志记录和指标上报

#### `wrap_model_call` — 包装模型调用

**核心作用**：完全接管模型调用的过程，可以在调用前后执行任意逻辑，甚至不调用模型直接返回。

```python
from langchain.agents.middleware import AgentMiddleware
from langchain.agents.middleware.schema import AgentState
from langchain_core.messages import AIMessage
import hashlib
import json

class ModelCacheMiddleware(AgentMiddleware):
    """对模型调用结果进行缓存，避免重复调用相同请求"""
    
    def __init__(self):
        self._cache: dict[str, AIMessage] = {}
    
    def _make_cache_key(self, state: AgentState) -> str:
        # 用最后一条用户消息的内容作为缓存 key
        for msg in reversed(state["messages"]):
            if getattr(msg, "type", "") == "human":
                return hashlib.md5(msg.content.encode()).hexdigest()
        return ""
    
    def wrap_model_call(
        self,
        state: AgentState,
        handler,  # 实际的模型调用函数
    ) -> AgentState:
        cache_key = self._make_cache_key(state)
        if cache_key and cache_key in self._cache:
            print(f"[wrap_model_call] 缓存命中，跳过模型调用")
            state["messages"].append(self._cache[cache_key])
            return state
        
        # 调用实际模型
        new_state = handler(state)
        
        # 缓存结果
        if cache_key:
            last_msg = new_state["messages"][-1]
            if isinstance(last_msg, AIMessage):
                self._cache[cache_key] = last_msg
        
        return new_state
```

**典型用途**：
- 响应缓存（节省成本和延迟）
- 重试和退避逻辑
- 模型降级（主模型失败时切换到备用模型）
- 流式输出处理
- 调用计时和性能分析

#### `wrap_tool_call` — 包装工具调用

**核心作用**：完全接管工具调用的过程，可以实现工具级别的限流、重试、审批。

```python
from langchain.agents.middleware import AgentMiddleware
from langchain.agents.middleware.schema import AgentState
from langchain_core.messages import ToolMessage
import time

class ToolRateLimitMiddleware(AgentMiddleware):
    """对工具调用进行限流，防止 API 速率限制"""
    
    def __init__(self, min_interval: float = 1.0):
        self._min_interval = min_interval
        self._last_call_time: dict[str, float] = {}
    
    def wrap_tool_call(
        self,
        state: AgentState,
        handler,  # 实际的工具调用函数
    ) -> AgentState:
        # 获取当前工具名
        last_msg = state["messages"][-1]
        tool_name = getattr(last_msg, "name", "unknown")
        
        # 检查是否需要等待
        now = time.time()
        last_time = self._last_call_time.get(tool_name, 0)
        elapsed = now - last_time
        if elapsed < self._min_interval:
            wait_time = self._min_interval - elapsed
            print(f"[wrap_tool_call] 工具 '{tool_name}' 限流，等待 {wait_time:.2f}s")
            time.sleep(wait_time)
        
        # 执行实际工具调用
        new_state = handler(state)
        
        # 更新最后调用时间
        self._last_call_time[tool_name] = time.time()
        
        return new_state
```

**典型用途**：
- 工具调用限流（防止触发 API 速率限制）
- 工具调用审批（HITL 的工具级实现）
- 工具调用重试（指数退避）
- 工具调用模拟（测试环境不调用真实 API）

#### `after_agent` — Agent 结束后

**核心作用**：在 Agent 完成所有工作后执行清理和收尾操作。

```python
from langchain.agents.middleware import AgentMiddleware
from langchain.agents.middleware.schema import AgentState

class ResultLoggerMiddleware(AgentMiddleware):
    """记录 Agent 最终结果和统计信息"""
    
    def after_agent(self, state: AgentState) -> None:
        # 获取最终结果
        final_msg = state["messages"][-1]
        content = getattr(final_msg, "content", "")
        
        # 统计信息
        msg_count = len(state["messages"])
        tool_calls = sum(
            1 for m in state["messages"]
            if getattr(m, "type", "") == "tool"
        )
        
        print(f"[after_agent] 完成！消息数={msg_count}, 工具调用={tool_calls}")
        print(f"[after_agent] 最终结果: {content[:100]}...")
```

**典型用途**：
- 保存最终结果到数据库
- 发送通知（邮件、Slack 等）
- 计费和用量统计
- 清理临时资源

---

## 7.3 Hook 执行顺序（洋葱模型）

### 7.3.1 洋葱模型概念

当注册多个中间件时，它们的执行顺序遵循**洋葱模型（Onion Model）**——外层中间件先执行 `before` 钩子、再进入内层，最后从内层向外依次执行 `after` 钩子。

这与 Express.js、Koa.js、Redux 的中间件机制完全一致：请求从外向内穿过层层中间件，响应从内向外穿出。

### 7.3.2 完整执行顺序 Mermaid 图

假设有三个中间件 `[MW1, MW2, MW3]`，注册顺序为 `middleware=[MW1, MW2, MW3]`：

```mermaid
graph TD
    A["🚀 Agent 启动"] --> B1["MW1.before_agent"]
    B1 --> B2["MW2.before_agent"]
    B2 --> B3["MW3.before_agent"]
    B3 --> C["Agent 开始处理请求"]
    
    C --> D1["MW1.before_model"]
    D1 --> D2["MW2.before_model"]
    D2 --> D3["MW3.before_model"]
    D3 --> E["MW1.wrap_model_call"]
    
    E --> E2["MW2.wrap_model_call"]
    E2 --> E3["MW3.wrap_model_call"]
    E3 --> F["🤖 实际模型调用"]
    
    F --> G1["MW3.after_model"]
    G1 --> G2["MW2.after_model"]
    G2 --> G3["MW1.after_model"]
    
    G3 --> H{"有工具调用?"}
    H -->|是| I1["MW1.wrap_tool_call"]
    I1 --> I2["MW2.wrap_tool_call"]
    I2 --> I3["MW3.wrap_tool_call"]
    I3 --> J["🔧 实际工具调用"]
    J --> K1["MW3.after_model"]
    K1 --> D1
    
    H -->|否| L1["MW3.after_agent"]
    L1 --> L2["MW2.after_agent"]
    L2 --> L3["MW1.after_agent"]
    L3 --> M["✅ Agent 结束"]
```

### 7.3.3 执行顺序详解

**关键规律**：

1. **before_* 钩子**：按注册顺序执行（MW1 -> MW2 -> MW3）
2. **wrap_* 钩子**：按注册顺序嵌套（MW1 包裹 MW2，MW2 包裹 MW3）
3. **after_* 钩子**：按注册逆序执行（MW3 -> MW2 -> MW1）

**wrap 钩子的嵌套关系**：

```
MW1.wrap_model_call(
    MW2.wrap_model_call(
        MW3.wrap_model_call(
            实际模型调用
        )
    )
)
```

这意味着：
- MW1 是最外层，最先执行 `before`，最后执行 `after`
- MW3 是最内层，最接近实际调用
- `wrap_model_call` 中的 `handler` 参数代表"下一个中间件的 wrap 或直接模型调用"

### 7.3.4 洋葱模型代码演示

```python
from langchain.agents.middleware import AgentMiddleware
from langchain.agents.middleware.schema import AgentState

class DemoMiddleware(AgentMiddleware):
    """演示中间件，打印所有钩子调用"""
    
    def __init__(self, name: str):
        self.name = name
    
    def before_agent(self, state: AgentState) -> None:
        print(f"[{self.name}] before_agent →")
    
    def after_agent(self, state: AgentState) -> None:
        print(f"[{self.name}] ← after_agent")
    
    def before_model(self, state: AgentState) -> None:
        print(f"[{self.name}] before_model →")
    
    def after_model(self, state: AgentState) -> None:
        print(f"[{self.name}] ← after_model")
    
    def wrap_model_call(self, state: AgentState, handler):
        print(f"[{self.name}] wrap_model_call ENTER →")
        result = handler(state)
        print(f"[{self.name}] ← wrap_model_call EXIT")
        return result

# 注册顺序
agent = create_agent(
    model="gpt-4o",
    tools=[],
    middleware=[
        DemoMiddleware("A"),
        DemoMiddleware("B"),
        DemoMiddleware("C"),
    ],
)

# 执行输出：
# [A] before_agent →
# [B] before_agent →
# [C] before_agent →
# [A] before_model →
# [B] before_model →
# [C] before_model →
# [A] wrap_model_call ENTER →
# [B] wrap_model_call ENTER →
# [C] wrap_model_call ENTER →
#     🤖 实际模型调用
# [C] ← after_model
# [B] ← after_model
# [A] ← after_model
# [C] ← wrap_model_call EXIT
# [B] ← wrap_model_call EXIT
# [A] ← wrap_model_call EXIT
# [C] ← after_agent
# [B] ← after_agent
# [A] ← after_agent
```

---

## 7.4 内置中间件详解

### 7.4.1 PIIMiddleware — 敏感信息过滤

**概念定义**：在消息发送给 LLM 之前，自动检测并处理个人身份信息（PII），防止敏感数据泄露到模型提供商。

**工作原理**：使用正则表达式匹配常见 PII 模式，根据配置的策略进行处理（替换、屏蔽、哈希）。

```python
from langchain.agents.middleware import PIIMiddleware, PIIStrategy

# 策略选择
class PIIStrategy:
    REDACT = "redact"      # 替换为 [REDACTED]
    MASK = "mask"          # 部分隐藏 (如 abc***@gmail.com)
    HASH = "hash"          # 替换为哈希值
    BLOCK = "block"        # 阻断请求并报错

# 基础用法：使用默认策略（REDACT）
pii_middleware = PIIMiddleware()

# 自定义策略
pii_middleware = PIIMiddleware(
    strategy=PIIStrategy.MASK,
    # 可选：自定义要检测的模式
    patterns={
        "email": r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+",
        "phone": r"\b\d{3}[-.]?\d{3}[-.]?\d{4}\b",
        "ssn": r"\b\d{3}-\d{2}-\d{4}\b",
        "id_card": r"\b\d{17}[\dXx]\b",  # 中国身份证号
    },
)

agent = create_agent(
    model="gpt-4o",
    tools=[send_email_tool],
    middleware=[pii_middleware],
)

# 用户输入："我的邮箱是 user@example.com，请给他发邮件"
# 实际发送给模型："我的邮箱是 [EMAIL_REDACTED]，请给他发邮件"
```

**检测模式覆盖**：

| 模式 | 正则示例 | 替换后 |
|------|---------|--------|
| 邮箱 | `[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+` | `[EMAIL_REDACTED]` |
| 手机号 | `\b1[3-9]\d{9}\b`（中国） | `[PHONE_REDACTED]` |
| SSN | `\b\d{3}-\d{2}-\d{4}\b` | `[SSN_REDACTED]` |
| 信用卡 | `\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b` | `[CREDIT_CARD_REDACTED]` |
| IP 地址 | `\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b` | `[IP_REDACTED]` |

### 7.4.2 SummarizationMiddleware — 对话历史自动压缩

**概念定义**：当对话历史超过设定的 Token 或消息数量阈值时，自动使用一个更便宜的模型将旧消息压缩为摘要，防止上下文溢出。

**工作原理**：
1. 监控对话历史长度（消息数或 Token 数）
2. 超过阈值时，提取需要压缩的旧消息
3. 调用摘要模型生成浓缩摘要
4. 用摘要消息替换被压缩的旧消息

```python
from langchain.agents.middleware import SummarizationMiddleware

# 基础用法：消息数阈值
summary_mw = SummarizationMiddleware(
    max_tokens=4000,      # Token 阈值
    max_messages=20,      # 消息数阈值
    summarize_model="gpt-4o-mini",  # 用便宜模型做摘要
)

# 高级配置
summary_mw = SummarizationMiddleware(
    max_tokens=4000,
    max_messages=20,
    summarize_model="gpt-4o-mini",
    # 保留最近 N 条消息不压缩
    keep_recent=5,
    # 自定义摘要 prompt
    summarize_prompt=(
        "请将以下对话历史压缩为一段简洁的摘要，"
        "保留关键事实、决策和上下文信息。\n\n"
        "{messages}"
    ),
)

agent = create_agent(
    model="gpt-4o",
    tools=[search_tool],
    middleware=[summary_mw],
)
```

**压缩前后对比**：

```
压缩前（15 条消息，约 8000 tokens）:
├── Human: 帮我研究一下量子计算...
├── AI: 好的，我来搜索... [调用 search]
├── Tool: 搜索结果...
├── AI: 根据搜索结果...
├── Human: 那量子纠缠呢？
├── AI: ... [更多来回]
└── ... (共 15 条消息)

压缩后（6 条消息，约 2000 tokens）:
├── AI: [摘要] 用户请求研究量子计算。
│       已搜索基础概念并解释了量子比特、
│       叠加态。用户进一步询问量子纠缠...
├── (保留的最近 5 条消息)
└── Human: 最新的进展是什么？
```

### 7.4.3 HumanInTheLoopMiddleware — 高危操作人工审批

**概念定义**：当 Agent 准备执行指定的高风险工具时，强制暂停执行，等待人工审批（批准、修改、拒绝）。

**工作原理**：
1. 监听工具调用请求
2. 检查工具名是否在需要审批的列表中
3. 如果是，中断 Agent 执行并保存状态（需要 checkpointer）
4. 等待人工输入决策
5. 根据决策继续执行

```python
from langchain.agents.middleware import HumanInTheLoopMiddleware
from langgraph.checkpoint.memory import MemorySaver

# 基础用法
hitl_mw = HumanInTheLoopMiddleware(
    tools=["send_email", "delete_file", "execute_code"],
)

# 需要配合 checkpointer 使用（保存中断状态）
checkpointer = MemorySaver()

agent = create_agent(
    model="gpt-4o",
    tools=[send_email, delete_file, search_web],
    middleware=[hitl_mw],
    checkpointer=checkpointer,
)

# 使用方式
config = {"configurable": {"thread_id": "session-1"}}

# 启动 Agent
result = agent.invoke(
    {"messages": [{"role": "user", "content": "删除文件 report.pdf"}]},
    config=config,
)

# Agent 会在调用 delete_file 前暂停
# 检查是否需要人工审批
if agent.get_state(config).get("interrupted"):
    print("⚠️ 等待人工审批工具调用...")
    print(f"  工具: delete_file")
    print(f"  参数: {{'filename': 'report.pdf'}}")
    
    # 人工决策
    decision = input("批准/拒绝/修改: ")
    if decision == "批准":
        # 继续执行
        result = agent.invoke(None, config=config)
    else:
        print("操作已取消")
```

**审批流程**：

```mermaid
graph LR
    A["Agent 调用危险工具"] --> B{HITL 拦截}
    B --> C["暂停执行\n保存状态"]
    C --> D["通知人工\n工具/参数/理由"]
    D --> E{人工决策}
    E -->|"✅ 批准"| F["继续执行工具"]
    E -->|"❌ 拒绝"| G["取消操作\n返回错误"]
    E -->|"✏️ 修改参数"| H["用新参数重新调用"]
```

### 7.4.4 ModelCallLimitMiddleware / ToolCallLimitMiddleware — 调用次数限制

**概念定义**：为 Agent 的执行设置"预算"——限制单次对话中模型或工具的调用次数，防止无限循环和成本失控。

**工作原理**：
1. 在 `before_agent` 中初始化计数器
2. 在每次模型/工具调用前检查计数
3. 超过限制时抛出异常或提前终止

```python
from langchain.agents.middleware import (
    ModelCallLimitMiddleware,
    ToolCallLimitMiddleware,
)

# 限制模型调用次数（防止 Agent 陷入无限思考循环）
model_limit_mw = ModelCallLimitMiddleware(
    max_calls=10,  # 最多调用 10 次模型
)

# 限制特定工具的调用次数
tool_limit_mw = ToolCallLimitMiddleware(
    max_calls={
        "search_web": 5,      # 搜索最多 5 次
        "send_email": 1,      # 发邮件最多 1 次
        "*": 20,              # 其他工具总共最多 20 次
    },
)

agent = create_agent(
    model="gpt-4o",
    tools=[search_web, send_email, calculator],
    middleware=[model_limit_mw, tool_limit_mw],
)
```

**适用场景**：

| 场景 | 配置 | 防止的问题 |
|------|------|-----------|
| 成本敏感应用 | `max_calls=5` | 单次会话成本过高 |
| 防止无限循环 | `max_calls=15` | Agent 陷入循环 |
| 限制昂贵工具 | `{"expensive_api": 2}` | 特定 API 过度调用 |
| 总体预算控制 | `{"*": 30}` | 所有工具总调用量失控 |

### 7.4.5 ContextEditingMiddleware — 上下文清理编辑

**概念定义**：允许按规则编程式地修改、删除或修剪对话中的特定消息，实现精细的上下文管理。

**工作原理**：
1. 在模型调用前拦截状态
2. 根据自定义规则扫描消息列表
3. 修改、删除或插入消息
4. 返回修改后的状态

```python
from langchain.agents.middleware import AgentMiddleware
from langchain.agents.middleware.schema import AgentState
from langchain_core.messages import ToolMessage

class ContextEditingMiddleware(AgentMiddleware):
    """清理过时的工具调用结果，保持上下文精简"""
    
    def __init__(self, max_tool_results: int = 3):
        self.max_tool_results = max_tool_results
    
    def before_model(self, state: AgentState) -> None:
        messages = state["messages"]
        
        # 找到所有工具结果消息
        tool_result_indices = [
            i for i, m in enumerate(messages)
            if isinstance(m, ToolMessage)
        ]
        
        # 保留最新的 N 个工具结果，删除更早的
        if len(tool_result_indices) > self.max_tool_results:
            to_remove = tool_result_indices[:-self.max_tool_results]
            # 同时删除对应的工具调用消息
            for i in reversed(to_remove):
                # 找到对应的 tool_call 消息并删除
                if i > 0:
                    messages.pop(i - 1)
                messages.pop(i - (1 if i > 0 else 0))
            
            print(f"[context_edit] 清理了 {len(to_remove)} 条过时工具消息")
```

**典型用途**：
- 删除过时的工具调用结果（只保留最近的上下文）
- 移除重复或矛盾的消息
- 在特定条件下插入系统提示
- 修剪超长消息的内容

---

## 7.5 自定义中间件

### 7.5.1 基于装饰器（简单场景）

适用于只需一个 Hook 的轻量级中间件：

```python
from langchain.agents.middleware import wrap_tool_call
from langchain.agents.middleware.schema import AgentState

@wrap_tool_call
def retry_middleware(state: AgentState, handler) -> AgentState:
    """简单的工具调用重试装饰器"""
    max_retries = 3
    for attempt in range(max_retries):
        try:
            return handler(state)
        except Exception as e:
            if attempt == max_retries - 1:
                raise
            print(f"[retry] 第 {attempt + 1} 次重试: {e}")
            import time
            time.sleep(2 ** attempt)  # 指数退避
    return state
```

### 7.5.2 基于类（复杂场景）

适用于需要多个 Hook 协同工作的复杂中间件：

```python
from langchain.agents.middleware import AgentMiddleware
from langchain.agents.middleware.schema import AgentState
from langchain_core.messages import SystemMessage
import time

class CostTrackingMiddleware(AgentMiddleware):
    """追踪 Agent 的 Token 用量和成本"""
    
    def __init__(self, budget_usd: float = 1.0):
        self.budget_usd = budget_usd
        self.total_tokens = 0
        self.total_cost = 0.0
        self.start_time: float | None = None
        self.model_name = "gpt-4o"
        # 粗略估算：GPT-4o 输入 $5/1M tokens, 输出 $15/1M tokens
        self.input_rate = 5.0 / 1_000_000
        self.output_rate = 15.0 / 1_000_000
    
    def before_agent(self, state: AgentState) -> None:
        self.start_time = time.time()
        self.total_tokens = 0
        self.total_cost = 0.0
        print(f"[cost] 开始追踪，预算: ${self.budget_usd:.2f}")
    
    def before_model(self, state: AgentState) -> None:
        # 估算输入 token 数
        messages = state["messages"]
        total_chars = sum(len(getattr(m, "content", "")) for m in messages)
        estimated_input_tokens = total_chars // 4  # 粗略估算
        
        cost = estimated_input_tokens * self.input_rate
        self.total_cost += cost
        
        if self.total_cost > self.budget_usd:
            raise BudgetExceededError(
                f"预算超限: ${self.total_cost:.4f} > ${self.budget_usd:.2f}"
            )
    
    def after_model(self, state: AgentState) -> None:
        # 估算输出 token 数
        last_msg = state["messages"][-1]
        output_chars = len(getattr(last_msg, "content", ""))
        estimated_output_tokens = output_chars // 4
        
        cost = estimated_output_tokens * self.output_rate
        self.total_cost += cost
        self.total_tokens += estimated_output_tokens
        
        print(f"[cost] 本次 ~${cost:.4f}, 累计 ~${self.total_cost:.4f}")
    
    def after_agent(self, state: AgentState) -> None:
        elapsed = time.time() - (self.start_time or time.time())
        print(
            f"[cost] 完成! 总 Token ~{self.total_tokens}, "
            f"总成本 ~${self.total_cost:.4f}, "
            f"耗时 {elapsed:.1f}s"
        )

class BudgetExceededError(Exception):
    pass
```

### 7.5.3 注册中间件

```python
from langchain.agents import create_agent

# 方式 1：直接在 create_agent 中注册
agent = create_agent(
    model="gpt-4o",
    tools=[search_tool, send_email_tool],
    middleware=[
        PIIMiddleware(),
        SummarizationMiddleware(max_tokens=4000),
        CostTrackingMiddleware(budget_usd=1.0),
    ],
)

# 方式 2：运行时动态添加（通过 AgentState）
# 中间件列表存储在 AgentState 中，可以在运行时修改
```

---

## 7.6 多中间件组合执行顺序详解

### 7.6.1 注册顺序决定执行顺序

中间件的注册顺序直接决定了它们的执行顺序。这一点非常关键：

```python
agent = create_agent(
    model="gpt-4o",
    tools=[search_tool, send_email_tool],
    middleware=[
        PIIMiddleware(),           # 第 1 层（最外层）
        SummarizationMiddleware(), # 第 2 层
        HITLMiddleware(),          # 第 3 层（最内层）
    ],
)
```

### 7.6.2 三层中间件的完整执行流程

以 `PIIMiddleware` → `SummarizationMiddleware` → `HITLMiddleware` 为例：

```
Agent 启动
├── PII.before_agent()           ← 第 1 个执行
├── Summary.before_agent()       ← 第 2 个执行
└── HITL.before_agent()          ← 第 3 个执行

每次调用模型前
├── PII.before_model()           ← 检查/过滤敏感信息
├── Summary.before_model()       ← 检查是否需要压缩
└── HITL.before_model()          ← 检查是否有待审批

模型调用（嵌套执行）
├── PII.wrap_model_call(
│   └── Summary.wrap_model_call(
│       └── HITL.wrap_model_call(
│           └── 实际模型调用  ← 最内层
│           )
│       )
│   )

模型响应后
├── HITL.after_model()           ← 第 1 个执行（逆序）
├── Summary.after_model()        ← 第 2 个执行
└── PII.after_model()            ← 第 3 个执行（逆序）

Agent 结束
├── HITL.after_agent()           ← 逆序
├── Summary.after_agent()
└── PII.after_agent()
```

### 7.6.3 组合设计的最佳实践

**推荐顺序**（从外到内）：

| 层级 | 中间件类型 | 原因 |
|------|-----------|------|
| 最外层 | 安全类（PII、权限检查） | 最先拦截，保护后续所有操作 |
| 中间层 | 上下文管理类（摘要、编辑） | 在安全通过后处理上下文 |
| 最内层 | 流程控制类（HITL、限流） | 最接近模型/工具调用 |
| 最内层 | 观测类（日志、成本追踪） | 记录一切，最后收尾 |

---

## 7.7 实战案例：研究助手（三层中间件）

### 7.7.1 需求

构建一个研究助手 Agent，具备以下能力：
1. 搜索网络并整理研究资料
2. 自动保护用户隐私（PII 过滤）
3. 长对话自动压缩（摘要）
4. 发送报告前需要人工审批（HITL）

### 7.7.2 完整代码

```python
"""
研究助手 Agent：PII + 摘要 + HITL 三层中间件
"""

from langchain.agents import create_agent
from langchain.agents.middleware import (
    PIIMiddleware,
    SummarizationMiddleware,
    HumanInTheLoopMiddleware,
    AgentMiddleware,
)
from langchain.agents.middleware.schema import AgentState
from langchain.tools import tool
from langgraph.checkpoint.memory import MemorySaver
from langchain_core.messages import HumanMessage, AIMessage
from typing import TypedDict


# ---- 1. 定义工具 ----

@tool
def search_research(query: str) -> str:
    """搜索学术研究资料"""
    # 实际项目中调用搜索 API
    return f"搜索结果: {query}"


@tool
def send_report_email(content: str, recipient: str) -> str:
    """发送研究报告邮件（高危操作，需审批）"""
    return f"报告已发送至 {recipient}"


# ---- 2. 自定义中间件：研究结果格式化 ----

class ResearchFormatterMiddleware(AgentMiddleware):
    """在模型响应后，自动格式化研究结果"""
    
    def after_model(self, state: AgentState) -> None:
        last_msg = state["messages"][-1]
        content = getattr(last_msg, "content", "")
        if isinstance(content, str) and "搜索" in content:
            # 给研究结果添加格式化标记
            new_content = f"📋 **研究结果**\n\n{content}"
            last_msg.content = new_content


# ---- 3. 创建 Agent ----

checkpointer = MemorySaver()

agent = create_agent(
    model="gpt-4o",
    tools=[search_research, send_report_email],
    system_prompt=(
        "你是一个专业的研究助手。请按以下步骤工作：\n"
        "1. 使用 search_research 搜索用户请求\n"
        "2. 整理搜索结果\n"
        "3. 如果需要发送邮件报告，先向用户确认\n"
        "4. 收到确认后，使用 send_report_email 发送"
    ),
    middleware=[
        # 第 1 层（最外层）：隐私保护
        PIIMiddleware(),
        
        # 第 2 层：上下文管理
        SummarizationMiddleware(
            max_tokens=4000,
            max_messages=20,
            summarize_model="gpt-4o-mini",
            keep_recent=5,
        ),
        
        # 第 3 层：研究结果格式化
        ResearchFormatterMiddleware(),
        
        # 第 4 层（最内层）：人工审批
        HumanInTheLoopMiddleware(
            tools=["send_report_email"],
        ),
    ],
    checkpointer=checkpointer,
)


# ---- 4. 运行 Agent ----

config = {"configurable": {"thread_id": "research-001"}}

result = agent.invoke(
    {
        "messages": [
            HumanMessage(
                content="帮我搜索 LangChain 1.0 中间件机制的最新资料，"
                        "整理后发邮件至 team@example.com"
            )
        ]
    },
    config=config,
)

# 当 Agent 尝试调用 send_report_email 时，
# HITLMiddleware 会暂停执行，等待人工审批
print(result)
```

### 7.7.3 执行流程可视化

```mermaid
sequenceDiagram
    participant U as 用户
    participant PII as PIIMiddleware
    participant SUM as SummarizationMiddleware
    participant HITL as HITLMiddleware
    participant M as LLM 模型
    participant T as 工具

    U->>PII: 检查邮箱/手机号脱敏
    PII->>SUM: 检查对话长度
    SUM->>HITL: 检查待审批
    HITL->>M: 调用模型
    
    M-->>HITL: 返回: 调用 search_research
    HITL-->>SUM: 传递响应
    SUM-->>PII: 传递响应
    PII-->>T: 执行搜索
    
    T-->>PII: 搜索结果
    PII->>M: 再次调用模型（整理结果）
    M-->>PII: 整理好的研究报告
    
    PII->>M: 调用模型（决定发邮件）
    M-->>HITL: 返回: 调用 send_report_email
    HITL-->>U: ⚠️ 暂停，等待审批
    
    U->>HITL: ✅ 批准
    HITL->>T: 执行发邮件操作
    T-->>U: 报告已发送
```

---

## 7.8 常见误区

### 7.8.1 误区总结表

| 误区 | 错误理解 | 正确理解 |
|------|---------|---------|
| **Hook 执行顺序** | 认为 `after_*` 和 `before_*` 一样按注册顺序执行 | `after_*` 是逆序执行（洋葱模型） |
| **wrap 的理解** | 认为 `wrap_model_call` 只是"在调用前后做事" | 它完全**接管**调用，可以不调用模型、可以缓存返回、可以切换模型 |
| **多个 wrap 的关系** | 认为每个中间件的 wrap 独立执行 | wrap 是**嵌套**的：MW1.wrap 调用 MW2.wrap，MW2.wrap 调用 MW3.wrap |
| **HITL 不需要 checkpointer** | 直接用 HumanInTheLoopMiddleware 但不配 checkpointer | HITL **必须**配合 checkpointer，否则中断状态无法保存 |
| **PII 能阻止信息泄露** | 认为开启 PII 就万无一失 | 正则无法覆盖所有 PII 模式（如自定义格式），需要多层防护 |
| **Summarization 无成本** | 认为摘要压缩是免费的 | 调用摘要模型本身也消耗 Token，需权衡摘要模型成本 vs 主模型成本 |
| **中间件替代 Callbacks** | 认为中间件可以完全替代回调 | Middleware 用于**控制**，Callbacks 用于**观测**，两者互补 |
| **Hook 可以修改 state** | 不确定哪些 Hook 能修改 AgentState | `before_model`、`wrap_model_call` 可以修改 state；`after_model` 通常只读取 |

### 7.8.2 常见陷阱详解

#### 陷阱 1：wrap 中忘记调用 handler

```python
# ❌ 错误：完全不调用 handler，模型永远不会执行
def wrap_model_call(self, state, handler):
    print("拦截了模型调用")
    return state  # 直接返回，不调用 handler

# ✅ 正确：至少调用一次 handler（或有意地用其他逻辑替代）
def wrap_model_call(self, state, handler):
    print("拦截了模型调用")
    return handler(state)  # 调用实际的模型
```

#### 陷阱 2：中间件顺序不合理

```python
# ❌ 不好：PII 放在 HITL 之后，审批时看到的可能是未脱敏的数据
middleware=[hitl_mw, pii_mw]

# ✅ 正确：PII 在最外层，确保后续所有层看到的都是脱敏后的数据
middleware=[pii_mw, hitl_mw]
```

#### 陷阱 3：在 before_agent 中修改消息

```python
# ❌ before_agent 时消息列表可能还未初始化
def before_agent(self, state):
    state["messages"].append(SystemMessage("Hello"))

# ✅ before_agent 适合做环境检查，before_model 才修改消息
def before_agent(self, state):
    # 只做检查和初始化
    check_api_key()

def before_model(self, state):
    # 这里才修改消息
    state["messages"].insert(0, SystemMessage("Hello"))
```

#### 陷阱 4：Summarization 摘要模型太贵

```python
# ❌ 用和主模型一样贵的模型做摘要，成本不降反升
SummarizationMiddleware(summarize_model="gpt-4o")

# ✅ 用便宜小模型做摘要
SummarizationMiddleware(summarize_model="gpt-4o-mini")
```

### 7.8.3 调试中间件的技巧

```python
class DebugMiddleware(AgentMiddleware):
    """调试用中间件，打印每个 Hook 的详细信息"""
    
    def before_agent(self, state: AgentState) -> None:
        self._log("before_agent", state)
    
    def before_model(self, state: AgentState) -> None:
        self._log("before_model", state)
    
    def after_model(self, state: AgentState) -> None:
        self._log("after_model", state)
    
    def after_agent(self, state: AgentState) -> None:
        self._log("after_agent", state)
    
    def wrap_model_call(self, state, handler):
        self._log("wrap_model_call ENTER", state)
        import time
        start = time.time()
        result = handler(state)
        elapsed = time.time() - start
        self._log(f"wrap_model_call EXIT ({elapsed:.2f}s)", result)
        return result
    
    def _log(self, hook_name: str, state: AgentState) -> None:
        msg_count = len(state.get("messages", []))
        last_content = ""
        if state.get("messages"):
            last_content = str(state["messages"][-1].content)[:50]
        print(f"[DEBUG] {hook_name} | msgs={msg_count} | last={last_content}")
```

---

## 7.9 本章小结

- **6 个 Hook** 覆盖 Agent 全生命周期：`before_agent`、`after_agent`、`before_model`、`after_model`、`wrap_model_call`、`wrap_tool_call`
- **洋葱模型**决定多中间件的执行顺序：`before` 正序、`after` 逆序、`wrap` 嵌套
- **内置中间件**覆盖安全（PII、HITL）、上下文管理（摘要、编辑）、成本控制（调用限制）、可靠性（回退、重试）
- **自定义中间件**有装饰器（简单）和类（复杂）两种方式
- **组合顺序至关重要**：安全类在最外层，流程控制在最内层
- **Middleware ≠ Callbacks**：一个用于控制，一个用于观测，互补而非替代
# 第 8 章：常见误区与最佳实践

> **本章定位**：汇总 LangChain/LangGraph 生产实践中的选型迷思、性能陷阱、框架对比和面试要点。帮助你在真实项目中少走弯路、做出正确决策。

---

## 8.1 选型迷思：LangChain vs LangGraph vs Deep Agents

### 8.1.1 三层框架定位

| 框架 | 一句话定位 | 核心抽象 | 适合谁 |
|------|-----------|---------|--------|
| **LangChain** | 高层组件框架 | Chain（链式）、Prompt、Tool | 简单任务、快速原型、RAG |
| **LangGraph** | 底层图编排引擎 | Node（节点）、Edge（边）、State（状态） | 复杂流程、有状态、长运行 |
| **Deep Agents** | 深度推理 Agent 方案 | 任务规划、子 Agent 委托、持久化上下文 | 多步研究、自主规划、长期任务 |

### 8.1.2 选型决策树

```mermaid
graph TD
    A["你的任务是什么？"] --> B{"是简单的一次性任务吗？\n翻译、摘要、问答、简单 RAG"}
    B -->|是| C["选 LangChain\ncreate_agent 几行搞定"]
    B -->|否| D{"需要循环、分支、状态管理吗？"}
    D -->|否| E{"是多步自主研究吗？"}
    E -->|是| F["选 Deep Agents\n任务规划 + 子 Agent 委托"]
    E -->|否| C
    D -->|是| G{"是多 Agent 协作/复杂业务流吗？"}
    G -->|是| H["选 LangGraph\n图编排 + 持久化状态"]
    G -->|否| I{"需要人工审批/时间旅行调试吗？"}
    I -->|是| H
    I -->|否| J["LangChain + LangGraph 结合\n简单的用 LangChain，复杂的用 LangGraph"]
    
    style C fill:#4ade80
    style H fill:#60a5fa
    style F fill:#f9a8d4
    style J fill:#fbbf24
```

### 8.1.3 常见选型错误

| 错误 | 原因 | 正确做法 |
|------|------|---------|
| **简单问答用 LangGraph** | 过度设计，图的状态管理带来不必要的复杂度 | 用 LangChain `create_agent`，一行创建 |
| **复杂审批流程用 LangChain** | LangChain 的线性链无法表达条件分支和循环 | 用 LangGraph 的 StateGraph + conditional edges |
| **以为只能选一个** | LangChain 和 LangGraph 是互补关系 | 简单部分用 LangChain 组件，复杂编排用 LangGraph |
| **Deep Agents 替代一切** | Deep Agents 适合自主规划的研究任务，不适合确定性流程 | 需要精确控制执行路径的场景用 LangGraph |

### 8.1.4 何时用 Deep Agents

**Deep Agents** 是 LangChain 生态中面向"深度推理"的方案，核心能力：

1. **自主任务规划**：Agent 自动将复杂目标分解为可执行的子任务（`write_todos` 工具）
2. **持久化上下文管理**：中间结果写入文件系统，避免上下文窗口溢出
3. **子 Agent 委托**：动态生成专业子 Agent 处理特定子任务
4. **跨会话状态保持**：研究进度持久化，可中断后恢复

**适合场景**：
- 自主研究（搜索 → 整理 → 分析 → 报告）
- 代码库分析（读代码 → 理解架构 → 写文档）
- 需要"停下来思考"的多步推理任务

**不适合场景**：
- 确定性业务流程（审批流、工单处理）→ 用 LangGraph
- 简单的问答/翻译 → 用 LangChain

---

## 8.2 性能陷阱

### 8.2.1 上下文溢出

**问题描述**：随着对话轮次增加，上下文窗口持续膨胀，最终超出模型限制或导致模型困惑（context pollution）。

**症状**：
- API 报错 `context_length_exceeded`
- 模型开始"遗忘"早期信息
- 响应质量明显下降
- Token 费用急剧增加

**解决方案矩阵**：

| 策略 | 原理 | 适用场景 | 成本 |
|------|------|---------|------|
| **SummarizationMiddleware** | 自动压缩旧对话为摘要 | 长对话 Agent | 摘要模型 Token 费用 |
| **ContextEditingMiddleware** | 删除过时工具结果 | 工具密集型 Agent | 免费 |
| **滑动窗口** | 只保留最近 N 条消息 | 简单对话 | 免费，但丢失历史信息 |
| **外部记忆** | 将旧信息存入向量库 | 需要检索历史的场景 | 向量存储费用 |

**代码示例：滑动窗口 + 摘要混合策略**

```python
from langchain.agents.middleware import (
    SummarizationMiddleware,
    AgentMiddleware,
)
from langchain.agents.middleware.schema import AgentState

class HybridContextMiddleware(AgentMiddleware):
    """混合策略：滑动窗口 + 按需摘要"""
    
    def __init__(self, window_size: int = 10, summary_threshold: int = 15):
        self.window_size = window_size
        self.summary_threshold = summary_threshold
        self.summary_text = ""
    
    def before_model(self, state: AgentState) -> None:
        messages = state["messages"]
        
        if len(messages) > self.summary_threshold:
            # 超过阈值：需要摘要
            if not self.summary_text:
                # 第一次触发：对旧消息生成摘要（调用便宜模型）
                self.summary_text = self._summarize(messages[:-self.window_size])
            
            # 只保留：摘要 + 最近 N 条消息
            from langchain_core.messages import HumanMessage
            recent = messages[-self.window_size:]
            state["messages"] = [
                HumanMessage(content=f"[对话摘要] {self.summary_text}"),
                *recent,
            ]
            print(f"[context] 摘要 + {len(recent)} 条最新消息")
        
        elif len(messages) > self.window_size:
            # 窗口外但不到摘要阈值：简单截断
            state["messages"] = messages[-self.window_size:]
    
    def _summarize(self, messages) -> str:
        # 实际项目中调用 LLM 生成摘要
        return "用户请求研究 LangChain 中间件..."
```

### 8.2.2 无限循环

**问题描述**：Agent 陷入 "调用工具 → 分析结果 → 再次调用同一工具" 的循环，永不停止。

**根因分析**：
1. 工具返回结果格式不清晰，模型无法识别任务已完成
2. 模型系统提示中缺少明确的停止条件
3. 缺少调用次数限制

**防护策略**：

```python
from langchain.agents.middleware import ModelCallLimitMiddleware

# 第一道防线：限制模型调用次数
model_limit = ModelCallLimitMiddleware(max_calls=15)

# 第二道防线：系统提示中明确停止条件
system_prompt = (
    "你是一个助手。你可以使用工具来获取信息。\n"
    "**重要**：当你已经收集到足够信息来回答用户的问题时，"
    "请立即给出最终答案，不要继续调用工具。"
    "如果搜索不到结果，请直接告知用户。"
)

# 第三道防线：工具返回格式明确
@tool
def search(query: str) -> str:
    """搜索信息。如果无结果，返回'未找到相关信息'"""
    results = do_search(query)
    if not results:
        return "未找到相关信息，请尝试其他关键词或直接回答。"
    return format_results(results)
```

### 8.2.3 工具调用风暴

**问题描述**：Agent 在一次任务中调用数十次甚至上百次工具，导致成本飙升和延迟增加。

**根因分析**：
1. 工具粒度太小（如每个字段单独查询）
2. 缺少批处理能力
3. Agent 反复搜索相同信息（无缓存）

**解决方案**：

```python
from langchain.agents.middleware import ToolCallLimitMiddleware

# 限制每个工具的调用次数
tool_limits = ToolCallLimitMiddleware(
    max_calls={
        "search": 5,        # 搜索最多 5 次
        "read_file": 10,    # 读文件最多 10 次
        "*": 30,            # 所有工具总计最多 30 次
    },
)

# 工具设计：支持批量查询
@tool
def search_batch(queries: list[str]) -> str:
    """批量搜索多个关键词，一次调用获取多条结果"""
    results = [do_search(q) for q in queries]
    return "\n---\n".join(results)

# 使用缓存中间件（第 7 章的 ModelCacheMiddleware）
# 避免对相同请求重复调用模型
```

---

## 8.3 LangGraph 学习曲线陡峭的应对策略

### 8.3.1 为什么 LangGraph 难学

| 难点 | 具体表现 | 破局策略 |
|------|---------|---------|
| **图思维** | 习惯了线性链式思维，不习惯图的分支/循环 | 先画图（Mermaid/白板），再写代码 |
| **状态管理** | TypedDict + Reducer 的概念较抽象 | 从最简单的 `{"messages": []}` 开始 |
| **编译流程** | `workflow.compile()` 后才能运行，调试不直观 | 使用 LangSmith 可视化追踪 |
| **持久化配置** | Checkpointer 配置有多种选择（Memory/SQLite/Postgres） | 开发阶段用 `MemorySaver`，生产再换 |
| **中断/恢复** | `interrupt` 和 `Command` 概念较新 | 先掌握基础图，再学 HITL |

### 8.3.2 渐进学习路径

```
Level 1: 线性图（__start__ → Node A → Node B → END）
    ↓
Level 2: 条件边（Node A → condition → Node B 或 END）
    ↓
Level 3: 循环图（Node A → Node B → condition → Node A 或 END）
    ↓
Level 4: 状态管理（Reducer、add_messages）
    ↓
Level 5: 持久化 + HITL（Checkpointer、interrupt）
    ↓
Level 6: 子图 + 多 Agent（Subgraph、Command）
    ↓
Level 7: 生产部署（LangGraph Platform、流式、监控）
```

**每个阶段的最小代码示例**：

```python
# Level 1: 线性图（最简单的 LangGraph）
from langgraph.graph import StateGraph, END
from typing import TypedDict

class State(TypedDict):
    text: str

def node_a(state: State) -> State:
    return {"text": state["text"].upper()}

graph = StateGraph(State)
graph.add_node("a", node_a)
graph.add_edge("__start__", "a")
graph.add_edge("a", END)
app = graph.compile()

result = app.invoke({"text": "hello"})
# {"text": "HELLO"}
```

### 8.3.3 调试技巧

```python
# 1. 流式输出中间状态
for event in app.stream({"text": "hello"}, stream_mode="values"):
    print(event)

# 2. 使用 LangSmith 追踪（设置环境变量）
import os
os.environ["LANGSMITH_TRACING"] = "true"
os.environ["LANGSMITH_API_KEY"] = "your-key"

# 3. 检查点时间旅行
from langgraph.checkpoint.memory import MemorySaver
checkpointer = MemorySaver()
app = graph.compile(checkpointer=checkpointer)

config = {"configurable": {"thread_id": "1"}}
app.invoke({"text": "hello"}, config)

# 查看历史状态
for state in app.get_state_history(config):
    print(state.values)
```

---

## 8.4 与 CrewAI 对比：角色协作 vs 图编排

### 8.4.1 核心理念差异

| 维度 | CrewAI | LangGraph |
|------|--------|-----------|
| **核心抽象** | 角色（Agent）+ 任务（Task）+ 团队（Crew） | 节点（Node）+ 边（Edge）+ 状态（State） |
| **编程模型** | 声明式：定义角色和任务，框架自动编排 | 命令式：显式定义图的每个节点和边的跳转 |
| **适用场景** | 内容创作、市场调研、多角色流水线 | 复杂业务流、状态机、需要精确控制的流程 |
| **控制粒度** | 粗粒度：框架决定执行顺序 | 细粒度：开发者精确控制每一步 |
| **学习曲线** | 平缓：几行代码跑起来 | 陡峭：需要理解图论基础 |
| **调试难度** | 中等：流程由框架决定，不易追踪 | 较易：图结构清晰，LangSmith 可视化 |

### 8.4.2 同一任务的不同写法

**任务**：研究一个技术话题 → 写文章 → 审校

**CrewAI 写法**（角色驱动）：

```python
from crewai import Agent, Task, Crew

researcher = Agent(
    role="研究专家",
    goal="搜集和分析技术信息",
    backstory="你是一名资深技术研究员",
    tools=[search_tool],
)

writer = Agent(
    role="技术写作者",
    goal="生成高质量技术文章",
    backstory="你擅长将复杂概念通俗化",
)

editor = Agent(
    role="编辑",
    goal="审校文章的准确性和可读性",
    backstory="你有 10 年技术编辑经验",
)

task1 = Task(description="研究 LangChain 中间件机制", agent=researcher)
task2 = Task(description="根据研究报告写文章", agent=writer)
task3 = Task(description="审校文章", agent=editor)

crew = Crew(agents=[researcher, writer, editor], tasks=[task1, task2, task3])
result = crew.kickoff()
```

**LangGraph 写法**（图驱动）：

```python
from langgraph.graph import StateGraph, END
from typing import TypedDict

class State(TypedDict):
    research: str
    article: str
    review: str

def research_node(state: State) -> State:
    research_result = search_and_analyze("LangChain middleware")
    return {"research": research_result}

def write_node(state: State) -> State:
    article = write_article(state["research"])
    return {"article": article}

def review_node(state: State) -> State:
    review = review_article(state["article"])
    return {"review": review}

def check_quality(state: State) -> str:
    if "需要修改" in state["review"]:
        return "rewrite"
    return "done"

graph = StateGraph(State)
graph.add_node("research", research_node)
graph.add_node("write", write_node)
graph.add_node("review", review_node)
graph.add_node("rewrite", write_node)  # 复用写节点

graph.add_edge("__start__", "research")
graph.add_edge("research", "write")
graph.add_edge("write", "review")
graph.add_conditional_edges("review", check_quality, {
    "rewrite": "rewrite",
    "done": END,
})

app = graph.compile()
```

**对比结论**：

- CrewAI 代码量更少，但无法控制执行流程（如质量检查后重写）
- LangGraph 代码量更多，但可以精确控制每个分支和循环
- 如果只需要线性流水线 → CrewAI 更合适
- 如果需要条件分支和质量门控 → LangGraph 更合适

---

## 8.5 与 AutoGen 对比：对话式 vs 确定性控制

### 8.5.1 核心理念差异

| 维度 | AutoGen | LangGraph |
|------|---------|-----------|
| **核心抽象** | 对话（Conversation）— Agent 通过聊天协作 | 图（Graph）— 节点通过状态传递协作 |
| **协作模式** | Agent 之间互相发消息，自发协作 | 开发者预设节点执行顺序和条件跳转 |
| **控制权** | Agent 自主决定何时发言、何时结束 | 开发者精确控制流程，确定性执行 |
| **适用场景** | 探索性任务、代码协作、头脑风暴 | 业务流程、审批流、需要可复现的流程 |
| **可预测性** | 低：Agent 自主对话，结果不确定 | 高：相同输入产生相同执行路径 |
| **人类介入** | 内置 UserProxyAgent，自然对话中介入 | 通过 interrupt/checkpointer 精确控制介入点 |

### 8.5.2 架构对比图

```mermaid
graph LR
    subgraph "AutoGen: 对话驱动"
        A1["Agent A"] <-->|对话| A2["Agent B"]
        A2 <-->|对话| A3["Agent C"]
        A3 <-->|反馈| A1
        H1["人类代理"] <--> A2
    end
    
    subgraph "LangGraph: 图编排"
        N1["分析意图"] -->|路由| N2{"条件判断"}
        N2 -->|"搜索"| N3["搜索节点"]
        N2 -->|"直接回答"| N4["生成节点"]
        N3 --> N4
        N4 -->|质量检查| N5{"通过?"}
        N5 -->|"是"| N6["END"]
        N5 -->|"否"| N4
    end
    
    style A1 fill:#ff9999
    style N1 fill:#99ccff
```

### 8.5.3 选型建议

| 你的场景 | 推荐框架 | 理由 |
|---------|---------|------|
| 多个 AI 合作写代码 | AutoGen | 对话式协作，Agent 自发互相审查 |
| 客服工单自动处理 | LangGraph | 需要确定的状态流转和审批流程 |
| 市场调研报告 | CrewAI | 角色分工清晰，流水线式产出 |
| 复杂研究任务（自主规划） | Deep Agents | 任务分解、子 Agent 委托 |
| 快速 Demo/PoC | LangChain | 几行代码创建 Agent |
| 多步审批 + 分支流程 | LangGraph | 精确控制每个节点和边的跳转 |

---

## 8.6 面试高频问题 15 道

### Q1：LangChain 和 LangGraph 的关系是什么？

**答案要点**：
- LangChain 是高层组件框架（Prompt、Chain、Tool、Model 抽象）
- LangGraph 是底层图编排引擎（Node、Edge、State）
- 两者互补：LangChain 提供组件，LangGraph 负责编排
- 官方推荐：新 Agent 项目优先用 LangGraph 构建

### Q2：什么是 LCEL？为何推荐用 LCEL 组装链？

**答案要点**：
- LCEL（LangChain Expression Language）是声明式的链式组合语法
- 所有 LCEL 组件实现统一的 `Runnable` 接口
- 优势：自动支持同步/异步、批处理、流式、重试、回退
- 管道语法 `prompt | model | parser` 简洁可读

### Q3：LangChain 1.0 的 Middleware 机制解决了什么问题？

**答案要点**：
- v1.0 之前控制 Agent 行为需要大量硬编码和散乱配置
- Middleware 将上下文工程标准化为可组合的"插件"
- 6 个 Hook 覆盖 Agent 全生命周期
- 支持安全、成本控制、上下文管理等生产级需求

### Q4：6 个 Middleware Hook 分别是什么？洋葱模型是什么？

**答案要点**：
- `before_agent`、`after_agent`、`before_model`、`after_model`、`wrap_model_call`、`wrap_tool_call`
- 洋葱模型：多个中间件时，`before` 正序执行、`after` 逆序执行、`wrap` 嵌套执行
- 类似 Koa.js/Express.js 的中间件模型

### Q5：LangGraph 的 StateGraph 是什么？Reducer 的作用？

**答案要点**：
- StateGraph 是基于共享状态图的编排引擎
- 每个节点读取 State、返回 Partial State 更新
- Reducer 定义如何合并多个节点的更新（如并行分支的消息 append）
- 内置 `add_messages` Reducer 支持消息智能合并和撤回

### Q6：LangGraph 如何实现 Human-in-the-Loop？

**答案要点**：
- 使用 `interrupt`（动态中断）或 `interrupt_before/after`（静态中断点）
- 需要配合 `Checkpointer` 保存中断状态
- 支持无限期挂起和恢复（时间旅行调试）
- 常用于工具调用审批、结果编辑

### Q7：LangGraph 的持久化（Checkpointer）为什么重要？

**答案要点**：
- 在每个 super-step 自动保存状态到持久化存储
- 支持：故障恢复、时间旅行调试、长期记忆、人工审批
- 官方实现：`MemorySaver`（开发）、`SQLiteSaver`、`PostgresSaver`（生产）

### Q8：什么是 ToolNode？它与工具调用的关系？

**答案要点**：
- ToolNode 是 LangGraph 预置节点，将 LLM 的 tool_call 映射到本地函数执行
- 自动处理工具名匹配、参数传递、结果封装为 ToolMessage
- `create_react_agent` 内部就使用了 ToolNode 实现工具调用循环

### Q9：LangGraph 中的并行是如何实现的？

**答案要点**：
- `add_conditional_edges` 路由函数返回多个后继时，这些节点并行执行
- 并行节点在同一 super-step 中运行
- 典型模式：map-reduce（扇出子任务 → 聚合器合并结果）
- 并行分支的更新通过 Reducer 合并到共享 State

### Q10：子图（Subgraph）的使用场景？

**答案要点**：
- 大图拆分为可复用的子图，降低复杂度
- 子图有独立 State，通过 Send API 传递数据
- 子图内部可用 `Command(graph=Command.PARENT)` 跳回父图
- 适合多 Agent 协作、模块化设计

### Q11：如何防止 LangGraph Agent 的无限循环？

**答案要点**：
- 在条件边中设置最大迭代次数
- 使用 `ModelCallLimitMiddleware` 限制模型调用次数
- 工具返回明确的成功/失败信号，让模型知道何时停止
- 系统提示中明确停止条件

### Q12：LangChain 中的 Callbacks 和 Middleware 有什么区别？

**答案要点**：
- Callbacks：只读观测，用于日志、监控、Token 统计
- Middleware：可控制，可修改请求/响应、改变流程
- 两者互补：Callbacks "看"，Middleware "改"
- Callbacks 继承 `BaseCallbackHandler`，Middleware 继承 `AgentMiddleware`

### Q13：LangGraph 相比 CrewAI 的核心优势是什么？

**答案要点**：
- 精确控制：显式定义每个节点和边
- 状态持久化：支持中断/恢复/时间旅行
- 条件分支：根据状态动态决定下一步
- 可观测性：LangSmith 集成，可视化追踪
- CrewAI 适合角色流水线，LangGraph 适合复杂控制流

### Q14：AutoGen 和 LangGraph 的核心区别是什么？

**答案要点**：
- AutoGen：对话驱动，Agent 通过"聊天"协作，控制权在 Agent
- LangGraph：图驱动，开发者显式定义执行流程，确定性高
- AutoGen 适合探索性任务，LangGraph 适合确定性业务流程

### Q15：什么是上下文工程？为什么它对 Agent 很重要？

**答案要点**：
- 上下文工程 = 在正确的时间将正确的信息传递给模型
- LLM 的上下文窗口类似 RAM，容量有限
- 信息过载 → 模型困惑；信息不足 → 无法完成任务
- 中间件是 LangChain 中上下文工程的核心机制
- 关键技术：摘要压缩、滑动窗口、选择性注入、外部记忆

---

## 8.7 最佳实践清单

### 8.7.1 状态设计

- [ ] **State 尽量精简**：只存储跨节点需要的数据，不要把整个对话历史都塞进 State
- [ ] **用 TypedDict 定义 State**：获得类型检查和 IDE 补全
- [ ] **为每个 key 定义 Reducer**：明确并行分支如何合并更新（append / replace / merge）
- [ ] **使用内置 MessagesState**：而非手动管理消息列表，享受 `add_messages` 的智能合并
- [ ] **子图 State 与父图 State 隔离**：避免状态污染，用明确的接口传递数据

### 8.7.2 错误处理

- [ ] **每个节点函数包裹 try-except**：捕获异常并返回错误状态，而非抛出中断
- [ ] **使用 RunnableWithFallbacks**：主模型失败时自动切换备用模型
- [ ] **使用 RetryPolicy**：工具调用失败时指数退避重试
- [ ] **区分可重试和不可重试错误**：网络超时可重试，权限错误不应重试
- [ ] **在 State 中记录错误次数**：防止无限重试循环

```python
from langgraph.utils import RunnableWithFallbacks
from langgraph.pregel import RetryPolicy

# 带重试策略的图
app = graph.compile()
app = app.with_retry(
    retry_policy=RetryPolicy(
        max_attempts=3,
        initial_interval=1.0,
        backoff_factor=2.0,
    ),
)
```

### 8.7.3 检查点策略

| 阶段 | Checkpointer | 说明 |
|------|-------------|------|
| **开发调试** | `MemorySaver` | 内存存储，快速迭代，重启丢失 |
| **集成测试** | `SQLiteSaver` | 文件存储，持久化，轻量 |
| **生产环境** | `PostgresSaver` | 数据库存储，支持并发、备份、高可用 |

- [ ] **开发阶段用 MemorySaver**：无需配置，即开即用
- [ ] **生产环境用 PostgresSaver**：支持并发、故障恢复
- [ ] **每个用户会话使用独立 thread_id**：避免状态交叉
- [ ] **定期清理旧检查点**：控制存储成本

### 8.7.4 成本控制

- [ ] **使用 ModelCallLimitMiddleware 限制调用次数**：防止无限循环
- [ ] **摘要用便宜模型**：SummarizationMiddleware 的 `summarize_model` 用 `gpt-4o-mini` 而非 `gpt-4o`
- [ ] **缓存高频请求**：用 `wrap_model_call` 实现响应缓存
- [ ] **工具设计支持批量**：减少工具调用次数
- [ ] **追踪 Token 用量**：用自定义 Middleware 统计成本
- [ ] **设置预算上限**：超过预算自动终止

```python
# 成本控制中间件模板
class BudgetMiddleware(AgentMiddleware):
    def __init__(self, max_cost_usd: float = 0.50):
        self.max_cost = max_cost_usd
        self.estimated_cost = 0.0
    
    def before_model(self, state: AgentState) -> None:
        # 估算即将发生的调用成本
        total_chars = sum(len(m.content) for m in state["messages"])
        est_tokens = total_chars // 4
        est_cost = est_tokens * (5.0 / 1_000_000)  # GPT-4o 输入价格
        
        if self.estimated_cost + est_cost > self.max_cost:
            raise ValueError(
                f"预算不足: 预估 ${self.estimated_cost + est_cost:.4f} > ${self.max_cost:.2f}"
            )
```

### 8.7.5 安全最佳实践

- [ ] **PII 中间件放在最外层**：确保后续所有层看到的都是脱敏数据
- [ ] **高危工具使用 HITL**：发送邮件、删除文件、数据库写入等操作需要人工审批
- [ ] **工具最小权限原则**：每个工具只授予完成其功能所需的最小权限
- [ ] **不在日志中打印敏感信息**：Callbacks 和调试中间件注意脱敏
- [ ] **API Key 通过环境变量注入**：不硬编码在代码中

---

## 8.8 常见误区总结表格

### 8.8.1 LangChain 误区

| 误区 | 错误理解 | 正确做法 |
|------|---------|---------|
| "Chain 万能" | 认为 Chain 可以处理所有场景 | Chain 适合线性流程，循环/分支需要 LangGraph |
| "Callbacks 能改请求" | 以为 Callbacks 可以修改模型输入 | Callbacks 只读，需要 Middleware 才能修改 |
| "Memory 就是对话历史" | 把所有消息都存进 Memory | 区分短期记忆（滑动窗口）和长期记忆（摘要/外部存储） |
| "Agent 能处理一切" | 过度依赖 Agent 自主决策 | 确定性流程用图编排，不确定任务才用 Agent |
| "LCEL 很复杂" | 回避 LCEL 用旧 Chain API | LCEL 是官方推荐方式，更简洁、功能更强大 |

### 8.8.2 LangGraph 误区

| 误区 | 错误理解 | 正确做法 |
|------|---------|---------|
| "图必须很复杂" | 认为 LangGraph 只适合复杂场景 | 线性图也很简单：`__start__ → A → END` |
| "State 越详细越好" | 在 State 中存储大量无关数据 | 只存跨节点需要的数据，保持精简 |
| "不需要 Checkpointer" | 生产环境也不配持久化 | HITL 和故障恢复都依赖 Checkpointer |
| "节点应该做很多事" | 单个节点包含大量逻辑 | 每个节点职责单一，方便测试和复用 |
| "条件边返回字符串就行" | 随意返回路由值 | 使用 Enum 或常量定义路由值，避免拼写错误 |
| "子图是必须的" | 一开始就拆分子图 | 先在一个图中完成，确认复杂度后再拆分 |

### 8.8.3 通用误区

| 误区 | 错误理解 | 正确做法 |
|------|---------|---------|
| "模型越强越好" | 所有任务都用最贵的模型 | 简单任务用便宜模型，复杂推理才用强模型 |
| "不需要限流" | 不设调用次数上限 | 必须设限，防止无限循环和成本失控 |
| "测试不重要" | 跳过 Agent 的测试直接部署 | Agent 行为不确定，更需要系统化测试 |
| "一次提示到位" | 认为写好 system prompt 就够了 | 需要迭代优化 prompt，用 LangSmith 分析失败案例 |
| "不考虑延迟" | 只关注正确性不关注性能 | 生产环境需要考虑模型延迟、工具响应时间、网络延迟 |
| "上下文越多越好" | 把所有信息都塞给模型 | 精准投递上下文，信息过载会降低模型表现 |

---

## 8.9 本章小结

- **选型没有绝对**：LangChain 适合简单任务和快速原型，LangGraph 适合复杂有状态流程，Deep Agents 适合自主研究，CrewAI 适合角色流水线，AutoGen 适合对话式协作
- **三大性能陷阱**：上下文溢出（用摘要+滑动窗口）、无限循环（用调用限制+明确停止条件）、工具风暴（批量工具+缓存）
- **LangGraph 渐进学习**：从线性图开始，逐步掌握条件边、循环、持久化、子图
- **状态设计要精简**：只存跨节点数据，用 TypedTyped + Reducer 保证类型安全
- **错误处理不能省**：每个节点都要 try-except，配合 RetryPolicy 和 Fallback
- **成本控制是生产刚需**：限流、摘要用便宜模型、缓存、预算监控
- **安全是底线**：PII 最外层、HITL 高危工具、最小权限原则
