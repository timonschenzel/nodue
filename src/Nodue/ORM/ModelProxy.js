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

		if (typeof target.model[property] == 'function') {
			return function(...args) {
			   return target.model[property](args);
			};
		}

		if (target.model[property] !== undefined) {
			return target.model[property];
		}
	}
};