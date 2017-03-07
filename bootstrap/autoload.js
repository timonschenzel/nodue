global.app = require('./app');

app.loadCoreModules();

app.basePath = path.normalize(__dirname + '/..');

app.bootstrap();