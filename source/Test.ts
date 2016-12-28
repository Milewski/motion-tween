import { Tween } from "./Tween";
import { TweenInterface } from "./Interfaces/TweenInterface";

let scene = new THREE.Scene(),
    camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000),
    renderer = new THREE.WebGLRenderer();

renderer.setSize(500, 500);
document.body.appendChild(renderer.domElement);

let geometry = new THREE.BoxGeometry(1, 1, 1),
    material = new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
    cube = new THREE.Mesh(geometry, material);

cube.position.setX(-3);

scene.add(cube);
camera.position.z = 5;

let animation = new Tween()

let object: TweenInterface = {
    origin: cube.position,
    target: 3,
    ignore: ['y', 'z'],
    duration: 5,
    update(a){},
    // transform: function (object: any, property: string, value: number) {
    //     object[property.substring(1)] = value;
    // },
    complete(){
        console.log('done')
        // animation.stop()
    },
    ease: Tween.easings.BOUNCEOUT
}

animation.create(<any>object);
animation.start();

// setInterval(() => {
//     console.log('anim one second', new Date().getSeconds())
// }, 1000)

let render = function (time) {

    requestAnimationFrame(render);

    // animation.update(time)

    // console.log(object.origin.cube.position.x);

    renderer.render(scene, camera);

};

render(0);
