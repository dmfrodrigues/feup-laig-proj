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
        this.newPiece = null;
    }

    initialState(){
        this.moveState = 0;
        this.stackSelected = null;
        this.substacks = [];
        this.direction = 0;
        this.newPiece = null;
    }

    isCellId(id){ return id < 100;}
    isStackId(id){ return id > 100 && id < 200;}
    isButtonId(id){ return id  > 200;}

    substacksLength(){
        let sum = 0;
        for(let i=0;i<this.substacks.length;i++)
            sum += this.substacks[i];
        return sum;
    }

    updateMoveState(obj, id){
        switch (this.moveState) {
            case 0:
                if(this.isStackId(id)){
                    this.initialState();
                    this.stackSelected = obj;
                    this.gameBoard.deselectAll();
                    this.moveState = 1;
                    console.log("Stack selected");
                    obj.select();
                }
                break;
            case 1:
                if(this.isCellId(id)){
                    this.direction = this.getDirection(obj, this.stackSelected.cell);
                    if(this.direction != 0)
                        this.manageMove(obj);
                    else break;
                    console.log("Added substack", this.moveState);
                    if(this.substacksLength() == Math.abs(this.stackSelected.height))
                        this.moveState = 3;
                    else
                        this.moveState = 2;
                }
                else if(this.isStackId(id)){
                    this.initialState();
                    this.stackSelected = obj;
                    this.gameBoard.deselectAll();
                }
                break;
            case 2:
                if(this.isCellId(id)){
                    if(this.getDirection(obj, this.stackSelected.cell) != this.direction){
                        this.initialState();
                        this.stackSelected = null;
                        this.gameBoard.deselectAll();
                    }
                    else{
                        this.manageMove(obj);
                        console.log("Added substack", this.moveState);
                        let sum = this.substacksLength();
                        if(sum == Math.abs(this.stackSelected.height)){
                            console.log("All substacks in place - Yellow to continue");
                            this.moveState = 3;
                        }
                    }
                }
                else{
                    this.initialState();
                    this.gameBoard.deselectAll();
                }
                break;
            case 3:
                if(this.isCellId(id)){
                    if(this.getDirection(obj, this.stackSelected.cell) == this.direction)
                        this.manageMove(obj);
                }
                else if(this.isStackId(id)){
                    this.initialState();
                    this.stackSelected = obj;
                    this.gameBoard.deselectAll();
                }
                else{
                    // submit substacks
                    this.moveState = 4;
                    console.log("Submitted substacks :" , this.substacks);
                }
                break;
            case 4:
                if(this.isCellId(id)){
                    // submit new piece
                    console.log("Final Move");
                    this.gameBoard.move(this.stackSelected.cell, this.substacks, this.direction, obj);
                    this.initialState();
                    this.gameBoard.deselectAll();
                    // submit move
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
        else if(cell1.i < cell2.i && cell1.j < cell2.j
            && (cell1.i - cell2.i == cell1.j - cell2.j)) return 3;
        else if(cell1.i == cell2.i && cell1.j > cell2.j) return 4;
        else if(cell1.i > cell2.i && cell1.j == cell2.j) return 5;
        else if(cell1.i > cell2.i && cell1.j > cell2.j 
            && (cell1.i - cell2.i == cell1.j - cell2.j)) return 6;
        else                                             return 0;
    }

    distance(direction, cell1, cell2){
        if(direction == 5 || direction == 6 || direction == 2 || direction == 3)
            return Math.abs(cell1.i - cell2.i);
        else
            return Math.abs(cell1.j - cell2.j);
    }

    manageMove(obj){
        let dist = this.distance(this.direction, obj, this.stackSelected.cell);
        // substacks total 
        let sum = dist + this.substacksLength();
        // validate
        if(!this.substacks.includes(dist)){
            if(sum <= Math.abs(this.stackSelected.height) && dist != 0)
                this.substacks.push(dist);
            else return;
        }
        if(obj.isSelected()){
            let index = this.substacks.indexOf(dist);
            // remove stack from selection
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
