var mergeTrees = require('broccoli-merge-trees');
var concat = require('broccoli-concat');
var singleFile = require('../singleFile');
var wrap = require('broccoli-wrap');

var traceurRuntime = function () {
    return singleFile("node_modules/angular2/node_modules/traceur/bin", "traceur-runtime.js");
};

var es6ModuleLoader = function () {
    return singleFile("node_modules/es6-module-loader/dist", "es6-module-loader-sans-promises.src.js");
};

var extensionRegister = function () {
    return wrap(singleFile("node_modules/systemjs/lib", "extension-register.js"), {
        wrapper : [ "(function(){\n", "\nregister(System);\n})();" ]
    });
};

var zone = function () {
    return wrap(singleFile("node_modules/angular2/node_modules/zone.js", "zone.js"), {
        wrapper : [ "(function(global){\n", "\nglobal.Zone = Zone;\n})(this);" ]
    });
};

var runtime = mergeTrees([ traceurRuntime(), es6ModuleLoader(), extensionRegister(), zone() ]);

runtime = concat(runtime,
    {
        inputFiles : [ "traceur-runtime.js", "es6-module-loader-sans-promises.src.js", "extension-register.js",
            "zone.js" ],
        outputFile : '/runtime.js'
    });

module.exports = function () {
    return runtime;
};
