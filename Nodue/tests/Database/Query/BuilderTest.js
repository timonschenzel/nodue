module.exports = class BuilderTest extends TestCase
{
	// Retrieving Results
	// - Selects
	// - Raw Expressions
	// - Aggregates
	// - Joins
	// - Where Clauses

	/** @test */
	building_a_basic_select_query()
	{
		let query1 = DB.from('products');
		let query2 = DB.table('products');

		this.assertEquals('SELECT * FROM products', query1.toString());
		this.assertEquals('SELECT * FROM products', query2.toString());
	}

	/** @test */
	building_a_basic_select_query_with_a_where_clause()
	{
		let query1 = DB.from('products').where('id', 1);
		let query2 = DB.table('products').where('id', 1);

		this.assertEquals('SELECT * FROM products WHERE id = 1', query1.toString());
		this.assertEquals('SELECT * FROM products WHERE id = 1', query2.toString());
	}

	/** @test */
	building_a_select_query_with_a_specific_operator_in_the_where_clause()
	{
		let query1 = DB.from('products').where('id', '>', 10);
		let query2 = DB.from('products').where('id', '!=', 10);

		this.assertEquals('SELECT * FROM products WHERE id > 10', query1.toString());
		this.assertEquals('SELECT * FROM products WHERE id != 10', query2.toString());
	}

	/** @test */
	building_a_select_query_with_multiple_where_conditions()
	{
		let query = DB.from('products').where({
			type_id: 123,
			category: 'books',
			price: 20.50,
		});

		this.assertEquals('SELECT * FROM products WHERE type_id = 123 AND category = "books" AND price = "20.5"', query.toString());
	}

	/** @test */
	building_a_select_query_with_multiple_where_conditions_and_a_float_value_with_and_ending_zero()
	{
		let query = DB.from('products').where({
			type_id: 123,
			category: 'books',
			price: '20.50',
		});

		this.assertEquals('SELECT * FROM products WHERE type_id = 123 AND category = "books" AND price = "20.50"', query.toString());
	}

	/** @test */
	building_a_select_query_with_multiple_where_object_conditions()
	{
		let query = DB.from('products').where([
			['type_id', 123],
			['category', '=', 'books'],
			['price', '<=', '20.50'],
			['origin_price', '>=', 20.50],
		]);

		this.assertEquals('SELECT * FROM products WHERE type_id = 123 AND category = "books" AND price <= "20.50" AND origin_price >= "20.5"', query.toString());
	}

	// Ordering, Grouping, Limit and Offset

	// Inserts
	
	// Updates
	
	// Deletes
}