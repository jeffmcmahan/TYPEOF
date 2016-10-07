'use strict'

const assert = require('assert')
const TYPEOF = require('../')

//==============================================================================

assert.doesNotThrow(
  function () {TYPEOF({})(Object)},
  'Should not throw when single matching arg is passed.'
)

//==============================================================================

assert.throws(
  function () {TYPEOF({})(Array)},
  'Should throw when single non-matching arg is passed.'
)

//==============================================================================

function test(name, age, isTall, pets, props) {
  TYPEOF
    (arguments)
    (String, Number, Boolean, Array, Object)
}

test.bind(null, 'name', 10, false, [], {})()

assert.doesNotThrow(
  test.bind(null, 'name', 10, false, [], {}),
  'Should not throw when types match.'
)

assert.throws(
  test.bind(null, false, 10, false, [], {}),
  'Should throw when the first param is the wrong type.'
)

assert.throws(
  test.bind(null, 'name', false, false, [], {}),
  'Should throw when the second param is the wrong type.'
)

assert.throws(
  test.bind(null, 'name', 10, null, [], {}),
  'Should throw when the third param is the wrong type.'
)

assert.throws(
  test.bind(null, 'name', 10, false, false, {}),
  'Should throw when the fourth param is the wrong type.'
)

assert.throws(
  test.bind(null, 'name', 10, false, [], false),
  'Should throw when fifth param is the wrong type.'
)

assert.throws(
  test.bind(null, 'name', 10, false, [], {}, 'EXTRA PARAM'),
  'Should throw when extra param passed'
)

process.stdout.write('  ✔ Native constructor tests passed.\n')
