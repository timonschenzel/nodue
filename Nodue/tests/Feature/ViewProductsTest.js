module.exports = class ViewProductsTest extends TestCase
{
	/** @test */
	async test_a_user_is_able_to_view_a_specific_product()
	{
		let response = await this.visit('/products/1');

		response.assertSee('Product name is Product 1');
		response.assertNotSee('Product name is Product 2');
		response.assertNotSee('Product name is Product 3');
	}

	/** @test */
	async test_a_user_is_able_to_view_a_list_of_products()
	{
		let response = await this.visit('/products');

		response.assertSee('Product name is Product 1');
		response.assertSee('Product name is Product 2');
		response.assertSee('Product name is Product 3');
		response.assertNotSee('Product name is Product 99999999');

		response.assertNotSee('Product name is Test..');
		response.page.replaceFirstProductName();
		response.assertNotSee('Product name is Product 1');
		response.assertSee('Product name is replaced..');
	}

	/** @test */
	async test_see_hello_world_at_the_homepage()
	{
		let response = await this.visit('/');
		response.assertSee('Hello World');

		response.assertVisible('Toggle Me.');
		response.page.toggleDivVisibility();
		response.assertNoVisible('Toggle Me.');
	}
}
