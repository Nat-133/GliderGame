import * as THREE from '../Common/build/three.module.js';

export class ThirdPersonCamera {
    camera;
    target;

    pos ;
    focus;

    constructor(camera, target){
        this.camera = camera;
        this.target = target;
        this.pos = new THREE.Vector3(0,20,20);
        this.focus = new THREE.Vector3(0,0,0);
    }

    CalcOptPos(){
        if (this.target.input.firstPerson){
            return this.target.pos;
        }
        //var optPos = new THREE.Vector3(0, 10, -20 + this.target.vel.length());
        var scale = this.target.vel.length()/5;
        var vertOffset = Math.max(Math.cos(this.target.pitch)-0.1, 0)*5;
        var optPos = new THREE.Vector3(0, vertOffset, -2 - scale);
        // offset increased as glider goes faster

        optPos.applyQuaternion(this.target.rotation);
        optPos.applyAxisAngle(this.target.forwards, -this.target.roll);
        // remove roll from camera rotation, makes things a lot smoother

        optPos.add(this.target.pos);
        return optPos;
    }

    CalcOptFocus(){
        let vertOffset = 0;
        if (!this.target.input.firstPerson){
            vertOffset = Math.max(Math.cos(this.target.pitch)-0.1, 0);
        }
        let optFocus = new THREE.Vector3(0,vertOffset,this.target.vel.length()/20);
        optFocus.applyQuaternion(this.target.rotation);
        optFocus.add(this.target.pos);
        return optFocus;
    }

    Update(delta){
        var optPos = this.CalcOptPos();
        var optLook = this.CalcOptFocus();

        var t = 4 * delta;

        this.pos.copy(optPos);
        this.focus.copy(optLook);

        //this.pos.lerp(optPos, t);
        //this.focus.lerp(optLook, t);

        this.camera.position.copy(this.pos);
        this.camera.lookAt(this.focus);
    }
}