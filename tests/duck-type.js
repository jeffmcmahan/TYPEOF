'use strict'

const assert = require('assert')
const TYPEOF = require('../src')

//==============================================================================

assert.doesNotThrow(
  function() {TYPEOF({a:'s'})({ a:String })},
  'Should not throw when duck type matches.'
)

//==============================================================================

assert.throws(
  function() {TYPEOF({a:1})({ a:String })},
  'Should throw when duck type does not match.'
)

//==============================================================================

function test(obj) {
  TYPEOF
    (arguments)
    (Number, { id:Number, name:String })
}

assert.doesNotThrow(
  test.bind(null, 1, {id:1, name:'Jo'}),
  'Should not throw when provided with ducktype match.'
)

assert.throws(
  test.bind(null, '1', {id:1, name:'Jo'}),
  /String/,
  'Should throw when parameter other than ducktype is wrong.'
)

assert.throws(
  test.bind(null, '1', 1),
  /String/,
  'Should throw when non-object passed in ducktyped arg\'s position.'
)

assert.throws(
  test.bind(null, 1, {id:false, name:'Jo'}),
  /{ id:Boolean, name:String }/,
  'Should throw when ducktype does not match passed object.'
)

process.stdout.write('  ✔ Duck-type requirement tests passed.\n')
