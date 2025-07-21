import axios from 'axios';

// 创建axios实例
const api = axios.create({
  // 使用后端API服务
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * 获取OAuth认证状态
 * @returns {Promise} - 返回认证状态信息
 */
export const getOAuthStatus = async () => {
  try {
    const response = await api.get('/oauth/status');
    return response.data;
  } catch (error) {
    console.error('获取OAuth认证状态失败:', error);
    throw error;
  }
};

/**
 * 获取OAuth授权URL
 * @returns {Promise} - 返回授权URL
 */
export const getOAuthAuthUrl = async () => {
  try {
    const response = await api.get('/oauth/auth-url');
    return response.data.authUrl;
  } catch (error) {
    console.error('获取OAuth授权URL失败:', error);
    throw error;
  }
};

/**
 * 生成木鱼书文本和图片
 * @param {Array} keywords - 用户选择的关键词数组
 * @returns {Promise} - 返回生成的木鱼书文本、图片和故事部分
 */
export const generateMuyuText = async (keywords) => {
  try {
    // 调用后端API生成木鱼书文本和图片
    const response = await api.post('/generate-muyu-text', { keywords });
    
    // 返回生成的文本、图片和故事部分
    if (response.data && response.data.text) {
      return {
        text: response.data.text,
        images: response.data.images || [],
        storyParts: response.data.story_parts || []
      };
    } else {
      throw new Error('API响应格式不正确');
    }
  } catch (error) {
    console.error('生成木鱼书文本和图片失败:', error);
    console.error('错误详情:', error.response?.data || error.message);
    
    // 如果API调用失败，返回模拟数据（仅用于开发测试）
    // 创建四段式故事结构的模拟数据
    const mockStoryParts = [
      {
        title: '起式',
        content: `【起式】${keywords[0]?.name || '梅花'}初现，寒冬将至。山中小寺，一位书生独坐窗前，${keywords[1]?.name || '灯残'}未灭，案上笔墨纷乱。他神情凝重，手中握着一封家书，眉头紧锁。窗外雪花纷飞，寒风呼啸，仿佛预示着不祥之兆。`,
        image: `https://picsum.photos/seed/${Math.floor(Math.random() * 1000)}/800/800`
      },
      {
        title: '承转',
        content: `【承转】书生踏上${keywords[1]?.name || '烟渡'}之路，穿越迷雾重重的山林。一路上，他遇见了许多奇异之事，心中疑惑渐生。途经一座破败的古庙，庙中${keywords[2]?.name || '香烬'}未冷，似有人刚刚离去。他在佛像前跪下，祈求指引，却见佛像眼中似有泪光闪动。`,
        image: `https://picsum.photos/seed/${Math.floor(Math.random() * 1000)}/800/800`
      },
      {
        title: '高潮',
        content: `【高潮】山路崎岖，书生不慎跌入深谷。生死关头，他紧抓藤蔓，悬于峭壁之上。此时，一位白衣女子出现在崖顶，伸手相救。女子手持${keywords[2]?.name || '花签'}，言说与他有前世之缘。书生恍然大悟，想起梦中多次见过此女，只是从未记起。两人相视而笑，仿佛隔世重逢。`,
        image: `https://picsum.photos/seed/${Math.floor(Math.random() * 1000)}/800/800`
      },
      {
        title: '收结',
        content: `【收结】书生与白衣女子结伴同行，来到一座古寺。寺中${keywords[0]?.name || '钟惊'}梦醒，两人在观音像前求得${keywords[2]?.name || '花签'}一支，签文曰："前世未了缘，今生当续之"。书生终明白，此行本是命中注定，为的就是与她重逢。两人在落花纷飞中相视而笑，携手走向寺外的山路，踏上新的征程。`,
        image: `https://picsum.photos/seed/${Math.floor(Math.random() * 1000)}/800/800`
      }
    ];
    
    // 合并所有部分的内容作为完整文本
    const mockText = mockStoryParts.map(part => part.content).join('\n\n');
    
    // 提取所有图片URL
    const mockImages = mockStoryParts.map(part => part.image);
    
    return {
      text: mockText,
      images: mockImages,
      storyParts: mockStoryParts
    };
  }
};

/**
 * 生成木鱼书配图
 * @param {string} text - 生成的木鱼书文本
 * @param {Array} keywords - 用户选择的关键词数组
 * @returns {Promise} - 返回生成的图片URL
 */
export const generateMuyuImage = async (text, keywords) => {
  try {
    // 这里应该调用图像生成API
    // 由于目前没有实际的图像生成API，返回模拟数据
    
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 返回模拟图片URL（实际项目中应替换为真实API调用）
    // 这里使用占位图片服务生成一个随机图片
    const randomId = Math.floor(Math.random() * 1000);
    return `https://picsum.photos/seed/${randomId}/800/800`;
  } catch (error) {
    console.error('生成木鱼书配图失败:', error);
    throw error;
  }
};