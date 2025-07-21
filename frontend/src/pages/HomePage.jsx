import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// 注册GSAP插件
gsap.registerPlugin(ScrollTrigger);

const HomePage = () => {
  // 创建引用以便于动画
  const heroRef = useRef(null);
  const sectionsRef = useRef([]);
  
  // 添加或清除引用
  const addToRefs = (el) => {
    if (el && !sectionsRef.current.includes(el)) {
      sectionsRef.current.push(el);
    }
  };

  // 设置动画
  useEffect(() => {
    // 英雄区动画
    gsap.fromTo(
      heroRef.current.querySelectorAll('.animate-item'),
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.2, duration: 1, ease: 'power3.out' }
    );

    // 各部分的滚动动画
    sectionsRef.current.forEach((section) => {
      gsap.fromTo(
        section.querySelectorAll('.animate-item'),
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.2,
          duration: 1,
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

  // 四大板块数据
  const sections = [
    {
      id: 'introduction',
      title: '介绍木鱼书',
      description: '从帝女花到粤剧，再到木鱼书，探索这一传统艺术形式的起源与发展。',
      image: '/src/assets/images/introduction.svg',
      link: '/introduction',
      color: 'bg-cinnabar'
    },
    {
      id: 'experience',
      title: '感受木鱼书',
      description: '通过视频、音频和文字，全方位感受木鱼书的艺术魅力。',
      image: '/src/assets/images/experience.svg',
      link: '/experience',
      color: 'bg-jade'
    },
    {
      id: 'creation',
      title: '创作木鱼书',
      description: '利用AI技术，选择关键词，创作属于你自己的木鱼书作品。',
      image: '/src/assets/images/creation.svg',
      link: '/creation',
      color: 'bg-gold'
    },
    {
      id: 'heritage',
      title: '传承木鱼书',
      description: '了解木鱼书的文化价值和传承现状，参与传统文化的保护。',
      image: '/src/assets/images/heritage.svg',
      link: '/heritage',
      color: 'bg-azure'
    }
  ];

  return (
    <div className="home-page">
      {/* 英雄区 */}
      <section 
        ref={heroRef}
        className="hero min-h-screen flex items-center justify-center bg-scroll-pattern bg-cover bg-center py-20 px-4"
        style={{ paddingTop: '6rem' }}
      >
        <div className="container mx-auto text-center">
          <h1 className="animate-item text-4xl md:text-6xl font-kai text-cinnabar mb-6">木鱼书</h1>
          <p className="animate-item text-xl md:text-2xl font-fangsong text-ink mb-8 max-w-3xl mx-auto">
            翻开木鱼书，听见岭南心跳。
          </p>
          <div className="animate-item flex flex-col sm:flex-row justify-center gap-4 mt-8">
            <Link to="/introduction" className="traditional-button">
              了解木鱼书
            </Link>
            <Link to="/creation" className="px-6 py-2 bg-transparent text-cinnabar font-kai rounded-sm hover:bg-cinnabar/10 transition-colors duration-300 border border-cinnabar">
              创作木鱼书
            </Link>
          </div>
        </div>
      </section>

      {/* 简介 */}
      <section 
        ref={addToRefs}
        className="py-16 px-4 bg-parchment"
      >
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="animate-item section-title mx-auto">传统与创新的交融</h2>
          <p className="animate-item muyu-text mb-8">
            木鱼书是中国传统说唱文学的一种，起源于明清时期的广东地区，是粤剧的重要前身之一。
            它以木鱼、拍板等打击乐器伴奏，用方言演唱，内容丰富多彩，包括历史故事、民间传说、
            神话传奇等，是中国非物质文化遗产的重要组成部分。
          </p>
          <p className="animate-item muyu-text">
            本网站通过现代技术与传统文化的结合，让您不仅能了解木鱼书的历史与特点，
            还能亲身体验创作木鱼书的乐趣，参与到这一传统文化的传承与创新中来。
          </p>
        </div>
      </section>

      {/* 四大板块预览 */}
      <section className="py-16 px-4 bg-paper-texture bg-cover">
        <div className="container mx-auto">
          <h2 className="text-center section-title mx-auto mb-12">探索木鱼书的世界</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sections.map((section, index) => (
              <div 
                key={section.id}
                ref={addToRefs}
                className="animate-item flex flex-col h-full overflow-hidden rounded-lg shadow-lg transition-transform duration-300 hover:scale-[1.02] bg-parchment border border-gold/30"
              >
                <div className={`${section.color} h-2`}></div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-2xl font-kai text-ink mb-4">{section.title}</h3>
                  <p className="text-ink/80 mb-6 flex-grow">{section.description}</p>
                  <Link 
                    to={section.link}
                    className="self-start mt-auto px-4 py-2 font-kai text-cinnabar border border-cinnabar rounded-sm hover:bg-cinnabar/10 transition-colors duration-300"
                  >
                    探索更多
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 号召行动 */}
      <section 
        ref={addToRefs}
        className="py-16 px-4 bg-ink text-parchment"
      >
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="animate-item text-3xl md:text-4xl font-kai text-gold mb-6">参与木鱼书的传承与创新</h2>
          <p className="animate-item text-xl text-parchment/80 mb-8">
            传统文化需要新的表达方式才能在当代焕发生机。
            通过AI技术的赋能，人人都可以成为木鱼书文化的传承者和创新者。
          </p>
          <Link 
            to="/creation"
            className="animate-item inline-block px-8 py-3 bg-gold text-ink font-kai text-lg rounded-sm hover:bg-amber-500 transition-colors duration-300 shadow-lg"
          >
            开始创作
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;