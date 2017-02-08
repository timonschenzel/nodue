global.test = require('ava');

// Bootstrap nodue
global.app = require('./bootstrap/app');

app.basePath = __dirname;

app.bootstrap();

// Load test files
let tests = app.fileLoader.loadFrom('Nodue/tests');

let TestClass = new tests.App.AppTest;

for (let name of Object.getOwnPropertyNames(Object.getPrototypeOf(TestClass))) {
    let method = TestClass[name];

    if ( ! method instanceof Function || method === TestClass || name == 'constructor' || ! name.startsWith('test')) {
    	continue;
    }

    TestClass.name = TestClass.constructor.name + ' -> ' + name;
    TestClass[name]();
}
