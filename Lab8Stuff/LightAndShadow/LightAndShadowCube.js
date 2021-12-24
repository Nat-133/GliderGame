import * as THREE from '../Common/build/three.module.js';
import { TrackballControls } from '../Common/examples/jsm/controls/TrackballControls.js';

let camera, controls, scene, renderer, canvas;


function main() {
  canvas = document.getElementById( "gl-canvas" );
  renderer = new THREE.WebGLRenderer({canvas});
  renderer.shadowMap.enabled = true;

  const fov = 45;
  const aspect = 2;  // the canvas default
  const near = 0.1;
  const far = 100;
  camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 10, 20);

  
  createControls( camera );
  controls.update();
  
  scene = new THREE.Scene();
  scene.background = new THREE.Color('black');

  
    //
    const planeSize = 40;

    const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
    const planeMat = new THREE.MeshPhongMaterial({
      color: 0xADD8E6,
      side: THREE.DoubleSide,
    });
    const PlaneMesh = new THREE.Mesh(planeGeo, planeMat);
    PlaneMesh.receiveShadow = true;
    PlaneMesh.rotation.x = Math.PI * -.5;
    scene.add(PlaneMesh);

   //
     const cubeSize = 4;
     const cubeGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
     const cubeMat = new THREE.MeshPhongMaterial({color: '#8AC'});
     const cubeMesh = new THREE.Mesh(cubeGeo, cubeMat);
     cubeMesh.castShadow = true;
     cubeMesh.receiveShadow = true;
     cubeMesh.position.set(cubeSize + 1, cubeSize / 2, 0);
     scene.add(cubeMesh);
   
  
  //
    const ExtCubeSize = 30;
    const ExtCubeGeo = new THREE.BoxGeometry(ExtCubeSize, ExtCubeSize, ExtCubeSize);
    const ExtCubeMat = new THREE.MeshPhongMaterial({
      color: '#CCC',
      side: THREE.BackSide,
    });
    const ExtMeshCube = new THREE.Mesh(ExtCubeGeo, ExtCubeMat);
    ExtMeshCube.receiveShadow = true;
    ExtMeshCube.position.set(0, ExtCubeSize / 2 - 0.1, 0);
    scene.add(ExtMeshCube);

  
    const sphereRadius = 3;
    const sphereWidthDivisions = 32;
    const sphereHeightDivisions = 16;
    const sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);
    const sphereMat = new THREE.MeshPhongMaterial({color: '#CA8'});
    const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
    sphereMesh.castShadow = true;
    sphereMesh.receiveShadow = true;
    sphereMesh.position.set(-sphereRadius - 1, sphereRadius + 2, 0);
    scene.add(sphereMesh);
  
  
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.PointLight(color, intensity);
    light.castShadow = true;
    light.position.set(-3, 10, 0);
    scene.add(light);

    const helper = new THREE.PointLightHelper(light);
    scene.add(helper);

  
    const ambLight = new THREE.AmbientLight( 0x404040,1.2 ); // soft white light
    scene.add( ambLight );
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

  function render() {

        resizeRendererToDisplaySize(renderer);

        {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        }
        controls.update();
        
        renderer.render(scene, camera);

        requestAnimationFrame(render);
    }


function createControls( camera ) {

    controls = new TrackballControls( camera, renderer.domElement );

    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 5;
    controls.panSpeed = 0.8;

    //     This array holds keycodes for controlling interactions.

// When the first defined key is pressed, all mouse interactions (left, middle, right) performs orbiting.
// When the second defined key is pressed, all mouse interactions (left, middle, right) performs zooming.
// When the third defined key is pressed, all mouse interactions (left, middle, right) performs panning.
// Default is KeyA, KeyS, KeyD which represents A, S, D.
    controls.keys = [ 'KeyA', 'KeyS', 'KeyD' ];

}

main();