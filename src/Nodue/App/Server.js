module.exports = class Server
{
	constructor()
	{
		let express = require('express');

		this.server = express();
		this.port = app.fetchConfig('port');

		// this.socketServer = express();
		let http = require('http').Server(this.server);
		this.io = require('socket.io')(http);
	}

	handler(req, res) {
        res.writeHead(200);
        res.end({ 'test': 123 });
	}

	start()
	{
		this.server.get('*', (incommingRequest, response) => {
			if (incommingRequest.url.startsWith('/socket.io')) {
				response.send('socket.io');
				return;
			}

			let content = null;
			if (incommingRequest.url == '/public/js/main.js') {
				content = fs.readFileSync(app.basePath + 'public/js/main.js', 'utf8');
				response.send(content);
			} else {
				request.track(incommingRequest);
				content = app.handle(request);

				let baseContent = fs.readFileSync(app.basePath + 'resources/views/app.html', 'utf8');

				response.send(baseContent);
				// response.send(content);
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

		  	console.log('a user connected');
		});

		this.server.listen(this.port, (error) => {
			if (error) {
				throw error
			}

		  	console.log(`Server is running at localhost:${this.port}`);
		});
	}
}