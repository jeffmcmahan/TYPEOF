'use strict'

const assert = require('assert')
const TYPEOF = require('../src')

//==============================================================================

assert.doesNotThrow(
  function () {TYPEOF(undefined)(undefined)},
  'Should not throw when undefined is required and undefined is passed.'
)

//==============================================================================

void function () {

  function test() {
    TYPEOF
      (...arguments)
      (String)
  }

  assert.throws(
    test.bind(null, undefined),
    'Should throw when string is required and undefined is passed.'
  )

}()

//==============================================================================

void function () {

  function test() {
    TYPEOF
      (...arguments)
      (undefined)
  }

  assert.throws(
    test.bind(null, 'string'),
    'Should throw when undefined is required and string is passed.'
  )

  assert.doesNotThrow(
    test.bind(null, undefined),
    'Should not throw when undefined is required and passed.'
  )

}()

process.stdout.write('  ✔ Tests for undefined values passed.\n')
