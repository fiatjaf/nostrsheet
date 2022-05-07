#!/usr/bin/env node

const esbuild = require('esbuild')
const alias = require('esbuild-plugin-alias')
const nodeGlobals = require('@esbuild-plugins/node-globals-polyfill').default
const liveServer = require('live-server')

const prod = process.argv.indexOf('prod') !== -1

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

esbuild
  .build(buildOptions)
  .then(() => console.log('build success.'))
  .then(() =>
    liveServer.start({
      open: false,
      port: 3000,
      host: 'localhost',
      root: 'public',
      file: 'index.html'
    })
  )
