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
  TYPEOF.DFN('req', { url:String })
  TYPEOF.DFN('res', { headersSent:Boolean })

  function test(req, res, next) {

    TYPEOF
      (...arguments)
      ('req', 'res', Function)
  }

  assert.doesNotThrow(
    _=> test({url:''}, {headersSent:false}, _=>{}),
    'Should not throw when types match the middleware dfn.'
  )

  assert.throws(
    _=> test(),
    'Should throw when types do not match the middleware dfn.'
  )

}()

//==============================================================================

void function () {
  TYPEOF.DFN('bool', (val => typeof val === 'boolean'), true)

  function test() {

    TYPEOF
      (...arguments)
      ('bool')
  }

  assert.doesNotThrow(
    _=> test(false),
    'Should not throw when types match the invocable type dfn.'
  )

  assert.throws(
    _=> test(0),
    'Should throw when value doesn\'t satisfy the invocable type dfn.'
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
