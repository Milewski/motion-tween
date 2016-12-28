import { Tween } from "../source/tween";
import { Vector } from "./Vector";

const { describe, it } = require('mocha');
const expect = require('expect.js');
const raf = require('raf')

class looper {

    constructor() {

        raf(function tick(time) {
            tween.update(time, 0)
            raf(tick)
        });

    }

    public update() {

    }

    public start() {

    }

}

describe('Tween', () => {

    let tween: Tween,
        vector: Vector

    beforeEach(() => {

        tween = new Tween(false);

        raf(function tick(time) {
            tween.update(time)
            raf(tick)
        })

        vector = new Vector()

    });

    it('should tween only the property specified given in target and leave the others untouched', () => {

        return tween.create({
            origin: vector,
            target: { x: 50 },
            duration: 0,
            complete(){
                expect(vector).to.be.eql({ x: 50, y: 0, z: 0 })
            }
        })

    });

    it('should accept a single integer as target to interpolate the origin', () => {

        return tween.create({
            origin: vector,
            target: 50,
            duration: 0,
            complete(){
                expect(vector).to.be.eql({ x: 50, y: 50, z: 50 })
            }
        })

    })

    it('should accept a single integer as origin as well', () => {

        return tween.create({
            origin: 10,
            target: 50,
            duration: 0,
            update(property){
                vector.setScalar(property.value)
            },
            complete(){
                expect(vector).to.be.eql({ x: 50, y: 50, z: 50 })
            }
        })

    })

});
