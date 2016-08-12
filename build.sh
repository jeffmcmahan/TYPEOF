# Build
buble -i src -o build
webpack

# Uglify
uglifyjs dist/TYPEOF.js > dist/TYPEOF.min.js

# Add license
mv dist/TYPEOF.js dist/TYPEOF.js.tmp
touch dist/TYPEOF.js
cat LICENSE.txt dist/TYPEOF.js.tmp >> dist/TYPEOF.js

# Clean up
rm dist/TYPEOF.js.tmp
rm -rf build
