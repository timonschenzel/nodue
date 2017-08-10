module.exports = class ProductsController extends Controller
{
	async index()
	{
		let products = await Product.take(250);

		// let p1 = Product.find(1);
		// let p2 = Product.find(2);

		// let products = [p1, p2];

		let counter = null;

		let title = 'Products';
		let slogan = 'This is great!';

		return view('product.index', { shared: { products }, counter, title, slogan });
	}

	async show(/*Product*/ product)
	{
		let title = 'Products';
		let slogan = 'This is great!';

		return view('product.show', { product, title, slogan });
	}

	create()
	{
		let title = 'Products';
		let slogan = 'Create a new product';

		return view('product.create', { title, slogan });
	}

	store()
	{
		let request = Request.all();
		let query = DB.query('INSERT INTO products (name) VALUES (:name)').run({name: request.name});

		return redirect('/products');
	}
}
