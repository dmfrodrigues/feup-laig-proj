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
        this.substacks = [];
        this.notEmptyDestCells = [];
        this.stacksRotated = [];
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

    moveSubstacks(origCell, substacks, destCells, notEmptyDestCells, notEmptyDestHeights){
        this.substacks = substacks;
        this.origCell = origCell;
        this.startTime = this.scene.time;
        for(let i = 0; i < substacks.length; i++){
            this.pieceStacks.push(new PieceStack(this.scene, substacks[i] * Math.sign(origCell.stack.height)));
            this.pieceStacks[i].cell = this.origCell;
            destCells[i].visible = false;
            this.destCells.push(destCells[i]);
        }

        for(let i=0; i < notEmptyDestCells.length; i++){
            if(Math.sign(origCell.stack.height) != Math.sign(notEmptyDestHeights)){
                this.stacksRotated.push(new PieceStack(this.scene, notEmptyDestHeights[i]));
                this.stacksRotated[i].cell = notEmptyDestCells[i];
            }
            else{
                this.notEmptyDestCells.push(new PieceStack(this.scene, notEmptyDestHeights[i]));
                this.notEmptyDestCells[i].cell =  notEmptyDestCells[i];
            }
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
            this.notEmptyDestCells = [];
            this.stacksRotated = [];
            return;
        };
    }

    diplayRotation(){
        
    }

    display(){
        for(let i=0; i < this.pieceStacks.length; i++){
            
            let w = this.deltaTime / STACK_ANIM_TIME;
            let origPos = this.gameboard.gameboardSetup.getCellPosition(this.origCell.i, this.origCell.j);
            let destPos = this.gameboard.gameboardSetup.getCellPosition(this.destCells[i].i, this.destCells[i].j);

            let originY = this.scene.graph.pieces.height * this.piecesUnderStack(this.substacks, i);
            let destY = this.scene.graph.pieces.height * Math.abs(this.destCells[i].stack.height);

            let x = w * (destPos[0]-origPos[0]);
            let y = (1.0-Math.pow((this.deltaTime-1),2)) * 0.15 + originY + w*(destY-originY);
            let z = w * (destPos[2]-origPos[2]);
            
            this.scene.pushMatrix();
            this.scene.translate(x, y, z);
            this.pieceStacks[i].display();
            this.scene.popMatrix();

        }

        for(let i=0; i < this.stacksRotated.length; i++){
            let w = this.deltaTime / ROTATE_ANIM_TIME;

            let y = (1.0-Math.pow((this.deltaTime-1),2)) * 0.05;
            let alpha = Math.min(1, w) * Math.PI;
            
            this.scene.pushMatrix();
            this.scene.translate(0, y, 0);
            //this.scene.multMatrix(this.gameboard.gameboardSetup.transformation);
            this.scene.rotate(alpha, 1, 0, 0);
            this.stacksRotated[i].display();

            this.scene.popMatrix();
        }

        for(let i=0; i < this.notEmptyDestCells.length; i++){
            this.scene.pushMatrix();
            this.notEmptyDestCells[i].display();
            this.scene.popMatrix();
        }
    }
}