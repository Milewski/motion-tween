export class Clock {

    private startTime = 0;
    private oldTime = 0;
    private elapsedTime = 0;
    private timer = (typeof performance !== 'undefined') ? performance : Date

    private running = false;

    constructor(public autoStart = true) {
    }

    start() {

        /**
         * Use Performance or fallback to date
         * @type {number}
         */

        this.startTime = this.timer.now();

        this.oldTime = this.startTime;
        this.elapsedTime = 0;
        this.running = true;

    }

    stop() {
        this.getElapsedTime();
        this.running = false;
    }

    getElapsedTime() {
        this.getDelta();
        return this.elapsedTime;
    }

    getDelta() {

        var diff = 0;

        if (this.autoStart && !this.running) {
            this.start();
        }

        if (this.running) {

            var newTime = this.timer.now();

            diff = ( newTime - this.oldTime ) / 1000;
            this.oldTime = newTime;

            this.elapsedTime += diff;

        }

        return diff;

    }

}
