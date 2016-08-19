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
    /TYPEOF requires a single array-like argument/,
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
