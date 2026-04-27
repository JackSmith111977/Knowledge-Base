#!/usr/bin/env node
/**
 * 草稿评分脚本 (score-draft.mjs)
 *
 * 用途：为 SubAgent 产出的草稿生成量化评分，用于合并决策
 *
 * 评分维度：
 * - 引用数量 (25%)
 * - 代码示例数 (20%)
 * - 图表数量 (15%)
 * - 内容深度 (20%) - 需人工输入或 LLM 判断
 * - 来源权威性 (20%) - 检测官方文档引用占比
 *
 * 输出：.work/[主题]/drafts/score-report.md
 *
 * 使用：
 * node score-draft.mjs --drafts-dir ".work/[主题]/drafts" --depth-input "L4,L3,L2,L1"
 */

import fs from 'fs';
import path from 'path';

// 评分阈值配置
const THRESHOLDS = {
  references: { high: 5, mid: 3, low: 1 },
  codeBlocks: { high: 3, mid: 2, low: 1 },
  mermaidCharts: { high: 2, mid: 1, low: 0 },
};

// 权重配置
const WEIGHTS = {
  references: 0.25,
  codeBlocks: 0.20,
  mermaidCharts: 0.15,
  depth: 0.20,
  authority: 0.20,
};

// 深度等级得分映射
const DEPTH_SCORES = { L4: 100, L3: 80, L2: 60, L1: 40 };

// 官方文档域名列表
const OFFICIAL_DOMAINS = [
  'react.dev', 'docs.python.org', 'developer.mozilla.org',
  'nodejs.org', 'typescriptlang.org', 'vuejs.org',
  'angular.io', 'nextjs.org', 'tailwindcss.com',
  'github.com', 'npmjs.com', 'deno.land',
];

/**
 * 计算引用数量得分
 */
function calcReferencesScore(content) {
  // 匹配引用格式：| #数字 | 或 [来源 #数字] 或 https://
  const refMatches = content.match(/\| #\d+ \|/g) || [];
  const urlMatches = content.match(/https:\/\/[^\s\)]+/g) || [];
  const count = Math.max(refMatches.length, urlMatches.length);

  if (count >= THRESHOLDS.references.high) return 100;
  if (count >= THRESHOLDS.references.mid) return 80;
  if (count >= THRESHOLDS.references.low) return 60;
  return 40;
}

/**
 * 计算代码示例数得分
 */
function calcCodeBlocksScore(content) {
  // 匹配代码块 ```语言
  const matches = content.match(/```[a-z]+\n/g) || [];
  const count = matches.length;

  if (count >= THRESHOLDS.codeBlocks.high) return 100;
  if (count >= THRESHOLDS.codeBlocks.mid) return 80;
  if (count >= THRESHOLDS.codeBlocks.low) return 60;
  return 40;
}

/**
 * 计算图表数量得分
 */
function calcMermaidChartsScore(content) {
  // 匹配 mermaid 代码块
  const matches = content.match(/```mermaid/g) || [];
  const count = matches.length;

  if (count >= THRESHOLDS.mermaidCharts.high) return 100;
  if (count >= THRESHOLDS.mermaidCharts.mid) return 80;
  return 40;
}

/**
 * 计算来源权威性得分
 */
function calcAuthorityScore(content) {
  const urls = content.match(/https:\/\/[^\s\)]+/g) || [];
  if (urls.length === 0) return 60;

  // 检测官方文档域名
  const officialCount = urls.filter(url => {
    const domain = url.replace('https://', '').split('/')[0];
    return OFFICIAL_DOMAINS.some(d => domain.includes(d));
  }).length;

  const ratio = officialCount / urls.length;

  if (ratio >= 0.5) return 100;
  if (ratio >= 0.3) return 80;
  return 60;
}

/**
 * 计算单个草稿总分
 */
function calcTotalScore(scores) {
  return Math.round(
    scores.references * WEIGHTS.references +
    scores.codeBlocks * WEIGHTS.codeBlocks +
    scores.mermaidCharts * WEIGHTS.mermaidCharts +
    scores.depth * WEIGHTS.depth +
    scores.authority * WEIGHTS.authority
  );
}

/**
 * 扫描草稿目录并评分
 */
function scoreDrafts(draftsDir, depthInput) {
  // 解析深度输入（格式：file1:L4,file2:L3,...）
  const depthMap = {};
  if (depthInput) {
    depthInput.split(',').forEach(item => {
      const [file, level] = item.split(':');
      depthMap[file.trim()] = DEPTH_SCORES[level.trim()] || 60;
    });
  }

  const files = fs.readdirSync(draftsDir)
    .filter(f => f.endsWith('.md') && f.startsWith('chapter-'));

  const results = [];

  files.forEach(file => {
    const filePath = path.join(draftsDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');

    const scores = {
      references: calcReferencesScore(content),
      codeBlocks: calcCodeBlocksScore(content),
      mermaidCharts: calcMermaidChartsScore(content),
      depth: depthMap[file] || 60, // 默认 L2
      authority: calcAuthorityScore(content),
    };

    const total = calcTotalScore(scores);

    results.push({
      file,
      scores,
      total,
      rank: 0,
    });
  });

  // 按总分排序
  results.sort((a, b) => b.total - a.total);
  results.forEach((r, i) => r.rank = i + 1);

  return results;
}

/**
 * 生成评分报告 Markdown
 */
function generateReport(results, outputPath) {
  const lines = [
    '# 草稿评分报告',
    '',
    '> 自动生成时间：' + new Date().toISOString(),
    '',
    '## 评分结果',
    '',
    '| 草稿文件 | 引用(25%) | 代码(20%) | 图表(15%) | 深度(20%) | 权威(20%) | 总分 | 排名 |',
    '|----------|-----------|-----------|-----------|-----------|-----------|------|------|',
  ];

  results.forEach(r => {
    lines.push(
      `| ${r.file} | ${r.scores.references} | ${r.scores.codeBlocks} | ${r.scores.mermaidCharts} | ${r.scores.depth} | ${r.scores.authority} | **${r.total}** | ${r.rank} |`
    );
  });

  lines.push('');

  if (results.length > 0) {
    lines.push(`**推荐保留：** ${results[0].file}（高分优先，总分 ${results[0].total}）`);
  }

  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('*生成工具：score-draft.mjs v1.0.0*');

  fs.writeFileSync(outputPath, lines.join('\n'), 'utf-8');
  console.log(`✅ 评分报告已生成：${outputPath}`);

  // 打印摘要
  console.log('\n📊 评分摘要：');
  results.forEach(r => {
    console.log(`  ${r.file}: ${r.total}分 (排名 ${r.rank})`);
  });
}

// CLI 入口
function main() {
  const args = process.argv.slice(2);

  let draftsDir = '.work/drafts';
  let depthInput = '';
  let outputPath = '';

  args.forEach(arg => {
    if (arg.startsWith('--drafts-dir=')) {
      draftsDir = arg.split('=')[1];
    } else if (arg.startsWith('--depth-input=')) {
      depthInput = arg.split('=')[1];
    } else if (arg.startsWith('--output=')) {
      outputPath = arg.split('=')[1];
    }
  });

  // 默认输出路径
  if (!outputPath) {
    outputPath = path.join(draftsDir, 'score-report.md');
  }

  // 检查目录存在
  if (!fs.existsSync(draftsDir)) {
    console.error(`❌ 草稿目录不存在：${draftsDir}`);
    process.exit(1);
  }

  console.log(`📂 草稿目录：${draftsDir}`);
  console.log(`📝 深度输入：${depthInput || '（未提供，使用默认 L2）'}`);

  const results = scoreDrafts(draftsDir, depthInput);
  generateReport(results, outputPath);
}

main();