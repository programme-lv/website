import {nextui} from '@nextui-org/theme'

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [nextui()],
  safelist: [
    'text-2xl', 'font-bold', 'mb-4',
    'text-xl', 'mb-3',
    'text-base', 'mb-2',
    'list-disc', 'pl-5',
    'list-decimal',
    'mb-1',
    'bg-gray-100', 'p-1', 'rounded',
  ]
}
