module.exports = class Compiler
{
	constructor()
	{
		this.layoutsFolder = app.config('resources.layoutsFolder');
		this.layoutsCacheFile = app.config('resources.layoutsCacheFile');
	}

	watchChanges()
	{
		chokidar.watch(app.path(this.layoutsFolder)).on('all', async (event, path) => {
			if (fs.lstatSync(path).isFile() && app.isRunning) {
				this.compileLayoutFiles();
			}
		});
	}

	compileLayoutFiles()
	{
		let fs = require('fs');
		let files = fs.readdirSync(app.path(this.layoutsFolder));

		let layoutTemplates = [];
		let layoutTemplatesString = 'module.exports = {';
		files.forEach(file => {
			let name = file.replace('.vue', '') + '-layout';
			let content = fs.readFileSync(`./${this.layoutsFolder}/${file}`, 'utf8');
			layoutTemplates[name] = content;

			layoutTemplatesString += "'" + name + "': `" + content + "`,"
		});
		layoutTemplatesString += '};'

		fs.writeFileSync(this.layoutsCacheFile, layoutTemplatesString);
	}
}