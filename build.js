const { build } = require('esbuild-wasm')

build({
  entryPoints: ['./src/index.jsx'],
  outfile: './dist/index.js',
  inject: ['./scriptable-x-shim.js'],
  jsxFactory: 'x'
}).catch(err => {
  process.stderr.write(err.stderr)
  process.exit(1)
})
