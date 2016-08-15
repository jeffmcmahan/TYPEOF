'use strict'

const getSpecificType = require('./getSpecificType')
const msg = require('./message')
const MUST_REQUIRE_SOMETHING = (
  'TYPEOF requires explicit type declarations. Use "void" to indicate '+
  'that no arguments may be passed.'
)

/**
 * Checks a passed value against required type match.
 * @function
 * @param {*} required - native JS arguments object
 * @param {*} passed - native JS arguments object
 * @return {Boolean}
 */
function checkNonDisjoint(required, passed) {
  if (required === '*') return true
  const reqType = getSpecificType(required, true)
  const valType = getSpecificType(passed)
  return reqType === valType
}

/**
 * Checks a shallow array for disjunctive type match with passed value.
 * @function
 * @param {*} required - native JS arguments object
 * @param {*} passed - native JS arguments object
 * @return {Boolean}
 */
function checkDisjoint(required, passed) {
  const reqTypes = required.map(getSpecificType, true)
  const valType = getSpecificType(passed)
  if (reqTypes.indexOf(valType) !== -1) return true
  return false
}

/**
 * Ensures that the passed arguments match the requirements in arity,
 * type, and order.
 * @function
 * @this native JS arguments object
 * @return {undefined}
 */
function check() {
  const passed = this
  if (!arguments.length) throw new Error(MUST_REQUIRE_SOMETHING)
  const required = (arguments[0] === 'void') ? [] : arguments

  // Check arity
  if (passed.length !== required.length) {
    throw new TypeError(msg(required, passed))
  }

  // Check types
  for (let i = 0; i < passed.length; i++) {
    if (Array.isArray(required[i])) {
      if (!checkDisjoint(required[i], passed[i])) {
        throw new TypeError(msg(required, passed))
      }
    } else {
      if (!checkNonDisjoint(required[i], passed[i])) {
        throw new TypeError(msg(required, passed))
      }
    }
  }
}

module.exports = check
