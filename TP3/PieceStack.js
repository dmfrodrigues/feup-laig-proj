/**
 * PieceStack
 * @constructor
 * @param scene  		- Reference to MyScene object
 * @param height		- Height of the stack
 */
class PieceStack extends CGFobject {
	// static pieceStackView = null;

	constructor(scene, height) {
		super(scene);

		this._tile = null;
		this._height = height;
	}
	
	get height(){ return this._height; }

	display(){
		/*
		if(pieceStackView != null){
			pieceStackView.display(this);
		}
		*/
	}
}
