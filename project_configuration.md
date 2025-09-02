# SecureVision AI 项目开发配置文件
# 更新日期: 2025-09-02
# 当前项目状态: i18n国际化系统完成

# ===========================================
# 项目基本设置
# ===========================================
project:
  name: "SecureVision AI Website"
  type: "static_multilingual_website"
  version: "2.0.0"  # i18n系统完成版本
  languages_supported: ["en", "fr"]

language:
  communication: "zh-CN"  # 交互语言：中文
  code_comments: "en"     # 代码注释：英文（除非特殊说明）
  documentation: "zh-CN"  # 文档说明：中文
  website_content: ["en", "fr"]  # 网站内容：英法双语

role:
  primary: "mentor"       # 主要角色：导师
  style: "guided_learning" # 引导式学习
  confirmation_required: true # 每步操作前需要确认

# ===========================================
# 上下文管理系统
# ===========================================
context_management:
  enabled: true
  context_file: ".claude/project_context.md"
  auto_update_triggers:
    - "major_feature_completion"
    - "architecture_changes" 
    - "dependency_updates"
  
  context_structure:
    - "项目概述与目标"
    - "当前架构状态"
    - "已完成功能清单"
    - "待开发任务列表"
    - "技术栈与依赖"
    - "已知问题与技术债务"
    - "性能基准数据"

  update_command: "更新上下文"

# ===========================================
# Debug 状态保存系统
# ===========================================
debug_management:
  enabled: true
  backup_folder: "DEBUG/"
  
  backup_triggers:
    - "before_simplification"
    - "before_workaround"
    - "before_major_refactor"
  
  backup_structure:
    naming_pattern: "backup_YYYYMMDD_HHMM_[description]"
    include_files:
      - "source_code"
      - "config_files"
      - "package_files"
      - "environment_state"
    
  restore_instructions: true  # 每次备份包含恢复说明

# ===========================================
# 任务分类与工具管理
# ===========================================
task_classification:
  micro_tasks:
    description: "单个函数、小bug修复、简单配置"
    tool_limit: 3
    max_duration: "30分钟"
    
  small_tasks:
    description: "单个模块开发、中等复杂度功能"
    tool_limit: 8
    max_duration: "2小时"
    
  large_tasks:
    description: "多模块集成、架构调整、复杂功能"
    tool_limit: 20
    max_duration: "1天"
    
  complex_tasks:
    description: "系统重构、新技术集成、性能优化"
    tool_limit: "unlimited"
    requires_planning: true

# ===========================================
# 代码质量保障
# ===========================================
code_quality:
  review_required:
    - "public_api_changes"
    - "database_schema_changes"
    - "security_related_code"
    - "performance_critical_sections"
  
  testing_strategy:
    unit_tests: "core_business_logic"
    integration_tests: "api_endpoints"
    e2e_tests: "critical_user_flows"
  
  refactor_triggers:
    - "function_length > 50_lines"
    - "cyclomatic_complexity > 10"
    - "duplicate_code_detected"
    - "performance_degradation"

# 模板库管理 (更新)
# ===========================================
template_library:
  # 主要来源：知识库仓库
  primary_source: "knowledge_base"
  local_templates: "~/.claude-code/templates/"
  
  categories:
    - "react_components"
    - "api_patterns" 
    - "ai_workflows"          # 新增AI工作流
    - "prompt_templates"      # 新增提示模板
    - "database_queries"
    - "config_files"
    - "test_templates"
    - "deployment_scripts"
  
  github_integration:
    reference_projects:
      react: 
        - "facebook/react"
        - "vercel/next.js"
        - "remix-run/remix"
      node:
        - "expressjs/express"
        - "nestjs/nest"
        - "fastify/fastify"
      ai_tools:              # 新增AI工具参考
        - "openai/openai-node"
        - "anthropics/anthropic-sdk-typescript"
        - "google/generative-ai-js"
      utils:
        - "lodash/lodash"
        - "date-fns/date-fns"
        - "axios/axios"
    
    quality_criteria:
      min_stars: 1000
      recent_activity: "6_months"
      has_tests: true
      has_documentation: true
    
    update_schedule: "weekly"    # 更频繁的更新

# ===========================================
# 国际化 (i18n) 系统配置
# ===========================================
internationalization:
  enabled: true
  system_type: "lightweight_static"
  
  languages:
    primary: "en"
    secondary: ["fr"]
    detection_method: "url_path"  # /fr/ -> 'fr'
  
  file_structure:
    translation_dir: "i18n/"
    config_dir: "config/"
    validation_script: "scripts/validate-i18n.js"
  
  translation_files:
    dictionary_format: "site.{lang}.json"
    navigation_config: "navigation.json"
    keys_count: 114  # 每语言键值对数量
  
  html_integration:
    attribute_name: "data-i18n"
    seo_hreflang: true
    fallback_strategy: "en -> fallback -> key"
  
  validation:
    auto_validation: true
    validation_command: "npm run validate-i18n"
    check_completeness: true
    check_consistency: true
    check_navigation_sync: true
    check_hreflang_links: true

# ===========================================
# 开发流程规范
# ===========================================
development_workflow:
  planning_phase:
    - "需求分析与澄清"
    - "技术方案设计"
    - "任务分解与估时"
    - "风险识别与预案"
  
  implementation_phase:
    - "环境准备与依赖安装"
    - "核心逻辑实现"
    - "单元测试编写"
    - "集成测试验证"
  
  review_phase:
    - "代码质量检查"
    - "性能影响评估"
    - "文档更新"
    - "上下文文件更新"

# 性能监控配置
# ===========================================
performance_monitoring:
  enabled: true
  
  metrics_to_track:
    - "build_time"
    - "bundle_size"
    - "test_execution_time"
    - "api_response_time"
    - "memory_usage"
  
  benchmark_file: ".claude/performance_benchmarks.json"
  alert_threshold: "20%_degradation"

# ===========================================
# 错误处理标准
# ===========================================
error_handling:
  logging_level: "info"
  error_categories:
    - "user_input_errors"
    - "system_errors"
    - "integration_errors"
    - "performance_errors"
  
  response_patterns:
    user_facing: "友好错误提示"
    developer_facing: "详细错误信息"
    logging: "结构化错误日志"

# ===========================================
# 项目检查点
# ===========================================
checkpoints:
  frequency: "每完成主要功能"
  
  checklist:
    - "功能完整性验证"
    - "代码质量评估"
    - "性能基准测试"
    - "安全漏洞扫描"
    - "文档完整性检查"
    - "测试覆盖率报告"

# ===========================================
# VS Code 集成设置
# ===========================================
vscode_integration:
  workspace_settings:
    auto_save: true
    format_on_save: true
    
  recommended_extensions:
    - "ms-vscode.vscode-claude"
    - "esbenp.prettier-vscode"
    - "ms-vscode.vscode-eslint"
    - "bradlc.vscode-tailwindcss"
    - "ms-vscode.vscode-typescript-next"
  
  snippets_folder: ".vscode/snippets/"
  tasks_config: ".vscode/tasks.json"

# ===========================================
# 自定义命令 (2025-09-02更新)
# ===========================================
custom_commands:
  "开始新功能": "创建功能分支，更新上下文，准备开发环境"
  "完成功能": "运行测试，更新文档，合并代码，更新上下文"
  "开始调试": "创建备份，记录当前状态，准备调试环境"
  "代码审查": "运行质量检查，生成报告，提出改进建议"
  "性能分析": "运行基准测试，对比历史数据，生成优化建议"
  "更新模板": "同步GitHub参考，更新本地模板库"
  "智能推荐": "基于当前项目上下文推荐相关代码片段"
  "验证i18n": "运行npm run validate-i18n检查翻译完整性"      # 新增
  "更新上下文": "基于最新开发成果更新.claude/project_context.md"  # 新增

# ===========================================
# 用户反馈系统 (新增)
# ===========================================
feedback_system:
  enabled: true
  
  feedback_channels:
    - type: "inline"             # 工具内反馈
      quick_actions: ["useful", "not_useful", "needs_improvement"]
    
    - type: "gith