PIECE_ANIM_TIME = 1.0

class MoveNewPiece extends MoveStack{
    constructor(scene, gameboard){
        super(scene);
        this.gameboard = gameboard;

        this.destCell = null;
        this.pieceStack = null;
        this.startPos = vec3.fromValues(-0.275, 0, 0);
        this.destPos = null;
        this.deltaTime = 0;
    }

    moveNewPiece(destCell, height){
        this.startTime = this.scene.time;
        this.destCell = destCell;
        destCell.visible = false;
        this.pieceStack = new PieceStack(this.scene, height);
        this.destPos = this.gameboard.gameboardSetup.getCellPosition(this.destCell.i, this.destCell.j);
    }

    update(t){
        if(this.pieceStack == null) return;
        this.deltaTime = t - this.startTime;
        if(this.deltaTime >= PIECE_ANIM_TIME){
            this.pieceStack = null;
            this.destCell.visible = true;
        }      
    }

    display(){
        if(this.pieceStack != null){
            let w = this.deltaTime / PIECE_ANIM_TIME;
            let x = this.startPos[0] + w * (this.destPos[0]-this.startPos[0]);
            let y = (1.0-Math.pow(2*this.deltaTime-1,2)) * 0.15;
            let z = this.startPos[2] + w * (this.destPos[2]-this.startPos[2]);
            
            this.scene.pushMatrix();
            this.scene.translate(x, y, z);
            this.pieceStack.display();
            this.scene.popMatrix();
        }
    }
}