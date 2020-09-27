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
        let theta = (2 * Math.PI) / this.slices;

        for (let h = 0; h <= this.stacks; h++) {

            for (let face = this.slices - 1; face >= 0; face--) {
                let x = Math.cos(theta * face) * (this.bottomRadius - h * (this.bottomRadius - this.topRadius) / this.stacks);
                let y = Math.sin(theta * face) * (this.bottomRadius - h * (this.bottomRadius - this.topRadius) / this.stacks);
                let z = h * this.height / this.stacks;

                this.vertices.push(x, y, z);

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

                let Nx = Math.cos(theta*face);
                let Ny = Math.sin(theta*face);
                let Nz = (this.bottomRadius-this.topRadius)/this.height;
                let R = Math.sqrt(Nx*Nx + Ny*Ny + Nz*Nz);
                this.normals.push(Nx/R, Ny/R, Nz/R);
                
                this.texCoords.push(face / this.slices, h / this.stacks);
            }

        }

        // top cover
        
        this.vertices.push(0, 0, this.height);
        this.normals.push(0, 0, 1);
        this.texCoords.push(0, 1);

        let idx = this.vertices.length/3;
        for(let i=0; i < this.slices; i++){
            this.vertices.push(Math.cos(theta * i) * this.topRadius, Math.sin(theta * i) * this.topRadius, this.height);
            this.normals.push(0, 0, 1);
            this.texCoords.push(0, 1);
        }
        
        for (let i = 0; i < this.slices; i++) {
            if (i < this.slices - 1)
                this.indices.push(idx-1, idx + i, idx + i + 1);
            else
                this.indices.push(idx-1, idx + i, idx);
        }
        
        // bottom cover
        this.vertices.push(0, 0, 0);
        this.normals.push(0, 0, -1);
        this.texCoords.push(0, 1);

        idx = this.vertices.length/3;
        for(let i=0; i < this.slices; i++){
            this.vertices.push(Math.cos(theta * i) * this.bottomRadius, Math.sin(theta * i) * this.bottomRadius, 0);
            this.normals.push(0, 0, -1);
            this.texCoords.push(0, 1);
        }
        
        for (let i = 0; i < this.slices; i++) {
            if (i < this.slices - 1)
                this.indices.push(idx + i + 1, idx + i, idx - 1);
            else
                this.indices.push(idx, idx + i, idx - 1);
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

