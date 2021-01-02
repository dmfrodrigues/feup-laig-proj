STACK_ANIM_TIME = 1.0
ROTATE_ANIM_TIME = 0.72

class MoveStackArc extends MoveStack{
    constructor(scene, gameboard){
        super(scene);
        this.gameboard = gameboard;

        this.origCell = null;
        this.pieceStacks = [];
        this.destCells = [];
        this.substacks = [];
        this.notEmptyDestStacks = [];
        this.stacksRotated = {};
        this.deltaTime = 0;
        this.resolutionFunc = null;
        this.rejectionFunc  = null;
    }


    piecesUnderStack(substacks, stackIdx){
        let total = 0;
        for(let i=0; i < substacks.length && i < stackIdx ; i++){
            total += substacks[i];
        }
        return total;
    }

    async moveSubstacks(origCell, substacks, destCells, notEmptyDestCells, notEmptyDestHeights){
        this.substacks = substacks;
        this.origCell = origCell;
        this.startTime = this.scene.time;
        for(let i = 0; i < substacks.length; i++){
            this.pieceStacks.push(new PieceStack(this.scene, Math.abs(substacks[i]) * Math.sign(origCell.stack.height)));
            this.pieceStacks[i].cell = this.origCell;
            destCells[i].visible = false;
            this.destCells.push(destCells[i]);
        }

        for(let i=0; i < notEmptyDestCells.length; i++){
            this.notEmptyDestStacks.push(new PieceStack(this.scene, notEmptyDestHeights[i]));
            this.notEmptyDestStacks[i].cell =  notEmptyDestCells[i];
            if(Math.sign(origCell.stack.height) != Math.sign(notEmptyDestHeights[i])){
                this.stacksRotated[this.notEmptyDestStacks[i]] = new PieceStack(this.scene, notEmptyDestHeights[i]);
            }
        }

        let self = this;
        return new Promise(function(resolutionFunc, rejectionFunc){
            self.resolutionFunc = resolutionFunc;
            self.rejectionFunc  = rejectionFunc;
        });
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
            this.notEmptyDestStacks = [];
            this.stacksRotated = {};
            let resolutionFunc = this.resolutionFunc;
            if(resolutionFunc !== null){
                resolutionFunc({});
                this.resolutionFunc = null;
                this.rejectionFunc  = null;
            }
        }      
    }

    display(){
        for(let i=0; i < this.pieceStacks.length; i++){
            let w = Math.min(this.deltaTime / STACK_ANIM_TIME, 1.0);
            let origPos = this.gameboard.gameboardSetup.getCellPosition(this.origCell.i, this.origCell.j);
            let destPos = this.gameboard.gameboardSetup.getCellPosition(this.destCells[i].i, this.destCells[i].j);

            let originY = this.scene.graph.pieces.height * this.piecesUnderStack(this.substacks, i);
            let destY = this.scene.graph.pieces.height * Math.abs(this.destCells[i].stack.height);

            let x = w * (destPos[0]-origPos[0]);
            let y = (1.0-Math.pow((2*this.deltaTime-1),2)) * 0.09 + originY + w*(destY-originY);
            let z = w * (destPos[2]-origPos[2]);
            
            this.scene.pushMatrix();
            this.scene.translate(x, y, z);
            this.pieceStacks[i].display();
            this.scene.popMatrix();

        }

        for(let i=0; i < this.notEmptyDestStacks.length; i++){
            if(this.stacksRotated[this.notEmptyDestStacks[i]] != undefined){
                let w = Math.min(this.deltaTime / ROTATE_ANIM_TIME, 1.0);
                let y = (1.0-Math.pow(2.75*Math.min(this.deltaTime, ROTATE_ANIM_TIME)-1,2)) * 0.07;
                let alpha = Math.min(1, w) * Math.PI;
                
                this.scene.pushMatrix();
                this.scene.translate(0, y, 0);
                this.scene.multMatrix(this.gameboard.gameboardSetup.getCellMatrix(
                    this.notEmptyDestStacks[i].cell.i,
                    this.notEmptyDestStacks[i].cell.j
                    )
                );
                this.scene.rotate(alpha, 1, 0, 0);
                this.stacksRotated[this.notEmptyDestStacks[i]].display();
    
                this.scene.popMatrix();
            }
            else{
                this.scene.pushMatrix();
                this.notEmptyDestStacks[i].display();
                this.scene.popMatrix();
            }
        }
    }
}