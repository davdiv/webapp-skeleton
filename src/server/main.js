var http = require("http");
var https = require("https");
var fs = require("fs");
var minimist = require("minimist");
var mongodb = require("mongodb");
var co = require("co");
var server = require("./server");
var denodeify = require("denodeify");
var connectDB = denodeify(mongodb.MongoClient.connect);

module.exports = co.wrap(function* (argv) {
    argv = minimist(argv, {
        "default" : {
            pfx : "",
            port : process.env.PORT || "8080",
            database : process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || "mongodb://localhost/default"
        }
    });
    var pfx = argv.pfx ? fs.readFileSync(argv.pfx) : null;
    var port = parseInt(argv.port, 10);
    var databaseURI = argv.database;

    console.log("Database: %s", databaseURI);
    var database = yield connectDB(databaseURI);

    var httpServer = pfx ? https.createServer({
        pfx : pfx
    }) : http.createServer();

    var app = server(database);

    console.log("Environment: %s", app.env);

    httpServer.on("request", app.callback());
    httpServer.listen(port);
    httpServer.on("listening", function () {
        var address = httpServer.address();
        console.log("Address: %s:%d", address.address, address.port);
    });

});
