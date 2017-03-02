module.exports = class App
{
	constructor()
	{
		this.isBooted = false;
		this.isRunning = false;
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
		let tempConfig = {};

		if (Object.keys(this._config).length > 0) {
			tempConfig = this._config.raw;
		}
		
		tempConfig[name] = config;

		this._config = object(tempConfig);
	}

	config(expression = null)
	{
		if (Object.keys(this._config).length === 0) {
			return null;
		}

		if (! expression) {
			expression = 'app';
		}

		if (expression.includes('.') || expression.includes('/')) {
			let config = this._config.find(expression);

			if (! config) {
				return this._config.find('app.' + expression);
			}

			return config;
		}

		return this._config.get(expression).raw;
	}

	resetConfig()
	{
		this._config = {};
	}

	refreshConfig()
	{
		this.resetConfig();
		this.bootstrapper.loadConfigFiles();
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

	run()
	{
		app.isBooted = true;
		server.start();
		app.isRunning = true;
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

	loadCoreModules()
	{
		global.fs = require('fs');
		global.path = require('path');
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