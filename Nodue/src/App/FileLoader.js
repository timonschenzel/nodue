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

	fileExists(path)
	{
		try {
			return fs.lstatSync(path).isFile();
		} catch (e) {
			return false;
		}
	}

	directoryExists(path)
	{
		try {
			return fs.lstatSync(path).isDirectory();
		} catch (e) {
			return false;
		}
	}
}