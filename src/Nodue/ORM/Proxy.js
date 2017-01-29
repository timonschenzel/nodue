module.exports = {
	get(target, property)
	{
		if (property in target) {
		    return target[property];
		} else if (typeof property == 'string') {
			if (target.hasOwnProperty(property)) {
				return target.property;
			}
		} else if (property in target.bookshelf) {
			return target.bookshelf[property];
		} else if (typeof property == 'string') {
			if (target.bookshelf.hasOwnProperty(property)) {
				return target.bookshelf.property;
			}
		}
	}
};