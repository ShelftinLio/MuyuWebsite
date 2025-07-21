import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import html2canvas from 'html2canvas';

// 注册GSAP插件
gsap.registerPlugin(ScrollTrigger);

// 导入API服务
import { generateMuyuText, generateMuyuImage } from '../api/cozeApi';

const CreationPage = () => {
  // 创建引用以便于动画
  const sectionsRef = useRef([]);
  
  // 状态管理
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [generatedText, setGeneratedText] = useState('');
  const [generatedImage, setGeneratedImage] = useState(null);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // 1: 选择关键词, 2: 生成文本, 3: 生成图像
  const [storyParts, setStoryParts] = useState([]); // 存储四段式故事结构
  const [currentStoryPartIndex, setCurrentStoryPartIndex] = useState(0); // 当前显示的故事部分索引
  const [generationProgress, setGenerationProgress] = useState(0); // 生成进度
  
  // 添加或清除引用
  const addToRefs = (el) => {
    if (el && !sectionsRef.current.includes(el)) {
      sectionsRef.current.push(el);
    }
  };

  // 设置动画
  useEffect(() => {
    // 各部分的滚动动画
    sectionsRef.current.forEach((section) => {
      gsap.fromTo(
        section.querySelectorAll('.animate-item'),
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.2,
          duration: 0.8,
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    // 清理函数
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // 《花笺记》关键意象数据
  const keywordGroups = [
    {
      category: '情感',
      keywords: [
        { id: 1, name: '月坠', meaning: '良辰将尽', scene: '离别/绝望', example: '月坠星沉五更寒（卷四）' },
        { id: 3, name: '雁断', meaning: '音信隔绝', scene: '相思无寄', example: '雁断衡阳路八千（卷二）' },
        { id: 10, name: '血啼', meaning: '泣血悲鸣', scene: '极致悲痛', example: '杜鹃血啼染花枝（卷四）' },
        { id: 12, name: '露盟', meaning: '短暂情缘', scene: '露水情缘', example: '荷心露盟岂长久（卷二）' },
        { id: 17, name: '骨立', meaning: '形销骨立', scene: '相思成疾', example: '为郎骨立似枯梅（卷四）' },
      ]
    },
    {
      category: '困境',
      keywords: [
        { id: 2, name: '莲枯', meaning: '贞洁受挫', scene: '女主遇险', example: '白莲枯死浊水中（卷三）' },
        { id: 6, name: '柳锁', meaning: '困局难解', scene: '阻碍重重', example: '烟柳锁断楚台路（卷一）' },
        { id: 7, name: '舟横', meaning: '前路中断', scene: '命运转折', example: '野渡舟横缆自沉（卷二）' },
        { id: 9, name: '蝶劫', meaning: '红颜薄命', scene: '女子受难', example: '彩蝶遭逢风雨劫（卷五）' },
        { id: 11, name: '云障', meaning: '天意弄人', scene: '劫难降临', example: '黑云障月天地昏（卷三）' },
      ]
    },
    {
      category: '命运',
      keywords: [
        { id: 5, name: '笺裂', meaning: '誓约破碎', scene: '情变时刻', example: '花笺撕作雪纷飞（卷五）' },
        { id: 15, name: '签凶', meaning: '命数已定', scene: '占卜预示', example: '观音殿前抽下签（卷四）' },
        { id: 16, name: '珠沉', meaning: '芳华陨落', scene: '香消玉殒', example: '玉珠沉海不复还（卷五）' },
        { id: 18, name: '石跪', meaning: '绝境求存', scene: '生死关头', example: '乱石跪穿呼苍穹（卷三）' },
        { id: 20, name: '花签', meaning: '天定良缘', scene: '宿命重逢', example: '瑶池花签早注定（卷三）' },
      ]
    },
    {
      category: '精神',
      keywords: [
        { id: 4, name: '灯残', meaning: '寒窗孤寂', scene: '书生苦读', example: '灯残漏尽不成眠（卷四）' },
        { id: 8, name: '香烬', meaning: '虔诚未应', scene: '求告无门', example: '佛前香烬灰犹冷（卷三）' },
        { id: 13, name: '烟渡', meaning: '超脱凡尘', scene: '菩萨救度', example: '慈航烟渡有缘人（卷五）' },
        { id: 14, name: '尘拂', meaning: '点化开悟', scene: '禅机点化', example: '拂尘扫尽痴愚网（卷五）' },
        { id: 19, name: '钟惊', meaning: '尘缘觉醒', scene: '因果了悟', example: '古寺钟惊梦里人（卷五）' },
      ]
    }
  ];

  // 处理关键词选择
  const handleKeywordSelect = (keyword) => {
    if (selectedKeywords.find(k => k.id === keyword.id)) {
      // 如果已经选中，则取消选中
      setSelectedKeywords(selectedKeywords.filter(k => k.id !== keyword.id));
    } else if (selectedKeywords.length < 3) {
      // 如果未选中且选中数量小于3，则添加
      setSelectedKeywords([...selectedKeywords, keyword]);
    }
  };

  // 生成木鱼书文本和图像
  const handleGenerateText = async () => {
    if (selectedKeywords.length === 0) {
      alert('请至少选择一个关键词');
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);
    
    // 设置进度更新的计时器
    const progressInterval = setInterval(() => {
      setGenerationProgress(prev => {
        // 最多到95%，留5%给最终处理
        if (prev < 95) {
          return prev + 5;
        }
        return prev;
      });
    }, 1500); // 每1.5秒更新一次进度
    
    try {
      // 调用API生成文本和图像
      const result = await generateMuyuText(selectedKeywords);
      
      // 设置进度为100%
      setGenerationProgress(100);
      
      // 设置生成的文本
      setGeneratedText(result.text);
      
      // 处理四段式故事结构
      if (result.storyParts && result.storyParts.length > 0) {
        setStoryParts(result.storyParts);
        setCurrentStoryPartIndex(0);
      } else {
        setStoryParts([]);
      }
      
      // 处理图像数组
      if (result.images && result.images.length > 0) {
        // 保存所有图像
        setGeneratedImages(result.images);
        
        // 设置第一张图像为当前显示的图像
        setGeneratedImage(result.images[0]);
        setCurrentImageIndex(0);
        
        // 直接进入第3步（完成作品）
        setCurrentStep(3);
      } else {
        // 如果没有图像，进入第2步（生成图像）
        setGeneratedImages([]);
        setGeneratedImage(null);
        setCurrentStep(2);
      }
      
      console.log('生成结果:', {
        text: result.text?.substring(0, 100) + '...',
        imagesCount: result.images?.length || 0,
        storyPartsCount: result.storyParts?.length || 0
      });
    } catch (error) {
      console.error('生成文本和图像失败:', error);
      alert('生成失败，请重试');
    } finally {
      clearInterval(progressInterval);
      setIsGenerating(false);
      setGenerationProgress(0);
    }
  };

  // 生成图像（如果API没有返回图像，则使用此方法）
  const handleGenerateImage = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);
    
    // 设置进度更新的计时器
    const progressInterval = setInterval(() => {
      setGenerationProgress(prev => {
        // 最多到95%，留5%给最终处理
        if (prev < 95) {
          return prev + 5;
        }
        return prev;
      });
    }, 1000); // 每1秒更新一次进度
    
    try {
      // 调用API生成木鱼书配图
      const imageUrl = await generateMuyuImage(generatedText, selectedKeywords);
      setGenerationProgress(100);
      setGeneratedImage(imageUrl);
      setCurrentStep(3);
    } catch (error) {
      console.error('生成配图失败:', error);
      alert('生成配图失败，请重试');
    } finally {
      clearInterval(progressInterval);
      setIsGenerating(false);
      setGenerationProgress(0);
    }
  };

  // 下载作品
  const handleDownload = () => {
    // 显示加载提示
    setIsGenerating(true);
    
    // 创建一个临时的下载内容容器
    const tempContainer = document.createElement('div');
    tempContainer.className = 'download-content';
    tempContainer.style.width = '1000px'; // 设置固定宽度以确保布局一致
    tempContainer.style.backgroundColor = '#f8f0e3'; // 羊皮纸背景色
    tempContainer.style.padding = '30px';
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px'; // 放在屏幕外
    document.body.appendChild(tempContainer);
    
    // 添加标题和关键词
    const titleDiv = document.createElement('div');
    titleDiv.style.textAlign = 'center';
    titleDiv.style.marginBottom = '20px';
    titleDiv.innerHTML = `
      <h2 style="font-size: 28px; color: #c53030; margin-bottom: 10px; font-family: 'Kaiti', serif;">你的木鱼书作品</h2>
      <p style="font-size: 14px; color: #4a5568;">基于关键词：${selectedKeywords.map(k => k.name).join('，')}</p>
    `;
    tempContainer.appendChild(titleDiv);
    
    // 创建内容区域 - 四段式布局
    const contentDiv = document.createElement('div');
    contentDiv.style.display = 'flex';
    contentDiv.style.flexDirection = 'column';
    contentDiv.style.gap = '20px';
    
    // 添加四段式内容和对应图片
    if (storyParts && storyParts.length > 0) {
      // 创建一个网格布局来展示所有四个部分
      const gridContainer = document.createElement('div');
      gridContainer.style.display = 'grid';
      gridContainer.style.gridTemplateColumns = 'repeat(2, 1fr)';
      gridContainer.style.gap = '20px';
      gridContainer.style.marginBottom = '30px';
      
      storyParts.forEach((part, index) => {
        // 创建每个部分的容器
        const partContainer = document.createElement('div');
        partContainer.style.border = '1px solid #d69e2e';
        partContainer.style.borderRadius = '8px';
        partContainer.style.padding = '15px';
        partContainer.style.backgroundColor = 'rgba(245, 232, 199, 0.7)';
        partContainer.style.display = 'flex';
        partContainer.style.flexDirection = 'column';
        
        // 添加标题
        const titleElement = document.createElement('h3');
        titleElement.style.fontSize = '20px';
        titleElement.style.color = '#c53030';
        titleElement.style.marginBottom = '10px';
        titleElement.style.fontFamily = "'Kaiti', serif";
        titleElement.textContent = part.title || `第${index + 1}部分`;
        partContainer.appendChild(titleElement);
        
        // 添加描述（如果有）
        if (part.description) {
          const descElement = document.createElement('p');
          descElement.style.fontSize = '14px';
          descElement.style.color = '#718096';
          descElement.style.marginBottom = '10px';
          descElement.style.fontStyle = 'italic';
          descElement.textContent = part.description;
          partContainer.appendChild(descElement);
        }
        
        // 添加图片（如果有）
        // 查找对应的图片 - 优先使用part.image，如果没有则从generatedImages数组中获取
        const imageUrl = part.image || (index < generatedImages.length ? generatedImages[index] : null);
        
        if (imageUrl) {
          const imgDiv = document.createElement('div');
          imgDiv.style.textAlign = 'center';
          imgDiv.style.margin = '10px 0';
          
          const img = document.createElement('img');
          img.src = imageUrl;
          img.style.maxWidth = '100%';
          img.style.height = '180px';
          img.style.objectFit = 'contain';
          img.style.borderRadius = '8px';
          img.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
          
          imgDiv.appendChild(img);
          partContainer.appendChild(imgDiv);
        }
        
        // 添加内容
        const contentElement = document.createElement('p');
        contentElement.style.fontSize = '16px';
        contentElement.style.lineHeight = '1.8';
        contentElement.style.fontFamily = "'FangSong', serif";
        contentElement.style.whiteSpace = 'pre-line';
        contentElement.textContent = part.content;
        partContainer.appendChild(contentElement);
        
        // 将部分容器添加到网格中
        gridContainer.appendChild(partContainer);
      });
      
      contentDiv.appendChild(gridContainer);
    } else if (generatedText) {
      // 如果没有四段式内容，但有生成的文本和图片
      if (generatedImage) {
        const imgDiv = document.createElement('div');
        imgDiv.style.textAlign = 'center';
        imgDiv.style.marginBottom = '20px';
        
        const img = document.createElement('img');
        img.src = generatedImage;
        img.style.maxWidth = '100%';
        img.style.maxHeight = '400px';
        img.style.objectFit = 'contain';
        img.style.borderRadius = '8px';
        img.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        
        imgDiv.appendChild(img);
        contentDiv.appendChild(imgDiv);
      }
      
      // 添加文本内容
      const textDiv = document.createElement('div');
      textDiv.style.padding = '15px';
      textDiv.style.backgroundColor = 'rgba(245, 232, 199, 0.7)';
      textDiv.style.border = '1px solid #d69e2e';
      textDiv.style.borderRadius = '8px';
      textDiv.style.fontSize = '16px';
      textDiv.style.lineHeight = '1.8';
      textDiv.style.fontFamily = "'FangSong', serif";
      textDiv.style.whiteSpace = 'pre-line';
      textDiv.textContent = generatedText;
      
      contentDiv.appendChild(textDiv);
    }
    
    tempContainer.appendChild(contentDiv);
    
    // 不添加水印，根据用户要求
    
    // 使用html2canvas将元素转换为canvas
    html2canvas(tempContainer, {
      scale: 2, // 提高清晰度
      useCORS: true, // 允许加载跨域图片
      backgroundColor: '#f8f0e3', // 设置背景色为羊皮纸色
      logging: false, // 关闭日志
    }).then(canvas => {
      // 将canvas转换为图片URL
      const imgData = canvas.toDataURL('image/png');
      
      // 创建下载链接
      const link = document.createElement('a');
      link.href = imgData;
      link.download = `木鱼书作品-${new Date().toISOString().slice(0, 10)}.png`;
      
      // 触发下载
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // 移除临时容器
      document.body.removeChild(tempContainer);
      
      // 隐藏加载提示
      setIsGenerating(false);
    }).catch(error => {
      console.error('下载作品失败:', error);
      alert('下载作品失败，请重试');
      setIsGenerating(false);
      
      // 移除临时容器
      if (document.body.contains(tempContainer)) {
        document.body.removeChild(tempContainer);
      }
    });
  };

  // 分享作品
  const handleShare = async () => {
    try {
      // 检查是否支持Web Share API
      if (navigator.share) {
        // 使用Web Share API分享
        await navigator.share({
          title: '我的木鱼书创作',
          text: `基于关键词：${selectedKeywords.map(k => k.name).join('，')}的木鱼书创作`,
          url: window.location.href
        });
        console.log('分享成功');
      } else {
        // 不支持Web Share API，使用复制链接的方式
        const shareText = `我在木鱼书创作平台创作了一部作品，基于关键词：${selectedKeywords.map(k => k.name).join('，')}\n访问 ${window.location.href} 创建你自己的木鱼书作品！`;
        
        // 复制到剪贴板
        await navigator.clipboard.writeText(shareText);
        alert('分享链接已复制到剪贴板');
      }
    } catch (error) {
      console.error('分享失败:', error);
      alert('分享失败，请重试');
    }
  };

  // 切换到下一张图片
  const handleNextImage = () => {
    if (generatedImages.length > 1) {
      const nextIndex = (currentImageIndex + 1) % generatedImages.length;
      setCurrentImageIndex(nextIndex);
      setGeneratedImage(generatedImages[nextIndex]);
      
      // 如果在四段式故事模式下，同步更新故事部分
      if (storyParts && storyParts.length === generatedImages.length) {
        setCurrentStoryPartIndex(nextIndex);
      }
    }
  };

  // 切换到上一张图片
  const handlePrevImage = () => {
    if (generatedImages.length > 1) {
      const prevIndex = (currentImageIndex - 1 + generatedImages.length) % generatedImages.length;
      setCurrentImageIndex(prevIndex);
      setGeneratedImage(generatedImages[prevIndex]);
      
      // 如果在四段式故事模式下，同步更新故事部分
      if (storyParts && storyParts.length === generatedImages.length) {
        setCurrentStoryPartIndex(prevIndex);
      }
    }
  };

  // 重新开始
  const handleReset = () => {
    setSelectedKeywords([]);
    setGeneratedText('');
    setGeneratedImage(null);
    setGeneratedImages([]);
    setCurrentImageIndex(0);
    setStoryParts([]);
    setCurrentStoryPartIndex(0);
    setCurrentStep(1);
  };
  
  // 切换到下一个故事部分
  const handleNextStoryPart = () => {
    if (storyParts.length > 1) {
      const nextIndex = (currentStoryPartIndex + 1) % storyParts.length;
      setCurrentStoryPartIndex(nextIndex);
      
      // 始终切换图片，确保故事部分和图片同步
      setCurrentImageIndex(nextIndex);
      setGeneratedImage(generatedImages[nextIndex]);
    }
  };
  
  // 切换到上一个故事部分
  const handlePrevStoryPart = () => {
    if (storyParts.length > 1) {
      const prevIndex = (currentStoryPartIndex - 1 + storyParts.length) % storyParts.length;
      setCurrentStoryPartIndex(prevIndex);
      
      // 始终切换图片，确保故事部分和图片同步
      setCurrentImageIndex(prevIndex);
      setGeneratedImage(generatedImages[prevIndex]);
    }
  };

  return (
    <div className="creation-page pt-20">
      {/* 页面标题 */}
      <section className="py-16 px-4 bg-scroll-pattern bg-cover bg-center">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-kai text-cinnabar mb-6">创作木鱼书</h1>
          <p className="text-xl font-fangsong text-ink max-w-3xl mx-auto">
            选择关键词，创作属于你的木鱼书作品
          </p>
        </div>
      </section>

      {/* 创作流程介绍 */}
      <section 
        ref={addToRefs}
        className="py-16 px-4 bg-parchment"
      >
        <div className="container mx-auto max-w-4xl">
          <h2 className="animate-item section-title text-center mx-auto mb-12">创作流程</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`animate-item bg-parchment border rounded-lg p-6 shadow-md ${currentStep === 1 ? 'border-cinnabar ring-2 ring-cinnabar/30' : 'border-amber-800/30'}`}>
              <div className="flex items-center mb-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-parchment font-bold ${currentStep === 1 ? 'bg-cinnabar' : 'bg-gold'}`}>1</div>
                <h3 className="text-xl font-kai ml-3 text-ink">选择关键词</h3>
              </div>
              <p className="text-ink">
                从《花笺记》关键意象中选择1-3个关键词，这些关键词将成为你创作的灵感来源。
              </p>
            </div>
            <div className={`animate-item bg-parchment border rounded-lg p-6 shadow-md ${currentStep === 2 ? 'border-cinnabar ring-2 ring-cinnabar/30' : 'border-amber-800/30'}`}>
              <div className="flex items-center mb-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-parchment font-bold ${currentStep === 2 ? 'bg-cinnabar' : 'bg-gold'}`}>2</div>
                <h3 className="text-xl font-kai ml-3 text-ink">生成文本</h3>
              </div>
              <p className="text-ink">
                AI将根据你选择的关键词，生成具有木鱼书风格的文学作品，展现传统文学的魅力。
              </p>
            </div>
            <div className={`animate-item bg-parchment border rounded-lg p-6 shadow-md ${currentStep === 3 ? 'border-cinnabar ring-2 ring-cinnabar/30' : 'border-amber-800/30'}`}>
              <div className="flex items-center mb-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-parchment font-bold ${currentStep === 3 ? 'bg-cinnabar' : 'bg-gold'}`}>3</div>
                <h3 className="text-xl font-kai ml-3 text-ink">完成作品</h3>
              </div>
              <p className="text-ink">
                文本生成后，可以选择生成配图，并将文字与图像结合，形成完整的木鱼书作品。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 关键词选择区 */}
      <section 
        ref={addToRefs}
        className={`py-16 px-4 bg-paper-texture bg-cover ${currentStep !== 1 ? 'hidden' : ''}`}
      >
        <div className="container mx-auto max-w-4xl">
          <h2 className="animate-item section-title text-center mx-auto mb-6">选择关键词</h2>
          <p className="animate-item text-center text-ink mb-8">
            从下列《花笺记》关键意象中选择1-3个关键词，作为你创作的灵感来源
          </p>
          
          <div className="animate-item mb-8">
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              {selectedKeywords.map(keyword => (
                <div 
                  key={keyword.id}
                  className="bg-cinnabar text-parchment px-4 py-2 rounded-full flex items-center"
                >
                  <span>{keyword.name}</span>
                  <button 
                    onClick={() => handleKeywordSelect(keyword)}
                    className="ml-2 text-parchment hover:text-white"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
            <p className="text-center text-ink/70 text-sm">
              已选择 {selectedKeywords.length}/3 个关键词
            </p>
          </div>
          
          {keywordGroups.map((group, index) => (
            <div key={index} className="animate-item mb-8">
              <h3 className="text-xl font-kai text-cinnabar mb-4 border-b border-gold/30 pb-2">{group.category}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {group.keywords.map(keyword => {
                  const isSelected = selectedKeywords.find(k => k.id === keyword.id);
                  return (
                    <div 
                      key={keyword.id}
                      onClick={() => handleKeywordSelect(keyword)}
                      className={`cursor-pointer p-4 rounded-lg transition-all duration-300 ${isSelected 
                        ? 'bg-cinnabar/10 border-2 border-cinnabar' 
                        : 'bg-parchment border border-amber-800/30 hover:border-cinnabar/50'}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-lg font-kai text-cinnabar">{keyword.name}</h4>
                        <span className="text-sm bg-gold/20 text-ink px-2 py-1 rounded">{keyword.scene}</span>
                      </div>
                      <p className="text-sm text-ink/80 mb-2">{keyword.meaning}</p>
                      <p className="text-xs text-ink/60 italic">{keyword.example}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          
          <div className="animate-item text-center mt-12">
            <button 
              onClick={handleGenerateText}
              disabled={selectedKeywords.length === 0 || isGenerating}
              className={`px-8 py-3 bg-cinnabar text-parchment font-kai text-lg rounded-sm transition-colors duration-300 shadow-lg ${selectedKeywords.length === 0 || isGenerating ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700'}`}
            >
              {isGenerating ? `生成中...${generationProgress}%` : '点击生成木鱼书'}
            </button>
            {isGenerating && (
              <div className="mt-4 text-ink/70">
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                  <div 
                    className="bg-cinnabar h-2.5 rounded-full transition-all duration-300" 
                    style={{ width: `${generationProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm">预计需要40秒左右，请耐心等待...</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 文本生成区 */}
      <section 
        ref={addToRefs}
        className={`py-16 px-4 bg-paper-texture bg-cover ${currentStep !== 2 ? 'hidden' : ''}`}
      >
        <div className="container mx-auto max-w-4xl">
          <h2 className="animate-item section-title text-center mx-auto mb-6">生成的木鱼书文本</h2>
          <p className="animate-item text-center text-ink mb-8">
            基于关键词：{selectedKeywords.map(k => k.name).join('，')}
          </p>
          
          <div className="animate-item ancient-paper mb-8">
            <div className="muyu-text whitespace-pre-line">
              {generatedText || '正在生成文本...'}
            </div>
          </div>
          
          <div className="animate-item flex flex-col items-center gap-4 mt-12">
            <div className="w-full max-w-md">
              <button 
                onClick={handleGenerateImage}
                disabled={isGenerating}
                className={`w-full px-6 py-3 bg-gold text-ink font-kai rounded-sm transition-colors duration-300 shadow-md ${isGenerating ? 'opacity-50 cursor-not-allowed' : 'hover:bg-amber-500'}`}
              >
                {isGenerating ? `生成中...${generationProgress}%` : '生成配图'}
              </button>
              
              {isGenerating && (
                <div className="mt-4 text-ink/70">
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                    <div 
                      className="bg-gold h-2.5 rounded-full transition-all duration-300" 
                      style={{ width: `${generationProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-center">预计需要20秒左右，请耐心等待...</p>
                </div>
              )}
            </div>
            
            <button 
              onClick={handleReset}
              className="px-6 py-3 bg-transparent text-cinnabar font-kai rounded-sm hover:bg-cinnabar/10 transition-colors duration-300 border border-cinnabar"
            >
              重新选择关键词
            </button>
          </div>
        </div>
      </section>

      {/* 作品完成区 */}
      <section 
        ref={addToRefs}
        className={`py-16 px-4 bg-paper-texture bg-cover ${currentStep !== 3 ? 'hidden' : ''}`}
      >
        <div className="container mx-auto max-w-4xl">
          <h2 className="animate-item section-title text-center mx-auto mb-6">你的木鱼书作品</h2>
          <p className="animate-item text-center text-ink mb-8">
            基于关键词：{selectedKeywords.map(k => k.name).join('，')}
          </p>
          
          {/* 四段式故事导航 */}
          {storyParts.length > 0 && (
            <div className="animate-item mb-8">
              <div className="flex justify-center space-x-2 mb-4">
                {storyParts.map((part, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentStoryPartIndex(index);
                      // 始终同步切换图片，不再检查图片数量是否与故事部分数量相同
                      setCurrentImageIndex(index);
                      setGeneratedImage(generatedImages[index]);
                    }}
                    className={`px-4 py-2 rounded-full transition-colors duration-300 ${currentStoryPartIndex === index 
                      ? 'bg-cinnabar text-parchment' 
                      : 'bg-parchment text-ink border border-cinnabar/30 hover:border-cinnabar'}`}
                  >
                    {part.title || `第${index + 1}部分`}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <div className="animate-item flex flex-col md:flex-row gap-8 mb-12 download-content">
            <div className="md:w-1/2">
              <div className="aspect-square bg-gray-200 rounded-lg shadow-lg overflow-hidden relative">
                {generatedImage ? (
                  <>
                    <img src={generatedImage} alt="生成的木鱼书配图" className="w-full h-full object-cover" />
                    
                    {/* 图片导航按钮 - 如果是四段式故事，使用故事部分导航；否则使用图片导航 */}
                    {(storyParts.length > 1) ? (
                      <div className="absolute inset-0 flex items-center justify-between px-4 download-hide">
                        <button 
                          onClick={handlePrevStoryPart}
                          className="bg-black/30 hover:bg-black/50 text-white rounded-full p-2 transition-colors duration-300"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <button 
                          onClick={handleNextStoryPart}
                          className="bg-black/30 hover:bg-black/50 text-white rounded-full p-2 transition-colors duration-300"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    ) : generatedImages.length > 1 ? (
                      <div className="absolute inset-0 flex items-center justify-between px-4 download-hide">
                        <button 
                          onClick={handlePrevImage}
                          className="bg-black/30 hover:bg-black/50 text-white rounded-full p-2 transition-colors duration-300"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <button 
                          onClick={handleNextImage}
                          className="bg-black/30 hover:bg-black/50 text-white rounded-full p-2 transition-colors duration-300"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    ) : null}
                    
                    {/* 图片/故事部分计数器 */}
                    {(storyParts.length > 1) ? (
                      <div className="absolute bottom-4 left-0 right-0 flex justify-center download-hide">
                        <div className="bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                          {storyParts[currentStoryPartIndex]?.title || `第${currentStoryPartIndex + 1}部分`} ({currentStoryPartIndex + 1} / {storyParts.length})
                        </div>
                      </div>
                    ) : generatedImages.length > 1 ? (
                      <div className="absolute bottom-4 left-0 right-0 flex justify-center download-hide">
                        <div className="bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                          {currentImageIndex + 1} / {generatedImages.length}
                        </div>
                      </div>
                    ) : null}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    图像生成中...
                  </div>
                )}
              </div>
            </div>
            <div className="md:w-1/2 ancient-paper">
              <div className="p-4">
                <div className="text-center mb-4 download-only">
                  <h2 className="text-2xl font-kai text-cinnabar">木鱼书作品</h2>
                  <p className="text-sm text-ink/70 mt-1">基于关键词：{selectedKeywords.map(k => k.name).join('，')}</p>
                </div>
                {storyParts.length > 0 ? (
                  <div className="muyu-text whitespace-pre-line">
                    <h3 className="text-xl font-kai text-cinnabar mb-4">
                      {storyParts[currentStoryPartIndex]?.title || `第${currentStoryPartIndex + 1}部分`}
                    </h3>
                    {storyParts[currentStoryPartIndex]?.description && (
                      <p className="text-sm text-ink/70 italic mb-4">
                        {storyParts[currentStoryPartIndex].description}
                      </p>
                    )}
                    {storyParts[currentStoryPartIndex]?.content || '内容加载中...'}
                  </div>
                ) : (
                  <div className="muyu-text whitespace-pre-line">
                    {generatedText}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="animate-item flex flex-col sm:flex-row justify-center gap-4 mt-12">
            <button 
              onClick={handleDownload}
              className="px-6 py-3 bg-cinnabar text-parchment font-kai rounded-sm hover:bg-red-700 transition-colors duration-300 shadow-md"
            >
              下载作品
            </button>
            <button 
              onClick={handleShare}
              className="px-6 py-3 bg-gold text-ink font-kai rounded-sm hover:bg-amber-500 transition-colors duration-300 shadow-md"
            >
              分享作品
            </button>
            <button 
              onClick={handleReset}
              className="px-6 py-3 bg-transparent text-ink font-kai rounded-sm hover:bg-gray-100 transition-colors duration-300 border border-gray-300"
            >
              重新创作
            </button>
          </div>
        </div>
      </section>

      {/* 创作说明 */}
      <section 
        ref={addToRefs}
        className="py-16 px-4 bg-ink text-parchment"
      >
        <div className="container mx-auto max-w-4xl">
          <h2 className="animate-item text-3xl font-kai text-gold mb-8 text-center">关于木鱼书创作</h2>
          
          <div className="animate-item grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-ink/80 border border-gold/30 rounded-lg p-6">
              <h3 className="text-xl font-kai text-gold mb-4">《花笺记》关键意象</h3>
              <p className="text-parchment/80 mb-4">
                本创作工具中的关键词来源于木鱼书代表作《花笺记》中的关键意象。
                这些意象承载着丰富的象征意义，是木鱼书艺术表现的重要元素。
              </p>
              <p className="text-parchment/80">
                通过选择这些关键意象，你可以体验木鱼书创作的乐趣，
                感受传统文学的魅力。
              </p>
            </div>
            <div className="bg-ink/80 border border-gold/30 rounded-lg p-6">
              <h3 className="text-xl font-kai text-gold mb-4">AI辅助创作</h3>
              <p className="text-parchment/80 mb-4">
                本工具使用AI技术辅助创作，通过提取典型木鱼书的特征，
                学习其语言风格、表现手法和艺术特点，生成具有木鱼书风格的文学作品。
              </p>
              <p className="text-parchment/80">
                AI不仅是创作的工具，更是传统文化传承的新途径，
                让更多人能够参与到木鱼书文化的传承与创新中来。
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CreationPage;