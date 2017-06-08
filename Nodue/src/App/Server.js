module.exports = class Server
{
	constructor()
	{
		this.port = app.config().port;

		this.express = require('express');
		this.server = this.express();
		this.favicon = require('serve-favicon');
		this.server.use(this.express.static('public'));
		this.server.use(this.favicon(app.path('public/favicon.ico')));
		this.http = require('http').Server(this.server);
		this.io = require('socket.io')(this.http);
	}

	async start()
	{
		this.server.get('*', (incommingRequest, response) => {
			let content = null;

			Request.track(incommingRequest);
			content = app.handle(Request);

			let baseContent = fs.readFileSync(app.basePath + 'resources/views/app.html', 'utf8');

			response.send(baseContent);
		});
		
		this.server.post('*', (incommingRequest, response) => {
			Request.track(incommingRequest);
			let content = app.handle(Request);

			response.send(content);
		});

		this.io.on('connection', async (socket) => {
			// First connection from user
			let requestedUrl = socket.handshake.query.url;
			socket.join('page.' + requestedUrl);
			Request.track({ url: requestedUrl });
			let response = await app.handle(Request);
			socket.emit('getResponse', response);

			// User request a page
		  	socket.on('getRequest', async (incommingRequest) => {
		  		for (let room in socket.rooms) {
		  			if (room.startsWith('page.')) {
		  				socket.leave(room);
		  			}
		  		}
		  		socket.join('page.' + incommingRequest.url);

		  		Request.track(incommingRequest);
		  		let response = await app.handle(Request);

		  		if (typeof response == 'object') {
		  			response.name = response.name + '-' + new Date().getTime();
		  		}

		  		socket.emit('getResponse', response);
		  	});

		  	socket.on('postRequest', async (incommingRequest) => {
		  		Request.track(incommingRequest);
		  		let response = await app.handle(Request);

		  		socket.emit('getResponse', response);
		  	});

		  	socket.on('sharedDataUpdate', async (update) => {
		  		update.fromServer = true;
		  		Server.io.to('page.' + update.url).emit('sharedDataUpdate', update);
		  	});
		});

		// Start server
		this.http.listen(this.port, (error) => {
			if (error) {
				throw error;
			}

			app.isRunning = true;

			log.success(`Server is running at localhost:${this.port}`);
		});
	}
}