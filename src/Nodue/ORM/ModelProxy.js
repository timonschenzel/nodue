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

		if (target.model.hasOwnProperty(property)) {
			return target.model[property];
		}

		if (typeof target.model[property] == 'function') {
			return function(...args) {
			   return target.model[property](args);
			};
		}
	}
};