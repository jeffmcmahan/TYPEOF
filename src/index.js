'use strict'

const typesMatch = require('./types-match')
let silent = false

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
  if (Array.isArray(rq)) {
    rq = rq.map(transformForConsole).join('|')
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
  const passed = args
  return function (...rqs) {
    if (silent) return
    let pass = true
    if (!rqs.length) pass = false
    if (!isArgumentsObject(args)) args = [args]
    if (rqs[0] === 'void' && rqs.length === 1 && args.length === 0) return
    if (rqs.length !== args.length) pass = false
    rqs.forEach((rq, i) => {
      if (!typesMatch(rq, args[i])) {
        pass = false
        console.log('\n  TypeError at argument #'+(i+1)+':\n')
        console.log('  Required:', transformForConsole(rq))
        console.log('  Provided:', args[i], '\n')
      }
    })
    if (!pass) {
      const err = new TypeError('')
      err.stack = cleanStack(err.stack)
      throw err
    }
    return passed
  }
}

TYPEOF.silence = function () {
  silent = true
}

TYPEOF.silenceIf = function (condition) {
  if (condition) silent = true
}

module.exports = TYPEOF
