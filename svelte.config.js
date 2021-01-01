const sveltePreprocess = require('svelte-preprocess')
const autoprefixer = require('autoprefixer')

const production = !process.env.ROLLUP_WATCH

module.exports = {
  compilerOptions: {
    // enable run-time checks when not in production
    dev: !production,
  },
  // we'll extract any component CSS out into
  // a separate file - better for performance
  preprocess: sveltePreprocess({
    babel: {
      presets: [
        [
          '@babel/preset-env',
          {
            loose: true,
            modules: false,
            targets: {
              esmodules: true,
            },
          },
        ],
      ],
    },
    scss: {
      prependData: `@import "src/style/_definitions.scss";`,
    },
    postcss: {
      plugins: [autoprefixer()],
    },
  }),
}
