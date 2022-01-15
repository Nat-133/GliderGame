class CityBlocks{
    citySize;
    tileSize;
    buildingSize; // tile footprint of buildings
    roadSize; // tile footprint of roads

    buildings;
    roads;
    
    constructor(){
        this.citySize = 1000;
        this.blockSize = 20;
        this.buildingSize = 1;
        this.roadSize = 1;
    }

    GetRandom(){
        // can replace with seeded randomness later if desired
        return Math.random();
    }
}