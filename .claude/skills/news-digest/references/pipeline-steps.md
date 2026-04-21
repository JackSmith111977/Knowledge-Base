# Pipeline 详细执行步骤

> Pipeline 模式：新闻聚合完整执行流程

---

## 前置检查

```
1. 确认 config.json 存在且格式正确
2. 确认至少有一个 enabled: true 的主题
3. 确认 web-access skill 可用
4. 如果用户指定了主题，确认主题存在于配置中
```

**失败处理：** 如果前置检查不通过，告知用户具体原因，提供修复建议，终止执行。

---

## 步骤 1：搜索与采集

### 1.1 并行搜索

```
FOR EACH enabled topic:
  FOR EACH source in topic.sources:
    使用 web-access 搜索该信源
    提取最多 maxPerTopic 条新闻的：
      - title（标题）
      - summary（简介，200 字以内）
      - url（原文链接）
      - source（来源名称）
      - publishTime（发布时间，如可获取）
```

### 1.2 时间有效性过滤

```
FOR EACH 新闻条目:
  如果 publishTime 可解析:
    如果发布时间距当前 > 72 小时:
      标记为 outdated，从列表中移除
      记录丢弃计数
  如果 publishTime 不可解析:
    标记为 timeUnknown，保留但在评分时时效性维度给 3 分

输出：每个主题的 72h 内新闻列表
```

### 1.3 去重

加载 `references/dedup-strategy.md`，执行三级去重：

```
FOR EACH 新闻条目对 (a, b):
  // L1: URL 精确匹配
  IF normalizeUrl(a.url) == normalizeUrl(b.url):
    标记为重复，保留信源权重更高的版本

  // L2: 标题相似度
  ELSE IF titleSimilarity(a.title, b.title) > 0.85:
    标记为重复，保留信源权重更高的版本

  // L3: 语义去重
  ELSE IF keywordOverlap(a.summary, b.summary) > 0.70 AND sameEvent(a, b):
    标记为重复，保留信源权重更高的版本

对每个重复组:
  canonical.duplicateSources = [duplicate.source, ...]
  记录去重类型（L1/L2/L3）和数量
```

输出：每个主题的去重后新闻列表，附带去重统计

**[检查点 1]** 确认：
- 每个主题都尝试了所有信源
- 记录失败的信源（web-access 报错不影响其他信源）
- 输出当前采集总数

---

## 步骤 2：来源可信度验证

```
FOR EACH 新闻条目:
  加载 references/source-verification.md
  执行来源可信度评估
  标记结果：trusted / untrusted / unknown
```

---

## 步骤 3：链接有效性验证

```
FOR EACH 新闻条目:
  检查 URL 格式：
    - 是否以 http:// 或 https:// 开头
    - 是否包含有效域名
    - 是否为已知无效格式
  标记结果：valid / invalid
  过滤掉 invalid 的条目
```

---

## 步骤 4：智能评分

```
FOR EACH 新闻条目:
  加载 references/scoring-rubric.md
  按 5 个维度分别评分（1-10）
  计算加权综合得分
  记录各维度得分

FILTER: 保留 综合得分 > threshold 的条目
```

**[检查点 2]** 确认：
- 所有条目均已完成评分
- 记录过滤数量
- 如某主题过滤后无剩余条目，记录原因

---

## 步骤 5：报告生成

```
1. 加载 assets/report-template.md
2. 按主题分组，按得分降序排列
3. 填充模板变量
4. 为每个主题生成独立的 Markdown 报告
5. 报告暂存到 News/.work/ 目录
```

---

## 步骤 6：输出与存档

### 6.1 写入报告文件

```
FOR EACH 主题:
  目标路径 = config.baseDirectory + "/" + topic.outputDirectory + "/" + config.filenameFormat
  如 目标目录不存在 → 创建目录
  写入报告文件
  记录写入结果（成功/失败）
```

### 6.2 更新知识库索引

```
1. 读取 KB-INDEX.md
2. 检查 News/ 目录是否已有索引条目
3. 如无，在目录结构树中添加 News 部分：
   News/
   ├── AI 前沿/
   └── 前端开发/
4. 在映射表中添加 News 分类说明
5. 写入更新后的 KB-INDEX.md
```

### 6.3 对话输出

```
输出报告摘要：
- 总采集数、过滤数、最终保留数
- 每个主题的前 maxPreviewPerTopic 条新闻
- 评分最高的 3 条重点标注
- 报告文件存放路径提示
```

### 6.4 清理临时文件

```
确认所有报告文件已成功写入且索引已更新后：
1. 扫描 News/.work/ 目录
2. 删除本次执行产生的所有 .json 临时文件
3. 验证 .work 目录已清空（或仅保留其他执行的残留文件）
4. 如果清理失败 → 记录警告，但不阻塞流程
```

**[检查点 3：自检]** 确认：
- 所有报告文件已写入
- KB-INDEX.md 已更新
- News/.work/ 临时文件已清理

---

## 错误处理

| 错误类型 | 处理方式 |
|----------|----------|
| 某信源搜索失败 | 记录错误，继续其他信源 |
| config.json 格式错误 | 告知用户，提供修复建议，终止 |
| web-access 不可用 | 告知用户，终止执行 |
| 某主题无结果 | 记录原因，继续处理其他主题 |
| KB-INDEX.md 不存在 | 创建基础索引结构，继续执行 |
| News/ 目录不存在 | 自动创建 News/ 及主题子目录 |
| 临时文件清理失败 | 记录警告，不阻塞流程 |
| 报告文件写入失败 | 记录错误，跳过该主题，继续其他主题 |

---

*Pipeline 步骤版本：1.0.0 | 与 SKILL.md 中的工作流概览配合使用*
