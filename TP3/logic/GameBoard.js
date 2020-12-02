/**
 * GameBoard
 * @constructor
 * @param scene  		- Reference to MyScene object
 */
class GameBoard extends CGFobject {
    constructor(scene) {
        super(scene);

        this._gameboardSetup = null;

        this._cells = new Array(9);
        for (let i = 0; i <= 8; ++i) {
            this._cells[i] = [];
            for (let j = 0; j <= 8; ++j) {
                if (i - 4 <= j && j <= 4 + i) this._cells[i].push(new BoardCell(this.scene, this, i, j));
                else this._cells[i].push(null);
            }
        }

        this.getCell(0, 1).stack = new PieceStack(this.scene, +6);
        this.getCell(7, 3).stack = new PieceStack(this.scene, +6);
        this.getCell(5, 8).stack = new PieceStack(this.scene, +6);

        this.getCell(1, 5).stack = new PieceStack(this.scene, -6);
        this.getCell(3, 0).stack = new PieceStack(this.scene, -6);
        this.getCell(8, 7).stack = new PieceStack(this.scene, -6);
    }

    set gameboardSetup(setup) { this._gameboardSetup = setup; }
    get gameboardSetup() { return this._gameboardSetup; }

    getCell(i, j) {
        return this._cells[i][j];
    }

    deselectAll() {
        for (let i = 0; i <= 8; ++i) {
            for (let j = Math.max(i - 4, 0); j <= Math.min(4 + i, 8); ++j) {
                this.getCell(i, j).deselectAll();
            }
        }
    }

    move(originCell, substacks, direction, newPieceCell) {
        let gameMove = new GameMove(this.scene, originCell, substacks, direction, newPieceCell, this);
        this.scene.orchestrator.gameSequence.addGameMove(gameMove);

        direction;
        for (let k = 0; k < substacks.length; k++) {
            let substack_i;
            let substack_j;
            switch (direction) {
                case 1:
                    substack_i = 0;
                    substack_j = originCell.j + substacks[k];
                    break;
                case 2:
                    substack_i = originCell.i - substacks[k];
                    substack_j = originCell.j + substacks[k];
                    break;
                case 3:
                    substack_i = originCell.i - substacks[k];
                    substack_j = originCell.j - substacks[k];
                    break;
                case 4:
                    substack_i = originCell.i + 0;
                    substack_j = originCell.j - substacks[k];
                    break;
                case 5:
                    substack_i = originCell.i + substacks[k];
                    substack_j = originCell.j - substacks[k];
                    break;
                case 6:
                    substack_i = originCell.i + substacks[k];
                    substack_j = originCell.j + substacks[k];
                    break;
                default:
                    break;
            }
            this.getCell(substack_i, substack_j).stack = new PieceStack(this.scene, substacks[k]);
        }

        originCell.stack = null;
        
        newPieceCell.stack = new PieceStack(this.scene, +1);

        // gameMove.animate();
    }

    display() {
        this.scene.pushMatrix();
        this.scene.multMatrix(this.gameboardSetup.transformation);

        this.gameboardSetup.obj.display();
        for (let i = 0; i <= 8; ++i) {
            for (let j = Math.max(i - 4, 0); j <= Math.min(4 + i, 8); ++j) {
                this.getCell(i, j).display();
            }
        }

        this.scene.popMatrix();
    }
}
