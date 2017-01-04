module.exports = class FileLoader
{
	constructor()
	{
		this.loader = require('auto-loader');
	}

	load(path)
	{
		if(fs.lstatSync(path).isDirectory() == false) {
			return require(app.basePath + path);
		}

		return this.loader.load(app.basePath + path);
	}

	loadFrom(path)
	{
		return this.load(path);
	}
}