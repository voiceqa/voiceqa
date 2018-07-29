const path = require("path");

const config = {
    mode: 'none',
    target: 'node',
    entry: {
        "index": "./src/index.js",
    },
    output: {
        libraryTarget: "commonjs",
        filename: "[name].js",
        path: path.join(__dirname, "./artifacts/")
    },
    externals: [
        "aws-sdk",
        "aws-lambda"
    ],
    resolve: {
        extensions: ['.ts', '.js', '.json'],
    },
    module: {
        rules: [
            { test: /\.ts$/, use: 'ts-loader' }
        ]
    }
};


module.exports = config;