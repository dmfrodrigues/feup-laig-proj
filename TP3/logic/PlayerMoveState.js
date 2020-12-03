/**
 * PlayerMoveState
 * @constructor
 * @param	{CGFscene}	scene	Scene
 */

class PlayerMoveState {
    constructor(gameBoard){
        this.gameBoard = gameBoard;
        
        this.moveState = 0; // 0 to 4
        this.stackSelected = null;
        this.substacks = [];
        this.direction = 0;
    }

    init(){
        this.moveState = 0;
        this.substacks = [];
        this.direction = 0;
    }

    updateMoveState(obj, id){
        switch (this.moveState) {
            case 0:
                if(id > 100){
                    this.init();
                    this.stackSelected = obj;
                    this.gameBoard.deselectAll();
                    this.moveState = 1;
                    obj.select();
                }
                break;
            case 1:
                if(id < 100){
                    this.direction = this.getDirection(obj, this.stackSelected.cell);
                    this.manageMove(obj);
                    this.moveState = 2;
                }
                else{
                    this.init();
                    this.stackSelected = obj;
                    this.gameBoard.deselectAll();
                }
                break;
            case 2:
                if(id < 100){
                    if(this.getDirection(obj, this.stackSelected.cell) != this.direction){
                        this.init();
                        this.stackSelected = null;
                        this.gameBoard.deselectAll();
                    }
                    else{
                        this.manageMove(obj);
                        let sum = 0;
                        for(let i=0;i<this.substacks.length;i++){
                            sum += this.substacks[i];
                        }
                        if(sum == this.stackSelected.height)
                            this.moveState = 3;
                    }
                }
                else{
                    this.init();
                    this.gameBoard.deselectAll();
                }
                break;
            case 3:
                if(id < 100){
                    this.manageMove(obj);
                }
                else if(id > 100){
                    this.init();
                    this.stackSelected = obj;
                    this.gameBoard.deselectAll();
                }
                break;
            default:
                break;
        }
        console.log("Game state " + this.moveState, this.direction);
    }
    
    getDirection(cell1, cell2){
        if(cell1.i == cell2.i && cell1.j < cell2.j)      return 1;
        else if(cell1.i < cell2.i && cell1.j == cell2.j) return 2;
        else if(cell1.i < cell2.i && cell1.j < cell2.j)  return 3;
        else if(cell1.i == cell2.i && cell1.j > cell2.j) return 4;
        else if(cell1.i > cell2.i && cell1.j == cell2.j) return 5;
        else if(cell1.i > cell2.i && cell1.j > cell2.j)  return 6;
        else                                             return 0;
    }

    distance(direction, cell1, cell2){
        if(direction == 5 || direction == 6 || direction == 2 || direction == 3)
            return Math.abs(cell1.i - cell2.i);
        else
            return Math.abs(cell1.j - cell2.j);
    }

    manageMove(obj){
        let diff = this.distance(this.direction, obj, this.stackSelected.cell);
        // substacks total 
        let sum = diff;
        for(let i=0;i<this.substacks.length;i++){
            sum += this.substacks[i];
        }
        // validate
        if(!this.substacks.includes(diff)){
            if(sum <= Math.abs(this.stackSelected.height))
                this.substacks.push(diff);
            else return;
        }
        if(obj.isSelected()){
            let index = this.substacks.indexOf(diff);
            if (index !== -1) {
                this.substacks.splice(index, 1);
            }
            obj.deselect();
        }else{
            obj.select();
        }
        console.log(this.substacks);
    }
}
