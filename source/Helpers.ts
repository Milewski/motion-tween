import { type } from "os";
/**
 * Deep set a property into an object dot.marked
 * @param object
 * @param path
 * @param value
 * @returns {any}
 */
export const dot = function (object: any, path: string, value?: any) {

    return path.split('.').map((property) => {
        if (object[property] instanceof Object) {
            return object = object[property]
        } else if (value === undefined) {
            return object[property]
        } else {
            return object[property] = value
        }
    }).reduceRight(a => a)

}

/**
 * Extend Object
 *
 * @param defaults
 * @param object
 * @returns {any}
 */
export const extend = (defaults: any, ...object: any[]): any => {

    for (let a in object) {
        for (let b in object[a]) {
            if (object[a].hasOwnProperty(b)) {
                defaults[b] = object[a][b];
            }
        }
    }

    return defaults;

};

export const cloneBasedOnTarget = (origin: {}, target: {} = origin) => {

    /**
     * If origin is a number
     * then nothing to extend here
     */
    if (typeof origin === 'number') return origin;

    let clone = {};

    for (let property in target) {

        let object = target[property];

        if (typeof object === 'object') {
            clone[property] = cloneBasedOnTarget(origin[property], object)
        } else if (typeof object === 'number') {
            clone[property] = origin[property]
        }

    }

    return clone

}

export const stripe = <A>(type: string, object: A): A => {

    for (let key in object) {
        if (typeof  object[key] === type) {
            delete object[key];
        }
    }

    return object

}

// export const sum = (object): number => {
//
//     if (typeof object === 'number') return object;
//
//     let sum = 0;
//
//     for (let key in object) {
//         sum += parseInt(object[key])
//     }
//
//     return sum;
// }
