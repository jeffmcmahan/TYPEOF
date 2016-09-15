'use strict'

const printSpecificType = require('./print-specific-type')
const errMsg = require('./error-message')
const is = require('./is')

/**
 * Examines a disjoint requirement to see whether any of its disjuncts are
 * satisfied by a provided argument.
 * @function
 * @param {*} arg
 * @param {Array} rq
 * @return {Boolean}
 */
function checkDisjoint(arg, rq) {
  return rq.some(rq => !checkArg(arg, rq, 0))
}

/**
 * Examines a duck-type requirement to see whether all of its keys are defined
 * on the provided argument and of the correct type.
 * @function
 * @param {*} arg
 * @param {Object} rq
 * @return {Boolean}
 */
function checkDuckType(arg, rq) {
  return (
    Object.keys(rq).every(key => !checkArg(arg[key], rq[key], 0))
  )
}

/**
 * Compares the argument type with the requirement type either by constructor
 * identity, or by name.
 * @function
 * @param {Object} arg - a custom constructor instance
 * @param {Function|String} rq - custom constructor or name
 * @return {Boolean}
 */
function checkCustomType(arg, rq) {
  return is.other(arg) && arg.constructor === rq || arg.constructor.name === rq
}

/**
 * Turns a native javascript arguments object into an array.
 * @function
 * @param {Object} argumentsObj
 * @return {Array}
 */
function argumentsToArray(argumentsObj) {
  const arr = []
  for (let i = 0; i < argumentsObj.length; i++) {
    arr.push(argumentsObj[i])
  }
  return arr
}

function checkArg(arg, rq, n) {
  if (rq === '*') return
  if (is.disjoint(rq)) {
    if (checkDisjoint(arg, rq)) return
    return {n:n, v:arg}
  } else if (is.duckType(rq)) {
    if (checkDuckType(arg, rq)) return
    return {n:n, v:arg}
  } else if ((is.other(rq) || typeof rq === 'string')) {
    if (checkCustomType(arg, rq)) return
    return {n:n, v:arg}
  } else if (is.undefined(rq) && !is.undefined(arg)) {
    return {n:n, v:arg}
  } else if (is.null(rq) && !is.null(arg)) {
    return {n:n, v:arg}
  } else if (is.nan(rq) && !is.nan(arg)) {
    return {n:n, v:arg}
  } else if (is.number(rq) && !is.number(arg)) {
    return {n:n, v:arg}
  } else if (is.string(rq) && !is.string(arg)) {
    return {n:n, v:arg}
  } else if (is.boolean(rq) && !is.boolean(arg)) {
    return {n:n, v:arg}
  } else if (is.array(rq) && !is.array(arg)) {
    return {n:n, v:arg}
  } else if (is.object(rq) && !is.object(arg)) {
    return {n:n, v:arg}
  } else if (is.function(rq) && !is.function(arg)) {
    return {n:n, v:arg}
  }
}

function checkVoid(args) {
  if (is.arguments(args)) {
    if (!args.length) return []
    else return [{n:0, v:args[0]}]
  } else {
    throw new Error('The "void" type is only available for argumnets objects.')
  }
}

function checkArgumentsObject(args, rq) {
  args = argumentsToArray(args)
  if (!args.length) return [{n:0, v:'void'}]
  if (rq.length > args.length) {
    return [{n:0, v:args[0]}]
  }
  if (rq.length < args.length) {
    return args.map((arg, i) => {
      return {n:i, v:args[i]}
    }).slice(rq.length)
  }
  let bad = []
  for (let i = 0; i < rq.length; i++) {
    bad = bad.concat(checkArg(args[i], rq[i], i) || [])
  }
  return bad
}

function checkSingleArgument(arg, rq) {
  const violation = checkArg(arg, rq[0], 0)
  if (violation) return [violation]
  return []
}

/**
 * Examines a set of arguments and corresponding type requirements and returns
 * a set of indexed violating values.
 * @param {Object|Array}
 * @param {Object|Array}
 * @return {Array}
 */
function check(args, rq) {
  if (rq[0] === 'void') return checkVoid(args)
  if (is.arguments(args)) return checkArgumentsObject(args, rq)
  return checkSingleArgument(args, rq)
}

/**
 * Accepts the arguments and returns a function to accept the requirements.
 * @param {Object|Array} - arguments object or a regular array
 * @return {Function}
 */
module.exports = function (args) {
  if (arguments.length !== 1) throw new Error(errMsg.NO_ARGS)

  /**
   * Passes arguments to check() and throws if violations are found.
   * @throws TypeError
   * @return {undefined}
   */
  return function (...requirements) {
    if (!requirements.length) throw new Error(errMsg.NO_RQ)
    const violations = check(args, requirements)
    if (violations.length) {
      throw new TypeError(errMsg(args, requirements, violations))
    }
    return args
  }
}
