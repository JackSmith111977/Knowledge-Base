# JavaScript 核心知识体系

> 全面的 JavaScript 核心概念、原理与最佳实践指南

---

## 目录

1. [JavaScript 概述](#1-javascript-概述)
2. [语言基础](#2-语言基础)
3. [核心概念](#3-核心概念)
4. [函数与作用域](#4-函数与作用域)
5. [对象与原型](#5-对象与原型)
6. [异步编程](#6-异步编程)
7. [DOM 与 BOM](#7-dom-与-bom)
8. [事件机制](#8-事件机制)
9. [ES6+ 新特性](#9-es6-新特性)
10. [内存与性能](#10-内存与性能)

---

## 1. JavaScript 概述

### 1.1 三大组成部分

| 组成部分 | 说明 | 核心作用 |
|----------|------|----------|
| **ECMAScript** | 语言的语法核心 | 定义变量、函数、数据类型、运算符等基础语法规则 |
| **DOM** | 文档对象模型 | 页面文档的编程接口，获取、修改、添加或删除 HTML 元素 |
| **BOM** | 浏览器对象模型 | 浏览器窗口的编程接口，操作浏览器窗口本身 |

### 1.2 语言特性

- **动态类型**：变量无需声明类型，运行时自动推断
- **弱类型**：类型可自动转换（`"5" + 3 → "53"`，`"5" - 3 → 2`）
- **基于原型**：对象继承通过原型链实现
- **单线程 + 事件循环**：通过异步回调、Promise、async/await 处理并发
- **函数是一等公民**：函数可赋值、传参、返回

### 1.3 运行环境

- **浏览器**：最常见，通过 `<script>` 标签嵌入 HTML
- **Node.js**：服务端运行环境
- **其他**：Electron（桌面应用）、React Native（移动应用）等

---

## 2. 语言基础

### 2.1 变量声明

```javascript
// var - 函数作用域，存在变量提升
var a = 10;

// let - 块级作用域，不存在变量提升
let b = 20;

// const - 块级作用域，声明常量
const c = 30;
```

**建议**：优先用 `const`，需要修改值时用 `let`，彻底抛弃 `var`

### 2.2 数据类型

#### 基本类型（栈内存）
- `String` - 字符串
- `Number` - 数字
- `Boolean` - 布尔值
- `Undefined` - 未定义
- `Null` - 空值
- `Symbol` (ES6) - 唯一值
- `BigInt` (ES10) - 大整数

#### 引用类型（堆内存）
- `Object` - 对象
- `Array` - 数组
- `Function` - 函数
- `Date` - 日期
- `RegExp` - 正则表达式

### 2.3 类型判断

```javascript
// typeof - 判断基本类型
typeof 123;           // "number"
typeof "hello";       // "string"
typeof true;          // "boolean"
typeof undefined;     // "undefined"
typeof {};            // "object"
typeof [];            // "object"
typeof null;          // "object"
typeof function(){};  // "function"

// instanceof - 判断引用类型
[] instanceof Array;  // true

// Object.prototype.toString.call() - 精确判断
Object.prototype.toString.call([]);  // "[object Array]"
```

### 2.4 运算符

| 运算符 | 说明 |
|--------|------|
| `==` vs `===` | `==` 允许类型转换，`===` 严格相等 |
| `??` | 空值合并运算符 |
| `?.` | 可选链操作符 |
| `**` | 指数运算符 (ES6) |

---

## 3. 核心概念

### 3.1 执行上下文（Execution Context）

**什么是执行上下文？**

执行上下文是 JavaScript 代码执行时所处的环境，包含了代码执行所需的所有信息。可以理解为函数或全局代码的「运行环境」。

**执行上下文的组成：**

```
┌─────────────────────────────────────────────────────────┐
│                   执行上下文                             │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  1. 变量环境（Variable Environment）                    │
│     - 存储 var 声明的变量                               │
│     - 存储函数声明                                      │
│     - 存储 arguments 对象                                │
│                                                         │
│  2. 词法环境（Lexical Environment）                     │
│     - 存储 let/const 声明的变量                         │
│     - 存储块级作用域                                    │
│     - 包含对外部词法环境的引用（作用域链）              │
│                                                         │
│  3. this 绑定                                           │
│     - 指向当前执行上下文的调用者                        │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**执行上下文栈（Call Stack）：**

```
JavaScript 使用栈来管理执行上下文，遵循 LIFO（后进先出）原则。

示例代码：
function foo() {
  console.log('foo');
  bar();
}

function bar() {
  console.log('bar');
}

foo();  // 调用 foo

执行栈变化：

1. 初始状态
   ┌─────────┐
   │  Global │
   └─────────┘

2. 调用 foo()
   ┌─────────┐
   │   foo   │
   ├─────────┤
   │  Global │
   └─────────┘

3. foo 调用 bar()
   ┌─────────┐
   │   bar   │
   ├─────────┤
   │   foo   │
   ├─────────┤
   │  Global │
   └─────────┘

4. bar 执行完毕返回
   ┌─────────┐
   │   foo   │
   ├─────────┤
   │  Global │
   └─────────┘

5. foo 执行完毕返回
   ┌─────────┐
   │  Global │
   └─────────┘
```

**三种类型的执行上下文：**

| 类型 | 触发时机 | 特点 |
|------|---------|------|
| 全局执行上下文 | 代码开始执行 | 创建全局对象（浏览器为 window），this 指向全局对象 |
| 函数执行上下文 | 函数被调用 | 创建 arguments 对象，this 由调用方式决定 |
| eval 执行上下文 | eval() 调用 | 不推荐使用，变量会泄露到外层作用域 |

---

### 3.2 变量提升（Hoisting）

**什么是变量提升？**

变量提升是指 JavaScript 引擎在代码执行前，会将变量和函数的声明「提升」到当前作用域顶部的行为。这是 JavaScript 编译阶段的行为。

**底层原理：两阶段处理**

```
JavaScript 引擎处理代码分为两个阶段：

阶段 1：创建/编译阶段
├─ 扫描所有声明（var、let、const、function、class）
├─ 将声明注册到执行上下文的变量环境中
└─ 确定作用域结构

阶段 2：执行阶段
├─ 逐行执行代码
├─ 进行赋值操作
└─ 执行函数调用
```

**var 变量提升：**

```javascript
// 实际代码
console.log(a);  // undefined（不是报错！）
var a = 10;

// 引擎眼中的代码（经过提升处理）
var a;           // 声明被提升到顶部，初始化为 undefined
console.log(a);  // 访问时 a 已存在，值为 undefined
a = 10;          // 赋值留在原地
```

**let/const 与暂时性死区（TDZ）：**

```javascript
// let/const 也存在提升，但行为不同
console.log(b);  // ReferenceError: Cannot access 'b' before initialization

let b = 20;

// 引擎处理过程：
// 阶段 1：创建阶段
// - b 被注册到词法环境中
// - 标记为「未初始化」状态
// - 进入暂时性死区（TDZ）
//
// 阶段 2：执行阶段
// - 执行到 let b 之前，b 处于 TDZ 中
// - 访问 TDZ 中的变量抛出 ReferenceError
// - 执行 let b = 20 后，b 离开 TDZ，可以正常访问

// TDZ 范围示意：
{
  // ↓ TDZ 开始（b 存在但不可访问）
  console.log(b);  // ReferenceError
  // ↓ TDZ 结束（b 可访问）
  let b = 20;
  console.log(b);  // 20 ✓
}
```

**函数提升 vs 变量提升：**

```javascript
// 函数声明会被完全提升（包括函数体）
sayHello();  // "Hello!" ✓
function sayHello() {
  console.log('Hello!');
}

// 函数表达式只有变量提升，函数体不提升
sayHi();  // TypeError: sayHi is not a function
var sayHi = function() {
  console.log('Hi!');
};

// 等价于：
var sayHi;     // 提升
sayHi();       // 此时 sayHi = undefined
sayHi = function() {...};  // 赋值
```

**常见误区：**

```javascript
// ❌ 错误：参数也会进入 TDZ
function test() {
  console.log(a);  // undefined（var 提升）
  console.log(b);  // ReferenceError（let TDZ）
  console.log(c);  // ReferenceError（const TDZ）

  var a = 1;
  let b = 2;
  const c = 3;
}

// ❌ 错误：块级作用域内的提升
if (true) {
  console.log(x);  // ReferenceError
  let x = 10;
}
```

---

### 3.3 事件循环（Event Loop）

**为什么需要事件循环？**

JavaScript 是单线程语言，同一时间只能执行一个任务。为了处理异步操作（定时器、网络请求、用户事件等），JavaScript 引入了事件循环机制。

**事件循环的完整架构：**

```
┌─────────────────────────────────────────────────────────────────┐
│                      JavaScript 运行时                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐                                              │
│  │  调用栈       │                                              │
│  │  (Call Stack)│                                              │
│  │  ┌────────┐  │                                              │
│  │  │ func C │  │                                              │
│  │  ├────────┤  │                                              │
│  │  │ func B │  │                                              │
│  │  ├────────┤  │                                              │
│  │  │ func A │  │                                              │
│  │  ├────────┤  │                                              │
│  │  │  main  │  │                                              │
│  │  └────────┘  │                                              │
│  └──────────────┘                                              │
│         ↓                                                       │
│  ┌─────────────────────────────────────────┐                   │
│  │           Web APIs / Node APIs          │                   │
│  │  - setTimeout                           │                   │
│  │  - setInterval                          │                   │
│  │  - fetch / XMLHttpRequest               │                   │
│  │  - DOM 事件                             │                   │
│  │  - Promise                              │                   │
│  └─────────────────────────────────────────┘                   │
│         ↓                                                       │
│  ┌──────────────┐    ┌──────────────┐                         │
│  │  宏任务队列   │    │  微任务队列   │                         │
│  │  (Task Queue)│    │(Microtask Q.)│                         │
│  │  ┌────────┐  │    │  ┌────────┐  │                         │
│  │  │ timer1 │  │    │  │promise1│  │                         │
│  │  ├────────┤  │    │  ├────────┤  │                         │
│  │  │  I/O   │  │    │  │promise2│  │                         │
│  │  ├────────┤  │    │  ├────────┤  │                         │
│  │  │render  │  │    │  │promise3│  │                         │
│  │  └────────┘  │    │  └────────┘  │                         │
│  └──────────────┘    └──────────────┘                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**任务分类：**

| 类型 | 宏任务（Macro Task） | 微任务（Micro Task） |
|------|---------------------|---------------------|
| 别名 | Task | Jobs |
| 执行时机 | 每轮事件循环执行一个 | 当前宏任务后立即执行全部 |
| 是否阻塞渲染 | 是 | 是 |
| 常见类型 | setTimeout、setInterval、I/O、UI 渲染、script 整体代码 | Promise.then/catch/finally、queueMicrotask、MutationObserver |
| 优先级 | 低 | 高 |

**事件循环执行流程：**

```
1. 执行同步代码（调用栈）
   ↓
2. 同步代码执行完毕，调用栈清空
   ↓
3. 执行所有微任务（清空微任务队列）
   ↓
4. 如需渲染，执行 UI 渲染
   ↓
5. 执行一个宏任务
   ↓
6. 回到步骤 3
   ↓
7. 循环往复...
```

**经典执行顺序题目：**

```javascript
console.log('1. script start');

setTimeout(() => {
  console.log('2. setTimeout');
}, 0);

Promise.resolve()
  .then(() => {
    console.log('3. promise 1');
  })
  .then(() => {
    console.log('4. promise 2');
  });

console.log('5. script end');

// 输出顺序：
// 1. script start     (同步代码)
// 5. script end       (同步代码)
// 3. promise 1        (微任务)
// 4. promise 2        (微任务，由前一个 then 产生)
// 2. setTimeout       (宏任务)
```

**微任务优先级的意义：**

```javascript
// 场景：确保某些回调在所有同步操作后、下一个宏任务前执行
Promise.resolve().then(() => {
  // 这个回调会在当前同步代码完成后立即执行
  // 优先于 setTimeout、I/O 等宏任务
  updateUI();
});

// 使用场景：
// 1. React 的批处理更新
// 2. Vue 的响应式更新
// 3. 确保异步操作后的 DOM 更新
```

**Node.js 中的特殊微任务：**

```javascript
// process.nextTick 是 Node.js 特有的微任务
// 优先级高于 Promise.then

process.nextTick(() => {
  console.log('nextTick');
});

Promise.resolve().then(() => {
  console.log('Promise.then');
});

// 输出顺序：
// nextTick（优先级最高）
// Promise.then
```

---

## 4. 函数与作用域

### 4.1 函数定义方式

```javascript
// 函数声明
function greet1(name) {
  return "Hello, " + name;
}

// 函数表达式
const greet2 = function(name) {
  return "Hello, " + name;
};

// 箭头函数 (ES6)
const greet3 = (name) => `Hello, ${name}`;

// 箭头函数 - 简写
const add = (a, b) => a + b;
```

### 4.2 作用域

```javascript
// 全局作用域
const globalVar = "global";

// 函数作用域
function myFunc() {
  var functionVar = "function scope";
}

// 块级作用域 (let/const)
if (true) {
  let blockVar = "block scope";
  const blockConst = "block const";
}
```

### 4.3 闭包 (Closure)

```javascript
// 闭包 = 函数 + 词法作用域
function createCounter() {
  let count = 0;
  return function() {
    count++;
    return count;
  };
}

const counter = createCounter();
console.log(counter());  // 1
console.log(counter());  // 2
```

**闭包的应用场景**：
- 数据私有化
- 函数工厂
- 回调函数
- 柯里化

### 4.4 this 指向

```javascript
// 普通函数 - 谁调用指向谁
function greet() {
  console.log(this.name);
}

// 箭头函数 - 继承父级作用域的 this
const obj = {
  name: "Alice",
  greet: () => {
    console.log(this.name);  // 指向外层作用域
  }
};

// 绑定 this
func.call(thisArg, arg1, arg2);
func.apply(thisArg, [args]);
func.bind(thisArg);
```

---

## 5. 对象与原型

### 5.1 对象创建方式

```javascript
// 对象字面量
const obj1 = { name: "Alice" };

// 构造函数
function Person(name) {
  this.name = name;
}
const obj2 = new Person("Bob");

// Object.create()
const obj3 = Object.create({ name: "Charlie" });

// class 语法糖 (ES6)
class Dog {
  constructor(name) {
    this.name = name;
  }
}
const obj4 = new Dog("Buddy");
```

### 5.2 原型链（Prototype Chain）

**为什么需要原型链？**

JavaScript 中每个对象都可以有另一个对象作为它的原型，原型对象又有自己的原型，形成一条链。这是 JavaScript 实现继承和属性共享的机制。

**三个关键概念：**

```
┌─────────────────────────────────────────────────────────────────┐
│                    原型三要素                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. __proto__（隐式原型）                                      │
│     - 每个对象都有一个__proto__属性                            │
│     - 指向该对象的原型对象                                     │
│     - 用于原型链查找                                           │
│                                                                 │
│  2. prototype（显式原型）                                      │
│     - 只有函数才有 prototype 属性                               │
│     - 指向通过该函数创建的实例的原型                           │
│     - 用于设置实例的__proto__                                   │
│                                                                 │
│  3. constructor（构造函数引用）                                │
│     - 原型对象上有 constructor 属性                             │
│     - 指向原型对应的函数                                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**原型链关系图：**

```
function Person(name) {
  this.name = name;
}

const alice = new Person('Alice');

内存中的关系：

┌─────────────┐     __proto__     ┌──────────────────┐
│   alice     │ ────────────────> │  Person.prototype│
│  (实例对象)  │                   │   (原型对象)      │
│             │                   │                  │
│ name: Alice │                   │ sayHello: fn     │
└─────────────┘                   │ __proto__        │──┐
                                  │ constructor      │  │
                                  └──────────────────┘  │
                                           │            │
                                           │ __proto__  │
                                           │            │
                                           ↓            │
                                  ┌──────────────────┐  │
                                  │ Object.prototype │  │
                                  │                  │  │
                                  │ toString: fn     │  │
                                  │ hasOwnProperty   │  │
                                  │ __proto__: null  │  │
                                  └──────────────────┘
                                           │
                                           │ null
                                           ↓
                                        (原型链终点)

// 验证关系
alice.__proto__ === Person.prototype        // true
Person.prototype.__proto__ === Object.prototype  // true
Object.prototype.__proto__ === null         // true
Person.prototype.constructor === Person     // true
```

**属性查找机制：**

```javascript
function Person(name) {
  this.name = name;
}

// 在原型上添加方法
Person.prototype.sayHello = function() {
  console.log(`Hello, I'm ${this.name}`);
};

const alice = new Person('Alice');

// 属性查找过程
alice.name;
// 1. 查找 alice 对象自身 → 找到 name: 'Alice' → 返回
// 查找结束

alice.sayHello();
// 1. 查找 alice 对象自身 → 未找到
// 2. 沿原型链查找 alice.__proto__ (Person.prototype) → 找到 sayHello → 执行

alice.toString();
// 1. 查找 alice 对象自身 → 未找到
// 2. 沿原型链查找 alice.__proto__ (Person.prototype) → 未找到
// 3. 继续沿原型链查找 Person.prototype.__proto__ (Object.prototype) → 找到 toString → 执行

alice.nonExistent;
// 1. 查找 alice 对象自身 → 未找到
// 2. 沿原型链查找 Person.prototype → 未找到
// 3. 继续沿原型链查找 Object.prototype → 未找到
// 4. Object.prototype.__proto__ === null → 原型链结束
// 返回 undefined
```

**原型链继承的本质：**

```javascript
// 类继承的本质是原型链的连接
class Animal {
  speak() {
    console.log('Animal speaks');
  }
}

class Dog extends Animal {
  bark() {
    console.log('Dog barks');
  }
}

const dog = new Dog();

// 原型链关系
// dog.__proto__ === Dog.prototype
// Dog.prototype.__proto__ === Animal.prototype
// Animal.prototype.__proto__ === Object.prototype

dog.speak();  // 沿原型链找到 Animal.prototype.speak
dog.bark();   // 在 Dog.prototype 找到
```

**常见误区：**

```javascript
// ❌ 错误：混淆 prototype 和__proto__
function Person() {}
const p = new Person();

console.log(p.prototype);      // undefined（实例没有 prototype）
console.log(p.__proto__);      // Person.prototype（实例有__proto__）
console.log(Person.prototype); // {}（函数有 prototype）
console.log(Person.__proto__); // Function.prototype（函数本身也是对象）

// ❌ 错误：直接修改__proto__
const obj = { a: 1 };
obj.__proto__ = { b: 2 };  // 不推荐，性能差

// ✅ 正确：使用 Object.create 或 Object.setPrototypeOf
const obj2 = Object.create({ b: 2 });
Object.setPrototypeOf(obj, { b: 2 });
```

---

### 5.3 继承实现

```javascript
// class 继承 (ES6) - 语法糖，底层仍是原型链
class Animal {
  constructor(type) {
    this.type = type;
  }
  speak() {
    console.log("Animal speaks");
  }
}

class Dog extends Animal {
  constructor(type, name) {
    super(type);  // 调用父类构造函数
    this.name = name;
  }
  speak() {
    super.speak();  // 调用父类方法
    console.log(`${this.name} barks`);
  }
}
```

---

### 5.4 常用数组方法

| 方法 | 说明 | 返回值 |
|------|------|--------|
| `forEach()` | 遍历 | undefined |
| `map()` | 映射 | 新数组 |
| `filter()` | 过滤 | 新数组 |
| `reduce()` | 归并 | 单个值 |
| `find()` | 查找首个匹配 | 元素 |
| `some()` | 是否有匹配 | boolean |
| `every()` | 是否全部匹配 | boolean |
| `slice()` | 截取数组 | 新数组 |
| `splice()` | 修改数组 | 被删除元素 |

---

## 6. 异步编程

### 6.1 演进历程

```
回调函数 → Promise → async/await → (ES2026) 更强大的异步原语
```

### 6.2 Promise

**什么是 Promise？**

Promise 是 JavaScript 中用于处理异步操作的对象。它代表一个异步操作的最终完成（或失败）及其结果值。Promise 有三种状态，状态一旦改变就不可逆。

**Promise 状态机：**

```
┌─────────────────────────────────────────────────────────────────┐
│                    Promise 状态机                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│                      ┌─────────────┐                           │
│                      │  pending    │                           │
│                      │  (等待中)    │                           │
│                      └──────┬──────┘                           │
│                             │                                   │
│              ┌──────────────┼──────────────┐                   │
│              │              │              │                   │
│              ↓              ↓              ↓                   │
│        resolve()      reject()      throw error                │
│              │              │              │                   │
│              ↓              ↓              ↓                   │
│     ┌────────────────┐  ┌────────────────┐                    │
│     │   fulfilled    │  │    rejected    │                    │
│     │    (成功)      │  │    (失败)      │                    │
│     └────────────────┘  └────────────────┘                    │
│                                                                 │
│  状态转换规则：                                                 │
│  - pending → fulfilled (调用 resolve 时)                        │
│  - pending → rejected (调用 reject 或抛出异常时)                │
│  - fulfilled/rejected → 不可再变化 (状态固化)                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Promise 简化实现：**

```javascript
class MyPromise {
  constructor(executor) {
    this.state = 'pending';      // 初始状态
    this.value = undefined;      // 成功的值
    this.reason = undefined;     // 失败的原因
    this.onFulfilledCallbacks = []; // then 回调队列
    this.onRejectedCallbacks = [];  // catch 回调队列

    // resolve 函数
    const resolve = (value) => {
      if (this.state === 'pending') {
        this.state = 'fulfilled';
        this.value = value;
        // 执行所有已注册的 then 回调
        this.onFulfilledCallbacks.forEach(fn => fn());
      }
    };

    // reject 函数
    const reject = (reason) => {
      if (this.state === 'pending') {
        this.state = 'rejected';
        this.reason = reason;
        this.onRejectedCallbacks.forEach(fn => fn());
      }
    };

    // 立即执行 executor，出错则 reject
    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  then(onFulfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      if (this.state === 'fulfilled') {
        try {
          const result = onFulfilled(this.value);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      }

      if (this.state === 'rejected') {
        try {
          const result = onRejected(this.reason);
          reject(result);
        } catch (error) {
          reject(error);
        }
      }

      if (this.state === 'pending') {
        // 状态未确定，将回调加入队列
        this.onFulfilledCallbacks.push(() => {
          const result = onFulfilled(this.value);
          resolve(result);
        });
        this.onRejectedCallbacks.push(() => {
          const result = onRejected(this.reason);
          reject(result);
        });
      }
    });
  }
}
```

**then 链原理：**

```javascript
// then 方法总是返回一个新的 Promise
fetch('/api/user')
  .then(response => response.json())  // 返回 Promise<Response>
  .then(data => {                     // 接收上一个 then 的返回值
    console.log(data);
    return data.id;                   // 返回值被包装成 resolved Promise
  })
  .then(id => {                       // 接收上一个 then 的返回值
    console.log('User ID:', id);
  })
  .catch(error => {                   // 捕获链上任何位置的错误
    console.error(error);
  });

// then 链的执行流程：
// 1. 第一个 then 注册回调，等待 fetch 完成
// 2. fetch 完成后，执行第一个 then 的回调
// 3. 第一个 then 的返回值被包装成新的 Promise
// 4. 第二个 then 等待第一个 then 返回的 Promise
// 5. 依此类推...
```

**Promise 与微任务：**

```javascript
// Promise.then 的回调被注册为微任务
console.log('script start');

Promise.resolve()
  .then(() => {
    console.log('then 1');
    // then 内部返回的新 Promise 也会创建微任务
    return Promise.resolve();
  })
  .then(() => {
    console.log('then 2');
  });

console.log('script end');

// 输出顺序：
// script start
// script end
// then 1      ← 微任务
// then 2      ← then 1 返回的 Promise 创建的微任务
```

**Promise 方法的对比：**

| 方法 | 成功条件 | 失败条件 | 返回值 |
|------|---------|---------|--------|
| `Promise.all()` | 所有 Promise 都成功 | 任一 Promise 失败 | 所有结果的数组 |
| `Promise.race()` | 任一 Promise 完成 | 任一 Promise 失败 | 第一个完成的结果 |
| `Promise.allSettled()` | 所有 Promise 都完成 | 不会失败 | 所有结果的状态数组 |
| `Promise.any()` | 任一 Promise 成功 | 所有 Promise 都失败 | 第一个成功的结果 |

```javascript
// Promise.all - 所有都成功
Promise.all([
  Promise.resolve(1),
  Promise.resolve(2),
  Promise.resolve(3)
]).then(results => {
  console.log(results); // [1, 2, 3]
});

// Promise.all - 一个失败则全部失败
Promise.all([
  Promise.resolve(1),
  Promise.reject('error'),
  Promise.resolve(3)
]).catch(error => {
  console.error(error); // 'error'
});

// Promise.race - 竞速
Promise.race([
  new Promise(resolve => setTimeout(() => resolve('slow'), 1000)),
  new Promise(resolve => setTimeout(() => resolve('fast'), 100))
]).then(result => {
  console.log(result); // 'fast'
});

// Promise.allSettled - 等待全部完成（无论成功失败）
Promise.allSettled([
  Promise.resolve(1),
  Promise.reject('error'),
  Promise.resolve(3)
]).then(results => {
  console.log(results);
  // [
  //   { status: 'fulfilled', value: 1 },
  //   { status: 'rejected', reason: 'error' },
  //   { status: 'fulfilled', value: 3 }
  // ]
});

// Promise.any - 首个成功
Promise.any([
  Promise.reject('error1'),
  Promise.resolve('success'),
  Promise.resolve('success2')
]).then(result => {
  console.log(result); // 'success'
});
```

**常见误区：**

```javascript
// ❌ 错误：忘记返回 Promise
function getData() {
  fetch('/api/data')
    .then(data => console.log(data));
  // 忘记 return，调用者无法链式调用
}

// ✅ 正确
function getData() {
  return fetch('/api/data')
    .then(data => data.json());
}

// ❌ 错误：在 Promise 构造函数中嵌套 Promise
new Promise((resolve, reject) => {
  fetch('/api/data')
    .then(response => resolve(response.json()));
});

// ✅ 正确：直接返回
fetch('/api/data')
  .then(response => response.json());

// ❌ 错误：未处理 Promise  rejection
fetch('/api/data')
  .then(data => processData(data));
// 如果 fetch 失败，没有 catch 处理

// ✅ 正确：总是添加错误处理
fetch('/api/data')
  .then(data => processData(data))
  .catch(error => console.error(error));
```

---

### 6.3 async/await

```javascript
async function fetchData() {
  try {
    const response = await fetch("https://api.example.com/data");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
}

// Top-level await (ES2022+)
const data = await fetchData();
```

---

## 7. DOM 与 BOM

### 7.1 DOM 操作

```javascript
// 获取元素
document.getElementById("id");
document.querySelector(".class");
document.querySelectorAll("div");

// 修改内容
element.textContent = "Hello";
element.innerHTML = "<span>Hello</span>";

// 修改属性
element.setAttribute("title", "Tooltip");
element.getAttribute("title");

// 修改样式
element.style.color = "red";
element.classList.add("active");
element.classList.remove("active");
element.classList.toggle("active");

// 创建/删除元素
const newEl = document.createElement("div");
element.appendChild(newEl);
element.removeChild(childEl);
```

### 7.2 BOM 操作

```javascript
// window 对象
window.innerWidth;
window.innerHeight;

// location 对象
location.href;
location.search;
location.hash;

// history 对象
history.back();
history.forward();
history.go(-1);

// 定时器
setTimeout(() => {}, 1000);
setInterval(() => {}, 1000);
clearTimeout(timerId);
clearInterval(intervalId);
```

---

## 8. 事件机制

### 8.1 事件绑定

```javascript
// HTML 属性 (不推荐)
<button onclick="handleClick()">点击</button>

// DOM 0 级
element.onclick = function() {};

// DOM 2 级 (推荐)
element.addEventListener("click", handler);
element.removeEventListener("click", handler);
```

### 8.2 事件传播（Event Propagation）

**什么是事件传播？**

当 DOM 元素上的事件被触发时，事件会在 DOM 树中传播，经历三个阶段：捕获阶段、目标阶段、冒泡阶段。

**事件传播三阶段：**

```
┌─────────────────────────────────────────────────────────────────┐
│                    事件传播三阶段                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  DOM 结构：                                                     │
│                                                                 │
│           ┌─────────┐                                          │
│           │  html   │                                          │
│           └────┬────┘                                          │
│                │                                                │
│           ┌────┴────┐                                          │
│           │  body   │                                          │
│           └────┬────┘                                          │
│                │                                                │
│           ┌────┴────┐                                          │
│           │  div    │ ← 捕获阶段：事件从外向内传递              │
│           └────┬────┘   html → body → div                      │
│                │                                                │
│           ┌────┴────┐                                          │
│           │ button  │ ← 目标阶段：事件到达目标元素              │
│           └────┬────┘                                          │
│                │                                                │
│                │ ← 冒泡阶段：事件从内向外传递                   │
│                │   button → div → body → html                  │
│                ↓                                                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**三个阶段详解：**

```
1. 捕获阶段（Capturing Phase）
   - 事件从 window 开始，逐级向下传播到目标元素的父节点
   - 默认情况下，此阶段的事件监听器不会被触发
   - 可通过 addEventListener 的第三个参数设置为 true 来启用

2. 目标阶段（Target Phase）
   - 事件到达实际触发事件的元素
   - 目标元素的事件监听器在此阶段执行

3. 冒泡阶段（Bubbling Phase）
   - 事件从目标元素开始，逐级向上传播到 window
   - 默认情况下，事件监听器在此阶段被触发
   - 大多数事件都支持冒泡
```

**代码示例：**

```html
<div id="parent">
  <button id="child">点击我</button>
</div>

<script>
const parent = document.getElementById('parent');
const child = document.getElementById('child');

// 捕获阶段监听（第三个参数为 true 或 capture: true）
parent.addEventListener('click', () => {
  console.log('parent - 捕获阶段');
}, true);

child.addEventListener('click', () => {
  console.log('child - 捕获阶段');
}, true);

// 冒泡阶段监听（默认，第三个参数为 false 或 omit）
parent.addEventListener('click', () => {
  console.log('parent - 冒泡阶段');
}, false);

child.addEventListener('click', () => {
  console.log('child - 冒泡阶段');
}, false);

// 点击按钮后的输出顺序：
// parent - 捕获阶段
// child - 捕获阶段
// child - 冒泡阶段（目标阶段）
// parent - 冒泡阶段
</script>
```

**阻止事件传播：**

```javascript
// stopPropagation() - 阻止事件继续传播
child.addEventListener('click', (e) => {
  e.stopPropagation();
  console.log('child clicked');
  // 父元素的监听器不会被触发
});

// stopImmediatePropagation() - 阻止事件传播并阻止同阶段其他监听器
child.addEventListener('click', (e) => {
  e.stopImmediatePropagation();
  console.log('first listener');
});

child.addEventListener('click', () => {
  console.log('这个监听器不会被执行');
});
```

**阻止默认行为：**

```javascript
// preventDefault() - 阻止事件的默认行为
const link = document.querySelector('a');
link.addEventListener('click', (e) => {
  e.preventDefault();
  console.log('链接点击，但不会跳转');
});

// 表单提交阻止
form.addEventListener('submit', (e) => {
  e.preventDefault();
  // 表单不会提交，可以进行 AJAX 提交
});
```

**事件对象（Event Object）：**

```javascript
element.addEventListener('click', (event) => {
  // event.target: 实际触发事件的元素（可能是子元素）
  // event.currentTarget: 当前绑定监听器的元素
  // event.type: 事件类型，如 'click', 'mouseover'
  // event.bubbles: 事件是否冒泡
  // event.cancelable: 事件是否可取消
  // event.preventDefault(): 阻止默认行为
  // event.stopPropagation(): 阻止事件传播
  // event.phase: 事件阶段（1=捕获，2=目标，3=冒泡）

  console.log('target:', event.target);
  console.log('currentTarget:', event.currentTarget);
});
```

**常见误区：**

```javascript
// ❌ 错误：混淆 target 和 currentTarget
parent.addEventListener('click', (e) => {
  console.log(e.target);        // 可能是子元素
  console.log(e.currentTarget); // 始终是 parent
});

// ✅ 正确：根据需求选择
// 如果需要实际点击的元素 → e.target
// 如果需要绑定监听器的元素 → e.currentTarget

// ❌ 错误：在捕获阶段使用 stopPropagation 可能影响其他捕获监听器
parent.addEventListener('click', (e) => {
  e.stopPropagation(); // 会阻止后续捕获阶段和冒泡阶段
}, true);

// ✅ 正确：明确意图
// 如果只想阻止冒泡，在冒泡监听器中处理
```

---

### 8.3 事件委托

```javascript
// 利用事件冒泡，在父元素上处理子元素事件
document.querySelector("ul").addEventListener("click", (e) => {
  if (e.target.tagName === "LI") {
    console.log("Clicked:", e.target.textContent);
  }
});
```

---

## 9. ES6+ 新特性

### 9.1 let/const

```javascript
let mutable = 1;
const IMMUTABLE = 2;
```

### 9.2 解构赋值

```javascript
// 数组解构
const [a, b] = [1, 2];

// 对象解构
const { name, age } = { name: "Alice", age: 25 };

// 参数解构
function greet({ name, age }) {}
```

### 9.3 模板字符串

```javascript
const name = "Alice";
console.log(`Hello, ${name}!`);
```

### 9.4 默认参数

```javascript
function greet(name = "Guest") {
  return `Hello, ${name}!`;
}
```

### 9.5 展开运算符

```javascript
// 展开数组
const arr = [1, 2, ...[3, 4]];

// 展开对象
const obj = { ...{ a: 1 }, b: 2 };
```

### 9.6 模块化

```javascript
// 导出
export const foo = "bar";
export default function() {};

// 导入
import foo, { bar } from "./module.js";
```

### 9.7 可选链与空值合并

```javascript
// 可选链
const value = obj?.nested?.property;

// 空值合并
const name = user.name ?? "Guest";
```

---

## 10. 内存与性能

### 10.1 内存管理

**JavaScript 内存模型：**

```
┌─────────────────────────────────────────────────────────────────┐
│                    JavaScript 内存模型                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  栈内存（Stack）                                                │
│  ┌─────────────────────────────────────────┐                   │
│  │  - 存储基本类型（值类型）                │                   │
│  │    String, Number, Boolean, null,       │                   │
│  │    undefined, Symbol, BigInt            │                   │
│  │                                         │                   │
│  │  - 存储函数执行上下文                    │                   │
│  │  - 大小固定，分配快速                    │                   │
│  │  - 遵循 LIFO（后进先出）                 │                   │
│  └─────────────────────────────────────────┘                   │
│                                                                 │
│  堆内存（Heap）                                                 │
│  ┌─────────────────────────────────────────┐                   │
│  │  - 存储引用类型                          │                   │
│  │    Object, Array, Function, Date, etc.  │                   │
│  │                                         │                   │
│  │  - 大小不固定，动态分配                  │                   │
│  │  - 通过引用访问                          │                   │
│  │  - 由垃圾回收器管理                      │                   │
│  └─────────────────────────────────────────┘                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**栈内存 vs 堆内存：**

```javascript
// 栈内存：值类型直接存储
let a = 10;        // 栈中直接存储值 10
let b = 'hello';   // 栈中直接存储字符串
let c = true;      // 栈中直接存储布尔值

// 堆内存：引用类型存储引用
let obj = { name: 'Alice' };  // 栈中存储引用地址，堆中存储实际对象
let arr = [1, 2, 3];          // 栈中存储引用地址，堆中存储实际数组

// 赋值行为差异
let x = 10;
let y = x;       // 复制值，x 和 y 独立
y = 20;
console.log(x);  // 10（不受影响）

let obj1 = { name: 'Alice' };
let obj2 = obj1;  // 复制引用，obj1 和 obj2 指向同一对象
obj2.name = 'Bob';
console.log(obj1.name);  // 'Bob'（受影响）
```

---

### 10.2 垃圾回收机制（Garbage Collection）

**什么是垃圾回收？**

垃圾回收（GC）是 JavaScript 引擎自动管理内存的机制，它会定期找出并清理不再使用的对象，释放内存空间。

**标记 - 清除算法（Mark-and-Sweep）：**

```
现代浏览器使用的垃圾回收算法。

工作流程：

1. GC 从根对象（Roots）开始遍历
   - Roots: window, document, 全局变量，当前调用栈

2. 标记阶段（Mark）
   - 从 Roots 出发，递归遍历所有可到达的对象
   - 被访问到的对象标记为「存活」

3. 清除阶段（Sweep）
   - 遍历堆内存中的所有对象
   - 未被标记的对象视为「垃圾」
   - 回收垃圾对象占用的内存

4. 整理阶段（Compact，可选）
   - 整理内存碎片，提高分配效率
```

**标记 - 清除示意图：**

```
内存中的对象图：

      ┌─────────┐
      │  Root   │  ← GC 起点（全局对象、栈变量）
      └────┬────┘
           │
     ┌─────┴─────┐
     ↓           ↓
┌─────────┐  ┌─────────┐
│  Obj A  │  │  Obj B  │  ← 可达对象（标记为存活）
└────┬────┘  └─────────┘
     │
     ↓
┌─────────┐
│  Obj C  │  ← 可达对象（标记为存活）
└─────────┘

┌─────────┐
│  Obj X  │  ← 不可达对象（垃圾，将被清除）
└─────────┘

┌─────────┐
│  Obj Y  │  ← 不可达对象（垃圾，将被清除）
└─────────┘
```

**分代回收（Generational GC）：**

```
V8 引擎（Chrome、Node.js）使用分代回收策略：

新生代（Young Generation）
├─ 存储新创建的对象
├─ 对象死亡率极高
└─ 频繁进行小规模 GC（Minor GC）

老生代（Old Generation）
├─ 存储存活时间长的对象
├─ 从新生代晋升的对象
└─ 较少进行大规模 GC（Major GC）

优化效果：
- 大部分对象在创建后很快死亡 → 新生代快速回收
- 只有少量对象存活 → 减少老生代 GC 频率
```

---

### 10.3 内存泄漏常见场景

**1. 意外的全局变量：**

```javascript
// ❌ 错误：忘记声明变量
function foo() {
  bar = 'I am global!';  // 隐式全局变量
}

// ✅ 正确：始终使用声明关键字
function foo() {
  const bar = 'I am local!';
}

// 全局变量不会被 GC 回收（除非手动删除）
```

**2. 未清理的定时器：**

```javascript
// ❌ 错误：定时器未清理
function setup() {
  setInterval(() => {
    console.log('永远不会停止');
  }, 1000);
}

// ✅ 正确：组件卸载时清理
let timerId;
function setup() {
  timerId = setInterval(() => {
    console.log('定时任务');
  }, 1000);
}

function cleanup() {
  clearInterval(timerId);
}
```

**3. 闭包引用：**

```javascript
// ❌ 错误：闭包持有大对象引用
function createHandler() {
  const largeData = new Array(1000000).fill('data');
  return function() {
    console.log('handler');
    // 即使不使用 largeData，它也永远不会被回收
  };
}

// ✅ 正确：只闭包需要的数据
function createHandler() {
  const neededData = 'some text';
  return function() {
    console.log('handler', neededData);
  };
}
```

**4. 未移除的事件监听器：**

```javascript
// ❌ 错误：元素移除后监听器未清理
const button = document.querySelector('button');
button.addEventListener('click', handler);
button.remove();  // 监听器仍然存在，可能导致内存泄漏

// ✅ 正确：移除前清理监听器
const button = document.querySelector('button');
button.addEventListener('click', handler);
// ...
button.removeEventListener('click', handler);
button.remove();
```

**5. DOM 引用泄露：**

```javascript
// ❌ 错误：在全局存储 DOM 引用
const cachedElements = [];
function process() {
  const el = document.querySelector('.item');
  cachedElements.push(el);  // 即使元素被删除，引用仍存在
}

// ✅ 正确：使用 WeakMap 或及时清理
const cachedElements = new WeakMap();  // WeakMap 不会阻止 GC
```

---

### 10.4 性能优化

**1. 减少 DOM 操作：**

```javascript
// ❌ 错误：频繁操作 DOM
for (let i = 0; i < 100; i++) {
  const div = document.createElement('div');
  document.body.appendChild(div);  // 触发 100 次重排
}

// ✅ 正确：使用 DocumentFragment
const fragment = document.createDocumentFragment();
for (let i = 0; i < 100; i++) {
  const div = document.createElement('div');
  fragment.appendChild(div);
}
document.body.appendChild(fragment);  // 只触发 1 次重排
```

**2. 使用事件委托：**

```javascript
// ❌ 错误：每个子元素都绑定监听器
document.querySelectorAll('li').forEach(li => {
  li.addEventListener('click', handler);
});

// ✅ 正确：在父元素上委托
document.querySelector('ul').addEventListener('click', (e) => {
  if (e.target.tagName === 'LI') {
    handler(e);
  }
});
```

**3. 防抖（Debounce）：**

```javascript
// 防抖：n 秒后执行，n 秒内再次触发则重新计时
function debounce(fn, delay) {
  let timer = null;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

// 使用场景：搜索框输入、窗口 resize
const searchInput = document.querySelector('#search');
searchInput.addEventListener('input', debounce((e) => {
  fetch(`/api/search?q=${e.target.value}`);
}, 300));
```

**4. 节流（Throttle）：**

```javascript
// 节流：n 秒内只执行一次
function throttle(fn, delay) {
  let lastTime = 0;
  return function(...args) {
    const now = Date.now();
    if (now - lastTime >= delay) {
      lastTime = now;
      fn.apply(this, args);
    }
  };
}

// 使用场景：滚动加载、按钮点击
window.addEventListener('scroll', throttle(() => {
  loadMoreContent();
}, 200));
```

**5. 懒加载（Lazy Loading）：**

```javascript
// 图片懒加载
const images = document.querySelectorAll('img[data-src]');

const imageObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
      observer.unobserve(img);
    }
  });
});

images.forEach(img => imageObserver.observe(img));
```

---

## 附录：常用代码片段

### 深拷贝

```javascript
// JSON 方式（简单场景）
const copy = JSON.parse(JSON.stringify(obj));

// 递归方式（完整方案）
function deepClone(obj, hash = new WeakMap()) {
  if (obj === null || typeof obj !== "object") return obj;
  if (hash.has(obj)) return hash.get(obj);

  const clone = Array.isArray(obj) ? [] : {};
  hash.set(obj, clone);

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      clone[key] = deepClone(obj[key], hash);
    }
  }

  return clone;
}
```

### 防抖与节流

```javascript
// 防抖
function debounce(fn, delay) {
  let timer = null;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// 节流
function throttle(fn, delay) {
  let lastTime = 0;
  return function(...args) {
    const now = Date.now();
    if (now - lastTime >= delay) {
      fn.apply(this, args);
      lastTime = now;
    }
  };
}
```

---

*文档创建日期：2026-03-24*
