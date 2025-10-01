# CLAUDE.md

本文件为 Claude Code (claude.ai/code) 在此代码库中工作时提供指导。

## 项目概述

SecureVision AI 是一个安防摄像头和电源保护产品的静态展示网站。网站展示各类安防产品，包括室内外摄像头、门铃、婴儿监视器、运动相机和便携式电源系统。**这是一个纯展示网站，没有电商功能** - 产品仅用于展示，不直接通过网站销售。

## 开发命令

### 本地开发
```bash
# 启动开发服务器
npm run dev
# 或
python -m http.server 8000
```

### 生产构建与部署
```bash
# 完整生产构建（编译产品数据 + 生成页面 + 复制静态文件）
npm run build

# 仅构建产品数据（JSON5 → JSON 编译）
npm run build:products

# 生成静态 HTML 产品页面（24 页：12 产品 × 2 语言）
npm run generate:pages

# 部署前验证
./scripts/deploy-check.sh

# 部署到 Vercel（需要 RESEND_API_KEY 环境变量）
vercel --prod
```

### 验证与质量保证
```bash
# 检查产品数据完整性并验证 schema
npm run validate:products

# 验证国际化翻译和缺失的键
npm run validate-i18n

# 检查导航配置和动态菜单使用
node scripts/validate-navigation.js

# 使用 stylelint 检查 CSS 文件
npm run lint

# 运行所有预提交验证
bash scripts/pre-commit-hook.sh

# 生产就绪检查
npm run prod:check
```

## 架构概览

### CSS 系统（模块化架构）
网站使用分层的模块化 CSS 架构：

**common.css** - 基础层
- 定义所有 CSS 变量和设计令牌
- 导航、页脚、hero 区域的全局样式
- 通用组件和工具类
- Logo 切换系统样式

**页面特定 CSS**
- `css/index.css` - 首页样式
- `css/products.css` - 产品目录页样式
- `css/product-detail.css` - 产品详情页样式
- `css/about.css` - 关于页面样式
- `css/contact.css` - 联系表单和页面样式
- `css/customer-care.css` - 客户服务页面样式

### JavaScript 架构
**common.js** - 全局功能
- 导航状态管理和 Logo 切换
- 基于滚动的 header 透明度
- 移动菜单切换
- 加载动画

**页面特定 JS** - 位于 `js/pages/`
- `products.js` - 产品过滤和网格管理
- `customer-care.js` - FAQ 系统和客户支持功能
- `product-detail.js` - 产品详情页数据加载（当前未使用，产品详情页为静态生成的 HTML）

**注意**:
- `contact.html` 使用内联 JavaScript 处理表单提交（直接调用 `/api/contact`）
- `about.html` 使用 `common.js` 提供的全局功能，无需额外的页面特定脚本
- 产品详情页（`products/detail/*.html`）是通过 `npm run generate:pages` 静态生成的完整 HTML 页面，包含硬编码的产品数据

**无 jQuery 依赖** - 纯原生 JavaScript

### 产品数据系统（B+C 混合方法）
**开发环境（作者体验）：**
- 使用 JSON5 格式编写产品数据（`products/data/products/*.json5`）
- 支持注释、尾随逗号和无引号键
- 针对 JSON Schema 进行一致性验证

**生产环境（前端体验）：**
- JSON5 文件在构建期间编译为标准 JSON（`products/data/compiled/*.json`）
- 前端仅加载标准 JSON - 零解析风险
- 构建时自动验证和错误检测

### 双语架构
- **英语（主要）**：根目录（`/index.html`、`/about.html` 等）
- **法语**：`/fr/` 目录，镜像结构
- **翻译系统**：`/i18n/site.en.json` 和 `/i18n/site.fr.json` 中的 114 个翻译键
- **动态导航**：使用 `config/navigation.json` 和 `data-menu` 属性

### 联系表单与邮件系统
- **Vercel 无服务器函数**：`/api/contact.js` 处理表单提交
- **Resend API 集成**：专业的邮件发送服务
- **安全特性**：蜜罐反机器人保护、输入消毒
- **环境变量**：生产环境需要 `RESEND_API_KEY`

### 基于 GitHub 的下载系统
网站使用独立的 GitHub 仓库管理产品文档：

**仓库**：`https://github.com/scotpenn/securevision-downloads`
**URL 模式**：
```
https://raw.githubusercontent.com/scotpenn/securevision-downloads/main/products/[PRODUCT-ID]/[FILENAME]
```

**文件类型**：brochure、manual、spec、quickstart
**命名规范**：`[product-id]-[type]-[language].pdf`

## 重要约束

1. **无电商功能**：这是一个纯展示网站 - 无购物车、结账或支付功能
2. **Vercel 无服务器函数**：联系表单使用 `/api/contact.js` 通过 Resend API 处理邮件
3. **双语内容**：所有面向用户的内容必须支持 EN/FR
4. **使用绝对路径**：所有资源和导航链接应使用 `/css/`、`/js/`、`/images/` 等绝对路径
5. **Webflow 遗留**：部分 HTML 文件保留了 Webflow 生成的基础结构，但已移除所有 Webflow 脚本依赖和 data-wf 属性
6. **动态导航**：使用 `config/navigation.json` 和 `data-menu` 属性，避免硬编码导航项
7. **构建优先方法**：前端仅加载编译的 JSON，永不加载原始 JSON5
8. **Schema 验证**：所有产品数据必须在构建前通过 JSON Schema 验证
9. **静态生成产品页**：产品详情页通过构建脚本生成静态 HTML，不依赖客户端 JavaScript 动态加载

## 开发工作流

### 添加新产品
1. **创建产品数据文件**：`/products/data/products/[product-id].json5`
   - 使用 JSON5 格式，支持注释和尾随逗号
   - 包含所有必需字段的双语内容（EN/FR）
   - 遵循 `products.schema.json` 中定义的 schema
   - 使用现有的 `svc138.json5` 作为模板

2. **验证和构建**：
   ```bash
   npm run prod:check  # 验证 schema 并编译为 JSON
   ```

3. **生成产品详情页**：
   ```bash
   npm run generate:pages  # 自动创建 EN/FR HTML 页面
   ```

4. **添加产品图片**：`/images/`，命名模式：`[product-id]-[suffix].[ext]`
   - 在 JSON5 文件中更新图片路径
   - 支持：jpg、jpeg、png、webp 格式

5. **添加产品文档**：上传 PDF 到 downloads 仓库
   - 仓库：`https://github.com/scotpenn/securevision-downloads`
   - 命名：`[product-id]-[type]-[language].pdf`

### 创建新页面
1. 从现有页面复制结构
2. 先包含 `common.css`，然后包含页面特定的 CSS
3. 包含 `common.js` 以实现导航功能
4. 对所有资源使用绝对路径（`/css/`、`/js/`、`/images/`）
5. 在 `/css/` 目录中创建页面特定的 CSS 文件
6. 添加双语支持和 `data-i18n` 属性

### CSS 开发规则
1. **使用** common.css 仅用于全局组件
2. **创建** 页面特定的 CSS 文件用于独特样式
3. **永不** 为页面特定需求修改 common.css
4. **维护** 全局样式和页面样式的清晰分离
5. **遵循** CSS 命名约定和 BEM 方法论

### 测试清单
- [ ] 响应式设计：1440px、768px、375px
- [ ] Logo 在滚动时切换（白色 → 蓝色）
- [ ] 导航透明度正常工作
- [ ] 移动菜单功能正常
- [ ] 表单验证和提交成功
- [ ] 所有图片正确加载，带有回退
- [ ] 无控制台错误
- [ ] 所有验证脚本通过：`bash scripts/pre-commit-hook.sh`
- [ ] 双语内容正确显示
- [ ] 产品页面无错误加载编译的 JSON 数据

## 文件结构
```
/
├── index.html                    # 首页
├── about.html                    # 关于页面
├── contact.html                  # 联系页面
├── customer-care.html            # 客户支持
├── products/
│   ├── all.html                  # 产品目录
│   ├── detail/                   # 生成的产品详情页
│   └── data/
│       ├── products.schema.json  # 产品数据验证 schema
│       ├── products/             # 源 JSON5 文件
│       └── compiled/             # 生成的 JSON 文件（git 忽略）
├── fr/                           # 法语翻译（镜像结构）
├── api/
│   └── contact.js               # Vercel 无服务器函数，用于邮件
├── css/
│   ├── common.css               # 基础样式和 CSS 变量
│   └── [page].css               # 页面特定样式
├── js/
│   ├── common.js                # 全局 JavaScript
│   └── pages/                   # 页面特定 JavaScript
├── images/                       # 所有图片资源
├── config/
│   └── navigation.json          # 动态导航配置
├── data/
│   ├── products.json            # 遗留产品数据（正在淘汰）
│   ├── site-config.json         # 网站配置
│   └── faq.json                 # FAQ 数据库
├── i18n/
│   ├── site.en.json            # 英语翻译
│   └── site.fr.json            # 法语翻译
├── scripts/                      # 构建和验证脚本
├── development-docs/             # 所有开发文档
├── vercel.json                  # Vercel 部署配置
└── next.config.js               # Next.js 安全头配置
```

## 性能目标
- 页面加载：< 2 秒
- 首次内容绘制：< 1.8 秒
- CSS 总计：< 100KB
- JavaScript 总计：< 50KB
- 所有图片优化，支持 WebP

## 品牌指南

### 色板（common.css 中的 CSS 变量）
```css
--color-secure-blue: #4B70F5;  /* 主色 */
--color-deep-blue: #353777;    /* 次色 */
--color-orange: #FF7F3E;       /* 强调色 */
--color-white: #F9F9F9;        /* 背景 */
--color-off-white: #FFF7D8;    /* 备用背景 */
```

### 字体
- **主要**：Poppins（Google Fonts）
- **次要**：Switzer（自定义字体文件）
- **等宽**：Source Code Pro
- **展示**：Inter

## 验证架构

### 质量门禁
提交前，以下验证必须通过：
- 导航配置是具有正确结构的有效 JSON
- HTML 文件中没有硬编码的导航项（使用 `data-menu` 属性）
- 所有主页面都包含 `common.js` 引用
- CSS 遵循模块化架构（common.css + 页面特定 CSS）
- 导航链接中没有相对路径（使用带 `/` 的绝对路径）
- 所有产品数据通过 JSON Schema 验证
- 双语内容完整且一致

### 调试命令
```bash
# 检查缺失的翻译
npm run validate-i18n

# 验证导航结构
node scripts/validate-navigation.js

# 验证产品数据完整性
npm run validate:products

# 完整的预提交验证
bash scripts/pre-commit-hook.sh
```

## 环境变量
生产部署所需：
- `RESEND_API_KEY` - 用于通过 Resend API 处理联系表单邮件服务

## 最近的主要更新

### 网站统一化和优化（2025-10-01）

**导航和页面结构统一**:
- 统一所有营销页面的导航结构（绝对路径、active 状态、语言切换）
- Hero 部分样式与首页保持一致，图片路径统一为 `/images/...`
- 移除重复的页面内联脚本，统一依赖 `common.js`

**Footer 简化**:

- 简化为双块布局（品牌描述 + 紧凑导航列表）
- 仅保留核心链接：About、Products、Contact
- 响应式优化，移动端横向排列
- 所有英语和法语页面（包括产品详情页）统一使用新布局

**产品分类重组**:

- 新增 `lighting-tower` 分类（Lighting Tower / Tour d'Éclairage）
- 将 SVT100 从 `secure-power` 移至 `lighting-tower`
- 更新 Schema、导航配置、翻译文件
- 移除产品详情页的 "Download Brochure" 按钮

**代码质量改进**:

- 修复 `common.js` 中未声明的 `navbar` 变量
- 修复递归调用的开发日志函数（防止栈溢出）
- 修复验证脚本的 ES Module 冲突（.js → .cjs）
- 添加缺失的 `stylelint-config-standard` 依赖

**构建输出优化（2025-10-01）**:

- 在 `.gitignore` 中排除 `public/` 构建输出目录（自动生成，不提交）
- 在 `.gitignore` 中排除 `node_modules/.package-lock.json`（npm 内部缓存）
- 移除测试文件：`public/test-console.html`、`test-improvements.cjs`
- 归档未使用的模块：将 `js/pages/product-detail.js` 移至 `development-docs/unused-modules/`
- 产品详情页现在使用内联 JavaScript（标签切换、图库交互），无需外部模块
- 统一英语和法语模板，移除冗余脚本依赖（`json5-parser.js`、`product-detail.js`）

### 联系表单增强（2025-09-04）
- 集成 Resend API 进行专业邮件处理
- 添加蜜罐反机器人保护和输入消毒
- 实现现代卡片式布局的联系信息
- 添加带有适当错误消息的双语表单处理
- 完成法语联系页面的完整翻译（表单标签、复选框、消息）

### 产品系统完成（2025-09-03）
- 12 产品 × 2 语言 = 24 个静态 HTML 页面生成
- JSON5 开发 → JSON 编译 → HTML 生成管道
- 构建时强制执行 Schema 验证
- 实现基于 GitHub 的下载系统

### 完整双语架构（2025-09-04）
- 所有法语页面使用统一的 CSS 系统（common.css + 页面特定）
- 动态导航，带有语言切换
- 双语 i18n 系统中的 130 个翻译键
- 静态 HTML 生成以获得最佳性能
