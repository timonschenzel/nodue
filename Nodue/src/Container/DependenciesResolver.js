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

		let typeHintObject = null;

		dependencies = DependenciesDetector.detectFrom(dependencies);

		collect(dependencies).forEach((dependency, dependencyName) => {
			if(overrides[dependencyName]) {
				resolvedDependencies.push(overrides[dependencyName]);
			} else if (dependency.type) {
				try {
					typeHintObject = DependenciesBuilder.build(this.strategies[this.defaultStrategyName](dependency.type));
				} catch(error) {
					typeHintObject = DependenciesBuilder.build(this.strategies['default'](dependency.type));
				}

				resolvedDependencies.push(typeHintObject);
			} else if (dependency.default) {
				if (/^\d+$/.test(dependency.default)) {
					dependency.default = parseInt(dependency.default);
				}
				
				resolvedDependencies.push(dependency.default);
			}
		});

		return resolvedDependencies;
	}
}