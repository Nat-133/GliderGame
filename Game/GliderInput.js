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
        this.mouseinputEpsilon = 25;

        this.keys = {
            "w": false,
            "s": false,
            "a": false,
            "d": false
        }

        //document.addEventListener("keydown", (e) => this.onKeyDown(e));
        document.onkeydown = (e) => this.onKeyDown(e);
        document.onkeyup = (e) => this.onKeyUp(e);
        // these two lines cause me so much hasstle
        // for some reason methods don't remember what object they belong to? maybe?
        // all I know is that the lambda function makes it work, presumably because
        // the object is explicitly saved in 'this.'?
        // who knows, javascript is a wee bit wack.
        document.onmousedown = (e) => this.onMouseDown(e);
        document.onmouseup = (e) => this.onMouseDown(e);
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
        this.clickPos = [e.offsetX, e.offsetY]
    }

    onMouseUp(e){
        this.mouseDown = false;
    }

    onMouseMove(e){
        this.mouseDirX = e.offsetX - this.clickPos[0];
        this.mouseDirY = e.offsetY - this.clickPos[1];
    }
}
