# 新闻去重策略

> Pipeline 步骤 1.5：三级去重机制，防止多信源报道同一新闻

---

## 核心原则

同一事件被多个信源报道时，只保留一个主版本（canonical），其余作为引用来源附在主版本下。

**保留规则**：保留信源权重（config.json 中 `source.weight`）更高的版本。

---

## L1：精确去重（URL 相同）

### 判断条件

```
IF 两条新闻的 url 完全相同（忽略末尾斜杠和追踪参数）:
  → 判定为重复
```

### 处理方式

```
保留信源权重更高的版本：
  IF source_a.weight > source_b.weight:
    canonical = a, duplicate = b
  ELSE:
    canonical = b, duplicate = a

将 duplicate 的 source 信息合并到 canonical.duplicateSources:
  canonical.duplicateSources = [duplicate.source, ...canonical.duplicateSources]
```

### URL 归一化

比较前先对 URL 进行归一化：
1. 去除追踪参数：`utm_source`, `utm_medium`, `utm_campaign`, `ref`, `fbclid`
2. 去除末尾斜杠：`https://example.com/path/` → `https://example.com/path`
3. 统一协议：`http://` → `https://`（仅用于比较，不修改原始 URL）

---

## L2：标题相似度去重

### 判断条件

```
标题相似度 = 最长公共子序列长度 / max(len(title_a), len(title_b))

IF 标题相似度 > 0.85:
  → 判定为重复
```

### 标题预处理

比较前先对标题进行清理：
1. 去除前缀标记：`【`, `】`, `「`, `」`, `|`, `-`, `:`
2. 去除来源标注：`_36kr`, `| TechCrunch` 等
3. 转小写（英文标题）
4. 去除标点符号（仅英文）
5. 去除数字（避免版本号干扰，如 GPT-4 vs GPT-5）

### 示例

```
标题 A: "OpenAI 发布 GPT-5，性能超越 Claude 3.5"
标题 B: "【快讯】OpenAI发布GPT-5：性能全面超越竞品"

预处理后:
A: "openai 发布 gpt 性能超越 claude"
B: "快讯 openai发布gpt性能全面超越竞品"

LCS 长度: 14 / max(17, 19) = 0.74 → 不判定为重复（差异较大）

另一组:
A: "Anthropic 发布 Mythos 模型"
B: "Anthropic发布Mythos最强模型"

LCS 长度: 14 / max(12, 14) = 1.0 → 判定为重复
```

---

## L3：语义去重（核心事件匹配）

当 L1 和 L2 均未命中时，执行语义分析。

### 判断条件

```
满足以下两个条件时判定为重复：
1. 简介关键词重叠率 > 70%
2. 核心事件一致（人工判断）
```

### 关键词提取

从简介中提取关键词：
1. 提取命名实体（人名、公司名、产品名）
2. 提取动作词（发布、收购、融资、裁员、开源）
3. 提取数字指标（金额、百分比、数量）

### 核心事件匹配

两个新闻描述同一核心事件的特征：
- **同一主体**：涉及同一家公司/产品/人物
- **同一动作**：发布/融资/收购/人事变动等同一事件
- **同一时间窗口**：发布时间相差 < 24 小时

### 示例

```
新闻 A (36kr): "智谱AI完成新一轮融资，估值突破4300亿港币"
新闻 B (机器之心): "智谱AI宣布完成最新轮融资，估值达4300亿港元"
新闻 C (TechCrunch): "Zhipu AI raises new round at $60B valuation"

分析:
- 主体相同：智谱AI / Zhipu AI
- 动作相同：融资
- 指标接近：4300亿港币 ≈ $60B
→ 判定为重复，保留权重最高的信源（机器之心 0.95）
```

---

## 去重结果数据结构

```json
{
  "canonical": {
    "title": "智谱AI完成新一轮融资，估值突破4300亿港币",
    "summary": "...",
    "url": "https://...",
    "source": "机器之心",
    "publishTime": "2026-04-10 10:00",
    "score": 8.2,
    "duplicateSources": ["36kr", "TechCrunch"]
  },
  "duplicates": [
    {
      "source": "36kr",
      "reason": "L3 语义去重：同一融资事件"
    },
    {
      "source": "TechCrunch",
      "reason": "L3 语义去重：同一融资事件"
    }
  ]
}
```

---

## 报告中展示去重信息

在生成的报告中，对多信源报道的新闻增加标注：

```markdown
### 1. 智谱AI完成新一轮融资，估值突破4300亿港币
- **评分：** 8.2 / 10
- **来源：** 机器之心
- **多信源报道：** 36kr, TechCrunch 也有相关报道
- **简介：** ...
```

---

## 去重统计

在报告摘要中输出去重统计：

```
| 指标 | 数值 |
|------|------|
| 总采集条目 | 120 |
| L1 精确去重 | 15 |
| L2 标题去重 | 8 |
| L3 语义去重 | 12 |
| 去重后条目 | 85 |
```

---

*去重策略版本：1.0.0 | 与 pipeline-steps.md 步骤 1.5 配合使用*
