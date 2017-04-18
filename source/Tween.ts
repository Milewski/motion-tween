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

        const { target, origin, ease, duration, ...callbacks } = extend({}, this.defaults, options);

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

        // this.promise = promise;
        // this.resolver = resolver;

        // if (queue) this.chain(queue);

        // if (!promise) {
        this.promise = new Promise(resolve => this.resolver = resolve)
        // }

    }

    public then(options: () => void | TweenInterface) {

        if (typeof options === 'object') {
            return this.chain(options)
        }

        return this.promise.then(options);

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

    public chain(...options: TweenInterface[]) {

        options.forEach(option => {
            this.promise.then(() => {
                return ['hiu']
            })
        })

        this.queue.push(...options)

        return this

    }

    // public chain(...tweens: Tween[]) {
    //     tweens.forEach(tween => this.queue.push(tween))
    // }

}
