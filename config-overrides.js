/* config-overrides.js */
const path = require('path');

const rewireTypescript = require('react-app-rewire-typescript');

module.exports = function override(config, env) {
    config = rewireTypescript(config, env);
    config = {
        ...config,
        resolve: {
            alias: {
                Utils: path.resolve(__dirname, 'src/Utils/'),
                Components: path.resolve(__dirname, 'src/Components/')
            }
        }
    }
    return config;
}
