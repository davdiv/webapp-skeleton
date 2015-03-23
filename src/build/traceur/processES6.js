var util = require('util');
var Filter = require('broccoli-filter');
var traceur = require('./traceur');

function ProcessES6 (inputTree, options) {
    if (!(this instanceof ProcessES6)) {
        return new ProcessES6(inputTree, options);
    }

    this.inputTree = inputTree;
    this.options = options || {};
}

util.inherits(ProcessES6, Filter);

ProcessES6.prototype.extensions = [ 'js' ];
ProcessES6.prototype.targetExtension = 'js';

ProcessES6.prototype.processString = function (originalSource, fileName) {
    try {
        var typeAssertionsModule = this.options.typeAssertionsModule;
        var typeAssertions = !!typeAssertionsModule;

        return traceur.compile(originalSource, {
            asyncFunctions: true,
            modules : 'instantiate',
            moduleName : true,
            annotations : true,
            types : true,
            typeAssertionModule : typeAssertionsModule,
            typeAssertions : typeAssertions,
            memberVariables : true,
            script : false
        }, fileName.replace(/\.js$/, ""));

    } catch (e) {
        if (Array.isArray(e)) {
            throw new Error("Traceur errors:\n" + e.join("\n"));
        }
        throw e;
    }
};

module.exports = ProcessES6;
