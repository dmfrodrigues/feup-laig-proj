/**
 * MyTorus
 * @constructor
 * @param scene  		- Reference to MyScene object
 * @param innerRadius 	- Inner radius, torus thickness
 * @param outerRadius 	- Outer radius around z axis
 * @param slices 		- Number of slices around inner radius
 * @param loops 		- Number of loops around the circular axis
 */
class MyTorus extends ObjectAmp {
	constructor(scene, innerRadius, outerRadius, slices, loops) {
		super(scene);
		this.innerRadius = innerRadius;
		this.outerRadius = outerRadius;
		this.slices      = slices;
		this.loops       = loops;

		this.initBuffers();
	}
	
	initBuffers() {
		let r = this.innerRadius;
		let R = this.outerRadius;

		// Vertices, texCoordsOriginal and normals
		this.vertices  = [];
		this.texCoordsOriginal = [];
		this.normals   = [];

		for(let i = 0; i <= this.loops; ++i){
			let theta = 2.0*Math.PI*i/this.loops; // outer

			let s = i/this.loops;

			for(let j = 0; j <= this.slices; ++j){
				let phi = 2.0*Math.PI*j/this.slices; //inner
				
				let x = r*Math.cos(theta)*Math.cos(phi) + R*Math.cos(theta);
				let y = r*Math.sin(theta)*Math.cos(phi) + R*Math.sin(theta);
				let z = -r*Math.sin(phi);
				this.vertices.push(x, y, z);

				let t = j/this.slices;
				this.texCoordsOriginal.push(s, t);

				let Nx = -Math.cos(phi)*( r*Math.cos(phi)*Math.cos(theta) + R*Math.cos(theta));
				let Ny =  Math.cos(phi)*(-r*Math.cos(phi)*Math.sin(theta) - R*Math.sin(theta));
				let Nz = -Math.sin(theta)*Math.sin(phi)*(-r*Math.sin(theta)*Math.cos(phi) - R*Math.sin(theta))
						 +Math.cos(theta)*Math.sin(phi)*( r*Math.cos(theta)*Math.cos(phi) + R*Math.cos(theta));
				let Nr = Math.sqrt(Nx*Nx + Ny*Ny + Nz*Nz);

				this.normals.push(-Nx/Nr, -Ny/Nr, -Nz/Nr);
			}
		}

        this.updateTexCoords(this.texCoordsOriginal);

		// Indices
		this.indices = [];

		for(let loop = 0; loop < this.loops; ++loop){
			let base1 = (this.slices+1) * loop;
			let base2 = (this.slices+1) * (loop+1);
			for(let i = base1, j = base1 + 1, k = base2, l = base2+1; j < base2; ++i, ++j, ++k, ++l){
				this.indices.push(i, l, k);
				this.indices.push(i, j, l);
			}
		}

		// Others		
		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}
}
