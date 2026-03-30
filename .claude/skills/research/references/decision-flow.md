# Research 决策流程

> research Skill 完整决策点与流程控制

**更新时间：** 2026-03-30 | **版本：** 1.0.0

---

## 完整流程图

```mermaid
flowchart TD
    Start[用户调研请求] --> Phase0[阶段 0: KB-INDEX 检查]

    Phase0 --> CheckIdx{KB-INDEX 存在？}
    CheckIdx -->|否 | CreateIdx[扫描并创建索引]
    CheckIdx -->|是 | UseIdx[使用现有索引]

    CreateIdx --> Phase1
    UseIdx --> Phase1[阶段 1: 需求澄清与重复检测]

    Phase1 --> Scan{发现相似文档？}
    Scan -->|是 | Report[输出检测报告]
    Scan -->|否 | PreSurvey[继续预调研]

    Report --> UserDecide{用户决策}
    UserDecide -->|合并 | MergeMode[进入更新模式]
    UserDecide -->|单独 | PreSurvey
    UserDecide -->|取消 | End[结束]

    PreSurvey --> Phase2[阶段 2: 预调研与位置推荐]

    Phase2 --> QueryIdx{索引中有主题？}
    QueryIdx -->|是 | UseRec[使用索引推荐]
    QueryIdx -->|否 | Analyze[分析属性推荐]

    UseRec --> Location[输出推荐位置]
    Analyze --> Location

    Location --> Outline[生成调研大纲]

    Outline --> Confirm1{用户确认大纲？}
    Confirm1 -->|否 | Revise[修改大纲]
    Confirm1 -->|是 | Phase3[阶段 3: 分章节调研]

    Revise --> Confirm1

    Phase3 --> AskSA{是否启用 SubAgent?}
    AskSA -->|是，大型主题 | SAMode[SubAgent 并行模式]
    AskSA -->|否，标准模式 | StdMode[标准顺序模式]

    SAMode --> Dispatch[分发章节给 SubAgent]
    Dispatch --> Wait[等待完成]
    Wait --> Merge[整合各章节]

    StdMode --> Chapter[逐章执行]
    Chapter --> Merge[整合输出]

    Merge --> Phase4[阶段 4: 整合与索引更新]

    Phase4 --> UpdateIdx{主题新收录？}
    UpdateIdx -->|是 | AddIdx[更新 KB-INDEX]
    UpdateIdx -->|否 | SkipIdx[跳过索引更新]

    AddIdx --> FinalDoc[保存最终文档]
    SkipIdx --> FinalDoc

    FinalDoc --> Phase5[阶段 5: Review 检查]

    Phase5 --> Check{检查通过？}
    Check -->|否 | Fix[修复问题]
    Check -->|是 | Complete[完成]

    Fix --> Check

    Complete --> End
```

---

## 决策点清单

### 决策点 1：KB-INDEX 存在性
- **位置：** 阶段 0
- **分支：** 创建新索引 / 使用现有索引
- **自动化：** 自动检测并处理

### 决策点 2：重复文档检测
- **位置：** 阶段 1
- **分支：** 发现相似 / 无相似
- **用户参与：** 是（检测报告）

### 决策点 3：用户处理重复
- **位置：** 阶段 1 输出后
- **选项：**
  - 合并到已有文档
  - 单独创建新文档
  - 取消调研
- **用户参与：** 是

### 决策点 4：位置推荐
- **位置：** 阶段 2
- **分支：** 索引中有推荐 / 分析属性推荐
- **用户参与：** 是（选择推荐位置）

### 决策点 5：调研大纲确认
- **位置：** 阶段 2 输出后
- **选项：** 确认 / 修改
- **用户参与：** 是

### 决策点 6：SubAgent 模式选择（新增）
- **位置：** 阶段 3 开始前
- **选项：**
  - SubAgent 并行模式（推荐用于≥6 章）
  - 标准顺序模式
- **判断依据：** 章节数量、主题复杂度
- **用户参与：** 是

### 决策点 7：KB-INDEX 更新
- **位置：** 阶段 4
- **分支：** 新主题需更新 / 已有主题跳过
- **自动化：** 自动检测并处理

### 决策点 8：Review 检查
- **位置：** 阶段 5
- **分支：** 通过 / 需修复
- **自动化：** 自动检查，需人工修复

---

## 用户确认点汇总

| 确认点 | 阶段 | 确认内容 | 默认选项 |
|--------|------|----------|----------|
| 重复处理 | 阶段 1 | 合并/单独/取消 | 需用户选择 |
| 存储位置 | 阶段 2 | 选择推荐位置 | 首选推荐 |
| 调研大纲 | 阶段 2 | 确认章节结构 | 需用户确认 |
| **SubAgent 模式** | 阶段 3 | **并行/顺序** | **根据规模推荐** |
| Review 修复 | 阶段 5 | 确认修复方案 | 自动修复优先 |

---

## SubAgent 模式详细决策

### 判断是否推荐 SubAgent

```
if 章节数量 >= 6:
    推荐 SubAgent 模式
elif 章节数量 >= 4 AND 主题复杂度高:
    推荐 SubAgent 模式（可选）
else:
    推荐标准模式
```

### SubAgent 分组策略

| 章节数 | 分组数 | 每章 SubAgent | 预计加速比 |
|--------|--------|---------------|------------|
| 6-8 章 | 2-3 组 | 1 个/章 | 2-3x |
| 9-12 章 | 3-4 组 | 1 个/章 | 3-4x |
| ≥13 章 | 4-6 组 | 1 个/章 | 4-6x |

---

*参考文档版本：1.0.0 | research Skill v7.0.0+*
