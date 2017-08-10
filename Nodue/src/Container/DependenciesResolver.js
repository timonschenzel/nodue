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
		let resolvedDependencies = {};
		let resolvedDependency = null;
		let typeHintObject = null;

		dependencies = DependenciesParser.parse(dependencies);

		collect(dependencies).forEach((dependency, dependencyName) => {
			resolvedDependency = null;

			if(overrides[dependencyName]) {
				resolvedDependency = overrides[dependencyName];
			} else if (dependency.type) {
				try {
					typeHintObject = DependenciesBuilder.build(this.strategies[this.defaultStrategyName](dependency.type));
				} catch(error) {
					typeHintObject = DependenciesBuilder.build(this.strategies['default'](dependency.type));
				}

				resolvedDependency = typeHintObject;
			} else if (dependency.default) {
				if (/^\d+$/.test(dependency.default)) {
					dependency.default = parseInt(dependency.default);
				}

				resolvedDependency = dependency.default;
			}

			resolvedDependencies[dependencyName] = resolvedDependency;
		});

		return resolvedDependencies;
	}
}
