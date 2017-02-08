module.exports = class App
{
	constructor()
	{
		this._basePath = false;
		this._config = {};
		this._hot = false;
		this.bootstrapper = this.getClass('./Bootstrap');
		this.fileLoader = this.getClass('./FileLoader');
	}

	set basePath(basePath)
	{
		this._basePath = basePath + '/';
	}

	get basePath()
	{
		return this._basePath;
	}

	registerConfig(name, config)
	{
		this._config[name] = config;
	}

	config(path = null)
	{
		if (! path) {
			path = 'app';
		}

		return this.getConfig(path);
	}

	resetConfig()
	{
		this._config = {};
	}

	get hot()
	{
		return this._hot;
	}

	set hot(hot)
	{
		this._hot = hot;
	}

	path(additionalPath)
	{
		return path.normalize(this.basePath + additionalPath);
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

	run()
	{
		server.start();
	}

	async handle(request)
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

	bind(object, expression)
	{
		let parts = expression.split('.');
		let objectName = parts.pop();

		let appfilesClone = AppFiles;
		let appFileClonePointer = appfilesClone;

		for (let count = 0; count < parts.length; count++) {
			if (count == parts.length - 1) {
				// appfilesClone[parts[count]] = object;
				appfilesClone[parts[count]][objectName] = object;
			} else {
				appfilesClone[parts[count]] = AppFiles[parts[count]];
			}

			appfilesClone = appfilesClone[parts[count]];
		}
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
		let fileName = path;

		if (path.includes('.') || path.includes('/')) {
			path = path.replace('/', '.');

			let parts = path.split('.');

			fileName = parts.shift();

			path = parts.join('.');

			let config = this.getFile(`config/${fileName}`);

			return this.retrieveObjectProperyWithExpression(config, path);
		}

		return this.getConfigFile(path);
	}

	getConfigFile(fileName)
	{
		return this.getFile(`config/${fileName}`);
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

	loadHelpersFrom(helper)
	{
		if (typeof helper == 'string') {
			helper = this.resolve(helper);
		}

		for(var file in helper) {
			for(var functionName in helper[file]) {
				global[functionName] = helper[file][functionName];
			}
		}
	}
}