module.exports = class HelpersTest extends TestCase
{
	/** @test */
	checking_if_the_given_dependency_is_a_closure()
	{
		global.Foo = Foo;
		global.Bar = Bar;
		global.Baz = Baz;

		this.assertTrue(is_closure(function() {}));
		this.assertTrue(is_closure(function(){}));
		this.assertTrue(is_closure(function(foo = 'bar') { return foo; }));
		this.assertTrue(is_closure(function(foo = 'bar'){ return foo; }));
		this.assertTrue(is_closure(() => {}));
		this.assertTrue(is_closure(() =>{}));
		this.assertTrue(is_closure((foo = 'bar') => { return foo; }));
		this.assertTrue(is_closure((foo = 'bar') =>{ return foo; }));
		this.assertTrue(is_closure((foo = 'bar') => foo));

		this.assertFalse(is_closure(Foo));
	}

	/** @test */
	checking_if_the_given_dependency_is_a_class()
	{
		global.Foo = Foo;
		global.Bar = Bar;
		global.Baz = Baz;

		this.assertFalse(is_class(function() {}));
		this.assertFalse(is_class(function(){}));
		this.assertFalse(is_class(function(foo = 'bar') { return foo; }));
		this.assertFalse(is_class(function(foo = 'bar'){ return foo; }));
		this.assertFalse(is_class(() => {}));
		this.assertFalse(is_class(() =>{}));
		this.assertFalse(is_class((foo = 'bar') => { return foo; }));
		this.assertFalse(is_class((foo = 'bar') =>{ return foo; }));
		this.assertFalse(is_class((foo = 'bar') => foo));

		this.assertTrue(is_class(Foo));
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