/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        apple: {
          bg: {
            light: '#f5f5f7',
            dark: '#000000',
            cardLight: '#ffffff',
            cardDark: '#1c1c1e',
          },
          text: {
            light: '#1d1d1f',
            dark: '#f5f5f7',
            subtleLight: '#86868b',
            subtleDark: '#a1a1a6',
          },
          accent: '#0071e3',
          accentHover: '#0077ed',
          siri: {
            blue: '#00d2ff',
            purple: '#928dab',
            pink: '#ff007f',
            cyan: '#00f2fe'
          }
        }
      },
      fontFamily: {
        sf: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', '"SF Pro Text"', 'Inter', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
        apple: '20px',
      },
      animation: {
        'siri-glow': 'siriGlow 4s ease-in-out infinite alternate',
        'siri-pulse': 'siriPulse 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        siriGlow: {
          '0%': { filter: 'hue-rotate(0deg) blur(10px) brightness(1)' },
          '50%': { filter: 'hue-rotate(180deg) blur(16px) brightness(1.2)' },
          '100%': { filter: 'hue-rotate(360deg) blur(10px) brightness(1)' },
        },
        siriPulse: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.9' },
          '50%': { transform: 'scale(1.08)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
