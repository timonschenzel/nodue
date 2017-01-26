global.app = require('./bootstrap/app');

app.basePath = __dirname;

app.bootstrap();

app.run();

// let Product = new AppFiles.models.Product;

// console.log(Product);

// console.log(Product.where('id', 59).fetch());

// let response = app.handle(request);

// response.send();