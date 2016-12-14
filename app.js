global.Nodue = require('auto-loader').load(__dirname + '/src/Nodue');
global.AppFiles = require('auto-loader').load(__dirname + '/app');
global.App = new Proxy(new AppFiles.app(Nodue, AppFiles), {
	get(target, property)
	{
		if(property in target) {
		    return target[property];
		} else {
			try {
				if(typeof property == 'string') {
					if(target.hasOwnProperty(property)) {
						return target.property;
					}

					if(App.appFiles.hasOwnProperty(property)) {
						return App.appFiles[property];
					} else if(App.nodueFiles.hasOwnProperty(property)) {
						return App.nodueFiles[property];
					}
				}
			} catch(e) {
				console.log('error!');
			}
		}
	}
});

global.Controller = App.resolve('Http.Controller');
// App.bind('Http.Controller', 'Controller');

// App.make('Http.controllers.PagesController').testing();

// console.log(App.Http.Controller);

// let c = new App.Http.Controller;
// console.log(c.testing());
// console.log(App.nodueFiles);

App.bootstrap();
// App.test(1);
// App.test(); // Allow for proxy method and property calls

Route.route('/');