'use strict'

const assert = require('assert')
const TYPEOF = require('../src')

//==============================================================================

void function () {

  function test() {
    TYPEOF
      ()
      ()
  }

  assert.throws(
    test.bind(null),
    /Use "void" to indicate that no values are permitted/,
    'Should throw when no argument is passed.'
  )

}()

//==============================================================================

void function () {

  function test() {
    TYPEOF
      (arguments)
      ()
  }

  assert.throws(
    test.bind(null),
    /TYPEOF requires explicit declarations/,
    'Should throw when nothing is required.'
  )

}()

//==============================================================================

assert(
  TYPEOF(1)(Number) === 1,
  'Should return the value being checked.'
)

assert(
  function test() {
    const args = TYPEOF
      (arguments)
      (Number)
    return args === arguments
  }(1),
  'Should return the value being checked (even arguments object).'
)

//==============================================================================

void function () {

  function test() {
    TYPEOF
      (arguments)
      (Number)
  }

  assert.throws(
    test,
    /void/,
    'Non-silent.'
  )

  TYPEOF.silence()

  assert.doesNotThrow(
    test.bind(null),
    'Should not throw when in silent mode, even when there is type error.'
  )

}()


process.stdout.write('  ✔ API tests passed.\n')
