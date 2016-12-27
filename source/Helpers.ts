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
