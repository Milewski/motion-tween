#API

[![Greenkeeper badge](https://badges.greenkeeper.io/Milewski/motion-tween.svg)](https://greenkeeper.io/)

```javascript
let tween = new Tween(false,null,60); // autoStart, loop engine,  framerate //still working on this
let animation = tween.create({
        origin: object | number,
        target: object | number,
        duration: 1 // in seconds,
        ease: Tween.easings.BOUNCEOUT,
        before(),
        update(),
        complete(),
    })
```

Play Animation simultaneously

```javascript
let tween = new Tween(),
    vector = { x:0, y:0, z: 0};

let A = tween.create({
    origin: vector,
    target: { x: 10 },
})

let B = tween.create({
    origin: vector,
    target: { y: 10 },
})

tween.start()
```

Time Properties independently

```javascript
let tween = new Tween(),
    tween.create({
        origin: { x: 0, y: 0, z: 0},
        target: { x: 10 },
        ease: {
            x: Tween.easings.ELASTICIN,
            y: Tween.easings.EXPOIN,
            z: Tween.easings.LINEAR
        },
        duration:{
            x: 1,
            y: 2,
            z: 3
        }
})
```

Chain! 

```javascript

let tween = new Tween(),
    vector = { x:0, y:0, z: 0};

tween.create({
        origin: vector,
        target: { x: 10 },
    })
    .then({
        target: { x: 20 }
    })
    .then({
        duration: 5,
        target: { y: 50 },
        complete(){
            //do something
        }
    })
    .then({
        origin: anotherObject,
        //target will be equivalent as the previous on the chain unless you replace it here
        duration: 5,
        target: { y: 50 }
    })
    .then(function(){
        console.log('im done')
    })
```

You can use your own update function in case you already are using requestAnimationFrame or if u don't really want to use it.

```javascript

let tween = new Tween(false),

//elapsed time since start it could be performance.now() or Date().getTime()

yourLoopFunction(function(time){ 
    tween.update(time)
})

```

#Compilation

```javascript
$ webpack
```

#Tests
```javascript
$ npm run test
```
