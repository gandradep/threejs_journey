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
            child.castShadow = true
            child.receiveShadow = true
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
global.envMapIntensity = 2
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

// HDR (RGBE) equirectangular
rgbeLoader.load('/environmentMaps/0/2k.hdr', (envMap) => {
    envMap.mapping = THREE.EquirectangularRefractionMapping
    scene.environment = envMap
    scene.background = envMap
})

/**
 * Directional light to cast shadow
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 1)
directionalLight.position.set(-4, 6.5, 2.5)
scene.add(directionalLight)

gui.add(directionalLight, 'intensity', 0, 10, 0.001,).name('light intensity')
gui.add(directionalLight.position, 'x', -10, 10, 0.001,).name('LightX')
gui.add(directionalLight.position, 'y', -10, 10, 0.001,).name('LightY')
gui.add(directionalLight.position, 'z', -10, 10, 0.001,).name('LightZ')

//Shadows
directionalLight.castShadow = true
directionalLight.shadow.camera.far = 15
//lower resolution, flatter shadows
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.normalBias = 0.027
directionalLight.shadow.bias = -0.004
gui.add(directionalLight, 'castShadow')
gui.add(directionalLight.shadow, 'normalBias').min(-0.05).max(0.05).step(0.001)
gui.add(directionalLight.shadow, 'bias').min(-0.05).max(0.05).step(0.001)

//camera helper
// const directionalLightHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
// scene.add(directionalLightHelper)

//Target
directionalLight.target.position.set(0, 4, 0)
directionalLight.target.updateWorldMatrix()
/**
 * Models
 */
// gltfLoader.load(
//     '/models/FlightHelmet/glTF/FlightHelmet.gltf',
//     (gltf) => {
//         gltf.scene.scale.set(10, 10, 10)
//         scene.add(gltf.scene)

//         updateAllMaterials();
//     }
// )
//hamburger
gltfLoader.load(
    '/models/hamburger.glb',
    (gltf) => {
        gltf.scene.scale.set(0.4, 0.4, 0.4)
        gltf.scene.position.set(0, 2.5, 0)
        scene.add(gltf.scene)

        updateAllMaterials();
    }
)

/**
 * floor
 */
const floorColorTexture = textureLoader.load('/textures/wood_cabinet_worn_long/wood_cabinet_worn_long_diff_1k.jpg')
const floorNormalTexture = textureLoader.load('/textures/wood_cabinet_worn_long/wood_cabinet_worn_long_nor_gl_1k.png')
const floorAOMetalRoughnessTexture = textureLoader.load('/textures/wood_cabinet_worn_long/wood_cabinet_worn_long_arm_1k.jpg')

floorColorTexture.colorSpace = THREE.SRGBColorSpace
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(8,8),
    new THREE.MeshStandardMaterial({
        map: floorColorTexture,
        normalMap: floorNormalTexture,
        aoMap: floorAOMetalRoughnessTexture,
        roughness: floorAOMetalRoughnessTexture,
        metalnessMap: floorAOMetalRoughnessTexture
    })
)
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

/**
 * Wall
 */
const wallColorTexture = textureLoader.load('/textures/castle_brick_broken_06/castle_brick_broken_06_diff_1k.jpg')
const wallNormalTexture = textureLoader.load('/textures/castle_brick_broken_06/castle_brick_broken_06_nor_gl_1k.png')
const wallAOMetalRoughnessTexture = textureLoader.load('/textures/castle_brick_broken_06/castle_brick_broken_06_arm_1k.jpg')

wallColorTexture.colorSpace = THREE.SRGBColorSpace

const wall = new THREE.Mesh(
    new THREE.PlaneGeometry(8,8),
    new THREE.MeshStandardMaterial({
        map: wallColorTexture,
        normalMap: wallNormalTexture,
        aoMap: wallAOMetalRoughnessTexture,
        roughness: wallAOMetalRoughnessTexture,
        metalnessMap: wallAOMetalRoughnessTexture
    })
)
wall.position.set(0, 4, -4)
scene.add(wall)
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
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

//Tone mapping
renderer.toneMapping = THREE.ReinhardToneMapping
renderer.toneMappingExposure = 3
gui.add(renderer,'toneMapping', {
    No: THREE.NoToneMapping,
    Linear: THREE.LinearToneMapping,
    Reinhard: THREE.ReinhardToneMapping,
    Cineon: THREE.CineonToneMapping,
    ACESFilmic: THREE.ACESFilmicToneMapping
})

gui.add(renderer, 'toneMappingExposure').min(0).max(10).step(0.001)

//Shadows
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
/**
 * Animate
 */
const clock = new THREE.Clock()
const tick = () =>
{
    // Time
    const elapsedTime = clock.getElapsedTime()



    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()