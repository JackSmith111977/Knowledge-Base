# Permission Setup - 参考资料

## 权限类型说明

| 权限 | 说明 | 风险等级 |
|------|------|----------|
| `Read` | 读取文件内容 | 无 |
| `Edit` | 编辑现有文件 | 低 |
| `Write` | 创建新文件 | 低 |
| `Glob` | 文件搜索 | 无 |
| `Grep` | 内容搜索 | 无 |
| `Bash(...)` | 执行 Shell 命令 | 中 - 高 |

## 规则语法

| 规则格式 | 说明 | 示例 |
|----------|------|------|
| `Bash(command)` | 仅允许精确匹配的命令 | `Bash(git status)` |
| `Bash(command:*)` | 允许命令加任意参数 | `Bash(git log:*)` |
| `Bash(pattern*)` | 通配符匹配 | `Bash(npm run:*)` |
| `Read/Write/Edit` | 文件操作权限 | `Edit`, `Write` |

## 冒号 `:` 的特殊含义

```json
"Bash(git log)"    // 只允许 git log（不带参数）
"Bash(git log:*)"  // 允许 git log 加任意参数，如 git log --oneline
```

## 配置文件层级

| 配置文件 | 路径 | 用途 | 是否提交 Git |
|----------|------|------|--------------|
| **全局配置** | `~/.claude/settings.json` | 个人习惯、所有项目共享 | 否 |
| **项目配置** | `<项目>/.claude/settings.json` | 团队规范、项目特定规则 | 是 |
| **本地配置** | `<项目>/.claude/settings.local.json` | 临时规则、个人偏好 | 否 |

## 优先级规则

```
项目本地 > 项目级 > 全局
```

**重要：**
- 权限规则是合并生效的
- `deny` 规则永远是最高优先级，任何地方的 `deny` 都不会被覆盖

## 危险命令列表

以下命令应该默认加入 `deny` 规则：

```json
"Bash(rm -rf *)"
"Bash(git push --force)"
"Bash(curl * | bash)"
"Bash(sudo *)"
"Bash(:*)"  // 所有命令（仅调试时使用）
```

## 常用 MCP 工具前缀

| MCP 服务器 | 工具前缀 | 示例 |
|------------|----------|------|
| WebSearch | `mcp__WebSearch__` | `mcp__WebSearch__bailian_web_search` |
| Next DevTools | `mcp__next-devtools__` | `mcp__next-devtools__nextjs_index` |
| Playwright | `mcp__playwright__` | `mcp__playwright__browser_navigate` |

## 测试命令示例

```bash
# 验证 JSON 格式
node -e "JSON.parse(require('fs').readFileSync('.claude/settings.local.json'))"

# 查看当前生效的权限（在 Claude Code 中）
/permissions
```
