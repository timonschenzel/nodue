module.exports = class PagesController
{
	async show()
	{
		// let Product = new AppFiles.models.Product;

		let productModels = await Product.all();

		let names = productModels.pluck('name');

		let products = [];

		// for (var i = 0; i < names.length; i++) {
			// products.push({
				// name: names[i],
				// id: 0,
			// });
		// }

		let counter = null;

		return view('product.show', { products, counter });
	}
}