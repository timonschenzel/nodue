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
		let expression = routing.expression;
		let parameters = routing.parameters;
		let namedParameters = routing.namedParameters;

		if (! expression) {
			return '404';
		}

		if(typeof expression == 'function') {
			return await build(expression, namedParameters);
		}

		if(typeof expression == 'string') {
			return await this.handle(expression, namedParameters);
		}
	}

	async handle(expression, namedParameters = [])
	{
		let controllerName = this.findControllerName(expression);
		let controllerFunctionName = this.findControllerFunctionName(expression);

		// Add support for constructor injection
		let controller = build(app.loadController(controllerName));
		
		// Add support for route model binding
		// let dependencies = parse(controller[controllerFunctionName]);

		// dependencies.forEach((dependencyInfo, dependency) => {
		// 	dump(dependencyInfo);
		// 	if (is_instanceof(object.constructor, NativeModel)) {
		// 		dump(dependencyInfo);
		// 	}
		// });

		let response = await build(controller[controllerFunctionName], namedParameters);

		return this.processResponse(response, expression);

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