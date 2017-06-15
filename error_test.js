const domain = require('domain');
const http = require('http');
const serverDomain = domain.create();

let Ouch = require('ouch');

serverDomain.run(() => {
    // With PrettyPageHandler
    http.createServer(function nsjfkj(req, res){

        if (req.url === '/favicon.ico') {
            res.writeHead(200, {'Content-Type': 'image/x-icon'} );
            res.end();
            return;
        }

        serverDomain.on('error', function(e){
            var ouchInstance = (new Ouch).pushHandler(
                    new Ouch.handlers.PrettyPageHandler('blue', null, 'sublime')
            );
            ouchInstance.handleException(e, req, res, function (output) {
                console.log('Error handled properly')
            });
        });
        serverDomain.run(function(){
            test();
            // your application code goes here

        });

    }).listen('1338', 'localhost');
});