/**
 * PieceStackView
 * @constructor
 * @param	{CGFscene}	scene	Scene the animation belongs to
 */

class PieceStackView {
    constructor(scene){
        this._scene = scene;
        
        this._gameboardSetup = null;
        this._pieceSetup = null;

        if(this.constructor === PieceStackView){
            throw new TypeError('Abstract class "PieceStackView" cannot be instantiated directly');
        }
        if(this.display === undefined){
            throw new TypeError('Extending class does not implement PieceStackView.display(PieceStack)');
        }
    }

    get scene(){ return this._scene; }

    setGameboardSetup(setup){ this._gameboardSetup = setup; }
    getGameboardSetup(){ return this._gameboardSetup; }
    setPieceSetup(piece){ this._pieceSetup = piece; }
    getPieceSetup(){ return this._pieceSetup; }
}
