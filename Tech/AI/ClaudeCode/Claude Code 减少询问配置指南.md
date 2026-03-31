# Claude Code 减少询问配置指南

> 本文档详解如何配置 Claude Code 减少不必要的确认弹窗，提升开发效率

---

## 目录

1. [权限模式概览](#1-权限模式概览)
2. [模式一：Auto-Accept 模式（推荐）](#2-模式一 auto-accept 模式推荐)
3. [模式二：Permission 规则配置](#3-模式二 permission 规则配置)
4. [模式三：YOLO 模式（高风险）](#4-模式三 yolo 模式高风险)
5. [配置文件层级与优先级](#5-配置文件层级与优先级)
6. [Hooks 自动化补充](#6-hooks 自动化补充)
7. [实战配置模板](#7-实战配置模板)
8. [安全建议与注意事项](#8-安全建议与注意事项)

---

## 1. 权限模式概览

### 1.1 三种内置模式

| 模式 | 切换方式 | 文件编辑 | 命令执行 | 适用场景 |
|------|----------|----------|----------|----------|
| **Normal（默认）** | `Shift+Tab` 循环切换 | 需确认 | 需确认 | 精细控制、高风险操作 |
| **Auto-Accept** | `Shift+Tab` 循环切换 | 自动 | 需确认 | 日常开发、批量编辑 |
| **Plan** | `Shift+Tab` 循环切换 | 先规划后执行 | 需确认 | 复杂项目、架构设计 |

### 1.2 权限类型说明

| 权限 | 说明 | 风险等级 |
|------|------|----------|
| `Read` | 读取文件内容 | 无 |
| `Edit` | 编辑现有文件 | 低 |
| `Write` | 创建新文件 | 低 |
| `Glob` | 文件搜索 | 无 |
| `Grep` | 内容搜索 | 无 |
| `Bash(...)` | 执行 Shell 命令 | 中 - 高 |

---

## 2. 模式一：Auto-Accept 模式（推荐）

### 2.1 模式特点

- **最安全的自动模式**：仅自动确认文件编辑，危险命令仍需确认
- **效率与安全平衡**：适合日常开发，既减少询问又保留控制权

### 2.2 开启方式

**方式一：会话中切换（最简单）**
```bash
# 按 Shift + Tab 循环切换，直到显示 "Auto-accept edits on"
```

**方式二：启动时指定**
```bash
claude --mode auto-accept
```

### 2.3 权限对比表

| 操作类型 | Normal 模式 | Auto-Accept 模式 | 风险 |
|----------|-------------|------------------|------|
| 读取文件 | 自动 | 自动 | 无 |
| 编辑文件 | 需确认 | **自动** | 低 |
| 执行命令 | 需确认 | 需确认 | 高 |

### 2.4 适用场景

- ✅ 日常开发、批量文件编辑
- ✅ 重构代码
- ✅ 需要频繁修改文件但不涉及危险命令的场景

---

## 3. 模式二：Permission 规则配置

### 3.1 配置文件结构

编辑 `~/.claude/settings.json`（全局）或 `<项目>/.claude/settings.json`（项目级）：

```json
{
  "permissions": {
    "allow": [
      "Read",
      "Glob",
      "Grep",
      "Bash(npm run test)",
      "Bash(npm run build)",
      "Bash(git status)",
      "Bash(git diff)"
    ],
    "deny": [
      "Bash(rm -rf *)",
      "Bash(git push --force)",
      "Bash(curl * | bash)"
    ]
  }
}
```

### 3.2 规则语法说明

| 规则格式 | 说明 | 示例 |
|----------|------|------|
| `Bash(command)` | 仅允许精确匹配的命令 | `Bash(git status)` |
| `Bash(command:*)` | 允许命令加任意参数 | `Bash(git log:*)` |
| `Bash(pattern*)` | 通配符匹配 | `Bash(npm run:*)` |
| `Read/Write/Edit` | 文件操作权限 | `Edit`, `Write` |

### 3.3 冒号 `:` 的特殊含义

```json
"Bash(git log)"    // 只允许 git log（不带参数）
"Bash(git log:*)"  // 允许 git log 加任意参数，如 git log --oneline
```

### 3.4 在会话中管理权限

```bash
# 查看当前生效的权限规则
/permissions

# 动态添加允许规则
/permissions allow Bash(npm run dev)

# 动态添加禁止规则
/permissions deny Bash(rm -rf *)
```

### 3.5 核心策略建议

```json
{
  "permissions": {
    "allow": [
      // 读操作全放行
      "Read",
      "Glob",
      "Grep",
      // 源码编辑按路径放行
      "Edit",
      "Write",
      // 构建命令按风险分级
      "Bash(npm run:*)",
      "Bash(pnpm run:*)",
      "Bash(yarn:*)",
      // Git 安全命令
      "Bash(git status)",
      "Bash(git diff)",
      "Bash(git log:*)"
    ],
    "deny": [
      // 破坏性操作一律禁止
      "Bash(rm -rf *)",
      "Bash(git push --force)",
      "Bash(curl * | bash)"
    ]
  }
}
```

---

## 4. 模式三：YOLO 模式（高风险）

### 4.1 开启方式

```bash
claude --dangerously-skip-permissions
```

### 4.2 模式特点

| 特点 | 说明 |
|------|------|
| 所有命令自动执行 | 无任何确认弹窗 |
| 文件编辑无需确认 | 直接写入 |
| 危险命令无拦截 | `rm -rf /` 也会执行 |

### 4.3 风险警告

⚠️ **官方建议仅在以下场景使用：**
- 隔离的 CI/CD 环境
- 临时 Docker 容器
- 沙箱/虚拟机环境

❌ **禁止在日常开发中使用：**
- 所有命令无确认，恶意文件可能导致灾难性后果
- 可能执行 `rm -rf /` 等破坏性命令

### 4.4 安全的沙箱部署方案

```dockerfile
# Dockerfile 示例
FROM ubuntu:22.04

# 基础工具链
RUN apt-get update && apt-get install -y \
    git \
    nodejs \
    npm \
    python3 \
    && rm -rf /var/lib/apt/lists/*

# 安装 Claude Code
RUN npm install -g @anthropic-ai/claude-code

# 配置工作目录
WORKDIR /workspace
VOLUME /workspace

# 设置默认启动命令（YOLO 模式）
CMD ["claude", "--dangerously-skip-permissions"]
```

---

## 5. 配置文件层级与优先级

### 5.1 三层配置文件

| 配置文件 | 路径 | 用途 | 是否提交 Git |
|----------|------|------|--------------|
| **全局配置** | `~/.claude/settings.json` | 个人习惯、所有项目共享 | 否 |
| **项目配置** | `<项目>/.claude/settings.json` | 团队规范、项目特定规则 | 是 |
| **本地配置** | `<项目>/.claude/settings.local.json` | 临时规则、个人偏好 | 否（加入 .gitignore） |

### 5.2 优先级规则

```
项目本地 > 项目级 > 全局
```

**重要：**
- 权限规则是合并生效的
- `deny` 规则永远是最高优先级，任何地方的 `deny` 都不会被覆盖

### 5.3 配置示例

**全局配置（~/.claude/settings.json）：**
```json
{
  "model": "opus[1m]",
  "effortLevel": "high",
  "skipDangerousModePermissionPrompt": true,
  "permissions": {
    "allow": [
      "Read",
      "Edit",
      "Write",
      "Glob",
      "Grep"
    ]
  }
}
```

**项目本地配置（.claude/settings.local.json）：**
```json
{
  "permissions": {
    "allow": [
      "WebFetch(domain:bri.caas.cn)",
      "Bash(python3:*)",
      "Bash(npm run:*)"
    ]
  }
}
```

---

## 6. Hooks 自动化补充

### 6.1 Hooks 核心机制

Hooks 是在特定事件发生时自动执行的 Shell 命令，与 CLAUDE.md 的请求型规则不同，Hooks 属于"强制执行"的指令。

### 6.2 支持的 Hook 事件

| 事件 | 触发时机 | 适用场景 |
|------|----------|----------|
| `PostToolUse` | 工具调用后 | 自动格式化、运行测试、日志记录 |
| `PreToolUse` | 工具调用前 | 安全检查、拦截危险命令 |
| `Notification` | 需要用户关注时 | 桌面通知、声音提醒 |
| `Stop` | 完成响应后 | 自动提交、任务总结 |
| `SessionStart` | 新会话启动 | 加载环境变量、启动检查 |
| `UserPromptSubmit` | 提交提示后 | 注入上下文、验证提示 |

### 6.3 配置文件位置

- **项目级**：`.claude/settings.json`
- **用户级**：`~/.claude/settings.json`

### 6.4 配置示例

**自动格式化（TypeScript/JavaScript）：**
```json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Edit|MultiEdit|Write",
      "hooks": [{
        "type": "command",
        "command": "jq -r '.tool_input.file_path' | { read fp; if echo \"$fp\" | grep -qE '\\.(ts|tsx|js|jsx)$'; then npx prettier --write \"$fp\"; fi; }"
      }]
    }]
  }
}
```

**任务完成通知：**
```json
{
  "hooks": {
    "Stop": [{
      "matcher": "",
      "hooks": [{
        "type": "command",
        "command": "bash scripts/notify.sh",
        "timeout": 10
      }]
    }]
  }
}
```

---

## 7. 实战配置模板

### 7.1 前端开发推荐配置

```json
{
  "model": "opus[1m]",
  "effortLevel": "high",
  "permissions": {
    "allow": [
      "Read",
      "Edit",
      "Write",
      "Glob",
      "Grep",
      "Bash(npm run:*)",
      "Bash(pnpm run:*)",
      "Bash(yarn:*)",
      "Bash(git status)",
      "Bash(git diff)",
      "Bash(git log:*)",
      "Bash(git add:*)",
      "Bash(git commit:*)"
    ],
    "deny": [
      "Bash(rm -rf *)",
      "Bash(git push --force)",
      "Bash(curl * | bash)",
      "Bash(sudo *)"
    ]
  },
  "hooks": {
    "PostToolUse": [{
      "matcher": "Edit|Write",
      "hooks": [{
        "type": "command",
        "command": "if command -v prettier >/dev/null 2>&1; then prettier --write --ignore-unknown {{file_path}} 2>/dev/null || true; fi"
      }]
    }]
  }
}
```

### 7.2 保守型配置（仅减少部分询问）

```json
{
  "permissions": {
    "allow": [
      "Read",
      "Glob",
      "Grep",
      "Bash(git status)",
      "Bash(git diff)",
      "Bash(npm run build)",
      "Bash(npm run test)"
    ]
  }
}
```

### 7.3 激进型配置（最大化自动执行）

```json
{
  "permissions": {
    "allow": [
      "Read",
      "Edit",
      "Write",
      "Glob",
      "Grep",
      "Bash(npm:*)",
      "Bash(pnpm:*)",
      "Bash(yarn:*)",
      "Bash(git:*)",
      "Bash(node:*)",
      "Bash(python3:*)"
    ],
    "deny": [
      "Bash(rm -rf *)",
      "Bash(curl * | bash)"
    ]
  }
}
```

---

## 8. 安全建议与注意事项

### 8.1 推荐实践

| 建议 | 说明 |
|------|------|
| ✅ 使用 Auto-Accept 模式 | 最安全的自动模式，日常开发推荐 |
| ✅ 配置 allow/deny 规则 | 精细化控制，平衡效率与安全 |
| ✅ 项目级配置提交 Git | 团队共享统一规范 |
| ✅ 本地配置放个人习惯 | 不影响团队其他成员 |
| ✅ 在沙箱中使用 YOLO 模式 | Docker 容器或虚拟机 |

### 8.2 禁止事项

| 禁止 | 风险 |
|------|------|
| ❌ 在日常开发中使用 YOLO 模式 | 可能导致数据丢失 |
| ❌ 允许所有 Bash 命令 | 无法拦截危险操作 |
| ❌ 在生产环境使用全自动模式 | 可能引入未知风险 |

### 8.3 当前项目配置建议

基于你的全局配置 `C:\Users\Kei\.claude\settings.json`，建议添加以下权限配置：

```json
{
  "autoUpdatesChannel": "latest",
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "sk-sp-12e66b57447946b095e90bd7775f3924",
    "ANTHROPIC_BASE_URL": "https://coding.dashscope.aliyuncs.com/apps/anthropic",
    "ANTHROPIC_MODEL": "qwen3.5-plus"
  },
  "skipWebFetchPreflight": true,
  "permissions": {
    "allow": [
      "Read",
      "Edit",
      "Write",
      "Glob",
      "Grep",
      "Bash(npm run:*)",
      "Bash(git status)",
      "Bash(git diff)",
      "Bash(git log:*)"
    ],
    "deny": [
      "Bash(rm -rf *)",
      "Bash(git push --force)"
    ]
  }
}
```

---

## 附录 A：快速参考表

### A.1 模式切换快捷键

| 快捷键 | 效果 |
|--------|------|
| `Shift+Tab`（1 次） | Normal → Auto-Accept |
| `Shift+Tab`（2 次） | Auto-Accept → Plan |
| `Shift+Tab`（3 次） | Plan → Normal |

### A.2 常用命令

| 命令 | 说明 |
|------|------|
| `claude --mode auto-accept` | 启动时开启自动接受模式 |
| `claude --dangerously-skip-permissions` | YOLO 模式（慎用） |
| `/permissions` | 查看当前权限 |
| `/hooks` | 配置 Hooks |

### A.3 通配符规则

| 模式 | 匹配示例 |
|------|----------|
| `Bash(npm run:*)` | `npm run dev`, `npm run build`, `npm run test` |
| `Bash(git log:*)` | `git log`, `git log --oneline`, `git log -5` |
| `Bash(python3:*)` | `python3 script.py`, `python3 -m http.server` |

---

## 附录 B：常见问题

### B.1 为什么配置后仍然有弹窗？

- 检查配置文件语法是否正确（JSON 格式）
- 确认配置文件优先级（项目本地 > 项目级 > 全局）
- `deny` 规则永远优先，检查是否有冲突

### B.2 如何查看当前生效的权限？

```bash
# 在 Claude Code 会话中输入
/permissions
```

### B.3 配置文件修改后多久生效？

配置文件保存后立即生效，无需重启 Claude Code。

---

*文档版本：1.0.0 | 创建日期：2026-03-31 | 基于搜索结果整理*
