module.exports = class BuilderTest extends TestCase
{
	// Retrieving Results
	// - Selects

	/** @test */
	buidling_a_select_query_with_distinction()
	{
		let query1 = DB.from('products').distinct();
		let query2 = DB.table('products').distinct();

		this.assertEquals('SELECT DISTINCT * FROM products', query1.toString());
		this.assertEquals('SELECT DISTINCT * FROM products', query2.toString());
	}

	/** @test */
	building_a_basic_select_query()
	{
		let query1 = DB.from('products');
		let query2 = DB.table('products');

		this.assertEquals('SELECT * FROM products', query1.toString());
		this.assertEquals('SELECT * FROM products', query2.toString());
	}

	/** @test */
	building_a_select_query_with_specific_columns()
	{
		let query1 = DB.from('products').select('name', 'category', 'base_price as price');
		let query2 = DB.table('products').select('name', 'category', 'base_price as price');

		this.assertEquals('SELECT name, category, base_price AS price FROM products', query1.toString());
		this.assertEquals('SELECT name, category, base_price AS price FROM products', query2.toString());
	}

	// - Where Clauses

	/** @test */
	building_a_basic_select_query_with_a_where_clause()
	{
		let query1 = DB.from('products').where('id', 1);
		let query2 = DB.table('products').where('id', 1);

		this.assertEquals('SELECT * FROM products WHERE id = 1', query1.toString());
		this.assertEquals('SELECT * FROM products WHERE id = 1', query2.toString());
	}

	/** @test */
	prepare_a_basic_select_query_with_a_where_clause()
	{
		let query = DB.from('products').where('id', 1);

		this.assertEquals('SELECT * FROM products WHERE id = :id', query.prepare());
		this.assertEquals({id: 1}, query.bindings());
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
	prepare_a_select_query_with_multiple_where_conditions()
	{
		let query = DB.from('products').where({
			type_id: 123,
			category: 'books',
			price: 20.50,
		});

		this.assertEquals('SELECT * FROM products WHERE type_id = :type_id AND category = :category AND price = :price', query.prepare());
		this.assertEquals({
			type_id: 123,
			category: 'books',
			price: 20.50,
		}, query.bindings());
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

	/** @test */
	prepare_a_select_query_with_multiple_where_object_conditions()
	{
		let query = DB.from('products').where([
			['type_id', 123],
			['category', '=', 'books'],
			['price', '<=', '20.50'],
			['origin_price', '>=', 20.50],
		]);

		this.assertEquals('SELECT * FROM products WHERE type_id = :type_id AND category = :category AND price <= :price AND origin_price >= :origin_price', query.prepare());
		this.assertEquals({
			type_id: 123,
			category: 'books',
			price: '20.50',
			origin_price: 20.50,
		}, query.bindings());
	}

	// - Raw Expressions

	/** @test */
	building_a_basic_select_query_with_a_raw_select_clause()
	{
		let query = DB.from('products').select(DB.raw('name, origin_price as price'));

		this.assertEquals('SELECT name, origin_price AS price FROM products', query.toString());
	}

	/** @test */
	retrieving_a_product_by_its_id()
	{
		let products = DB.from('products').where('id', 1).get();
		this.assertEquals(1, products[0].id);

		let product = DB.from('products').where('id', 1).first();
		this.assertEquals(1, product.id);
	}

	// - Aggregates
	// - Joins

	// Ordering, Grouping, Limit and Offset

	// Inserts
	
	// Updates
	
	// Deletes
}