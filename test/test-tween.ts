import { Tween } from "../source/tween";
import { Vector } from "./Vector";
import { MotionTween } from "../source/MotionTween";

const { describe, it } = require('mocha');
const expect = require('expect.js');
const raf = require('raf')

describe('Tween', () => {

    let tween: MotionTween,
        vector: Vector

    beforeEach(() => {

        tween = new MotionTween();
        vector = new Vector()

        /** Loop */
        raf(function tick(time) {
            tween.update(time)
            raf(tick)
        })

    });

    it('should work with the most basic settings', () => {
        return tween.create({ origin: 0, target: 10 })
    })

    it('should interpolate origin with target (as number)', () => {

        return tween.create({
            origin: vector,
            target: 10,
            complete: () => expect(vector).to.be.eql({ x: 10, y: 10, z: 10 })
        })

    })

    it('should interpolate origin with target (as object)', () => {

        return tween.create({
            origin: vector,
            target: { x: 2, y: 4, z: 6 },
            complete: () => expect(vector).to.be.eql({ x: 2, y: 4, z: 6 })
        })

    })

    it('should not touch properties unset in target', () => {

        return tween.create({
            origin: vector,
            target: { x: 1, y: 2 },
            complete: () => expect(vector).to.be.eql({ x: 1, y: 2, z: 0 })
        })

    })

    it('should consider the duration (as number)', () => {

        return tween.create({
            origin: vector,
            target: 10,
            duration: 1,
            complete: () => expect(vector).to.be.eql({ x: 10, y: 10, z: 10 })
        })

    })

    it('should consider the duration (as object)', () => {

        return tween.create({
            origin: vector,
            target: 5,
            duration: { x: 2 / 100, y: 2 / 50, z: 1 / 30 },
            update: ({ x, y, z }) => {
                if (!x.complete && !y.complete && !z.complete) {
                    expect(x.value).not.to.be(y.value)
                    expect(x.value).not.to.be(z.value)
                }
            },
            complete: () => expect(vector).to.be.eql({ x: 5, y: 5, z: 5 })
        })

    })

    it('should call the events on the correct order', () => {

        let start = false,
            update = false,
            complete = false;

        return tween.create({
            origin: vector,
            target: 10,
            duration: 0,
            start: () => {
                expect({ start, update, complete }).to.be.eql({ start: false, update: false, complete: false })
                expect(vector).to.be.eql({ x: 0, y: 0, z: 0 })
                start = true
            },
            update: ({ x }) => {
                expect({ start, update, complete }).to.be.eql({ start: true, update: false, complete: false })
                update = x.complete
            },
            complete: () => {
                expect({ start, update, complete }).to.be.eql({ start: true, update: true, complete: false })
                expect(vector).to.be.eql({ x: 10, y: 10, z: 10 })
            }
        })

    })

    it('should call then after chain has been completed', () => {

        let completed = 'no';

        return tween.create({
            origin: vector,
            target: 10,
            complete: () => completed = 'yes'
        }).then(() => {
            expect(completed).to.be('yes')
        })

    });

    it('should allow chaining', () => {

        return tween.create({
            origin: vector,
            target: 10,
            duration: .5,
            complete: () => expect(vector).to.be.eql({ x: 10, y: 10, z: 10 })
        }).then({
            origin: vector,
            target: 20,
            complete: () => expect(vector).to.be.eql({ x: 20, y: 20, z: 20 })
        })

    })

    it('should allow chaining more than once', done => {

        tween.create({
            origin: vector,
            target: 10,
            duration: .5,
            complete: () => expect(vector).to.be.eql({ x: 10, y: 10, z: 10 })
        }).then({
            origin: vector,
            target: 20,
            duration: .5,
            complete: () => expect(vector).to.be.eql({ x: 20, y: 20, z: 20 })
        }).then({
            origin: vector,
            target: 30,
            duration: .5,
            complete: () => {
                expect(vector).to.be.eql({ x: 30, y: 30, z: 30 })
                done()
            }
        })

    })

    it('should accept different easing functions (as a const)', () => {

        return tween.create({
            origin: vector,
            target: 5,
            ease: 'quartIn',
            update: ({ x, y, z }) => {
                expect(x.value).to.be(y.value)
                expect(x.value).to.be(z.value)
            },
            complete: () => expect(vector).to.be.eql({ x: 5, y: 5, z: 5 })
        })

    })

    it('should accept different easing functions (as an object)', () => {

        return tween.create({
            origin: vector,
            target: 50,
            ease: {
                x: 'quartIn',
                y: 'expoIn',
                z: 'bounceIn'
            },
            update: ({ x, y, z }) => {
                if (!x.complete && y.complete && z.complete) {
                    expect(x.value).not.to.be(y.value)
                    expect(x.value).not.to.be(z.value)
                }
            },
            complete: () => expect(vector).to.be.eql({ x: 50, y: 50, z: 50 })
        })

    })

    it('should tween only the property specified given in target and leave the others untouched', () => {

        return tween.create({
            origin: vector,
            target: { x: 50 },
            duration: 2,
            complete: () => expect(vector).to.be.eql({ x: 50, y: 0, z: 0 })
        })

    });

    it('should accept a single integer as origin as well', () => {

        return tween.create({
            origin: 10,
            target: 50,
            duration: 0.10,
            update: ({ value }) => vector.setScalar(value),
            complete(){
                expect(vector).to.be.eql({ x: 50, y: 50, z: 50 })
            }
        })

    })

    it('should leave the ignored properties untouched (as array of string)', () => {

        return tween.create({
            origin: vector,
            target: -95,
            ignore: ['x', 'z'],
            duration: 0,
            complete: () => expect(vector).to.be.eql({ x: 0, y: -95, z: 0 })
        })

    })

    it('should leave the ignored properties untouched (as object)', () => {

        return tween.create({
            origin: vector,
            target: -95,
            ignore: { x: true, z: false },
            duration: 0,
            complete: () => expect(vector).to.be.eql({ x: 0, y: -95, z: -95 })
        })

    })

    // it('should allow to specify duration and eases as an object', () => {
    //
    //     return tween.create({
    //         origin: vector,
    //         target: -95,
    //         ease: {
    //             x: Tween.easings.BOUNCEIN,
    //             y: Tween.easings.SINEIN,
    //             z: Tween.easings.LINEAROUT,
    //         },
    //         duration: { x: 1, y: .5, z: .3 },
    //         complete(){
    //             expect(vector).to.be.eql({ x: -95, y: -95, z: -95 })
    //         }
    //     })
    //
    // })
    //
    // it('should play well with simultaneously tween', () => {
    //
    //     let animation = tween.create({
    //         origin: vector,
    //         target: { x: 10 },
    //         duration: 2,
    //         ease: Tween.easings.LINEAR,
    //         complete(){
    //             expect().to.fail('This should not be call.')
    //         }
    //     })
    //
    //     return tween.create({
    //         origin: vector,
    //         target: { y: 10 },
    //         duration: 1,
    //         complete(){
    //             expect(vector.x).to.be.within(4.5, 6);
    //             expect(vector.y).to.be(10);
    //         }
    //     })
    //
    // });
    //
    // it('should play chain in sequence', () => {
    //
    //     return tween.create({
    //         origin: vector,
    //         target: 10,
    //         ease: Tween.easings.SINEIN,
    //         duration: 5,
    //         complete(){
    //             console.log('finish')
    //         }
    //     }).then({
    //         origin: vector,
    //         target: 2,
    //         ease: Tween.easings.SINEIN,
    //         duration: 5,
    //         complete(){
    //             expect(vector.x).to.be(2);
    //         }
    //     })
    //
    // })

});
