# Effective type checking in plain javascript.
Enforce argument types in any function or method by adding pretty declarations to the body:

```js
function lastVisited(place, year) {

  TYPEOF
    (arguments)
    (String, Number)

  return `I visited ${place} ${new Date().getFullYear() - year} years ago.`
}

lastVisited('Texas', 'long ago') // Throws TyepError.
```

And here's what the error message will look like, when the wrong type is passed:

```sh
TypeError:

  REQUIRED:  String, Number
  PASSED:    String, String

    at Object.TYPEOF (/Users/.../TYPEOF/src/index.js:62:52)
    at lastVisited (/Users/.../index.js:124:5)
    at Object.<anonymous> (/Users/.../index.js:136:1)
    at Module._compile (module.js:541:32)
    at Object.Module._extensions..js (module.js:550:10)
    at Module.load (module.js:458:32)
    at tryModuleLoad (module.js:417:12)
    at Function.Module._load (module.js:409:3)
    at Module.runMain (module.js:575:10)
    at run (bootstrap_node.js:352:7)
```

## Easily silence it in production.
It's handy to have fussy type warnings when you're working on the code, but you can have it disabled when your code is running live by calling `TYPEOF.silence()` or by passing a condition to `TYPEOF.silenceIf`, like this:

```js
TYPEOF.silenceIf(location.hostname !== 'localhost')
```

This prevents the type checking logic from running. The performance hit of having the declarations in the code is virtually zero when silenced.

## Type Requirements
### Void
`void` is expressed as a string: `"void"`. No arguments are permitted, including `undefined`.

```js
TYPEOF
  (arguments)
  ('void')
```

### Kleene star
You can permit an argument of any type using the `*` wild card. Notice that the function's arity is still checked, so if *no* argument is passed, the check will fail. This very useful in cases where you don't need to type check a parameter, but do need to type check others:

```js
function logItem(id, item) {

  TYPEOF
    (arguments)
    (Number, '*')

  //...
}
```

### Constructors
Native types are handled as you would expect: `Boolean, String, Number, Array, Object, Function`, as are custom constructors (e.g., `MyFancyClass`). However, sometimes including a constructor definition will result circular references among files. For that situation, you can also pass the name of any constructor that begins with capital letter (e.g., `"MyFancyClass"`).

### Union/Disjoint Requirements
Use shallow arrays of type requirements to express that any of the given types is permitted.

```js
TYPEOF
  (arguments)
  ([Object, null])
```

### Evil values: `NaN`, `null`, `undefined`
One of the major failings of javascript is the fact that you cannot use common sense to manually type check function parameters. For example, this is quite regrettable:

```js
function sum(arg1, arg2) {
  if (typeof arg1 !== 'number') return 0
  if (typeof arg2 !== 'number') return 0
  return arg1 + arg2
}

sum(NaN, 1) // -> returns NaN because typeof NaN === 'number'
```

Not-A-Number is a number. But `NaN instanceof Number` is `false`. You cannot reason about `NaN`. Did you know that `NaN !== NaN`? Yep. `NaN` is the product of arbitrary stipulation - you must simply beware of it.

Or an old classic:
```js
function printName(person) {
  if (typeof person === 'object' && !Array.isArray(person)) {
    return person.name
  }
}

printName(null) // -> TypeError, since typeof null is 'object'
```

There's lots more where that came from, and that sucks, so TYPEOF makes type declarations align with common sense:

```js
TYPEOF
  (arguments)
  (Number)

// -> Passing NaN triggers a TypeError
```

```js
TYPEOF
  (arguments)
  ([NaN, Decimal])

// -> Passing a Number triggers a TypeError
```

```js
TYPEOF
  (arguments)
  (null)

// -> Passing an Object triggers a TypeError
```

```js
TYPEOF
  (arguments)
  (Object)

// -> Passing null triggers a TypeError
```

But you are still permitted to do weird things if you choose:
```js
TYPEOF
  (arguments)
  (undefined, NaN, null)

// -> Passing undefined triggers a TypeError
```
