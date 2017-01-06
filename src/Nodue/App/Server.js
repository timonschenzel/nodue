module.exports = class Server
{
	constructor()
	{
		var express = require('express');
		this.server = express();
		this.port = app.fetchConfig('port');
	}

	start()
	{
		this.server.get('*', (incommingRequest, response) => {
			request.track(incommingRequest);
			let content = app.handle(request);

			response.send(content);
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
	}
}