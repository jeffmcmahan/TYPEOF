# Effective type checking in plain javascript.
```sh
npm install type.of
```

## Why do this?

Javascript is hostile to effective type checking.

```js
typeof null               // object   >:(

typeof NaN                // number   :?

NaN === NaN               // false    >:(

typeof [1, 2]             // object   >:(

's' instanceof String     // false    :/

5 instanceof Number       // false    :/

true instanceof Boolean   // false    :/
```

Gotchas make manual type validation logic categorically unmaintainable. And even if it were maintainable, thorough checks are [grotesque](https://www.joyent.com/node-js/production/design/errors#an-example). `TYPEOF` reduces all this to rote declaration:

```js
function (name, weight, children) {

  TYPEOF
    (...arguments)
    (String, Number, Array)

  // ...
}
```

We fix the gotchas, and when mismatches happen, there's no detective work:

```
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
    ...
```

### Is the aim statically typed JS? No.
`TYPEOF` doesn't ensure program correctness. That's not how javascript works, and not how I wish it to work. `TYPEOF` allows you to selectively limit runtime mischief with nice console feedback when something goes awry.

## API
### Validate types.
`TYPEOF` implements pairwise type validation with Curry syntax:

```js
TYPEOF(val1, ..., valN)(type1, ..., typeN)
```

So, validating a single value is just the limiting case:

```js
function isYoung(age) {

  TYPEOF(age)(Number)

  return age < 80
}
```

Iterables (*e.g.,* arrays, `arguments` objects) can be validated concisely using the spread operator, as follows:

```js
function example(name, age, isTall) {

  TYPEOF
    (...arguments)
    (String, Number, Boolean)

  // Do stuff.
}
```

Type validation calls return the first value passed, so function return types can be validated easily:

```js
function divide(num1, num2) {
  return TYPEOF(num1 / num2)(Number)
}

divide(10, 2) // returns 5

divide(10, undefined) // throws
```

### Type descriptions
#### Native and custom types work.
```js
TYPEOF(val)(ArrayBuffer)
TYPEOF(val)(MyClass)
TYPEOF(val)('MyClass') // <-- By name works too.
```

#### Duck types work.
Specify any subset of keys and corresponding types to duck type a value.

```js
TYPEOF(val)({ name:String, weight:Number })
```

#### Disjoint types work.
Use arrays to express that any of the given types is valid.

```js
TYPEOF(val)([String, Number])
```

#### You can declare `'void'` and `'*'`.
```js
function example() {

  TYPEOF
    (...arguments)
    ('void')

  // Do whatever.
}
```

Or permit any type with kleene star:

```js
TYPEOF(val)('*')
```

#### Mix and nest as necessary.
```js
TYPEOF
  (...arguments)
  ([MyClass, String], { prop:MyClass, prop2:'*' }, 'MyClass')
```

### Complex validation is easy.
You can extend `TYPEOF` with type and function signature descriptions for DRY-ness and concision. One could validate Express middleware as follows:

```js
// Describe types and function signatures once:
TYPEOF.req = { originalUrl:String, method:String }
TYPEOF.res = { headersSent:Boolean, locals:Object }
TYPEOF.middleware = [ TYPEOF.req, TYPEOF.res, Function ]


// And then use them anywhere:
function myMiddleware(req, res, next) {

  TYPEOF
    (...arguments)
    (...TYPEOF.middleware)

  // ...
}
```
It's powerfully wily---for javascript, this is just the job.

### Modes
By default, `TYPEOF` throws an informative TypeError when validation fails. This can be changed per your needs.

#### `TYPEOF.WARN()`
Log type errors to the console instead of the `throw`-ing. This tends to be very useful during major refactoring.

#### `TYPEOF.OFF()`
Disables type checking to eliminate the performance hit and prevent `throw`-ing. This can be useful in production.
