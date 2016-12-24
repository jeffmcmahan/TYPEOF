'use strict'

const assert = require('assert')
const TYPEOF = require('../src')

//==============================================================================

void function () {

  function test() {
    TYPEOF
      (...arguments)
      (Number)
  }

  assert.doesNotThrow(
    test.bind(null, 1),
    'Should not throw when type is Number and a single number is passed.'
  )

  assert.throws(
    test.bind(null, 1, 2),
    'Too many arguments.'
  )

}()

//==============================================================================

void function () {

  function test() {
    TYPEOF
      (...arguments)
      (Number, Number)
  }

  assert.doesNotThrow(
    test.bind(null, 1, 2),
    'Should not throw when two Numbers are required and two are passed.'
  )

  assert.throws(
    test.bind(null, 1),
    'Too few arguments.'
  )

}()

process.stdout.write('  ✔ Arity tests passed.\n')
