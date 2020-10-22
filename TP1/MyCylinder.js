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

        for (let stack = 0; stack <= this.stacks; stack++) {

            for (let slice = 0; slice <= this.slices; ++slice) {
                let theta = 2*Math.PI*slice / this.slices;

                let x = Math.cos(theta) * (this.bottomRadius - stack * (this.bottomRadius - this.topRadius) / this.stacks);
                let y = Math.sin(theta) * (this.bottomRadius - stack * (this.bottomRadius - this.topRadius) / this.stacks);
                let z = stack * this.height / this.stacks;

                this.vertices.push(x, y, z);

                let Nx = Math.cos(theta);
                let Ny = Math.sin(theta);
                let Nz = (this.bottomRadius-this.topRadius)/this.height;
                let R = Math.sqrt(Nx*Nx + Ny*Ny + Nz*Nz);
                this.normals.push(Nx/R, Ny/R, Nz/R);
                
                this.texCoords.push(
                    slice / this.slices,
                    1.0 - 0.5*stack / this.stacks
                );
            }

        }

        for(let stack = 0; stack < this.stacks; stack++){
            for(let slice = 0; slice < this.slices; ++slice){
                let i = (this.slices+1)*stack + slice;
                let j = i+1;
                let k = (this.slices+1)*(stack+1) + slice;
                let l = k+1;
                this.indices.push(i, l, k);
                this.indices.push(i, j, l);
            }
        }

        // top cover
        
        this.vertices.push(0, 0, this.height);
        this.normals.push(0, 0, 1);
        this.texCoords.push(0.5/Math.PI, 0.25);

        let top_center_index = this.vertices.length/3 - 1;
        for(let slice = 0; slice <= this.slices; slice++){
            let theta = 2*Math.PI*slice/this.slices;
            this.vertices.push(
                Math.cos(theta) * this.topRadius,
                Math.sin(theta) * this.topRadius,
                this.height
            );
            this.normals.push(0, 0, 1);
            this.texCoords.push(
                0.5/Math.PI + (0.5/Math.PI) * Math.cos(theta),
                0.25-0.25*Math.sin(theta)
            );
        }
        
        for (let slice = 0; slice < this.slices; slice++) {
            this.indices.push(
                top_center_index,
                top_center_index + 1 + slice,
                top_center_index + 2 + slice
            );
        }
        
        // bottom cover
        this.vertices.push(0, 0, 0);
        this.normals.push(0, 0, -1);
        this.texCoords.push(1.5/Math.PI, 0.25);

        let bottom_center_index = this.vertices.length/3 - 1;
        for(let slice = 0; slice <= this.slices; slice++){
            let theta = 2*Math.PI*slice/this.slices;
            this.vertices.push(
                Math.cos(theta) * this.bottomRadius,
                Math.sin(theta) * this.bottomRadius,
                0
            );
            this.normals.push(0, 0, -1);
            this.texCoords.push(
                1.5/Math.PI + (0.5/Math.PI) * Math.cos(-theta),
                0.25-0.25*Math.sin(-theta)
            );
        }
        
        for (let slice = 0; slice < this.slices; slice++) {
            this.indices.push(
                bottom_center_index,
                bottom_center_index + 2 + slice,
                bottom_center_index + 1 + slice
            );
        }    

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}

