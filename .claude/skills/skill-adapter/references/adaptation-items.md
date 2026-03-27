# 适配项类型定义

本文档定义 skill-adapter 扫描和识别的适配项类型。

---

## 适配项类型

### 1. 硬编码路径 (Hardcoded Paths)

**识别模式：**
- 绝对路径：`/Users/xxx/`、`C:\Users\xxx\`
- 项目特定目录：`Knowledge Base/`、`docs/`、`src/`
- 相对路径引用上级目录：`../../`

**示例：**
```markdown
存储位置：Knowledge Base/[主题]/[主题名] 核心知识体系.md
```

**适配方式：**
- 询问用户新项目中对应的路径
- 替换为新路径

---

### 2. 脚本依赖 (Script Dependencies)

**识别模式：**
- `.claude/scripts/` 引用
- `node` 命令调用脚本
- Shell 脚本路径

**示例：**
```bash
node .claude/scripts/kb-checker.js --detect "$USER_PROMPT"
```

**适配方式：**
- 确认脚本是否需要一起迁移
- 确认脚本路径是否需要更新
- 确认 Node.js 环境是否存在

---

### 3. Hook 配置 (Hook Configuration)

**识别模式：**
- `settings.local.json` 中的 `hooks` 配置
- `UserPromptSubmit`、`PostToolUse` 等事件
- 钩子命令引用

**示例：**
```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "command": "node .claude/scripts/xxx.js"
      }
    ]
  }
}
```

**适配方式：**
- 确认是否需要添加到新项目的 settings.local.json
- 确认命令路径是否需要更新

---

### 4. 领域特定配置 (Domain-Specific Config)

**识别模式：**
- 技术名词库：`TECH_ENTITIES`
- 命令模式库：`COMMAND_PATTERNS`
- 业务特定关键词

**示例：**
```javascript
const TECH_ENTITIES = [
  { name: 'React', aliases: ['react', 'React'] },
  // ...
];
```

**适配方式：**
- 询问是否需要保留所有条目
- 询问是否需要添加新项目的特定条目

---

### 5. 文件引用 (File References)

**识别模式：**
- `references/` 目录引用
- `checklists/` 目录引用
- `templates/` 目录引用
- 相对路径引用

**示例：**
```markdown
详见：`references/gotchas.md`
```

**适配方式：**
- 确认引用文件是否存在
- 确认路径是否需要更新

---

### 6. MCP 服务依赖 (MCP Dependencies)

**识别模式：**
- `mcp__` 前缀的工具调用
- MCP 服务配置引用

**示例：**
```
mcp__WebSearch__bailian_web_search
```

**适配方式：**
- 确认新项目是否配置了相同的 MCP 服务
- 如未配置，指导用户配置或禁用相关功能

---

### 7. 环境变量 (Environment Variables)

**识别模式：**
- `$VAR`、`${VAR}` 格式
- `process.env.VAR` 引用

**示例：**
```bash
echo $PROJECT_DIR
```

**适配方式：**
- 询问环境变量是否已定义
- 指导用户配置环境变量

---

### 8. 触发器配置 (Trigger Configuration)

**识别模式：**
- YAML Frontmatter 中的 `triggers:` 字段
- YAML Frontmatter 中的 `commands:` 字段
- YAML Frontmatter 中的 `aliases:` 字段

**示例：**
```yaml
---
name: research
triggers: [调研，研究，整理一份]
commands: [/research]
aliases: [skill-adapter, skill-migrate]
---
```

**适配方式：**
- **冲突检查**：检查新项目是否已有相同的命令名称
- **语境适配**：询问是否需要修改触发词以适应新项目的语境
- **触发词调整**：询问是否需要添加新项目特定的触发词

**处理建议：**
| 字段 | 适配策略 |
|------|----------|
| `commands:` | 检查与新项目已有 Skill 的命令冲突 |
| `triggers:` | 根据新项目业务语境调整触发词 |
| `aliases:` | 通常保留原样，除非有特殊需求 |

---

## 优先级定义

| 优先级 | 说明 | 处理建议 |
|--------|------|----------|
| **高** | 影响核心功能 | 必须立即处理 |
| **中** | 影响部分功能 | 建议处理 |
| **低** | 可选优化 | 可跳过 |

---

## 路径归一化与合并规则

### 相同路径合并策略

**目的：** 避免对相同路径配置的重复提问，提升适配效率

**规则：**
1. **识别阶段**：扫描时记录每个路径值及其出现位置
2. **分组阶段**：将相同路径值的适配项归为一组
3. **提问阶段**：对每组路径只提问一次，应用到所有位置

**示例：**
```
发现 3 处使用路径 `Knowledge Base/`：
- SKILL.md:56 - 存储位置
- scripts/kb-checker.js:10 - 输出目录
- references/config.md:5 - 引用路径

→ 合并为 1 次提问：
"发现 3 处使用路径 `Knowledge Base/`，请指定新项目中的对应路径："
```

### 路径归一化格式

| 原始路径 | 归一化后 | 说明 |
|------|------|------|
| `Knowledge Base/` | `Knowledge Base/` | 统一不带尾部斜杠 |
| `Knowledge Base` | `Knowledge Base/` | 自动添加斜杠 |
| `./Knowledge Base/` | `Knowledge Base/` | 移除相对路径前缀 |
| `/path/to/Knowledge Base/` | `Knowledge Base/` | 提取项目相对路径 |

### 合并提问格式

```markdown
## 适配项 #X：路径配置（合并 3 处）

**路径值：** `Knowledge Base/`

**出现位置：**
| 文件 | 行号 | 说明 |
|------|------|------|
| SKILL.md | 56 | 存储位置 |
| scripts/kb-checker.js | 10 | 输出目录 |
| references/config.md | 5 | 引用路径 |

**请选择适配方式：**
1. **使用默认路径**：`Knowledge Base/`（当前项目目录）
2. **自定义路径**：输入新路径
3. **跳过**：暂不处理

请回复选项编号或输入路径。
```

### 应用修改规则

- 用户确认后，一次性替换所有位置的路径
- 修改报告中列出所有受影响的文件和行号
- 支持撤销操作（一次性撤销所有相关修改）

---

## 扫描规则

### 文件扫描顺序

1. `SKILL.md` - 主文件（必需扫描）
2. `scripts/` - 脚本文件
3. `references/` - 参考文档
4. `checklists/` - 检查清单

### 正则匹配模式

| 类型 | 正则模式 |
|------|----------|
| 绝对路径 | `/[a-zA-Z0-9/_-]+` 或 `[A-Z]:\\[a-zA-Z0-9_\\-]+` |
| 脚本引用 | `\.claude/scripts/\S+` |
| 文件引用 | `\`[a-zA-Z0-9_/.-]+\.(md|json|js|sh)\`` |
| 环境变量 | `\$[A-Z_]+` 或 `\$\{[A-Z_]+\}` |
| **触发器配置** | `^(triggers\|commands\|aliases):\s*\[.*\]` (YAML Frontmatter) |

---

## 添加新适配项类型

如需添加新的适配项类型，编辑此文件并添加：

```markdown
### X. 新类型名称

**识别模式：**
- 模式描述

**示例：**
```
示例代码
```

**适配方式：**
- 询问内容
- 修改方式
```

---

*最后更新：2026-03-25*
