module.exports = class PagesController extends Controller
{
	async show()
	{
		let products = await Product.all();

		let counter = null;

		let title = 'Products';
		let slogan = 'This is great!';

		return view('product.show', { products, counter, title, slogan });
	}
}