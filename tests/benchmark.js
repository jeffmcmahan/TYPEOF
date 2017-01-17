'use strict'

const TYPEOF = require('../src')
TYPEOF.DFN('complex', { prop1:Number, prop2:Object })

function test(arg1, arg2, arg3, arg4, arg5) {
  TYPEOF
    (...arguments)
    (Object, Array, {id:Number}, Number, Boolean)
}

function test2(arg1, arg2, arg3, arg4, arg5) {
  TYPEOF
    (...arguments)
    (Object, Array, {id:Number}, Number, Boolean)
}

function test3(arg1, arg2, arg3, arg4, arg5) {
  TYPEOF
    (...arguments)
    ('complex')
}

let time = process.hrtime()

// Iterate function calls with different args every time.
for (var i = 0; i < 10000; i++) {
  test({}, [i], {id:i * -3}, i - 10, false)
  test2({name:i.toString()}, [i,i*2,4], {id:594 + i}, (i * 55), true)
  test3({prop1: 0, prop2: {}})
}

let diff = process.hrtime(time)
let duration = (diff[0] + diff[1] / 1000000)

process.stdout.write(
  '\n  ' + i*3 + ' unique TYPEOF checks executed in ' + duration + ' ms' + '\n\n'
)

time = process.hrtime()

// Iterate function calls with different args every time.
test({}, [7], {id:19846}, -94, true)
test2({name:'Jose'}, [9,7,4], {id:59}, (-9459), true)
test3({prop1: Infinity, prop2: {}})

diff = process.hrtime(time)
duration = (diff[0] + diff[1] / 1000)

process.stdout.write(
  '  ' + 3 + ' unique TYPEOF checks executed in ' + duration + ' microseconds' + '\n\n'
)
