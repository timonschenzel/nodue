let app = require('../src/Nodue/App/App');
let proxy = require('../src/Nodue/App/Proxy');

module.exports = new Proxy(new app(), proxy);