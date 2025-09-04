# DEBUG - 开发调试文档

**状态**: ✅ 活跃维护  
**最后更新**: 2025-09-04

## 📋 目录说明

此目录用于存放临时调试文档和故障排查记录。已完成的项目信息已整合到:
- `/.claude/project_context.md` - 项目当前状态和技术架构
- `/CLAUDE.md` - 开发指南和架构说明

## 🗂️ 文件清理状态

**已移除的过程文档**:
- ✅ `contact_modernization_20250828.md` - Contact页面现代化记录 (已整合到项目文档)
- ✅ `backup_20250827_1012_webflow_removal.md` - Webflow移除记录 (已整合到项目文档)

**保留文档**:
- 📋 `README.md` - 此说明文档

## 🔧 故障排查指南

### 常用调试命令
```bash
# 验证项目完整性
npm run prod:check

# 检查产品数据
npm run validate:products

# 验证导航配置
node scripts/validate-navigation.js

# 检查CSS语法
npm run lint
```

### 问题定位流程
1. **浏览器控制台** - 查看JavaScript错误
2. **CSS验证** - 检查样式加载和显示
3. **数据完整性** - 验证JSON数据结构
4. **响应式测试** - 检查多设备显示

### 性能监控
- **页面加载时间**: 目标 < 2秒
- **首屏渲染时间**: 目标 < 1.8秒
- **CSS文件大小**: 目标 < 100KB
- **JavaScript文件大小**: 目标 < 50KB

## 📞 联系信息验证

当前生产环境联系信息:
- **电话**: (604) 340-1559
- **邮箱**: info@securevisionai.com  
- **地址**: 7080 River Road, Richmond, V6X1X5
- **API服务**: Resend邮件服务集成

---
**注意**: 重大修改时请更新 `/.claude/project_context.md` 而非在此目录创建新文档。