---
name: news-digest
description: 每日新闻聚合筛选，支持多主题多信源配置，通过 web-access 收集新闻并执行 Pipeline（搜索→抓取→验证→评分→输出），只保留评分 > 4 的优质内容，生成结构化报告
aliases: [news, daily-digest, news-aggregator]
triggers:
  - 每日新闻
  - 新闻聚合
  - 今日要闻
  - 新闻摘要
  - news digest
  - 今日新闻
author: Kei
version: 1.8.0
metadata:
  patterns: [pipeline, inversion, generator, reviewer]
  type: 数据获取与分析
---

# 每日新闻聚合筛选（News Digest）

## 核心指令

本 Skill 通过 **Pipeline + Inversion + Generator + Reviewer** 组合模式，从配置的多主题多信源中聚合新闻，执行质量评分后生成结构化报告。

**设计模式组合：**
- **Inversion**：首次使用时引导用户配置主题和信源
- **Pipeline**：搜索 → 抓取 → 验证 → 评分 → 输出，强制顺序执行
- **Reviewer**：链接有效性 + 来源可信度 + 评分门控
- **Generator**：按模板生成 Markdown 报告

---

## 配置加载

### 1. 加载配置文件

```
读取 config.json 获取：
- topics：主题列表（名称、关键词、信源、权重、是否启用）
- scoring：评分维度权重配置
- output：输出默认设置
```

### 2. 配置文件不存在时（Inversion 模式）

**门控：在配置完成前，不得执行新闻聚合。**

引导用户配置：
1. 询问需要监控的主题（如 "AI大模型"、"前端开发"、"Web3"）
2. 为每个主题确认信源（如 "36kr"、"HackerNews"、"TechCrunch"）
3. 确认评分权重（使用默认或自定义）
4. 生成 config.json 并保存到 `.claude/skills/news-digest/config.json`

---

## Pipeline 工作流

**硬性门控：按顺序执行每个步骤，不得跳过或合并。如果某一步失败，记录错误并继续处理其他条目。**

### 步骤 1：搜索与采集

**[硬性门控] 必须使用 `web-access` skill 执行采集，禁止仅用 MCP 搜索工具（bailian_web_search 等）替代。仅允许在 web-access 初始化失败时降级为 MCP 搜索作为兜底。**

对每个已启用的主题：
1. 从 config.json 读取该主题的搜索关键词和信源列表
2. **[硬性门控] CDP Proxy 统一启动**（首次执行或 Proxy 未运行时，**仅由主 Agent 执行一次**）：
   ```bash
   node "$CLAUDE_SKILL_DIR/../web-access/scripts/check-deps.mjs"
   ```
   脚本会检查 Node.js 和 Chrome CDP 端口，自动启动 Proxy。通过后在回复中展示 web-access 的温馨提示。
   **[硬性门控] 所有 SubAgent 复用此 Proxy，禁止各自启动新实例。**
3. **[硬性门控] 并行 SubAgent 调度**：
   **必须使用 `Agent` 工具启动子 Agent 进行并行采集，禁止主 Agent 串行逐个访问信源。**
   **[硬性门控] 并发限制：每批次最多启动 2 个 SubAgent，批次间间隔 30 秒，防止 429 配额超限。按权重从高到低排序后分批。**

   按以下步骤分批执行：
   1. 将信源按权重从高到低排序
   2. 每 2 个信源为一组，启动一批并行 SubAgent
   3. 每批完成后使用 `TaskOutput` 等待全部完成，**等待 30 秒后再启动下一批**
   3.5 **[硬性门控] 批次 Tab 清理**：每批 SubAgent 完成后，
       主 Agent 通过 `curl -s http://localhost:3456/targets` 检查当前 tab 列表，
       如有 SubAgent 遗留的 tab（非用户原始 tab），使用 `curl -s "http://localhost:3456/close?target=ID"` 清理，
       确保无 tab 泄漏后再等待 30 秒启动下一批
   4. 对每个信源：
      - 调用 `Agent` 工具，参数：
        - `subagent_type`: "general-purpose"
        - `run_in_background`: true
        - `prompt`: 包含以下内容：
          ```
          你是 news-digest Pipeline 的子采集 Agent。
          1. 加载 web-access skill 并遵循指引
          2. **[硬性门控] Proxy 复用**：直接通过已有 CDP Proxy (localhost:3456) 操作，
             **禁止**再次执行 check-deps.mjs 或启动新 Proxy 实例
          3. 通过 CDP `/new` 创建新后台 tab 打开 {SOURCE_URL}（{SOURCE_NAME}），
             **记录返回的 targetId 用于后续清理**
          4. 搜索关键词：{KEYWORDS}
          5. 提取最近 72 小时内的新闻列表（标题、链接、来源、发布时间、简介）
             **标题和简介必须使用中文（如原文为英文，需翻译为中文，保留关键数据和专业术语）**
          6. 滚动触发懒加载，确保覆盖首页 + 下一页
          7. 将结果以 JSON 写入 {WORK_DIR}/{topic}-{source}-{timestamp}.json
          8. **[硬性门控] Tab 清理**：使用记录的 targetId 通过 CDP `/close` 关闭自己创建的 tab，
             **禁止关闭用户原有 tab**。无论成功失败，此步骤必须执行
          ```
   5. 汇总所有子 Agent 的 JSON 结果到统一数据池
4. 提取每条新闻的：标题、简介、链接、来源、**发布时间**、**原始作者/出处（如可从转载页面或摘要中识别）**
5. **[硬性门控] 时间有效性过滤**：
   - 丢弃发布时间 > 72 小时（3 天）的旧文章
   - **无法确定发布时间的标记为 `timeUnknown`，进入步骤 1.5 后需人工确认，不得自动通过**
   - 每日定时任务中，可适当收紧至 48 小时以保证"每日"语义
6. **去重**：加载 `references/dedup-strategy.md`，执行三级去重：
   - **L1 精确去重**：URL 相同 → 直接合并
   - **L2 标题去重**：标题相似度 > 85% → 保留信源权重更高的版本
   - **L3 语义去重**：简介关键词重叠 > 70% 且核心事件一致 → 保留信源权重更高的版本，并标注「多信源报道」
7. 去重后的新闻标记 `isDuplicate` 的保留为 `canonical`（主版本），其余标记为 `duplicate`（附到主版本下）

**[检查点 1：自检]** 确认：
- 所有已启用信源均已触发（每个信源对应一个子 Agent 任务）
- 所有保留新闻的发布时间在 72 小时以内（或标记为 `timeUnknown`）
- 输出当前去重统计（原始采集数 → 去重后 → 时间过滤数 → 各信源采集数分布）

### 步骤 1.5：全文获取（新增关键步骤）

**门控：不得跳过此步骤。仅基于搜索摘要生成报告是此前质量问题的根因。**

对去重后的每条新闻：
1. 使用 `web-access` skill 打开新闻链接，**读取页面正文内容**
2. 从正文中提取：
   - **更完整的中文摘要**（不少于 150 字，英文原文需翻译。必须说明：新闻核心事件、关键数据/数字、涉及人物/机构、背景上下文。禁止一句话概述。保留原文关键数据和专业术语英文原文）
   - **原始作者**（如有署名）
   - **原始发布平台**（转载文章需标注「原载于 XX」）
   - **关键数据/数字**（具体统计、百分比、金额等）
   - **多方观点**（如有引用不同人的说法）
3. 对于无法访问的链接（付费墙/404）：
   - 标记为 `accessLimited`
   - 尝试搜索同事件的其他信源报道作为替代
   - 如找到替代，使用替代来源；如未找到，保留搜索摘要但标记「原文链接受限」

**[检查点 1.5：自检]** 记录全文获取成功/失败/替代的数量统计

### 步骤 2：来源可信度验证（Reviewer）

对每条采集到的新闻，加载 `references/source-verification.md`，执行：
1. **原始出处追溯**：转载站必须追溯到原始出处（见 source-verification.md 步骤 1.5）
2. 来源权威性检查：是否在可信来源白名单中
3. 域名健康度：域名是否为已知新闻站点
4. URL 结构检查：是否为正常新闻页面格式

标记不可信来源的新闻，进入步骤 3 时降权处理。

### 步骤 3：链接有效性验证

对每条新闻链接：
1. 检查 URL 格式是否合法（http/https 协议）
2. 排除已知短链接服务（需展开）
3. 检查是否为登录墙/付费墙页面（如有标记则降分）

**[检查点 2：自检]** 过滤掉链接格式不合法的条目

### 步骤 4：智能评分系统

加载 `references/scoring-rubric.md`，对每条新闻按 **5 个维度**评分（1-10 分）：

| 维度 | 权重 | 说明 |
|------|------|------|
| 来源权威性 | 25% | 白名单来源得高分，**转载站需追溯原始出处** |
| 时效性 | 15% | 24h 内得满分 |
| 相关性 | 20% | 与主题关键词匹配度 |
| 内容深度 | 20% | **全文**信息量和专业度（基于步骤 1.5 获取的内容） |
| 事实标注完整性 | 20% | 是否标注了原始来源、作者、关键数据出处 |

**综合得分 = 各维度得分 × 权重之和**

**门控：只保留综合得分 > 4.0 的新闻。**
**内容质量门控：摘要（基于全文获取后）< 50 字且无具体数据的条目直接过滤，不计入报告。**

### 步骤 5：生成报告（Generator）

1. 加载 `assets/report-template.md` 模板
2. 按主题分组新闻，按得分降序排列
3. 取前 `config.scoring.maxPerTopic`（默认 50）条作为详细条目
4. **溢出处理**：若评分通过的条目超过 maxPerTopic，
   在报告末尾添加"更多新闻速览"章节，以**「总结式标题 + 来源 + 链接」**形式列出溢出条目
5. 填充模板生成 Markdown 报告
6. 统计摘要：总采集数、过滤数、最终保留数、溢出数

### 步骤 6：输出与存档

#### 6.1 临时文件中转

```
所有子 Agent 采集的原始数据、中间结果、浏览器自动化产物统一写入 News/.work/ 目录
文件名格式：{topic}-{source}-{timestamp}.json
浏览器截图：News/.work/screenshots/{topic}-{source}-{n}.png
HTML 快照：News/.work/html-dumps/{source}-{page}-{timestamp}.html
```

**硬性要求：子 Agent 执行浏览器操作时，必须通过 CDP API 或 Playwright 将截图和 HTML 保存到 `News/.work/` 子目录下，禁止输出到项目根目录或其他位置。主 Agent 在分发任务时必须明确告知子 Agent 输出路径。**

#### 6.2 报告生成与存放

```
1. 从 News/.work/ 读取所有采集数据
2. 加载 assets/report-template.md 模板
3. 按主题分组新闻，按得分降序排列
4. 填充模板生成 Markdown 报告
5. 按 config.json 中各主题的 outputDirectory 存放：
   - AI 前沿 → News/AI 前沿/news-digest-{date}.md
   - 前端开发 → News/前端开发/news-digest-{date}.md
6. 确保目标目录存在，不存在则创建
```

#### 6.3 对话输出

```
在对话中展示报告摘要（前 30 条/主题），提示用户文件已存放位置
```

#### 6.4 索引更新

```
每次写入或修改报告文件后，必须更新 KB-INDEX.md：
1. 读取 KB-INDEX.md
2. 检查 News/ 目录的索引条目是否存在
3. 如不存在，添加 News 目录结构说明
4. 更新对应主题下的最新文件引用
5. 写入更新后的 KB-INDEX.md
```

#### 6.5 清理临时文件

```
报告和索引全部写入成功后：
1. 删除 News/.work/ 下本次执行产生的所有临时文件（包括 screenshots/ 和 html-dumps/ 子目录）
2. 检查项目根目录是否存在遗留的 browser_*.png、*.html、articles-page.md 等浏览器中间产物，如有则一并删除
3. 确认清理完成
4. 如果清理失败，记录警告但不阻塞流程
```

---

## 定时任务配置

用户可以通过以下命令设置每日自动执行：

```
帮我设置每天 9:30 自动执行新闻聚合
→ 调用 CronCreate({ cron: "30 9 * * *", prompt: "/news-digest", recurring: true, durable: true })
```

支持的时间配置示例：
- 工作日 9:00：`"0 9 * * 1-5"`
- 每小时：`"7 * * * *"`（避免整点）
- 每天 8:30：`"30 8 * * *"`

---

## 命令

### /news-digest [主题列表]

- 不传参数：执行 config.json 中所有已启用主题
- 传入参数：仅执行指定主题，如 `/news-digest "AI, 前端开发"`

### /news-digest config

- 查看当前配置
- 添加/编辑/删除主题
- 调整评分权重

### /news-digest setup-cron

- 设置每日定时执行任务
- 查看/删除已有定时任务

---

## 注意事项

- 每次执行最多采集 50 条/主题，避免 token 浪费
- **步骤 1 必须使用 `web-access` skill（CDP 模式）访问真实信源，禁止仅用 MCP 搜索工具替代；web-access 初始化失败时才降级为 MCP 搜索**
- **72 小时硬性门控：仅保留 3 天内的新闻，无法确定时间的标记 `timeUnknown` 需人工确认**
- **所有已启用信源（不按权重过滤）每次必须全部触发，每个信源对应一个独立 SubAgent 并行采集**
- **SubAgent 并发限制：每批次最多 2 个并行，批次间间隔 30 秒。禁止一次性启动超过 2 个 SubAgent**
- **[硬性门控] SubAgent 浏览器生命周期**：
  Proxy 由主 Agent 统一启动（步骤 1 第 2 点），SubAgent 禁止各自启动新实例
- **[硬性门控] SubAgent Tab 管理**：
  每个 SubAgent 必须记录自己创建的 tab targetId，结束时逐一关闭；
  主 Agent 每批结束后对比 tab 列表清理遗留，防止 tab 泄漏累积
- **Tab 泄漏后果**：大量 tab 残留会拖慢 Chrome 性能，甚至触发网站反爬风控
- 溢出处理：评分通过的条目超过 `maxPerTopic` 时，在报告末尾添加"更多新闻速览"章节，以「总结式标题 + 来源 + 链接」形式列出
- web-access 搜索失败时，记录错误但不中断 Pipeline
- **步骤 1.5 全文获取不可跳过，仅基于搜索摘要生成报告会导致内容质量不达标**
- 评分 < 4 的新闻不进入报告，但计入统计
- 同一新闻在多信源出现时，保留得分最高的版本
- **转载内容必须标注「原载于 XX」或「作者：XX」，无法追溯原始出处的降权处理**
- **摘要（基于全文获取后）少于 50 字且无具体数据的条目标记为「简讯」或直接过滤**
- **报告中的标题和摘要必须为中文。英文新闻的标题需翻译为中文，摘要需翻译并补充核心内容，不少于 80 字，不得一句话敷衍**
- 报告文件名格式：`news-digest-YYYY-MM-DD.md`
- 子 Agent 采集的临时文件统一存放在 `News/.work/` 及其子目录（screenshots/、html-dumps/），Pipeline 完成后必须删除
- 浏览器自动化产物（截图、HTML dump）严禁输出到项目根目录，必须通过 CDP API 的 `filename` 参数或 Playwright 的 `path` 参数指定到 `News/.work/`
- 每次写入或修改报告文件后，必须更新 `KB-INDEX.md` 索引
- 新主题首次执行时，自动在 `News/` 下创建对应子目录

---

*版本：1.7.0 | 设计模式：Pipeline + Inversion + Generator + Reviewer*
