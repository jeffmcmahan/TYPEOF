# Effective type checking in plain javascript.

Javascript is hostile to effective type checking. Exhibit A:

```js
's' instanceof String // false`
```

```js
typeof [1, 2] // object
```

```js
typeof null // object
```

```js
typeof NaN // number`
```

This makes type checks of the usual kind categorically unmaintainable for codebases containing more than a dozen type-fussy functions. TYPEOF reduces type checking to rote declaration:

```js
function (name, weight, children) {

  TYPEOF
    (arguments)
    (String, Number, Array)

  // ...
}
```

When illicit arguments are passed, there's no detective work:

```sh
TypeError: 

    Required:  String,  String,  Array
    Provided:  String,  Number,  Object
                        ^^^^^^   ^^^^^^
                        2        {id:1234
    
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

## Install
Install from npm and start adding declarations to your functions.

```sh
npm install typeof-arg
```

## Examples
### Native Constructors
```js
TYPEOF
  (arguments)
  (Boolean, String, Number, Array, Object, Function)
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
  (MyClass)

// OR
TYPEOF
  (arguments)
  ('MyClass')
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

### Use in Production Code
Avoid throwing errors in production using `TYPEOF.silence()` or `TYPEOF.silenceIf(someCondition)`.

### Check anything anywhere.
TYPEOF takes any array-like argument and returns a function which accepts a list of types. That means TYPEOF will dutifully check the type of any set of values, in any context:

```js
const person = {name: 'Jeff', age: 29}
const toupee = {color: 'black'}

TYPEOF
  ([person, toupee])
  ({ name:String, age:Number }, Object)
```
