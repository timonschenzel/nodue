module.exports = class DependenciesBuilder
{
	build(object, overrides = [])
	{
		let constructorRegex = new RegExp(
		  /constructor\s?\((\s?.*\s?)\)/,
		  'gim'
		);

		let parameters = constructorRegex.exec(object.toString()) || '';

		if (parameters[1]) {
			parameters = parameters[1];
		} else {
			parameters = '';
		}

		let dependencies = DependenciesResolver.resolve(parameters, overrides);

		return new object(...dependencies);
	}

	resolve(closure, overrides = [])
	{
		let closureRegex = new RegExp(
		  /(function)?\s?\((\s?.*\s?)\)(\s)?(=>)?/,
		  'gim'
		);

		let parameters = closureRegex.exec(closure.toString()) || '';

		if (parameters[2]) {
			parameters = parameters[2];
		} else {
			parameters = '';
		}

		let dependencies = DependenciesResolver.resolve(parameters, overrides);

		return closure(...dependencies);
	}
}
