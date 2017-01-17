'use strict'

/**
 * See whether required and provided types are the same.
 * @param {Function|String|Object|Array|undefined|null} type
 * @param {*} value
 * @return {Boolean}
 */
module.exports = function typesMatch(type, value) {
  if (type === '*' || type === 'any') return true
  if (type === null) return value === null
  if (typeof type === 'undefined') return typeof value === 'undefined'
  if (typeof type === 'string') {
    return typeof value === 'object' && value.constructor.name === type
  }
  if (type instanceof Array) return type.some(type => typesMatch(type, value))
  if (type instanceof Object && Object.keys(type).length > 0) {
    return (
      value instanceof Object &&
      Object.keys(type).every(key => typesMatch(type[key], value[key]))
    )
  }
  if (type === Boolean) return typeof value === 'boolean'
  if (type === String) return typeof value === 'string'
  if (type === Array) return Array.isArray(value)
  if (type === Object) return value instanceof Object && !(value instanceof Array)
  if (type === Number) return typeof value === 'number' && !isNaN(value)
  if (type === Function) return typeof value === 'function'
  if (typeof type === 'number' && isNaN(type)) {
    return typeof value === 'number' && isNaN(value)
  }
  if (typeof type === 'function') return value instanceof type
  return true
}
