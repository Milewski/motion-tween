import { extend, stripe } from "./Helpers";
import { TweenInterface } from "./Interfaces/TweenInterface";

/**
 * Promise
 */
export class CustomPromise extends Promise {

    constructor(callback: Function, private options: any, private current: TweenInterface) {
        super(callback)
    }

    then(options: Function | {}) {

        if (typeof options === 'object') {
            this.current.cache.queue.push(
                extend({}, stripe('function', this.options), options)
            );
        } else {
            options()
        }

        return this;

    }

}


