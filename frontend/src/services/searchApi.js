/**
 * 木鱼书检索系统API服务
 * 处理与后端检索API的交互
 */

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-production-domain.com/api'
  : 'http://localhost:5001/api';

/**
 * 搜索木鱼书资源
 * @param {string} query 搜索查询
 * @param {Object} callbacks 回调函数对象
 * @param {Function} callbacks.onThinking AI思考过程回调
 * @param {Function} callbacks.onResult 搜索结果回调
 * @param {Function} callbacks.onComplete 完成回调
 * @param {Function} callbacks.onError 错误回调
 * @returns {Function} 取消搜索的函数
 */
export const searchMuyuBooks = (query, callbacks = {}) => {
  const {
    onThinking = () => {},
    onResult = () => {},
    onComplete = () => {},
    onError = () => {}
  } = callbacks;

  let eventSource = null;
  let isCompleted = false;

  // 创建取消函数
  const cancel = () => {
    if (eventSource) {
      eventSource.close();
      eventSource = null;
    }
    isCompleted = true;
  };

  // 异步执行搜索
  const performSearch = async () => {
    try {
      console.log('开始搜索:', query);
      console.log('API URL:', `${API_BASE_URL}/search-muyu`);
      
      // 直接发送POST请求进行流式搜索
      const response = await fetch(`${API_BASE_URL}/search-muyu?stream=true`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query })
      });
      
      console.log('响应状态:', response.status);
      console.log('响应头:', response.headers);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // 检查响应类型
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('text/event-stream')) {
        // 直接处理流式响应
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');
          
          for (const line of lines) {
            if (line.startsWith('data: ') && line !== 'data: [DONE]') {
              try {
                const data = JSON.parse(line.substring(6));
                
                switch (data.type) {
                  case 'thinking':
                    onThinking(data.content);
                    break;
                  case 'result':
                    onResult(data.content);
                    break;
                  case 'complete':
                    onComplete(data.content);
                    cancel();
                    return;
                  case 'error':
                    onError(data.error || '搜索过程中出现错误');
                    cancel();
                    return;
                }
              } catch (e) {
                console.error('解析搜索响应失败:', e);
              }
            }
          }
        }
      } else {
        // 非流式响应，可能是错误
        const result = await response.json();
        if (result.error) {
          throw new Error(result.error);
        }
      }
      
    } catch (error) {
      console.error('搜索请求失败:', error);
      onError(error.message || '搜索失败');
    }
  };

  // 执行搜索
  performSearch();

  // 返回取消函数
  return cancel;
};

/**
 * 获取木鱼书目录
 * @returns {Promise<Array>} 木鱼书目录数组
 */
export const getMuyuCatalog = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/muyu-catalog`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.catalog || [];
  } catch (error) {
    console.error('获取木鱼书目录失败:', error);
    throw error;
  }
};

/**
 * 根据ID获取木鱼书详细信息
 * @param {string} id 木鱼书ID
 * @returns {Promise<Object>} 木鱼书详细信息
 */
export const getMuyuBookById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/muyu-book/${id}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('未找到指定的木鱼书');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('获取木鱼书信息失败:', error);
    throw error;
  }
};

export default {
  searchMuyuBooks,
  getMuyuCatalog,
  getMuyuBookById
};