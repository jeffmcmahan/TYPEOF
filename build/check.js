'use strict'

var msg = require('./message')
var MUST_REQUIRE_SOMETHING = ("\n\n  TYPEOF requires explicit type declarations.\n\n  - Hint: Use \"void\" (as a string) to indicate that no arguments may be passed.\n")

/**
 * Ensures that the passed arguments match the requirements in arity,
 * type, and order.
 * @function
 * @this native JS arguments object
 * @return {undefined}
 * @note Undefined is not allowed under any circumstances.
 */
module.exports = function () {
  var this$1 = this;

  var passed = this
  if (!arguments.length) throw new Error(MUST_REQUIRE_SOMETHING)
  var required = (arguments[0] === 'void') ? [] : arguments

  // Check arity.
  if (passed.length !== required.length) {
    throw new TypeError(msg(required, passed))
  }

  // Check types.
  for (var i = 0; i < passed.length; i++) {

    // Attempted to require undefined (forbidden)
    if (typeof required[i] === 'undefined') {
      throw new Error('TYPEOF doesn\'t allow you to declare undefined as a type.')
    }

    // Undefined passed (never valid)
    if (typeof passed[i] === 'undefined') {
      throw new TypeError(msg(required, passed))
    }

    // Null reqired, null passed
    if (!Array.isArray(required[i]) && passed[i] === required[i] === null) {
      return
    }

    // Null passed, not required
    if (!Array.isArray(required[i]) && passed[i] === null) {
      throw new TypeError(msg(required, passed))
    }

    // Null required, not passed
    if (required[i] === null) {
      throw new TypeError(msg(required, passed))
    }

    // Disjunctive requirements (an array of types)
    if (Array.isArray(required[i])) {
      if (passed[i] === null && required[i].indexOf(null) !== -1) return
      if (required[i].indexOf(passed[i].constructor) !== -1) return
      if (required[i].indexOf(passed[i].constructor.name) !== -1) return
      throw new TypeError(msg(required, passed))
    }

    // 'Constructor Name' (as a string)
    if (typeof required[i] === 'string') {
      required[i] = {name: required[i]}
      if (passed[i].constructor.name === required[i].name) return
    }

    // Mismatched constructors
    if (this$1[i].constructor !== required[i]) {
      throw new TypeError(msg(required, passed))
    }
  }
}
