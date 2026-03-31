---
name: permission-setup
description: 为项目配置 Claude Code 减少询问模式，扫描现有配置和 MCP 命令后生成 permissions 规则
aliases: [configure-permissions, setup-auto-accept]
triggers: [减少询问，自动执行，权限配置，免确认，直接执行]
author: Kei
version: 1.0.0
compatibility:
  minVersion: 3.0.0
  features: [settings.json, MCP, Bash hooks]
---

# Permission Setup - 减少询问配置助手

## 用途

为任意项目快速配置 Claude Code 减少询问模式，通过扫描项目现有配置和全局 MCP 命令，生成定制化的 `settings.local.json` 文件（含 permissions 和 hooks）。

**适用场景**:
- 新项目需要配置自动执行权限
- 现有项目需要添加/修改 permissions 规则
- 需要整合 MCP 工具权限

**不适用场景**:
- 修改全局配置（应编辑 `~/.claude/settings.json`）
- 临时权限调整（使用 `/permissions` 命令即可）

---

## 核心原则

1. **扫描优先**: 先扫描现有配置，再询问新增需求
2. **分离询问**: 项目配置和全局 MCP 分别确认
3. **安全默认**: deny 规则默认包含危险命令
4. **可逆配置**: 生成的配置易于修改和撤销

---

## 工作流程

```
扫描 → 分析 → 询问 → 生成 → 写入 → 验证
```

### 阶段 1：扫描现有配置

**1.1 扫描项目级配置**
```bash
# 查找 .claude/settings*.json 文件
find .claude -name "settings*.json" 2>/dev/null
```

**1.2 扫描全局 MCP 配置**
- 读取 `~/.claude/settings.json` 中的 MCP 配置
- 或询问用户 MCP 服务器名称

**1.3 扫描常见命令**
- 构建命令：`npm run build`, `pnpm run:.*`, `yarn:.*`
- 测试命令：`npm run test`, `vitest`, `jest`
- Git 命令：`git status`, `git diff`, `git add`, `git commit`
- 其他项目特定命令（从 `package.json` 脚本推断）

---

### 阶段 2：分析并生成建议

**2.1 提取现有 permissions**
```json
{
  "existing_allow": ["Read", "Edit", ...],
  "existing_deny": ["Bash(rm -rf *)", ...]
}
```

**2.2 提取 MCP 工具**
```json
{
  "mcp_tools": ["mcp__WebSearch__*", "mcp__next-devtools__*", ...]
}
```

**2.3 生成建议规则**
- 允许：读操作 + 编辑操作 + 扫描到的命令 + MCP 工具
- 禁止：危险命令（rm -rf, sudo, curl|bash, git push --force）

---

### 阶段 3：询问确认

**3.1 项目级 permissions 询问**
```markdown
## 项目级权限配置建议

### 建议允许的命令
- [x] Read, Edit, Write, Glob, Grep（文件操作）
- [x] Bash(npm run:*) - 所有 npm 脚本
- [x] Bash(git status), Bash(git diff) - Git 查看
- [ ] Bash(git add:*), Bash(git commit:*) - Git 提交（需确认）

请确认哪些规则需要添加/修改？
```

**3.2 全局 MCP 工具询问**
```markdown
## MCP 工具权限配置

检测到以下 MCP 服务器:
- mcp__WebSearch__: bailian_web_search
- mcp__next-devtools__: nextjs_index, nextjs_call, ...

建议允许所有 MCP 工具？[Y/n]
```

**3.3 Hooks 配置询问**
```markdown
## Hooks 配置

是否需要配置以下 Hooks?
- [ ] UserPromptSubmit: 知识库检测
- [ ] PostToolUse: 文件格式化
- [ ] Stop: 任务完成通知
```

---

### 阶段 4：生成配置

**4.1 合并配置**
```json
{
  "permissions": {
    "allow": [...],
    "deny": [...]
  },
  "hooks": { ... }
}
```

**4.2 输出预览（Diff 格式）**
```markdown
## 配置预览

### 新增规则
- + "Bash(npm run:*)"
- + "Bash(git add:*)"
- + "mcp__WebSearch__bailian_web_search"

### 修改规则
- ~ "Edit" (新增)

### 保持不变
- "Read", "Glob", "Grep"
```

---

### 阶段 5：写入文件

**5.1 确认输出路径**
- 默认：`.claude/settings.local.json`
- 如文件存在：确认是否覆盖或合并

**5.2 写入配置**
- 使用 Write 工具写入
- 保持 JSON 格式正确（2 空格缩进）

---

### 阶段 6：验证配置

**6.1 验证命令**
```bash
# 验证 JSON 格式
node -e "JSON.parse(require('fs').readFileSync('.claude/settings.local.json'))"
```

**6.2 测试建议**
```markdown
## 测试建议

1. 重启 Claude Code 或输入 `/permissions` 查看生效规则
2. 测试 `npm run build` 是否无需确认
3. 测试 `rm -rf` 是否仍然被拦截
```

---

## 输出格式

### 最终配置示例

```json
{
  "permissions": {
    "allow": [
      "Read",
      "Edit",
      "Write",
      "Glob",
      "Grep",
      "mcp__WebSearch__bailian_web_search",
      "Bash(npm run:*)",
      "Bash(git status)",
      "Bash(git diff)",
      "Bash(git add:*)",
      "Bash(git commit:*)"
    ],
    "deny": [
      "WebSearch",
      "Bash(rm -rf *)",
      "Bash(git push --force)",
      "Bash(curl * | bash)",
      "Bash(sudo *)"
    ]
  },
  "hooks": {
    "UserPromptSubmit": [...]
  }
}
```

---

## 注意事项

### 安全提示
- 不要允许所有 Bash 命令
- `deny` 规则优先，无法被覆盖
- 修改配置后无需重启，立即生效

### 配置优先级
```
项目本地 (.claude/settings.local.json) > 项目级 > 全局
```

### 限制说明
- 无法修改已在会话中生效的权限（需重启会话）
- MCP 工具需要在 settings.json 中预先配置

---

## 触发方式

### 显式命令
```bash
/permission-setup
/configure-permissions
/setup-auto-accept
```

### 隐式触发词
- "减少询问"
- "自动执行"
- "权限配置"
- "免确认"
- "直接执行"

---

*Skill 版本：1.0.0 | 作者：Kei | 创建日期：2026-03-31*
