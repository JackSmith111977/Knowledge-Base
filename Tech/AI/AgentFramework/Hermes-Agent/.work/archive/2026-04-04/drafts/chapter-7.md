# 第 7 章：安全与隔离

## 7.1 安全沙盒设计

### 7.1.1 为什么需要安全隔离

AI Agent 执行潜在风险操作：

| 风险类型 | 具体表现 | 可能后果 |
|----------|----------|----------|
| **命令执行** | 执行恶意 shell 命令 | 系统被控制、数据泄露 |
| **文件访问** | 读取敏感文件 | 密钥、密码泄露 |
| **网络请求** | 未授权的外部调用 | 数据外传、DDoS 参与 |
| **权限提升** | 获取更高系统权限 | 完全系统控制 |
| **自我修改** | Agent 修改自身代码 | 行为不可预测、恶性循环 |

### 7.1.2 Hermes 的安全理念

**核心原则：**
1. **最小权限**：只授予完成任务所需的最小权限
2. **隔离执行**：所有命令在隔离环境中运行
3. **审计日志**：所有操作可追溯、可审计
4. **用户审批**：关键操作需要用户确认

### 7.1.3 沙盒架构

```
┌─────────────────────────────────────────────────────────────┐
│                    Hermes 安全沙盒架构                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  用户层                                                     │
│      ↓ 用户请求                                              │
│                                                             │
│  审批层                                                     │
│      ↓ 危险操作检测 + 用户确认                               │
│                                                             │
│  沙盒层（五选一）                                           │
│      → Local（基础隔离）                                    │
│      → Docker（容器隔离）← 推荐                             │
│      → SSH（远程隔离）← 最安全                              │
│      → Modal（无服务器隔离）                                │
│      → Singularity（科研级隔离）                            │
│                                                             │
│  执行层                                                     │
│      → 命令执行 + 结果返回                                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 7.2 容器隔离（Docker 后端）

### 7.2.1 Docker 安全特性

| 特性 | 说明 | 配置 |
|------|------|------|
| **文件系统隔离** | 容器无法访问主机文件系统 | 通过挂载卷控制访问范围 |
| **网络隔离** | 默认禁用网络访问 | `--network=none` |
| **资源限制** | CPU/内存限制 | `--cpus`, `--memory` |
| **权限限制** | 禁止特权升级 | `--security-opt no-new-privileges` |
| **只读文件系统** | 防止写入操作 | `--read-only` |

### 7.2.2 Docker 后端配置

```yaml
# ~/.hermes/config.yaml
terminal:
  backend: docker
  docker:
    image: python:3.11-slim  # 基础镜像
    network: none            # 默认禁用网络
    volumes:                 # 挂载卷（可控访问）
      - ~/.hermes:/root/.hermes:ro  # 只读挂载
      - ./projects:/projects:rw     # 可写项目目录
    resources:
      cpu: 2.0               # CPU 核心限制
      memory: 4g             # 内存限制
    security_opt:
      - no-new-privileges    # 禁止权限提升
      - apparmor:docker-default  # AppArmor 配置文件
```

### 7.2.3 安全强化措施

**默认启用的安全选项：**

```bash
# Docker 运行参数
docker run \
  --security-opt no-new-privileges \  # 禁止提权
  --security-opt seccomp=default \    # 系统调用过滤
  --cap-drop=ALL \                    # 删除所有能力
  --cap-add=NET_BIND_SERVICE \        # 仅保留必要能力
  --read-only \                       # 只读文件系统
  --tmpfs /tmp \                      # 临时目录可写
  --network=none \                    # 禁用网络
  hermes-agent:latest
```

### 7.2.4 容器安全扫描

Hermes 在技能安装时自动进行安全扫描：

**扫描内容：**
- 数据泄露风险
- 提示注入攻击
- 破坏性命令
- 其他潜在安全隐患

**信任级别分类：**

| 级别 | 来源 | 说明 |
|------|------|------|
| **builtin** | Hermes 内置技能 | 安全性最高，已审计 |
| **trusted** | 可信源（如 OpenAI） | 经过验证的技能 |
| **community** | 社区贡献 | 需审查，默认阻止 |

**扫描命令：**
```bash
# 安装时自动扫描
hermes skills install <skill-name>

# 手动重新扫描
hermes skills audit <slug>

# 强制安装（不推荐）
hermes skills install <skill-name> --force
```

---

## 7.3 SSH 后端（最高安全性）

### 7.3.1 为什么 SSH 最安全

SSH 后端提供最高级别的安全隔离：

1. **物理隔离**：Agent 运行在远程服务器上
2. **无法自修改**：Agent 无法修改本地代码
3. **网络边界**：与内网完全隔离
4. **审计便利**：所有操作记录在远程服务器

### 7.3.2 SSH 后端配置

```yaml
# ~/.hermes/config.yaml
terminal:
  backend: ssh
  ssh:
    host: user@remote-server.com
    port: 22
    key: ~/.ssh/id_ed25519
    working_dir: /home/user/hermes-remote
    
# 可选：跳板机配置
bastion:
  host: bastion.company.com
  key: ~/.ssh/bastion_key
```

### 7.3.3 设置步骤

```bash
# 步骤 1：生成 SSH 密钥
ssh-keygen -t ed25519 -f ~/.ssh/hermes_key

# 步骤 2：复制公钥到远程服务器
ssh-copy-id -i ~/.ssh/hermes_key user@remote-server.com

# 步骤 3：配置 Hermes
hermes config set terminal.backend ssh
hermes config set terminal.ssh_host user@remote-server.com
hermes config set terminal.ssh_key ~/.ssh/hermes_key

# 步骤 4：测试连接
hermes terminal test
```

---

## 7.4 权限控制与审计

### 7.4.1 执行审批机制

关键操作需要用户审批：

| 操作类型 | 审批要求 |
|----------|----------|
| **文件写入** | 自动允许（在项目目录内） |
| **文件删除** | 需要用户确认 |
| **系统命令** | 需要用户确认 |
| **网络请求** | 需要用户确认 |
| **技能安装** | 安全扫描 + 用户确认 |

### 7.4.2 审计日志

**日志位置：**
```
~/.hermes/logs/
├── errors.log          # 错误日志
├── gateway.log         # 网关日志
├── agent.log           # Agent 执行日志
└── audit.log           # 审计日志（敏感操作）
```

**日志内容：**
- 时间戳
- 操作用户
- 执行的命令
- 使用的工具
- 执行结果
- 密钥自动脱敏

### 7.4.3 查看审计日志

```bash
# 查看所有日志
hermes logs

# 实时追踪日志
hermes logs --follow

# 只看错误日志
hermes logs --level error

# 导出审计日志
hermes logs export --format json --output audit-export.json
```

---

## 7.5 密钥管理

### 7.5.1 密钥存储

**推荐方案：**

| 方案 | 安全性 | 便利性 |
|------|--------|--------|
| **环境变量** | 中 | 高 |
| **.env 文件（600 权限）** | 中高 | 高 |
| **系统密钥环** | 高 | 中 |
| **Vault/Secrets Manager** | 最高 | 低 |

### 7.5.2 .env 文件配置

```bash
# ~/.hermes/.env
# 权限必须是 600：chmod 600 ~/.hermes/.env

# 模型 API 密钥
OPENROUTER_API_KEY=sk-or-xxxxx
OPENAI_API_KEY=sk-xxxxx

# 消息平台密钥（自动脱敏）
TELEGRAM_BOT_TOKEN=xxxxx:xxxxx

# SSH 密钥路径
SSH_KEY_PATH=~/.ssh/hermes_key

# 其他敏感配置
HERMES_DEBUG=false  # 生产环境设为 false
```

### 7.5.3 日志脱敏

Hermes 自动脱敏敏感信息：

**脱敏规则：**
- API 密钥：`sk-****`
- Token：`****`
- 密码：`****`
- 私钥内容：不记录

---

## 7.6 安全最佳实践

### 7.6.1 部署安全

| 实践 | 说明 |
|------|------|
| **使用容器后端** | 优先使用 Docker 或 SSH 后端 |
| **限制网络访问** | 默认禁用容器网络 |
| **定期更新** | 及时更新 Hermes 到最新版本 |
| **审查技能** | 只安装可信源的技能 |
| **监控日志** | 定期检查异常日志 |

### 7.6.2 开发安全

| 实践 | 说明 |
|------|------|
| **不在生产环境调试** | 开发和生产环境分离 |
| **不提交 .env 文件** | 添加到 .gitignore |
| **使用只读挂载** | 敏感目录只读挂载 |
| **限制资源使用** | 配置 CPU/内存上限 |

### 7.6.3 安全配置检查清单

```bash
# 运行安全检查
hermes doctor --security

# 检查项目：
# ✓ Docker 后端是否启用
# ✓ 网络访问是否受限
# ✓ .env 文件权限是否正确（600）
# ✓ 日志脱敏是否启用
# ✓ 技能来源是否可信
```

---

*本章来源：GitHub 官方仓库、CSDN 安全指南、知乎深度解读*
