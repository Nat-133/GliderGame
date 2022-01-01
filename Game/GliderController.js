import * as THREE from '../Common/build/three.module.js';
import { GLTFLoader } from '../Common/examples/jsm/loaders/GLTFLoader.js';
import { GliderInput } from './GliderInput.js';

export class GliderController {
    acc;
    vel;
    pos;

    _forwards;
    //up;

    input;

    model;
    scene;

    constructor(scene){
        this.acc = new THREE.Vector3(0,0,0);
        this.vel = new THREE.Vector3(0,0,0);
        this.pos = new THREE.Vector3(0,0,0);

        this._forwards = new THREE.Vector3(0,0,-1);
        //this.up = new THREE.Vector3(0,1,0);

        this.input = new GliderInput();

        this.scene = scene;
        this.LoadModel();
    }

    LoadModel(){
        var loader = new GLTFLoader();
        loader.load('../GlTF_Models/placeholder.glb', (gltf) => {
            gltf.scene.position.set(0,1,0);
            gltf.scene.children[0].scale.set(0.5,0.5,0.5);
            //gltf.scene.children[0].rotation.set(0,Math.PI,0);
            //gltf.scene.children[0].visible = false;
            this.model = gltf.scene;
            this.scene.add(this.model);
            this.AddDebugAxes();
        });
        
    }

    AddDebugAxes(){
        const red = new THREE.LineBasicMaterial({color:0xff0000});
        const green = new THREE.LineBasicMaterial({color:0x00ff00});
        const blue = new THREE.LineBasicMaterial({color:0x0000ff});

        const x = [];
        x.push(new THREE.Vector3(0,0,0));
        x.push(new THREE.Vector3(10,0,0));
        const xg = new THREE.BufferGeometry().setFromPoints( x );
        const xl = new THREE.Line(xg, red);

        const y = [];
        y.push(new THREE.Vector3(0,0,0));
        y.push(new THREE.Vector3(0,10,0));
        const yg = new THREE.BufferGeometry().setFromPoints( y );
        const yl = new THREE.Line(yg, green);

        const z = [];
        z.push(new THREE.Vector3(0,0,0));
        z.push(new THREE.Vector3(0,0,10));
        const zg = new THREE.BufferGeometry().setFromPoints( z );
        const zl = new THREE.Line(zg, blue);

        this.model.add(xl);
        this.model.add(yl);
        this.model.add(zl);
    }

    get forwards(){
        if (!this.model){
            return new THREE.Vector3(0,0,1);
        }
        this.model.getWorldDirection(this._forwards);
        return this._forwards;
    }

    get up(){
        var vec = new THREE.Vector3(0,1,0);
        vec.applyQuaternion(this.rotation);
        return vec;
    }

    get right(){
        var vec = new THREE.Vector3(1,0,0);
        vec.applyQuaternion(this.rotation);
        return vec;
    }

    get roll(){
        var planeNormal = this.forwards.clone();
        var worldUp = new THREE.Vector3(0,1,0);
        if (planeNormal.dot(worldUp) == 0){
            return 0;
        }
        planeNormal.cross(worldUp);
        planeNormal.cross(this.forwards);
        //planeNormal is this.up if roll was 0
        var horizontal = this.right;
        return this.GetAngleToPlane(horizontal, planeNormal);
    }

    get pitch(){
        var angle = this.up.angleTo(new THREE.Vector3(0,1,0));
        return angle * Math.sign(this.forwards.y);
        //return this.GetAngleToPlane(this.up, new THREE.Vector3(0,1,0));
    }

    get rotation(){
        if (!this.model){
            return new THREE.Quaternion();
        }

        return this.model.quaternion;
    }

    GetAngleToPlane(vector, planeNormal){
        return Math.PI/2 - vector.angleTo(planeNormal);
    }

    AddRoll(angle){
        var axis = new THREE.Vector3(0,0,1);
        this.model.rotateOnAxis(axis, angle);
    }

    AddPitch(angle){
        var axis = new THREE.Vector3(1,0,0);
        var newPitch = angle + this.pitch
        if ( newPitch < -Math.PI/2 || newPitch > Math.PI/2){
            var direction = new THREE.Vector3(0, Math.sign(newPitch), 0);
            direction.add(this.model.position);
            this.model.lookAt(direction);
        }else{
            this.model.rotateOnAxis(axis, -angle);
        }
    }

    UpdateRotation(delta){
        var pitchVel = ((+ this.input.up) - (+ this.input.down)) * delta;
        var rollVel =  ((+ this.input.right) - (+ this.input.left)) * delta;
        if (rollVel == 0){
            // roll back towards xz plane
            var defaultVel = -Math.sign(this.roll) * delta;
            var smallerVel = -this.roll;
            rollVel = Math.abs(defaultVel) < Math.abs(smallerVel) ? defaultVel : smallerVel; 
        }
        console.log("pitch", this.pitch);
        this.AddRoll(rollVel);

        this.AddPitch(pitchVel);

    }

    Update(delta=0.1){
        if (!this.model){
            return;
        }
        this.UpdateRotation(delta);
        // calculate rotation (controls + speed)
        // calculate acceleration
        // calculate vel
        // calculate position
        // update model
    }
}