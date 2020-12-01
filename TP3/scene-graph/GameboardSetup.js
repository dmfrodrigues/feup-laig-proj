class GameboardSetup {
    constructor(){
        this._idObj = null;
        this._obj = null;
        this._transformation = null;
    }
    set idObj(id){ this._idObj = id; }
    get idObj(){ return this._idObj; }
    set obj(obj){ this._obj = obj; }
    get obj(){ return this._obj; }
    set transformation(transformation){ this._transformation = transformation; }
    get transformation(){ return this._transformation; }
}
