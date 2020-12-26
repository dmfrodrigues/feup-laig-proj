DEGREES_TO_RAD = Math.PI/180;

/**
 * RoomPieceStackView
 * @constructor
 * @param	{CGFscene}	scene	Scene the animation belongs to
 */
class RoomPieceStackView extends PieceStackView {
    constructor(scene){
        super(scene);

        this._redPiece = null;
    }

    initialize(){
        this._redPiece = this.getPieceSetup().obj;
        let redPiece = this._redPiece;
        let scene = this.scene;
        let pieceHeight = this.getPieceSetup().height;
        this._yellowPiece = {
            display: function(){
                scene.pushMatrix();
                scene.translate(0, pieceHeight, 0);
                scene.rotate(180*DEGREES_TO_RAD, 1, 0, 0);
                redPiece.display();
                scene.popMatrix();
            }
        };
    }

    display(pieceStack){
        if(pieceStack.height != 0){
            let M = this.getGameboardSetup().getCellMatrix(
                pieceStack.cell.i,
                pieceStack.cell.j
            );

            this.scene.pushMatrix();{
                this.scene.multMatrix(M);

                let absHeight = Math.abs(pieceStack.height);
                let piece = ((pieceStack.height > 0) ? this._redPiece : this._yellowPiece);

                for(let i = 0; i < absHeight; ++i){
                    piece.display();
                    this.scene.translate(0, this.getPieceSetup().height, 0);
                }
            }this.scene.popMatrix();
        }
    }
}
