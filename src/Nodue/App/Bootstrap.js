module.exports = class Bootstrap
{
	/**
	 * The bootstrap tasks for Nodue.
	 */
	get tasks()
	{
		return [
			'loadAppConfig',
			'loadFsModule',
			'loadChokidarModule',
			'autoload',
			'loadHelpers',
			'setupAliases',
			'setupInstances',
			'loadRoutes',
			'loadVue',
			'loadVueServerRenderer',
		];
	}

	loadAppConfig()
	{
		app.config = app.getConfig('app');
	}

	loadFsModule()
	{
		global.fs = require('fs');
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

	setupAliases()
	{
		for (let alias in app.config.aliases) {
			global[alias] = app.make(app.config.aliases[alias]);
		}
	}

	setupInstances()
	{
		for (let alias in app.config.instances) {
			global[alias] = app.resolve(app.config.instances[alias]);
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

	loadNodueFiles()
	{
		global.Nodue = app.fileLoader.loadFrom('src/Nodue');
	}

	loadAppFiles()
	{
		global.AppFiles = app.fileLoader.loadFrom('app');
	}
}