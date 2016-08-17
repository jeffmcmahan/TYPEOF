'use strict'

var check = require('./check')
var doNothing = function (){}
var silent = false

/**
 * Returns either a bound TYPEOF function or a do-nothing function, depending
 * one whether type checking has been silenced or not.
 * @function
 * @param {Object} passed - native js arguments (array-like) object
 * @return {Function}
 */
function API(passed) {
  return (silent ? doNothing : check(passed))
}

/**
 * Turns off type checking.
 * @method
 * @return {undefined}
 */
API.silence = function () {silent = true}

/**
 * Turns off type checking if the condition is truthy.
 * @method
 * @param {Boolean} condition
 * @return {Boolean} - returns the condition's value
 */
API.silenceIf = function (condition) {
  if (condition) silent = true
  return condition
}

module.exports = API
