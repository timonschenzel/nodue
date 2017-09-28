#!/usr/bin/env node

const nodueReporter = require('./tap-nodue/reporter');
const stream = nodueReporter();

process.stdin
  .pipe(stream)
  .pipe(process.stdout);

stream.on('end', function() {
  // https://github.com/scottcorgan/tap-spec/commit/0f475a14b9dd7c5c0551c9482f445a0804e12546#diff-168726dbe96b3ce427e7fedce31bb0bcR69
  if (stream.count < 1) {
    process.exit(1);
  }

  if (stream.errors.length > 0) {
    process.exit(1);
  }
})
