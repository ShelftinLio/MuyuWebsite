import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-ink text-parchment py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 关于木鱼书 */}
          <div>
            <h3 className="text-xl font-kai text-gold mb-4 border-b border-gold/30 pb-2">关于木鱼书</h3>
            <p className="text-parchment/80 mb-4">
              木鱼书是中国传统说唱文学的一种，起源于明清时期的广东地区，是粤剧的重要前身之一。
            </p>
            <Link to="/introduction" className="text-gold hover:text-cinnabar transition-colors duration-300">
              了解更多 &rarr;
            </Link>
          </div>

          {/* 快速链接 */}
          <div>
            <h3 className="text-xl font-kai text-gold mb-4 border-b border-gold/30 pb-2">快速链接</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-parchment/80 hover:text-gold transition-colors duration-300">
                  首页
                </Link>
              </li>
              <li>
                <Link to="/introduction" className="text-parchment/80 hover:text-gold transition-colors duration-300">
                  介绍木鱼书
                </Link>
              </li>
              <li>
                <Link to="/experience" className="text-parchment/80 hover:text-gold transition-colors duration-300">
                  感受木鱼书
                </Link>
              </li>
              <li>
                <Link to="/creation" className="text-parchment/80 hover:text-gold transition-colors duration-300">
                  创作木鱼书
                </Link>
              </li>
              <li>
                <Link to="/heritage" className="text-parchment/80 hover:text-gold transition-colors duration-300">
                  传承木鱼书
                </Link>
              </li>
              <li>
                <Link to="/digital-resources" className="text-parchment/80 hover:text-gold transition-colors duration-300">
                  数字资源
                </Link>
              </li>
            </ul>
          </div>

          {/* 联系我们 */}
          <div>
            <h3 className="text-xl font-kai text-gold mb-4 border-b border-gold/30 pb-2">联系我们</h3>
            <p className="text-parchment/80 mb-2">
              如果您对木鱼书文化有兴趣，或想了解更多关于本项目的信息，请联系我们。
            </p>
            <p className="text-parchment/80">
              邮箱：muyushu2025@hotmail.com
            </p>
          </div>
        </div>

        {/* 版权信息 */}
        <div className="mt-8 pt-4 border-t border-parchment/20 text-center text-parchment/60">
          <p>&copy; {currentYear} 木鱼书文化传承</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;