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
        this.positions = [];

        //this.teststack = new PieceStack(scene, 20);
        //this.teststack = new BoardCell();
    }

    rotateStack(){

    }

    moveSubstacks(origCell, substacks, destCells){
        this.origCell = origCell;
        this.startTime = this.scene.time;
        for(let i = 0; i < substacks.length; i++){
            this.pieceStacks.push(new PieceStack(this.scene, substacks[i]));
            this.pieceStacks[i].cell = this.origCell;
            this.destCells.push(destCells[i]);
            this.positions.push(vec3.fromValues(0, 0, 0));
        }
        console.log(origCell, substacks, destCells);
    }

    update(t){
        this.deltaTime = t - this.startTime;
        if(this.deltaTime >= STACK_ANIM_TIME){
            this.pieceStacks = [];
            this.destCells = [];
            return;
        };
        for(let i = 0; i < this.pieceStacks.length; i++){
            let w = this.deltaTime / STACK_ANIM_TIME;
            
            let origPos = this.gameboard.gameboardSetup.getCellPosition(this.origCell.i, this.origCell.j);
            let destPos = this.gameboard.gameboardSetup.getCellPosition(this.destCells[i].i, this.destCells[i].j);
            console.log(origPos, destPos);
            this.positions[i].x = origPos[0] + w * (destPos[0]-origPos[0]);
            this.positions[i].y = (1.0-Math.pow((this.deltaTime-1),2)) * 0.20;
            this.positions[i].z = origPos[2] + w * (destPos[2]-origPos[2]);
            console.log(w, this.origCell, origPos[0], this.positions[0].x);
        }

        /*
        let w = dt / STACK_ANIM_TIME;
        let origPos = this.gameboard.gameboardSetup.getCellPosition(this.origCell.i, this.origCell.j);
        let destPos = this.gameboard.gameboardSetup.getCellPosition(this.destCell.i, this.destCell.j);
        
        this.x = origPos[0] + w * (destPos[0]-origPos[0]);
        this.y = (1.0-Math.pow((dt-1),2)) * 0.20;
        this.z = origPos[2] + w * (destPos[2]-origPos[2]);
        */
        
    }

    display(){
        for(let i=0; i < this.pieceStacks.length; i++){
            /*
            let w = this.deltaTime / STACK_ANIM_TIME;
            let origPos = this.gameboard.gameboardSetup.getCellPosition(this.origCell.i, this.origCell.j);
            let destPos = this.gameboard.gameboardSetup.getCellPosition(this.destCells[i].i, this.destCells[i].j);
            console.log(origPos);
            let x = origPos[0] + w * (destPos[0]-origPos[0]);
            let y = (1.0-Math.pow((this.deltaTime-1),2)) * 0.20;
            let z = origPos[2] + w * (destPos[2]-origPos[2]);
            */
           //console.log(this.positions[0]);
            this.scene.pushMatrix();
            this.scene.translate(this.positions[i].x, this.positions[i].y, this.positions[i].z);
            this.pieceStacks[i].display();
            this.scene.popMatrix();

        }
    }
}