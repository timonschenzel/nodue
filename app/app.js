module.exports = class App
{
	constructor(nodueFiles, appFiles)
	{
		this.nodueFiles = nodueFiles;
		this.appFiles = appFiles;
	}

	__noSuchMethod__()
	{
		console.log('hit!');
	}

	bootstrap()
	{
		global.Route = new Nodue.Router.Router;

		require('../routes');
	}
}