module.exports = {
	is_closure(object)
	{
		if (object.toString().match(/^function ([^\s]+)/)) {
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
