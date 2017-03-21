module.exports = class ViewProductsTest extends TestCase
{
	/** @test */
	async test_a_user_is_able_to_view_a_specific_product()
	{
		let page = await this.visit('/');
		page.assertSee('Toggle me.');
		// page.vm.toggleDivVisibility();
		// page.assertHidden('Toggle me.');

		// this.visit('/', (response) => {
		// 	response.assertSee('Toggle me.');
		// });

		// let response = await this.visit('/').andSee('Toggle Me.');

		// let response = await this.visit('/').assertSee('Toggle Me.');
		// response.assertSee('Toggle Me.');
		// console.log(await response.toHtml());
		// response.vm.toggleDivVisibility();
		// console.log(await response.toHtml());
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