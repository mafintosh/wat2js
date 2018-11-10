#!/usr/bin/env node

process.title = 'wat2js'

var minimist = require('minimist')
var proc = require('child_process')
var os = require('os')
var path = require('path')
var fs = require('fs')
var wasm2js = require('wasm2js')

var argv = minimist(process.argv.slice(2), {
  alias: {output: 'o', watch: 'w'},
  boolean: ['w'],
  '--': true
})

var inp = argv._[0]

if (!inp) {
  console.error(`
Usage: wat2js [input.wat file] [options...] -- [wat2wasm options...]
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
  var tmp = path.join(os.tmpdir(), 'out.wasm.' + Date.now())

  var wat2wasmArgv = [inp, '-o', tmp].concat(argv['--'])
  var wat2wasm = path.join(__dirname, 'node_modules', '.bin', os.platform() === 'win32' ? 'wat2wasm.cmd' : 'wat2wasm')

  proc.spawn(wat2wasm, wat2wasmArgv, {stdio: 'inherit'}).on('exit', function (code) {
    if (code) {
      if (argv.watch) return
      process.exit(1)
    }

    var wasm = fs.readFileSync(tmp)
    fs.unlink(tmp, noop)

    var src = wasm2js(wasm)

    if (argv.output) fs.writeFileSync(argv.output, src)
    else process.stdout.write(src)
  })
}

function noop () {}
