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

	async capture(expression, parameters = [])
	{
		if (! expression) {
			return '404';
		}

		if(typeof expression == 'function') {
			return await expression(...parameters);
		}

		if(typeof expression == 'string') {
			return await this.handle(expression, parameters);
		}
	}

	async handle(expression, parameters = [])
	{
		let controllerName = this.findControllerName(expression);
		let controllerFunctionName = this.findControllerFunctionName(expression);

		let controller = app.loadController(controllerName);
		
		let response = await controller[controllerFunctionName](...parameters);

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