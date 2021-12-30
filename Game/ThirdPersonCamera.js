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
        var optPos = new THREE.Vector3(0, 1, -3 + this.target.vel.length());
        print(typeof(this.target));
        print(typeof(this.target.model));
        //print(typeof(this.target.model.scene));
        //print(typeof(this.target.model.scene.rotation));
        //optPos.applyQuaternion(this.target.model.scene.rotation);
        optPos.add(this.target.pos);
        return optPos;
    }
    CalcOptFocus(){
        var optFocus = new THREE.Vector3(0,1,5);
        //optFocus.applyQuaternion(this.target.model.scene.rotation);
        optFocus.add(this.target.pos);
        return optFocus;
    }

    Update(delta){
        //var optPos = this.CalcOptPos();
        //var optLook = this.CalcOptFocus();

        //var t = 4 * delta;

        //this.pos.lerp(optPos, t);
        //this.focus.lerp(optLook, t);

        this.camera.position.copy(this.pos);
        this.camera.lookAt(this.focus);

        console.log(this.focus.x, this.focus.y, this.focus.z);
    }
}