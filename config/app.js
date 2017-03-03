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
		TestCase: 'Testing.TestCase',
		VueComponentCompiler: 'AssetsCompiler.VueComponentCompiler',
	},

	/**
	 * Server port.
	 *
	 * @type {Number}
	 */
	port: env('PORT', 80),

	resources: {
		layoutsFolder: './resources/layouts',
		layoutsCacheFile: './storage/framework/cache/layout_templates.js',
	},

	components: {
		globalFolder: './resources/assets/js/components/global',
		globalCacheFolder: './storage/framework/cache/global_components.js',
	}
}