var Funnel = require('broccoli-funnel');

var bootstrap = new Funnel("node_modules/bootstrap/dist", {
    exclude : [ "**/*.js", "**/*.map", "**/*.min.*" ],
    destDir : "bootstrap"
});

module.exports = function () {
    return bootstrap;
};
