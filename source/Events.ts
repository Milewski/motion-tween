import { EventsInterface } from "./Interfaces/EventsInterface";

export class Events {

    public start: Function;
    public update: Function;
    public complete: Function;

    constructor({ start, update, complete }: EventsInterface) {
        this.start = start;
        this.update = update;
        this.complete = complete;
    }

}
