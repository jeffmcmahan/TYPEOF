'use strict'

const TYPEOF = require('../src')

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
    ('func sig')
}

TYPEOF.DFN('func sig', {
  1:Object, 2:Array, 3:{id:Number}, 4:Number, 5:Boolean
})

const time = process.hrtime()

// Iterate function calls with different args every time.
for (var i = 0; i < 10000; i++) {
  test({}, [i], {id:i * -3}, i - 10, false)
  test2({name:i.toString()}, [i,i*2,4], {id:594 + i}, (i * 55), true)
  test3({a:1}, [i+1,i,4], {id:321 + i}, (i * 13), true)
}

const diff = process.hrtime(time)
const duration = (diff[0] + diff[1] / 1000000)

process.stdout.write(
  '\n  ' + i*3 + ' unique TYPEOF checks executed in ' + duration + ' ms' + '\n\n'
)
