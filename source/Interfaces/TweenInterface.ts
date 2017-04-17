export type Nested = { [key: string]: Nested | number };
export type NestedString = { [key: string]: NestedString | string };

// type Readonly<T> = {
//     readonly [P in keyof T]: T[P]
//     }
// type Partial<T> = {
//     [P in keyof T]?: T[P]
//     }

export interface TweenRequiredInterface {
    origin: Nested | number | {},
    target: Nested | number | {},
}

export interface TweenOptionalInterface {
    // ease?: NestedString | string,
    duration?: Nested | number,
    // ignore?: string[],
    complete?(): any,
    // update?(properties: { [key: string]: PropertyCompletion } & PropertyCompletion, elapsed: number): boolean | void,
}

export interface TweenCacheInterface {
    properties: string[],
    promise: (response?: any) => void,
    // duration: number,
    queue: TweenInterface[],
    clock: {},
    origin: {},
    target: {}
}

export interface TweenInterface extends TweenRequiredInterface, TweenOptionalInterface {
    readonly cache?: TweenCacheInterface
}

export interface PropertyCompletion {
    property: string | null, //dot.marked
    complete: boolean,
    completion: number,
    value: number
}

export interface MotionTweenOptions {

}
