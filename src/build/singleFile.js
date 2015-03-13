var Funnel = require('broccoli-funnel');

module.exports = function (sourceTree, oldName, newName) {
    if (!newName) {
        newName = oldName;
    }
    return new Funnel(sourceTree, {
        files : [ oldName ],
        getDestinationPath : function () {
            return newName;
        }
    });
};
