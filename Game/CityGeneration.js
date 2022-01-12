import * as THREE from '../Common/build/three.module.js';

export class City extends THREE.Scene{
    citySize;
    tileSize;

    buildSize; // size of buildings in relation to tile size;

    buildType;
    
    repr;  // array of strings representing road/building
    
    constructor(size=2000){
        super();
        this.type = 'City';

        this.citySize = size;
        this.tileSize = 40;
        this.buildSize = 0.5;

        this.repr = [];
        for (let i=0; i<this.size; i++){
            this.repr.push(new Array(this.size).fill("#"));
        }
        let middle = Math.floor(this.size/2);
        this.CarveRoads(middle, 1, middle, 0);
        this.Construct();
    }

    get size(){
        return this.citySize/this.tileSize;
    }

    GetRandom(){
        // added in case seeded randomness is included later.
        return Math.random();
    }

    Construct(){
        let maxHeight = 300;
        let minHeight = 100;
        for (let hor=0; hor<this.size; hor+=this.buildSize){
            for (let ver=0; ver<this.size; ver+=this.buildSize){
                let i = Math.floor(ver);
                let j = Math.floor(hor);
                let bType = this.repr[i][j];
                if (bType == "#"){
                    var height = Math.floor(this.GetRandom() * (maxHeight-minHeight)) + minHeight;
                    let x = hor*this.tileSize-this.citySize/2;
                    let z = ver*this.tileSize-this.citySize/2;

                    var buildGeo = new THREE.BoxGeometry(this.buildSize*this.tileSize*0.9, height, this.buildSize*this.tileSize*0.9);
                    var buildMat = new THREE.MeshPhongMaterial({color: '#aaaa99'});
                    var buildMesh = new THREE.Mesh(buildGeo, buildMat);
                    buildMesh.castShadow = false;
                    buildMesh.receiveShadow = false;
                    buildMesh.position.set(x, height/2, z);
              
                    this.add(buildMesh);
                }
            }
        }
    }

    CarveRoads(i, j, oi, oj, turnProb=0.01){
        if (i < 1 || j < 1 || i >= this.size-1 || j >= this.size-1){
            return;  // if out of bounds
        }
        if (this.repr[i][j] == " "){
            return;  // if a road has already been made
        }

        this.repr[i][j] = " ";

        let iVel = i-oi;
        let jVel = j-oj;

        let forwards = [i+iVel, j+jVel];
        let left  = [i-jVel, j+iVel];
        let right = [i+jVel, j-iVel];

        let doLeftTurn = this.GetRandom() < turnProb;
        let doRightTurn = this.GetRandom() < turnProb;
        let goStraigt = !(doLeftTurn && doRightTurn) || this.GetRandom() < 1-turnProb;

        if (goStraigt){
            let newTurnProb = 1 - (1-turnProb)**2;
            this.CarveRoads(forwards[0], forwards[1], i, j, newTurnProb);
        }
        if (doLeftTurn){
            this.CarveRoads(left[0], left[1], i, j);
        }
        if (doRightTurn){
            this.CarveRoads(right[0], right[1], i, j)
        }
    }
}