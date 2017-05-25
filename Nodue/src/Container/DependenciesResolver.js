module.exports = class DependenciesResolver
{
	resolve(dependencies = '')
	{
		let resolvedDependencies = [];

		dependencies = this.parse(dependencies);

		let typeHint = null;
		let typeHintObject = null;

		dependencies.forEach(dependency => {
			if (dependency.includes(' ')) {
				typeHint = dependency.split(' ')[0];

				// Add try catch
				typeHintObject = DependenciesBuilder.build(eval(typeHint));

				resolvedDependencies.push(typeHintObject);
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