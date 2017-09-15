module.exports = class ProductsController extends Controller
{
	async index()
	{
		let products = await Product.orderBy('id', 'asc').query(query => {
			query.limit(3);
		}).fetchAll();

		let counter = null;

		let title = 'Products';
		let slogan = 'This is great!';

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

		let product = Product.new();
		product.name = request.name;
		product.save();

		return redirect('/products');
	}
}
