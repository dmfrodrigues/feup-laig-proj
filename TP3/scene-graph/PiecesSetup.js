class PiecesSetup {
    constructor(){
        this._idObj = null;
        this._obj = null;
        this._view = null;
        this._height = null;
    }
    set idObj(id){ this._idObj = id; }
    get idObj(){ return this._idObj; }
    set obj(obj){ this._obj = obj; }
    get obj(){ return this._obj; }
    set view(view){ this._view = view; }
    get view(){ return this._view; }
    set height(height){ this._height = height; }
    get height(){ return this._height; }
}
