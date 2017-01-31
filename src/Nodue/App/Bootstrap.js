module.exports = class Bootstrap
{
	/**
	 * The bootstrap tasks for Nodue.
	 */
	get tasks()
	{
		return [
			'loadFsModule',
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
		let databaseConfig = app.getConfig('database');
		let defaultConfig = databaseConfig['connections'][databaseConfig['default']];


		if (defaultConfig['driver'] == 'sqlite') {
			defaultConfig['filename'] = defaultConfig['database'];
		}

		global.db = require('knex')({
			client: 'sqlite3', //defaultConfig['driver'],
			connection: {
				filename: database_path('database.sqlite'),
				// host: defaultConfig['host'],
				// user: defaultConfig['user'],
				// password: defaultConfig['password'],
				// database: defaultConfig['database'],
				// charset: defaultConfig['charset'],
			},
			useNullAsDefault: true
		});

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
			// Inpect url and check files to watch
			hotReload.inspectEndpoint(endpoint);
		};

		hotReload.start();
	}
}