#!/usr/bin/env node

const esbuild = require('esbuild')
const chokidar = require('chokidar')
const liveServer = require('live-server')
const alias = require('esbuild-plugin-alias')
const nodeGlobals = require('@esbuild-plugins/node-globals-polyfill').default

const prod = process.argv.indexOf('prod') !== -1
const serve = process.argv.indexOf('serve') !== -1

;(async () => {
  const builder = await esbuild.build({
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
  })

  if (serve) {
    chokidar
      .watch('src/**/*.{js,jsx}', {
        interval: 0
      })
      .on('all', () => {
        builder.rebuild()
      })

    liveServer.start({
      host: 'localhost',
      port: 7777,
      root: 'public'
    })
  } else {
    console.log('build success.')
  }
})()
