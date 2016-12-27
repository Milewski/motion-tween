import { Tween } from "./Tween";

let scene = new THREE.Scene(),
    camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000),
    renderer = new THREE.WebGLRenderer();

renderer.setSize(500, 500);
document.body.appendChild(renderer.domElement);

let geometry = new THREE.BoxGeometry(1, 1, 1),
    material = new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
    cube = new THREE.Mesh(geometry, material);
scene.add(cube);
camera.position.z = 5;

let animation = new Tween()

let object = {
    origin: cube.rotation,
    target: Math.PI,
    ignore: ['_z', '_x'],
    duration: 1,
    transform: function (object: any, property: string, value: number) {
        object[property.substring(1)] = value;
    },
    ease: Tween.easings.BOUNCEOUT
}

animation.create(<any>object);
console.log(cube);

let render = function (time) {

    requestAnimationFrame(render);

    animation.update(time, 0)

    // console.log(object.origin.cube.position.x);

    renderer.render(scene, camera);

};

render(0);
