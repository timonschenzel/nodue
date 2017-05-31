module.exports = class DependenciesResolver
{
	constructor()
	{
		this.defaultStrategyName = null;
		this.strategies = {};

		this.registerDefaultResolveStrategy();
	}

	registerDefaultResolveStrategy()
	{
		this.registerDefaultStrategy('default', dependency => {
			return eval(dependency);
		});
	}

	registerStrategy(name, implementation, asDefault = false)
	{
		this.strategies[name] = implementation;

		if (asDefault) {
			this.defaultStrategyName = name;
		}
	}

	defaultStrategy(name)
	{
		this.defaultStrategyName = name;
	}

	registerDefaultStrategy(name, implementation)
	{
		this.registerStrategy(name, implementation, true);
	}

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
				try {
					let object = DependenciesBuilder.build(this.strategies[this.defaultStrategyName](typeHint));

					if (is_instanceof(object.constructor, NativeModel)) {
						// Route Model Binding
						resolvedDependencies.push(object.find(overrides[dependencyName]));
					} else {
						resolvedDependencies.push(overrides[dependencyName]);
					}
				} catch(error) {
					resolvedDependencies.push(DependenciesBuilder.build(this.strategies['default'](typeHint)));
				}
			} else if (typeHint) {
				try {
					typeHintObject = DependenciesBuilder.build(this.strategies[this.defaultStrategyName](typeHint));
				} catch(error) {
					typeHintObject = DependenciesBuilder.build(this.strategies['default'](typeHint));
				}

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

	getParsedDepencencies(object, overrides = [])
	{
		let parsedDependencies = {};

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
				defaultValue: dependencyDefaultValue,
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