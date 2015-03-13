var util = require('util');
var Filter = require('broccoli-filter');
var traceur = require('./traceur');
var RequiresFinder = require('./requiresFinder');

function ProcessCJS (inputTree, options) {
    if (!(this instanceof ProcessCJS)) {
        return new ProcessCJS(inputTree, options);
    }

    this.inputTree = inputTree;
    this.options = options || {};
}

util.inherits(ProcessCJS, Filter);

ProcessCJS.prototype.extensions = [ 'js' ];
ProcessCJS.prototype.targetExtension = 'js';

ProcessCJS.prototype.processString = function (originalSource, fileName) {
    try {
        var typeAssertionsModule = this.options.typeAssertionsModule;
        var typeAssertions = !!typeAssertionsModule;

        var moduleName = fileName.replace(/\.js$/, "");
        var options = {
            script : true,
            annotations : true,
            types : true,
            typeAssertionModule : typeAssertionsModule,
            typeAssertions : typeAssertions,
            memberVariables : true
        };
        var compiler = new traceur.Compiler(options);
        var tree = compiler.parse(originalSource, moduleName);
        var requiresFinder = new RequiresFinder();

        // find calls to require:
        tree = requiresFinder.transformAny(tree);

        // does the remaining conversion operations:
        tree = compiler.transform(tree);

        var output = compiler.write(tree, moduleName);

        var result = [ 'System.register(', JSON.stringify(moduleName), ",", JSON.stringify(requiresFinder.requires),
            ", true, function(require, exports, module) {\n" ];
        result.push(output, "\nreturn module.exports;\n});");
        result.push("\n//# sourceURL=", moduleName)
        return result.join("");
    } catch (e) {
        if (Array.isArray(e)) {
            throw new Error("Traceur errors:\n" + e.join("\n"));
        }
        throw e;
    }
};

module.exports = ProcessCJS;
