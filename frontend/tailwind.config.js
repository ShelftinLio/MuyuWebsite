/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 传统中国风配色
        'parchment': '#F5E8C7', // 羊皮纸/卷轴色
        'ink': '#2D2B29',       // 墨色
        'cinnabar': '#CD4236',  // 朱砂红
        'jade': '#6E8B74',      // 翡翠绿
        'gold': '#D4AF37',      // 金色
        'azure': '#1B98E0',     // 青色
      },
      fontFamily: {
        'song': ['SimSun', 'Noto Serif SC', 'serif'],       // 宋体
        'kai': ['KaiTi', 'Noto Serif SC', 'serif'],         // 楷体
        'fangsong': ['FangSong', 'Noto Sans SC', 'serif'], // 仿宋
      },
      backgroundImage: {
        'scroll-pattern': "url('@assets/images/scroll-bg.svg')",
        'paper-texture': "url('@assets/images/paper-texture.svg')",
      },
      animation: {
        'scroll-unfold': 'unfold 1.5s ease-out forwards',
      },
      keyframes: {
        unfold: {
          '0%': { transform: 'scaleY(0)' },
          '100%': { transform: 'scaleY(1)' },
        }
      }
    },
  },
  plugins: [],
}