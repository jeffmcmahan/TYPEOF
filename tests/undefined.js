'use strict'

const assert = require('assert')
const TYPEOF = require('../src')

//==============================================================================

void function () {

  function test() {
    TYPEOF
      (arguments)
      (String)
  }

  assert.throws(
    test.bind(null, undefined),
    /String/,
    'Should throw when undefined is passed.'
  )

}()

//==============================================================================

void function () {

  function test() {
    TYPEOF
      (arguments)
      (undefined)
  }

  assert.throws(
    test.bind(null, undefined),
    /TYPEOF doesn't allow/,
    'Should throw when undefined is required.'
  )

}()

process.stdout.write('  ✔ Tests for undefined values passed.\n')
