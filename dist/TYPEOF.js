/*
MIT License

Copyright (c) 2016 Jeff McMahan

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var check = __webpack_require__(1)
	var doNothing = function (){}
	var silent = false

	/**
	 * Returns either a bound TYPEOF function or a do-nothing function, depending
	 * one whether type checking has been silenced or not.
	 * @function
	 * @param {Object} passed - native js arguments (array-like) object
	 * @return {Function}
	 */
	function API(passed) {
	  return (silent ? doNothing : check.bind(passed))
	}

	/**
	 * Turns off type checking.
	 * @method
	 * @return {undefined}
	 */
	API.silence = function () {silent = true}

	/**
	 * Turns off type checking if the condition is truthy.
	 * @method
	 * @param {Boolean} condition
	 * @return {Boolean} - returns the condition's value
	 */
	API.silenceIf = function (condition) {
	  if (condition) silent = true
	  return condition
	}

	module.exports = API


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var msg = __webpack_require__(2)
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


/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict'

	/**
	 * Prints stylized type names for values (or arrays of values) passed.
	 * @function
	 * @param {*} val
	 * @return {String}
	 */
	function printType(val, allowArray) {
	  if (allowArray && Array.isArray(val)) {
	    return val.map(function (inVal) { return printType(inVal, true); }).join('|')
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
	module.exports = function(required, passed) {
	  var message = '\n\n  REQUIRED:   '
	  if (!required.length) message += 'void'
	  for (var i = 0; i < required.length; i++) {
	    message += printType(required[i], true)
	    if (i < required.length - 1) message += ', '
	  }
	  message += '\n  PASSED:     '
	  if (!passed.length) message += 'void'
	  for (var i$1 = 0; i$1 < passed.length; i$1++) {
	    message += printType(passed[i$1])
	    if (i$1 < passed.length - 1) message += ', '
	  }
	  return message + '\n'
	}


/***/ }
/******/ ]);