/**
 * GameBoard
 * @constructor
 * @param scene  		- Reference to MyScene object
 */
class GameBoard extends CGFobject {
	constructor(scene) {
        super(scene);

        this._obj = null;
        
        /*
        this._cells = new Array(9);
        for(let i = 0; i <= 8; ++i){
            for(let j = 0; j <= 8; ++j){
                if(i-4 <= j && j <= 4+i) this._cells[i].push(new BoardCell(this.scene, this, i, j));
                else                     this._cells[i].push(null);
            }
        }
        */
    }

    setGameboard(obj){
        this._obj = obj;
    }

    getCell(i, j){
        return this._cells[i][j];
    }

    /**
     * TODO
     */
    move(){}

    display(){
        this._obj.display();
        /*
        for(let i = 0; i <= 8; ++i){
            for(let j = max(i-4, 0); j <= min(4+i,8); ++j){
                this.getCell(i,j).display();
            }
        }
        */
    }
}
