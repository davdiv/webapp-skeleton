var Funnel = require("broccoli-funnel");
var wrap = require('broccoli-wrap');
var concat = require('broccoli-concat');
var mergeTrees = require('broccoli-merge-trees');
var uglify = require("broccoli-uglify-js");
var cleanCSS = require('broccoli-clean-css');
var gzipFiles = require('broccoli-gzip');
var fs = require('fs');
var includesDir = __dirname + "/src/build/include/";
var includes = fs.readdirSync(includesDir).filter(function (fileName) {
    return /\.js$/.test(fileName);
}).map(function (fileName) {
    return require(includesDir + fileName);
});

var addAppInitCode = function (tree) {
    return mergeTrees([
        wrap(new Funnel(tree, {
            include : [ "runtime.js" ],
            getDestinationPath : function () {
                return "app.js";
            }
        }), {
            wrapper : [ '',
                '\nSystem.baseURL=document.currentScript.src.replace(/app\.js$/, "");\nSystem.import("main");' ]
        }), new Funnel(tree, {
            exclude : [ "runtime.js" ]
        }) ]);
};

var cleanCSSFilter = function (tree) {
    var res = cleanCSS(tree, {
        strict : true
    });
    var trueProcessString = res.processString;
    res.processString = function (content, fileName) {
        if (fileName != "app.css") {
            return;
        }
        return trueProcessString.apply(this, arguments);
    };
    return new Funnel(res, {
        include : [ "app.css" ]
    });
};

var unpackagedStatics = function (options) {
    options = options || {};
    var debug = options.debug;
    var trees = includes.map(function (include) {
        return include(options);
    });
    return mergeTrees(trees);
};

var packagedStatics = function (options) {
    var unpackaged = unpackagedStatics(options);

    var packagedJS = addAppInitCode(concat(unpackaged, {
        inputFiles : [ 'runtime.js', '**/*.js' ],
        outputFile : '/runtime.js',
    }));

    var packagedCSS = cleanCSSFilter(new Funnel(unpackaged, {
        include : [ "**/*.css" ]
    }));

    var packagedRemainingStatics = new Funnel(unpackaged, {
        exclude : [ "**/*.css", "**/*.js" ]
    });

    return uglify(mergeTrees([ packagedJS, packagedCSS, packagedRemainingStatics ]));
};

var allStatics = function () {
    var env = process.env.NODE_ENV || "development";
    console.log("Packaging environment: " + env);
    var unpackaged = new Funnel(addAppInitCode(unpackagedStatics({
        debug : true,
        typeAssertionsModule : "rtts_assert/rtts_assert"
    })), {
        destDir : "client/statics-dev"
    });
    if (env === "development") {
        return unpackaged;
    }
    return gzipFiles(mergeTrees([ unpackaged, new Funnel(packagedStatics(), {
        destDir : "client/statics"
    }) ]), {
        extensions : [ 'js', 'css' ],
        keepUncompressed : true
    });
};

module.exports = allStatics();
