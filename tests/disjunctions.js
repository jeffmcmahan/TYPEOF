'use strict'

const assert = require('assert')
const TYPEOF = require('../src')

//==============================================================================

function test(amount) {
  TYPEOF
    (arguments)
    ([Number,String,null])
}

assert.doesNotThrow(
  test.bind(null, 1),
  'Should not throw is passed type is within an array.'
)

assert.doesNotThrow(
  test.bind(null, '1'),
  'Should not throw is passed type is within an array.'
)

assert.doesNotThrow(
  test.bind(null, null),
  'Should not throw is passed type is within an array.'
)

assert.throws(
  test.bind(null, {}),
  /Object/,
  'Should throw when the param type is not in the array.'
)

process.stdout.write('  ✔ Disjunctive requirement tests passed.\n')
