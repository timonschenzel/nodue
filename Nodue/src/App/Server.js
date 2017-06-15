let Ouch = require('ouch');

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
		this.server.get('*', async (request, response) => {
			let baseContent = fs.readFileSync(app.basePath + 'resources/views/app.html', 'utf8');

			response.send(baseContent);
		});
		
		this.server.post('*', async (request, response) => {
			let content = await this.handleRequest({
				type: 'post',
				url: request.url,
				payload: request,
			});

			if (content.error) {
				response.status(500).send();
			} else {
				response.send(content);
			}
		});

		this.server.put('*', async (request, response) => {
			let content = await this.handleRequest({
				type: 'put',
				url: request.url,
				payload: request,
			});

			response.send(content.data.data);
		});

		this.server.patch('*', async (request, response) => {
			let content = await this.handleRequest({
				type: 'patch',
				url: request.url,
				payload: request,
			});

			response.send(content.data.data);
		});

		this.server.delete('*', async (request, response) => {
			let content = await this.handleRequest({
				type: 'delete',
				url: request.url,
				payload: request,
			});

			response.send(content.data.data);
		});

		this.io.on('connection', async (socket) => {
			// First connection from user
			await this.handleRequest({
				type: 'get',
				url: socket.handshake.query.url,
				socket: socket,
			});

		  	socket.on('getRequest', async (request) => {
		  		await this.handleRequest({
		  			type: 'get',
		  			url: request.url,
		  			socket: socket,
		  		});
		  	});

		  	socket.on('postRequest', async (request) => {
		  		let url = request._url;
		  		delete request._url;

		  		await this.handleRequest({
		  			type: 'post',
		  			url: url,
		  			data: request,
		  			socket: socket,
		  		});
		  	});

		  	socket.on('putRequest', async (request) => {
		  		await this.handleRequest({
		  			type: 'put',
		  			url: request.url,
		  			socket: socket,
		  		});
		  	});

		  	socket.on('patchRequest', async (request) => {
		  		await this.handleRequest({
		  			type: 'patch',
		  			url: request.url,
		  			socket: socket,
		  		});
		  	});

		  	socket.on('deleteRequest', async (request) => {
		  		await this.handleRequest({
		  			type: 'delete',
		  			url: request.url,
		  			socket: socket,
		  		});
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

	async handleRequest(request)
	{
		if (request.type == 'get' && request.socket) {
			for (let room in request.socket.rooms) {
				if (room.startsWith('page.')) {
					request.socket.leave(room);
				}
			}
			request.socket.join('page.' + request.url);
		}

		Request.track(request);
		let response = await app.handle(Request);

		if (! request.socket) {
			return response;
		}

		if (response.error) {
			var ouchInstance = (new Ouch).pushHandler(
				new Ouch.handlers.PrettyPageHandler('blue', null, 'sublime')
			);

			var errorHtml = ouchInstance.handleException(response.error, null, null, function (output) {
				console.log('Error handled properly');
			});

			request.socket.emit('exceptionResponse', errorHtml);
		} else {
			if (typeof response == 'object') {
				response.name = response.name + '-' + new Date().getTime();
			}

			request.socket.emit('response', response);
		}
	}
}