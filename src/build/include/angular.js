var funnel = require('broccoli-funnel');
var mergeTrees = require('broccoli-merge-trees');
var processES6 = require('../traceur/processES6');
var processCJS = require('../traceur/processCJS');
var singleFile = require('../singleFile');

var filterAndRenameES6 = function (tree, destDir) {
    return processES6(funnel(tree, {
        destDir : destDir,
        include : [ "*.es6", "src/**/*.es6" ],
        getDestinationPath : function (fileName) {
            return fileName.replace(/\.es6$/, ".js");
        }
    }));
};

module.exports = function (options) {
    options = options || {};
    var debug = options.debug;
    var angular = filterAndRenameES6("node_modules/angular2/es6/" + (debug ? "dev" : "prod"), "angular2");
    var rx = processCJS(singleFile("node_modules/angular2/node_modules", "rx/dist/rx.all.js", "rx.js"));
    var trees = [angular, rx];
    if (debug) {
        var rtts_assert = filterAndRenameES6("node_modules/angular2/node_modules/rtts_assert/es6", "rtts_assert");
        trees.push(rtts_assert);
    }
    return mergeTrees(trees);
};
