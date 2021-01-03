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
        this.gameboard = JSON.parse(JSON.stringify(gameboard));
    }

    toJSON(){
        let substacks = this.substacks;
        if(this.turn === 2) substacks = substacks.map((x) => -x);
        return {
            player: this.turn,
            pos: [this.originCell.i, this.originCell.j],
            substacks: substacks,
            dir: this.direction,
            newpos: [this.newPieceCell.i, this.newPieceCell.j]
        };
    }

    async animate(){
        await this.scene.graph.cameraHandler.startCameraAnimation();
    }
}
