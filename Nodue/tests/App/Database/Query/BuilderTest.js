module.exports = class BuilderTest extends TestCase
{
	/** @test */
	building_a_select_query()
	{
		let query = DB.from('products').where('id', 1);

		this.assertEquals('SELECT * FROM products WHERE id = 1', query.toString());
	}

	/** @test */
	building_a_select_query_with_multiple_where_conditions()
	{
		let query = DB.from('products').where({type_id: 123, category: 'books', price: 20.50});

		this.assertEquals('SELECT * FROM products WHERE type_id = 123 AND category = "books" AND price = "20.50"', query.toString());
	}
}