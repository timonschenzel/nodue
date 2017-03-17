module.exports = class VueTester
{
	constructor(testCaseInstance, vm)
	{
		this.vm = vm;
		this.tester = testCaseInstance;
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

	async see()
	{
		await this.tester.assertRegExp(/ERROR/, html);
	}

	async andSee()
	{
		return this.see();
	}
}