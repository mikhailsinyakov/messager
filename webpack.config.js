'use strict';
const webpack = require('webpack');

module.exports = {
    output: {
        path: __dirname + '/public',
        filename: 'bundle.js'
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader'
            }
        }]
    },
    resolve: {
        alias: {
            '@app': __dirname + '/app',
            '@src': __dirname + '/src'
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            'mode': JSON.stringify('production')
        })
    ],
    mode: 'production'
};