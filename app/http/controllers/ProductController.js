module.exports = class PagesController
{
	show()
	{
		// console.log('show product');
		// let product = Product.find(1);

		let products = [
			{ name: 'Product 1', },
			{ name: 'Product 2', },
			{ name: 'Product 3', },
			{ name: 'Product 4', },
			{ name: 'Product 5', },
			{ name: 'Product 6', },
		];

		let counter = null;

		return view('product.show', { products, counter });
	}
}