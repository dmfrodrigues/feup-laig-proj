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
        this.scene = scene;
        this.base = base;
        this.middle = middle;
        this.height = height;
        this.slices = slices; this.npartsU = this.slices;
        this.stacks = stacks; this.npartsV = this.stacks;
        this.initBuffers();
    }
    initBuffers() {
        let controlPoints1 = [
            [
                [+this.base  , -this.height / 2,                 0, 1],
                [+this.middle,                0,                 0, 1],
                [+this.base  , +this.height / 2,                 0, 1],
            ],
            [
                [+this.base  , -this.height / 2, -this.base  /0.75, 1],
                [+this.middle,                0, -this.middle/0.75, 1],
                [+this.base  , +this.height / 2, -this.base  /0.75, 1],
            ],
            [
                [-this.base  , -this.height / 2, -this.base  /0.75, 1],
                [-this.middle,                0, -this.middle/0.75, 1],
                [-this.base  , +this.height / 2, -this.base  /0.75, 1],
            ],
            [
                [-this.base  , -this.height / 2,                 0, 1],
                [-this.middle,                0,                 0, 1],
                [-this.base  , +this.height / 2,                 0, 1],
            ],
        ];
        let controlPoints2 = [
            [
                [-this.base  , -this.height / 2,                 0, 1],
                [-this.middle,                0,                 0, 1],
                [-this.base  , +this.height / 2,                 0, 1],
            ],
            [
                [-this.base  , -this.height / 2, +this.base  /0.75, 1],
                [-this.middle,                0, +this.middle/0.75, 1],
                [-this.base  , +this.height / 2, +this.base  /0.75, 1],
            ],
            [
                [+this.base  , -this.height / 2, +this.base  /0.75, 1],
                [+this.middle,                0, +this.middle/0.75, 1],
                [+this.base  , +this.height / 2, +this.base  /0.75, 1],
            ],
            [
                [+this.base  , -this.height / 2,                 0, 1],
                [+this.middle,                0,                 0, 1],
                [+this.base  , +this.height / 2,                 0, 1],
            ],
        ];
        this.degreeU = controlPoints1.length - 1;
        this.degreeV = controlPoints1[0].length - 1;

        let nurbsSurface1 = new CGFnurbsSurface(this.degreeU, this.degreeV, controlPoints1);
        let nurbsSurface2 = new CGFnurbsSurface(this.degreeU, this.degreeV, controlPoints2);

        let npartsU1 = Math.floor(this.npartsU/2);
        let npartsU2 = this.npartsU - npartsU1;

        this.nurbsObject1 = new CGFnurbsObject(this.scene, npartsU1, this.npartsV, nurbsSurface1);
        this.nurbsObject2 = new CGFnurbsObject(this.scene, npartsU2, this.npartsV, nurbsSurface2);
    }
    display() {
        this.nurbsObject1.display();
        this.nurbsObject2.display();
    }
}
