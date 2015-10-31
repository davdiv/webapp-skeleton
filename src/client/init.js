window.startApp = function() {
    window.React = require('react');
    require('./main').default.apply(this, arguments);
};
