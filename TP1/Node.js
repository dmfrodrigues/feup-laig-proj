
class Node extends CGFobject {
	constructor(scene, id) {
        super(scene);
        this.scene = scene;
        this.id    = id;
        this.children = [];
        this.material = null;
        this.texture  = null;
    }

    setMaterial(material){
        this.material = material;
    }

    setTexture(texture){
        this.texture = texture;
    }
    
    addChild(child){
        this.children.push(child);
    }

	display(){
        this.scene.pushMatrix();{

            if(this.texture  != null) this.material.setTexture(this.texture);
            if(this.material != null) this.material.apply();

            for(let i = 0; i < this.children.length; ++i){
                let child = this.children[i];
                child.display();
            }

            if(this.texture  != null) this.material.setTexture(null);
            
        }this.scene.popMatrix();
    }
}
