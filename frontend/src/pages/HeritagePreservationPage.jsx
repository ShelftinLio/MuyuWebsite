import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const HeritagePreservationPage = () => {
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
      {/* 传承与保护介绍 */}
      <section 
        ref={addToRefs}
        className="py-20 px-4 bg-paper-texture bg-cover"
      >
        <div className="container mx-auto max-w-4xl">
          <h1 className="animate-item text-4xl md:text-5xl font-kai text-center mb-8">木鱼书的传承与保护</h1>
          <div className="animate-item max-w-3xl mx-auto text-center mb-12">
            <p className="text-lg mb-4">
              木鱼书作为岭南文化的瑰宝，承载着丰富的历史文化价值。
              然而，随着时代的变迁，这一传统艺术形式正面临着传承危机。
            </p>
            <p className="text-lg">
              在数字化时代，我们如何保护和传承这一珍贵的非物质文化遗产？
            </p>
          </div>
          
          <div className="animate-item flex flex-col md:flex-row gap-8 mt-12">
            <div className="md:w-1/2 bg-parchment/80 p-6 rounded-lg shadow-md border border-ink/10">
              <h3 className="text-2xl font-kai text-cinnabar mb-4">传统价值</h3>
              <p className="mb-3">
                木鱼书是岭南文化的重要组成部分，它不仅是一种文学形式，更是一种文化传承方式。
                通过木鱼书，人们可以了解岭南地区的历史、风俗、信仰和价值观。
              </p>
              <p>
                木鱼书的语言风格、表现手法和艺术特点，都体现了岭南文化的独特魅力，
                是中华文化多元一体格局中不可或缺的一部分。
              </p>
            </div>
            <div className="md:w-1/2 bg-parchment/80 p-6 rounded-lg shadow-md border border-ink/10">
              <h3 className="text-2xl font-kai text-cinnabar mb-4">现代挑战</h3>
              <p className="mb-3">
                随着现代社会的快速发展，木鱼书面临着传承人老龄化、年轻一代兴趣减少、
                传播渠道有限等多重挑战。
              </p>
              <p>
                如何在保持木鱼书传统特色的同时，赋予其新的时代内涵，
                使其在现代社会中焕发新的生机，是我们面临的重要课题。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 传承现状 */}
      <section 
        ref={addToRefs}
        className="py-16 px-4 bg-ink text-parchment"
      >
        <div className="container mx-auto max-w-4xl">
          <h2 className="animate-item text-3xl font-kai text-gold mb-8 text-center">木鱼书传承现状</h2>
          
          <div className="animate-item grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-ink/80 border border-gold/30 rounded-lg p-6">
              <h3 className="text-xl font-kai text-gold mb-4">传承人现状</h3>
              <ul className="list-disc list-inside text-parchment/80 space-y-2">
                <li>传承人数量逐年减少</li>
                <li>传承人年龄结构老化</li>
                <li>专业传承人培养不足</li>
                <li>传承体系不够完善</li>
              </ul>
            </div>
            <div className="bg-ink/80 border border-gold/30 rounded-lg p-6">
              <h3 className="text-xl font-kai text-gold mb-4">传播渠道</h3>
              <ul className="list-disc list-inside text-parchment/80 space-y-2">
                <li>传统表演场所减少</li>
                <li>媒体关注度不足</li>
                <li>教育体系中缺乏相关内容</li>
                <li>数字化传播尚未成熟</li>
              </ul>
            </div>
            <div className="bg-ink/80 border border-gold/30 rounded-lg p-6">
              <h3 className="text-xl font-kai text-gold mb-4">社会认知</h3>
              <ul className="list-disc list-inside text-parchment/80 space-y-2">
                <li>公众认知度较低</li>
                <li>年轻一代兴趣不足</li>
                <li>文化价值认同感降低</li>
                <li>保护意识有待提高</li>
              </ul>
            </div>
          </div>
          
          <div className="animate-item bg-ink/60 border border-gold/20 rounded-lg p-6 mt-8">
            <h3 className="text-xl font-kai text-gold mb-4 text-center">保护现状</h3>
            <p className="text-parchment/80 mb-4">
              目前，木鱼书已被列入广东省非物质文化遗产名录，但保护工作仍面临诸多挑战。
              政府和民间组织虽然开展了一系列保护措施，但由于资源有限、保护体系不完善等原因，
              保护效果尚未达到预期。
            </p>
            <p className="text-parchment/80">
              木鱼书的数字化保存工作也在进行中，但由于木鱼书的表演性、口传性特点，
              单纯的文字记录难以完整保存其艺术魅力，需要更加全面的保护策略。
            </p>
          </div>
        </div>
      </section>

      {/* 创新传承方式 */}
      <section 
        ref={addToRefs}
        className="py-16 px-4 bg-paper-texture bg-cover"
      >
        <div className="container mx-auto max-w-4xl">
          <h2 className="animate-item section-title text-center mx-auto mb-8">创新传承方式</h2>
          <p className="animate-item text-center text-ink/80 max-w-3xl mx-auto mb-12">
            在数字化时代，我们需要探索木鱼书传承的新途径，将传统文化与现代技术相结合，
            开创木鱼书传承的新局面。作为一个开源项目，我们诚挚邀请各位对传统文化有热情的开发者、设计师和文化研究者加入我们，
            共同维护和完善这个木鱼书传承网站。您的每一份贡献，都将成为木鱼书数字化传承的重要一步。
          </p>
          
          <div className="animate-item grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white/80 p-6 rounded-lg shadow-md border border-ink/10">
              <h3 className="text-2xl font-kai text-cinnabar mb-4">数字化保存</h3>
              <p className="mb-3">
                利用现代数字技术，对木鱼书的文本、音频、视频进行全方位记录和保存，
                建立木鱼书数字档案库，为后人留下宝贵的文化资源。
              </p>
              <ul className="list-disc list-inside text-ink/80 space-y-1 mt-3">
                <li>高清视频记录表演过程</li>
                <li>专业音频采集演唱内容</li>
                <li>文本数字化与标注</li>
                <li>建立多媒体数据库</li>
              </ul>
            </div>
            <div className="bg-white/80 p-6 rounded-lg shadow-md border border-ink/10">
              <h3 className="text-2xl font-kai text-cinnabar mb-4">教育推广</h3>
              <p className="mb-3">
                将木鱼书文化融入学校教育和社会教育体系，通过课程设置、文化讲座、
                社区活动等形式，提高公众对木鱼书的认知和兴趣。
              </p>
              <ul className="list-disc list-inside text-ink/80 space-y-1 mt-3">
                <li>开发木鱼书校本课程</li>
                <li>举办木鱼书文化讲座</li>
                <li>组织社区木鱼书表演</li>
                <li>建立木鱼书传承基地</li>
              </ul>
            </div>
          </div>
          
          <div className="animate-item grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/80 p-6 rounded-lg shadow-md border border-ink/10">
              <h3 className="text-2xl font-kai text-cinnabar mb-4">技术赋能</h3>
              <p className="mb-3">
                运用人工智能、虚拟现实等现代技术，为木鱼书传承提供新的可能性，
                创造沉浸式的木鱼书体验，吸引更多人了解和参与木鱼书文化。
              </p>
              <ul className="list-disc list-inside text-ink/80 space-y-1 mt-3">
                <li>AI辅助木鱼书创作</li>
                <li>VR/AR木鱼书表演体验</li>
                <li>交互式木鱼书学习平台</li>
                <li>木鱼书数字博物馆</li>
              </ul>
            </div>
            <div className="bg-white/80 p-6 rounded-lg shadow-md border border-ink/10">
              <h3 className="text-2xl font-kai text-cinnabar mb-4">创新表达</h3>
              <p className="mb-3">
                在保持木鱼书传统特色的基础上，探索木鱼书的现代表达形式，
                将木鱼书与现代艺术、流行文化相结合，赋予其新的时代内涵。
              </p>
              <ul className="list-disc list-inside text-ink/80 space-y-1 mt-3">
                <li>木鱼书与现代音乐融合</li>
                <li>木鱼书主题文创产品</li>
                <li>木鱼书改编现代戏剧</li>
                <li>木鱼书元素动漫创作</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 参与保护 */}
      <section 
        ref={addToRefs}
        className="py-16 px-4 bg-jade/10"
      >
        <div className="container mx-auto max-w-4xl">
          <h2 className="animate-item text-3xl font-kai text-center mb-8">参与木鱼书保护</h2>
          <p className="animate-item text-center text-ink/80 max-w-3xl mx-auto mb-12">
            木鱼书的保护需要社会各界的共同参与。无论你是木鱼书爱好者、研究者，
            还是对传统文化感兴趣的普通人，都可以为木鱼书的传承与保护贡献自己的力量。
          </p>
          
          <div className="animate-item grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-md border border-jade/20">
              <h3 className="text-xl font-kai text-jade mb-4">学习了解</h3>
              <p className="text-ink/80 mb-3">
                通过阅读木鱼书相关书籍、观看表演、参加讲座等方式，
                深入了解木鱼书的历史、艺术特点和文化价值。
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-jade/20">
              <h3 className="text-xl font-kai text-jade mb-4">传播分享</h3>
              <p className="text-ink/80 mb-3">
                在社交媒体上分享木鱼书相关内容，向身边的人介绍木鱼书文化，
                扩大木鱼书的影响力和知名度。
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-jade/20">
              <h3 className="text-xl font-kai text-jade mb-4">支持保护</h3>
              <p className="text-ink/80 mb-3">
                参与木鱼书保护项目，支持木鱼书传承人和相关机构的工作，
                为木鱼书的保护与传承提供资金和资源支持。
              </p>
            </div>
          </div>
          

        </div>
      </section>

      {/* 相关资源 */}
      <section 
        ref={addToRefs}
        className="py-16 px-4 bg-paper-texture bg-cover"
      >
        <div className="container mx-auto max-w-4xl">
          <h2 className="animate-item section-title text-center mx-auto mb-8">相关资源</h2>
          <p className="animate-item text-center text-ink/80 max-w-3xl mx-auto mb-12">
            以下是一些与木鱼书相关的资源，供你进一步了解和学习。
          </p>
          
          <div className="animate-item grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/80 p-6 rounded-lg shadow-md border border-ink/10">
              <h3 className="text-2xl font-kai text-cinnabar mb-4">推荐书籍</h3>
              <ul className="list-disc list-inside text-ink/80 space-y-3">
                <li>《木鱼书艺术研究》</li>
                <li>《岭南文化与木鱼书》</li>
                <li>《花笺记》木鱼书文本集</li>
                <li>《木鱼书传承与保护》</li>
                <li>《中国传统说唱艺术》</li>
              </ul>
            </div>
            <div className="bg-white/80 p-6 rounded-lg shadow-md border border-ink/10">
              <h3 className="text-2xl font-kai text-cinnabar mb-4">研究机构</h3>
              <ul className="list-disc list-inside text-ink/80 space-y-3">
                <li>广东省非物质文化遗产保护中心</li>
                <li>岭南文化研究所</li>
                <li>广州大学木鱼书研究中心</li>
                <li>中山大学中国非物质文化遗产研究中心</li>
                <li>香港中文大学粤剧研究中心</li>
              </ul>
            </div>
          </div>
          
          <div className="animate-item mt-12 text-center">
            <h3 className="text-2xl font-kai text-cinnabar mb-4">数字资源</h3>
            <p className="text-ink/80 mb-6">
              我们提供丰富的木鱼书数字资源，包括数字档案馆、在线学习平台和表演视频库等，请访问我们的数字资源专区了解更多。
            </p>
            <Link to="/digital-resources" className="inline-block px-6 py-3 bg-cinnabar text-white font-kai rounded-sm hover:bg-red-700 transition-colors duration-300 shadow-md">
              浏览数字资源
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeritagePreservationPage;