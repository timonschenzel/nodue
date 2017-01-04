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

	direct(url)
	{
		let expression = this.getRoutes[url];

		if(typeof expression == 'function') {
			return expression();
		}

		if(typeof expression == 'string') {
			return this.handler(expression);
		}
	}

	handler(expression)
	{
		let parts = this.parse(expression);

		let controller = this.loadController(parts[0]);
		controller[parts[1]]();
	}

	loadController(name)
	{
		return app.make(`http.controllers.${name}`);
		// new app.http.controllers[name];
	}

	parse(expression)
	{
		return expression.split('@');
	}
}