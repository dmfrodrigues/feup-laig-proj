class GameboardSetup {
    constructor(){
        this._idObj = null;
        this._obj = null;
        this._transformation = null;
        this._cells = new Array(9);
        for(let i = 0; i < 9; ++i){
            this._cells[i] = new Array(9);
            for(let j = 0; j < 9; ++j)
                this._cells[i][j] = null;
        }
    }
    set idObj(id){ this._idObj = id; }
    get idObj(){ return this._idObj; }
    set obj(obj){ this._obj = obj; }
    get obj(){ return this._obj; }
    set transformation(transformation){ this._transformation = transformation; }
    get transformation(){ return this._transformation; }
    setCellPosition(i, j, v){ this._cells[i][j] = v; }
    getCellPosition(i, j){ return this._cells[i][j]; }
}
