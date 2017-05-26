module.exports = class DependenciesResolver
{
	resolve(dependencies = '', overrides = [])
	{
		let resolvedDependencies = [];

		dependencies = this.parse(dependencies);

		let typeHint = null;
		let typeHintObject = null;
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
			} else {
				dependencyDefaultValue = null;
			}

			if(overrides[dependencyName]) {
				resolvedDependencies.push(overrides[dependencyName]);
			} else if (typeHint) {
				// Add try catch
				typeHintObject = DependenciesBuilder.build(eval(typeHint));

				resolvedDependencies.push(typeHintObject);
			} else if (dependencyDefaultValue) {
				if (/^\d+$/.test(dependencyDefaultValue)) {
					dependencyDefaultValue = parseInt(dependencyDefaultValue);
				}
				
				resolvedDependencies.push(dependencyDefaultValue);
			}
		});

		return resolvedDependencies;
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