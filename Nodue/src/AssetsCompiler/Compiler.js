module.exports = class Compiler
{
	constructor()
	{
		this.viewsFolder = app.path(app.config('resources.viewsFolder'));
		this.viewsCacheFolder = app.path(app.config('resources.viewsCacheFolder'));
		this.layoutsFolder = app.path(app.config('resources.layoutsFolder'));
		this.layoutsCacheFile = app.path(app.config('resources.layoutsCacheFile'));
		this.globalComponentsFolder = app.path(app.config('components.globalFolder'));
		this.globalCacheFolder = app.path(app.config('components.globalCacheFolder'));
	}

	watchChanges()
	{
		chokidar.watch(this.viewsFolder).on('all', async (event, path) => {
			if (fs.lstatSync(path).isFile() && app.isRunning) {
				this.compileViewFile(path);
			}
		});

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

	compileViewFile(file)
	{
		VueCompiler.compile({
			input: file,
			// Support from name flag
			output: this.viewsCacheFolder + '/[name].js',
			compileAsString: true,
		});
	}

	compileGlobalComponents()
	{
		VueCompiler.compile({
			input: this.globalComponentsFolder,
			output: this.globalCacheFolder,
		});
	}

	compileLayoutFiles()
	{
		VueCompiler.compile({
			input: this.layoutsFolder,
			output: this.layoutsCacheFile,
			suffix: '-layout',
			globalPrefix: false,
			compileAsString: true,
		});
	}
}