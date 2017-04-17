import TickerListener from "./TickerListener";

export default class Ticker {

    private head = new TickerListener(null, null, Infinity);
    private requestId = null
    private maxElapsedMS = 100
    public autoStart = false;
    public deltaTime = 1
    public elapsedMS = 1 / 0.06;
    public lastTime = 0;
    public speed = 1;
    public started = false;
    private tick;

    constructor() {

        this.tick = time => {

            this.requestId = null;

            if (this.started) {

                this.update(time);

                if (this.started && this.requestId === null && this.head.next) {
                    this.requestId = requestAnimationFrame(this.tick);
                }
            }

        };
    }

    /**
     * Conditionally requests a new animation frame.
     * If a frame has not already been requested, and if the internal
     * emitter has listeners, a new frame is requested.
     *
     * @private
     */
    private requestIfNeeded() {
        if (this.requestId === null && this.head.next) {
            // ensure callbacks get correct delta
            this.lastTime = performance.now();
            this.requestId = requestAnimationFrame(this.tick);
        }
    }

    /**
     * Conditionally cancels a pending animation frame.
     *
     * @private
     */
    private cancelIfNeeded() {
        if (this.requestId !== null) {
            cancelAnimationFrame(this.requestId);
            this.requestId = null;
        }
    }

    /**
     * Conditionally requests a new animation frame.
     * If the ticker has been started it checks if a frame has not already
     * been requested, and if the internal emitter has listeners. If these
     * conditions are met, a new frame is requested. If the ticker has not
     * been started, but autoStart is `true`, then the ticker starts now,
     * and continues with the previous conditions to request a new frame.
     *
     * @private
     */
    private startIfPossible() {
        if (this.started) {
            this.requestIfNeeded();
        }
        else if (this.autoStart) {
            this.start();
        }
    }

    public add(fn, context, priority = 0) {
        return this.addListener(new TickerListener(fn, context, priority));
    }

    /**
     * Add a handler for the tick event which is only execute once.
     *
     * @param {Function} fn - The listener function to be added for one update
     * @param {Function} [context] - The listener context
     * @param {number} [priority=PIXI.0] - The priority for emitting
     * @returns {PIXI.ticker.Ticker} This instance of a ticker
     */
    public addOnce(fn, context, priority = 0) {
        return this.addListener(new TickerListener(fn, context, priority, true));
    }

    /**
     * Internally adds the event handler so that it can be sorted by priority.
     * Priority allows certain handler (user, AnimatedSprite, Interaction) to be run
     * before the rendering.
     *
     * @private
     * @param {TickerListener} listener - Current listener being added.
     * @returns {PIXI.ticker.Ticker} This instance of a ticker
     */
    private addListener(listener) {
        // For attaching to head
        let current = this.head.next;
        let previous = this.head;

        // Add the first item
        if (!current) {
            listener.connect(previous);
        }
        else {
            // Go from highest to lowest priority
            while (current) {
                if (listener.priority >= current.priority) {
                    listener.connect(previous);
                    break;
                }
                previous = current;
                current = current.next;
            }

            // Not yet connected
            if (!listener.previous) {
                listener.connect(previous);
            }
        }

        this.startIfPossible();

        return this;
    }

    /**
     * Removes any handlers matching the function and context parameters.
     * If no handlers are left after removing, then it cancels the animation frame.
     *
     * @param {Function} fn - The listener function to be removed
     * @param {Function} [context] - The listener context to be removed
     * @returns {PIXI.ticker.Ticker} This instance of a ticker
     */
    public remove(fn, context) {

        let listener = this.head.next;

        while (listener) {
            // We found a match, lets remove it
            // no break to delete all possible matches
            // incase a listener was added 2+ times
            if (listener.match(fn, context)) {
                listener = listener.destroy();
            }
            else {
                listener = listener.next;
            }
        }

        if (!this.head.next) {
            this.cancelIfNeeded();
        }

        return this;
    }

    /**
     * Starts the ticker. If the ticker has listeners
     * a new animation frame is requested at this point.
     */
    public start() {
        if (!this.started) {
            this.started = true;
            this.requestIfNeeded();
        }
    }

    /**
     * Stops the ticker. If the ticker has requested
     * an animation frame it is canceled at this point.
     */
    public stop() {
        if (this.started) {
            this.started = false;
            this.cancelIfNeeded();
        }
    }

    /**
     * Destroy the ticker and don't use after this. Calling
     * this method removes all references to internal events.
     */
    public destroy() {
        this.stop();

        let listener = this.head.next;

        while (listener) {
            listener = listener.destroy(true);
        }

        this.head.destroy();
        this.head = null;
    }

    /**
     * Triggers an update. An update entails setting the
     * current {@link PIXI.ticker.Ticker#elapsedMS},
     * the current {@link PIXI.ticker.Ticker#deltaTime},
     * invoking all listeners with current deltaTime,
     * and then finally setting {@link PIXI.ticker.Ticker#lastTime}
     * with the value of currentTime that was provided.
     * This method will be called automatically by animation
     * frame callbacks if the ticker instance has been started
     * and listeners are added.
     *
     * @param {number} [currentTime=performance.now()] - the current time of execution
     */
    public update(currentTime = performance.now()) {

        let elapsedMS;

        if (currentTime > this.lastTime) {

            elapsedMS = this.elapsedMS = currentTime - this.lastTime;

            if (elapsedMS > this.maxElapsedMS) {
                elapsedMS = this.maxElapsedMS;
            }

            this.deltaTime = elapsedMS * 0.06 * this.speed;

            const head = this.head;

            let listener = head.next;

            while (listener) {
                listener = listener.emit(this.deltaTime);
            }

            if (!head.next) {
                this.cancelIfNeeded();
            }

        }
        else {
            this.deltaTime = this.elapsedMS = 0;
        }

        this.lastTime = currentTime;

    }

    get FPS() {
        return 1000 / this.elapsedMS;
    }

    get minFPS() {
        return 1000 / this.maxElapsedMS;
    }

    set minFPS(fps) {
        this.maxElapsedMS = 1 / Math.min(Math.max(0, fps) / 1000, 0.06);
    }
}
