import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './app.vue',
    './error.vue',
  ],
  theme: {
    extend: {
      colors: {
        paper: '#f4f1ea',
        ink: '#1c1915',
        moss: '#2f5d50',
        night: '#1a2330',
        gold: '#e8b423',
      },
      fontFamily: {
        sans: [
          'PingFang SC',
          'Hiragino Sans GB',
          'Noto Sans SC',
          'Microsoft YaHei',
          'sans-serif',
        ],
        serif: [
          'Iowan Old Style',
          'Palatino Linotype',
          'Palatino',
          'Songti SC',
          'STSong',
          'Georgia',
          'serif',
        ],
      },
    },
  },
} satisfies Config
