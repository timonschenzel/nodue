#!/usr/bin/env node

var fs = require('fs');
var through = require('through2');
var parser = require('tap-out');
var chalk = require('chalk');
var out = through();
var tap = parser();
var currentTestName = '';
var errors = [];
var extra = [];
var assertCount = 0;
var lastComment;

const formatSerializedError = require('ava/lib/reporters/format-serialized-error');
const improperUsageMessages = require('ava/lib/reporters/improper-usage-messages');

process.stdin.pipe(tap);

out.push('\n');

function outPush (str) {

  out.push('  ' + str);
};

tap.on('comment', function (comment) {

  lastComment = comment;
});

var firstTestDone = false;

tap.on('assert', function (res) {

  var color = (res.ok) ? 'green' : 'red';

  assertCount +=1;

  if (! firstTestDone) {
    firstTestDone = true;
    out.push('  ');
  }

  if (res.ok) {
    out.push(chalk[color]('.'));
  }
  if (!res.ok) {
    out.push(chalk[color]('x'));
  }
});

tap.on('extra', function (str) {

  if (str !== '') extra.push(str);
});

tap.on('output', function (res) {

  if (res.fail && res.fail.length || assertCount === 0) {
    outPush('\n');
    let counter = 0;
    res.fail.forEach(function (failure) {
        counter++;

        [name, file] = failure.name.split(' on ');

        outPush('\n');
        outPush(chalk.red('x') + ' ' + counter + ') ' + chalk.white(name) + '\n');
        outPush(chalk.dim(file));
        outPush('\n');
        outPush(visualError(file));
        outPush(visualDiff(failure));
        outPush('\n');
    });

    errors = res.fail;
    outputExtra();

    statsOutput();

    outPush(chalk.red(res.fail.length + ' failed'));

    outPush('\n');
  }
  else{
    statsOutput();

    outPush('\n');
    outPush(chalk.green('Pass!') + '\n');
  }

  function statsOutput () {

    outPush(res.tests.length + ' tests\n');
    outPush(chalk.green(res.pass.length + ' passed\n'));
  }
});

function outputExtra () {

  console.log(extra.join('\n'));
}

function visualError(fileName)
{
  const codeExcerpt = require('code-excerpt');
  const equalLength = require('equal-length');
  const truncate = require('cli-truncate');
  const colors = require('ava/lib/colors');
  const indentString = require('indent-string');
  const formatLineNumber = (lineNumber, maxLineNumber) =>
    ' '.repeat(Math.max(0, String(maxLineNumber).length - String(lineNumber).length)) + lineNumber;

  const maxWidth = 80;

  let parts = fileName.split(':');
  let lineNumber = parseInt(parts.pop());

  fileName = parts.join(':');

  let sourceInput = {};
  sourceInput.file = fileName;
  sourceInput.line = lineNumber;
  sourceInput.isDependency = false;
  sourceInput.isWithinProject = true;

  let contents = fs.readFileSync(sourceInput.file, 'utf8');
  const excerpt = codeExcerpt(contents, sourceInput.line, {maxWidth: process.stdout.columns, around: 1});

  if (!excerpt) {
    return null;
  }

  const file = sourceInput.file;
  const line = sourceInput.line;

  const lines = excerpt.map(item => ({
    line: item.line,
    value: truncate(item.value, maxWidth - String(line).length - 5)
  }));

  const joinedLines = lines.map(line => line.value).join('\n');
  const extendedLines = equalLength(joinedLines).split('\n');

  let errorContent = lines
    .map((item, index) => ({
      line: item.line,
      value: extendedLines[index]
    }))
    .map(item => {
      const isErrorSource = item.line === line;

      const lineNumber = formatLineNumber(item.line, line) + ':';
      const coloredLineNumber = isErrorSource ? lineNumber : chalk.dim(lineNumber);
      const result = `   ${coloredLineNumber} ${item.value}`;

      return isErrorSource ? chalk.bgRed(result) : result;
    })
    .join('\n');

  errorContent = errorContent.substring(2);
  return errorContent;
}

function visualDiff(test)
{
  let status = '';

  if (test.error.avaAssertionError) {
    const result = formatSerializedError(test.error);
    if (result.printMessage) {
      status += '\n' + indentString(test.error.message, 2) + '\n';
    }

    if (result.formatted) {
      status += '\n' + indentString(result.formatted, 2) + '\n';
    }

    const message = improperUsageMessages.forError(test.error);
    if (message) {
      status += '\n' + indentString(message, 2) + '\n';
    }
  } else if (test.error.message) {
    status += '\n' + indentString(test.error.message, 2) + '\n';
  }

  return status;
}

out.pipe(process.stdout);

process.on('exit', function () {

  if (errors.length || assertCount === 0) {
    process.exit(1);
  }
});
