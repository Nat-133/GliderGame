import * as THREE from '../Extra_Libraries/build/three.module.js';

export class City extends THREE.Scene{
    citySize;
    tileSize;

    buildSize; // size of buildings in relation to tile size;

    buildType;

    buildings;
    
    repr;  // array of strings representing road/building

    skyscraperMaterials;
    
    constructor(size=2000){
        super();
        this.type = 'City';

        this.citySize = size;
        this.tileSize = 40;
        this.buildSize = 0.5;
        
        this.skyscraperMaterials = [];
        this.LoadSkyscraperMaterials();

        this.repr = [];
        for (let i=0; i<this.size; i++){
            this.repr.push(new Array(this.size).fill("#"));
        }
        let middle = Math.floor(this.size/2);
        this.CarveRoads(middle, 1, middle, 0);
        this.buildings = [];
        this.Construct();


    }

    get size(){
        return this.citySize/this.tileSize;
    }

    LoadSkyscraperMaterials(){
        let baseFile = "../Assets/skyscrapers/Scraper_";
        let textureCount = 2;
        for (let i=1; i<=textureCount; i++){
            let rep = String(i);
            let file = baseFile + rep + ".png";

            let sideTexture = new THREE.TextureLoader().load(file);
            sideTexture.wrapT = THREE.RepeatWrapping;
            sideTexture.wrapS = THREE.ClampToEdgeWrapping;
            let sideMaterial = new THREE.MeshPhongMaterial({ map:sideTexture });
            let topMaterial = new THREE.MeshPhongMaterial( { color: "#060918" });
            let materials = [sideMaterial, sideMaterial, topMaterial, sideMaterial, sideMaterial, sideMaterial];
            this.skyscraperMaterials.push(materials);
        }
    }

    GetRandom(){
        // added in case seeded randomness is included later.
        return Math.random();
    }

    Construct(){
        // create scene from the array representation of the city blocks
        let maxHeight = 400;
        let minHeight = 200;
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
                    var buildMat = this.skyscraperMaterials[Math.floor(this.GetRandom() * this.skyscraperMaterials.length)];
                    // random build material, combined with random building height

                    var buildMesh = new THREE.Mesh(buildGeo, buildMat);
                    buildMesh.castShadow = true;
                    buildMesh.receiveShadow = true;
                    buildMesh.position.set(x, height/2, z);
                    
                    this.add(buildMesh);

                    let foundationGeo = new THREE.BoxGeometry(this.buildSize * this.tileSize, 0.5, this.buildSize * this.tileSize);
                    let foundationMat = new THREE.MeshPhongMaterial({color: '#666666'});
                    let foundationMesh = new THREE.Mesh(foundationGeo, foundationMat);
                    foundationMesh.castShadow = true;
                    foundationMesh.receiveShadow = true;
                    foundationMesh.position.set(x, 0.25, z);

                    this.add(foundationMesh);  // add pavement/foundations
                }
            }
        }
    }

    CarveRoads(i, j, oi, oj, turnProb=0.01){
        // create array representation of city blocks
        if (i < 1 || j < 1 || i >= this.size-1 || j >= this.size-1){
            return;  // if out of bounds
        }
        if (this.repr[i][j] == " "){
            return;  // if a road has already been made
        }

        this.repr[i][j] = " ";

        // direction of current road
        let iVel = i-oi;
        let jVel = j-oj;

        // indices of the items in each direction
        let forwards = [i+iVel, j+jVel];
        let left  = [i-jVel, j+iVel];
        let right = [i+jVel, j-iVel];

        // options randomly chosen
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