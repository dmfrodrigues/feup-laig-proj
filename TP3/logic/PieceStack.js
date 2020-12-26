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
		this._id = null;
		this._selectable = false;
		this._selected = false;
	}
	
	get height(){ return this._height; }
	getPlayer(){
		if(this.height > 0) return 1;
		if(this.height < 0) return 2;
		throw new RangeError('Stack height can not be zero.')
	}

	setTurn(turn){
		this._selectable = (turn !== null && this.getPlayer() === turn);
	}

	set cell(cell){
		this._cell = cell;
		this._id = 100 + 10*(cell.i+1) + (cell.j+1);
	}
	get cell(){ return this._cell; }

	isSelected(){ return this._selected; }
	select(){ this._selected = true; }
    deselect(){ this._selected = false; }
    deselectAll(){
        this.deselect();
    }

	display(){
		if(this._selectable) this.scene.registerForPick(this._id, this);
		if(PieceStack.pieceStackView != null){
			if(this._selected){
				this.scene.selectEnable();
				PieceStack.pieceStackView.display(this);
				this.scene.selectDisable();
			} else {
				PieceStack.pieceStackView.display(this);
			}
		}
		this.scene.clearPickRegistration();
	}
}
