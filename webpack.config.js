const webpack = require('webpack');

module.exports = {
    watch: false,
    entry: {
        tween: './source/Tween.js'
    },
    output: {
        filename: 'motion-tween.js',
        path: './distribution'
    },
    plugins:[
        new webpack.optimize.UglifyJsPlugin({
            mangle: true,
            comments: false,
            compress: {
                warnings: false
            }
        })
    ]
}
