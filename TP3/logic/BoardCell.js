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

    select(){ this._selected = true; }
    deselect(){ this._selected = false; }
    deselectAll(){
        this.deselect();
        if(this._stack != null)
            this._stack.deselect();
    }

    display(){
        if(this._selected){
            this.scene.selectEnable();
            // a display ...
            this.scene.selectDisable();
        } else {
            // a display ...
        }
        if(this._stack != null)
            this._stack.display();
    }
}
