"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typescript = require("rollup-plugin-typescript");
const resolve = require("rollup-plugin-node-resolve");
const commonjs = require("rollup-plugin-commonjs");
module.exports = {
    entry: 'source/MotionTween.ts',
    format: 'umd',
    moduleName: 'MotionTween',
    dest: 'distribution/motion-tween.js',
    plugins: [
        resolve({
            module: true,
            main: true
        }),
        commonjs({}),
        typescript({
            typescript: require('typescript')
        })
    ]
};
//# sourceMappingURL=rollup.config.js.map