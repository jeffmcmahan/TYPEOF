'use strict'

var printSpecificType = require('./print-specific-type')
var utils = require('./utils')
var is = require('./is')
var IDENT = '@@@@@@@@@@@'

/**
 * Produces a JSON representation of duck-type requirement.
 * @function
 * @param {Array|Object} rq
 * @return {String}
 */
function printDuckType(rq) {
  var obj = {}
  Object.keys(rq).forEach(function (key) {
    obj[key] = printSpecificType(rq[key])
  })
  return utils.prettyJSON(obj)
}

/**
 * Produces a JSON representation of duck-typed argument (omits properties not
 * included in the duck-type).
 * @function
 * @param {Array|Object} args
 * @param {Array|Object} rq
 * @return {String}
 */
function printDuckTypedArg(arg, rq) {
  var obj = {}
  Object.keys(rq).forEach(function (key) {
    obj[key] = printSpecificType(arg[key])
  })
  return utils.prettyJSON(obj)
}

/**
 * Produces an array containing a string describing each required type.
 * @function
 * @param {Array|Object} rq
 * @return {Array}
 */
function getRqTypes(rq) {
  var rqTypes = []
  for (var i = 0; i < rq.length; i++) {
    if (rq[i] === 'void') {
      rqTypes.push('void'); break
    }
    if (rq[i] === '*') {
      rqTypes.push('*'); continue
    }
    // disjoint types
    if (is.disjoint(rq[i])) {
      rqTypes.push(getRqTypes(rq[i]).join('|')); continue
    }
    // duck-types
    if (is.duckType(rq[i])) {
      rqTypes.push(printDuckType(rq[i])); continue
    }
    // custom type as string
    if (typeof rq[i] === 'string') {
      rqTypes.push(rq[i]); continue
    }
    rqTypes.push(printSpecificType(rq[i]))
  }
  return rqTypes
}

/**
 * Produces and array of strings describing the type of each argument.
 * @function
 * @param {Array|Object} args
 * @param {Array|Object} rq
 * @return {Array}
 */
function getArgTypes(args, rq) {
  var argTypes = []
  if (!args.length) argTypes.push('void')
  for (var i = 0; i < args.length; i++) {
    if (is.duckType(rq[i])) {
      argTypes.push(printDuckTypedArg(args[i], rq[i])); continue
    }
    argTypes.push(printSpecificType(args[i]))
  }
  return argTypes
}

/**
 * Determines whether a given requirement string describes a disjoint rq.
 * @function
 * @param {Stirng} rqWord
 * @return {Boolean}
 */
function isDisjointRQ(rqWord) {
  return rqWord.indexOf('|') !== -1
}

/**
 * Returns false if the requirement is disjoint or kleene star.
 * @function
 * @param {Stirng} rqWord
 * @return {Boolean}
 * @todo Rename this; it's not quite right.
 */
function isSimpleTypeRQ(rqWord) {
  if (typeof rqWord === 'undefined') return true
  return (rqWord !== '*' && !isDisjointRQ(rqWord))
}

/**
 * Finds each point of character-to-character difference between arg and rq
 * strings; inserts carets to indicate divergences.
 * @function
 * @param {Array} args
 * @param {Array} rq
 * @return {Array}
 */
function diff(args, rq) {
  var theDiff = []
  var count = utils.getLongest(args, rq)
  for (var i = 0; i < count; i++) {
    var rqWord = rq[i] || ''
    var argWord = args[i] || ''
    if (isSimpleTypeRQ(rqWord)) {
      if (rqWord !== argWord) {
        theDiff.push(utils.chars(argWord.length - 2, '^') + utils.chars(2))
      } else {
        theDiff.push(utils.chars(argWord.length, ' '))
      }
    } else if (isDisjointRQ(rqWord)) {
      if (rqWord.indexOf(argWord) !== -1) {
        theDiff.push(utils.chars(argWord.length, ' '))
      } else {
        theDiff.push(utils.chars(argWord.length, '^'))
      }
    } else {
      theDiff.push(utils.chars(argWord.length, ' '))
    }
  }
  return theDiff
}

/**
 * Renders arrays of strings in soft-tab-delimited columns.
 * @function
 * @param {Array} argTypes
 * @param {Array} rqTypes
 * @param {Array} theDiff
 * @return {String}
 */
function columnize(argTypes, rqTypes, theDiff) {
  var colWidths = []
  for (var i = 0; i < argTypes.length; i++) {
    argTypes[i] = argTypes[i] || ''
    rqTypes[i] = rqTypes[i] || ''
    theDiff[i] = theDiff[i] || ''
    colWidths[i] = utils.getLongest(argTypes[i], rqTypes[i], theDiff[i])
  }
  return function (input) {
    for (var i = 0; i < argTypes.length; i++) {
      input[i] = input[i] || ''
      if (input[i].length < colWidths[i]) {
        input[i] += utils.chars(colWidths[i] - input[i].length, ' ')
      }
      if (input[i].length > colWidths[i]) {
        input[i] = input[i].slice(0, colWidths[i])
      }
    }
    return utils.trimComma(input.join(' '))
  }
}

/**
 * Creates an array with bad values at the appropriate indices.
 * @function
 * @param {Array} violations
 * @param {Number} length
 * @return {Array}
 */
function badValues(violations, length) {
  var valuesLine = []
  valuesLine.length = length
  violations.forEach(function (violation) {
    if (typeof violation.v !== 'undefined') {
      valuesLine[violation.n] = utils.prettyJSON.tight(violation.v)
    } else {
      valuesLine[violation.n] = 'undefined'
    }
  })
  return valuesLine
}

/**
 * Produces a nice, informative comparison/contrast of types passed and types
 * required.
 * @function
 * @param {Array|Object} args
 * @param {Array|Object} rq
 * @return {String}
 */
function errMsg(args, rq, violations) {
  var rqTypes = utils.addDelimiter(getRqTypes(rq), ', ')
  var argTypes = utils.addDelimiter(getArgTypes(args, rq), ', ')
  var theDiff = diff(argTypes, rqTypes)
  var theValues = badValues(violations, theDiff.length)
  var columnizer = columnize(argTypes, rqTypes, theDiff)
  return (("\n\n    Required:  " + (columnizer(rqTypes)) + "\n    Provided:  " + (columnizer(argTypes)) + "\n               " + (columnizer(theDiff)) + "\n               " + (columnizer(theValues)) + "\n    " + IDENT))
}

/**
 * Removes the stack item which refers to the TYPEOF function.
 * @function
 * @param {String} stack
 * @return {String}
 */
errMsg.filterStack = function (stack) {
  stack = stack.split(IDENT)
  var top = stack[0].replace('TypeError', 'TypeError thrown by TYPEOF')
  var bottom = (
    stack[1]
      .trim().split('\n').slice(1)
      .map(function (str) { return '    ' + str.trim(); }).join('\n')
  )
  return top + '\n' + bottom
}

errMsg.NO_ARGS = (
  'TYPEOF requires a single array-like argument: \n'+
  '  TYPEOF(<array-like>)(type1, type2, ...)\n'
)

errMsg.NO_RQ = (
  'TYPEOF requires explicit declarations. Use "void" to indicate that no '+
  'values are permitted; use "*" to permit anything.'
)

module.exports = errMsg
