(function() {
    "use strict";

    const http = require('http');
    const mongoose = require('mongoose');
    const port = (process.env.PORT || 3000);

    require('./app/bots/TodoBot.js')();
    require('./app/config/mongodb.js')('YOUR_DATABASE_HERE');

    http.createServer((request, response) => {
        response.writeHead(200, {'Content-Type': 'application/json'});
        response.write(JSON.stringify({
            name: "bytezbot",
            ver: '0.0.1'
        }));
        response.end();
    }).listen(port);
})();
