import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // 监听滚动事件，改变导航栏样式
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 关闭移动菜单当路由变化时
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // 导航链接
  const navLinks = [
    { name: '首页', path: '/' },
    { name: '介绍木鱼书', path: '/introduction' },
    { name: '感受木鱼书', path: '/experience' },
    { name: '创作木鱼书', path: '/creation' },
    { name: '传承木鱼书', path: '/heritage' },
    { name: '数字资源', path: '/digital-resources' },
  ];

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-parchment bg-opacity-95 shadow-md py-2' : 'bg-transparent py-4'}`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <span className="text-2xl font-kai text-cinnabar">木鱼书</span>
        </Link>

        {/* 桌面导航 */}
        <nav className="hidden md:flex space-x-8">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              to={link.path}
              className={`font-kai text-lg transition-colors duration-300 ${location.pathname === link.path ? 'text-cinnabar border-b-2 border-gold' : 'text-ink hover:text-cinnabar'}`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* 移动端菜单按钮 */}
        <button 
          className="md:hidden text-ink"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* 移动端菜单 */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-parchment bg-opacity-95 shadow-md">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path}
                className={`font-kai text-lg py-2 border-b border-gold/30 ${location.pathname === link.path ? 'text-cinnabar' : 'text-ink'}`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;