module.exports = class App
{
	constructor()
	{
		this._basePath = false;
		this._config = false;
		this.bootstrapper = this.getClass('./Bootstrap');
		this.fileLoader = this.getClass('./FileLoader');

		// this.nodueFiles = nodueFiles;
		// this.appFiles = appFiles;
		// this.proxyParts = [];
	}

	set basePath(basePath)
	{
		this._basePath = basePath + '/';
	}

	get basePath()
	{
		return this._basePath;
	}

	get config()
	{
		return this._config;
	}

	set config(config)
	{
		this._config = config;
	}

	path(additionalPath)
	{
		return this.basePath + additionalPath;
	}

	fetchConfig(expression)
	{
		return this.retrieveObjectProperyWithExpression(this.config, expression);
	}

	retrieveObjectProperyWithExpression(object, expression)
	{
		let parts = expression.split('.');

		for(var part of parts) {
			if(object != undefined && object.hasOwnProperty(part)) {
				object = object[part];
			} else {
				object = undefined;
			}
		}

		return object;
	}

	get(target, key)
	{

	}

	set(target, key, value)
	{

	}

	run()
	{
		server.start();
	}

	handle(request)
	{
		let requestExpression = route.direct(request.url);

		let response = request.capture(requestExpression);

		return response;
		// return this.make('Http.Response', response);
	}

	make(expression, ...parameters)
	{
		let object = this.resolve(expression);

		if (parameters.length == 0) {
			return new object;
		} else {
			return new object(...parameters);
		}
	}

	resolve(expression)
	{
		expression = expression.replace('/', '.');

		let parts = expression.split('.');

		// Search in app folder
		var object = AppFiles;

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
		var object = Nodue;

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

	bootstrap()
	{
		this.bootstrapper.tasks.forEach(task => {
			this.runBootstrapTask(task);
		});
	}

	runBootstrapTask(task)
	{
		if(typeof this.bootstrapper[task] == 'function') {
			this.bootstrapper[task]();
		} else {
			console.log(`Bootstrap task [${task}] was not found.`);
		}
	}

	getFile(path)
	{
		return require(this.basePath + path);
	}

	getConfig(path)
	{
		return this.getFile(`config/${path}`);
	}

	getClass(path)
	{
		let object = require(path);
		return new object;
	}

	loadController(name)
	{
		return this.make(`http.controllers.${name}`);
	}
}