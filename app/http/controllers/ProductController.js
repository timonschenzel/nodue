module.exports = class PagesController extends Controller
{
	async show()
	{
		let products = await Product.all();

		let counter = null;

		return view('product.show', { products, counter });
	}
}