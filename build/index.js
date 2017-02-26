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
    var rqs = [], len$1 = arguments.length;
    while ( len$1-- ) rqs[ len$1 ] = arguments[ len$1 ];

    if (off) { return args[0] }
    var errMsg = ''
    var pass = true

    // Must require something.
    if (!rqs.length) { pass = false }
    if (rqs[0] === 'void' && !args.length) { return }

    // Defined types.
    rqs = rqs.map(function (rq) { return typeof rq === 'string' && dfns[rq] ? dfns[rq] : rq; })

    // Check arity.
    if (rqs.length !== args.length) { pass = false }

    // Check values.
    var len = rqs.length >= args.length ? rqs.length : args.length
    for (var i = 0; i < len; i++) {
      if (!typesMatch(rqs[i], args[i])) {
        pass = false
        var rqIsVoid = rqs.length < i + 1
        var argIsVoid = args.length < i + 1
        errMsg += '\n    Value (' + (i + 1) + '):\n'
        errMsg += '     Required: ' + (rqIsVoid ? 'void (implicit)' : printValue.rq(rqs[i])) + '\n'
        errMsg += '     Provided: ' + (argIsVoid ? 'void': printValue.arg(args[i])) + '\n'
      }
    }

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

// Define 'any' and '*'
TYPEOF.DFN('any', function (_){ return true; }, true)
TYPEOF.DFN('*', function (_){ return true; }, true)

module.exports = TYPEOF
