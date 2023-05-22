import * as THREE from 'three';
//Scene
const scene = new THREE.Scene();
//Object
const group = new THREE.Group();

scene.add(group);
const cube1 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0xff0000})
)
group.add(cube1)
const cube2 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0xffff00})
)
cube2.position.x = -1
group.add(cube2)
const cube3 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0xff00ff})
)
cube3.position.x = 1
group.add(cube3)
//Axes Helper
const axesHelper = new THREE.AxesHelper(3, 3, 3);
scene.add(axesHelper);

//Sizes
const sizes = {
  width: 800,
  height: 600,
};
//Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);

//Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('canvas.webgl')
});
renderer.setSize(sizes.width, sizes.height);

//Animation
const clock = new THREE.Clock();
const tick = () => {
  const elapsedTime = clock.getElapsedTime();


  group.rotation.y = elapsedTime;
  cube1.rotation.y += 0.05
  cube2.rotation.x = elapsedTime;

  cube3.scale.y = 1.5+(Math.sin(elapsedTime));
  //Renderer
  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
}
tick();