import { Nested } from "./Interfaces/TweenInterface";
import { dot } from "./Helpers";

export class TweenProperty {

    public object: { [key: string]: Nested };
    public name: string;
    public path: string;
    public target: number;
    public duration: number;

    constructor(object, { path, target, duration = 1 }) {

        this.object = object;
        this.path = path;
        this.name = path.split('.').pop();
        this.target = target;
        this.duration = duration;

    }

    set(value: number) {
        dot(this.object, this.path, value)
    }

}
