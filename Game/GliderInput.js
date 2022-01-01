export class GliderInput{
    down;
    up;
    right;
    left;

    constructor(){
        this.down = false;
        this.up = false;
        this.right = false;
        this.left = false;

        //document.addEventListener("keydown", (e) => this.onKeyDown(e));
        document.onkeydown = (e) => this.onKeyDown(e);
        document.onkeyup = (e) => this.onKeyUp(e);
        // these two lines cause me so much hasstle
        // for some reason methods don't remember what object they belong to? maybe?
        // all I know is that the lambda function makes it work, presumably because
        // the object is explicitly saved in 'this.'?
        // who knows, javascript is a wee bit wack.
    }

    onKeyDown(e){
        if (e.key == "a"){
            this.left = true;
        }else if (e.key == "d"){
            this.right = true;
        }else if (e.key == "w"){
            this.down = true;
        }else if (e.key == "s"){
            this.up = true;
        }
    }

    onKeyUp(e){
        if (e.key == "a"){ 
            this.left = false;
        } else if (e.key == "d"){
            this.right = false;
        } else if (e.key == "w"){
            this.down = false;
        } else if (e.key == "s"){
            this.up = false;
        }
    }
}
