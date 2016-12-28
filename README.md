#API

```
let tween = new Tween();
    tween.create({
        origin: object | number,
        target: object | number,
        duration: 1 // in seconds,
        ease: Tween.easings.BOUNCEOUT,
        onStart(),
        onUpdate(),
        onComplete(),
        on('start', function(){})
    })
```
