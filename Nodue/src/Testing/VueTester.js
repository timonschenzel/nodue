module.exports = class VueTester
{
	constructor(testCaseInstance, vm)
	{
		this.vm = vm;
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
 			this.vm,
 			async (error, result) => {
 				html = result;
 			}
 		);

 		return html;
	}

	async assertSee(expression)
	{
		let rawExpression = expression;

		if (typeof expression == 'string') {
			expression = new RegExp(expression, 'gim');
		}

		this.tester.assertRegExp(expression, await this.toHtml(), `Assert that "${rawExpression}" should exists on the page, but it was not found.`);

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
}