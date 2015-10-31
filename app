#!/usr/bin/env node
'use strict';
global.React = require('react/react');
require('./build/server/cli').default(process.argv.slice(2)).catch(function(error) {
    console.error(error + '');
    process.exit(1);
});
