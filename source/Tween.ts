import { TweenInterface, PropertyCompletion } from "./Interfaces/TweenInterface";
import { Ease } from "./Ease";
import { dot, extend, cloneBasedOnTarget } from "./Helpers";
import { Looper } from "./Looper";
import clone = THREE.UniformsUtils.clone;

export class Tween {

    static easings = Ease;
    private pool = [];
    private ease = new Ease();
    private loop: Looper;

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
                public loopEngine: any = Looper,
                public frameRate: number = 60) {

        if (autoStart)
            this.loop = new loopEngine(frameRate, ({ time, delta }) => {
                this.update(time, delta)
            });

    }

    public create(options: TweenInterface) {

        options = extend(this.defaults, options);

        // options.duration *=  1000;
        if (typeof options.origin !== typeof options.target) {
            // throw new TypeError('Origin and Target must to be the same type of object');
            // console.log(options)
        }

        if (options.origin instanceof Object) {
            // console.log('its an object')
        } else {

        }

        /**
         * Cache Properties
         */
        options.cache.properties = Object
            .getOwnPropertyNames(options.target instanceof Object ? options.target : options.origin)
            .filter(item => options['ignore'].indexOf(item) === -1)

        options.cache.origin = cloneBasedOnTarget(
            options.origin, (options.target instanceof Object) ? options.target : options.origin
        )

        this.pool.push(options)

        if (this.autoStart)
            this.start();

        return new Promise(function (accept) {
            options.cache.promise = accept
        });

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
                // console.log(origin, cache.origin)
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
        if ((!item.update(updateBag, elapsed) && (<any[]>result).length) || (<PropertyCompletion>result).complete) {
            this.pool.pop()
            item.complete()
            item.cache.promise()
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
                        cache, elapsed, duration, ease, target[key] || target, previous, property ? `${property}.${key}` : key, ignore
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

    public start() {
        this.loop.start();
    }

    public stop() {
        this.loop.stop();
    }

    public update(time: number, delta?: number) {

        this.pool.forEach(item => {
            this.interpolate(item, time);
        })

    }

}
