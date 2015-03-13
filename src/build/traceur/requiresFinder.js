var util = require('util');
var traceur = require("./traceur");
var ParseTreeTransformer = traceur.get('codegeneration/ParseTreeTransformer.js').ParseTreeTransformer;

function RequiresFinder () {
    this.requires = [];
    return ParseTreeTransformer.call(this);
}
util.inherits(RequiresFinder, ParseTreeTransformer);

RequiresFinder.prototype.transformCallExpression = function (tree) {
    if (!tree.operand.identifierToken || tree.operand.identifierToken.value != "require") {
        return ParseTreeTransformer.prototype.transformCallExpression.call(this, tree);
    }

    var args = tree.args.args;
    if (args.length && args[0].type == 'LITERAL_EXPRESSION') {
        this.addRequire(args[0].literalToken.processedValue);
    }

    return ParseTreeTransformer.prototype.transformCallExpression.call(this, tree);
};

RequiresFinder.prototype.addRequire = function (dependency) {
    if (this.requires.indexOf(dependency) == -1) {
        this.requires.push(dependency);
    }
};

module.exports = RequiresFinder;
