module.exports = class Router
{
	constructor()
	{
		this._uri = [];
		this._handler = null;
		this.getRoutes = [];
		this.postRoutes = [];
		this._parameters = [];
		this._parameterNames = [];
	}

	uri()
	{
		return this._uri;
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
		this._parameters = [];
		this._parameterNames = [];

		this._url = this.normalize(url);

		this._handler = this.getRoutes[this._url];

		if (! this._handler) {
			this.findMatch();
		}

		return this;
	}

	normalize(url)
	{
		if (! url.startsWith('/')) {
			url = '/' + url;
		}

		return url;
	}

	findMatch()
	{
		let urlParts = this.getParts(this._url);
		let parameterName = null;

		for (let route in this.getRoutes) {
			parameterName = null;

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
					parameterName = routeParts[count].replace('{', '').replace('}', '');

					this._parameters[parameterName] = urlParts[urlPart];
					this._parameterNames.push(parameterName);
				}

				count++;
			}

			if (match) {
				this._handler = this.getRoutes[route];
				return;
			}
		}
	}

	parameters()
	{
		return this._parameters;
	}

	parameterNames()
	{
		return this._parameterNames;
	}

	handler()
	{
		return this._handler;
	}

	getParts(url)
	{
		let parts = url.split('/');

		parts.shift();

		return parts;
	}
}