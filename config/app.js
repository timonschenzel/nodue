module.exports = {
	/**
	 * Specify the autoloading locations.
	 */
	autoload: {
		Nodue: 'src/Nodue',
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
	},

	/**
	 * Server port.
	 *
	 * @type {Number}
	 */
	port: 5000,
}