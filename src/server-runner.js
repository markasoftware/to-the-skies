require('./server.js').listen(process.env.NODE_ENV == 'PRODUCTION' ? 80:1337);
