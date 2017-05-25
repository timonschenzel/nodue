module.exports = class Router
{
	constructor()
	{
		this.getRoutes = [];
		this.postRoutes = [];
	}

	get(url, action)
	{
		url = this.normalize(url);

		this.getRoutes[url] = action;
	}

	post(url, action)
	{
		url = this.normalize(url);

		this.postRoutes[url] = action;
	}

	getEndpoints()
	{
		return this.getRoutes;
	}

	postEndpoints()
	{
		return this.postRoutes;
	}

	direct(url)
	{
		url = this.normalize(url);

		let expression = this.getRoutes[url];
		let route = expression;

		if (! route) {
			return this.findMatch(url);
		}

		return {
			expression: route,
			parameters: [],
		};
	}

	normalize(url)
	{
		if (! url.startsWith('/')) {
			url = '/' + url;
		}

		return url;
	}

	findMatch(url)
	{
		let urlParts = this.getParts(url);
		let parameters = [];
		let namedParameters = {};

		for (let route in this.getRoutes) {
			parameters = [];
			let namedParameters = {};

			let routeParts = this.getParts(route);

			if (urlParts.length != routeParts.length) {
				continue;
			}

			let match = true;
			let count = 0;
			for (let urlPart in urlParts) {
				if (urlParts[urlPart] != routeParts[count] && ! routeParts[count].includes('{')) {
					match = false;
				}

				if (routeParts[count].includes('{')) {
					parameters.push(urlParts[urlPart]);
					namedParameters[routeParts[count].replace('{', '').replace('}', '')] = urlParts[urlPart];
				}

				count++;
			}

			if (match) {
				return {
					expression: this.getRoutes[route],
					parameters: parameters,
					namedParameters: namedParameters,
				};
			}
		}

		return {
			expression: null,
			parameters: null,
		};
	}

	getParts(url)
	{
		let parts = url.split('/');

		parts.shift();

		return parts;
	}
}