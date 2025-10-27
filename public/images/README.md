# SecureVision AI Logo Asset Management

## 标准Logo文件

**主导航Logo（唯一标准）**:
```
images/SVA-Logo-Main2x-p-800 - WEB.png
```

- 所有页面的主导航必须使用此文件
- 通过CSS filter实现颜色切换（透明态白色/滚动态原色）
- 尺寸: 适配72px高度的导航栏

## 其他Logo用途

**页脚Logo**: 
- 当前使用: `images/01-logo.png`
- 用途: 仅限页脚区域
- 不影响主导航统一性

**水印/装饰**: 
- 当前使用: `images/SVA-Mark-Grey.png`
- 用途: 页面装饰性水印
- 不影响主导航统一性

## 重要规则

1. **主导航Logo**: 
   - ✅ 只能使用 `SVA-Logo-Main2x-p-800 - WEB.png`
   - ❌ 禁止在导航栏使用其他Logo文件

2. **页脚/装饰Logo**: 
   - ✅ 可以使用其他Logo文件
   - ✅ 不受主导航统一性要求约束

3. **法语页面**: 
   - 🔄 需要统一更新到标准Logo文件
   - 🔄 将在法语版本重构时处理

## 当前状态

- ✅ **英语主页面已统一**: index.html, about.html, contact.html, customer-care.html, products/all.html
- 🔄 **法语页面待更新**: fr/ 目录下所有页面
- 🔄 **产品详情页待确认**: products/detail/ 目录

## 验证命令

检查主导航Logo使用情况:
```bash
grep -r "nav-logo.*img src" --include="*.html" .
```

---
**最后更新**: 2025-09-02  
**维护规则**: 主导航Logo文件路径不得修改，确保全站一致性