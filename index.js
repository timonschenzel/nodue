global.app = require('./bootstrap/app');

app.basePath = __dirname;

app.bootstrap();

app.run();

let Product = new AppFiles.models.Product;

// db.schema.createTable('products', table => {
//     table.increments();
//     table.string('name');
// });

// console.log(Product);

// db('products').insert({name: 'Product 1'});

// console.log(Product.where('id', 1).fetchOne());

// let response = app.handle(request);

// response.send();