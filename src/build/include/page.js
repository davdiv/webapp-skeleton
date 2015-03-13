var Funnel = require('broccoli-funnel');
var processCJS = require('../traceur/processCJS');

module.exports = function () {
    var map = {
        "index.js" : "page.js",
        "node_modules/path-to-regexp/index.js" : "path-to-regexp.js",
        "node_modules/path-to-regexp/node_modules/isarray/index.js" : "isarray.js"
    };
    var files = [];
    return processCJS(new Funnel("node_modules/page", {
        include : [ function (fileName) {
            return map.hasOwnProperty(fileName);
        } ],
        getDestinationPath : function (fileName) {
            return map[fileName];
        }
    }));
};
