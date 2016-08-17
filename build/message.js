'use strict'

var getSpecificType = require('./getSpecificType')
var is = require('./is')

function prettyJSON(obj) {
  return (
    JSON.stringify(obj)
      .replace(/"/g, '')
      .replace(/,/g, ', ')
      .replace(/{/g, '{ ')
      .replace(/}/g, ' }')
  )
}

/**
 * Generates a string representing the ducktype which was required and the
 * types of those keys on the object that was passed.
 * @function
 * @param {Object} reqObj
 * @param {Object} passedObj
 * @return {String}
 */
function printDuckType(reqObj, passedObj, argNum) {
  var req = {}
  Object.keys(reqObj).forEach(function (key) {
    req[key] = getSpecificType(reqObj[key], true)
  })
  var pass
  if (is.object(passedObj)) {
    pass = {}
    Object.keys(reqObj).forEach(function (key) {
      pass[key] = getSpecificType(passedObj[key])
    })
  } else {
    pass = passedObj
  }
  return (("\n\n  Failed duck-type check on argument " + (argNum+1) + ":\n\n  REQUIRED:  " + (prettyJSON(req)) + "\n  PASSED:    " + (prettyJSON(pass)) + "\n"))
}

/**
 * Generates a string representing what was required and what was passed as
 * a list of arguments.
 * @function
 * @param {Object} required - native JS arguments object or an array
 * @param {Object} passed - native JS arguments object or an array
 * @return {String}
 */
function printList(required, passed) {
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


module.exports = function(required, passed, context) {
  if (context instanceof Object) {
    return printDuckType(context.required, context.passed, context.argNum)
  } else {
    return printList(required, passed)
  }
}
