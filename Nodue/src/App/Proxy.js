module.exports = {
	get(target, property)
	{
		if(property in target && typeof target[property] != 'function') {
		    return target[property];
		}

		if (typeof target[property] == 'function') {
			return function(...args) {

				return target[property](...args);
			}
		}

		if (target[property] !== undefined) {
			return target[property];
		}

		if('_' + property in target) {
		    return target['_' + property];
		}
	}
};