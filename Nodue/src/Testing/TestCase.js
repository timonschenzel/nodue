module.exports = class TestCase
{
	constructor()
	{
		let t = require('ava/lib/test');
		let test = new t({});
		this.ava = test.createExecutionContext();

		this.vm = null;
		this.name = null;

		Vue.config.debug = false;
		Vue.config.silent = true;
	}

	async visit(url, callback)
	{
		test(async request => {
			Request.track({ url });
			let response = await app.handle(Request);

			let globalComponents = require('../../../storage/framework/cache/global_components.js');

			for (let componentName in globalComponents) {
				Vue.component(componentName, globalComponents[componentName]);
			}

			let templates = require('../../../storage/framework/cache/layout_templates.js');


			for (let templateName in templates) {
				Vue.component(templateName, {
					template: templates[templateName],
					data() {
						return {};
					}
				});
			}

			let component = {};
			if (response.behavior) {
				eval('component = ' + response.behavior);
			}

			component.template = response.template;
			component.data = function()
			{
				return response.data;
			}

			let vm = await VueTester.test(this, new Vue(component));
			vm.html = await vm.toHtml();

			request.vm = vm;
			request.html = vm.html;
			request.page = vm.page;

			request.assertSee = (expression) => {
				console.trace('jsUnit error');

				let rawExpression = expression;

				if (typeof expression == 'string') {
					expression = new RegExp(expression, 'gim');
				}

				request.vm.toHtml().then(html => {
					request.regex(html, expression, `Assert that "${rawExpression}" should exists on the page, but it was not found.`);
				});

			}

			request.assertNotSee = (expression) =>
			{
				let rawExpression = expression;

				if (typeof expression == 'string') {
					expression = new RegExp(expression, 'gim');
				}

				request.vm.toHtml().then(html => {
					request.notRegex(html, expression, `Assert that "${rawExpression}" should not exists on the page, but it was found.`);
				});
			}

			request.assertVisible = (text) =>
			{
				let cheerio = require('cheerio');
				request.vm.toHtml().then(html => {
					let $ = cheerio.load(html);

					let isVisible = $('div').filter(function() {
						return $(this).text().trim() === text;
					}).attr('style') != 'display:none;';

					request.truthy(isVisible);
				});
			}

			request.assertNotVisible = (text) =>
			{
				let cheerio = require('cheerio');
				request.vm.toHtml().then(html => {
					let $ = cheerio.load(html);

					let isNotVisible = $('div').filter(function() {
						return $(this).text().trim() === text;
					}).attr('style') == 'display:none;';

					request.truthy(isNotVisible);
				});
			}

			callback(request);
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
		console.trace('jsUnit trace');

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

	assertRegExp(regex, contents, message)
	{
		// .regex(contents, regex, [message])
		test(this.name, async t => {
			await t.regex(contents, regex, message);
		});
	}

	assertNotRegExp(regex, contents, message)
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
