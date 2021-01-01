/**
 * GameMove
 * @constructor
 * @param	{CGFscene}	scene	Scene the animation belongs to
 */

class GameMove {
    constructor(scene, originCell, substacks, direction, newPieceCell, turn, gameboard){
        this.scene = scene;
        this.originCell = originCell;
        this.substacks = JSON.parse(JSON.stringify(substacks));
        this.direction = direction;
        this.newPieceCell = newPieceCell;
        this.turn = turn;
        this.gameboard = JSON.parse(JSON.stringify(gameboard)); // array
    }

    animateSubstacks(){

    }

    animateNewPiece(){

    }

    toJSON(){
        return {
            player: this.turn,
            pos: [this.originCell.i, this.originCell.j],
            substacks: this.substacks,
            dir: this.direction,
            newpos: [this.newPieceCell.i, this.newPieceCell.j]
        };
    }

    animate(){
        //animate camera
        this.scene.graph.cameraHandler.startCameraAnimation();
    }
}
