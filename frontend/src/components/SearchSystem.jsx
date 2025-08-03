import React, { useState, useEffect, useRef } from 'react';
import { searchMuyuBooks, getMuyuCatalog, getMuyuBookById } from '../services/searchApi';

const SearchSystem = () => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState('');
  const [thinkingChain, setThinkingChain] = useState('');
  const [showThinking, setShowThinking] = useState(false);
  const searchInputRef = useRef(null);
  const resultsRef = useRef(null);
  const thinkingRef = useRef(null);

  // 处理搜索
  const handleSearch = async () => {
    console.log('handleSearch被调用，查询内容:', query);
    if (!query.trim()) {
      console.log('查询内容为空，返回');
      return;
    }
    
    console.log('开始设置搜索状态');
    setIsSearching(true);
    setSearchResults('');
    setThinkingChain('');
    setShowThinking(true);
    console.log('搜索状态设置完成');
    
    try {
      // 调用搜索API，传入流式更新回调
      await searchMuyuBooks(query, {
        onThinking: (thinking) => {
          setThinkingChain(prev => {
            const newContent = prev + thinking;
            // 自动滚动思维链到底部
            setTimeout(() => {
              if (thinkingRef.current) {
                thinkingRef.current.scrollTop = thinkingRef.current.scrollHeight;
              }
            }, 100);
            return newContent;
          });
        },
        onResult: (result) => {
          setSearchResults(prev => prev + result);
        },
        onComplete: () => {
          setIsSearching(false);
          setShowThinking(false);
        },
        onError: (error) => {
          setIsSearching(false);
          setShowThinking(false);
          setSearchResults(`搜索出错：${error}`);
        }
      });
    } catch (error) {
      console.error('搜索失败:', error);
      setIsSearching(false);
      setShowThinking(false);
      setSearchResults('搜索失败，请稍后重试');
    }
  };

  // 处理回车键搜索
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // 渲染搜索结果，支持图片显示
  const renderSearchResults = (text) => {
    if (!text) return null;
    
    // 分割文本，查找图片链接
    const parts = text.split(/(https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp))/gi);
    
    return parts.map((part, index) => {
      // 检查是否是图片链接
      if (part.match(/https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp)/i)) {
        return (
          <div key={index} className="my-4">
            <img 
              src={part} 
              alt="木鱼书相关图片" 
              className="max-w-full h-auto rounded-lg shadow-md"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        );
      }
      // 普通文本
      return (
        <span key={index} className="whitespace-pre-wrap">
          {part}
        </span>
      );
    });
  };

  return (
    <div className="search-system relative">
      {/* AI搜索对话框 */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center mr-3">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-kai text-amber-800">木鱼书检索系统Agent</h3>
        </div>
        
        <div className="relative">
          <input
            ref={searchInputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="请输入您想要查找的木鱼书相关内容，例如：'封面有广告的木鱼书有哪些？''广州大典第二册中有多少本木鱼书？'..."
            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-lg shadow-sm"
            disabled={isSearching}
          />
          <button 
            onClick={handleSearch}
            disabled={isSearching || !query.trim()}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-amber-600 text-white p-2 rounded-md hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {isSearching ? (
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </div>
      </div>
      
      {/* 检索结果区域 */}
      <div className="border-t border-amber-100 pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-kai text-amber-800">检索结果</h3>
          </div>
          
          {/* 重新打开思维链按钮 */}
          {!showThinking && thinkingChain && (
            <button
              onClick={() => setShowThinking(true)}
              className="flex items-center px-3 py-1 text-sm bg-amber-100 text-amber-700 rounded-md hover:bg-amber-200 transition-colors"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              查看思维链
            </button>
          )}
        </div>
        
        {/* 数据源预览 - 仅在搜索时显示 */}
        {(isSearching || searchResults) && (
          <div className="mb-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4 border border-amber-200">
            <div className="flex items-center mb-3">
              <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center mr-2">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h4 className="text-sm font-medium text-amber-800">数据源：《广州大典·曲类》说唱目录资料表</h4>
            </div>
            <div className="text-xs text-amber-700 mb-2">正在分析木鱼书数据库...</div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-amber-100">
                    <th className="border border-amber-300 px-2 py-1 text-left text-amber-800">编号</th>
                    <th className="border border-amber-300 px-2 py-1 text-left text-amber-800">书名</th>
                    <th className="border border-amber-300 px-2 py-1 text-left text-amber-800">所在册</th>
                    <th className="border border-amber-300 px-2 py-1 text-left text-amber-800">起始页码</th>
                    <th className="border border-amber-300 px-2 py-1 text-left text-amber-800">所属类别</th>
                    <th className="border border-amber-300 px-2 py-1 text-left text-amber-800">版本</th>
                    <th className="border border-amber-300 px-2 py-1 text-left text-amber-800">出版商</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white">
                    <td className="border border-amber-200 px-2 py-1 text-amber-700">1</td>
                    <td className="border border-amber-200 px-2 py-1 text-amber-700">剃头佬叹五更一卷</td>
                    <td className="border border-amber-200 px-2 py-1 text-amber-700">第二册</td>
                    <td className="border border-amber-200 px-2 py-1 text-amber-700">1</td>
                    <td className="border border-amber-200 px-2 py-1 text-amber-700">叹五更</td>
                    <td className="border border-amber-200 px-2 py-1 text-amber-700">清末民国广州状元坊太平新街以文堂刻本</td>
                    <td className="border border-amber-200 px-2 py-1 text-amber-700">以文堂</td>
                  </tr>
                  <tr className="bg-amber-25">
                    <td className="border border-amber-200 px-2 py-1 text-amber-700">2</td>
                    <td className="border border-amber-200 px-2 py-1 text-amber-700">改良洋烟自叹一卷</td>
                    <td className="border border-amber-200 px-2 py-1 text-amber-700">第二册</td>
                    <td className="border border-amber-200 px-2 py-1 text-amber-700">4</td>
                    <td className="border border-amber-200 px-2 py-1 text-amber-700">无</td>
                    <td className="border border-amber-200 px-2 py-1 text-amber-700">清末民国广州状元坊太平新街以文堂刻本</td>
                    <td className="border border-amber-200 px-2 py-1 text-amber-700">以文堂</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="border border-amber-200 px-2 py-1 text-amber-700">3</td>
                    <td className="border border-amber-200 px-2 py-1 text-amber-700">新本洋烟自叹一卷</td>
                    <td className="border border-amber-200 px-2 py-1 text-amber-700">第二册</td>
                    <td className="border border-amber-200 px-2 py-1 text-amber-700">7</td>
                    <td className="border border-amber-200 px-2 py-1 text-amber-700">无</td>
                    <td className="border border-amber-200 px-2 py-1 text-amber-700">民国广州市第七甫醉经堂刻本</td>
                    <td className="border border-amber-200 px-2 py-1 text-amber-700">醉经堂</td>
                  </tr>
                  <tr className="bg-amber-25">
                    <td className="border border-amber-200 px-2 py-1 text-amber-700">4</td>
                    <td className="border border-amber-200 px-2 py-1 text-amber-700">客途秋恨一卷</td>
                    <td className="border border-amber-200 px-2 py-1 text-amber-700">第二册</td>
                    <td className="border border-amber-200 px-2 py-1 text-amber-700">10</td>
                    <td className="border border-amber-200 px-2 py-1 text-amber-700">无</td>
                    <td className="border border-amber-200 px-2 py-1 text-amber-700">清末民国第七甫五桂堂刻本</td>
                    <td className="border border-amber-200 px-2 py-1 text-amber-700">广州五桂堂</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="border border-amber-200 px-2 py-1 text-amber-700">5</td>
                    <td className="border border-amber-200 px-2 py-1 text-amber-700">客途秋恨一卷</td>
                    <td className="border border-amber-200 px-2 py-1 text-amber-700">第二册</td>
                    <td className="border border-amber-200 px-2 py-1 text-amber-700">13</td>
                    <td className="border border-amber-200 px-2 py-1 text-amber-700">无</td>
                    <td className="border border-amber-200 px-2 py-1 text-amber-700">清末民国禅山走马路芹香阁刻本</td>
                    <td className="border border-amber-200 px-2 py-1 text-amber-700">芹香阁</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="text-xs text-amber-600 mt-2 text-center">以上为数据表格前5条记录预览，AI将基于完整的数据库进行智能检索分析</div>
          </div>
        )}
        
        <div 
          ref={resultsRef}
          className="min-h-[200px] max-h-[500px] bg-amber-50 rounded-lg p-6 overflow-y-auto"
        >
          {isSearching && !searchResults ? (
            <div className="flex items-center justify-center text-gray-500">
              <svg className="w-6 h-6 animate-spin mr-2" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              智能分析中...
            </div>
          ) : searchResults ? (
            <div className="text-gray-800 leading-relaxed">
              <div className="flex justify-end mb-4 space-x-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(searchResults);
                    alert('检索结果已复制到剪贴板');
                  }}
                  className="px-3 py-1 bg-amber-500 text-white text-sm rounded-md hover:bg-amber-600 transition-colors flex items-center space-x-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span>复制</span>
                </button>
                <button
                  onClick={() => {
                    const blob = new Blob([searchResults], { type: 'text/plain;charset=utf-8' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `木鱼书检索结果_${new Date().toISOString().slice(0, 10)}.txt`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  }}
                  className="px-3 py-1 bg-orange-500 text-white text-sm rounded-md hover:bg-orange-600 transition-colors flex items-center space-x-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>下载</span>
                </button>
              </div>
              {renderSearchResults(searchResults)}
            </div>
          ) : (
            <div className="text-center text-gray-400 py-8 text-sm">
              请输入检索内容开始搜索...
            </div>
          )}
        </div>
      </div>

      {/* AI思维链悬浮窗 */}
      {showThinking && (
        <div className="fixed bottom-4 left-4 z-50 max-w-sm">
          <div 
            ref={thinkingRef}
            className="bg-amber-50 rounded-lg shadow-xl border border-amber-200 p-4 max-h-80 overflow-y-auto"
          >
            <div className="flex items-center mb-2">
              <div className="w-6 h-6 bg-amber-600 rounded-full flex items-center justify-center mr-2">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h4 className="text-sm font-medium text-amber-800">AI思考中...</h4>
              <button 
                onClick={() => setShowThinking(false)}
                className="ml-auto text-amber-400 hover:text-amber-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="text-xs text-amber-700 whitespace-pre-wrap leading-relaxed">
              {thinkingChain || '正在分析您的问题...'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchSystem;