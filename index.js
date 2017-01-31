global.app = require('./bootstrap/app');

app.basePath = __dirname;

app.bootstrap();

app.run();

// class Main
// {

// }

// let proxy = {
// 	get(target, property)
// 	{
// 		if (this.hasOwnProperty(property)) {
// 			return this[property];
// 		}

// 		if (typeof this[property] == 'function') {
// 			return function(...args) {
// 			   return this[property](args);
// 			};
// 		}
// 	},

// 	func(value)
// 	{
// 		console.log('func call: ' + value);
// 	},

// 	test: 12345,
// }

// let main = new Proxy(new Main, proxy);

// console.log(main.test);
// main.func('test 12345', 'test');

// db.select(['name']).from('products').then(result => {
// 	console.log(result);
// });

// db.schema.createTable('products', table => {
//     table.increments();
//     table.string('name');
// });

// console.log(Product);

// db('products').insert({name: 'Product 1'});

// await Product.find(1);
// console.log('find product');
// let product = getProduct(1);
// console.log('product found');
// console.log(product);

// Product.where('id', 2).fetch().then(product => {
// 	console.log(product.attributes.name);
// });

// let response = app.handle(request);

// response.send();