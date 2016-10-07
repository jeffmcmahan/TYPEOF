'use strict'

const assert = require('assert')
const TYPEOF = require('../')

//==============================================================================

assert.doesNotThrow(
  function () {TYPEOF(NaN)(NaN)},
  'Should not throw when NaN is passed and required.'
)

//==============================================================================

assert.throws(
  function () {TYPEOF(5)(NaN)},
  'Should throw when 5 is passed and NaN is required.'
)

//==============================================================================

void function () {

  function test(amount) {
    TYPEOF
      (arguments)
      (Number)
  }

  assert.throws(
    test.bind(null, NaN),
    'Should throw when Number is required and NaN is passed.'
  )

}()

//==============================================================================

void function () {

  function test(amount) {
    TYPEOF
      (arguments)
      (NaN)
  }

  assert.doesNotThrow(
    test.bind(null, NaN),
    'Should not throw when NaN is required and NaN is passed.'
  )

}()

process.stdout.write('  ✔ NaN behavior tests passed.\n')
