/**
 * 木鱼书检索系统API服务
 * 处理与后端检索系统相关的API调用
 */
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
 * 搜索木鱼书资源
 * @param {string} query 搜索查询
 * @param {Object} callbacks 回调函数对象
 * @param {Function} callbacks.onThinking AI思考过程回调
 * @param {Function} callbacks.onResult 搜索结果回调
 * @param {Function} callbacks.onComplete 完成回调
 * @param {Function} callbacks.onError 错误回调
 * @returns {Promise} EventSource对象或Promise
 */
export const searchMuyuBooks = async (query, callbacks = {}) => {
  try {
    const { onThinking, onResult, onComplete, onError } = callbacks;
    
    // 准备URL和参数
    const baseUrl = api.defaults.baseURL || 'http://localhost:5001/api';
    
    // 创建一个唯一的会话ID，用于关联POST请求和EventSource连接
    const sessionId = Date.now().toString(36) + Math.random().toString(36).substr(2);
    const url = `${baseUrl}/search-muyu?stream=true&session=${sessionId}`;
    
    // 创建EventSource连接
    const eventSource = new EventSource(url);
    
    // 设置超时检测
    const connectionTimeout = setTimeout(() => {
      console.error('搜索连接超时');
      eventSource.close();
      if (onError) onError('连接超时，请稍后重试');
    }, 30000); // 30秒超时
    
    // 发送搜索查询到POST端点
    fetch(`${baseUrl}/search-muyu?stream=true&session=${sessionId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query })
    }).catch(error => {
      console.error('发送搜索请求失败:', error);
      eventSource.close();
      if (onError) onError('发送请求失败');
    });
    
    // 处理EventSource事件
    eventSource.onopen = () => {
      console.log('搜索连接已建立');
      clearTimeout(connectionTimeout);
    };
    
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        // 根据事件类型处理不同的数据
        switch (data.type) {
          case 'thinking':
            if (onThinking && data.content) {
              onThinking(data.content);
            }
            break;
          case 'result':
            if (onResult && data.content) {
              onResult(data.content);
            }
            break;
          case 'complete':
            if (onComplete) onComplete();
            eventSource.close();
            break;
          case 'error':
            if (onError) onError(data.error || '搜索出错');
            eventSource.close();
            break;
        }
      } catch (parseError) {
        console.error('解析搜索响应数据失败:', parseError);
      }
    };
    
    eventSource.onerror = (error) => {
      console.error('搜索连接出错:', error);
      clearTimeout(connectionTimeout);
      
      try {
        if (event.data) {
          const data = JSON.parse(event.data);
          if (onError) onError(data.error || '未知错误');
        } else {
          // 检查后端连接状态
          fetch(`${baseUrl}/health`)
            .then(response => {
              if (!response.ok) {
                if (onError) onError('后端服务暂时不可用，请稍后重试');
              } else {
                if (onError) onError('连接错误，请稍后重试');
              }
            })
            .catch(() => {
              if (onError) onError('无法连接到服务器，请检查网络连接');
            });
        }
      } catch (error) {
        console.error('处理错误事件失败:', error);
        if (onError) onError('处理响应时出错，请刷新页面重试');
      }
      
      // 关闭连接
      eventSource.close();
    };
    
    // 返回EventSource对象，以便调用者可以手动关闭连接
    return eventSource;
  } catch (error) {
    console.error('搜索失败:', error);
    if (callbacks.onError) callbacks.onError('搜索失败，请稍后重试');
    throw error;
  }
};

/**
 * 获取木鱼书目录数据（非流式）
 * @returns {Promise} 包含目录数据的Promise
 */
export const getMuyuCatalog = async () => {
  try {
    const response = await api.get('/muyu-catalog');
    return response.data;
  } catch (error) {
    console.error('获取木鱼书目录失败:', error);
    throw error;
  }
};

/**
 * 根据ID获取特定木鱼书信息
 * @param {string} id 木鱼书ID
 * @returns {Promise} 包含木鱼书信息的Promise
 */
export const getMuyuBookById = async (id) => {
  try {
    const response = await api.get(`/muyu-book/${id}`);
    return response.data;
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