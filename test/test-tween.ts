import { Tween } from "../source/tween";

const { describe, it } = require('mocha');
const expect = require('expect.js');
const raf = require('raf')

describe('Tween', () => {

    let tween: Tween,
        vector: {}

    beforeEach(() => {

        tween = new Tween();
        vector = {
            x: 0, y: 0, z: 0
        }

        raf(function tick(time) {
            tween.update(time, 0)
            raf(tick)
        });

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

});
