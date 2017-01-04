global.app = require('./bootstrap/app');

app.basePath = __dirname;

app.bootstrap();

app.direct('/products/show');