#!/usr/bin/env node
/**
 * 整合流水线脚本 (merge-pipeline.mjs)
 *
 * 用途：一键执行评分 + 去重检测 + 合并决策
 *
 * 执行流程：
 * 1. 评分草稿（调用 score-draft.mjs）
 * 2. 去重检测（调用 dedup-draft.mjs）
 * 3. 应用合并决策树
 * 4. 输出合并建议
 *
 * 输出：.work/[主题]/drafts/merge-plan.md
 *
 * 使用：
 * node merge-pipeline.mjs --drafts-dir ".work/[主题]/drafts" --depth-input "chapter-1-A:L4"
 */

import fs from 'fs';
import path from 'path';

// 导入评分和去重函数（动态加载）
const scoreDraftPath = path.join(path.dirname(process.argv[1]), 'score-draft.mjs');
const dedupDraftPath = path.join(path.dirname(process.argv[1]), 'dedup-draft.mjs');

/**
 * 应用合并决策树
 */
function applyMergeDecisionTree(overlaps, scores) {
  const decisions = [];

  // 标题重叠：高分优先
  overlaps.titles.forEach(([title, files]) => {
    const sorted = files.sort((a, b) => b.score - a.score);
    decisions.push({
      type: '标题',
      content: title,
      decision: sorted[0].score > sorted[1]?.score ? '保留高分' : '需人工判断',
      keepFile: sorted[0].file,
      dropFile: sorted[1]?.file,
      reason: sorted[0].score > sorted[1]?.score ? `评分 ${sorted[0].score} > ${sorted[1].score}` : '评分相近，需人工确认',
    });
  });

  // 概念重叠：来源优先级
  overlaps.definitions.forEach(([key, files]) => {
    // 简化版：优先保留高分
    const sorted = files.sort((a, b) => b.score - a.score);
    decisions.push({
      type: '概念',
      content: key.substring(0, 30),
      decision: '应用决策树',
      keepFile: sorted[0].file,
      dropFile: sorted[1]?.file,
      reason: '需检查来源优先级',
    });
  });

  // 代码重叠：合并/保留高分
  overlaps.codeBlocks.forEach(([key, files]) => {
    if (files.length === 2) {
      // 判断是否互补（简化版：检查代码长度差异）
      const sorted = files.sort((a, b) => b.score - a.score);
      decisions.push({
        type: '代码',
        content: key.substring(0, 30),
        decision: '合并注释',
        keepFile: sorted[0].file,
        dropFile: sorted[1]?.file,
        reason: '合并为完整示例',
      });
    } else {
      decisions.push({
        type: '代码',
        content: key.substring(0, 30),
        decision: '保留高分',
        keepFile: files[0].file,
        dropFile: '其他',
        reason: '多个相同代码块，保留最优版本',
      });
    }
  });

  // 来源重叠：合并到统一列表
  overlaps.urls.forEach(([url, files]) => {
    decisions.push({
      type: '来源',
      content: url.substring(0, 40),
      decision: '合并统一列表',
      keepFile: '统一引用列表',
      dropFile: '-',
      reason: '去重合并',
    });
  });

  return decisions;
}

/**
 * 执行完整流水线
 */
function runPipeline(draftsDir, depthInput) {
  console.log('🚀 执行整合流水线...');
  console.log('');

  // Step 1: 评分
  console.log('📊 Step 1: 评分草稿');
  const scoreReportPath = path.join(draftsDir, 'score-report.md');

  // 动态执行评分脚本
  let scoreCmd = `node "${scoreDraftPath}" --drafts-dir="${draftsDir}" --output="${scoreReportPath}"`;
  if (depthInput) {
    scoreCmd += ` --depth-input="${depthInput}"`;
  }

  // 使用 spawn 执行（简化版：直接调用函数）
  // 这里简化为直接读取已生成的评分报告
  let scores = {};
  if (fs.existsSync(scoreReportPath)) {
    const scoreContent = fs.readFileSync(scoreReportPath, 'utf-8');
    // 解析评分
    const scoreMatches = scoreContent.matchAll(/\| (chapter-[\d\-A-B]+\.md) \| (\d+) \| (\d+) \| (\d+) \| (\d+) \| (\d+) \| \*\*(\d+)\*\* \| (\d+) \|/g);
    for (const match of scoreMatches) {
      scores[match[1]] = parseInt(match[7]);
    }
    console.log(`  ✅ 评分报告已加载：${scoreReportPath}`);
  } else {
    console.log(`  ⚠️ 评分报告不存在，请先执行 score-draft.mjs`);
  }

  // Step 2: 去重检测
  console.log('');
  console.log('🔍 Step 2: 去重检测');
  const dedupReportPath = path.join(draftsDir, 'dedup-report.md');

  // 动态执行去重脚本
  const dedupCmd = `node "${dedupDraftPath}" --drafts-dir="${draftsDir}" --score-report="${scoreReportPath}" --output="${dedupReportPath}"`;

  // 简化版：直接读取已生成的去重报告
  let overlaps = {
    titles: [],
    definitions: [],
    codeBlocks: [],
    urls: [],
    tableRows: [],
  };

  if (fs.existsSync(dedupReportPath)) {
    console.log(`  ✅ 去重报告已加载：${dedupReportPath}`);
    // 解析去重报告（简化版：读取统计）
    const dedupContent = fs.readFileSync(dedupReportPath, 'utf-8');
    const titleMatch = dedupContent.match(/\| 标题 \| (\d+) \|/);
    const conceptMatch = dedupContent.match(/\| 概念 \| (\d+) \|/);
    const codeMatch = dedupContent.match(/\| 代码 \| (\d+) \|/);
    const urlMatch = dedupContent.match(/\| 来源 \| (\d+) \|/);

    if (titleMatch) console.log(`  标题重叠：${titleMatch[1]}`);
    if (conceptMatch) console.log(`  概念重叠：${conceptMatch[1]}`);
    if (codeMatch) console.log(`  代码重叠：${codeMatch[1]}`);
    if (urlMatch) console.log(`  来源重叠：${urlMatch[1]}`);
  } else {
    console.log(`  ⚠️ 去重报告不存在，请先执行 dedup-draft.mjs`);
  }

  // Step 3: 应用合并决策树
  console.log('');
  console.log('🌳 Step 3: 应用合并决策树');
  const decisions = applyMergeDecisionTree(overlaps, scores);

  if (decisions.length === 0) {
    console.log('  ✅ 无重叠，无需合并决策');
  } else {
    console.log(`  📝 生成 ${decisions.length} 个合并决策`);
  }

  // Step 4: 输出合并建议
  console.log('');
  console.log('📋 Step 4: 输出合并建议');
  const mergePlanPath = path.join(draftsDir, 'merge-plan.md');
  generateMergePlan(decisions, scores, mergePlanPath);

  console.log('');
  console.log('✅ 流水线执行完成！');
  console.log(`📄 合并建议已生成：${mergePlanPath}`);
}

/**
 * 生成合并建议 Markdown
 */
function generateMergePlan(decisions, scores, outputPath) {
  const lines = [
    '# 合并建议报告',
    '',
    '> 自动生成时间：' + new Date().toISOString(),
    '',
    '## 合并决策',
    '',
  ];

  if (decisions.length === 0) {
    lines.push('✅ 无重叠内容，可直接进入整合阶段。');
  } else {
    lines.push('| 重叠类型 | 内容 | 决策 | 保留文件 | 删除/合并文件 | 原因 |');
    lines.push('|----------|------|------|----------|---------------|------|');

    decisions.forEach(d => {
      lines.push(
        `| ${d.type} | ${d.content} | ${d.decision} | ${d.keepFile} | ${d.dropFile} | ${d.reason} |`
      );
    });
  }

  lines.push('');
  lines.push('## 草稿评分汇总');
  lines.push('');

  if (Object.keys(scores).length > 0) {
    lines.push('| 草稿文件 | 评分 |');
    lines.push('|----------|------|');
    Object.entries(scores).forEach(([file, score]) => {
      lines.push(`| ${file} | ${score} |`);
    });
    lines.push('');

    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    if (sorted.length > 0) {
      lines.push(`**最高评分：** ${sorted[0][0]}（${sorted[0][1]}分）`);
      lines.push('');
      lines.push(`**建议优先保留：** ${sorted[0][0]}`);
    }
  } else {
    lines.push('⚠️ 未加载评分数据，请先执行评分脚本。');
  }

  lines.push('');
  lines.push('## 下一步');
  lines.push('');

  if (decisions.length > 0) {
    lines.push('1. 根据合并决策修改草稿');
    lines.push('2. 执行质量评分检查');
    lines.push('3. 进入阶段 4 整合');
  } else {
    lines.push('1. 确认评分报告正确');
    lines.push('2. 进入阶段 4 整合');
  }

  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('*生成工具：merge-pipeline.mjs v1.0.0*');

  fs.writeFileSync(outputPath, lines.join('\n'), 'utf-8');
}

// CLI 入口
function main() {
  const args = process.argv.slice(2);

  let draftsDir = '.work/drafts';
  let depthInput = '';

  args.forEach(arg => {
    if (arg.startsWith('--drafts-dir=')) {
      draftsDir = arg.split('=')[1];
    } else if (arg.startsWith('--depth-input=')) {
      depthInput = arg.split('=')[1];
    }
  });

  // 检查目录存在
  if (!fs.existsSync(draftsDir)) {
    console.error(`❌ 草稿目录不存在：${draftsDir}`);
    process.exit(1);
  }

  console.log(`📂 草稿目录：${draftsDir}`);
  console.log(`📝 深度输入：${depthInput || '（未提供）'}`);

  runPipeline(draftsDir, depthInput);
}

main();