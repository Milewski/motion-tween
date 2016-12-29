const webpack = require('webpack');


module.exports = {
    watch: true,
    entry: {
        tween: './source/Tween.js',
        test: './source/Test.js',
    },
    output: {
        filename: '[name].js',
        path: './distribution'
    },
    plugins:[
        // new webpack.optimize.UglifyJsPlugin({
        //     mangle: false,
        //     comments: false,
        //     compress: {
        //         warnings: false
        //     }
        // })
    ]
}
