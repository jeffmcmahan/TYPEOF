'use strict'

/**
 * Prints stylized type names for values (or arrays of values) passed.
 * @function
 * @param {*} val
 * @return {String}
 */
function printType(val, allowArray) {
  if (allowArray && Array.isArray(val)) {
    return val.map(inVal => printType(inVal, true)).join('|')
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
module.exports = function(required, passed) {
  let message = '\n\n  REQUIRED:   '
  if (!required.length) message += 'void'
  for (let i = 0; i < required.length; i++) {
    message += printType(required[i], true)
    if (i < required.length - 1) message += ', '
  }
  message += '\n  PASSED:     '
  if (!passed.length) message += 'void'
  for (let i = 0; i < passed.length; i++) {
    message += printType(passed[i])
    if (i < passed.length - 1) message += ', '
  }
  return message + '\n'
}
