/**
 * GameBoard
 * @constructor
 * @param scene  		- Reference to MyScene object
 */
class GameBoard extends CGFobject {
    constructor(scene) {
        super(scene);

        this._gameboardSetup = null;
        
        this._cells = new Array(9);
        for(let i = 0; i <= 8; ++i){
            this._cells[i] = [];
            for(let j = 0; j <= 8; ++j){
                if(i-4 <= j && j <= 4+i) this._cells[i].push(new BoardCell(this.scene, this, i, j));
                else                     this._cells[i].push(null);
            }
        }

        this.getCell(0,1).stack = new PieceStack(this.scene, +6);
        this.getCell(7,3).stack = new PieceStack(this.scene, +6);
        this.getCell(5,8).stack = new PieceStack(this.scene, +6);

        this.getCell(1,5).stack = new PieceStack(this.scene, -6);
        this.getCell(3,0).stack = new PieceStack(this.scene, -6);
        this.getCell(8,7).stack = new PieceStack(this.scene, -6);
    }

    set gameboardSetup(setup){ this._gameboardSetup = setup; }
    get gameboardSetup(){ return this._gameboardSetup; }

    getCell(i, j){
        return this._cells[i][j];
    }

    setTurn(turn){
        for(let i = 0; i <= 8; ++i){
            for(let j = Math.max(i-4, 0); j <= Math.min(4+i,8); ++j){
                this.getCell(i,j).setTurn(turn);
            }
        }
    }

    deselectAll(){
        for(let i = 0; i <= 8; ++i){
            for(let j = Math.max(i-4, 0); j <= Math.min(4+i,8); ++j){
                this.getCell(i,j).deselectAll();
            }
        }
    }

    move(originCell, substacks, direction, newPieceCell) {
        if (newPieceCell.stack != null || ( 1 < direction && direction > 6 ))
            return false;
        
        for (let k = 0; k < substacks.length; k++) {
            let absHeight = Math.abs(substacks[k]);
            let substack_i;
            let substack_j;
            switch (direction) {
                case 1:
                    substack_i = originCell.i;
                    substack_j = originCell.j + absHeight;
                    break;
                case 2:
                    substack_i = originCell.i - absHeight;
                    substack_j = originCell.j;
                    break;
                case 3:
                    substack_i = originCell.i - absHeight;
                    substack_j = originCell.j - absHeight;
                    break;
                case 4:
                    substack_i = originCell.i;
                    substack_j = originCell.j - absHeight;
                    break;
                case 5:
                    substack_i = originCell.i + absHeight;
                    substack_j = originCell.j;
                    break;
                case 6:
                    substack_i = originCell.i + absHeight;
                    substack_j = originCell.j + absHeight;
                    break;
                default:
                    break;
            }

            if(substack_i > 8 || substack_i < 0 || substack_j > 8 || substack_j < 0)
                return false;

            let stack = this.getCell(substack_i, substack_j).stack;
            
            if(stack == null){
                this.getCell(substack_i, substack_j).stack
                = new PieceStack(this.scene, absHeight * (Math.sign(originCell.stack.height)));
            }
            else{
                this.getCell(substack_i, substack_j).stack
                = new PieceStack(this.scene, (absHeight + Math.abs(stack.height)) * (Math.sign(originCell.stack.height)));
            }
        }
        
        newPieceCell.stack = new PieceStack(this.scene, 1 * (Math.sign(originCell.stack.height)));

        let gameMove = new GameMove(this.scene, originCell, substacks, direction, newPieceCell, this);
        this.scene.orchestrator.gameSequence.addGameMove(gameMove);
        
        originCell.stack = null;
        
        // gameMove.animate();
        return true;
    }

    toJSON(){
        let board = new Array(9);
        for(let i = 0; i <= 8; ++i){
            board[i] = [];
            for(let j = 0; j <= 8; ++j){
                if(i-4 <= j && j <= 4+i){
                    let cell = this.getCell(i,j);
                    if(cell.stack === null) board[i].push(0                );
                    else                    board[i].push(cell.stack.height);
                } else board[i].push('nan');
            }
        }

        return board;
    }

    display() {
        this.scene.pushMatrix();
        this.scene.multMatrix(this.gameboardSetup.transformation);

        this.gameboardSetup.obj.display();
        for(let i = 0; i <= 8; ++i){
            for(let j = Math.max(i-4, 0); j <= Math.min(4+i,8); ++j){
                this.getCell(i,j).display();
            }
        }

        this.scene.popMatrix();
    }
}
