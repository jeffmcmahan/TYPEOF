'use strict'

var NATIVE_TYPES = ['String', 'Array', 'Boolean', 'Number', 'Function']

/**
 * Generates a string to describe the type of the given value.
 * @param {*} value
 * @param {Boolean} isRQ
 * @return {String}
 */
function printType(value, isRQ) {
  if ( isRQ === void 0 ) isRQ = false;

  if (value === 'void') { return 'void' }
  if (value === null) { return 'null' }
  if (typeof value === 'undefined') { return 'undefined' }
  if (typeof value === 'string') { return 'string' }
  if (typeof value === 'function') { return 'function' }
  if (typeof value === 'boolean') { return 'boolean' }
  if (typeof value === 'number') {
    if (isNaN(value)) { return 'NaN' }
    return 'number'
  }
  if (typeof value === 'object') {
    if (value.constructor.name) { return value.constructor.name }
    return 'Object'
  }
}

/**
 * Generates a string representation of the given Object.
 * @param {Object} value
 * @return {String}
 */
function printObject(value) {
  var keys = Object.keys(value).sort().filter(function (key) { return value[key] !== value; })
  var obj= {}
  keys.forEach(function (key) { return obj[key] = printType(value[key]); })
  if (!keys.length) { return '{}' }
  return JSON.stringify(obj, null, 2)
    .replace(/\s+/g, ' ')
    .replace(/:\s/g, ':')
    .trim()
}

/**
 * Generates a string representation of the given Array value.
 * @param {Array} arr
 * @return {String}
 */
function printArray(arr) {
  if (!arr.length) { return '[]' }
  return ("[ " + (arr.slice(0,3).map(printType).join(', ')) + " ]")
}

/**
 * Generates a string representation of the given duck type requirement.
 * @param {Object} rq
 * @return {String}
 */
function printDuckType(duckType) {
  var keys = Object.keys(duckType).sort()
  var obj = {}
  keys.forEach(function (key) { return obj[key] = exports.rq(duckType[key]); })
  if (!keys.length) { return '{}' }
  return JSON.stringify(obj, null, 2)
    .replace(/\s+/g, ' ')
    .replace(/:\s/g, ':')
    .trim()
}

/**
 * Generates a string to describe the given disjoint type description.
 * @param {*} rq
 * @return {String}
 */
function printDisjoint(disjointDesc) {
  return disjointDesc.map(exports.rq).join('|')
}

/**
 * Generates a string to describe the given requirment.
 * @param {*} rq
 * @return {String}
 */
exports.rq = function (rq) {
  if (rq === '__VOID') { return 'void (implicit)' }
  if (rq === 'void') { return 'void' }
  if (typeof rq === 'function') {
    if (NATIVE_TYPES.indexOf(rq.name) !== -1) { return rq.name.toLowerCase() }
    return (rq.name || rq.__NAME)
  }
  if (typeof rq === 'undefined') { return 'undefined' }
  if (rq === null) { return 'null' }
  if (Array.isArray(rq)) { return printDisjoint(rq) }
  if (typeof rq === 'object' && rq instanceof Object) { return printDuckType(rq) }
  if (typeof rq === 'string') { return rq }
}

/**
 * Generates a string to describe the given value.
 * @param {*} arg
 * @return {String}
 */
exports.arg = function (arg) {
  if (arg === '__VOID') { return 'void' }
  if (arg && typeof arg === 'object') {
    if (arg instanceof Array) { return printArray(arg) }
    return printObject(arg)
  }
  return printType(arg)
}
