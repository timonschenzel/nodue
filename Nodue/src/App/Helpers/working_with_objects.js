module.exports = {
	is_closure(object)
	{
		if (object.toString().match(/^function ([^\s]+)/)) {
		   return true;
		}

		return false;
	},
}
