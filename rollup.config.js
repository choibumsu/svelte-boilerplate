import svelte from 'rollup-plugin-svelte'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import livereload from 'rollup-plugin-livereload'
import { terser } from 'rollup-plugin-terser'
import babel from '@rollup/plugin-babel'
import css from 'rollup-plugin-css-only'
import scss from 'rollup-plugin-scss'
import postcss from 'postcss'
import autoprefixer from 'autoprefixer'
import dotenv from 'dotenv'
import replace from '@rollup/plugin-replace'
import alias from '@rollup/plugin-alias'
import path from 'path'

dotenv.config()

const production = !process.env.ROLLUP_WATCH

function serve() {
  let server

  function toExit() {
    if (server) server.kill(0)
  }

  return {
    writeBundle() {
      if (server) return
      server = require('child_process').spawn(
        'npm',
        ['run', 'start', '--', '--dev'],
        {
          stdio: ['ignore', 'inherit', 'inherit'],
          shell: true,
        }
      )

      process.on('SIGTERM', toExit)
      process.on('exit', toExit)
    },
  }
}

export default {
  input: 'src/main.js',
  output: {
    sourcemap: true,
    format: 'iife',
    name: 'app',
    file: 'public/build/bundle.js',
  },
  plugins: [
    svelte(require('./svelte.config')),

    replace({
      env: JSON.stringify({
        isProd: production,
        ...dotenv.config().parsed, // attached the .env config
      }),
    }),

    babel({
      babelHelpers: 'bundled',
      presets: ['@babel/preset-env'],
    }),

    // we'll extract any component CSS out into
    // a separate file - better for performance
    css({
      output: 'bundle.css',
    }),
    scss({
      output: 'public/build/assets.css',
      processor: () => postcss([autoprefixer()]),
    }),

    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration -
    // consult the documentation for details:
    // https://github.com/rollup/plugins/tree/master/packages/commonjs
    resolve({
      browser: true,
      dedupe: ['svelte'],
      extensions: ['.svelte', '.ts', '.js', '.json'],
    }),
    commonjs(),

    alias({
      entries: [
        { find: '@', replacement: path.resolve(__dirname, 'src') },
        { find: '@api', replacement: path.resolve(__dirname, 'src/api') },
        {
          find: '@components',
          replacement: path.resolve(__dirname, 'src/components'),
        },
        { find: '@pages', replacement: path.resolve(__dirname, 'src/pages') },
        { find: '@store', replacement: path.resolve(__dirname, 'src/store') },
        { find: '@style', replacement: path.resolve(__dirname, 'src/style') },
        { find: '@utils', replacement: path.resolve(__dirname, 'src/utils') },
      ],
    }),

    // In dev mode, call `npm run start` once
    // the bundle has been generated
    !production && serve(),

    // Watch the `public` directory and refresh the
    // browser on changes when not in production
    !production && livereload('public'),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser(),
  ],
  watch: {
    clearScreen: false,
  },
}
