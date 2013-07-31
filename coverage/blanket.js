// blanket wrapper here to instrument other required files on the fly.

var path = require('path');
var dir = path.dirname(__dirname);

require('blanket')({
  // Only files that match the pattern will be instrumented:
  pattern: [
    dir +'/index.js',
    dir +'/lib/'
  ]
});
