/**
 * GameMove
 * @constructor
 * @param	{CGFscene}	scene	Scene the animation belongs to
 */

class GameMove {
    constructor(scene, originCellID, substacks, direction, newPieceCellID, turn, gameboard){
        this.scene = scene;
        this.originCell = originCellID;
        this.substacks = substacks;
        this.direction = direction;
        this.newPieceCell = newPieceCellID;
        this.turn = turn;
        this.gameboard = gameboard.toJSON();
    }

    animate(){
        //animate camera
        this.scene.graph.cameraHandler.startCameraAnimation();
    }
}
