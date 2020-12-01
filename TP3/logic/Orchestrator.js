/**
 * Orchestrator
 * @constructor
 * @param scene  		- Reference to MyScene object
 */
class Orchestrator extends CGFobject {
	constructor(scene, theme) {
        super(scene);

        this.scene.orchestrator = this;
        
        // this.gameSequence = new GameSequence();
        // this.animator     = new Animator(this.scene, this, this.gameSequence);
        this.theme        = new MySceneGraph(theme, this.scene);
        this.gameBoard    = new GameBoard(this.scene);
        // this.prolog       = new PrologInterface();
    }

    initialize(){
        this.gameBoard.gameboardSetup = this.theme.gameboard;
        PieceStack.pieceStackView = this.theme.pieces.view;
        PieceStack.pieceStackView.initialize();
    }

    update(t){
        this.theme.update(t);
        // this.animator.update(t);
    }

    display(){
        // ...
        this.theme.display();
        this.gameBoard.display();
        // this.animator.display();
        // ...
    }
}
