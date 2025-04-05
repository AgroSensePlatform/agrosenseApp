const webpack = require("@nativescript/webpack");
const Dotenv = require("dotenv-webpack");

module.exports = (env) => {
    webpack.init(env);

    webpack.chainWebpack((config) => {
        config.plugin("dotenv").use(Dotenv, [{
            path: "./.env", // Path to your .env file
            safe: true,     // Optional: Load .env.example to verify required variables are set
            systemvars: true
        }]);
    });

    return webpack.resolveConfig();
};
