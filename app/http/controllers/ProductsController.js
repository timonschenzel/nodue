module.exports = class ProductsController extends Controller
{
	async index()
	{
		let products = await Product.orderBy('id', 'desc').query(query => {
			query.limit(3);
		}).fetchAll();

		// let products = await Product.all();

		let counter = null;

		let title = 'Products';
		let slogan = 'View all products.';

		products = products.map(product => {
			return new Proxy(product, {
				get(target, property, receiver)
				{
					if (target[property] === undefined) {
						return target.get(property);
					}

					return target[property];
				}
			});
		});

		return view('products.index', { shared: { products }, counter, title, slogan });
	}

	async show(/*Product*/ product)
	{
		let title = 'Products';
		let slogan = 'This is great!';

		return view('products.show', { product, title, slogan });
	}

	create()
	{
		let title = 'Products';
		let slogan = 'Create a new product';

		return view('products.create', { title, slogan });
	}

	store()
	{
		let request = Request.all();

		let product = Product.new();
		product.name = request.name;
		product.save();

		return redirect('/products');
	}
}
