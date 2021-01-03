class MoveStack{
    constructor(scene){
        this.scene = scene;

        this.startTime = 0;
        this.deltaTime = 0;

        if(this.constructor === MoveStack){
            throw new TypeError('Abstract class "MoveStack" cannot be instantiated directly');
        }
    }
}