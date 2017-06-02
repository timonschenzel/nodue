module.exports = {
	parse(dependency)
	{
		return DependenciesParser.parse(dependency);
	},

	resolve(dependency, overrides = [])
	{
		return DependenciesResolver.resolve(dependency, overrides);
	},

	build(dependency, overrides = [])
	{
		return DependenciesBuilder.build(dependency, overrides);
	},
}
