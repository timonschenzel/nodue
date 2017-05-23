module.exports = {
	/**
	 * Specify the autoloading locations.
	 */
	autoload: {
		AppFiles: 'app',
	},

	/**
	 * Specify the helper locations.
	 */
	helpers: [
		'helpers',
		'Helpers',
	],

	/**
	 * Class instances.
	 */
	instances: {
		DB: function(app) {
			let sqlite3 = require('better-sqlite3');
			let connection = new sqlite3(database_path('database.sqlite'));

			return new Nodue.Database.Query.Builder(connection);
		},
		route: 'Router.Router',
		request: 'Http.Request',
		server: 'App.Server',
		hotReload: 'App.HotReload',
		AssetsCompiler: 'AssetsCompiler.Compiler',
	},

	/**
	 * Class references.
	 */
	references: {
		Controller: 'Http.Controller',
		Model: 'ORM.Model',
		NativeModel: 'ORM.NativeModel',
		TestCase: 'Testing.TestCase',
		VueComponent: 'App.VueComponent',
		VueTester: 'Testing.VueTester',
		VueCompiler: 'AssetsCompiler.VueCompiler',
		VueComponentCompiler: 'AssetsCompiler.VueComponentCompiler',
		VueComponentCompilerTasks: 'AssetsCompiler.VueComponentCompilerTasks',
	},

	/**
	 * Server port.
	 *
	 * @type {Number}
	 */
	port: env('PORT', 80),

	cacheFolder: './storage/framework/cache',

	resources: {
		viewsFolder: './resources/views',
		viewsCacheFolder: './storage/framework/cache/views',
		layoutsFolder: './resources/layouts',
		layoutsCacheFile: './storage/framework/cache/layout_templates.js',
	},

	components: {
		prefix: 'n',
		globalFolder: './resources/assets/js/components/global',
		globalCacheFolder: './storage/framework/cache/global_components.js',
	}
}