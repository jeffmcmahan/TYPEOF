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
    'Should throw when no argument is passed.'
  )

}()

//==============================================================================

void function () {

  function test() {
    TYPEOF
      (...arguments)
      ()
  }

  assert.throws(
    test.bind(null),
    'Should throw when nothing is required.'
  )

}()

//==============================================================================

assert(
  TYPEOF(1)(Number) === 1,
  'Should return the value being checked.'
)

assert(
  function test() {
    const args = TYPEOF
      (...arguments)
      (Number)
    return args === 1
  }(1),
  'Should return the first value being checked.'
)

//==============================================================================

void function () {

  function test(req, res, next) {
    TYPEOF
      (...arguments)
      ('middleware')
  }

  TYPEOF.DFN('middleware', {1: Object, 2: Object, 3: Function})
  assert.doesNotThrow(
    _=> test({}, {}, function(){}),
    'Should not throw when types match the middleware dfn.'
  )

  assert.throws(
    _=> test(),
    'Should throw when types do not match the middleware dfn.'
  )

}()


//==============================================================================

void function () {

  let failCallbackFired = false
  TYPEOF.ONFAIL(_=> failCallbackFired = true)

  function test() {
    TYPEOF
      (...arguments)
      (Number)
  }

  try {test()} catch(e) {}
  assert(failCallbackFired, 'Should have fired the ONFAIL callback.')

}()

//==============================================================================

void function () {

  function test() {
    TYPEOF
      (...arguments)
      (Number)
  }

  assert.throws(test, 'Non-silent.')
  TYPEOF.OFF()
  assert.doesNotThrow(
    test,
    'Should not throw when in silent mode, even when there is type error.'
  )

}()

process.stdout.write('  ✔ API tests passed.\n')
