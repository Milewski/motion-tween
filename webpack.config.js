module.exports = {
    watch: true,
    entry: {
        tween: './source/Tween.js',
        test: './source/Test.js',
    },
    output: {
        filename: '[name].js',
        path: './distribution'
    }
}
