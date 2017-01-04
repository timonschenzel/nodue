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
		Route: 'Router.Router',
	},

	/**
	 * Class references.
	 */
	references: {
		Controller: 'Http.Controller',
	}
}