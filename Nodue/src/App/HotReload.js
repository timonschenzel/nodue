module.exports = class HotReload
{
	constructor()
	{
		this.endpoints = [];

		this.controllers = [];

		this.views = [];

		this.layouts = [];

		this.behaviors = [];

		this.pages = [];
	}

	start()
	{
		console.log('[info] Start hot reload feature.');

		chokidar.watch(app.basePath, { ignored: /(^|[\/\\])\..|\/node_modules|\/database|\/storage/ }).on('all', async (event, path) => {
			if (fs.lstatSync(path).isFile() && app.isRunning) {
				let urls = false;

				if (this.views[path] !== undefined) {
					urls = this.views[path];
				}

				if (this.behaviors[path] !== undefined) {
					urls = this.behaviors[path];
				}

				if (this.controllers[path] !== undefined) {
					urls = this.controllers[path];
					// Delete reference in cache
					delete require.cache[require.resolve(path)];
					// Renew the object in cache
					require(path);
				}

				if (urls && typeof urls == 'object') {
				 	urls.forEach(async (url) => {
			 			let viewPath = app.path(path.split(app.basePath)[1]);
			 		 	let page = this.pages[url];
			 		 	let template = fs.readFileSync(path, 'utf8');

			 		 	if (page) {
			 		 		await this.pushContentUpdate(url, page, template);
			 		 	}
				 	});
			 	}
		 	}
		});
	}

	async pushContentUpdate(url, page, template)
	{
 		request.track({ url });
 		let response = await app.handle(request);

 		if (typeof response == 'object') {
 			response.name = page + '-' + this.createHash(template);
 			response.hot = true;
 		}

	 	server.io.to('page.' + url).emit('pageRequest', response);
	}

	inspectEndpoint(endpoint)
	{
		let routeExpression = route.getRoutes[endpoint];

		if (typeof routeExpression === 'string') {
			let controllerName = request.findControllerName(routeExpression);
			let controllerFunctionName = request.findControllerFunctionName(routeExpression);
			let viewDir = this.findViewPath(controllerName);
			let controllerPath = app.path(`app/http/controllers/${controllerName}.js`);
			let viewPath = app.path(`resources/views/${viewDir}/${controllerFunctionName}.vue`);
			let behaviorPath = app.path(`resources/views/${viewDir}/${controllerFunctionName}.js`);
			let layoutName = this.findLayoutNameInViewfile(viewPath);

			this.endpoints[endpoint] = {
				view: viewPath,
				controller: controllerPath,
				behavior: behaviorPath,
				layout: layoutName,
			};

			if (! this.controllers[controllerPath]) {
				this.controllers[controllerPath] = [];
			}

			if (! this.views[viewPath]) {
				this.views[viewPath] = [];
			}

			this.controllers[controllerPath].push(endpoint);
			this.views[viewPath].push(endpoint);
			if (layoutName) {
				if (! this.layouts[layoutName]) {
					this.layouts[layoutName] = [];
				}

				this.layouts[layoutName].push(endpoint);
			}
			this.behaviors[behaviorPath] = endpoint;
			this.pages[endpoint] = viewDir + '_' + controllerFunctionName;
		}
	}

	findViewPath(controllerName)
	{
		return controllerName.replace('Controller', '').toLowerCase();
	}

	createHash(string)
	{
		string += new Date().getTime();

	    let hash = 0;

	    if (string.length == 0) {
	    	return hash;
	    }

	    for (let i = 0; i < string.length; i++) {
	        let char = string.charCodeAt(i);
	        hash = ((hash << 5) - hash) + char;
	        hash = hash & hash;
	    }

	    return hash;
	}

	findLayoutNameInViewfile(filePath)
	{
		if (! fs.existsSync(filePath)) {
			return;
		}

		let viewContent = fs.readFileSync(filePath, 'utf8');

		let layoutRegex = null;
		let layoutName = null;
		let regex = new RegExp(
		  /<([A-Z])\w+-layout>/,
		  'gim'
		);

		while (layoutRegex = regex.exec(viewContent)) {
			layoutName = layoutRegex[0];
			layoutName = layoutName.replace('<', '');
			layoutName = layoutName.replace('>', '');
		}

		return layoutName;
	}
}