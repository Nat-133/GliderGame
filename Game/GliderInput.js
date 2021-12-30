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

        document.onkeydown = this.onKeyDown;
        document.onkeyup = this.onKeyUp;
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
