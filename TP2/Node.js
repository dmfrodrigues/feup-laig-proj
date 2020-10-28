/**
 * Node
 * @constructor
 * @param scene - Reference to MyScene object
 * @param id    - Node id
 */
class Node extends CGFobject {
	constructor(scene, id) {
        super(scene);
        this.scene = scene;
        this.id    = id;
        this.transformation = mat4.create();
        this.material       = null;
        this.texture        = null;
        this.children       = [];
    }

    setTransformation(M){
        mat4.copy(this.transformation, M);
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
        this.scene.pushMatrix();
        this.scene.pushAppearance();
        {
            this.scene.setAppearance(this.material, this.texture);

            this.scene.multMatrix(this.transformation);

            for(let i = 0; i < this.children.length; ++i){
                let child = this.children[i];
                child.display();
            }
        }
        this.scene.popAppearance();
        this.scene.popMatrix();
    }
}
