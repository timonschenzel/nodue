#!/usr/bin/env node

var tapSpec = require('../node_modules/tap-spec/');
var tapSpec = tapSpec();

process.stdin
  .pipe(tapSpec)
  .pipe(process.stdout);

process.on('exit', function (status) {

  if (status === 1) {
    process.exit(1);
  }

  if (tapSpec.failed) {
    process.exit(1);
  }
});
