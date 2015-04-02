var funnel = require('broccoli-funnel');

module.exports = function (sourceTree, oldName, newName) {
    if (!newName) {
        newName = oldName;
    }
    return funnel(sourceTree, {
        files : [ oldName ],
        getDestinationPath : function () {
            return newName;
        }
    });
};
