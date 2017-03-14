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
		chokidar.watch(this.viewsFolder).on('all', async (event, file) => {
			if (fs.lstatSync(file).isFile() && path.extname(file) == '.vue' && app.isRunning) {
				this.compileViewFile(file);
			}
		});

		chokidar.watch(this.layoutsFolder).on('all', async (event, file) => {
			if (fs.lstatSync(file).isFile() && app.isRunning) {
				this.compileLayoutFiles();
			}

			// Push template update
			let layoutsCacheFilePath = app.path('storage/framework/cache/layout_templates.js');
			let layoutName = file.replace(this.layoutsFolder, '');
			layoutName = layoutName.replace('.vue', '');
			layoutName = layoutName.replace('/', '');
			layoutName = layoutName.replace('\\', '');
			layoutName = layoutName + '-layout';

			delete require.cache[require.resolve(layoutsCacheFilePath)];
			let newTemplates = require(layoutsCacheFilePath);
			let newTemplate = newTemplates[layoutName];
			
			server.io.sockets.emit('templateUpdate', {
				name: layoutName,
				template: newTemplate,
			});

			if (hotReload.layouts[layoutName]) {
				hotReload.layouts[layoutName].forEach(async endpoint => {
					request.track({url: endpoint});
					let response = await app.handle(request);
					response.name = hotReload.pages[endpoint] + '-' + hotReload.createHash(newTemplate);
					response.hot = true;
					server.io.to('page.' + endpoint).emit('pageRequest', response);
				});
			}
		});

		chokidar.watch(this.globalComponentsFolder).on('all', async (event, file) => {
			if (fs.lstatSync(file).isFile() && app.isRunning) {
				this.compileGlobalComponents();
			}
		});
	}

	compileViewFile(file)
	{
		let viewPath = file.replace(this.viewsFolder, '');
		let viewCachePath = viewPath.replace('.vue', '.js');

		VueCompiler.compile({
			input: file,
			// Support from name flag
			output: this.viewsCacheFolder + viewCachePath,
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