import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import { GroundProjectedEnv } from 'three/examples/jsm/objects/GroundProjectedEnv.js'


/**
 * Loaders
 */
const gltfLoader = new GLTFLoader();
const rgbeLoader = new RGBELoader();
const textureLoader = new THREE.TextureLoader()

const cubeTextureLoader = new THREE.CubeTextureLoader();
/**
 * Base
 */
// Debug
const gui = new GUI()
const global = {}
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
/**
 * Update all materials
 */

const updateAllMaterials = () => {
    scene.traverse((child) => {
        if(child.isMesh && child.material.isMeshStandardMaterial) {

            child.material.envMapIntensity = global.envMapIntensity;
        }
    })
}
/**
 * Environment map
 */
scene.backgroundBlurriness = 0
scene.backgroundIntensity = 1

gui.add(scene, 'backgroundBlurriness').min(0).max(2).step(0.001)
gui.add(scene, 'backgroundIntensity').min(0).max(10).step(0.001)
global.envMapIntensity = 1
gui
    .add(global, 'envMapIntensity')
    .min(0)
    .max(10)
    .step(0.001)
    .onChange(updateAllMaterials)

// const envrionmentMap = cubeTextureLoader.load([
//     'environmentMaps/0/px.png',
//     'environmentMaps/0/nx.png',
//     'environmentMaps/0/py.png',
//     'environmentMaps/0/ny.png',
//     'environmentMaps/0/pz.png',
//     'environmentMaps/0/nz.png',
// ])
// scene.environment = envrionmentMap
// scene.background = envrionmentMap

//HDR (RGBE) equirectangular
// rgbeLoader.load('/environmentMaps/blender-2k.hdr', (envMap) => {
//     envMap.mapping = THREE.EquirectangularRefractionMapping
//     scene.environment = envMap
//     scene.background = envMap
// })

//LDR equirectangular
// const envrionmentMap = textureLoader.load('/environmentMaps/office.jpg')
// envrionmentMap.mapping = THREE.EquirectangularRefractionMapping
// envrionmentMap.colorSpace = THREE.SRGBColorSpace
// scene.background = envrionmentMap
// scene.environment = envrionmentMap

//Ground projected
// rgbeLoader.load('environmentMaps/1/2k.hdr', (envrionmentMap) => {
//     envrionmentMap.mapping = THREE.EquirectangularRefractionMapping
//     scene.environment = envrionmentMap

//     const skybox = new GroundProjectedEnv(envrionmentMap)
//     skybox.radius = 9.2
//     skybox.height = 4.3
//     skybox.scale.setScalar(50);
//     scene.add(skybox)

//     gui.add(skybox, 'radius', 1, 200, 0.1).name('skyboxRadius')
//     gui.add(skybox, 'height', 1, 200, 0.1).name('skyboxHeight')
// })

/**
 * Real time environment map
 */
const envrionmentMap = textureLoader.load('/environmentMaps/office.jpg')
envrionmentMap.mapping = THREE.EquirectangularRefractionMapping
envrionmentMap.colorSpace = THREE.SRGBColorSpace
scene.background = envrionmentMap

//holy Donut
const holydonut = new THREE.Mesh(
    new THREE.TorusGeometry(8, 0.5),
    new THREE.MeshBasicMaterial({color: new THREE.Color(10, 4, 2)})
)
holydonut.layers.enable(1)
holydonut.position.y = 3.5
scene.add(holydonut)

//Cube render target
const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(
    256,
    {
        type: THREE.HalfFloatType
     }
)
scene.environment = cubeRenderTarget.texture
//Cube Camera

const cubeCamera = new THREE.CubeCamera(0.1, 100, cubeRenderTarget)
cubeCamera.layers.set(1)
/**
 * Torus Knot
 */
const torusKnot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(1, 0.4, 100, 16),
    new THREE.MeshStandardMaterial({ roughness: 0, metalness: 1, color: 0xaaaaaa })
)

torusKnot.position.x = -4
torusKnot.position.y = 4
scene.add(torusKnot)
/**
 * Models
 */
gltfLoader.load(
    '/models/FlightHelmet/glTF/FlightHelmet.gltf',
    (gltf) => {
        gltf.scene.scale.set(10, 10, 10)
        scene.add(gltf.scene)

        updateAllMaterials();
    }
)
/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(4, 5, 4)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.y = 3.5
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
const tick = () =>
{
    // Time
    const elapsedTime = clock.getElapsedTime()

    //holy
    if(holydonut) {
        holydonut.rotation.x = Math.sin(elapsedTime)
        cubeCamera.update(renderer, scene)
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()