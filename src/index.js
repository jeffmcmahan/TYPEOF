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

function diff(rq, arg) {
  const subsetArg = {}
  Object.keys(rq).forEach(key => {if (key in arg) subsetArg[key] = arg[key]})
  let rqType = printValue.rq(rq)
  let argType = printValue.arg(subsetArg)
  const rqProps = rqType.replace(/[{}]/g, '').trim().split(', ')
  const argProps = argType.replace(/[{}]/g, '').trim().split(', ')
  const diffedRq = rqProps.filter(req => !argProps.includes(req))
  const diffedArg = argProps.filter(rg => !rqProps.includes(rg))
  return {
    rq: `{ ${diffedRq.join(', ')}, ... }`,
    arg: `{ ${diffedArg.join(', ')}, ... }`
  }
}

function message(rq, arg, argNum) {
  const isDuck = (
    rq instanceof Object &&
    rq.constructor === Object &&
    Object.keys(rq).length
  )
  let rqType = printValue.rq(rq)
  let argType = printValue.arg(arg)
  if (isDuck) {
    const diffed = diff(rq, arg)
    rqType = diffed.rq
    argType = diffed.arg
  }
  return ('\n' +
    `    (${argNum}) required: ${rqType}\n` +
            `        provided: ${argType}\n`
  )
}

//======================================================== Checker =============

/**
 * Compares the types of the given arguments to the given requirements and
 * throws/reports an informative if there is a mismatch.
 * @param {Array} args
 * @param {Array} rqs
 * @return {*} - The first value being checked
 */
function check(args, rqs) {
  let msg = ''
  let pass = true

  // Must require something.
  if (!rqs.length) pass = false

  // If void and no arguments provided, pass.
  if (rqs[0] === 'void' && !args.length) return

  // Defined types.
  rqs = rqs.map(rq => (typeof rq === 'string' && rq in state.definedTypes)
    ? state.definedTypes[rq]
    : rq
  )

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
  if (pass) return args[0]

  // Throw and/or report a TypeError.
  const err = new TypeError('TYPEOF\n ' + msg.replace(/"/g, ''))
  err.stack = cleanStack(err.stack)
  if (state.onFail) state.onFail(err)
  if (state.warn) console.log(err)
  else throw err
}

//============================================================ API =============

/**
 * Accept any argument(s) and return a function which accepts the requirement(s)
 * that will be used to check the argument(s).
 * @param {...*} args
 * @return {Function} -  A dummy function or the check function
 */
function TYPEOF(...args) {
  return state.off
    ? ()=> args[0]
    : (...rqs) => check(args, rqs)
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
