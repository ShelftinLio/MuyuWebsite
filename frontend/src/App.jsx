import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MuyuHelper from './components/MuyuHelper';

// 页面组件
import HomePage from '@pages/HomePage';
import IntroductionPage from '@pages/IntroductionPage';
import ExperiencePage from '@pages/ExperiencePage';
import CreationPage from '@pages/CreationPage';
import HeritagePreservationPage from '@pages/HeritagePreservationPage';
import DigitalResourcesPage from '@pages/DigitalResourcesPage';
import AdminPage from '@pages/AdminPage';

// 组件
import Header from '@components/layout/Header';
import Footer from '@components/layout/Footer';
import ScrollToTop from '@components/common/ScrollToTop';

// 注册GSAP插件
gsap.registerPlugin(ScrollTrigger);

function App() {
  const location = useLocation();

  // 页面切换时滚动到顶部
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="app-container min-h-screen flex flex-col">
      <Header />
      <MuyuHelper />
      
      <main className="flex-grow">
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/introduction" element={<IntroductionPage />} />
          <Route path="/experience" element={<ExperiencePage />} />
          <Route path="/creation" element={<CreationPage />} />
          <Route path="/heritage" element={<HeritagePreservationPage />} />
          <Route path="/digital-resources" element={<DigitalResourcesPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </main>
      
      <Footer />
    </div>
  );
}

export default App;