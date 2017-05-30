module.exports = class PagesController extends Controller
{
	index()
	{
		let products = Product.all();

		let counter = null;

		let title = 'Products';
		let slogan = 'This is great!';

		return view('product.index', { shared: { products }, counter, title, slogan });
	}

	show(/*Product*/ product)
	{
		let title = 'Products';
		let slogan = 'This is great!';

		return view('product.show', { product, title, slogan });
	}
}