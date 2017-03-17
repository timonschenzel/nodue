module.exports = class ViewProductsTest extends TestCase
{
	/** @test */
	async test_a_user_is_able_to_view_a_specific_product()
	{
		let response = await this.visit('/')
		response.see(/Nodue/);
		// this.assertRegExp(/Hello/, await response.toHtml());
		// let html = await response.toHtml();
		// this.assertRegExp(/ERROR/, html);
	}
}