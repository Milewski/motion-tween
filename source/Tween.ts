import { TweenProperty } from "./TweenProperty";
import { dot, flat } from "./Helpers";

export class Tween {

    public properties: { [duration: string]: { [value: string]: TweenProperty[] } } = {}

    constructor({ target, origin, duration = 1 }) {

        if (target instanceof Object) {

            for (const { path, value } of flat(target)) {

                const property = new TweenProperty(origin, { path, duration, target: value });

                /**
                 * Group by Duration
                 */
                const timing = typeof duration === 'object' ? dot(duration, path) : duration;

                if (!this.properties[timing]) {
                    this.properties[timing] = {}
                }

                /**
                 * Group by Value
                 */
                if (!this.properties[timing][value]) {
                    this.properties[timing][value] = []
                }

                this.properties[timing][value].push(property)

            }

        }

        console.dir(this.properties)

    }

}
