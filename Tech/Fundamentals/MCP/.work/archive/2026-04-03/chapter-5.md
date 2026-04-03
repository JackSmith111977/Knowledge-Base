# 第 5 章：MCP Server 开发实战（Python）

## 5.1 环境搭建

### 概念定义

MCP Server 是一个独立的进程，通过标准协议（stdio 或 Streamable HTTP）与 MCP Client 通信。Python MCP Server 开发主要使用两种 SDK：

1. **官方 MCP SDK**（`mcp`）：Anthropic 官方维护，实现完整的 MCP 规范
2. **FastMCP**：社区驱动的高级框架，提供更简洁的 API 和更好的开发体验

**开发环境要求：**
- Python 3.10 或更高版本（推荐 3.11+）
- pip 或 uv 包管理器
- 代码编辑器（VS Code、Cursor 等支持 MCP 的 IDE）

### 工作原理

MCP Python SDK 的核心架构：

```
┌─────────────────────────────────────────────────────────┐
│                    MCP Host (客户端)                      │
│              (如：Claude Desktop, Cursor)                 │
└────────────────────┬────────────────────────────────────┘
                     │ MCP Protocol (JSON-RPC 2.0)
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                   MCP Server (你的服务)                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │   Tools     │  │  Resources  │  │   Prompts   │     │
│  │  (工具调用)  │  │  (资源访问)  │  │  (提示模板)  │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │              Transport Layer                     │   │
│  │  - stdio (本地进程通信)                          │   │
│  │  - Streamable HTTP (远程通信)                    │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### 环境搭建步骤

**步骤 1：安装 uv 包管理器（推荐）**

uv 是一个快速的 Python 包管理器，比 pip 快 10-100 倍：

```bash
# Windows (PowerShell)
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"

# 或使用 pip 安装
pip install uv

# 验证安装
uv --version
```

**步骤 2：创建项目目录并初始化**

```bash
# 创建项目目录
mkdir mcp-weather-server
cd mcp-weather-server

# 使用 uv 初始化项目
uv init

# 创建虚拟环境
uv venv

# 激活虚拟环境
# Windows PowerShell
.\.venv\Scripts\Activate.ps1

# Linux/Mac
source .venv/bin/activate
```

**步骤 3：安装 MCP SDK**

```bash
# 方法 1：使用 FastMCP（推荐，更简单）
uv add "mcp[cli]"
uv add fastmcp

# 方法 2：只使用官方 SDK
uv add mcp

# 验证安装
uv run mcp --version
```

**步骤 4：项目结构**

推荐的项目结构：

```
mcp-weather-server/
├── .venv/                 # 虚拟环境
├── src/
│   └── server.py          # 主服务器文件
├── tests/
│   └── test_server.py     # 测试文件
├── pyproject.toml         # 项目配置（uv 创建）
├── requirements.txt       # 依赖列表（可选）
└── README.md              # 项目说明
```

**步骤 5：验证环境**

```python
# 运行一个简单的测试
# test_env.py
from fastmcp import FastMCP

mcp = FastMCP("test-server")

@mcp.tool()
def hello(name: str) -> str:
    """Say hello"""
    return f"Hello, {name}!"

if __name__ == "__main__":
    print("环境测试成功！FastMCP 已正确安装。")
```

```bash
uv run python src/test_env.py
```

### 常见误区

| 误区 | 问题 | 正确做法 |
|------|------|----------|
| "直接用系统 Python" | 依赖冲突，难以管理 | 始终使用虚拟环境 |
| "用 pip 不用 uv" | 安装慢，依赖解析不佳 | 推荐使用 uv |
| "不锁定依赖版本" | 升级导致兼容性问题 | 使用 `uv.lock` 锁定版本 |
| "Python 版本过低" | 某些特性不支持 | 使用 Python 3.10+ |

**来源：**
- https://github.com/modelcontextprotocol/python-sdk
- https://blog.csdn.net/gitblog_00537/article/details/152038410
- https://github.com/66my/fastmcp

---

## 5.2 Server 开发四步法

### 概念定义

MCP Server 开发遵循"四步法"模式：

1. **定义工具（Tools）**：创建可供 LLM 调用的函数
2. **实现逻辑（Implementation）**：编写业务逻辑代码
3. **配置传输（Transport）**：选择通信方式（stdio 或 HTTP）
4. **发布部署（Deployment）**：配置并启动服务器

### 工作原理

#### 第一步：定义工具

工具是 MCP Server 暴露给 LLM 的核心能力。每个工具需要：
- 唯一的名称
- 清晰的描述（LLM 根据描述判断何时调用）
- 参数 Schema（用于参数验证）

```python
from fastmcp import FastMCP

# 创建服务器实例
mcp = FastMCP("weather-server")

# 定义工具 - 使用装饰器
@mcp.tool()
def get_weather(city: str) -> dict:
    """
    获取指定城市的天气信息
    
    参数:
    - city: 城市名称，如"北京"、"New York"
    
    返回:
    - 包含温度、天气状况的字典
    """
    # 实现逻辑将在下一步添加
    pass
```

#### 第二步：实现逻辑

```python
from fastmcp import FastMCP
import httpx

mcp = FastMCP("weather-server")

@mcp.tool()
async def get_weather(city: str) -> dict:
    """
    获取指定城市的天气信息
    
    参数:
    - city: 城市名称，如"北京"、"New York"
    
    返回:
    - 包含温度、天气状况的字典
    """
    # 使用真实的天气 API（示例使用模拟数据）
    # 实际项目中替换为真实 API，如 OpenWeatherMap
    weather_data = {
        "beijing": {"temp": 25, "condition": "晴朗", "humidity": 45},
        "shanghai": {"temp": 28, "condition": "多云", "humidity": 65},
        "new york": {"temp": 22, "condition": "小雨", "humidity": 70},
        "london": {"temp": 18, "condition": "阴天", "humidity": 80},
    }
    
    city_lower = city.lower()
    if city_lower in weather_data:
        data = weather_data[city_lower]
        return {
            "city": city,
            "temperature_celsius": data["temp"],
            "condition": data["condition"],
            "humidity_percent": data["humidity"],
            "recommendation": get_recommendation(data)
        }
    else:
        return {
            "city": city,
            "error": f"未找到城市 '{city}' 的天气数据",
            "available_cities": list(weather_data.keys())
        }

def get_recommendation(data: dict) -> str:
    """根据天气生成建议"""
    if data["condition"] in ["小雨", "大雨"]:
        return "建议携带雨具"
    elif data["temp"] > 30:
        return "天气炎热，注意防暑"
    elif data["temp"] < 10:
        return "天气寒冷，注意保暖"
    else:
        return "天气适宜，适合外出"
```

#### 第三步：配置传输

MCP 支持两种传输方式：

**方式 1：stdio（标准输入输出）- 用于本地通信**

```python
# 使用 stdio 传输
if __name__ == "__main__":
    # 方法 1：使用 fastmcp 命令
    # 命令行运行：fastmcp run server.py
    
    # 方法 2：代码中启动
    mcp.run(transport="stdio")
```

**方式 2：Streamable HTTP - 用于远程通信**

```python
# 使用 Streamable HTTP 传输
if __name__ == "__main__":
    mcp.run(
        transport="streamable-http",
        host="0.0.0.0",  # 监听所有网络接口
        port=8000,
        path="/mcp"
    )
```

**传输方式对比：**

| 特性 | stdio | Streamable HTTP |
|------|-------|-----------------|
| 适用场景 | 本地进程通信 | 远程服务器 |
| 部署复杂度 | 低 | 中 |
| 网络要求 | 无需网络 | 需要开放端口 |
| 性能 | 高（无网络开销） | 中 |
| 安全性 | 高（本地通信） | 需配置 TLS |

#### 第四步：发布部署

**本地开发部署（stdio）：**

```bash
# 开发模式运行
fastmcp run src/server.py

# 或使用 Python 直接运行
uv run python src/server.py
```

**生产环境部署（HTTP）：**

```python
# production_server.py
from fastmcp import FastMCP
import os

mcp = FastMCP("weather-server-prod")

# ... 工具定义 ...

if __name__ == "__main__":
    # 从环境变量读取配置
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 8000))
    
    # 生产环境配置
    mcp.run(
        transport="streamable-http",
        host=host,
        port=port,
        path="/mcp",
        # 启用 TLS（生产环境必须）
        tls_config={
            "cert_file": os.getenv("TLS_CERT", "/path/to/cert.pem"),
            "key_file": os.getenv("TLS_KEY", "/path/to/key.pem")
        } if os.getenv("TLS_ENABLED") else None
    )
```

**Docker 部署：**

```dockerfile
# Dockerfile
FROM python:3.11-slim

WORKDIR /app

# 安装 uv
RUN pip install uv

# 复制项目文件
COPY pyproject.toml uv.lock ./
COPY src/ ./src/

# 安装依赖
RUN uv sync --frozen

# 暴露端口
EXPOSE 8000

# 启动服务器
CMD ["uv", "run", "fastmcp", "run", "src/server.py", "--transport", "streamable-http", "--host", "0.0.0.0", "--port", "8000"]
```

### 常见误区

| 误区 | 问题 | 正确做法 |
|------|------|----------|
| "Tool 描述太简单" | LLM 无法正确判断调用时机 | 提供详细的描述、参数说明和返回值说明 |
| "不处理异常情况" | 错误时返回堆栈信息，泄露敏感数据 | 使用 try-except 捕获异常并返回友好错误 |
| "传输方式选错" | 本地场景用 HTTP，增加复杂度 | 本地用 stdio，远程用 HTTP |
| "生产环境不开 TLS" | 通信数据明文传输，容易被窃听 | 生产环境必须启用 TLS |

**来源：**
- https://blog.csdn.net/qsc90123456/article/details/152389304
- https://blog.csdn.net/gitblog_00444/article/details/155250531
- https://blog.csdn.net/qq_31185049/article/details/148036631

---

## 5.3 完整示例：天气查询 Server

### 项目结构

```
mcp-weather-server/
├── src/
│   ├── __init__.py
│   ├── server.py           # 主服务器入口
│   ├── tools/
│   │   ├── __init__.py
│   │   ├── weather.py      # 天气工具实现
│   │   └── forecast.py     # 天气预报工具
│   ├── resources/
│   │   ├── __init__.py
│   │   └── cities.py       # 城市资源
│   ├── config.py           # 配置管理
│   └── utils/
│       ├── __init__.py
│       └── api_client.py   # API 客户端
├── tests/
│   └── test_weather.py
├── pyproject.toml
├── .env.example
└── README.md
```

### 完整代码实现

**主服务器入口（src/server.py）：**

```python
"""
MCP Weather Server - 天气查询服务

一个基于 MCP 协议的天气查询服务，提供：
- 实时天气查询工具
- 天气预报工具
- 城市列表资源
- 个性化天气提示

使用方法:
    fastmcp run src/server.py
"""

from fastmcp import FastMCP
from src.tools.weather import get_weather, get_weather_by_coordinates
from src.tools.forecast import get_forecast
from src.resources.cities import get_city_list
from src.config import Config

# 创建 MCP 服务器
mcp = FastMCP(
    name="Weather Server",
    instructions="""
    这是一个天气查询服务，可以提供以下功能：
    
    1. 实时天气查询：获取当前城市的天气状况
    2. 天气预报：获取未来 7 天的天气预测
    3. 城市列表：获取支持的城市列表
    
    使用示例:
    - "北京今天天气怎么样？"
    - "上海未来三天会下雨吗？"
    - "支持查询哪些城市？"
    """
)

# 注册工具
mcp.tool()(get_weather)
mcp.tool()(get_weather_by_coordinates)
mcp.tool()(get_forecast)

# 注册资源
mcp.resource("cities://list")(get_city_list)

# 注册提示模板
@mcp.prompt()
def weather_report(city: str, days: int = 3) -> str:
    """生成天气报告提示模板"""
    return f"""
    请为 {city} 生成一份{days}天的天气报告。
    
    报告应包含:
    1. 当前天气状况
    2. 温度趋势
    3. 降水概率
    4. 生活建议（穿衣、出行等）
    
    请使用友好的语气，适合普通用户阅读。
    """

if __name__ == "__main__":
    # 开发环境：使用 stdio
    # 生产环境：使用 streamable-http
    import os
    
    transport = os.getenv("MCP_TRANSPORT", "stdio")
    
    if transport == "http":
        mcp.run(
            transport="streamable-http",
            host="0.0.0.0",
            port=int(os.getenv("PORT", "8000"))
        )
    else:
        mcp.run(transport="stdio")
```

**天气工具实现（src/tools/weather.py）：**

```python
"""
天气查询工具模块

提供实时天气查询功能，支持：
- 按城市名称查询
- 按经纬度查询
"""

from typing import Optional
import httpx
from src.config import Config

# 模拟天气数据（实际项目中使用真实 API）
MOCK_WEATHER_DATA = {
    "beijing": {
        "temp_c": 25,
        "temp_f": 77,
        "condition": "Partly cloudy",
        "condition_cn": "多云",
        "humidity": 45,
        "wind_kph": 15,
        "wind_dir": "NE",
        "feelslike_c": 26,
        "uv_index": 6,
        "air_quality": {
            "pm2_5": 35,
            "pm10": 50,
            "quality": "良"
        }
    },
    "shanghai": {
        "temp_c": 28,
        "temp_f": 82,
        "condition": "Overcast",
        "condition_cn": "阴天",
        "humidity": 65,
        "wind_kph": 12,
        "wind_dir": "SE",
        "feelslike_c": 30,
        "uv_index": 4,
        "air_quality": {
            "pm2_5": 45,
            "pm10": 65,
            "quality": "良"
        }
    },
    "guangzhou": {
        "temp_c": 32,
        "temp_f": 90,
        "condition": "Sunny",
        "condition_cn": "晴朗",
        "humidity": 70,
        "wind_kph": 8,
        "wind_dir": "S",
        "feelslike_c": 36,
        "uv_index": 8,
        "air_quality": {
            "pm2_5": 25,
            "pm10": 40,
            "quality": "优"
        }
    },
    "new york": {
        "temp_c": 22,
        "temp_f": 72,
        "condition": "Light rain",
        "condition_cn": "小雨",
        "humidity": 75,
        "wind_kph": 20,
        "wind_dir": "W",
        "feelslike_c": 22,
        "uv_index": 3,
        "air_quality": {
            "pm2_5": 15,
            "pm10": 25,
            "quality": "优"
        }
    },
    "london": {
        "temp_c": 18,
        "temp_f": 64,
        "condition": "Cloudy",
        "condition_cn": "多云",
        "humidity": 80,
        "wind_kph": 25,
        "wind_dir": "SW",
        "feelslike_c": 16,
        "uv_index": 2,
        "air_quality": {
            "pm2_5": 20,
            "pm10": 30,
            "quality": "优"
        }
    }
}


async def fetch_weather_from_api(city: str) -> Optional[dict]:
    """
    从天气 API 获取数据
    
    实际项目中替换为真实 API 调用
    例如：OpenWeatherMap, WeatherAPI, AccuWeather
    """
    # 模拟 API 调用延迟
    import asyncio
    await asyncio.sleep(0.5)
    
    city_lower = city.lower().strip()
    
    # 支持中文城市名映射
    city_map = {
        "北京": "beijing",
        "上海": "shanghai",
        "广州": "guangzhou",
        "深圳": "shenzhen",
        "纽约": "new york",
        "伦敦": "london"
    }
    
    api_city = city_map.get(city_lower, city_lower)
    
    if api_city in MOCK_WEATHER_DATA:
        data = MOCK_WEATHER_DATA[api_city].copy()
        data["city"] = city
        data["city_en"] = api_city
        return data
    
    return None


async def get_weather(city: str) -> dict:
    """
    获取指定城市的实时天气
    
    参数:
        city: 城市名称（支持中英文）
    
    返回:
        包含天气信息的字典，格式如下:
        {
            "city": "北京",
            "city_en": "beijing",
            "temperature": {"celsius": 25, "fahrenheit": 77},
            "condition": {"en": "Partly cloudy", "cn": "多云"},
            "humidity": 45,
            "wind": {"speed_kph": 15, "direction": "NE"},
            "feels_like_c": 26,
            "uv_index": 6,
            "air_quality": {...},
            "recommendation": "..."
        }
    
    异常:
        ValueError: 当城市不存在时
    """
    # 参数验证
    if not city or not isinstance(city, str):
        raise ValueError("城市名称必须是非空字符串")
    
    if len(city) > 100:
        raise ValueError("城市名称过长")
    
    # 获取天气数据
    weather_data = await fetch_weather_from_api(city)
    
    if not weather_data:
        # 返回友好的错误信息
        available_cities = {
            "beijing": "北京",
            "shanghai": "上海",
            "guangzhou": "广州",
            "new york": "纽约",
            "london": "伦敦"
        }
        raise ValueError(
            f"未找到城市 '{city}' 的天气数据。"
            f"支持的城市：{', '.join(f'{cn}({en})' for en, cn in available_cities.items())}"
        )
    
    # 格式化返回结果
    result = {
        "city": weather_data["city"],
        "city_en": weather_data["city_en"],
        "temperature": {
            "celsius": weather_data["temp_c"],
            "fahrenheit": weather_data["temp_f"]
        },
        "condition": {
            "en": weather_data["condition"],
            "cn": weather_data["condition_cn"]
        },
        "humidity": weather_data["humidity"],
        "wind": {
            "speed_kph": weather_data["wind_kph"],
            "direction": weather_data["wind_dir"]
        },
        "feels_like_c": weather_data["feelslike_c"],
        "uv_index": weather_data["uv_index"],
        "air_quality": weather_data.get("air_quality", {}),
        "recommendation": generate_weather_recommendation(weather_data)
    }
    
    return result


async def get_weather_by_coordinates(latitude: float, longitude: float) -> dict:
    """
    根据经纬度获取天气
    
    参数:
        latitude: 纬度（-90 到 90）
        longitude: 经度（-180 到 180）
    
    返回:
        与 get_weather 相同格式的天气信息
    
    异常:
        ValueError: 当坐标超出范围时
    """
    # 验证坐标范围
    if not -90 <= latitude <= 90:
        raise ValueError(f"纬度必须在 -90 到 90 之间，当前值：{latitude}")
    
    if not -180 <= longitude <= 180:
        raise ValueError(f"经度必须在 -180 到 180 之间，当前值：{longitude}")
    
    # 简化的坐标到城市映射（实际项目中使用反向地理编码）
    coord_cities = [
        (39.9, 116.4, "beijing"),
        (31.2, 121.5, "shanghai"),
        (23.1, 113.3, "guangzhou"),
        (40.7, -74.0, "new york"),
        (51.5, -0.1, "london")
    ]
    
    # 找到最近的城市
    min_distance = float('inf')
    nearest_city = None
    
    for lat, lon, city in coord_cities:
        distance = ((lat - latitude) ** 2 + (lon - longitude) ** 2) ** 0.5
        if distance < min_distance:
            min_distance = distance
            nearest_city = city
    
    if nearest_city and min_distance < 5:  # 5 度范围内
        return await get_weather(nearest_city)
    else:
        raise ValueError(
            f"坐标 ({latitude}, {longitude}) 附近没有支持的天气数据。"
            f"最近距离：{min_distance:.2f}度"
        )


def generate_weather_recommendation(data: dict) -> str:
    """根据天气数据生成生活建议"""
    recommendations = []
    
    # 温度建议
    temp = data["temp_c"]
    if temp > 35:
        recommendations.append("天气炎热，请注意防暑降温，避免长时间户外活动")
    elif temp > 28:
        recommendations.append("天气较热，建议穿短袖，注意补水")
    elif temp > 20:
        recommendations.append("天气温暖舒适，适宜户外活动")
    elif temp > 10:
        recommendations.append("天气较凉，建议添加外套")
    else:
        recommendations.append("天气寒冷，请注意保暖")
    
    # 降水建议
    condition = data.get("condition", "").lower()
    if "rain" in condition or "雨" in data.get("condition_cn", ""):
        recommendations.append("可能下雨，请携带雨具")
    
    # 紫外线建议
    uv = data.get("uv_index", 0)
    if uv >= 8:
        recommendations.append("紫外线很强，请做好防晒措施")
    elif uv >= 6:
        recommendations.append("紫外线较强，建议涂抹防晒霜")
    
    # 空气质量建议
    aq = data.get("air_quality", {})
    if aq.get("quality") == "差" or aq.get("pm2_5", 0) > 75:
        recommendations.append("空气质量较差，敏感人群减少户外活动")
    
    return "。".join(recommendations) + "。" if recommendations else "天气适宜，无明显注意事项。"
```

**城市资源（src/resources/cities.py）：**

```python
"""
城市资源模块

提供城市列表资源，供 LLM 查询支持的城市
"""

# 支持的城市列表
SUPPORTED_CITIES = {
    "中国": [
        {"name_cn": "北京", "name_en": "Beijing", "lat": 39.9, "lon": 116.4},
        {"name_cn": "上海", "name_en": "Shanghai", "lat": 31.2, "lon": 121.5},
        {"name_cn": "广州", "name_en": "Guangzhou", "lat": 23.1, "lon": 113.3},
        {"name_cn": "深圳", "name_en": "Shenzhen", "lat": 22.5, "lon": 114.1},
        {"name_cn": "成都", "name_en": "Chengdu", "lat": 30.6, "lon": 104.1},
        {"name_cn": "杭州", "name_en": "Hangzhou", "lat": 30.3, "lon": 120.2},
    ],
    "美国": [
        {"name_cn": "纽约", "name_en": "New York", "lat": 40.7, "lon": -74.0},
        {"name_cn": "洛杉矶", "name_en": "Los Angeles", "lat": 34.1, "lon": -118.3},
        {"name_cn": "旧金山", "name_en": "San Francisco", "lat": 37.8, "lon": -122.4},
    ],
    "英国": [
        {"name_cn": "伦敦", "name_en": "London", "lat": 51.5, "lon": -0.1},
        {"name_cn": "曼彻斯特", "name_en": "Manchester", "lat": 53.5, "lon": -2.2},
    ],
    "日本": [
        {"name_cn": "东京", "name_en": "Tokyo", "lat": 35.7, "lon": 139.7},
        {"name_cn": "大阪", "name_en": "Osaka", "lat": 34.7, "lon": 135.5},
    ]
}


async def get_city_list() -> str:
    """
    获取支持的城市列表
    
    返回:
        格式化的城市列表文本
    """
    lines = ["# 支持的城市列表\n"]
    
    for country, cities in SUPPORTED_CITIES.items():
        lines.append(f"## {country}")
        for city in cities:
            lines.append(
                f"- {city['name_cn']} ({city['name_en']}) - "
                f"坐标：{city['lat']}, {city['lon']}"
            )
        lines.append("")
    
    return "\n".join(lines)
```

**配置文件（src/config.py）：**

```python
"""
配置管理模块

从环境变量或配置文件中加载配置
"""

import os
from dataclasses import dataclass
from typing import Optional


@dataclass
class Config:
    """MCP Server 配置"""
    
    # 服务器配置
    name: str = "Weather Server"
    version: str = "1.0.0"
    
    # 传输配置
    transport: str = "stdio"  # stdio 或 streamable-http
    host: str = "0.0.0.0"
    port: int = 8000
    path: str = "/mcp"
    
    # API 配置
    weather_api_key: Optional[str] = None
    weather_api_url: str = "https://api.weatherapi.com/v1"
    
    # 缓存配置
    cache_ttl: int = 300  # 5 分钟
    
    @classmethod
    def from_env(cls) -> "Config":
        """从环境变量加载配置"""
        return cls(
            name=os.getenv("MCP_NAME", "Weather Server"),
            transport=os.getenv("MCP_TRANSPORT", "stdio"),
            host=os.getenv("MCP_HOST", "0.0.0.0"),
            port=int(os.getenv("MCP_PORT", "8000")),
            weather_api_key=os.getenv("WEATHER_API_KEY"),
            cache_ttl=int(os.getenv("CACHE_TTL", "300"))
        )


# 全局配置实例
config = Config.from_env()
```

**运行服务器：**

```bash
# 开发模式（stdio）
cd mcp-weather-server
uv run fastmcp run src/server.py

# 或使用 Python 直接运行
uv run python src/server.py

# HTTP 模式
MCP_TRANSPORT=http uv run python src/server.py
```

### 常见误区

| 误区 | 问题 | 正确做法 |
|------|------|----------|
| "直接在 Tool 中硬编码 API Key" | 密钥泄露风险 | 使用环境变量或密钥管理服务 |
| "不处理 API 超时" | 请求卡死 | 设置合理的超时时间 |
| "返回原始 API 响应" | 格式不统一，可能泄露敏感信息 | 统一格式化返回结果 |
| "没有错误处理" | 异常时返回堆栈信息 | 捕获异常并返回友好的错误信息 |

**来源：**
- https://www.163.com/dy/article/KLRGUVMR0531D9VR.html
- https://blog.csdn.net/g5h6i/article/details/154930307
- https://blog.csdn.net/b0c1d2/article/details/151467242
- https://github.com/KshitizSareen/Python-MCP-Server

---

## 5.4 调试技巧与部署方案

### 调试技巧

**1. 使用 MCP Inspector 调试**

MCP Inspector 是官方提供的调试工具，可以查看 MCP 消息的完整内容：

```bash
# 安装 MCP Inspector
npm install -g @modelcontextprotocol/inspector

# 启动 Inspector
npx @modelcontextprotocol/inspector python src/server.py

# 或使用 uv
uv run mcp dev src/server.py
```

**2. 启用详细日志**

```python
# 在 server.py 中启用调试日志
import logging

logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger("mcp-server")
logger.setLevel(logging.DEBUG)
```

**3. 本地测试脚本**

```python
# tests/test_server.py
"""
MCP Server 本地测试脚本
"""

import asyncio
from src.server import mcp
from src.tools.weather import get_weather


async def test_weather_tool():
    """测试天气查询工具"""
    print("测试 1: 查询北京天气")
    result = await get_weather("北京")
    print(f"结果：{result}")
    
    print("\n测试 2: 查询不存在的城市")
    try:
        await get_weather("NonExistentCity")
    except ValueError as e:
        print(f"捕获预期错误：{e}")
    
    print("\n测试 3: 查询纽约天气")
    result = await get_weather("New York")
    print(f"结果：{result}")


async def test_prompt():
    """测试提示模板"""
    print("测试提示模板:")
    from src.server import weather_report
    prompt = await weather_report("北京", 3)
    print(prompt)


async def main():
    print("=" * 50)
    print("MCP Weather Server 测试")
    print("=" * 50)
    
    await test_weather_tool()
    print("\n" + "=" * 50)
    await test_prompt()
    
    print("\n" + "=" * 50)
    print("所有测试完成!")


if __name__ == "__main__":
    asyncio.run(main())
```

**4. 与 Claude Desktop 集成测试**

```json
// claude_desktop_config.json
{
  "mcpServers": {
    "weather": {
      "command": "uv",
      "args": ["run", "fastmcp", "run", "/path/to/src/server.py"],
      "env": {
        "WEATHER_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

### 部署方案

**方案 1：本地部署（stdio）**

适用于本地开发和桌面应用：

```yaml
# s.yaml (Serverless Devs)
edition: 1.0.0
name: mcp-weather-server
access: default

vars:
  region: cn-hangzhou
  functionName: mcp-weather-server

services:
  weather-server:
    component: fc
    props:
      region: ${vars.region}
      functionName: ${vars.functionName}
      runtime: custom
      handler: index.handler
      codeUri: ./code
      memorySize: 512
      timeout: 60
      layers:
        - acs:fc:${vars.region}:official:layers/Python310/versions/latest
      customRuntimeConfig:
        command:
          - python
          - src/server.py
        port: 8000
```

**方案 2：Docker 部署**

```dockerfile
# Dockerfile
FROM python:3.11-slim

WORKDIR /app

# 安装 uv
RUN pip install uv

# 复制依赖文件
COPY pyproject.toml uv.lock ./

# 安装依赖
RUN uv sync --frozen --no-dev

# 复制源代码
COPY src/ ./src/

# 创建非 root 用户
RUN useradd -m -u 1000 mcpuser && chown -R mcpuser:mcpuser /app
USER mcpuser

# 暴露端口
EXPOSE 8000

# 健康检查
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# 启动命令
CMD ["uv", "run", "fastmcp", "run", "src/server.py", \
     "--transport", "streamable-http", \
     "--host", "0.0.0.0", \
     "--port", "8000"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  mcp-weather:
    build: .
    ports:
      - "8000:8000"
    environment:
      - WEATHER_API_KEY=${WEATHER_API_KEY}
      - MCP_TRANSPORT=http
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

**方案 3：云平台部署（Azure Container Apps）**

```bash
# 部署到 Azure Container Apps
# 1. 登录 Azure
az login

# 2. 创建资源组
az group create --name mcp-weather-rg --location eastus

# 3. 创建容器应用环境
az containerapp env create \
  --name mcp-weather-env \
  --resource-group mcp-weather-rg \
  --location eastus

# 4. 构建并推送镜像
docker build -t myregistry.azurecr.io/mcp-weather:latest .
docker push myregistry.azurecr.io/mcp-weather:latest

# 5. 创建容器应用
az containerapp create \
  --name mcp-weather-server \
  --resource-group mcp-weather-rg \
  --environment mcp-weather-env \
  --image myregistry.azurecr.io/mcp-weather:latest \
  --target-port 8000 \
  --ingress external \
  --env-vars WEATHER_API_KEY=<your-api-key>
```

**方案 4：npm 发布（Python 包）**

```toml
# pyproject.toml
[project]
name = "mcp-weather-server"
version = "1.0.0"
description = "MCP 天气查询服务器"
readme = "README.md"
requires-python = ">=3.10"
dependencies = [
    "mcp>=1.0.0",
    "fastmcp>=0.1.0",
    "httpx>=0.27.0",
]

[project.scripts]
mcp-weather = "src.server:mcp.run"

[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"
```

```bash
# 发布到 PyPI
uv build
uv publish

# 用户安装后直接运行
pip install mcp-weather-server
mcp-weather
```

### 部署检查清单

部署前请确认：

- [ ] **安全配置**
  - [ ] API 密钥使用环境变量，未硬编码
  - [ ] 生产环境启用 TLS/HTTPS
  - [ ] 配置了适当的防火墙规则
  - [ ] 禁用了调试模式

- [ ] **性能优化**
  - [ ] 配置了响应缓存
  - [ ] 设置了合理的超时时间
  - [ ] 配置了连接池

- [ ] **监控日志**
  - [ ] 启用了访问日志
  - [ ] 配置了错误日志
  - [ ] 设置了日志轮转

- [ ] **健康检查**
  - [ ] 实现了健康检查端点
  - [ ] 配置了容器健康检查
  - [ ] 设置了自动重启策略

**来源：**
- https://learn.microsoft.com/zh-cn/azure/container-apps/sessions-tutorial-python-mcp
- https://blog.csdn.net/2402_87515571/article/details/157142316
- https://zhuanlan.zhihu.com/p/1892865724239828692

---

**第 5 章完成确认**
- 字数统计：约 6,500 字
- 来源数量：12+
- 涵盖内容：环境搭建、Server 开发四步法、完整天气查询 Server 示例、调试技巧与部署方案
