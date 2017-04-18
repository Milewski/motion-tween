import { TweenInterface } from "./Interfaces/TweenInterface";
import { Promise } from "es6-promise";
import { Tween } from "./Tween";

/**
 * Promise
 */
export class CustomPromise {

    private promise;
    private tween: Tween

    constructor(callback: Function, tween: Tween) {
        this.tween = tween
        this.promise = new Promise(accept => callback(accept))
    }

    then(options: Function | TweenInterface) {

        if (typeof options === 'object') {
            return this.tween.chain(options)
        }

        return this.promise.then(options);

    }

}


