'use strict'

var printSpecificType = require('./print-specific-type')
var is = require('./is')
var errMsg = require('./error-message')
var MUST_REQUIRE_SOMETHING = (
  'TYPEOF requires explicit type declarations. Use "void" to indicate '+
  'that no arguments may be passed.'
)

function checkDisjoint(arg, rq) {
  return rq.some(function (rq) {
    return check([arg], [rq])
  })
}

function checkDuckType(arg, rq) {
  return Object.keys(rq).every(function (key) {
    return check([arg[key]], [rq[key]])
  })
}

function checkCustomType(arg, rq) {
  if (!is.other(arg)) return false
  if (arg.constructor === rq) return true
  if (arg.constructor.name === rq) return true
}

function check(args, rq) {
  // void
  if (rq[0] === 'void' && args.length === 0) return true

  // arity
  if (rq.length !== args.length) return

  for (var i = 0; i < rq.length; i++) {
    // kleene
    if (rq[i] === '*') continue
    // disjoint
    if (is.disjoint(rq[i])) {
      if (checkDisjoint(args[i], rq[i])) continue; return
    }
    // duck types
    if (is.duckType(rq[i])) {
      if (checkDuckType(args[i], rq[i])) continue; return
    }
    // custom types
    if (is.other(rq[i]) || typeof rq[i] === 'string') {
      if (checkCustomType(args[i], rq[i])) continue; return
    }
    // native types
    if (is.undefined(rq[i]) && !is.undefined(args[i])) return
    if (is.null(rq[i]) && !is.null(args[i])) return
    if (is.nan(rq[i]) && !is.nan(args[i])) return
    if (is.number(rq[i]) && !is.number(args[i])) return
    if (is.string(rq[i]) && !is.string(args[i])) return
    if (is.boolean(rq[i]) && !is.boolean(args[i])) return
    if (is.array(rq[i]) && !is.array(args[i])) return
    if (is.object(rq[i]) && !is.object(args[i])) return
    if (is.function(rq[i]) && !is.function(args[i])) return
  }
  return true
}

module.exports = function (args) {
  return function () {
    if (!arguments.length) throw new Error(MUST_REQUIRE_SOMETHING)
    if (!check(args, arguments)) throw new TypeError(errMsg(args, arguments))
  }
}
