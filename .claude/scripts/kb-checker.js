#!/usr/bin/env node
/**
 * 知识库检测器 - 检测用户输入中的技术名词是否在知识库中存在
 *
 * 功能：
 * 1. 从用户输入中提取技术名词
 * 2. 查询 knowledge-index.json 检查是否存在
 * 3. 发现缺失时输出触发标记
 */

const fs = require('fs');
const path = require('path');

// ==================== 配置项 ====================
const CONFIG = {
  // 索引文件路径
  INDEX_FILE: path.join(__dirname, '..', 'knowledge-index.json'),

  // 输出触发标记（当发现缺失时输出此标记）
  TRIGGER_MARKER: '[KB-MISSING]',

  // 工作目录根目录（知识库所在）
  WORKSPACE_ROOT: path.join(__dirname, '..', '..'),

  // 知识库目录名
  KB_DIR: 'Knowledge Base',

  // 常见技术名词扩展列表（用于补充识别）
  TECH_ENTITIES: [
    // 前端框架
    { name: 'Vue', aliases: ['vue', 'vue.js', 'vuejs', 'Vue.js', 'VueJS', 'vue2', 'vue3', 'Vue 3', 'Vue 2'] },
    { name: 'Angular', aliases: ['angular', 'angular.js', 'angularjs', 'Angular.js'] },
    { name: 'Svelte', aliases: ['svelte', 'Svelte'] },
    { name: 'Next.js', aliases: ['next', 'next.js', 'Next', 'Next.js', 'nextjs'] },
    { name: 'Nuxt', aliases: ['nuxt', 'nuxt.js', 'Nuxt.js', 'nuxtjs'] },

    // 后端技术
    { name: 'Node.js', aliases: ['node', 'nodejs', 'Node', 'Node.js', 'NodeJS'] },
    { name: 'Python', aliases: ['python', 'Python', 'py', 'Django', 'Flask', 'FastAPI'] },
    { name: 'Java', aliases: ['java', 'Java', 'Spring', 'Spring Boot', 'SpringBoot'] },
    { name: 'Go', aliases: ['go', 'Go', 'golang', 'Golang'] },
    { name: 'Rust', aliases: ['rust', 'Rust'] },

    // 数据库
    { name: 'MySQL', aliases: ['mysql', 'MySQL', 'MariaDB'] },
    { name: 'PostgreSQL', aliases: ['postgresql', 'PostgreSQL', 'postgres', 'psql'] },
    { name: 'MongoDB', aliases: ['mongodb', 'MongoDB', 'mongo'] },
    { name: 'Redis', aliases: ['redis', 'Redis'] },
    { name: 'SQLite', aliases: ['sqlite', 'SQLite', 'sqlite3'] },

    // 云平台与 DevOps
    { name: 'Docker', aliases: ['docker', 'Docker', '容器化'] },
    { name: 'Kubernetes', aliases: ['kubernetes', 'Kubernetes', 'k8s', 'K8s'] },
    { name: 'AWS', aliases: ['aws', 'AWS', 'Amazon Web Services'] },
    { name: 'Vercel', aliases: ['vercel', 'Vercel'] },
    { name: 'Netlify', aliases: ['netlify', 'Netlify'] },

    // 开发工具
    { name: 'Git', aliases: ['git', 'Git'] },
    { name: 'Webpack', aliases: ['webpack', 'Webpack'] },
    { name: 'Vite', aliases: ['vite', 'Vite'] },
    { name: 'TypeScript', aliases: ['typescript', 'TypeScript', 'ts', 'TS', 'typeScript'] },
    { name: 'ESLint', aliases: ['eslint', 'ESLint'] },
    { name: 'Prettier', aliases: ['prettier', 'Prettier'] },

    // 测试工具
    { name: 'Jest', aliases: ['jest', 'Jest'] },
    { name: 'Vitest', aliases: ['vitest', 'Vitest'] },
    { name: 'Cypress', aliases: ['cypress', 'Cypress'] },
    { name: 'Playwright', aliases: ['playwright', 'Playwright'] },

    // CSS 相关
    { name: 'Tailwind CSS', aliases: ['tailwind', 'Tailwind', 'tailwindcss', 'Tailwind CSS'] },
    { name: 'Sass', aliases: ['sass', 'Sass', 'scss', 'SCSS'] },
    { name: 'Less', aliases: ['less', 'Less'] },
    { name: 'PostCSS', aliases: ['postcss', 'PostCSS'] },

    // UI 组件库
    { name: 'Ant Design', aliases: ['antd', 'Ant Design', 'ant-design'] },
    { name: 'Material UI', aliases: ['mui', 'Material UI', 'material-ui', '@mui'] },
    { name: 'Chakra UI', aliases: ['chakra', 'Chakra UI', 'chakra-ui'] },
    { name: 'Radix UI', aliases: ['radix', 'Radix UI', 'radix-ui'] },

    // 状态管理
    { name: 'Redux', aliases: ['redux', 'Redux', 'react-redux'] },
    { name: 'Zustand', aliases: ['zustand', 'Zustand'] },
    { name: 'Pinia', aliases: ['pinia', 'Pinia'] },
    { name: 'Vuex', aliases: ['vuex', 'Vuex'] },

    // 移动端
    { name: 'React Native', aliases: ['react native', 'React Native', 'react-native', 'RN'] },
    { name: 'Flutter', aliases: ['flutter', 'Flutter'] },
    { name: 'React Server Components', aliases: ['rsc', 'RSC', 'React Server Components', '服务器组件'] },

    // AI 相关
    { name: 'OpenAI', aliases: ['openai', 'OpenAI', 'GPT', 'gpt', 'gpt-4', 'GPT-4'] },
    { name: 'Anthropic', aliases: ['anthropic', 'Anthropic', 'Claude', 'claude'] },
    { name: 'LangChain', aliases: ['langchain', 'LangChain'] },

    // 其他热门技术
    { name: 'GraphQL', aliases: ['graphql', 'GraphQL'] },
    { name: 'REST API', aliases: ['rest', 'REST', 'RESTful', 'REST API'] },
    { name: 'gRPC', aliases: ['grpc', 'gRPC'] },
    { name: 'WebSocket', aliases: ['websocket', 'WebSocket', 'ws'] },
    { name: 'JWT', aliases: ['jwt', 'JWT', 'JSON Web Token'] },
    { name: 'OAuth', aliases: ['oauth', 'OAuth', 'OAuth2', 'oauth2'] },
  ]
};

// ==================== 核心功能 ====================

/**
 * 读取知识库索引文件
 * @returns {Object} 索引数据
 */
function readIndexFile() {
  try {
    if (fs.existsSync(CONFIG.INDEX_FILE)) {
      const data = fs.readFileSync(CONFIG.INDEX_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error(`[kb-checker] 读取索引文件失败：${error.message}`);
  }
  return { topics: [], coverage: {} };
}

/**
 * 从用户输入中提取技术名词
 * @param {string} input 用户输入
 * @returns {Array<Object>} 匹配到的技术名词列表
 */
function extractTechEntities(input) {
  const inputLower = input.toLowerCase();
  const matched = [];
  const matchedNames = new Set();

  // 1. 从索引中匹配
  const indexData = readIndexFile();
  for (const topic of indexData.topics || []) {
    const allAliases = [topic.name, ...(topic.aliases || [])];
    for (const alias of allAliases) {
      if (inputLower.includes(alias.toLowerCase()) && !matchedNames.has(topic.name)) {
        matchedNames.add(topic.name);
        matched.push({
          name: topic.name,
          exists: true,
          file: topic.file,
          source: 'index'
        });
        break;
      }
    }
  }

  // 2. 从扩展技术名词库中匹配
  for (const entity of CONFIG.TECH_ENTITIES) {
    for (const alias of entity.aliases) {
      if (inputLower.includes(alias.toLowerCase()) && !matchedNames.has(entity.name)) {
        matchedNames.add(entity.name);
        matched.push({
          name: entity.name,
          exists: false, // 默认不存在，后续会检查
          file: null,
          source: 'extended'
        });
        break;
      }
    }
  }

  return matched;
}

/**
 * 检查技术名词是否在知识库中存在
 * @param {Array<Object>} entities 技术名词列表
 * @returns {Array<Object>} 包含存在状态的结果
 */
function checkExistence(entities) {
  const indexData = readIndexFile();
  const existingNames = new Set(
    (indexData.topics || []).map(t => t.name.toLowerCase())
  );

  return entities.map(entity => ({
    ...entity,
    exists: existingNames.has(entity.name.toLowerCase()) || entity.exists
  }));
}

/**
 * 检测缺失并输出结果
 * @param {string} input 用户输入
 * @returns {Object} 检测结果
 */
function detectMissing(input) {
  const entities = extractTechEntities(input);
  const checked = checkExistence(entities);

  const missing = checked.filter(e => !e.exists);
  const existing = checked.filter(e => e.exists);

  return {
    allEntities: checked,
    missing,
    existing,
    hasMissing: missing.length > 0
  };
}

/**
 * 更新索引文件（添加新主题）
 * @param {string} topicName 主题名称
 */
function addToIndex(topicName) {
  const indexData = readIndexFile();

  // 检查是否已存在
  const exists = indexData.topics.some(t => t.name.toLowerCase() === topicName.toLowerCase());
  if (exists) {
    console.log(`[kb-checker] 主题 "${topicName}" 已在索引中`);
    return;
  }

  // 添加新主题
  indexData.topics.push({
    name: topicName,
    file: `${topicName}/${topicName} 核心知识体系.md`,
    aliases: [topicName.toLowerCase()],
    lastModified: new Date().toISOString().split('T')[0],
    status: 'pending'
  });

  // 写回文件
  try {
    fs.writeFileSync(CONFIG.INDEX_FILE, JSON.stringify(indexData, null, 2), 'utf-8');
    console.log(`[kb-checker] 已将 "${topicName}" 添加到索引（状态：pending）`);
  } catch (error) {
    console.error(`[kb-checker] 写入索引文件失败：${error.message}`);
  }
}

/**
 * 标记索引中的主题为已完成
 * @param {string} topicName 主题名称
 */
function markTopicComplete(topicName) {
  const indexData = readIndexFile();

  const topic = indexData.topics.find(t => t.name.toLowerCase() === topicName.toLowerCase());
  if (topic) {
    topic.status = 'complete';
    topic.lastModified = new Date().toISOString().split('T')[0];

    try {
      fs.writeFileSync(CONFIG.INDEX_FILE, JSON.stringify(indexData, null, 2), 'utf-8');
      console.log(`[kb-checker] 已标记 "${topicName}" 为完成状态`);
    } catch (error) {
      console.error(`[kb-checker] 写入索引文件失败：${error.message}`);
    }
  }
}

/**
 * 显示当前索引状态
 */
function showIndexStatus() {
  const indexData = readIndexFile();

  console.log('\n=== 知识库索引状态 ===\n');
  console.log(`知识库目录：${CONFIG.KB_DIR}`);
  console.log(`最后更新：${indexData.lastUpdated || '未知'}`);
  console.log(`\n已收录主题 (${indexData.topics?.length || 0}):`);

  for (const topic of indexData.topics || []) {
    const status = topic.status === 'complete' ? '✅' : topic.status === 'pending' ? '⏳' : '📄';
    console.log(`  ${status} ${topic.name} -> ${topic.file}`);
  }

  console.log('\n覆盖领域:');
  for (const [domain, topics] of Object.entries(indexData.coverage || {})) {
    console.log(`  ${domain}: ${topics.join(', ')}`);
  }
  console.log('');
}

// ==================== 命令行入口 ====================

const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case '--detect':
    // 检测模式：kb-checker.js --detect "用户输入内容"
    const input = args.slice(1).join(' ').replace(/"/g, '');
    if (input) {
      const result = detectMissing(input);

      if (result.hasMissing) {
        // 输出触发标记
        console.log(`${CONFIG.TRIGGER_MARKER} 检测到知识库缺少相关文档！`);
        console.log(`\n缺失的主题 (${result.missing.length}):`);
        for (const m of result.missing) {
          console.log(`  - ${m.name} (${m.source === 'index' ? '已有索引' : '新技术名词'})`);
        }
        console.log(`\n建议：是否为 "${result.missing[0].name}" 创建知识文档？`);
        console.log('回复「是」将调用 /research 自动调研并创建文档。');
      }
    }
    break;

  case '--add':
    // 添加主题到索引：kb-checker.js --add "主题名"
    if (args[1]) {
      addToIndex(args[1]);
    }
    break;

  case '--complete':
    // 标记完成：kb-checker.js --complete "主题名"
    if (args[1]) {
      markTopicComplete(args[1]);
    }
    break;

  case '--status':
    // 查看状态：kb-checker.js --status
    showIndexStatus();
    break;

  default:
    console.log('用法：node kb-checker.js <command> [args]');
    console.log('命令:');
    console.log('  --detect "用户输入"  检测用户输入中的技术名词是否缺失');
    console.log('  --add <主题名>      添加新主题到索引');
    console.log('  --complete <主题名> 标记主题为已完成');
    console.log('  --status           查看索引状态');
}
