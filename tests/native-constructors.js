'use strict'

const assert = require('assert')
const TYPEOF = require('../src')

//==============================================================================

function test(name, age, isTall, pets, props) {
  TYPEOF
    (arguments)
    (String, Number, Boolean, Array, Object)
}

assert.doesNotThrow(
  test.bind(null, 'name', 10, false, [], {}),
  'Should not throw when types match.'
)

assert.throws(
  test.bind(null, false, 10, false, [], {}),
  /Boolean, Number, Boolean, Array, Object/,
  'Should throw when the first param is the wrong type.'
)

assert.throws(
  test.bind(null, 'name', false, false, [], {}),
  /String, Boolean, Boolean, Array, Object/,
  'Should throw when the second param is the wrong type.'
)

assert.throws(
  test.bind(null, 'name', 10, null, [], {}),
  /String, Number, null, Array, Object/,
  'Should throw when the third param is the wrong type.'
)

assert.throws(
  test.bind(null, 'name', 10, false, false, {}),
  /String, Number, Boolean, Boolean, Object/,
  'Should throw when the fourth param is the wrong type.'
)

assert.throws(
  test.bind(null, 'name', 10, false, [], false),
  /String, Number, Boolean, Array, Boolean/,
  'Should throw when fifth param is the wrong type.'
)

assert.throws(
  test.bind(null, 'name', 10, false, [], {}, 'EXTRA PARAM'),
  /String, Number, Boolean, Array, Object, String/,
  'Should throw when extra param passed'
)

process.stdout.write('  ✔ Native constructor tests passed.\n')
