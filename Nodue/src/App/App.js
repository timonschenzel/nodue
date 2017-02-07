module.exports = class App
{
	constructor()
	{
		this._basePath = false;
		this._config = false;
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

	get config()
	{
		return this._config;
	}

	set config(config)
	{
		this._config = config;
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

		// for (var part of parts) {
		// 	target[part] = {};
		// 	target = target[part];
		// }

		// target = object;

		// console.log(target);

		// console.log(appFileClonePointer);
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