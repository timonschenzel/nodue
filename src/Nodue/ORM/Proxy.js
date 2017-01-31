module.exports = {
	get(target, property)
	{
		if (target.hasOwnProperty(property)) {
			return target[property];
		}

		if (typeof target[property] == 'function') {
			return function(...args) {
			   return target[property](args);
			};
		}

		if (target.bookshelf.hasOwnProperty(property)) {
			return target.bookshelf[property];
		}

		if (typeof target.bookshelf[property] == 'function') {
			return function(...args) {
			   return target.bookshelf[property](args);
			};
		}
	}
};