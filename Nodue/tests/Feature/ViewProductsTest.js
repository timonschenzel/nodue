module.exports = class ViewProductsTest extends TestCase
{
	/** @test */
	async test_a_user_is_able_to_view_a_specific_product()
	{
		this.visit('/products/1', response => {
			response.assertSee('Product name is Product 1');
		});
	}

	/** @test */
	async test_a_user_is_able_to_view_a_list_of_products()
	{
		this.visit('/products', response => {
			response.assertSee('Product name is Product 1');
			response.assertSee('Product name is Product 2');
			response.assertSee('Product name is Product 3');
			response.assertNotSee('Product name is Product 99999999');

			response.assertNotSee('Product name is Test..');
			response.page.replaceFirstProductName();
			response.assertNotSee('Product name is Product 1');
			response.assertSee('Product name is replaced..');
		});
	}

	/** @test */
	async test_see_hello_world_at_the_homepage()
	{
		let response = await this.visit('/', response => {
			response.assertSee('Hello World');

			response.assertVisible('Toggle Me.');
			response.page.toggleDivVisibility();
			response.assertNotVisible('Toggle Me.');
		});
	}
}
