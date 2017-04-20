/**
 * Deep set a property into an object dot.marked
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

export const flat = (object: {}, path = '') => {

    return Object.keys(object).map(property => {

        if ((typeof object[property]) === 'object' && object[property] !== null) {
            return flat(object[property], `${path}${property}.`).reduceRight(prop => prop)
        }

        return {
            path: path + property,
            value: object[property]
        }

    })

}

/**
 * Extend Object
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
        if (typeof object[key] === type) {
            delete object[key];
        }
    }

    return object

}

export const keyBy = function (array: any[], key: string) {
    const object = {}
    array.forEach(item => object[item[key]] = item)
    return object
};
