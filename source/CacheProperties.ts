export class CacheProperties {

    public properties: string[]
    public origin: { [key: string]: any }

    public promise: {
        reject: Function,
        resolve: Function
    }

}
