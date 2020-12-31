class MoveStack{
    constructor(scene){
        this.scene = scene;

        if(this.constructor === MoveStack){
            throw new TypeError('Abstract class "MoveStack" cannot be instantiated directly');
        }
    }
}