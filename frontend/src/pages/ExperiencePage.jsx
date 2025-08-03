import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// 注册GSAP插件
gsap.registerPlugin(ScrollTrigger);

const ExperiencePage = () => {
  // 创建引用以便于动画
  const sectionsRef = useRef([]);
  
  // 当前选中的木鱼书示例
  const [activeTab, setActiveTab] = useState('visual');
  
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

  // 木鱼书示例数据
  const examples = {
    visual: {
      title: '视觉体验',
      description: '通过视频感受木鱼书的表演形式和艺术魅力。',
      content: (
        <div className="aspect-video rounded-lg shadow-lg overflow-hidden">
          <iframe 
            className="w-full h-full"
            src="https://www.youtube.com/embed/g5bXhLRXzl8" 
            title="木魚歌，廣東傳統說唱藝術，國家級非物質文化遺產項目"
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
          ></iframe>
        </div>
      ),
      text: (
        <div className="mt-6 p-6 bg-parchment border border-amber-800/30 rounded-lg shadow-md">
          <h4 className="text-xl font-kai text-cinnabar mb-4">视频说明</h4>
          <p className="muyu-text mb-4">
            木鱼歌是广东传统说唱艺术，已被列入国家级非物质文化遗产名录。这种艺术形式以木鱼、拍板等打击乐器伴奏，演唱者边敲边唱，表演生动活泼。
          </p>
          <p className="text-ink text-sm">
            <strong>视频来源：</strong> YouTube - 土兀观察频道<br/>
            <strong>视频标题：</strong> 木魚歌，廣東傳統說唱藝術，國家級非物質文化遺產項目
          </p>
        </div>
      )
    },
    audio: {
      title: '听觉体验',
      description: '聆听木鱼书的音频，感受其独特的音乐风格和语言魅力。',
      content: (
        <div className="bg-parchment border border-amber-800/30 rounded-lg p-6 shadow-md">
          <audio controls className="w-full">
            <source src="/Users/sean/Documents/Project/MuyuWebsite/image/音频.m4a" type="audio/mp4" />
            您的浏览器不支持音频播放器。
          </audio>
          
          <div className="mt-4">
            <h5 className="text-lg font-kai text-cinnabar mb-2">木鱼书视频</h5>
            <div className="aspect-w-16 aspect-h-9">
              <iframe 
                src="https://www.youtube.com/embed/we9JGZHYuNA?start=27944" 
                title="四邑恩平木魚歌" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen 
                className="w-full h-64 rounded-md"
              ></iframe>
            </div>
          </div>
        </div>
      ),
      text: (
        <div className="mt-6 p-6 bg-parchment border border-amber-800/30 rounded-lg shadow-md">
          <h4 className="text-xl font-kai text-cinnabar mb-4">音频文字内容</h4>
          <p className="muyu-text space-y-4">
            莫言書館因花惱，又談小姐繡房間。自系花蔭同講論，訴出私情亦見難。花蔭見佢愁容慘，時時珠淚濕衣衫。我想少年人便貪風月，何況風流嗊後生。我系深閨紅粉女，冇些閒事挂心間。近日見生情與態，盡把衷情對我談。引動閨幃風月性，日擔煩惱幾多番。真正相逢不若無相識，免得愁愁悶悶積如山。人話相思第一難消散，虧他寒館怨孤單。啲得百年偕白髮，免教同病減朱顏。果段離情空自惱，擔愁亦怕見丫鬟。蕓香知姐心中事，前來對姐細言談：姐呀花容寂寞因誰惱，做乜春山頻鎖淚偷彈？光陰易過流年快，青春一去恨無返。開懷且講風花事，滿天愁緒旦丟閒。
          </p>
        </div>
      )
    },
    text: {
      title: '文字体验',
      description: '阅读木鱼书原文，感受其文学魅力和艺术价值。',
      content: (
        <div className="ancient-paper">
          <h4 className="text-xl font-kai text-cinnabar mb-4">木鱼书原文</h4>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <img 
                src="https://youke1.picui.cn/s1/2025/07/20/687cfc3e6e87d.png" 
                alt="木鱼书原文左页" 
                className="w-full h-auto rounded-lg shadow-md"
              />
            </div>
            <div className="flex-1">
              <img 
                src="https://youke1.picui.cn/s1/2025/07/20/687cfc3e9aaf3.png" 
                alt="木鱼书原文右页" 
                className="w-full h-auto rounded-lg shadow-md"
              />
            </div>
          </div>
          <h4 className="text-xl font-kai text-cinnabar mb-4">《主婢私談》</h4>
            <div className="muyu-text space-y-4 text-sm md:text-base">
            <p>
              莫言書館因花惱，又談小姐繡房間。自系花蔭同講論，訴出私情亦見難。花蔭見佢愁容慘，時時珠淚濕衣衫。我想少年人便貪風月，何況風流嗊後生。我系深閨紅粉女，冇些閒事挂心間。近日見生情與態，盡把衷情對我談。引動閨幃風月性，日擔煩惱幾多番。真正相逢不若無相識，免得愁愁悶悶積如山。人話相思第一難消散，虧他寒館怨孤單。啲得百年偕白髮，免教同病減朱顏。果段離情空自惱，擔愁亦怕見丫鬟。
            </p>
            <p>
              蕓香知姐心中事，前來對姐細言談：姐呀花容寂寞因誰惱，做乜春山頻鎖淚偷彈？光陰易過流年快，青春一去恨無返。開懷且講風花事，滿天愁緒旦丟閒。瑤仙對婢將言答，你睇陣陣秋涼透薄衫。光陰一竟如流水，我想人生一世幾般難。蕓香乘興言知姐：白髮催人兩鬢斑。自古黃金容易得，光陰一去再無還。你話秋風冷透羅裳薄，虧了客館離人怨枕單。那日見生同姐會，佢話一時腸斷兩三番。我姐心堅如鐵石，不知人在斷腸間。
            </p>
            <p>
              瑤仙睇見無人處，半吐真言對婢談。你我相親如姊妹，試把私情講一番。豈有做人如土木，將人情當水般閒。快活百年誰不愛，縱然仙女亦思凡。總系禮儀所關廉恥重，被人談論見羞慚。此生雖系一個風流客，百年乾系是非閒。恐怕只顧眼前風共月，人情翻複似波瀾。果陣世間多少無情漢，誤人閨女當為閒。又怕前緣非是佢，爹娘別處睇年生。你話幾多枉費閒心事，流傳人世做清談。
            </p>
            <p>
              蕓香笑答賢嬌姐，我亦時常想再三。梁生無似輕浮子，言談動靜穩如山。富貴當朝居第一，詩詞歌賦播江南。若肯差媒求配合，高堂未必重刁難。小姐玉容塵世少，第一人生匹配難。只憂父母憑媒講，空圖富貴睇年生。湊著不才愚拙子，縱有珍珠成斗也虛閒。縱然好極為皇后，多少冷宮愁挨怨身單。重有昭出塞歸何處？楊妃飲恨馬嵬山。烏江自刎虞姬死，西施冷落五湖間。千金縱買相如賦，六宮常會減朱顏。不如及早尋佳配，才子佳人際會難。
            </p>
          </div>
        </div>
      ),
      text: (
        <div className="mt-6 p-6 bg-parchment border border-amber-800/30 rounded-lg shadow-md">
          <h4 className="text-xl font-kai text-cinnabar mb-4">文本分析</h4>
          <p className="text-ink mb-4">
            这段木鱼书文本描述了一位名为瑤仙的小姐与她的侍女蕓香之间关于爱情的对话。
            文中通过细腻的心理描写和生动的对话，展现了古代女子在爱情与礼教之间的矛盾与挣扎。
          </p>
          <p className="text-ink">
            木鱼书的文学价值不仅在于其艺术表现力，还在于其对人物心理和社会现实的深刻反映，
            是研究岭南文化和民间文学的重要资料。这段文字采用粤语文字记录，保留了原汁原味的地方特色。
          </p>
        </div>
      )
    }
  };

  return (
    <div className="experience-page pt-20">
      {/* 页面标题 */}
      <section className="py-16 px-4 bg-scroll-pattern bg-cover bg-center">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-kai text-cinnabar mb-6">感受木鱼书</h1>
          <p className="text-xl font-fangsong text-ink max-w-3xl mx-auto">
            通过视频、音频和文字，全方位感受木鱼书的艺术魅力
          </p>
        </div>
      </section>



      {/* 木鱼书体验区 */}
      <section 
        ref={addToRefs}
        className="py-16 px-4 bg-paper-texture bg-cover"
      >
        <div className="container mx-auto max-w-4xl">
          <h2 className="animate-item section-title text-center mx-auto mb-12">多维度体验</h2>
          
          {/* 选项卡 */}
          <div className="animate-item flex justify-center mb-8">
            <div className="inline-flex rounded-md shadow-sm">
              {Object.keys(examples).map((key) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`px-6 py-3 text-lg font-kai ${activeTab === key
                    ? 'bg-cinnabar text-parchment'
                    : 'bg-parchment text-ink hover:bg-cinnabar/10'
                  } ${key === 'visual' ? 'rounded-l-md' : ''} ${key === 'text' ? 'rounded-r-md' : ''} border border-cinnabar transition-colors duration-300`}
                >
                  {examples[key].title}
                </button>
              ))}
            </div>
          </div>
          
          {/* 内容区 */}
          <div className="animate-item">
            <h3 className="text-2xl font-kai text-cinnabar mb-4">{examples[activeTab].title}</h3>
            <p className="text-ink mb-6">{examples[activeTab].description}</p>
            
            {/* 示例内容 */}
            {examples[activeTab].content}
            
            {/* 文字内容 */}
            {examples[activeTab].text}
          </div>
        </div>
      </section>

      {/* 木鱼书艺术特点 */}
      <section 
        ref={addToRefs}
        className="py-16 px-4 bg-parchment"
      >
        <div className="container mx-auto max-w-4xl">
          <h2 className="animate-item section-title text-center mx-auto mb-12">木鱼书的艺术特点</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="animate-item bg-parchment border border-amber-800/30 rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-kai text-cinnabar mb-4">语言特色</h3>
              <p className="text-ink">
                木鱼书使用方言演唱，语言通俗易懂，富有地方色彩。
                其语言风格既有文言的典雅，又有白话的生动，
                形成了独特的艺术魅力。
              </p>
            </div>
            <div className="animate-item bg-parchment border border-amber-800/30 rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-kai text-cinnabar mb-4">音乐风格</h3>
              <p className="text-ink">
                木鱼书以木鱼、拍板等打击乐器伴奏，节奏鲜明，音调抑扬顿挫。
                其音乐风格简洁明快，具有浓郁的地方特色，
                是岭南音乐文化的重要组成部分。
              </p>
            </div>
            <div className="animate-item bg-parchment border border-amber-800/30 rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-kai text-cinnabar mb-4">表演形式</h3>
              <p className="text-ink">
                木鱼书的表演者通常是一人或数人，手持木鱼、拍板等打击乐器，
                边敲边唱。表演时表情丰富，动作生动，
                能够有效地传达故事内容和人物情感。
              </p>
            </div>
            <div className="animate-item bg-parchment border border-amber-800/30 rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-kai text-cinnabar mb-4">文学价值</h3>
              <p className="text-ink">
                木鱼书的文学价值主要体现在其丰富的内容、独特的表现手法和深刻的思想内涵上。
                它不仅是研究岭南文化的重要资料，
                也是中国民间文学的瑰宝。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 号召行动 */}
      <section 
        ref={addToRefs}
        className="py-16 px-4 bg-ink text-parchment"
      >
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="animate-item text-3xl md:text-4xl font-kai text-gold mb-6">体验木鱼书创作</h2>
          <p className="animate-item text-xl text-parchment/80 mb-8">
            感受了木鱼书的艺术魅力，是否想尝试创作属于自己的木鱼书作品？
            通过AI技术的辅助，您可以轻松创作出具有木鱼书风格的文学作品。
          </p>
          <a 
            href="/creation"
            className="animate-item inline-block px-8 py-3 bg-gold text-ink font-kai text-lg rounded-sm hover:bg-amber-500 transition-colors duration-300 shadow-lg"
          >
            开始创作
          </a>
        </div>
      </section>
    </div>
  );
};

export default ExperiencePage;