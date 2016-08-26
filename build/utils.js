'use strict'

var is = require('./is')

/**
 * Prints a stylized, one-line JSON string.
 * @function
 * @param {Object} obj
 * @return {String}
 */
function prettyJSON(obj) {
  if (is.nan(obj)) return 'NaN'
  if (is.undefined(obj)) return 'undefined'
  return (
    JSON.stringify(obj)
      .replace(/"/g, '')
      .replace(/,/g, ', ')
      .replace(/{/g, '{ ')
      .replace(/}/g, ' }')
      .replace(/\{\s+\}/g, '{}')
      .replace(/\n/g, ' ')
      .slice(0, 75)
  )
}

/**
 * Prints a stylized, one-line JSON string that saves some space.
 * @function
 * @param {Object} obj
 * @return {String}
 */
prettyJSON.tight = function (obj) {
  if (is.nan(obj)) return 'NaN'
  if (is.undefined(obj)) return 'undefined'
  return (
    JSON.stringify(obj)
      .replace(/"/g, '')
      .replace(/,/g, ',')
      .replace(/\n/g, '')
      .slice(0, 75)
  )
}

exports.prettyJSON = prettyJSON

/**
 * Generates a string with the given number of the given character.
 * @function
 * @param {Number} count
 * @param {String} char
 * @return {String}
 */
exports.chars = function (count, char) {
  var str = ''
  for (var i = 0; i < count; i++) {
    str += char || ' '
  }
  return str
}

/**
 * Returns the length of the longest element passed.
 * @function
 * @param {String|Array|{length:Number}}
 * @return {Number}
 * @note Iterates arguments object; pass indefinitely many.
 */
exports.getLongest = function () {
  var arguments$1 = arguments;

  var longest = 0
  for (var i = 0; i < arguments.length; i++) {
    if (!is.array(arguments$1[i]) && !is.string(arguments$1[i])) continue
    if (arguments$1[i].length > longest) longest = arguments$1[i].length
  }
  return longest
}

/**
 * Lops off a trailing comma.
 * @function
 * @param {String} str
 * @return {String}
 */
exports.trimComma = function (str) {
  return str.replace(/,\s*$/, '')
}

/**
 * Adds a delimiter string to the end of each string in a string array.
 * @function
 * @param {String} str
 * @return {String}
 */
exports.addDelimiter = function (arr, delimiter) {
  return arr.map(function (item, index) {
    return item + delimiter
  })
}
