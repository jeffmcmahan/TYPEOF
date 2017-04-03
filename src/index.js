'use strict'

const typesMatch = require('./types-match')
const printValue = require('./print-value')

//=========================================== Error Stack Transforms ===========

/**
 * Alters a value to make it more suitable for printing to the console.
 * @param {*} rq
 * @return {*}
 */
function transformForConsole(rq) {
  if (typeof rq === 'function') return rq.name
  if (typeof rq === 'object' && rq.constructor === Object) {
    Object.keys(rq).forEach(key => rq[key] = transformForConsole(rq[key]))
  }
  return rq
}

/**
 * Zaps first line of the stack, as it points to TYPEOF, not the error line.
 * @param {*} stack
 * @return {String|Object} - if stack is not a string, it is returned unchanged
 */
function cleanStack(stack) {
  if (typeof stack !== 'string') return stack
  const lines = stack.split('\n')
  let cleaned = false
  return lines.filter(ln => {
    if (ln.indexOf('.js') !== -1 && !cleaned) {
      cleaned = true
      return false
    }
    return true
  }).join('\n')
}

function message(rq, arg, argNum) {
  return ('\n' +
    `    Value (${argNum}):\n` +
    `     Required: ${printValue.rq(rq)}\n` +
    `     Provided: ${printValue.arg(arg)}\n`
  )
}

//============================================================ API =============

/**
 * Accept any argument(s) and return a function which accepts the requirement(s)
 * that will be used to check the argument(s).
 * @param {...*}
 * @return {Function} check function
 */
function TYPEOF(...args) {
  return function(...rqs) {
    if (state.off) return args[0]
    let msg = ''
    let pass = true

    // Must require something.
    if (!rqs.length) pass = false

    // If void and no arguments provided, pass.
    if (rqs[0] === 'void' && !args.length) return

    // Check arity.
    if (rqs.length !== args.length) pass = false

    // Defined types.
    rqs = rqs.map(rq => (
      typeof rq === 'string' && rq in state.definedTypes
        ? state.definedTypes[rq]
        : rq
    ))

    // Check values.
    const len = rqs.length >= args.length ? rqs.length : args.length
    for (let i = 0; i < len; i++) {
      const rq = rqs.length < (i + 1) ? '__VOID' : rqs[i]
      const arg = args.length < (i + 1) ? '__VOID' : args[i]
      if (!typesMatch(rq, arg)) {
        pass = false
        msg += message(rq, arg, i + 1)
      }
    }

    // Throw and/or report a TypeError.
    if (!pass) {
      const err = new TypeError('TYPEOF\n ' + msg.replace(/"/g, ''))
      err.stack = cleanStack(err.stack)
      if (state.onFail) state.onFail(err)
      if (state.warn) console.log(err)
      else throw err
    }
    return args[0]
  }
}

//====================================================== API Methods ===========

const state = {
  onFail: null,
  warn: false,
  off: false,
  definedTypes: {}
}

TYPEOF.ONFAIL = callback => state.onFail = callback
TYPEOF.WARN = ()=> state.warn = true
TYPEOF.OFF = ()=> state.off = true
TYPEOF.DFN = (name, desc, invoke = false) => {
  if (invoke) {
    desc.__INVOKE = true
    desc.__NAME = name
  }
  state.definedTypes[name] = desc
}

//================================================ Define 'any' and '*' ========

TYPEOF.DFN('any', function() {return arguments.length > 0}, true)
TYPEOF.DFN('*', function() {return arguments.length > 0}, true)

//==============================================================================

module.exports = TYPEOF
