'use strict'

const assert = require('assert')
const TYPEOF = require('../src')

//==============================================================================

function test(amount) {
  TYPEOF
    (arguments)
    ('*')
}

assert.throws(
  test.bind(null),
  /\*/,
  'Should throw when "*" is required but nothing is passed.'
)

assert.doesNotThrow(
  test.bind(null, undefined),
  'Should not throw when "*" is required and undefined is passed.'
)

assert.doesNotThrow(
  test.bind(null, null),
  'Should not throw when "*" is required and null is passed.'
)

assert.doesNotThrow(
  test.bind(null, 1),
  'Should not throw when "*" is required and a number is passed.'
)

assert.doesNotThrow(
  test.bind(null, 'string'),
  'Should not throw when "*" is required and a string is passed.'
)

assert.doesNotThrow(
  test.bind(null, NaN),
  'Should not throw when "*" is required and NaN is passed.'
)

assert.doesNotThrow(
  test.bind(null, Function),
  'Should not throw when "*" is required and a function is passed.'
)

assert.doesNotThrow(
  test.bind(null, {}),
  'Should not throw when "*" is required and an object is passed.'
)

assert.doesNotThrow(
  test.bind(null, []),
  'Should not throw when "*" is required and an array is passed.'
)

process.stdout.write('  ✔ Kleene star behavior tests passed.\n')
