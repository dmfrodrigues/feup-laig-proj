DEG_TO_RAD = Math.PI/180.0;

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
    constructor(scene, base, middle, height, slices, stacks, angle = 45) {
        super(scene);
        this.scene = scene;
        this.base = base;
        this.middle = middle;
        this.height = height;
        this.slices = slices; this.npartsU = this.slices;
        this.stacks = stacks; this.npartsV = this.stacks;
        this.angle = angle;
        this.initBuffers();
    }
    initBuffers() {
        let r = this.base;
        let R = this.middle;
        let H = (R-r)*4.0/3.0;
        let alpha = this.angle*DEG_TO_RAD;
        let L = this.height;
        let y1 =   H/Math.tan(alpha);
        let y2 = L-H/Math.tan(alpha);
        let controlPoints1 = [
            [
                [-r  ,           0,  0, 1],
                [-r-H,           0, y1, 1],
                [-r-H,           0, y2, 1],
                [-r  ,           0,  L, 1],
            ],
            [
                [-r  , (-r  )/0.75,  0, 1],
                [-r-H, (-r-H)/0.75, y1, 1],
                [-r-H, (-r-H)/0.75, y2, 1],
                [-r  , (-r  )/0.75,  L, 1],
            ],
            [
                [+r  , (-r  )/0.75,  0, 1],
                [+r+H, (-r-H)/0.75, y1, 1],
                [+r+H, (-r-H)/0.75, y2, 1],
                [+r  , (-r  )/0.75,  L, 1],
            ],
            [
                [+r  ,           0,  0, 1],
                [+r+H,           0, y1, 1],
                [+r+H,           0, y2, 1],
                [+r  ,           0,  L, 1],
            ],
        ];
        let controlPoints2 = [
            [
                [+r  ,           0,  0, 1],
                [+r+H,           0, y1, 1],
                [+r+H,           0, y2, 1],
                [+r  ,           0,  L, 1],
            ],
            [
                [+r  , (+r  )/0.75,  0, 1],
                [+r+H, (+r+H)/0.75, y1, 1],
                [+r+H, (+r+H)/0.75, y2, 1],
                [+r  , (+r  )/0.75,  L, 1],
            ],
            [
                [-r  , (+r  )/0.75,  0, 1],
                [-r-H, (+r+H)/0.75, y1, 1],
                [-r-H, (+r+H)/0.75, y2, 1],
                [-r  , (+r  )/0.75,  L, 1],
            ],
            [
                [-r  ,           0,  0, 1],
                [-r-H,           0, y1, 1],
                [-r-H,           0, y2, 1],
                [-r  ,           0,  L, 1],
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
