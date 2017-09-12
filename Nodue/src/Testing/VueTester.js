module.exports = class VueTester
{
	constructor(testCaseInstance, vm)
	{
		this.page = vm;
		this.html = null;
		this.tester = testCaseInstance;
	}

	static async test(testCaseInstance, vm)
	{
		let tester = new this(testCaseInstance, vm);
		return await tester;
	}

	async toHtml()
	{
		let html = null;

		await VueRenderer.renderToString(
 			this.page,
 			async (error, result) => {
 				html = result;
 			}
 		);

 		return html;
	}

	assertSee(expression)
	{
		let rawExpression = expression;

		if (typeof expression == 'string') {
			expression = new RegExp(expression, 'gim');
		}

		this.tester.assertRegExp(expression, this.html, `Assert that "${rawExpression}" should exists on the page, but it was not found.`);

		return this;
	}

	andSee(expression)
	{
		return this.assertSee(expression);
	}

	see(expression)
	{
		return this.assertSee(expression);
	}

	async assertNotSee(expression)
	{
		let rawExpression = expression;

		if (typeof expression == 'string') {
			expression = new RegExp(expression, 'gim');
		}

		this.tester.assertNotRegExp(expression, await this.toHtml(), `Assert that "${rawExpression}" should not exists on the page, but it was found.`);
	}

	andNotSee(expression)
	{
		return this.assertNotSee(expression);
	}

	notSee(expression)
	{
		return this.assertNotSee(expression);
	}

	async assertVisible(text)
	{
		let cheerio = require('cheerio');
		let html = await this.toHtml();
		let $ = cheerio.load(html);

		let isVisible = $('div').filter(function() {
			return $(this).text().trim() === text;
		}).attr('style') != 'display:none;';

		this.tester.assertTrue(isVisible);

		return this;
	}

	async assertNoVisible(text)
	{
		let cheerio = require('cheerio');
		let html = await this.toHtml();
		let $ = cheerio.load(html);

		let isNotVisible = $('div').filter(function() {
			return $(this).text().trim() === text;
		}).attr('style') == 'display:none;';

		this.tester.assertTrue(isNotVisible);

		return this;
	}
}
