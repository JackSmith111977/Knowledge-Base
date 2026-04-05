# 第 5 章：技能系统（Skills）

## 5.1 技能架构与生命周期

### 5.1.1 什么是技能（Skills）

在 Hermes Agent 中，**技能**是可以复用的任务执行流程和能力模块。技能系统采用基于文件的机制，而非传统的 RAG（检索增强生成）模式。

**核心理念：**
- 技能以文件形式存储在磁盘上（`.md` 或 `.py`）
- Agent 可以自主创建、修改和优化技能
- 技能在任务执行失败或发现过时步骤时自动更新
- 形成的技能可在不同会话中复用

### 5.1.2 技能存储位置

```
~/.hermes/skills/
├── builtin/              # 内置技能
│   ├── web_search.md
│   ├── file_operations.md
│   └── terminal.md
├── platform/             # 平台集成技能
│   ├── github.md
│   ├── openhue.md        # Philips Hue 智能灯
│   └── docker.md
└── user/                 # 用户自定义技能
    └── [用户创建的技能]
```

### 5.1.3 技能生命周期

```
┌─────────────────────────────────────────────────────────────┐
│                    技能生命周期                              │
│                                                             │
│   创建 → 注册 → 执行 → 评估 → 更新/优化 → 归档/删除          │
│    ↓       ↓       ↓       ↓         ↓          ↓           │
│   自主   工具    任务    结果      自进化     版本           │
│   手动   发现    执行    反馈      手动      管理           │
└─────────────────────────────────────────────────────────────┘
```

**详细流程：**

1. **创建**：用户手动创建或 Agent 自主生成
2. **注册**：通过 `skill_manager` 注册到技能列表
3. **执行**：Agent 在任务中调用技能
4. **评估**：根据执行结果和反馈评估效果
5. **更新**：发现问题时自动或手动优化
6. **归档**：过时技能移动到归档目录

---

## 5.2 内置技能概览

### 5.2.1 核心内置技能

| 技能名称 | 功能 | 调用示例 |
|----------|------|----------|
| **web_search** | 网页搜索 | "搜索最新的 Python 3.13 特性" |
| **web_fetch** | 网页内容抓取 | "获取这个 URL 的内容" |
| **file_read** | 读取文件 | "读取 config.yaml 的内容" |
| **file_write** | 写入文件 | "创建一个新的 README.md" |
| **file_list** | 列出目录 | "列出当前目录的所有文件" |
| **terminal** | 终端命令执行 | "运行 npm install" |
| **process** | 进程管理 | "查看正在运行的 Python 进程" |
| **image_generate** | 图像生成 | "生成一个 Logo 设计" |
| **code_run** | 代码执行 | "运行这段 Python 代码" |
| **code_review** | 代码审查 | "审查这个函数的代码质量" |

### 5.2.2 平台集成技能

#### GitHub 技能

```bash
# 安装 GitHub 技能
hermes skills install github

# 使用示例
hermes chat -q "查看这个 PR 的状态"
hermes chat -q "创建一个新的 Issue"
hermes chat -q "运行 CI/CD 检查"
```

**GitHub 技能功能：**
- PR 查看和管理
- Issue 创建和跟踪
- Code Review
- CI/CD 管道配置
- 仓库管理

#### OpenHue 技能（Philips Hue 智能灯）

```bash
# 安装 OpenHue 技能
hermes skills install smart-home/openhue

# 基本灯光控制
hermes chat -q "打开客厅主灯，亮度 70%"
hermes chat -q "把卧室灯调成蓝色"
```

**OpenHue 技能功能：**
- 单个灯光控制
- 房间级别控制
- 亮度调节（0-100）
- 色温控制（153-500 mirek）
- 场景模式设置

### 5.2.3 技能发现机制

Hermes 通过以下方式发现可用技能：

1. **启动时扫描** `~/.hermes/skills/` 目录
2. **解析技能元数据**（名称、描述、参数）
3. **注册到工具列表** 供 Agent 调用
4. **热加载** 支持动态添加技能无需重启

---

## 5.3 自定义技能开发

### 5.3.1 技能文件格式

技能可以用 Markdown（`.md`）或 Python（`.py`）格式编写。

**Markdown 技能格式（推荐用于流程型技能）：**

```markdown
---
name: my-custom-skill
description: 我的自定义技能
version: 1.0.0
author: Your Name
---

# 技能说明

这个技能用于 [描述技能用途]

## 参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| param1 | string | 是 | 参数 1 说明 |
| param2 | integer | 否 | 参数 2 说明，默认值 10 |

## 执行步骤

1. 第一步：[操作说明]
2. 第二步：[操作说明]
3. 第三步：[操作说明]

## 示例

```
hermes chat -q "使用 my-custom-skill 处理 XXX"
```

## 依赖

- 需要安装的依赖包
- 需要配置的环境变量
```

**Python 技能格式（推荐用于复杂逻辑）：**

```python
"""
自定义技能：文本处理工具
"""

from skills.base import BaseSkill
from tools.registry import registry


class TextTransformSkill(BaseSkill):
    """文本转换技能"""
    
    name = "text_transform"
    description = "转换文本大小写"
    
    def get_schema(self):
        return {
            "type": "object",
            "properties": {
                "text": {"type": "string"},
                "transform_type": {
                    "type": "string",
                    "enum": ["uppercase", "lowercase"]
                }
            },
            "required": ["text", "transform_type"]
        }
    
    def execute(self, args, context):
        text = args.get("text", "")
        transform_type = args.get("transform_type", "uppercase")
        
        if transform_type == "uppercase":
            return text.upper()
        elif transform_type == "lowercase":
            return text.lower()
        return text


# 注册技能
registry.register_skill(TextTransformSkill)
```

### 5.3.2 技能开发步骤

**步骤 1：创建技能文件**

```bash
# 创建用户技能目录
mkdir -p ~/.hermes/skills/user

# 创建技能文件
nano ~/.hermes/skills/user/my-skill.md
```

**步骤 2：编写技能内容**

参考上面的格式模板。

**步骤 3：测试技能**

```bash
# 重新加载技能
hermes skills reload

# 查看技能列表
hermes skills list

# 测试技能
hermes chat -q "使用 my-skill 执行 XXX"
```

### 5.3.3 技能最佳实践

| 实践 | 说明 |
|------|------|
| **单一职责** | 每个技能只做一件事，做好 |
| **清晰文档** | 在技能文件中提供完整说明 |
| **参数验证** | 检查必填参数和参数格式 |
| **错误处理** | 提供清晰的错误信息 |
| **版本管理** | 使用语义化版本号 |
| **依赖声明** | 明确列出所有依赖 |

---

## 5.4 技能管理与分发

### 5.4.1 技能管理命令

```bash
# 列出已安装技能
hermes skills list

# 安装技能
hermes skills install <skill-name>

# 更新技能
hermes skills update <skill-name>

# 删除技能
hermes skills remove <skill-name>

# 重新加载技能
hermes skills reload

# 查看技能详情
hermes skills show <skill-name>

# 禁用技能
hermes skills disable <skill-name>

# 启用技能
hermes skills enable <skill-name>
```

### 5.4.2 技能自进化机制

Hermes 的核心差异化功能是**技能自进化**：

```
任务执行失败或发现过时步骤
            ↓
Agent 检测到问题（通过结果验证或用户反馈）
            ↓
触发技能更新流程（每 15 次工具调用后）
            ↓
调用 skill_manager 修补程序
            ↓
分析执行轨迹，识别问题
            ↓
生成修复方案
            ↓
更新磁盘上的技能文件
            ↓
下次任务使用新版本技能
```

**触发条件：**
- 累计 15 次工具调用后自动触发
- 用户明确要求改进
- 任务执行失败

### 5.4.3 技能版本控制

Hermes 支持技能版本管理：

```bash
# 查看技能历史版本
hermes skills history <skill-name>

# 回滚到指定版本
hermes skills rollback <skill-name> --version 1.0.0

# 导出技能（备份）
hermes skills export <skill-name> --output backup.md
```

### 5.4.4 技能分享与分发

**本地分享：**
```bash
# 导出技能包
hermes skills package <skill-name>

# 安装本地技能包
hermes skills install ./my-skill.tar.gz
```

**远程分发（未来计划）：**
- 技能市场（Skill Marketplace）
- GitHub 技能仓库
- 社区贡献技能库

---

## 5.5 技能应用场景

### 5.5.1 开发者自动化

```bash
# Git 工作流技能
hermes chat -q "创建一个新分支并设置上游"
hermes chat -q "检查未提交的更改"

# 代码审查技能
hermes chat -q "审查这个 PR 的代码质量"

# 部署技能
hermes chat -q "部署到生产环境并验证"
```

### 5.5.2 数据分析

```bash
# 数据抓取技能
hermes chat -q "抓取这个网站的所有产品数据"

# 数据处理技能
hermes chat -q "分析销售数据并生成报告"
```

### 5.5.3 智能家居

```bash
# 灯光控制
hermes chat -q "晚上好模式：打开客厅灯，调暗卧室灯"

# 自动化场景
hermes chat -q "离家模式：关闭所有设备"
```

---

*本章来源：GitHub 官方仓库、CSDN 技能开发指南、知乎深度解读*
