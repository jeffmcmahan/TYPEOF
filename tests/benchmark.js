'use strict'

const TYPEOF = require('../build')

function test(arg1, arg2, arg3, arg4, arg5) {
  TYPEOF
    (arguments)
    (Object, Array, {id:Number}, Number, Boolean)
  return true
}

const time = process.hrtime()
for (var i = 0; i < 1000; i++) {
  test({}, [i], {id:i * -3}, i - 10, false)
  test({name:i.toString()}, [i,2,4], {id:594 + i}, (i * 55), true)
}

const diff = process.hrtime(time)
let duration = (diff[0] + diff[1] / 1000000)
process.stdout.write(
  '\n  ' + i*2 + ' TYPEOF calls executed in ' + duration + ' ms' + '\n\n'
)
