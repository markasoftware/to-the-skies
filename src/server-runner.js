'use strict';

require('dotenv').config({ path: `${__dirname}/.env` });

require('./server.js').listen(process.env.NODE_ENV === 'PRODUCTION' ? 80 : 1337);
