/**
 * Barrel
 * @constructor
 * @param scene  - Reference to MyScene object
 * @param base   - Radius of base
 * @param middle - Radius of middle
 * @param height - Height of barrel
 * @param slices - Number of slices
 * @param stacks - Number of stacks
 */
class Barrel extends CGFobject {
	constructor(scene, base, middle, height, slices, stacks) {
        super(scene);
        this.scene  = scene;
        this.base   = base;
        this.middle = middle;
        this.height = height;
        this.slices = slices;
        this.stacks = stacks;
        this.initBuffers();
    }
	initBuffers() {
    }
    display(){
    }
}
