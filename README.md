# Static types plain javascript.
Enforce argument types in any function or method by adding pretty declarations to the body:

```js
function lastVisited(place, year) {

  TYPEOF
    (arguments)
    (String, Number)

  return `I visited ${place} ${new Date().getFullYear() - year} years ago.`
}

lastVisited('Texas', 'long ago')
// TypeError: Requires (String, Number) but was passed (String, String)
```

This would-be declaration is a higher-order function invocation which itself enforces the desired type and arity requirements. That means we don't need to transpile the code. It runs as is.

## Permitted type declarations:
* `String, Number, Array, Boolean, Function, Object`
* Any class/constructor
* Disjunctions expressed as flat arrays, which can include `null`.
