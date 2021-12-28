class FlightInput{
    down: boolean;
    up: boolean;
    right: boolean;
    left: boolean;

    constructor(){
        this.down = false;
        this.up = false;
        this.right = false;
        this.left = false;
    }
    
    _onKeyDown(e: KeyboardEvent){
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

    _onKeyUp(e: KeyboardEvent){
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
