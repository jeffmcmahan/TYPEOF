'use strict'

const is = require('./is')

/**
 * Finds the most specific type name applicable for a given value.
 * @function
 * @param {*} val
 * @param {Boolean} isReq - optional
 * @return {String}
 */
function getSpecificType(val, isReq) {
  if (isReq && typeof val === 'string') return val
  if (isReq && Array.isArray(val)) return val.map(getSpecificType).join('|')
  if (is.other(val))       return val.name || val.constructor.name
  if (is.undefined(val))   return 'undefined'
  if (is.null(val))        return 'null'
  if (is.boolean(val))     return 'Boolean'
  if (is.nan(val))         return 'NaN'
  if (is.number(val))      return 'Number'
  if (is.string(val))      return 'String'
  if (is.array(val))       return 'Array'
  if (is.object(val))      return 'Object'
  if (is.function(val))    return 'Function'
  throw new Error('Type of '+ val +' not identified')
}

module.exports = getSpecificType
