module.exports = {
	get(target, property, receiver)
	{
		if (typeof target[property] == 'function') {
			return function(...args) {
			   return target[property](...args);
			};
		}

		if (target[property] !== undefined) {
			return target[property];
		}

		if (typeof target.bookshelf[property] == 'function') {
			return function(...args) {
			   	return new Proxy(target.bookshelf[property](...args), Nodue.ORM.Proxy);
			};
		}

		if (target.bookshelf[property] !== undefined) {
			return new Proxy(target.bookshelf[property], Nodue.ORM.Proxy);
		}
	},

	set(target, property, value, receiver)
	{
		if (target[property] !== undefined) {
			target[property] = value;
		} else {
			target['updates'][property] = value;
		}

		return value;
	}
};
