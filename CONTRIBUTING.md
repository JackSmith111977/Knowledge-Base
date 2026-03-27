# 贡献指南

欢迎参与 **Knowledge Base** 知识库项目的开源贡献！🎉

你的每一份贡献都让这个项目变得更好。本指南将帮助你了解如何参与贡献。

---

## 📋 贡献方式

### 1. 报告问题

发现文档错误、链接失效或内容问题？请创建一个 [Bug 报告 Issue](https://github.com/JackSmith111977/Knowledge-Base/issues/new?template=bug_report.yml)。

### 2. 功能建议

有新的内容想法或改进建议？请创建一个 [功能建议 Issue](https://github.com/JackSmith111977/Knowledge-Base/issues/new?template=feature_request.yml)。

### 3. 内容贡献

- 补充新技术栈的知识体系
- 修正现有文档的错误
- 改进文档结构和可读性
- 添加代码示例或最佳实践

### 4. 文档改进

- 修正拼写/语法错误
- 优化章节结构
- 补充缺失的概念解释
- 更新过时的信息

---

## 🚀 贡献流程

### 1. Fork 仓库

点击 GitHub 页面右上角的 **Fork** 按钮，创建你自己的副本。

### 2. 克隆到本地

```bash
git clone https://github.com/YOUR_USERNAME/Knowledge-Base.git
cd Knowledge-Base
```

### 3. 创建分支

根据你的贡献类型创建分支：

```bash
# 文档改进
git checkout -b docs/improve-react-hooks

# 新增内容
git checkout -b feat/add-typescript-guide

# Bug 修复
git checkout -b fix/typo-in-js-guide
```

### 4. 进行修改

- 遵循 [STYLE_GUIDE.md](docs/STYLE_GUIDE.md) 的文档规范
- 参考 [CLAUDE.md](.claude/CLAUDE.md) 的内容深度要求
- 确保章节编号连续且无重复

### 5. 提交代码

```bash
git add .
git commit -m "docs(React): 补充 Hooks 使用指南"
```

**提交信息规范：**

| 类型 | 说明 |
|------|------|
| `docs` | 文档内容变更 |
| `feat` | 新增内容/功能 |
| `fix` | Bug 修复 |
| `refactor` | 重构（不改变内容） |
| `style` | 格式调整 |

### 6. 推送到你的 Fork

```bash
git push origin your-branch-name
```

### 7. 发起 Pull Request

1. 前往 GitHub 仓库页面
2. 点击 **"Compare & pull request"**
3. 填写 PR 描述（使用提供的模板）
4. 等待审核

---

## 📝 文档规范

### 内容深度要求

每个核心概念必须包含：

1. **概念定义** - 是什么、为什么
2. **工作原理** - 内部机制和运作流程
3. **源码解析** - 关键特性的底层实现
4. **代码示例** - 配有文字说明的完整代码
5. **常见误区** - 开发者容易误解的地方
6. **最佳实践** - 实际开发中的推荐使用方式

### 格式规范

- 章节编号连续（1, 2, 3...），子章节使用小数点（2.1, 2.2...）
- 代码块标注语言类型（```javascript、```jsx 等）
- 表格必须有表头分隔线
- 使用 `---` 分隔主要章节

详见 [docs/STYLE_GUIDE.md](docs/STYLE_GUIDE.md)

---

## 🎯 适合新手的任务

查看以下标签的 Issue，找到适合新手的任务：

- [![good first issue](https://img.shields.io/badge/-good%20first%20issue-7057ff)](https://github.com/JackSmith111977/Knowledge-Base/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22)
- [![help wanted](https://img.shields.io/badge/-help%20wanted-008672)](https://github.com/JackSmith111977/Knowledge-Base/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22)

---

## ❓ 需要帮助？

如果你有任何问题或需要帮助：

- 在 Issue 区提问
- 在现有 Issue 下留言讨论
- 查看 [项目文档](docs/) 了解更多信息

---

## 📄 开源协议

本项目采用 [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) 协议。你的贡献也将在此协议下发布。

---

感谢你的贡献！🙏

每一份贡献都会被认真审核和感谢。让我们一起打造更好的知识库！
