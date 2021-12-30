import * as THREE from '../Common/build/three.module.js';
import { TrackballControls } from '../Common/examples/jsm/controls/TrackballControls.js';

import { GLTFLoader } from '../Common/examples/jsm/loaders/GLTFLoader.js';
import { PointerLockControls } from '../Common/examples/jsm/controls/PointerLockControls.js';
import { GliderController } from './GliderController.js';
import { ThirdPersonCamera } from './ThirdPersonCamera.js';

let camera, controls, scene, renderer, canvas, clock;

let thirdPersonCamera;
let gliderController;

let direction;  // normalised view direction
let pos, vel, acc;

let yawVel, pitchVel;  // in radians

var origin = new THREE.Vector3(0,0,0);
var gravity = new THREE.Vector3(0, -1, 0);



function main() {
  canvas = document.getElementById( "gl-canvas" );
  renderer = new THREE.WebGLRenderer({canvas});
  renderer.shadowMap.enabled = true;

  const fov = 45;
  const aspect = 2;  // the canvas default
  const near = 0.1;
  const far = 100;
  
  var camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 100, 0);
  camera.up = new THREE.Vector3(0,1,0);

  
  //createControls( camera );
  //controls.update();
  
  scene = new THREE.Scene();
  scene.background = new THREE.Color('black');
  scene.add(camera);

  gliderController = new GliderController(scene);
  thirdPersonCamera = new ThirdPersonCamera(camera, gliderController);

  // draw plane
  const planeSize = 40000;

  const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
  const planeMat = new THREE.MeshPhongMaterial({
    color: 0xADD8E6,
    side: THREE.DoubleSide,
  });
  const PlaneMesh = new THREE.Mesh(planeGeo, planeMat);
  PlaneMesh.receiveShadow = true;
  PlaneMesh.rotation.x = Math.PI * -.5;
  scene.add(PlaneMesh);

  // draw cube
  const cubeSize = 4;
  const cubeGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
  const cubeMat = new THREE.MeshPhongMaterial({color: '#8AC'});
  const cubeMesh = new THREE.Mesh(cubeGeo, cubeMat);
  cubeMesh.castShadow = true;
  cubeMesh.receiveShadow = true;
  cubeMesh.position.set(cubeSize + 1, cubeSize / 2, 0);
  scene.add(cubeMesh);
   
  
  // draw scene border
  const ExtCubeSize = 30;
  const ExtCubeGeo = new THREE.BoxGeometry(ExtCubeSize, ExtCubeSize, ExtCubeSize);
  const ExtCubeMat = new THREE.MeshPhongMaterial({
    color: '#0C0C0C',
    side: THREE.BackSide,
  });
  const ExtMeshCube = new THREE.Mesh(ExtCubeGeo, ExtCubeMat);
  ExtMeshCube.receiveShadow = true;
  ExtMeshCube.position.set(0, ExtCubeSize / 2 - 0.1, 0);
  //scene.add(ExtMeshCube);

  // draw model
  const loader = new GLTFLoader();

  loader.load( '../GlTF_Models/minion_alone.glb', function ( gltf ) {
    gltf.scene.position.set(-6,3,-3);
    gltf.scene.scale.set(3,3,3);
    gltf.scene.rotation.set(0,Math.PI*(1/4),0);

    var colour = new THREE.Color(0x00f000);
    gltf.scene.traverse( function( node ){
      if(node.isMesh){
        var newMaterial = new THREE.MeshPhongMaterial({
          color: colour
        });
        //node.material = newMaterial;
      }
    });

    scene.add( gltf.scene );
  }, undefined, function ( error ) {

  console.error( error );

  } );

  // add ambient light
  const ambLight = new THREE.AmbientLight( 0x404040,1.2 ); // soft white light
  scene.add( ambLight );


  // add point light source
  const color = 0xFFFFFF;
  const intensity = 1;
  const light = new THREE.PointLight(color, intensity);
  light.castShadow = true;
  light.position.set(5, 10, 8);
  scene.add(light);

  const helper = new THREE.PointLightHelper(light);
  scene.add(helper);

  initFlightControls();

  clock = new THREE.Clock();
  requestAnimationFrame(render);

}

function resizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}

function initFlightControls(){
  document.onkeydown = function(e){
    if (e.key == "a"){
      yawVel = 0.05;
    }else if (e.key == "d"){
      yawVel = -0.05;
    }else if (e.key == "w"){
      pitchVel = 0.05;
    }else if (e.key == "s"){
      pitchVel = -0.05;
    }
  }
  document.onkeyup = function(e){
    if (e.key == "a" || e.key == "d"){
      yawVel = 0;
    }else if (e.key == "w" || e.key == "s"){
      pitchVel = 0;
    }
  }
  console.log("flightControls Initialised");
}

function render() {
  // ============ Animation loop ============
  var delta = clock.getDelta();
  
  gliderController.Update(delta);
  thirdPersonCamera.Update(delta);

  
  resizeRendererToDisplaySize(renderer);
  {
    const canvas = renderer.domElement;
    thirdPersonCamera.camera.aspect = canvas.clientWidth / canvas.clientHeight;
    thirdPersonCamera.camera.updateProjectionMatrix();
  }
  
  renderer.render(scene, thirdPersonCamera.camera);

  requestAnimationFrame(render);
}

function component(_vec, _direction){
  var vec = _vec.clone();
  var direction = _direction.clone().normalize();

  var scalar = vec.dot(direction);
  direction.multiplyScalar(scalar);

  return direction;
}

function calcDragAcc(){
  var k = 0.5
  var drag = vel.clone();
  drag.multiplyScalar(-k * drag.length());
  return drag;
}

function calcGravAcc(){
  return component(gravity, direction);
}

function updateAcc(){
  acc = calcGravAcc();
  acc.add(calcDragAcc());
}

function updatePitch(){
  var angle = direction.angleTo(camera.up)
  if (angle <= Math.PI+pitchVel && angle >= pitchVel){
    // if rotating further won't cause the glider to go upside down
    var axis = direction.clone();
    axis.cross(camera.up);
    axis.normalize();
    direction.applyAxisAngle(axis, pitchVel);
    vel.applyAxisAngle(axis, pitchVel);
  }
}

function updateYaw(){
  direction.applyAxisAngle(camera.up, yawVel);
  vel.applyAxisAngle(camera.up, yawVel);
}

function updateVel(){
  updatePitch();
  updateYaw();
  vel.add(acc);
}

function updatePos(){
  pos.add(vel);

}

function updateCamera(){
  camera.position.set(pos.x, pos.y, pos.z);
  var look = direction.clone();
  look.add(pos);
  camera.lookAt(look);  
}

main();