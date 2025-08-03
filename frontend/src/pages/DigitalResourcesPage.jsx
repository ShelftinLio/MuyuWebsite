import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SearchSystem from '../components/SearchSystem';

gsap.registerPlugin(ScrollTrigger);

const DigitalResourcesPage = () => {
  const sectionRefs = useRef([]);
  sectionRefs.current = [];

  const addToRefs = (el) => {
    if (el && !sectionRefs.current.includes(el)) {
      sectionRefs.current.push(el);
    }
  };

  useEffect(() => {
    // 为每个section添加动画
    sectionRefs.current.forEach((section, index) => {
      // 获取所有需要动画的元素
      const animateItems = section.querySelectorAll('.animate-item');
      
      // 创建时间线
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 70%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse',
        }
      });

      // 添加元素到时间线
      animateItems.forEach((item, i) => {
        tl.fromTo(item, 
          { y: 50, opacity: 0 }, 
          { 
            y: 0, 
            opacity: 1, 
            duration: 0.7, 
            ease: 'power2.out',
            delay: i * 0.1
          }, 
          i * 0.1
        );
      });
    });

    return () => {
      // 清理所有ScrollTrigger实例
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className="bg-parchment text-ink">
      {/* 数字资源介绍 */}
      <section 
        ref={addToRefs}
        className="py-20 px-4 bg-paper-texture bg-cover"
      >
        <div className="container mx-auto max-w-4xl">
          <h1 className="animate-item text-4xl md:text-5xl font-kai text-center mb-8">木鱼书数字资源</h1>
          <div className="animate-item max-w-3xl mx-auto text-center mb-12">
            <p className="text-lg mb-4">
              在数字化时代，我们致力于将木鱼书文化资源数字化，让这一传统艺术形式得以在现代社会中传承和发展。
            </p>
            <p className="text-lg">
              以下是我们收集和整理的木鱼书数字资源，供爱好者学习和研究。
            </p>
          </div>
        </div>
      </section>

      {/* 木鱼书资源检索系统 */}
      <section 
        ref={addToRefs}
        className="py-16 px-4 bg-gradient-to-br from-amber-50 to-orange-100"
      >
        <div className="container mx-auto max-w-6xl">
          <h2 className="animate-item text-3xl font-kai text-center mb-8 text-amber-800">木鱼书资源检索系统</h2>
          <p className="animate-item text-center text-ink/80 max-w-3xl mx-auto mb-12">
            基于《广州大典·曲类》中的木鱼书条目，提供智能化的AI检索服务，帮助您快速找到所需的木鱼书资源。
          </p>
          
          <div className="animate-item bg-white rounded-xl shadow-lg p-8 border border-amber-200">
            <SearchSystem />
          </div>
        </div>
      </section>

      {/* 数字档案 */}
      <section 
        ref={addToRefs}
        className="py-16 px-4 bg-jade/20"
      >
        <div className="container mx-auto max-w-4xl">
          <h2 className="animate-item text-3xl font-kai text-center mb-8">木鱼书数字档案馆</h2>
          <p className="animate-item text-center text-ink/80 max-w-3xl mx-auto mb-12">
            我们收集了大量木鱼书文本、音频和视频资料，建立了全面的木鱼书数字档案馆，为研究和学习提供便利。
          </p>
          
          <div className="animate-item grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-md border border-jade/20">
              <h3 className="text-xl font-kai text-jade mb-4">《广州大典·曲类》说唱目录资料表</h3>
              <p className="text-ink/80 mb-3">
                收录广州大典中的木鱼书曲类说唱目录，包括各类经典作品、稀有版本的详细资料表。
              </p>
              <a href="https://sour-pest-055.notion.site/19ae8324e9948056a573e2ff694a97e6?v=19ae8324e9948195baed000c3f78a4bf" target="_blank" rel="noopener noreferrer" className="text-jade hover:underline">浏览资料表 →</a>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-jade/20">
              <h3 className="text-xl font-kai text-jade mb-4">视频、音频、文字资料</h3>
              <p className="text-ink/80 mb-3">
                收录木鱼书视频、音频和文字资料，包括表演记录、演唱版本和文本资料，全面展示木鱼书的艺术魅力。
              </p>
              <a href="https://shiny-taker-133.notion.site/23689e9a9238807fb099c001eabcbff0?v=23689e9a92388019b1dc000cf822e041&source=copy_link" target="_blank" rel="noopener noreferrer" className="text-jade hover:underline">浏览资料库 →</a>
            </div>
          </div>
        </div>
      </section>



      {/* 数字博物馆 */}
      <section 
        ref={addToRefs}
        className="py-16 px-4 bg-ink text-parchment"
      >
        <div className="container mx-auto max-w-4xl">
          <h2 className="animate-item text-3xl font-kai text-gold mb-8 text-center">木鱼书数字博物馆</h2>
          <p className="animate-item text-center text-parchment/80 max-w-3xl mx-auto mb-12">
            我们建立了木鱼书数字博物馆，通过虚拟展览的形式，展示木鱼书的历史、艺术特点和文化价值。
          </p>
          
          <div className="animate-item grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-ink/80 border border-gold/30 rounded-lg p-6">
              <h3 className="text-xl font-kai text-gold mb-4">虚拟展厅</h3>
              <p className="text-parchment/80 mb-3">
                通过3D虚拟技术，创建沉浸式的木鱼书展览空间，让你足不出户就能参观木鱼书博物馆。
              </p>
              <ul className="list-disc list-inside text-parchment/80 space-y-1 mt-3">
                <li>木鱼书历史长廊</li>
                <li>木鱼书艺术特色展</li>
                <li>木鱼书名家展厅</li>
                <li>木鱼书互动体验区</li>
              </ul>
              <a href="#" className="block mt-4 text-gold hover:underline">敬请期待 →</a>
            </div>
            <div className="bg-ink/80 border border-gold/30 rounded-lg p-6">
              <h3 className="text-xl font-kai text-gold mb-4">数字藏品</h3>
              <p className="text-parchment/80 mb-3">
                收藏和展示珍贵的木鱼书文物和资料的数字化版本，包括古籍、手稿、乐器和表演道具等。
              </p>
              <ul className="list-disc list-inside text-parchment/80 space-y-1 mt-3">
                <li>古代木鱼书手稿</li>
                <li>传统木鱼书乐器</li>
                <li>木鱼书表演道具</li>
                <li>木鱼书相关文物</li>
              </ul>
              <a href="#" className="block mt-4 text-gold hover:underline">敬请期待 →</a>
            </div>
          </div>
          

        </div>
      </section>


    </div>
  );
};

export default DigitalResourcesPage;