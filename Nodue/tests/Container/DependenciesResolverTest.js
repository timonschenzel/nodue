module.exports = class DependenciesResolverTest extends TestCase
{
	/** @test */
	parsing_given_dependencies()
	{
		global.Foo = Foo;
		global.Bar = Bar;
		global.Baz = Baz;

		let dependencies = DependenciesResolver.getParsedDepencencies(Foo);

		this.assertEquals({
			bar: {
				type: 'Bar',
				defaultValue: null,
			},
			number: {
				type: null,
				defaultValue: 123,
			}
		}, dependencies);
	}
}

class Foo
{
	constructor(/*Bar*/ bar, number = 123)
	{
		this.bar = bar;
		this.number = number;
	}

	say()
	{
		return 'foo';
	}
}

class Bar
{
	constructor(/*Baz*/ baz)
	{
		this.baz = baz;
	}

	say()
	{
		return 'bar';
	}
}

class Baz
{
	say()
	{
		return 'baz';
	}
}
