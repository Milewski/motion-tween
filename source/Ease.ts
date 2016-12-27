export class Ease {

    static OVERSHOOT = 1.70158;
    static BACKIN = 'backIn';
    static BACKOUT = 'backOut';
    static BACKINOUT = 'backInOut';
    static BOUNCEOUT = 'bounceOut';
    static BOUNCEIN = 'bounceIn';
    static BOUNCEINOUT = 'bounceInOut';
    static CIRCIN = 'circIn';
    static CIRCOUT = 'circOut';
    static CIRCINOUT = 'circInOut';
    static CUBICIN = 'cubicIn';
    static CUBICOUT = 'cubicOut';
    static CUBICINOUT = 'cubicInOut';
    static ELASTICOUT = 'elasticOut';
    static ELASTICIN = 'elasticIn';
    static ELASTICINOUT = 'elasticInOut';
    static EXPOIN = 'expoIn';
    static EXPOOUT = 'expoOut';
    static EXPOINOUT = 'expoInOut';
    static LINEAR = 'linear';
    static LINEARIN = 'linearIn';
    static LINEAROUT = 'linearOut';
    static LINEARINOUT = 'linearInOut';
    static QUADIN = 'quadIn';
    static QUADOUT = 'quadOut';
    static QUADINOUT = 'quadInOut';
    static QUARTIN = 'quartIn';
    static QUARTOUT = 'quartOut';
    static QUARTINOUT = 'quartInOut';
    static QUINTIN = 'quintIn';
    static QUINTOUT = 'quintOut';
    static QUINTINOUT = 'quintInOut';
    static SINEIN = 'sineIn';
    static SINEOUT = 'sineOut';
    static SINEINOUT = 'sineInOut';

    private backIn(time, begin, change, duration, overshoot) {

        if (overshoot == null)
            overshoot = Ease.OVERSHOOT;

        return change * (time /= duration) * time * ((overshoot + 1) * time - overshoot) + begin;
    }

    private backOut(time, begin, change, duration, overshoot) {

        if (overshoot == null)
            overshoot = Ease.OVERSHOOT;

        return change * ((time = time / duration - 1) * time * ((overshoot + 1) * time + overshoot) + 1) + begin;

    }

    private backInOut(time, begin, change, duration, overshoot) {

        if (overshoot == null)
            overshoot = Ease.OVERSHOOT;

        if ((time = time / (duration / 2)) < 1) {
            return change / 2 * (time * time * (((overshoot *= 1.525) + 1) * time - overshoot)) + begin;
        }

        return change / 2 * ((time -= 2) * time * (((overshoot *= 1.525) + 1) * time + overshoot) + 2) + begin;

    }

    private bounceOut(time, begin, change, duration) {

        if ((time /= duration) < 1 / 2.75) {
            return change * (7.5625 * time * time) + begin;
        } else if (time < 2 / 2.75) {
            return change * (7.5625 * (time -= 1.5 / 2.75) * time + 0.75) + begin;
        } else if (time < 2.5 / 2.75) {
            return change * (7.5625 * (time -= 2.25 / 2.75) * time + 0.9375) + begin;
        }

        return change * (7.5625 * (time -= 2.625 / 2.75) * time + 0.984375) + begin;

    }

    private bounceIn(time, begin, change, duration) {
        return change - this.bounceOut(duration - time, 0, change, duration) + begin;
    }

    private bounceInOut(time, begin, change, duration) {

        if (time < duration / 2) {
            return this.bounceIn(time * 2, 0, change, duration) * 0.5 + begin;
        }

        return this.bounceOut(time * 2 - duration, 0, change, duration) * 0.5 + change * 0.5 + begin;

    }

    private circIn(time, begin, change, duration) {
        return -change * (Math.sqrt(1 - (time = time / duration) * time) - 1) + begin;
    }

    private circOut(time, begin, change, duration) {
        return change * Math.sqrt(1 - (time = time / duration - 1) * time) + begin;
    }

    private circInOut(time, begin, change, duration) {

        if ((time = time / (duration / 2)) < 1) {
            return -change / 2 * (Math.sqrt(1 - time * time) - 1) + begin;
        }

        return change / 2 * (Math.sqrt(1 - (time -= 2) * time) + 1) + begin;

    }

    private cubicIn(time, begin, change, duration) {
        return change * (time /= duration) * time * time + begin;
    }

    private cubicOut(time, begin, change, duration) {
        return change * ((time = time / duration - 1) * time * time + 1) + begin;
    }

    private cubicInOut(time, begin, change, duration) {

        if ((time = time / (duration / 2)) < 1) {
            return change / 2 * time * time * time + begin;
        }

        return change / 2 * ((time -= 2) * time * time + 2) + begin;

    }

    private elasticOut(time, begin, change, duration, amplitude, period) {

        let overshoot;

        if (time === 0) {
            return begin;
        } else if ((time = time / duration) === 1) {
            return begin + change;
        }

        if (!(period != null)) {
            period = duration * 0.3;
        }

        if (!(amplitude != null) || amplitude < Math.abs(change)) {
            amplitude = change;
            overshoot = period / 4;
        }

        overshoot = period / (2 * Math.PI) * Math.asin(change / amplitude);

        return (amplitude * Math.pow(2, -10 * time)) * Math.sin((time * duration - overshoot) * (2 * Math.PI) / period) + change + begin;

    }

    private elasticIn(time, begin, change, duration, amplitude, period) {

        let overshoot;

        if (time === 0) {
            return begin;
        } else if ((time = time / duration) === 1) {
            return begin + change;
        }

        if (!(period != null)) {
            period = duration * 0.3;
        }

        if (!(amplitude != null) || amplitude < Math.abs(change)) {
            amplitude = change;
            overshoot = period / 4;
        }

        overshoot = period / (2 * Math.PI) * Math.asin(change / amplitude);

        time -= 1;

        return -(amplitude * Math.pow(2, 10 * time)) * Math.sin((time * duration - overshoot) * (2 * Math.PI) / period) + begin;

    }

    private elasticInOut(time, begin, change, duration, amplitude, period) {

        let overshoot;

        if (time === 0) {
            return begin;
        } else if ((time = time / (duration / 2)) === 2) {
            return begin + change;
        }

        if (!(period != null)) {
            period = duration * (0.3 * 1.5);
        }

        if (!(amplitude != null) || amplitude < Math.abs(change)) {
            amplitude = change;
            overshoot = period / 4;
        }

        overshoot = period / (2 * Math.PI) * Math.asin(change / amplitude);

        if (time < 1) {
            return -0.5 * (amplitude * Math.pow(2, 10 * (time -= 1))) * Math.sin((time * duration - overshoot) * ((2 * Math.PI) / period)) + begin;
        }

        return amplitude * Math.pow(2, -10 * (time -= 1)) * Math.sin((time * duration - overshoot) * (2 * Math.PI) / period) + change + begin;


    }

    private expoIn(time, begin, change, duration) {

        if (time === 0) {
            return begin;
        }

        return change * Math.pow(2, 10 * (time / duration - 1)) + begin;
    }

    private expoOut(time, begin, change, duration) {

        if (time === duration) {
            return begin + change;
        }

        return change * (-Math.pow(2, -10 * time / duration) + 1) + begin;
    }

    private expoInOut(time, begin, change, duration) {

        if (time === 0) {
            return begin;
        } else if (time === duration) {
            return begin + change;
        } else if ((time = time / (duration / 2)) < 1) {
            return change / 2 * Math.pow(2, 10 * (time - 1)) + begin;
        }

        return change / 2 * (-Math.pow(2, -10 * (time - 1)) + 2) + begin;

    }

    private linear(time, begin, change, duration) {
        return change * time / duration + begin;
    }

    private linearIn(time, begin, change, duration) {
        return this.linear(time, begin, change, duration);
    }

    private linearOut(time, begin, change, duration) {
        return this.linear(time, begin, change, duration);
    }

    private linearInOut(time, begin, change, duration) {
        return this.linear(time, begin, change, duration);
    }

    private quadIn(time, begin, change, duration) {
        return change * (time = time / duration) * time + begin;
    }

    private quadOut(time, begin, change, duration) {
        return -change * (time = time / duration) * (time - 2) + begin;
    }

    private quadInOut(time, begin, change, duration) {

        if ((time = time / (duration / 2)) < 1) {
            return change / 2 * time * time + begin;
        }

        return -change / 2 * ((time -= 1) * (time - 2) - 1) + begin;

    }

    private quartIn(time, begin, change, duration) {
        return change * (time = time / duration) * time * time * time + begin;
    }

    private quartOut(time, begin, change, duration) {
        return -change * ((time = time / duration - 1) * time * time * time - 1) + begin;
    }

    private quartInOut(time, begin, change, duration) {

        if ((time = time / (duration / 2)) < 1) {
            return change / 2 * time * time * time * time + begin;
        }

        return -change / 2 * ((time -= 2) * time * time * time - 2) + begin;

    }

    private quintIn(time, begin, change, duration) {
        return change * (time = time / duration) * time * time * time * time + begin;
    }

    private quintOut(time, begin, change, duration) {
        return change * ((time = time / duration - 1) * time * time * time * time + 1) + begin;
    }

    private quintInOut(time, begin, change, duration) {

        if ((time = time / (duration / 2)) < 1) {
            return change / 2 * time * time * time * time * time + begin;
        }

        return change / 2 * ((time -= 2) * time * time * time * time + 2) + begin;

    }

    private sineIn(time, begin, change, duration) {
        return -change * Math.cos(time / duration * (Math.PI / 2)) + change + begin;
    }

    private sineOut(time, begin, change, duration) {
        return change * Math.sin(time / duration * (Math.PI / 2)) + begin;
    }

    private sineInOut(time, begin, change, duration) {
        return -change / 2 * (Math.cos(Math.PI * time / duration) - 1) + begin;
    }

}
