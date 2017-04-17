import { MotionTweenOptions, TweenInterface } from "./Interfaces/TweenInterface";
import { Ease } from "./Ease";
import { CustomPromise } from "./CustomPromise";
import { cloneBasedOnTarget, dot, extend } from "./Helpers";
import { MotionTweenInterface } from "./Interfaces/MotionTweenInterface";
import { Tween } from "./Tween";

export class MotionTween implements MotionTweenInterface {

    static easings = Ease;
    private pool: Tween[] = [];
    private eases = new Ease();
    private loop;
    private timer = 0;
    private autoStart = true
    private frameRate = 60
    private queue = []

    constructor(options?: MotionTweenOptions) {

        // if (autoStart)
        //     this.loop = new loopEngine(frameRate, ({ time, delta }) => {
        //         this.update(time, delta)
        //     });

    }

    public create(options: TweenInterface) {

        let tween = new Tween(options)

        this.pool.push(tween);

        return new CustomPromise((resolve, reject) => tween.setPromise(resolve, reject), tween);

    }

    public creates(options: TweenInterface & TweenInterface[] | any) {

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
            .keys(options.target instanceof Object ? options.target : options.origin)
            .filter(item => options['ignore'].indexOf(item) === -1)

        options.cache.origin = cloneBasedOnTarget(
            options.origin, (options.target instanceof Object) ? options.target : options.origin
        )

        options.cache.queue = queue;

        this.pool.push(options)

        // if (this.autoStart)
        //     this.start();

        return new CustomPromise(accept => options.cache.promise = accept, original, options);

    }

    private interpolate(tween: Tween, elapsed: number) {

        let { cache, duration, target, origin, ease, transform, ignore } = tween,
            updateBag = {};

        let result = this.compute(cache, elapsed - this.timer, duration, ease, target, cache.origin, null, ignore);
// console.log(result)
        /**
         * If its an array means user has sent an object as origin therefore
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
console.log(eased)
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
        tween.update(updateBag, elapsed)

        if ((result.length === tween.cache.properties.length) || result.complete) {

            this.remove(tween)

            tween.cache.promise.resolve(
                tween.complete()
            )

        }

    }

    public compute(cache, elapsed, duration, ease, target, origin, property, ignore = []) {

        if (origin instanceof Object) {

            return cache.properties.map(key => {

                /**
                 * Only call once just in case it is a
                 * getter which could change on every time it is called
                 */
                let previous = origin[key];

                if (typeof previous === 'number') {

                    duration = duration[key] || duration;
                    ease = ease[key] || ease;
                    target = target[key] || target;
                    property = property ? `${property}.${key}` : key;

                    return this.compute(
                        cache, elapsed, duration, ease, target, previous, property, ignore
                    )

                }

                return [];

            }).reduce((a, b) => a.concat(b), [])

        }

        let completion = (elapsed / duration) * 100,
            complete = completion >= 100;

        return {
            property,
            complete,
            completion: complete ? 100 : completion,
            value: complete ? target : this.eases[ease](
                elapsed, origin, target - origin, duration
            )
        }

    }

    private remove(tween: Tween) {
        this.pool.splice(
            this.pool.indexOf(tween), 1
        )
    }

    public start() {
        this.loop.start();
    }

    public stop() {
        this.loop.stop();
    }

    public update(time: number) {

        this.pool.forEach(tween => {
            this.interpolate(tween, time / 1000);
        })

    }

}
