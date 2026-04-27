#!/usr/bin/env node
/**
 * 去重检测脚本 (dedup-draft.mjs)
 *
 * 用途：检测多草稿间的重叠内容（标题、概念、代码、来源、数据）
 *
 * 检测维度：
 * - 标题重复：grep "^## " 检测相同标题
 * - 概念重复：提取「定义:」段落关键词比对
 * - 代码重复：检测相同代码块
 * - 来源重复：检测相同 URL
 * - 数据重复：检测相同表格（简化版）
 *
 * 输出：.work/[主题]/drafts/dedup-report.md
 *
 * 使用：
 * node dedup-draft.mjs --drafts-dir ".work/[主题]/drafts" --score-report ".work/[主题]/drafts/score-report.md"
 */

import fs from 'fs';
import path from 'path';

/**
 * 提取所有标题
 */
function extractTitles(content) {
  const matches = content.match(/^## [^\n]+/gm) || [];
  return matches.map(m => m.replace(/^## /, '').trim());
}

/**
 * 提取所有定义段落（简化版）
 */
function extractDefinitions(content) {
  // 匹配 **定义：** 或 定义: 格式
  const matches = content.match(/\*\*定义[：:]\*\*[^\n]+/g) || [];
  return matches.map(m => m.replace(/\*\*定义[：:]\*\*/, '').trim());
}

/**
 * 提取所有代码块
 */
function extractCodeBlocks(content) {
  // 匹配 ```语言\n代码\n```
  const matches = content.match(/```[a-z]+\n[\s\S]*?```/g) || [];
  return matches.map(m => {
    // 简化：只保留代码内容，去除语言标注和换行
    return m.replace(/```[a-z]+\n/, '').replace(/```$/, '').trim();
  });
}

/**
 * 提取所有 URL
 */
function extractUrls(content) {
  return content.match(/https:\/\/[^\s\)]+/g) || [];
}

/**
 * 提取表格数据（简化版：提取表格行）
 */
function extractTableRows(content) {
  const matches = content.match(/^\| [^\n]+ \|$/gm) || [];
  return matches.map(m => m.trim());
}

/**
 * 检测重叠
 */
function detectOverlaps(draftsDir, scoreReportPath) {
  // 加载评分报告（可选）
  let scores = {};
  if (scoreReportPath && fs.existsSync(scoreReportPath)) {
    const scoreContent = fs.readFileSync(scoreReportPath, 'utf-8');
    // 解析评分（简化版）
    const scoreMatches = scoreContent.matchAll(/\| chapter-[\d\-A-B]+\.md \| (\d+) \| (\d+) \| (\d+) \| (\d+) \| (\d+) \| \*\*(\d+)\*\* \| (\d+) \|/g);
    for (const match of scoreMatches) {
      scores[match[0].split('|')[1].trim()] = parseInt(match[6]);
    }
  }

  const files = fs.readdirSync(draftsDir)
    .filter(f => f.endsWith('.md') && f.startsWith('chapter-'));

  // 收集所有内容
  const allTitles = {};
  const allDefinitions = {};
  const allCodeBlocks = {};
  const allUrls = {};
  const allTableRows = {};

  files.forEach(file => {
    const filePath = path.join(draftsDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');

    // 收集标题
    extractTitles(content).forEach(title => {
      if (!allTitles[title]) allTitles[title] = [];
      allTitles[title].push({ file, score: scores[file] || 0 });
    });

    // 收集定义
    extractDefinitions(content).forEach(def => {
      const key = def.substring(0, 50); // 简化：取前 50 字符作为 key
      if (!allDefinitions[key]) allDefinitions[key] = [];
      allDefinitions[key].push({ file, full: def, score: scores[file] || 0 });
    });

    // 收集代码块
    extractCodeBlocks(content).forEach(code => {
      const key = code.substring(0, 100); // 简化：取前 100 字符作为 key
      if (!allCodeBlocks[key]) allCodeBlocks[key] = [];
      allCodeBlocks[key].push({ file, score: scores[file] || 0 });
    });

    // 收集 URL
    extractUrls(content).forEach(url => {
      if (!allUrls[url]) allUrls[url] = [];
      allUrls[url].push(file);
    });

    // 收集表格行
    extractTableRows(content).forEach(row => {
      if (!allTableRows[row]) allTableRows[row] = [];
      allTableRows[row].push(file);
    });
  });

  // 筛选重叠项（出现次数 > 1）
  const overlaps = {
    titles: Object.entries(allTitles).filter(([_, files]) => files.length > 1),
    definitions: Object.entries(allDefinitions).filter(([_, files]) => files.length > 1),
    codeBlocks: Object.entries(allCodeBlocks).filter(([_, files]) => files.length > 1),
    urls: Object.entries(allUrls).filter(([_, files]) => files.length > 1),
    tableRows: Object.entries(allTableRows).filter(([_, files]) => files.length > 1),
  };

  return overlaps;
}

/**
 * 生成去重报告 Markdown
 */
function generateReport(overlaps, outputPath) {
  const lines = [
    '# 冗余去重报告',
    '',
    '> 自动生成时间：' + new Date().toISOString(),
    '',
    '## 检测结果',
    '',
  ];

  // 标题重叠
  lines.push('### 标题重叠');
  if (overlaps.titles.length === 0) {
    lines.push('✅ 无标题重叠');
  } else {
    lines.push('| 标题 | 出现文件 | 评分对比 | 决策 |');
    lines.push('|------|----------|----------|------|');
    overlaps.titles.forEach(([title, files]) => {
      const fileList = files.map(f => `${f.file}(${f.score})`).join(', ');
      const sorted = files.sort((a, b) => b.score - a.score);
      const decision = sorted[0].score > sorted[1]?.score ? `保留 ${sorted[0].file}` : '需人工判断';
      lines.push(`| ${title.substring(0, 30)} | ${fileList} | ${decision} |`);
    });
  }
  lines.push('');

  // 概念重叠
  lines.push('### 概念重叠');
  if (overlaps.definitions.length === 0) {
    lines.push('✅ 无概念重叠');
  } else {
    lines.push('| 概念片段 | 出现文件 | 决策 |');
    lines.push('|----------|----------|------|');
    overlaps.definitions.forEach(([key, files]) => {
      const fileList = files.map(f => f.file).join(', ');
      lines.push(`| ${key.substring(0, 30)}... | ${fileList} | 应用决策树 |`);
    });
  }
  lines.push('');

  // 代码重叠
  lines.push('### 代码重叠');
  if (overlaps.codeBlocks.length === 0) {
    lines.push('✅ 无代码重叠');
  } else {
    lines.push('| 代码片段 | 出现文件 | 决策 |');
    lines.push('|----------|----------|------|');
    overlaps.codeBlocks.forEach(([key, files]) => {
      const fileList = files.map(f => f.file).join(', ');
      lines.push(`| ${key.substring(0, 30)}... | ${fileList} | 合并/保留高分 |`);
    });
  }
  lines.push('');

  // 来源重叠
  lines.push('### 来源重叠');
  if (overlaps.urls.length === 0) {
    lines.push('✅ 无来源重叠');
  } else {
    lines.push('| URL | 出现文件 | 决策 |');
    lines.push('|-----|----------|------|');
    overlaps.urls.forEach(([url, files]) => {
      lines.push(`| ${url.substring(0, 50)} | ${files.join(', ')} | 合并到统一列表 |`);
    });
  }
  lines.push('');

  // 统计
  lines.push('## 重叠统计');
  lines.push('');
  lines.push(`| 重叠类型 | 数量 |`);
  lines.push(`|----------|------|`);
  lines.push(`| 标题 | ${overlaps.titles.length} |`);
  lines.push(`| 概念 | ${overlaps.definitions.length} |`);
  lines.push(`| 代码 | ${overlaps.codeBlocks.length} |`);
  lines.push(`| 来源 | ${overlaps.urls.length} |`);
  lines.push(`| 数据 | ${overlaps.tableRows.length} |`);
  lines.push('');

  const total = overlaps.titles.length + overlaps.definitions.length +
                 overlaps.codeBlocks.length + overlaps.urls.length +
                 overlaps.tableRows.length;
  lines.push(`**总重叠数：** ${total}`);
  lines.push('');

  if (total > 0) {
    lines.push('**下一步：** 执行合并决策树处理重叠内容');
  } else {
    lines.push('**结论：** 无重叠，可直接进入整合阶段');
  }

  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('*生成工具：dedup-draft.mjs v1.0.0*');

  fs.writeFileSync(outputPath, lines.join('\n'), 'utf-8');
  console.log(`✅ 去重报告已生成：${outputPath}`);

  // 打印摘要
  console.log('\n📊 去重摘要：');
  console.log(`  标题重叠：${overlaps.titles.length}`);
  console.log(`  概念重叠：${overlaps.definitions.length}`);
  console.log(`  代码重叠：${overlaps.codeBlocks.length}`);
  console.log(`  来源重叠：${overlaps.urls.length}`);
  console.log(`  数据重叠：${overlaps.tableRows.length}`);
  console.log(`  总计：${total}`);
}

// CLI 入口
function main() {
  const args = process.argv.slice(2);

  let draftsDir = '.work/drafts';
  let scoreReportPath = '';
  let outputPath = '';

  args.forEach(arg => {
    if (arg.startsWith('--drafts-dir=')) {
      draftsDir = arg.split('=')[1];
    } else if (arg.startsWith('--score-report=')) {
      scoreReportPath = arg.split('=')[1];
    } else if (arg.startsWith('--output=')) {
      outputPath = arg.split('=')[1];
    }
  });

  // 默认输出路径
  if (!outputPath) {
    outputPath = path.join(draftsDir, 'dedup-report.md');
  }

  // 检查目录存在
  if (!fs.existsSync(draftsDir)) {
    console.error(`❌ 草稿目录不存在：${draftsDir}`);
    process.exit(1);
  }

  console.log(`📂 草稿目录：${draftsDir}`);
  console.log(`📊 评分报告：${scoreReportPath || '（未提供）'}`);

  const overlaps = detectOverlaps(draftsDir, scoreReportPath);
  generateReport(overlaps, outputPath);
}

main();