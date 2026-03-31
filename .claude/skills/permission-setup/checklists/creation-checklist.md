# Permission Setup - 创建检查清单

## 创建前检查

- [ ] 已确认用户需求（项目级配置 vs 全局配置）
- [ ] 已扫描现有 `.claude/settings*.json` 文件
- [ ] 已识别项目类型（npm/pnpm/yarn/python 等）

## 扫描检查

- [ ] 项目级配置文件已读取
- [ ] 全局 MCP 配置已扫描或询问
- [ ] package.json 脚本已分析（如存在）

## 配置生成检查

- [ ] permissions.allow 包含文件读操作（Read, Glob, Grep）
- [ ] permissions.allow 包含文件写操作（Edit, Write）
- [ ] permissions.allow 包含项目构建命令
- [ ] permissions.allow 包含 Git 安全命令
- [ ] permissions.deny 包含危险命令（rm -rf, sudo, curl|bash, git push --force）
- [ ] MCP 工具权限已单独确认

## Hooks 配置检查

- [ ] Hooks 配置已询问用户需求
- [ ] 脚本路径使用绝对路径或正确的相对路径
- [ ] 超时时间设置合理（默认 10 秒）

## 写入前检查

- [ ] JSON 格式正确（2 空格缩进）
- [ ] 用户已确认配置预览
- [ ] 输出路径正确（默认 `.claude/settings.local.json`）

## 验证检查

- [ ] JSON 语法验证通过
- [ ] 测试建议已提供

## 安全提示

- [ ] 已告知用户 deny 规则优先级最高
- [ ] 已说明配置修改后无需重启立即生效
- [ ] 已提醒不要在生活开发中使用 YOLO 模式
