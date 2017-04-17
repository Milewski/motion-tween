/**
 * Internal class for handling the priority sorting of ticker handlers.
 */
export default class TickerListener {

    public next = null;
    public previous = null;
    private destroyed = false;

    constructor(public fn, public context = null, public priority = 0, public once = false) {

    }

    /**
     * Simple compare function to figure out if a function and context match.
     *
     * @param {Function} fn - The listener function to be added for one update
     * @param {Function} context - The listener context
     * @return {boolean} `true` if the listener match the arguments
     */
    match(fn, context) {
        context = context || null;

        return this.fn === fn && this.context === context;
    }

    /**
     * Emit by calling the current function.
     * @param {number} deltaTime - time since the last emit.
     * @return {TickerListener} Next ticker
     */
    emit(deltaTime) {
        if (this.context) {
            this.fn.call(this.context, deltaTime);
        }
        else {
            this.fn(deltaTime);
        }

        if (this.once) {
            this.destroy();
        }

        const redirect = this.next;

        // Soft-destroying should remove
        // the next reference
        if (this.destroyed) {
            this.next = null;
        }

        return redirect;
    }

    /**
     * Connect to the list.
     * @param {TickerListener} previous - Input node, previous listener
     */
    connect(previous) {
        this.previous = previous;
        if (previous.next) {
            previous.next.previous = this;
        }
        this.next = previous.next;
        previous.next = this;
    }

    /**
     * Destroy and don't use after this.
     * @param {boolean} [hard = false] `true` to remove the `next` reference, this
     *        is considered a hard destroy. Soft destroy maintains the next reference.
     * @return {TickerListener} The listener to redirect while emitting or removing.
     */
    destroy(hard = false) {
        this.destroyed = true;
        this.fn = null;
        this.context = null;

        // Disconnect, hook up next and previous
        if (this.previous) {
            this.previous.next = this.next;
        }

        if (this.next) {
            this.next.previous = this.previous;
        }

        // Redirect to the next item
        const redirect = this.previous;

        // Remove references
        this.next = hard ? null : redirect;
        this.previous = null;

        return redirect;
    }
}
