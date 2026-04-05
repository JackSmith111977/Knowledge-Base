# 第 3 章：安装与部署

## 3.1 系统要求与环境准备

### 3.1.1 操作系统支持

| 系统 | 支持状态 | 说明 |
|------|----------|------|
| **Linux** | ✅ 原生支持 | 推荐 Ubuntu 20.04+ |
| **macOS** | ✅ 原生支持 | macOS 11+ |
| **WSL2** | ✅ 官方推荐 | Windows 用户的唯一支持方案 |
| **Windows (原生)** | ❌ 不支持 | 硬约束，必须使用 WSL2 |

### 3.1.2 硬件要求

| 组件 | 最低要求 | 推荐配置 |
|------|----------|----------|
| **CPU** | 2 核心 | 4 核心+ |
| **内存** | 4GB | 8GB+（12GB 最佳） |
| **存储** | 5GB 可用空间 | 20GB+ SSD |
| **网络** | 稳定互联网连接 | 低延迟连接（用于 API 调用） |

### 3.1.3 软件依赖

| 依赖 | 版本要求 | 说明 |
|------|----------|------|
| **Python** | ≥ 3.11 | 框架主要语言 |
| **Node.js** | ≥ 18.0.0 | 部分工具和 CLI 界面 |
| **Git** | 最新版 | 代码管理和更新 |

### 3.1.4 VPS 部署推荐

**Contabo Cloud VPS 20**（性价比高）：
- 价格：$6/月
- 配置：12GB RAM, 200GB SSD
- 系统：Ubuntu 20.04 LTS

**其他推荐提供商：**
- DigitalOcean Droplet ($12/月)
- Linode ($10/月)
- AWS Lightsail ($5/月 起)

---

## 3.2 一键安装流程

### 3.2.1 快速安装（推荐）

```bash
# 步骤 1：执行安装脚本
curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash

# 步骤 2：重新加载 shell 配置
source ~/.bashrc

# 步骤 3：验证安装
hermes --version
```

安装脚本会自动完成：
- 克隆 GitHub 仓库
- 创建 Python 虚拟环境
- 安装所有 Python 依赖
- 安装 Node.js 依赖
- 初始化用户目录 `~/.hermes/`

### 3.2.2 手动安装（高级用户）

```bash
# 步骤 1：克隆仓库
git clone https://github.com/NousResearch/hermes-agent.git
cd hermes-agent

# 步骤 2：创建 Python 虚拟环境
python -m venv .venv
source .venv/bin/activate  # Linux/macOS
# 或 .venv\Scripts\activate  # Windows/WSL

# 步骤 3：安装依赖
pip install -r requirements.txt

# 步骤 4：安装 Node.js 依赖
npm install

# 步骤 5：初始化配置
hermes setup
```

### 3.2.3 Docker 安装

```bash
# 拉取官方镜像
docker pull nousresearch/hermes-agent:latest

# 运行容器
docker run -d \
  --name hermes \
  -v ~/.hermes:/root/.hermes \
  -e OPENROUTER_API_KEY=$OPENROUTER_API_KEY \
  nousresearch/hermes-agent:latest
```

---

## 3.3 配置详解

### 3.3.1 初始化向导

```bash
# 运行完整初始化向导
hermes setup
```

向导会引导你完成：
1. 选择模型提供商
2. 输入 API 密钥
3. 配置终端后端
4. 启用/禁用工具
5. 设置消息平台（可选）

### 3.3.2 模型配置

```bash
# 选择和配置模型
hermes model
```

**支持的模型提供商：**

| 提供商 | 配置命令 | 说明 |
|--------|----------|------|
| **Nous Portal** | `hermes model --provider nous` | 官方 API，400+ 模型 |
| **OpenRouter** | `hermes model --provider openrouter` | 统一接口，多模型 |
| **z.ai/GLM** | `hermes model --provider zai` | 智谱 AI |
| **Kimi/Moonshot** | `hermes model --provider kimai` | 月之暗面 |
| **MiniMax** | `hermes model --provider minimax` |  MiniMax AI |
| **OpenAI** | `hermes model --provider openai` | GPT 系列 |
| **自定义端点** | `hermes model --provider custom` | OpenAI 兼容 API |

### 3.3.3 工具配置

```bash
# 配置启用的工具
hermes tools
```

**内置工具分类：**

| 分类 | 工具 | 说明 |
|------|------|------|
| **Web** | web_search, web_fetch | 搜索和抓取网页 |
| **文件** | file_read, file_write, file_list | 文件系统操作 |
| **终端** | terminal, process | 命令执行和进程管理 |
| **图像** | image_generate, image_edit | 图像生成和编辑 |
| **代码** | code_run, code_review | 代码执行和审查 |
| **MCP** | mcp_connect | 连接 MCP 服务器 |

### 3.3.4 环境配置（.env 文件）

编辑 `~/.hermes/.env`：

```bash
# 模型 API 密钥
OPENROUTER_API_KEY=sk-or-xxxxxxxxxxxx
NOUS_PORTAL_API_KEY=np_xxxxxxxxxxxx
OPENAI_API_KEY=sk-xxxxxxxxxxxx

# 消息平台配置（可选）
TELEGRAM_BOT_TOKEN=xxxxxxxxx:xxxxxxxxxxxxxxxxxxx
DISCORD_BOT_TOKEN=xxxxxxxxxxxxxxxxxxxx
SLACK_BOT_TOKEN=xoxb-xxxxxxxxxxxx

# 其他配置
HERMES_LOG_LEVEL=info
HERMES_DEBUG=false
```

---

## 3.4 部署方案

### 3.4.1 本地部署（开发环境）

**适用场景：**
- 个人开发和测试
- 快速原型验证
- 学习探索

**配置要点：**
```yaml
terminal:
  backend: local
  sandbox: false  # 开发环境可关闭沙盒
```

**优点：**
- 零成本
- 快速迭代
- 完整调试能力

**缺点：**
- 依赖本地硬件
- 无法 24/7 运行
- 安全性较低

---

### 3.4.2 VPS 部署（生产环境）

**适用场景：**
- 24/7 持久运行
- 团队协作
- 生产工作负载

**部署步骤：**

```bash
# 1. SSH 连接到 VPS
ssh user@your-vps-ip

# 2. 执行安装
curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash

# 3. 配置环境变量
echo "OPENROUTER_API_KEY=sk-xxx" >> ~/.bashrc
source ~/.bashrc

# 4. 启动网关（后台运行）
hermes gateway start

# 5. 设置开机自启（systemd）
sudo nano /etc/systemd/system/hermes.service
```

**systemd 服务配置示例：**

```ini
[Unit]
Description=Hermes Agent Gateway
After=network.target

[Service]
Type=simple
User=hermes
WorkingDirectory=/home/hermes/hermes-agent
ExecStart=/home/hermes/hermes-agent/.venv/bin/python -m hermes.gateway
Restart=always
Environment=PATH=/home/hermes/hermes-agent/.venv/bin:/usr/bin:/bin

[Install]
WantedBy=multi-user.target
```

**启动服务：**
```bash
sudo systemctl daemon-reload
sudo systemctl enable hermes
sudo systemctl start hermes
sudo systemctl status hermes
```

---

### 3.4.3 Docker 部署（容器隔离）

**适用场景：**
- 需要安全隔离
- 多环境一致性
- 易于扩展

**docker-compose.yml 配置：**

```yaml
version: '3.8'

services:
  hermes:
    image: nousresearch/hermes-agent:latest
    container_name: hermes-agent
    restart: unless-stopped
    volumes:
      - ./config:/app/config
      - ./data:/root/.hermes
      - /var/run/docker.sock:/var/run/docker.sock  # 如果需要 Docker 后端
    environment:
      - OPENROUTER_API_KEY=${OPENROUTER_API_KEY}
      - HERMES_LOG_LEVEL=info
    ports:
      - "3000:3000"  # 如果需要暴露端口
```

**启动命令：**
```bash
docker-compose up -d
```

---

### 3.4.4 云原生部署（Modal/Daytona）

**适用场景：**
- 需要弹性伸缩
- 无服务器架构
- 按需付费

**Modal 部署示例：**

```python
# modal_app.py
import modal
from hermes.agent import Agent

app = modal.App("hermes-agent")

image = modal.Image.debian_slim().pip_install("hermes-agent")

@app.function(image=image)
def run_agent(task: str):
    agent = Agent()
    return agent.execute(task)
```

**部署命令：**
```bash
modal deploy modal_app.py
```

---

### 3.4.5 SSH 远程部署

**适用场景：**
- 利用现有服务器资源
- 连接内部网络
- 分布式执行

**配置步骤：**

```bash
# 1. 配置 SSH 密钥
ssh-keygen -t ed25519
ssh-copy-id user@remote-server

# 2. 在 Hermes 中配置 SSH 后端
hermes config set terminal.backend ssh
hermes config set terminal.ssh_host user@remote-server
hermes config set terminal.ssh_key ~/.ssh/id_ed25519

# 3. 测试连接
hermes terminal test
```

---

## 3.5 故障排查

### 3.5.1 诊断命令

```bash
# 诊断环境问题
hermes doctor

# 查看日志
hermes logs
hermes logs --follow

# 查看错误日志
tail -f ~/.hermes/logs/errors.log
```

### 3.5.2 常见问题

| 问题 | 可能原因 | 解决方案 |
|------|----------|----------|
| **命令未找到** | PATH 未更新 | `source ~/.bashrc` |
| **API 密钥错误** | .env 配置错误 | 检查 `~/.hermes/.env` |
| **Python 版本过低** | 系统 Python < 3.11 | 安装 Python 3.11+ |
| **WSL 网络问题** | WSL2 网络配置 | `wsl --shutdown` 重启 |
| **权限错误** | 文件权限问题 | `chmod -R 755 ~/.hermes` |

### 3.5.3 更新到最新版本

```bash
# 官方更新命令
hermes update

# 或手动更新
cd ~/hermes-agent
git pull
pip install -r requirements.txt --upgrade
```

---

*本章来源：GitHub 官方仓库、知乎安装指南、CSDN 部署教程、火山引擎开发者社区*
