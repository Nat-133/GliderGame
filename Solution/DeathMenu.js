export class DeathMenu{
    container;
    title;
    restartbutton;
    newLevelButton;
    background;

    nextState;
    newLevel;

    constructor(){
        // just a lot of html definitions.
        this.nextState = false;
        this.newLevel = false;
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
        this.title.innerHTML = "<h1 text-align: center>Collision!</h1>";
        this.title.style.position = "absolute";
        this.title.style.top = "20%";
        this.title.style.left = "50%";
        this.title.style.transform = "translate(-50%, -50%)";
        this.title.style.margin = "0";
        this.title.style.color = "#ffffff";
        this.container.appendChild(this.title);

        this.restartbutton = document.createElement("button");
        this.restartbutton.innerHTML = "<p text-align: center>Restart</p>";
        this.restartbutton.style.position = "absolute";
        this.restartbutton.style.top = "40%";
        this.restartbutton.style.left = "50%";
        this.restartbutton.style.transform = "translate(-50%, -50%)";
        this.restartbutton.style.margin = "0";
        this.restartbutton.onclick = () => this.RestartClicked();
        this.container.appendChild(this.restartbutton);

        this.newlevelbutton = document.createElement("button");
        this.newlevelbutton.innerHTML = "<p text-align: center>New Level</p>";
        this.newlevelbutton.style.position = "absolute";
        this.newlevelbutton.style.top = "50%";
        this.newlevelbutton.style.left = "50%";
        this.newlevelbutton.style.transform = "translate(-50%, -50%)";
        this.newlevelbutton.style.margin = "0";
        this.newlevelbutton.onclick = () => this.NewLevelClicked();
        this.container.appendChild(this.newlevelbutton);

        document.getElementById("main").appendChild(this.container);
    }

    RestartClicked(){
        this.nextState = true;
        this.newLevel = false;
    }

    NewLevelClicked(){
        this.newLevel = true;
    }

    Display(){
        this.container.style.display = "block";
    }

    Hide(){
        this.container.style.display = "none";
    }
}