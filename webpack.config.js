const webpack = require('webpack');

module.exports = {
    watch: false,
    entry: {
        tween: './source/Tween.js'
    },
    output: {
        filename: 'motion-tween.js',
        path: './distribution',
        libraryTarget: 'commonjs2'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            }
        ]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            mangle: true,
            comments: false,
            compress: {
                warnings: false
            }
        })
    ]
}
