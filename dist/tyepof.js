'use strict'

var silent = false

/**
 * Prints stylized type names for values (or arrays of values) passed.
 * @function
 * @param {*} val
 * @return {String}
 */
function printType(val, allowArray) {
  if (allowArray && Array.isArray(val)) {
    return val.map(function (inVal) { return printType(inVal, true); }).join('|')
  }
  if (val === null) return 'null'
  if (typeof val === 'undefined') return 'undefined'
  return val.name || val.constructor.name
}

/**
 * Generates a string representing what was required and what was passed.
 * @function
 * @param {Object} required - native JS arguments object
 * @param {Object} passed - native JS arguments object
 * @return {String}
 */
function msg(required, passed) {
  var message = '\n\n  REQUIRED:   '
  if (!required.length) message += 'void'
  for (var i = 0; i < required.length; i++) {
    message += printType(required[i], true)
    if (i < required.length - 1) message += ', '
  }
  message += '\n  PASSED:     '
  if (!passed.length) message += 'void'
  for (var i$1 = 0; i$1 < passed.length; i$1++) {
    message += printType(passed[i$1])
    if (i$1 < passed.length - 1) message += ', '
  }
  return message + '\n'
}

/**
 * Ensures that the passed arguments match the requirements in arity and type.
 * @function
 * @this native JS arguments object
 * @return {undefined}
 */
function TYPEOF() {
  var this$1 = this;

  var required = arguments
  var passed = this
  if (passed.length < required.length) throw new TypeError(msg(required, passed))
  if (passed.length > required.length) throw new TypeError(msg(required, passed))
  for (var i = 0; i < passed.length; i++) {

    // Null reqired, null passed.
    if (!Array.isArray(required[i]) && passed[i] === required[i] === null) {
      return
    }

    // Null passed but not required.
    if (!Array.isArray(required[i]) && passed[i] === null) {
      throw new TypeError(msg(required, passed))
    }

    // Null required but not passed.
    if (required[i] === null) {
      throw new TypeError(msg(required, passed))
    }

    // Disjunctive requirement
    if (Array.isArray(required[i])) {
      if (passed[i] === null && required[i].indexOf(null) !== -1) return
      if (required[i].indexOf(passed[i].constructor) !== -1) return
      if (required[i].indexOf(passed[i].constructor.name) !== -1) return
      throw new TypeError(msg(required, passed))
    }

    // Constructor Name (as string)
    if (typeof required[i] === 'string') {
      required[i] = {name: required[i]}
      if (passed[i].constructor.name === required[i].name) return
    }

    // Mismatched constructors
    if (this$1[i].constructor !== required[i]) {
      throw new TypeError(msg(required, passed))
    }
  }
}

function silence(){}

function API(passed){
  if (silent) return (silence)
  return (TYPEOF.bind(passed))
}

API.silence = function () {silent = true}

module.exports = API

