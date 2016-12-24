'use strict'

var typesMatch = require('./types-match')
var printValue = require('./print-value')
var off = false
var warn = false
var onFail = null

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
 * Accepts the values to be checked and returns the check function.
 * @NOTE Accepts indefinitely many arguments of any type.
 * @return {Function}
 */
function TYPEOF() {
  var args = [], len = arguments.length;
  while ( len-- ) args[ len ] = arguments[ len ];


  /**
   * The check function.
   * @NOTE Accepts indefinitely many arguments of any type.
   * @return {*} - the first value in args
   */
  return function() {
    var rqs = [], len = arguments.length;
    while ( len-- ) rqs[ len ] = arguments[ len ];

    if (off) { return args[0] }
    var errMsg = ''
    var pass = true

    // Check
    if (!rqs.length) { pass = false }
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

    // Report failure.
    if (!pass) {
      var err = new TypeError('TYPEOF\n ' + errMsg.replace(/"/g, ''))
      err.stack = cleanStack(err.stack)
      console.log(onFail)
      if (onFail) { onFail(err) }
      if (warn) { console.log(err) }
      else { throw err }
    }

    return args[0]
  }
}

TYPEOF.ONFAIL = function (callback) { return onFail = callback; }
TYPEOF.WARN = function (_){ return warn = true; }
TYPEOF.OFF = function (_){ return off = true; }
module.exports = TYPEOF
