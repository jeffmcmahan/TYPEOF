'use strict'

var printSpecificType = require('./print-specific-type')
var is = require('./is')

/**
 *
 * @function
 * @param {Object} obj
 * @return {String}
 */
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
 *
 * @function
 * @param {Array|Object} rq
 * @return {String}
 */
function printDuckType(rq) {
  var obj = {}
  Object.keys(rq).forEach(function (key) {
    obj[key] = printSpecificType(rq[key])
  })
  return prettyJSON(obj)
}

/**
 *
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
  return prettyJSON(obj)
}

/**
 *
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
 *
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


function chars(count, char) {
  var str = ''
  for (var i = 0; i < count; i++) {
    str += char || ' '
  }
  return str
}


function isSimpleTypeRQ(rqWord) {
  if (typeof rqWord === 'undefined') return true
  return (
    rqWord !== '*' &&
    rqWord.indexOf('|') === -1
  )
}

function isDisjointRQ(rqWord) {
  return rqWord.indexOf('|') !== -1
}

function diff(args, rq) {
  var theDiff = []
  var count = getLongest(args, rq)
  for (var i = 0; i < count; i++) {
    var rqWord = rq[i] || ''
    var argWord = args[i] || ''
    if (isSimpleTypeRQ(rqWord)) {
      if (rqWord !== argWord) {
        theDiff.push(chars(argWord.length, '^'))
      } else {
        theDiff.push(chars(argWord.length, ' '))
      }
    } else if (isDisjointRQ(rqWord)) {
      if (rqWord.indexOf(argWord) !== -1) {
        theDiff.push(chars(argWord.length, ' '))
      } else {
        theDiff.push(chars(argWord.length, '^'))
      }
    } else {
      theDiff.push(chars(argWord.length, ' '))
    }
  }
  return theDiff
}


function getLongest() {
  var arguments$1 = arguments;

  var longest = 0
  for (var i = 0; i < arguments.length; i++) {
    if (!is.array(arguments$1[i]) && !is.string(arguments$1[i])) continue
    if (arguments$1[i].length > longest) longest = arguments$1[i].length
  }
  return longest
}

function addDelimiter(arr, char) {
  return arr.map(function (item, index) {
    if (index !== arr.length - 1) return item + char
    return item
  })
}

function padArrays() {
  var arguments$1 = arguments;

  var length = getLongest.apply(null, arguments)
  for (var i = 0; i < arguments.length; i++) {
    for (var j = 0; j < length; j++) {
      if (typeof arguments$1[i][j] === 'undefined') arguments$1[i][j] = ''
    }
  }
}

function normalize(argTypes, rqTypes, theDiff) {
  return function (input) {
    for (var i = 0; i < argTypes.length; i++) {
      argTypes[i] = argTypes[i] || ''
      rqTypes[i] = rqTypes[i] || ''
      theDiff[i] = theDiff[i] || ''
      var length = getLongest(argTypes[i], rqTypes[i], theDiff[i])
      if (argTypes[i].length < length) {
        argTypes[i] += chars(length - argTypes[i].length, ' ')
      }
      if (rqTypes[i].length < length) {
        rqTypes[i] += chars(length - rqTypes[i].length, ' ')
      }
      if (theDiff[i].length < length) {
        theDiff[i] += chars(length - theDiff[i].length, ' ')
      }
    }
    return input
  }
}

/**
 * Produces a nice, informative comparison/contrast of types passed and types
 * required.
 * @function
 * @param {Array|Object} args
 * @param {Array|Object} rq
 * @return {String}
 */
module.exports = function(args, rq) {
  var rqTypes = addDelimiter(getRqTypes(rq), ',')
  var argTypes = addDelimiter(getArgTypes(args, rq), ',')
  var theDiff = diff(argTypes, rqTypes)
  var normalizer = normalize(argTypes, rqTypes, theDiff)
  return (
    '\n' +
    '  Required:  ' + normalizer(rqTypes).join(' ') + '\n'+
    '  Provided:  ' + normalizer(argTypes).join(' ') + '\n'+
    '             ' + normalizer(theDiff).join(' ')
  )
}
