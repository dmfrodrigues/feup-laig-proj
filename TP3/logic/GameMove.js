/**
 * GameMove
 * @constructor
 * @param	{CGFscene}	scene	Scene the animation belongs to
 */

class GameMove {
    constructor(scene, originCell, substacks, direction, newPieceCell, gameboard){
        this.scene = scene;
        this.originCell = originCell;
        this.substacks = substacks;
        this.direction = direction;
        this.newPieceCell = newPieceCell;
        this.gameboard = gameboard;
    }

    animate(){
        // TODO
    }
}
