import { Nested } from "./Interfaces/TweenInterface";
import { dot } from "./Helpers";
import { Events } from "./Events";

export class TweenProperty {

    public object: { [key: string]: Nested };
    public name: string;
    public path: string;
    public target: number;
    public duration: number;
    public completion: number;
    public complete: boolean = false;
    public value: number;
    public ease: Function;
    public events: Events

    constructor(object, { ease, path, target, duration = 1}) {

        this.object = object;
        this.path = path;
        this.name = path ? path.split('.').pop() : path;
        this.ease = ease;
        this.target = target;
        this.duration = duration;
        this.value = (typeof object === 'object') ? dot(object, path) : object

    }

    set(value: number) {

        this.value = value

        if (typeof this.object === 'object')
            dot(this.object, this.path, this.value)

    }

    interpolate(elapsed: number): boolean {

        const completion = (elapsed / this.duration) * 100;
        const complete = this.completion >= 100;

        this.complete = complete;
        this.completion = complete ? 100 : completion;

        if (complete) {
            return this.set(this.target) || complete
        }

        this.set(
            this.ease(elapsed, this.value, this.target - this.value, this.duration)
        )

        return complete

    }

}
