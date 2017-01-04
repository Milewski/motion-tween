import { TweenInterface, PropertyCompletion } from "./Interfaces/TweenInterface";
import { Ease } from "./Ease";
import { CustomPromise } from "./CustomPromise";
import { dot, extend, cloneBasedOnTarget } from "./Helpers";
import { RAF } from "motion-tween-raf-engine";

export class Tween {

    static easings = Ease;
    private pool = [];
    private ease = new Ease();
    private loop: RAF;

    get defaults() {
        return {
            ignore: [],
            duration: 1,
            ease: Tween.easings.EXPOIN,
            cache: {},
            update(){
            },
            complete(){
            }
        }
    }

    constructor(public autoStart: boolean = true,
                public loopEngine: any = RAF,
                public frameRate: number = 60) {

        if (autoStart)
            this.loop = new loopEngine(frameRate, ({ time, delta }) => {
                this.update(time, delta)
            });

    }

    public create(options: TweenInterface & TweenInterface[] | any) {

        let queue = [];

        if (Array.isArray(options)) {
            queue = options;
            options = options.shift()
        }

        let original = options;

        options = extend({}, this.defaults, options);

        /**
         * Cache Properties
         */
        options.cache.properties = Object
            .getOwnPropertyNames(options.target instanceof Object ? options.target : options.origin)
            .filter(item => options['ignore'].indexOf(item) === -1)

        options.cache.origin = cloneBasedOnTarget(
            options.origin, (options.target instanceof Object) ? options.target : options.origin
        )

        options.cache.queue = queue;

        // options.cache.duration = sum(options.duration)

        this.pool.push(options)

        if (this.autoStart)
            this.start();

        return new CustomPromise(accept => {
            options.cache.promise = accept
        }, original, options);

    }

    private interpolate(item, elapsed: number) {

        let { cache, duration, target, origin, ease, transform, ignore } = item,
            updateBag = {};

        let result = this.compute(cache, elapsed, duration, ease, target, cache.origin, null, ignore);

        /**
         * If its an array means user has sent a object as origin therefore
         * it should be filtered until all items are completed
         */
        if (Array.isArray(result)) {

            result = result.filter(eased => {

                /**
                 * If its desired to manually assign the value to the object,
                 * then let it happens
                 */
                if (transform) {
                    transform(origin, eased.property, eased.value)
                } else {

                    /**
                     * Set computed value into the original instance
                     */
                    if (eased.property !== null)
                        dot(origin, eased.property, eased.value)
                }

                /**
                 * Assign the property to be send to the update callback
                 */
                updateBag[eased.property] = eased

                return eased.complete;

            });

        } else {
            updateBag = result
        }

        /**
         * If update returns true, lets consider that the user wants the animation
         * to freezes at that point until it returns otherwise
         */

        if ((!item.update(updateBag, elapsed) && (<any[]>result).length === item.cache.properties.length)
            || (<PropertyCompletion>result).complete) {

            this.remove(item)
            item.complete()
            item.cache.promise()

            /**
             * if there is no more items in the queue, reset the counter
             * *Loop may be undefined due to the ability to use your own loop
             */
            if (this.loop && !this.pool.length) {
                this.loop.reset()
            }

            /**
             * if there are more items to play send them now
             */
            if (item.cache.queue.length) {
                this.create(item.cache.queue)
            }

        }

    }

    private compute(cache, elapsed: number, duration: number, ease,
                    target: number | Object | any, origin: number | Object | any,
                    property: string | null = null,
                    ignore: string[] = []): PropertyCompletion[] | PropertyCompletion {

        if (origin instanceof Object) {

            return cache.properties.map(key => {

                /**
                 * Only call once just in case it is a
                 * getter which could change on every time it is called
                 */
                let previous = origin[key];

                if (typeof previous === 'number') {
                    return this.compute(
                        cache, elapsed, duration[key] || duration, ease[key] || ease, target[key] || target, previous, property ? `${property}.${key}` : key, ignore
                    )
                }

                return [];

            }).reduce((a, b) => a.concat(b), [])

        }

        let completion = (elapsed / duration) * 100,
            complete = completion >= 100;

        return {
            property: property,
            complete: complete,
            completion: complete ? 100 : completion,
            value: complete ? target : this.ease[ease](
                    elapsed, origin, target - origin, duration
                )
        }

    }

    private remove(item: TweenInterface) {
        this.pool.splice(
            this.pool.indexOf(item), 1
        )
    }

    public start() {
        this.loop.start();
    }

    public stop() {
        this.loop.stop();
    }

    public update(time: number, delta?: number) {

        this.pool.forEach(item => {
            this.interpolate(item, time / 1000);
        })

    }

}
