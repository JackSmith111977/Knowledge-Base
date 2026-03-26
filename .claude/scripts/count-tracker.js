#!/usr/bin/env node
/**
 * 命令计数器 - 追踪用户命令模式并检测重复
 *
 * 功能：
 * 1. 解析用户输入，提取命令关键词
 * 2. 更新命令计数文件
 * 3. 检测是否达到阈值
 * 4. 输出触发标记（如果达到阈值）
 */

const fs = require('fs');
const path = require('path');

// ==================== 配置项 ====================
const CONFIG = {
  // 触发阈值（默认 3 次）
  DEFAULT_THRESHOLD: 3,

  // 计数文件路径
  COUNTS_FILE: path.join(__dirname, '..', 'command-counts.json'),

  // 模式配置文件路径
  PATTERNS_FILE: path.join(__dirname, '..', 'skills', 'auto-skill', 'references', 'command-patterns.md'),

  // 输出标记（当达到阈值时输出此标记，Claude 检测到后主动询问）
  TRIGGER_MARKER: '[AUTO-SKILL-TRIGGER]',
};

// ==================== 关键词模式库 ====================
// 按场景分类的关键词，用于匹配相似命令
const COMMAND_PATTERNS = {
  // 构建部署类
  'deploy': ['部署', 'deploy', 'build', '构建', 'publish', '发布', '上线'],
  'docker': ['docker', '容器', '镜像', 'container', 'image'],
  'ci-cd': ['CI', 'CD', '流水线', 'pipeline', 'github actions', 'gitlab ci'],

  // 代码质量类
  'code-review': ['审查', 'review', '检查', 'audit', 'lint', 'eslint', 'prettier'],
  'test': ['测试', 'test', 'jest', 'vitest', 'mocha', '单元测试', '集成测试'],
  'security': ['安全', 'security', '漏洞', 'vulnerability', 'scan', 'sast', 'dast'],

  // 开发效率类
  'git': ['git', 'commit', 'push', 'pull', 'merge', '分支', '提交', '拉取', '推送'],
  'pr': ['PR', 'pull request', '合并请求', '代码审查'],
  'doc': ['文档', 'doc', 'documentation', 'readme', '注释', 'api doc'],

  // 项目初始化类
  'init': ['初始化', 'init', 'setup', '配置', 'config', '创建项目', '脚手架'],
  'dependency': ['安装', 'npm install', 'yarn add', 'pnpm add', '依赖', 'package.json'],

  // 调试排查类
  'debug': ['调试', 'debug', '日志', 'log', '报错', 'error', '排查'],
  'performance': ['性能', 'performance', '优化', 'optimize', 'profiling', 'benchmark'],
};

// ==================== 核心功能 ====================

/**
 * 读取计数文件
 * @returns {Object} 计数数据
 */
function readCountsFile() {
  try {
    if (fs.existsSync(CONFIG.COUNTS_FILE)) {
      const data = fs.readFileSync(CONFIG.COUNTS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error(`[count-tracker] 读取计数文件失败：${error.message}`);
  }
  return { patterns: {}, threshold: CONFIG.DEFAULT_THRESHOLD };
}

/**
 * 写入计数文件
 * @param {Object} data 计数数据
 */
function writeCountsFile(data) {
  try {
    fs.writeFileSync(CONFIG.COUNTS_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error(`[count-tracker] 写入计数文件失败：${error.message}`);
  }
}

/**
 * 从用户输入中提取匹配的关键词
 * @param {string} input 用户输入
 * @returns {Array<string>} 匹配到的关键词列表
 */
function extractKeywords(input) {
  const inputLower = input.toLowerCase();
  const matched = [];

  for (const [category, keywords] of Object.entries(COMMAND_PATTERNS)) {
    for (const keyword of keywords) {
      if (inputLower.includes(keyword.toLowerCase())) {
        matched.push(category);
        break; // 每个类别只匹配一次
      }
    }
  }

  return [...new Set(matched)]; // 去重
}

/**
 * 更新计数并检查是否达到阈值
 * @param {string} input 用户输入
 * @returns {Object} 包含触发结果的对象
 */
function trackAndCheck(input) {
  const data = readCountsFile();
  const keywords = extractKeywords(input);
  const now = new Date().toISOString();

  let triggered = null;

  keywords.forEach(keyword => {
    if (!data.patterns[keyword]) {
      data.patterns[keyword] = {
        count: 0,
        lastUsed: null,
        examples: [],
        triggered: false
      };
    }

    const pattern = data.patterns[keyword];
    pattern.count += 1;
    pattern.lastUsed = now;

    // 记录示例（最多 3 个）
    if (!pattern.examples.includes(input) && pattern.examples.length < 3) {
      pattern.examples.push(input);
    }

    // 检查是否达到阈值且尚未触发
    if (pattern.count >= data.threshold && !pattern.triggered) {
      pattern.triggered = true;
      triggered = {
        category: keyword,
        count: pattern.count,
        examples: pattern.examples
      };
    }
  });

  writeCountsFile(data);
  return { triggered, keywordCount: keywords.length };
}

/**
 * 重置指定模式的计数
 * @param {string} category 模式类别
 */
function resetCount(category) {
  const data = readCountsFile();
  if (data.patterns[category]) {
    data.patterns[category].triggered = false;
    data.patterns[category].count = 0;
    data.patterns[category].examples = [];
    writeCountsFile(data);
    console.log(`[count-tracker] 已重置模式 "${category}" 的计数`);
  }
}

/**
 * 查看所有模式的计数状态
 */
function showStatus() {
  const data = readCountsFile();
  console.log('\n=== 命令模式计数状态 ===\n');
  console.log(`当前阈值：${data.threshold}`);
  console.log('\n已追踪的模式：');

  for (const [category, info] of Object.entries(data.patterns)) {
    const status = info.triggered ? '⚠️ 已触发' : '📊 正常';
    console.log(`  ${category}: ${info.count} 次 ${status}`);
    if (info.lastUsed) {
      console.log(`    最后使用：${info.lastUsed}`);
    }
  }
  console.log('');
}

// ==================== 命令行入口 ====================

const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case '--track':
    // 追踪模式：count-tracker.js --track "用户输入内容"
    const input = args.slice(1).join(' ').replace(/"/g, '');
    if (input) {
      const result = trackAndCheck(input);
      if (result.triggered) {
        // 输出触发标记，Claude 检测到此标记后会主动询问
        console.log(`${CONFIG.TRIGGER_MARKER} 检测到重复命令模式！`);
        console.log(`模式：${result.triggered.category}`);
        console.log(`次数：${result.triggered.count} 次`);
        console.log(`示例：${result.triggered.examples.slice(0, 2).join(' | ')}`);
        console.log(`\n建议：是否要为 "${result.triggered.category}" 类操作创建一个专用 Skill？`);
      }
    }
    break;

  case '--reset':
    // 重置模式：count-tracker.js --reset deploy
    if (args[1]) {
      resetCount(args[1]);
    }
    break;

  case '--status':
    // 查看状态：count-tracker.js --status
    showStatus();
    break;

  default:
    console.log('用法：node count-tracker.js <command> [args]');
    console.log('命令:');
    console.log('  --track "用户输入"  追踪用户输入并检查是否触发');
    console.log('  --reset <模式>     重置指定模式的计数');
    console.log('  --status          查看所有模式的状态');
}
