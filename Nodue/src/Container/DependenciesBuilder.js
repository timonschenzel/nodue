module.exports = class DependenciesBuilder
{
	build(dependency, overrides = [])
	{
		let dependencies = DependenciesResolver.resolve(dependency, overrides);

		return new dependency(...dependencies);
	}

	resolve(closure, overrides = [])
	{
		let dependencies = DependenciesResolver.resolve(closure, overrides);

		return closure(...dependencies);
	}
}
