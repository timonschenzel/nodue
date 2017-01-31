module.exports = class PagesController
{
	async show()
	{
		let products = await Product.all();
		// let products = await Product.where('id', 1);

		let counter = null;

		return view('product.show', { products, counter });
	}
}