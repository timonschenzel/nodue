module.exports = class Server
{
	constructor()
	{
		this.port = app.fetchConfig('port');

		this.server = require('express')();
		this.http = require('http').Server(this.server);
		this.io = require('socket.io')(this.http);
	}

	start()
	{
		this.server.get('/public/js/main.js', (incommingRequest, response) => {
			response.send(fs.readFileSync(app.basePath + 'public/js/main.js', 'utf8'));
		});

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
	}
}