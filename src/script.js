import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

//Cursor
const cursor = {
  x: 0,
  y: 0,
};
// window.addEventListener('mousemove', (e) => {
//   cursor.x = e.clientX / sizes.width -0.5;
//   cursor.y = e.clientY / sizes.height -0.5;
// })

/**
 * Base
 */
// Canvas

const canvas = document.querySelector('canvas.webgl')

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
}
window.addEventListener('resize', () => {
    //update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    //update sizes
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
   // update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
})

// Scene
const scene = new THREE.Scene()

// Object
// const geometry = new THREE.BufferGeometry();
const geometry = new THREE.SphereGeometry(1)

const count = 500;
const positionsArray  = new Float32Array(count * 3 * 3);

for(let i = 0; i< count * 3 * 3; i++){
    positionsArray[i] = (Math.random() - 0.5) * 3;
}

const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3);
// geometry.setAttribute('position', positionsAttribute);

const material = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    wireframe: true,
   })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 3;
scene.add(camera)

//Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas,
})
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Animate
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    // mesh.material.wireframe = !mesh.material.wireframe

    controls.update();

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()