module.exports = class Bootstrap
{
	/**
	 * The bootstrap tasks for Nodue.
	 */
	get tasks()
	{
		return [
			'loadFsModule',
			'loadSugarModule',
			'loadPluralizeModule',
			'loadEnvFile',
			'loadNodueFiles',
			'loadCoreHelpers',
			'loadPathModule',
			'loadConfigFiles',
			'loadChokidarModule',
			'initDatabaseConnection',
			'autoload',
			'loadHelpers',
			'setupInstances',
			'setupReferences',
			'loadModels',
			'loadRoutes',
			'loadVue',
			'loadVueServerRenderer',
			'startHotReload',
		];
	}

	loadFsModule()
	{
		global.fs = require('fs');
	}

	loadSugarModule()
	{
		global.Sugar = require('sugar');
	}

	loadPluralizeModule()
	{
		global.pluralize = require('pluralize')
	}

	loadEnvFile()
	{
		require('dotenv').config();
	}

	loadNodueFiles()
	{
		global.Nodue = app.fileLoader.loadFrom('Nodue/src');

		Nodue.Object = Sugar.Object;

		Nodue.Object.prototype.flattern = function() {
		  	let toReturn = {};

		  	for (let i in this.raw) {
		  		if (! this.has(i)) continue;

		  		if (typeof this[i] == 'object') {
		  			let flatObject = Nodue.Object(this[i]).flattern();

		  			if (flatObject.keys().length === 0) {
		  				toReturn[i] = this;
		  			} else {
			  			for (let x in flatObject.raw) {
			  				if (! flatObject.has(x)) continue;

			  				toReturn[i + '/' + x] = flatObject[x];
			  			}
		  			}
		  		} else {
		  			toReturn[i] = this[i];
		  		}
		  	}

		  	return toReturn;
	  	}

		let object = Nodue.Object({
			'test': 123,
			'foo': {
				'test': 123,
			}
		});

		// console.log(object.flattern());
	}

	loadCoreHelpers()
	{
		let helpers = Nodue.App.Helpers;
		app.loadHelpersFrom(helpers);

		// let boolean = false;
		// let nullable = null;
		// let undefinedable = undefined;
		// let number = 1;
		// let string = 'hit';
		// let object = {};
		// let array = [];

		// collect(boolean);
		// collect(nullable);
		// collect(undefinedable);
		// collect(number);
		// collect(string);
		// collect(object);
		// collect(array);
	}

	loadPathModule()
	{
		global.path = require('path');
	}

	loadConfigFiles()
	{
		app.resetConfig();

		let configFiles = app.fileLoader.loadFrom('./config');

		for (let configFile in configFiles) {
			app.registerConfig(configFile, configFiles[configFile]);
		}
	}

	loadChokidarModule()
	{
		global.chokidar = require('chokidar');
	}

	initDatabaseConnection()
	{
		let dbLoader = require('../Database/Database').init();

		global.db = require('knex')(dbLoader.settings());

		global.Bookshelf = require('bookshelf')(db);
	}

	autoload()
	{
		for (let alias in app.config().autoload) {
			global[alias] = app.fileLoader.loadFrom(app.config().autoload[alias]);
		}
	}

	loadHelpers()
	{
		app.config().helpers.forEach(helper => {
			app.loadHelpersFrom(helper);
		});
	}

	setupInstances()
	{
		for (let alias in app.config().instances) {
			global[alias] = app.make(app.config().instances[alias]);
		}
	}

	setupReferences()
	{
		for (let alias in app.config().references) {
			global[alias] = app.resolve(app.config().references[alias]);
		}
	}

	loadModels()
	{
		for (let model in AppFiles.models) {
			let modelInstance = app.make(`models.${model}`);
			global[model] = new Proxy(modelInstance, Nodue.ORM.Proxy);
		}
	}

	loadRoutes()
	{
		app.fileLoader.load('routes.js');
	}

	loadVue()
	{
		global.Vue = require('vue');
	}

	loadVueServerRenderer()
	{
		global.VueRenderer = require('vue-server-renderer').createRenderer();
	}

	startHotReload()
	{
		if (! process.argv.includes('hot')) {
			return;
		}

		app.hot = true;

		for (let endpoint in route.getEndpoints()) {
			hotReload.inspectEndpoint(endpoint);
		};

		hotReload.start();
	}
}