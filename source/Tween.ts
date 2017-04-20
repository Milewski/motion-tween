import { TweenProperty } from "./TweenProperty";
import { dot, extend, flat, keyBy } from "./Helpers";
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
        duration: 1,
        ignore: []
    }

    constructor(options: TweenInterface) {

        let { target, origin, ignore, ease, duration, queue, ...callbacks } = extend({}, this.defaults, options);

        this.events = new Events(callbacks);

        const constTarget = typeof target === 'number';
        const eases = new Ease;

        /**
         * Flat out ignore object
         */
        if (typeof ignore === 'object') {
            ignore = flat(ignore).filter(({ value }) => value).map(({ path }) => path)
        }

        if (typeof origin === 'number') {

            const property = new TweenProperty(origin, {
                ease: eases[ease].bind(eases), path: null, duration, target
            });

            this.properties.push(property)

        } else {

            for (const { path, value } of flat(constTarget ? origin : target)) {

                if (ignore.filter(key => key === path).length) {
                    continue
                }

                let easeFuncName = (typeof eases === 'object') ? dot(ease, path) : eases[ease]

                try {

                    const property = new TweenProperty(origin, {
                        ease: (easeFuncName ? eases[easeFuncName] : eases[this.defaults.ease]).bind(eases),
                        path: path,
                        duration: (typeof duration === 'object') ? dot(duration, path) : duration,
                        target: constTarget ? target : value
                    });

                    this.properties.push(property)

                } catch (error) {
                    throw new Error(`invalid easing function: { ${easeFuncName} }`)
                }

            }

        }

        this.promise = new Promise(resolve => this.resolver = resolve)

        if (queue) this.queue = queue

    }

    public then(options: TweenInterface | Function) {

        if (typeof options === 'object') {
            this.queue.push(options)
            return this
        }

        return this.promise.then(options as () => void)

    }

    public interpolate(elapsed: number) {

        if (!this.started) {

            this.started = true

            if (this.events.start) {
                this.events.start()
            }

        }

        const result = this.properties.filter(property => !property.interpolate(elapsed));

        if (this.events.update) {

            if (this.properties.length > 1) {
                this.events.update(keyBy(this.properties, 'name'))
            } else this.events.update(...this.properties)

        }

        return result.length === 0;

    }

    public chain(options: TweenInterface, tween: Tween) {

        const chain = new Tween(options)

        chain.queue = tween.queue
        chain.promise.then(() => tween.resolver())

        return chain

    }

}
