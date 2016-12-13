global.Nodue = require('auto-loader').load(__dirname + '/src/Nodue');
global.AppFiles = require('auto-loader').load(__dirname + '/app');
global.App = new AppFiles.app(Nodue, AppFiles);

App.bootstrap();
// App.test(); // Allow for proxy method and property calls

Route.route('/');