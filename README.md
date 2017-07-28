# wast2js

Compile WebAssembly .wat files to a common js module

```
npm install -g wast2js
```

See https://github.com/WebAssembly/wabt for more WebAssembly goodies.

Currently requires the `wast2wasm` program to be installed globally.

## Usage

First make a basic WebAssembly .wat file

```
;; example.wat
(module
  ;; var result = add(a, b)
  (func (export "add") (param $a i32) (param $b i32) (result i32)
    ;; return a + b
    (i32.add
      (get_local $a)
      (get_local $b)
    )
  )
)
```

Then compile it to WebAssembly and wrap in a common js loader by doing

``` sh
wast2js example.wat -o example.js
```

To run the WebAssembly simply do:

``` js
var example = require('./example.js')() // load the wasm
if (!example) throw new Error('WebAssembly not supported by your runtime')

var result = example.exports.add(1, 2)
console.log('1 + 2 = ' + result)
```

To keep recompiling the `.wat` file when it changes pass the `--watch` option as well

``` sh
wast2js example.wat -o example.js --watch # recompile when example.wat changes
```

## API

#### `var mod = require('./compiled-wat.js')([options])`

Loads your WebAssembly module. If WebAssembly is not supported by the runtime, `null` is returned.

Options include:

``` js
{
  imports: {...} // import objected forwared to WASM,
  async: false // force sync loading.
}
```

Note that if your WASM is larger than 4kb, some browsers might force async loading.


`mod` looks like this

``` js
{
  exports: {...}, // exports WASM functions
  memory: Uint8Array, // exports.memory wrapped in a uint8array (if exported)
  buffer: Uint8Array, // the WASM module as a buffer
  onload: onload(cb), // function you can call to wait for async loading
  realloc: realloc(bytes) // reallocate the memory buffer to a new size
}
```

In case of async loading `exports` and `memory` will be `null` until the module has been loaded.

## License

MIT
