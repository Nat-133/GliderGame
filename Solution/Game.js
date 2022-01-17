import * as THREE from '../Extra_Libraries/build/three.module.js';
import { TrackballControls } from '../Extra_Libraries/examples/jsm/controls/TrackballControls.js';

import { GLTFLoader } from '../Extra_Libraries/examples/jsm/loaders/GLTFLoader.js';
import { City } from './CityGeneration.js';
import { GliderController } from './GliderController.js';
import { ThirdPersonCamera } from './ThirdPersonCamera.js';
import { HUD } from './HUD.js';
import { MainMenu } from './MainMenu.js';
import { DeathMenu } from './DeathMenu.js';

let camera, scene, renderer, canvas, clock;

let thirdPersonCamera;
let gliderController;
let city;
let hud;
let mainMenu;
let deathMenu;

let states = ["main", "game", "death"];
let state = 0;
let newState = false;

function main() {
  canvas = document.getElementById( "gl-canvas" );
  renderer = new THREE.WebGLRenderer({canvas});
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.autoUpdate = false;  // only update shadowmap when needed
  // I don't know how to update shadows for just the glider, so I decided to
  // exclude them in favour of better building shadows

  const fov = 45;
  const aspect = 2;  // the canvas default
  const near = 0.1;
  const far = 1000;
  
  camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 100, 0);
  camera.up = new THREE.Vector3(0,1,0);

  var fogColour = 0xffffff;
  scene = new THREE.Scene();
  scene.background = new THREE.Color(fogColour);
  scene.fog = new THREE.Fog(fogColour, far-20, far);
  scene.add(camera);

  gliderController = new GliderController(scene);
  thirdPersonCamera = new ThirdPersonCamera(camera, gliderController);
  thirdPersonCamera.Update(1);
  city = new City();
  scene.add(city);
  hud = new HUD(gliderController);
  mainMenu = new MainMenu();
  deathMenu = new DeathMenu();

  // draw plane
  const planeSize = 4000;

  const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
  const planeMat = new THREE.MeshPhongMaterial({
    color: 0x333333,
    side: THREE.DoubleSide,
  });
  const PlaneMesh = new THREE.Mesh(planeGeo, planeMat);
  PlaneMesh.receiveShadow = true;
  PlaneMesh.rotation.x = Math.PI * -.5;
  scene.add(PlaneMesh);

  // add ambient light
  let hemiLight = new THREE.HemisphereLight(0xffeeb1, 0x080830, 1.5);
  scene.add(hemiLight);

  // add directional light, set shadow fidelity
  const sunlight = new THREE.DirectionalLight(0xfdfbd3, 3);
  sunlight.position.set(2000, 2000, 1000);
  sunlight.castShadow = true;
  sunlight.shadow.camera.left = -1000;
  sunlight.shadow.camera.right = 1000;
  sunlight.shadow.camera.top = 1000;
  sunlight.shadow.camera.bottom = -1000;
  sunlight.shadow.camera.near = 0.5;
  sunlight.shadow.camera.far = 4000;
  sunlight.shadow.mapSize.set(1024*4, 1024*4); 
  scene.add(sunlight);

  renderer.shadowMap.needsUpdate = true;
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

function render() {
  // ============ Animation loop ============
  var delta = clock.getDelta();

  if (states[state] == "main"){
    // main menu
    if (newState){
      mainMenu.Display();
      newState = false;
    }
    
    if (mainMenu.nextState){
      state = 1;
      mainMenu.Hide();
      mainMenu.nextState = false;
      newState = true;
    }
  }else if (states[state] == "game"){
    // gameplay loop
    if (newState){
      gliderController.Restart();
      thirdPersonCamera.sound.play();
      newState = false;
    }
    gliderController.Update(delta);
    thirdPersonCamera.Update(delta);
    hud.Update();

    if (gliderController.Collides(city)){
      newState = true;
      state = 2;
    }
  }else if (states[state] == "death"){
    // death menu
    if (newState){
      deathMenu.Display();
      thirdPersonCamera.sound.pause();
      newState = false;
    }
    if (deathMenu.newLevel){
      scene.remove(city);
      city = new City();
      scene.add(city);
      gliderController.Restart();
      thirdPersonCamera.Update();
      renderer.shadowMap.needsUpdate = true;  // update baked shadows

      deathMenu.newLevel = false;
    }
    if (deathMenu.nextState){
      state = 1;
      deathMenu.Hide();
      deathMenu.nextState = false;
      newState = true;
    }
  }
  
  onWindowResize();
  
  resizeRendererToDisplaySize(renderer);
  {
    const canvas = renderer.domElement;
    thirdPersonCamera.camera.aspect = canvas.clientWidth / canvas.clientHeight;
    thirdPersonCamera.camera.updateProjectionMatrix();
  }
  
  renderer.render(scene, thirdPersonCamera.camera);

  requestAnimationFrame(render);
}

main();