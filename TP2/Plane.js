/**
 * Plane
 * @constructor
 * @param scene   - Reference to MyScene object
 * @param npartsU - number of sections in U direction
 * @param npartsV - number of sections in V direction
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
        this.controlPoints = [
            [ 0.5, 0.0,  0.5],
            [ 0.5, 0.0, -0.5],
            [-0.5, 0.0,  0.5],
            [-0.5, 0.0, -0.5],
        ];
        this.nurbsSurface  = new CGFnurbsSurface(0, 0, this.controlPoints);
        this.nurbsObject   = new CGFnurbsObject(this.scene, this.npartsU, this.npartsV, this.nurbsSurface);

    }
    display(){
        this.nurbsObject.display();
    }
}
