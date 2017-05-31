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

	providers: [
		'Database.DatabaseServiceProvider',
	],

	/**
	 * Class instances.
	 */
	instances: {
		DB: function(app) {
			return app.make('db');
		},
		Route: 'Router.Router',
		Request: 'Http.Request',
		Server: 'App.Server',
		HotReload: 'App.HotReload',
		AssetsCompiler: 'AssetsCompiler.Compiler',
		DependenciesBuilder: 'Container.DependenciesBuilder',
		DependenciesResolver: 'Container.DependenciesResolver',
		DependenciesDetector: 'Container.DependenciesDetector',
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