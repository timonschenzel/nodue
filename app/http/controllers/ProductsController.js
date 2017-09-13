module.exports = class ProductsController extends Controller
{
	async index()
	{
		let products = await Product.orderBy('id', 'desc').where('id', 5).fetchAll();

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

		let product = Product.new();
		product.name = request.name;
		product.save();

		return redirect('/products');
	}
}
