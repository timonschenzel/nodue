module.exports = class DependenciesBuilder
{
	build(dependency, overrides = [])
	{
		let dependencies = DependenciesResolver.resolve(dependency, overrides);

		if (is_class(dependency)) {
			return new dependency(...dependencies);
		}

		return dependency(...dependencies);
	}

	resolve(dependency, overrides = [])
	{
		let dependencies = DependenciesResolver.resolve(dependency, overrides);

		
		return dependency(...dependencies);
	}
}
