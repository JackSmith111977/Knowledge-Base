# 前端手撕题训练路线（Frontend Handwriting Practice）

> 前端面试常考手写代码题的阶段性训练路线
> 按 JS 基础 → React 原理 → 业务场景 三阶段递进

---

## 阶段路线

| 顺序 | 阶段 | 题量 | 完成条件 |
|------|------|------|---------|
| 1 | JS 基础 — 工具函数 | 8 题 | 去重、扁平化、浅比较、深/浅拷贝等 |
| 2 | JS 基础 — 函数增强 | 6 题 | 防抖、节流、柯里化、compose 等 |
| 3 | JS 基础 — this 与原型 | 5 题 | call/apply/bind、new、instanceof 等 |
| 4 | JS 基础 — 异步与事件 | 6 题 | Promise、EventEmitter、AJAX、调度器 |
| 5 | React — 自定义 Hook | 6 题 | useDebounce、useThrottle、usePrevious 等 |
| 6 | React — 原理实现 | 5 题 | useMemo/useCallback/useState/useEffect 简化实现 |
| 7 | React — 高级模式 | 4 题 | React.memo、useReducer、forwardRef |
| 8 | 业务场景 | 4 题 | 虚拟列表、图片懒加载、无限滚动、大文件上传 |

---

## 阶段 1：JS 基础 — 工具函数

**目标**：掌握最常用的数据处理与比较函数

| # | 题型 | 难度 | 考察要点 |
|---|------|------|---------|
| 1 | `unique(arr)` 数组去重 | Easy | Set、Map、filter + indexOf |
| 2 | `flatten(arr, depth?)` 数组扁平化 | Easy | 递归、Array.flat、reduce |
| 3 | `shallowEqual(obj1, obj2)` 浅比较 | Easy | Object.keys、引用比较、React.memo 的 areEqual |
| 4 | `shallowClone(obj)` 浅拷贝 | Easy | Object.assign、展开运算符 |
| 5 | `deepClone(obj)` 深拷贝（基础版） | Medium | 递归、类型判断、循环引用（WeakMap） |
| 6 | `formatNumber(num)` 千分位格式化 | Easy | 正则、字符串操作 |
| 7 | `uniqueAndSort(arr)` 去重并排序 | Easy | Set + sort |
| 8 | `deepEqual(a, b)` 深度相等比较 | Medium | 递归比较、Map/Set 遍历比较 |

---

## 阶段 2：JS 基础 — 函数增强

**目标**：掌握闭包与函数式编程核心

| # | 题型 | 难度 | 考察要点 |
|---|------|------|---------|
| 1 | `debounce(fn, delay, options?)` 防抖 | Medium | 闭包、setTimeout、this 指向、immediate 模式 |
| 2 | `throttle(fn, delay, options?)` 节流 | Medium | 时间戳 vs 定时器、leading/trailing |
| 3 | `curry(fn)` 函数柯里化 | Medium | 闭包、fn.length、参数累积 |
| 4 | `compose(...fns)` / `pipe(...fns)` 组合函数 | Medium | reduce、函数式编程 |
| 5 | `Array.prototype.map/filter/reduce` 实现 | Medium | 数组遍历、回调绑定、稀疏数组 |
| 6 | `Object.is(value1, value2)` 实现 | Medium | NaN 与 ±0 的特殊处理 |

---

## 阶段 3：JS 基础 — this 与原型

**目标**：理解 JavaScript 的 this 机制与原型链

| # | 题型 | 难度 | 考察要点 |
|---|------|------|---------|
| 1 | `myCall(fn, context, ...args)` | Medium | this 绑定、函数借用 |
| 2 | `myApply(fn, context, args)` | Medium | 参数数组展开 |
| 3 | `myBind(fn, context, ...args)` | Medium | 返回新函数、柯里化 this |
| 4 | `myNew(Constructor, ...args)` | Medium | Object.create、原型链、构造函数返回 |
| 5 | `myInstanceof(obj, Constructor)` | Medium | 原型链遍历、__proto__ |

---

## 阶段 4：JS 基础 — 异步与事件

**目标**：掌握异步编程与事件机制

| # | 题型 | 难度 | 考察要点 |
|---|------|------|---------|
| 1 | Promise 核心实现 | Hard | 三态转换、then 链式、微任务 |
| 2 | `Promise.all/race/allSettled/any` | Hard | 并发控制、状态聚合 |
| 3 | EventEmitter 发布订阅 | Medium | 回调队列、事件注册/解绑/once |
| 4 | AJAX / Fetch 封装 | Medium | XMLHttpRequest、Promise、超时/取消 |
| 5 | Scheduler 调度器 | Hard | 任务队列、并发限制、优先级 |
| 6 | JSONP 实现 | Medium | 动态 script、Promise 封装 |

---

## 阶段 5：React — 自定义 Hook

**目标**：掌握常用自定义 Hook 的实现

| # | 题型 | 难度 | 考察要点 |
|---|------|------|---------|
| 1 | `usePrevious(value)` | Easy | useRef 保存上一次值 |
| 2 | `useDebounce(value, delay)` | Medium | useState + useEffect + 定时器 |
| 3 | `useThrottle(value, delay)` | Medium | 时间戳/定时器节流 |
| 4 | `useClickOutside(ref, handler)` | Easy | 事件监听与清理 |
| 5 | `useMount/useUnmount` | Easy | useEffect 空依赖/清理函数 |
| 6 | `useTitle(title)` | Easy | useEffect 副作用 |

---

## 阶段 6：React — 原理实现

**目标**：理解 React 核心 Hook 的内部机制

| # | 题型 | 难度 | 考察要点 |
|---|------|------|---------|
| 1 | `useState` 简化实现 | Medium | Hook 链表、setter 触发重渲染 |
| 2 | `useEffect` 简化实现 | Medium | 副作用注册、依赖检测、清理函数 |
| 3 | `useMemo` 简化实现 | Medium | shallowEqual 依赖比较、缓存复用 |
| 4 | `useCallback` 简化实现 | Medium | 与 useMemo 的异同 |
| 5 | Hooks 链表机制 | Hard | Fiber.memoizedState、Hook 顺序 |

---

## 阶段 7：React — 高级模式

**目标**：掌握 React 高级模式与状态管理

| # | 题型 | 难度 | 考察要点 |
|---|------|------|---------|
| 1 | `React.memo` 简化实现 | Medium | HOC、props 浅比较 |
| 2 | `useReducer` 简化实现 | Medium | reducer 模式、dispatch |
| 3 | `useImperativeHandle` + `forwardRef` | Medium | ref 转发、命令式 API |
| 4 | 简易 Redux 实现 | Hard | createStore、reducer、middleware、compose |

---

## 阶段 8：业务场景

**目标**：将算法与前端结合，解决实际业务问题

| # | 题型 | 难度 | 考察要点 |
|---|------|------|---------|
| 1 | 虚拟列表 | Medium | 可视区域计算、滚动偏移、动态高度 |
| 2 | 图片懒加载 | Easy | IntersectionObserver、data-src |
| 3 | 无限滚动（上拉加载） | Medium | 滚动阈值、防抖、loading 状态 |
| 4 | 大文件分片上传 | Medium | FileReader、Blob.slice、并发控制 |

---

## 出题策略

### 推进条件
- 当前阶段完成 ≥ 80% 且最近 3 次复习平均评分 ≥ 3 分 → 推进到下一阶段
- 新题完成后按 3-5-7 法则加入复习队列

### 复习方式
- 前端手撕题的复习 = **默写核心代码**，不要求完整可运行
- 重点检查：闭包是否正确、this 是否绑定、依赖比较是否完整

### 评分标准
| 分数 | 标准 |
|------|------|
| 5 | 独立写出核心逻辑，边界处理完整 |
| 3 | 核心逻辑正确，有 1-2 处边界遗漏 |
| 1 | 需要提示或看了题解 |

---

*v1.0.0 | 2026-04-14*
*说明：前端手撕题训练路线，按 8 阶段递进，共 44 题。*
