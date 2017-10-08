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
		this.componentPrefix = app.config('components.prefix');
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
			
			Server.io.sockets.emit('templateUpdate', {
				name: layoutName,
				template: newTemplate,
			});

			if (HotReload.layouts[layoutName]) {
				HotReload.layouts[layoutName].forEach(async endpoint => {
					Request.track({url: endpoint});
					let response = await app.handle(Request);
					response.name = HotReload.pages[endpoint] + '-' + HotReload.createHash(newTemplate);
					response.hot = true;
					Server.io.to('page.' + endpoint).emit('pageRequest', response);
				});
			}
		});

		chokidar.watch(this.globalComponentsFolder).on('all', async (event, file) => {
			if (fs.lstatSync(file).isFile() && app.isRunning) {
				this.compileGlobalComponents();

				let extension = path.extname(file);
				let componentName = path.basename(file, extension).toLowerCase();
				if (this.componentPrefix) {
					componentName = `n-${componentName}`;
				}

				let globalComponents = require(this.globalCacheFolder);
				app.hotReloadSuffix = new Date().getTime();

				Server.io.sockets.emit('componentUpdate', {
					name: `${componentName}-${app.hotReloadSuffix}`,
					component: globalComponents[componentName],
				});

				Request.track({url: '/'});
				let response = await app.handle(Request);
				response.name = HotReload.pages['/'] + '-' + new Date().getTime();
				response.hot = true;
				Server.io.to('page./').emit('pageRequest', response);
			}
		});
	}

	compileViewFile(file, suffix = false)
	{
		let viewPath = file.replace(this.viewsFolder, '');
		let viewCachePath = viewPath.replace('.vue', '.js');

		VueCompiler.compile({
			input: file,
			// Support for name flag
			output: this.viewsCacheFolder + viewCachePath,
			compileAsString: true,
			suffix: suffix,
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