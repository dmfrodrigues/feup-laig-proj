/**
 * Plane
 * @constructor
 * @param scene - Reference to MyScene object
 * @param npartsU - 
 * @param npartsV - 
 */
class Plane extends CGFobject {
	constructor(scene, npartsU, npartsV) {
        super(scene);
        this.npartsU = npartsU;
        this.npartsV = npartsV;
        this.scene   = scene;
        this.initBuffers();
    }
	initBuffers() {
        // TODO
        this.controlPoints = [];
        this.nurbsSurface  = new CGFnurbsSurface(0, 0, this.controlPoints);
        this.nurbsObject   = new CGFnurbsObject(this.scene, this.npartsU, this.npartsV, this.nurbsSurface);

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}
}
