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
        // this.gameBoard    = new GameBoard(this.scene);
        this.theme        = new MySceneGraph(theme, this.scene);
        // this.prolog       = new PrologInterface();
    }

    update(t){
        this.theme.update(t);
        // this.animator.update(t);
    }

    display(){
        // ...
        this.theme.display();
        // this.gameBoard.display();
        // this.animator.display();
        // ...
    }
}
