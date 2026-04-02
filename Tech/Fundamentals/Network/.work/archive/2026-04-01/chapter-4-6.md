# 计算机网络第 4-6 章 深度调研草稿

> **文档版本**：v1.0-draft  
> **调研日期**：2026-04-01  
> **参考来源**：CSDN、腾讯云开发者社区、阿里云开发者社区、百度百科、知乎等  
> **存储位置**：`Tech/Fundamentals/Network/.work/network/drafts/chapter-4-6.md`

---

## 目录

- [第 4 章 网络层](#第 4 章 - 网络层)
  - [4.1 IP 协议与 IP 地址](#41-ip-协议与 ip-地址)
  - [4.2 子网划分与 CIDR](#42-子网划分与 cidr)
  - [4.3 路由选择协议](#43-路由选择协议)
  - [4.4 NAT 与 IPv6](#44-nat-与 ipv6)
- [第 5 章 传输层](#第 5 章 - 传输层)
  - [5.1 TCP 协议](#51-tcp-协议)
  - [5.2 UDP 协议](#52-udp-协议)
  - [5.3 端口与套接字](#53-端口与套接字)
  - [5.4 流量控制与拥塞控制](#54-流量控制与拥塞控制)
- [第 6 章 应用层](#第 6 章 - 应用层)
  - [6.1 HTTP/HTTPS 协议](#61-httphttps-协议)
  - [6.2 DNS 域名系统](#62-dns-域名系统)
  - [6.3 FTP、SMTP 等常见协议](#63-ftp-smtp-等常见协议)
  - [6.4 WebSocket 与实时通信](#64-websocket-与实时通信)

---

# 第 4 章 网络层

网络层（Network Layer）是 OSI 七层模型中的第三层，负责在不同网络之间传输数据包，实现主机到主机（Host-to-Host）的通信。网络层的核心功能包括**寻址**、**路由选择**和**分组转发**。

---

## 4.1 IP 协议与 IP 地址

### 4.1.1 概念定义

**IP 协议（Internet Protocol）** 是互联网中最核心的网络层协议，它定义了数据包在网络中如何寻址、路由和传输的规则。IP 协议是一种**面向无连接**的协议，不保证数据包的可靠传输，也不保证数据包的传输顺序。

**为什么需要 IP 协议？**
- 屏蔽底层异构网络的差异（以太网、Wi-Fi、广域网等）
- 提供统一的寻址方案（IP 地址）
- 实现跨网络的数据传输

### 4.1.2 IPv4 报文格式详解

IPv4 数据报由**首部**和**数据**两部分组成，首部长度为 20-60 字节。

```
 0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|  版本 (4)     |  首部长度 (4)  |    区分服务 (8)              |    总长度 (16)                 |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|         标识 (16)             | 标志 (3)|     片偏移 (13)               |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|    生存时间 TTL(8)           |    协议 (8)     |    首部校验和 (16)     |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                         源 IP 地址 (32)                        |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                       目的 IP 地址 (32)                        |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                         选项 (可选)                            |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                           数据部分                            |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
```

**各字段详细解析：**

| 字段名 | 位数 | 说明 | 取值范围/示例 |
|--------|------|------|---------------|
| 版本 (Version) | 4 位 | IP 协议版本号 | IPv4=4 (0100), IPv6=6 (0110) |
| 首部长度 (IHL) | 4 位 | 首部长度，单位 4 字节 | 5-15，对应 20-60 字节 |
| 区分服务 (TOS) | 8 位 | 服务优先级 | 最小延时/最大吞吐量/最高可靠性/最小成本 |
| 总长度 | 16 位 | 首部 + 数据的总字节数 | 最大 65535 字节 |
| 标识 | 16 位 | 数据报唯一标识 | 用于分片重组，相同分片标识相同 |
| 标志 | 3 位 | 分片控制 | DF(禁止分片), MF(更多分片) |
| 片偏移 | 13 位 | 分片在原始数据报中的位置 | 单位 8 字节，实际偏移=值×8 |
| 生存时间 (TTL) | 8 位 | 最大跳数 | 每经过一个路由器减 1，为 0 时丢弃 |
| 协议 | 8 位 | 上层协议类型 | TCP=6, UDP=17, ICMP=1 |
| 首部校验和 | 16 位 | 首部 CRC 校验 | 每经过路由器需重新计算 |
| 源/目的 IP 地址 | 32 位 | 发送方/接收方地址 | 如 192.168.1.1 |

**工作原理：**

1. **封装过程**：传输层数据（TCP 段或 UDP 数据报）传递给网络层，网络层添加 IP 首部形成 IP 数据报
2. **路由选择**：路由器根据目的 IP 地址查询路由表，决定下一跳
3. **分片与重组**：当数据报大小超过 MTU（最大传输单元）时，进行分片传输，目的主机负责重组

```mermaid
sequenceDiagram
    participant App as 应用层
    participant TCP as 传输层 (TCP)
    participant IP as 网络层 (IP)
    participant Link as 数据链路层
    participant Router as 路由器
    participant Dest as 目的主机

    App->>TCP: 发送数据
    TCP->>IP: TCP 段 + TCP 首部
    IP->>IP: 添加 IP 首部 (源 IP、目的 IP 等)
    IP->>Link: IP 数据报
    Link->>Router: 帧传输
    Router->>Router: 检查 TTL、查询路由表
    Router->>Dest: 转发数据报
    Dest->>Dest: 重组分片 (如有)
    Dest->>TCP: 去除 IP 首部，向上传递
```

### 4.1.3 IP 地址分类

IPv4 地址由 32 位二进制组成，通常用点分十进制表示（如 192.168.1.1）。

**传统分类：**

| 类别 | 首位模式 | 网络号位数 | 主机号位数 | 地址范围 | 默认掩码 |
|------|----------|------------|------------|----------|----------|
| A 类 | 0 | 8 位 | 24 位 | 1.0.0.0 - 126.255.255.255 | 255.0.0.0 (/8) |
| B 类 | 10 | 16 位 | 16 位 | 128.0.0.0 - 191.255.255.255 | 255.255.0.0 (/16) |
| C 类 | 110 | 24 位 | 8 位 | 192.0.0.0 - 223.255.255.255 | 255.255.255.0 (/24) |
| D 类 | 1110 | - | - | 224.0.0.0 - 239.255.255.255 | 组播地址 |
| E 类 | 1111 | - | - | 240.0.0.0 - 255.255.255.255 | 保留 |

**特殊 IP 地址：**

| 地址 | 用途 |
|------|------|
| 0.0.0.0 | 所有网络/默认路由 |
| 127.0.0.1 | 本地回环测试 |
| 255.255.255.255 | 受限广播 |
| 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16 | 私有地址（NAT 使用） |

### 4.1.4 常见误区

**误区 1：IP 协议保证可靠传输**
- ❌ 错误：IP 协议本身不保证可靠性，它只负责尽力而为的传输
- ✅ 正确：可靠性由传输层 TCP 协议保证

**误区 2：IP 地址与 MAC 地址是一回事**
- ❌ 错误：IP 地址是逻辑地址，MAC 地址是物理地址
- ✅ 正确：IP 地址用于网络层寻址，MAC 地址用于数据链路层寻址，通过 ARP 协议相互转换

**误区 3：TTL 是时间单位**
- ❌ 错误：TTL 不是时间，而是跳数限制
- ✅ 正确：TTL 表示数据报最多能经过多少个路由器

### 4.1.5 最佳实践

1. **合理设置 TTL**：默认 64 或 128，避免过小导致无法到达目的地
2. **使用私有地址**：内网使用 192.168.x.x 等私有地址，通过 NAT 访问外网
3. **避免 IP 分片**：应用层控制数据大小不超过 MTU（通常 1500 字节）

---

## 4.2 子网划分与 CIDR

### 4.2.1 概念定义

**子网划分（Subnetting）** 是将一个大的 IP 网络划分为多个较小的子网络的技术，目的是提高 IP 地址利用率、减少广播域、增强网络安全性。

**CIDR（无类别域间路由，Classless Inter-Domain Routing）** 是 1993 年提出的 IP 地址分配和路由方法，消除了传统 A/B/C 类地址的界限，允许更灵活的地址分配。

**为什么需要子网划分和 CIDR？**
- IPv4 地址耗尽，需要高效利用
- 减少路由表大小
- 隔离广播域，提高网络性能

### 4.2.2 子网掩码与网络号计算

**子网掩码**用于区分 IP 地址中的网络号和主机号，连续的 1 表示网络部分，连续的 0 表示主机部分。

**计算方法：**

```
网络号 = IP 地址 AND 子网掩码
广播地址 = 网络号 | (~子网掩码)
可用主机范围 = 网络号 +1 至 广播地址 -1
可用主机数 = 2^主机位数 - 2 (减去网络号和广播地址)
```

**示例：192.168.1.100/24**

```
IP 地址：   192.168.1.100  = 11000000.10101000.00000001.01100100
子网掩码：  255.255.255.0  = 11111111.11111111.11111111.00000000
            ----------------------------------------------- AND
网络号：    192.168.1.0    = 11000000.10101000.00000001.00000000

广播地址：  192.168.1.255  = 11000000.10101000.00000001.11111111
可用范围：  192.168.1.1 - 192.168.1.254 (共 254 个主机)
```

### 4.2.3 子网划分实战

**场景**：将 192.168.1.0/24 划分为 4 个子网

```mermaid
graph TD
    A[192.168.1.0/24<br/>254 个可用主机] --> B[借 2 位主机位]
    B --> C[子网 1: 192.168.1.0/26<br/>00-000000 ~ 00-111111<br/>可用：.1-.62]
    B --> D[子网 2: 192.168.1.64/26<br/>01-000000 ~ 01-111111<br/>可用：.65-.126]
    B --> E[子网 3: 192.168.1.128/26<br/>10-000000 ~ 10-111111<br/>可用：.129-.190]
    B --> F[子网 4: 192.168.1.192/26<br/>11-000000 ~ 11-111111<br/>可用：.193-.254]
```

**计算步骤：**

1. 确定需要多少个子网：4 个子网需要 2 位（2²=4）
2. 从主机位借 2 位，新掩码为/26（24+2）
3. 每个子网可用主机数：2^(8-2) - 2 = 62 个

### 4.2.4 CIDR 表示法与路由聚合

**CIDR 表示法**：`IP 地址/前缀长度`

| 表示法 | 子网掩码 | 可用主机数 | 适用场景 |
|--------|----------|------------|----------|
| /32 | 255.255.255.255 | 1 | 单个主机路由 |
| /30 | 255.255.255.252 | 2 | 点对点链路 |
| /24 | 255.255.255.0 | 254 | 小型局域网 |
| /16 | 255.255.0.0 | 65534 | 中型网络 |
| /8 | 255.0.0.0 | 16777214 | 大型网络 |

**路由聚合（超网）示例：**

```
聚合前（4 条路由）：
192.168.0.0/24
192.168.1.0/24
192.168.2.0/24
192.168.3.0/24

聚合后（1 条路由）：
192.168.0.0/22

验证：
192.168.0.0 = 11000000.10101000.000000 00.00000000
192.168.3.0 = 11000000.10101000.000000 11.00000000
                    前 22 位相同 → /22
```

### 4.2.5 常见误区

**误区 1：/32 网络可以分配给多个主机**
- ❌ 错误：/32 表示只有 1 个 IP 地址，没有网络号和广播地址
- ✅ 正确：/32 用于单个主机路由或回环接口

**误区 2：子网掩码必须是连续的 1**
- ❌ 错误：早期可以不连续，但现代网络要求连续
- ✅ 正确：RFC 要求子网掩码必须是连续的 1 和连续的 0

### 4.2.6 最佳实践

1. **预留扩展空间**：子网划分时预留 20-30% 的地址空间
2. **使用 VLSM**：可变长子网掩码，根据实际需求分配不同大小的子网
3. **文档化**：记录每个子网的用途、范围、网关等信息

---

## 4.3 路由选择协议

### 4.3.1 概念定义

**路由选择协议**用于路由器之间交换路由信息，动态构建路由表，决定数据包从源到目的地的最佳路径。

**分类：**

```mermaid
graph LR
    A[路由协议] --> B[IGP 内部网关协议]
    A --> C[EGP 外部网关协议]
    B --> D[RIP - 距离向量]
    B --> E[OSPF - 链路状态]
    B --> F[IS-IS - 链路状态]
    C --> G[BGP - 路径向量]
```

### 4.3.2 RIP 协议（Routing Information Protocol）

**工作原理：**

RIP 是一种**分布式基于距离向量**的路由协议，使用**跳数（Hop Count）**作为度量值。

**核心特点：**

| 特性 | 说明 |
|------|------|
| 算法 | 距离向量算法（Bellman-Ford） |
| 度量值 | 跳数（直接连接=1，最大 15 跳） |
| 更新周期 | 每 30 秒广播一次完整路由表 |
| 传输层 | UDP 520 端口 |
| 版本 | RIPv1（有类）、RIPv2（无类，支持 VLSM） |

**距离向量算法：**

```
每个路由器维护路由表：<目的网络 N, 距离 d, 下一跳 X>

收到邻居路由表后：
1. 修改收到的所有项目：下一跳改为该邻居，距离 +1
2. 对比本地路由表：
   - 若 N 不存在 → 添加
   - 若 N 存在且下一跳相同 → 更新为新值
   - 若 N 存在但下一跳不同 → 仅当新距离更小时更新
```

**RIP 报文格式：**

```
 0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|   命令 (1)    |   版本 (1)     |         保留 (2)             |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                         地址族标识符 (2)                      |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|          保留 (2)           |         IP 地址 (4)             |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                         子网掩码 (4)                          |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                         下一跳 (4)                            |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                         度量值 (4)                            |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
```

**优缺点：**

| 优点 | 缺点 |
|------|------|
| 配置简单，开销小 | 最大 15 跳，限制网络规模 |
| 收敛较快（好消息传得快） | 坏消息传得慢，可能产生路由环路 |
| 适用于小型网络 | 周期性广播完整路由表，带宽浪费 |

### 4.3.3 OSPF 协议（Open Shortest Path First）

**工作原理：**

OSPF 是一种**链路状态**路由协议，使用**Dijkstra 最短路径优先（SPF）算法**。

**核心特点：**

| 特性 | 说明 |
|------|------|
| 算法 | 链路状态算法（Dijkstra SPF） |
| 度量值 | 开销（Cost），通常基于带宽 |
| 更新方式 | 链路变化时触发更新 |
| 传输层 | 直接封装在 IP 中，协议号 89 |
| 区域 | 支持分层，Area 0 为骨干区域 |

**OSPF 工作流程：**

```mermaid
sequenceDiagram
    participant R1 as 路由器 R1
    participant R2 as 路由器 R2
    participant R3 as 路由器 R3
    participant LSDB as 链路状态数据库

    R1->>R2: 发送 Hello 包发现邻居
    R2->>R1: 回复 Hello 包
    R1->>R2: 建立邻接关系
    R1->>R3: 泛洪 LSA(链路状态通告)
    R2->>R3: 泛洪 LSA
    R3->>LSDB: 同步所有 LSA
    LSDB->>R3: 运行 Dijkstra 算法
    R3->>R3: 生成最短路径树
    R3->>R3: 构建路由表
```

**OSPF 报文类型：**

| 类型 | 名称 | 功能 |
|------|------|------|
| 1 | Hello | 发现和维护邻居关系 |
| 2 | Database Description | 描述 LSDB 摘要 |
| 3 | Link State Request | 请求特定 LSA |
| 4 | Link State Update | 发送 LSA |
| 5 | Link State Acknowledgment | 确认 LSA |

**RIP vs OSPF 对比：**

| 特性 | RIP | OSPF |
|------|-----|-------|
| 算法类型 | 距离向量 | 链路状态 |
| 度量标准 | 跳数 | 带宽/开销 |
| 最大跳数 | 15 | 无限制 |
| 收敛速度 | 慢 | 快 |
| 带宽开销 | 大（周期性广播） | 小（触发更新） |
| 适用规模 | 小型网络 | 中大型网络 |
| 配置复杂度 | 简单 | 复杂 |

### 4.3.4 BGP 协议（Border Gateway Protocol）

**工作原理：**

BGP 是**路径向量**路由协议，用于不同自治系统（AS）之间的路由，是互联网的核心路由协议。

**核心特点：**

| 特性 | 说明 |
|------|------|
| 类型 | 路径向量（增强版距离向量） |
| 作用范围 | 自治系统之间（EGP） |
| 传输层 | TCP 179 端口 |
| 度量标准 | AS_PATH 长度 + 多种属性 |
| 防环机制 | AS_PATH 属性检测环路 |

**BGP 报文类型：**

| 类型 | 名称 | 功能 |
|------|------|------|
| OPEN | 打开 | 建立 BGP 对等体关系 |
| UPDATE | 更新 | 通告/撤销路由 |
| KEEPALIVE | 保活 | 维持连接（30 秒一次） |
| NOTIFICATION | 通知 | 报告错误，关闭连接 |

**BGP 路由决策过程：**

```mermaid
flowchart TD
    A[收到多条到达同一目的地的路由] --> B{比较 LOCAL_PREF}
    B -->|高优先 | C[选择 LOCAL_PREF 最高]
    B -->|相同 | D{比较 AS_PATH 长度}
    D -->|短优先 | E[选择 AS_PATH 最短]
    D -->|相同 | F{比较 ORIGIN 类型}
    F --> IGP<EGP<INCOMPLETE --> G[选择 ORIGIN 最优]
    G -->|相同 | H{比较 MED 值}
    H -->|小优先 | I[选择 MED 最小]
```

### 4.3.5 三种协议对比总结

```mermaid
graph TB
    subgraph 对比维度
        A[算法类型]
        B[度量标准]
        C[收敛速度]
        D[适用场景]
    end
    
    subgraph RIP
        R1[距离向量]
        R2[跳数≤15]
        R3[慢]
        R4[小型网络]
    end
    
    subgraph OSPF
        O1[链路状态]
        O2[带宽开销]
        O3[快]
        O4[中大型网络]
    end
    
    subgraph BGP
        B1[路径向量]
        B2[策略优先]
        B3[较慢]
        B4[AS 之间/互联网]
    end
    
    A --> R1 & O1 & B1
    B --> R2 & O2 & B2
    C --> R3 & O3 & B3
    D --> R4 & O4 & B4
```

| 特性 | RIP | OSPF | BGP |
|------|-----|-------|-----|
| 协议类型 | IGP | IGP | EGP |
| 算法 | 距离向量 | 链路状态 | 路径向量 |
| 传输层 | UDP 520 | IP 89 | TCP 179 |
| 度量值 | 跳数 | Cost | 路径属性 |
| 收敛 | 慢（分钟级） | 快（秒级） | 较慢 |
| 扩展性 | 差（15 跳限制） | 好 | 极好 |
| 配置难度 | 简单 | 中等 | 复杂 |

---

## 4.4 NAT 与 IPv6

### 4.4.1 NAT 网络地址转换

**概念定义：**

**NAT（Network Address Translation）** 是在 IP 数据包经过路由器时，将私有 IP 地址转换为公有 IP 地址的技术，主要用于解决 IPv4 地址短缺问题。

**为什么需要 NAT？**
- IPv4 地址耗尽，一个家庭/公司共享一个公网 IP
- 隐藏内网拓扑，增强安全性
- 灵活管理内网地址

### 4.4.2 NAT 类型详解

```mermaid
graph LR
    A[NAT 类型] --> B[静态 NAT]
    A --> C[动态 NAT]
    A --> D[PAT/NAPT<br/>端口地址转换]
    A --> E[对称型 NAT]
    A --> F[锥形 NAT]
```

**1. 静态 NAT（Static NAT）**

```
内网 IP: 192.168.1.100 <-> 公网 IP: 203.0.113.100
内网 IP: 192.168.1.101 <-> 公网 IP: 203.0.113.101

特点：一对一固定映射，适合服务器对外提供服务
```

**2. 动态 NAT（Dynamic NAT）**

```
NAT 池：203.0.113.100 - 203.0.113.110（10 个公网 IP）
内网主机：192.168.1.1 - 192.168.1.254（254 个内网 IP）

特点：多对多动态映射，先申请先使用
```

**3. PAT/NAPT（Port Address Translation）**

```mermaid
sequenceDiagram
    participant PC1 as 192.168.1.100:5000
    participant NAT as NAT 路由器
    participant Web as 93.184.216.34:80
    participant PC2 as 192.168.1.101:5000

    PC1->>NAT: 源：192.168.1.100:5000
    NAT->>NAT: 转换为 203.0.113.1:10001
    NAT->>Web: 源：203.0.113.1:10001

    PC2->>NAT: 源：192.168.1.101:5000
    NAT->>NAT: 转换为 203.0.113.1:10002
    NAT->>Web: 源：203.0.113.1:10002

    Note over NAT: NAT 转换表:<br/>192.168.1.100:5000 ↔ 203.0.113.1:10001<br/>192.168.1.101:5000 ↔ 203.0.113.1:10002
```

**特点**：多对一映射，通过端口号区分不同内网主机，最常用的 NAT 类型

### 4.4.3 NAT 工作原理

**数据包转换过程：**

```
出站数据包（内网→外网）：
  原始：源 IP=192.168.1.100, 源端口=5000, 目的 IP=93.184.216.34
  转换：源 IP=203.0.113.1, 源端口=10001, 目的 IP=93.184.216.34
  NAT 表记录：[内网]192.168.1.100:5000 ↔ [外网]203.0.113.1:10001

入站数据包（外网→内网）：
  原始：目的 IP=203.0.113.1, 目的端口=10001
  查表：找到对应内网地址
  转换：目的 IP=192.168.1.100, 目的端口=5000
```

**校验和重计算：**

由于 NAT 改变了 IP 地址和端口，必须重新计算：
- IP 首部校验和
- TCP/UDP 校验和（包含伪首部）

### 4.4.4 NAT 的局限性

| 问题 | 说明 |
|------|------|
| 破坏端到端通信 | P2P 应用（如视频通话、文件共享）无法直接连接 |
| 增加延迟 | 每次转发都需要地址转换和校验和计算 |
| 应用层网关依赖 | FTP、SIP 等协议需要 ALG 支持 |
| 单点故障 | NAT 设备故障导致所有内网主机断网 |
| 日志审计困难 | 多个用户共享同一 IP，难以追溯 |

### 4.4.5 IPv6 协议

**概念定义：**

**IPv6（Internet Protocol version 6）** 是下一代 IP 协议，使用 128 位地址，提供约 3.4×10³⁸ 个地址，解决 IPv4 地址耗尽问题。

**IPv6 地址格式：**

```
完整格式：2001:0db8:0000:0000:0000:0000:1428:57ab
简化格式：2001:db8::1428:57ab  (双冒号表示连续的 0)

结构：
|    64 位网络前缀     |      64 位接口标识      |
| 2001:db8:abcd:0012 | ::1428:57ab            |
```

### 4.4.6 IPv6 相对于 IPv4 的改进

```mermaid
graph TB
    subgraph IPv4 问题
        A1[32 位地址，约 43 亿个]
        A2[首部复杂，20-60 字节]
        A3[无内置安全]
        A4[依赖 NAT]
        A5[配置复杂]
    end
    
    subgraph IPv6 改进
        B1[128 位地址，几乎无限]
        B2[固定 40 字节首部]
        B3[内置 IPSec 支持]
        B4[端到端通信]
        B5[支持 SLAAC 自动配置]
    end
    
    A1 --> B1
    A2 --> B2
    A3 --> B3
    A4 --> B4
    A5 --> B5
```

**详细对比表：**

| 特性 | IPv4 | IPv6 |
|------|------|------|
| 地址长度 | 32 位（4 字节） | 128 位（16 字节） |
| 地址数量 | 约 43 亿 | 约 3.4×10³⁸ |
| 首部长度 | 20-60 字节（可变） | 固定 40 字节 |
| 首部校验和 | 有 | 无（由上层负责） |
| 分片 | 路由器和主机都可分片 | 仅源主机分片 |
| 安全支持 | IPSec 可选 | IPSec 必选 |
| 地址配置 | 手动或 DHCP | SLAAC 或 DHCPv6 |
| NAT 需求 | 必需 | 不需要 |

### 4.4.7 IPv6 地址类型

| 类型 | 前缀 | 说明 |
|------|------|------|
| 单播（Global Unicast） | 2000::/3 | 全球唯一的单播地址 |
| 链路本地（Link-Local） | fe80::/10 | 同一链路上通信，类似 169.254.x.x |
| 唯一本地（Unique Local） | fc00::/7 | 私有地址，类似 10.0.0.0/8 |
| 组播（Multicast） | ff00::/8 | 一对多通信 |
| 任意播（Anycast） | - | 从一组中选择最近的一个 |

### 4.4.8 常见误区

**误区 1：IPv6 只是地址更多**
- ❌ 错误：IPv6 不仅仅是地址扩展
- ✅ 正确：IPv6 在首部简化、安全性、自动配置等方面都有重大改进

**误区 2：NAT 提供安全性**
- ❌ 错误：NAT 不是安全机制，只是隐藏了内网拓扑
- ✅ 正确：IPv6 不需要 NAT，应使用防火墙和 IPSec 保证安全

**误区 3：IPv4 和 IPv6 完全隔离**
- ❌ 错误：可以通过双栈、隧道、翻译等技术共存
- ✅ 正确：过渡技术包括双栈（Dual Stack）、6to4 隧道、NAT64 等

### 4.4.9 最佳实践

1. **启用 IPv6 双栈**：同时支持 IPv4 和 IPv6，平滑过渡
2. **优先使用 IPv6**：在支持 IPv6 的环境中优先使用
3. **配置防火墙**：IPv6 环境更需要严格的防火墙策略
4. **避免 NAT66**：IPv6 设计初衷是端到端通信，不应使用 NAT

---

# 第 5 章 传输层

传输层（Transport Layer）负责**端到端（End-to-End）**的通信，提供进程到进程的数据传输服务。传输层的两大核心协议是**TCP**和**UDP**。

---

## 5.1 TCP 协议

### 5.1.1 概念定义

**TCP（Transmission Control Protocol，传输控制协议）** 是一种**面向连接的、可靠的、基于字节流**的传输层协议。

**TCP 核心特性：**

| 特性 | 说明 |
|------|------|
| 面向连接 | 通信前需建立连接（三次握手） |
| 可靠传输 | 确认应答、超时重传、序列号 |
| 字节流 | 数据无边界，接收方需自行解析 |
| 全双工 | 双方可同时发送和接收 |
| 流量控制 | 滑动窗口机制 |
| 拥塞控制 | 慢启动、拥塞避免、快重传、快恢复 |

### 5.1.2 TCP 报文段格式

```
 0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|          源端口 (16)           |        目的端口 (16)          |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                        序列号 (32)                            |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                        确认号 (32)                            |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
| 首部长度 (4)| 保留 (2)| 标志位 (6)  |         窗口大小 (16)      |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|         校验和 (16)          |        紧急指针 (16)           |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                    选项 (可选) + 填充                          |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                           数据部分                            |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
```

**字段详解：**

| 字段 | 位数 | 说明 |
|------|------|------|
| 源/目的端口 | 16 位 | 标识发送/接收进程 |
| 序列号（Seq） | 32 位 | 本报文段第一个字节的序号 |
| 确认号（Ack） | 32 位 | 期望收到对方下一个字节的序号 |
| 首部长度 | 4 位 | TCP 首部长度，单位 4 字节（最小 20 字节） |
| 标志位 | 6 位 | URG(紧急)、ACK(确认)、PSH(推送)、RST(重置)、SYN(同步)、FIN(结束) |
| 窗口大小 | 16 位 | 接收窗口，用于流量控制 |
| 校验和 | 16 位 | 首部 + 数据 + 伪首部的校验 |
| 紧急指针 | 16 位 | 紧急数据的偏移量 |

### 5.1.3 三次握手建立连接

**为什么需要三次握手？**
- 确认双方的发送和接收能力正常
- 协商初始序列号（ISN）
- 防止已失效的连接请求突然到达导致错误

```mermaid
sequenceDiagram
    participant Client as 客户端
    participant Server as 服务器

    Note over Client: CLOSED 状态
    Note over Server: LISTEN 状态

    Client->>Server: SYN=1, Seq=x<br/>(第一次握手)
    Note over Client: 进入 SYN-SENT 状态
    Note over Server: 收到 SYN

    Server->>Client: SYN=1, ACK=1, Seq=y, Ack=x+1<br/>(第二次握手)
    Note over Server: 进入 SYN-RCVD 状态
    Note over Client: 收到 SYN+ACK

    Client->>Server: ACK=1, Seq=x+1, Ack=y+1<br/>(第三次握手)
    Note over Client: 进入 ESTABLISHED 状态
    Note over Server: 收到 ACK
    Note over Server: 进入 ESTABLISHED 状态

    Note over Client,Server: 连接建立，可以传输数据
```

**握手过程详解：**

| 步骤 | 方向 | 标志位 | 序列号 | 确认号 | 状态变化 | 能否携带数据 |
|------|------|--------|--------|--------|----------|--------------|
| 第一次 | C→S | SYN=1 | Seq=x | - | CLOSED→SYN-SENT | ❌ 不能 |
| 第二次 | S→C | SYN=1, ACK=1 | Seq=y | Ack=x+1 | LISTEN→SYN-RCVD | ❌ 不能 |
| 第三次 | C→S | ACK=1 | Seq=x+1 | Ack=y+1 | SYN-SENT→ESTABLISHED | ✅ 可以 |

### 5.1.4 四次挥手终止连接

**为什么需要四次挥手？**
- TCP 是全双工的，每个方向必须单独关闭
- 确保所有数据都传输完毕

```mermaid
sequenceDiagram
    participant Client as 客户端
    participant Server as 服务器

    Note over Client,Server: ESTABLISHED 状态

    Client->>Server: FIN=1, Seq=u<br/>(第一次挥手)
    Note over Client: 进入 FIN-WAIT-1 状态
    Note over Client: 不再发送数据

    Server->>Client: ACK=1, Seq=v, Ack=u+1<br/>(第二次挥手)
    Note over Server: 进入 CLOSE-WAIT 状态
    Note over Client: 收到 ACK
    Note over Client: 进入 FIN-WAIT-2 状态

    Note over Server: 还可以发送数据
    Note over Client: 等待服务器关闭

    Server->>Client: FIN=1, ACK=1, Seq=w, Ack=u+1<br/>(第三次挥手)
    Note over Server: 进入 LAST-ACK 状态
    Note over Server: 不再发送数据

    Client->>Server: ACK=1, Seq=u+1, Ack=w+1<br/>(第四次挥手)
    Note over Client: 进入 TIME-WAIT 状态
    Note over Server: 收到 ACK
    Note over Server: 进入 CLOSED 状态

    Note over Client: 等待 2MSL
    Note over Client: 进入 CLOSED 状态
```

**挥手过程详解：**

| 步骤 | 方向 | 标志位 | 序列号 | 确认号 | 状态变化 | 说明 |
|------|------|--------|--------|--------|----------|------|
| 第一次 | C→S | FIN=1 | Seq=u | - | ESTABLISHED→FIN-WAIT-1 | 客户端请求关闭 |
| 第二次 | S→C | ACK=1 | Seq=v | Ack=u+1 | CLOSE-WAIT | 服务器确认收到 |
| 第三次 | S→C | FIN=1, ACK=1 | Seq=w | Ack=u+1 | LAST-ACK | 服务器请求关闭 |
| 第四次 | C→S | ACK=1 | Seq=u+1 | Ack=w+1 | TIME-WAIT→CLOSED | 客户端确认 |

**为什么客户端要等待 2MSL？**

1. **确保服务器收到 ACK**：如果 ACK 丢失，服务器会重传 FIN，客户端在 2MSL 内可以处理
2. **让旧连接的所有报文段在网络中消失**：避免影响新连接

**为什么不是三次挥手？**

因为 TCP 是全双工的：
- 客户端关闭发送方向（第一次挥手）
- 服务器确认（第二次挥手）
- 服务器可能还有数据要发送，所以不会立即关闭
- 服务器数据发送完毕后再关闭（第三次挥手）
- 客户端确认（第四次挥手）

### 5.1.5 TCP 状态转换图

```mermaid
stateDiagram-v2
    [*] --> CLOSED
    
    CLOSED --> LISTEN: 服务器调用 listen()
    CLOSED --> SYN-SENT: 客户端调用 connect()
    
    LISTEN --> SYN-RCVD: 收到 SYN
    LISTEN --> CLOSED: 调用 close()
    
    SYN-SENT --> ESTABLISHED: 收到 SYN+ACK
    SYN-SENT --> CLOSED: 调用 close()/超时
    
    SYN-RCVD --> ESTABLISHED: 收到 ACK
    SYN-RCVD --> FIN-WAIT-1: 调用 close()
    SYN-RCVD --> CLOSED: 超时
    
    ESTABLISHED --> FIN-WAIT-1: 调用 close()
    ESTABLISHED --> CLOSE-WAIT: 收到 FIN
    
    FIN-WAIT-1 --> FIN-WAIT-2: 收到 ACK
    FIN-WAIT-1 --> TIME-WAIT: 收到 FIN+ACK
    FIN-WAIT-1 --> CLOSING: 收到 FIN
    
    FIN-WAIT-2 --> TIME-WAIT: 收到 FIN
    FIN-WAIT-2 --> CLOSED: 超时
    
    CLOSE-WAIT --> LAST-ACK: 调用 close()
    
    CLOSING --> TIME-WAIT: 收到 ACK
    
    LAST-ACK --> CLOSED: 收到 ACK
    
    TIME-WAIT --> CLOSED: 2MSL 超时
```

### 5.1.6 可靠传输机制

**1. 序列号与确认应答**

```mermaid
sequenceDiagram
    participant Sender as 发送方
    participant Receiver as 接收方

    Sender->>Receiver: Seq=1, 数据 100 字节
    Receiver->>Sender: Ack=101 (期望下一个字节序号)
    
    Sender->>Receiver: Seq=101, 数据 100 字节
    Receiver->>Sender: Ack=201
    
    Note over Sender,Receiver: 累计确认机制:<br/>Ack=N 表示 N-1 之前所有数据已收到
```

**2. 超时重传（RTO）**

```
RTT（往返时间）测量：
  RTT = 收到 ACK 的时间 - 发送数据的时间

RTO（重传超时）计算：
  RTO = RTT + 4×RTTVAR（RTT 的偏差）
  
重传机制：
  发送数据 → 启动定时器 → 收到 ACK 停止定时器
  定时器超时 → 重传数据 → 重新计时
```

**3. 快速重传**

```mermaid
sequenceDiagram
    participant Sender as 发送方
    participant Receiver as 接收方

    Sender->>Receiver: 报文段 1
    Receiver->>Sender: Ack=2 (确认收到 1)
    
    Sender->>Receiver: 报文段 2 (丢失)
    Note over Receiver: 未收到 2，收到 3
    
    Sender->>Receiver: 报文段 3
    Receiver->>Sender: Ack=2 (重复确认)
    
    Sender->>Receiver: 报文段 4
    Receiver->>Sender: Ack=2 (重复确认)
    
    Sender->>Receiver: 报文段 5
    Receiver->>Sender: Ack=2 (重复确认)
    
    Note over Sender: 收到 3 个重复 Ack
    Note over Sender: 触发快速重传
    
    Sender->>Receiver: 重传报文段 2
    Receiver->>Sender: Ack=6 (确认收到 2-5)
```

### 5.1.7 滑动窗口机制

```mermaid
graph LR
    subgraph 发送窗口
        direction LR
        A[已发送已确认] --> B[已发送未确认]
        B --> C[可发送]
        C --> D[不可发送]
    end
    
    B --> E[窗口前沿]
    C --> F[窗口后沿]
```

**发送方窗口状态：**

```
已发送已确认  |  已发送未确认  |  可发送  |  不可发送
     P1       |       P2      |   P3    |     P4

P1: 后沿，已确认，可释放缓存
P2: 已发送但未收到确认
P3: 前沿之内，可以发送
P4: 前沿之外，不允许发送
```

**滑动窗口工作原理：**

```
初始状态（窗口大小=4）：
[1][2][3][4][5][6][7][8]
 ↑           ↑
后沿        前沿

发送 1,2,3,4 后：
[1][2][3][4][5][6][7][8]
       ↑     ↑
      后沿   前沿

收到 Ack=3（确认 1,2）后，窗口滑动：
[1][2][3][4][5][6][7][8]
             ↑     ↑
            后沿   前沿
可以发送 5,6
```

### 5.1.8 常见误区

**误区 1：SYN 和 FIN 不消耗序列号**
- ❌ 错误：SYN 和 FIN 标志位都消耗一个序列号
- ✅ 正确：SYN 和 FIN 虽然不携带数据，但需要占用一个序列号

**误区 2：TIME-WAIT 状态浪费资源，应该立即关闭**
- ❌ 错误：TIME-WAIT 是必要的
- ✅ 正确：TIME-WAIT 确保 ACK 能到达对方，并让旧连接的报文在网络中消失

**误区 3：窗口大小可以无限大**
- ❌ 错误：窗口受 16 位字段限制，最大 65535 字节
- ✅ 正确：使用窗口缩放选项可以扩大窗口（乘以 2 的幂）

### 5.1.9 最佳实践

1. **合理设置超时时间**：根据网络 RTT 动态调整 RTO
2. **启用快速重传**：减少重传延迟
3. **使用窗口缩放**：高带宽网络需要大窗口
4. **监控连接状态**：大量 TIME-WAIT 可能需要优化

---

## 5.2 UDP 协议

### 5.2.1 概念定义

**UDP（User Datagram Protocol，用户数据报协议）** 是一种**无连接的、不可靠的、面向数据报**的传输层协议。

**为什么需要 UDP？**
- 低延迟：无需建立连接
- 简单高效：首部仅 8 字节
- 适用实时应用：视频、音频、游戏等可容忍少量丢包

### 5.2.2 UDP 报文格式

```
 0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|          源端口 (16)           |        目的端口 (16)          |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|          长度 (16)             |         校验和 (16)           |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                           数据部分                            |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
```

| 字段 | 位数 | 说明 |
|------|------|------|
| 源端口 | 16 位 | 发送方端口（可选，可为 0） |
| 目的端口 | 16 位 | 接收方端口 |
| 长度 | 16 位 | 首部 + 数据的总长度，最小 8 字节 |
| 校验和 | 16 位 | 可选，IPv6 中必选 |

### 5.2.3 TCP vs UDP 对比

```mermaid
graph TB
    subgraph TCP
        T1[面向连接]
        T2[可靠传输]
        T3[字节流]
        T4[首部 20 字节]
        T5[流量/拥塞控制]
        T6[慢]
    end
    
    subgraph UDP
        U1[无连接]
        U2[不可靠]
        U3[数据报]
        U4[首部 8 字节]
        U5[无控制机制]
        U6[快]
    end
    
    subgraph 适用场景
        T7[文件传输、Web、邮件]
        U7[视频流、DNS、游戏]
    end
    
    T1 & T2 & T3 & T4 & T5 --> T7
    U1 & U2 & U3 & U4 & U5 --> U7
```

| 特性 | TCP | UDP |
|------|-----|-----|
| 连接性 | 面向连接 | 无连接 |
| 可靠性 | 可靠（确认、重传） | 不可靠（尽力而为） |
| 数据单位 | 字节流（无边界） | 数据报（有边界） |
| 首部开销 | 20-60 字节 | 8 字节 |
| 流量控制 | 滑动窗口 | 无 |
| 拥塞控制 | 有 | 无 |
| 传输速度 | 较慢 | 较快 |
| 顺序保证 | 保证 | 不保证 |

### 5.2.4 UDP 适用场景

| 场景 | 说明 | 示例 |
|------|------|------|
| 实时音视频 | 可容忍少量丢包，延迟敏感 | Zoom、微信视频 |
| DNS 查询 | 短报文，快速响应 | 域名解析 |
| 在线游戏 | 低延迟优先 | MOBA、FPS 游戏 |
| 广播/组播 | 一对多通信 | IPTV、网络发现 |
| IoT 传感器 | 小数据量，低功耗 | 温度传感器上报 |

### 5.2.5 套接字编程示例

**Python UDP 服务端：**

```python
import socket

# 创建 UDP 套接字
server_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

# 绑定地址和端口
server_address = ('localhost', 8888)
server_socket.bind(server_address)

print("UDP 服务器启动，监听端口 8888...")

while True:
    # 接收数据
    data, client_address = server_socket.recvfrom(1024)
    print(f"收到来自 {client_address} 的数据：{data.decode()}")
    
    # 发送响应
    response = "服务器已收到"
    server_socket.sendto(response.encode(), client_address)
```

**Python UDP 客户端：**

```python
import socket

# 创建 UDP 套接字
client_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

# 服务器地址
server_address = ('localhost', 8888)

# 发送数据
message = "Hello, UDP Server!"
client_socket.sendto(message.encode(), server_address)

# 接收响应
data, server = client_socket.recvfrom(1024)
print(f"服务器响应：{data.decode()}")

client_socket.close()
```

### 5.2.6 常见误区

**误区 1：UDP 完全不可靠，不能使用**
- ❌ 错误：UDP 在某些场景下更合适
- ✅ 正确：实时应用更看重低延迟，少量丢包可接受

**误区 2：UDP 没有校验和**
- ❌ 错误：UDP 有校验和字段
- ✅ 正确：UDP 校验和可选（IPv4）或必选（IPv6）

---

## 5.3 端口与套接字

### 5.3.1 端口概念

**端口（Port）** 是传输层用于区分同一主机上不同进程的标识符，16 位无符号整数，范围 0-65535。

**端口分类：**

| 类型 | 范围 | 说明 | 示例 |
|------|------|------|------|
| 知名端口 | 0-1023 | 系统保留，需管理员权限 | HTTP(80)、HTTPS(443)、SSH(22) |
| 注册端口 | 1024-49151 | 用户程序注册使用 | MySQL(3306)、Redis(6379) |
| 动态端口 | 49152-65535 | 临时分配给客户端 | 客户端临时端口 |

### 5.3.2 知名端口列表

```mermaid
graph LR
    subgraph 应用层协议
        A1[HTTP]
        A2[HTTPS]
        A3[SSH]
        A4[FTP]
        A5[DNS]
        A6[SMTP]
    end
    
    subgraph 端口号
        P1[80]
        P2[443]
        P3[22]
        P4[20,21]
        P5[53]
        P6[25]
    end
    
    A1 --> P1
    A2 --> P2
    A3 --> P3
    A4 --> P4
    A5 --> P5
    A6 --> P6
```

| 端口 | 协议 | 用途 |
|------|------|------|
| 20/21 | FTP | 文件传输（20 数据，21 控制） |
| 22 | SSH | 安全远程登录 |
| 23 | Telnet | 远程登录（明文，不安全） |
| 25 | SMTP | 邮件发送 |
| 53 | DNS | 域名解析 |
| 67/68 | DHCP | 动态 IP 分配 |
| 80 | HTTP | 超文本传输 |
| 110 | POP3 | 邮件接收 |
| 443 | HTTPS | 加密 HTTP |
| 3306 | MySQL | 数据库 |
| 3389 | RDP | 远程桌面 |
| 8080 | HTTP-Alt | 代理/备用 HTTP |

### 5.3.3 套接字（Socket）

**套接字 = IP 地址 + 端口号**

**TCP 套接字编程模型：**

```mermaid
sequenceDiagram
    participant Server as 服务器
    participant Client as 客户端

    Note over Server: socket()
    Note over Server: bind()
    Note over Server: listen()
    Note over Server: accept()

    Note over Client: socket()
    Client->>Server: connect()

    Server->>Client: 建立连接
    Client->>Server: send()
    Server->>Client: recv()
    Server->>Client: send()
    Client->>Server: recv()

    Note over Client: close()
    Note over Server: close()
```

**TCP 服务端代码（Python）：**

```python
import socket

# 创建 TCP 套接字
server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

# 允许端口复用
server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)

# 绑定地址
server_socket.bind(('0.0.0.0', 8888))

# 监听连接
server_socket.listen(5)
print("服务器监听中...")

while True:
    # 接受连接
    client_socket, client_address = server_socket.accept()
    print(f"连接来自：{client_address}")
    
    # 接收数据
    data = client_socket.recv(1024)
    print(f"收到：{data.decode()}")
    
    # 发送响应
    client_socket.send("Hello from server".encode())
    
    # 关闭连接
    client_socket.close()
```

---

## 5.4 流量控制与拥塞控制

### 5.4.1 概念区分

```mermaid
graph TB
    A[传输控制] --> B[流量控制]
    A --> C[拥塞控制]
    
    B --> D[点对点<br/>接收方控制发送方]
    B --> E[滑动窗口<br/>rwnd 接收窗口]
    
    C --> F[全局性<br/>网络状况控制]
    C --> G[拥塞窗口<br/>cwnd]
```

| 特性 | 流量控制 | 拥塞控制 |
|------|----------|----------|
| 作用范围 | 点对点（接收方↔发送方） | 全局性（整个网络） |
| 目的 | 防止接收方缓冲区溢出 | 防止网络过载 |
| 控制变量 | rwnd（接收窗口） | cwnd（拥塞窗口） |
| 依据 | 接收方处理能力 | 网络拥塞程度 |

### 5.4.2 流量控制 - 滑动窗口

**工作原理：**

```
发送窗口大小 = min(rwnd, cwnd)
rwnd: 接收窗口（由接收方通告）
cwnd: 拥塞窗口（由发送方维护）
```

**流量控制过程：**

```mermaid
sequenceDiagram
    participant Sender as 发送方
    participant Receiver as 接收方

    Note over Receiver: 初始 rwnd=400

    Receiver->>Sender: ACK, rwnd=400
    Sender->>Receiver: 发送 100 字节
    Sender->>Receiver: 发送 100 字节
    Note over Sender: 已发送 200，窗口剩余 200

    Receiver->>Sender: ACK, rwnd=200
    Note over Receiver: 缓冲区减少

    Sender->>Receiver: 发送 100 字节
    Note over Sender: 窗口剩余 100

    Receiver->>Sender: ACK, rwnd=0
    Note over Receiver: 缓冲区满，暂停发送

    Note over Sender: 停止发送，等待

    Receiver->>Sender: ACK, rwnd=100
    Note over Receiver: 应用层读取数据
    Sender->>Receiver: 继续发送
```

### 5.4.3 拥塞控制算法

TCP 使用四种算法进行拥塞控制：

```mermaid
graph LR
    A[TCP 拥塞控制] --> B[慢启动<br/>Slow Start]
    A --> C[拥塞避免<br/>Congestion Avoidance]
    A --> D[快重传<br/>Fast Retransmit]
    A --> E[快恢复<br/>Fast Recovery]
```

**关键变量：**

| 变量 | 含义 | 说明 |
|------|------|------|
| cwnd | 拥塞窗口 | 发送方维护的窗口大小 |
| ssthresh | 慢启动门限 | 慢启动与拥塞避免的切换点 |
| rwnd | 接收窗口 | 接收方通告的窗口 |
| MSS | 最大报文段 | 通常 1460 字节 |

### 5.4.4 慢启动（Slow Start）

**工作原理：**

```
初始状态：
  cwnd = 1 MSS
  ssthresh = 65535（初始较大值）

每收到一个 ACK：
  cwnd = cwnd + 1

实际效果（每 RTT 翻倍）：
  RTT 0: cwnd = 1
  RTT 1: cwnd = 2
  RTT 2: cwnd = 4
  RTT 3: cwnd = 8
  ...
  直到 cwnd >= ssthresh，切换到拥塞避免
```

**慢启动过程图解：**

```mermaid
xychart-beta
    title "慢启动阶段拥塞窗口增长"
    x-axis [RTT1, RTT2, RTT3, RTT4, RTT5, RTT6]
    y-axis "cwnd (MSS)" 0 --> 70
    line [1, 2, 4, 8, 16, 32, 64]
```

### 5.4.5 拥塞避免（Congestion Avoidance）

**工作原理：**

```
当 cwnd >= ssthresh 时，进入拥塞避免：
  每经过一个 RTT：
    cwnd = cwnd + 1  (线性增长)

拥塞避免 vs 慢启动：
  慢启动：指数增长（快）
  拥塞避免：线性增长（慢）
```

**加法增大（AIMD）：**

```
每 RTT 增加 1 MSS：
  cwnd(n+1) = cwnd(n) + 1

目的：缓慢增加发送速率，探测网络容量上限
```

### 5.4.6 快重传（Fast Retransmit）

**触发条件：**

发送方连续收到**3 个重复的 ACK**，立即重传丢失的报文段，无需等待超时。

```mermaid
sequenceDiagram
    participant Sender as 发送方
    participant Receiver as 接收方

    Sender->>Receiver: 发送报文段 1
    Receiver->>Sender: Ack=2

    Sender->>Receiver: 发送报文段 2 (丢失)
    Note over Receiver: 未收到 2

    Sender->>Receiver: 发送报文段 3
    Receiver->>Sender: Ack=2 (重复)

    Sender->>Receiver: 发送报文段 4
    Receiver->>Sender: Ack=2 (重复)

    Sender->>Receiver: 发送报文段 5
    Receiver->>Sender: Ack=2 (重复)

    Note over Sender: 收到 3 个重复 Ack
    Note over Sender: 触发快重传

    Sender->>Receiver: 立即重传报文段 2
    Receiver->>Sender: Ack=6
```

### 5.4.7 快恢复（Fast Recovery）

**工作原理：**

```
收到 3 个重复 ACK 后：
  1. ssthresh = cwnd / 2  (乘法减小)
  2. cwnd = ssthresh      (不是慢启动的 1)
  3. 执行拥塞避免算法

与慢启动的区别：
  慢启动：cwnd 从 1 开始
  快恢复：cwnd 从 ssthresh 开始
```

**完整拥塞控制流程图：**

```mermaid
flowchart TD
    A[连接建立<br/>cwnd=1, ssthresh=65535] --> B[慢启动<br/>指数增长]
    B --> C{cwnd >= ssthresh?}
    C -->|是 | D[拥塞避免<br/>线性增长]
    C -->|否 | B
    
    D --> E{发生拥塞?}
    E -->|超时 | F[ssthresh=cwnd/2<br/>cwnd=1<br/>重新慢启动]
    E -->|3 重复 ACK | G[快重传]
    
    G --> H[快恢复<br/>ssthresh=cwnd/2<br/>cwnd=ssthresh]
    H --> D
    
    F --> B
```

### 5.4.8 四种算法对比

| 算法 | 触发条件 | cwnd 变化 | 目的 |
|------|----------|----------|------|
| 慢启动 | 连接建立/超时时 | 指数增长（×2/RTT） | 快速探测网络容量 |
| 拥塞避免 | cwnd ≥ ssthresh | 线性增长（+1/RTT） | 缓慢增加，避免拥塞 |
| 快重传 | 收到 3 个重复 ACK | 立即重传丢失报文 | 减少重传延迟 |
| 快恢复 | 快重传后 | cwnd=ssthresh | 避免回到慢启动 |

### 5.4.9 常见误区

**误区 1：流量控制和拥塞控制是一回事**
- ❌ 错误：两者目的和控制对象不同
- ✅ 正确：流量控制是接收方控制发送方，拥塞控制是网络控制发送方

**误区 2：快重传会触发慢启动**
- ❌ 错误：快重传后进入快恢复
- ✅ 正确：只有超时才会触发慢启动，快重传触发快恢复

**误区 3：窗口越大越好**
- ❌ 错误：过大的窗口会导致拥塞
- ✅ 正确：窗口应该根据网络状况动态调整

### 5.4.10 最佳实践

1. **启用 TCP BBR**：Google 开发的现代拥塞控制算法
2. **合理设置初始 cwnd**：现代网络可设置更大的初始值（如 10 MSS）
3. **监控重传率**：高重传率可能表示网络拥塞或配置问题

---

# 第 6 章 应用层

应用层是 OSI 模型的最高层，直接为用户提供网络服务。应用层协议定义了应用程序之间通信的规则和格式。

---

## 6.1 HTTP/HTTPS 协议

### 6.1.1 概念定义

**HTTP（HyperText Transfer Protocol）** 是用于 Web 浏览器和服务器之间通信的应用层协议，基于 TCP 传输。

**HTTPS（HTTP Secure）** 是 HTTP 的安全版本，在 HTTP 和 TCP 之间加入了 TLS/SSL 加密层。

### 6.1.2 HTTP 协议演进

```mermaid
timeline
    title HTTP 协议发展历史
    section 1991
        HTTP/0.9 : 仅 GET 请求<br/>无头部
    section 1996
        HTTP/1.0 : 正式标准<br/>增加请求方法<br/>短连接
    section 1997
        HTTP/1.1 : 长连接<br/>管道机制<br/>Host 头
    section 2015
        HTTP/2 : 二进制协议<br/>多路复用<br/>头部压缩
    section 2022
        HTTP/3 : 基于 QUIC<br/>UDP 传输<br/>0-RTT
```

### 6.1.3 HTTP 各版本对比

| 特性 | HTTP/1.0 | HTTP/1.1 | HTTP/2 | HTTP/3 |
|------|----------|----------|--------|--------|
| 连接方式 | 短连接 | 长连接（Keep-Alive） | 多路复用 | QUIC 连接 |
| 数据格式 | 文本 | 文本 | 二进制帧 | 二进制帧 |
| 头部压缩 | 无 | 有限 | HPACK | QPACK |
| 服务器推送 | 无 | 无 | 支持 | 支持 |
| 传输层 | TCP | TCP | TCP | QUIC(UDP) |
| 队头阻塞 | 严重 | 存在 | 已解决 | 已解决 |
| TLS 集成 | 可选 | 可选 | 可选 | 内置(TLS 1.3) |

### 6.1.4 HTTP/1.1 详解

**请求报文格式：**

```
GET /api/users/123 HTTP/1.1
Host: api.example.com
User-Agent: Mozilla/5.0
Accept: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json
Content-Length: 27

{"name": "John", "age": 30}
```

**请求报文结构：**

```mermaid
graph TB
    A[HTTP 请求报文] --> B[请求行]
    A --> C[请求头]
    A --> D[空行]
    A --> E[请求体]
    
    B --> B1[方法 + URI+ 版本]
    C --> C1[键值对元数据]
    D --> D1[CRLFCRLF]
    E --> E1[可选数据]
```

**请求方法：**

| 方法 | 语义 | 幂等 | 可缓存 |
|------|------|------|--------|
| GET | 获取资源 | 是 | 是 |
| POST | 提交数据 | 否 | 否 |
| PUT | 替换资源 | 是 | 否 |
| DELETE | 删除资源 | 是 | 否 |
| PATCH | 部分更新 | 否 | 否 |
| HEAD | 获取头部 | 是 | 是 |
| OPTIONS | 查询支持的方法 | 是 | 否 |

**响应报文格式：**

```
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 45
Cache-Control: max-age=3600
Set-Cookie: sessionId=abc123

{"id": 123, "name": "John", "age": 30}
```

**常见状态码：**

| 状态码 | 含义 | 说明 |
|--------|------|------|
| 200 | OK | 请求成功 |
| 201 | Created | 资源创建成功 |
| 204 | No Content | 成功但无返回内容 |
| 301 | Moved Permanently | 永久重定向 |
| 302 | Found | 临时重定向 |
| 304 | Not Modified | 资源未修改（缓存） |
| 400 | Bad Request | 请求格式错误 |
| 401 | Unauthorized | 未授权 |
| 403 | Forbidden | 禁止访问 |
| 404 | Not Found | 资源不存在 |
| 500 | Internal Server Error | 服务器内部错误 |
| 502 | Bad Gateway | 网关错误 |
| 503 | Service Unavailable | 服务不可用 |

### 6.1.5 HTTP/2 核心特性

**1. 多路复用（Multiplexing）**

```mermaid
graph LR
    subgraph HTTP/1.1
        A1[请求 1] --> B1[响应 1]
        C1[请求 2] --> D1[响应 2]
        E1[请求 3] --> F1[响应 3]
        Note over A1,F1: 串行，队头阻塞
    end
    
    subgraph HTTP/2
        A2[流 1] & B2[流 2] & C2[流 3] --> D2[单个 TCP 连接]
        Note over A2,C2: 并行，多路复用
    end
```

**2. 头部压缩（HPACK）**

```
HTTP/1.1 重复头部：
  GET / HTTP/1.1
  User-Agent: Mozilla/5.0...
  Accept: text/html...
  Cookie: session=abc...
  
  GET /style.css HTTP/1.1
  User-Agent: Mozilla/5.0...  (重复)
  Accept: text/css...
  Cookie: session=abc...      (重复)

HTTP/2 HPACK 压缩：
  静态表：预定义常用头部
  动态表：维护已发送头部
  结果：后续请求只发送差异部分
```

**3. 服务器推送（Server Push）**

```mermaid
sequenceDiagram
    participant Browser as 浏览器
    participant Server as 服务器

    Browser->>Server: GET /index.html
    
    Server->>Browser: 返回 HTML
    Server->>Browser: PUSH /style.css
    Server->>Browser: PUSH /app.js
    
    Note over Browser: 无需额外请求<br/>资源已推送
```

### 6.1.6 HTTPS 与 TLS 握手

**HTTPS 安全机制：**

| 安全目标 | 解决方案 |
|----------|----------|
| 机密性 | 对称加密（AES 等） |
| 完整性 | MAC/HMAC 校验 |
| 身份认证 | 数字证书（CA 签发） |
| 抗重放 | 随机数 + 时间戳 |

**TLS 1.2 握手过程（RSA 密钥交换）：**

```mermaid
sequenceDiagram
    participant Client as 客户端
    participant Server as 服务器

    Note over Client,Server: 第一次握手
    Client->>Server: ClientHello<br/>TLS 版本，随机数 C_Random<br/>密码套件列表

    Note over Client,Server: 第二次握手
    Server->>Client: ServerHello<br/>选定 TLS 版本，随机数 S_Random<br/>选定密码套件
    Server->>Client: Certificate<br/>服务器证书
    Server->>Client: ServerHelloDone

    Note over Client,Server: 第三次握手
    Note over Client: 验证证书
    Note over Client: 生成 Pre-Master Secret<br/>用证书公钥加密
    Client->>Server: ClientKeyExchange<br/>加密的 Pre-Master Secret
    Client->>Server: ChangeCipherSpec<br/>切换加密模式
    Client->>Server: Finished<br/>加密的握手摘要

    Note over Client,Server: 第四次握手
    Server->>Client: ChangeCipherSpec
    Server->>Client: Finished

    Note over Client,Server: 握手完成<br/>使用会话密钥加密通信
```

**密钥派生过程：**

```
Pre-Master Secret + C_Random + S_Random
        ↓
    PRF 函数
        ↓
    Master Secret (48 字节)
        ↓
    PRF 函数
        ↓
  会话密钥块：
  - 客户端写密钥
  - 服务器写密钥
  - 客户端写 IV
  - 服务器写 IV
  - 客户端写 MAC 密钥
  - 服务器写 MAC 密钥
```

**TLS 1.3 优化：**

| 特性 | TLS 1.2 | TLS 1.3 |
|------|---------|---------|
| 握手往返 | 2-RTT | 1-RTT（0-RTT 可选） |
| 密钥交换 | RSA/DH | 仅 ECDHE |
| 加密算法 | 多种 | 仅 AEAD |
| 证书加密 | 否 | 是 |

### 6.1.7 常见误区

**误区 1：HTTPS 只是加密的 HTTP**
- ❌ 错误：HTTPS 不仅是加密
- ✅ 正确：HTTPS 提供加密、完整性校验、身份认证三重保护

**误区 2：HTTP/2 必须使用 HTTPS**
- ❌ 错误：规范不强制，但浏览器强制
- ✅ 正确：主流浏览器要求 HTTP/2 必须通过 HTTPS

**误区 3：TLS 握手每次都完整执行**
- ❌ 错误：有会话恢复机制
- ✅ 正确：Session Ticket 和 Session ID 可复用，减少握手开销

### 6.1.8 最佳实践

1. **启用 HTTP/2**：显著提升性能
2. **强制 HTTPS**：使用 HSTS 头
3. **使用 TLS 1.3**：更安全、更快速
4. **合理设置缓存**：Cache-Control、ETag
5. **启用 Gzip/Brotli 压缩**：减少传输量

---

## 6.2 DNS 域名系统

### 6.2.1 概念定义

**DNS（Domain Name System，域名系统）** 是互联网的"电话簿"，将人类可读的域名（如 www.example.com）转换为机器可读的 IP 地址（如 93.184.216.34）。

**为什么需要 DNS？**
- IP 地址难记，域名易记
- 支持负载均衡（一个域名对应多个 IP）
- 支持服务迁移（域名不变，IP 可变）

### 6.2.2 DNS 层次结构

```mermaid
graph TB
    Root[根服务器.]
    
    Root --> COM[.com]
    Root --> ORG[.org]
    Root --> NET[.net]
    Root --> CN[.cn]
    
    COM --> Example[example.com]
    COM --> Google[google.com]
    
    Example --> WWW[www.example.com]
    Example --> Mail[mail.example.com]
    Example --> API[api.example.com]
    
    style Root fill:#f9f,stroke:#333
    style COM fill:#bbf,stroke:#333
    style Example fill:#bfb,stroke:#333
    style WWW fill:#fbb,stroke:#333
```

**DNS 层级：**

| 层级 | 名称 | 示例 | 管理者 |
|------|------|------|--------|
| 根 | Root Zone | . | ICANN |
| 顶级域 | TLD | .com, .org, .cn | 注册局 |
| 二级域 | Domain | example.com | 域名所有者 |
| 子域 | Subdomain | www.example.com | 域名所有者 |

### 6.2.3 DNS 解析过程

**递归查询与迭代查询：**

```mermaid
sequenceDiagram
    participant User as 用户
    participant Local as 本地 DNS<br/>递归解析器
    participant Root as 根服务器
    participant TLD as .com 服务器
    participant Auth as 权威服务器

    User->>Local: 查询 www.example.com
    
    Local->>Local: 检查缓存
    Note over Local: 未命中
    
    Local->>Root: 迭代查询
    Root->>Local: 返回.com服务器地址
    
    Local->>TLD: 迭代查询
    TLD->>Local: 返回 example.com<br/>权威服务器地址
    
    Local->>Auth: 迭代查询
    Auth->>Local: 返回 A 记录<br/>93.184.216.34
    
    Local->>Local: 缓存结果
    Local->>User: 返回 IP 地址
```

**解析步骤详解：**

1. **浏览器缓存**：检查浏览器是否缓存过该域名
2. **系统缓存**：检查操作系统 DNS 缓存
3. **hosts 文件**：检查本地 hosts 文件
4. **本地 DNS**：向 ISP 或公共 DNS（8.8.8.8）查询
5. **根服务器**：如果本地 DNS 无缓存，向根服务器查询
6. **TLD 服务器**：向对应顶级域服务器查询
7. **权威服务器**：向域名的权威 DNS 服务器查询
8. **缓存并返回**：本地 DNS 缓存结果并返回给用户

### 6.2.4 DNS 记录类型

```mermaid
graph LR
    A[DNS 记录类型] --> B[A 记录<br/>IPv4 地址]
    A --> C[AAAA 记录<br/>IPv6 地址]
    A --> D[CNAME<br/>别名]
    A --> E[MX<br/>邮件交换]
    A --> F[TXT<br/>文本记录]
    A --> G[NS<br/>域名服务器]
    A --> H[SOA<br/>起始授权]
```

**记录类型详解：**

| 记录类型 | 名称 | 用途 | 示例 |
|----------|------|------|------|
| A | Address | 域名→IPv4 | www.example.com → 93.184.216.34 |
| AAAA | IPv6 Address | 域名→IPv6 | www → 2606:2800:220:1:248:1893:25c8:1946 |
| CNAME | Canonical Name | 域名别名 | blog → example.com |
| MX | Mail Exchange | 邮件服务器 | @ → mail.example.com (优先级 10) |
| TXT | Text | 文本信息 | SPF、DKIM、域名验证 |
| NS | Name Server | 域名服务器 | @ → ns1.example.com |
| SOA | Start of Authority | 起始授权 | 区域信息、序列号 |
| PTR | Pointer | 反向解析 | IP→域名 |
| SRV | Service | 服务定位 | _sip._tcp → sipserver:5060 |

**记录示例：**

```
; A 记录
www     IN  A       93.184.216.34
api     IN  A       93.184.216.35

; AAAA 记录
www     IN  AAAA    2606:2800:220:1:248:1893:25c8:1946

; CNAME 记录
blog    IN  CNAME   example.com
cdn     IN  CNAME   cdn.cloudprovider.com

; MX 记录（优先级数字越小优先级越高）
@       IN  MX  10  mail1.example.com
@       IN  MX  20  mail2.example.com

; TXT 记录（SPF）
@       IN  TXT     "v=spf1 include:_spf.google.com ~all"

; NS 记录
@       IN  NS      ns1.example.com
@       IN  NS      ns2.example.com
```

### 6.2.5 DNS 缓存与 TTL

**TTL（Time To Live）：**

```
记录示例：
www.example.com.  300  IN  A  93.184.216.34

TTL=300 秒 = 5 分钟
- 5 分钟内，解析器直接返回缓存
- 5 分钟后，需要重新查询
```

**缓存层级：**

```mermaid
graph TB
    A[浏览器缓存] --> B[操作系统缓存]
    B --> C[本地 DNS 缓存]
    C --> D[ISP DNS 缓存]
    
    style A fill:#f9f
    style D fill:#9ff
```

### 6.2.6 常见误区

**误区 1：DNS 解析很快，不需要优化**
- ❌ 错误：DNS 解析可能耗时数百毫秒
- ✅ 正确：应合理设置 TTL，使用 DNS 预取

**误区 2：CNAME 可以用于根域名**
- ❌ 错误：RFC 规定 CNAME 不能用于根域名（@）
- ✅ 正确：根域名应使用 A 记录，子域可用 CNAME

**误区 3：修改 DNS 记录立即生效**
- ❌ 错误：受 TTL 影响，全球生效可能需要时间
- ✅ 正确：修改前降低 TTL，修改后等待传播

### 6.2.7 最佳实践

1. **合理设置 TTL**：频繁变更的记录设置较短 TTL
2. **使用多个 DNS 提供商**：提高可用性
3. **启用 DNSSEC**：防止 DNS 劫持
4. **配置备用 DNS**：8.8.8.8、1.1.1.1

---

## 6.3 FTP、SMTP 等常见协议

### 6.3.1 FTP 协议（File Transfer Protocol）

**概念定义：**

**FTP** 是用于在网络上进行文件传输的标准协议，基于 TCP，使用两个并行连接。

**工作原理：**

```mermaid
graph TB
    subgraph FTP 连接
        A[控制连接<br/>端口 21]
        B[数据连接<br/>端口 20]
    end
    
    A --> C[发送命令<br/>USER, PASS, LIST, RETR, STOR]
    B --> D[传输文件数据]
```

**连接模式对比：**

| 模式 | 连接方向 | 防火墙友好 | 命令 |
|------|----------|------------|------|
| 主动模式 | 服务器→客户端 | 否（客户端需开放端口） | PORT |
| 被动模式 | 客户端→服务器 | 是 | PASV |

**主动模式流程：**

```
1. 客户端随机端口 N 连接服务器 21 端口（控制连接）
2. 客户端发送 PORT 命令，告知数据端口 N+1
3. 服务器从 20 端口主动连接客户端 N+1 端口（数据连接）
4. 传输数据
```

**被动模式流程：**

```
1. 客户端随机端口 N 连接服务器 21 端口（控制连接）
2. 客户端发送 PASV 命令
3. 服务器返回随机端口 M
4. 客户端连接服务器 M 端口（数据连接）
5. 传输数据
```

**常用 FTP 命令：**

| 命令 | 说明 |
|------|------|
| USER | 用户名 |
| PASS | 密码 |
| LIST | 列出目录 |
| CWD | 改变目录 |
| RETR | 下载文件 |
| STOR | 上传文件 |
| QUIT | 退出 |

### 6.3.2 SMTP 协议（Simple Mail Transfer Protocol）

**概念定义：**

**SMTP** 是用于发送电子邮件的协议，基于 TCP 25 端口。

**邮件系统架构：**

```mermaid
graph LR
    A[发件人] --> B[用户代理<br/>Outlook/Foxmail]
    B --> C[SMTP 客户端]
    C --> D[发送方邮件服务器]
    D --> E[SMTP 协议]
    E --> F[接收方邮件服务器]
    F --> G[POP3/IMAP]
    G --> H[收件人用户代理]
    H --> I[收件人]
```

**SMTP 通信过程：**

```
220 smtp.example.com ESMTP Postfix
EHLO client.example.com
250-smtp.example.com
250-SIZE 10240000
250 OK

MAIL FROM:<sender@example.com>
250 OK

RCPT TO:<recipient@example.com>
250 OK

DATA
354 End data with <CR><LF>.<CR><LF>
From: sender@example.com
To: recipient@example.com
Subject: Test Email

This is the email body.
.
250 OK

QUIT
221 Bye
```

**SMTP 命令：**

| 命令 | 说明 |
|------|------|
| HELO/EHLO | 问候，开始会话 |
| MAIL FROM | 指定发件人 |
| RCPT TO | 指定收件人 |
| DATA | 开始传输邮件内容 |
| QUIT | 结束会话 |

### 6.3.3 POP3 与 IMAP

**POP3（Post Office Protocol v3）：**

| 特性 | 说明 |
|------|------|
| 端口 | 110（明文），995（SSL） |
| 工作模式 | 下载并删除（或保留） |
| 多设备支持 | 差（邮件下载到本地） |

**IMAP（Internet Message Access Protocol）：**

| 特性 | 说明 |
|------|------|
| 端口 | 143（明文），993（SSL） |
| 工作模式 | 在服务器管理邮件 |
| 多设备支持 | 好（邮件状态同步） |

**POP3 vs IMAP 对比：**

| 特性 | POP3 | IMAP |
|------|------|------|
| 邮件存储 | 本地 | 服务器 |
| 多设备同步 | 不支持 | 支持 |
| 离线访问 | 好 | 需缓存 |
| 服务器空间 | 不占用 | 占用 |
| 推荐使用 | 单设备 | 多设备 |

### 6.3.4 应用层协议对比

| 协议 | 用途 | 传输层 | 端口 | 特点 |
|------|------|--------|------|------|
| HTTP | Web 浏览 | TCP | 80 | 请求 - 响应 |
| HTTPS | 安全 Web | TCP | 443 | 加密 |
| FTP | 文件传输 | TCP | 20,21 | 双连接 |
| SMTP | 发送邮件 | TCP | 25 | 推协议 |
| POP3 | 接收邮件 | TCP | 110 | 拉协议 |
| IMAP | 接收邮件 | TCP | 143 | 同步协议 |
| DNS | 域名解析 | UDP | 53 | 查询 - 响应 |

---

## 6.4 WebSocket 与实时通信

### 6.4.1 概念定义

**WebSocket** 是一种在单个 TCP 连接上进行**全双工通信**的协议，允许服务器主动向客户端推送数据。

**为什么需要 WebSocket？**

| HTTP 局限 | WebSocket 方案 |
|-----------|----------------|
| 单向通信（请求 - 响应） | 双向通信 |
| 短连接，频繁建立断开 | 长连接，一次握手 |
| 头部冗余大 | 帧格式轻量 |
| 服务器无法主动推送 | 服务器可主动推送 |

### 6.4.2 WebSocket 握手过程

**协议升级机制：**

```mermaid
sequenceDiagram
    participant Browser as 浏览器
    participant Server as 服务器

    Note over Browser,Server: 阶段 1：HTTP 握手
    Browser->>Server: GET /ws HTTP/1.1
    Browser->>Server: Host: example.com
    Browser->>Server: Upgrade: websocket
    Browser->>Server: Connection: Upgrade
    Browser->>Server: Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
    Browser->>Server: Sec-WebSocket-Version: 13

    Server->>Server: 验证请求<br/>计算 Accept 值

    Server->>Browser: HTTP/1.1 101 Switching Protocols
    Server->>Browser: Upgrade: websocket
    Server->>Browser: Connection: Upgrade
    Server->>Browser: Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=

    Note over Browser,Server: 阶段 2：WebSocket 通信
    Browser->>Server: [WebSocket 帧] 数据
    Server->>Browser: [WebSocket 帧] 响应
```

**握手头部说明：**

| 头部 | 说明 |
|------|------|
| Upgrade: websocket | 请求协议升级 |
| Connection: Upgrade | 指示需要升级 |
| Sec-WebSocket-Key | 客户端随机密钥（Base64 编码） |
| Sec-WebSocket-Version | 协议版本（固定为 13） |
| Sec-WebSocket-Accept | 服务端计算的响应密钥 |

**Accept 计算方式：**

```
Accept = Base64(SHA1(Sec-WebSocket-Key + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11"))

示例：
Key: dGhlIHNhbXBsZSBub25jZQ==
Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=
```

### 6.4.3 WebSocket 帧格式

```
 0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|F|R|R|R| opcode|M|   Payload len (7)          |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
| Extended payload length (16/64)                               |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
| Masking-key (32, if set)                                      |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
| Payload data (variable length)                                |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
```

**字段说明：**

| 字段 | 位数 | 说明 |
|------|------|------|
| FIN | 1 位 | 1 表示这是最后一帧 |
| RSV1-3 | 3 位 | 保留，必须为 0 |
| Opcode | 4 位 | 帧类型 |
| MASK | 1 位 | 1 表示数据被掩码（客户端发送必须为 1） |
| Payload len | 7/16/64 位 | 数据长度 |

**Opcode 类型：**

| 值 | 名称 | 说明 |
|----|------|------|
| 0x0 | 连续帧 | 分片传输时使用 |
| 0x1 | 文本帧 | UTF-8 编码文本 |
| 0x2 | 二进制帧 | 二进制数据 |
| 0x8 | 关闭帧 | 关闭连接 |
| 0x9 | Ping 帧 | 心跳检测 |
| 0xA | Pong 帧 | 心跳响应 |

### 6.4.4 WebSocket 与 HTTP 对比

```mermaid
graph TB
    subgraph HTTP
        A1[客户端请求] --> B1[服务器响应]
        B1 --> C1[连接关闭]
        A2[客户端请求] --> B2[服务器响应]
        B2 --> C2[连接关闭]
        Note over A1,C2: 每次请求建立新连接
    end
    
    subgraph WebSocket
        D1[握手] --> E1[双向通信]
        E1 --> F1[持续连接]
        Note over D1,F1: 一次握手，持续通信
    end
```

| 特性 | HTTP | WebSocket |
|------|------|-----------|
| 连接方式 | 短连接 | 长连接 |
| 通信模式 | 半双工（请求 - 响应） | 全双工 |
| 头部开销 | 大（每次请求完整头部） | 小（握手后仅 2-14 字节） |
| 服务器推送 | 不支持 | 支持 |
| 实时性 | 低（需轮询） | 高（毫秒级） |
| 适用场景 | 网页浏览、API | 聊天、游戏、实时监控 |

### 6.4.5 实时通信方案对比

| 方案 | 延迟 | 带宽效率 | 实现复杂度 | 适用场景 |
|------|------|----------|------------|----------|
| 轮询 | 高 | 低 | 简单 | 低频更新 |
| 长轮询 | 中 | 中 | 中等 | 消息推送 |
| SSE | 中 | 高 | 简单 | 单向推送 |
| WebSocket | 低 | 高 | 中等 | 双向实时 |

### 6.4.6 WebSocket 编程示例

**服务端（Node.js）：**

```javascript
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('客户端连接');
  
  // 发送欢迎消息
  ws.send(JSON.stringify({ type: 'welcome', message: '已连接' }));
  
  // 接收消息
  ws.on('message', (message) => {
    console.log('收到:', message.toString());
    
    // 广播给所有客户端
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });
  
  // 心跳检测
  const interval = setInterval(() => {
    if (ws.isAlive === false) {
      return ws.terminate();
    }
    ws.isAlive = false;
    ws.ping();
  }, 30000);
  
  ws.on('pong', () => {
    ws.isAlive = true;
  });
  
  ws.on('close', () => {
    clearInterval(interval);
    console.log('客户端断开');
  });
});
```

**客户端（JavaScript）：**

```javascript
const ws = new WebSocket('ws://localhost:8080');

ws.onopen = () => {
  console.log('连接成功');
  ws.send(JSON.stringify({ type: 'chat', message: 'Hello!' }));
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('收到消息:', data);
};

ws.onclose = () => {
  console.log('连接关闭');
};

ws.onerror = (error) => {
  console.error('错误:', error);
};
```

### 6.4.7 常见误区

**误区 1：WebSocket 可以完全替代 HTTP**
- ❌ 错误：两者是互补关系
- ✅ 正确：HTTP 用于请求 - 响应场景，WebSocket 用于实时双向通信

**误区 2：WebSocket 不需要考虑安全**
- ❌ 错误：WebSocket 同样需要安全保护
- ✅ 正确：使用 wss://（WebSocket Secure）加密通信

**误区 3：WebSocket 连接永不掉线**
- ❌ 错误：网络问题会导致连接断开
- ✅ 正确：需要实现重连机制和心跳检测

### 6.4.8 最佳实践

1. **使用 wss://**：生产环境必须使用加密
2. **实现心跳机制**：定期发送 Ping/Pong 保持连接
3. **处理重连**：断线后自动重连，指数退避
4. **消息格式**：使用 JSON 或其他结构化格式
5. **限流**：防止客户端发送过多消息

---

## 附录：引用来源

1. IP 协议详解 - CSDN，https://blog.csdn.net/
2. TCP 三次握手四次挥手 - 腾讯云开发者社区，https://cloud.tencent.com/developer/
3. HTTP/HTTPS 协议演进 - 知乎，https://zhuanlan.zhihu.com/
4. DNS 解析原理 - 阿里云开发者社区，https://developer.aliyun.com/
5. WebSocket 实时通信 - 简书，https://www.jianshu.com/
6. 路由协议对比 - 百度百科，https://baike.baidu.com/
7. TCP 拥塞控制 - 阿里云，https://developer.aliyun.com/article/

---

*文档生成日期：2026-04-01*  
*调研工具：MCP WebSearch (bailian_web_search)*
