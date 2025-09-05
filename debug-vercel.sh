#!/bin/bash
# Vercel调试脚本
# 用于定位配置加载问题

echo "=== Vercel Debug Build ==="
echo "检查当前配置文件..."

# 检查配置文件存在情况
echo "当前目录配置文件："
ls -la | grep -E "(vercel|now)\.json" || echo "无配置文件"

echo ""
echo "搜索子目录配置文件："
find . -iname "vercel.json" -o -iname "now.json" || echo "无子目录配置"

echo ""
echo "运行Vercel调试构建..."
if command -v vercel &> /dev/null; then
    vercel build --debug 2>&1 | tee .vercel-debug.log
    echo ""
    echo "关键信息："
    grep -i "loaded local config\|detected project\|runtime\|function" .vercel-debug.log || echo "未找到相关配置信息"
else
    echo "Vercel CLI未安装，跳过本地调试"
fi