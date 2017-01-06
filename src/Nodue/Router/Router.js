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

		if (! expression) {
			if (url.startsWith('/')) {
				url = url.slice(1);
			} else {
				url = '/' + url;
			}

			return this.getRoutes[url];
		}

		return expression;
	}
}