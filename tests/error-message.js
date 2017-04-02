'use strict'

const assert = require('assert')
const TYPEOF = require('../src')

//==============================================================================

void function () {

  function test(flag) {
    TYPEOF
      (...arguments)
      (Boolean)
  }

  assert.throws(
    test.bind(null, 'str'),
    function (err) {
      return err.toString().includes(
   `Value (1):
     Required: boolean
     Provided: 'str'`)
    },
    'Should report boolean type mismatch.'
  )
}()

//==============================================================================

void function () {

  function test(num) {
    TYPEOF
      (...arguments)
      (Number)
  }

  assert.throws(
    test.bind(null, 'str'),
    function (err) {
      return err.toString().includes(
   `Value (1):
     Required: number
     Provided: 'str'`)
    },
    'Should report number type mismatch.'
  )
}()

//==============================================================================

void function () {

  function test(name) {
    TYPEOF
      (...arguments)
      (String)
  }

  assert.throws(
    test.bind(null, 1),
    function (err) {
      return err.toString().includes(
   `Value (1):
     Required: string
     Provided: 1`)
    },
    'Should report string type mismatch.'
  )
}()

//==============================================================================

void function () {

  function test(arr) {
    TYPEOF
      (...arguments)
      (Array)
  }

  assert.throws(
    test.bind(null, {}),
    function (err) {
      return err.toString().includes(
   `Value (1):
     Required: array
     Provided: {}`)
    },
    'Should report array type mismatch.'
  )
}()

//==============================================================================

void function () {

  function test(obj) {
    TYPEOF
      (...arguments)
      (Object)
  }

  assert.throws(
    test.bind(null, []),
    function (err) {
      return err.toString().includes(
   `Value (1):
     Required: Object
     Provided: []`)
    },
    'Should report object type mismatch.'
  )
}()

//==============================================================================

void function () {

  function test(name, age, isTall, pets, props) {
    TYPEOF
      (...arguments)
      (String, Number, Boolean, Array, Object)
  }

  assert.throws(
    test.bind(null, false, '55', 'true', {}, []),
    function (err) {
      return err.toString().includes(
   `Value (1):
     Required: string
     Provided: false

    Value (2):
     Required: number
     Provided: '55'

    Value (3):
     Required: boolean
     Provided: 'true'

    Value (4):
     Required: array
     Provided: {}

    Value (5):
     Required: Object
     Provided: []`)
    },
    'Should throw 5 value diffs for 5 failures.'
  )
}()

//==============================================================================

void function () {

  function test({name, age}) {
    TYPEOF
      (...arguments)
      ({ name:String, age:Number })
  }

  assert.throws(
    test.bind(null, {name:'Joe', age:'55'}),
    function (err) {
      return err.toString().includes(
   `Value (1):
     Required: { name:string, age:number ... }
     Provided: { name:string, age:string ... }`)
    },
    'Should be readable duck-type diff.'
  )
}()

//==============================================================================

void function () {

  function test(numeric) {
    TYPEOF
      (...arguments)
      ([String, Number])
  }

  assert.throws(
    test.bind(null, false),
    function (err) {
      return err.toString().includes(
   `Value (1):
     Required: string|number
     Provided: false`)
    },
    'Should be readable disjoint type diff.'
  )

  function test2(arg) {
    TYPEOF
      (...arguments)
      (Object)
  }

  assert.throws(
    test2.bind(null, [1, 2, 4]),
    function (err) {
      return err.toString().includes('[ number, number, number ]')
    },
    'Should serialize the array.'
  )
}()

//==============================================================================

void function () {

  function test(numeric) {
    TYPEOF
      (...arguments)
      (['MyClass', 'MyOtherClass'])
  }

  assert.throws(
    test.bind(null, false),
    function (err) {
      return err.toString().includes(
   `Value (1):
     Required: MyClass|MyOtherClass
     Provided: false`)
    },
    'Should be readable disjoint type diff.'
  )
}()

//==============================================================================

void function () {

  function test(undef) {
    TYPEOF
      (...arguments)
      (undefined)
  }

  assert.throws(
    test.bind(null, null),
    function (err) {
      return err.toString().includes(
   `Value (1):
     Required: undefined
     Provided: null`)
    },
    'Should report undefined mistmatch.'
  )
}()

//==============================================================================

void function () {

  function test(str) {
    TYPEOF
      (...arguments)
      ('void')
  }

  assert.throws(
    test.bind(null, 'yo'),
    function (err) {
      return err.toString().includes(
   `Value (1):
     Required: void
     Provided: 'yo'`)
    },
    'Should report void mistmatch.'
  )
}()

//==============================================================================

void function () {

  function test(str) {
    TYPEOF
      (...arguments)
      (String)
  }

  assert.throws(
    test.bind(null),
    function (err) {
      return err.toString().includes(
   `Value (1):
     Required: string
     Provided: void`)
    },
    'Should report void mistmatch.'
  )
}()

//==============================================================================

void function () {

  function test(str) {
    TYPEOF
      (...arguments)
      (String, Number)
  }

  assert.throws(
    test.bind(null),
    function (err) {
      return err.toString().includes(
   `Value (1):
     Required: string
     Provided: void

    Value (2):
     Required: number
     Provided: void`)
    },
    'Should report multiple void arguments mistmatch.'
  )
}()

//==============================================================================

void function () {

  function test(nul) {
    TYPEOF
      (...arguments)
      (null)
  }

  assert.throws(
    test.bind(null, undefined),
    function (err) {
      return err.toString().includes(
   `Value (1):
     Required: null
     Provided: undefined`)
    },
    'Should report null mismatch.'
  )
}()

//==============================================================================

void function () {

  class MyClass {}

  function test() {
    TYPEOF
      (...arguments)
      ('MyClass')
  }

  assert.throws(
    test,
    function (err) {
      return err.toString().includes(
   `Value (1):
     Required: MyClass
     Provided: void`)
    },
    'Should report void/MyClass mismatch.'
  )
}()

//==============================================================================

void function () {

  class MyClass {}

  function test() {
    TYPEOF
      (...arguments)
      (Number)
  }

  assert.throws(
    _=> test(1, 2),
    function (err) {
      return err.toString().includes(
   `Value (2):
     Required: void (implicit)
     Provided: 2`)
    },
    'Should report implicit void mismatch.'
  )

}()

//==============================================================================

process.stdout.write('  ✔ Error message tests passed.\n')
