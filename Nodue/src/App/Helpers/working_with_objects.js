module.exports = {
	is_closure(object)
	{
		if (is_class(object)) {
			return false;
		}

		if (object.toString().match(/^function ([^\s]+)/)) {
		   return true;
		}

		if (object.toString().match(/(function)?\s?\((\s?.*\s?)\)(\s)?(=>)?/)) {
		   return true;
		}

		return false;
	},

	is_class(object)
	{
		if (object.toString().match(/class\s/)) {
		   return true;
		}

		if (object.toString().match(/constructor\s?\((\s?.*\s?)\)/)) {
		   return true;
		}

		return false;
	},

	is_instanceof(object, name)
	{
		if (typeof object != 'function') {
			return false;
		}

		return Object.getPrototypeOf(object) == name;
	}
}
