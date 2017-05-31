module.exports = class DependenciesDetector
{
	isClosure(dependency)
	{
		if (dependency.toString().match(/class\s/)) {
		   return false;
		}

		if (dependency.toString().match(/constructor\s?\((\s?.*\s?)\)/)) {
		   return false;
		}

		if (dependency.toString().match(/(function)?\s?\((\s?.*\s?)\)(\s)?(=>)?/)) {
		   return true;
		}

		return false;
	}

	isClass(dependency)
	{
		if (dependency.toString().match(/class\s/)) {
		   return true;
		}

		if (dependency.toString().match(/constructor\s?\((\s?.*\s?)\)/)) {
		   return true;
		}

		return false;
	}

	detectFrom(dependency)
	{
		let parsedDependencies = {};
		let regex = null;
		let parameters = null;

		if (this.isClass(dependency)) {
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

		if (this.isClosure(dependency)) {
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

		let dependencies = this.parse(parameters);
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

	parse(dependencies = '')
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