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
          <p className="text-md font-fangsong text-gray-600 max-w-2xl mx-auto mt-4 italic">
            “在当下，说唱作品《大展鸿图》火爆全网，其极具冲击力的节奏和充满广式风情的歌词令人印象深刻。仔细聆听，会发现歌曲中不断重复的旋律，巧妙采样自粤剧经典《帝女花》。”
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
                粤剧并非孤高艺术，它的血脉中奔涌着广府街头说唱的三大支流：
              </p>
              <ul className="animate-item muyu-text space-y-2 list-inside mb-4">
                <li><strong className="text-cinnabar">南音</strong>：失明艺人怀抱琵琶，一人分饰多角吟唱乱世情殇，《客途秋恨》中“凉风有信，秋月无边”道尽飘零；</li>
                <li><strong className="text-cinnabar">龙舟歌</strong>：游吟者胸挂锣鼓，手托木雕龙舟即兴编唱，“鲤鱼喐喐，朝鱼晚肉”的吉祥话满是市井生机；</li>
                <li><strong className="text-cinnabar">木鱼歌</strong>：盲艺人敲击刳空硬木击节而歌，用俚俗粤语讲述长篇故事——<strong>这才是粤调说唱的根系。</strong></li>
              </ul>
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
          <h2 className="animate-item section-title text-center mx-auto mb-12">木鱼书</h2>
          
          <div className="animate-item ancient-paper mb-8">
            <p className="muyu-text mb-4">
              木鱼书是广东民间说唱曲艺木鱼歌的文字底本，诞生于明中期，受弹词、宝卷影响，以类似木鱼的敲击乐器伴奏，盛行于广东地区。其内容丰富多样，故事既取自传统题材，涵盖历史传奇、才子佳人等多种类型，又能敏锐捕捉时事热点，反映社会现实。在艺术特征上，语言形式以七言为主，说唱结合，常一唱到底，间或插入衬字；语言雅俗共赏，融入大量粤方言，充满岭南地域特色和烟火气息；还善用丰富的修辞手法，生动展现人物与事物 。
            </p>

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
                过去以说唱为生的职业艺人，多是失明的瞽师。
                他们在社会上属于最卑下的阶层，说唱是他们谋生的唯一技能，也是他们生活的传统。
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
                <h3 className="text-xl font-kai text-gold mb-2">明朝晚期至清朝初期（约17世纪）</h3>
                <p className="text-parchment/80 leading-relaxed">
                  目前可见最早的木鱼书，是郑振铎在巴黎发现康熙五十二年（1714）出版的《花笺记》，而根据书内钟戴苍氏的评语，提及 “歌本” 的名称，可知木鱼书于清初时名为歌本。钟氏在评语内还提及其他歌本，包括有《二荷花史》、《四美联床》。
                  <br/><br/>
                  据此推断，木鱼书既在康熙年间已流行，其出现可能早于清初。
                </p>
              </div>
            </div>
            
            <div className="animate-item relative z-10 mb-12">
              <div className="flex items-center justify-center">
                <div className="bg-gold w-4 h-4 rounded-full"></div>
              </div>
              <div className="mt-4 bg-ink/80 border border-gold/30 rounded-lg p-6 shadow-lg max-w-md mx-auto">
                <h3 className="text-xl font-kai text-gold mb-2">清至民国初年（约18-19世纪）</h3>
                <p className="text-parchment/80 leading-relaxed">
                  清初之后木鱼书的印行非常蓬勃。由木鱼书内所见的藏板识记，如静净斋、华翰堂、进盛堂、明秀堂等出版商，在乾隆年间已经印售木鱼书。
                  <br/><br/>
                  从现存的及已散佚而只存篇目的数量，可知在清代一段长时期，刊印木鱼书是一种兴盛的事业。在广州和四郊的乡镇，均有木鱼书的出版商号。一直到一九五零年间，香港仍有数家木鱼书的出版商。
                </p>
              </div>
            </div>
            
            <div className="animate-item relative z-10">
              <div className="flex items-center justify-center">
                <div className="bg-gold w-4 h-4 rounded-full"></div>
              </div>
              <div className="mt-4 bg-ink/80 border border-gold/30 rounded-lg p-6 shadow-lg max-w-md mx-auto">
                <h3 className="text-xl font-kai text-gold mb-2">现代（20世纪至今）</h3>
                <p className="text-parchment/80 leading-relaxed">
                  作为表演艺术的木鱼歌演出随着新时代新艺术的发展逐渐退出了观众的视野，但对于木鱼歌这种非物质文化遗产的保护仍然在进行中：
                  <br/><br/>
                  木鱼歌在 2007 年被列入<strong>东莞市</strong>首批非物质文化遗产项目代表作名录；
                  <br/>
                  2009 年被列入广东省第三批非物质文化遗产项目代表作名录；
                  <br/>
                  2011 年 5 月则被国务院公布为第三批国家级非物质文化遗产项目名录。
                  <br/><br/>
                  研究广东木鱼书对于非物质文化遗产的保护仍然具有重要意义。
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