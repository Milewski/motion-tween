import { MotionTweenOptions, TweenInterface } from "./Interfaces/TweenInterface";
import { MotionTweenInterface } from "./Interfaces/MotionTweenInterface";
import { Tween } from "./Tween";

export class MotionTween implements MotionTweenInterface {

    private pool: Tween[] = [];
    private timer = 0;
    private promise: Promise<TweenInterface[]>

    constructor(options?: MotionTweenOptions) {

    }

    public create(options: TweenInterface) {
        const tween = new Tween(options);
        this.pool.push(tween);
        return tween;
    }

    private interpolate(tween: Tween, elapsed: number) {

        if (tween.interpolate(elapsed - this.timer)) {

            if (tween.events.complete)
                tween.events.complete()

            this.remove(tween)

            tween.resolver()

            this.timer += elapsed

            return true

        }

        return false;

    }

    private remove(tween: Tween) {
        this.pool.splice(
            this.pool.indexOf(tween), 1
        )
    }

    public update(time: number) {

        time = time / 1000;

        this.pool.forEach(tween => {

            if (this.interpolate(tween, time)) {
                tween.promise.then(console.log)
            }

        })

    }

}
