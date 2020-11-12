class MySpriteAnimation{
    constructor(scene, spriteSheet, startCell, endCell, duration){
        this.scene = scene;
        this.activeCell = startCell;
        this.startCell = startCell;
        this.endCell = endCell;
        this.duration = duration;
        this.factor = (this.endCell - this.startCell + 1) / this.duration;
        this.spriteSheet = this.scene.graph.spriteSheets[spriteSheet];
        this.geometry = new MyRectangle(this.scene, -0.5, -0.5, 0.5, 0.5, 1, 1);
    }
    update(t){
        t %= this.duration;
        this.activeCell = this.startCell + Math.floor(t * this.factor);
    }
    display(){
        this.spriteSheet.activateCellP(this.activeCell);
        this.geometry.display();
        this.scene.setActiveShader(this.scene.defaultShader);
    }
}
