global.app = require('./bootstrap/app');

app.basePath = __dirname;

app.bootstrap();

// let response = app.handle(request);

// response.send();