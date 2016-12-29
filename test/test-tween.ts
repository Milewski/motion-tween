import { Tween } from "../source/tween";
import { Vector } from "./Vector";

const { describe, it } = require('mocha');
const expect = require('expect.js');
const raf = require('raf')

describe('Tween', () => {

    let tween: Tween,
        vector: Vector

    beforeEach(() => {

        tween = new Tween(false);
        vector = new Vector()

        /** Loop */
        raf(function tick(time) {
            tween.update(time)
            raf(tick)
        })

    });

    it('should tween only the property specified given in target and leave the others untouched', () => {

        return tween.create({
            origin: vector,
            target: { x: 50 },
            duration: 1,
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

    it('should leave the ignored properties untouched', () => {

        return tween.create({
            origin: vector,
            target: -95,
            ignore: ['x', 'z'],
            duration: 0,
            complete(){
                expect(vector).to.be.eql({ x: 0, y: -95, z: 0 })
            }
        })

    })

    it('should allow to specify duration and eases as an object', () => {

        return tween.create({
            origin: vector,
            target: -95,
            ease: {
                x: Tween.easings.BOUNCEIN,
                y: Tween.easings.SINEIN,
                z: Tween.easings.LINEAROUT,
            },
            duration: { x: 1, y: .5, z: .3 },
            complete(){
                expect(vector).to.be.eql({ x: -95, y: -95, z: -95 })
            }
        })

    })

    it('should play well with simultaneously tween', () => {

        let animation = tween.create({
            origin: vector,
            target: { x: 10 },
            duration: 2,
            ease: Tween.easings.LINEAR,
            complete(){
                expect().to.fail('This should not be call.')
            }
        })

        return tween.create({
            origin: vector,
            target: { y: 10 },
            duration: 1,
            complete(){
                expect(vector.x).to.be.within(4.5, 5.5);
                expect(vector.y).to.be(10);
            }
        })

    });

    // it('should play chain in sequence', () => {
    //
    //    return tween.create({
    //         origin: vector,
    //         target: 10,
    //         ease: Tween.easings.SINEIN,
    //         duration: 5,
    //         complete(){
    //             console.log('finish')
    //         }
    //     })
    //
    // })

});
