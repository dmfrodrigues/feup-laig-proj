class GameboardSetup {
    constructor(){
        this._idObj = null;
        this._obj = null;
        this._transformation = null;
        this._cells        = new Array(9);
        this._cells_matrix = new Array(9);
        for(let i = 0; i < 9; ++i){
            this._cells       [i] = new Array(9);
            this._cells_matrix[i] = new Array(9);
            for(let j = 0; j < 9; ++j){
                this._cells       [i][j] = null;
                this._cells_matrix[i][j] = null;
            }
        }
    }
    set idObj(id){ this._idObj = id; }
    get idObj(){ return this._idObj; }
    set obj(obj){ this._obj = obj; }
    get obj(){ return this._obj; }
    set transformation(transformation){ this._transformation = transformation; }
    get transformation(){ return this._transformation; }
    setCellPosition(i, j, v){
        this._cells[i][j] = v;

        let M = mat4.create();
        mat4.translate(M, M, v);
        this._cells_matrix[i][j] = M;
    }
    getCellPosition(i, j){ return this._cells[i][j]; }
    getCellMatrix(i, j){ return this._cells_matrix[i][j]; }
}
