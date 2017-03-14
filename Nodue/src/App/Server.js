module.exports = class Server
{
	constructor()
	{
		this.port = app.config().port;

		this.express = require('express');
		this.server = this.express();
		this.server.use(this.express.static('public'));
		this.http = require('http').Server(this.server);
		this.io = require('socket.io')(this.http);
	}

	async start()
	{
		this.server.get('*', (incommingRequest, response) => {
			let content = null;

			request.track(incommingRequest);
			content = app.handle(request);

			let baseContent = fs.readFileSync(app.basePath + 'resources/views/app.html', 'utf8');

			response.send(baseContent);
		});
		
		this.server.post('*', (incommingRequest, response) => {
			request.track(incommingRequest);
			let content = app.handle(request);

			response.send(content);
		});

		this.io.on('connection', async (socket) => {
			// First connection from user
			let requestedUrl = socket.handshake.query.url;
			socket.join('page.' + requestedUrl);
			request.track({ url: requestedUrl });
			let response = await app.handle(request);

			setTimeout(() => {
				socket.volatile.emit('pageRequest', response);
			}, 500);

			// User request a page
		  	socket.on('pageRequest', async (incommingRequest) => {
		  		for (let room in socket.rooms) {
		  			if (room.startsWith('page.')) {
		  				socket.leave(room);
		  			}
		  		}
		  		socket.join('page.' + incommingRequest.url);

		  		request.track(incommingRequest);
		  		let response = await app.handle(request);

		  		if (typeof response == 'object') {
		  			response.name = response.name + '-' + new Date().getTime();
		  		}

		  		socket.volatile.emit('pageRequest', response);
		  	});
		});

		// Start server
		this.http.listen(this.port, (error) => {
			if (error) {
				throw error;
			}

			app.isRunning = true;

		  	console.log(`Server is running at localhost:${this.port}`);
		});
	}
}