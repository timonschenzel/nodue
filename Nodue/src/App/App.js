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
		this.bindings = {};
		this.instances = {};
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
		Server.start();
	}

	async handle(request)
	{
		let routing = Route.direct(request);

		let response = request.capture(routing);

		return response;
		// return this.make('Http.Response', response);
	}

	make(expression, ...parameters)
	{
		let binding = this.build(expression);

		if (binding.shared) {
			if (! this.instances[binding.path]) {
				if (typeof binding.concrete == 'object') {
					this.instances[binding.path] = binding.concrete;
				} else {
					this.instances[binding.path] = new binding.concrete;
				}
			}

			return this.instances[binding.path];
		}

		if (typeof binding.concrete == 'function' && is_closure(binding.concrete)) {
			binding.concrete = binding.concrete(app);
		}

		if (parameters.length == 0) {
			if (typeof binding.concrete == 'object') {
				return binding.concrete;
			}

			return new binding.concrete;
		} else {
			if (typeof binding.concrete == 'object') {
				return binding.concrete(...parameters);
			}

			return new binding.concrete(...parameters);
		}
	}

	resolve(expression)
	{
		return this.build(expression).concrete;
	}

	build(expression)
	{
		if (typeof expression == 'string') {
			expression = expression.replace('/', '.');
		}

		if (this.bindings[expression]) {
			return this.bindings[expression];
		}

		if (typeof expression == 'function') {
			return {
				concrete: expression(app),
				shared: false,
			}
		}

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
			return {
				concrete: object,
				shared: false,
			};
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
			return {
				concrete: object,
				shared: false,
			};
		}

		throw new Error(`Binding [${expression}] was not found.`);
	}

	bind(abstract, concrete = null, shared = false)
	{
		if (concrete == null) {
			concrete = abstract;
		}

		let path = abstract.replace('/', '.');

		this.bindings[path] = {
			concrete,
			shared,
			path,
		};
	}

	singleton(abstract, concrete = null)
	{
		this.bind(abstract, concrete, true);
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

		app.isBooted = true;
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

	getClass(path, ...parameters)
	{
		let object = require(path);
		return new object(parameters);
	}

	loadController(name)
	{
		return this.resolve(`http.controllers.${name}`);
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

	directoryExists(path)
	{
		return this.fileLoader.directoryExists(app.path(path));
	}

	fileExists(path)
	{
		return this.fileLoader.fileExists(app.path(path));
	}

	globalComponentExists(name)
	{
		return this.fileExists(app.config('components.globalFolder') + '/' + name);
	}
}