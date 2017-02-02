module.exports = class HotReload
{
	constructor()
	{
		this.endpoints = [];

		this.controllers = [];

		this.views = [];

		this.behaviors = [];

		this.pages = {};
	}

	start()
	{
		chokidar.watch(app.basePath, { ignored: /(^|[\/\\])\..|\/node_modules|\/database/ }).on('all', async (event, path) => {
			if (fs.lstatSync(path).isFile()) {
				let url = false;
				
				if (this.views[path] !== undefined) {
					url = this.views[path];
				}

				if (this.behaviors[path] !== undefined) {
					url = this.behaviors[path];
				}

				if (this.controllers[path] !== undefined) {
					url = this.controllers[path];
					// Delete reference in cache
					delete require.cache[require.resolve(path)];
					// Renew the object in cache
					require(path);
				}

				let viewPath = app.path(path.split(app.basePath)[1]);
			 	let page = this.pages[url];
			 	let template = fs.readFileSync(path, 'utf8');

			 	if (page) {
			 		request.track({ url });
			 		let response = await app.handle(request);

			 		response.name = page + '-' + this.createHash(template);
			 		response.hot = true;

				 	server.io.to('page.' + url).emit('pageRequest', response);
			 	}
		 	}
		});
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

			this.endpoints[endpoint] = {
				view: viewPath,
				controller: controllerPath,
				behavior: behaviorPath,
			};

			this.controllers[controllerPath] = endpoint;
			this.views[viewPath] = endpoint;
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
}