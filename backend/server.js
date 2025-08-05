const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();
const auth = require('./auth'); // 引入认证模块
const deepseekApi = require('./deepseekApi'); // 引入Deepseek API模块
const searchApi = require('./searchApi'); // 引入检索系统API模块

const app = express();
const PORT = process.env.PORT || 5001;

// 中间件
app.use(cors());
app.use(express.json());

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '木鱼书网站API服务正常运行' });
});

// 检索系统API路由

// 存储检索会话消息的临时缓存
const searchSessionMessages = new Map();

// 存储小木鱼助手会话消息的临时缓存
const sessionMessages = new Map();

// 木鱼书检索流式输出 - GET请求处理EventSource连接
app.get('/api/search-muyu', async (req, res) => {
  try {
    const { stream, session } = req.query;
    
    // 只处理流式请求
    if (stream !== 'true') {
      return res.status(400).json({ error: '非流式请求应使用POST方法' });
    }
    
    // 如果没有提供会话ID或会话不存在
    if (!session || !searchSessionMessages.has(session)) {
      // 设置SSE响应头
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      
      // 发送错误事件
      res.write(`event: error\ndata: {"error":"无效的会话ID或会话已过期"}\n\n`);
      return res.end();
    }
    
    // 从会话缓存中获取查询
    const query = searchSessionMessages.get(session);
    
    // 调用检索系统API的流式输出模式
    return await searchApi.searchWithCoze(query, res);
  } catch (error) {
    console.error('处理检索EventSource连接失败:', error);
    
    // 如果响应头尚未发送，设置SSE响应头
    if (!res.headersSent) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
    }
    
    // 发送错误事件
    res.write(`event: error\ndata: {"error":${JSON.stringify(error.message)}}\n\n`);
    res.end();
  }
});

// 木鱼书检索 - POST请求接收查询
app.post('/api/search-muyu', async (req, res) => {
  try {
    const { query } = req.body;
    const { stream, session } = req.query; // 从查询参数中获取是否使用流式输出和会话ID
    
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: '查询参数无效' });
    }
    
    // 如果是流式请求且提供了会话ID，存储查询以便EventSource连接使用
    if (stream === 'true' && session) {
      searchSessionMessages.set(session, query);
      // 设置5分钟后自动清理会话数据
      setTimeout(() => {
        searchSessionMessages.delete(session);
      }, 5 * 60 * 1000);
      return res.status(200).json({ status: 'ok', message: '查询已接收，等待SSE连接' });
    }
    // 如果请求流式输出但没有会话ID（兼容旧版本）
    else if (stream === 'true') {
      // 调用检索系统API的流式输出模式
      return await searchApi.searchWithCoze(query, res);
    } else {
      // 非流式输出模式
      const response = await searchApi.searchWithCoze(query);
      res.json(response);
    }
  } catch (error) {
    console.error('木鱼书检索失败:', error);
    
    // 开发环境下返回模拟数据
    if (process.env.NODE_ENV === 'development') {
      console.log('开发环境，返回模拟检索数据');
      
      // 如果是流式请求
      if (req.query.stream === 'true') {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        
        // 模拟思考过程
        res.write(`event: message\ndata: ${JSON.stringify({
          type: 'thinking',
          content: '正在分析您的查询...'
        })}\n\n`);
        
        setTimeout(() => {
          res.write(`event: message\ndata: ${JSON.stringify({
            type: 'thinking',
            content: '正在搜索木鱼书数据库...'
          })}\n\n`);
        }, 1000);
        
        setTimeout(() => {
          res.write(`event: message\ndata: ${JSON.stringify({
            type: 'result',
            content: `根据您的查询"${req.body.query}"，找到以下木鱼书资源：\n\n1. 花笺记 - 经典爱情故事\n2. 二荷花史 - 历史传说\n\n这是开发环境的模拟数据。`
          })}\n\n`);
        }, 2000);
        
        setTimeout(() => {
          res.write(`event: message\ndata: ${JSON.stringify({
            type: 'complete'
          })}\n\n`);
          res.end();
        }, 3000);
      } else {
        res.json({
          results: [
            {
              title: '花笺记',
              description: '经典木鱼书爱情故事',
              category: '爱情故事'
            },
            {
              title: '二荷花史', 
              description: '历史题材木鱼书',
              category: '历史传说'
            }
          ]
        });
      }
    } else {
      res.status(500).json({ error: '检索服务暂时不可用', details: error.message });
    }
  }
});

// 获取木鱼书目录
app.get('/api/muyu-catalog', (req, res) => {
  try {
    const catalog = searchApi.getMuyuCatalogData();
    res.json({ catalog });
  } catch (error) {
    console.error('获取木鱼书目录失败:', error);
    res.status(500).json({ error: '获取目录失败', details: error.message });
  }
});

// 根据ID获取木鱼书信息
app.get('/api/muyu-book/:id', (req, res) => {
  try {
    const { id } = req.params;
    const catalog = searchApi.getMuyuCatalogData();
    const book = catalog.find(item => item.id === id);
    
    if (!book) {
      return res.status(404).json({ error: '未找到指定的木鱼书' });
    }
    
    res.json(book);
  } catch (error) {
    console.error('获取木鱼书信息失败:', error);
    res.status(500).json({ error: '获取木鱼书信息失败', details: error.message });
  }
});

// 小木鱼助手流式输出 - GET请求处理EventSource连接
app.get('/api/muyu-helper/chat', async (req, res) => {
  try {
    const { stream, session } = req.query;
    
    // 只处理流式请求
    if (stream !== 'true') {
      return res.status(400).json({ error: '非流式请求应使用POST方法' });
    }
    
    // 如果没有提供会话ID或会话不存在
    if (!session || !sessionMessages.has(session)) {
      // 设置SSE响应头
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      
      // 发送错误事件
      res.write(`event: error\ndata: {"error":"无效的会话ID或会话已过期"}\n\n`);
      return res.end();
    }
    
    // 从会话缓存中获取消息
    const messages = sessionMessages.get(session);
    
    // 调用Deepseek API的流式输出模式
    return await deepseekApi.chatWithDeepseek(messages, true, res);
  } catch (error) {
    console.error('处理EventSource连接失败:', error);
    
    // 如果响应头尚未发送，设置SSE响应头
    if (!res.headersSent) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
    }
    
    // 发送错误事件
    res.write(`event: error\ndata: {"error":${JSON.stringify(error.message)}}\n\n`);
    res.end();
  }
});

// 小木鱼助手API路由

// 获取小木鱼助手开场白
app.get('/api/muyu-helper/welcome', (req, res) => {
  try {
    const welcomeMessage = deepseekApi.getWelcomeMessage();
    res.json({ message: welcomeMessage });
  } catch (error) {
    console.error('获取开场白失败:', error);
    res.status(500).json({ error: '获取开场白失败', details: error.message });
  }
});

// 与小木鱼助手对话 - POST请求接收消息
app.post('/api/muyu-helper/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    const { stream, session } = req.query; // 从查询参数中获取是否使用流式输出和会话ID
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: '消息参数无效' });
    }
    
    // 如果是流式请求且提供了会话ID，存储消息以便EventSource连接使用
    if (stream === 'true' && session) {
      sessionMessages.set(session, messages);
      // 设置5分钟后自动清理会话数据
      setTimeout(() => {
        sessionMessages.delete(session);
      }, 5 * 60 * 1000);
      return res.status(200).json({ status: 'ok', message: '消息已接收，等待SSE连接' });
    }
    // 如果请求流式输出但没有会话ID（兼容旧版本）
    else if (stream === 'true') {
      // 调用Deepseek API的流式输出模式
      return await deepseekApi.chatWithDeepseek(messages, true, res);
    } else {
      // 非流式输出模式
      const response = await deepseekApi.chatWithDeepseek(messages);
      res.json(response);
    }
  } catch (error) {
    console.error('小木鱼助手对话失败:', error);
    
    // 开发环境下返回模拟数据
    if (process.env.NODE_ENV === 'development') {
      console.log('开发环境，返回模拟数据');
      
      // 如果是流式请求
      if (req.query.stream === 'true') {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        
        // 发送初始SSE事件
        res.write('event: start\ndata: {"role":"assistant","content":""}\n\n');
        
        // 模拟流式输出
        const mockContent = '这是一个模拟响应。在开发环境中，我会回答关于木鱼书的问题。木鱼书是广东地区的传统说唱艺术形式，具有悠久的历史和独特的艺术特色。';
        const chunks = mockContent.split(' ');
        
        let i = 0;
        const interval = setInterval(() => {
          if (i < chunks.length) {
            // 发送增量内容
            res.write(`event: update\ndata: {"content":${JSON.stringify(chunks[i] + ' ')}}\n\n`);
            i++;
          } else {
            // 发送完成事件
            res.write(`event: done\ndata: {"content":${JSON.stringify(mockContent)}}\n\n`);
            res.end();
            clearInterval(interval);
          }
        }, 200);
      } else {
        // 非流式响应
        res.json({
          id: 'mock-response-id',
          object: 'chat.completion',
          created: Math.floor(Date.now() / 1000),
          model: 'deepseek-chat',
          choices: [{
            index: 0,
            message: {
              role: 'assistant',
              content: '这是一个模拟响应。在开发环境中，我会回答关于木鱼书的问题。木鱼书是广东地区的传统说唱艺术形式，具有悠久的历史和独特的艺术特色。'
            },
            finish_reason: 'stop'
          }],
          usage: {
            prompt_tokens: 100,
            completion_tokens: 50,
            total_tokens: 150
          }
        });
      }
    } else {
      // 生产环境返回错误
      if (req.query.stream === 'true') {
        res.setHeader('Content-Type', 'text/event-stream');
        res.write(`event: error\ndata: {"error":${JSON.stringify(error.message)}}\n\n`);
        res.end();
      } else {
        res.status(500).json({ error: '小木鱼助手对话失败', details: error.message });
      }
    }
  }
});

// OAuth授权相关路由

// 获取授权URL
app.get('/api/oauth/auth-url', (req, res) => {
  try {
    const { authUrl, codeVerifier } = auth.generateAuthUrl();
    
    // 将code_verifier存储在会话中，以便在回调时使用
    // 注意：在生产环境中应使用会话存储或其他安全的方式
    // 这里为了简单，我们将其存储在内存中
    global.pendingAuth = { codeVerifier, createdAt: Date.now() };
    
    res.json({ authUrl });
  } catch (error) {
    console.error('生成授权URL失败:', error);
    res.status(500).json({ error: '生成授权URL失败', details: error.message });
  }
});

// OAuth回调处理
app.get('/api/oauth/callback', async (req, res) => {
  try {
    const { code } = req.query;
    
    if (!code) {
      return res.status(400).send('授权码缺失');
    }
    
    if (!global.pendingAuth || !global.pendingAuth.codeVerifier) {
      return res.status(400).send('授权会话已过期，请重新开始授权流程');
    }
    
    // 检查授权会话是否过期（10分钟）
    const sessionAge = Date.now() - global.pendingAuth.createdAt;
    if (sessionAge > 10 * 60 * 1000) {
      delete global.pendingAuth;
      return res.status(400).send('授权会话已过期，请重新开始授权流程');
    }
    
    const { codeVerifier } = global.pendingAuth;
    
    // 使用授权码和code_verifier获取token
    await auth.getTokenWithCode(code, codeVerifier);
    
    // 清除临时存储的授权信息
    delete global.pendingAuth;
    
    // 返回成功页面或重定向到前端
    res.send(`
      <html>
        <head>
          <title>授权成功</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; margin-top: 50px; }
            .success { color: green; }
            button { padding: 10px 20px; margin-top: 20px; cursor: pointer; }
          </style>
        </head>
        <body>
          <h1 class="success">授权成功！</h1>
          <p>您已成功授权木鱼书应用访问扣子API。</p>
          <p>现在可以关闭此窗口并返回应用。</p>
          <button onclick="window.close()">关闭窗口</button>
        </body>
      </html>
    `);
  } catch (error) {
    console.error('处理OAuth回调失败:', error);
    res.status(500).send(`授权失败: ${error.message}`);
  }
});

// 检查OAuth认证状态
app.get('/api/oauth/status', async (req, res) => {
  try {
    const tokenData = await auth.loadToken();
    const isAuthenticated = tokenData && !auth.isTokenExpired(tokenData);
    
    res.json({
      authenticated: isAuthenticated,
      expires_at: tokenData?.expires_at || null
    });
  } catch (error) {
    console.error('检查认证状态失败:', error);
    res.status(500).json({ error: '检查认证状态失败', details: error.message });
  }
});

// 代理扣子API请求
app.post('/api/generate-muyu-text', async (req, res) => {
  try {
    const { keywords } = req.body;
    
    if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
      return res.status(400).json({ error: '关键词参数无效' });
    }
    
    // 扣子API参数 - 修改为支持四段式故事结构
    const params = {
      workflow_id: process.env.COZE_WORKFLOW_ID,
      app_id: process.env.COZE_APP_ID,
      parameters: {
        keywords: keywords.map(k => k.name).join('，'),
        story_structure: "four_part" // 添加参数指示需要四段式结构
      },
      additional_messages: [
        {
          content: `请根据关键词「${keywords.map(k => k.name).join('，')}」创作一个完整的四段式木鱼书故事，分别包含：起式、承转、高潮、收结四个部分，每个部分配一张相应的图片，形成完整的故事。`,
          content_type: "text",
          role: "user",
          type: "question"
        }
      ]
    };
    
    // 获取授权头
    const authHeader = await auth.getAuthorizationHeader();
    
    // 调用扣子API
    const response = await axios.post('https://api.coze.cn/v1/workflows/chat', params, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      }
    });
    
    // 解析响应数据
    let responseData;
    
    // 处理SSE格式的响应
    if (response.data && typeof response.data === 'string') {
      // 尝试从SSE响应中提取JSON数据
      const lines = response.data.split('\n');
      for (const line of lines) {
        if (line.startsWith('data: {') && line.includes('"content":')) {
          try {
            const jsonStr = line.substring(6); // 去掉 'data: ' 前缀
            const eventData = JSON.parse(jsonStr);
            if (eventData.content && typeof eventData.content === 'string' && eventData.content.startsWith('{')) {
              // 解析内容字段中的JSON
              responseData = JSON.parse(eventData.content);
              break;
            }
          } catch (e) {
            console.error('解析SSE响应失败:', e);
          }
        }
      }
    } else {
      responseData = response.data;
    }
    
    console.log('扣子API响应:', JSON.stringify(responseData, null, 2));
    
    // 处理四段式故事结构
    let storyParts = [];
    let allText = '';
    let images = [];
    
    // 检查是否有content数组（四段式故事结构）
    if (responseData && responseData.content && Array.isArray(responseData.content)) {
      storyParts = responseData.content.map(part => ({
        title: part.name || '',
        content: part.content || '',
        description: part.description || ''
      }));
      
      // 合并所有部分的内容作为完整文本
      allText = storyParts.map(part => `【${part.title}】${part.content}`).join('\n\n');
    } else {
      allText = responseData?.text || responseData?.response || '木鱼书文本生成成功';
    }
    
    // 处理图片
    if (responseData && responseData.image && Array.isArray(responseData.image)) {
      images = responseData.image.filter(img => img.msg === 'success').map(img => img.data);
      
      console.log(`处理图片数组: 找到 ${images.length} 张图片，故事部分数量: ${storyParts.length}`);
      
      // 如果有故事部分和图片，将图片分配给各个部分
      if (storyParts.length > 0) {
        // 确保每个部分都有图片
        for (let i = 0; i < storyParts.length; i++) {
          // 如果图片数量不足，使用占位图或重复使用已有图片
          if (i < images.length) {
            storyParts[i].image = images[i];
          } else {
            // 使用默认占位图或循环使用已有图片
            const fallbackIndex = i % Math.max(1, images.length);
            storyParts[i].image = images[fallbackIndex] || `https://picsum.photos/seed/${i}/800/800`;
            console.log(`为故事部分 ${i+1} 创建了占位图片`);
          }
        }
      }
    } else {
      console.log('API响应中没有找到图片数组或图片数组为空');
      // 如果API没有返回图片，为每个故事部分创建占位图
      if (storyParts.length > 0) {
        for (let i = 0; i < storyParts.length; i++) {
          storyParts[i].image = `https://picsum.photos/seed/${i}/800/800`;
          images.push(storyParts[i].image);
        }
      }
    }
    
    // 返回处理后的数据
    res.json({
      text: allText,
      images: images,
      story_parts: storyParts
    });
  } catch (error) {
    console.error('生成木鱼书文本失败:', error);
    console.error('错误详情:', error.response?.data || error.message);
    
    // 如果是开发环境，返回模拟数据
    if (process.env.NODE_ENV === 'development') {
      const { keywords } = req.body;
      const mockText = `【模拟数据】基于关键词「${keywords.map(k => k.name).join('，')}」生成的木鱼书文本：

花开花落，岁月如梭。${keywords[0]?.name || '梅花'}傲立寒冬，${keywords[1]?.name || '竹子'}挺拔青翠。

世人皆知花之美，却不知花之魂。${keywords[0]?.name || '梅花'}不畏严寒，${keywords[1]?.name || '竹子'}不惧风雨，正如君子之志，坚韧不拔。

${keywords[2]?.name || '兰花'}幽香远溢，不与百花争艳；${keywords[3]?.name || '菊花'}傲霜怒放，不与群芳争妍。

花有花语，人有人心。愿君如${keywords[0]?.name || '梅花'}之清雅，如${keywords[1]?.name || '竹子'}之正直，如${keywords[2]?.name || '兰花'}之谦逊，如${keywords[3]?.name || '菊花'}之坚强。

花开花谢，人生亦如是。得意时不忘形，失意时不丧志。如花般绽放，如叶般归根。`;
      
      return res.json({ text: mockText });
    }
    
    res.status(500).json({ error: '生成木鱼书文本失败', details: error.message });
  }
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});