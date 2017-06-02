module.exports = class DependenciesParserTest extends TestCase
{
	/** @test */
	parsing_dependencies_from_a_class()
	{
		global.Foo = Foo;
		global.Bar = Bar;
		global.Baz = Baz;

		let dependencies = parse(Foo);

		this.assertEquals({
			bar: {
				type: 'Bar',
				default: null,
			},
			number: {
				type: null,
				default: 123,
			}
		}, dependencies);
	}

	/** @test */
	parsing_dependencies_from_a_es5_closure()
	{
		global.Foo = Foo;
		global.Bar = Bar;
		global.Baz = Baz;

		let dependencies = parse(function(/*Foo*/ foo, number = 123) {});

		this.assertEquals({
			foo: {
				type: 'Foo',
				default: null,
			},
			number: {
				type: null,
				default: 123,
			}
		}, dependencies);
	}

	/** @test */
	parsing_dependencies_from_a_es6_closure()
	{
		global.Foo = Foo;
		global.Bar = Bar;
		global.Baz = Baz;

		let dependencies = parse((/*Foo*/ foo, number = 123) => {});

		this.assertEquals({
			foo: {
				type: 'Foo',
				default: null,
			},
			number: {
				type: null,
				default: 123,
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
