module.exports = class ViewProductsTest extends TestCase
{
	/** @test */
	async test_a_user_is_able_to_view_a_specific_product()
	{
		// try {
		// 	console.log('HIT1');
		// 	Product.where({ id: 1 }).fetch().then(product => {
		// 		console.log('HIT3');
		// 	});
		// 	console.log('HIT2');
		// } catch(error) {
		// 	console.log(error);
		// }

		await this.assertEquals(1, 1);
		
		let response = await this.visit('/products');

		await response.assertSee('Product name is Product 1');	


		// let expression = 'Product name is Product 1';
		// let rawExpression = expression;

		// if (typeof expression == 'string') {
		// 	expression = new RegExp(expression, 'gim');
		// }


		// await this.assertRegExp(expression, html, `Assert that "${rawExpression}" should exists on the page, but it was not found.`);

		// response.assertSee('Product name is Product 1');

		// setTimeout(() => {
		// }, 1000);

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