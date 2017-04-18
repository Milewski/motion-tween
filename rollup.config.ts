import * as typescript from "rollup-plugin-typescript";
import * as resolve from 'rollup-plugin-node-resolve';
import * as commonjs from 'rollup-plugin-commonjs';

module.exports = {
    entry: 'source/MotionTween.ts',
    format: 'umd',
    moduleName: 'MotionTween',
    dest: 'distribution/motion-tween.js',
    plugins: [
        resolve({
            module: true, // Default: true,
            main: true
        }),
        commonjs({}),
        typescript({
            typescript: require('typescript')

        })
    ]
};
