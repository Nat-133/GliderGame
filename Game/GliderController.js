import * as THREE from '../Common/build/three.module.js';
import { GLTFLoader } from '../Common/examples/jsm/loaders/GLTFLoader.js';
import { GliderInput } from './GliderInput.js';

export class GliderController {
    acc ;
    vel ;
    pos ;

    forwards ;
    up ;

    input ;

    model;
    scene ;

    constructor(scene){
        

        this.acc = new THREE.Vector3(0,0,0);
        this.vel = new THREE.Vector3(0,0,0);
        this.pos = new THREE.Vector3(0,0,0);

        this.forwards = new THREE.Vector3(0,0,-1);
        this.up = new THREE.Vector3(0,1,0);

        this.input = new GliderInput();

        this.scene = scene;
        this.LoadModel();
    }

    LoadModel(){
        var loader = new GLTFLoader();
        loader.load('../GlTF_Models/placeholder.glb', (gltf) => {
            gltf.scene.position.set(0,0,0);
            gltf.scene.scale.set(3,3,3);
            gltf.scene.rotation.set(0,0,0);

            this.model = gltf;
            this.scene.add(this.model.scene);
        });
    }

    get Rotation(){
        return this.model.quaternion;
    }

    Update(delta=0.1){
        console.log("control update");
        // calculate rotation (controls + speed)
        // calculate acceleration
        // calculate vel
        // calculate position
        // update model
    }
}