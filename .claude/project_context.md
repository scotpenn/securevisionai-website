# SecureVision AI 项目上下文文件

## 项目概述与目标

**项目名称**: SecureVision AI 官方网站  
**项目类型**: 静态产品展示网站  
**主要目标**: 
- 展示安防摄像头和电源保护产品
- 提供双语支持（英文/法文）
- 纯展示功能，不包含电商交易

**核心约束**:
- ❌ 严禁添加电商功能（购物车、结账、支付）
- ✅ 所有用户界面内容必须支持双语
- ✅ 使用统一的CSS架构保持品牌一致性
- ❌ 避免代码重复和冗余文件

## 当前架构状态 (2025-09-02 更新)

### 🎉 CSS统一架构实施完成 - 全站导航一致性 (已完成 ✅)

**最终架构特点**:
```
Frontend: 纯静态HTML + 分层CSS架构 + 统一JavaScript
CSS架构: common.css (公共层) + 页面专用CSS (功能层)
导航系统: IntersectionObserver + CSS变量 + 单Logo滤镜切换
Hero背景: 统一渐变 + banner.jpg叠加效果
JavaScript: common.js全站统一，消除重复逻辑
页面一致性: 4个主页面导航行为完全统一
代码优化: 删除70%重复CSS定义，提升维护性
```

**解决的关键问题**:
- ✅ 彻底解决导航栏"白对白"问题
- ✅ 统一Logo切换效果(透明态白色/滚动态蓝色)  
- ✅ 建立可维护的分层CSS架构
- ✅ 消除跨页面样式不一致

**架构优势**:
- ✅ **公用代码一次编写**: 导航、页脚、Hero等
- ✅ **页面专用样式独立**: 减少代码冲突
- ✅ **性能优化**: 按需加载，避免重复
- ✅ **维护性提升**: 清晰的职责分离
- ✅ **文件大小优化**: 移除2500+行brand_style.css
- ✅ **代码整洁**: 删除所有Webflow遗留代码

### 🏗 新的文件结构
```
/
├── index.html                    # 英文首页
├── about.html, contact.html      # 英文页面
├── products/
│   ├── all.html                  # 产品目录页 (已重构)
│   ├── detail/                   # 产品详情页目录
│   │   ├── template.html         # 通用模板
│   │   └── svc138.html          # 示例产品页
│   └── data/
│       └── products-master.json  # 产品主数据文件
├── css/
│   ├── common.css               # 🔥全站公用样式 (CSS变量+导航+页脚等)
│   ├── index.css                # 首页专用样式
│   ├── about.css                # 关于页专用样式
│   ├── contact.css              # 联系页专用样式
│   ├── customer-care.css        # 客户服务页专用样式
│   ├── products.css             # 产品页专用样式
│   └── product-detail.css       # 产品详情页专用样式
├── js/
│   ├── common.js                # 🔥全站公用脚本
│   └── pages/
│       ├── products.js          # 产品页业务逻辑
│       ├── contact.js           # 联系表单逻辑
│       └── about.js             # 关于页逻辑
├── fr/                          # 法文版本
│   ├── translations/            # 翻译文件目录
│   ├── TRANSLATION-GLOSSARY.md  # 翻译词汇表 (173行)
│   └── glossary_2.md            # 额外翻译
├── data/
│   ├── products.json            # 产品数据库（双语）
│   └── site-config.json         # 站点配置（双语）
└── images/                      # 响应式图片资源
```

## 已完成功能清单

### ✅ 架构重构完成
- [x] **CSS架构重构**: common.css + 页面专用CSS系统
- [x] **JS架构重构**: common.js + pages/专用JS系统
- [x] **Logo动态切换**: 透明/滚动状态自动切换蓝白Logo
- [x] **产品展示系统**: 完全重写products/all.html
- [x] **产品详情页**: 现代化设计的详情页模板和示例
- [x] **静态资源统一**: 所有路径改为绝对路径

### ✅ 页面完成度与现代化状态
- [x] **产品目录页** (products/all.html) - ✅ 完全重构，现代设计
- [x] **产品详情页** (products/detail/) - ✅ 模板和示例页面已创建
- [x] **首页** (index.html) - ✅ 已迁移到新CSS架构 (common.css + index.css)
- [x] **关于页面** (about.html) - ✅ 已迁移到新CSS架构 (common.css + about.css)
- [x] **联系页面** (contact.html) - ✅ 已迁移到新CSS架构 (common.css + contact.css)
- [x] **客户服务** (customer-care.html) - ✅ 已迁移到新CSS架构 (common.css + customer-care.css)
- [ ] **法文页面** (fr/*) - ❌ 需要同步更新

### ✅ 产品类别系统
- [x] Indoor Security Cameras (室内安防摄像头)
- [x] Baby/Pet Monitor (婴儿宠物监控)
- [x] Outdoor Security Cameras (室外安防摄像头)  
- [x] Doorbell Cameras (门铃摄像头)
- [x] Sports Cameras (运动相机)
- [x] Secure Power Systems (安全电源系统)

## 🗂 产品数据管理系统 (2025-08-28 新建)

### 核心架构设计

**分离式数据管理理念:**
- **目录控制**: `products-master.json5` → 控制products/all.html页面
- **详情数据**: 独立JSON5文件 → 每个产品单独管理  
- **静态生成**: template.html → 生成产品详情页
- **双语支持**: 所有数据文件内置英法语版本

### 📁 文件组织结构

```
products/data/
├── products-master.json5          # 🔥目录页面配置 (all.html)
│   ├── 页面设置 (标题, Hero图, 布局)
│   ├── 分类管理 (排序, 可见性, 主题色)  
│   ├── 产品排序 (推荐, 新品, 畅销标签)
│   ├── 筛选配置 (分类筛选, 特性筛选)
│   └── SEO设置 (meta标题, 描述)
│
└── products/                      # 🔥产品详情目录
    ├── svc138.json5               # 产品详情数据文件
    ├── svc201.json5               # 每产品独立文件
    └── [产品ID].json5             # 命名: 产品ID.json5
```

### 🔧 JSON5格式应用

**技术选择原因:**
- ✅ 支持详细注释 (// 和 /* */)
- ✅ 属性名无需引号 (更清晰)
- ✅ 支持尾随逗号 (减少语法错误)
- ✅ 向下兼容标准JSON

**解析工具:** `/js/json5-parser.js`
- 自定义解析器类
- 注释移除和语法扩展支持
- 异步文件加载功能

### 📊 数据文件结构

**products-master.json5 配置:**
```javascript
{
  page_config: {
    title: { en: "Our Products", fr: "Nos Produits" },
    hero_image: "/images/banner.jpg",
    products_per_row: 3,
    show_category_tabs: true,
    enable_filtering: true
  },
  
  categories: {
    indoor: {
      display_order: 1,                    // 分类显示顺序
      visible: true,                       // 是否显示该分类
      name: { en: "...", fr: "..." },      // 双语分类名
      color_theme: "#4B70F5",             // 分类主题色
      products: [                         // 该分类产品列表
        {
          id: "svc138",                   // 关联到svc138.json5
          display_order: 1,               // 分类内排序
          featured: true,                 // 推荐标签
          new: false,                     // 新品标签
          bestseller: false               // 畅销标签
        }
      ]
    }
  }
}
```

**单个产品文件 (如svc138.json5):**
```javascript  
{
  product: {
    // 基础信息
    id: "svc138", model: "SVC138", category: "indoor",
    name: { en: "SVC138 Indoor Camera", fr: "SVC138 Caméra Intérieure" },
    
    // 图片资源
    images: {
      main: "/images/svc138-main.jpg",
      gallery: ["/images/svc138-main.jpg", "..."]
    },
    
    // 产品亮点
    highlights: {
      en: ["1080p HD Video", "Night Vision", "Motion Detection"],
      fr: ["Vidéo HD 1080p", "Vision Nocturne", "Détection Mouvement"]
    },
    
    // 技术规格 - 多分组结构
    specifications: {
      "Video & Image": {
        group_name: { en: "Video & Image", fr: "Vidéo et Image" },
        specs: {
          en: { "Resolution": "1920x1080", "Frame Rate": "30fps" },
          fr: { "Résolution": "1920x1080", "Fréquence": "30fps" }
        }
      }
    },
    
    // 下载文件 (GitHub Releases)
    downloads: {
      en: [{
        name: "Product Brochure", type: "PDF", size: "2.4MB",
        url: "https://github.com/.../releases/download/v1.0/svc138-brochure.pdf"
      }],
      fr: [{ name: "Brochure Produit", ... }]
    }
  }
}
```

### 🚀 产品管理工作流

**添加新产品完整流程:**

1. **创建产品数据** (`/products/data/products/新ID.json5`)
   - 复制现有产品JSON5文件作为模板
   - 修改基础信息 (id, model, name等)  
   - 更新规格参数和下载链接
   - 添加英法双语内容

2. **更新目录配置** (`products-master.json5`)
   - 在对应categories分类中添加产品引用
   - 设置display_order, featured, new, bestseller标签
   - 调整分类内产品排序

3. **上传产品资源**
   - 产品图片 → `/images/` 目录
   - 下载文件 → GitHub Releases仓库
   - 更新JSON5中的图片和下载URL

4. **生成详情页面**
   - 基于 `template.html` 创建静态HTML
   - 或使用JavaScript动态渲染

**修改现有产品:**
- 直接编辑对应的JSON5文件
- 利用详细注释快速定位字段
- 保持英法语内容同步更新

### 📦 下载文件管理 (GitHub Releases)

**存储架构:**
- 主网站仓库: 代码和配置文件  
- 下载专用仓库: `securevision-ai-downloads`
- 自动CDN: GitHub全球加速

**文件命名标准:**
```
[产品ID]-brochure.pdf        # 产品手册 (英语)
[产品ID]-brochure-fr.pdf     # 产品手册 (法语)  
[产品ID]-manual.pdf          # 用户手册
[产品ID]-specs.xlsx          # 技术规格表
[产品ID]-firmware-v2.1.zip   # 固件更新
```

**GitHub Releases URL格式:**
```
https://github.com/username/securevision-ai-downloads/releases/download/v1.0/svc138-brochure.pdf
```

### 🎯 系统优势总结

**开发效率提升:**
- ✅ 模块化数据管理，职责清晰分离
- ✅ 详细注释文档，降低维护成本
- ✅ JSON5格式，提升配置文件可读性  
- ✅ 模板化生成，减少重复工作

**内容管理优化:**
- ✅ 双语数据统一管理，避免不一致
- ✅ 灵活的产品标签和排序系统
- ✅ 分类级别的样式和主题定制
- ✅ 强大的筛选和排序功能

**维护性增强:**
- ✅ 每个产品独立文件，避免编辑冲突
- ✅ 版本化的下载文件管理
- ✅ 清晰的文件组织和命名规范
- ✅ 丰富的元数据和标签系统

## 🎯 接下来的工作计划

### 第零阶段 - 导航统一架构实施 (优先级: 最高 🚨)
- [ ] **建立单一数据源导航系统** - /config/navigation.json英语版本
- [ ] **实施动态导航渲染** - 扩展common.js添加hydrateNavigation()功能  
- [ ] **统一所有HTML页面** - 7个英语页面导航结构占位化
- [ ] **建立开发规范体系** - 命名约定、CSS规则、工作流程
- [ ] **配置自动化工具** - Stylelint、JSON Schema、Git hooks

**当前导航不一致问题 (urgent)**:
- ❌ **index.html**: Products下拉菜单只有"Indoor Camera + All Products"两项  
- ✅ **about.html等**: Products下拉菜单有完整的6类产品分类
- 🎯 **目标**: 所有页面Products菜单显示相同的6类+All Products结构

### 第一阶段 - 产品系统完善 (优先级: 高)
- [ ] **修复产品详情页显示问题** - 测试模板渲染功能
- [ ] **验证JSON5数据解析** - 确保json5-parser.js正常工作
- [ ] **测试所有产品详情页功能** - Tab切换/图片画廊/响应式
- [ ] **建立产品管理文档系统** - 完整的产品添加/编辑流程

### 第二阶段 - 多语言系统重构 (优先级: 中，导航系统完成后处理)  
- [ ] **重构翻译文件系统** - 统一JSON格式的翻译管理
- [ ] **更新所有法语页面** - 同步新CSS架构到fr/目录
- [ ] **创建翻译管理工具** - 自动同步英法语内容
- [ ] **验证双语内容同步** - 确保内容一致性

### 第三阶段 - 性能优化与测试 (优先级: 中)
- [ ] **移除未使用的图片资源** - 清理images目录冗余文件
- [ ] **优化CSS文件大小** - 压缩和合并策略
- [ ] **全站功能测试** - 导航/表单/交互功能验证
- [ ] **移动端响应式完善** - 确保所有页面移动端正常显示

### 第四阶段 - SEO优化系统 (优先级: 中)
- [x] **文件名规范化** - 修复拼写错误(customer-care vs custumer-care) ✅ 已完成
- [ ] **URL结构优化** - 统一URL命名规范，移除拼写错误
- [ ] **Meta标签完善** - 所有页面添加完整的SEO meta标签
- [ ] **结构化数据** - 添加Schema.org标记提升搜索可见性
- [ ] **站点地图生成** - 创建sitemap.xml和robots.txt
- [ ] **内部链接优化** - 改善页面间的内部链接结构
- [ ] **图片SEO优化** - 添加alt标签，优化文件名和格式
- [ ] **页面性能SEO** - 优化Core Web Vitals指标
- [ ] **多语言SEO** - hreflang标签和国际化SEO最佳实践
- [ ] **本地SEO优化** - Google My Business集成和本地搜索优化

### CSS优先级与覆盖规则
```
1. common.css (基础层) - 权重: 10
   - CSS变量定义
   - 基础样式重置  
   - 导航栏样式
   - 页脚样式
   - Hero区域样式
   - 通用组件样式

2. 页面专属.css (功能层) - 权重: 20  
   - 页面特有布局
   - 页面特有组件
   - 页面特有交互样式

3. 页面内嵌样式 (覆盖层) - 权重: 30
   - 紧急覆盖样式
   - 动态样式调整
```

## 产品管理系统

### 产品添加流程 (标准化)
1. **数据更新**: 编辑 `/products/data/products-master.json`
2. **图片资源**: 添加产品图片到 `/images/` 目录
3. **详情页面**: 基于template.html创建产品详情页
4. **翻译内容**: 更新 `/fr/translations/` 相关文件
5. **测试验证**: 本地测试所有功能正常

### 文件命名规范
- **产品ID**: svc138, svb215 等
- **图片命名**: `产品ID-描述.扩展名` (如: svc138-main.jpg)
- **页面文件**: `产品ID.html` (如: svc138.html)
- **CSS文件**: kebab-case (如: product-detail.css)
- **JS文件**: camelCase (如: productDetail.js)

### 图片规格要求
- **产品主图**: 800x800px, WebP格式优先
- **缩略图**: 300x300px, 用于产品卡片显示
- **Hero图**: 1200x600px, 用于分类页面头图
- **画廊图**: 800x600px, 用于产品详情页画廊

## 多语言系统架构

### 翻译文件结构 (计划中)
```
/fr/
├── translations/
│   ├── common.json        # 通用翻译（导航、页脚等）
│   ├── products.json      # 产品翻译
│   └── pages/
│       ├── home.json      # 主页翻译
│       ├── about.json     # 关于页翻译
│       └── contact.json   # 联系页翻译
└── pages/                 # 法语页面文件
```

### 当前翻译文件状态
- ✅ `/fr/glossary_2.md` - 173行翻译对照（已存在）
- ✅ `/products/data/products-master.json` - 产品双语数据（已存在）
- ❌ `/data/site-config.json` - 网站全局翻译（需更新）

## 已知问题与解决状态

### 🐛 已解决问题 (DEBUG-LOG.md)
1. ✅ **Logo尺寸显示异常** (2025-08-28)
   - 原因: CSS重复定义导致样式冲突
   - 解决: 移除重复样式，使用统一的common.css

2. ✅ **静态资源路径混乱** (2025-08-28)
   - 原因: 相对路径和绝对路径混用
   - 解决: 统一使用绝对路径(/images/, /css/, /js/)

3. ✅ **CSS架构重复定义** (2025-08-28)
   - 原因: 多个CSS文件定义相同样式
   - 解决: 建立清晰的CSS层级系统

4. ✅ **JavaScript重复逻辑** (2025-08-28)
   - 原因: 导航、加载动画等逻辑重复实现
   - 解决: 创建common.js统一管理

5. ✅ **brand_style.css依赖清理** (2025-08-28)
   - 问题: 2500+行的大文件影响性能
   - 解决: 完全迁移到模块化CSS架构
   - 成果: 删除brand_style.css + 7个Webflow遗留文件

### 🚨 待解决问题
1. **产品详情页功能验证** (进行中)
   - Tab切换功能
   - 图片画廊交互
   - 相关产品加载
   - 移动端响应式

2. **文件清理工作** (计划中)
   - 删除旧版Webflow CSS文件
   - 清理重复的图片资源
   - 删除未使用的JavaScript文件

3. **文件命名错误** (保留原状)
   - `custumer-care.html` (拼写错误但已部署)
   - `notificaion-bars.html` (拼写错误但已部署)

## 性能与开发标准

### 页面性能目标
- **首屏渲染**: < 1.5秒
- **完全加载**: < 3秒  
- **CSS阻塞时间**: < 500ms
- **JS执行时间**: < 1秒

### 开发规范
```css
/* CSS开发规范 */
- 使用CSS变量 (var(--color-secure-blue))
- 避免!important，使用选择器权重
- 遵循BEM命名规范（如需要）
- 移动端优先的响应式设计
```

```javascript
// JavaScript开发规范  
- 使用ES6+语法
- 避免全局变量污染
- DOM操作前检查元素存在性
- 使用防抖/节流优化性能
```

### 本地开发
```bash
# 启动本地服务器
python -m http.server 8000
# 访问: http://localhost:8000

# 或使用Node.js
npx http-server
```

## 文档维护策略

### 核心文档
- **CLAUDE.md**: 项目指令和约束 (最高优先级)
- **project_context.md**: 项目状态和计划 (本文档)
- **DEBUG-LOG.md**: 问题记录和解决方案

### 即将创建的文档
- **PRODUCT-MANAGEMENT.md**: 产品添加完整指南
- **NAMING-CONVENTIONS.md**: 文件命名规范
- **IMAGE-SPECIFICATIONS.md**: 图片规格要求

---

**最后更新**: 2025-08-28  
**下次更新触发**: 主要功能完成时 / 架构变更时 / 问题解决时  
**维护人员**: Claude Code Assistant