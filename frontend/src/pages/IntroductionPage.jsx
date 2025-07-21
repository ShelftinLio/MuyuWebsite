import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// 导入图片
import diNvHuaImage from '../assets/images/muyu/《帝女花香天》.png';
import yueJuImage from '../assets/images/muyu/《粤剧》.png';

// 注册GSAP插件
gsap.registerPlugin(ScrollTrigger);

const IntroductionPage = () => {
  // 创建引用以便于动画
  const sectionsRef = useRef([]);
  
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

  return (
    <div className="introduction-page pt-20">
      {/* 页面标题 */}
      <section className="py-16 px-4 bg-scroll-pattern bg-cover bg-center">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-kai text-cinnabar mb-6">介绍木鱼书</h1>
          <p className="text-xl font-fangsong text-ink max-w-3xl mx-auto">
            从帝女花到粤剧，再到木鱼书，探索这一传统艺术形式的起源与发展
          </p>
        </div>
      </section>

      {/* 帝女花部分 */}
      <section 
        ref={addToRefs}
        className="py-16 px-4 bg-parchment"
      >
        <div className="container mx-auto max-w-4xl">
          <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
            <div className="md:w-1/2">
              <h2 className="animate-item section-title">帝女花</h2>
              <p className="animate-item muyu-text mb-4">
                《帝女花》是粤剧的代表作之一，讲述了明末崇祯皇帝的女儿长平公主与周世显的爱情故事。
                这部作品在网络时代重获新生，成为了许多人了解传统文化的入口。
              </p>
              <p className="animate-item muyu-text">
                从网络红歌到追溯其源头，我们发现《帝女花》是粤剧的瑰宝，而粤剧的前身之一，
                正是我们今天要介绍的木鱼书。
              </p>
            </div>
            <div className="md:w-1/2 animate-item">
              <div className="aspect-video rounded-lg shadow-lg overflow-hidden">
                <img 
                  src={diNvHuaImage} 
                  alt="帝女花" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 粤剧部分 */}
      <section 
        ref={addToRefs}
        className="py-16 px-4 bg-paper-texture bg-cover"
      >
        <div className="container mx-auto max-w-4xl">
          <div className="flex flex-col md:flex-row-reverse items-center gap-8 mb-12">
            <div className="md:w-1/2">
              <h2 className="animate-item section-title">粤剧</h2>
              <p className="animate-item muyu-text mb-4">
                粤剧是流行于广东、广西、香港、澳门及海外华人聚居地的汉族地方戏曲剧种，
                被列入国家级非物质文化遗产名录。
              </p>
              <p className="animate-item muyu-text mb-4">
                南音是粤剧的前身之一，其代表曲目《客途秋恨》展现了独特的岭南文化特色。
              </p>
              <p className="animate-item muyu-text">
                而南音，正是木鱼书的一种表现形式，是连接木鱼书与粤剧的重要纽带。
              </p>
            </div>
            <div className="md:w-1/2 animate-item">
              <div className="aspect-video rounded-lg shadow-lg overflow-hidden">
                <img 
                  src={yueJuImage} 
                  alt="粤剧" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 木鱼书起源 */}
      <section 
        ref={addToRefs}
        className="py-16 px-4 bg-parchment"
      >
        <div className="container mx-auto max-w-4xl">
          <h2 className="animate-item section-title text-center mx-auto mb-12">木鱼书的起源</h2>
          
          <div className="animate-item ancient-paper mb-8">
            <p className="muyu-text mb-4">
              木鱼歌从诞生之时，就带有从娘胎带来千年民歌基因的顽强生命力，只是这种顽强不表现在自身艺术水平上的进化，而是表现在以母亲的胸怀与社会环境互动后，渐次衍生出新的三个说唱艺术品种：龙舟、南音和粤谣。
            </p>
            <ul className="muyu-text space-y-2 list-inside">
              <li><strong className="text-cinnabar">南音</strong>：失明艺人怀抱琵琶，一人分饰多角吟唱乱世情殇，《客途秋恨》中"凉风有信，秋月无边"道尽飘零；</li>
              <li><strong className="text-cinnabar">龙舟歌</strong>：游吟者胸挂锣鼓，手托木雕龙舟即兴编唱，"鲤鱼喐喐，朝鱼晚肉"的吉祥话满是市井生机；</li>
              <li><strong className="text-cinnabar">木鱼歌</strong>：盲艺人敲击刳空硬木击节而歌，用俚俗粤语讲述长篇故事——这才是粤调说唱的根系。</li>
            </ul>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-item">
            <div className="bg-parchment border border-amber-800/30 rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-kai text-cinnabar mb-4">表演形式</h3>
              <p className="text-ink">
                木鱼书的表演者通常是一人或数人，手持木鱼、拍板等打击乐器，
                边敲边唱。表演场所多在茶楼、庙会、民间集会等地方，
                是早期民间娱乐的重要形式。
              </p>
            </div>
            <div className="bg-parchment border border-amber-800/30 rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-kai text-cinnabar mb-4">内容特点</h3>
              <p className="text-ink">
                木鱼书内容丰富多彩，既有宣扬佛教教义的经文故事，
                也有反映世俗生活的民间传说。语言通俗易懂，
                富有地方特色，是研究岭南文化的重要资料。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 木鱼书详解 */}
      <section 
        ref={addToRefs}
        className="py-16 px-4 bg-paper-texture bg-cover"
      >
        <div className="container mx-auto max-w-4xl">
          <h2 className="animate-item section-title text-center mx-auto mb-12">木鱼书详解</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="animate-item bg-parchment border border-amber-800/30 rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-kai text-cinnabar mb-4">演唱者</h3>
              <p className="text-ink">
                木鱼书的演唱者多为民间艺人，也有僧人、文人参与。
                他们通过口传心授的方式学习技艺，将这一文化代代相传。
              </p>
            </div>
            <div className="animate-item bg-parchment border border-amber-800/30 rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-kai text-cinnabar mb-4">演唱场合</h3>
              <p className="text-ink">
                木鱼书最初在寺庙中演唱，后来扩展到茶楼、庙会、民间集会等场所。
                在特殊节日或庆典活动中，木鱼书表演尤为常见。
              </p>
            </div>
            <div className="animate-item bg-parchment border border-amber-800/30 rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-kai text-cinnabar mb-4">演唱内容</h3>
              <p className="text-ink">
                木鱼书的内容包括佛经故事、历史传说、民间故事、神话传奇等，
                题材广泛，既有教化功能，也有娱乐价值。
              </p>
            </div>
          </div>
          
          <div className="animate-item">
            <h3 className="text-xl font-kai text-cinnabar mb-6 text-center">木鱼书的艺术特点</h3>
            <div className="bg-parchment border border-amber-800 rounded-lg p-6 shadow-lg">
              <ul className="space-y-4 muyu-text">
                <li><strong className="text-cinnabar">语言特色：</strong>木鱼书使用方言演唱，语言通俗易懂，富有地方色彩。</li>
                <li><strong className="text-cinnabar">音乐风格：</strong>以木鱼、拍板等打击乐器伴奏，节奏鲜明，音调抑扬顿挫。</li>
                <li><strong className="text-cinnabar">表演形式：</strong>一人或数人表演，边敲边唱，表情丰富，生动形象。</li>
                <li><strong className="text-cinnabar">文学价值：</strong>木鱼书是研究岭南文化、民间文学的重要资料，具有较高的文学价值。</li>
                <li><strong className="text-cinnabar">社会功能：</strong>木鱼书既有教化功能，也有娱乐功能，是早期民间文化传播的重要媒介。</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 时间线 */}
      <section 
        ref={addToRefs}
        className="py-16 px-4 bg-ink text-parchment"
      >
        <div className="container mx-auto max-w-4xl">
          <h2 className="animate-item text-3xl font-kai text-gold mb-12 text-center">木鱼书发展时间线</h2>
          
          <div className="relative">
            {/* 时间线轴 */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gold/50"></div>
            
            {/* 时间点 */}
            <div className="animate-item relative z-10 mb-12">
              <div className="flex items-center justify-center">
                <div className="bg-gold w-4 h-4 rounded-full"></div>
              </div>
              <div className="mt-4 bg-ink/80 border border-gold/30 rounded-lg p-6 shadow-lg max-w-md mx-auto">
                <h3 className="text-xl font-kai text-gold mb-2">明朝中期（约16世纪）</h3>
                <p className="text-parchment/80">
                  木鱼书起源于寺庙中，僧人用木鱼伴奏演唱佛经故事，
                  目的是向民众宣传佛教教义。
                </p>
              </div>
            </div>
            
            <div className="animate-item relative z-10 mb-12">
              <div className="flex items-center justify-center">
                <div className="bg-gold w-4 h-4 rounded-full"></div>
              </div>
              <div className="mt-4 bg-ink/80 border border-gold/30 rounded-lg p-6 shadow-lg max-w-md mx-auto">
                <h3 className="text-xl font-kai text-gold mb-2">明朝晚期至清朝初期（约17世纪）</h3>
                <p className="text-parchment/80">
                  木鱼书逐渐世俗化，内容扩展到历史故事、民间传说等，
                  成为民间娱乐的重要形式。
                </p>
              </div>
            </div>
            
            <div className="animate-item relative z-10 mb-12">
              <div className="flex items-center justify-center">
                <div className="bg-gold w-4 h-4 rounded-full"></div>
              </div>
              <div className="mt-4 bg-ink/80 border border-gold/30 rounded-lg p-6 shadow-lg max-w-md mx-auto">
                <h3 className="text-xl font-kai text-gold mb-2">清朝中晚期（约18-19世纪）</h3>
                <p className="text-parchment/80">
                  木鱼书与南音结合，形成了独特的艺术风格，
                  成为粤剧形成的重要源头之一。
                </p>
              </div>
            </div>
            
            <div className="animate-item relative z-10">
              <div className="flex items-center justify-center">
                <div className="bg-gold w-4 h-4 rounded-full"></div>
              </div>
              <div className="mt-4 bg-ink/80 border border-gold/30 rounded-lg p-6 shadow-lg max-w-md mx-auto">
                <h3 className="text-xl font-kai text-gold mb-2">现代（20世纪至今）</h3>
                <p className="text-parchment/80">
                  随着社会变迁，木鱼书逐渐式微，但作为非物质文化遗产，
                  得到了政府和民间的保护和传承。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default IntroductionPage;