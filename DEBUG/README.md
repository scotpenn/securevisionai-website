# DEBUG 备份系统

## 备份命名规范
```
backup_YYYYMMDD_HHMM_[description]
例如: backup_20250827_1430_before_homepage_refactor
```

## 备份触发时机
- 🔧 **简化代码前** (before_simplification)
- 🚧 **实施临时方案前** (before_workaround)  
- 🔄 **大型重构前** (before_major_refactor)

## 备份内容
每次备份包含：
- ✅ 源代码文件
- ✅ 配置文件
- ✅ 数据文件 (products.json, site-config.json)
- ✅ 环境状态记录

## 恢复说明模板

每个备份文件夹包含 `RESTORE_INSTRUCTIONS.md`:

```markdown
# 恢复说明

## 备份信息
- 备份时间: [时间戳]
- 备份原因: [具体原因]
- 项目状态: [当时的项目状态]

## 恢复步骤
1. 停止当前开发服务器
2. 备份当前代码到临时位置
3. 复制备份文件到项目根目录
4. 重启开发服务器进行验证
5. 检查双语功能正常

## 注意事项
- 恢复后需要验证英文/法文版本
- 检查 data/ 目录下JSON文件完整性
- 确认图片路径没有问题
```

## 使用示例

### 创建备份
```bash
# 在进行重要修改前
cp -r . "DEBUG/backup_$(date +%Y%m%d_%H%M)_[description]/"
```

### 快速恢复
```bash  
# 从指定备份恢复
cp -r DEBUG/backup_20250827_1430_before_homepage_refactor/* .
```