var funnel = require('broccoli-funnel');

var bootstrap = funnel("node_modules/bootstrap/dist", {
    exclude : [ "**/*.js", "**/*.map", "**/*.min.*" ],
    destDir : "bootstrap"
});

module.exports = function () {
    return bootstrap;
};
