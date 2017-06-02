module.exports = class DependenciesResolverTest extends TestCase
{
	/** @test */
	resolving_dependencies_from_a_class()
	{
		global.Foo = Foo;
		global.Bar = Bar;
		global.Baz = Baz;

		let dependencies = resolve(Foo);

		this.assertEquals([
			new Bar(new Baz), 123
		], dependencies);
	}

	/** @test */
	resolving_dependencies_from_a_es5_closure()
	{
		global.Foo = Foo;
		global.Bar = Bar;
		global.Baz = Baz;

		let dependencies = resolve(function(/*Foo*/ foo, number = 123) {});

		this.assertEquals([
			new Foo(new Bar(new Baz)), 123
		], dependencies);
	}

	/** @test */
	resolving_dependencies_from_a_es6_closure()
	{
		global.Foo = Foo;
		global.Bar = Bar;
		global.Baz = Baz;

		let dependencies = resolve((/*Foo*/ foo, number = 123) => {});

		this.assertEquals([
			new Foo(new Bar(new Baz)), 123
		], dependencies);
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
