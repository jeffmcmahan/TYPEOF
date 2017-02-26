'use strict'

const typesMatch = require('./types-match')
const printValue = require('./print-value')

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

function TYPEOF(...args) {
  return function(...rqs) {
    if (off) return args[0]
    let errMsg = ''
    let pass = true

    // Must require something.
    if (!rqs.length) pass = false
    if (rqs[0] === 'void' && !args.length) return

    // Defined types.
    rqs = rqs.map(rq => typeof rq === 'string' && dfns[rq] ? dfns[rq] : rq)

    // Check arity.
    if (rqs.length !== args.length) pass = false

    // Check values.
    const len = rqs.length >= args.length ? rqs.length : args.length
    for (let i = 0; i < len; i++) {
      if (!typesMatch(rqs[i], args[i])) {
        pass = false
        const rqIsVoid = rqs.length < i + 1
        const argIsVoid = args.length < i + 1
        errMsg += '\n    Value (' + (i + 1) + '):\n'
        errMsg += '     Required: ' + (rqIsVoid ? 'void (implicit)' : printValue.rq(rqs[i])) + '\n'
        errMsg += '     Provided: ' + (argIsVoid ? 'void': printValue.arg(args[i])) + '\n'
      }
    }

    // Report failure.
    if (!pass) {
      const err = new TypeError('TYPEOF\n ' + errMsg.replace(/"/g, ''))
      err.stack = cleanStack(err.stack)
      if (onFail) onFail(err)
      if (warn) console.log(err)
      else throw err
    }
    return args[0]
  }
}

// API functions
let onFail = null
TYPEOF.ONFAIL = callback => onFail = callback

let warn = false
TYPEOF.WARN = _=> warn = true

let off = false
TYPEOF.OFF = _=> off = true

const dfns = {}

TYPEOF.DFN = (name, desc, invoke = false) => {
  if (invoke) desc.INVOKE = true
  dfns[`${name}`] = desc
}

// Define 'any' and '*'
TYPEOF.DFN('any', _=> true, true)
TYPEOF.DFN('*', _=> true, true)

module.exports = TYPEOF
