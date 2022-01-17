export class HUD{

    target;
    container;
    speed;
    elevation;

    constructor(controller){
        this.target = controller;
        this.speed = document.createElement("div");
        this.speed.style.backgroundColor = "rgba(0,0,0,0.5)";
        this.speed.style.position = "absolute";
        this.speed.style.width = "60px";
        this.speed.style.height = "20px";
        this.speed.style.top = "10px";
        this.speed.style.left = "10px";
        this.speed.style.color = "#ffffff";
        this.speed.style.textIndent = "3px";
        document.getElementById("main").appendChild(this.speed);
        this.elevation = document.createElement("div");
        this.elevation.style.backgroundColor = "rgba(0,0,0,0.5)";
        this.elevation.style.position = "absolute";
        this.elevation.style.width = "60px";
        this.elevation.style.height = "20px";
        this.elevation.style.top = "40px";
        this.elevation.style.left = "10px";
        this.elevation.style.color = "#ffffff";
        this.elevation.style.textIndent = "3px";
        document.getElementById("main").appendChild(this.elevation);
    }

    Update(){
        // set the values to the values in the target
        let speedVal = String(Math.round(this.target.vel.length()));
        this.speed.innerHTML = speedVal + "m/s";

        let elevationVal = String(Math.round(this.target.pos.y));
        this.elevation.innerHTML = elevationVal + "m";
    }
}