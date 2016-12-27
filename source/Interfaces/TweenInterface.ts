export interface TweenInterface {
    ease?: string,
    origin: {},
    target: {},
    duration?: number,
    complete(): void,
    readonly cache?: {
        properties: string[],
        promise: () => void,
        clock: {}
    }
}

export interface PropertyCompletion {
    property: string, //dot.marked
    complete: boolean,
    completion: number,
    value: number
}
