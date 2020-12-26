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
        this.selectedMaterial = null;
        this.texture        = null;
        this.animation      = null;
        this.children       = [];
        this.dropbox        = null;
        this.onclick        = null;
        this.enabled = true;
    }
    enable(){
        this.enabled = true;
    }
    disable(){
        this.enabled = false;
    }

    setTransformation(M){
        mat4.copy(this.transformation, M);
    }

    setMaterial(material){
        this.material = material;
    }

    setSelectedMaterial(material){
        this.selectedMaterial = material;
    }

    setTexture(texture){
        this.texture = texture;
    }

    setAnimation(animation){
        this.animation = animation;
    }
    
    addChild(child){
        this.children.push(child);
    }
    resolveChildren(resolver){
        for(let i = 0; i < this.children.length; ++i){
            if(typeof this.children[i] === 'string'){
                this.children[i] = resolver(this.children[i]);
            }
        }
    }

    setDropbox(dropbox){
        this.dropbox = dropbox;
    }

	display(){
        if(!this.enabled) return;
        this.scene.pushMatrix();
        this.scene.pushAppearance();
        {
            if(this.scene.isSelectEnabled() && this.selectedMaterial != null)
                this.scene.setAppearance(this.selectedMaterial, this.texture);
            else
                this.scene.setAppearance(this.material        , this.texture);
            
            this.scene.multMatrix(this.transformation);

            if(this.animation != null)
                this.animation.apply();

            if(this.onclick !== null) this.scene.registerForPick(1, this);
            if(this.animation == null || this.animation.isVisible()){
                for(let child of this.children){
                    child.display();
                }
            }
            if(this.onclick !== null) this.scene.clearPickRegistration();
        }
        this.scene.popAppearance();
        this.scene.popMatrix();
    }
}
