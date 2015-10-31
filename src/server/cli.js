import co from 'co';
import http from 'http';
import https from 'https';
import fs from 'fs';
import minimist from 'minimist';
import mongodb from 'mongodb';
import Server from './server';
import promisify from 'es6-promisify';

let readFile = promisify(fs.readFile);

export default co.wrap(function* (argv) {
    argv = minimist(argv, {
        'default': {
            pfx: '',
            host: process.env.HOST || null,
            port: process.env.PORT || '8080',
            database: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://localhost/default'
        }
    });
    let pfx;
    if (argv.pfx) {
        pfx = yield readFile(argv.pfx);
    }
    let port = parseInt(argv.port, 10);
    let databaseURI = argv.database;

    console.log('Connecting to the database at %s ...', databaseURI);
    let database = yield mongodb.MongoClient.connect(argv.database);
    console.log('Successfully connected to %s.', databaseURI);

    let httpServer = pfx ? https.createServer({
        pfx: pfx
    }) : http.createServer();

    let server = new Server(database);
    server.attachTo(httpServer);
    httpServer.listen(port, argv.host);
    httpServer.on('listening', function() {
        let address = httpServer.address();
        console.log('Listening on %s://%s:%d', pfx ? 'https' : 'http', address.address, address.port);
    });
});
