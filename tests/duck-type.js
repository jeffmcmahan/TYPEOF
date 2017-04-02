'use strict'

const assert = require('assert')
const TYPEOF = require('../src')
class MyClass {}

//==============================================================================

assert.doesNotThrow(
  _=> TYPEOF({a:'s'})({ a:String }),
  'Should not throw when duck type matches.'
)

//==============================================================================

assert.throws(
  _=> TYPEOF({a:1})({ a:String }),
  'Should throw when duck type does not match.'
)

//==============================================================================

function test(obj) {
  TYPEOF
    (...arguments)
    (Number, { id:Number, name:String })
}

assert.doesNotThrow(
  test.bind(null, 1, {id:1, name:'Jo'}),
  'Should not throw when provided with ducktype match.'
)

assert.throws(
  test.bind(null, '1', {id:1, name:'Jo'}),
  'Should throw when parameter other than ducktype is wrong.'
)

assert.throws(
  test.bind(null, 1, 1),
  'Should throw when non-object passed in ducktyped arg\'s position.'
)

assert.throws(
  test.bind(null, 1, {id:false, name:'Jo'}),
  'Should throw when ducktype does not match passed object.'
)

//==============================================================================

function test1(obj) {
  TYPEOF
    (...arguments)
    ({ myClass:'MyClass' })
}

assert.doesNotThrow(
  test1.bind(null, { myClass: new MyClass() }),
  'Should work with embedded custom constructors.'
)

//==============================================================================

function test2(obj) {
  TYPEOF
     (...arguments)
     ({ propName:'any' })
}

assert.throws(
  test2.bind(null, undefined),
  function (err) {
    return !err.toString().includes('Cannot read property')
  },
  'Should throw a TYPEOF TypeError error (not a property lookup error).'
)

process.stdout.write('  ✔ Duck-type requirement tests passed.\n')
