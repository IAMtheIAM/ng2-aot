var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    // helpers = require('./helpers.js'),
    // rootPath = helpers.paths.root,
    env = process.env.NODE_ENV || 'debug';

var config = {
    root: rootPath,
    node_env: env,
    localhost: {
        root: rootPath,
        app: {
            name: 'monsoon-nodejs-localhost'
        },
        port: process.env.PORT || 5000,
        node_env: env
    },

    development: {
        root: rootPath,
        app: {
            name: 'monsoon-nodejs-localhost'
        },
        port: process.env.PORT || 5000,
        node_env: env
    },

    debug: {
        root: rootPath,
        app: {
            name: 'monsoon-nodejs-debug'
        },
        port: process.env.PORT || 5000,
        node_env: env
    },

    staging: {
        root: rootPath,
        app: {
            name: 'monsoon-nodejs-staging'
        },
        port: process.env.PORT || 5000,
        node_env: env
    },

    production: {
        root: rootPath,
        app: {
            name: 'monsoon-nodejs'
        },
        port: process.env.PORT || 5000,
        node_env: env
    }
};
module.exports = config[env];
