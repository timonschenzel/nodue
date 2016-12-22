module.exports = class PagesController
{
	show()
	{
		console.log('show product');
		let product = Product.find(1);

		return view('product.show', { product });
	}
}