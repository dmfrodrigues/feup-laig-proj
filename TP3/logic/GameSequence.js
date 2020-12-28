/**
 * GameSequence
 */

class GameSequence {
    constructor(){
        this.gameSequence = [];
    }

    addGameMove(gameMove){
        this.gameSequence.push(gameMove);
    }

    manageUndo(gameState){
        let move;
        if(this.gameSequence.length == 0) return;
        else if(this.gameSequence.length < 2) {
            gameState._scene.graph.startCameraAnimation();
            move = this.gameSequence.pop();
        }
        else { 
            this.gameSequence.pop(); move = this.gameSequence.pop();
            gameState.round--;
        }
        
        for(let i = 0; i <= 8; ++i){
            for(let j = 0; j <= 8; ++j){
                if(i-4 <= j && j <= 4+i) {
                    if(move.gameboard[i][j] != 0)
                        gameState._gameboard.getCell(i,j).stack = new PieceStack(gameState._scene, move.gameboard[i][j]);
                    else gameState._gameboard.getCell(i,j).stack = null;
                }
            }
        }
        gameState.turn = move.turn;
    }
}