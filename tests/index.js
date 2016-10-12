'use strict'

require('./undefined')
require('./void')
require('./arity')
require('./native-constructors')
require('./nan')
require('./kleene-star')
require('./custom-constructors')
require('./disjunctions')
require('./duck-type')
require('./error-message')

// ./api must go last.
require('./api')

process.stdout.write('  ✔ :)\n\n')
