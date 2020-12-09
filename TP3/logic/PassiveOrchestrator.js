/**
 * PassiveOrchestrator
 * @constructor
 * @param scene  		- Reference to MyScene object
 */
class PassiveOrchestrator extends CGFobject {
	constructor(scene, theme) {
        super(scene);

        this.scene.orchestrator = this;

        this.theme        = new MySceneGraph(theme, this.scene);
    }

    initialize(){
    }

    managePick(_mode, _results){
    }

    update(t){
        this.theme.update(t);
    }

    display(){
        this.theme.display();
    }
}
