# 木鱼书宣传网站

## 项目概述
本项目是一个用于宣传和传承木鱼书传统文化的网站。网站通过现代网页技术和AI技术，让传统木鱼书文化以年轻人喜爱的方式传播，实现文化传承与创新的双重目标。

## 网站结构

网站分为五个主要部分：

1. **介绍木鱼书**：通过文字、图片和视频，线性引导式设计，介绍木鱼书的起源、发展和特点。
2. **木鱼书体验**：利用AI虚拟人技术，从视觉、听觉和文本三个维度解析木鱼书。
3. **木鱼书创作**：使用AIGC技术，让用户基于关键词生成木鱼书文本，并配以生成的图像。
4. **木鱼书传承**：探讨木鱼书文化的保护和传承问题。
5. **数字资源**：提供木鱼书数字档案馆、在线学习平台和表演视频库等数字化资源。

## 技术栈

- 前端：React.js, Tailwind CSS, GSAP
- 后端：Node.js, Express
- AI技术：Coze API (文本生成), 图像生成API

## 功能模块

- 响应式网页设计，适配各种设备
- 沉浸式滚动体验，增强用户交互
- AI虚拟人讲解木鱼书文化
- 基于关键词的木鱼书文本生成
- 木鱼书配图生成
- 作品分享和下载功能
- 小木鱼助手（AI聊天功能，支持实时流式输出）

## 项目结构

```
MuyuWebsite/
├── frontend/             # 前端代码
│   ├── public/           # 静态资源
│   ├── src/              # 源代码
│   │   ├── api/          # API服务
│   │   ├── assets/       # 资源文件
│   │   ├── components/   # 组件
│   │   ├── pages/        # 页面
│   │   └── ...           # 其他文件
│   ├── .env.example      # 环境变量示例
│   └── ...               # 其他配置文件
├── backend/              # 后端代码
│   ├── server.js         # 服务器入口
│   ├── .env.example      # 环境变量示例
│   └── ...               # 其他文件
├── scripts/              # 脚本文件
│   └── start-dev.sh      # 开发环境启动脚本
└── docs/                 # 文档
```

## 安装与运行

### 方法一：使用启动脚本（推荐）

```bash
# 克隆项目
git clone [项目地址]

# 进入项目目录
cd MuyuWebsite

# 赋予启动脚本执行权限
chmod +x scripts/start-dev.sh

# 运行启动脚本
./scripts/start-dev.sh
```

启动脚本会自动：
1. 检查并创建环境变量文件
2. 安装前端和后端依赖
3. 启动前端和后端服务

## 技术说明

### 小木鱼助手实现

小木鱼助手采用前后端分离架构，使用Server-Sent Events (SSE)实现实时流式输出：

1. **前端实现**：
   - 使用EventSource API建立与后端的SSE连接
   - 实现会话ID机制关联POST请求和EventSource连接
   - 添加连接超时检测和自动清理机制
   - 增强错误处理，提供更友好的用户提示

2. **后端实现**：
   - 使用Express实现SSE服务端
   - 采用会话消息缓存机制管理对话上下文
   - 支持流式输出和非流式输出两种模式
   - 实现会话自动清理，避免内存泄漏

### 方法二：手动启动

```bash
# 克隆项目
git clone [项目地址]

# 进入项目目录
cd MuyuWebsite

# 前端设置
cd frontend
cp .env.example .env  # 创建环境变量文件
npm install           # 安装依赖
npm run dev           # 启动前端服务

# 后端设置（新开一个终端）
cd backend
cp .env.example .env  # 创建环境变量文件
npm install           # 安装依赖
npm run dev           # 启动后端服务
```

## API集成

### 扣子API集成

本项目使用扣子API进行木鱼书文本生成。请按照以下步骤配置：

1. 在后端目录下，复制`.env.example`为`.env`
2. 编辑`.env`文件，设置以下参数：
   ```
   SMC_API_KEY=your_api_key_here
   COZE_WORKFLOW_ID=your_workflow_id_here
   COZE_APP_ID=your_app_id_here
   ```

### Deepseek API集成

小木鱼助手功能使用Deepseek API进行对话生成。请按照以下步骤配置：

1. 在后端目录下的`.env`文件中，设置以下参数：
   ```
   DEEPSEEK_API_KEY=your_deepseek_api_key_here
   DEEPSEEK_MODEL=deepseek-chat
   ```

### API安全性

为了保护API密钥，本项目采用以下安全措施：

1. 前端不直接调用扣子API，而是通过后端代理
2. API密钥存储在后端的环境变量中，不会暴露给前端
3. 所有包含敏感信息的文件都已添加到`.gitignore`中

## 贡献指南
欢迎贡献代码或提出建议，请遵循以下步骤：
1. Fork本仓库
2. 创建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个Pull Request

## 许可证
待定