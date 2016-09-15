'use strict'

const assert = require('assert')
const TYPEOF = require('../src')

//==============================================================================

assert.throws(
  function () {TYPEOF()('void')},
  /The "void" type is only available/,
  'Should throw when nothing passed and void required.'
)

//==============================================================================

void function () {

  function test() {
    TYPEOF
      (arguments)
      ('void')
  }

  assert.doesNotThrow(
    test,
    'Should throw if "void" is required and no argument is passed.'
  )

}()

//==============================================================================

void function () {

  function test() {
    TYPEOF
      (arguments)
      ('void')
  }

  assert.throws(
    test.bind(null, 'ILLICIT PARAMETER'),
    /String/,
    'Should throw if "void" is required and an argument is passed.'
  )

}()

process.stdout.write('  ✔ Tests for behavior of "void" passed.\n')
