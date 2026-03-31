---
name: permission-analyzer
description: 分析权限请求日志，生成 permissions 完善建议并支持一键应用
aliases: [analyze-permissions, permission-log]
triggers: [分析权限，权限建议，完善 permissions, 查看权限日志，权限优化]
author: Kei
version: 1.0.1
compatibility:
  minVersion: 3.0.0
  features: [PermissionRequest Hook, analyze-permissions.js]
---

# Permission Analyzer - 权限分析助手

## 用途

分析 `.claude/logs/permission-requests.log` 中的权限请求记录，识别高频请求的命令模式，生成 permissions 完善建议，支持一键应用配置。

**适用场景：**
- 运行 E2E 测试时频繁确认 `pnpm test` 类命令
- 使用多个新命令时每次都需要确认
- 希望渐进式完善 permissions 配置

**不适用场景：**
- 首次配置权限（应使用 `/permission-setup`）
- 临时权限调整（使用 `/permissions allow` 命令即可）

---

## 核心原则

1. **数据驱动**：基于实际请求日志生成建议，不做假设
2. **用户掌控**：每条建议需用户确认后才应用
3. **渐进式完善**：小批量添加，避免一次性开放过多权限
4. **安全默认**：危险命令（rm -rf, sudo 等）永远不会被建议

---

## 工作流程

```
读取日志 → 分析频率 → 生成建议 → 用户确认 → 应用配置 → 验证
```

**详细流程：** 详见 [`references/workflow.md`](references/workflow.md)

### 阶段 1：读取日志

检查 `.claude/logs/permission-requests.log` 是否存在，不存在时引导用户配置 PermissionRequest Hook。

### 阶段 2：分析频率

执行 `node .claude/scripts/analyze-permissions.js [days]` 分析日志，输出高频命令Top 10。

### 阶段 3：生成建议

- 去重：相同基础命令合并为通配符模式（如 `pnpm test:*`）
- 过滤：跳过已有规则，标注危险命令
- 输出：JSON 格式建议配置

### 阶段 4：用户确认

用户可选择：「是」（应用所有）、「跳过 X」（跳过特定规则）、「否」（取消）

### 阶段 5：应用配置

读取 `settings.local.json`，合并新规则，写入配置。

### 阶段 6：验证

验证 JSON 格式，输出测试建议。

---

## 输出格式

### 分析报告格式

```markdown
## 权限请求分析（最近 7 天）

**日志文件：** `.claude/logs/permission-requests.log`
**总请求数：** 156 次
**独立命令：** 12 个

### 高频请求 Top 10

| # | 命令模式 | 请求次数 | 建议规则 | 示例场景 |
|---|----------|----------|----------|----------|
| 1 | pnpm test | 15 | Bash(pnpm test:*) | 运行 E2E 测试 |
```

### 配置预览格式

```markdown
## 配置预览

### 新增规则（3 条）
- + "Bash(pnpm test:*)"
- + "Bash(npx:*)"

### 已有规则（跳过）
- ~ "Bash(npm run:*)" (已存在)

### 过滤规则（安全原因）
- 🚫 "Bash(rm -rf *)" (危险命令)
```

**详细输出示例：** 详见 [`examples/usage-examples.md`](examples/usage-examples.md)

---

## 示例

**典型场景：** 标准分析流程、日志文件不存在、部分应用配置

**边界情况：** 带时间范围分析、所有建议已存在、危险命令过滤、团队项目配置

**详细示例：** 详见 [`examples/usage-examples.md`](examples/usage-examples.md)

---

## 注意事项

### 安全提示

- **不要批量应用所有建议**：逐一确认每条规则的必要性
- **注意通配符范围**：`Bash(pnpm:*)` 会允许所有 pnpm 命令
- **deny 规则优先**：即使在 allow 中添加，deny 规则仍会拦截

### 日志管理

- **定期清理**：建议每月清理一次日志文件
- **日志轮转**：生产环境建议配置日志大小限制

### 限制说明

- **无法追溯历史**：日志只记录配置 Hook 之后的请求
- **跨会话分析**：需要累积多个会话的数据才能生成有效建议
- **不能自动绕过确认**：修改配置后需在新会话中生效

**详细工作流程：** 详见 [`references/workflow.md`](references/workflow.md)

---

## 相关 Skill

| Skill | 用途 |
|-------|------|
| `/permission-setup` | 初始权限配置 |
| `/permission-analyzer` | 渐进式完善权限 |
| `/permissions` | 查看/修改当前权限 |

---

## 资源索引

| 资源 | 文件 | 用途 |
|------|------|------|
| 分析脚本 | `.claude/scripts/analyze-permissions.js` | 日志分析 |
| 日志文件 | `.claude/logs/permission-requests.log` | 权限请求记录 |
| 配置文件 | `.claude/settings.local.json` | 权限规则 |
| **详细工作流程** | [`references/workflow.md`](references/workflow.md) | 6 阶段流程详解 |
| **使用示例** | [`examples/usage-examples.md`](examples/usage-examples.md) | 典型场景示例 |

---

*Skill 版本：1.0.1 | 作者：Kei | 创建日期：2026-03-31*
*更新：2026-03-31 优化主文件结构，详细流程移至 references/，示例移至 examples/*
