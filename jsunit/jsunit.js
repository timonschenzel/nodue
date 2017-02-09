global.test = require('ava');

let Tester = require('./tester');

let jsUnit = new Tester(process);

jsUnit.boot();

jsUnit.test();