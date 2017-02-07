module.exports = {
	get(target, property)
	{
		if (typeof target[property] == 'function') {
			return function(...args) {
			   return target[property](args);
			};
		}

		if (target[property] !== undefined) {
			return target[property];
		}

		if (typeof target.bookshelf[property] == 'function') {
			return function(...args) {
			   return target.bookshelf[property](args);
			};
		}

		if (target.bookshelf[property] !== undefined) {
			return target.bookshelf[property];
		}
	}
};