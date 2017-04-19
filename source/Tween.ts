import { TweenProperty } from "./TweenProperty";
import { dot, extend, flat } from "./Helpers";
import { Ease } from "./Ease";
import { TweenInterface } from "./Interfaces/TweenInterface";
import { Events } from "./Events";

export class Tween {

    public started = false;
    public events: Events;
    public resolver: Function;
    public queue: TweenInterface[] = []
    public promise: Promise<TweenInterface[]>;
    public properties: TweenProperty[] = [];
    public defaults = {
        ease: Ease.LINEAR,
        duration: 1
    }

    constructor(options: TweenInterface) {

        const { target, origin, ease, duration, queue, ...callbacks } = extend({}, this.defaults, options);

        this.events = new Events(callbacks);

        const constTarget = typeof target === 'number';
        const eases = new Ease;

        for (const { path, value } of flat(constTarget ? origin : target)) {

            const property = new TweenProperty(origin, {
                ease: eases[ease].bind(eases),
                path: path,
                duration: (typeof duration === 'object') ? dot(duration, path) : duration,
                target: constTarget ? target : value
            });

            this.properties.push(property)

        }

        this.promise = new Promise(resolve => this.resolver = resolve)

        if (queue) this.queue = queue

    }

    public then(options: () => void | TweenInterface) {

        if (typeof options === 'object') {
            this.queue.push(options)
            return this
        }

        // /**
        //  * If there is some items in the queue attach it to the last one
        //  */
        // console.log(this.queue)
        // if (this.queue.length) {
        //     return this.queue[this.queue.length - 1].promise.then(options)
        // }

        return this.promise.then(options)

    }

    public interpolate(elapsed: number) {

        if (!this.started) {

            this.started = true

            if (this.events.start) {
                this.events.start()
            }

        } else {

            if (this.events.update) {
                this.events.update()
            }

        }

        return this.properties.filter(property => !property.interpolate(elapsed)).length === 0;

    }

    public chain(options: TweenInterface, tween: Tween) {

        const chain = new Tween(options)

        chain.queue = tween.queue
        chain.promise.then(() => tween.resolver())

        return chain

    }

    // public chain(...tweens: Tween[]) {
    //     tweens.forEach(tween => this.queue.push(tween))
    // }

}
