const THREE = require('three');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 500 / 500, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(500, 500);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(10, 10, 10);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 25;

const { MotionTween } = require('motion-tween');

const tween = new MotionTween();

tween.create({
    origin: cube.position,
    target: { x: -10, y: 10 },
    ease: 'elasticIn',
    duration: { x: 2, y: 3 },
    complete: () => console.log('one')
}).chain({
    origin: cube.position,
    target: { x: 10, y: -10 },
    duration: { x: 2, y: 3 },
    ease: 'elasticIn',
    complete: () => console.log('two'),
}).chain({
    origin: cube.position,
    target: { x: -10, y: 10 },
    ease: 'elasticIn',
    duration: { x: 2, y: 3 },
    complete: () => console.log('three')
}).then(() => {
    console.log('foi')
})

const render = function (time) {

    requestAnimationFrame(render);
    tween.update(time)
    renderer.render(scene, camera);

};

render(0);
