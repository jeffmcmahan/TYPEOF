'use strict'

const getSpecificType = require('./getSpecificType')
const is = require('./is')

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
  const req = {}
  Object.keys(reqObj).forEach((key) => {
    req[key] = getSpecificType(reqObj[key], true)
  })
  let pass
  if (is.object(passedObj)) {
    pass = {}
    Object.keys(reqObj).forEach((key) => {
      pass[key] = getSpecificType(passedObj[key])
    })
  } else {
    pass = passedObj
  }
  return (`

  Failed duck-type check on argument ${argNum+1}:

  REQUIRED:  ${prettyJSON(req)}
  PASSED:    ${prettyJSON(pass)}
`)
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


module.exports = function(required, passed, context) {
  if (context instanceof Object) {
    return printDuckType(context.required, context.passed, context.argNum)
  } else {
    return printList(required, passed)
  }
}
