const path = require('path');

module.exports = {
    context: __dirname,
    entry: {
        app: ['./app.js']
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    }
}
