import React, { useState, useEffect, useRef } from 'react';
import { fetchWelcomeMessage, sendMessageToHelper } from '../api/muyuHelperApi';

/**
 * 小木鱼助手组件
 * 一个可收缩的对话助手，以小圆球形式出现在页面右下方
 */
const MuyuHelper = () => {
  // 状态管理
  const [isOpen, setIsOpen] = useState(false); // 控制对话框是否展开
  const [messages, setMessages] = useState([]); // 对话历史
  const [inputValue, setInputValue] = useState(''); // 用户输入
  const [isLoading, setIsLoading] = useState(false); // 加载状态
  const [hasWelcomeMessage, setHasWelcomeMessage] = useState(false); // 是否已加载欢迎消息
  
  const messagesEndRef = useRef(null); // 用于自动滚动到最新消息
  const chatContainerRef = useRef(null); // 聊天容器引用

  // 获取欢迎消息
  useEffect(() => {
    if (isOpen && !hasWelcomeMessage && messages.length === 0) {
      getWelcomeMessage();
    }
  }, [isOpen, hasWelcomeMessage, messages.length]);

  // 自动滚动到最新消息
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 滚动到底部函数
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 获取欢迎消息
  const getWelcomeMessage = async () => {
    try {
      setIsLoading(true);
      const response = await fetchWelcomeMessage();
      
      if (response && response.message) {
        setMessages([{
          role: 'assistant',
          content: response.message
        }]);
        setHasWelcomeMessage(true);
      }
    } catch (error) {
      console.error('获取欢迎消息失败:', error);
      setMessages([{
        role: 'assistant',
        content: '欢迎使用小木鱼助手！我可以回答您关于木鱼书的问题。'
      }]);
      setHasWelcomeMessage(true);
    } finally {
      setIsLoading(false);
    }
  };

  // 发送消息
  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    // 添加用户消息到对话历史
    const userMessage = { role: 'user', content: inputValue.trim() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputValue('');
    setIsLoading(true);

    try {
      // 准备发送给API的消息历史（只包含最近的10条消息）
      const recentMessages = updatedMessages.slice(-10);
      
      // 创建一个临时的助手消息对象，用于实时更新
      const tempAssistantMessage = { role: 'assistant', content: '' };
      setMessages([...updatedMessages, tempAssistantMessage]);
      
      // 定义流式更新回调函数
      const handleStreamUpdate = (message, isDone) => {
        setMessages(prevMessages => {
          // 创建消息数组的副本
          const newMessages = [...prevMessages];
          // 更新最后一条消息（助手消息）
          newMessages[newMessages.length - 1] = {
            role: 'assistant',
            content: message.content
          };
          return newMessages;
        });
        
        // 如果消息接收完成，更新加载状态
        if (isDone) {
          setIsLoading(false);
        }
      };
      
      // 调用后端API，使用流式输出
      await sendMessageToHelper(recentMessages, handleStreamUpdate);
    } catch (error) {
      console.error('发送消息失败:', error);
      setMessages(prevMessages => [
        ...prevMessages.slice(0, -1), // 移除临时消息
        {
          role: 'assistant',
          content: '抱歉，我暂时无法回应您的问题。请稍后再试。'
        }
      ]);
      setIsLoading(false);
    }
  };

  // 处理输入变化
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // 处理按键事件（回车发送消息）
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // 清空对话历史
  const clearChat = () => {
    setMessages([]);
    setHasWelcomeMessage(false);
    // 重新获取欢迎消息
    getWelcomeMessage();
  };

  // 切换对话框显示状态
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  // 渲染消息
  const renderMessages = () => {
    return messages.map((message, index) => (
      <div 
        key={index} 
        className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}
      >
        <div 
          className={`inline-block max-w-[85%] px-4 py-2 rounded-lg ${message.role === 'user' 
            ? 'bg-cinnabar text-white rounded-br-none' 
            : 'bg-parchment text-ink rounded-bl-none border border-jade'}`}
        >
          {/* 将消息内容中的换行符转换为<br>标签 */}
          {message.content.split('\n').map((text, i) => (
            <React.Fragment key={i}>
              {text}
              {i < message.content.split('\n').length - 1 && <br />}
            </React.Fragment>
          ))}
        </div>
      </div>
    ));
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* 对话框 */}
      {isOpen && (
        <div 
          className="bg-parchment rounded-lg shadow-xl mb-4 w-80 sm:w-96 flex flex-col border-2 border-jade"
          style={{ height: '500px', maxHeight: '70vh' }}
        >
          {/* 对话框头部 */}
          <div className="bg-jade text-parchment p-3 rounded-t-lg flex justify-between items-center font-kai">
            <h3 className="font-medium text-lg">小木鱼助手</h3>
            <div className="flex space-x-2">
              <button 
                onClick={toggleChat}
                className="text-parchment hover:text-white transition-colors"
                title="关闭"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* 对话内容区域 */}
          <div 
            ref={chatContainerRef}
            className="flex-1 p-4 overflow-y-auto font-song text-ink"
             style={{ backgroundColor: '#F5E8C7', backgroundRepeat: 'repeat' }}
          >
            {renderMessages()}
            {isLoading && (
              <div className="text-center py-2">
                <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-cinnabar border-r-transparent"></div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* 输入区域 */}
          <div className="border-t border-jade p-3 bg-parchment rounded-b-lg">
            <div className="flex items-center">
              <textarea
                value={inputValue}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="请输入您的问题..."
                className="flex-1 border border-jade rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-jade resize-none bg-parchment text-ink font-song"
                rows="2"
                disabled={isLoading}
              />
              {/* 清空按钮（扫帚图标） */}
              <button
                onClick={clearChat}
                disabled={isLoading}
                className={`ml-2 p-2 rounded-full ${isLoading 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-jade text-white hover:bg-green-700'}`}
                title="清空对话"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19a2 2 0 002 2h14a2 2 0 002-2v-5a2 2 0 00-2-2H5a2 2 0 00-2 2v5zm0 0V7a2 2 0 012-2h14a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2V7zm8-5v10m-5-5h10" />
                </svg>
              </button>
              {/* 发送按钮 */}
              <button
                onClick={sendMessage}
                disabled={!inputValue.trim() || isLoading}
                className={`ml-2 p-2 rounded-full ${!inputValue.trim() || isLoading 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-cinnabar text-white hover:bg-red-700'}`}
                title="发送消息"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* 悬浮按钮 */}
      <button
        onClick={toggleChat}
        className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-jade' : 'bg-cinnabar hover:bg-red-700'}`}
        style={{ boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)' }}
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-parchment" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-parchment" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default MuyuHelper;