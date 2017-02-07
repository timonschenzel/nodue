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
	},

	/**
	 * Class references.
	 */
	references: {
		Controller: 'Http.Controller',
		Model: 'ORM.Model',
		TestCase: 'Testing.TestCase',
	},

	/**
	 * Server port.
	 *
	 * @type {Number}
	 */
	port: env('PORT', 80),
}