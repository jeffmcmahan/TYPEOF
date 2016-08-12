'use strict'

const assert = require('assert')
const TYPEOF = require('../src')

//==============================================================================

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

process.stdout.write('  ✔ API tests passed.\n')
