export class GliderInput{

    clickPos;
    mouseDown;
    mouseDirX;
    mouseDirY;
    mouseinputEpsilon;
    constructor(){
        this.mouseDown = false;
        this.mouseDirX = 0;
        this.mouseDirY = 0;
        this.clickPos = [0, 0];
        this.mouseinputEpsilon = 25;

        this.keys = {
            "w": false,
            "s": false,
            "a": false,
            "d": false
        }

        document.onkeydown = (e) => this.onKeyDown(e);
        document.onkeyup = (e) => this.onKeyUp(e);
        
        document.onmousedown = (e) => this.onMouseDown(e);
        document.onmouseup = (e) => this.onMouseUp(e);
        document.onmousemove = (e) => this.onMouseMove(e);
    }

    get down(){
        let mouseinput = this.mouseDown && this.mouseDirY>this.mouseinputEpsilon;
        return this.keys["w"] || mouseinput;
    }
    get up(){
        let mouseinput = this.mouseDown && this.mouseDirY<-this.mouseinputEpsilon;
        return this.keys["s"] || mouseinput;
    }
    get left(){
        let mouseinput = this.mouseDown && this.mouseDirX<-this.mouseinputEpsilon;
        return this.keys["a"] || mouseinput;
    }
    get right(){
        let mouseinput = this.mouseDown && this.mouseDirX>this.mouseinputEpsilon;
        return this.keys["d"] || mouseinput;
    }

    onKeyDown(e){
        if (e.key == "f"){
            this.firstPerson = ! this.firstPerson;
        }
        this.keys[e.key] = true;
    }

    onKeyUp(e){
        this.keys[e.key] = false;
    }

    onMouseDown(e){
        this.mouseDown = true;
        this.clickPos = [e.offsetX, e.offsetY];
    }

    onMouseUp(e){
        this.mouseDown = false;
    }

    onMouseMove(e){
        this.mouseDirX = e.offsetX - this.clickPos[0];
        this.mouseDirY = e.offsetY - this.clickPos[1];
    }
}
