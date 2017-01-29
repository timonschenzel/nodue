module.exports = {
	get(target, property)
	{
		if (property in target) {
		    return target[property];
		} else if (typeof property == 'string') {
			if (target.hasOwnProperty(property)) {
				return target.property;
			}
		} else if (property in target.model) {
			return target.model[property];
		} else if (typeof property == 'string') {
			if (target.model.hasOwnProperty(property)) {
				return target.model.property;
			}
		}
	}
};