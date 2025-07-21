import React, { useState, useEffect } from 'react';
import { getOAuthStatus, getOAuthAuthUrl } from '../api/cozeApi';

/**
 * 管理员页面，用于管理扣子API的OAuth认证
 */
const AdminPage = () => {
  const [authStatus, setAuthStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 获取认证状态
  const fetchAuthStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      const status = await getOAuthStatus();
      setAuthStatus(status);
    } catch (err) {
      console.error('获取认证状态失败:', err);
      setError('获取认证状态失败: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  // 开始OAuth授权流程
  const startOAuthFlow = async () => {
    setLoading(true);
    setError(null);
    try {
      const authUrl = await getOAuthAuthUrl();
      
      // 打开新窗口进行授权
      const authWindow = window.open(authUrl, '_blank', 'width=800,height=600');
      
      // 定期检查窗口是否关闭，关闭后刷新状态
      const checkWindowClosed = setInterval(() => {
        if (authWindow.closed) {
          clearInterval(checkWindowClosed);
          fetchAuthStatus();
        }
      }, 1000);
    } catch (err) {
      console.error('获取授权URL失败:', err);
      setError('获取授权URL失败: ' + (err.response?.data?.error || err.message));
      setLoading(false);
    }
  };

  // 组件加载时获取认证状态
  useEffect(() => {
    fetchAuthStatus();
  }, []);

  // 格式化过期时间
  const formatExpiryTime = (timestamp) => {
    if (!timestamp) return '未知';
    
    try {
      // 确保时间戳是毫秒级的
      const date = new Date(timestamp * 1000);
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }).replace(/\//g, '年').replace(/\//g, '月').replace(',', '日');
    } catch (err) {
      console.error('格式化日期失败:', err);
      return String(timestamp);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-parchment">
      <h1 className="text-3xl font-kai text-cinnabar mb-4">
        扣子API认证管理
      </h1>
      
      <div className="border-b border-gold my-4"></div>
      
      {loading ? (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cinnabar"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-4">
          {error}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md mb-6 overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-kai text-ink mb-4">
              认证状态
            </h2>
            
            <div className="my-4">
              <p className="text-lg">
                状态: {authStatus?.authenticated ? (
                  <span className="text-jade font-bold">已认证</span>
                ) : (
                  <span className="text-cinnabar font-bold">未认证</span>
                )}
              </p>
              
              {authStatus?.authenticated && authStatus?.expires_at && (
                <p className="text-lg mt-2">
                  过期时间: {formatExpiryTime(authStatus.expires_at)}
                </p>
              )}
            </div>
            
            <button 
              className={`px-6 py-2 rounded-md text-white font-bold mt-4 ${authStatus?.authenticated ? 'bg-jade hover:bg-jade/80' : 'bg-cinnabar hover:bg-cinnabar/80'}`}
              onClick={startOAuthFlow}
            >
              {authStatus?.authenticated ? "重新授权" : "开始授权"}
            </button>
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-kai text-ink mb-4">
            关于OAuth认证
          </h2>
          
          <p className="text-lg mb-4">
            扣子API使用OAuth 2.0 PKCE授权码模式进行认证，这是一种安全的授权方式，可以避免API密钥泄露的风险。
          </p>
          
          <p className="text-lg mb-4">
            授权后，系统会自动获取和刷新Access Token，确保API调用的稳定性。Access Token有效期通常为15分钟，系统会在过期前自动刷新。
          </p>
          
          <p className="text-lg">
            如果遇到认证问题，可以尝试重新授权，或联系技术支持。
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;