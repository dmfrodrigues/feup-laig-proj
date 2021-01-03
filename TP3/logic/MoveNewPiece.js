PIECE_ANIM_TIME = 2.0
LID_OPEN_TIME = 0.75

class MoveNewPiece extends MoveStack{
    constructor(scene, gameboard){
        super(scene);
        this.gameboard = gameboard;

        this.destCell = null;
        this.pieceStack = null;
        this.startPos =  null;
        this.destPos = null;
        this.deltaTime = 0;
        this.resolutionFunc = null;
        this.rejectionFunc  = null;
    }

    moveNewPiece(destCell, height){
        this.startTime = this.scene.time;
        this.startPos = this.scene.graph.newPiecePos;
        this.piecesBoxAnim = this.scene.graph.animations[this.scene.graph.piecesBoxAnim];

        let keys = Object.keys(this.piecesBoxAnim.keyframes);
        this.scene.graph.piecesBoxAnimation = new KeyframeAnimation(this.scene, false);
        this.scene.graph.piecesBoxAnimation.visible = true;
        for(let i in keys){
            this.scene.graph.piecesBoxAnimation.addKeyframe(
                parseFloat(keys[i]) + this.startTime,
                this.piecesBoxAnim.keyframes[keys[i]]
            );
        }

        this.scene.graph.piecesBox.animation = this.scene.graph.piecesBoxAnimation;

        this.destCell = destCell;
        destCell.visible = false;
        this.pieceStack = new PieceStack(this.scene, height);
        this.destPos = this.gameboard.gameboardSetup.getCellPosition(this.destCell.i, this.destCell.j);
    
        let self = this;
        return new Promise(function(resolutionFunc, rejectionFunc){
            self.resolutionFunc = resolutionFunc;
            self.rejectionFunc  = rejectionFunc;
        });
    }

    update(t){
        if(this.pieceStack == null) return;
        this.deltaTime = t - this.startTime - LID_OPEN_TIME;

        if(this.deltaTime >= PIECE_ANIM_TIME){
            this.pieceStack = null;
            this.destCell.visible = true;
            let resolutionFunc = this.resolutionFunc;
            if(resolutionFunc !== null){
                resolutionFunc({});
                this.resolutionFunc = null;
                this.rejectionFunc  = null;
            }
        }      
    }

    display(){
        if(this.pieceStack != null && this.deltaTime >= 0){
            let w = this.deltaTime / PIECE_ANIM_TIME;

            let x = this.startPos[0] + w * (this.destPos[0]-this.startPos[0]);
            let y = (1.0-Math.pow(this.deltaTime-1,2)) * 0.2;
            let z = this.startPos[2] + w * (this.destPos[2]-this.startPos[2]);

            this.scene.pushMatrix();
            this.scene.translate(x, y, z);
            this.pieceStack.display();
            this.scene.popMatrix();
        }
    }
}