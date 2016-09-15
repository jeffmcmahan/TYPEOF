'use strict'

const assert = require('assert')
const errMsg = require('../src/error-message')

//==============================================================================

assert(
  errMsg(1, [Number], []).indexOf('Required:') !== -1,
  'Should label "Required" types.'
)

assert(
  errMsg(1, [Number], []).indexOf('Provided:') !== -1,
  'Should label "Provided" types.'
)

//==============================================================================

assert(
  errMsg(1, [String], [{n:0, v:1}]).indexOf('^^^^^^') !== -1,
  'Type mismatch for Number should contain 6 diff indicators ("^^^^^^").'
)

assert(
  errMsg(1, [Number], []).indexOf('^') === -1,
  'Type match should not contain diff indicators ("^^^^").'
)

//==============================================================================

assert(
  errMsg(1, [String], [{n:0, v:1}]).indexOf('1') !== -1,
  'Should print the value ("1") that was mismatched.'
)

assert(
  errMsg([], [String], [{n:0, v:[]}]).indexOf('[]') !== -1,
  'Should print the value ("[]") that was mismatched.'
)

assert(
  errMsg(false, [String], [{n:0, v:false}]).indexOf('false') !== -1,
  'Should print the value ("false") that was mismatched.'
)

assert(
  errMsg({}, [String], [{n:0, v:{}}]).indexOf('{}') !== -1,
  'Should print the value ("{}") that was mismatched.'
)

const obj = {id:1, name:'Steve'}

assert(
  errMsg(obj, [String], [{n:0, v:obj}]).indexOf('{id:1...') !== -1,
  'Should print part of the value ("{id:1...") that was mismatched.'
)

//==============================================================================

assert(
  errMsg(1, [String], [{n:0, v:1}]).indexOf('Required:  String') !== -1,
  'Required type should be "String".'
)

assert(
  errMsg(1, [String], [{n:0, v:1}]).indexOf('Provided:  Number') !== -1,
  'Provided type should be "Number".'
)

assert(
  errMsg('1', [String], [{n:0, v:1}]).indexOf('Provided:  String') !== -1,
  'Provided type should be "String".'
)

assert(
  errMsg(false, [String], [{n:0, v:1}]).indexOf('Provided:  Boolean') !== -1,
  'Provided type should be "Boolean".'
)

//==============================================================================

assert(
  errMsg({}, [String], [{n:0, v:1}]).indexOf('Provided:  Object') !== -1,
  'Provided type should be "Object".'
)

assert(
  errMsg([], [String], [{n:0, v:1}]).indexOf('Provided:  Array') !== -1,
  'Provided type should be "Array".'
)

const inst = new (class NewClass {})()

assert(
  errMsg(inst, [String], [{n:0, v:1}]).indexOf('Provided:  NewClass') !== -1,
  'Provided type should be "NewClass".'
)

assert(
  errMsg({}, [{ id:Number, name:String }], [{n:0, v:1}])
    .indexOf('Required:  { id:Number, name:String }') !== -1,
  'Required type should be "{ id:Number, name:String }".'
)

//==============================================================================

const circ = {}
circ.p = circ

assert.doesNotThrow(
  function () {errMsg(circ, Number, [{n:0, v:circ}])},
  'Should handle circular values.'
)
