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
      sans: ['Gotham', 'sans-serif'],
      serif: ['Erode-Variable', 'Erode', 'serif'],
    },
  },
  plugins: [require('sass-themes/tailwind')],
};
