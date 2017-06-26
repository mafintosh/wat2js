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
