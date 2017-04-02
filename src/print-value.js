'use strict'

function printType(value, isRQ = false) {
  if (value === 'void') return 'void'
  if (value === null) return 'null'
  if (typeof value === 'undefined') return 'undefined'
  if (typeof value === 'string') return 'string'
  if (typeof value === 'function') return 'function'
  if (typeof value === 'boolean') return 'boolean'
  if (typeof value === 'number') {
    if (isNaN(value)) return 'NaN'
    return 'number'
  }
  if (typeof value === 'object') {
    if (value.constructor.name) return value.constructor.name
    return 'Object'
  }
}

function printObject(value) {
  const keys = Object.keys(value).filter(key => value[key] !== value)
  const obj= {}
  keys.forEach(key => obj[key] = printType(value[key]))
  if (!keys.length) return '{}'
  return (
    JSON.stringify(obj, null, 2)
      .replace(/\s+/g, ' ')
      .replace(/:\s/g, ':')
      .replace('{', '{')
      .replace('}', '... }')
      .trim()
  )
}

function printArray(value) {
  if (!value.length) return '[]'
  return (
    '[ ' +
    value.slice(0,3)
      .map(printType)
      .join(', ') +
    ' ]'
  )
}

function printDuckType(rq) {
  const keys = Object.keys(rq)
  const obj = {}
  keys.forEach(key => obj[key] = exports.rq(rq[key]))
  if (!keys.length) return '{}'
  return (
    JSON.stringify(obj, null, 2)
      .replace(/\s+/g, ' ')
      .replace(/:\s/g, ':')
      .replace('{', '{')
      .replace('}', '... }')
      .trim()
  )
}

function printDisjoint(rq) {
  return rq.map(exports.rq).join('|')
}

exports.rq = function (rq) {
  if (rq === 'void') return 'void'
  if (typeof rq === 'function') {
    if (['String', 'Array', 'Boolean', 'Number', 'Function'].indexOf(rq.name) !== -1) {
      return rq.name.toLowerCase()
    }
    return rq.name
  }
  if (typeof rq === 'undefined') return 'undefined'
  if (rq === null) return 'null'
  if (Array.isArray(rq)) return printDisjoint(rq)
  if (typeof rq === 'object' && rq instanceof Object) return printDuckType(rq)
  if (typeof rq === 'string') return rq
}

exports.arg = function (arg) {
  if (typeof arg === 'undefined') return 'undefined'
  if (arg === null) return 'null'
  if (typeof arg === 'object') {
    if (arg instanceof Array) return printArray(arg)
    return printObject(arg)
  }
  if (typeof arg === 'string') return `'${arg}'`
  return arg.toString()
}
