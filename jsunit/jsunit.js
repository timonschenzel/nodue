/**
 * Load ava's test framework.
 *
 * @type {Object}
 */
global.test = require('ava');

/**
 * Load jsUnit's test runner class.
 *
 * @type {TestRunner}
 */
let TestRunner = require('./TestRunner');

/**
 * Create a new TestRunner instance
 * and pass the current process to it.
 *
 * @type {TestRunner}
 */
let jsUnit = new TestRunner(process);

/**
 * Boot jsUnit, basically this will read the config file "jsunit.json".
 * If a bootstrap file is provided it will load this fill.
 * Further it scan all provided locations and get the test classes.
 * @todo: set env stuff.
 */
jsUnit.boot();

/**
 * Finally, Run all tests found in all the test classes.
 */
jsUnit.test();