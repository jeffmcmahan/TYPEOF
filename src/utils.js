'use strict'

const is = require('./is')

/**
 * Prints a stylized, one-line JSON string.
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
  let str = ''
  for (let i = 0; i < count; i++) {
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
  let longest = 0
  for (let i = 0; i < arguments.length; i++) {
    if (!is.array(arguments[i]) && !is.string(arguments[i])) continue
    if (arguments[i].length > longest) longest = arguments[i].length
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
  return arr.map((item, index) => {
    return item + delimiter
  })
}
