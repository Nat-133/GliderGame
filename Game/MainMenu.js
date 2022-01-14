export class MainMenu{

    container;
    title;
    controls;
    startbutton;
    background;

    nextState;

    constructor(){
        this.nextState = false;
        this.container = document.createElement("div");
        this.container.style.display = "none";

        this.background = document.createElement("div");
        this.background.style.width = "100%";
        this.background.style.height = "100%";
        this.background.style.position = "absolute";
        this.background.style.top = "0%";
        this.background.style.left = "0%";
        this.background.style.backgroundColor = "rgba(0,0,0,0.5)";
        this.container.appendChild(this.background);

        this.title = document.createElement("div");
        this.title.innerHTML = "<h1 text-align: center>Glider Game</h1>";
        this.title.style.position = "absolute";
        this.title.style.top = "20%";
        this.title.style.left = "50%";
        this.title.style.transform = "translate(-50%, -50%)";
        this.title.style.margin = "0";
        this.title.style.color = "#ffffff";
        this.container.appendChild(this.title);

        this.controls = document.createElement("div");
        this.controls.innerHTML = "<p text-align: center>turn: WASD, swap perspective: F</p>";
        this.controls.style.position = "absolute";
        this.controls.style.top = "30%";
        this.controls.style.left = "50%";
        this.controls.style.transform = "translate(-50%, -50%)";
        this.controls.style.margin = "0";
        this.controls.style.color = "#ffffff";
        this.container.appendChild(this.controls);

        this.startbutton = document.createElement("button");
        this.startbutton.innerHTML = "<p text-align: center>Start</p>";
        this.startbutton.style.position = "absolute";
        this.startbutton.style.top = "40%";
        this.startbutton.style.left = "50%";
        this.startbutton.style.transform = "translate(-50%, -50%)";
        this.startbutton.style.margin = "0";
        this.startbutton.onclick = () => this.Clicked();
        this.container.appendChild(this.startbutton);

        document.getElementById("main").appendChild(this.container);

        this.Display();
    }   

    Clicked(){
        this.nextState = true;
    }

    Display(){
        this.container.style.display = "block";
    }

    Hide(){
        this.container.style.display = "none";
    }
}