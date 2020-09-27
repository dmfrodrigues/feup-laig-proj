/**
 * MyCylinder
 * @constructor
 * @param scene - Reference to MyScene object
 * @param bottomRadius - Bottom radius (origin)
 * @param topRadius - Top radius (z positive)
 * @param height - Cylinder height (z axis)
 * @param slices - Number of slices in z axis
 * @param stacks - Number of stacks in height
 */
class MyCylinder extends CGFobject {
    constructor(scene, bottomRadius, topRadius, height, slices, stacks) {
        super(scene);
        this.bottomRadius = bottomRadius;
        this.topRadius = topRadius;
        this.height = height;
        this.slices = slices;
        this.stacks = stacks;

        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        let idx = 0;

        for (let h = 0; h <= this.stacks; h++) {
            let theta = (2 * Math.PI) / this.slices;

            for (let face = this.slices - 1; face >= 0; face--) {
                let x = Math.cos(theta * face) * (this.bottomRadius - h * (this.bottomRadius - this.topRadius) / this.stacks);
                let y = Math.sin(theta * face) * (this.bottomRadius - h * (this.bottomRadius - this.topRadius) / this.stacks);
                let z = h * this.height / this.stacks;

                this.vertices.push(x, y, z);
                idx++;

                if (h < this.stacks) {
                    if (face == this.slices - 1) {
                        this.indices.push(face + h * this.slices, face + this.slices + h * this.slices, face + h * this.slices + 1);
                        this.indices.push(face + h * this.slices, face + h * this.slices + 1, (face + 1) * h);
                    }
                    else {
                        this.indices.push(face + h * this.slices, face + h * this.slices + this.slices + 1, face + 1 + h * this.slices);
                        this.indices.push(face + h * this.slices, face + this.slices + h * this.slices, face + h * this.slices + this.slices + 1);
                    }
                }
                this.normals.push(x, y, 0);
                this.texCoords.push(face / this.slices, h / this.stacks);
            }

            theta += theta;

        }

        // top cover
        this.vertices.push(0, 0, this.height);
        this.normals.push(0, 0, 1);
        for (let i = 0; i < this.slices; i++) {
            if (i < this.slices - 1)
                this.indices.push(idx, idx - i - 1, idx - i - 2);
            else
                this.indices.push(idx, idx - i - 1, idx - 1);
        }
        // bottom cover
        this.vertices.push(0, 0, 0);
        this.normals.push(0, 0, -1);
        for (let i = 0; i < this.slices; i++) {
            if (i < this.slices - 1)
                this.indices.push(i, i + 1, idx + 1);
            else
                this.indices.push(i, 0, idx + 1);
        }
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

	/**
	 * @method updateTexCoords
	 * @param {Array} coords - Array of texture coordinates
	 */
    updateTexCoords(coords) {
        this.texCoords = [...coords];
        this.updateTexCoordsGLBuffers();
    }
}

