/**
 * PieceStack
 * @constructor
 * @param scene  		- Reference to MyScene object
 * @param height		- Height of the stack
 */
class PieceStack extends CGFobject {
	static pieceStackView = null;

	constructor(scene, height) {
		super(scene);

		this._tile = null;
		this._height = height;
		this._cell = null;
	}
	
	get height(){ return this._height; }

	set cell(cell){ this._cell = cell; }
	get cell(){ return this._cell; }

	display(){
		if(PieceStack.pieceStackView != null){
			PieceStack.pieceStackView.display(this);
		}
	}
}
