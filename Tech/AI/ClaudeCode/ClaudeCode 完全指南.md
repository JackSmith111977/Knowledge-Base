# Claude Code 操作手册与精通指南

> 全面的 Claude Code 使用指南，涵盖安装、命令、配置、高级功能和最佳实践

---

## 第一章：快速开始

### 1.1 什么是 Claude Code

Claude Code 是 Anthropic 推出的 AI 驱动命令行编程工具，它：
- 住在你的终端里，完全在命令行工作
- 理解整个代码库，不只是单文件
- 能执行多步骤复杂任务
- 支持多代理并行工作
- 可处理长达 30+ 小时的自主开发任务

### 1.2 安装方法

#### macOS/Linux（推荐）
```bash
curl -fsSL https://claude.ai/install.sh | bash
```

#### Windows（推荐）
```powershell
irm https://claude.ai/install.ps1 | iex
```

#### Homebrew (macOS/Linux)
```bash
brew install --cask claude-code
```

#### WinGet (Windows)
```powershell
winget install Anthropic.ClaudeCode
```

### 1.3 启动与认证

```bash
# 进入项目目录
cd your-project

# 启动 Claude Code
claude

# 首次使用会自动打开浏览器进行认证
```

---

## 第二章：核心命令参考

### 2.1 基础命令

| 命令 | 说明 |
|------|------|
| `claude` | 在项目根目录启动交互式会话 |
| `claude "任务描述"` | 启动会话并执行指定任务 |
| `claude -p "提示词"` | 非交互模式，执行后退出 |
| `claude --version` | 查看版本号 |
| `claude --help` | 查看帮助 |

### 2.2 会话管理命令

| 命令 | 说明 |
|------|------|
| `/clear` | 清空上下文，重新开始 |
| `/compact` | 压缩对话历史，回收上下文空间 |
| `/exit` 或 `Ctrl+D` | 退出当前会话 |
| `/resume` 或 `-r` | 恢复之前的会话 |
| `/continue` 或 `-c` | 继续上一次活跃会话 |

### 2.3 内置 Slash 命令

| 命令 | 说明 |
|------|------|
| `/init` | 生成 CLAUDE.md 项目配置文件 |
| `/status` | 查看当前模型、API 配置状态 |
| `/model <名称>` | 切换使用的模型 |
| `/help` | 显示帮助信息 |
| `/bug` | 报告问题 |
| `/mcp` | 管理 MCP 服务器配置 |
| `/hooks` | 管理钩子配置 |
| `/skills` | 查看可用技能 |
| `/agents` | 管理子代理 |
| `/loop` | 设置重复执行任务 |
| `/schedule` | 设置定时任务 |
| `/desktop` | 将会话发送到桌面应用 |
| `/teleport` | 将会话发送到其他设备 |
| `/add-dir` | 添加工作目录 |

### 2.4 快捷键

| 快捷键 | 功能 |
|--------|------|
| `Ctrl+C` | 中断当前响应/取消命令 |
| `Ctrl+D` | 退出会话 |
| `Ctrl+B` | 将任务发送到后台运行 |
| `Esc+Esc` | 打开时光机（历史检查点） |
| `Ctrl+Enter` | 多行输入换行 |

---

## 第三章：核心配置系统

### 3.1 配置文件层级

Claude Code 的配置分为多个层级：

```
~/.claude/
├── settings.json          # 全局设置
├── settings.local.json    # 本地设置（不提交到 git）
├── hooks.json             # 钩子配置
├── skills/                # 技能定义
├── commands/              # 自定义命令
├── agents/                # 子代理定义
└── rules/                 # 规则定义

<项目根目录>/
├── CLAUDE.md              # 项目级指令
└── .claude/               # 项目级配置
```

### 3.2 核心概念解析

| 概念 | 本质 | 触发方式 | 用途 |
|------|------|----------|------|
| **CLAUDE.md** | 项目指令文件 | 自动加载 | 项目规范、架构说明、代码风格 |
| **Rules** | 静态 Markdown 提示词 | 始终加载 | 安全规则、测试要求、代码规范 |
| **Hooks** | 可执行脚本 | 事件触发 | 自动化守卫、预处理、后处理 |
| **Commands** | Slash 命令 | 用户输入 `/xxx` | 一键触发复杂工作流 |
| **Skills** | 结构化工作流模板 | 自动/手动调用 | 领域知识、最佳实践 |
| **Agents** | 子代理定义 | 手动/自动调用 | 专用任务处理 |
| **MCP** | 外部系统连接协议 | 配置后自动可用 | 连接 GitHub、Slack、Drive 等 |
| **Plugins** | 打包配置 | 安装后使用 | 团队配置分发 |

### 3.3 Hooks 详解

Hooks 是在特定事件自动触发的脚本，是真正的"硬约束"：

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "event": "ToolWrite",
        "cmd": "eslint {{filePath}} --fix"
      }
    ],
    "PostToolUse": [
      {
        "event": "ToolWrite",
        "cmd": "git add {{filePath}}"
      }
    ],
    "SessionStart": [
      {
        "cmd": "echo '欢迎使用 Claude Code'"
      }
    ],
    "SessionEnd": [
      {
        "cmd": "git status"
      }
    ],
    "Stop": [
      {
        "cmd": "echo '会话结束'"
      }
    ]
  }
}
```

### 3.4 settings.json 配置示例

```json
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "your-api-key",
    "ANTHROPIC_BASE_URL": "https://api.anthropic.com",
    "ANTHROPIC_MODEL": "claude-sonnet-4-6"
  },
  "permissions": {
    "allow": [
      "Bash(npm install)",
      "Bash(npm run build)",
      "Bash(npm run test)",
      "Bash(git status)",
      "Bash(git diff)",
      "Bash(git add)",
      "Bash(git commit)"
    ]
  },
  "theme": {
    "light": "Default",
    "dark": "Default"
  },
  "hooks": {
    "PreToolUse": [],
    "PostToolUse": [],
    "SessionStart": [],
    "SessionEnd": [],
    "Stop": []
  }
}
```

---

## 第四章：CLAUDE.md 编写指南

### 4.1 CLAUDE.md 的作用

CLAUDE.md 是给 AI 的"项目员工手册"，每次会话都会自动读取。

**没有 CLAUDE.md 的情况：**
- AI 不了解项目架构，可能把代码放错位置
- AI 不了解编码规范，可能写出不符合团队标准的代码
- 每次对话都要重复说明项目约定

**有 CLAUDE.md 的情况：**
- AI 自动知道项目技术栈和架构
- AI 自动遵守编码规范
- AI 优先复用已有的中间件和公共方法
- 一次编写，全团队共享

### 4.2 CLAUDE.md 标准结构

```markdown
# CLAUDE.md

## 项目概述
<!-- 一句话说明项目是什么、用什么技术栈 -->

## 架构结构
<!-- 项目分层、各层职责、目录说明 -->

## 技术栈
<!-- 使用的框架、库、工具 -->

## 代码规范
<!-- 命名规则、禁止事项、代码风格 -->

## 常用命令
<!-- 构建、运行、测试、部署命令 -->

## 关键配置
<!-- 依赖注入、路由规则、环境变量 -->

## 数据库规范
<!-- 建表规则、字段类型、约束规则 -->

## 中间件与公共方法
<!-- 项目已有的中间件、工具类，告诉 AI 优先复用 -->

## 主要业务模块
<!-- 核心业务逻辑的说明 -->

## 测试策略
<!-- 测试框架、目录结构、验证方式 -->
```

### 4.3 编写原则

1. **具体明确**：不写"注意代码规范"，而写"所有模型类必须放在 models 目录"
2. **给出示例**：重要规则附带正确和错误的代码示例
3. **禁止项加粗**：用**禁止 XXX**标注红线规则

---

## 第五章：高级功能

### 5.1 多代理协作

可以创建多个子代理同时工作：

```bash
# 创建规划代理
/agent planner "分析需求并制定计划"

# 创建编码代理
/agent coder "实现功能"

# 创建审查代理
/agent reviewer "代码审查"
```

### 5.2 MCP (Model Context Protocol)

MCP 是连接外部系统的标准协议：

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"]
    },
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/watch"]
    }
  }
}
```

### 5.3 定时任务

```bash
# 设置定时任务
/schedule "0 9 * * *" "review overnight PRs"

# 循环执行任务
/loop 5m "/status"

# 取消定时任务
/schedule --list
/schedule --cancel <id>
```

### 5.4 远程会话

```bash
# 将会话发送到其他设备
/teleport

# 发送到桌面应用
/desktop

# 从手机/iPad 继续
打开 Claude iOS 应用 -> Code 标签
```

### 5.5 时光机功能 (Esc+Esc)

自动保存的检查点：
- 每次文件修改
- 每次提示词发送

恢复选项：
1. 只恢复对话（代码改动保留）
2. 只恢复代码（对话继续）
3. 全部恢复（代码 + 对话都回滚）

---

## 第六章：最佳实践

### 6.1 日常使用技巧

1. **从 /init 开始**：新项目先用 `/init` 生成 CLAUDE.md
2. **及时 /compact**：会话超过 30 分钟或出现警告时压缩上下文
3. **重要操作前 git commit**：便于回滚
4. **使用后台模式**：长任务按 `Ctrl+B` 释放终端

### 6.2 任务分解策略

将复杂任务分解为多个子任务：
```bash
# 不好的做法
claude "重构整个项目"

# 好的做法
claude "分析项目结构，识别可重构的模块"
claude "重构 auth 模块，保持现有功能不变"
claude "重构 config 模块，保持现有功能不变"
```

### 6.3 代码审查流程

```bash
# 1. 让 Claude 分析改动
git diff HEAD~5 | claude -p "review for security issues"

# 2. 使用审查技能
/review-pr 123

# 3. 使用子代理审查
/agent reviewer "审查 PR #123"
```

### 6.4 测试驱动开发

```bash
# 启用 TDD 模式
/tdd "实现用户登录功能"

# 或者手动步骤
claude "为 auth 模块编写测试用例"
claude "运行测试"
claude "实现功能使测试通过"
```

---

## 第七章：故障排除

### 7.1 常见问题

| 问题 | 解决方案 |
|------|----------|
| 无法认证 | 检查网络，尝试重新运行 `claude` |
| 上下文溢出 | 使用 `/compact` 压缩历史 |
| AI 幻觉 | 使用 `/clear` 清空上下文，重新描述 |
| 命令无响应 | 按 `Ctrl+C` 中断，检查网络 |
| 权限不足 | 在 settings.json 中添加权限 |

### 7.2 调试技巧

```bash
# 查看详细日志
claude --log-level debug

# 检查配置状态
/status

# 重置配置
rm -rf ~/.claude
claude  # 重新初始化
```

---

## 第八章：安全与隐私

### 8.1 数据使用说明

- 收集使用数据（代码接受/拒绝）
- 存储对话数据
- **反馈不用于模型训练**

### 8.2 安全建议

1. **不要在 CLAUDE.md 中提交敏感信息**
2. **使用 .env 管理环境变量**
3. **谨慎授予文件写入权限**
4. **重要变更使用 git 追踪**
5. **定期备份配置**

---

## 附录：快速参考卡

### 常用命令速查

```
claude                    # 启动会话
claude "任务"             # 启动并执行
/init                     # 生成 CLAUDE.md
/compact                  # 压缩上下文
/clear                    # 清空对话
/status                   # 查看状态
/model <name>             # 切换模型
Ctrl+C                    # 中断
Ctrl+D                    # 退出
Ctrl+B                    # 后台运行
Esc+Esc                   # 时光机
```

### 配置文件位置

```
~/.claude/settings.json    # 全局配置
~/.claude/hooks.json       # 钩子配置
<项目>/CLAUDE.md           # 项目配置
```

---

*本指南持续更新中，最后更新：2026-03-24*
