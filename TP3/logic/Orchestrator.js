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

    managePick(mode, results){
        if(mode == false){
            if(results != null && results.length > 0){
                for(let i = 0; i < results.length; i++) {
                    var obj = results[i][0];
                    if(obj){
                        let id = results[i][1];
                        this.onObjectSelected(obj, id);
                    }
                }
                // clear results
                results.splice(0, results.length);
            }
        }
    }

    onObjectSelected(obj, id){
        this.gameBoard.deselectAll();
        obj.select();
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
