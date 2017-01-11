module.exports = class HotReload
{
	constructor()
	{
		this.endpoints = [];

		this.controllers = [];

		this.views = [];

		this.pages = {};
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

			this.endpoints[endpoint] = {
				view: viewPath,
				controller: controllerPath,
			};

			this.controllers[controllerPath] = endpoint;
			this.views[viewPath] = endpoint;
			this.pages[endpoint] = viewDir + '_' + controllerFunctionName;
		}
	}

	findViewPath(controllerName)
	{
		return controllerName.replace('Controller', '').toLowerCase();
	}
}