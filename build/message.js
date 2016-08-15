'use strict'

var getSpecificType = require('./getSpecificType')

/**
 * Generates a string representing what was required and what was passed.
 * @function
 * @param {Object} required - native JS arguments object
 * @param {Object} passed - native JS arguments object
 * @return {String}
 */
module.exports = function(required, passed) {
  var message = '\n\n  REQUIRED:   '
  if (!required.length) message += 'void'
  for (var i = 0; i < required.length; i++) {
    message += getSpecificType(required[i], true)
    if (i < required.length - 1) message += ', '
  }
  message += '\n  PASSED:     '
  if (!passed.length) message += 'void'
  for (var i$1 = 0; i$1 < passed.length; i$1++) {
    message += getSpecificType(passed[i$1])
    if (i$1 < passed.length - 1) message += ', '
  }
  return message + '\n'
}
