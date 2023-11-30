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
      colors: {
        green: {
          69: '#179E7E',
          420: '#00B67A',
        },
        blue: {
          69: '#0066FF',
          420: '#003F87'
        },
        gray: {
          69: '#F8F8F8',
          420: '#333333',
        },
        yellow: {
          69: '#F2B135',
        },
        logoblue: {
          69: '#023D89',
          420: '#0264F9',
        }
      },
      gridTemplateColumns: {
        sidebar: '64px auto',
        "sidebar-collapsed": '300px auto',
      }
    },
    scale: {
      69: '-1',
    }
  },
  important: '#__next',
  corePlugins: {
    preflight: false,
  },
}