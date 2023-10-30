import * as THREE from 'three';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();

// Canvas
const canvas = document.querySelector('canvas.webgl')

/**
 * Sizes
 */
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight
}


/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(2, 2, 2)
scene.add(camera)

// scene
const ambientLight = new THREE.AmbientLight( 0xffffff );
scene.add( ambientLight );

const pointLight = new THREE.PointLight( 0xffffff, 15 );
camera.add( pointLight );
scene.add( camera );

// model

// const onProgress = function ( xhr ) {

// 	if ( xhr.lengthComputable ) {

// 		const percentComplete = xhr.loaded / xhr.total * 100;
// 		console.log( Math.round( percentComplete, 2 ) + '% downloaded' );

// 	}

// };

const mttlloader = new MTLLoader()

mttlloader.load( 'models/Andres/object1_final2.mtl',  ( materials ) => {

	materials.preload();

	new OBJLoader()
		.setMaterials( materials )
		.load( 'models/Andres/object1_final2.obj', function ( object ) {

			object.position.y = - 0.95;
			object.scale.setScalar( 0.1 );
			scene.add( object );

		});

} );



//

const renderer = new THREE.WebGLRenderer({
	canvas: canvas
})
renderer.outputColorSpace = THREE.LinearSRGBColorSpace
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

//

const controls = new  OrbitControls( camera, renderer.domElement );
controls.minDistance = 2;
controls.maxDistance = 5;

//

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





//

function animate() {

	requestAnimationFrame( animate );
	renderer.render( scene, camera );

}
animate();