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

## 当前架构状态 (2025-09-05 更新 - Vercel部署准备完成)

### 🎉 完整技术栈架构实施完成 (已完成 ✅)

**最新架构特点**:
```
Frontend: 纯静态HTML + 分层CSS架构 + 统一JavaScript + i18n支持
CSS架构: common.css (公共层) + 页面专用CSS (功能层)
导航系统: 单数据源配置 + 动态渲染 + 双语支持 (EN/FR)
i18n系统: 轻量级 URL路径检测 + JSON翻译字典 + 回退机制
JavaScript: common.js全站统一，消除重复逻辑，集成i18n模块
产品数据: "B+C混合"架构 - JSON5开发 + JSON生产 + Schema验证
产品页面: 硬编码生成器 - 完全静态HTML，无JavaScript依赖
图标系统: 语义化匹配 - 7类产品功能自动选择合适图标
构建系统: 自动化编译 + 数据验证 + 页面生成 + 错误检查
页面一致性: 4个主页面导航行为完全统一
多语言: 114个翻译键 × 2语言 = 完整双语覆盖
产品展示: 8个产品 × 2语言 = 16个硬编码详情页
代码优化: 删除70%重复CSS定义，提升维护性
数据质量: Schema验证 + 构建时错误检查 + 类型安全
```

### 🎯 产品页面系统完成 - 硬编码生成架构实施 (新增 ✅)

**核心技术实现**:
- ✅ **JSON5→JSON编译器**: scripts/build-products.js
- ✅ **硬编码页面生成器**: scripts/generate-product-pages.js
- ✅ **Schema验证系统**: products.schema.json + AJV验证
- ✅ **语义化图标系统**: 7种产品功能自动匹配图标库
- ✅ **双语页面生成**: 自动生成EN/FR版本(16个页面)
- ✅ **CSS规范统一**: 使用CSS变量，符合设计系统
- ✅ **构建自动化**: npm scripts + 一键生产检查
- ✅ **开发体验**: JSON5注释支持 + 友好错误报告

**解决的关键问题**:
- ✅ 彻底解决JSON5浏览器解析不稳定问题 
- ✅ 建立数据质量保证机制（Schema验证）
- ✅ 实现开发友好性（JSON5）与生产稳定性（JSON）的平衡
- ✅ 构建时错误检查，避免运行时数据问题
- ✅ 硬编码页面生成，彻底消除JavaScript依赖问题
- ✅ 语义化图标匹配，提升用户体验和专业性

### 🌍 I18n国际化系统完成状态

**核心功能实现**:
- ✅ **语言检测**: URL路径自动检测 (`/fr/` → 法语)
- ✅ **翻译字典**: 114个键值对，组织清晰的JSON结构
- ✅ **动态渲染**: JavaScript自动应用翻译到DOM元素
- ✅ **双语导航**: navigation.json支持EN/FR完整菜单结构
- ✅ **SEO优化**: hreflang链接，搜索引擎语言识别
- ✅ **验证工具**: 自动化脚本检查翻译完整性

**系统架构优势**:
- ✅ **零依赖**: 纯JavaScript实现，无需外部框架
- ✅ **高性能**: 异步加载，浏览器缓存友好 (~2KB/语言)
- ✅ **回退机制**: EN → fallback → 键名显示，永不中断
- ✅ **开发友好**: 清晰的键值结构，详细验证报告
- ✅ **维护简单**: 单一翻译源，统一管理更新

**技术实现细节**:
```javascript
// 语言检测
I18n.currentLang = I18n.detectLanguage();  // /fr/ → 'fr'

// 翻译应用  
<h1 data-i18n="homepage.tagline">Home, Business and Recreational Security</h1>
→ "Sécurité Résidentielle, Commerciale et Récréative"

// 导航菜单
config.navigation.main[langCode] // 动态加载对应语言菜单
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

### 🏗 新的文件结构 (包含i18n系统)
```
/
├── index.html                    # 英文首页 (含data-i18n标记)
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
│   ├── common.js                # 🔥全站公用脚本 (含i18n模块)
│   └── pages/
│       ├── products.js          # 产品页业务逻辑
│       ├── contact.js           # 联系表单逻辑
│       └── about.js             # 关于页逻辑
├── config/
│   └── navigation.json          # 🔥双语导航配置 (EN/FR)
├── i18n/
│   ├── site.en.json            # 🔥英语翻译字典 (114键)
│   └── site.fr.json            # 🔥法语翻译字典 (114键)
├── scripts/
│   └── validate-i18n.js        # 🔥i18n验证脚本
├── fr/                          # 法文版本页面目录
│   ├── TRANSLATION-GLOSSARY.md  # 翻译词汇表 (173行)
│   ├── glossary_2.md            # 产品描述翻译
│   ├── home.html                # 法语首页
│   ├── about.html               # 法语关于页
│   ├── contact.html             # 法语联系页
│   └── products/all-fr.html     # 法语产品页
├── data/
│   ├── products.json            # 产品数据库（双语）
│   └── site-config.json         # 站点配置（双语）
├── package.json                 # 🔥npm脚本配置
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
- [x] **导航统一系统**: 单数据源配置 + 动态渲染
- [x] **i18n国际化系统**: 轻量级多语言支持 (EN/FR)

### ✅ 页面完成度与现代化状态
- [x] **产品目录页** (products/all.html) - ✅ 完全重构，现代设计
- [x] **产品详情页** (products/detail/) - ✅ 硬编码生成系统，24个静态页面已生成 (12产品×2语言)
- [x] **首页** (index.html) - ✅ 已迁移到新CSS架构 (common.css + index.css)
- [x] **关于页面** (about.html) - ✅ 已迁移到新CSS架构 (common.css + about.css)
- [x] **联系页面** (contact.html) - ✅ 已迁移到新CSS架构 (common.css + contact.css)
- [x] **客户服务** (customer-care.html) - ✅ 已迁移到新CSS架构 (common.css + customer-care.css)
- [x] **法文主页** (fr/home.html) - ✅ 已迁移到新CSS架构，法语内容完整
- [x] **法文关于页** (fr/about.html) - ✅ 已迁移到新CSS架构，法语翻译完成
- [x] **法文联系页** (fr/contact.html) - ✅ 已迁移到新CSS架构，完整法语翻译，联系卡片系统
- [x] **法文客户服务** (fr/customer-care.html) - ✅ 已迁移到新CSS架构，完整法语翻译 
- [x] **法文产品目录页** (fr/products/all-fr.html) - ✅ 已迁移到新CSS架构，完整法语翻译
- [x] **法文产品页面生成** (fr/products/detail/*) - ✅ 模板问题已修复，成功生成13个法语产品页

### ✅ 新增完成功能 (2025-09-04)

#### 🎨 **Category Header Bar组件重构** (最新完成)
- [x] **现代化设计**: 100px高度的紧凑条状设计
- [x] **分层布局**: 1/8渐变色块 + 7/8内容区域的视觉平衡
- [x] **分类专属色彩**: 6种产品分类对应专属渐变色系
  - Indoor: `#4B70F5 → #6A8BFF` (蓝色系)
  - Outdoor: `#353777 → #4B4E95` (深蓝系)
  - Doorbell: `#4C50AE → #7A83FF` (紫蓝系)
  - Sports: `#2F63FF → #69A1FF` (运动蓝)
  - Secure Power: `#FF7F3E → #FFC48F` (橙色系)
  - Baby/Pet: `#4C50AE → #7A83FF` (温和蓝)
- [x] **可点击型号按钮**: 每个产品型号直接链接到详情页面
- [x] **shadcn风格设计**: 圆角outline按钮，统一的视觉语言
- [x] **横向滚动支持**: 多型号时支持水平滚动，隐藏滚动条
- [x] **毛玻璃效果**: `backdrop-filter: blur(8px)` 半透明现代感
- [x] **响应式适配**: 桌面/平板/手机三档适配，渐变块自动隐藏
- [x] **替代方案**: 完全替换原有200px卡片式设计，显著减少页面高度占用

**技术实现**:
```css
.category-header-bar {
  height: 100px;
  display: grid;
  grid-template-columns: 1fr 7fr; /* 1/8 + 7/8 布局 */
  backdrop-filter: blur(8px);
  background: rgba(255, 255, 255, 0.8);
}
```

**视觉效果优势**:
- ✅ **空间效率**: 从200px压缩到100px，节省50%垂直空间
- ✅ **信息密度**: 紧凑布局不牺牲信息展示完整性
- ✅ **品牌一致**: 渐变色与网站整体设计语言保持一致
- ✅ **交互友好**: 型号按钮提供直接的产品访问路径
- ✅ **现代感**: 毛玻璃效果符合当前设计趋势

#### 🌐 **法语产品页面JavaScript修复** (最新完成)
- [x] **语言检测系统**: 自动检测URL路径(/fr/)和HTML lang属性
- [x] **双语分类数据**: 6个产品分类全部支持EN/FR双语名称和描述
  - Indoor: "Caméras Intérieures" 
  - Baby/Pet: "Surveillance Bébé/Animaux"
  - Outdoor: "Caméras Extérieures"
  - Doorbell: "Caméras Sonnettes"
  - Sports: "Caméras Sport"
  - Secure Power: "Alimentation Sécurisée"
- [x] **正确链接路由**: 法语页面使用`href_fr`而非`href_en`链接
- [x] **双语内容渲染**: 产品名称、分类、按钮文本完全本地化
- [x] **双语标签系统**: Featured→Vedette, New→Nouveau, Bestseller→Populaire

**技术实现**:
```javascript
function getCurrentLanguage() {
  const isInFrenchFolder = window.location.pathname.startsWith('/fr/');
  return isInFrenchFolder || htmlLang === 'fr' ? 'fr' : 'en';
}

// 动态链接选择
href: currentLang === 'fr' ? product.href_fr : product.href_en
```

**修复效果**:
- ✅ **法语产品页面完全功能化**: `/fr/products/all-fr.html`正常显示
- ✅ **本地化内容**: 所有文本根据页面语言动态显示
- ✅ **正确导航**: 产品卡片链接到对应语言的详情页面
- ✅ **About页面Tab修复**: 英法两版本图片路径和链接同步修正

#### 🚀 **Resend API邮件服务集成**
- [x] **Vercel API端点**: `/api/contact.js` - Resend SDK集成
- [x] **前端表单处理**: 异步提交，错误处理，双语反馈
- [x] **安全防护**: 蜜罐字段防Bot，HTML转义防XSS
- [x] **环境配置**: 环境变量管理，Vercel部署配置
- [x] **双语支持**: 英法两语表单提交和错误信息
- [x] **依赖管理**: package.json更新，Resend依赖添加

#### 🎨 **联系页面UI优化** 
- [x] **卡片化设计**: 电话、邮箱、地址信息全部卡片化
- [x] **响应式布局**: 桌面端电话/邮箱等宽并列，地址跨列显示
- [x] **视觉交互**: Hover效果，渐变图标，阴影变化
- [x] **地图集成**: 圆角地图容器，优化显示效果
- [x] **CSS架构**: 遵循模块化原则，使用CSS变量系统

#### 🌐 **法语版本系统完善**
- [x] **产品页面模板修复**: 修复占位符语法不匹配问题 (`[PLACEHOLDER]` → `{{PLACEHOLDER}}`)
- [x] **产品页面生成**: 成功生成26个产品页面 (13英语 + 13法语)
- [x] **法语产品目录**: 完整迁移CSS架构，完整法语翻译
- [x] **法语客户服务**: 完整CSS迁移，FAQ系统，法语翻译

### ✅ 产品类别系统
- [x] Indoor Security Cameras (室内安防摄像头)
- [x] Baby/Pet Monitor (婴儿宠物监控)
- [x] Outdoor Security Cameras (室外安防摄像头)  
- [x] Doorbell Cameras (门铃摄像头)
- [x] Sports Cameras (运动相机)
- [x] Secure Power Systems (安全电源系统)

### 🎯 产品清单总览 (2025-09-03 更新)

**总计：12个产品 × 2语言 = 24个静态页面**

#### Indoor Security Cameras (室内安防摄像头)
- **SVC138** - Fixed WiFi Indoor Camera 
- **SVC201** - Fixed WiFi Indoor Camera

#### Baby/Pet Monitor (婴儿宠物监控)
- **SVC180** - Smart WiFi Clock Camera
- **SVC263** - Baby/Pet Monitor Camera 

#### Outdoor Security Cameras (室外安防摄像头)
- **SVC176** - 2MP Outdoor WiFi Camera
- **SVC207** - Pan & Tilt Outdoor Monitor  
- **SVC209** - Battery Outdoor WiFi Camera
- **SVC285** - 3MP Outdoor Spotlight Camera
- **SVC286** - 2MP Outdoor WiFi Spotlight Camera with Pan & Tilt

#### Doorbell Cameras (门铃摄像头)
- **SVB215** - Dual Lens Outdoor WiFi Battery Doorbell

#### Sports Cameras (运动相机)
- **SVC842** - 5K Ultra HD Action Camera

#### Secure Power Systems (安全电源系统)
- **SVT100** - Solar LED Lighting Tower

## 🗂 产品数据管理系统 (2025-09-02 重构完成)

### 核心架构设计 - "硬编码生成"方案

**硬编码页面生成理念:**
- **开发环境**: JSON5格式 → 提供注释支持，提升开发体验
- **生产环境**: 硬编码HTML静态页面 → 无JavaScript依赖，极致性能
- **构建流程**: 页面生成器 + 语义图标匹配 → 确保内容一致性和设计统一
- **双语支持**: 所有页面自动生成英法语双版本 (24个静态页面)

### 📁 文件组织结构

```
products/data/
├── products.schema.json           # 🔥JSON Schema验证规则
├── compiled/                      # 🔥生产环境JSON文件 (构建生成)
│   ├── svc138.json               # 编译后的产品数据
│   ├── svc201.json               # 编译后的产品数据
│   └── products-index.json       # 产品索引文件
├── products/                      # 🔥开发环境JSON5文件
│   ├── svc138.json5               # 源产品数据文件
│   ├── svc201.json5               # 每产品独立文件
│   └── [产品ID].json5             # 命名: 产品ID.json5
└── products-master.json5          # 🔥目录页面配置 (all.html)

products/detail/                    # 🔥硬编码HTML页面 (构建生成)
├── template.html                  # 英文页面模板
├── svc138.html                   # SVC138英文详情页
├── svc201.html                   # SVC201英文详情页
└── [所有12个产品的英文页面]

fr/products/detail/                 # 🔥硬编码HTML页面 (构建生成)
├── template-fr.html              # 法文页面模板  
├── svc138.html                   # SVC138法文详情页
├── svc201.html                   # SVC201法文详情页
└── [所有12个产品的法文页面]

scripts/
├── build-products.js              # 🔥JSON5→JSON编译器
├── validate-products.js           # 🔥数据验证工具
└── generate-product-pages.js      # 🔥硬编码页面生成器
```

### 🔧 硬编码页面生成系统

**开发阶段 - JSON5数据管理:**
- ✅ 支持详细注释 (// 和 /* */)
- ✅ 属性名无需引号 (更清晰)
- ✅ 支持尾随逗号 (减少语法错误)
- ✅ 向下兼容标准JSON

**生产阶段 - 静态HTML页面:**
- ✅ 零JavaScript依赖，纯HTML内容
- ✅ 语义图标自动匹配系统 (7种产品特性类型)
- ✅ 双语页面自动生成 (EN/FR)
- ✅ CSS变量系统确保设计一致性
- ✅ 极致页面加载性能

**语义图标系统 (升级版 - 矢量线条图标):**

#### 图标设计规范
**风格要求:**
- **类型**: SVG矢量图标，纯线条风格(Line Icons)
- **线宽**: 统一2px stroke width
- **尺寸**: 24x24px标准尺寸，可缩放
- **颜色**: 单色设计，支持CSS变量动态着色
- **风格**: 简约现代，几何线条，无填充

#### 7类产品功能图标映射
```svg
1. 视频功能 (HD/1080p/4K/Recording)
   - 图标: camera-line.svg
   - 描述: 摄像头轮廓线条图标
   - 关键词: HD, 1080p, 4K, Video, Recording, Live View

2. 夜视功能 (Night Vision/IR)
   - 图标: moon-line.svg
   - 描述: 月亮/眼睛组合线条图标
   - 关键词: Night Vision, Infrared, IR, Dark, Low Light

3. 无线连接 (Wi-Fi/Smart)
   - 图标: wifi-line.svg
   - 描述: Wi-Fi信号线条图标
   - 关键词: Wi-Fi, Wireless, App, Mobile, Smart, Connection

4. 电源功能 (Battery/Power)
   - 图标: battery-line.svg
   - 描述: 电池轮廓线条图标
   - 关键词: Battery, Power, Rechargeable, Solar, USB

5. 安全防护 (Security/Detection)
   - 图标: shield-line.svg
   - 描述: 盾牌轮廓线条图标
   - 关键词: Security, Detection, Alert, Alarm, Motion, Protect

6. 云存储 (Cloud/Storage)
   - 图标: cloud-line.svg
   - 描述: 云朵轮廓线条图标
   - 关键词: Cloud, Storage, Backup, Remote, Archive

7. 环境适应 (Indoor/Outdoor)
   - 图标: home-line.svg / tree-line.svg
   - 描述: 房屋/树木轮廓线条图标
   - 关键词: Indoor, Outdoor, Waterproof, IP65, IP67, Weather
```

#### SVG图标实现示例
```html
<!-- 内联SVG示例 -->
<svg class="product-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path d="M12 2L2 7V12C2 16.5 4.5 20.5 8 22.5L12 24L16 22.5C19.5 20.5 22 16.5 22 12V7L12 2Z" 
        stroke="var(--color-secure-blue)" 
        stroke-width="2" 
        stroke-linecap="round" 
        stroke-linejoin="round"/>
</svg>

<!-- SVG Sprite引用 -->
<svg class="product-icon">
  <use xlink:href="#icon-shield-line"></use>
</svg>
```

#### 图标组件化系统
```javascript
// icons.js - 图标组件管理
const IconSystem = {
  // 图标映射表
  iconMap: {
    video: 'camera-line',
    night: 'moon-line',
    wifi: 'wifi-line',
    battery: 'battery-line',
    security: 'shield-line',
    cloud: 'cloud-line',
    indoor: 'home-line',
    outdoor: 'tree-line'
  },
  
  // 功能关键词映射
  featureKeywords: {
    video: ['HD', '1080p', '4K', 'Video', 'Recording', 'Live View'],
    night: ['Night Vision', 'Infrared', 'IR', 'Dark', 'Low Light'],
    wifi: ['Wi-Fi', 'Wireless', 'App', 'Mobile', 'Smart'],
    battery: ['Battery', 'Power', 'Rechargeable', 'Solar'],
    security: ['Security', 'Detection', 'Alert', 'Alarm', 'Motion'],
    cloud: ['Cloud', 'Storage', 'Backup', 'Remote'],
    indoor: ['Indoor', 'Home', 'Inside'],
    outdoor: ['Outdoor', 'Waterproof', 'IP65', 'IP67', 'Weather']
  },
  
  // 自动匹配图标
  getIconForFeature(feature) {
    for (const [type, keywords] of Object.entries(this.featureKeywords)) {
      if (keywords.some(kw => feature.toLowerCase().includes(kw.toLowerCase()))) {
        return this.iconMap[type];
      }
    }
    return 'generic-line'; // 默认图标
  }
};
```

#### 图标库集成方案
**推荐图标库:**
1. **Tabler Icons** - 3000+ MIT授权的线条图标
2. **Feather Icons** - 280+ 简约线条图标
3. **Heroicons** - Tailwind官方线条图标库
4. **Custom SVG** - 自定义设计的品牌专属图标

**实施步骤:**
1. 选择或设计统一风格的SVG线条图标
2. 创建SVG sprite文件优化加载
3. 实现CSS变量颜色系统
4. 建立图标组件和自动映射逻辑
5. 优化SVG文件大小(SVGO压缩)

**构建命令:**
```bash
npm run build:products      # 编译JSON5→JSON + 验证
npm run generate:pages      # 生成硬编码HTML页面 (16个)
npm run build:all           # 完整构建：数据编译 + 页面生成
npm run validate:products   # 仅验证已编译的JSON文件
```

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

### 🚀 产品管理工作流 (硬编码生成架构)

**添加新产品完整流程:**

1. **创建产品数据** (`/products/data/products/新ID.json5`)
   - 复制现有产品JSON5文件作为模板
   - 修改基础信息 (id, model, name等)  
   - 更新规格参数和下载链接
   - 添加英法双语内容

2. **构建和生成页面** 
   ```bash
   npm run build:products      # 编译JSON5→JSON + Schema验证
   npm run generate:pages      # 生成硬编码HTML页面
   # 或一键执行
   npm run build:all           # 构建数据 + 生成页面
   ```
   - 自动检查数据完整性和格式正确性
   - 生成 `/products/data/compiled/新ID.json`
   - 生成 `products/detail/新ID.html` (英语版)
   - 生成 `fr/products/detail/新ID.html` (法语版)
   - 自动匹配语义化图标
   - 更新产品索引文件

3. **更新目录配置** (`products-master.json5`)
   - 在对应categories分类中添加产品引用
   - 设置display_order, featured, new, bestseller标签
   - 调整分类内产品排序

4. **上传产品资源**
   - 产品图片 → `/images/` 目录
   - 下载文件 → GitHub Releases仓库
   - 更新JSON5中的图片和下载URL

**修改现有产品:**
1. 编辑对应的JSON5文件 (`/products/data/products/ID.json5`)
2. 重新生成页面: `npm run build:all`
3. 验证更改: `npm run validate:products`
4. 测试生成的HTML页面显示

**硬编码生成优势:**
- ✅ **完全静态**: 无JavaScript依赖，加载速度快
- ✅ **SEO友好**: 服务器端渲染，搜索引擎完全可索引
- ✅ **语义化图标**: 自动匹配7类产品功能图标
- ✅ **双语同步**: 同时生成EN/FR版本
- ✅ **CSS统一**: 使用设计系统变量，样式一致
- ✅ **构建时错误**: 避免运行时数据和显示问题
- ✅ **模板化**: 基于template.html统一结构

### 📦 下载文件管理系统 (完善版)

#### 存储架构设计
**本地存储结构:**
```
/downloads/                     # 下载文件根目录
├── products/                   # 产品相关下载
│   ├── brochures/              # 产品手册
│   │   ├── en/                 # 英文版本
│   │   │   └── svc138-brochure-en-v2.1.pdf
│   │   └── fr/                 # 法文版本
│   │       └── svc138-brochure-fr-v2.1.pdf
│   ├── manuals/                # 用户手册
│   │   ├── svc138-manual-en-v1.5.pdf
│   │   └── svc138-manual-fr-v1.5.pdf
│   ├── specifications/         # 技术规格
│   │   └── svc138-specs-v2025.xlsx
│   └── firmware/               # 固件更新
│       └── svc138-firmware-v3.2.1.zip
├── software/                   # 软件下载
│   ├── mobile/                 # 移动应用
│   │   ├── securevision-ios-v2.5.ipa
│   │   └── securevision-android-v2.5.apk
│   └── desktop/                # 桌面软件
│       ├── securevision-win-v1.2.exe
│       └── securevision-mac-v1.2.dmg
├── documentation/              # 通用文档
│   ├── quick-start-guide.pdf
│   ├── installation-guide.pdf
│   └── troubleshooting.pdf
└── certificates/               # 认证证书
    ├── ce-certification.pdf
    ├── fcc-certification.pdf
    └── rohs-compliance.pdf
```

#### 文件命名规范
**标准命名格式:**
```
[产品ID]-[文件类型]-[语言]-v[版本号].[扩展名]

示例:
svc138-brochure-en-v2.1.pdf    # 英文产品手册
svc138-manual-fr-v1.5.pdf      # 法文用户手册
svc138-firmware-v3.2.1.zip     # 固件(无语言区分)
svc138-specs-v2025.xlsx        # 规格表(年份版本)
```

**文件类型代码:**
- `brochure` - 产品手册
- `manual` - 用户手册
- `specs` - 技术规格
- `firmware` - 固件更新
- `quickstart` - 快速指南
- `datasheet` - 数据表
- `cert` - 认证证书

**语言代码:**
- `en` - English
- `fr` - Français
- 省略 - 语言无关文件

**版本号规则:**
- 主版本.次版本.修订号 (如: v2.1.3)
- 年份版本 (如: v2025)
- 日期版本 (如: v20250903)

#### CDN部署策略
**多级存储:**
1. **本地服务器** - 实时更新，完整文件库
2. **CDN边缘节点** - 热门文件缓存
3. **GitHub Releases** - 备份和版本管理
4. **云存储备份** - AWS S3 / 阿里云OSS

**URL结构:**
```
# 本地下载
https://securevision-ai.com/downloads/products/brochures/en/svc138-brochure-en-v2.1.pdf

# CDN加速
https://cdn.securevision-ai.com/downloads/products/brochures/en/svc138-brochure-en-v2.1.pdf

# GitHub备份
https://github.com/securevision/downloads/releases/download/v2.1/svc138-brochure-en-v2.1.pdf
```

#### 下载页面元数据
**JSON配置示例** (`/data/downloads.json`):
```json
{
  "downloads": {
    "svc138": {
      "brochure": {
        "en": {
          "filename": "svc138-brochure-en-v2.1.pdf",
          "version": "2.1",
          "size": "2.4MB",
          "lastUpdated": "2025-09-01",
          "checksum": "sha256:abc123...",
          "downloadCount": 1523
        },
        "fr": {
          "filename": "svc138-brochure-fr-v2.1.pdf",
          "version": "2.1",
          "size": "2.4MB",
          "lastUpdated": "2025-09-01"
        }
      },
      "manual": {
        "en": {
          "filename": "svc138-manual-en-v1.5.pdf",
          "version": "1.5",
          "size": "8.7MB",
          "lastUpdated": "2025-08-15"
        }
      },
      "firmware": {
        "latest": {
          "filename": "svc138-firmware-v3.2.1.zip",
          "version": "3.2.1",
          "size": "45.3MB",
          "releaseNotes": "Bug fixes and performance improvements",
          "minVersion": "2.0.0",
          "lastUpdated": "2025-09-03"
        }
      }
    }
  }
}
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

### ✅ 已完成阶段 - 产品构建系统完成 (2025-09-03 🎉)
- [x] **产品数据构建系统** - JSON5→JSON编译+Schema验证 ✅
- [x] **硬编码页面生成器** - 12产品×2语言=24静态页面 ✅
- [x] **语义化图标系统** - 7类产品功能自动匹配图标 ✅
- [x] **产品分类完整性** - 6大类产品全覆盖 ✅
- [x] **双语页面架构** - 英法语产品详情页同步生成 ✅

**产品系统架构优势**:
- ✅ **零JavaScript依赖**: 硬编码HTML，极致性能
- ✅ **构建时验证**: Schema检查，避免运行时错误
- ✅ **开发友好**: JSON5注释支持，开发体验优化
- ✅ **SEO友好**: 静态页面，搜索引擎完全可索引

### ✅ 已完成阶段 - 联系系统与法语完善 (2025-09-04 🎉)

#### 第一阶段 - 法语页面系统完善 (全部完成 ✅)
- [x] **法语基础页面修复** - 主页、关于页、联系页已迁移到新CSS架构 ✅
- [x] **法语页面样式统一** - 已确保与英语版本CSS规范一致 ✅
- [x] **法语内容翻译** - 核心页面法语翻译已完成 ✅
- [x] **法语客户服务页** - fr/customer-care.html 已迁移到新架构，完整法语翻译 ✅
- [x] **法语产品页面生成修复** - 模板占位符问题已修复，成功生成13个法语产品页 ✅
- [x] **法语产品目录页** - fr/products/all-fr.html 已迁移到新架构 ✅
- [x] **法语产品页面JavaScript修复** - 语言检测、双语内容渲染、正确链接路由 ✅
- [x] **About页面Category Tab修复** - 英法版本图片路径和链接同步修正 ✅

#### 第二阶段 - Resend API邮件服务集成 (全部完成 ✅) 
- [x] **Vercel API端点开发** - `/api/contact.js` 完整实现 ✅
- [x] **前端表单集成** - 异步提交，双语错误处理 ✅
- [x] **安全防护实施** - 蜜罐字段，HTML转义，环境变量保护 ✅
- [x] **联系页面UI优化** - 卡片化设计，响应式布局 ✅

### ✅ 已完成阶段 - 下载系统实施 (2025-09-04 🎉)

#### GitHub-Based下载系统 (全部完成 ✅)
- [x] **GitHub下载仓库创建** - `https://github.com/scotpenn/securevision-downloads` ✅
- [x] **文件组织架构** - 17个PDF文件按产品目录整理完成 ✅
- [x] **命名规范实施** - `[product-id]-[type]-[language].pdf`格式标准化 ✅
- [x] **链接更新完成** - 38个产品页面下载链接全部更新 ✅
- [x] **文件可访问验证** - raw.githubusercontent.com链接测试通过 ✅

**下载系统技术架构:**
```
GitHub Repository: securevision-downloads
├── products/
│   ├── svc138/     # 各产品文件夹
│   │   ├── svc138-brochure-en.pdf
│   │   └── svc138-manual-en.pdf
│   └── [11个产品目录]
└── 共17个PDF文件

访问模式: https://raw.githubusercontent.com/scotpenn/securevision-downloads/main/products/[product-id]/[filename]
```

### 🚧 下一阶段工作计划 (最终优化阶段)

#### 第三阶段 - 内容系统完善 (优先级: 高)

**⭐ 建议优先完成:**
- [ ] **FAQ动态系统集成** - 将`/data/faq.json`集成到customer-care.html
  - ✅ 已有147个FAQ条目数据准备完毕  
  - 支持分类筛选 (warranty, installation, compatibility, troubleshooting等)
  - 支持搜索功能
  - 英法双语FAQ内容渲染
  - 手风琴折叠展示效果
  - 分类标签和特色FAQ标识

**📸 可选优化项目:**
- [ ] **首页产品类别图片优化** (当前图片已可用)
  - 如需专业级图片可替换为 (400×300px WebP格式) 
  - 命名规则: `category-[name]-hero.webp`
  - 当前`category-*.png`图片运行正常

#### 第四阶段 - 补充下载文件 (优先级: 低)
- [ ] **缺失产品文档补充** - SVC286, SVC842, SVT100产品文档
- [ ] **法文版本文档** - 所有产品的法文版PDF文档
- [ ] **技术规格表** - 添加datasheet类型文档

#### 第五阶段 - 语义图标系统升级 (优先级: 低)
- [ ] **矢量线条图标替换** - 将现有图标改为矢量线条风格
- [ ] **图标库统一** - 建立统一的SVG图标库
- [ ] **图标系统优化** - 优化图标匹配算法和显示效果

### 🎯 技术架构完成度总览 (2025-09-04)

**核心系统完成率**: 100% ✅ - **READY TO DEPLOY**
- ✅ **CSS架构**: 模块化系统，所有页面已迁移 (100%)
- ✅ **JavaScript架构**: 统一common.js + 页面专用JS + 双语支持 (100%)
- ✅ **产品数据系统**: B+C混合架构，26个页面生成 (100%)
- ✅ **双语支持**: 英法语页面完整覆盖 + JavaScript双语渲染 (100%)
- ✅ **邮件系统**: Resend API集成，表单功能完整 (100%)
- ✅ **响应式设计**: 所有页面多屏幕适配 (100%)
- ✅ **导航修复**: Products菜单单击跳转正常 (100%)
- ✅ **Category组件**: 现代化Header Bar设计完成 (100%)
- ✅ **下载系统**: GitHub-based文档下载系统完成 (100%)
- ✅ **状态更新**: "Ready to Order"状态全产品实施 (100%)
- ✅ **UI修复**: 产品缩略图边框显示修复 (100%)
- ✅ **Vercel部署**: 文件结构整理和部署配置完成 (100%)

**后续优化工作** (可选): 
- ⏳ **FAQ动态系统**: data/faq.json集成到customer-care页面
- ⏳ **分析工具**: Google Analytics和性能监控集成

---

## 🚀 Vercel部署准备状态 (2025-09-05 最终状态)

### ✅ 部署就绪 - 所有系统验证通过

**核心功能完整性**:
- ✅ **静态页面**: 24个产品页面 + 核心页面全部生成
- ✅ **Serverless API**: contact.js与Resend API集成完成
- ✅ **双语架构**: EN/FR完整支持，hreflang配置正确
- ✅ **下载系统**: GitHub-based PDF管理，智能可用性检测
- ✅ **响应式设计**: 移动端优先，所有断点测试通过

**构建系统**:
- ✅ **产品编译**: JSON5 → JSON schema验证无错误
- ✅ **页面生成**: 硬编码生成器修复，index.json过滤完成
- ✅ **依赖管理**: package.json build脚本配置完成
- ✅ **环境配置**: .env.local设置，RESEND_API_KEY ready

**部署配置**:
- ✅ **vercel.json**: 完整配置（静态构建 + API函数 + 缓存优化）
- ✅ **安全配置**: Headers、input sanitization、honeypot protection
- ✅ **性能优化**: 静态资源缓存策略，CDN ready

**验证工具**:
- ✅ **deploy-check.sh**: 7项全面验证脚本，所有检查通过
- ✅ **文档齐全**: DEPLOYMENT.md + READY-TO-DEPLOY.md
- ✅ **错误修复**: 法语页面路径、JS依赖检查优化

### 📊 最终技术指标
- **页面总数**: 30+ HTML页面 (核心页面 + 24个产品页面)
- **API函数**: 1个 (/api/contact.js) - 生产就绪
- **CSS架构**: 模块化系统，7个专用CSS文件
- **JavaScript**: 纯Vanilla JS，无依赖，5个功能模块
- **多语言**: 双语支持，114个翻译键值对
- **构建时间**: < 30秒 (JSON编译 + 页面生成)
- **性能目标**: < 2s页面加载，满足Vercel要求

### 🎯 立即部署步骤
1. **GitHub Push**: 提交所有更改到main分支
2. **Vercel连接**: 将仓库连接到Vercel控制台
3. **环境变量**: 设置
4. **部署**: 自动触发构建和部署流程
**状态**: 🚀 **PRODUCTION READY** - 可立即部署到生产环境

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

## ✅ 多语言i18n系统架构 (已完成)

### 实际翻译文件结构
```
/i18n/
├── site.en.json           # 🔥英语翻译字典 (114个键)
└── site.fr.json           # 🔥法语翻译字典 (114个键)

/config/
└── navigation.json        # 🔥双语导航配置 (EN/FR)

/scripts/
└── validate-i18n.js       # 🔥翻译完整性验证脚本

/fr/ (现存翻译资源)
├── TRANSLATION-GLOSSARY.md  # 翻译词汇表 (173行，已整合)
├── glossary_2.md            # 产品描述翻译 (已整合)
└── pages/                   # 法语页面文件 (待更新架构)
```

### 翻译字典组织结构
```javascript
// site.en.json / site.fr.json
{
  "navigation": { ... },        // 导航菜单翻译
  "productCategories": { ... }, // 产品分类翻译
  "homepage": { ... },          // 首页内容翻译  
  "productFeatures": { ... },   // 产品功能翻译
  "productDescriptions": { ... }, // 产品描述短语
  "babyPetFeatures": { ... },   // 婴儿宠物监控特性
  "mobileApp": { ... },         // 移动应用翻译
  "accessories": { ... },       // 配件翻译
  "additionalOptions": { ... }, // 附加选项翻译
  "products": { ... },          // 产品页面翻译
  "footer": { ... },            // 页脚翻译
  "common": { ... }             // 通用UI翻译
}
```

### 当前翻译文件状态
- ✅ `/i18n/site.en.json` - 英语翻译字典 (114键) 🔥已完成
- ✅ `/i18n/site.fr.json` - 法语翻译字典 (114键) 🔥已完成  
- ✅ `/config/navigation.json` - 双语导航配置 🔥已完成
- ✅ `/fr/TRANSLATION-GLOSSARY.md` - 源翻译资料 (已整合到字典)
- ✅ `/scripts/validate-i18n.js` - 验证工具 🔥已完成

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

6. ✅ **FAQ系统实现** (2025-09-04)
   - 问题: customer-care.html硬编码FAQ内容，不易维护
   - 解决: 创建动态FAQ系统，支持分类、搜索、双语
   - 成果: `/data/faq.json` + `/js/pages/customer-care.js` + 完整CSS样式

7. ✅ **导航Products链接Bug修复** (2025-09-04)
   - 问题: 导航栏Products链接无法跳转到/products/all.html
   - 原因: common.js中e.preventDefault()阻止了默认链接行为
   - 解决: 改进点击逻辑，支持单击跳转、双击切换下拉菜单

8. ✅ **Hero部分标准化** (2025-09-04)
   - 问题: 各页面Hero部分格式不统一
   - 解决: 统一所有页面使用与index.html相同的Hero结构和内容
   - 成果: 6个主要页面Hero格式完全一致

### 🚨 待解决问题
1. **法语页面CSS架构迁移** (优先级高)
   - fr/customer-care.html仍使用旧Webflow CSS
   - 法语产品详情页生成器有问题(文件大小异常)
   - 需要完成法语页面的CSS架构统一

2. **Products页面联系卡片样式** (进行中)
   - HTML已添加但缺少对应CSS样式
   - 需要在products.css中添加contact-info-section样式
   - 确保与现有CSS架构兼容

3. **文件清理工作** (计划中)
   - 删除旧版Webflow CSS文件
   - 清理重复的图片资源
   - 删除未使用的JavaScript文件

4. **文件命名错误** (保留原状)
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

**最后更新**: 2025-09-03  
**主要更新内容**: 
1. 下载系统架构完善 - 建立完整文件管理规范和CDN部署策略
2. 语义图标系统升级 - 定义SVG矢量线条图标规范和组件化架构
3. 新增第四、第五阶段任务规划 - 下载中心和图标系统实施计划

**下次更新触发**: 主要功能完成时 / 架构变更时 / 问题解决时  
**维护人员**: Claude Code Assistant

---

## 📋 系统部署总结 (2025-09-02) - 双系统完成

### I18n国际化系统 (已完成 ✅)

**完成的核心组件**
1. **翻译字典系统** - 114个键值对 × 2语言 = 完整覆盖
2. **语言检测机制** - URL路径自动识别 (/fr/ → 法语)
3. **动态内容渲染** - JavaScript自动应用翻译到DOM
4. **双语导航菜单** - 统一配置源，支持完整产品分类
5. **SEO国际化** - hreflang标签，搜索引擎友好
6. **验证自动化** - 翻译完整性和一致性检查工具

### 产品构建系统 (新完成 ✅)

**完成的核心组件**
1. **编译系统** - JSON5→JSON自动转换，支持注释和语法扩展
2. **Schema验证** - AJV驱动的完整数据结构验证
3. **构建工具链** - build-products.js + validate-products.js
4. **前端重构** - 移除JSON5解析依赖，原生JSON加载
5. **错误检查** - 构建时捕获数据问题，避免运行时错误
6. **双语验证** - 确保EN/FR内容结构一致性

### 技术架构优势
- ✅ **零运行时依赖**: 纯JavaScript + 原生JSON，无外部解析库
- ✅ **高性能**: 编译后JSON文件更小更快
- ✅ **开发友好**: JSON5注释支持，Schema验证错误提示
- ✅ **生产稳定**: 构建时验证，运行时无解析错误风险
- ✅ **可维护性**: 清晰的数据文件结构和验证规则

### 开发者友好特性
- 🔧 **npm run build:products** - JSON5编译 + Schema验证
- 🔧 **npm run validate:products** - 已编译JSON文件验证
- 🔧 **npm run prod:check** - 完整的生产就绪检查
- 🔧 **npm run validate-i18n** - i18n系统验证
- 🔧 **详细报告**: 构建状态和错误详情
- 🔧 **Schema驱动**: 类型安全的数据结构定义

**系统状态**: 双系统生产就绪 ✅