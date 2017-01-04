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
			'autoload',
			'loadHelpers',
			'setupAliases',
			'setupReferences',
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

	loadNodueFiles()
	{
		global.Nodue = app.fileLoader.loadFrom('src/Nodue');
	}

	loadAppFiles()
	{
		global.AppFiles = app.fileLoader.loadFrom('app');
	}
}