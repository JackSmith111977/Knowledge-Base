# Permission Analyzer 使用示例

> 典型使用场景与边界情况示例

---

## 示例 1：标准分析流程

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

**用户：** 是

**响应：**
```
✅ 配置已更新

新增规则：
- Bash(pnpm test:*)
- Bash(npx:*)

测试建议：运行 `pnpm test` 验证是否无需确认
```

---

## 示例 2：日志文件不存在

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

---

## 示例 3：部分应用配置

**用户：** `/permission-analyzer`

**助手：** 输出 5 条建议

**用户：** 跳过 npx

**助手：**
```
已跳过 Bash(npx:*)

应用以下 4 条规则：
- Bash(pnpm test:*)
- Bash(playwright:*)
- Bash(git push:*)
- Bash(node:*)

确认？
```

**用户：** 确认

**助手：**
```
✅ 配置已更新（4 条规则）

跳过：Bash(npx:*)
```

---

## 示例 4：带时间范围分析

**用户：** `/permission-analyzer 30`

**响应：**
```
## 权限请求分析（最近 30 天）

**日志文件：** `.claude/logs/permission-requests.log`
**总请求数：** 342 次
**独立命令：** 28 个

### 高频请求 Top 10

| # | 命令模式 | 请求次数 | 建议规则 | 示例场景 |
|---|----------|----------|----------|----------|
| 1 | pnpm test | 45 | Bash(pnpm test:*) | 运行 E2E 测试 |
| 2 | npx playwright | 32 | Bash(npx:*) | Playwright 测试 |
| 3 | git commit | 28 | Bash(git commit:*) | 提交代码 |
| ... | ... | ... | ... | ... |
```

---

## 示例 5：所有建议已存在

**用户：** `/permission-analyzer`

**响应：**
```
## 权限请求分析（最近 7 天）

✅ 所有建议的规则已存在于当前配置中

无需更新配置。
```

---

## 示例 6：危险命令过滤

**用户：** `/permission-analyzer`

**响应：**
```
## 建议添加的配置

```json
[
  "Bash(pnpm test:*)",
  "Bash(npx:*)"
]
```

### 已过滤（安全原因）

- 🚫 Bash(rm -rf *) - 危险命令，永不允许
- 🚫 Bash(sudo *) - 需要管理员权限，需手动确认

是否应用以上配置？
```

---

## 示例 7：团队项目配置

**场景：** 团队共享项目，需要修改 `settings.json` 而非`settings.local.json`

**用户：** `/permission-analyzer --global`

**响应：**
```
## 建议添加的配置（团队级）

将以下规则添加到 `.claude/settings.json`：

```json
[
  "Bash(pnpm test:*)",
  "Bash(npx:*)"
]
```

⚠️ 注意：此配置会提交到 Git，影响团队成员

确认？
```

---

*使用示例 | 最后更新：2026-03-31*
