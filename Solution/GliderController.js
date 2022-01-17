import * as THREE from '../Extra_Libraries/build/three.module.js';
import { GLTFLoader } from '../Extra_Libraries/examples/jsm/loaders/GLTFLoader.js';
import { GliderInput } from './GliderInput.js';

export class GliderController {
    acc;
    vel;
    pos;

    _forwards;

    input;
    atMaxPitch; //boolean, whether the glider is fully up or down
    // useful because vectors are innacurate when dealing with
    // really small angles/values

    model;
    scene;

    glideRatio; // how far the glider falls for each unit travelled horizontally when level
    gravity = new THREE.Vector3(0, -10, 0);

    sound;

    constructor(scene){
        this.acc = new THREE.Vector3(0,0,0);
        this.vel = new THREE.Vector3(0,0,0);
        this.pos = new THREE.Vector3(0,500,0);

        this.glideRatio = 1/20;

        this._forwards = new THREE.Vector3(0,0,-1);

        this.input = new GliderInput();
        this.atMaxPitch = false;

        this.scene = scene;
        this.LoadModel();
    }

    LoadModel(){
        var loader = new GLTFLoader();
        loader.load('../Assets/models/glider.glb', (gltf) => {
            gltf.scene.position.set(0,1,0);
            gltf.scene.children[0].scale.set(0.5,0.5,0.5);
            //gltf.scene.children[0].rotation.set(0,Math.PI,0);
            //gltf.scene.children[0].visible = false;
            this.model = gltf.scene;

            let lightTarget = new THREE.Object3D();
            lightTarget.position.set(0, 0, 2);
            this.model.add(lightTarget);  // invisible pointer object
            let spotlight = new THREE.SpotLight(0xffffff, 0.5, 0, Math.PI/6, 0.5, 0.2);
            spotlight.target = lightTarget;
            spotlight.position.set(0,0,1);
            this.model.add(spotlight);  // 'headlight'

            this.scene.add(this.model);
            //this.AddDebugAxes();
        });
    }

    AddDebugAxes(){
        // debug purposes, adds model cardinal axes to the model.
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

    get relativeVel(){
        // used for debugging purposes, this.vel in model space
        var fVel = this.forwards.dot(this.vel);
        var uVel = this.up.dot(this.vel);
        var rVel = this.left.dot(this.vel);

        return new THREE.Vector3(rVel, uVel, fVel);
    }

    get forwards(){
        // model forwards in world space
        if (!this.model){
            return new THREE.Vector3(0,0,1);
        }
        this.model.getWorldDirection(this._forwards);
        return this._forwards;
    }

    get up(){
        // model up in world space
        var vec = new THREE.Vector3(0,1,0);
        vec.applyQuaternion(this.rotation);
        return vec;
    }

    get left(){
        var vec = new THREE.Vector3(1,0,0);
        vec.applyQuaternion(this.rotation);
        return vec;
    }

    get roll(){
        // angle the wings make with the horizontal plane if roll was zero
        // there's very little information online about how to calculate
        // these angles when there is a composition of roll, pitch, and yaw
        var planeNormal = this.forwards.clone();
        if (this.atMaxPitch){
            return 0;
        }
        planeNormal.cross(new THREE.Vector3(0,1,0));
        planeNormal.cross(this.forwards);
        //planeNormal is this.up if roll was 0
        var horizontal = this.left;
        return this.GetAngleToPlane(horizontal, planeNormal);
    }

    get pitch(){
        // angle to the horizontal plane
        var angle = this.GetAngleToPlane(this.forwards, new THREE.Vector3(0,1,0));
        return angle;
    }

    get rotation(){
        if (!this.model){
            return new THREE.Quaternion();
        }
        return this.model.quaternion;
    }

    get boundingLines(){
        // returns a list of pairs of points that
        // represent the start and endpoints of the bounding box edges
        let relpoints = [
            new THREE.Vector3(0.5,0.5,0.5),
            new THREE.Vector3(-0.5,0.5,0.5),
            new THREE.Vector3(-0.5,0.5,-0.5),
            new THREE.Vector3(0.5,0.5,-0.5),
            new THREE.Vector3(0.5,-0.5,0.5),
            new THREE.Vector3(-0.5,-0.5,0.5),
            new THREE.Vector3(-0.5,-0.5,-0.5),
            new THREE.Vector3(0.5,-0.5,-0.5)
        ];

        let points = [];
        for (let i=0; i<relpoints.length; i++){
            let point = relpoints[i];
            points.push(this.model.localToWorld(point));
        }

        let linePointers = [
            [0,1], [1,2], [2,3], [3,1], 
            [4,5], [5,6], [6,7], [7,4],
            [0,4], [5,1], [2,6], [7,3]
        ];

        let lines = []
        for (const linePointer of linePointers){
            let p1 = linePointer[0];
            let p2 = linePointer[1];
            lines.push([points[p1], points[p2]]);
        }
        return lines;
    }

    GetAngleToPlane(vector, planeNormal){
        return Math.PI/2 - vector.angleTo(planeNormal);
    }

    AddRoll(angle){
        // rotate around model's z axis
        var axis = new THREE.Vector3(0,0,1);
        var newRoll = this.roll+angle;
        if (Math.abs(newRoll) > 3*Math.PI/8 && Math.abs(newRoll) > Math.abs(this.roll)){
            return;
        }
        this.model.rotateOnAxis(axis, angle);
    }

    AddPitch(angle){
        // rotate around model's x axis
        var axis = new THREE.Vector3(1,0,0);
        var newPitch = angle + this.pitch
        if ( newPitch < -Math.PI/2 || newPitch > Math.PI/2){
            var altAngle = newPitch - Math.sign(newPitch)*Math.PI/2;
            this.model.rotateOnAxis(axis, -altAngle);
            this.model.up.copy(this.up);
            var look = new THREE.Vector3(0, this.forwards.y, 0);
            look.addScaledVector(this.up, -Math.sign(look.y) * 0.001);
            look.add(this.pos);
            this.model.lookAt(look);
            this.atMaxPitch = true;
        }else if (angle != 0){
            this.atMaxPitch = false;
            this.model.rotateOnAxis(axis, -angle);
        }
    }

    AddYaw(angle){
        // rotate around model's y axis
        var axis = new THREE.Vector3(0,1,0);
        var q = this.model.quaternion.clone();
        q.invert();
        axis.applyQuaternion(q);
        this.model.rotateOnAxis(axis, angle);
    }

    Stall(angle){
        // rotate the glider to point downwards, egnoring local orientation
        let axis = new THREE.Vector3(0, 1, 0);
        axis.cross(this.forwards);  // axis in world coordinates
        let q = this.model.quaternion.clone();  // quaternion rotation to world coordinates
        q.invert();
        axis.applyQuaternion(q);  // axis in local coordinates
        let newAngle = this.pitch + angle;
        this.model.up.copy(this.up);
        this.model.rotateOnAxis(axis, angle);
        if (newAngle < -Math.PI/2 || newAngle > Math.PI/2){
            let look = new THREE.Vector3(0, this.forwards.y, 0);
            look.addScaledVector(this.up, -Math.sign(look.y) * 0.001);
            look.add(this.pos);
            this.model.lookAt(look);
            this.atMaxPitch = true;
        }else{
            this.atMaxPitch = false;
        }
    }

    UpdateRotation(delta){
        var pitchVel = ((+ this.input.up) - (+ this.input.down)) * delta;
        this.AddPitch(pitchVel);

        var fSpeed = Math.max(this.forwards.dot(this.vel)*2, 0.1);
        let stallVel = delta/(0.5*fSpeed);
        this.Stall(stallVel);  // automatically pitch down as airspeed lowers

        var rollVel =  ((+ this.input.right) - (+ this.input.left)) * delta * 2;
        if (rollVel == 0){
            // roll back towards xz plane
            var defaultVel = -Math.sign(this.roll) * delta * 3;
            var smallerVel = -this.roll;
            rollVel = Math.abs(defaultVel) < Math.abs(smallerVel) ? defaultVel : smallerVel; 
            // don't roll too much
        }
        this.AddRoll(rollVel);

        var yawVel = -this.left.dot(new THREE.Vector3(0,1,0)) * delta;  
        // added yaw is a proportion of how vertical the glider is along its wings
        this.AddYaw(yawVel);
    }

    UpdateVel(){
        this.vel.add(this.gravity);

        var upVel = this.up;
        upVel.multiplyScalar(this.vel.dot(upVel));
        this.vel.addScaledVector(upVel, -1 + this.glideRatio);  // remove glide ratio down vel

        var forwardsAcc = this.forwards;
        this.vel.addScaledVector(forwardsAcc, upVel.length()/10); // convert to forward speed

        var forwardsDrag = forwardsAcc;
        forwardsDrag.multiplyScalar(this.vel.dot(forwardsDrag));
        this.vel.addScaledVector(forwardsDrag, -1*forwardsDrag.length()/2000);  // drag proportional to v^2
        
        var horizontalDrag = this.left;
        horizontalDrag.multiplyScalar(this.vel.dot(horizontalDrag));
        this.vel.addScaledVector(horizontalDrag, -1*0.95);  
        // horizontal drag basically just cancells out lateral movement
    }
    
    UpdatePos(delta){
        var displacement = this.vel.clone();
        displacement.multiplyScalar(delta);
        this.pos.add(displacement);
    }

    UpdateModel(){
        this.model.position.set(this.pos.x, this.pos.y, this.pos.z);
    }

    Update(delta=0.1){
        if (!this.model){
            return;
        }

        this.UpdateRotation(delta);
        this.UpdateVel();
        this.UpdatePos(delta);
        this.UpdateModel();

        this.model.visible = !this.input.firstPerson;
    }

    Collides(object){
        // returns true if the glider's hit the floor or a building
        if (this.pos.y <=0){
            return true;
        }

        let lines = this.boundingLines;
        for (const points of lines){
            let direction = points[1].clone();
            direction.sub(points[0]);
            let length = direction.length();
            let ray = new THREE.Raycaster(points[0], direction.normalize());
            let collisions = ray.intersectObjects(object.children);
            if (collisions.length > 0 && collisions[0].distance < length){
                return true;
            }
        }
        return false;
    }

    Restart(){
        this.pos.set(0,500,0);
        this.vel.set(0,0,10);
        this.model.rotation.set(0,0,0);
        this.UpdateModel();
    }
}