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
  return rq.some(rq => check([arg], [rq]).length === 0)
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
  return Object.keys(rq).every(key => check([arg[key]], [rq[key]]).length === 0)
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
  if (!is.other(arg)) return false
  if (arg.constructor === rq || arg.constructor.name === rq) return true
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

/**
 * Examines a set of arguments and corresponding type requirements and returns
 * a set of indexed violating values.
 * @param {Object|Array}
 * @param {Object|Array}
 * @return {Array}
 */
function check(args, rq) {
  const bad = []

  // void
  if (rq[0] === 'void') rq = []
  // arity
  if (rq.length < args.length) {
    return (
      args
        .map((arg, i) => {return {n:i, v:args[i]}})
        .slice(rq.length)
      )
  }

  for (let i = 0; i < rq.length; i++) {
    // kleene
    if (rq[i] === '*' && (args.length - 1) >= [i]) continue
    // disjoint
    if (is.disjoint(rq[i])) {
      if (!checkDisjoint(args[i], rq[i])) bad.push({n:i, v:args[i]})
      continue
    }
    // duck types
    if (is.duckType(rq[i])) {
      if (!checkDuckType(args[i], rq[i])) bad.push({n:i, v:args[i]})
      continue
    }
    // custom types
    if (is.other(rq[i]) || typeof rq[i] === 'string') {
      if (!checkCustomType(args[i], rq[i])) bad.push({n:i, v:args[i]})
      continue
    }
    // native types
    if (is.undefined(rq[i]) && !is.undefined(args[i])) {
      bad.push({n:i, v:args[i]})
      continue
    }
    if (is.null(rq[i]) && !is.null(args[i])) {
      bad.push({n:i, v:args[i]})
      continue
    }
    if (is.nan(rq[i]) && !is.nan(args[i])) {
      bad.push({n:i, v:args[i]})
      continue
    }
    if (is.number(rq[i]) && !is.number(args[i])) {
      bad.push({n:i, v:args[i]})
      continue
    }
    if (is.string(rq[i]) && !is.string(args[i])) {
      bad.push({n:i, v:args[i]})
      continue
    }
    if (is.boolean(rq[i]) && !is.boolean(args[i])) {
      bad.push({n:i, v:args[i]})
      continue
    }
    if (is.array(rq[i]) && !is.array(args[i])) {
      bad.push({n:i, v:args[i]})
      continue
    }
    if (is.object(rq[i]) && !is.object(args[i])) {
      bad.push({n:i, v:args[i]})
      continue
    }
    if (is.function(rq[i]) && !is.function(args[i])) {
      bad.push({n:i, v:args[i]})
      continue
    }
  }
  return bad
}

/**
 * Accepts the arguments and returns a function to accept the requirements.
 * @param {Object|Array} - arguments object or a regular array
 * @return {Function}
 */
module.exports = function (args) {
  if (arguments.length !== 1 || !is.arrayLike(args)) {
    throw new Error(errMsg.NO_ARGS)
  }
  args = argumentsToArray(args)

  /**
   * Passes arguments to check() and throws if violations are found.
   * @throws TypeError
   * @return {undefined}
   */
  return function (...requirements) {
    if (!requirements.length) throw new Error(errMsg.NO_RQ)
    const violations = check(args, requirements)
    if (violations.length) {
      const err = new TypeError(errMsg(args, requirements, violations))
      err.stack = errMsg.filterStack(err.stack)
      throw err
    }
  }
}
