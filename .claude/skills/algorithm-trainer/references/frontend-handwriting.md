# 前端手撕题训练路线（Frontend Handwriting Practice）

> 前端面试常考手写代码题的阶段性训练路线
> 按 JS 基础 → React 原理 → 业务场景 三阶段递进
> **在线练习平台：[牛客网前端编程](https://www.nowcoder.com/ta/front-end) — 在线写代码 + 自动判题**

---

## 阶段路线

| 顺序 | 阶段 | 题量 | 完成条件 | 在线练习 |
|------|------|------|---------|---------|
| 1 | JS 基础 — 工具函数 | 8 题 | 去重、扁平化、浅比较、深/浅拷贝等 | [牛客网](https://www.nowcoder.com/ta/front-end) |
| 2 | JS 基础 — 函数增强 | 6 题 | 防抖、节流、柯里化、compose 等 | [牛客网](https://www.nowcoder.com/ta/front-end) |
| 3 | JS 基础 — this 与原型 | 5 题 | call/apply/bind、new、instanceof 等 | [牛客网](https://www.nowcoder.com/ta/front-end) |
| 4 | JS 基础 — 异步与事件 | 6 题 | Promise、EventEmitter、AJAX、调度器 | [牛客网](https://www.nowcoder.com/ta/front-end) |
| 5 | React — 自定义 Hook | 6 题 | useDebounce、useThrottle、usePrevious 等 | [牛客网](https://www.nowcoder.com/ta/front-end) |
| 6 | React — 原理实现 | 5 题 | useMemo/useCallback/useState/useEffect 简化实现 | [牛客网](https://www.nowcoder.com/ta/front-end) |
| 7 | React — 高级模式 | 4 题 | React.memo、useReducer、forwardRef | [牛客网](https://www.nowcoder.com/ta/front-end) |
| 8 | 业务场景 | 4 题 | 虚拟列表、图片懒加载、无限滚动、大文件上传 | [牛客网](https://www.nowcoder.com/ta/front-end) |

---

## 牛客网在线题单（按 8 阶段映射）

> 以下题号对应 [牛客网前端编程题](https://www.nowcoder.com/ta/front-end)（tpId=2），每题都有在线 IDE + 自动判题。

### 阶段 1：JS 基础 — 工具函数

| # | 题型 | 牛客题号 | 在线链接 | 考察要点 |
|---|------|---------|---------|---------|
| 1 | 数组去重 | FED25 | [链接](https://www.nowcoder.com/practice/0b5ae9c4a8c546f79e2547c0179bfdc2?tpId=2&tqId=10855) | Set、Map、filter + indexOf |
| 2 | 斐波那契数列 | FED26 | [链接](https://www.nowcoder.com/practice/aa8ffe28ec7c4050b2aa8bc9d26710e9?tpId=2&tqId=10856) | 递归、记忆化、迭代 |
| 3 | 时间格式化输出 | FED27 | [链接](https://www.nowcoder.com/practice/a789783e7c984f10a0bf649f6d4e2d59?tpId=2&tqId=10857) | Date API、模板字符串 |
| 4 | 获取字符串长度 | FED28 | [链接](https://www.nowcoder.com/practice/e436bbc408744b73b69a8925fac26efc?tpId=2&tqId=10858) | Unicode、代理对 |
| 5 | 字符串字符统计 | FED32 | [链接](https://www.nowcoder.com/practice/777d0cd160de485cae0b1fd1dd973b44?tpId=2&tqId=10862) | Map、对象哈希 |
| 6 | 将字符串转为驼峰格式 | FED31 | [链接](https://www.nowcoder.com/practice/2ded24e34ec34325a62d42d0c8479bae?tpId=2&tqId=10861) | 正则 replace |
| 7 | 数组求和 | — | [链接](https://www.nowcoder.com/practice/cc3ce199461c4c4cb8f63db61d7eba30?tpId=2&tqId=37871) | reduce、遍历 |
| 8 | 查找重复元素 | — | [链接](https://www.nowcoder.com/practice/871a468deecf453589ea261835d6b78b?tpId=2&tqId=37881) | Set、排序相邻比较 |

### 阶段 2：JS 基础 — 函数增强

| # | 题型 | 牛客题号 | 在线链接 | 考察要点 |
|---|------|---------|---------|---------|
| 1 | 使用闭包 | — | [链接](https://www.nowcoder.com/practice/578026cd24e3446bbf27fe565473dc26?tpId=2&tqId=37893) | 闭包概念、私有变量 |
| 2 | 返回函数 | — | [链接](https://www.nowcoder.com/practice/1f9fd23cdfd14675ab10207191e1d035?tpId=2&tqId=37892) | 高阶函数、闭包 |
| 3 | 柯里化 | — | [链接](https://www.nowcoder.com/practice/bb78d69986794470969674a8b504ac00?tpId=2&tqId=37898) | 参数累积、fn.length |
| 4 | 二次封装函数 | — | [链接](https://www.nowcoder.com/practice/fb2d46b99947455a897f2e9fe2268355?tpId=2&tqId=37894) | 函数装饰器 |
| 5 | 使用 arguments | — | [链接](https://www.nowcoder.com/practice/df84fa320cbe49d3b4a17516974b1136?tpId=2&tqId=37895) | arguments 对象、类数组 |
| 6 | 函数的上下文 | — | [链接](https://www.nowcoder.com/practice/5e97b94794bd438f893137b2d3b28a6a?tpId=2&tqId=37891) | this 绑定、bind |

### 阶段 3：JS 基础 — this 与原型

| # | 题型 | 牛客题号 | 在线链接 | 考察要点 |
|---|------|---------|---------|---------|
| 1 | 修改 this 指向 | FED21 | [链接](https://www.nowcoder.com/practice/a616b3de81b948fda9a92db7e86bd171?tpId=2&tqId=10851) | call/apply/bind |
| 2 | 改变上下文 | — | [链接](https://www.nowcoder.com/practice/dfcc28bf243642b795eaf5a2a621acc5?tpId=2&tqId=37906) | this 绑定机制 |
| 3 | 使用 apply 调用函数 | — | [链接](https://www.nowcoder.com/practice/d47b482e7148497582c7a995df51f393?tpId=2&tqId=37896) | apply 参数展开 |
| 4 | 根据包名创建对象 | FED24 | [链接](https://www.nowcoder.com/practice/a82e035501504cedbe881d08c824a381?tpId=2&tqId=10854) | 命名空间、原型链 |
| 5 | 批量改变对象属性 | — | [链接](https://www.nowcoder.com/practice/4f7d25a30eb1463cbf1daac39ec04f8d?tpId=2&tqId=37907) | Object 方法 |

### 阶段 4：JS 基础 — 异步与事件

| # | 题型 | 牛客题号 | 在线链接 | 考察要点 |
|---|------|---------|---------|---------|
| 1 | 计时器 | — | [链接](https://www.nowcoder.com/practice/72c661d926494bd8a50608506915268c?tpId=2&tqId=37888) | setTimeout/setInterval |
| 2 | 流程控制 | — | [链接](https://www.nowcoder.com/practice/8a7bff7ab0d345d5ac5c82e41d9f7115?tpId=2&tqId=37889) | 异步顺序控制 |
| 3 | 函数传参 | — | [链接](https://www.nowcoder.com/practice/80365a2685144559817e3d5e0c27f3a8?tpId=2&tqId=37890) | 参数传递机制 |

> **注**：阶段 4-8 中 Promise 实现、EventEmitter、React Hook 等高级题目牛客网覆盖不足，**LeetCode** 可作为补充：
> - Promise 实现 → LeetCode 无直接题，用 [js-practice](https://github.com/haizlin/fe-interview) 开源项目
> - React Hook 实现 → 在本地 IDE 中手写，用 React DevTools 验证

### 阶段 5-8：React 与业务场景

阶段 5-8 主要涉及 React 生态和工程场景，牛客网题目较少。推荐在**本地 IDE** 中手写，参考 `frontend-handwriting.md` 中的理论题单进行练习。

---

## 出题策略

### 推进条件
- 当前阶段完成 ≥ 80% 且最近 3 次复习平均评分 ≥ 3 分 → 推进到下一阶段
- 新题完成后按 3-5-7 法则加入复习队列

### 复习方式
- 阶段 1-3（牛客有题）：在线平台完成判题
- 阶段 4-8（牛客覆盖不足）：在对话中手写核心代码或本地 IDE 练习

### 评分标准
| 分数 | 标准 |
|------|------|
| 5 | 独立写出核心逻辑，边界处理完整 |
| 3 | 核心逻辑正确，有 1-2 处边界遗漏 |
| 1 | 需要提示或看了题解 |

---

*v2.0.0 | 2026-04-16*
*说明：前端手撕题训练路线，牛客网在线编程题单映射（tpId=2）。阶段 1-3 用牛客网在线 IDE，阶段 4-8 本地手写补充。*
