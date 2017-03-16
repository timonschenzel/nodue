module.exports = class TestCase
{
	constructor()
	{
		this.name = null;
	}

	async visit(url)
	{
		request.track({ url });
		let response = await app.handle(request);

		let vm = new Vue({
		  render (h) {
		    return h('div', 'hello')
		  }
		});
	}

	assertEquals(expected, value, message)
	{
		value = this.normalizeValue(value);

		// .is(value, expected, [message])
		test(this.name, async t => {
			await t.deepEqual(value, expected, message);
		});
	}

	assertNotEquals(expected, value, message)
	{
		value = this.normalizeValue(value);

		// .not(value, expected, [message])
		test(this.name, async t => {
			await t.not(value, expected, message);
		});
	}

	assertTrue(value, message)
	{
		value = this.normalizeValue(value);

		// .truthy(value, [message])
		test(this.name, async t => {
			await t.truthy(value, message);
		});
	}

	assertFalse(value, message)
	{
		value = this.normalizeValue(value);

		// .falsy(value, [message])
		test(this.name, async t => {
			await t.falsy(value, message);
		});
	}

	assertDeepEqual(expected, value, message)
	{
		value = this.normalizeValue(value);

		// .deepEqual(value, expected, [message])
		test(this.name, async t => {
			await t.deepEqual(value, expected, message);
		});
	}

	assertNotDeepEqual(expected, value, message)
	{
		value = this.normalizeValue(value);

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

	assertNotRegExp(contents, regex, message)
	{
		// .notRegex(contents, regex, [message])
		test(this.name, async t => {
			await t.notRegex(contents, regex, message);
		});
	}

	takeSnapshot(contents, message)
	{
		// .snapshot(contents, [message])
		test(this.name, async t => {
			await t.snapshot(contents, message);
		});
	}

	normalizeValue(value)
	{
		if (typeof value == 'object' && value.hasOwnProperty('raw')) {
			return value.raw;
		}

		return value;
	}
}