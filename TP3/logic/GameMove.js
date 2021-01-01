/**
 * GameMove
 * @constructor
 * @param	{CGFscene}	scene	Scene the animation belongs to
 */

class GameMove {
    constructor(scene, originCell, substacks, direction, newPieceCell, turn, gameboard){
        this.scene = scene;
        this.originCell = originCell;
        this.substacks = substacks;
        this.direction = direction;
        this.newPieceCell = newPieceCell;
        this.turn = turn;
        this.gameboard = gameboard; // array
    }

    animateSubstacks(){

    }

    animateNewPiece(){

    }

    animate(){
        //animate camera
        this.scene.graph.cameraHandler.startCameraAnimation();
    }
}
