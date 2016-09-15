# Effective type checking in plain javascript.

## Install

```sh
npm install typeof-arg
```

## Introduction

Javascript is hostile to effective type checking. Exhibit A:

```js
's' instanceof String // false
```

```js
typeof [1, 2] // object
```

```js
typeof null // object
```

```js
typeof NaN // number
```

This makes type checks of the usual kind categorically unmaintainable for codebases containing more than a dozen type-fussy functions. TYPEOF reduces type checking of function parameters to rote declaration:

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

    Required:  String,  Number,  Array
    Provided:  String,  String,  Object
                        ^^^^^^   ^^^^^^
                        heavy    {id:1...

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
TYPEOF([1, 2, 3])(Array)
```

Moreover, TYPEOF *returns* the value being checked, so one can concisely check return types:

```js
function () {

  // ...
  
  return TYPEOF(someVal)(Array)
}
```

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
```

## API
### TYPEOF()
```TYPEOF``` takes one parameter of any type and returns the *check* function. So:

```js
TYPEOF(1) // Function
```

### check()
The check function takes a list of types or type names and it returns the value that was passed to `TYPEOF`. That is, unless it throws an error upon type check failure. So:

```js
const checkFunc = TYPEOF(1)
checkFunc(Number) // 1
```

### TYPEOF.silence
Avoid throwing errors in production by calling `TYPEOF.silence()`. This function takes no arguments and always returns `undefined`. Once silenced, TYPEOF will not throw, and will not check types, so there is no performance hit.

### TYPEOF.silenceIf
Conditionally avoid throwing errors in production by calling `TYPEOF.silenceIf`. This function takes one argument and always returns `undefined`.

```js
TYPEOF.silenceIf(app.env !== 'dev')
```

If the value passed is truthy, TYPEOF will not throw, and will not check types, so there is no performance hit.