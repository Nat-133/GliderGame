import * as THREE from '../Extra_Libraries/build/three.module.js';

export class ThirdPersonCamera {
    camera;
    target;

    pos ;
    focus;

    sound;

    constructor(camera, target){
        this.camera = camera;
        this.target = target;
        this.pos = new THREE.Vector3(0,20,20);
        this.focus = new THREE.Vector3(0,0,0);
        this.LoadSound();
        // sound has to be associated with a camera, so it gets defined here
    }

    LoadSound(){
        let listener = new THREE.AudioListener();
        this.camera.add(listener);

        this.sound = new THREE.Audio(listener);
        let loader = new THREE.AudioLoader();
        loader.load('../Assets/sounds/mixkit-winter-wind-loop-1175.wav', ( buffer ) =>{
            this.sound.setBuffer(buffer);
            this.sound.setLoop( true );
            this.sound.setVolume( 0.5 );
        });
    }

    CalcOptPos(){
        if (this.target.input.firstPerson){
            return this.target.pos;
        }
        var scale = this.target.vel.length()/5;
        var vertOffset = Math.max(Math.cos(this.target.pitch)-0.1, 0)*5;
        // camera gets more behind the glider as it goes up or down

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
        // target is further away as speed increases, makes the camera angle closer to glider angle
        optFocus.applyQuaternion(this.target.rotation);
        optFocus.add(this.target.pos);
        return optFocus;
    }

    CalcOptVolume(){
        let speed = this.target.vel.length();
        return speed/300;
    }

    Update(delta){
        var optPos = this.CalcOptPos();
        var optLook = this.CalcOptFocus();
        var optVolume = this.CalcOptVolume();

        var t = 4 * delta;

        this.pos.copy(optPos);
        this.focus.copy(optLook);

        this.camera.position.copy(this.pos);
        this.camera.lookAt(this.focus);
        this.sound.setVolume(optVolume);
    }
}