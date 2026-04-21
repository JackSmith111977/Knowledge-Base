# 新闻报告模板

> 此模板由 news-digest Skill 的 Generator 模式使用

---

```markdown
# {{TOPIC_NAME}} · 每日新闻聚合

> **日期：** {{DATE}}
> **生成时间：** {{TIMESTAMP}}
> **执行耗时：** {{DURATION}}

---

## 摘要

| 指标 | 数值 |
|------|------|
| 采集主题数 | {{TOPIC_COUNT}} |
| 总采集条目 | {{TOTAL_COLLECTED}} |
| 去重后条目 | {{TOTAL_AFTER_DEDUP}} |
| 全文获取成功 | {{FULLTEXT_OK}} |
| 全文获取失败 | {{FULLTEXT_FAILED}} |
| 评分过滤 (< {{THRESHOLD}}) | {{FILTERED_COUNT}} |
| 最终保留 | {{FINAL_COUNT}} |

---

{{#FOR_EACH_TOPIC}}

## {{TOPIC_NAME}}

> 信源：{{SOURCE_LIST}} | 关键词：{{KEYWORDS}}

{{#FOR_EACH_NEWS}}

### {{RANK}}. {{TITLE}}

- **评分：** {{SCORE}} / 10
  - 来源权威性：{{SOURCE_SCORE}} ({{SOURCE_WEIGHT}}%)
  - 时效性：{{TIME_SCORE}} (15%)
  - 相关性：{{RELEVANCE_SCORE}} (20%)
  - 内容深度：{{DEPTH_SCORE}} (20%)
  - 事实标注完整性：{{FACT_TRACE_SCORE}} (20%)
- **来源：** {{SOURCE_NAME}}
{{#IF_ORIGINAL_SOURCE}}
- **原始来源：** {{ORIGINAL_SOURCE}}
{{/IF_ORIGINAL_SOURCE}}
{{#IF_AUTHOR}}
- **作者：** {{AUTHOR}}
{{/IF_AUTHOR}}
- **发布时间：** {{PUBLISH_TIME}}
- **摘要：** {{SUMMARY}}（不少于 80 字中文，说明新闻核心内容、关键数据/人物/观点）
- **链接：** [阅读原文]({{URL}})
{{#IF_ACCESS_LIMITED}}
- ⚠️ 原文链接受限，内容来自其他信源交叉报道
{{/IF_ACCESS_LIMITED}}

{{/FOR_EACH_NEWS}}

{{/FOR_EACH_TOPIC}}

---

## 附录：过滤统计

### 被过滤的新闻（评分 < {{THRESHOLD}}）

| 标题 | 来源 | 评分 | 过滤原因 |
|------|------|------|----------|
{{#FOR_EACH_FILTERED}}
| {{TITLE}} | {{SOURCE}} | {{SCORE}} | {{REASON}} |
{{/FOR_EACH_FILTERED}}

### 链接无效/不可信的条目

| 标题 | 来源 | 问题 |
|------|------|------|
{{#FOR_EACH_INVALID}}
| {{TITLE}} | {{SOURCE}} | {{ISSUE}} |
{{/FOR_EACH_INVALID}}

{{#IF_OVERFLOW}}

---

## 更多新闻速览（评分通过但超出详细条目限制）

{{#FOR_EACH_OVERFLOW}}
- **{{TITLE}}** — {{SOURCE}} · {{PUBLISH_TIME}} · 评分 {{SCORE}} · [阅读原文]({{URL}})
{{/FOR_EACH_OVERFLOW}}
{{/IF_OVERFLOW}}

---

*报告由 news-digest Skill 生成 | 设计模式：Pipeline + Inversion + Generator + Reviewer | 版本：1.5.0*
```
