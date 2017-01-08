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
	 * Class aliasses.
	 */
	aliases: {
		route: 'Router.Router',
		request: 'Http.Request',
		server: 'App.Server',
	},

	/**
	 * Class instances.
	 */
	instances: {
		Controller: 'Http.Controller',
	},

	/**
	 * Server port.
	 *
	 * @type {Number}
	 */
	port: 80,
}