'use strict'

var typesMatch = require('./types-match')
var printValue = require('./print-value')

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
 * Zaps first line of the stack, as it points to TYPEOF, not the error line.
 * @param {*} stack
 * @return {String|Object} - if stack is not a string, it is returned unchanged
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

function TYPEOF() {
  var args = [], len = arguments.length;
  while ( len-- ) args[ len ] = arguments[ len ];

  return function() {
    var rqs = [], len = arguments.length;
    while ( len-- ) rqs[ len ] = arguments[ len ];

    if (off) { return args[0] }
    var errMsg = ''
    var pass = true

    // Must require something.
    if (!rqs.length) { pass = false }
    if (rqs[0] === 'void' && !args.length) { return }

    // Defined types.
    rqs = rqs.map(function (rq) { return typeof rq === 'string' && dfns[rq] ? dfns[rq] : rq; })
    
    // Check values.
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
      if (onFail) { onFail(err) }
      if (warn) { console.log(err) }
      else { throw err }
    }
    return args[0]
  }
}

// API functions
var onFail = null
TYPEOF.ONFAIL = function (callback) { return onFail = callback; }

var warn = false
TYPEOF.WARN = function (_){ return warn = true; }

var off = false
TYPEOF.OFF = function (_){ return off = true; }

var dfns = {}
TYPEOF.DFN = function (name, desc, invoke) {
  if ( invoke === void 0 ) invoke = false;

  if (invoke) { desc.INVOKE = true }
  dfns[("" + name)] = desc
}

module.exports = TYPEOF
