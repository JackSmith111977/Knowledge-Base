---
name: permission-setup
description: 为项目配置 Claude Code 减少询问模式，扫描现有配置和 MCP 命令后生成 permissions 规则，支持渐进式完善
aliases: [configure-permissions, setup-auto-accept]
triggers: [减少询问，自动执行，权限配置，免确认，直接执行，Fetch 免确认，完善权限]
author: Kei
version: 1.3.0
compatibility:
  minVersion: 3.0.0
  features: [settings.json, MCP, Bash hooks, Agent, PermissionRequest logging]
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
5. **渐进式完善**: 通过 PermissionRequest 日志持续学习和完善权限配置

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

**1.4 扫描常用工具**
- `Agent` - 多任务/并发任务场景（如 `/parallel-task`）
- `Read`, `Edit`, `Write`, `Glob`, `Grep` - 基础文件操作
- `Bash` -  shell 命令执行

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

**2.3 检测 Agent 使用场景**
- 检查项目中是否存在并发任务需求（如 E2E 测试、代码审查）
- 检查是否使用 `/parallel-task` 或类似 Skill

**2.4 生成建议规则**
- 允许：读操作 + 编辑操作 + 扫描到的命令 + MCP 工具 + WebFetch + Agent（默认允许）
- 禁止：危险命令（rm -rf, sudo, curl|bash, git push --force）

**2.4 WebFetch 配置**
```json
{
  "skipWebFetchPreflight": true  // 跳过 WebFetch 确认
}
```

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

**3.3 WebFetch 配置询问**
```markdown
## WebFetch 权限配置

检测到需要使用 WebFetch 的场景：
- 抓取网页内容进行数据分析
- 获取外部文档资料

建议配置：
- [ ] skipWebFetchPreflight: true（跳过 WebFetch 确认）
- [ ] WebFetch(domain:example.com)（指定允许域名）

请确认是否需要配置？
```

**3.4 Hooks 配置询问**
```markdown
## Hooks 配置

是否需要配置以下 Hooks?
- [ ] UserPromptSubmit: 知识库检测
- [ ] PostToolUse: 文件格式化
- [ ] Stop: 任务完成通知
```

**3.5 自身配置修改权限询问**
```markdown
## 配置修改权限

是否允许 Claude Code 修改自身配置文件？

**允许修改的文件：**
- [ ] `.claude/settings.local.json` - 项目本地配置
- [ ] `.claude/settings.json` - 项目级配置（如存在）

**允许的操作：**
- [ ] `Edit` - 修改现有配置
- [ ] `Write` - 创建/覆盖配置文件

**安全建议：**
- 建议允许修改 `.claude/settings.local.json`（本地配置，不提交 Git）
- 谨慎允许修改 `.claude/settings.json`（可能影响团队配置）

请选择允许的权限范围。
```

**3.6 Agent 工具权限询问**
```markdown
## Agent 工具权限配置

检测到以下 Agent 使用场景：
- /parallel-task - 并发执行多个子任务
- 其他需要委派给 SubAgent 的任务

建议配置：
- [x] Agent - 允许启动 SubAgent 执行任务（默认允许）

请确认是否需要修改？
```

**配置说明：**

| 选项 | 适用场景 | 风险等级 |
|------|----------|----------|
| 允许 Agent | 需要使用并发任务、SubAgent 委派 | 低 |
| 禁止 Agent | 不需要 SubAgent 功能 | 无 |

**权限规则生成：**
- 如选择允许：添加 `Agent` 到 allow 列表
- 如不允许：添加 `Agent` 到 deny 列表

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

**4.2 自身配置权限规则生成**

根据用户选择生成相应规则：

| 用户选择 | 生成规则 |
|----------|----------|
| 允许修改 `settings.local.json` | `+ Edit(.claude/settings.local.json)`, `+ Write(.claude/settings.local.json)` |
| 允许修改 `settings.json` | `+ Edit(.claude/settings.json)`, `+ Write(.claude/settings.json)` |
| 不允许自动修改 | `+ deny Edit(.claude/settings*.json)`, `+ deny Write(.claude/settings*.json)` |
| 允许 Agent 工具 | `+ Agent` |
| 不允许 Agent 工具 | `+ deny Agent` |

**4.3 输出预览（Diff 格式）**
```markdown
## 配置预览

### 新增规则
- + "Bash(npm run:*)"
- + "Bash(git add:*)"
- + "mcp__WebSearch__bailian_web_search"
- + "Edit(.claude/settings.local.json)"（新增）
- + "Write(.claude/settings.local.json)"（新增）

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

### 阶段 7：渐进式完善权限（新增）

**7.1 配置 PermissionRequest Hook 日志记录**

在初始化配置时，自动添加权限请求日志 Hook：

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

**7.2 日志文件结构**

日志文件格式（`.claude/logs/permission-requests.log`）：
```
2026-03-31 10:30:00 | Bash(pnpm test:e2e) | 运行 E2E 测试
2026-03-31 10:32:15 | Bash(npx playwright test) | 使用 Playwright 测试
2026-03-31 10:35:00 | Bash(pnpm test:e2e) | 再次运行测试
```

**7.3 分析并生成建议**

创建分析脚本 `.claude/scripts/analyze-permissions.js`：

```javascript
/**
 * 分析权限请求日志，生成完善建议
 * 用法：node .claude/scripts/analyze-permissions.js [days]
 */

const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, '../logs/permission-requests.log');
const days = parseInt(process.argv[2]) || 7; // 默认分析最近 7 天

// 读取日志
if (!fs.existsSync(logFile)) {
  console.log('日志文件不存在，尚未记录任何权限请求');
  process.exit(0);
}

const lines = fs.readFileSync(logFile, 'utf8').split('\n').filter(Boolean);
const cutoff = new Date();
cutoff.setDate(cutoff.getDate() - days);

// 提取命令并统计
const commandCounts = {};
const commandExamples = {};

lines.forEach(line => {
  const parts = line.split(' | ');
  if (parts.length < 3) return;
  
  const timestamp = new Date(parts[0]);
  if (timestamp < cutoff) return;
  
  const match = parts[1].match(/Bash\(([^)]+)\)/);
  if (!match) return;
  
  const cmd = match[1];
  commandCounts[cmd] = (commandCounts[cmd] || 0) + 1;
  commandExamples[cmd] = parts[2] || '';
});

// 生成建议规则
const suggestions = [];
const sorted = Object.entries(commandCounts).sort((a, b) => b[1] - a[1]);

sorted.forEach(([cmd, count]) => {
  // 跳过已在 allow 列表的命令
  const baseCmd = cmd.split(':')[0] || cmd.split(' ')[0];
  suggestions.push({
    cmd: cmd,
    baseCmd: baseCmd,
    count: count,
    example: commandExamples[cmd],
    suggestion: `Bash(${baseCmd}:*)`
  });
});

// 输出去重后的建议
const uniqueSuggestions = suggestions.filter((v, i, a) => 
  a.findIndex(s => s.baseCmd === v.baseCmd) === i
).slice(0, 10); // 最多 10 条

console.log('=== 权限请求分析（最近${days}天）===\n');
console.log('| 命令模式 | 请求次数 | 建议规则 | 示例场景 |');
console.log('|----------|----------|----------|----------|');

uniqueSuggestions.forEach(s => {
  console.log(`| ${s.baseCmd} | ${s.count} | Bash(${s.baseCmd}:*) | ${s.example.slice(0, 20)}... |`);
});

console.log('\n=== 建议添加的配置 ===\n');
console.log('将以下规则添加到 `.claude/settings.local.json` 的 permissions.allow：\n');
const uniqueRules = [...new Set(uniqueSuggestions.map(s => `Bash(${s.baseCmd}:*)`))];
console.log(JSON.stringify(uniqueRules, null, 2));
```

**7.4 创建 `/permission-analyzer` Skill**

创建 `.claude/skills/permission-analyzer/SKILL.md`：

```markdown
---
name: permission-analyzer
description: 分析权限请求日志，生成 permissions 完善建议
aliases: [analyze-permissions, permission-log]
triggers: [分析权限，权限建议，完善 permissions, 查看权限日志]
version: 1.0.0
---

# Permission Analyzer - 权限分析助手

## 用途

分析 `.claude/logs/permission-requests.log` 中的权限请求记录，识别高频请求的命令模式，生成 permissions 完善建议。

## 工作流程

1. 读取权限请求日志
2. 统计各命令的请求频率
3. 识别可合并的通配符模式
4. 输出建议配置
5. 询问用户是否应用

## 输出格式

```markdown
## 权限请求分析（最近 7 天）

| 命令模式 | 请求次数 | 建议规则 | 示例场景 |
|----------|----------|----------|----------|
| pnpm test | 15 | Bash(pnpm test:*) | 运行 E2E 测试 |
| npx playwright | 8 | Bash(npx:*) | Playwright 测试 |

## 建议添加的配置

将以下规则添加到 `.claude/settings.local.json`：

```json
"Bash(pnpm test:*)",
"Bash(npx:*)"
```

是否应用以上配置？回复"是"自动写入。
```

## 相关 Skill

- `/permission-setup` - 初始权限配置
- `/permission-analyzer` - 渐进式完善
```

**7.5 使用方式**

```bash
# 分析最近 7 天的权限请求
/permission-analyzer

# 分析最近 30 天
/permission-analyzer 30

# 应用建议配置
是
```

---

## 输出格式

### 最终配置示例

```json
{
  "skipWebFetchPreflight": true,
  "permissions": {
    "allow": [
      "Read",
      "Edit",
      "Write",
      "Glob",
      "Grep",
      "mcp__WebSearch__bailian_web_search",
      "mcp__playwright__*",
      "Agent",
      "WebFetch(domain:*)",
      "Bash(npm run:*)",
      "Bash(git status)",
      "Bash(git diff)",
      "Bash(git add:*)",
      "Bash(git commit:*)",
      "Edit(.claude/settings.local.json)",
      "Write(.claude/settings.local.json)"
    ],
    "deny": [
      "WebSearch",
      "Bash(rm -rf *)",
      "Bash(git push --force)",
      "Bash(curl * | bash)",
      "Bash(sudo *)",
      "Edit(.claude/settings.json)",
      "Write(.claude/settings.json)"
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

### 配置修改权限说明
- 允许修改 `settings.local.json`：适合个人项目，配置不提交 Git
- 允许修改 `settings.json`：适合团队项目，配置会提交 Git
- 默认建议：仅允许修改 `settings.local.json`，保护团队配置

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
/permission-setup           # 初始配置
/permission-analyzer        # 分析日志并完善
/configure-permissions
/setup-auto-accept
```

### 隐式触发词
- "减少询问"
- "自动执行"
- "权限配置"
- "免确认"
- "直接执行"
- "完善权限"
- "分析权限请求"

---

*Skill 版本：1.3.0 | 作者：Kei | 创建日期：2026-03-31*
*更新：
- 2026-03-31 增加"是否允许 Claude Code 修改自身配置"询问选项，支持分别配置 settings.local.json 和 settings.json 的编辑/写入权限
- 2026-03-31 增加 Agent 工具支持，默认允许使用 SubAgent 执行任务
- 2026-03-31 增加渐进式完善权限功能（阶段 7），新增 PermissionRequest Hook 日志记录和 /permission-analyzer 命令
