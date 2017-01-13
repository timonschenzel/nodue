let app = require('../src/Nodue/App/App');
let proxy = require('../src/Nodue/App/Proxy');

module.exports = new Proxy(new app(), proxy);

global.env = function(key, override = false)
{
	let value = process.env[key.toUpperCase()];

	if (! value) {
		return override;
	}

	return value;
}