module.exports = class Bootstrap
{
	/**
	 * The bootstrap tasks for Nodue.
	 */
	get tasks()
	{
		return [
			'loadEnvFile',
			'loadAppConfig',
			'loadFsModule',
			'loadPathModule',
			'loadChokidarModule',
			'autoload',
			'loadHelpers',
			'setupInstances',
			'setupReferences',
			'loadRoutes',
			'loadVue',
			'loadVueServerRenderer',
			'startHotReload',
		];
	}

	loadEnvFile()
	{
		require('dotenv').config();
	}

	loadAppConfig()
	{
		app.config = app.getConfig('app');
	}

	loadFsModule()
	{
		global.fs = require('fs');
	}

	loadPathModule()
	{
		global.path = require('path');
	}

	loadChokidarModule()
	{
		global.chokidar = require('chokidar');
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
			let helperObject = app.resolve(helper);

			for(var file in helperObject) {
				for(var functionName in helperObject[file]) {
					global[functionName] = helperObject[file][functionName];
				}
			}
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

	loadNodueFiles()
	{
		global.Nodue = app.fileLoader.loadFrom('src/Nodue');
	}

	loadAppFiles()
	{
		global.AppFiles = app.fileLoader.loadFrom('app');
	}
}