import { TweenInterface } from "./Interfaces/TweenInterface";
import { Promise } from "es6-promise";
import { Tween } from "./Tween";

/**
 * Promise
 */
export class CustomPromise {

    private promise;

    constructor(callback: Function, private tween: Tween) {
        this.promise = new Promise(accept => callback(accept))
    }

    then(options: Function | TweenInterface) {

        // if (typeof options === 'object') {
        //     this.tween.cache.queue.push(
        //         extend({}, stripe('function', this.options), options)
        //     );
        // }

        return this.promise.then(options);

    }

}


