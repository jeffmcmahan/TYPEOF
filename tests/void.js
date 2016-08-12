'use strict'

const assert = require('assert')
const TYPEOF = require('../src')

//==============================================================================

void function () {

  function test() {
    TYPEOF
      (arguments)
      ()
  }

  assert.throws(
    test.bind(null),
    /TYPEOF requires explicit type declarations/,
    'Should throw when nothing is required.'
  )

}()

//==============================================================================

void function () {

  function test() {
    TYPEOF
      (arguments)
      ('void')
  }

  assert.doesNotThrow(
    test.bind(null),
    'Should not throw if "void" is required and no argument is passed.'
  )

}()

process.stdout.write('  ✔ Tests for behavior of "void" passed.\n')
