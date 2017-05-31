module.exports = class DependenciesDetectorTest extends TestCase
{
	/** @test */
	checking_if_the_given_dependency_is_a_closure()
	{
		global.Foo = Foo;
		global.Bar = Bar;
		global.Baz = Baz;

		this.assertTrue(DependenciesDetector.isClosure(function() {}));
		this.assertTrue(DependenciesDetector.isClosure(function(){}));
		this.assertTrue(DependenciesDetector.isClosure(function(foo = 'bar') { return foo; }));
		this.assertTrue(DependenciesDetector.isClosure(function(foo = 'bar'){ return foo; }));
		this.assertTrue(DependenciesDetector.isClosure(() => {}));
		this.assertTrue(DependenciesDetector.isClosure(() =>{}));
		this.assertTrue(DependenciesDetector.isClosure((foo = 'bar') => { return foo; }));
		this.assertTrue(DependenciesDetector.isClosure((foo = 'bar') =>{ return foo; }));
		this.assertTrue(DependenciesDetector.isClosure((foo = 'bar') => foo));

		this.assertFalse(DependenciesDetector.isClosure(Foo));
	}

	/** @test */
	checking_if_the_given_dependency_is_a_class()
	{
		global.Foo = Foo;
		global.Bar = Bar;
		global.Baz = Baz;

		this.assertFalse(DependenciesDetector.isClass(function() {}));
		this.assertFalse(DependenciesDetector.isClass(function(){}));
		this.assertFalse(DependenciesDetector.isClass(function(foo = 'bar') { return foo; }));
		this.assertFalse(DependenciesDetector.isClass(function(foo = 'bar'){ return foo; }));
		this.assertFalse(DependenciesDetector.isClass(() => {}));
		this.assertFalse(DependenciesDetector.isClass(() =>{}));
		this.assertFalse(DependenciesDetector.isClass((foo = 'bar') => { return foo; }));
		this.assertFalse(DependenciesDetector.isClass((foo = 'bar') =>{ return foo; }));
		this.assertFalse(DependenciesDetector.isClass((foo = 'bar') => foo));

		this.assertTrue(DependenciesDetector.isClass(Foo));
	}

	/** @test */
	detecting_dependencies_from_a_class()
	{
		global.Foo = Foo;
		global.Bar = Bar;
		global.Baz = Baz;

		let dependencies = DependenciesDetector.detectFrom(Foo);

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
	detecting_dependencies_from_a_es5_closure()
	{
		global.Foo = Foo;
		global.Bar = Bar;
		global.Baz = Baz;

		let dependencies = DependenciesDetector.detectFrom(function(/*Foo*/ foo, number = 123) {});

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
	detecting_dependencies_from_a_es6_closure()
	{
		global.Foo = Foo;
		global.Bar = Bar;
		global.Baz = Baz;

		let dependencies = DependenciesDetector.detectFrom((/*Foo*/ foo, number = 123) => {});

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
