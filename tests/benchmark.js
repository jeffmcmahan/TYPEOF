'use strict'

const TYPEOF = require('../src')

function test(arg1, arg2, arg3, arg4, arg5) {

  TYPEOF
    (...arguments)
    (Object, Array, {id:Number}, Number, Boolean)

  return true
}

function test2(arg1, arg2, arg3, arg4, arg5) {

  TYPEOF
    (...arguments)
    (Object, Array, {id:Number}, Number, Boolean)

  return true
}

const time = process.hrtime()

for (var i = 0; i < 10000; i++) {
  test({}, [i], {id:i * -3}, i - 10, false)
  test2({name:i.toString()}, [i,i*2,4], {id:594 + i}, (i * 55), true)
}

const diff = process.hrtime(time)

let duration = (diff[0] + diff[1] / 1000000)
process.stdout.write(
  '\n  ' + i*2 + ' unique TYPEOF checks executed in ' + duration + ' ms' + '\n\n'
)
