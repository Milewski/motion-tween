export class Vector {

    constructor(public x = 0, public y = 0, public z = 0) {
    }

    public setScalar(value: number) {
        this.x = this.y = this.z = value;
    }

}
