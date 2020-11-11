class MySpriteAnimation{
    constructor(scene, spriteSheet, startCell, endCell, duration){
        this.scene = scene;
        this.activeCell = startCell;
        this.startCell = startCell;
        this.endCell = endCell;
        this.interval = duration/(endCell - startCell);
        this.time = this.interval;
        this.spriteSheet = this.scene.graph.spriteSheets[spriteSheet];
        this.geometry = new MyRectangle(this.scene, -0.5, -0.5, 0.5, 0.5, 1, 1);
    }
    update(t){
        if(this.time <= t){
            this.time += this.interval;
            this.activeCell++;
            if(this.activeCell > this.endCell)
                this.activeCell = this.startCell;
        }
    }
    display(){
        this.spriteSheet.activateCellP(this.activeCell);
        this.geometry.display();
        this.scene.setActiveShader(this.scene.defaultShader);
    }
}
