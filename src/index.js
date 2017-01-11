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

    // Defined types.
    if (rqs.length === 1 && typeof rqs[0] === 'string' && rqs[0] in dfns) {
      rqs[0] = dfns[rqs[0]]
      if (rqs[0].INVOKE && rqs[0](args)) return true
      if (rqs[0] instanceof Object && '1' in rqs[0]) {
        let i = 1
        const dfn = []
        while (i in rqs[0]) {dfn.push(rqs[0][i]); i++}
        rqs = dfn
      }
    }

    // Check values.
    if (rqs.length !== args.length) pass = false
    rqs.forEach((rq, i) => {
      if (!typesMatch(rq, args[i])) {
        pass = false
        const isVoid = args.length < i + 1
        errMsg += '\n    Value (' + (i + 1) + '):\n'
        errMsg += '     Required: ' + printValue.rq(rq, true) + '\n'
        errMsg += '     Provided: ' + (isVoid ? 'void': printValue.arg(args[i])) + '\n'
      }
    })

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

const Void = args => !args.length
TYPEOF.DFN('void', Void, true)

const any = args => args.length === 1
TYPEOF.DFN('any', any, true)
TYPEOF.DFN('*', any, true)

module.exports = TYPEOF
