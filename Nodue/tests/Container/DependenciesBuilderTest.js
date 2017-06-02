module.exports = class DependenciesBuilderTest extends TestCase
{
	/** @test */
	building_an_object_with_type_hinted_dependencies()
	{
		global.Foo = Foo;
		global.Bar = Bar;
		global.Baz = Baz;

		let foo = build(Foo);

		this.assertEquals(123, foo.number);
		this.assertEquals(new Foo(new Bar(new Baz)), foo);
		this.assertEquals(new Bar(new Baz), foo.bar);
		this.assertEquals(new Baz, foo.bar.baz);

		this.assertEquals('foo', foo.say());
		this.assertEquals('bar', foo.bar.say());
		this.assertEquals('baz', foo.bar.baz.say());
	}

	/** @test */
	resolving_dependencies_for_a_given_es6_closure()
	{
		global.Foo = Foo;
		global.Bar = Bar;
		global.Baz = Baz;

		let closure = (/*Foo*/ foo) => {
			return foo;
		};

		let dependency = build(closure);

		this.assertEquals(new Foo(new Bar(new Baz)), dependency);
	}

	/** @test */
	resolving_dependencies_for_a_given_es5_closure()
	{
		global.Foo = Foo;
		global.Bar = Bar;
		global.Baz = Baz;
		
		let closure = function(/*Foo*/ foo) {
			return foo;
		};

		let dependency = build(closure);

		this.assertEquals(new Foo(new Bar(new Baz)), dependency);
	}

	/** @test */
	overriding_specific_dependencies_for_a_given_es6_closure()
	{
		global.Foo = Foo;
		global.Bar = Bar;
		global.Baz = Baz;
		
		let closure = (/*Foo*/ foo, number = 123) => {
			return {foo, number};
		};

		let dependency = build(closure, {
			foo: 'override-foo',
			number: 456,
		});

		this.assertEquals('override-foo', dependency.foo);
		this.assertEquals(456, dependency.number);
	}

	/** @test */
	resolving_dependencies_from_the_container()
	{
		class IoCFoo
		{
			foo()
			{
				return 'bar';
			}
		}

		app.bind('Foo', IoCFoo);

		let closure = (/*Foo*/ foo) => {
			return foo;
		};

		let dependency = build(closure);

		this.assertEquals('bar', dependency.foo());
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
