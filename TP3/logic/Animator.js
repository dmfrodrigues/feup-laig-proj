ANIM_TIME = 4.0;

class Animator {
    constructor(orchestrator, gameSequence){
        this.orchestrator = orchestrator;
        this.gameSequence = gameSequence;

        this.active = false;
        this.move = 0;
        this.startTime = 0;
    }

    reset(){
        this.active = true;
        this.orchestrator.gameState.gameboard.resetBoard();
        this.move = 0;
        this.startTime = 0;
    }

    start(){
        this.active = true;
        this.orchestrator.gameState.gameboard.resetBoard();
        this.startTime = 0;
    }

    async update(time){
        if(time - this.startTime >= ANIM_TIME){
            if(this.gameSequence.gameSequence.length <= this.move){
                this.active = false;
                document.getElementById('restart-button').className = "button";
                document.getElementById('restart-button').disabled = false;
            }
            else{
                this.startTime = time;
                let move = this.gameSequence.gameSequence[this.move];
                let originCell =  move.originCell;
                let newPieceCell =  move.newPieceCell;
                await this.orchestrator.gameState.gameboard.move(originCell, move.substacks, move.direction, newPieceCell, move.turn);
                this.move++;
            }
        } 
    }

    display(){
        this.orchestrator.gameState.gameboard.display();
    }
}
