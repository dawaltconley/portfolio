module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,svelte,ts,tsx,vue}'],
  theme: {
    container: {
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
      },
    },
    fontFamily: {
      sans: ['Gotham', 'sans-serif'],
      serif: ['Erode-Variable', 'serif'],
    },
  },
  plugins: [require('sass-themes/tailwind')],
};
