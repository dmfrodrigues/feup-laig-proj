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
    constructor(scene, gameState){
        this.gameState = gameState;
        this.scene = scene;
        this.moveState = State.INITIAL;
        this.stackSelected = null;
        this.substacks = [];
        this.direction = 0;
        this.newPiece = null;
    }

    initialState(){
        this.moveState = State.INITIAL;
        this.stackSign = 0;
        this.stackSelected = null;
        this.substacks = [];
        this.direction = 0;
        this.newPiece = null;
        this.initialGameboard = this.gameState.gameboard.toJSON();
        this.gameState.gameboard.deselectAll();
        this.gameState.feedbackText = "select substacks";
        this.gameState.gameboard.setTurn(this.gameState.turn);
    }

    resetSubstacks(){
        for(let i = 0; i <= 8; ++i){
            for(let j = 0; j <= 8; ++j){
                if(i-4 <= j && j <= 4+i) {
                    if(this.initialGameboard[i][j] != 0)
                        this.gameState.gameboard.getCell(i,j).stack = new PieceStack(this.scene, this.initialGameboard[i][j]);
                    else this.gameState.gameboard.getCell(i,j).stack = null;
                }
            }
        }
    }

    isCellId(obj){ return obj.id < 100;}
    isStackId(obj){ return obj.id > 100 && obj.id < 200;}
    isSubmitId(obj){ return obj.idObj == 'submit';}
    isCancelId(obj){ return obj.idObj == 'cancel';}

    substacksLength(){
        let sum = 0;
        for(let i=0;i<this.substacks.length;i++)
            sum += this.substacks[i];
        return sum;
    }

    updateMoveState(obj){
        switch (this.moveState) {
            case State.INITIAL:
                if(this.isStackId(obj)){
                    this.initialState();
                    this.stackSelected = obj;
                    this.stackSign = Math.sign(obj.height);
                    this.moveState = State.FIRST_SELECTION;
                    obj.select();
                }
                break;
            case State.FIRST_SELECTION:
                if(this.isCellId(obj) || this.isStackId(obj)){
                    if(this.isStackId(obj)) obj = obj.cell;
                    this.direction = this.getDirection(obj, this.stackSelected.cell);
                    let distance = this.distance(this.direction, obj, this.stackSelected.cell);
                    if(this.direction != 0){
                        if(obj.stack == null)
                            this.manageMove(obj);
                        else if(Math.sign(obj.stack.height) ==  Math.sign(this.stackSelected.height)
                        || Math.abs(obj.stack.height) <= distance)
                            this.manageMove(obj);}
                    else break;
                    if(this.substacksLength() == Math.abs(this.stackSelected.height))
                        this.moveState = State.COMPLETE_STACKS;
                    else
                        this.moveState = State.BUILD_SUBSTACKS;
                }
                else if(this.isCancelId(obj)){
                    this.initialState();
                }
                break;
            case State.BUILD_SUBSTACKS:
                if(this.isCellId(obj) || this.isStackId(obj)){
                    if(this.isStackId(obj)) obj = obj.cell;
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
                            this.gameState.feedbackText = "submit substacks";
                        }
                    }
                }
                else if(this.isCancelId(obj)){
                    this.initialState();
                }
                break;
            case State.COMPLETE_STACKS:
                if(this.isCellId(obj) || this.isStackId(obj)){
                    if(this.isStackId(obj)) obj = obj.cell;
                    if(this.getDirection(obj, this.stackSelected.cell) == this.direction)
                        this.manageMove(obj);
                }
                else if(this.isSubmitId(obj)){
                    // submit substacks
                    if(this.gameState.gameboard.moveSubstacks(this.stackSelected.cell, this.substacks, this.direction));
                    {
                        this.moveState = State.FINAL;
                        this.gameState.feedbackText = "select new piece";
                        this.gameState.gameboard.setTurn(this.gameState.turn);
                    }
                }
                else if(this.isCancelId(obj)){
                    this.resetSubstacks();
                    this.initialState();
                }
                break;
            case State.FINAL:
                if(this.isCellId(obj) && obj.stack == null){ 
                    // submit new piece and move
                    if(this.gameState.gameboard.moveNewPiece(obj, this.stackSign)){
                        let gameMove = new GameMove(this.scene, this.stackSelected.cell.id, this.substacks,
                            this.direction, obj.id, this.gameState.turn, this.initialGameboard
                        );
                        this.scene.orchestrator.gameSequence.addGameMove(gameMove);
                        this.initialState();
                        this.gameState.orchestrator.nextTurn();
                        this.scene.graph.cameraHandler.startCameraAnimation();
                    }
                }
                else if(this.isCancelId(obj)){
                    this.resetSubstacks();
                    this.initialState();
                }
                break;
            default:
                break;
        }
    }
    
    getDirection(cell1, cell2){
        if(cell1.i == cell2.i && cell1.j < cell2.j)      return 4;
        else if(cell1.i < cell2.i && cell1.j == cell2.j) return 2;
        else if(cell1.i < cell2.i && cell1.j < cell2.j
            && (cell1.i - cell2.i == cell1.j - cell2.j)) return 3;
        else if(cell1.i == cell2.i && cell1.j > cell2.j) return 1;
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
    }
}
