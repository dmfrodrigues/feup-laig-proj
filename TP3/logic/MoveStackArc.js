STACK_ANIM_TIME = 2.0
ROTATE_ANIM_TIME = 1.5

class MoveStackArc extends MoveStack{
    constructor(scene, gameboard){
        super(scene);
        this.gameboard = gameboard;

        this.startTime = 0;
        this.deltaTime = 0;

        this.origCell = null;
        this.pieceStacks = [];
        this.destCells = [];
        this.substacks
    }


    piecesUnderStack(substacks, stackIdx){
        let total = 0;
        for(let i=0; i < substacks.length && i < stackIdx ; i++){
            total += substacks[i];
        }
        return total;
    }

    rotateStack(){

    }

    moveSubstacks(origCell, substacks, destCells){
        this.substacks = substacks;
        this.origCell = origCell;
        this.startTime = this.scene.time;
        for(let i = 0; i < substacks.length; i++){
            this.pieceStacks.push(new PieceStack(this.scene, substacks[i] * Math.sign(origCell.stack.height)));
            this.pieceStacks[i].cell = this.origCell;
            destCells[i].visible = false;
            this.destCells.push(destCells[i]);
        }
    }

    update(t){
        this.deltaTime = t - this.startTime;
        if(this.deltaTime >= STACK_ANIM_TIME){
            for(let i=0; i < this.destCells.length; i++){
                this.destCells[i].visible = true;
            }
            this.pieceStacks = [];
            this.destCells = [];
            this.substacks = [];
            return;
        };
        
    }

    display(){
        for(let i=0; i < this.pieceStacks.length; i++){
            
            let w = this.deltaTime / STACK_ANIM_TIME;
            let origPos = this.gameboard.gameboardSetup.getCellPosition(this.origCell.i, this.origCell.j);
            let destPos = this.gameboard.gameboardSetup.getCellPosition(this.destCells[i].i, this.destCells[i].j);

            let originY = this.scene.graph.pieces.height * this.piecesUnderStack(this.substacks, i);
            let destY = this.scene.graph.pieces.height * Math.abs(this.destCells[i].stack.height);

            let x = w * (destPos[0]-origPos[0]);
            let y = (1.0-Math.pow((this.deltaTime-1),2)) * 0.20 + originY + w*(destY-originY);
            let z = w * (destPos[2]-origPos[2]);
            
            this.scene.pushMatrix();
            this.scene.translate(x, y, z);
            this.pieceStacks[i].display();
            this.scene.popMatrix();

        }
    }
}