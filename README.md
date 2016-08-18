# Effective type checking in plain javascript.

Javascript is hostile to effective type checking. Exhibit A:

* `'s' instanceof String // false`
* `typeof [1, 2] // object`
* `typeof null // object`
* `typeof NaN // number`

Manual type checks are categorically unmaintainable for codebases containing more than a dozen type-fussy functions. TYPEOF reduces type checking to rote declaration:

```js
function (name, weight, children) {

  TYPEOF
    (arguments)
    (String, Number, Array)

  // ...
}
```

While it's not actually declarative, it feels that way. By the act of stating the types, they are checked. And when an illicit argument is passed, you will see something like this above your stack trace:

```sh
TypeError:

  Required:  String, Number, Array
  Provided:  String, String, Array
                     ^^^^^^
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
