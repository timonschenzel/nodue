module.exports = class ViewProductsTest extends TestCase
{
	/** @test */
	async test_a_user_is_able_to_view_a_specific_product()
	{
		let response = await this.visit('/');
		// console.log(await response.toHtml());
		// response.vm.toggleDivVisibility();
		// console.log(await response.toHtml());
		response.see(/Toggle Me./);
		// this.assertRegExp(/Hello/, await response.toHtml());
		// let html = await response.toHtml();
		// this.assertRegExp(/ERROR/, html);
		
		// Testing
		// await this.visit('/')
		// 	.then(click('button'))
		// 	.then(assertSee('/Test/'))
		// 	;
	}
}