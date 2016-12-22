# Effective type checking in plain javascript.
## Install
```sh
npm install type.of
```


## Introduction

Javascript is hostile to effective type checking. Exhibit A:

```js
typeof null               // object   >:(

typeof NaN                // number   :?

typeof [1, 2]             // object   >:(

's' instanceof String     // false    :/

5 instanceof Number       // false    :/

true instanceof Boolean   // false    :/
```

This makes type checks of the usual kind categorically unmaintainable for codebases containing more than a dozen type-fussy functions. Attempts to check types carefully and thoroughly without any tools can result in rather [grotesque code](https://www.joyent.com/node-js/production/design/errors#an-example). TYPEOF reduces type checking of function parameters to rote declaration:

```js
function (name, weight, children) {

  TYPEOF
    (arguments)
    (String, Number, Array)

  return someValue
}
```

When illicit arguments are encountered, there's no detective work:

```sh
TypeError:

   Value (2):
    Required: number
    Provided: '164lbs.'

    at yourFunction (/Users/.../yourFile.js:10:7)
    at /Users/.../yourFile.js:13:3
    at Object.<anonymous> (/Users/.../yourFile.js:15:2)
    at Module._compile (module.js:541:32)
    at Object.Module._extensions..js (module.js:550:10)
    at Module.load (module.js:458:32)
    at tryModuleLoad (module.js:417:12)
    at Function.Module._load (module.js:409:3)
    at Module.runMain (module.js:575:10)
    ...
```

But it's not just for function parameters; it'll type check anything you give it:

```js
TYPEOF(5)(Number) // ✔
```

Moreover, TYPEOF *returns* the value being checked, so one can concisely check return types:

```js
function () {

  // ...

  return TYPEOF(someVal)(Array)
}
```
<hr/>
## N.b.: Here's what it isn't.
TYPEOF is not intended to guarantee the correctness of a program. That is not how javascript works, and not how I wish to work. TYPEOF sharply limits the variety and incidence of runtime mischief. It also improves enormously the quality of feedback provided by the console when such mischief is encountered.
<hr/>

## Examples
### Native Constructors
```js
TYPEOF
  (arguments)
  (Boolean, String, Number, Array, Object, Function, ArrayBuffer)
```

### Duck-Typing
```js
TYPEOF
  (arguments)
  ({ id:String, cost:Number })
```

### Union/Disjoint Types
```js
TYPEOF
  (arguments)
  ([String, Number])
```

### Custom Constructors
```js
TYPEOF
  (arguments)
  (MyType)

// Use a string if the constructor/class isn't defined:

TYPEOF
  (arguments)
  ('MyType')
```

### Void
```js
TYPEOF
  (arguments)
  ('void')
```

### Wild Card
```js
TYPEOF
  (arguments)
  ('*')

// N.b.: this still enforces correct arity.
```

## API
### `TYPEOF(value: any): function`
```TYPEOF``` takes one parameter of any type and returns the *check* function. So:

```js
TYPEOF(1) // Function
```

### `check(type: any, ...): any`
The check function takes a list of types or type names and it returns the value that was passed to `TYPEOF`. That is, unless it throws an error upon type check failure. So, one could do the following:

```js
const checkFunc = TYPEOF(1)
checkFunc(Number) // ✔ - returns 1

// OR

checkFunc(Boolean) // throws
```

If (and only if) the value passed to `TYPEOF` is a native `arguments` object, it will check each of the values therein against the corresponding type passed to `check`. So:

```js
function someFunc(num, str, arr) {

  TYPEOF
    (arguments)
    (Number, String, Array)

  // Do whatever.

}

someFunc(1, 'string', [1, 2, 3]) // ✔
someFunc('1', false, {}) // throws
```

### `TYPEOF.match(type: any, value: any): boolean`
To have TYPEOF return a boolean instead of throwing an error on failure, call `TYPEOF.match(<type>, <value>)`.

### `TYPEOF.silence(): undefined`
Avoid throwing errors in production by invoking `TYPEOF.silence`. The function takes no arguments and always returns `undefined`. Once silenced, TYPEOF will not throw, and will not check types, so there is no performance hit.
