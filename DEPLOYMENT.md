# 木鱼书网站部署指南

本文档提供了将木鱼书网站部署到Vercel的详细步骤。

## 前期准备

1. 确保项目已经上传到GitHub仓库：`https://github.com/ShelftinLio/MuyuWebsite.git`
2. 注册Vercel账号：https://vercel.com

## 本地配置（已完成）

以下配置已在本地完成，并已提交到GitHub仓库：

1. 创建了`vercel.json`配置文件，用于指导Vercel如何部署前后端代码
2. 在前端`package.json`中添加了`vercel-build`脚本

## Vercel部署步骤

### 1. 导入项目

1. 登录Vercel控制台：https://vercel.com/dashboard
2. 点击"Add New..." > "Project"
3. 选择"Import Git Repository"
4. 授权并选择GitHub仓库：`ShelftinLio/MuyuWebsite`
5. 点击"Import"

### 2. 配置项目

在配置页面中：

1. **项目名称**：保持默认或自定义
2. **框架预设**：选择"Other"
3. **根目录**：保持默认（`/`）
4. **构建命令**：留空（由`vercel.json`控制）
5. **输出目录**：留空（由`vercel.json`控制）

### 3. 环境变量配置

点击"Environment Variables"部分，添加以下环境变量：

**后端环境变量**：
- `NODE_ENV`: `production`
- `COZE_API_KEY`: [您的Coze API密钥]
- `SMC_API_KEY`: [您的SMC API密钥]
- `COZE_WORKFLOW_ID`: [您的Coze工作流ID]
- `COZE_APP_ID`: [您的Coze应用ID]
- `DEEPSEEK_API_KEY`: [您的Deepseek API密钥]
- `DEEPSEEK_MODEL`: `deepseek-chat`

**前端环境变量**：
- `VITE_API_BASE_URL`: `/api` （注意：这里使用相对路径，因为前后端部署在同一域名下）

### 4. 部署项目

1. 完成所有配置后，点击"Deploy"按钮
2. Vercel将开始构建和部署过程
3. 部署完成后，Vercel会提供一个预览URL（例如：`https://muyu-website.vercel.app`）

## 部署后验证

1. 访问Vercel提供的URL，确认前端页面正常加载
2. 测试API功能，确认后端服务正常工作
3. 检查控制台是否有任何错误

## 常见问题排查

### 前端加载但API请求失败

可能原因：
- 环境变量配置不正确
- API路由配置有误

解决方案：
1. 检查Vercel控制台中的环境变量设置
2. 确认`vercel.json`中的路由配置正确
3. 查看Vercel的Function Logs以获取更多信息

### 部署失败

可能原因：
- 构建过程中出现错误
- 依赖项安装失败

解决方案：
1. 查看Vercel的构建日志
2. 确保所有依赖项在`package.json`中正确列出

## 自定义域名（可选）

如果您有自己的域名，可以在Vercel中配置：

1. 在项目设置中，转到"Domains"选项卡
2. 添加您的自定义域名
3. 按照Vercel提供的说明更新DNS记录

## 更新部署

当您对代码进行更改并推送到GitHub仓库时，Vercel将自动重新部署项目。

---

如有任何问题，请参考[Vercel文档](https://vercel.com/docs)或联系项目维护者。