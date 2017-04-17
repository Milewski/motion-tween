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

        for (let ease in tween.properties) {

            for (let duration in tween.properties[ease]) {

                for (let value in tween.properties[ease][duration]) {

                    tween.properties[ease][duration][value].forEach(element => {
                       console.log(element)
                    })

                }

            }

        }

    }

    public compute() {
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
