import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// 这个组件用于在路由变化时将页面滚动到顶部
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;