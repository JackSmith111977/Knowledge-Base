# 输出格式规范

> 本文档描述 project-migration Skill 生成的各类文档格式规范

---

## 现状报告格式

输出到 `docs/migration/current-status.md`，详见 `templates/assessment-template.md`。

### 必需章节

1. 项目基础信息
2. 应用分析（多应用时分列）
3. 现有文档评估
4. 技术债务初步评估
5. 依赖关系图
6. 推荐迁移策略（6R）

---

## 迁移计划格式

输出到 `docs/migration/migration-plan.md`，详见 `templates/migration-plan-template.md`。

### 必需章节

1. 迁移目标
2. 迁移策略（6R）
3. 阶段划分
   - 基础建设（第 1-2 周）
   - 全面推广（第 3-6 周）
   - 持续优化（第 7-12 周）
4. 时间表和里程碑
5. 优先级模块
6. 风险与应对
7. 度量指标

---

## 文档详细程度定义

| 版本 | 生成文件 |
|------|----------|
| **精简版** | CLAUDE.md, TECH_STACK.md, migration-plan.md |
| **标准版** | 精简版 + PRD.md, APP_FLOW.md, current-status.md |
| **完整版** | 标准版 + FRONTEND_GUIDELINES.md, BACKEND_STRUCTURE.md, IMPLEMENTATION_PLAN.md, specs/ |

### 精简版

适合个人项目、快速原型。

### 标准版

适合小团队、中等复杂度项目。

### 完整版

适合企业项目、长期维护项目。

---

## .claude/ 目录文档规范

### CLAUDE.md

必需章节：
1. 项目概述（目标、问题、用户）
2. 技术栈详情
3. 代码规范约定
4. 开发命令
5. Agent 对话规约
6. 重要约定

### progress.txt

必需章节：
1. 项目基本信息
2. 状态字段（已完成/进行中/接下来）
3. 当前阶段

---

## docs/main/ 目录文档规范

### PRD.md

必需章节：
1. 产品愿景
2. 问题陈述
3. 目标用户画像
4. 核心功能列表（MoSCoW 优先级）
5. 非功能需求
6. 成功指标
7. 约束条件
8. 依赖关系

### APP_FLOW.md

必需章节：
1. 用户流程图/描述
2. 系统架构说明
3. 数据流说明
4. 核心模块定义
5. 接口设计
6. 状态管理说明
7. 路由结构

### TECH_STACK.md

必需章节：
1. 前端技术栈详情
2. 后端技术栈详情
3. 数据库详情
4. 云服务/部署平台
5. 第三方服务
6. 开发工具
7. 版本管理流程

---

*文档版本：1.0.0 | project-migration Skill*
