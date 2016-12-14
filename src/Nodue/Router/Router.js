module.exports = class Router
{
	constructor()
	{
		this.getRoutes = [];
		this.postRoutes = [];
	}

	get(url, action)
	{
		this.getRoutes[url] = action;
	}

	post(url, action)
	{
		this.postRoutes[url] = action;
	}

	gets()
	{
		return this.getRoutes;
	}

	posts()
	{
		return this.postRoutes;
	}

	route(url)
	{
		let expression = this.getRoutes[url];

		if(typeof expression == 'function') {
			return expression();
		}

		if(typeof expression == 'string') {
			return this.direct(expression);
		}
	}

	direct(expression)
	{
		let parts = this.parse(expression);

		let controller = this.loadController(parts[0]);
		controller[parts[1]]();
	}

	loadController(name)
	{
		return new App.Http.controllers[name];
	}

	parse(expression)
	{
		return expression.split('@');
	}
}