'use strict'

var getSpecificType = require('./getSpecificType')
var msg = require('./message')
var MUST_REQUIRE_SOMETHING = (
  'TYPEOF requires explicit type declarations. Use "void" to indicate '+
  'that no arguments may be passed.'
)

/**
 * Produces a cleaner stack (to avoid referencing TYPEOF's own functions).
 * @function
 * @param {String} msg
 * @return {undefined}
 */
function throwErr(msg) {
  var err = new TypeError(msg)
  err.stack = (
    err.stack
      .split('\n')
      .filter(function (line) { return line.indexOf('check.js') === -1; })
      .join('\n')
  )
  throw err
}

/**
 * Checks a passed value against required type match.
 * @function
 * @param {*} required - native JS arguments object
 * @param {*} passed - native JS arguments object
 * @return {Boolean}
 */
function checkNonDisjoint(required, passed) {
  if (required === '*') return true
  var reqType = getSpecificType(required, true)
  var valType = getSpecificType(passed)
  return reqType === valType
}

/**
 * Checks a shallow array for disjunctive type match with passed value.
 * @function
 * @param {*} required - native JS arguments object
 * @param {*} passed - native JS arguments object
 * @return {Boolean}
 */
function checkDisjoint(required, passed) {
  var reqTypes = required.map(getSpecificType, true)
  var valType = getSpecificType(passed)
  if (reqTypes.indexOf(valType) !== -1) return true
  return false
}

function duckType(required, passed, argNum) {
  var props = Object.keys(required)
  var reqArr = props.map(function (key) { return required[key]; })
  var argArr = props.map(function (key) { return passed[key]; })
  var context = {
    required: required,
    passed: passed,
    argNum: argNum
  }
  check(argArr).apply(context, reqArr)
}

/**
 * Ensures that the passed arguments match the requirements in arity,
 * type, and order.
 * @function
 * @this native JS arguments object
 * @return {undefined}
 */
function check(passed) {
  function checker() {
    var this$1 = this;

    if (!arguments.length) throw new Error(MUST_REQUIRE_SOMETHING)
    var required = (arguments[0] === 'void') ? [] : arguments

    // Check arity
    if (passed.length !== required.length) throwErr(msg(required, passed))

    // Check types
    for (var i = 0; i < passed.length; i++) {
      if (typeof required[i] === 'object' && required[i].constructor === Object) {
        duckType(required[i], passed[i], i)
      }
      if (Array.isArray(required[i])) {
        if (!checkDisjoint(required[i], passed[i])) {
          throwErr(msg(required, passed, this$1))
        }
      } else {
        if (!checkNonDisjoint(required[i], passed[i])) {
          throwErr(msg(required, passed, this$1))
        }
      }
    }
  }
  return checker
}

module.exports = check
