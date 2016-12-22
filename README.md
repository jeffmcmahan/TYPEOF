# Effective type checking in plain javascript.
There is no compile step. TYPEOF is a *function.* Not a new language.

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

And there are many gotchas that make things especially difficult. For example, take Exhibit B:
```js
function someFunc(length) {

  if (length === NaN) throw new Error("Length can't be NaN!")

  // ...

}
```
The above seems very reasonable, but in javascript, `NaN === NaN` is `false`. This kind of thing makes manual type checking code categorically unmaintainable for codebases containing many type-fussy functions (particularly when NaN is involved). Moreover, competently checking types carefully and thoroughly without any tools produces [grotesque code](https://www.joyent.com/node-js/production/design/errors#an-example).

TYPEOF reduces type checking of function parameters to rote declaration:

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
TYPEOF is not intended to guarantee the correctness of a program. That is not how javascript works, and not how I wish it to work. Instead, TYPEOF sharply limits the variety and incidence of runtime mischief. It also improves the quality of feedback provided by the console when something bad happens. In other words, it delivers the benefits of correctness without correctness as such.
<hr/>

## Examples
### Native Types
```js
TYPEOF
  (arguments)
  (Boolean, String, Number, Array, Object, Function, ArrayBuffer, ...)

// Any native type will work.
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

### Non-Native Types
```js
TYPEOF
  (arguments)
  (MyType)

// Use a string if the constructor/class isn't defined:

TYPEOF
  (arguments)
  ('MyType')

// Can be used in duck types and unions too:

TYPEOF
  (arguments)
  ({ id:'MyType', cost:MyOtherType })

TYPEOF
  (arguments)
  (['MyType', MyOtherType])
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

// Works for duck-types and unions, too:

TYPEOF
  (arguments)
  ({ someProp:'*' })
```

**N.b.:** A Wild card still enforces correct arity, so passing *nothing* to a function with a wildcard type specification will throw. That us, a wild card means *anything*&#8212;not *anything or nothing*.

## API
### `TYPEOF(value: any): function`
```TYPEOF``` takes one parameter of any type and returns the *check* function. So:

```js
TYPEOF(1) // Function
```

### `check(type1: any, ..., typeN: any): any`
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
