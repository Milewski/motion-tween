export class Looper {

    private running = false
    private frameID = 0;
    private then = 0;
    private interval: number;
    private elapsed: number = 0;
    private oldTime = 0;

    private intervalElapsedTime = 0

    constructor(private frameRate: number = 60, private callback: Function) {
        this.interval = 1000 / frameRate
    }

    public loop(now: number) {

        if (this.running)
            this.frameID = requestAnimationFrame(this.loop.bind(this));

        let delta = now - this.oldTime;

        /**
         * If delta is higher than 160,
         * then lets assume user has switched tabs
         * so we reset delta back to 0
         */
        if (delta > 160) delta = 0;

        this.elapsed += delta;
        this.intervalElapsedTime += delta;

        if (this.intervalElapsedTime >= this.interval) {

            this.callback({
                delta: this.intervalElapsedTime,
                time: this.elapsed
            })

            this.intervalElapsedTime %= this.interval

        }

        this.oldTime = now;

    }

    start() {
        if (!this.running) {
            this.running = true;
            this.frameID = requestAnimationFrame(now => {
                this.oldTime = now
                this.loop(0)
            });
        }
    }

    reset() {
        this.elapsed = 0
    }

    stop() {
        this.running = false;
        cancelAnimationFrame(this.frameID);
    }

}
