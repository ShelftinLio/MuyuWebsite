/**
 * 小木鱼助手API服务
 * 处理与后端小木鱼助手相关的API调用
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
 * 获取小木鱼助手的欢迎消息
 * @returns {Promise} 包含欢迎消息的Promise
 */
export const fetchWelcomeMessage = async () => {
  try {
    const response = await api.get('/muyu-helper/welcome');
    return response.data;
  } catch (error) {
    console.error('获取欢迎消息失败:', error);
    throw error;
  }
};

/**
 * 发送消息到小木鱼助手并获取回复
 * @param {Array} messages 消息历史数组
 * @param {Function} onUpdate 流式更新回调函数
 * @returns {Promise} 包含助手回复的Promise或EventSource对象
 */
export const sendMessageToHelper = async (messages, onUpdate = null) => {
  try {
    // 如果提供了onUpdate回调，使用流式输出
    if (onUpdate && typeof onUpdate === 'function') {
      // 准备URL和参数
      const baseUrl = api.defaults.baseURL || 'http://localhost:5001/api';
      
      // 创建一个唯一的会话ID，用于关联POST请求和EventSource连接
      const sessionId = Date.now().toString(36) + Math.random().toString(36).substr(2);
      const url = `${baseUrl}/muyu-helper/chat?stream=true&session=${sessionId}`;
      
      // 创建EventSource连接（注意：EventSource只支持GET请求，不支持在构造函数中设置headers）
      const eventSource = new EventSource(url);
      
      // 设置超时检测
      const connectionTimeout = setTimeout(() => {
        console.error('EventSource连接超时');
        eventSource.close();
        assistantMessage.content = '连接超时，请稍后重试';
        onUpdate(assistantMessage, true);
      }, 10000); // 10秒超时
      
      // 发送消息数据到POST端点
      fetch(`${baseUrl}/muyu-helper/chat?stream=true&session=${sessionId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ messages })
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP错误: ${response.status}`);
        }
        // POST请求成功，EventSource会自动连接并开始接收数据
        // 清除超时检测
        clearTimeout(connectionTimeout);
        return response.json();
      })
      .catch(error => {
        console.error('发送流式请求失败:', error);
        eventSource.close();
        clearTimeout(connectionTimeout);
        assistantMessage.content = `发送请求失败: ${error.message}`;
        onUpdate(assistantMessage, true);
      });
      
      // 初始化助手消息
      let assistantMessage = {
        role: 'assistant',
        content: ''
      };
      
      // 监听连接打开事件
      eventSource.addEventListener('open', () => {
        console.log('EventSource连接已建立');
        // 清除超时计时器
        clearTimeout(connectionTimeout);
      });
      
      // 监听开始事件
      eventSource.addEventListener('start', (event) => {
        try {
          const data = JSON.parse(event.data);
          assistantMessage = {
            role: data.role || 'assistant',
            content: data.content || ''
          };
          // 调用更新回调
          onUpdate(assistantMessage, false);
        } catch (error) {
          console.error('解析开始事件失败:', error);
        }
      });
      
      // 监听更新事件
      eventSource.addEventListener('update', (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.content) {
            assistantMessage.content += data.content;
            // 调用更新回调
            onUpdate(assistantMessage, false);
          }
        } catch (error) {
          console.error('解析更新事件失败:', error);
        }
      });
      
      // 监听完成事件
      eventSource.addEventListener('done', (event) => {
        try {
          // 清除超时计时器
          clearTimeout(connectionTimeout);
          
          const data = JSON.parse(event.data);
          if (data.content) {
            assistantMessage.content = data.content; // 使用完整内容
          }
          // 调用更新回调，标记为完成
          onUpdate(assistantMessage, true);
          // 关闭连接
          eventSource.close();
        } catch (error) {
          console.error('解析完成事件失败:', error);
          assistantMessage.content = '处理响应时出错，请刷新页面重试';
          onUpdate(assistantMessage, true);
          eventSource.close();
        }
      });
      
      // 监听错误事件
      eventSource.addEventListener('error', (event) => {
        console.error('流式输出错误:', event);
        // 清除超时计时器
        clearTimeout(connectionTimeout);
        
        try {
          // 检查是否有event.data并且可以解析
          if (event.data && typeof event.data === 'string') {
            try {
              const data = JSON.parse(event.data);
              assistantMessage.content = `错误: ${data.error || '未知错误'}`;
            } catch (parseError) {
              console.error('解析错误数据失败:', parseError);
              assistantMessage.content = '连接错误，请稍后重试';
            }
          } else {
            // 检查后端连接状态
            fetch(`${baseUrl}/health`)
              .then(response => {
                if (!response.ok) {
                  assistantMessage.content = '后端服务暂时不可用，请稍后重试';
                } else {
                  assistantMessage.content = '连接错误，请稍后重试';
                }
                onUpdate(assistantMessage, true);
              })
              .catch(() => {
                assistantMessage.content = '无法连接到服务器，请检查网络连接';
                onUpdate(assistantMessage, true);
              });
            return; // 避免重复调用onUpdate
          }
          // 调用更新回调，标记为完成
          onUpdate(assistantMessage, true);
        } catch (error) {
          console.error('处理错误事件失败:', error);
          assistantMessage.content = '处理响应时出错，请刷新页面重试';
          onUpdate(assistantMessage, true);
        }
        // 关闭连接
        eventSource.close();
      });
      
      // 返回EventSource对象，以便调用者可以手动关闭连接
      return eventSource;
    } else {
      // 非流式输出，使用普通POST请求
      const response = await api.post('/muyu-helper/chat', { messages });
      return response.data;
    }
  } catch (error) {
    console.error('发送消息失败:', error);
    throw error;
  }
};