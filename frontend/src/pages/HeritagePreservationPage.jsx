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
          
          <div className="animate-item flex flex-col gap-8 mt-12">
            <div className="bg-parchment/80 p-6 rounded-lg shadow-md border border-ink/10">
              <h3 className="text-2xl font-kai text-cinnabar mb-4">木鱼书具备的价值</h3>
              <ul className="space-y-4">
                <li>
                  <strong className="text-cinnabar">文学价值：</strong> 木鱼书题材丰富，包含爱情、历史、神怪等故事，像《花笺记》情节曲折动人，文学性强，对研究古代通俗文学创作手法、叙事结构等有重要意义；语言方面，它采用大量岭南地区的方言俗语，生动展现了当地语言特色和文化底蕴，是研究方言演变的珍贵语料。
                </li>
                <li>
                  <strong className="text-cinnabar">艺术价值：</strong> 其独特的说唱艺术形式，融合了音乐、表演等多种艺术元素。唱腔丰富多变，具有浓郁的地方音乐风格，对研究岭南音乐的旋律、节奏等方面有参考价值 ；在表演上，艺人通过说唱、表情、动作等塑造形象，展现出独特的表演艺术魅力。
                </li>
                <li>
                  <strong className="text-cinnabar">历史文化价值：</strong> 木鱼书记录了当时社会的生活风貌、风俗习惯、价值观念等。比如通过书中描写能了解到明清时期岭南地区的婚丧嫁娶习俗、商业活动情况等，是研究地方社会史、民俗史的重要资料，也是传承岭南文化的重要载体，承载着当地民众的集体记忆和文化认同。
                </li>
              </ul>
            </div>
            <div className="bg-parchment/80 p-6 rounded-lg shadow-md border border-ink/10">
              <h3 className="text-2xl font-kai text-cinnabar mb-4">木鱼书现代传承面临的挑战</h3>
              <ul className="space-y-4">
                <li>
                  <strong className="text-cinnabar">传承人群体萎缩：</strong> 木鱼书说唱收益不高，年轻人为追求更好的经济收入，往往选择其他职业，导致愿意学习和传承木鱼书的年轻人数量稀少 ；并且，现有传承人年龄普遍较大，很多技艺和知识未能及时有效传承下去。
                </li>
                <li>
                  <strong className="text-cinnabar">受众群体缩小：</strong> 在现代多元娱乐方式冲击下，如网络视频、电子游戏等，木鱼书的说唱形式对年轻一代吸引力不足，受众主要集中在老年群体，市场需求小，导致其传播范围受限。
                </li>
                <li>
                  <strong className="text-cinnabar">文本保存困难：</strong> 许多木鱼书以古籍抄本或刻本形式存在，因年代久远，纸张老化、虫蛀、霉变等问题严重，且部分散落在民间收藏家手中，缺乏专业的保护和管理，容易造成文本损坏和流失。
                </li>
                <li>
                  <strong className="text-cinnabar">文化语境变迁：</strong> 随着社会快速发展，现代生活方式和价值观改变，木鱼书中所反映的传统生活场景和价值观念逐渐远离人们的生活，导致人们对其理解和共鸣减少，增加了传承难度。
                </li>
              </ul>
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
              木鱼书的保护现状呈现出一定进展与不少问题并存的局面。
            </p>
            <p className="text-parchment/80 mb-4">
              在进展方面，各地文化部门、研究机构等积极开展文本收集整理工作，建立数据库并整理出版部分珍贵版本；政府重视传承人保护与培养，通过认定传承人、提供支持鼓励其开展传承活动，部分院校也纳入相关课程；各地通过文化节、展览、演出及新媒体等进行宣传推广，学界研究也不断深入。
            </p>
            <p className="text-parchment/80">
              但同时，问题依然存在，大量文本散落民间因缺乏专业保护面临损坏风险，且部分收藏者不愿配合导致难以妥善保管；传承因学习难度大、经济效益低而后继乏人；宣传推广在与现代娱乐竞争中效果有限，线上内容形式单一、线下覆盖面不足；保护资金主要依赖政府拨款，社会资本参与少，存在资金缺口，相关政策执行也有待加强。
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