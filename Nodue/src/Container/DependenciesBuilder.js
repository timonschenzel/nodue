module.exports = class DependenciesBuilder
{
	build(dependency, overrides = [])
	{
		let dependencies = DependenciesResolver.resolve(dependency, overrides);

		if (is_class(dependency)) {
			return new dependency(...Object.values(dependencies));
		}

		return dependency(...Object.values(dependencies));
	}

	resolve(dependency, overrides = [])
	{
		let dependencies = DependenciesResolver.resolve(dependency, overrides);
		
		return dependency(...Object.values(dependencies));
	}
}
