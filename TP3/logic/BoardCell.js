/**
 * BoardCell
 * @constructor
 * @param scene  		- Reference to MyScene object
 */
class BoardCell extends CGFobject {
	constructor(scene, board, i, j) {
		super(scene);

        this._board = board;
        this._stack = null;
        this._i = i;
        this._j = j;
        this._id = 10*(i+1) + (j+1);
        this._selectable = false;
        this._selected = false;
    }
    
    /**
     * @param {PieceStack} stack
     */
    set stack(stack){
        this._stack = stack;
        if(stack != null)
            stack.cell = this;
    }
    get stack(){ return this._stack; }

    get i(){ return this._i; }
    get j(){ return this._j; }

    setTurn(turn){
        this._selectable = (
            (this.stack === null) ||
            (turn !== null && this.stack.getPlayer() !== turn)
        );
        if(this.stack !== null) this.stack.setTurn(turn);
    }

    isSelected(){ return this._selected; }
    select(){ this._selected = true; }
    deselect(){ this._selected = false; }
    deselectAll(){
        this.deselect();
        if(this._stack != null)
            this._stack.deselect();
    }

    display(){
        let M = this._board.gameboardSetup.getCellMatrix(
            this._i,
            this._j
        );
        this.scene.pushMatrix();{
            this.scene.multMatrix(M);
            if(this._selectable) this.scene.registerForPick(this._id, this);
            if(this._selected){
                this.scene.selectEnable();
                this._board.gameboardSetup.objCell.display();
                this.scene.selectDisable();
            } else {
                this._board.gameboardSetup.objCell.display();
            }
            this.scene.clearPickRegistration();
        }this.scene.popMatrix();
        if(this._stack != null)
            this._stack.display();
    }
}
