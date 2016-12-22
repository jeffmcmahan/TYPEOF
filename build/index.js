'use strict'

var typesMatch = require('./types-match')
var printValue = require('./print-value')
var silent = false
var warn = false

/**
 * Alters a value to make it more suitable for printing to the console.
 * @param {*} rq
 * @return {*}
 */
function transformForConsole(rq) {
  if (typeof rq === 'function') { return rq.name }
  if (typeof rq === 'object' && rq.constructor === Object) {
    Object.keys(rq).forEach(function (key) { return rq[key] = transformForConsole(rq[key]); })
  }
  return rq
}

/**
 * Removes the first line of the stack, since it will point to the TYPEOF
 * function call rather than the type error itself.
 * @param {*} stack
 * @return {*} - if stack is not a string, it is returned unchanged
 */
function cleanStack(stack) {
  if (typeof stack !== 'string') { return stack }
  var lines = stack.split('\n')
  var cleaned = false
  return lines.filter(function (ln) {
    if (ln.indexOf('.js') !== -1 && !cleaned) {
      cleaned = true
      return false
    }
    return true
  }).join('\n')
}

/**
 * Determines whether the given value is a native javascript Arguments object.
 * @param {*} args
 * @return {Boolean}
 */
function isArgumentsObject(args) {
  return Object.prototype.toString.call(args).indexOf('Arguments') > -1
}

/**
 * Top-level API.
 * @param {*} args
 * @return {Function}
 */
function TYPEOF(args) {
  var passed = args

  return function() {
    var rqs = [], len = arguments.length;
    while ( len-- ) rqs[ len ] = arguments[ len ];

    if (silent) { return }
    var errMsg = ''
    var pass = true
    if (!rqs.length) { pass = false }
    if (!isArgumentsObject(args)) { args = [args] }
    if (rqs[0] === 'void' && rqs.length === 1 && args.length === 0) { return }
    if (rqs.length !== args.length) { pass = false }
    rqs.forEach(function (rq, i) {
      if (!typesMatch(rq, args[i])) {
        pass = false
        var isVoid = args.length < i + 1
        errMsg += '\n    Value (' + (i + 1) + '):\n'
        errMsg += '     Required: ' + printValue.rq(rq, true) + '\n'
        errMsg += '     Provided: ' + (isVoid ? 'void': printValue.arg(args[i])) + '\n'
      }
    })
    if (!pass) {
      var err = new TypeError('TYPEOF\n ' + errMsg.replace(/"/g, ''))
      err.stack = cleanStack(err.stack)
      if (!warn) { throw err }
      else { console.log(err) }
    }
    return passed
  }
}

TYPEOF.match = typesMatch
TYPEOF.warn = function () {warn = true}
TYPEOF.silence = function () {silent = true}

module.exports = TYPEOF
