/**
 * Deepseek API 调用模块
 * 处理与Deepseek API的交互
 */

const axios = require('axios');
require('dotenv').config();

// Deepseek API配置
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_MODEL = process.env.DEEPSEEK_MODEL || 'deepseek-chat';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions';

// 系统提示词 - 木鱼书专家角色定义
const SYSTEM_PROMPT = `
## 角色
你是一位资深且权威的木鱼书研究专家，不仅对木鱼书从起源到发展的各个阶段、独特的表演形式与艺术特色、丰富的代表作品与流派划分、鲜明的音乐特征与唱腔特点，以及作为非物质文化遗产的传承保护现状等基础知识有着极其深入、全面且精准的了解，还擅长生动形象、通俗易懂地为用户解答关于木鱼书基础知识的各类疑问。

## 技能
### 技能 1: 解答木鱼书基础知识问题
1. 当用户提出关于木鱼书基础知识的问题时，直接依据自身深厚的知识储备，用简体中文进行详细、准确的回答。
2. 如果遇到不确定的信息，使用 工具搜索相关资料来辅助解答，确保回答的全面性与可靠性。
3. 若用户首次回复输入数字，根据以下对应内容回复：
    - 1：详细阐述木鱼书的起源背景、发展脉络以及各个历史时期的关键节点和演变情况，以简体中文表述。
    - 2：深入分析木鱼书的表演形式，包括表演场合、道具使用、表演流程等，以及独特的艺术特点，如语言风格、节奏韵律等，全程用简体中文讲解。
    - 3：列举木鱼书的经典代表作品，分析其故事内容、艺术价值，并介绍不同流派的风格特点、代表人物及传承情况，以简体中文表达。
    - 4：剖析木鱼书的音乐特征，如旋律特点、调式调性等，以及各种唱腔的特点、演唱技巧和风格差异，用简体中文进行剖析。
    - 5：全面介绍木鱼书作为非遗的传承现状，包括传承方式、面临的挑战、政府和社会采取的保护措施以及未来发展前景，以简体中文说明。
4. 当一个内容回复完成后，引导用户询问下一个问题。

### 技能 2：根据参考文档，检索木鱼书经典文本
1. 如果用户询问了关于木鱼书经典文本的内容，参考知识库检索的文档，对用户回答。

### 技能 3：处理无关问题
1. 当用户问与木鱼书、岭南文化、粤剧文化、花笺记、二荷花史或者传统文化等无关的问题时，回复"木鱼小助手暂不支持其他问题呢，如有木鱼书、岭南文化、粤剧文化或与传统文化相关的问题，小助手会认真为您解答"。

## 限制:
- 只回答与木鱼书基础知识相关的问题，明确拒绝回答无关话题。
- 回答内容需逻辑严谨、条理清晰、表述精准，用简体中文呈现。 
- 回答应尽量丰富具体，若涉及引用外部资料，需用Markdown的 ^^ 形式说明引用来源。 
- 长度不太过长，避免超过 300 字
`;

/**
 * 调用Deepseek API进行对话
 * @param {Array} messages 对话历史消息
 * @param {Boolean} stream 是否使用流式响应
 * @param {Object} res Express响应对象，用于流式输出
 * @returns {Promise} API响应
 */
async function chatWithDeepseek(messages, stream = false, res = null) {
  try {
    // 确保消息数组中包含系统提示词
    const hasSystemMessage = messages.some(msg => msg.role === 'system');
    
    if (!hasSystemMessage) {
      messages.unshift({
        role: 'system',
        content: SYSTEM_PROMPT
      });
    }
    
    // 构建请求参数
    const requestData = {
      model: DEEPSEEK_MODEL,
      messages: messages,
      stream: stream
    };
    
    // 如果是流式响应且提供了res对象
    if (stream && res) {
      // 设置响应头
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      
      // 发送初始SSE事件
      res.write('event: start\ndata: {"role":"assistant","content":""}\n\n');
      
      // 调用API并处理流式响应
      const response = await axios.post(DEEPSEEK_API_URL, requestData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
        },
        responseType: 'stream'
      });
      
      let fullContent = '';
      
      // 处理流式响应
      response.data.on('data', (chunk) => {
        const lines = chunk.toString().split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ') && line !== 'data: [DONE]') {
            try {
              const data = JSON.parse(line.substring(6));
              if (data.choices && data.choices[0] && data.choices[0].delta) {
                const delta = data.choices[0].delta;
                if (delta.content) {
                  fullContent += delta.content;
                  // 发送增量内容
                  res.write(`event: update\ndata: {"content":${JSON.stringify(delta.content)}}\n\n`);
                }
              }
            } catch (e) {
              console.error('解析流式响应数据失败:', e);
            }
          } else if (line === 'data: [DONE]') {
            // 发送完成事件
            res.write(`event: done\ndata: {"content":${JSON.stringify(fullContent)}}\n\n`);
            res.end();
          }
        }
      });
      
      response.data.on('error', (err) => {
        console.error('流式响应出错:', err);
        res.write(`event: error\ndata: {"error":${JSON.stringify(err.message)}}\n\n`);
        res.end();
      });
      
      // 返回null，因为响应已经通过SSE发送
      return null;
    } else {
      // 非流式响应，直接调用API并返回结果
      const response = await axios.post(DEEPSEEK_API_URL, requestData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
        }
      });
      
      return response.data;
    }
  } catch (error) {
    console.error('Deepseek API调用失败:', error);
    throw error;
  }
}

/**
 * 获取木鱼小助手的开场白
 * @returns {String} 开场白文本
 */
function getWelcomeMessage() {
  return `您好！我是一位专注于木鱼书研究的专家。木鱼书是中国传统说唱艺术的重要形式之一，主要流行于广东地区。作为非物质文化遗产，它具有独特的艺术价值和文化内涵。

关于木鱼书，我可以为您解答以下方面的基础知识:

1. 木鱼书的起源与发展历史
2. 木鱼书的表演形式与艺术特点
3. 木鱼书的代表作品与流派
4. 木鱼书的音乐特征与唱腔
5. 木鱼书作为非遗的传承保护现状

请问您对哪个方面特别感兴趣？或者您有什么具体的疑问需要解答？我会用通俗易懂的方式为您详细讲解。`;
}

module.exports = {
  chatWithDeepseek,
  getWelcomeMessage
};