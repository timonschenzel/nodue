module.exports = class DependenciesParser
{
	parse(dependency)
	{
		let parsedDependencies = {};
		let regex = null;
		let parameters = null;

		if (is_class(dependency)) {
			regex = new RegExp(
			  /constructor\s?\((\s?.*\s?)\)/,
			  'gim'
			);

			parameters = regex.exec(dependency.toString()) || '';

			if (parameters[1]) {
				parameters = parameters[1];
			} else {
				parameters = '';
			}
		}

		if (is_closure(dependency)) {
			regex = new RegExp(
			  /(function)?\s?\((\s?.*\s?)\)(\s)?(=>)?/,
			  'gim'
			);

			parameters = regex.exec(dependency.toString()) || '';

			if (parameters[2]) {
				parameters = parameters[2];
			} else {
				parameters = '';
			}
		}

		let dependencies = this.parseParameters(parameters);
		let typeHint = null;
		let dependencyName = null;
		let dependencyDefaultValue = null;

		dependencies.forEach(dependency => {
			if (dependency.includes(' ')) {
				[typeHint, dependencyName] = dependency.split(' ');
			} else {
				typeHint = null;
				dependencyName = dependency;
			}

			if (dependencyName.includes('=')) {
				[dependencyName, dependencyDefaultValue] = dependencyName.split('=');

				if (/^\d+$/.test(dependencyDefaultValue)) {
					dependencyDefaultValue = parseInt(dependencyDefaultValue);
				}
			} else {
				dependencyDefaultValue = null;
			}

			parsedDependencies[dependencyName] = {
				type: typeHint,
				default: dependencyDefaultValue,
			};
		});

		return parsedDependencies;
	}

	parseParameters(dependencies = '')
	{
		if (dependencies == null) {
			dependencies = '';
		}

		return dependencies
			.replace(/\s/g,'')
			.replace(/\/\*/g, '')
			.replace(/\*\//g, ' ')
			.split(',');
	}
}