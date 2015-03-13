var koa = require('koa');
var helmet = require('koa-helmet');
var mount = require('koa-mount');
var send = require('koa-send');
var route = require('koa-route');
var path = require("path");
var pkg = require("../../package.json");

var staticsRoot = path.join(__dirname, "../../build/client/statics");
var staticsRootDev = staticsRoot + "-dev";
var staticsPath = "/statics-" + pkg.version;
var staticsPathDev = staticsPath + "-dev";

var indexHtml = require("./indexHtml")(staticsPath);
var indexHtmlDev = require("./indexHtml")(staticsPathDev);
var pagesConfig = require("../common/pagesConfig");

var sendIndexHtml = function * () {
    var dev = this.query.dev ? this.query.dev == "true" : this.app.env == "development";
    this.body = dev ? indexHtmlDev : indexHtml;
};

var sendStatics = function (staticsDir) {
    var oneYear = 365*24*60*60;
    var config = { root: staticsDir };
    return function *(){
        var infiniteCache = (this.app.env == "production");
        if (infiniteCache && (this.get("If-Modified-Since") || this.get("If-None-Match"))) {
            // no need to check on disk, files are supposed to never change
            this.status = 304; // not modified
            return;
        }
        yield send(this, this.path, config);
        if (infiniteCache) {
            var expires = new Date(Date.now() + oneYear*1000);
            this.set("Cache-Control","public;max-age="+oneYear);
            this.set("Expires", expires.toUTCString());
        }
    };
};

module.exports = function(database) {
    var app = koa();
    app.database = database;

    app.use(helmet.defaults({
        csp: false,
        cacheControl: false
    }));
    app.use(helmet.csp({
        'default-src': ["'self'","'unsafe-eval'"]
    }));

    app.use(mount(staticsPath, sendStatics(staticsRoot)));
    app.use(mount(staticsPathDev, sendStatics(staticsRootDev)));

    pagesConfig.forEach(function (curPage) {
        app.use(route.get(curPage.path, sendIndexHtml));
    })

    return app;
};
