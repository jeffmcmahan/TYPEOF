'use strict'

const assert = require('assert')
const TYPEOF = require('../src')

//==============================================================================
// Arity Requirements

function testA1() {
  TYPEOF
    (arguments)
    ()
  return true
}

assert(testA1())

assert.throws(
  testA1.bind(null, 1),
  /Number/,
  'Too many arguments.'
)

function testA2() {
  TYPEOF
    (arguments)
    (Number)
  return true
}

assert(testA2(1))

assert.throws(
  testA2.bind(null, 1, 2),
  /Number, Number/,
  'Too many arguments.'
)

function testA3() {
  TYPEOF
    (arguments)
    (Number, Number)
  return true
}

assert(testA3(1, 2))

assert.throws(
  testA3.bind(null, 1),
  /Number/,
  'Too few arguments.'
)

//==============================================================================
// Native JS Constructor Requirements

function testB(name, age, isTall, pets, props) {
  TYPEOF
    (arguments)
    (String, Number, Boolean, Array, Object)
  return true
}

assert(testB('name', 10, false, [], {}))

assert.throws(
  testB.bind(null, false, 10, false, [], {}),
  /Boolean, Number, Boolean, Array, Object/,
  'First param wrong type.'
)

assert.throws(
  testB.bind(null, 'name', false, false, [], {}),
  /String, Boolean, Boolean, Array, Object/,
  'Second param wrong type.'
)

assert.throws(
  testB.bind(null, 'name', 10, null, [], {}),
  /String, Number, null, Array, Object/,
  'Third param wrong type.'
)

assert.throws(
  testB.bind(null, 'name', 10, false, false, {}),
  /String, Number, Boolean, Boolean, Object/,
  'Fourth param wrong type.'
)

assert.throws(
  testB.bind(null, 'name', 10, false, [], false),
  /String, Number, Boolean, Array, Boolean/,
  'Fifth param wrong type.'
)

assert.throws(
  testB.bind(null, 'name', 10, false, [], {}, 'EXTRA PARAM'),
  /String, Number, Boolean, Array, Object, String/,
  'Extra param passed'
)

//==============================================================================
// Disjoint Requirements

function testD(amount) {
  TYPEOF
    (arguments)
    ([Number,String,null])
  return true
}

assert(testD(1))
assert(testD('1'))
assert(testD(null))

assert.throws(
  testD.bind(null, []),
  /Array/,
  'Param type not in disjunction'
)

//==============================================================================
// User Defined Class Requirements

class NewClass {}

function testE1() {
  TYPEOF
    (arguments)
    (NewClass)
  return true
}

assert(testE1(new NewClass()))

assert.throws(
  testE1.bind(null, new Object()),
  /NewClass/,
  'Incorrect class'
)

function OtherClass() {}

function testE2() {
  TYPEOF
    (arguments)
    (OtherClass)
  return true
}

assert(testE2(new OtherClass()))

assert.throws(
  testE2.bind(null, new Object()),
  /OtherClass/,
  'Incorrect class'
)

function testE3() {
  TYPEOF
    (arguments)
    ('OtherClass')
  return true
}

assert(testE3(new OtherClass()))

assert.throws(
  testE2.bind(null, new Object()),
  /OtherClass/,
  'Incorrect class'
)

//==============================================================================
// Silence

function testF() {
  TYPEOF
    (arguments)
    (Number)
  return true
}

assert.throws(
  testF,
  /void/,
  'Non-silent.'
)

TYPEOF.silence()

assert(testF())

process.stdout.write('  ✔ All unit tests passed.\n\n')
