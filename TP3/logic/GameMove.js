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
        //console.log(this.newPieceCell.stack, PieceStack.pieceStackView);
        //this.newPieceCell.stack.newPieceAnimation = true;
        //this.scene.graph.nodes[].setAnimation(animation);
        //animate camera
        this.scene.graph.cameraAnimation = true;
        this.scene.graph.cameraAnimStartTime = 0;
    }
}
