---
name: permission-analyzer
description: 分析权限请求日志，生成 permissions 完善建议并支持一键应用
aliases: [analyze-permissions, permission-log]
triggers: [分析权限，权限建议，完善 permissions, 查看权限日志，权限优化]
author: Kei
version: 1.0.0
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

### 阶段 1：读取日志

**1.1 检查日志文件**
```bash
ls -la .claude/logs/permission-requests.log
```

**1.2 不存在时的处理**
```markdown
## 日志文件不存在

尚未记录任何权限请求。

**解决方案：**

1. 运行 `/permission-setup` 配置 PermissionRequest Hook
2. 或手动添加以下配置到 `.claude/settings.local.json`：

```json
{
  "hooks": {
    "PermissionRequest": [{
      "matcher": ".*",
      "hooks": [{
        "type": "command",
        "command": "echo \"$(date '+%Y-%m-%d %H:%M:%S') | $PERMISSION_REQUEST | $USER_PROMPT\" >> .claude/logs/permission-requests.log",
        "timeout": 5
      }]
    }]
  }
}
```
```

### 阶段 2：分析频率

**2.1 执行分析脚本**
```bash
node .claude/scripts/analyze-permissions.js [days]
```

**2.2 输出格式**
```markdown
### 权限请求分析（最近 7 天）

| 命令模式 | 请求次数 | 建议规则 | 示例场景 |
|----------|----------|----------|----------|
| pnpm test | 15 | Bash(pnpm test:*) | 运行 E2E 测试 |
| npx playwright | 8 | Bash(npx:*) | Playwright 测试 |
```

### 阶段 3：生成建议

**3.1 去重处理**
- 相同基础命令（如 `pnpm test` 和 `pnpm test:e2e`）合并为 `Bash(pnpm test:*)`
- 最多显示 10 条建议

**3.2 过滤已有规则**
- 比对当前 `settings.local.json` 的 permissions.allow
- 只显示新增规则

**3.3 安全检查**
- 过滤危险命令（rm -rf, sudo, curl|bash 等）
- 不过滤但标注高风险命令

### 阶段 4：用户确认

**4.1 输出建议配置**
```markdown
## 建议添加的配置

将以下 3 条规则添加到 `.claude/settings.local.json`：

```json
[
  "Bash(pnpm test:*)",
  "Bash(npx:*)",
  "Bash(playwright:*)"
]
```

请确认：
- [ ] 以上规则均为需要频繁使用的命令
- [ ] 理解通配符 `:*` 会匹配所有参数变体
- [ ] 知晓这些规则会立即生效（无需重启）

回复「是」应用配置，或指定要跳过的规则。
```

**4.2 用户可选择**
- 「是」- 应用所有建议
- 「跳过 npx」- 跳过特定规则
- 「否」- 取消本次操作

### 阶段 5：应用配置

**5.1 读取当前配置**
```json
{
  "permissions": {
    "allow": ["Read", "Edit", ...]
  }
}
```

**5.2 合并新规则**
```json
{
  "permissions": {
    "allow": ["Read", "Edit", ..., "Bash(pnpm test:*)", ...]
  }
}
```

**5.3 写入配置**
- 保持 JSON 格式正确（2 空格缩进）
- 保留注释（如有）

### 阶段 6：验证

**6.1 验证命令**
```bash
node -e "JSON.parse(require('fs').readFileSync('.claude/settings.local.json'))"
```

**6.2 输出结果**
```markdown
## ✅ 配置已更新

新增规则：
- Bash(pnpm test:*)
- Bash(npx:*)
- Bash(playwright:*)

**测试建议：**
1. 运行 `pnpm test` 验证是否无需确认
2. 输入 `/permissions` 查看完整规则列表
```

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
| 2 | npx playwright | 8 | Bash(npx:*) | Playwright 测试 |
| ... | ... | ... | ... | ... |
```

### 配置预览格式

```markdown
## 配置预览

### 新增规则（5 条）
- + "Bash(pnpm test:*)"
- + "Bash(npx:*)"
- + "Bash(playwright:*)"
- + "Bash(git push:*)"
- + "Bash(node:*)"

### 已有规则（跳过）
- ~ "Bash(npm run:*)" (已存在)

### 过滤规则（安全原因）
- 🚫 "Bash(rm -rf *)" (危险命令)
```

---

## 示例

### 示例 1：标准分析流程

**用户：** `/permission-analyzer`

**响应：**
```
📊 开始分析权限请求...

## 权限请求分析（最近 7 天）

| 命令模式 | 请求次数 | 建议规则 | 示例场景 |
|----------|----------|----------|----------|
| pnpm test | 15 | Bash(pnpm test:*) | 运行 E2E 测试 |
| npx playwright | 8 | Bash(npx:*) | Playwright 测试 |

## 建议添加的配置

```json
[
  "Bash(pnpm test:*)",
  "Bash(npx:*)"
]
```

是否应用以上配置？回复「是」确认。
```

### 示例 2：日志文件不存在

**用户：** `/permission-analyzer`

**响应：**
```
📋 日志文件不存在

尚未记录任何权限请求。

💡 解决方案：

1. 运行 `/permission-setup` 配置 PermissionRequest Hook
2. 或手动添加配置到 settings.local.json

是否现在配置 PermissionRequest Hook？回复「是」自动写入。
```

### 示例 3：部分应用配置

**用户：** `/permission-analyzer`

**助手：** 输出 5 条建议

**用户：** 跳过 npx

**助手：**
```
已跳过 Bash(npx:*)

应用以下 4 条规则：
- Bash(pnpm test:*)
- Bash(playwright:*)
- ...

确认？
```

---

## 注意事项

### 安全提示

- **不要批量应用所有建议**：逐一确认每条规则的必要性
- **注意通配符范围**：`Bash(pnpm:*)` 会允许所有 pnpm 命令
- **deny 规则优先**：即使在 allow 中添加，deny 规则仍会拦截

### 日志管理

- **定期清理**：建议每月清理一次日志文件
- **日志轮转**：生产环境建议配置日志大小限制
- **敏感信息**：避免在日志中记录敏感命令

### 限制说明

- **无法追溯历史**：日志只记录配置 Hook 之后的请求
- **跨会话分析**：需要累积多个会话的数据才能生成有效建议
- **不能自动绕过确认**：修改配置后需在新会话中生效

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

---

*Skill 版本：1.0.0 | 作者：Kei | 创建日期：2026-03-31*
