#!/usr/bin/env node

process.title = 'wat2js'

var minimist = require('minimist')
var os = require('os')
var path = require('path')
var fs = require('fs')
var wasm2js = require('wasm2js')
var Promise = global.Promise

if (typeof Promise !== 'function') {
  Promise = {
    resolve: function() {}
  }
}

var wabt = require('./third_party/libwabt')
var argv = minimist(process.argv.slice(2), {
  alias: {output: 'o', watch: 'w'},
  boolean: ['w']
})

var inp = argv._[0]

if (!inp) {
  console.error(`
Usage: wat2js [input.wat file] [options...]
  --output, -o [output.js file]
  --watch,  -w [recompile on input.wat change]
  `.trim())
  process.exit(1)
}

if (argv.watch && !argv.output) {
  console.error('--watch requires --output')
  process.exit(2)
}

if (argv.watch) fs.watch(inp, compile)
compile()

function compile () {
  var file = fs.readFileSync(inp, { encoding: 'utf8' })
  var filename = path.basename(inp)
  var wasmModule = wabt.parseWat(filename, file)

  wasmModule.validate()

  var wasm = Buffer.from(wasmModule.toBinary({log: false, write_debug_names: false}).buffer)
  var src = wasm2js(wasm)

  if (argv.output) fs.writeFileSync(argv.output, src)
  else process.stdout.write(src)
}
