import { TweenInterface, PropertyCompletion } from "./Interfaces/TweenInterface";
import { Ease } from "./Ease";
import { Clock } from "./Clock";
import { dot, extend } from "./Helpers";

export class Tween {

    static easings = Ease;

    private pool = [];
    private ease = new Ease();

    get defaults() {
        return {
            ignore: [],
            duration: 1,
            ease: Tween.easings.EXPOIN,
            cache: {
                clock: new Clock()
            },
            complete(){
            }
        }
    }

    public create(options: TweenInterface) {

        options = extend(this.defaults, options);

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

        this.pool.push(options)

        for (let property in options.origin) {
            // console.log(property)
        }

        return new Promise(function (accept) {
            options.cache.promise = accept
        });

    }

    private interpolate(item, time: number) {

        let { cache, duration, target, origin, ease, transform, ignore } = item,
            elapsed = cache.clock.getElapsedTime(),
            completion = (elapsed / duration) * 100;

        let result = this
            .compute(cache, elapsed, duration, ease, target, origin, null, ignore)
            .filter(eased => {

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
                    dot(origin, eased.property, eased.value)
                }

                return eased.complete;

            })

        if (result.length) {
            this.pool.pop()
            item.complete()
            item.cache.promise()
        }

    }

    private compute(cache, elapsed: number, duration: number, ease,
                    target: number | Object, origin: number | Object,
                    property: string | null = null,
                    ignore: string[] = []): PropertyCompletion[] {

        if (origin instanceof Object) {

            return cache.properties.map(key => {

                // Only call once just in case it is a getter which can change on every time it is called
                let previous = origin[key];

                return typeof previous === 'number' ? this.compute(
                        cache, elapsed, duration, ease, target[key] || target, previous, property ? `${property}.${key}` : key, ignore
                    ) : [];
            }) .reduce((a, b) => a.concat(b), [])

        }

        let completion = (elapsed / duration) * 100,
            complete = completion >= 100;

        return <any>{
            property: property,
            complete: complete,
            completion: completion,
            value: complete ? target : this.ease[ease](
                    elapsed, 0, target, duration
                )
        }

    }

    public update(time: number, delta: number) {

        this.pool.forEach((item, index) => {
            this.interpolate(item, time);
        })

    }

}
