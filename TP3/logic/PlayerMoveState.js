/**
 * PlayerMoveState
 * @constructor
 * @param	{CGFscene}	scene	Scene
 */

const State = {
    INITIAL: 0,
    FIRST_SELECTION: 1,
    BUILD_SUBSTACKS: 2,
    COMPLETE_STACKS: 3,
    FINAL: 4
 };

class PlayerMoveState {
    constructor(gameState){
        this.gameState = gameState;
        
        this.moveState = State.INITIAL;
        this.stackSelected = null;
        this.substacks = [];
        this.direction = 0;
        this.newPiece = null;
    }

    initialState(){
        this.moveState = State.INITIAL;
        this.stackSelected = null;
        this.substacks = [];
        this.direction = 0;
        this.newPiece = null;
        this.gameState.gameboard.deselectAll();
    }

    isCellId(id){ return id < 100;}
    isStackId(id){ return id > 100 && id < 200;}
    isSubmitId(id){ return id == 201;}
    isUndoId(id){ return id == 202;}

    substacksLength(){
        let sum = 0;
        for(let i=0;i<this.substacks.length;i++)
            sum += this.substacks[i];
        return sum;
    }

    updateMoveState(obj, id){
        switch (this.moveState) {
            case State.INITIAL:
                if(this.isStackId(id)){
                    this.initialState();
                    this.stackSelected = obj;
                    this.moveState = State.FIRST_SELECTION;
                    obj.select();
                }
                break;
            case State.FIRST_SELECTION:
                if(this.isCellId(id) || this.isStackId(id)){
                    if(this.isStackId(id)) obj = obj.cell;
                    this.direction = this.getDirection(obj, this.stackSelected.cell);
                    let distance = this.distance(this.direction, obj, this.stackSelected.cell);
                    if(this.direction != 0)
                        if(obj.stack == null)
                            this.manageMove(obj);
                        else if(Math.sign(obj.stack.height) ==  Math.sign(this.stackSelected.height)
                        || Math.abs(obj.stack.height) <= distance)
                            this.manageMove(obj);
                    else break;
                    if(this.substacksLength() == Math.abs(this.stackSelected.height))
                        this.moveState = State.COMPLETE_STACKS;
                    else
                        this.moveState = State.BUILD_SUBSTACKS;
                }
                else if(this.isUndoId(id)){
                    this.initialState();
                }
                break;
            case State.BUILD_SUBSTACKS:
                if(this.isCellId(id) || this.isStackId(id)){
                    if(this.isStackId(id)) obj = obj.cell;
                    if(this.getDirection(obj, this.stackSelected.cell) != this.direction){
                        this.initialState();
                        this.gameState.gameboard.deselectAll();
                    }
                    else{
                        let distance = this.distance(this.direction, obj, this.stackSelected.cell);
                        if(obj.stack == null)
                            this.manageMove(obj);
                        else if(Math.sign(obj.stack.height) == Math.sign(this.stackSelected.height)
                        || Math.abs(obj.stack.height) <= distance)
                            this.manageMove(obj);
                        else break;
                        let sum = this.substacksLength();
                        if(sum == Math.abs(this.stackSelected.height)){
                            this.moveState = State.COMPLETE_STACKS;
                        }
                    }
                }
                else if(this.isUndoId(id)){
                    this.initialState();
                }
                break;
            case State.COMPLETE_STACKS:
                if(this.isCellId(id) || this.isStackId(id)){
                    if(this.isStackId(id)) obj = obj.cell;
                    if(this.getDirection(obj, this.stackSelected.cell) == this.direction)
                        this.manageMove(obj);
                }
                else if(this.isSubmitId(id)){
                    // submit substacks
                    this.moveState = State.FINAL;
                }
                else if(this.isUndoId(id)){
                    this.initialState();
                }
                break;
            case State.FINAL:
                if(this.isCellId(id)){
                    // submit new piece and move
                    this.gameState.gameboard.move(this.stackSelected.cell, this.substacks, this.direction, obj);
                    this.gameState.orchestrator.nextTurn();
                    this.initialState();
                }
                else if(this.isUndoId(id)){
                    this.initialState();
                }
                break;
            default:
                break;
        }
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
                if(!(this.moveState == 2 && this.substacks.length == 2))
                    this.moveState--;
            }
            obj.deselect();
        }else{
            obj.select();
        }
        console.log(this.substacks);
    }
}
