/**
 * Vertex
 * @constructor
 * @param scene - Reference to MyScene object
 * @param id - Id of vertex
 * @param x - X-position of vertex
 * @param y - Y-position of vertex
 * @param z - Z-position of vertex
 */
class Vertex extends CGFobject {
    constructor(scene, id, x, y, z) {
        super(scene);
        this.id = id;
        this.x = x;
        this.y = y;
        this.z = z;
        this.M = mat4.create();
        this.M = mat4.translate(this.M, this.M, vec3.fromValues([this.x, this.y, this.z]));
        this.children = [];
    }
    display(){
        this.scene.pushMatrix();
        this.scene.multMatrix(this.M);
        for(let child of this.children){
            child.draw();
        }
        this.scene.popMatrix();
    }
}
