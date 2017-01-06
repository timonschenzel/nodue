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
	},

	/**
	 * Class references.
	 */
	references: {
		Controller: 'Http.Controller',
	}
}