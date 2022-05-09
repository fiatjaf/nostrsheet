#!/usr/bin/env node

const esbuild = require('esbuild')
const alias = require('esbuild-plugin-alias')
const nodeGlobals = require('@esbuild-plugins/node-globals-polyfill').default

const prod = process.argv.indexOf('prod') !== -1
const watch = process.argv.indexOf('watch') !== -1

const buildOptions = {
  entryPoints: ['src/index.js'],
  outfile: 'public/bundle.js',
  bundle: true,
  plugins: [
    alias({
      stream: require.resolve('readable-stream')
    }),
    nodeGlobals({buffer: true})
  ],
  define: {
    window: 'self',
    global: 'self'
  },
  loader: {'.js': 'jsx'},
  sourcemap: prod ? false : 'inline',
  minify: prod,
  incremental: !prod
}

if (watch) {
  esbuild
    .serve({port: 7777, host: 'localhost', servedir: 'public'}, buildOptions)
    .then(server => console.log(server))
} else {
  esbuild.build(buildOptions).then(() => console.log('build success.'))
}
