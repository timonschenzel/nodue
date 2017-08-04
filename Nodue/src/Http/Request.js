module.exports = class Request
{
	constructor()
	{
		this.incommingRequest = [];
		this.url = null;
		this.type = null;
		this._data = null;
	}

	data(data)
	{
		this._data = data;
	}

	all()
	{
		return this._data;
	}

	track(incommingRequest)
	{
		if (incommingRequest.url == null) {
			incommingRequest.url = '/';
		}

		if (incommingRequest.type == null) {
			incommingRequest.type = 'get';
		}

		this.incommingRequest = incommingRequest;
		this.url = this.incommingRequest.url;
		this.type = incommingRequest.type;
		this._data = incommingRequest.data;

		if (! this.url.startsWith('/')) {
			this.url = '/' + this.url;
		}
	}

	async capture(routing)
	{
		let handler = routing.handler();
		let parameters = routing.parameters();

		if (! handler) {
			return '404';
		}

		if(typeof handler == 'function') {
			return await build(handler, parameters);
		}

		if(typeof handler == 'string') {
			return await this.handle(routing);
		}
	}

	async handle(routing)
	{
		let response = null;
		let handler = routing.handler();
		let parameters = routing.parameters();

		let controllerName = this.findControllerName(handler);
		let controllerFunctionName = this.findControllerFunctionName(handler);

		// Add support for constructor injection
		let controller = build(app.loadController(controllerName));
		
		// Add support for route model binding
		let dependencies = resolve(controller[controllerFunctionName]);
		let dependency = null;

		for (var dependencyName in dependencies) {
			dependency = dependencies[dependencyName];
			if (dependency != null && typeof dependency == 'object' && is_instanceof(dependency.constructor, Model) && parameters[dependencyName]) {
				parameters[dependencyName] = await dependency.find(parameters[dependencyName]);
				// parameters[dependencyName] = {id: 1, name: 'Product 1'};

				if (parameters[dependencyName] && parameters[dependencyName][0]) {
					parameters[dependencyName] = parameters[dependencyName][0];
				}
			}
		}

		try {
			response = await build(controller[controllerFunctionName], parameters);
		} catch(error) {
			return {
				error
			};
		}

		return this.processResponse(response, handler);
	}

	processResponse(response, expression)
	{
		if (response instanceof VueComponent == false) {
			expression = expression.replace('Controller', '');
			response = new VueComponent({
				type: typeof response,
				name: expression.split('@').join('-'),
				data: {data: response},
			});
		}

		if (typeof response == 'object') {
			response.url = this.url;
		}

		return response;
	}

	findControllerName(expression)
	{
		let parts = this.parse(expression);

		return parts[0];
	}

	findControllerFunctionName(expression)
	{
		let parts = this.parse(expression);

		return parts[1];
	}

	parse(expression)
	{
		return expression.split('@');
	}
}