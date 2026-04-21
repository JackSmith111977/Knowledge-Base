# 灵神 LeetCode 题单学习指南

> 作者：灵茶山艾府（EndlessCheng）| 整理：Knowledge Base | 日期：2026-04-10
>
> 本文档整理了灵神在 LeetCode 中国发布的科学刷题体系，包含刷题路线、6 大核心题单完整题目列表与学习建议。
>
> **原始帖：**
> - [如何科学刷题？](https://leetcode.cn/discuss/post/3141566/) — 刷题方法论
> - [滑动窗口与双指针](https://leetcode.cn/circle/discuss/0viNMK/)
> - [二分算法](https://leetcode.cn/circle/discuss/SqopEo/)
> - [常用数据结构](https://leetcode.cn/circle/discuss/mOr1u6/)
> - [链表、二叉树与回溯](https://leetcode.cn/circle/discuss/K0n2gO/)
> - [网格图](https://leetcode.cn/circle/discuss/YiXPXW/)
> - [动态规划](https://leetcode.cn/circle/discuss/tXLS3i/)

---

## 1. 科学刷题路线

### 1.1 核心理念

> **按照专题刷题，而不是随机刷题。** 同一个专题，一个套路可以解决多个题目，刷题效率高。这能让你从不同的角度去观察、思考同一个算法，从而深刻地理解算法的本质。

### 1.2 新手村通关路线（7 步）

| 步骤 | 题单 | 必做内容 | 备注 |
|------|------|----------|------|
| 0 | 编程入门 | — | [「新」动计划](https://leetcode.cn/studyplan/primers-list/)，数据库题可跳过 |
| 1 | 滑动窗口 | 定长滑动窗口、不定长滑动窗口 | 完成难度分 ≤ 1700 的题目 |
| 2 | 二分算法 | 二分查找 | 二分答案选做，觉得困难可跳过 |
| 3 | 数据结构 | 常用枚举技巧、前缀和、栈、队列、堆 | 「新手村常用工具」 |
| 4 | 链表、树、回溯 | 二叉树 DFS | 理解递归，为动态规划做铺垫 |
| 5 | 网格图 | 网格图 DFS | 进一步理解递归 |
| 6 | 链表、树、回溯 | 回溯 | 进一步理解递归 |
| 7 | 动态规划 | 前六章 | 见下方详解 |

完成上表后，恭喜通关新手村，正式踏入算法世界！后续刷题顺序随意。

### 1.3 动态规划特别说明

> 动态规划是新人的一道坎，唯有坚持多练，**至少要做 100 道才算入门**。考虑到动态规划题单难度分 ≤ 1700 的题目并不多，可以扩大到难度分 ≤ 2000 的题目。

### 1.4 刷题要点

1. **螺旋上升式学习**：先完成难度分 ≤ 1700 的基础题，再刷更难的题目
2. **结合视频学习**：配合灵神的 [基础算法精讲](https://www.bilibili.com/video/BV13G411w7gW/) 学习
3. **推荐插件**：LeetCodeRating — 显示周赛难度分，可在题单中自动标记做过的题目
4. **难度分参考**：题目右侧的数字即为难度分，新手优先 ≤ 1700 的题目

### 1.5 数据范围与时间复杂度对照

| 数据范围 | 允许的时间复杂度 | 适用算法举例 |
|----------|-----------------|-------------|
| n ≤ 10 | O(n!) 或 O(C^n) | 回溯、暴力搜索 |
| n ≤ 20 | O(2^n) | 状态压缩 DP |
| n ≤ 40 | O(2^(n/2)) | 折半枚举 |
| n ≤ 100 | O(n³) | 三重循环的 DP、Floyd |
| n ≤ 1000 | O(n²) | 二重循环的 DP、背包 |
| n ≤ 10⁵ | O(n log n) | 各类算法都有 |
| n ≤ 10⁶ | O(n) | 线性 DP、滑动窗口 |
| n ≤ 10⁹ | O(√n) | 判断质数 |
| n ≤ 10¹⁸ | O(log n) 或 O(1) | 二分、快速幂、数学公式 |

### 1.6 做题没思路怎么办？

- **十分钟到数小时都可以**：如果看完题解觉得题解很妙，那就学到了一个自己不会的技巧
- **孵化效应**：换个时间段（早/中/晚/洗澡时）思考，大脑会在无意识中处理问题
- **跳过暂时不会的**：先完成难度分低于 1700 的题目，跳过暂时无法理解的题目
- **难度很大的题**：建议直接收藏，过段时间再来做

---

## 2. 完整题单目录

灵神的全部 12 个专题题单：

1. **滑动窗口与双指针** — 定长/不定长/单序列/双序列/三指针/分组循环
2. **二分算法** — 二分查找/二分答案/最小化最大值/最大化最小值/第 K 小
3. **单调栈** — 基础/矩形面积/贡献法/最小字典序
4. **网格图** — DFS/BFS/综合应用
5. **位运算** — 基础/性质/拆位/试填/恒等式/思维
6. **图论算法** — DFS/BFS/拓扑排序/基环树/最短路/最小生成树/网络流
7. **动态规划** — 入门/背包/划分/状态机/区间/状压/数位/数据结构优化/树形/博弈/概率期望
8. **常用数据结构** — 枚举技巧/前缀和/差分/栈/队列/堆/字典树/并查集/树状数组/线段树
9. **数学算法** — 数论/组合/概率期望/博弈/计算几何/随机算法
10. **贪心与思维** — 基本贪心策略/反悔/区间/字典序/数学/思维/脑筋急转弯/构造
11. **链表、树与回溯** — 前后指针/快慢指针/DFS/BFS/直径/LCA
12. **字符串** — KMP/Z 函数/Manacher/字符串哈希/AC 自动机/后缀数组/子序列自动机

> 以下收录灵神已发布的 6 个核心题单的完整题目列表。

---

## 3. 题单一：滑动窗口与双指针

### 一、定长滑动窗口

#### §1.1 基础

| 题号 | 题目名称 | 难度分 | 链接 |
|------|---------|--------|------|
| 643 | 子数组最大平均数 I | — | [链接](https://leetcode.cn/problems/maximum-average-subarray-i/) |
| 1100 | 长度为 K 的无重复字符子串 | 会员 | [链接](https://leetcode.cn/problems/find-k-length-substrings-with-no-repeated-characters/) |
| 1151 | 最少交换次数来组合所有的 1 | 会员 | [链接](https://leetcode.cn/problems/minimum-swaps-to-group-all-1s-together/) |
| 1176 | 健身计划评估 | — | [链接](https://leetcode.cn/problems/diet-plan-performance/) |
| 1343 | 大小为 K 且平均值大于等于阈值的子数组数目 | 1317 | [链接](https://leetcode.cn/problems/number-of-sub-arrays-of-size-k-and-average-greater-than-or-equal-to-threshold/) |
| 1423 | 可获得的最大点数 | 1574 | [链接](https://leetcode.cn/problems/maximum-points-you-can-obtain-from-cards/) |
| 1456 | 定长子串中元音的最大数目 | 1263 | [链接](https://leetcode.cn/problems/maximum-number-of-vowels-in-a-substring-of-given-length/) |
| 1852 | 每个子数组的数字种类数 | 会员 | [链接](https://leetcode.cn/problems/distinct-numbers-in-each-subarray/) |
| 2090 | 半径为 k 的子数组平均值 | 1358 | [链接](https://leetcode.cn/problems/k-radius-subarray-averages/) |
| 2107 | 分享 K 个糖果后独特口味的数量 | 会员 | [链接](https://leetcode.cn/problems/number-of-unique-flavors-after-sharing-k-candies/) |
| 2379 | 得到 K 个黑块的最少涂色次数 | 1360 | [链接](https://leetcode.cn/problems/minimum-recolors-to-get-k-consecutive-black-blocks/) |
| 2461 | 长度为 K 子数组中的最大和 | 1553 | [链接](https://leetcode.cn/problems/maximum-sum-of-distinct-subarrays-with-length-k/) |
| 2841 | 几乎唯一子数组的最大和 | 1546 | [链接](https://leetcode.cn/problems/maximum-sum-of-almost-unique-subarray/) |

#### §1.2 进阶（选做）

| 题号 | 题目名称 | 难度分 | 链接 |
|------|---------|--------|------|
| 30 | 串联所有单词的子串 | — | [链接](https://leetcode.cn/problems/substring-with-concatenation-of-all-words/) |
| 438 | 找到字符串中所有字母异位词 | — | [链接](https://leetcode.cn/problems/find-all-anagrams-in-a-string/) |
| 567 | 字符串的排列 | — | [链接](https://leetcode.cn/problems/permutation-in-string/) |
| 1016 | 子串能表示从 1 到 N 数字的二进制串 | 做到 O(|s|) | [链接](https://leetcode.cn/problems/binary-string-with-substrings-representing-1-to-n/) |
| 1052 | 爱生气的书店老板 | — | [链接](https://leetcode.cn/problems/grumpy-bookstore-owner/) |
| 1297 | 子串的最大出现次数 | 1748 | [链接](https://leetcode.cn/problems/maximum-number-of-occurrences-of-a-substring/) |
| 1652 | 拆炸弹 | 做到 O(n) | [链接](https://leetcode.cn/problems/defuse-the-bomb/) |
| 1888 | 使二进制字符串字符交替的最少反转次数 | 2006 | [链接](https://leetcode.cn/problems/minimum-number-of-flips-to-make-the-binary-string-alternating/) |
| 2067 | 等计数子串的数量 | 会员 | [链接](https://leetcode.cn/problems/number-of-equal-count-substrings/) |
| 2134 | 最少交换次数来组合所有的 1 II | 1748 | [链接](https://leetcode.cn/problems/minimum-swaps-to-group-all-1s-together-ii/) |
| 2156 | 查找给定哈希值的子串 | 2063 | [链接](https://leetcode.cn/problems/find-substring-with-given-hash-value/) |
| 2524 | 子数组的最大频率分数 | 会员 | [链接](https://leetcode.cn/problems/maximum-frequency-score-of-a-subarray/) |
| 2953 | 统计完全子字符串 | 2449 | [链接](https://leetcode.cn/problems/count-complete-substrings/) |
| 3439 | 重新安排会议得到最多空余时间 I | 1729 | [链接](https://leetcode.cn/problems/reschedule-meetings-for-maximum-free-time-i/) |
| 3652 | 按策略买卖股票的最佳时机 | — | [链接](https://leetcode.cn/problems/best-time-to-buy-and-sell-stock-using-strategy/) |
| 3672 | 子数组中加权众数的总和 | 会员 | [链接](https://leetcode.cn/problems/sum-of-weighted-modes-in-subarrays/) |
| 3679 | 使库存平衡的最少丢弃次数 | 1639 | [链接](https://leetcode.cn/problems/minimum-discards-to-balance-inventory/) |
| 3694 | 删除子字符串后不同的终点 | 1739 | [链接](https://leetcode.cn/problems/distinct-points-reachable-after-substring-removal/) |

#### §1.3 其他（选做）

| 题号 | 题目名称 | 难度分 | 链接 |
|------|---------|--------|------|
| 220 | 存在重复元素 III | — | [链接](https://leetcode.cn/problems/contains-duplicate-iii/) |
| 2269 | 找到一个数字的 K 美丽值 | 1280 | [链接](https://leetcode.cn/problems/find-the-k-beauty-of-a-number/) |
| 2653 | 滑动子数组的美丽值 | 1786 | [链接](https://leetcode.cn/problems/sliding-subarray-beauty/) |
| 1461 | 检查一个字符串是否包含所有长度为 K 的二进制子串 | 1504 | [链接](https://leetcode.cn/problems/check-if-a-string-contains-all-binary-codes-of-size-k/) |
| 2200 | 找出数组中的所有 K 近邻下标 | 1266 | [链接](https://leetcode.cn/problems/find-all-k-distant-indices-in-an-array/) |

### 二、不定长滑动窗口

> 不定长滑动窗口主要分为三类：**求最长子数组**、**求最短子数组**、**求子数组个数**。
>
> 滑动窗口相当于在维护一个队列。右指针的移动可以视作入队，左指针的移动可以视作出队。

#### §2.1 越短越合法 / 求最长/最大

##### §2.1.1 基础

| 题号 | 题目名称 | 难度分 | 链接 |
|------|---------|--------|------|
| 3 | 无重复字符的最长子串 | — | [链接](https://leetcode.cn/problems/longest-substring-without-repeating-characters/) |
| 904 | 水果成篮 | 1516 | [链接](https://leetcode.cn/problems/fruit-into-baskets/) |
| 1004 | 最大连续 1 的个数 III | 1656 | [链接](https://leetcode.cn/problems/max-consecutive-ones-iii/) |
| 1208 | 尽可能使字符串相等 | 1497 | [链接](https://leetcode.cn/problems/get-equal-substrings-within-budget/) |
| 1493 | 删掉一个元素以后全为 1 的最长子数组 | 1423 | [链接](https://leetcode.cn/problems/longest-subarray-of-1s-after-deleting-one-element/) |
| 1695 | 删除子数组的最大得分 | 1529 | [链接](https://leetcode.cn/problems/maximum-erasure-value/) |
| 2024 | 考试的最大困扰度 | 1643 | [链接](https://leetcode.cn/problems/maximize-the-confusion-of-an-exam/) |
| 2958 | 最多 K 个重复元素的最长子数组 | 1535 | [链接](https://leetcode.cn/problems/length-of-longest-subarray-with-at-most-k-frequency/) |
| 3090 | 每个字符最多出现两次的最长子字符串 | 1329 | [链接](https://leetcode.cn/problems/maximum-length-substring-with-two-occurrences/) |
| 3634 | 使数组平衡的最少移除数目 | 1453 | [链接](https://leetcode.cn/problems/minimum-removals-to-balance-array/) |
| 3641 | 最长半重复子数组 | 会员 | [链接](https://leetcode.cn/problems/longest-semi-repeating-subarray/) |

##### §2.1.2 进阶（选做）

| 题号 | 题目名称 | 难度分 | 链接 |
|------|---------|--------|------|
| 395 | 至少有 K 个重复字符的最长子串 | — | [链接](https://leetcode.cn/problems/longest-substring-with-at-least-k-repeating-characters/) |
| 1040 | 移动石子直到连续 II | 2456 | [链接](https://leetcode.cn/problems/moving-stones-until-consecutive-ii/) |
| 1610 | 可见点的最大数目 | 2147 | [链接](https://leetcode.cn/problems/maximum-number-of-visible-points/) |
| 1658 | 将 x 减到 0 的最小操作数 | 1817 | [链接](https://leetcode.cn/problems/minimum-operations-to-reduce-x-to-zero/) |
| 1763 | 最长的美好子字符串 | 非暴力 | [链接](https://leetcode.cn/problems/longest-nice-substring/) |
| 1838 | 最高频元素的频数 | 1876 | [链接](https://leetcode.cn/problems/frequency-of-the-most-frequent-element/) |
| 2009 | 使数组连续的最少操作数 | 2084 | [链接](https://leetcode.cn/problems/minimum-number-of-operations-to-make-array-continuous/) |
| 2106 | 摘水果 | 2062 | [链接](https://leetcode.cn/problems/maximum-fruits-harvested-after-at-most-k-steps/) |
| 2271 | 毯子覆盖的最多白色砖块数 | 2022 | [链接](https://leetcode.cn/problems/maximum-white-tiles-covered-by-a-carpet/) |
| 2516 | 每种字符至少取 K 个 | 1948 | [链接](https://leetcode.cn/problems/take-k-of-each-character-from-left-and-right/) |
| 2555 | 两个线段获得的最多奖品 | 2081 | [链接](https://leetcode.cn/problems/maximize-win-from-two-segments/) |
| 2730 | 找到最长的半重复子字符串 | 非暴力 | [链接](https://leetcode.cn/problems/find-the-longest-semi-repetitive-substring/) |
| 2779 | 数组的最大美丽值 | 1638 | [链接](https://leetcode.cn/problems/maximum-beauty-of-an-array-after-applying-operation/) |
| 2781 | 最长合法子字符串的长度 | 2204 | [链接](https://leetcode.cn/problems/length-of-the-longest-valid-substring/) |
| 2831 | 找出最长等值子数组 | 1976 | [链接](https://leetcode.cn/problems/find-the-longest-equal-subarray/) |
| 2968 | 执行操作使频率分数最大 | 2444 | [链接](https://leetcode.cn/problems/apply-operations-to-maximize-frequency-score/) |
| 3411 | 最长乘积等价子数组 | ~2300 | [链接](https://leetcode.cn/problems/maximum-subarray-with-equal-products/) |
| 3413 | 收集连续 K 个袋子可以获得的最多硬币数量 | 2374 | [链接](https://leetcode.cn/problems/maximum-coins-from-k-consecutive-bags/) |

#### §2.2 越长越合法 / 求最短/最小

| 题号 | 题目名称 | 难度分 | 链接 |
|------|---------|--------|------|
| 76 | 最小覆盖子串 | — | [链接](https://leetcode.cn/problems/minimum-window-substring/) |
| 209 | 长度最小的子数组 | — | [链接](https://leetcode.cn/problems/minimum-size-subarray-sum/) |
| 632 | 最小区间 | 做法不止一种 | [链接](https://leetcode.cn/problems/smallest-range-covering-elements-from-k-lists/) |
| 1234 | 替换子串得到平衡字符串 | 1878 | [链接](https://leetcode.cn/problems/replace-the-substring-for-balanced-string/) |
| 2875 | 无限数组的最短子数组 | 1914 | [链接](https://leetcode.cn/problems/minimum-size-subarray-in-infinite-array/) |
| 2904 | 最短且字典序最小的美丽子字符串 | 做到 O(n²) | [链接](https://leetcode.cn/problems/shortest-and-lexicographically-smallest-beautiful-string/) |
| 3795 | 不同元素和至少为 K 的最短子数组长度 | 1505 | [链接](https://leetcode.cn/problems/minimum-subarray-length-with-distinct-sum-at-least-k/) |

#### §2.3 求子数组个数

##### §2.3.1 越短越合法（`ans += right - left + 1`）

> 内层循环结束后，[left, right] 满足要求，且所有更短的子数组 [left+1,right], ..., [right,right] 也都满足。

| 题号 | 题目名称 | 难度分 | 链接 |
|------|---------|--------|------|
| 713 | 乘积小于 K 的子数组 | — | [链接](https://leetcode.cn/problems/subarray-product-less-than-k/) |
| 2302 | 统计得分小于 K 的子数组数目 | 1808 | [链接](https://leetcode.cn/problems/count-subarrays-with-score-less-than-k/) |
| 2743 | 计算没有重复字符的子字符串数量 | 会员 | [链接](https://leetcode.cn/problems/count-substrings-without-repeating-character/) |
| 2762 | 不间断子数组 | 1940 | [链接](https://leetcode.cn/problems/continuous-subarrays/) |
| 3258 | 统计满足 K 约束的子字符串数量 I | 做到 O(n) | [链接](https://leetcode.cn/problems/count-substrings-that-satisfy-k-constraint-i/) |
| LCP 68 | 美观的花束 | — | [链接](https://leetcode.cn/problems/1GxJYY/) |

**思维扩展（选做）**

| 题号 | 题目名称 | 难度分 | 链接 |
|------|---------|--------|------|
| 3134 | 找出唯一性数组的中位数 | 2451 | [链接](https://leetcode.cn/problems/find-the-median-of-the-uniqueness-array/) |
| 3261 | 统计满足 K 约束的子字符串数量 II | 2659 | [链接](https://leetcode.cn/problems/count-substrings-that-satisfy-k-constraint-ii/) |

##### §2.3.2 越长越合法（`ans += left`）

> 关注 left-1 的合法性，而非 left。左端点在 0,1,...,left-1 的所有子数组都满足要求。

| 题号 | 题目名称 | 难度分 | 链接 |
|------|---------|--------|------|
| 1358 | 包含所有三种字符的子字符串数目 | 1646 | [链接](https://leetcode.cn/problems/number-of-substrings-containing-all-three-characters/) |
| 2495 | 乘积为偶数的子数组数 | 会员 | [链接](https://leetcode.cn/problems/number-of-subarrays-having-even-product/) |
| 2537 | 统计好子数组的数目 | 1892 | [链接](https://leetcode.cn/problems/count-the-number-of-good-subarrays/) |
| 2799 | 统计完全子数组的数目 | 做到 O(n) | [链接](https://leetcode.cn/problems/count-complete-subarrays-in-an-array/) |
| 2962 | 统计最大元素出现至少 K 次的子数组 | 1701 | [链接](https://leetcode.cn/problems/count-subarrays-where-max-element-appears-at-least-k-times/) |
| 3298 | 统计重新排列后包含另一个字符串的子字符串数目 II | 1909 | [链接](https://leetcode.cn/problems/count-substrings-that-can-be-rearranged-to-contain-a-string-ii/) |
| 3325 | 字符至少出现 K 次的子字符串 I | 做到 O(n) | [链接](https://leetcode.cn/problems/count-substrings-with-k-frequency-characters-i/) |

##### §2.3.3 恰好型滑动窗口

> "恰好" = 两个"至少"之差。例如：元素和恰好等于 k = (≥k 的个数) - (≥k+1 的个数)。也可拆成两个"至多"。

| 题号 | 题目名称 | 难度分 | 链接 |
|------|---------|--------|------|
| 930 | 和相同的二元子数组 | 1592 | [链接](https://leetcode.cn/problems/binary-subarrays-with-sum/) |
| 992 | K 个不同整数的子数组 | 2210 | [链接](https://leetcode.cn/problems/subarrays-with-k-different-integers/) |
| 1248 | 统计「优美子数组」 | 1624 | [链接](https://leetcode.cn/problems/count-number-of-nice-subarrays/) |
| 3306 | 元音辅音字符串计数 II | 2200 | [链接](https://leetcode.cn/problems/count-of-substrings-containing-every-vowel-and-k-consonants-ii/) |

#### §2.4 其他（选做）

| 题号 | 题目名称 | 难度分 | 链接 |
|------|---------|--------|------|
| 424 | 替换后的最长重复字符 | — | [链接](https://leetcode.cn/problems/longest-repeating-character-replacement/) |
| 438 | 找到字符串中所有字母异位词 | 有定长/不定长两种写法 | [链接](https://leetcode.cn/problems/find-all-anagrams-in-a-string/) |
| 825 | 适龄的朋友 | 1697 | [链接](https://leetcode.cn/problems/friends-of-appropriate-ages/) |
| 1712 | 将数组分成三个子数组的方案数 | 2079 | [链接](https://leetcode.cn/problems/ways-to-split-array-into-three-subarrays/) |
| 1918 | 第 K 小的子数组和 | 会员 | [链接](https://leetcode.cn/problems/kth-smallest-subarray-sum/) |
| 2401 | 最长优雅子数组 | 1750 | [链接](https://leetcode.cn/problems/longest-nice-subarray/) |
| LCR 180 | 文件组合 | — | [链接](https://leetcode.cn/problems/he-wei-sde-lian-xu-zheng-shu-xu-lie-lcof/) |

### 三、单序列双指针

#### §3.1 反转字符串（相向双指针）

| 题号 | 题目名称 | 难度分 | 链接 |
|------|---------|--------|------|
| 344 | 反转字符串 | — | [链接](https://leetcode.cn/problems/reverse-string/) |
| 345 | 反转字符串中的元音字母 | — | [链接](https://leetcode.cn/problems/reverse-vowels-of-a-string/) |
| 3794 | 反转字符串前缀 | — | [链接](https://leetcode.cn/problems/reverse-string-prefix/) |
| 2000 | 反转单词前缀 | 1199 | [链接](https://leetcode.cn/problems/reverse-prefix-of-word/) |
| 3823 | 反转一个字符串里的字母后反转特殊字符 | 1250 | [链接](https://leetcode.cn/problems/reverse-letters-then-special-characters-in-a-string/) |
| 541 | 反转字符串 II | — | [链接](https://leetcode.cn/problems/reverse-string-ii/) |
| 557 | 反转字符串中的单词 III | — | [链接](https://leetcode.cn/problems/reverse-words-in-a-string-iii/) |
| 832 | 翻转图像 | 1243 | [链接](https://leetcode.cn/problems/flipping-an-image/) |
| 917 | 仅仅反转字母 | — | [链接](https://leetcode.cn/problems/reverse-only-letters/) |
| 151 | 反转字符串中的单词 | — | [链接](https://leetcode.cn/problems/reverse-words-in-a-string/) |
| 186 | 反转字符串中的单词 II | 会员 | [链接](https://leetcode.cn/problems/reverse-words-in-a-string-ii/) |
| 3643 | 垂直翻转子矩阵 | 1235 | [链接](https://leetcode.cn/problems/flip-square-submatrix-vertically/) |
| 3775 | 反转元音数相同的单词 | 1392 | [链接](https://leetcode.cn/problems/reverse-words-with-same-vowel-count/) |

#### §3.2 相向双指针

> 两个指针 left=0, right=n-1，从数组两端向中间移动。

| 题号 | 题目名称 | 难度分 | 链接 |
|------|---------|--------|------|
| 11 | 盛最多水的容器 | — | [链接](https://leetcode.cn/problems/container-with-most-water/) |
| 15 | 三数之和 | — | [链接](https://leetcode.cn/problems/3sum/) |
| 16 | 最接近的三数之和 | — | [链接](https://leetcode.cn/problems/3sum-closest/) |
| 18 | 四数之和 | — | [链接](https://leetcode.cn/problems/4sum/) |
| 42 | 接雨水 | — | [链接](https://leetcode.cn/problems/trapping-rain-water/) |
| 125 | 验证回文串 | — | [链接](https://leetcode.cn/problems/valid-palindrome/) |
| 167 | 两数之和 II - 输入有序数组 | — | [链接](https://leetcode.cn/problems/two-sum-ii-input-array-is-sorted/) |
| 611 | 有效三角形的个数 | — | [链接](https://leetcode.cn/problems/valid-triangle-number/) |
| 633 | 平方数之和 | — | [链接](https://leetcode.cn/problems/sum-of-square-numbers/) |
| 658 | 找到 K 个最接近的元素 | — | [链接](https://leetcode.cn/problems/find-k-closest-elements/) |
| 923 | 三数之和的多种可能 | 1711 | [链接](https://leetcode.cn/problems/3sum-with-multiplicity/) |
| 948 | 令牌放置 | 1762 | [链接](https://leetcode.cn/problems/bag-of-tokens/) |
| 977 | 有序数组的平方 | 做到 O(n) | [链接](https://leetcode.cn/problems/squares-of-a-sorted-array/) |
| 1471 | 数组中的 K 个最强值 | 用双指针 | [链接](https://leetcode.cn/problems/the-k-strongest-values-in-an-array/) |
| 1498 | 满足条件的子序列数目 | 2276 | [链接](https://leetcode.cn/problems/number-of-subsequences-that-satisfy-the-given-sum-condition/) |
| 1577 | 数的平方等于两数乘积的方法数 | 用双指针 | [链接](https://leetcode.cn/problems/number-of-ways-where-square-of-number-is-equal-to-product-of-two-numbers/) |
| 1616 | 分割两个字符串得到回文串 | 1868 | [链接](https://leetcode.cn/problems/split-two-strings-to-make-palindrome/) |
| 1750 | 删除字符串两端相同字符后的最短长度 | 1502 | [链接](https://leetcode.cn/problems/minimum-length-of-string-after-deleting-similar-ends/) |
| 1782 | 统计点对的数目 | 2457 | [链接](https://leetcode.cn/problems/count-pairs-of-nodes/) |
| 2105 | 给植物浇水 II | 1507 | [链接](https://leetcode.cn/problems/watering-plants-ii/) |
| 2563 | 统计公平数对的数目 | — | [链接](https://leetcode.cn/problems/count-the-number-of-fair-pairs/) |
| 2697 | 字典序最小回文串 | 1304 | [链接](https://leetcode.cn/problems/lexicographically-smallest-palindrome/) |
| 2824 | 统计和小于目标的下标对数目 | — | [链接](https://leetcode.cn/problems/count-pairs-whose-sum-is-less-than-target/) |
| 360 | 有序转化数组 | 会员 | [链接](https://leetcode.cn/problems/sort-transformed-array/) |
| LCP 28 | 采购方案 | 同 2824 | [链接](https://leetcode.cn/problems/4xy4Wx/) |

#### §3.3 同向双指针

| 题号 | 题目名称 | 难度分 | 链接 |
|------|---------|--------|------|
| 581 | 最短无序连续子数组 | — | [链接](https://leetcode.cn/problems/shortest-unsorted-continuous-subarray/) |
| 1574 | 删除最短的子数组使剩余数组有序 | — | [链接](https://leetcode.cn/problems/shortest-subarray-to-be-removed-to-make-array-sorted/) |
| 1989 | 捉迷藏中可捕获的最大人数 | — | [链接](https://leetcode.cn/problems/maximum-number-of-people-that-can-be-caught-in-tag/) |
| 2122 | 还原原数组 | — | [链接](https://leetcode.cn/problems/recover-the-original-array/) |
| 2200 | 找出数组中的所有 K 近邻下标 | — | [链接](https://leetcode.cn/problems/find-all-k-distant-indices-in-an-array/) |
| 2234 | 花园的最大总美丽值 | — | [链接](https://leetcode.cn/problems/maximum-total-beauty-of-the-gardens/) |
| 2972 | 统计移除递增子数组的数目 II | — | [链接](https://leetcode.cn/problems/count-the-number-of-incremovable-subarrays-ii/) |
| 3323 | 通过插入区间最小化连通组 | — | [链接](https://leetcode.cn/problems/minimize-connected-groups-by-inserting-interval/) |
| 3649 | 完美对的数目 | — | [链接](https://leetcode.cn/problems/number-of-perfect-pairs/) |

#### §3.4 背向双指针

| 题号 | 题目名称 | 难度分 | 链接 |
|------|---------|--------|------|
| 976 | 三角形的最大周长 | — | [链接](https://leetcode.cn/problems/largest-perimeter-triangle/) |
| 1793 | 好子数组的最大分数 | — | [链接](https://leetcode.cn/problems/maximum-score-of-a-good-subarray/) |

#### §3.5 原地修改

| 题号 | 题目名称 | 难度分 | 链接 |
|------|---------|--------|------|
| 26 | 删除有序数组中的重复项 | — | [链接](https://leetcode.cn/problems/remove-duplicates-from-sorted-array/) |
| 27 | 移除元素 | — | [链接](https://leetcode.cn/problems/remove-element/) |
| 41 | 缺失的第一个正数 | — | [链接](https://leetcode.cn/problems/first-missing-positive/) |
| 75 | 颜色分类 | — | [链接](https://leetcode.cn/problems/sort-colors/) |
| 80 | 删除有序数组中的重复项 II | — | [链接](https://leetcode.cn/problems/remove-duplicates-from-sorted-array-ii/) |
| 283 | 移动零 | — | [链接](https://leetcode.cn/problems/move-zeroes/) |
| 442 | 数组中重复的数据 | — | [链接](https://leetcode.cn/problems/find-all-duplicates-in-an-array/) |
| 448 | 找到所有数组中消失的数字 | — | [链接](https://leetcode.cn/problems/find-all-numbers-disappeared-in-an-array/) |
| 905 | 按奇偶排序数组 | — | [链接](https://leetcode.cn/problems/sort-array-by-parity/) |
| 922 | 按奇偶排序数组 II | — | [链接](https://leetcode.cn/problems/sort-array-by-parity-ii/) |
| 1089 | 复写零 | — | [链接](https://leetcode.cn/problems/duplicate-zeros/) |
| 1920 | 基于排列构建数组 | — | [链接](https://leetcode.cn/problems/build-array-from-permutation/) |
| 2273 | 移除字母异位词后的结果数组 | — | [链接](https://leetcode.cn/problems/find-resultant-array-after-removing-anagrams/) |
| 2460 | 对数组执行操作 | — | [链接](https://leetcode.cn/problems/apply-operations-to-an-array/) |
| 2784 | 检查数组是否是好的 | — | [链接](https://leetcode.cn/problems/check-if-array-is-good/) |
| 3467 | 将数组按照奇偶性转化 | — | [链接](https://leetcode.cn/problems/transform-array-by-parity/) |
| 3684 | 至多 K 个不同元素的最大和 | — | [链接](https://leetcode.cn/problems/maximize-sum-of-at-most-k-distinct-elements/) |

#### §3.6 矩阵上的双指针

| 题号 | 题目名称 | 难度分 | 链接 |
|------|---------|--------|------|
| 240 | 搜索二维矩阵 II | — | [链接](https://leetcode.cn/problems/search-a-2d-matrix-ii/) |
| 1351 | 统计有序矩阵中的负数 | — | [链接](https://leetcode.cn/problems/count-negative-numbers-in-a-sorted-matrix/) |

### 四、双序列双指针

#### §4.1 双指针

| 题号 | 题目名称 | 难度分 | 链接 |
|------|---------|--------|------|
| 88 | 合并两个有序数组 | — | [链接](https://leetcode.cn/problems/merge-sorted-array/) |
| 350 | 两个数组的交集 II | — | [链接](https://leetcode.cn/problems/intersection-of-two-arrays-ii/) |
| 844 | 比较含退格的字符串 | — | [链接](https://leetcode.cn/problems/backspace-string-compare/) |
| 925 | 长按键入 | — | [链接](https://leetcode.cn/problems/long-pressed-name/) |
| 986 | 区间列表的交集 | — | [链接](https://leetcode.cn/problems/interval-list-intersections/) |
| 1385 | 两个数组间的距离值 | 1235 | [链接](https://leetcode.cn/problems/find-the-distance-value-between-two-arrays/) |
| 1537 | 最大得分 | — | [链接](https://leetcode.cn/problems/get-the-maximum-score/) |
| 1570 | 两个稀疏向量的点积 | — | [链接](https://leetcode.cn/problems/dot-product-of-two-sparse-vectors/) |
| 1855 | 下标对中的最大距离 | — | [链接](https://leetcode.cn/problems/maximum-distance-between-a-pair-of-values/) |
| 1868 | 两个行程编码数组的积 | — | [链接](https://leetcode.cn/problems/product-of-two-run-length-encoded-arrays/) |
| 2109 | 向字符串添加空格 | — | [链接](https://leetcode.cn/problems/adding-spaces-to-a-string/) |
| 2337 | 移动片段得到字符串 | — | [链接](https://leetcode.cn/problems/move-pieces-to-obtain-a-string/) |
| 2486 | 追加字符以获得子序列 | — | [链接](https://leetcode.cn/problems/append-characters-to-string-to-make-subsequence/) |
| 2540 | 最小公共值 | — | [链接](https://leetcode.cn/problems/minimum-common-value/) |
| 2570 | 合并两个二维数组 - 求和法 | — | [链接](https://leetcode.cn/problems/merge-two-2d-arrays-by-summing-values/) |
| 2825 | 循环增长使字符串子序列等于另一个字符串 | — | [链接](https://leetcode.cn/problems/make-string-a-subsequence-using-cyclic-increments/) |
| 2838 | 英雄可以获得的最大金币数 | — | [链接](https://leetcode.cn/problems/maximum-coins-heroes-can-collect/) |

#### §4.2 判断子序列

| 题号 | 题目名称 | 难度分 | 链接 |
|------|---------|--------|------|
| 392 | 判断子序列 | — | [链接](https://leetcode.cn/problems/is-subsequence/) |
| 522 | 最长特殊序列 II | — | [链接](https://leetcode.cn/problems/longest-uncommon-subsequence-ii/) |
| 524 | 通过删除字母匹配到字典里最长单词 | — | [链接](https://leetcode.cn/problems/longest-word-in-dictionary-through-deleting/) |
| 1023 | 驼峰式匹配 | — | [链接](https://leetcode.cn/problems/camelcase-matching/) |
| 1826 | 有缺陷的传感器 | — | [链接](https://leetcode.cn/problems/faulty-sensor/) |
| 1898 | 可移除字符的最大数目 | — | [链接](https://leetcode.cn/problems/maximum-number-of-removable-characters/) |
| 2565 | 最少得分子序列 | — | [链接](https://leetcode.cn/problems/subsequence-with-the-minimum-score/) |
| 3132 | 找出与数组相加的整数 II | — | [链接](https://leetcode.cn/problems/find-the-integer-added-to-array-ii/) |
| 3302 | 字典序最小的合法序列 | — | [链接](https://leetcode.cn/problems/find-the-lexicographically-smallest-valid-sequence/) |

### 五、三指针

| 题号 | 题目名称 | 难度分 | 链接 |
|------|---------|--------|------|
| 795 | 区间子数组个数 | — | [链接](https://leetcode.cn/problems/number-of-subarrays-with-bounded-maximum/) |
| 1213 | 三个有序数组的交集 | — | [链接](https://leetcode.cn/problems/intersection-of-three-sorted-arrays/) |
| 2367 | 等差三元组的数目 | — | [链接](https://leetcode.cn/problems/number-of-arithmetic-triplets/) |
| 2444 | 统计定界子数组的数目 | — | [链接](https://leetcode.cn/problems/count-subarrays-with-fixed-bounds/) |
| 2563 | 统计公平数对的数目 | — | [链接](https://leetcode.cn/problems/count-the-number-of-fair-pairs/) |
| 3347 | 执行操作后元素的最高频率 II | — | [链接](https://leetcode.cn/problems/maximum-frequency-of-an-element-after-performing-operations-ii/) |

### 六、分组循环

| 题号 | 题目名称 | 难度分 | 链接 |
|------|---------|--------|------|
| 228 | 汇总区间 | — | [链接](https://leetcode.cn/problems/summary-ranges/) |
| 413 | 等差数列划分 | — | [链接](https://leetcode.cn/problems/arithmetic-slices/) |
| 467 | 环绕字符串中唯一的子字符串 | — | [链接](https://leetcode.cn/problems/unique-substrings-in-wraparound-string/) |
| 485 | 最大连续 1 的个数 | — | [链接](https://leetcode.cn/problems/max-consecutive-ones/) |
| 674 | 最长连续递增序列 | — | [链接](https://leetcode.cn/problems/longest-continuous-increasing-subsequence/) |
| 696 | 计数二进制子串 | — | [链接](https://leetcode.cn/problems/count-binary-substrings/) |
| 838 | 推多米诺 | — | [链接](https://leetcode.cn/problems/push-dominoes/) |
| 845 | 数组中的最长山脉 | — | [链接](https://leetcode.cn/problems/longest-mountain-in-array/) |
| 978 | 最长湍流子数组 | — | [链接](https://leetcode.cn/problems/longest-turbulent-subarray/) |
| 135 | 分发糖果 | — | [链接](https://leetcode.cn/problems/candy/) |
| 1446 | 连续字符 | — | [链接](https://leetcode.cn/problems/consecutive-characters/) |
| 1513 | 仅含 1 的子串数 | — | [链接](https://leetcode.cn/problems/number-of-substrings-with-only-1s/) |
| 1578 | 使绳子变成彩色的最短时间 | — | [链接](https://leetcode.cn/problems/minimum-time-to-make-rope-colorful/) |
| 1759 | 统计同质子字符串的数目 | — | [链接](https://leetcode.cn/problems/count-number-of-homogenous-substrings/) |
| 1839 | 所有元音按顺序排布的最长子字符串 | — | [链接](https://leetcode.cn/problems/longest-substring-of-all-vowels-in-order/) |
| 1869 | 哪种连续子字符串更长 | — | [链接](https://leetcode.cn/problems/longer-contiguous-segments-of-ones-than-zeros/) |
| 1887 | 使数组元素相等的减少操作次数 | — | [链接](https://leetcode.cn/problems/reduction-operations-to-make-the-array-elements-equal/) |
| 1957 | 删除字符使字符串变好 | — | [链接](https://leetcode.cn/problems/delete-characters-to-make-fancy-string/) |
| 2038 | 如果相邻两个颜色均相同则删除当前颜色 | — | [链接](https://leetcode.cn/problems/remove-colored-pieces-if-both-neighbors-are-the-same-color/) |
| 2110 | 股票平滑下跌阶段的数目 | — | [链接](https://leetcode.cn/problems/number-of-smooth-descent-periods-of-a-stock/) |
| 2147 | 分隔长廊的方案数 | — | [链接](https://leetcode.cn/problems/number-of-ways-to-divide-a-long-corridor/) |
| 2273 | 移除字母异位词后的结果数组 | — | [链接](https://leetcode.cn/problems/find-resultant-array-after-removing-anagrams/) |
| 2348 | 全 0 子数组的数目 | — | [链接](https://leetcode.cn/problems/number-of-zero-filled-subarrays/) |
| 2414 | 最长的字母序连续子字符串的长度 | — | [链接](https://leetcode.cn/problems/length-of-the-longest-alphabetical-continuous-substring/) |
| 2436 | 使子数组最大公约数大于一的最小分割数 | — | [链接](https://leetcode.cn/problems/minimum-split-into-subarrays-with-gcd-greater-than-one/) |
| 2495 | 乘积为偶数的子数组数 | — | [链接](https://leetcode.cn/problems/number-of-subarrays-having-even-product/) |
| 2593 | 标记所有元素后数组的分数 | — | [链接](https://leetcode.cn/problems/find-score-of-an-array-after-marking-all-elements/) |
| 2653 | 滑动子数组的美丽值 | — | [链接](https://leetcode.cn/problems/sliding-subarray-beauty/) |
| 2760 | 最长奇偶子数组 | — | [链接](https://leetcode.cn/problems/longest-even-odd-subarray-with-threshold/) |
| 2765 | 最长交替子数组 | — | [链接](https://leetcode.cn/problems/longest-alternating-subarray/) |
| 2900 | 最长相邻不相等子序列 I | — | [链接](https://leetcode.cn/problems/longest-unequal-adjacent-groups-subsequence-i/) |
| 2948 | 交换得到字典序最小的数组 | — | [链接](https://leetcode.cn/problems/make-lexicographically-smallest-array-by-swapping-elements/) |
| 3011 | 判断一个数组是否可以变为有序 | — | [链接](https://leetcode.cn/problems/find-if-array-can-be-sorted/) |
| 3063 | 链表频率 | — | [链接](https://leetcode.cn/problems/linked-list-frequency/) |
| 3105 | 最长的严格递增或递减子数组 | — | [链接](https://leetcode.cn/problems/longest-strictly-increasing-or-strictly-decreasing-subarray/) |
| 3255 | 长度为 K 的子数组的能量值 II | — | [链接](https://leetcode.cn/problems/find-the-power-of-k-size-subarrays-ii/) |
| 3350 | 检测相邻递增子数组 II | — | [链接](https://leetcode.cn/problems/adjacent-increasing-subarrays-detection-ii/) |
| 3456 | 找出长度为 K 的特殊子字符串 | — | [链接](https://leetcode.cn/problems/find-special-substring-of-length-k/) |
| 3499 | 操作后最大活跃区段数 I | — | [链接](https://leetcode.cn/problems/maximize-active-section-with-trade-i/) |
| 3640 | 三段式数组 II | — | [链接](https://leetcode.cn/problems/trionic-array-ii/) |
| 3693 | 爬楼梯 II | — | [链接](https://leetcode.cn/problems/climbing-stairs-ii/) |
| 3708 | 最长斐波那契子数组 | — | [链接](https://leetcode.cn/problems/longest-fibonacci-subarray/) |
| 3773 | 最大等长连续字符组 | — | [链接](https://leetcode.cn/problems/maximum-number-of-equal-length-runs/) |

---

## 4. 题单二：二分算法

> **刷题建议**：初次刷题可以只刷难度低于 1700 分的题目。难度更高的题目常常结合其他算法（数据结构、图论等），等学会其他算法再来刷本题单。

### 一、二分查找

> 灵神推荐：红蓝染色法理解二分。[视频讲解](https://www.bilibili.com/video/BV1vG411y7YN/)

#### 常用转化

| 需求 | 写法 | 如果不存在 |
|------|------|-----------|
| ≥x 的第一个元素的下标 | `lowerBound(nums, x)` | 结果为 n |
| >x 的第一个元素的下标 | `lowerBound(nums, x+1)` | 结果为 n |
| <x 的最后一个元素的下标 | `lowerBound(nums, x) - 1` | 结果为 -1 |
| ≤x 的最后一个元素的下标 | `lowerBound(nums, x+1) - 1` | 结果为 -1 |

| 需求 | 写法 |
|------|------|
| <x 的元素个数 | `lowerBound(nums, x)` |
| ≤x 的元素个数 | `lowerBound(nums, x+1)` |
| ≥x 的元素个数 | `n - lowerBound(nums, x)` |
| >x 的元素个数 | `n - lowerBound(nums, x+1)` |

> 注意 `<x` 和 `≥x` 互为补集，元素个数之和为 n。`≤x` 和 `>x` 同理。

#### §1.1 基础

| 题号 | 题目名称 | 难度分 | 链接 |
|------|---------|--------|------|
| 35 | 搜索插入位置 | — | [链接](https://leetcode.cn/problems/search-insert-position/) |
| 704 | 二分查找 | — | [链接](https://leetcode.cn/problems/binary-search/) |
| 744 | 寻找比目标字母大的最小字母 | — | [链接](https://leetcode.cn/problems/find-smallest-letter-greater-than-target/) |
| 2529 | 正整数和负整数的最大计数 | 做到 O(log n) | [链接](https://leetcode.cn/problems/maximum-count-of-positive-integer-and-negative-integer/) |
| 34 | 在排序数组中查找元素的第一个和最后一个位置 | — | [链接](https://leetcode.cn/problems/find-first-and-last-position-of-element-in-sorted-array/) |

#### §1.2 进阶

| 题号 | 题目名称 | 难度分 | 链接 |
|------|---------|--------|------|
| 658 | 找到 K 个最接近的元素 | — | [链接](https://leetcode.cn/problems/find-k-closest-elements/) |
| 911 | 在线选举 | 2001 | [链接](https://leetcode.cn/problems/online-election/) |
| 981 | 基于时间的键值存储 | 同 1146 | [链接](https://leetcode.cn/problems/time-based-key-value-store/) |
| 1146 | 快照数组 | 1771 | [链接](https://leetcode.cn/problems/snapshot-array/) |
| 1170 | 比较字符串最小字母出现频次 | 1432 | [链接](https://leetcode.cn/problems/compare-strings-by-frequency-of-the-smallest-character/) |
| 1385 | 两个数组间的距离值 | 1235 | [链接](https://leetcode.cn/problems/find-the-distance-value-between-two-arrays/) |
| 1818 | 绝对差值和 | 1934 | [链接](https://leetcode.cn/problems/minimum-absolute-sum-difference/) |
| 2070 | 每一个查询的最大美丽值 | 1724 | [链接](https://leetcode.cn/problems/most-beautiful-item-for-each-query/) |
| 2080 | 区间内查询数字的频率 | 1702 | [链接](https://leetcode.cn/problems/range-frequency-queries/) |
| 2300 | 咒语和药水的成功对数 | 1477 | [链接](https://leetcode.cn/problems/successful-pairs-of-spells-and-potions/) |
| 2389 | 和有限的最长子序列 | 非暴力 | [链接](https://leetcode.cn/problems/longest-subsequence-with-limited-sum/) |
| 2563 | 统计公平数对的数目 | 1721 | [链接](https://leetcode.cn/problems/count-the-number-of-fair-pairs/) |
| 3488 | 距离最小相等元素查询 | 做法不止一种 | [链接](https://leetcode.cn/problems/closest-equal-element-queries/) |
| 3508 | 设计路由器 | 1851 | [链接](https://leetcode.cn/problems/implement-router/) |
| LCP 08 | 剧情触发时间 | — | [链接](https://leetcode.cn/problems/ju-qing-hong-fa-shi-jian/) |

#### §1.3 思维扩展

| 题号 | 题目名称 | 难度分 | 链接 |
|------|---------|--------|------|
| 1287 | 有序数组中出现次数超过 25% 的元素 | 做到 O(log n) | [链接](https://leetcode.cn/problems/element-appearing-more-than-25-in-sorted-array/) |
| 2476 | 二叉搜索树最近节点查询 | 1597 | [链接](https://leetcode.cn/problems/closest-nodes-queries-in-a-binary-search-tree/) |

### 二、二分答案

> "花费一个 log 的时间，增加了一个条件。" —— 二分答案
>
> **求最小**：check(mid) == true 时更新 right = mid，反之更新 left = mid，最后返回 right
> **求最大**：check(mid) == true 时更新 left = mid，反之更新 right = mid，最后返回 left

#### §2.1 求最小

| 题号 | 题目名称 | 难度分 | 链接 |
|------|---------|--------|------|
| 475 | 供暖器 | — | [链接](https://leetcode.cn/problems/heaters/) |
| 875 | 爱吃香蕉的珂珂 | 1766 | [链接](https://leetcode.cn/problems/koko-eating-bananas/) |
| 1011 | 在 D 天内送达包裹的能力 | 1725 | [链接](https://leetcode.cn/problems/capacity-to-ship-packages-within-d-days/) |
| 1283 | 使结果不超过阈值的最小除数 | 1542 | [链接](https://leetcode.cn/problems/find-the-smallest-divisor-given-a-threshold/) |
| 1482 | 制作 m 束花所需的最少天数 | 1946 | [链接](https://leetcode.cn/problems/minimum-number-of-days-to-make-m-bouquets/) |
| 2187 | 完成旅途的最少时间 | 1641 | [链接](https://leetcode.cn/problems/minimum-time-to-complete-trips/) |
| 2594 | 修车的最少时间 | 1915 | [链接](https://leetcode.cn/problems/minimum-time-to-repair-cars/) |
| 3048 | 标记所有下标的最早秒数 I | 2263 | [链接](https://leetcode.cn/problems/earliest-second-to-mark-indices-i/) |
| 3296 | 移山所需的最少秒数 | ~1850 | [链接](https://leetcode.cn/problems/minimum-number-of-seconds-to-make-mountain-height-zero/) |
| 3639 | 变为活跃状态的最小时间 | 1853 | [链接](https://leetcode.cn/problems/minimum-time-to-activate-string/) |

#### §2.2 求最大

| 题号 | 题目名称 | 难度分 | 链接 |
|------|---------|--------|------|
| 275 | H 指数 II | — | [链接](https://leetcode.cn/problems/h-index-ii/) |
| 1642 | 可以到达的最远建筑 | 1962 | [链接](https://leetcode.cn/problems/furthest-building-you-can-reach/) |
| 1802 | 有界数组中指定下标处的最大值 | 1929 | [链接](https://leetcode.cn/problems/maximum-value-at-a-given-index-in-a-bounded-array/) |
| 1898 | 可移除字符的最大数目 | 1913 | [链接](https://leetcode.cn/problems/maximum-number-of-removable-characters/) |
| 2071 | 你可以安排的最多任务数目 | 2648 | [链接](https://leetcode.cn/problems/maximum-number-of-tasks-you-can-assign/) |
| 2141 | 同时运行 N 台电脑的最长时间 | 2265 | [链接](https://leetcode.cn/problems/maximum-running-time-of-n-computers/) |
| 2226 | 每个小孩最多能分到多少糖果 | 1646 | [链接](https://leetcode.cn/problems/maximum-candies-allocated-to-k-children/) |
| 2258 | 逃离火灾 | 2347 | [链接](https://leetcode.cn/problems/escape-the-spreading-fire/) |
| 2576 | 求出最多标记下标 | 1843 | [链接](https://leetcode.cn/problems/find-the-maximum-number-of-marked-indices/) |
| 2861 | 最大合金数 | 1981 | [链接](https://leetcode.cn/problems/maximum-number-of-alloys/) |
| 2982 | 找出出现至少三次的最长特殊子字符串 II | 1773 | [链接](https://leetcode.cn/problems/find-longest-special-substring-that-occurs-thrice-ii/) |
| 3007 | 价值和小于等于 K 的最大数字 | 2258 | [链接](https://leetcode.cn/problems/maximum-number-that-sum-of-the-prices-is-less-than-or-equal-to-k/) |
| LCP 78 | 城墙防线 | — | [链接](https://leetcode.cn/problems/Nsibyl/) |

#### §2.3 二分间接值

| 题号 | 题目名称 | 难度分 | 链接 |
|------|---------|--------|------|
| 1648 | 销售价值减少的颜色球 | 2050 | [链接](https://leetcode.cn/problems/sell-diminishing-valued-colored-balls/) |
| 3143 | 正方形中的最多点数 | 1697 | [链接](https://leetcode.cn/problems/maximum-points-inside-the-square/) |

#### §2.4 最小化最大值

| 题号 | 题目名称 | 难度分 | 链接 |
|------|---------|--------|------|
| 410 | 分割数组的最大值 | — | [链接](https://leetcode.cn/problems/split-array-largest-sum/) |
| 778 | 水位上升的泳池中游泳 | — | [链接](https://leetcode.cn/problems/swim-in-rising-water/) |
| 1631 | 最小体力消耗路径 | — | [链接](https://leetcode.cn/problems/path-with-minimum-effort/) |
| 1760 | 袋子里最少数目的球 | — | [链接](https://leetcode.cn/problems/minimum-limit-of-balls-in-a-bag/) |
| 2064 | 分配给商店的最多商品的最小值 | — | [链接](https://leetcode.cn/problems/minimized-maximum-of-products-distributed-to-any-store/) |
| 2439 | 最小化数组中的最大值 | — | [链接](https://leetcode.cn/problems/minimize-maximum-of-array/) |
| 2513 | 最小化两个数组中的最大值 | — | [链接](https://leetcode.cn/problems/minimize-the-maximum-of-two-arrays/) |
| 2560 | 打家劫舍 IV | — | [链接](https://leetcode.cn/problems/house-robber-iv/) |
| 2616 | 最小化数对的最大差值 | — | [链接](https://leetcode.cn/problems/minimize-the-maximum-difference-of-pairs/) |
| LCP 12 | 小张刷题计划 | — | [链接](https://leetcode.cn/problems/xiao-zhang-shua-ti-ji-hua/) |

#### §2.5 最大化最小值

| 题号 | 题目名称 | 难度分 | 链接 |
|------|---------|--------|------|
| 1552 | 两球之间的磁力 | — | [链接](https://leetcode.cn/problems/magnetic-force-between-two-balls/) |
| 2517 | 礼盒的最大甜蜜度 | — | [链接](https://leetcode.cn/problems/maximum-tastiness-of-candy-basket/) |
| 2528 | 最大化城市的最小电量 | — | [链接](https://leetcode.cn/problems/maximize-the-minimum-powered-city/) |
| 2812 | 找出最安全路径 | — | [链接](https://leetcode.cn/problems/find-the-safest-path-in-a-grid/) |
| 3281 | 范围内整数的最大得分 | — | [链接](https://leetcode.cn/problems/maximize-score-of-numbers-in-ranges/) |

#### §2.6 第 K 小/大

| 题号 | 题目名称 | 难度分 | 链接 |
|------|---------|--------|------|
| 378 | 有序矩阵中第 K 小的元素 | — | [链接](https://leetcode.cn/problems/kth-smallest-element-in-a-sorted-matrix/) |
| 668 | 乘法表中第 K 小的数 | — | [链接](https://leetcode.cn/problems/kth-smallest-number-in-multiplication-table/) |
| 719 | 找出第 K 小的数对距离 | — | [链接](https://leetcode.cn/problems/find-k-th-smallest-pair-distance/) |
| 786 | 第 K 个最小的质数分数 | — | [链接](https://leetcode.cn/problems/k-th-smallest-prime-fraction/) |
| 878 | 第 N 个神奇数字 | — | [链接](https://leetcode.cn/problems/nth-magical-number/) |
| 1201 | 丑数 III | — | [链接](https://leetcode.cn/problems/ugly-number-iii/) |
| 1439 | 有序矩阵中的第 k 个最小数组和 | — | [链接](https://leetcode.cn/problems/find-the-kth-smallest-sum-of-a-matrix-with-sorted-rows/) |
| 1508 | 子数组和排序后的区间和 | — | [链接](https://leetcode.cn/problems/range-sum-of-sorted-subarray-sums/) |
| 2040 | 两个有序数组的第 K 小乘积 | — | [链接](https://leetcode.cn/problems/kth-smallest-product-of-two-sorted-arrays/) |
| 2386 | 找出数组的第 K 大和 | — | [链接](https://leetcode.cn/problems/find-the-k-sum-of-an-array/) |
| 3116 | 单面值组合的第 K 小金额 | — | [链接](https://leetcode.cn/problems/kth-smallest-amount-with-single-denomination-combination/) |
| 3134 | 找出唯一性数组的中位数 | — | [链接](https://leetcode.cn/problems/find-the-median-of-the-uniqueness-array/) |

### 三、三分法 & 其他

| 题号 | 题目名称 | 难度分 | 链接 |
|------|---------|--------|------|
| 4 | 寻找两个正序数组的中位数 | — | [链接](https://leetcode.cn/problems/median-of-two-sorted-arrays/) |
| 33 | 搜索旋转排序数组 | — | [链接](https://leetcode.cn/problems/search-in-rotated-sorted-array/) |
| 69 | x 的平方根 | — | [链接](https://leetcode.cn/problems/sqrtx/) |
| 74 | 搜索二维矩阵 | — | [链接](https://leetcode.cn/problems/search-a-2d-matrix/) |
| 81 | 搜索旋转排序数组 II | — | [链接](https://leetcode.cn/problems/search-in-rotated-sorted-array-ii/) |
| 153 | 寻找旋转排序数组中的最小值 | — | [链接](https://leetcode.cn/problems/find-minimum-in-rotated-sorted-array/) |
| 154 | 寻找旋转排序数组中的最小值 II | — | [链接](https://leetcode.cn/problems/find-minimum-in-rotated-sorted-array-ii/) |
| 162 | 寻找峰值 | — | [链接](https://leetcode.cn/problems/find-peak-element/) |
| 222 | 完全二叉树的节点个数 | — | [链接](https://leetcode.cn/problems/count-complete-tree-nodes/) |
| 278 | 第一个错误的版本 | — | [链接](https://leetcode.cn/problems/first-bad-version/) |
| 374 | 猜数字大小 | — | [链接](https://leetcode.cn/problems/guess-number-higher-or-lower/) |
| 540 | 有序数组中的单一元素 | — | [链接](https://leetcode.cn/problems/single-element-in-a-sorted-array/) |
| 852 | 山脉数组的峰顶索引 | — | [链接](https://leetcode.cn/problems/peak-index-in-a-mountain-array/) |
| 1095 | 山脉数组中查找目标值 | — | [链接](https://leetcode.cn/problems/find-in-mountain-array/) |
| 1539 | 第 k 个缺失的正整数 | — | [链接](https://leetcode.cn/problems/kth-missing-positive-number/) |
| 1901 | 寻找峰值 II | — | [链接](https://leetcode.cn/problems/find-a-peak-element-ii/) |
| 1515 | 服务中心的最佳位置 | — | [链接](https://leetcode.cn/problems/best-position-for-a-service-centre/) |

---

## 5. 题单三：常用数据结构

### 零、常用枚举技巧

#### §0.1 枚举右，维护左

> 对于双变量问题，枚举右边的值，转化成单变量问题，用哈希表维护。

**§0.1.1 基础**

| 题号 | 题目名称 | 难度分 | 链接 |
|------|---------|--------|------|
| 1 | 两数之和 | — | [链接](https://leetcode.cn/problems/two-sum/) |
| 121 | 买卖股票的最佳时机 | — | [链接](https://leetcode.cn/problems/best-time-to-buy-and-sell-stock/) |
| 219 | 存在重复元素 II | — | [链接](https://leetcode.cn/problems/contains-duplicate-ii/) |
| 1014 | 最佳观光组合 | 1730 | [链接](https://leetcode.cn/problems/best-sightseeing-pair/) |
| 1128 | 等价多米诺骨牌对的数量 | 1333 | [链接](https://leetcode.cn/problems/number-of-equivalent-domino-pairs/) |
| 1512 | 好数对的数目 | 1161 | [链接](https://leetcode.cn/problems/number-of-good-pairs/) |
| 1679 | K 和数对的最大数目 | 1346 | [链接](https://leetcode.cn/problems/max-number-of-k-sum-pairs/) |
| 2016 | 增量元素之间的最大差值 | 1246 | [链接](https://leetcode.cn/problems/maximum-difference-between-increasing-elements/) |
| 2001 | 可互换矩形的组数 | 1436 | [链接](https://leetcode.cn/problems/number-of-pairs-of-interchangeable-rectangles/) |
| 2260 | 必须拿起的最小连续卡牌数 | 1365 | [链接](https://leetcode.cn/problems/minimum-consecutive-cards-to-pick-up/) |
| 2342 | 数位和相等数对的最大和 | 1309 | [链接](https://leetcode.cn/problems/max-sum-of-a-pair-with-equal-sum-of-digits/) |
| 2364 | 统计坏数对的数目 | 1622 | [链接](https://leetcode.cn/problems/count-number-of-bad-pairs/) |
| 2441 | 与对应负数同时存在的最大正整数 | 1168 | [链接](https://leetcode.cn/problems/largest-positive-integer-that-exists-with-its-negative/) |
| 2748 | 美丽下标对的数目 | — | [链接](https://leetcode.cn/problems/number-of-beautiful-pairs/) |
| 2815 | 数组中的最大数对和 | 非暴力 | [链接](https://leetcode.cn/problems/max-pair-sum-in-an-array/) |
| 2905 | 找出满足差值条件的下标 II | 1764 | [链接](https://leetcode.cn/problems/find-indices-with-index-and-value-difference-ii/) |

**§0.1.2 进阶**

| 题号 | 题目名称 | 难度分 | 链接 |
|------|---------|--------|------|
| 1010 | 总持续时间可被 60 整除的歌曲 | — | [链接](https://leetcode.cn/problems/pairs-of-songs-with-total-durations-divisible-by-60/) |
| 1995 | 统计特殊四元组 | — | [链接](https://leetcode.cn/problems/count-special-quadruplets/) |
| 2506 | 统计相似字符串对的数目 | — | [链接](https://leetcode.cn/problems/count-pairs-of-similar-strings/) |
| 2555 | 两个线段获得的最多奖品 | 2081 | [链接](https://leetcode.cn/problems/maximize-win-from-two-segments/) |
| 2874 | 有序三元组中的最大值 II | 1583 | [链接](https://leetcode.cn/problems/maximum-value-of-an-ordered-triplet-ii/) |
| 3185 | 构成整天的下标对数目 II | 同 1010 | [链接](https://leetcode.cn/problems/count-pairs-that-form-a-complete-day-ii/) |
| 3267 | 统计近似相等数对 II | 2545 | [链接](https://leetcode.cn/problems/count-approximate-equal-pairs-ii/) |
| 454 | 四数相加 II | — | [链接](https://leetcode.cn/problems/4sum-ii/) |

#### §0.2 枚举中间

> 对于有三个或四个变量的问题，枚举中间的变量往往更好算——i 和 k 自动被 j 隔开，互相独立。

| 题号 | 题目名称 | 难度分 | 链接 |
|------|---------|--------|------|
| 447 | 回旋镖的数量 | — | [链接](https://leetcode.cn/problems/number-of-boomerangs/) |
| 456 | 132 模式 | — | [链接](https://leetcode.cn/problems/132-pattern/) |
| 1534 | 统计好三元组 | 做到 O(n²) | [链接](https://leetcode.cn/problems/count-good-triplets/) |
| 1930 | 长度为 3 的不同回文子序列 | 1533 | [链接](https://leetcode.cn/problems/unique-length-3-palindromic-subsequences/) |
| 2874 | 有序三元组中的最大值 II | 1583 | [链接](https://leetcode.cn/problems/maximum-value-of-an-ordered-triplet-ii/) |
| 2909 | 元素和最小的山形三元组 II | 1479 | [链接](https://leetcode.cn/problems/minimum-sum-of-mountain-triplets-ii/) |
| 3067 | 在带权树网络中统计可连接服务器对数目 | 1909 | [链接](https://leetcode.cn/problems/count-pairs-of-connectable-servers-in-a-weighted-tree-network/) |
| 3583 | 统计特殊三元组 | 1510 | [链接](https://leetcode.cn/problems/count-special-triplets/) |

### 一、前缀和

#### §1.1 基础

> 左闭右开公式：子数组 [left, right) 的元素和为 `sum[right] - sum[left]`

| 题号 | 题目名称 | 难度分 | 链接 |
|------|---------|--------|------|
| 53 | 最大子数组和 | — | [链接](https://leetcode.cn/problems/maximum-subarray/) |
| 303 | 区域和检索 - 数组不可变 | 模板题 | [链接](https://leetcode.cn/problems/range-sum-query-immutable/) |
| 1310 | 子数组异或查询 | 1460 | [链接](https://leetcode.cn/problems/xor-queries-of-a-subarray/) |
| 1749 | 任意子数组和的绝对值的最大值 | 1542 | [链接](https://leetcode.cn/problems/maximum-absolute-sum-of-any-subarray/) |
| 2559 | 统计范围内的元音字符串数 | 1435 | [链接](https://leetcode.cn/problems/count-vowel-strings-in-ranges/) |
| 3152 | 特殊数组 II | 1523 | [链接](https://leetcode.cn/problems/special-array-ii/) |
| 3361 | 两个字符串的切换距离 | — | [链接](https://leetcode.cn/problems/shift-distance-between-two-strings/) |
| 3427 | 变长子数组求和 | 做到 O(n) | [链接](https://leetcode.cn/problems/sum-of-variable-length-subarrays/) |
| 3652 | 按策略买卖股票的最佳时机 | 1557 | [链接](https://leetcode.cn/problems/best-time-to-buy-and-sell-stock-using-strategy/) |

#### §1.2 前缀和与哈希表

> 通常要用到「枚举右，维护左」的技巧

| 题号 | 题目名称 | 难度分 | 链接 |
|------|---------|--------|------|
| 523 | 连续的子数组和 | — | [链接](https://leetcode.cn/problems/continuous-subarray-sum/) |
| 525 | 连续数组 | — | [链接](https://leetcode.cn/problems/contiguous-array/) |
| 560 | 和为 K 的子数组 | — | [链接](https://leetcode.cn/problems/subarray-sum-equals-k/) |
| 930 | 和相同的二元子数组 | 1592 | [链接](https://leetcode.cn/problems/binary-subarrays-with-sum/) |
| 974 | 和可被 K 整除的子数组 | 1676 | [链接](https://leetcode.cn/problems/subarray-sums-divisible-by-k/) |
| 1124 | 表现良好的最长时间段 | 1908 | [链接](https://leetcode.cn/problems/longest-well-performing-interval/) |
| 1477 | 找两个和为目标值且不重叠的子数组 | 1851 | [链接](https://leetcode.cn/problems/find-two-non-overlapping-sub-arrays-each-with-target-sum/) |
| 1524 | 和为奇数的子数组数目 | 1611 | [链接](https://leetcode.cn/problems/number-of-sub-arrays-with-odd-sum/) |
| 1546 | 和为目标值且不重叠的非空子数组的最大数目 | 1855 | [链接](https://leetcode.cn/problems/maximum-number-of-non-overlapping-subarrays-with-sum-equals-target/) |
| 1590 | 使数组和能被 P 整除 | 2039 | [链接](https://leetcode.cn/problems/make-sum-divisible-by-p/) |
| 2025 | 分割数组的最多方案数 | 2218 | [链接](https://leetcode.cn/problems/maximum-number-of-ways-to-partition-an-array/) |
| 2488 | 统计中位数为 K 的子数组 | 1999 | [链接](https://leetcode.cn/problems/count-subarrays-with-median-k/) |
| 2588 | 统计美丽子数组数目 | 1697 | [链接](https://leetcode.cn/problems/count-the-number-of-beautiful-subarrays/) |
| 2845 | 统计趣味子数组的数目 | 2073 | [链接](https://leetcode.cn/problems/count-of-interesting-subarrays/) |

### 二、差分

> 差分与前缀和的关系，类似导数与积分的关系。数组 a 的差分的前缀和就是数组 a。

#### §2.1 一维差分

| 题号 | 题目名称 | 难度分 | 链接 |
|------|---------|--------|------|
| 1094 | 拼车 | 1441 | [链接](https://leetcode.cn/problems/car-pooling/) |
| 1109 | 航班预订统计 | 1570 | [链接](https://leetcode.cn/problems/corporate-flight-bookings/) |
| 1854 | 人口最多的年份 | 1370 | [链接](https://leetcode.cn/problems/maximum-population-year/) |
| 1893 | 检查是否区域内所有整数都被覆盖 | 1307 | [链接](https://leetcode.cn/problems/check-if-all-the-integers-in-a-range-are-covered/) |
| 2251 | 花期内花的数目 | 2022 | [链接](https://leetcode.cn/problems/number-of-flowers-in-full-bloom/) |
| 2848 | 与车相交的点 | 1230 | [链接](https://leetcode.cn/problems/points-that-intersect-with-cars/) |
| 3355 | 零数组变换 I | 1591 | [链接](https://leetcode.cn/problems/zero-array-transformation-i/) |
| 3356 | 零数组变换 II | 1913 | [链接](https://leetcode.cn/problems/zero-array-transformation-ii/) |

#### §2.2 二维差分

| 题号 | 题目名称 | 难度分 | 链接 |
|------|---------|--------|------|
| 850 | 矩形面积 II | 2236 | [链接](https://leetcode.cn/problems/rectangle-area-ii/) |
| 2132 | 用邮票贴满网格图 | 2364 | [链接](https://leetcode.cn/problems/stamping-the-grid/) |
| 2536 | 子矩阵元素加 1 | 1583 | [链接](https://leetcode.cn/problems/increment-submatrices-by-one/) |
| LCP 74 | 最强祝福力场 | — | [链接](https://leetcode.cn/problems/xepqZ5/) |

### 三、栈

#### §3.1 基础

| 题号 | 题目名称 | 难度分 | 链接 |
|------|---------|--------|------|
| 71 | 简化路径 | — | [链接](https://leetcode.cn/problems/simplify-path/) |
| 682 | 棒球比赛 | — | [链接](https://leetcode.cn/problems/baseball-game/) |
| 844 | 比较含退格的字符串 | 1228 | [链接](https://leetcode.cn/problems/backspace-string-compare/) |
| 946 | 验证栈序列 | 1462 | [链接](https://leetcode.cn/problems/validate-stack-sequences/) |
| 1441 | 用栈操作构建数组 | 1180 | [链接](https://leetcode.cn/problems/build-an-array-with-stack-operations/) |
| 1472 | 设计浏览器历史记录 | 1454 | [链接](https://leetcode.cn/problems/design-browser-history/) |
| 2390 | 从字符串中移除星号 | 1348 | [链接](https://leetcode.cn/problems/removing-stars-from-a-string/) |

#### §3.2 进阶

| 题号 | 题目名称 | 难度分 | 链接 |
|------|---------|--------|------|
| 155 | 最小栈 | — | [链接](https://leetcode.cn/problems/min-stack/) |
| 636 | 函数的独占时间 | — | [链接](https://leetcode.cn/problems/exclusive-time-of-functions/) |
| 895 | 最大频率栈 | 2028 | [链接](https://leetcode.cn/problems/maximum-frequency-stack/) |
| 1381 | 设计一个支持增量操作的栈 | — | [链接](https://leetcode.cn/problems/design-a-stack-with-increment-operation/) |
| 2434 | 使用机器人打印字典序最小的字符串 | 1953 | [链接](https://leetcode.cn/problems/using-a-robot-to-print-the-lexicographically-smallest-string/) |

#### §3.3 邻项消除

| 题号 | 题目名称 | 难度分 | 链接 |
|------|---------|--------|------|
| 735 | 小行星碰撞 | — | [链接](https://leetcode.cn/problems/asteroid-collision/) |
| 1003 | 检查替换后的词是否有效 | 1427 | [链接](https://leetcode.cn/problems/check-if-word-is-valid-after-substitutions/) |
| 1047 | 删除字符串中的所有相邻重复项 | 1286 | [链接](https://leetcode.cn/problems/remove-all-adjacent-duplicates-in-string/) |
| 1209 | 删除字符串中的所有相邻重复项 II | 1542 | [链接](https://leetcode.cn/problems/remove-all-adjacent-duplicates-in-string-ii/) |
| 2696 | 删除子串后的字符串最小长度 | 1282 | [链接](https://leetcode.cn/problems/minimum-string-length-after-removing-substrings/) |

#### §3.4 合法括号字符串

| 题号 | 题目名称 | 难度分 | 链接 |
|------|---------|--------|------|
| 20 | 有效的括号 | — | [链接](https://leetcode.cn/problems/valid-parentheses/) |
| 32 | 最长有效括号 | — | [链接](https://leetcode.cn/problems/longest-valid-parentheses/) |
| 678 | 有效的括号字符串 | ~1700 | [链接](https://leetcode.cn/problems/valid-parenthesis-string/) |
| 856 | 括号的分数 | 1563 | [链接](https://leetcode.cn/problems/score-of-parentheses/) |
| 921 | 使括号有效的最少添加 | 1242 | [链接](https://leetcode.cn/problems/minimum-add-to-make-parentheses-valid/) |
| 1111 | 有效括号的嵌套深度 | 1749 | [链接](https://leetcode.cn/problems/maximum-nesting-depth-of-two-valid-parentheses-strings/) |
| 1249 | 移除无效的括号 | 1657 | [链接](https://leetcode.cn/problems/minimum-remove-to-make-valid-parentheses/) |

#### §3.5 表达式解析

| 题号 | 题目名称 | 难度分 | 链接 |
|------|---------|--------|------|
| 150 | 逆波兰表达式求值 | — | [链接](https://leetcode.cn/problems/evaluate-reverse-polish-notation/) |
| 224 | 基本计算器 | — | [链接](https://leetcode.cn/problems/basic-calculator/) |
| 227 | 基本计算器 II | — | [链接](https://leetcode.cn/problems/basic-calculator-ii/) |
| 394 | 字符串解码 | — | [链接](https://leetcode.cn/problems/decode-string/) |
| 726 | 原子的数量 | — | [链接](https://leetcode.cn/problems/number-of-atoms/) |

### 四、队列

#### §4.1 基础

| 题号 | 题目名称 | 难度分 | 链接 |
|------|---------|--------|------|
| 649 | Dota2 参议院 | — | [链接](https://leetcode.cn/problems/dota2-senate/) |
| 933 | 最近的请求次数 | 1338 | [链接](https://leetcode.cn/problems/number-of-recent-calls/) |
| 950 | 按递增顺序显示卡牌 | 1686 | [链接](https://leetcode.cn/problems/reveal-cards-in-increasing-order/) |

#### §4.2 设计

| 题号 | 题目名称 | 难度分 | 链接 |
|------|---------|--------|------|
| 225 | 用队列实现栈 | — | [链接](https://leetcode.cn/problems/implement-stack-using-queues/) |
| 232 | 用栈实现队列 | — | [链接](https://leetcode.cn/problems/implement-queue-using-stacks/) |
| 622 | 设计循环队列 | — | [链接](https://leetcode.cn/problems/design-circular-queue/) |
| 641 | 设计循环双端队列 | — | [链接](https://leetcode.cn/problems/design-circular-deque/) |
| 1670 | 设计前中后队列 | 1610 | [链接](https://leetcode.cn/problems/design-front-middle-back-queue/) |

#### §4.3 单调队列

> 单调队列 = 滑动窗口 + 单调栈。必须先掌握滑动窗口和单调栈。

| 题号 | 题目名称 | 难度分 | 链接 |
|------|---------|--------|------|
| 239 | 滑动窗口最大值 | — | [链接](https://leetcode.cn/problems/sliding-window-maximum/) |
| 862 | 和至少为 K 的最短子数组 | 2307 | [链接](https://leetcode.cn/problems/shortest-subarray-with-sum-at-least-k/) |
| 1438 | 绝对差不超过限制的最长连续子数组 | 1672 | [链接](https://leetcode.cn/problems/longest-continuous-subarray-with-absolute-diff-less-than-or-equal-to-limit/) |
| 1499 | 满足不等式的最大值 | 2456 | [链接](https://leetcode.cn/problems/max-value-of-equation/) |
| 2398 | 预算内的最多机器人数目 | 1917 | [链接](https://leetcode.cn/problems/maximum-number-of-robots-within-budget/) |

### 五、堆（优先队列）

#### §5.1 基础

| 题号 | 题目名称 | 难度分 | 链接 |
|------|---------|--------|------|
| 239 | 滑动窗口最大值 | — | [链接](https://leetcode.cn/problems/sliding-window-maximum/) |
| 703 | 数据流中的第 K 大元素 | 经典题 | [链接](https://leetcode.cn/problems/kth-largest-element-in-a-stream/) |
| 1046 | 最后一块石头的重量 | 1173 | [链接](https://leetcode.cn/problems/last-stone-weight/) |
| 1801 | 积压订单中的订单总数 | 1711 | [链接](https://leetcode.cn/problems/number-of-orders-in-the-backlog/) |
| 1834 | 单线程 CPU | 1798 | [链接](https://leetcode.cn/problems/single-threaded-cpu/) |
| 1942 | 最小未被占据椅子的编号 | 1695 | [链接](https://leetcode.cn/problems/the-number-of-the-smallest-unoccupied-chair/) |
| 2208 | 将数组和减半的最少操作次数 | 1550 | [链接](https://leetcode.cn/problems/minimum-operations-to-halve-array-sum/) |
| 2336 | 无限集中的最小数字 | 1375 | [链接](https://leetcode.cn/problems/smallest-number-in-infinite-set/) |
| 2406 | 将区间分为最少组数 | 1713 | 经典题 | [链接](https://leetcode.cn/problems/divide-intervals-into-minimum-number-of-groups/) |
| 2462 | 雇佣 K 位工人的总代价 | 1764 | [链接](https://leetcode.cn/problems/total-cost-to-hire-k-workers/) |

#### §5.2 进阶

| 题号 | 题目名称 | 难度分 | 链接 |
|------|---------|--------|------|
| 23 | 合并 K 个升序链表 | — | [链接](https://leetcode.cn/problems/merge-k-sorted-lists/) |
| 502 | IPO | — | [链接](https://leetcode.cn/problems/ipo/) |
| 632 | 最小区间 | 做法不止一种 | [链接](https://leetcode.cn/problems/smallest-range-covering-elements-from-k-lists/) |
| 1235 | 规划兼职工作 | 2023 | [链接](https://leetcode.cn/problems/maximum-profit-in-job-scheduling/) |
| 1353 | 最多可以参加的会议数目 | 2016 | [链接](https://leetcode.cn/problems/maximum-number-of-events-that-can-be-attended/) |
| 1705 | 吃苹果的最大数目 | 1930 | [链接](https://leetcode.cn/problems/maximum-number-of-eaten-apples/) |
| 1882 | 使用服务器处理任务 | 1979 | [链接](https://leetcode.cn/problems/process-tasks-using-servers/) |
| 2402 | 会议室 III | 2093 | [链接](https://leetcode.cn/problems/meeting-rooms-iii/) |

#### §5.3 反悔堆（反悔贪心）

| 题号 | 题目名称 | 难度分 | 链接 |
|------|---------|--------|------|
| 630 | 课程表 III | — | [链接](https://leetcode.cn/problems/course-schedule-iii/) |
| 871 | 最低加油次数 | 2074 | [链接](https://leetcode.cn/problems/minimum-number-of-refueling-stops/) |
| 1642 | 可以到达的最远建筑 | 1962 | [链接](https://leetcode.cn/problems/furthest-building-you-can-reach/) |

---

---

## 6. 题单四：链表、二叉树与回溯

### 一、链表

#### §1.1 遍历链表

| 题号 | 题目名称 | 链接 |
|------|---------|------|
| 1290 | 二进制链表转整数 | [链接](https://leetcode.cn/problems/convert-binary-number-in-a-linked-list-to-integer/) |
| 2058 | 找出临界点之间的最小和最大距离 | [链接](https://leetcode.cn/problems/find-the-minimum-and-maximum-number-of-nodes-between-critical-points/) |
| 2181 | 合并零之间的节点 | [链接](https://leetcode.cn/problems/merge-nodes-in-between-zeros/) |
| 725 | 分隔链表 | [链接](https://leetcode.cn/problems/split-linked-list-in-parts/) |
| 817 | 链表组件 | [链接](https://leetcode.cn/problems/linked-list-components/) |

#### §1.2 删除节点

| 题号 | 题目名称 | 链接 |
|------|---------|------|
| 82 | 删除排序链表中的重复元素 II | [链接](https://leetcode.cn/problems/remove-duplicates-from-sorted-list-ii/) |
| 83 | 删除排序链表中的重复元素 | [链接](https://leetcode.cn/problems/remove-duplicates-from-sorted-list/) |
| 203 | 移除链表元素 | [链接](https://leetcode.cn/problems/remove-linked-list-elements/) |
| 237 | 删除链表中的节点 | [链接](https://leetcode.cn/problems/delete-node-in-a-linked-list/) |
| 1669 | 合并两个链表 | [链接](https://leetcode.cn/problems/merge-in-between-linked-lists/) |
| 2487 | 从链表中移除节点 | [链接](https://leetcode.cn/problems/remove-nodes-from-linked-list/) |
| 3217 | 从链表中移除在数组中存在的节点 | [链接](https://leetcode.cn/problems/delete-nodes-from-linked-list-present-in-array/) |

#### §1.3 插入节点

| 题号 | 题目名称 | 链接 |
|------|---------|------|
| 147 | 对链表进行插入排序 | [链接](https://leetcode.cn/problems/insertion-sort-list/) |
| 2807 | 在链表中插入最大公约数 | [链接](https://leetcode.cn/problems/insert-greatest-common-divisors-in-linked-list/) |

#### §1.4 反转链表

| 题号 | 题目名称 | 链接 |
|------|---------|------|
| 24 | 两两交换链表中的节点 | [链接](https://leetcode.cn/problems/swap-nodes-in-pairs/) |
| 25 | K 个一组翻转链表 | [链接](https://leetcode.cn/problems/reverse-nodes-in-k-group/) |
| 92 | 反转链表 II | [链接](https://leetcode.cn/problems/reverse-linked-list-ii/) |
| 206 | 反转链表 | [链接](https://leetcode.cn/problems/reverse-linked-list/) |
| 2074 | 反转偶数长度组的节点 | [链接](https://leetcode.cn/problems/reverse-nodes-in-even-length-groups/) |

#### §1.5 前后指针

| 题号 | 题目名称 | 链接 |
|------|---------|------|
| 19 | 删除链表的倒数第 N 个结点 | [链接](https://leetcode.cn/problems/remove-nth-node-from-end-of-list/) |
| 61 | 旋转链表 | [链接](https://leetcode.cn/problems/rotate-list/) |
| 1721 | 交换链表中的节点 | [链接](https://leetcode.cn/problems/swapping-nodes-in-a-linked-list/) |

#### §1.6 快慢指针

| 题号 | 题目名称 | 链接 |
|------|---------|------|
| 141 | 环形链表 | [链接](https://leetcode.cn/problems/linked-list-cycle/) |
| 142 | 环形链表 II | [链接](https://leetcode.cn/problems/linked-list-cycle-ii/) |
| 143 | 重排链表 | [链接](https://leetcode.cn/problems/reorder-list/) |
| 234 | 回文链表 | [链接](https://leetcode.cn/problems/palindrome-linked-list/) |
| 287 | 寻找重复数 | — | [链接](https://leetcode.cn/problems/find-the-duplicate-number/) |
| 457 | 环形数组是否存在循环 | — | [链接](https://leetcode.cn/problems/circular-array-loop/) |
| 876 | 链表的中间结点 | [链接](https://leetcode.cn/problems/middle-of-the-linked-list/) |
| 2095 | 删除链表的中间节点 | [链接](https://leetcode.cn/problems/delete-the-middle-node-of-a-linked-list/) |
| 2130 | 链表最大孪生和 | [链接](https://leetcode.cn/problems/maximum-twin-sum-of-a-linked-list/) |

#### §1.7 双指针

| 题号 | 题目名称 | 链接 |
|------|---------|------|
| 86 | 分隔链表 | [链接](https://leetcode.cn/problems/partition-list/) |
| 160 | 相交链表 | [链接](https://leetcode.cn/problems/intersection-of-two-linked-lists/) |
| 328 | 奇偶链表 | [链接](https://leetcode.cn/problems/odd-even-linked-list/) |

#### §1.8 合并链表

| 题号 | 题目名称 | 链接 |
|------|---------|------|
| 2 | 两数相加 | — | [链接](https://leetcode.cn/problems/add-two-numbers/) |
| 21 | 合并两个有序链表 | — | [链接](https://leetcode.cn/problems/merge-two-sorted-lists/) |
| 445 | 两数相加 II | — | [链接](https://leetcode.cn/problems/add-two-numbers-ii/) |
| 2816 | 翻倍以链表形式表示的数字 | — | [链接](https://leetcode.cn/problems/double-a-number-represented-as-a-linked-list/) |

#### §1.9 分治

| 题号 | 题目名称 | 链接 |
|------|---------|------|
| 23 | 合并 K 个升序链表 | 也可以用堆 | [链接](https://leetcode.cn/problems/merge-k-sorted-lists/) |
| 148 | 排序链表 | — | [链接](https://leetcode.cn/problems/sort-list/) |

#### §1.10 综合应用

| 题号 | 题目名称 | 链接 |
|------|---------|------|
| 146 | LRU 缓存 | — | [链接](https://leetcode.cn/problems/lru-cache/) |
| 432 | 全 O(1) 的数据结构 | — | [链接](https://leetcode.cn/problems/all-oone-data-structure/) |
| 460 | LFU 缓存 | — | [链接](https://leetcode.cn/problems/lfu-cache/) |
| 707 | 设计链表 | — | [链接](https://leetcode.cn/problems/design-linked-list/) |
| 1019 | 链表中的下一个更大节点 | — | [链接](https://leetcode.cn/problems/next-greater-node-in-linked-list/) |
| 1171 | 从链表中删去总和值为零的连续节点 | — | [链接](https://leetcode.cn/problems/remove-zero-sum-consecutive-nodes-from-linked-list/) |
| 1206 | 设计跳表 | — | [链接](https://leetcode.cn/problems/design-skiplist/) |

#### §1.11 其他

| 题号 | 题目名称 | 链接 |
|------|---------|------|
| 138 | 随机链表的复制 | — | [链接](https://leetcode.cn/problems/copy-list-with-random-pointer/) |
| 382 | 链表随机节点 | — | [链接](https://leetcode.cn/problems/linked-list-random-node/) |
| 430 | 扁平化多级双向链表 | — | [链接](https://leetcode.cn/problems/flatten-a-multilevel-doubly-linked-list/) |

### 二、二叉树

> 学习递归，从二叉树开始。晕递归的同学，请先看 [基础算法精讲 09](https://www.bilibili.com/video/BV1UD4y1Y7K9/)。

#### §2.1 遍历二叉树

| 题号 | 题目名称 | 难度分 | 链接 |
|------|---------|--------|------|
| 94 | 二叉树的中序遍历 | — | [链接](https://leetcode.cn/problems/binary-tree-inorder-traversal/) |
| 144 | 二叉树的前序遍历 | — | [链接](https://leetcode.cn/problems/binary-tree-preorder-traversal/) |
| 145 | 二叉树的后序遍历 | — | [链接](https://leetcode.cn/problems/binary-tree-postorder-traversal/) |
| 404 | 左叶子之和 | — | [链接](https://leetcode.cn/problems/sum-of-left-leaves/) |
| 671 | 二叉树中第二小的节点 | — | [链接](https://leetcode.cn/problems/second-minimum-node-in-a-binary-tree/) |
| 872 | 叶子相似的树 | 1288 | [链接](https://leetcode.cn/problems/leaf-similar-trees/) |

#### §2.2 自顶向下 DFS（先序遍历）

> 在「递」的过程中维护值。

| 题号 | 题目名称 | 难度分 | 链接 |
|------|---------|--------|------|
| 104 | 二叉树的最大深度 | — | [链接](https://leetcode.cn/problems/maximum-depth-of-binary-tree/) |
| 111 | 二叉树的最小深度 | — | [链接](https://leetcode.cn/problems/minimum-depth-of-binary-tree/) |
| 112 | 路径总和 | — | [链接](https://leetcode.cn/problems/path-sum/) |
| 129 | 求根节点到叶节点数字之和 | — | [链接](https://leetcode.cn/problems/sum-root-to-leaf-numbers/) |
| 199 | 二叉树的右视图 | — | [链接](https://leetcode.cn/problems/binary-tree-right-side-view/) |
| 1022 | 从根到叶的二进制数之和 | 1462 | [链接](https://leetcode.cn/problems/sum-of-root-to-leaf-binary-numbers/) |
| 1026 | 节点与其祖先之间的最大差值 | 1446 | [链接](https://leetcode.cn/problems/maximum-difference-between-node-and-ancestor/) |
| 1372 | 二叉树中的最长交错路径 | 1713 | [链接](https://leetcode.cn/problems/longest-zigzag-path-in-a-binary-tree/) |
| 1448 | 统计二叉树中好节点的数目 | 1360 | [链接](https://leetcode.cn/problems/count-good-nodes-in-binary-tree/) |

#### §2.3 自底向上 DFS（后序遍历）

> 在「归」的过程中计算。

| 题号 | 题目名称 | 难度分 | 链接 |
|------|---------|--------|------|
| 100 | 相同的树 | — | [链接](https://leetcode.cn/problems/same-tree/) |
| 101 | 对称二叉树 | — | [链接](https://leetcode.cn/problems/symmetric-tree/) |
| 104 | 二叉树的最大深度 | — | [链接](https://leetcode.cn/problems/maximum-depth-of-binary-tree/) |
| 110 | 平衡二叉树 | — | [链接](https://leetcode.cn/problems/balanced-binary-tree/) |
| 226 | 翻转二叉树 | — | [链接](https://leetcode.cn/problems/invert-binary-tree/) |
| 543 | 二叉树的直径 | — | [链接](https://leetcode.cn/problems/diameter-of-binary-tree/) |
| 563 | 二叉树的坡度 | — | [链接](https://leetcode.cn/problems/binary-tree-tilt/) |
| 572 | 另一棵树的子树 | 做到 O(n) | [链接](https://leetcode.cn/problems/subtree-of-another-tree/) |
| 617 | 合并二叉树 | — | [链接](https://leetcode.cn/problems/merge-two-binary-trees/) |
| 687 | 最长同值路径 | — | [链接](https://leetcode.cn/problems/longest-univalue-path/) |
| 965 | 单值二叉树 | 1178 | [链接](https://leetcode.cn/problems/univalued-binary-tree/) |
| 124 | 二叉树中的最大路径和 | — | [链接](https://leetcode.cn/problems/binary-tree-maximum-path-sum/) |
| 1339 | 分裂二叉树的最大乘积 | 1675 | [链接](https://leetcode.cn/problems/maximum-product-of-splitted-binary-tree/) |
| 1530 | 好叶子节点对的数量 | 低于 O(n²) | [链接](https://leetcode.cn/problems/number-of-good-leaf-nodes-pairs/) |
| 2265 | 统计值等于子树平均值的节点数 | 1473 | [链接](https://leetcode.cn/problems/count-nodes-with-average-value-of-subtree/) |

#### §2.4 自底向上 DFS：删点

| 题号 | 题目名称 | 难度分 | 链接 |
|------|---------|--------|------|
| 814 | 二叉树剪枝 | 1380 | [链接](https://leetcode.cn/problems/binary-tree-pruning/) |
| 1110 | 删点成林 | 1511 | [链接](https://leetcode.cn/problems/delete-nodes-and-return-forest/) |
| 1325 | 删除给定值的叶子节点 | 1407 | [链接](https://leetcode.cn/problems/delete-leaves-with-a-given-value/) |

#### §2.5 有递有归

| 题号 | 题目名称 | 难度分 | 链接 |
|------|---------|--------|------|
| 538 | 把二叉搜索树转换为累加树 | 1375 | [链接](https://leetcode.cn/problems/convert-bst-to-greater-tree/) |
| 865 | 具有所有最深节点的最小子树 | 1534 | [链接](https://leetcode.cn/problems/smallest-subtree-with-all-the-deepest-nodes/) |
| 1038 | 从二叉搜索树到更大和树 | 同 538 | [链接](https://leetcode.cn/problems/binary-search-tree-to-greater-sum-tree/) |
| 1080 | 根到叶路径上的不足节点 | 1805 | [链接](https://leetcode.cn/problems/insufficient-nodes-in-root-to-leaf-paths/) |

#### §2.6 二叉树的直径

| 题号 | 题目名称 | 难度分 | 链接 |
|------|---------|--------|------|
| 124 | 二叉树中的最大路径和 | — | [链接](https://leetcode.cn/problems/binary-tree-maximum-path-sum/) |
| 543 | 二叉树的直径 | — | [链接](https://leetcode.cn/problems/diameter-of-binary-tree/) |
| 687 | 最长同值路径 | — | [链接](https://leetcode.cn/problems/longest-univalue-path/) |
| 2385 | 感染二叉树需要的总时间 | 1711 | [链接](https://leetcode.cn/problems/amount-of-time-for-binary-tree-to-be-infected/) |

#### §2.7 回溯（二叉树路径）

| 题号 | 题目名称 | 难度分 | 链接 |
|------|---------|--------|------|
| 113 | 路径总和 II | — | [链接](https://leetcode.cn/problems/path-sum-ii/) |
| 257 | 二叉树的所有路径 | — | [链接](https://leetcode.cn/problems/binary-tree-paths/) |
| 437 | 路径总和 III | — | [链接](https://leetcode.cn/problems/path-sum-iii/) |
| 1457 | 二叉树中的伪回文路径 | 1405 | [链接](https://leetcode.cn/problems/pseudo-palindromic-paths-in-a-binary-tree/) |

#### §2.8 最近公共祖先

| 题号 | 题目名称 | 难度分 | 链接 |
|------|---------|--------|------|
| 235 | 二叉搜索树的最近公共祖先 | — | [链接](https://leetcode.cn/problems/lowest-common-ancestor-of-a-binary-search-tree/) |
| 236 | 二叉树的最近公共祖先 | — | [链接](https://leetcode.cn/problems/lowest-common-ancestor-of-a-binary-tree/) |
| 1123 | 最深叶节点的最近公共祖先 | 1607 | [链接](https://leetcode.cn/problems/lowest-common-ancestor-of-deepest-leaves/) |
| 2096 | 从二叉树一个节点到另一个节点每一步的方向 | 1805 | [链接](https://leetcode.cn/problems/step-by-step-directions-from-a-binary-tree-node-to-another/) |

#### §2.9 二叉搜索树

> 一般是中序遍历。

| 题号 | 题目名称 | 难度分 | 链接 |
|------|---------|--------|------|
| 700 | 二叉搜索树中的搜索 | — | [链接](https://leetcode.cn/problems/search-in-a-binary-search-tree/) |
| 530 | 二叉搜索树的最小绝对差 | 1303 | [链接](https://leetcode.cn/problems/minimum-absolute-difference-in-bst/) |
| 653 | 两数之和 IV - 输入 BST | — | [链接](https://leetcode.cn/problems/two-sum-iv-input-is-a-bst/) |
| 783 | 二叉搜索树节点最小距离 | 同 530 | [链接](https://leetcode.cn/problems/minimum-distance-between-bst-nodes/) |
| 938 | 二叉搜索树的范围和 | 1335 | [链接](https://leetcode.cn/problems/range-sum-of-bst/) |
| 230 | 二叉搜索树中第 K 小的元素 | — | [链接](https://leetcode.cn/problems/kth-smallest-element-in-a-bst/) |
| 450 | 删除二叉搜索树中的节点 | — | [链接](https://leetcode.cn/problems/delete-node-in-a-bst/) |
| 501 | 二叉搜索树中的众数 | — | [链接](https://leetcode.cn/problems/find-mode-in-binary-search-tree/) |
| 701 | 二叉搜索树中的插入操作 | — | [链接](https://leetcode.cn/problems/insert-into-a-binary-search-tree/) |
| 938 | 二叉搜索树的范围和 | 1335 | [链接](https://leetcode.cn/problems/range-sum-of-bst/) |
| 98 | 验证二叉搜索树 | 有前序/中序/后序三种做法 | [链接](https://leetcode.cn/problems/validate-binary-search-tree/) |
| 99 | 恢复二叉搜索树 | — | [链接](https://leetcode.cn/problems/recover-binary-search-tree/) |
| 235 | 二叉搜索树的最近公共祖先 | — | [链接](https://leetcode.cn/problems/lowest-common-ancestor-of-a-binary-search-tree/) |
| 2476 | 二叉搜索树最近节点查询 | 1597 | [链接](https://leetcode.cn/problems/closest-nodes-queries-in-a-binary-search-tree/) |
| 897 | 递增顺序搜索树 | 1473 | [链接](https://leetcode.cn/problems/increasing-order-search-tree/) |

#### §2.10 创建二叉树

| 题号 | 题目名称 | 难度分 | 链接 |
|------|---------|--------|------|
| 105 | 从前序与中序遍历序列构造二叉树 | — | [链接](https://leetcode.cn/problems/construct-binary-tree-from-preorder-and-inorder-traversal/) |
| 106 | 从中序与后序遍历序列构造二叉树 | — | [链接](https://leetcode.cn/problems/construct-binary-tree-from-inorder-and-postorder-traversal/) |
| 108 | 将有序数组转换为二叉搜索树 | — | [链接](https://leetcode.cn/problems/convert-sorted-array-to-binary-search-tree/) |
| 654 | 最大二叉树 | — | [链接](https://leetcode.cn/problems/maximum-binary-tree/) |
| 889 | 根据前序和后序遍历构造二叉树 | 1732 | [链接](https://leetcode.cn/problems/construct-binary-tree-from-preorder-and-postorder-traversal/) |
| 1382 | 将二叉搜索树变平衡 | — | [链接](https://leetcode.cn/problems/balance-a-binary-search-tree/) |
| 2196 | 根据描述创建二叉树 | 1644 | [链接](https://leetcode.cn/problems/create-binary-tree-from-descriptions/) |

#### §2.11 插入/删除节点

| 题号 | 题目名称 | 难度分 | 链接 |
|------|---------|--------|------|
| 450 | 删除二叉搜索树中的节点 | — | [链接](https://leetcode.cn/problems/delete-node-in-a-bst/) |
| 669 | 修剪二叉搜索树 | — | [链接](https://leetcode.cn/problems/trim-a-binary-search-tree/) |
| 701 | 二叉搜索树中的插入操作 | — | [链接](https://leetcode.cn/problems/insert-into-a-binary-search-tree/) |

#### §2.12 树形 DP

| 题号 | 题目名称 | 难度分 | 链接 |
|------|---------|--------|------|
| 337 | 打家劫舍 III | — | [链接](https://leetcode.cn/problems/house-robber-iii/) |
| 968 | 监控二叉树 | — | [链接](https://leetcode.cn/problems/binary-tree-cameras/) |

#### §2.13 二叉树 BFS

| 题号 | 题目名称 | 难度分 | 链接 |
|------|---------|--------|------|
| 102 | 二叉树的层序遍历 | — | [链接](https://leetcode.cn/problems/binary-tree-level-order-traversal/) |
| 103 | 二叉树的锯齿形层序遍历 | — | [链接](https://leetcode.cn/problems/binary-tree-zigzag-level-order-traversal/) |
| 107 | 二叉树的层序遍历 II | — | [链接](https://leetcode.cn/problems/binary-tree-level-order-traversal-ii/) |
| 199 | 二叉树的右视图 | 也可以 DFS | [链接](https://leetcode.cn/problems/binary-tree-right-side-view/) |
| 513 | 找树左下角的值 | — | [链接](https://leetcode.cn/problems/find-bottom-left-tree-value/) |
| 515 | 在每个树行中找最大值 | — | [链接](https://leetcode.cn/problems/find-largest-value-in-each-tree-row/) |
| 637 | 二叉树的层平均值 | — | [链接](https://leetcode.cn/problems/average-of-levels-in-binary-tree/) |
| 993 | 二叉树的堂兄弟节点 | 1288 | [链接](https://leetcode.cn/problems/cousins-in-binary-tree/) |
| 1161 | 最大层内元素和 | 1250 | [链接](https://leetcode.cn/problems/maximum-level-sum-of-a-binary-tree/) |
| 1302 | 层数最深叶子节点的和 | 1388 | [链接](https://leetcode.cn/problems/deepest-leaves-sum/) |

#### §2.14 链表+二叉树

| 题号 | 题目名称 | 难度分 | 链接 |
|------|---------|--------|------|
| 109 | 有序链表转换二叉搜索树 | — | [链接](https://leetcode.cn/problems/convert-sorted-list-to-binary-search-tree/) |
| 114 | 二叉树展开为链表 | — | [链接](https://leetcode.cn/problems/flatten-binary-tree-to-linked-list/) |

### 三、一般树

#### §3.1 树的遍历

| 题号 | 题目名称 | 难度分 | 链接 |
|------|---------|--------|------|
| 1376 | 通知所有员工所需的时间 | 1561 | [链接](https://leetcode.cn/problems/time-needed-to-inform-all-employees/) |
| 1466 | 重新规划路线 | 1634 | [链接](https://leetcode.cn/problems/reorder-routes-to-make-all-paths-lead-to-the-city-zero/) |
| 1443 | 收集树上所有苹果的最少时间 | 1683 | [链接](https://leetcode.cn/problems/minimum-time-to-collect-all-apples-in-a-tree/) |

#### §3.5 树的直径

| 题号 | 题目名称 | 难度分 | 链接 |
|------|---------|--------|------|
| 2246 | 相邻字符不同的最长路径 | 2126 | [链接](https://leetcode.cn/problems/longest-path-with-different-adjacent-characters/) |
| 310 | 最小高度树 | — | [链接](https://leetcode.cn/problems/minimum-height-trees/) |

### 四、回溯

> 本质是搜索树上的 DFS。推荐先完成二叉树的 §2.7 节，理解二叉树上的回溯，再来学习一般情况下的回溯。

#### §4.1 子集型回溯（选或不选）

| 题号 | 题目名称 | 难度分 | 链接 |
|------|---------|--------|------|
| 17 | 电话号码的字母组合 | — | [链接](https://leetcode.cn/problems/letter-combinations-of-a-phone-number/) |
| 78 | 子集 | — | [链接](https://leetcode.cn/problems/subsets/) |
| 784 | 字母大小写全排列 | — | [链接](https://leetcode.cn/problems/letter-case-permutation/) |
| 1239 | 串联字符串的最大长度 | 1720 | [链接](https://leetcode.cn/problems/maximum-length-of-a-concatenated-string-with-unique-characters/) |
| 1863 | 找出所有子集的异或总和再求和 | 1372 | [链接](https://leetcode.cn/problems/sum-of-all-subset-xor-totals/) |
| 2044 | 统计按位或能得到最大值的子集数目 | 1568 | [链接](https://leetcode.cn/problems/count-number-of-maximum-bitwise-or-subsets/) |
| 2597 | 美丽子集的数目 | 2023 | [链接](https://leetcode.cn/problems/the-number-of-beautiful-subsets/) |

#### §4.2 划分型回溯

| 题号 | 题目名称 | 难度分 | 链接 |
|------|---------|--------|------|
| 93 | 复原 IP 地址 | — | [链接](https://leetcode.cn/problems/restore-ip-addresses/) |
| 131 | 分割回文串 | — | [链接](https://leetcode.cn/problems/palindrome-partitioning/) |
| 140 | 单词拆分 II | — | [链接](https://leetcode.cn/problems/word-break-ii/) |
| 1593 | 拆分字符串使唯一子字符串的数目最大 | 1740 | [链接](https://leetcode.cn/problems/maximum-number-of-non-overlapping-substrings/) |
| 2698 | 求一个整数的惩罚数 | 1679 | [链接](https://leetcode.cn/problems/find-the-punishment-number-of-an-integer/) |

#### §4.3 组合型回溯

| 题号 | 题目名称 | 难度分 | 链接 |
|------|---------|--------|------|
| 22 | 括号生成 | — | [链接](https://leetcode.cn/problems/generate-parentheses/) |
| 39 | 组合总和 | — | [链接](https://leetcode.cn/problems/combination-sum/) |
| 77 | 组合 | — | [链接](https://leetcode.cn/problems/combinations/) |
| 216 | 组合总和 III | — | [链接](https://leetcode.cn/problems/combination-sum-iii/) |
| 301 | 删除无效的括号 | — | [链接](https://leetcode.cn/problems/remove-invalid-parentheses/) |

#### §4.4 排列型回溯

| 题号 | 题目名称 | 难度分 | 链接 |
|------|---------|--------|------|
| 37 | 解数独 | — | [链接](https://leetcode.cn/problems/sudoku-solver/) |
| 46 | 全排列 | — | [链接](https://leetcode.cn/problems/permutations/) |
| 51 | N 皇后 | — | [链接](https://leetcode.cn/problems/n-queens/) |
| 52 | N 皇后 II | — | [链接](https://leetcode.cn/problems/n-queens-ii/) |
| 1718 | 构建字典序最大的可行序列 | 2080 | [链接](https://leetcode.cn/problems/construct-the-lexicographically-largest-valid-sequence/) |

#### §4.5 有重复元素的回溯

| 题号 | 题目名称 | 难度分 | 链接 |
|------|---------|--------|------|
| 40 | 组合总和 II | — | [链接](https://leetcode.cn/problems/combination-sum-ii/) |
| 47 | 全排列 II | — | [链接](https://leetcode.cn/problems/permutations-ii/) |
| 90 | 子集 II | — | [链接](https://leetcode.cn/problems/subsets-ii/) |
| 491 | 非递减子序列 | — | [链接](https://leetcode.cn/problems/non-decreasing-subsequences/) |

#### §4.6 搜索

| 题号 | 题目名称 | 难度分 | 链接 |
|------|---------|--------|------|
| 79 | 单词搜索 | — | [链接](https://leetcode.cn/problems/word-search/) |
| 212 | 单词搜索 II | — | [链接](https://leetcode.cn/problems/word-search-ii/) |
| 488 | 祖玛游戏 | — | [链接](https://leetcode.cn/problems/zuma-game/) |
| 679 | 24 点游戏 | — | [链接](https://leetcode.cn/problems/24-game/) |
| 691 | 贴纸拼词 | — | [链接](https://leetcode.cn/problems/stickers-to-spell-word/) |
| 980 | 不同路径 III | 1830 | [链接](https://leetcode.cn/problems/unique-paths-iii/) |
| 1219 | 黄金矿工 | 1663 | [链接](https://leetcode.cn/problems/path-with-maximum-gold/) |
| 1255 | 得分最高的单词集合 | 1882 | [链接](https://leetcode.cn/problems/maximum-score-words-formed-by-letters/) |

#### §4.7 折半枚举（Meet in the Middle）

| 题号 | 题目名称 | 难度分 | 链接 |
|------|---------|--------|------|
| 494 | 目标和 | — | [链接](https://leetcode.cn/problems/target-sum/) |
| 805 | 数组的均值分割 | 1983 | [链接](https://leetcode.cn/problems/split-array-with-same-average/) |
| 1755 | 最接近目标值的子序列和 | 2364 | [链接](https://leetcode.cn/problems/closest-subsequence-sum/) |
| 2035 | 将数组分成两个数组并最小化数组和的差 | 2490 | [链接](https://leetcode.cn/problems/minimum-difference-in-sums-after-removal-of-elements/) |

---

## 7. 题单五：网格图

### 一、网格图 DFS

> 适用于需要计算连通块个数、大小的题目。

| 题号 | 题目名称 | 难度分 | 链接 |
|------|---------|--------|------|
| 200 | 岛屿数量 | — | [链接](https://leetcode.cn/problems/number-of-islands/) |
| 463 | 岛屿的周长 | — | [链接](https://leetcode.cn/problems/island-perimeter/) |
| 529 | 扫雷游戏 | — | [链接](https://leetcode.cn/problems/minesweeper/) |
| 695 | 岛屿的最大面积 | — | [链接](https://leetcode.cn/problems/max-area-of-island/) |
| 733 | 图像渲染 | — | [链接](https://leetcode.cn/problems/flood-fill/) |
| 1020 | 飞地的数量 | 1615 | [链接](https://leetcode.cn/problems/number-of-enclaves/) |
| 1034 | 边界着色 | 1579 | [链接](https://leetcode.cn/problems/coloring-a-border/) |
| 1254 | 统计封闭岛屿的数目 | 1659 | [链接](https://leetcode.cn/problems/number-of-closed-islands/) |
| 130 | 被围绕的区域 | — | [链接](https://leetcode.cn/problems/surrounded-regions/) |
| 1391 | 检查网格中是否存在有效路径 | 1746 | [链接](https://leetcode.cn/problems/check-if-there-is-a-valid-path-in-a-grid/) |
| 1559 | 二维网格图中探测环 | 1838 | [链接](https://leetcode.cn/problems/detect-cycles-in-2d-grid/) |
| 1905 | 统计子岛屿 | 1679 | [链接](https://leetcode.cn/problems/count-sub-islands/) |
| 2658 | 网格图中鱼的最大数目 | 1490 | [链接](https://leetcode.cn/problems/maximum-number-of-fish-in-a-grid/) |

### 二、网格图 BFS

> 适用于需要计算最短距离（最短路）的题目。
>
> DFS 是不撞南墙不回头；BFS 是往水塘中扔石头（起点），荡起一圈圈涟漪（先访问近的，再访问远的）。

| 题号 | 题目名称 | 难度分 | 链接 |
|------|---------|--------|------|
| 542 | 01 矩阵 | — | [链接](https://leetcode.cn/problems/01-matrix/) |
| 994 | 腐烂的橘子 | — | [链接](https://leetcode.cn/problems/rotting-oranges/) |
| 1091 | 二进制矩阵中的最短路径 | 1658 | [链接](https://leetcode.cn/problems/shortest-path-in-binary-matrix/) |
| 1162 | 地图分析 | 1666 | [链接](https://leetcode.cn/problems/as-far-from-land-as-possible/) |
| 1765 | 地图中的最高点 | 1783 | [链接](https://leetcode.cn/problems/map-of-highest-peak/) |
| 1926 | 迷宫中离入口最近的出口 | 1638 | [链接](https://leetcode.cn/problems/nearest-exit-from-entrance-in-maze/) |
| 934 | 最短的桥 | 1826 | [链接](https://leetcode.cn/problems/shortest-bridge/) |
| 1210 | 穿过迷宫的最少移动次数 | 2022 | [链接](https://leetcode.cn/problems/minimum-moves-to-reach-target-with-rotations/) |
| 1293 | 网格中的最短路径 | 1967 | [链接](https://leetcode.cn/problems/shortest-path-in-a-grid-with-obstacles-elimination/) |

### 三、综合应用

| 题号 | 题目名称 | 难度分 | 链接 |
|------|---------|--------|------|
| 329 | 矩阵中的最长递增路径 | — | [链接](https://leetcode.cn/problems/longest-increasing-path-in-a-matrix/) |
| 778 | 水位上升的泳池中游泳 | 2097 | [链接](https://leetcode.cn/problems/swim-in-rising-water/) |
| 864 | 获取所有钥匙的最短路径 | 2259 | [链接](https://leetcode.cn/problems/shortest-path-to-get-all-keys/) |
| 1036 | 逃离大迷宫 | 2165 | [链接](https://leetcode.cn/problems/escape-a-large-maze/) |
| 1631 | 最小体力消耗路径 | 1948 | [链接](https://leetcode.cn/problems/path-with-minimum-effort/) |
| 2258 | 逃离火灾 | 2347 | [链接](https://leetcode.cn/problems/escape-the-spreading-fire/) |
| 2556 | 二进制矩阵中翻转最多一次使路径不连通 | 2369 | [链接](https://leetcode.cn/problems/disconnect-path-in-a-binary-matrix-by-at-most-one-flip/) |

---

## 8. 题单六：动态规划

> **掌握动态规划是没有捷径的，唯有坚持多练，至少要做 100 道才算入门。**
>
> 推荐先学习 **记忆化搜索**，它是新手村神器。

### 一、入门 DP

#### §1.1 爬楼梯

| 题号 | 题目名称 | 难度分 | 链接 |
|------|---------|--------|------|
| 70 | 爬楼梯 | — | [链接](https://leetcode.cn/problems/climbing-stairs/) |
| 377 | 组合总和 IV | ~1600 | [链接](https://leetcode.cn/problems/combination-sum-iv/) |
| 746 | 使用最小花费爬楼梯 | ~1500 | [链接](https://leetcode.cn/problems/min-cost-climbing-stairs/) |
| 2266 | 统计打字方案数 | 1857 | [链接](https://leetcode.cn/problems/count-number-of-texts/) |
| 2466 | 统计构造好字符串的方案数 | 1694 | [链接](https://leetcode.cn/problems/count-ways-to-build-good-strings/) |

#### §1.2 打家劫舍

| 题号 | 题目名称 | 难度分 | 链接 |
|------|---------|--------|------|
| 198 | 打家劫舍 | — | [链接](https://leetcode.cn/problems/house-robber/) |
| 213 | 打家劫舍 II | 环形数组 | [链接](https://leetcode.cn/problems/house-robber-ii/) |
| 740 | 删除并获得点数 | — | [链接](https://leetcode.cn/problems/delete-and-earn/) |
| 2320 | 统计放置房子的方式数 | 1608 | [链接](https://leetcode.cn/problems/count-number-of-ways-to-place-houses/) |

#### §1.3 最大子数组和

| 题号 | 题目名称 | 难度分 | 链接 |
|------|---------|--------|------|
| 53 | 最大子数组和 | — | [链接](https://leetcode.cn/problems/maximum-subarray/) |
| 918 | 环形子数组的最大和 | 1777 | [链接](https://leetcode.cn/problems/maximum-sum-circular-subarray/) |
| 1749 | 任意子数组和的绝对值的最大值 | 1542 | [链接](https://leetcode.cn/problems/maximum-absolute-sum-of-any-subarray/) |
| 2606 | 找到最大开销的子字符串 | 1422 | [链接](https://leetcode.cn/problems/find-the-substring-with-maximum-cost/) |

### 二、网格图 DP

| 题号 | 题目名称 | 难度分 | 链接 |
|------|---------|--------|------|
| 62 | 不同路径 | — | [链接](https://leetcode.cn/problems/unique-paths/) |
| 63 | 不同路径 II | — | [链接](https://leetcode.cn/problems/unique-paths-ii/) |
| 64 | 最小路径和 | — | [链接](https://leetcode.cn/problems/minimum-path-sum/) |
| 120 | 三角形最小路径和 | — | [链接](https://leetcode.cn/problems/triangle/) |
| 931 | 下降路径最小和 | 1573 | [链接](https://leetcode.cn/problems/minimum-falling-path-sum/) |
| 1289 | 下降路径最小和 II | 1697 | [链接](https://leetcode.cn/problems/minimum-falling-path-sum-ii/) |
| 1463 | 摘樱桃 II | — | [链接](https://leetcode.cn/problems/cherry-pickup-ii/) |
| 2304 | 网格中的最小路径代价 | 1658 | [链接](https://leetcode.cn/problems/minimum-path-cost-in-a-grid/) |

### 三、背包

#### §3.1 0-1 背包

| 题号 | 题目名称 | 难度分 | 链接 |
|------|---------|--------|------|
| 416 | 分割等和子集 | — | [链接](https://leetcode.cn/problems/partition-equal-subset-sum/) |
| 494 | 目标和 | — | [链接](https://leetcode.cn/problems/target-sum/) |
| 2915 | 和为目标值的最长子序列的长度 | 1659 | [链接](https://leetcode.cn/problems/length-of-the-longest-subsequence-that-sums-to-target/) |
| 3180 | 执行操作可获得的最大总奖励 I | 1849 | [链接](https://leetcode.cn/problems/maximum-total-reward-using-operations-i/) |

#### §3.2 完全背包

| 题号 | 题目名称 | 难度分 | 链接 |
|------|---------|--------|------|
| 279 | 完全平方数 | — | [链接](https://leetcode.cn/problems/perfect-squares/) |
| 322 | 零钱兑换 | — | [链接](https://leetcode.cn/problems/coin-change/) |
| 518 | 零钱兑换 II | — | [链接](https://leetcode.cn/problems/coin-change-ii/) |

### 四、经典线性 DP

#### §4.1 最长公共子序列（LCS）

| 题号 | 题目名称 | 难度分 | 链接 |
|------|---------|--------|------|
| 72 | 编辑距离 | — | [链接](https://leetcode.cn/problems/edit-distance/) |
| 583 | 两个字符串的删除操作 | — | [链接](https://leetcode.cn/problems/delete-operation-for-two-strings/) |
| 1143 | 最长公共子序列 | — | [链接](https://leetcode.cn/problems/longest-common-subsequence/) |
| 1035 | 不相交的线 | 1806 | [链接](https://leetcode.cn/problems/uncrossed-lines/) |

#### §4.2 最长递增子序列（LIS）

| 题号 | 题目名称 | 难度分 | 链接 |
|------|---------|--------|------|
| 300 | 最长递增子序列 | — | [链接](https://leetcode.cn/problems/longest-increasing-subsequence/) |
| 334 | 递增的三元子序列 | — | [链接](https://leetcode.cn/problems/increasing-triplet-subsequence/) |
| 354 | 俄罗斯套娃信封问题 | — | [链接](https://leetcode.cn/problems/russian-doll-envelopes/) |
| 673 | 最长递增子序列的个数 | — | [链接](https://leetcode.cn/problems/number-of-longest-increasing-subsequence/) |
| 2407 | 最长递增子序列 II | 2280 | [链接](https://leetcode.cn/problems/longest-increasing-subsequence-ii/) |

### 五、划分型 DP

#### §5.1 判定能否划分

> 一般定义 `f[i]` 表示长为 `i` 的前缀 `a[:i]` 能否划分。枚举最后一个子数组的左端点 `L`，从 `f[L]` 转移到 `f[i]`，并考虑 `a[L:i]` 是否满足要求。

| 题号 | 题目名称 | 难度分 | 链接 |
|------|---------|--------|------|
| 2369 | 检查数组是否存在有效划分 | 1780 | [链接](https://leetcode.cn/problems/check-if-there-is-a-valid-partition-for-the-array/) |
| 139 | 单词拆分 | — | [链接](https://leetcode.cn/problems/word-break/) |

#### §5.2 最优划分

> 计算最少/最多可以划分出多少段、最优划分得分等。一般定义 `f[i]` 表示长为 `i` 的前缀 `a[:i]` 在题目约束下，分割出的最少（最多）子数组个数。

| 题号 | 题目名称 | 难度分 | 链接 |
|------|---------|--------|------|
| 132 | 分割回文串 II | — | [链接](https://leetcode.cn/problems/palindrome-partitioning-ii/) |
| 2707 | 字符串中的额外字符 | 1736 | [链接](https://leetcode.cn/problems/extra-characters-in-a-string/) |
| 91 | 解码方法 | — | [链接](https://leetcode.cn/problems/decode-ways/) |
| 639 | 解码方法 II | — | [链接](https://leetcode.cn/problems/decode-ways-ii/) |
| 1043 | 分隔数组以得到最大和 | 1916 | [链接](https://leetcode.cn/problems/partition-array-for-maximum-sum/) |
| 1105 | 填充书架 | 2014 | [链接](https://leetcode.cn/problems/filling-bookcase-shelves/) |
| 2430 | 对字母串可执行的最大删除数 | 2102 | [链接](https://leetcode.cn/problems/maximum-deletions-on-a-string/) |

#### §5.3 约束划分个数

> 将数组分成（恰好/至多）k 个连续子数组。一般定义 `f[i][j]` 表示将长为 `j` 的前缀 `a[:j]` 分成 `i` 个连续子数组所得到的最优解。

| 题号 | 题目名称 | 难度分 | 链接 |
|------|---------|--------|------|
| 410 | 分割数组的最大值 | — | [链接](https://leetcode.cn/problems/split-array-largest-sum/) |
| 813 | 最大平均值和的分组 | 1937 | [链接](https://leetcode.cn/problems/largest-sum-of-averages/) |
| 1335 | 工作计划的最低难度 | 2035 | [链接](https://leetcode.cn/problems/minimum-difficulty-of-a-job-schedule/) |
| 1473 | 粉刷房子 III | 2056 | [链接](https://leetcode.cn/problems/paint-house-iii/) |
| 1745 | 分割回文串 IV | — | [链接](https://leetcode.cn/problems/palindrome-partitioning-iv/) |
| 1278 | 分割回文串 III | 1979 | [链接](https://leetcode.cn/problems/palindrome-partitioning-iii/) |
| 3077 | K 个不相交子数组的最大能量值 | 2557 | [链接](https://leetcode.cn/problems/maximum-strength-of-k-disjoint-subarrays/) |

### 六、状态机 DP

> 一般定义 `f[i][j]` 表示前缀 `a[:i]` 在状态 `j` 下的最优值。`j` 一般很小。

#### §6.1 买卖股票

| 题号 | 题目名称 | 难度分 | 链接 |
|------|---------|--------|------|
| 121 | 买卖股票的最佳时机 | 交易 1 次 | [链接](https://leetcode.cn/problems/best-time-to-buy-and-sell-stock/) |
| 122 | 买卖股票的最佳时机 II | 交易次数不限 | [链接](https://leetcode.cn/problems/best-time-to-buy-and-sell-stock-ii/) |
| 123 | 买卖股票的最佳时机 III | 交易 2 次 | [链接](https://leetcode.cn/problems/best-time-to-buy-and-sell-stock-iii/) |
| 188 | 买卖股票的最佳时机 IV | 交易 k 次 | [链接](https://leetcode.cn/problems/best-time-to-buy-and-sell-stock-iv/) |
| 309 | 买卖股票的最佳时机含冷冻期 | 交易次数不限 | [链接](https://leetcode.cn/problems/best-time-to-buy-and-sell-stock-with-cooldown/) |
| 714 | 买卖股票的最佳时机含手续费 | 交易次数不限 | [链接](https://leetcode.cn/problems/best-time-to-buy-and-sell-stock-with-transaction-fee/) |

#### §6.2 基础

| 题号 | 题目名称 | 难度分 | 链接 |
|------|---------|--------|------|
| 376 | 摆动序列 | — | [链接](https://leetcode.cn/problems/wiggle-subsequence/) |
| 1567 | 乘积为正数的最长子数组长度 | 1710 | [链接](https://leetcode.cn/problems/maximum-length-of-subarray-with-positive-product/) |
| 1911 | 最大交替子序列和 | 1786 | [链接](https://leetcode.cn/problems/maximum-alternating-subsequence-sum/) |
| 2786 | 访问数组中的位置使分数最大 | 1733 | [链接](https://leetcode.cn/problems/visit-array-positions-to-maximize-score/) |
| 3259 | 超级饮料的最大强化能量 | 1484 | [链接](https://leetcode.cn/problems/maximum-energy-boost-from-two-drinks/) |

#### §6.3 进阶

| 题号 | 题目名称 | 难度分 | 链接 |
|------|---------|--------|------|
| 801 | 使序列递增的最小交换次数 | 2066 | [链接](https://leetcode.cn/problems/minimum-swaps-to-make-sequences-increasing/) |
| 935 | 骑士拨号器 | — | [链接](https://leetcode.cn/problems/knight-dialer/) |
| 1186 | 删除一次得到子数组最大和 | 1799 | [链接](https://leetcode.cn/problems/maximum-subarray-sum-with-one-deletion/) |
| 1537 | 最大得分 | 1961 | [链接](https://leetcode.cn/problems/get-the-maximum-score/) |
| 1594 | 矩阵的最大非负积 | 1807 | [链接](https://leetcode.cn/problems/maximum-non-negative-product-in-a-matrix/) |
| 2272 | 最大波动的子字符串 | 2516 | [链接](https://leetcode.cn/problems/substring-with-largest-variance/) |
| LCP 19 | 秋叶收藏集 | — | [链接](https://leetcode.cn/problems/UlBDOe/) |

### 七、区间 DP

> 从数组的左右两端不断缩短，求解关于某段下标区间的最优值。一般定义 `f[i][j]` 表示下标区间 `[i,j]` 的最优值。

#### §7.1 最长回文子序列

| 题号 | 题目名称 | 难度分 | 链接 |
|------|---------|--------|------|
| 516 | 最长回文子序列 | — | [链接](https://leetcode.cn/problems/longest-palindromic-subsequence/) |
| 1312 | 让字符串成为回文串的最少插入次数 | 1787 | [链接](https://leetcode.cn/problems/minimum-insertion-steps-to-make-a-string-palindrome/) |
| 1771 | 由子序列构造的最长回文串的长度 | 2182 | [链接](https://leetcode.cn/problems/maximize-palindrome-length-from-subsequences/) |

#### §7.2 区间 DP 综合

| 题号 | 题目名称 | 难度分 | 链接 |
|------|---------|--------|------|
| 5 | 最长回文子串 | — | [链接](https://leetcode.cn/problems/longest-palindromic-substring/) |
| 647 | 回文子串 | — | [链接](https://leetcode.cn/problems/palindromic-substrings/) |
| 96 | 不同的二叉搜索树 | — | [链接](https://leetcode.cn/problems/unique-binary-search-trees/) |
| 312 | 戳气球 | — | [链接](https://leetcode.cn/problems/burst-balloons/) |
| 375 | 猜数字大小 II | — | [链接](https://leetcode.cn/problems/guess-number-higher-or-lower-ii/) |
| 546 | 移除盒子 | — | [链接](https://leetcode.cn/problems/remove-boxes/) |
| 664 | 奇怪的打印机 | — | [链接](https://leetcode.cn/problems/strange-printer/) |
| 87 | 扰乱字符串 | — | [链接](https://leetcode.cn/problems/scramble-string/) |
| 943 | 最短超级串 | 2186 | [链接](https://leetcode.cn/problems/find-the-shortest-superstring/) |
| 1039 | 多边形三角剖分的最低得分 | 2130 | [链接](https://leetcode.cn/problems/minimum-score-triangulation-of-polygon/) |
| 1130 | 叶值的最小代价生成树 | 1919 | [链接](https://leetcode.cn/problems/minimum-cost-tree-from-leaf-values/) |
| 1547 | 切棍子的最小成本 | 2116 | [链接](https://leetcode.cn/problems/minimum-cost-to-cut-a-stick/) |
| 1770 | 执行乘法运算的最大分数 | 2068 | [链接](https://leetcode.cn/problems/maximum-score-from-performing-multiplication-operations/) |

### 八、状态压缩 DP（状压 DP）

> 状压 DP 可以把枚举排列的 O(n!) 时间复杂度优化至 O(n·2^n)，可解决 n ≤ 20 的问题。

#### §8.1 排列型状压 DP（相邻无关）

| 题号 | 题目名称 | 难度分 | 链接 |
|------|---------|--------|------|
| 526 | 优美的排列 | — | [链接](https://leetcode.cn/problems/beautiful-arrangement/) |
| 1799 | N 次操作后的最大分数和 | — | [链接](https://leetcode.cn/problems/maximize-score-after-n-operations/) |
| 1879 | 两个数组最小的异或值之和 | 2145 | [链接](https://leetcode.cn/problems/minimum-xor-sum-of-two-arrays/) |
| 1947 | 最大兼容性评分和 | — | [链接](https://leetcode.cn/problems/maximum-compatibility-score-sum/) |
| 2172 | 数组的最大与和 | 2392 | [链接](https://leetcode.cn/problems/maximum-and-sum-of-array/) |
| 2850 | 将石头分散到网格图的最少移动次数 | — | [链接](https://leetcode.cn/problems/minimum-moves-to-spread-stones-over-grid/) |
| 3376 | 破解锁的最少时间 I | — | [链接](https://leetcode.cn/problems/minimum-time-to-break-locks-i/) |

#### §8.2 子集状压 DP

| 题号 | 题目名称 | 难度分 | 链接 |
|------|---------|--------|------|
| 1494 | 并行课程 II | — | [链接](https://leetcode.cn/problems/parallel-courses-ii/) |
| 1655 | 分配重复整数 | 2307 | [链接](https://leetcode.cn/problems/distribute-repeating-integers/) |
| 1723 | 完成所有工作的最短时间 | 2284 | [链接](https://leetcode.cn/problems/find-minimum-time-to-finish-all-jobs/) |
| 1986 | 完成任务的最少工作时间段 | 1995 | [链接](https://leetcode.cn/problems/minimum-number-of-work-sessions-to-finish-the-tasks/) |
| 1994 | 好子集的数目 | 2465 | [链接](https://leetcode.cn/problems/the-number-of-good-subsets/) |
| 2305 | 公平分发饼干 | 1887 | [链接](https://leetcode.cn/problems/fair-distribution-of-cookies/) |
| 2572 | 无平方子集计数 | 2420 | [链接](https://leetcode.cn/problems/count-the-number-of-square-free-subsets/) |
| 1349 | 参加考试的最大学生数 | 2386 | [链接](https://leetcode.cn/problems/maximum-students-taking-exam/) |

#### §8.3 轮廓线 DP

| 题号 | 题目名称 | 难度分 | 链接 |
|------|---------|--------|------|
| 1411 | 给 N x 3 网格图涂色的方案数 | 1845 | [链接](https://leetcode.cn/problems/number-of-ways-to-paint-n-3-grid/) |
| 1931 | 用三种不同颜色为网格涂色 | 2170 | [链接](https://leetcode.cn/problems/paint-a-grid-with-three-colors/) |
| 980 | 不同路径 III | 1830 | [链接](https://leetcode.cn/problems/unique-paths-iii/) |

#### §8.4 SOS DP（高维前缀和）

| 题号 | 题目名称 | 难度分 | 链接 |
|------|---------|--------|------|
| 2002 | 两个回文子序列长度的最大乘积 | — | [链接](https://leetcode.cn/problems/maximum-product-of-the-length-of-two-palindromic-subsequences/) |
| 2044 | 统计按位或能得到最大值的子集数目 | 1568 | [链接](https://leetcode.cn/problems/count-number-of-maximum-bitwise-or-subsets/) |
| 2732 | 找到矩阵中的好子集 | — | [链接](https://leetcode.cn/problems/find-a-good-subset-of-the-matrix/) |
| 3670 | 没有公共位的整数最大乘积 | 2234 | [链接](https://leetcode.cn/problems/maximum-product-of-integers-with-no-common-bits/) |

### 九、数位 DP

> 统计 [low, high] 中满足某种数位约束的整数个数或价值总和。

#### §9.1 统计合法元素的数目

| 题号 | 题目名称 | 难度分 | 链接 |
|------|---------|--------|------|
| 2376 | 统计特殊整数 | 2120 | [链接](https://leetcode.cn/problems/count-special-integers/) |
| 2719 | 统计整数数目 | — | [链接](https://leetcode.cn/problems/count-of-integers/) |
| 2827 | 范围中美丽整数的数目 | 2324 | [链接](https://leetcode.cn/problems/number-of-beautiful-integers-in-the-range/) |
| 2801 | 统计范围内的步进数字数目 | 2367 | [链接](https://leetcode.cn/problems/count-stepping-numbers-in-range/) |
| 3490 | 统计美丽整数的数目 | 2502 | [链接](https://leetcode.cn/problems/count-beautiful-integers/) |
| 600 | 不含连续 1 的非负整数 | — | [链接](https://leetcode.cn/problems/non-negative-integers-without-consecutive-ones/) |
| 902 | 最大为 N 的数字组合 | 1990 | [链接](https://leetcode.cn/problems/numbers-at-most-n-given-digit-set/) |
| 1012 | 至少有 1 位重复的数字 | 2230 | [链接](https://leetcode.cn/problems/numbers-with-repeated-digits/) |
| 1397 | 找到所有好字符串 | 2667 | [链接](https://leetcode.cn/problems/find-all-good-strings/) |

#### §9.2 统计合法元素的价值总和

| 题号 | 题目名称 | 难度分 | 链接 |
|------|---------|--------|------|
| 233 | 数字 1 的个数 | — | [链接](https://leetcode.cn/problems/number-of-digit-one/) |
| 3007 | 价值和小于等于 K 的最大数字 | 2258 | [链接](https://leetcode.cn/problems/maximum-number-that-sum-of-the-prices-is-less-than-or-equal-to-k/) |

### 十、树形 DP

#### §10.1 树的直径

| 题号 | 题目名称 | 难度分 | 链接 |
|------|---------|--------|------|
| 543 | 二叉树的直径 | — | [链接](https://leetcode.cn/problems/diameter-of-binary-tree/) |
| 687 | 最长同值路径 | — | [链接](https://leetcode.cn/problems/longest-univalue-path/) |
| 124 | 二叉树中的最大路径和 | — | [链接](https://leetcode.cn/problems/binary-tree-maximum-path-sum/) |
| 2385 | 感染二叉树需要的总时间 | 1711 | [链接](https://leetcode.cn/problems/amount-of-time-for-binary-tree-to-be-infected/) |
| 2246 | 相邻字符不同的最长路径 | 2126 | [链接](https://leetcode.cn/problems/longest-path-with-different-adjacent-characters/) |
| 1617 | 统计子树中城市之间最大距离 | 2309 | [链接](https://leetcode.cn/problems/count-distances-between-all-pairs-of-nodes-in-a-tree/) |

#### §10.2 树上最大独立集（打家劫舍 III）

| 题号 | 题目名称 | 难度分 | 链接 |
|------|---------|--------|------|
| 337 | 打家劫舍 III | — | [链接](https://leetcode.cn/problems/house-robber-iii/) |

#### §10.3 树上最小支配集（监控二叉树）

| 题号 | 题目名称 | 难度分 | 链接 |
|------|---------|--------|------|
| 968 | 监控二叉树 | — | [链接](https://leetcode.cn/problems/binary-tree-cameras/) |

#### §10.4 换根 DP（二次扫描法）

| 题号 | 题目名称 | 难度分 | 链接 |
|------|---------|--------|------|
| 834 | 树中距离之和 | 2197 | [链接](https://leetcode.cn/problems/sum-of-distances-in-tree/) |
| 310 | 最小高度树 | — | [链接](https://leetcode.cn/problems/minimum-height-trees/) |
| 2581 | 统计可能的树根数目 | 2228 | [链接](https://leetcode.cn/problems/count-number-of-possible-root-nodes/) |
| 3241 | 标记所有节点需要的时间 | 2522 | [链接](https://leetcode.cn/problems/time-taken-to-mark-all-nodes/) |
| 3772 | 子图的最大得分 | 2235 | [链接](https://leetcode.cn/problems/maximum-subgraph-score/) |

### 十一、博弈 DP

| 题号 | 题目名称 | 难度分 | 链接 |
|------|---------|--------|------|
| 1025 | 除数博弈 | 1435 | [链接](https://leetcode.cn/problems/divisor-game/) |
| 877 | 石子游戏 | 1590 | [链接](https://leetcode.cn/problems/stone-game/) |
| 486 | 预测赢家 | — | [链接](https://leetcode.cn/problems/predict-the-winner/) |
| 1140 | 石子游戏 II | 2035 | [链接](https://leetcode.cn/problems/stone-game-ii/) |
| 1406 | 石子游戏 III | 2027 | [链接](https://leetcode.cn/problems/stone-game-iii/) |
| 1510 | 石子游戏 IV | 1787 | [链接](https://leetcode.cn/problems/stone-game-iv/) |
| 1563 | 石子游戏 V | 2087 | [链接](https://leetcode.cn/problems/stone-game-v/) |
| 1690 | 石子游戏 VII | 1951 | [链接](https://leetcode.cn/problems/stone-game-vii/) |
| 464 | 我能赢吗 | — | [链接](https://leetcode.cn/problems/can-i-win/) |
| 1872 | 石子游戏 VIII | 2440 | [链接](https://leetcode.cn/problems/stone-game-viii/) |

### 十二、概率/期望 DP

| 题号 | 题目名称 | 难度分 | 链接 |
|------|---------|--------|------|
| 688 | 骑士在棋盘上的概率 | — | [链接](https://leetcode.cn/problems/knight-probability-in-chessboard/) |
| 837 | 新 21 点 | 2350 | [链接](https://leetcode.cn/problems/new-21-game/) |
| 808 | 分汤 | 2397 | [链接](https://leetcode.cn/problems/soup-servings/) |
| 1467 | 两个盒子中球的颜色数相同的概率 | 2357 | [链接](https://leetcode.cn/problems/probability-of-a-two-boxes-having-the-same-number-of-distinct-balls/) |
| LCR 185 | 统计结果概率 | — | [链接](https://leetcode.cn/problems/nge-tou-zi-de-dian-shu-lcof/) |

---

## 9. 其他面试突击资源

| 资源 | 链接 |
|------|------|
| HOT 100 | [LeetCode HOT 100](https://leetcode.cn/studyplan/top-100-liked/) |
| 面试 150 | [面试精选 150 题](https://leetcode.cn/studyplan/top-interview-150/) |

> 如果即将面试、时间紧迫，刷 HOT 100 即可。面试 150 与 HOT 100 有很多重复题目，刷完 HOT 100 还有时间再刷。

---

## 10. 学习建议

### 10.1 阶段规划

| 阶段 | 目标 | 建议时间 |
|------|------|---------|
| 新手村（题单 1-4） | 掌握滑动窗口、二分、常用数据结构、二叉树基础 | 1-2 个月 |
| 进阶（题单 5-6 + 回溯） | 网格图 DFS/BFS、动态规划入门 | 2-3 个月 |
| 深入（完整 12 个题单） | 图论、位运算、数学、字符串、贪心 | 3-6 个月 |
| 面试冲刺（HOT 100） | 经典面试题 | 2-4 周 |

### 10.2 每日刷题建议

- **新手**：每天 2-3 道，重点在理解思路
- **进阶**：每天 3-5 道，尝试不看题解独立完成
- **冲刺**：随机训练模式（关闭算法标签），模拟考试场景

### 10.3 推荐学习资源

- [灵神基础算法精讲（B 站）](https://www.bilibili.com/video/BV13G411y7gW/) — 配合题单使用
- [LeetCodeRating 插件](https://github.com/zhang-wangz/LeetCodeRating) — 显示周赛难度分
- LeetCode 题解区搜索 `灵茶山艾府` — 灵神的详细题解

---

## 11. 题单完成追踪

> 建议打印此表格或使用 Excel/Notion 追踪进度。

### 滑动窗口与双指针 — 核心题

- [ ] 定长滑动窗口 — 基础（13 题）
- [ ] 定长滑动窗口 — 进阶（选做）
- [ ] 不定长滑动窗口 — 最长子数组（11 题）
- [ ] 不定长滑动窗口 — 最短子数组（7 题）
- [ ] 不定长滑动窗口 — 子数组个数
- [ ] 单序列双指针 — 相向双指针
- [ ] 单序列双指针 — 原地修改
- [ ] 分组循环（~40 题）

### 二分算法 — 核心题

- [ ] 二分查找 — 基础（5 题）
- [ ] 二分查找 — 进阶
- [ ] 二分答案 — 求最小
- [ ] 二分答案 — 求最大
- [ ] 二分答案 — 最小化最大值
- [ ] 二分答案 — 最大化最小值
- [ ] 第 K 小/大

### 常用数据结构

- [ ] 枚举技巧
- [ ] 前缀和与哈希
- [ ] 栈
- [ ] 队列
- [ ] 堆（优先队列）

### 链表、树与回溯

- [ ] 链表基础
- [ ] 反转链表
- [ ] 快慢指针
- [ ] 二叉树遍历
- [ ] 自底向上 DFS
- [ ] 最近公共祖先
- [ ] 二叉搜索树

### 网格图

- [ ] 网格图 DFS
- [ ] 网格图 BFS
- [ ] 0-1 BFS
- [ ] 综合应用

### 动态规划（完整 12 节）

- [ ] 入门 DP（爬楼梯 / 打家劫舍 / 最大子数组和）
- [ ] 网格图 DP
- [ ] 背包（0-1 / 完全）
- [ ] LCS / LIS
- [ ] 划分型 DP（判定 / 最优 / 约束划分）
- [ ] 状态机 DP（买卖股票 / 基础 / 进阶）
- [ ] 区间 DP（最长回文子序列 / 综合）
- [ ] 状压 DP（排列型 / 子集 / 轮廓线 / SOS）
- [ ] 数位 DP
- [ ] 树形 DP（直径 / 独立集 / 支配集 / 换根）
- [ ] 博弈 DP
- [ ] 概率/期望 DP

---

*本文档基于灵茶山艾府（EndlessCheng）的 LeetCode 题单整理，原始内容来源于 LeetCode 中国讨论区。感谢灵神的优质刷题资源！*
