module.exports = class Request
{
	constructor()
	{
		this.incommingRequest = [];
		this.url = null;
	}

	track(incommingRequest)
	{
		this.incommingRequest = incommingRequest;
		this.url = this.incommingRequest.url;

		if (! this.url.startsWith('/')) {
			this.url = '/' + this.url;
		}
	}

	capture(expression)
	{
		if (! expression) {
			return '404';
		}

		if(typeof expression == 'function') {
			return expression();
		}

		if(typeof expression == 'string') {
			return this.handle(expression);
		}
	}

	handle(expression)
	{
		let parts = this.parse(expression);

		let controller = app.loadController(parts[0]);
		
		return controller[parts[1]]();
	}

	parse(expression)
	{
		return expression.split('@');
	}
}