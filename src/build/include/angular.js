var Funnel = require('broccoli-funnel');
var mergeTrees = require('broccoli-merge-trees');
var processES6 = require('../traceur/processES6');

var filterAndRenameES6 = function (tree, destDir) {
    return new Funnel(tree, {
        destDir : destDir,
        include : [ "*.es6", "src/**/*.es6" ],
        getDestinationPath : function (fileName) {
            return fileName.replace(/\.es6$/, ".js");
        }
    });
};

module.exports = function (options) {
    options = options || {};
    var debug = options.debug;
    var angular = filterAndRenameES6("node_modules/angular2/es6/" + (debug ? "dev" : "prod"), "angular2");
    if (debug) {
        var rtts_assert = filterAndRenameES6("node_modules/angular2/node_modules/rtts_assert/es6", "rtts_assert");
        angular = mergeTrees([ angular, rtts_assert ]);
    }
    angular = processES6(angular);
    return angular;
};
