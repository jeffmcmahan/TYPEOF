'use strict'

const TYPEOF = require('../src')
require('./undefined')
require('./void')
require('./arity')
require('./native-constructors')
require('./nan')
require('./kleene-star')
require('./custom-constructors')
require('./disjunctions')
require('./duck-type')
require('./api')
process.stdout.write('  ✔ ALL TESTS PASSED.\n\n')
