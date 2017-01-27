global.app = require('./bootstrap/app');

app.basePath = __dirname;

app.bootstrap();

app.run();

let Product = new AppFiles.models.Product;

// db.select(['name']).from('products').then(result => {
// 	console.log(result);
// });

// db.schema.createTable('products', table => {
//     table.increments();
//     table.string('name');
// });

// console.log(Product);

// db('products').insert({name: 'Product 1'});

let product = Product.find(1);
console.log('hit!');

console.log(product);

// Product.where('id', 2).fetch().then(product => {
// 	console.log(product.attributes.name);
// });

// let response = app.handle(request);

// response.send();