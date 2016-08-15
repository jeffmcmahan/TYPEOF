'use strict'

var getSpecificType = require('./getSpecificType')
var msg = require('./message')
var MUST_REQUIRE_SOMETHING = ("\n\n  TYPEOF requires explicit type declarations.\n\n  - Hint: Use \"void\" (as a string) to indicate that no arguments may be passed.\n")

function checkNonDisjoint(required, passed) {
  if (required === '*') return true
  var reqType = getSpecificType(required, true)
  var valType = getSpecificType(passed)
  return reqType === valType
}

function checkDisjoint(required, passed) {
  var reqTypes = required.map(getSpecificType, true)
  var valType = getSpecificType(passed)
  if (reqTypes.indexOf(valType) !== -1) return true
  return false
}

/**
 * Ensures that the passed arguments match the requirements in arity,
 * type, and order.
 * @function
 * @this native JS arguments object
 * @return {undefined}
 * @note Undefined is not allowed under any circumstances.
 */
function check() {
  var passed = this
  if (!arguments.length) throw new Error(MUST_REQUIRE_SOMETHING)
  var required = (arguments[0] === 'void') ? [] : arguments

  // Check arity
  if (passed.length !== required.length) {
    throw new TypeError(msg(required, passed))
  }

  // Check types
  for (var i = 0; i < passed.length; i++) {
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
