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

    manageUndo(){
        // TODO
    }
}