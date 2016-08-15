'use strict'

const assert = require('assert')
const TYPEOF = require('../src')

//==============================================================================

void function () {

  function test(amount) {
    TYPEOF
      (arguments)
      (Number)
  }

  assert.throws(
    test.bind(null, NaN),
    /NaN/,
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
