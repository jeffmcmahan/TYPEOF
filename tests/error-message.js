'use strict'

const assert = require('assert')
const TYPEOF = require('../src')

//================================================ Boolean Requirement =========

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
   `(1) required: boolean
        provided: string`)
    },
    'Should report boolean type mismatch.'
  )
}()

//================================================= Number Requirement =========

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
   `(1) required: number
        provided: string`)
    },
    'Should report number type mismatch.'
  )
}()

//================================================= String Requirement =========

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
   `(1) required: string
        provided: number`)
    },
    'Should report string type mismatch.'
  )
}()

//================================================ Array Requirement ===========

void function () {

  function test(arr) {
    TYPEOF
      (...arguments)
      (Array)
  }

  assert.throws(
    test.bind(null, { prop:1 }),
    function (err) {
      return err.toString().includes(
   `(1) required: array
        provided: { prop:number }`)
    },
    'Should report array type mismatch.'
  )
}()

//================================================ Object Requirement ==========

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
   `(1) required: Object
        provided: []`)
    },
    'Should report object type mismatch.'
  )
}()

//================================================ Complex Type Diff ===========

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
   `(1) required: string
        provided: boolean

    (2) required: number
        provided: string

    (3) required: boolean
        provided: string

    (4) required: array
        provided: {}

    (5) required: Object
        provided: []`)
    },
    'Should throw 5 value diffs for 5 failures.'
  )
}()

//================================================= Object Serialization =======

void function () {

  function test({name, age}) {
    TYPEOF
      (...arguments)
      ({ name:String, age:Number })
  }

  assert.throws(
    test.bind(null, {name: false, age: '55', otherProp:[]}),
    function (err) {
      return err.toString().includes(
   `(1) required: { age:number, name:string, ... }
        provided: { age:string, name:boolean, ... }`)
    },
    'Should produce a readable diff of duck-type and Object.'
  )
}()

void function () {

  function test({name, age}) {
    TYPEOF
      (...arguments)
      ({ name:String, age:Number })
  }

  assert.throws(
    test.bind(null, {name: false, otherProp:[]}),
    function (err) {
      return err.toString().includes(
   `(1) required: { age:number, name:string, ... }
        provided: { name:boolean, ... }`)
    },
    'Should produce a readable diff of duck-type and Object.'
  )
}()

//=================================================== Array Serialization ======

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
   `(1) required: string|number
        provided: boolean`)
    },
    'Should be readable diff of disjoint type and boolean.'
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
    'Should produce a readably serialized array type description.'
  )
}()

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
   `(1) required: MyClass|MyOtherClass
        provided: boolean`)
    },
    'Should be readable disjoint type diff.'
  )
}()

//=============================================== Undefined Requirement ========

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
   `(1) required: undefined
        provided: null`)
    },
    'Should report undefined mistmatch.'
  )
}()

//================================================== Null Requirement ==========

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
   `(1) required: null
        provided: undefined`)
    },
    'Should report null mismatch.'
  )
}()

//================================================== Void Requirement ==========

void function () {

  function test() {
    TYPEOF
      (...arguments)
      ('void')
  }

  assert.throws(
    test.bind(null, 1),
    function (err) {
      return err.toString().includes(
   `(1) required: void
        provided: number`)
    },
    'Should report explicit void requirement.'
  )
}()

//====================================================== Void Value ============

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
   `(1) required: void
        provided: string`)
    },
    'Should report void mistmatch.'
  )
}()

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
   `(1) required: string
        provided: void`)
    },
    'Should report void mistmatch.'
  )
}()

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
   `(1) required: string
        provided: void

    (2) required: number
        provided: void`)
    },
    'Should report multiple void arguments mistmatch.'
  )
}()

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
   `(1) required: MyClass
        provided: void`)
    },
    'Should report void/MyClass mismatch.'
  )
}()

//================================================== Implicit Void =============

void function () {

  class MyClass {}

  function test() {
    TYPEOF
      (...arguments)
      (Number)
  }

  assert.throws(
    ()=> test(1, 2),
    function (err) {
      return err.toString().includes(
   `(2) required: void (implicit)
        provided: number`)
    },
    'Should report implicit void mismatch.'
  )
}()

//=================================================== 'any' Requirement ========

void function () {

  function test() {
    TYPEOF
      (...arguments)
      ('any')
  }

  assert.throws(
    test,
    function (err) {
      return err.toString().includes(
   `(1) required: any
        provided: void`)
    },
    'Should report when any required but nothing passed.'
  )
}()

//==============================================================================

process.stdout.write('  ✔ Error message tests passed.\n')
