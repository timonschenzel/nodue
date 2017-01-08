module.exports = class Server
{
	constructor()
	{
		let express = require('express');

		this.server = express();
		this.port = app.fetchConfig('port');

		this.socketServer = express();
		let http = require('http').Server(this.socketServer);
		this.io = require('socket.io')(http);
	}

	start()
	{
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
				// response.send(content);
			}
		});
		
		this.server.post('*', (incommingRequest, response) => {
			request.track(incommingRequest);
			let content = app.handle(request);

			response.send(content);
		});

		this.server.listen(this.port, (error) => {
			if (error) {
				throw error
			}

		  	console.log(`Server is running at localhost:${this.port}`);
		});

		this.io.on('connection', function(socket){
		  console.log('a user connected');
		});

		this.socketServer.listen(5000, (error) => {
			if (error) {
				throw error
			}

		  	console.log(`Server is running at localhost:5000`);
		});
	}
}