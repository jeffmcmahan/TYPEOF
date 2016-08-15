'use strict'

const getSpecificType = require('./getSpecificType')

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
    message += getSpecificType(required[i], true)
    if (i < required.length - 1) message += ', '
  }
  message += '\n  PASSED:     '
  if (!passed.length) message += 'void'
  for (let i = 0; i < passed.length; i++) {
    message += getSpecificType(passed[i])
    if (i < passed.length - 1) message += ', '
  }
  return message + '\n'
}
