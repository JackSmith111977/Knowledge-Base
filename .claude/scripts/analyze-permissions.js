/**
 * 分析权限请求日志，生成 permissions 完善建议
 * 用法：node .claude/scripts/analyze-permissions.js [days]
 */

const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, '../logs/permission-requests.log');
const days = parseInt(process.argv[2]) || 7; // 默认分析最近 7 天

// 读取日志
if (!fs.existsSync(logFile)) {
    console.log('📋 日志文件不存在，尚未记录任何权限请求');
    console.log('');
    console.log('💡 提示：在 settings.local.json 中添加以下 Hook 开始记录：');
    console.log(JSON.stringify({
        "hooks": {
            "PermissionRequest": [{
                "matcher": ".*",
                "hooks": [{
                    "type": "command",
                    "command": "echo \"$(date '+%Y-%m-%d %H:%M:%S') | $PERMISSION_REQUEST | $USER_PROMPT\" >> .claude/logs/permission-requests.log",
                    "timeout": 5
                }]
            }]
        }
    }, null, 2));
    process.exit(0);
}

const lines = fs.readFileSync(logFile, 'utf8').split('\n').filter(Boolean);
const cutoff = new Date();
cutoff.setDate(cutoff.getDate() - days);

// 提取命令并统计
const commandCounts = {};
const commandExamples = {};
const commandUserPrompts = {};

lines.forEach(line => {
    const parts = line.split(' | ');
    if (parts.length < 3) return;

    const timestamp = new Date(parts[0]);
    if (timestamp < cutoff) return;

    const match = parts[1].match(/Bash\(([^)]+)\)/);
    if (!match) return;

    const cmd = match[1];
    commandCounts[cmd] = (commandCounts[cmd] || 0) + 1;
    commandExamples[cmd] = parts[2] || '';
    commandUserPrompts[cmd] = parts[3] || parts[2] || '';
});

// 生成建议规则
const suggestions = [];
const sorted = Object.entries(commandCounts).sort((a, b) => b[1] - a[1]);

sorted.forEach(([cmd, count]) => {
    // 提取基础命令用于通配符
    let baseCmd = cmd;

    // 处理带参数的命令
    if (cmd.includes(':')) {
        baseCmd = cmd.split(':')[0];
    } else if (cmd.includes(' ')) {
        baseCmd = cmd.split(' ')[0];
    }

    suggestions.push({
        fullCmd: cmd,
        baseCmd: baseCmd,
        count: count,
        example: commandExamples[cmd],
        userPrompt: commandUserPrompts[cmd],
        suggestion: `Bash(${baseCmd}:*)`
    });
});

// 去重：相同 baseCmd 只保留一个
const seen = new Set();
const uniqueSuggestions = [];

for (const s of suggestions) {
    const key = s.baseCmd.toLowerCase();
    if (!seen.has(key)) {
        seen.add(key);
        uniqueSuggestions.push(s);
    }
}

// 输出
console.log('');
console.log(`=== 权限请求分析（最近 ${days} 天）===`);
console.log('');
console.log('| 命令模式 | 请求次数 | 建议规则 | 示例场景 |');
console.log('|----------|----------|----------|----------|');

uniqueSuggestions.slice(0, 15).forEach(s => {
    const exampleDisplay = s.userPrompt ? s.userPrompt.slice(0, 18) + '...' : '-';
    console.log(`| ${s.baseCmd.padEnd(10)} | ${String(s.count).padEnd(8)} | Bash(${s.baseCmd}:*)`.padEnd(50) + `| ${exampleDisplay} |`);
});

console.log('');
console.log('=== 建议添加的配置 ===');
console.log('');
console.log('将以下规则添加到 `.claude/settings.local.json` 的 permissions.allow：');
console.log('');

const uniqueRules = uniqueSuggestions.slice(0, 15).map(s => `Bash(${s.baseCmd}:*)`);
console.log('```json');
console.log(JSON.stringify(uniqueRules, null, 2));
console.log('```');
console.log('');

// 输出当前已有配置对比
const settingsFile = path.join(__dirname, '../settings.local.json');
if (fs.existsSync(settingsFile)) {
    try {
        const config = JSON.parse(fs.readFileSync(settingsFile, 'utf8'));
        const existingAllow = config.permissions?.allow || [];

        const newRules = uniqueRules.filter(r => !existingAllow.includes(r));

        if (newRules.length > 0) {
            console.log('');
            console.log('=== 新增规则（当前配置中不存在） ===');
            console.log('');
            console.log(JSON.stringify(newRules, null, 2));
        } else {
            console.log('');
            console.log('✅ 所有建议的规则已存在于当前配置中');
        }
    } catch (e) {
        console.log('无法读取 settings.local.json，跳过对比');
    }
}

console.log('');
console.log('💡 使用 /permission-analyzer 命令可交互式应用这些配置');
console.log('');
