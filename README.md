# Static types in plain javascript.
Enforce argument types in any function or method by adding pretty declarations to the body:

```js
const TYPEOF = require('typeof')

function lastVisited(place, year) {

  TYPEOF
    (arguments)
    (String, Number)

  return `I visited ${place} ${new Date().getFullYear() - year} years ago.`
}

lastVisited('Texas', 'long ago') // throws

// TypeError:
//
//   REQUIRED:  String, Number
//   PASSED:    String, String
//
//     at Object.TYPEOF (/Users/.../TYPEOF/src/index.js:62:52)
//     at lastVisited (/Users/.../TYPEOF/tests/index.js:124:5)
//     at Object.<anonymous> (/Users/.../TYPEOF/tests/index.js:136:1)
//     at Module._compile (module.js:541:32)
//     at Object.Module._extensions..js (module.js:550:10)
//     at Module.load (module.js:458:32)
//     at tryModuleLoad (module.js:417:12)
//     at Function.Module._load (module.js:409:3)
//     at Module.runMain (module.js:575:10)
//     at run (bootstrap_node.js:352:7)
```

This would-be declaration is a higher-order function invocation which itself enforces the desired type and arity requirements. Obviously that means there is no build step.

## Permitted type declarations:
* `String, Number, Array, Boolean, Function, Object`
* Any class/constructor
* Disjunctions expressed as flat arrays, which can include `null`.

## Silence it in production.
It's handy to have fussy type warnings when you're working on the code, but you can have it disabled when your code is running live by checking some condition in your code and calling `.silence()`:

```js
// For example, if using in the browser:
if (location.href.indexOf('localhost') === -1) TYPEOF.silence()
```

This prevents the type checking logic from running, to the performance hit of having the declarations in the code is &approx;zero when silenced.
