const plugin = require('tailwindcss/plugin');

module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,svelte,ts,tsx,vue}'],
  darkMode: ['class', '[data-color-scheme="dark"]'],
  theme: {
    container: {
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
      },
    },
    fontFamily: {
      sans: ['Metropolis', 'sans-serif'],
      serif: ['Erode-Variable', 'Erode', 'serif'],
    },
  },
  plugins: [
    require('sass-themes/tailwind'),
    plugin(({ matchUtilities, theme }) => {
      matchUtilities(
        {
          'min-aspect': (value) => ({
            '&::before': {
              content: "''",
              paddingTop: value,
              float: 'left',
            },
            '&::after': {
              content: "''",
              display: 'table',
              clear: 'both',
            },
          }),
        },
        {
          values: Object.entries(theme('aspectRatio')).reduce(
            (values, [k, aspect]) => {
              let n = Number(aspect);
              if (Number.isNaN(n)) {
                const [x, y] = aspect.split('/').map(Number);
                n = y / x;
              }
              if (Number.isNaN(n)) return values;
              return {
                ...values,
                [k]: (100 * n).toFixed(2) + '%',
              };
            },
            {}
          ),
        }
      );
    }),
  ],
};
