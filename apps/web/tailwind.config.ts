import type { Config } from "tailwindcss";
import type { PluginAPI } from 'tailwindcss/types/config';

const config: Config = {
  content: [
    "./app/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        bounce: 'bounce 2s ease infinite',
      },
      keyframes: {
        bounce: {
          '50%': { transform: 'translateY(25px)' },
        },
      },
      transitionDelay: {
        '100': '0.25s',
        '200': '0.5s',
        '300': '0.75s',
      },
    },
  },
  plugins: [
    function({ addUtilities }:PluginAPI) {
      addUtilities({
        '.animation-delay-100': {
          'animation-delay': '0.25s',
        },
        '.animation-delay-200': {
          'animation-delay': '0.5s',
        },
        '.animation-delay-300': {
          'animation-delay': '0.75s',
        },
      });
    },
  ],
};
export default config;