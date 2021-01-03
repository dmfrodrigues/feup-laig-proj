class Animator {
    constructor(orchestrator, gameSequence){
        this.orchestrator = orchestrator;
        this.gameSequence = gameSequence;

        this.active = false;
        this.move = 0;
        this.inMove = false;
    }

    reset(){
        this.active = true;
        this.orchestrator.gameState.gameboard.resetBoard();
        this.move = 0;
    }

    start(){
        this.active = true;
        this.orchestrator.gameState.gameboard.resetBoard();
    }

    async nextMove(){
        this.inMove = true;
        let move = this.gameSequence.gameSequence[this.move];
        let originCell =  move.originCell;
        let newPieceCell =  move.newPieceCell;
        await this.orchestrator.gameState.gameboard.move(originCell, move.substacks, move.direction, newPieceCell, move.turn);
        this.inMove = false;
        this.move++;
    }

    async update(time){
        if(this.gameSequence.gameSequence.length <= this.move){
            this.active = false;
            document.getElementById('restart-button').className = "button";
            document.getElementById('restart-button').disabled = false;
        }
        else{
            if(!this.inMove)
                await this.nextMove();
        }
    }

    display(){
        this.orchestrator.gameState.gameboard.display();
    }
}
