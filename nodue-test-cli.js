let test = require('ava');

let exec = require('child_process').exec;

// Bootstrap nodue
global.app = require('./bootstrap/app');

app.basePath = __dirname;

app.bootstrap();

// Load test files
let tests = app.fileLoader.loadFrom('Nodue/tests');

let TestClass = new tests.App.App;

for (let name of Object.getOwnPropertyNames(Object.getPrototypeOf(TestClass))) {
    let method = TestClass[name];
    // Supposedly you'd like to skip constructor
    if ( ! method instanceof Function || method === TestClass || name == 'constructor') {
    	continue;
    }

    let testContext = TestClass[name].toString();

    testContext = testContext.replace(name + '()', '');
    testContext = testContext.trim();
    testContext = testContext.substring(1, testContext.length - 1);
    testContext = testContext.trim();
    testContext = testContext.replace('this', 't');

    test(name, t => {
    	let func = new Function(testContext);
    	func();
    });
}