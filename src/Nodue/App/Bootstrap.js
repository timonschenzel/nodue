module.exports = class Bootstrap
{
	/**
	 * The bootstrap tasks for Nodue.
	 */
	get tasks()
	{
		return [
			'loadFsModule',
			'loadPluralizeModule',
			'loadEnvFile',
			'loadNodueFiles',
			'loadCoreHelpers',
			'loadAppConfig',
			'loadPathModule',
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
		global.Nodue = app.fileLoader.loadFrom('src/Nodue');
	}

	loadCoreHelpers()
	{
		let helpers = Nodue.App.Helpers;
		app.loadHelpersFrom(helpers);
	}

	loadAppConfig()
	{
		app.config = app.getConfig('app');
	}

	loadPathModule()
	{
		global.path = require('path');
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
		for (let alias in app.config.autoload) {
			global[alias] = app.fileLoader.loadFrom(app.config.autoload[alias]);
		}
	}

	loadHelpers()
	{
		app.config.helpers.forEach(helper => {
			app.loadHelpersFrom(helper);
		});
	}

	setupInstances()
	{
		for (let alias in app.config.instances) {
			global[alias] = app.make(app.config.instances[alias]);
		}
	}

	setupReferences()
	{
		for (let alias in app.config.references) {
			global[alias] = app.resolve(app.config.references[alias]);
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