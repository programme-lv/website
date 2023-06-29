/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  daisyui: {
    themes: [

      {
        mytheme: {

          "primary": "#0066FF",

          "secondary": "#179E7E",

          "accent": "#F2B135",

          "neutral": "#F8F8F8",

          "base-100": "#ffffff",

          "info": "#64b4f2",

          "success": "#107048",

          "warning": "#f8d763",

          "error": "#DC3545",
        },
      },
      "corporate",
    ],
  },
  plugins: [require("daisyui")],
}
