var funnel = require('broccoli-funnel');
var mergeTrees = require('broccoli-merge-trees');
var processES6 = require('../traceur/processES6');
var processCJS = require('../traceur/processCJS');

module.exports = function (options) {
    options = options || {};
    var config = {
        typeAssertionsModule : options.typeAssertionsModule
    };
    var client = "src/client/statics";
    client = processES6(client, config);
    var common = funnel("src/common", {
        destDir : "common"
    });
    common = processCJS(common, config);
    return mergeTrees([ client, common ]);
};
