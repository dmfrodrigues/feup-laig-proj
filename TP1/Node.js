
class Node extends CGFobject {
	constructor(scene, id) {
        super(scene);
        this.scene = scene;
        this.id    = id;
        this.children = [];
    }
    
    addChild(child){
        this.children.push(child);
    }

	display(){
        this.scene.pushMatrix();{
            for(let child in this.children){
                //console.log(id);
                console.log(child);
                //child.display();
            }
        }this.scene.popMatrix();
    }
}
