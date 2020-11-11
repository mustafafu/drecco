var webpack = require("webpack");
module.exports = {
    entry: './entry.js',
    output: {
        path: './',
        filename: 'bundle.js'
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({minimize: true})
    ]
};