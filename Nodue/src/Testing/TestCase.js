module.exports = class TestCase
{
	constructor()
	{
		this.name = null;
	}

	assertEquals(expected, value, message)
	{
		// .is(value, expected, [message])
		test(this.name, async t => {
			await t.deepEqual(value, expected, message);
		});
	}

	assertNotEquals(expected, value, message)
	{
		// .not(value, expected, [message])
		test(this.name, async t => {
			await t.not(value, expected, message);
		});
	}

	assertTrue(value, message)
	{
		// .truthy(value, [message])
		test(this.name, async t => {
			await t.truthy(value, message);
		});
	}

	assertFalse(value, message)
	{
		// .falsy(value, [message])
		test(this.name, async t => {
			await t.falsy(value, message);
		});
	}

	assertDeepEqual(expected, value, message)
	{
		// .deepEqual(value, expected, [message])
		test(this.name, async t => {
			await t.deepEqual(value, expected, message);
		});
	}

	assertNotDeepEqual(expected, value, message)
	{
		// .notDeepEqual(value, expected, [message])
		test(this.name, async t => {
			await t.notDeepEqual(value, expected, message);
		});
	}

	assertCount()
	{
		// ..
	}

	pass(message)
	{
		// .pass([message])
		test(this.name, async t => {
			await t.pass(message);
		});
	}

	fail(message)
	{
		// .fail([message])
		test(this.name, async t => {
			await t.fail(message);
		});
	}

	expectException(func, error, message)
	{
		// .throws(function|promise, [error, [message]])
		test(this.name, async t => {
			await t.throws(func, error, message);
		});
	}

	notExpectException(func, error, message)
	{
		// .notThrows(function|promise, [message])
		test(this.name, async t => {
			await t.notThrows(func, error, message);
		});
	}

	assertRegExp(contents, regex, message)
	{
		// .regex(contents, regex, [message])
		test(this.name, async t => {
			await t.regex(contents, regex, message);
		});
	}

	assertNotRegExp()
	{
		// .notRegex(contents, regex, [message])
		test(this.name, async t => {
			await t.notRegex(contents, regex, message);
		});
	}

	takeSnapshot()
	{
		// .snapshot(contents, [message])
		test(this.name, async t => {
			await t.snapshot(contents, message);
		});
	}
}