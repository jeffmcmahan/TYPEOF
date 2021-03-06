'use strict'

const assert = require('assert')
const TYPEOF = require('../src')

//==============================================================================

assert.doesNotThrow(
  _=> TYPEOF(1)([String, Number]),
  'Should not throw when passed type is within the array.'
)

//==============================================================================

assert.throws(
  _=> TYPEOF({})([String, Number]),
  'Should throw when passed type is not within the array.'
)

//==============================================================================

function test(amount) {
  TYPEOF
    (...arguments)
    ([Number, String, null])
}

assert.doesNotThrow(
  test.bind(null, 1),
  'Should not throw when passed type is within the array.'
)

assert.doesNotThrow(
  test.bind(null, '1'),
  'Should not throw when passed type is within the array.'
)

assert.doesNotThrow(
  test.bind(null, null),
  'Should not throw when passed type is within the array.'
)

assert.throws(
  test.bind(null, {}),
  'Should throw when the param type is not in the array.'
)

process.stdout.write('  ✔ Disjunctive requirement tests passed.\n')
