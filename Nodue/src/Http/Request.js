module.exports = class Request
{
	constructor()
	{
		this.incommingRequest = [];
		this.url = null;
	}

	track(incommingRequest)
	{
		if (incommingRequest.url == null) {
			incommingRequest.url = '/';
		}

		this.incommingRequest = incommingRequest;
		this.url = this.incommingRequest.url;

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
		let handler = routing.handler();
		let parameters = routing.parameters();

		let controllerName = this.findControllerName(handler);
		let controllerFunctionName = this.findControllerFunctionName(handler);

		// Add support for constructor injection
		let controller = build(app.loadController(controllerName));
		
		// Add support for route model binding
		let dependencies = resolve(controller[controllerFunctionName]);

		collect(dependencies).forEach((dependency, dependencyName) => {
			// Route model binding -> refactor, move into Router class
			if (dependency != null && typeof dependency == 'object' && is_instanceof(dependency.constructor, NativeModel) && parameters[dependencyName]) {
				parameters[dependencyName] = dependency.find(parameters[dependencyName]);
			}
		});

		let response = await build(controller[controllerFunctionName], parameters);

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