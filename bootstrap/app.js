let app = require('../Nodue/src/App/App');
let proxy = require('../Nodue/src/App/Proxy');

module.exports = new Proxy(new app(), proxy);