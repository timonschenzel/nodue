module.exports = class Server
{
	constructor()
	{
		this.port = app.fetchConfig('port');

		this.express = require('express');
		this.server = this.express();
		this.server.use(this.express.static('public'));
		this.http = require('http').Server(this.server);
		this.io = require('socket.io')(this.http);
	}

	start()
	{
		// this.server.get('/public/js/main.js', (incommingRequest, response) => {
		// 	response.send(fs.readFileSync(app.basePath + 'public/js/main.js', 'utf8'));
		// });

		this.server.get('*', (incommingRequest, response) => {
			let content = null;
			if (incommingRequest.url == '/public/js/main.js') {
				content = fs.readFileSync(app.basePath + 'public/js/main.js', 'utf8');
				response.send(content);
			} else {
				request.track(incommingRequest);
				content = app.handle(request);

				let baseContent = fs.readFileSync(app.basePath + 'resources/views/app.html', 'utf8');

				response.send(baseContent);
			}
		});
		
		this.server.post('*', (incommingRequest, response) => {
			request.track(incommingRequest);
			let content = app.handle(request);

			response.send(content);
		});

		this.io.on('connection', function(socket) {

			// var user_id = socket.handshake.query.user_id;
			// var group_id = socket.handshake.query.group_id.toLowerCase();
			// var type_id = socket.handshake.query.type_id.toLowerCase();
			// var user_name = socket.handshake.query.user_name;
			// var session_id = socket.conn.transport.sid;

		  	socket.on('pageRequest', (incommingRequest) => {
		  		for (let room in socket.rooms) {
		  			if (room.startsWith('page.')) {
		  				socket.leave(room);
		  			}
		  		}
		  		socket.join('page.' + incommingRequest.url);

		  		request.track(incommingRequest);
		  		let response = app.handle(request);

		  		socket.volatile.emit('pageRequest', response);
		  	});
		});

		this.http.listen(this.port, (error) => {
			if (error) {
				throw error
			}

		  	console.log(`Server is running at localhost:${this.port}`);
		});

		// Hot Reload
		global.moduleTemplates = {};

		chokidar.watch(app.basePath, { ignored: /(^|[\/\\])\..|\/node_modules/ }).on('all', (event, path) => {
			if (fs.lstatSync(path).isFile()) {
				if (hotReload.views[path] !== undefined) {
					console.log('view update!');
				}

				if (hotReload.controllers[path] !== undefined) {
					console.log('controller update!');
				}

				let viewPath = app.basePath + path.split(app.basePath)[1];
			 	let page = moduleTemplates[path];
			 	let template = fs.readFileSync(path, 'utf8');

			 	let url = path == app.basePath + 'resources/views/pages/home.vue' ? '/' : '/products/show';

			 	if (page) {
			 		request.track({ url });
			 		let response = app.handle(request);

			 		console.log(response);

			 		response.name = page + '-' + this.createHash(template);

				 	this.io.to('page.' + url).emit('pageRequest', response);
			 	}
		 	}
		});
	}

	// Hot Reload
	createHash(string)
	{
	    let hash = 0;
	    if (string.length == 0) return hash;
	    for (let i = 0; i < string.length; i++) {
	        let char = string.charCodeAt(i);
	        hash = ((hash<<5)-hash)+char;
	        hash = hash & hash; // Convert to 32bit integer
	    }

	    return hash;
	}
}