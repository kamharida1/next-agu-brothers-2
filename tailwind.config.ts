import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  plugins: [
    require('daisyui'),
    require('@tailwindcss/typography'),
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-open-sans)', 'Amazon Ember', 'Arial', 'sans-serif'],
      },
      colors: {
        amazon: {
          dark:    '#131921',
          nav:     '#232F3E',
          orange:  '#FF9900',
          hover:   '#F3A847',
          blue:    '#007185',
          green:   '#007600',
          red:     '#CC0C39',
          light:   '#EAEDED',
          text:    '#0F1111',
          muted:   '#565959',
          border:  '#D5D9D9',
          yellow:  '#FFA41C',
        }
      }
    }
  },
  daisyui: {
    themes: [
      {
        light: {
          ...require('daisyui/src/theming/themes')['light'],
          primary: '#FF9900',
          'primary-content': '#0F1111',
          secondary: '#232F3E',
          'secondary-content': '#ffffff',
          accent: '#007185',
          neutral: '#131921',
          'base-100': '#ffffff',
          'base-200': '#F7F8F8',
          'base-300': '#EAEDED',
          'base-content': '#0F1111',
          '.toaster-con': {
            'background-color': 'white',
            color: 'black',
          },
        },
        dark: {
          ...require('daisyui/src/theming/themes')['dark'],
          primary: '#FF9900',
          'primary-content': '#0F1111',
          '.toaster-con': {
            'background-color': '#1a1a1a',
            color: 'white',
          },
        },
      },
    ],
  },
  darkMode: ['class', '[data-mode="dark"]'],
}
export default config;
