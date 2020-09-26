
class Node extends CGFobject {
	constructor(scene, id) {
        super(scene);
        this.scene = scene;
        this.id    = id;
        console.log(this.id);
        this.children = [];
        this.material = null;
    }

    setMaterial(material){
        this.material = material;
    }
    
    addChild(child){
        this.children.push(child);
    }

	display(){
        this.scene.pushMatrix();{

            if(this.material != null) this.material.apply();
            for(let i = 0; i < this.children.length; ++i){
                let child = this.children[i];
                child.display();
            }
        }this.scene.popMatrix();
    }
}
