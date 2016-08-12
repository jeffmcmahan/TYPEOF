'use strict'

const assert = require('assert')
const TYPEOF = require('../src')

class NewClass {}

//==============================================================================

void function () {

  function test() {
    TYPEOF
      (arguments)
      (NewClass) // By reference
  }

  assert.doesNotThrow(
    test.bind(null, new NewClass()),
    'Should not throw when required NewClass instance is passed.'
  )

  assert.throws(
    test.bind(null, new Object()),
    /NewClass/,
    'Should throw when an incorrect class is passed.'
  )

}()

//==============================================================================

void function () {

  function test() {
    TYPEOF
      (arguments)
      ('NewClass') // By name
  }

  assert.doesNotThrow(
    test.bind(null, new NewClass()),
    'Should not throw when NewClass is identified with by name ("NewClass").'
  )

  assert.throws(
    test.bind(null, new Object()),
    /NewClass/,
    'Should throw when "NewClass" is required by name, but an Object is passed.'
  )

}()

process.stdout.write('  ✔ Custom constructor tests passed.\n')
