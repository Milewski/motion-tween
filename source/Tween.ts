import { TweenProperty } from "./TweenProperty";
import { dot, flat } from "./Helpers";
import { Ease } from "./Ease";

export class Tween {

    public properties: {
        [ease: string]: {
            [duration: string]: {
                [value: string]: TweenProperty[]
            }
        }
    } = {}

    constructor({ target, origin, ease = Ease.LINEAR, duration = 1 }) {

        if (target instanceof Object) {

            for (const { path, value } of flat(target)) {

                const property = new TweenProperty(origin, { path, duration, target: value });

                /**
                 * Group by Ease
                 */
                if (!this.properties[ease]) {
                    this.properties[ease] = {}
                }

                /**
                 * Group by Duration
                 */
                const timing = typeof duration === 'object' ? dot(duration, path) : duration;

                if (!this.properties[ease][timing]) {
                    this.properties[ease][timing] = {}
                }

                /**
                 * Group by Value
                 */
                if (!this.properties[ease][timing][value]) {
                    this.properties[ease][timing][value] = []
                }

                this.properties[ease][timing][value].push(property)

            }

        }

    }

}
