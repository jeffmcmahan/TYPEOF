const INDENT = '\n     '


/**
 * Prints stylized type names for values (or arrays of values) passed.
 * @function
 * @param {*} val
 * @return {String}
 */
function printType(val, isRequirement) {
  if (isRequirement && Array.isArray(val)) {
    return val.map(inVal => printType(inVal, true)).join('|')
  }
  if (val === null) return 'null'
  if (typeof val === 'undefined') return 'undefined'
  return val.name || val.constructor.name
}

/**
 * Generates a string representing what was required and what was passed.
 * @function
 * @param {Object} required - native JS arguments object
 * @param {Object} passed - native JS arguments object
 * @return {String}
 */
function msg(required, passed) {
  let message = '\n\n  REQUIRED:   '
  if (!required.length) message += 'void'
  for (let i = 0; i < required.length; i++) {
    message += printType(required[i], true)
    if (i < required.length - 1) message += ', '
  }
  message += '\n  PASSED:     '
  if (!passed.length) message += ' void '
  for (let i = 0; i < passed.length; i++) {
    message += printType(passed[i])
    if (i < passed.length - 1) message += ', '
  }
  return message + '\n'
}

/**
 * Ensures that the passed arguments match the requirements in arity and type.
 * @function
 * @this native JS arguments object
 * @return {undefined}
 */
function TYPEOF() {
  const required = arguments
  const passed = this
  if (passed.length < required.length) throw new TypeError(msg(required, passed))
  if (passed.length > required.length) throw new TypeError(msg(required, passed))
  for (let i = 0; i < passed.length; i++) {
    if (!Array.isArray(required[i]) && passed[i] === required[i] === null) return
    if (!Array.isArray(required[i]) && passed[i] === null) throw new TypeError(msg(required, passed))
    if (required[i] === null) throw new TypeError(msg(required, passed))
    if (Array.isArray(required[i])) {
      if (passed[i] === null && required[i].indexOf(null) !== -1) return
      if (required[i].indexOf(passed[i].constructor) !== -1) return
      throw new TypeError(msg(required, passed))
    }
    if (this[i].constructor !== required[i]) throw new TypeError(msg(required, passed))
  }
}

module.exports = passed => TYPEOF.bind(passed)
