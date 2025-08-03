/**
 * 检索系统 API 调用模块
 * 处理与扣子检索系统API的交互
 */

const axios = require('axios');
require('dotenv').config();

// 检索系统API配置
const SEARCH_API_KEY = process.env.SEARCH_API_KEY;
const SEARCH_BOT_ID = process.env.SEARCH_BOT_ID;
const SEARCH_API_URL = 'https://api.coze.cn/v3/chat';

/**
 * 调用检索系统API进行搜索
 * @param {string} query 搜索查询
 * @param {Object} res Express响应对象，用于流式输出
 * @returns {Promise} API响应
 */
async function searchWithCoze(query, res = null) {
  console.log('=== 开始检索请求 ===');
  console.log('查询内容:', query);
  console.log('API密钥存在:', !!SEARCH_API_KEY);
  console.log('Bot ID:', SEARCH_BOT_ID);
  
  try {
    if (!SEARCH_API_KEY || !SEARCH_BOT_ID) {
      console.error('API配置检查失败:', { SEARCH_API_KEY: !!SEARCH_API_KEY, SEARCH_BOT_ID: !!SEARCH_BOT_ID });
      throw new Error('检索系统API配置不完整');
    }

    // 构建请求参数
    const requestData = {
      bot_id: SEARCH_BOT_ID,
      user_id: `search_${Date.now()}`, // 生成唯一用户ID
      stream: true,
      additional_messages: [
        {
          content: query,
          content_type: "text",
          role: "user",
          type: "question"
        }
      ],
      parameters: {}
    };

    console.log('发送检索请求:', {
      bot_id: SEARCH_BOT_ID,
      query: query
    });

    // 如果提供了res对象，进行流式响应
    if (res) {
      // 设置响应头
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Headers', 'Cache-Control');
      
      // 发送初始连接确认
      res.write('event: connected\ndata: {"status":"connected"}\n\n');
      
      // 调用API并处理流式响应
      console.log('准备发送axios请求到:', SEARCH_API_URL);
      console.log('请求头:', {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SEARCH_API_KEY.substring(0, 10)}...`
      });
      
      const response = await axios.post(SEARCH_API_URL, requestData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SEARCH_API_KEY}`
        },
        responseType: 'stream',
        timeout: 30000 // 30秒超时
      });
      
      console.log('axios响应状态:', response.status);
      console.log('axios响应头:', response.headers);
      
      let isThinkingPhase = true;
      let fullContent = '';
      
      // 处理流式响应
      let currentEvent = '';
      let buffer = '';
      
      response.data.on('data', (chunk) => {
        const chunkStr = chunk.toString();
        console.log('收到流式数据块:', chunkStr);
        
        buffer += chunkStr;
        const lines = buffer.split('\n');
        
        // 保留最后一行（可能不完整）
        buffer = lines.pop() || '';
        
        for (const line of lines) {
          if (line.trim() === '') {
            // 空行表示一个事件结束，处理当前事件
            if (currentEvent) {
              console.log('处理完整事件:', currentEvent);
              processEvent(currentEvent);
              currentEvent = '';
            }
            continue;
          }
          
          console.log('处理行:', line);
          currentEvent += line + '\n';
        }
      });
      
      function processEvent(eventStr) {
        const lines = eventStr.trim().split('\n');
        let eventType = '';
        let eventData = '';
        
        for (const line of lines) {
          if (line.startsWith('event:')) {
            eventType = line.substring(6).trim();
          } else if (line.startsWith('data:')) {
            eventData = line.substring(5).trim();
          }
        }
        
        console.log('事件类型:', eventType, '数据:', eventData);
        
        if (eventData === '[DONE]' || eventData === '"[DONE]"') {
          console.log('流式响应标记结束');
          res.write(`event: message\ndata: ${JSON.stringify({
            type: 'complete',
            content: fullContent
          })}\n\n`);
          res.end();
          return;
        }
        
        if (eventData && eventData !== '[DONE]') {
          try {
            const data = JSON.parse(eventData);
            console.log('解析后的数据:', data);
            
            if (eventType === 'conversation.message.delta') {
              const content = data.content || '';
              console.log('收到内容:', content);
              if (content) {
                fullContent += content;
                
                // 基于##################分界线的思考判断逻辑
                // 检查当前内容或累积内容中是否包含分界线
                const hasSeparator = content.includes('##################') || fullContent.includes('##################');
                
                if (hasSeparator) {
                  // 遇到分界线，切换到结果阶段
                  isThinkingPhase = false;
                  // 如果当前内容包含分界线，只发送分界线后的部分作为结果
                  if (content.includes('##################')) {
                    const parts = content.split('##################');
                    if (parts.length > 1 && parts[1].trim()) {
                      console.log('发送结果内容（分界线后）:', parts[1]);
                      res.write(`event: message\ndata: ${JSON.stringify({
                        type: 'result',
                        content: parts[1]
                      })}\n\n`);
                    }
                  } else {
                    console.log('发送结果内容:', content);
                    res.write(`event: message\ndata: ${JSON.stringify({
                      type: 'result',
                      content: content
                    })}\n\n`);
                  }
                } else if (isThinkingPhase) {
                  // 还在思考阶段，发送思考内容
                  console.log('发送思考内容:', content);
                  res.write(`event: message\ndata: ${JSON.stringify({
                    type: 'thinking',
                    content: content
                  })}\n\n`);
                } else {
                  // 已经过了思考阶段，发送结果内容
                  console.log('发送结果内容:', content);
                  res.write(`event: message\ndata: ${JSON.stringify({
                    type: 'result',
                    content: content
                  })}\n\n`);
                }
              }
            } else if (eventType === 'conversation.message.completed') {
              console.log('消息完成');
              // 消息完成时不结束连接，等待对话完成
            } else if (eventType === 'conversation.chat.completed') {
              console.log('对话完成');
              res.write(`event: message\ndata: ${JSON.stringify({
                type: 'complete',
                content: fullContent
              })}\n\n`);
              res.end();
            } else if (eventType === 'done') {
              console.log('流式响应完成');
              res.write(`event: message\ndata: ${JSON.stringify({
                type: 'complete',
                content: fullContent
              })}\n\n`);
              res.end();
            } else if (eventType === 'conversation.chat.failed') {
              console.log('对话失败');
              res.write(`event: message\ndata: ${JSON.stringify({
                type: 'error',
                error: '搜索失败，请稍后重试'
              })}\n\n`);
              res.end();
            } else {
              console.log('未处理的事件类型:', eventType);
            }
          } catch (e) {
            console.error('解析事件数据失败:', e, '原始数据:', eventData);
          }
        }
      }
      
      response.data.on('error', (err) => {
        console.error('检索API流式响应出错:', err);
        res.write(`event: message\ndata: ${JSON.stringify({
          type: 'error',
          error: err.message || '搜索过程中出现错误'
        })}\n\n`);
        res.end();
      });
      
      response.data.on('end', () => {
        console.log('检索API流式响应结束');
        if (!res.headersSent) {
          res.end();
        }
      });
      
      // 返回null，因为响应已经通过SSE发送
      return null;
    } else {
      // 非流式响应，直接调用API并返回结果
      const response = await axios.post(SEARCH_API_URL, requestData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SEARCH_API_KEY}`
        }
      });
      
      return response.data;
    }
  } catch (error) {
    console.error('=== 检索系统API调用失败 ===');
    console.error('错误类型:', error.constructor.name);
    console.error('错误消息:', error.message);
    console.error('错误代码:', error.code);
    if (error.response) {
      console.error('响应状态:', error.response.status);
      console.error('响应数据:', error.response.data);
    }
    console.error('完整错误:', error);
    
    if (res && !res.headersSent) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      
      res.write(`event: message\ndata: ${JSON.stringify({
        type: 'error',
        error: error.message || '搜索服务暂时不可用'
      })}\n\n`);
      res.end();
    }
    
    throw error;
  }
}

/**
 * 获取木鱼书目录数据（模拟从CSV读取）
 * @returns {Array} 木鱼书目录数组
 */
function getMuyuCatalogData() {
  // 这里应该读取CSV文件，暂时返回模拟数据
  return [
    {
      id: '1',
      title: '花笺记',
      category: '爱情故事',
      description: '经典木鱼书爱情故事',
      image: 'https://example.com/image1.jpg'
    },
    {
      id: '2', 
      title: '二荷花史',
      category: '历史传说',
      description: '历史题材木鱼书',
      image: 'https://example.com/image2.jpg'
    }
  ];
}

module.exports = {
  searchWithCoze,
  getMuyuCatalogData
};