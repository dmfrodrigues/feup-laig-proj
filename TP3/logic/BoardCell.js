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

    display(){
        if(this._stack != null)
            this._stack.display();
    }
}
