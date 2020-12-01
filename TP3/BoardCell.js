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
    set stack(stack){ this._stack = stack; }
    get stack(){ return this._stack; }

    display(){
        if(this._stack != null)
            this._stack.display();
    }
}
