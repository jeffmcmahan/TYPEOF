'use strict'

const printSpecificType = require('./print-specific-type')
const utils = require('./utils')
const is = require('./is')

/**
 * Produces a JSON representation of duck-type requirement.
 * @function
 * @param {Array|Object} rq
 * @return {String}
 */
function printDuckType(rq) {
  const obj = {}
  Object.keys(rq).forEach((key) => {
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
  const obj = {}
  Object.keys(rq).forEach((key) => {
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
  const rqTypes = []
  for (let i = 0; i < rq.length; i++) {
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
  const argTypes = []
  if (!args.length) argTypes.push('void')
  for (let i = 0; i < args.length; i++) {
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
  let theDiff = []
  let count = utils.getLongest(args, rq)
  for (let i = 0; i < count; i++) {
    const rqWord = rq[i] || ''
    const argWord = args[i] || ''
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
  const colWidths = []
  for (let i = 0; i < argTypes.length; i++) {
    argTypes[i] = argTypes[i] || ''
    rqTypes[i] = rqTypes[i] || ''
    theDiff[i] = theDiff[i] || ''
    colWidths[i] = utils.getLongest(argTypes[i], rqTypes[i], theDiff[i])
  }
  return function (input) {
    for (let i = 0; i < argTypes.length; i++) {
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
  const valuesLine = []
  valuesLine.length = length
  violations.forEach((violation) => {
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
  const rqTypes = utils.addDelimiter(getRqTypes(rq), ', ')
  const argTypes = utils.addDelimiter(getArgTypes(args, rq), ', ')
  const theDiff = diff(argTypes, rqTypes)
  const theValues = badValues(violations, theDiff.length)
  const columnizer = columnize(argTypes, rqTypes, theDiff)
  return (`\n
    Required:  ${columnizer(rqTypes)}
    Provided:  ${columnizer(argTypes)}
               ${columnizer(theDiff)}
               ${columnizer(theValues)}
  `)
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
