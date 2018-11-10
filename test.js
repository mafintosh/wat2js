var tape = require('tape')
var execSync = require('child_process').execSync
var unlinkSync = require('fs').unlinkSync

tape('test example', function (t) {
  var tst = './.test.example.' + Date.now() + '.js'
  var cmd = 'node ./index.js ./example.wat -o ' + tst

  execSync(cmd)

  var mod = require(tst)()

  t.equal(mod.exports.add(417, 2), 419, 'wasm add')

  unlinkSync(tst)
  t.end()
})
