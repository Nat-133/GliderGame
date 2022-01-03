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
        //var optPos = new THREE.Vector3(0, 10, -20 + this.target.vel.length());
        var vertOffset = Math.max(Math.cos(this.target.pitch)-0.1, 0)*10;
        var optPos = new THREE.Vector3(0, vertOffset, -20);
        // offset increased as glider goes faster

        optPos.applyQuaternion(this.target.rotation);
        optPos.applyAxisAngle(this.target.forwards, -this.target.roll);
        // remove roll from camera rotation, makes things a lot smoother

        optPos.add(this.target.pos);
        return optPos;
    }

    CalcOptFocus(){
        var vertOffset = Math.max(Math.cos(this.target.pitch)-0.1, 0);
        console.log(vertOffset);
        var optFocus = new THREE.Vector3(0,vertOffset,5);
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