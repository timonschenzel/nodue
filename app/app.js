module.exports = class App
{
	constructor(nodueFiles, appFiles)
	{
		this.nodueFiles = nodueFiles;
		this.appFiles = appFiles;
		this.proxyParts = [];
	}

	get(target, key)
	{

	}

	set(target, key, value)
	{

	}

	make(expression)
	{
		var object = this.resolve(expression);

		return new object;
	}

	resolve(expression)
	{
		let parts = expression.split('.');

		// Search in app folder
		var object = this.appFiles;

		for(var part of parts) {
			if(object != undefined && object.hasOwnProperty(part)) {
				object = object[part];
			} else {
				object = undefined;
			}
		}

		if(object != undefined) {
			return object;
		}

		// Search in Nodue folder
		var object = this.nodueFiles;

		for(var part of parts) {
			if(object != undefined && object.hasOwnProperty(part)) {
				object = object[part];
			} else {
				object = undefined;
			}
		}

		if(object != undefined) {
			return object;
		}

		return 'not found!';
	}

	addProxyPart(property)
	{
		this.proxyParts.push(property);
	}

	bootstrap(model)
	{
		global.Route = new Nodue.Router.Router;

		require('../routes');
	}
}