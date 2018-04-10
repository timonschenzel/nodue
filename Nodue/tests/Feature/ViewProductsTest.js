module.exports = class ViewProductsTest extends NodueTestCase
{
	/** @test */
	async test_a_user_is_able_to_view_a_specific_product()
	{
		let response = await this.get('/products/1');

		response.assertSee('Product 1');
	}

	/** @test */
	async test_a_user_is_able_to_view_a_list_of_products()
	{
		let response = await this.get('/products');

		response.assertSee('#3191 — Product name is TEST');

		response.page.replaceFirstProductName();
		response.assertNotSee('#3191 — Product name is TEST');
		response.assertSee('Product name is replaced..');
	}

	/** @test */
	async test_see_hello_world_at_the_homepage()
	{
		let response = await this.get('/');

		response.assertSee('Hello World');

		response.assertVisible('Toggle Me.');
		// dump(response.toHtml());
		response.page.toggleDivVisibility();
		// dd(response.toHtml());
		response.assertNotVisible('Toggle Me.');
		response.assertHidden('Toggle Me.');

		// let response = await this.get('/', response => {
		// 	response.assertSee('Hello World');

		// 	response.assertVisible('Toggle Me.');
		// 	response.page.toggleDivVisibility();
		// 	response.assertNotVisible('Toggle Me.');
		// });
	}
}
