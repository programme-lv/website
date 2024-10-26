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
    'text-xl', 'font-bold', 'mb-3',
    'mb-2',
    'list-disc', 'pl-5',
    'list-decimal',
    'mb-1',
    'bg-gray-100', 'p-1', 'rounded',
    'min-w-full', 'divide-y', 'divide-gray-200',
    'bg-gray-50',
    'bg-white',
    'px-6', 'py-3', 'text-left', 'text-xs', 'font-medium', 'text-gray-500', 'uppercase', 'tracking-wider',
    'px-6', 'py-4', 'whitespace-nowrap',
  ],
}
