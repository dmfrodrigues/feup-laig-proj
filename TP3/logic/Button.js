var button_id = 200;
class Button extends CGFobject {
	
	constructor(scene) {
		super(scene);

		this._id = ++button_id;
        this._idObj = null;
        this._obj = null;
		this._selected = false;
    }
    
    set idObj(id){ this._idObj = id; }
    get idObj(){ return this._idObj; }
    set obj(obj){ this._obj = obj; }
    get obj(){ return this._obj; }

	isSelected(){ return this._selected; }
	select(){ this._selected = true; }
    deselect(){ this._selected = false; }
    deselectAll(){
        this.deselect();
    }

	display(){
		this.scene.registerForPick(this._id, this);
		if(PieceStack.pieceStackView != null){
			if(this._selected){
				this.scene.selectEnable();
				this._obj.display();
				this.scene.selectDisable();
			} else {
				this._obj.display();
			}
		}
		this.scene.clearPickRegistration();
	}
}
