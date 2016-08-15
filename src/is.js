/**
 * The aim here is to provide type checks which do _not_ depend on checking,
 * e.g., for Array before Object, to get the right value. This is less \
 * performant, but it gives correct results.
 */

exports.null = function (val) {
  return val === null
}

exports.nan = function (val) {
  return typeof val === 'number' && isNaN(val)
}

exports.undefined = function (val) {
  return typeof val === 'undefined'
}

exports.boolean = function (val) {
  if (val === Boolean) return true
  if (typeof val === 'boolean') return true
  return false
}

exports.string = function (val) {
  if (val === String) return 'String'
  if (typeof val === 'string') return 'String'
  return false
}

exports.number = function (val) {
  if (val === Number) return true
  if (exports.nan(val)) return false
  if (typeof val === 'number') return true
  return false
}

exports.array = function (val) {
  if (val === Array) return true
  if (Array.isArray(val)) return true
  return false
}

exports.object = function (val) {
  if (val === Object) return true
  if (exports.array(val)) return false
  if (typeof val === 'object') return true
  return false
}

exports.function = function (val) {
  if (val === Function) return true
  if (exports.boolean(val)) return false
  if (exports.number(val)) return false
  if (exports.string(val)) return false
  if (exports.object(val)) return false
  if (exports.array(val)) return false
  if (typeof val === 'function') return true
  return false
}

exports.nativeConstructor = function (val) {
  return (
    val === Function ||
    val === Object ||
    val === String ||
    val === Boolean ||
    val === Array ||
    val === Number
  )
}

exports.other = function (val) {
  if (!val) return false
  if (exports.nativeConstructor(val)) return false
  let value = null
  if (typeof val === 'function') value = val
  if (typeof val === 'object') value = val.constructor
  if (value) {
    return /[A-Z]/.test(value.name) && !exports.nativeConstructor(value)
  }
  return false
}
