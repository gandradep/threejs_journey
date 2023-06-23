import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui';
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js';


/**
 * Debug controls
 */
const gui = new GUI();

// Canvas

const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
/**
 * objects
 */
const material = new THREE.MeshStandardMaterial()
const sphereGeometry = new THREE.SphereGeometry(0.25, 20, 45)
const sphere = new THREE.Mesh(sphereGeometry, material)
const donutGeometry = new THREE.TorusGeometry(0.25, 0.15, 20, 45)
const donut = new THREE.Mesh(donutGeometry, material)
const cubeGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)
const cube = new THREE.Mesh(cubeGeometry, material)
const planeGeometry = new THREE.PlaneGeometry(10, 10)
const plane = new THREE.Mesh(planeGeometry, material)
donut.position.x = -1
sphere.position.x = 1
plane.rotation.x = -Math.PI / 2
plane.position.y = -0.6
scene.add(donut)
scene.add(sphere)
scene.add(cube)
scene.add(plane)


/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.01)

const directionalLight = new THREE.DirectionalLight(0x00ffff, 0.3)
directionalLight.position.set(0, 1, 0)


const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.3)

 //pointlight has decay and distance parameters
const pointLight = new THREE.PointLight(0xff9000, 0.5)
pointLight.position.set(1, -0.5, 1)
gui.add(pointLight.position, 'y').min(-0.5).max(5).step(0.01)


const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 2, 1, 1)
rectAreaLight.position.set(-1.5, 0, 1.5)
rectAreaLight.lookAt(new THREE.Vector3())
gui.add(rectAreaLight, 'intensity').min(0).max(10).step(0.01)
gui.add(rectAreaLight, 'width').min(0).max(10).step(0.01)
gui.add(rectAreaLight, 'height').min(0).max(10).step(0.01)


const spotLight = new THREE.SpotLight(0x78ff00, 0.5, 10, Math.PI * 0.1, 0.25, 1)
spotLight.position.set(0, 2, 3)


const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight)
scene.add(directionalLight)
scene.add(hemisphereLight)
scene.add(pointLight)
scene.add(rectAreaLight)
scene.add(spotLight)
scene.add(rectAreaLightHelper)

/**
 * Light helpers
 */

const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 0.1)
scene.add(hemisphereLightHelper)

const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2)
scene.add(directionalLightHelper)

const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2)
scene.add(pointLightHelper)

const spotLightHelper = new THREE.SpotLightHelper(spotLight)
scene.add(spotLightHelper)
// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
}
window.addEventListener('resize', () => {
    //update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    //update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

   // update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
})

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
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


    //update objects
    donut.rotation.x += 0.01
    cube.rotation.x += 0.01
    donut.rotation.y += 0.005
    cube.rotation.y += 0.005
    controls.update();

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()