import { PropertyCompletion, TweenCacheInterface } from "./TweenInterface";

export interface MotionTweenInterface {

    compute(cache: TweenCacheInterface,
            elapsed: number,
            duration: number, ease,
            target: number | Object | any,
            origin: number | Object | any,
            property: string | null,
            ignore: string[]): PropertyCompletion[] | PropertyCompletion

}
