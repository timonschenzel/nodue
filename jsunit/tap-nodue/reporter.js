require('colors');
var fs = require('fs');
const PassThrough = require('readable-stream/passthrough');
const duplexer = require('duplexer3');
const hirestime = require('hirestime');
const Parser = require('tap-parser');
const ms = require('pretty-ms');
const chalk = require('chalk');
const util = require('util');
var jsdiff = require('diff');

const concordance = require('concordance');
const concordanceOptions = require('ava/lib/concordance-options').default;
const concordanceDiffOptions = require('ava/lib/concordance-options').diff;

// const serializeError = require('ava/lib/serialize-error');
const formatSerializedError = require('ava/lib/reporters/format-serialized-error');
const improperUsageMessages = require('ava/lib/reporters/improper-usage-messages');

let testsOverview = '';
let visualErrors = '';

const reporter = () => {
  const onResults = (data) => {
    const time = timer()

    output.write('  ' + testsOverview);
    output.write("\n");
    output.write(visualErrors);

    const msg = `${data.fail} ${data.fail > 1 ? 'tests' : 'test'} fail (${ms(time)})`

    result.count = data.count
    result.errors = data.failures

    // if (data.count === 0 || data.fail > 0) {
    //   output.end('\n' + chalk.red(msg) + '\n')
    // } else {
    //   output.end('\n' + chalk.green(data.pass) + '\n')
    // }

    if (data.fail) {
      output.write("\n");
      output.write('  ' + chalk.red(data.fail + ' failed\n'));
      output.write('  ' + chalk.green(data.pass + ' passed\n'));
    } else {
      output.write('  ' + chalk.green(data.pass + ' passed\n'));
    }
  }

  const input = new Parser(onResults)
  const output = new PassThrough()
  const result = duplexer(input, output)
  let counter = 0;

  input.on('assert', (assert) => {
    if (assert.diag.message) {
      console.log(assert.diag.message);
    }

    // console.log(assert);
    if (assert.ok) {
      testsOverview += chalk['green']('.');
      return
    }

    testsOverview += chalk['red']('x');

    counter++;

    let name = '';
    let file = '';
    let formattedDiff = '';

    [name, file] = assert.name.split(' on ');

    visualErrors += '\n';
    visualErrors += '  ' + chalk.red('x') + ' ' + counter + ') ' + chalk.white(name) + '\n';
    visualErrors += '  ' + chalk.dim(file);
    visualErrors += '\n';
    visualErrors += '  ' + visualError(file);
    if (assert.diag.message) {
      visualErrors += '\n  ' + assert.diag.message + '\n';
    }

    for (message in assert.diag.values) {
      visualErrors += '\n\n  ' + message + '\n';
      // visualErrors += '\n' + assert.diag.values[message] + '\n';

      let diffValue = assert.diag.values[message];
      let parsedValue = null;
      try {
        parsedValue = eval(diffValue);
      } catch (error) {
        parsedValue = diffValue;
      }
      // let diffValue = JSON.parse(diffValue);

      let values = formatWithLabel('', parsedValue);

      visualErrors += '\n  ' + values.formatted + '\n';
    };

    // visualErrors += visualDiff(assert);
    visualErrors += '\n';
  });

  const timer = hirestime() // todo: init when first test running

  return result
}

function formatDescriptorWithLabel(label, descriptor) {
  return {
    label,
    formatted: concordance.formatDescriptor(descriptor, concordanceOptions)
  };
}

function formatWithLabel(label, value) {
  return formatDescriptorWithLabel(label, concordance.describe(value, concordanceOptions));
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

  if (test.avaAssertionError) {
    const result = formatSerializedError(test);
    if (result.printMessage) {
      status += '\n' + indentString(test.message, 2) + '\n';
    }

    if (result.formatted) {
      status += '\n' + indentString(result.formatted, 2) + '\n';
    }

    const message = improperUsageMessages.forError(test);
    if (message) {
      status += '\n' + indentString(message, 2) + '\n';
    }
  } else if (test.message) {
    status += '\n' + indentString(test.message, 2) + '\n';
  }

  return status;
}

module.exports = reporter
