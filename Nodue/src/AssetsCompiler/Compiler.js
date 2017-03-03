module.exports = class Compiler
{
	constructor()
	{
		this.layoutsFolder = app.path(app.config('resources.layoutsFolder'));
		this.layoutsCacheFile = app.path(app.config('resources.layoutsCacheFile'));
		this.globalComponentsFolder = app.path(app.config('components.globalFolder'));
		this.globalCacheFolder = app.path(app.config('components.globalCacheFolder'));
	}

	watchChanges()
	{
		chokidar.watch(this.layoutsFolder).on('all', async (event, path) => {
			if (fs.lstatSync(path).isFile() && app.isRunning) {
				this.compileLayoutFiles();
			}
		});

		chokidar.watch(this.globalComponentsFolder).on('all', async (event, path) => {
			if (fs.lstatSync(path).isFile() && app.isRunning) {
				this.compileGlobalComponents();
			}
		});
	}

	compileGlobalComponents()
	{
		VueComponentCompiler.compile({
			input: this.globalComponentsFolder,
			output: this.globalCacheFolder,
		});
	}

	compileLayoutFiles()
	{
		VueComponentCompiler.compile({
			input: this.layoutsFolder,
			output: this.layoutsCacheFile,
			suffix: '-layout',
		});
	}
}