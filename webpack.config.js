const path = require("path");

const config = {
    mode: 'none',
    target: 'node',
    entry: {
        "customer": "./src/customer.js",
        "staff": "./src/staff.js",
    },
    output: {
        libraryTarget: "commonjs",
        filename: "[name]/index.js",
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