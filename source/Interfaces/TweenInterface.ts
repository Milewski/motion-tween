import { TweenProperty } from "../../declaration/source/TweenProperty";
export type Nested = { [key: string]: Nested | number };
export type NestedBoolean = { [key: string]: Nested | boolean };
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
    ease?: NestedString | string,
    duration?: Nested | number,
    start?(): any,
    ignore?: NestedBoolean | string[],
    complete?(): any,
    update?(properties: { [name: string]: TweenProperty } & TweenProperty): void,
    // update?(properties: { [key: string]: PropertyCompletion } & PropertyCompletion, elapsed: number): boolean | void,
}

export interface TweenCacheInterface {
    properties: string[],
    promise: (response?: any) => void,
    // duration: number,
    queue: TweenInterface[],
    clock: {},

    target: {}
}

export interface TweenInterface extends TweenRequiredInterface, TweenOptionalInterface {
    resolver?: () => void
    promise?: Promise<any>
    queue?: TweenInterface[]
}

export interface PropertyCompletion {
    property: string | null, //dot.marked
    complete: boolean,
    completion: number,
    value: number
}

export interface MotionTweenOptions {

}
